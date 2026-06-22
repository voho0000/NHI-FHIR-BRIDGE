/**
 * Procedure mapper.
 *
 * Port of `backend/app/mapper/procedure.py`. Returns null for list-page
 * rows lacking note/body_site — the alternative is the SMART app showing
 * 25 "procedures" called "Mycobacteria culture" / "Vaginal ultrasound"
 * / etc. which are clinically wrong.
 */

import { normalizeIcd10Cm } from "./condition";
import { bilingualCoding, stableId } from "./helpers";
import * as systems from "./systems";

function mapSystem(systemHint: unknown): string {
  const s = typeof systemHint === "string" ? systemHint.toLowerCase() : "";
  if (s.includes("snomed")) return systems.SNOMED_CT;
  if (s.includes("nhi")) return systems.NHI_MEDICAL_ORDER_CODE;
  if (s.includes("icd")) return systems.ICD_10_PCS;
  return systems.HIS_LOCAL_PROCEDURE_CODE;
}

export function mapProcedure(
  raw: Record<string, any>,
  patientId: string,
): Record<string, any> | null {
  const note = ((raw.note as string) ?? "").trim();
  const bodySite = ((raw.body_site as string) ?? "").trim();
  const code = raw.code;
  // Drop rows with no note, no body site AND no real procedure code — those
  // are NHI list-page stubs (e.g. "Vaginal ultrasound" carrying only a
  // display). A row with a real billed/classification code IS a genuine
  // procedure even without a reason note (e.g. 玻璃體內注射 / 86201C ships no
  // icd9cm reason), so a bare code keeps it.
  if (!note && !bodySite && !code) return null;

  const display = raw.display ?? "Unknown Procedure";
  // v0.8.0 bilingual: prefer 繁中 in code.text (patient-facing) while
  // coding[0].display stays as the technical English (canonical for the
  // PCS / NHI 醫令碼 system). Falls back to English when NHI ships
  // English-only for a particular procedure code.
  const displayZh = ((raw.display_zh ?? "") as string).trim() || display;
  const system = mapSystem(raw.system ?? "");

  // ICD-10-PCS codings get an ADDITIVE zh-TW translation on their English
  // display (FHIR `_display` translation extension) — purely non-breaking:
  // `display` stays English, the 中文 rides in the extension, so third-party
  // apps that read `coding.display` are unaffected. NO display language is
  // flipped. The NHI 醫令 coding keeps its English display unchanged (its 中文
  // is already in `code.text`); only PCS (whose 中文 is otherwise nowhere in
  // the resource) gets the extension.
  const primary =
    system === systems.ICD_10_PCS
      ? bilingualCoding(system, code || display, display, {
          lang: "zh-TW",
          content: (raw.display_zh as string) ?? "",
        })
      : { system, code: code || display, display };
  const coding: Record<string, any>[] = [primary];
  // Secondary coding: the ICD-10-PCS op_CODE classification riding alongside
  // the primary NHI 醫令 order code (same procedure, two code systems).
  const code2 = raw.code2;
  if (code2) {
    coding.push(
      bilingualCoding(mapSystem(raw.system2 ?? ""), code2, (raw.display2 as string) ?? code2, {
        lang: "zh-TW",
        content: (raw.display2_zh as string) ?? "",
      }),
    );
  }

  // Hospital + primary diagnosis (ICD) are part of the id (2026-06-23): two
  // procedures under the same NHI code on the same day belong to DIFFERENT
  // visits when the hospital OR the 診斷 differs — without them they collapsed
  // (same class of bug as the old Encounter (date,class,hospital) over-merge).
  const hospital = ((raw.hospital ?? "") as string).trim();
  const reasonKey = raw.reason_code ? normalizeIcd10Cm(String(raw.reason_code)) : "";
  const resource: Record<string, any> = {
    resourceType: "Procedure",
    id: stableId(patientId, code || display, raw.date ?? "", hospital, reasonKey),
    meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
    status: raw.status ?? "completed",
    subject: { reference: `Patient/${patientId}` },
    code: { coding, text: displayZh },
  };

  if (raw.date) {
    resource.performedDateTime = `${raw.date}T00:00:00+08:00`;
  }
  if (bodySite) {
    resource.bodySite = [{ text: bodySite }];
  }
  if (note) {
    resource.note = [{ text: note }];
  }

  // Reason (diagnosis) — structured + bilingual, mirroring Encounter.reasonCode
  // exactly: coding ICD-10-CM (dotted form) + English display, 繁中 in .text.
  // Replaces the older English-only "Reason: …" note so apps can switch zh/en.
  const reasonEn = ((raw.reason ?? "") as string).trim();
  const reasonZh = ((raw.reason_zh ?? "") as string).trim();
  const reasonCodeRaw = ((raw.reason_code ?? "") as string).trim();
  if (reasonEn || reasonZh || reasonCodeRaw) {
    const rc: Record<string, any> = {};
    if (reasonCodeRaw) {
      const displayPlain = reasonEn.replace(new RegExp(`^${reasonCodeRaw}\\s+`), "").trim();
      const cd: Record<string, any> = {
        system: "http://hl7.org/fhir/sid/icd-10-cm",
        code: normalizeIcd10Cm(reasonCodeRaw),
      };
      const disp = displayPlain || reasonEn || reasonZh;
      if (disp) cd.display = disp;
      rc.coding = [cd];
    }
    const txt = reasonZh || reasonEn;
    if (txt) rc.text = txt;
    if (rc.coding || rc.text) resource.reasonCode = [rc];
  }

  // performer.actor — display-only Reference (no Practitioner / Organization
  // resource minted). Mirrors the same shape as DiagnosticReport.performer
  // and MedicationRequest.requester. Important for link.ts: the encounter
  // linker matches resources to Encounters by performer[].display (hospital)
  // + date — without this field a procedure done at the same hospital +
  // day as an Encounter doesn't get its `encounter` reference back-filled,
  // so SMART apps showing "procedures grouped by visit" would leave it
  // un-grouped.
  if (hospital) {
    resource.performer = [{ actor: { display: hospital } }];
  }

  // partOf — a 次處置 (secondary surgery) points at the primary surgery of the
  // same admission so SMART apps group sub-procedures under the main one. The
  // primary's id is its content hash (same scheme as this resource's id), so we
  // recompute it from the carried `part_of_code` + date. dedupProcedures
  // re-points this if the primary was merged into a richer 手術-list row.
  const partOfCode = ((raw.part_of_code ?? "") as string).trim();
  if (partOfCode) {
    resource.partOf = [
      // Recompute the primary's id with the SAME extra key parts — a 次處置
      // shares its primary's hospital + 診斷 within one admission.
      {
        reference: `Procedure/${stableId(patientId, partOfCode, raw.date ?? "", hospital, reasonKey)}`,
      },
    ];
  }

  // Transient encounter-class hint (IMP for inpatient surgeries) — the linker
  // reads it to attach the procedure to the 住院 Encounter even on an admission
  // day that also has a gateway 門診/急診, then strips it. Mirrors the med path.
  const encounterClass = ((raw.encounter_class ?? "") as string).trim();
  if (encounterClass) resource.__nhiVisitClass = encounterClass;

  return resource;
}

/**
 * Drop an inpatient-detail Procedure (a single ICD-10-PCS coding, sourced from
 * IHKE3309S02 `op_CODE`) when a richer Procedure already covers the same
 * (PCS code, hospital, date) — i.e. the surgery ALSO appeared in the 手術 list
 * (IHKE3308) where it carries BOTH an NHI 醫令碼 and the PCS classification. The
 * 住院 detail is the fallback source for surgeries the 手術 list omits; when a
 * surgery is in both, keep the richer 手術-list row.
 */
export function dedupProcedures(resources: Record<string, any>[]): Record<string, any>[] {
  const pcsCodes = (p: Record<string, any>): string[] =>
    ((p.code?.coding ?? []) as Record<string, any>[])
      .filter((c) => String(c?.system ?? "").includes("icd-10-pcs"))
      .map((c) => String(c.code));
  const isPcsOnly = (p: Record<string, any>): boolean => {
    const c = (p.code?.coding ?? []) as Record<string, any>[];
    return c.length === 1 && String(c[0]?.system ?? "").includes("icd-10-pcs");
  };
  const hosp = (p: Record<string, any>): string => p.performer?.[0]?.actor?.display ?? "";
  const day = (p: Record<string, any>): string =>
    String(p.performedDateTime ?? p.performedPeriod?.start ?? "").slice(0, 10);

  // (hospital|date|PCS) → id of the richer procedure that covers it.
  const claimant = new Map<string, string>();
  for (const p of resources) {
    if (p.resourceType !== "Procedure" || isPcsOnly(p)) continue;
    for (const code of pcsCodes(p)) claimant.set(`${hosp(p)}|${day(p)}|${code}`, p.id);
  }
  if (claimant.size === 0) return resources;

  // Drop the PCS-only inpatient duplicate; remember dropped-id → survivor-id so
  // a 次處置's partOf (which targeted the dropped primary) can be re-pointed.
  const remap = new Map<string, string>();
  const kept = resources.filter((p) => {
    if (p.resourceType !== "Procedure" || !isPcsOnly(p)) return true;
    for (const code of pcsCodes(p)) {
      const survivor = claimant.get(`${hosp(p)}|${day(p)}|${code}`);
      if (survivor && survivor !== p.id) {
        remap.set(p.id, survivor);
        return false;
      }
    }
    return true;
  });

  if (remap.size > 0) {
    for (const p of kept) {
      if (p.resourceType !== "Procedure" || !Array.isArray(p.partOf)) continue;
      for (const ref of p.partOf) {
        const id = String(ref?.reference ?? "").replace("Procedure/", "");
        const survivor = remap.get(id);
        if (survivor) ref.reference = `Procedure/${survivor}`;
      }
    }
  }
  return kept;
}
