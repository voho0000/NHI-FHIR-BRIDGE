/**
 * Condition mapper.
 *
 * Port of `backend/app/mapper/condition.py`. Includes the ICD-10-CM
 * normaliser (TWNHIFHIR Round-3 fix) which inserts the canonical dot
 * back into NHI's un-dotted codes ("E1122" → "E11.22").
 */

import * as systems from "@/fhir/systems";
import { stableId } from "@/mapper/helpers";

// ICD-10-CM canonical form is 'XXX.YYY[A-Z]' (category 3 chars + optional
// dot + subdivision + optional 7th-character extension). NHI 健保 sends
// codes WITHOUT the dot ('E1122', 'M47892', 'S0993XA', 'M19271').
// Validator rejects un-dotted codes as 'Unknown code'.
const ICD10_CATEGORY_RE = /^[A-Z][0-9A-Z]{2}$/;

/**
 * Insert the dot back into NHI's no-dot ICD-10-CM codes.
 *   E1122    → E11.22
 *   M47892   → M47.892
 *   S0993XA  → S09.93XA
 *   E11      → E11        (no subdivision; pass through)
 *   E11.22   → E11.22     (already dotted; pass through)
 */
export function normalizeIcd10Cm(code: string | null | undefined): string {
  if (!code || code.includes(".")) return code ?? "";
  const s = code.trim().toUpperCase();
  if (s.length <= 3) return s;
  const head = s.slice(0, 3);
  const tail = s.slice(3);
  if (ICD10_CATEGORY_RE.test(head)) {
    return `${head}.${tail}`;
  }
  return s;
}

function mapSystem(systemHint: unknown): string {
  const s = typeof systemHint === "string" ? systemHint.toLowerCase() : "";
  if (s.includes("snomed")) return systems.SNOMED_CT;
  if (s.includes("icd-10") || s.includes("icd10")) {
    // NHI 健保 codes are ICD-10-CM (US/Taiwan extended set — e.g.
    // E11.22). The base ICD-10 ValueSet rejects these as 'Unknown code'.
    return systems.ICD_10_CM;
  }
  return systems.HIS_LOCAL_CONDITION_CODE;
}

export function mapCondition(
  raw: Record<string, any>,
  patientId: string,
): Record<string, any> {
  const resource: Record<string, any> = {
    resourceType: "Condition",
    id: stableId(patientId, raw.code ?? "", raw.onset_date ?? ""),
    meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
    subject: { reference: `Patient/${patientId}` },
    clinicalStatus: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
          code: raw.clinical_status ?? "active",
        },
      ],
    },
    verificationStatus: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
          code: "confirmed",
        },
      ],
    },
  };

  const display = raw.display ?? "Unknown Condition";
  let code = raw.code as string | null | undefined;
  const system = mapSystem(raw.system ?? "");
  if (system === systems.ICD_10_CM && code) {
    code = normalizeIcd10Cm(code);
  }
  resource.code = {
    coding: [{ system, code: code || display, display }],
    text: display,
  };

  const severity = raw.severity ?? "";
  if (severity) {
    resource.severity = { text: severity };
  }

  if (raw.onset_date) {
    resource.onsetDateTime = `${raw.onset_date}T00:00:00+08:00`;
  }

  return resource;
}
