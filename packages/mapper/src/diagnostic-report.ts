/**
 * DiagnosticReport mapper.
 *
 * Port of `backend/app/mapper/diagnostic_report.py`. Returns null for
 * list-page rows lacking a conclusion, and for lab-value-only "reports"
 * that would duplicate a proper Observation.
 */

import * as systems from "./systems";
import { stableId } from "./helpers";

const V2_0074 = "http://terminology.hl7.org/CodeSystem/v2-0074";

const CATEGORY_MAP: Record<string, [string, string, string]> = {
  LAB: [V2_0074, "LAB", "Laboratory"],
  RAD: [V2_0074, "RAD", "Radiology"],
  CAR: [V2_0074, "CAR", "Cardiology"],
  PATH: [V2_0074, "PAT", "Pathology"],
};

// Lab-result patterns that look like single-value lab readings rather
// than a narrative report.
const LAB_UNIT_RE =
  /\d+(?:\.\d+)?\s*(?:%|mg\/dL|g\/dL|mmol\/L|U\/L|IU\/L|mIU\/L|ng\/mL|μg\/dL|ug\/dL|pg\/mL|fL|\/uL|10\^?\d+\/uL|x10\^?\d+\/uL|sec|秒|copies\/mL)/;

function looksLikeLabValueOnly(conclusion: string): boolean {
  if (!conclusion) return true;
  const text = conclusion.trim();
  // Real narrative reports almost always contain multiple sentences.
  if (text.length > 100) return false;
  // Single value pattern + parenthetical reference range = lab line.
  if (LAB_UNIT_RE.test(text)) return true;
  return false;
}

export function mapDiagnosticReport(
  raw: Record<string, any>,
  patientId: string,
): Record<string, any> | null {
  const conclusion = ((raw.conclusion ?? "") as string).trim();
  if (!conclusion) return null;

  const catKeyRaw = String(raw.category ?? "").toUpperCase();
  if (catKeyRaw === "LAB" && looksLikeLabValueOnly(conclusion)) {
    return null;
  }

  const display = raw.display ?? "Unknown Report";
  const code = raw.code;
  const systemHint = raw.system ?? "";
  const system =
    typeof systemHint === "string" && systemHint.toUpperCase() === "LOINC"
      ? systems.LOINC
      : systems.HIS_LOCAL_REPORT_CODE;

  const resource: Record<string, any> = {
    resourceType: "DiagnosticReport",
    id: stableId(patientId, code || display, raw.date ?? ""),
    meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
    status: raw.status ?? "final",
    subject: { reference: `Patient/${patientId}` },
    code: {
      coding: [{ system, code: code || display, display }],
      text: display,
    },
    conclusion,
  };

  const catEntry = CATEGORY_MAP[catKeyRaw];
  if (catEntry) {
    const [catSys, catCode, catDisplay] = catEntry;
    resource.category = [{ coding: [{ system: catSys, code: catCode, display: catDisplay }] }];
  }

  if (raw.date) {
    resource.effectiveDateTime = `${raw.date}T00:00:00+08:00`;
  }
  if (raw.issued) {
    resource.issued = `${raw.issued}T00:00:00+08:00`;
  } else if (raw.date) {
    resource.issued = `${raw.date}T00:00:00+08:00`;
  }

  const hospital = ((raw.hospital ?? "") as string).trim();
  if (hospital) {
    resource.performer = [{ display: hospital }];
  }

  return resource;
}
