/**
 * Encounter linker — match resources to Encounters by (hospital, date).
 *
 * Pure function: mutates `resources` in place to add `encounter`
 * references when there's an unambiguous match in the candidate
 * Encounter list. Same logic as the backend's DB-coupled version,
 * lifted out so the extension's local mode can call it on an
 * in-memory array.
 */

import { deriveInterpretation } from "./observation";

const ENCOUNTER_LINKABLE = new Set([
  "Observation",
  "MedicationRequest",
  "DiagnosticReport",
  "Procedure",
  "Condition",
  "AllergyIntolerance",
]);

function resourceDate(r: Record<string, any>): string {
  for (const key of [
    "effectiveDateTime",
    "authoredOn",
    "performedDateTime",
    "onsetDateTime",
    "recordedDate",
    "issued",
  ]) {
    const v = r[key];
    if (v) return String(v).slice(0, 10);
  }
  for (const key of ["effectivePeriod", "performedPeriod"]) {
    const period = r[key];
    if (period && typeof period === "object" && period.start) {
      return String(period.start).slice(0, 10);
    }
  }
  return "";
}

function resourceHospital(r: Record<string, any>): string {
  // performer shape differs by resource type:
  //   Observation / DiagnosticReport: Reference[]              → p.display
  //   Procedure:                      BackboneElement[]        → p.actor.display
  // FHIR R4 §Procedure.performer is the only place we hit a BackboneElement.
  for (const p of r.performer ?? []) {
    if (!p || typeof p !== "object") continue;
    if (typeof p.display === "string" && p.display) return p.display;
    const actor = p.actor;
    if (actor && typeof actor === "object" && typeof actor.display === "string" && actor.display) {
      return actor.display;
    }
  }
  const req = r.requester ?? {};
  if (req && typeof req === "object" && req.display) return req.display;
  return "";
}

/**
 * Drop AMB Encounters whose (hospital, start_date) is already covered
 * by an IMP Encounter's admission day. NHI emits the same inpatient
 * stay twice (IHKE3303 AMB billing entry + IHKE3309 IMP detail); the
 * IMP one is canonical, the AMB is a billing artefact.
 */
export function dedupAdmissionDayAmb(resources: Record<string, any>[]): Record<string, any>[] {
  const impStarts = new Set<string>();
  for (const r of resources) {
    if (r.resourceType !== "Encounter") continue;
    if ((r.class ?? {}).code !== "IMP") continue;
    const hosp = (r.serviceProvider ?? {}).display ?? "";
    const start = String((r.period ?? {}).start ?? "").slice(0, 10);
    if (hosp && start) impStarts.add(`${hosp} ${start}`);
  }
  if (impStarts.size === 0) return resources;
  return resources.filter((r) => {
    if (r.resourceType === "Encounter" && (r.class ?? {}).code === "AMB") {
      const hosp = (r.serviceProvider ?? {}).display ?? "";
      const start = String((r.period ?? {}).start ?? "").slice(0, 10);
      if (impStarts.has(`${hosp} ${start}`)) return false;
    }
    return true;
  });
}

/**
 * Add `encounter` reference to each linkable resource when its
 * (hospital, date) matches exactly ONE Encounter in `candidates`.
 * Conservative — leaves ambiguous (0 or >1 match) cases unlinked.
 */
export function linkEncountersInResources(
  candidates: Record<string, any>[],
  resources: Record<string, any>[],
): void {
  if (candidates.length === 0) return;
  const exactIndex = new Map<string, string[]>();
  const impByHosp = new Map<string, Array<[string, string, string]>>();

  for (const e of candidates) {
    if (e.resourceType !== "Encounter") continue;
    const hosp = (e.serviceProvider ?? {}).display ?? "";
    const start = String((e.period ?? {}).start ?? "").slice(0, 10);
    if (!hosp || !start) continue;
    const key = `${hosp} ${start}`;
    const arr = exactIndex.get(key) ?? [];
    arr.push(e.id);
    exactIndex.set(key, arr);
    const cls = (e.class ?? {}).code ?? "";
    if (cls === "IMP") {
      const end = String((e.period ?? {}).end ?? "").slice(0, 10);
      if (end) {
        const list = impByHosp.get(hosp) ?? [];
        list.push([start, end, e.id]);
        impByHosp.set(hosp, list);
      }
    }
  }

  if (exactIndex.size === 0 && impByHosp.size === 0) return;

  for (const r of resources) {
    if (!ENCOUNTER_LINKABLE.has(r.resourceType)) continue;
    if (r.encounter || r.context) continue;
    const hosp = resourceHospital(r);
    const date = resourceDate(r);
    if (!hosp || !date) continue;
    const matches: string[] = [...(exactIndex.get(`${hosp} ${date}`) ?? [])];
    if (matches.length === 0) {
      for (const [start, end, eid] of impByHosp.get(hosp) ?? []) {
        if (start <= date && date <= end) matches.push(eid);
      }
    }
    if (matches.length !== 1) continue;
    r.encounter = { reference: `Encounter/${matches[0]}` };
  }
}

/**
 * When an Observation carries multiple referenceRange entries tagged
 * with `appliesTo[*].coding.code` in {male, female}, pick the one that
 * matches the patient's gender and re-derive interpretation against it.
 */
export function resolveSexStratifiedRanges(
  patient: Record<string, any> | null,
  resources: Record<string, any>[],
): void {
  if (!patient) return;
  const gender = String(patient.gender ?? "").toLowerCase();
  if (gender !== "male" && gender !== "female") return;

  for (const r of resources) {
    if (r.resourceType !== "Observation") continue;
    const rrs: any[] = r.referenceRange ?? [];
    if (rrs.length < 2) continue;

    let match: any = null;
    for (const entry of rrs) {
      for (const ap of entry.appliesTo ?? []) {
        for (const c of ap.coding ?? []) {
          if (String(c.code ?? "").toLowerCase() === gender) {
            match = entry;
            break;
          }
        }
        if (match) break;
      }
      if (match) break;
    }
    if (!match) continue;

    r.referenceRange = [match];
    const valStr = String((r.valueQuantity ?? {}).value ?? "") || String(r.valueString ?? "");
    const newInterp = deriveInterpretation(valStr, r.valueQuantity ?? null, match);
    if (newInterp) {
      r.interpretation = [{ coding: [newInterp] }];
    }
  }
}
