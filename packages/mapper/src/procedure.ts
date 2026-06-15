/**
 * Procedure mapper.
 *
 * Port of `backend/app/mapper/procedure.py`. Returns null for list-page
 * rows lacking note/body_site — the alternative is the SMART app showing
 * 25 "procedures" called "Mycobacteria culture" / "Vaginal ultrasound"
 * / etc. which are clinically wrong.
 */

import { stableId } from "./helpers";
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

  const coding: Record<string, any>[] = [{ system, code: code || display, display }];
  // Optional secondary coding — e.g. the ICD-10-PCS op_CODE classification
  // riding alongside the primary NHI 醫令 order code (same procedure, two
  // code systems). Emitted by adaptProcedureFromDetail's per-order-item rows.
  const code2 = raw.code2;
  if (code2) {
    coding.push({
      system: mapSystem(raw.system2 ?? ""),
      code: code2,
      display: raw.display2 ?? code2,
    });
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

  return resource;
}
