/**
 * CarePlan mapper.
 *
 * Maps NHI IHKE3213S01 (我參與的照護計畫) rows to FHIR R4 CarePlan.
 * These are NHI case-management / 衛教 programmes the patient is enrolled
 * in — e.g. 末期腎臟病前期（Pre-ESRD）之病人照護與衛教計畫, 初期慢性腎病
 * 追蹤 — the closest 健康存摺 equivalent to a structured plan of care.
 *
 * Faithful-transport (CLAUDE.md rule 6): title / description / dates /
 * hospital come verbatim from NHI. The bridge only DERIVES the FHIR
 * status from whether a 結案日 (close date) is present, and adds the
 * required FHIR scaffolding (intent, category, subject reference). It
 * never invents clinical content NHI didn't supply.
 *
 * status semantics — 健康存摺 only lists real enrolments (no planned /
 * cancelled programmes), so the two reachable states are:
 *   - close_date empty   → "active"     (still ongoing)
 *   - close_date present → "completed"  (programme ended)
 * intent is hard-coded "plan": this is an actual ordered plan of care
 * the patient is participating in, not a "proposal" / "option".
 */

import { stableId } from "./helpers";
import { NHI_CARE_PLAN_PROGRAM } from "./systems";

export function mapCarePlan(
  raw: Record<string, any>,
  patientId: string,
): Record<string, any> | null {
  const title = ((raw.title ?? "") as string).trim();
  // No programme name → not a real care-plan row (the adapter already
  // filters non-myplan widget rows, but guard here too so the backend
  // structured-upload path is equally safe).
  if (!title) return null;

  const status = raw.status === "completed" ? "completed" : "active";
  const start = ((raw.period_start ?? "") as string).trim();
  const end = ((raw.period_end ?? "") as string).trim();

  const resource: Record<string, any> = {
    resourceType: "CarePlan",
    // Stable id keys on patient + title + start. Re-enrolment in the same
    // programme on a different 收案日 is a distinct CarePlan; a re-sync of
    // the same enrolment collapses to one resource (deterministic hash).
    id: stableId(patientId, title, start),
    meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
    // CarePlan.status (1..1, request-status ValueSet) + intent (1..1) are
    // both required by FHIR R4.
    status,
    intent: "plan",
    title,
    subject: { reference: `Patient/${patientId}` },
  };

  const description = ((raw.description ?? "") as string).trim();
  if (description) {
    resource.description = description;
  }

  // period.start = 收案日; period.end = 結案日 (omitted while active).
  if (start || end) {
    const period: Record<string, any> = {};
    if (start) period.start = `${start}T00:00:00+08:00`;
    if (end) period.end = `${end}T00:00:00+08:00`;
    resource.period = period;
  }

  // category classifies the kind of plan. We mark every NHI 照護計畫 with
  // a generic text label and, when NHI supplied a programme code, attach
  // it as a coding under the bridge-defined CodeSystem so SMART apps can
  // group enrolments by programme. The programme NAME stays on .title.
  const category: Record<string, any> = { text: "NHI 照護計畫" };
  const programCode = ((raw.program_code ?? "") as string).trim();
  if (programCode) {
    category.coding = [{ system: NHI_CARE_PLAN_PROGRAM, code: programCode }];
  }
  resource.category = [category];

  // Hospital running the programme → CarePlan.author as a display-only
  // Reference. Mirrors the Immunization performer.actor.display
  // convention — the bridge doesn't mint standalone Organization
  // resources, and Reference.display alone is valid per FHIR R4.
  const hospital = ((raw.hospital ?? "") as string).trim();
  if (hospital) {
    resource.author = { display: hospital };
  }

  return resource;
}
