/**
 * page_type → mapper dispatch tables.
 *
 * Consumed by backend's `/sync/upload-structured` and the extension's
 * local-mode bundle assembler so both produce identical FHIR output.
 */

import { mapAllergyIntolerance } from "./allergy";
import { mapCancerScreening } from "./cancer-screening";
import { mapCarePlan } from "./careplan";
import { mapCondition } from "./condition";
import { mapDiagnosticReport } from "./diagnostic-report";
import { mapDischargeSummaryDocRef } from "./document-reference";
import { mapEncounter } from "./encounter";
import { mapImmunization } from "./immunization";
import { mapMedicationRequest, mapMedicationsDedup } from "./medication";
import { mapObservation, mapObservationsGrouped } from "./observation";
import { mapProcedure } from "./procedure";

export type PerRowMapper = (
  raw: Record<string, any>,
  patientId: string,
) => Record<string, any> | null;

export type GroupMapper = (items: any[], patientId: string) => Record<string, any>[];

/**
 * page_type → (per-row mapper, JSON list key inside LLM response).
 * Used by the LLM fallback path after extraction; the structured path
 * also consults it for per-row resource types.
 */
export const LIST_HANDLERS: Record<string, [PerRowMapper, string]> = {
  observations: [mapObservation, "observations"],
  medications: [mapMedicationRequest, "medications"],
  conditions: [mapCondition, "conditions"],
  allergies: [mapAllergyIntolerance, "allergies"],
  diagnostic_reports: [mapDiagnosticReport, "diagnostic_reports"],
  procedures: [mapProcedure, "procedures"],
  encounters: [mapEncounter, "encounters"],
  immunizations: [mapImmunization, "immunizations"],
  care_plans: [mapCarePlan, "care_plans"],
  // 癌症篩檢 (IHKE3404) — dedicated mapper; qualitative bilingual result,
  // not a lab. One Observation per screening record (no panel grouping).
  cancer_screening: [mapCancerScreening, "cancer_screening"],
  // 出院病摘 (NHI IHKE3309S02/getxml) — DocumentReference carrying the
  // NHI-rendered HTML verbatim. One row per inpatient stay with
  // has_XML=Y. See document-reference.ts for the faithful-transport
  // rationale.
  document_references: [mapDischargeSummaryDocRef, "document_references"],
};

/**
 * page_type → group-aware mapper that takes the FULL list at once.
 * Used when cross-row grouping/dedup is required (NHI lab panels,
 * 中英 medication 雙語 dedup).
 */
export const GROUP_HANDLERS: Record<string, GroupMapper> = {
  observations: mapObservationsGrouped,
  medications: mapMedicationsDedup,
};
