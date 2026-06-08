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

export function mapEncounter(raw: Record<string, any>, patientId: string): Record<string, any> {
  const encClass = String(raw.class ?? "AMB").toUpperCase();
  const classEntry = CLASS_MAP[encClass] ?? CLASS_MAP.AMB!;

  const resource: Record<string, any> = {
    resourceType: "Encounter",
    id: stableId(patientId, raw.date ?? "", encClass, ((raw.hospital ?? "") as string).trim()),
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

  return resource;
}
