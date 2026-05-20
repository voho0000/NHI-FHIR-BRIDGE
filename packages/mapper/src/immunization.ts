/**
 * Immunization mapper.
 *
 * Maps NHI IHKE3203S01 (預防接種紀錄) rows to FHIR R4 Immunization.
 * NHI ships Chinese-only vaccine names with no terminology code, so
 * vaccineCode carries only `text` (clean 中文 name without lot suffix).
 * Future enhancement: add CVX / SNOMED CT coding via a lookup table.
 *
 * status is hardcoded to "completed" because 健保存摺 only lists
 * administered vaccines — there are no planned / not-given entries in
 * NHI's response shape.
 */

import { stableId } from "./helpers";

export function mapImmunization(
  raw: Record<string, any>,
  patientId: string,
): Record<string, any> | null {
  const vaccineName = ((raw.vaccine_name ?? "") as string).trim();
  const date = ((raw.date ?? "") as string).trim();
  if (!vaccineName || !date) return null;

  const resource: Record<string, any> = {
    resourceType: "Immunization",
    // Stable id uses date + vaccine name + lot — same vaccine same day
    // with the same lot collapses (NHI rare edge case); different lots
    // would be distinct Immunizations.
    id: stableId(patientId, vaccineName, date, raw.lot_number ?? ""),
    meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
    status: "completed",
    vaccineCode: {
      // No terminology coding — NHI gives Chinese name only. SMART
      // apps render .text for both patient and clinical views (the
      // v0.8.0 bilingual fallback contract: if English absent, text
      // is the only display).
      text: vaccineName,
    },
    patient: { reference: `Patient/${patientId}` },
    occurrenceDateTime: `${date}T00:00:00+08:00`,
  };

  const lotNumber = ((raw.lot_number ?? "") as string).trim();
  if (lotNumber) {
    resource.lotNumber = lotNumber;
  }

  const hospital = ((raw.hospital ?? "") as string).trim();
  if (hospital) {
    // performer.actor.display matches the Encounter linker's
    // (hospital, date) match pattern in link.ts — though
    // Immunization is not currently in ENCOUNTER_LINKABLE, adding it
    // there later would let SMART apps group vaccinations by visit.
    resource.performer = [{ actor: { display: hospital } }];
  }

  const source = ((raw.source ?? "") as string).trim();
  if (source) {
    // NHI 健保存摺 surfaces the upstream source-of-record on every
    // vaccine row (typically "疾病管制署" = Taiwan CDC). Preserve as
    // a note so consumers can trace provenance without losing it in
    // the meta.source path that's already pointing at the bridge.
    resource.note = [{ text: `來源: ${source}` }];
  }

  return resource;
}
