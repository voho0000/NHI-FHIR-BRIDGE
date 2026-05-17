/**
 * page_type → mapper dispatch tables.
 *
 * Port of `backend/app/mapper/dispatch.py`. Both the primary structured
 * path (`/sync/upload-structured`) and the LLM fallback path
 * (`/sync/upload-html`) consume the same tables so output is identical.
 */

import { mapAllergyIntolerance } from "./allergy";
import { mapCondition } from "./condition";
import { mapDiagnosticReport } from "./diagnostic-report";
import { mapEncounter } from "./encounter";
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
