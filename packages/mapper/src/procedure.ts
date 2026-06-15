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

  const resource: Record<string, any> = {
    resourceType: "Procedure",
    id: stableId(patientId, code || display, raw.date ?? ""),
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
  const hospital = ((raw.hospital ?? "") as string).trim();
  if (hospital) {
    resource.performer = [{ actor: { display: hospital } }];
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

  const claimed = new Set<string>();
  for (const p of resources) {
    if (p.resourceType !== "Procedure" || isPcsOnly(p)) continue;
    for (const code of pcsCodes(p)) claimed.add(`${hosp(p)}|${day(p)}|${code}`);
  }
  if (claimed.size === 0) return resources;
  return resources.filter((p) => {
    if (p.resourceType !== "Procedure" || !isPcsOnly(p)) return true;
    return !pcsCodes(p).some((code) => claimed.has(`${hosp(p)}|${day(p)}|${code}`));
  });
}
