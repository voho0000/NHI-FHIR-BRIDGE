/**
 * Encounter mapper.
 *
 * Port of `backend/app/mapper/encounter.py`. Stable ID includes hospital
 * so same-day visits to different institutions each get their own
 * Encounter (the post-mapping linker depends on this).
 */

import { normalizeIcd10Cm } from "./condition";
import { stableId } from "./helpers";
import { ENCOUNTER_CHANNEL_SYSTEM, ENCOUNTER_KIND_SYSTEM } from "./systems";

// Stable machine codes for the two Encounter.type dimensions. Each kind
// or channel string seen on the wire maps to a lowercase ASCII code
// (so SMART apps can switch on a stable identifier even if the Chinese
// display label changes). Unknown values still get a coding entry — we
// just omit `coding.code` and ship system + display, so consumers can
// still find the right type[] entry by system without crashing.
const KIND_CODE_MAP: Record<string, string> = {
  門診: "outpatient",
  急診: "emergency",
  住院: "inpatient",
  藥局: "pharmacy",
};
const CHANNEL_CODE_MAP: Record<string, string> = {
  申報資料: "claims",
  IC卡資料: "ic-card",
};

function buildTypeEntry(
  text: string,
  system: string,
  codeMap: Record<string, string>,
): Record<string, any> {
  const coding: Record<string, any> = { system, display: text };
  const code = codeMap[text];
  if (code) coding.code = code;
  return { text, coding: [coding] };
}

const ACTCODE_SYSTEM = "http://terminology.hl7.org/CodeSystem/v3-ActCode";

const CLASS_MAP: Record<string, [string, string, string]> = {
  AMB: [ACTCODE_SYSTEM, "AMB", "ambulatory"],
  IMP: [ACTCODE_SYSTEM, "IMP", "inpatient encounter"],
  EMER: [ACTCODE_SYSTEM, "EMER", "emergency"],
};

// Encounter stable id == merge key. Two raw rows collapse to one Encounter iff
// they produce the same id.
//
//   • IMP (住院): legacy (date, "IMP", hospital) tuple — UNCHANGED. The
//     DocumentReference (出院病摘) mapper recomputes this exact tuple to point at
//     the stay (document-reference.ts), so it must stay stable; and one
//     admission == one Encounter regardless of ICD.
//   • AMB / EMER (門診/急診): (date, hospital, 主診斷 + 全部次診斷[sorted set],
//     部分負擔 part_amt, 申請點數 appl_dot) — NO class. User rule (2026-06-22):
//     a single day can hold MANY 門診 (different 科別), so merge ONLY when the
//     FULL diagnosis set AND both billing figures match. Different primary OR
//     different secondary set OR different 部分負擔/申請點數 ⇒ different visit
//     (even if the primary ICD is shared). Class is deliberately excluded — 門診
//     vs 急診 already differ in billing, and excluding it lets an empty duplicate
//     申報 row (which defaults to 門診) absorb into its real sibling; the surviving
//     class is then resolved by dedupEncountersPreferClass.
function encounterStableId(
  patientId: string,
  encClass: string,
  raw: Record<string, any>,
): string {
  const date = String(raw.date ?? "");
  const hospital = String(raw.hospital ?? "").trim();
  if (encClass === "IMP") {
    return stableId(patientId, date, "IMP", hospital);
  }
  const primary = raw.reason_code ? normalizeIcd10Cm(String(raw.reason_code)) : "";
  const secondaries = (Array.isArray(raw.secondary_diagnoses) ? raw.secondary_diagnoses : [])
    .map((s: any) => (s?.code ? normalizeIcd10Cm(String(s.code)) : ""))
    .filter(Boolean)
    .sort();
  const dxKey = [primary, ...secondaries].join(",");
  // NHI 就醫序號 (func_SEQ_NO) — when it's the NUMERIC 就醫序號, it IS the "one
  // 就醫" identifier: 申報 rows of the SAME 就醫 split by 費用類別 share it (live-
  // verified 9/16 CKD — a 檢驗 申報 740pt/0部分負擔 + a 診察+藥 申報 2001pt/50 both
  // carry "0032"). Use it IN PLACE of the (part_amt, appl_dot) billing key so
  // those rows MERGE into one Encounter (also resolves the lab/med ambiguity that
  // left them unlinked). ADDITIVE + safe: a non-numeric form (e.g. "IC02"/"IC03"
  // — an IC卡 序號 that does NOT identify the same 就醫) or a missing value falls
  // back to the unchanged billing key, so currently-merged pairs never split
  // (live-verified 8/20: J189 IC02/IC03 stay merged via the billing key).
  const funcSeq = String(raw.func_seq_no ?? "").trim();
  if (/^\d+$/.test(funcSeq)) {
    return stableId(patientId, date, hospital, dxKey, `fseq:${funcSeq}`);
  }
  const partAmt = String(raw.part_amt ?? "").trim();
  const applDot = String(raw.appl_dot ?? "").trim();
  return stableId(patientId, date, hospital, dxKey, partAmt, applDot);
}

// The merge key excludes class, so an empty duplicate 申報 row that defaulted to
// 門診(AMB) can land on the same id as a real 急診(EMER) sibling. Resolve such
// same-id Encounter collisions by keeping the strongest class (EMER > IMP > AMB)
// — never let an empty AMB stub override a real EMER/IMP visit. Non-Encounter
// resources and already-unique Encounters pass through untouched; output order
// is preserved (each id emitted at its first occurrence).
const ENC_CLASS_RANK: Record<string, number> = { EMER: 3, IMP: 2, AMB: 1 };
function encClassRank(enc: Record<string, any>): number {
  return ENC_CLASS_RANK[String(enc?.class?.code ?? "").toUpperCase()] ?? 0;
}
export function dedupEncountersPreferClass(
  resources: Record<string, any>[],
): Record<string, any>[] {
  const winner = new Map<string, Record<string, any>>();
  for (const r of resources) {
    if (r?.resourceType !== "Encounter") continue;
    const prev = winner.get(r.id);
    if (!prev || encClassRank(r) > encClassRank(prev)) winner.set(r.id, r);
  }
  const emitted = new Set<string>();
  const out: Record<string, any>[] = [];
  for (const r of resources) {
    if (r?.resourceType !== "Encounter") {
      out.push(r);
      continue;
    }
    if (emitted.has(r.id)) continue;
    emitted.add(r.id);
    out.push(winner.get(r.id) ?? r);
  }
  return out;
}

export function mapEncounter(raw: Record<string, any>, patientId: string): Record<string, any> {
  const encClass = String(raw.class ?? "AMB").toUpperCase();
  const classEntry = CLASS_MAP[encClass] ?? CLASS_MAP.AMB!;

  const resource: Record<string, any> = {
    resourceType: "Encounter",
    id: encounterStableId(patientId, encClass, raw),
    meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
    status: "finished",
    class: {
      system: classEntry[0],
      code: classEntry[1],
      display: classEntry[2],
    },
    subject: { reference: `Patient/${patientId}` },
  };

  // Encounter.type carries TWO independent dimensions (v0.9.2):
  //   • kind     — 門診 / 急診 / 住院 / 藥局      (clinical visit type)
  //   • channel  — IC卡資料 / 申報資料            (NHI data origin)
  // FHIR R4 Encounter.type is 0..*, but the spec defines no positional
  // semantics on type[] entries. We tag each entry with its own
  // `coding.system` (ENCOUNTER_KIND_SYSTEM / ENCOUNTER_CHANNEL_SYSTEM)
  // so consumers can locate the right dimension via
  //   type.find(t => t.coding[0].system === ENCOUNTER_KIND_SYSTEM)
  // rather than by array index. Self-describing and FHIR-conformant.
  //
  // Backward compat: legacy callers that still emit raw.type_display
  // get a single text-only type[] entry (the dimension is unknowable
  // from a bare string, so we ship it as-is without coding — same as
  // pre-0.9.2 output, preserves the old contract).
  const kind = ((raw.kind ?? "") as string).trim();
  const channel = ((raw.channel ?? "") as string).trim();
  const types: Record<string, any>[] = [];
  if (kind) types.push(buildTypeEntry(kind, ENCOUNTER_KIND_SYSTEM, KIND_CODE_MAP));
  if (channel) {
    types.push(buildTypeEntry(channel, ENCOUNTER_CHANNEL_SYSTEM, CHANNEL_CODE_MAP));
  }
  if (types.length === 0) {
    const typeDisplay = ((raw.type_display ?? "") as string).trim();
    if (typeDisplay) types.push({ text: typeDisplay });
  }
  if (types.length > 0) {
    resource.type = types;
  }

  const period: Record<string, string> = {};
  if (raw.date) period.start = `${raw.date}T00:00:00+08:00`;
  if (raw.end_date) period.end = `${raw.end_date}T00:00:00+08:00`;
  if (Object.keys(period).length > 0) {
    resource.period = period;
  }

  const department = raw.department ?? "";
  const provider = raw.provider ?? "";
  if (department || provider) {
    const participant: Record<string, any> = {};
    if (provider) participant.individual = { display: provider };
    resource.participant = Object.keys(participant).length > 0 ? [participant] : [];
    if (department) {
      resource.serviceType = { text: department };
    }
  }

  const hospital = ((raw.hospital ?? "") as string).trim();
  if (hospital) {
    resource.serviceProvider = { display: hospital };
  }

  // Bilingual reasonCode (v0.8.0). Adapter splits NHI's bilingual ICD
  // name into raw.reason (English) and raw.reason_zh (繁中), plus the
  // raw ICD-10 code in raw.reason_code. Patient-facing .text uses 繁中
  // (falls back to English when NHI ships English-only); coding[].display
  // stays English with the proper ICD-10-CM system.
  //
  // v0.9.0 adds secondary diagnoses (次診斷) — IHKE3303S02 detail
  // exposes up to 4 additional ICDs per encounter. They are pushed
  // after the primary so SMART apps can render reasonCode[0] as the
  // main diagnosis and the rest as secondary chips.
  const reasonCodes: Record<string, any>[] = [];
  const reason = ((raw.reason ?? "") as string).trim();
  const reasonZh = ((raw.reason_zh ?? "") as string).trim();
  const reasonCode = ((raw.reason_code ?? "") as string).trim();
  if (reason || reasonZh || reasonCode) {
    const rc: Record<string, any> = {};
    if (reasonCode) {
      // Strip the "<code> " prefix the adapter prepends to the display,
      // since the structured `code` already conveys that information.
      const displayPlain = reason.replace(new RegExp(`^${reasonCode}\\s+`), "").trim();
      rc.coding = [
        {
          system: "http://hl7.org/fhir/sid/icd-10-cm",
          // NHI ships ICD-10-CM WITHOUT the dot ("E079"); the canonical
          // system form is dotted ("E07.9"). Normalising here keeps the
          // same diagnosis from appearing as two distinct codes across
          // encounters (the medication mapper already normalises) — a
          // problem-list grouping bug in consuming SMART apps.
          code: normalizeIcd10Cm(reasonCode),
          display: displayPlain || reason || reasonZh,
        },
      ];
    }
    // .text keeps NHI's original phrasing (including its un-dotted code
    // prefix) — FHIR CodeableConcept.text is the "original text", while the
    // dotted form lives in coding.code. Mirrors the medication mapper.
    rc.text = reasonZh || reason;
    reasonCodes.push(rc);
  }
  const secondaries = Array.isArray(raw.secondary_diagnoses) ? raw.secondary_diagnoses : [];
  for (const sec of secondaries) {
    const code = ((sec?.code ?? "") as string).trim();
    const nameEn = ((sec?.name_en ?? "") as string).trim();
    const nameZh = ((sec?.name_zh ?? "") as string).trim();
    if (!code && !nameEn && !nameZh) continue;
    const entry: Record<string, any> = {};
    if (code) {
      entry.coding = [
        {
          system: "http://hl7.org/fhir/sid/icd-10-cm",
          code: normalizeIcd10Cm(code),
          display: nameEn || nameZh,
        },
      ];
    }
    entry.text = code ? `${code} ${nameZh || nameEn}`.trim() : nameZh || nameEn;
    reasonCodes.push(entry);
  }
  if (reasonCodes.length > 0) {
    resource.reasonCode = reasonCodes;
  }

  const discharge = raw.discharge_disposition ?? "";
  if (discharge) {
    resource.hospitalization = { dischargeDisposition: { text: discharge } };
  }

  const clinicalNote = ((raw.clinical_note ?? "") as string).trim();
  if (clinicalNote) {
    resource.note = [{ text: clinicalNote }];
  }

  // Transient — STRIPPED by linkEncountersInResources before the bundle (not
  // valid FHIR). NHI 醫令碼 of the drugs this visit prescribed (#26): the linker
  // attaches a MedicationRequest to this Encounter only when the med's order
  // code appears here, so a 藥局/IC卡 dispense with no 申報 encounter stays
  // unlinked instead of being date-matched onto an unrelated same-day visit.
  const rxCodes = Array.isArray(raw.rx_order_codes) ? raw.rx_order_codes : [];
  if (rxCodes.length > 0) resource.__rxOrderCodes = rxCodes;

  // Transient (STRIPPED by linkEncountersInResources) — NHI 醫令碼 of the 檢驗
  // this visit ordered (#26 extended to labs): the linker attaches a diagnosis-
  // less lab Observation to this Encounter only when the lab's order code appears
  // here, so multiple same-day 門診 visits no longer all get the same labs dumped
  // on whichever one the date gateway happened to pick.
  const labCodes = Array.isArray(raw.lab_order_codes) ? raw.lab_order_codes : [];
  if (labCodes.length > 0) resource.__labOrderCodes = labCodes;

  return resource;
}
