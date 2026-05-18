/**
 * Condition mapper.
 *
 * Port of `backend/app/mapper/condition.py`. Includes the ICD-10-CM
 * normaliser (TWNHIFHIR Round-3 fix) which inserts the canonical dot
 * back into NHI's un-dotted codes ("E1122" → "E11.22").
 */

import * as systems from "./systems";
import { stableId } from "./helpers";

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

export function mapCondition(raw: Record<string, any>, patientId: string): Record<string, any> {
  const display = raw.display ?? "Unknown Condition";
  let code = raw.code as string | null | undefined;
  const system = mapSystem(raw.system ?? "");
  if (system === systems.ICD_10_CM && code) {
    code = normalizeIcd10Cm(code);
  }

  const resource: Record<string, any> = {
    resourceType: "Condition",
    // Stable id falls back to display when no code is present (catastrophic
    // illness rows from IHKE3209 carry the Chinese narrative only). Mirrors
    // the same `code || display` pattern in diagnostic-report.ts and
    // allergy.ts — avoids hash collisions between two same-day code-less
    // conditions.
    id: stableId(patientId, code || display, raw.onset_date ?? ""),
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

  // Category routes the Condition into the right downstream view.
  // - "problem-list-item" → SMART / IPS Problem List section
  // - "encounter-diagnosis" → per-encounter diagnoses
  // - "health-concern" → IPS Health Concerns
  // Adapter-level decision: 重大傷病 rows mark category="problem-list-item";
  // generic encounter-derived conditions can omit, defaulting to no
  // explicit category (SMART apps fall through to all-conditions view).
  if (raw.category) {
    resource.category = [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/condition-category",
            code: raw.category,
          },
        ],
      },
    ];
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
  if (raw.recorded_date) {
    resource.recordedDate = `${raw.recorded_date}T00:00:00+08:00`;
  }

  return resource;
}
