/**
 * Procedure mapper.
 *
 * Port of `backend/app/mapper/procedure.py`. Returns null for list-page
 * rows lacking note/body_site — the alternative is the SMART app showing
 * 25 "procedures" called "Mycobacteria culture" / "Vaginal ultrasound"
 * / etc. which are clinically wrong.
 */

import * as systems from "@/fhir/systems";
import { stableId } from "@/mapper/helpers";

function mapSystem(systemHint: unknown): string {
  const s = typeof systemHint === "string" ? systemHint.toLowerCase() : "";
  if (s.includes("snomed")) return systems.SNOMED_CT;
  if (s.includes("icd")) return systems.ICD_10_PCS;
  return systems.HIS_LOCAL_PROCEDURE_CODE;
}

export function mapProcedure(
  raw: Record<string, any>,
  patientId: string,
): Record<string, any> | null {
  const note = ((raw.note as string) ?? "").trim();
  const bodySite = ((raw.body_site as string) ?? "").trim();
  if (!note && !bodySite) return null;

  const display = raw.display ?? "Unknown Procedure";
  const code = raw.code;
  const system = mapSystem(raw.system ?? "");

  const resource: Record<string, any> = {
    resourceType: "Procedure",
    id: stableId(patientId, code || display, raw.date ?? ""),
    meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
    status: raw.status ?? "completed",
    subject: { reference: `Patient/${patientId}` },
    code: {
      coding: [{ system, code: code || display, display }],
      text: display,
    },
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

  return resource;
}
