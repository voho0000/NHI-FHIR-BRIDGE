/**
 * Encounter mapper.
 *
 * Port of `backend/app/mapper/encounter.py`. Stable ID includes hospital
 * so same-day visits to different institutions each get their own
 * Encounter (the post-mapping linker depends on this).
 */

import { stableId } from "./helpers";

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

  // NHI's encounter "type" markers — 'IC卡資料' / '申報資料' / '住院'
  // — are data-origin labels, not SNOMED clinical types. Keep them as
  // CodeableConcept.text without claiming SNOMED.
  const typeDisplay = ((raw.type_display ?? "") as string).trim();
  if (typeDisplay) {
    resource.type = [{ text: typeDisplay }];
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
          code: reasonCode,
          display: displayPlain || reason || reasonZh,
        },
      ];
    }
    rc.text = reasonZh || reason;
    resource.reasonCode = [rc];
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
