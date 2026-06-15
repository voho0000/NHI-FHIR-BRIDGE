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

// `dedupAdmissionDayAmb` removed v0.20.0. It dropped any 門診/急診(AMB) whose
// (hospital, start_date) matched an 住院(IMP) admission day, on the theory that
// 就醫(IHKE3303) re-lists the inpatient stay as a billing-artefact AMB that
// duplicates the IMP from IHKE3309. That premise is FALSE: IHKE3303 carries
// only 門診/急診/藥局 (never 住院 — verified live 2026-06-15), so the two
// endpoints don't overlap and there was no duplicate to drop. The function
// only ever deleted the REAL gateway visit — the 門診/急診 where the patient
// was seen and then admitted (e.g. 長庚嘉義 5/18 急診 K92.0 吐血 → admitted
// for R04.2 咳血). True IMP duplicates (if IHKE3303 ever shipped a 住院 row
// classified IMP) collapse by Encounter id anyway, since the id includes class
// (stableId(patient, date, class, hospital)). See docs/DESIGN_v0.20.0_*.

// Normalised ICD code set from any resource's reasonCode[].coding[].code
// (dots/punctuation stripped so med "K92.0" matches encounter "K920").
function reasonCodeSet(r: Record<string, any>): Set<string> {
  const out = new Set<string>();
  for (const rc of r.reasonCode ?? []) {
    for (const c of rc?.coding ?? []) {
      const code = c?.code ? String(c.code).replace(/[^A-Za-z0-9]/g, "").toUpperCase() : "";
      if (code) out.add(code);
    }
  }
  return out;
}

/**
 * Add `encounter` reference to each linkable resource by (hospital, date).
 *
 * One candidate → link it. Several candidates sharing the (hospital, date)
 * — the normal shape since v0.20.0 when an admission-day 門診/急診 gateway
 * visit coexists with the 住院 it led to — are disambiguated:
 *   - resources carrying a diagnosis (MedicationRequest / Procedure
 *     reasonCode) attach to the Encounter whose reasonCode shares that ICD
 *     (ER med dx K92.0 → ER, admission med dx R04.2 → 住院);
 *   - diagnosis-less resources (lab Observation / DiagnosticReport) prefer
 *     the single-day gateway visit, since the admission-day workup is the
 *     ER/門診 draw — later admission days have no same-date gateway and link
 *     to the IMP via its span.
 * Still conservative: links only on a UNIQUE surviving candidate.
 */
export function linkEncountersInResources(
  candidates: Record<string, any>[],
  resources: Record<string, any>[],
): void {
  // Capture + strip the transient visit-class hint (__nhiVisitClass, set by the
  // med mapper from NHI's 申報 type) BEFORE any early return — it is not valid
  // FHIR and must never reach the bundle, even when there are no candidate
  // Encounters to link against.
  const visitClassByRes = new Map<Record<string, any>, string>();
  for (const r of resources) {
    if (r && r.__nhiVisitClass !== undefined) {
      visitClassByRes.set(r, String(r.__nhiVisitClass));
      delete r.__nhiVisitClass;
    }
  }
  if (candidates.length === 0) return;
  const exactIndex = new Map<string, string[]>();
  const impByHosp = new Map<string, Array<[string, string, string]>>();
  const byId = new Map<string, Record<string, any>>();

  for (const e of candidates) {
    if (e.resourceType !== "Encounter") continue;
    byId.set(e.id, e);
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
    const visitClass = visitClassByRes.get(r);
    const hosp = resourceHospital(r);
    const date = resourceDate(r);
    if (!hosp || !date) continue;
    const matches: string[] = [...(exactIndex.get(`${hosp} ${date}`) ?? [])];
    if (matches.length === 0) {
      for (const [start, end, eid] of impByHosp.get(hosp) ?? []) {
        if (start <= date && date <= end) matches.push(eid);
      }
    }
    if (matches.length === 0) continue;
    if (matches.length === 1) {
      r.encounter = { reference: `Encounter/${matches[0]}` };
      continue;
    }
    // >1 candidate at this (hospital, date): admission-day gateway 門診/急診
    // + the 住院 it led to (or same-day multi-visit). Disambiguate.
    const cands = matches.map((id) => byId.get(id)).filter(Boolean) as Record<string, any>[];
    // Deterministic first — NHI's own 申報 visit type (住院→IMP / 急診→EMER /
    // 門診→AMB), carried on the med as a transient class hint. An inpatient drug
    // attaches to the 住院 even when the same-day gateway shares the admission's
    // diagnosis: the 申報 type distinguishes them, the diagnosis cannot. This is
    // why the diagnosis tie-break alone left 長庚嘉義 2/11 (J18.9) + 1/28 (U07.1)
    // inpatient drugs unlinked. Link on a unique class match; else fall through.
    if (visitClass) {
      const classHits = cands.filter((e) => (e.class ?? {}).code === visitClass);
      if (classHits.length === 1) {
        r.encounter = { reference: `Encounter/${classHits[0]!.id}` };
        continue;
      }
    }
    // Next — an inpatient-course med's
    // dispenseRequest.validityPeriod is [admit, discharge], i.e. exactly the
    // 住院 Encounter's period. This resolves the COMMON case the diagnosis
    // tie-break below cannot: the gateway visit usually carries the same
    // primary dx as the admission (患者因肺炎就醫 → 因肺炎收住院), so the med's
    // dx matches BOTH and dxHits>1 → it stayed unlinked. The course-window
    // match pins it to the 住院 unambiguously. (Real: 長庚嘉義 2/11 J18.9 +
    // 1/28 U07.1 admissions — every inpatient drug carries the admission span.)
    const vp = (r.dispenseRequest ?? {}).validityPeriod;
    if (vp && vp.start && vp.end) {
      const vs = String(vp.start).slice(0, 10);
      const ve = String(vp.end).slice(0, 10);
      const periodHits = cands.filter(
        (e) =>
          String((e.period ?? {}).start ?? "").slice(0, 10) === vs &&
          String((e.period ?? {}).end ?? "").slice(0, 10) === ve,
      );
      if (periodHits.length === 1) {
        r.encounter = { reference: `Encounter/${periodHits[0]!.id}` };
        continue;
      }
    }
    const rcodes = reasonCodeSet(r);
    if (rcodes.size > 0) {
      // Diagnosis-bearing resource (med / procedure): attach to the encounter
      // whose reasonCode shares the ICD. Link only on a unique diagnosis hit.
      const dxHits = cands.filter((e) => {
        const ec = reasonCodeSet(e);
        for (const x of rcodes) if (ec.has(x)) return true;
        return false;
      });
      if (dxHits.length === 1) r.encounter = { reference: `Encounter/${dxHits[0]!.id}` };
      continue;
    }
    // Diagnosis-less resource (lab / report): prefer the single-day gateway
    // visit over the 住院 whose span merely starts that day.
    const gateways = cands.filter(
      (e) =>
        (e.class ?? {}).code !== "IMP" &&
        String((e.period ?? {}).start ?? "").slice(0, 10) === date,
    );
    if (gateways.length === 1) r.encounter = { reference: `Encounter/${gateways[0]!.id}` };
  }
}

/**
 * Validate (and repair) DocumentReference → Encounter references.
 *
 * The DocumentReference mapper pre-sets `context.encounter` by RECOMPUTING the
 * inpatient Encounter's stableId from (admission_date, hospital). But those
 * strings come from a different NHI endpoint than the Encounter itself, so a
 * slight mismatch (date format, hospital short-name) yields a reference to an
 * Encounter id that isn't in the bundle — a dangling reference (a `collection`
 * Bundle enforces no referential integrity, so nothing else catches it).
 *
 * With the full resource list in hand we: keep valid refs untouched; re-link a
 * dangler by tolerant (hospital, admission-date) match against the actual
 * Encounters (exact day, or within an IMP stay's period); and drop any that
 * still can't be resolved unambiguously — so the bundle never ships a reference
 * to a non-existent resource.
 */
export function repairDocumentReferenceEncounters(
  candidates: Record<string, any>[],
  resources: Record<string, any>[],
): void {
  const encounterIds = new Set<string>();
  const exactIndex = new Map<string, string[]>();
  const impByHosp = new Map<string, Array<[string, string, string]>>();
  for (const e of candidates) {
    if (e.resourceType !== "Encounter" || !e.id) continue;
    encounterIds.add(e.id);
    const hosp = (e.serviceProvider ?? {}).display ?? "";
    const start = String((e.period ?? {}).start ?? "").slice(0, 10);
    if (!hosp || !start) continue;
    const arr = exactIndex.get(`${hosp} ${start}`) ?? [];
    arr.push(e.id);
    exactIndex.set(`${hosp} ${start}`, arr);
    if ((e.class ?? {}).code === "IMP") {
      const end = String((e.period ?? {}).end ?? "").slice(0, 10);
      if (end) {
        const list = impByHosp.get(hosp) ?? [];
        list.push([start, end, e.id]);
        impByHosp.set(hosp, list);
      }
    }
  }

  for (const r of resources) {
    if (r.resourceType !== "DocumentReference") continue;
    const ctx = r.context;
    const ref: string | undefined = ctx?.encounter?.[0]?.reference;
    if (!ref) continue;
    if (encounterIds.has(String(ref).replace(/^Encounter\//, ""))) continue; // valid

    const hosp = (r.custodian ?? {}).display ?? "";
    const date = String(ctx?.period?.start ?? "").slice(0, 10);
    const matches: string[] = hosp && date ? [...(exactIndex.get(`${hosp} ${date}`) ?? [])] : [];
    if (matches.length === 0 && hosp && date) {
      for (const [start, end, eid] of impByHosp.get(hosp) ?? []) {
        if (start <= date && date <= end) matches.push(eid);
      }
    }
    if (matches.length === 1) {
      ctx.encounter = [{ reference: `Encounter/${matches[0]}` }];
    } else {
      ctx.encounter = undefined; // drop the dangling ref; keep context.period
    }
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
