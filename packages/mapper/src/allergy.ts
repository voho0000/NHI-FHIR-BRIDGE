/**
 * AllergyIntolerance mapper.
 *
 * Port of `backend/app/mapper/allergy.py`.
 */

import { stableId } from "./helpers";
import * as systems from "./systems";

const ALLOWED_CATEGORIES = new Set(["medication", "food", "environment", "biologic"]);
const ALLOWED_CRITICALITY = new Set(["high", "low", "unable-to-assess"]);

function mapSystem(systemHint: unknown): string {
  const s = typeof systemHint === "string" ? systemHint.toLowerCase() : "";
  if (s.includes("snomed")) return systems.SNOMED_CT;
  if (s.includes("rxnorm")) return "http://www.nlm.nih.gov/research/umls/rxnorm";
  return systems.HIS_LOCAL_ALLERGEN_CODE;
}

export function mapAllergyIntolerance(
  raw: Record<string, any>,
  patientId: string,
): Record<string, any> {
  const display = raw.display ?? "Unknown Allergen";
  const code = raw.code;
  const system = mapSystem(raw.system ?? "");

  const resource: Record<string, any> = {
    resourceType: "AllergyIntolerance",
    id: stableId(patientId, code || display, raw.recorded_date ?? ""),
    meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
    patient: { reference: `Patient/${patientId}` },
    clinicalStatus: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
          code: "active",
        },
      ],
    },
    verificationStatus: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
          code: "confirmed",
        },
      ],
    },
    code: {
      coding: [{ system, code: code || display, display }],
      text: display,
    },
  };

  const category = raw.category ?? "";
  if (ALLOWED_CATEGORIES.has(category)) {
    resource.category = [category];
  }

  const criticality = raw.criticality ?? "";
  if (ALLOWED_CRITICALITY.has(criticality)) {
    resource.criticality = criticality;
  }

  if (raw.recorded_date) {
    resource.recordedDate = `${raw.recorded_date}T00:00:00+08:00`;
  }

  const reactionNote = raw.reaction ?? "";
  if (reactionNote) {
    resource.reaction = [{ description: reactionNote }];
  }

  return resource;
}
