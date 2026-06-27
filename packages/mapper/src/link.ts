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

// NHI 醫令碼 of a MedicationRequest. coding[0] is the NHI drug code (or, absent
// one, the HIS-local code). Used to match a med against an Encounter's
// prescribed-drug list (Encounter.__rxOrderCodes) for #26.
function medOrderCode(r: Record<string, any>): string {
  const coding = r.medicationCodeableConcept?.coding;
  return Array.isArray(coding) ? String(coding[0]?.code ?? "").trim() : "";
}

// NHI 醫令碼(s) carried on a lab Observation / DiagnosticReport — any code.coding
// entry shaped like an NHI order code (5 digits + a trailing letter, e.g. 09015C
// / 08003C). Used to match a diagnosis-less lab against an Encounter's 檢驗醫令
// list (Encounter.__labOrderCodes) — the #26 drug-list trick extended to labs.
const NHI_ORDER_CODE_RE = /^\d{5}[A-Z]$/;
function labOrderCodes(r: Record<string, any>): string[] {
  const coding = r.code?.coding;
  if (!Array.isArray(coding)) return [];
  const out: string[] = [];
  for (const c of coding) {
    const code = String(c?.code ?? "").trim();
    if (NHI_ORDER_CODE_RE.test(code)) out.push(code);
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
  // Also capture + STRIP Encounter.__rxOrderCodes (the visit's prescribed-drug
  // NHI 醫令碼, set by mapEncounter for #26) — transient, never valid FHIR.
  // Captured from BOTH arrays so it's stripped whether candidates and resources
  // are the same array (local mode) or separate (backend).
  const rxCodesByEnc = new Map<Record<string, any>, string[]>();
  // Encounter → its 檢驗醫令碼 Set (Encounter.__labOrderCodes, #26 for labs).
  const labCodesByEnc = new Map<Record<string, any>, Set<string>>();
  const captureTransients = (r: Record<string, any>) => {
    if (!r) return;
    if (r.__nhiVisitClass !== undefined) {
      visitClassByRes.set(r, String(r.__nhiVisitClass));
      delete r.__nhiVisitClass;
    }
    if (Array.isArray(r.__rxOrderCodes)) {
      rxCodesByEnc.set(r, r.__rxOrderCodes as string[]);
      delete r.__rxOrderCodes;
    }
    if (Array.isArray(r.__labOrderCodes)) {
      labCodesByEnc.set(r, new Set(r.__labOrderCodes as string[]));
      delete r.__labOrderCodes;
    }
  };
  for (const r of resources) captureTransients(r);
  for (const e of candidates) captureTransients(e);
  if (candidates.length === 0) return;
  const exactIndex = new Map<string, string[]>();
  const impByHosp = new Map<string, Array<[string, string, string]>>();
  // (hospital, date) → encounters that listed drugs + their 醫令碼 set (#26).
  // isInpatient lets the linker pick the RIGHT list per med (住院 list for an
  // inpatient-course med, 門診/急診 lists for an outpatient med).
  const rxIndex = new Map<
    string,
    Array<{ id: string; codes: Set<string>; isInpatient: boolean }>
  >();
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
    // #26: index this visit's listed-drug 醫令碼 by (hospital, date). Tag each
    // entry with isInpatient so the linker checks the RIGHT list per med:
    // inpatient-course meds → the 住院(IMP) list (sp_IHKE3302S11); outpatient meds
    // → the 門診/急診 lists (sp_IHKE3302S04). Stops an inpatient continuation from
    // being stranded by / matched against the admission-day gateway's list.
    const rxCodes = rxCodesByEnc.get(e);
    if (rxCodes && rxCodes.length > 0) {
      const rxArr = rxIndex.get(key) ?? [];
      rxArr.push({ id: e.id, codes: new Set(rxCodes), isInpatient: cls === "IMP" });
      rxIndex.set(key, rxArr);
    }
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
    // #26: a MedicationRequest prefers to link to the visit that LISTED it — the
    // Encounter whose 醫令碼 list contains this med's order code. Each visit's S02
    // drug list is authoritative for the MEDS OF ITS OWN KIND:
    //   • outpatient med       → the 門診/急診 lists (sp_IHKE3302S04_data)
    //   • inpatient-course med → the 住院 list (sp_IHKE3302S11_data); identified by
    //     dispenseRequest.validityPeriod = [admit, discharge] (verified 2026-06-23:
    //     the 住院 detail DOES carry a per-drug list — the earlier belief it didn't
    //     was wrong). The med's OWN kind picks which lists are relevant, so an
    //     inpatient continuation is never matched against (nor stranded by) the
    //     admission-day gateway 門診/急診's list.
    //
    // When the relevant list WAS captured: link to the visit that listed this drug;
    // a drug in NONE (藥局/IC卡 dispense, or 自備藥 never billed) or in MORE than one
    // stays UNLINKED — no fall-through (user 2026-06-23: 寧願獨立也不要亂塞; absence
    // from a list ≠ "not taken"). When NO relevant list is captured (old 住院 record
    // with no sp_IHKE3302S11, or detail not fetched) we fall through to the
    // (hospital,date)/class/period heuristic so those meds still link.
    if (r.resourceType === "MedicationRequest") {
      const vp = r.dispenseRequest?.validityPeriod;
      const isInpatientCourse = !!(vp?.start && vp?.end);
      const rxAtKey = rxIndex.get(`${hosp} ${date}`) ?? [];
      const relevant = rxAtKey.filter((e) => (isInpatientCourse ? e.isInpatient : !e.isInpatient));
      if (relevant.length > 0) {
        const oc = medOrderCode(r);
        const hits = oc ? relevant.filter((e) => e.codes.has(oc)) : [];
        if (hits.length === 1) r.encounter = { reference: `Encounter/${hits[0]!.id}` };
        continue;
      }
    }
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
      // NHI 用藥 has NO 急診 type — an ER visit's prescriptions are labelled
      // 門診 (verified live: 用藥 ori_TYPE_NAME ∈ {門診, 住院, 藥局}). 就醫
      // (IHKE3303), by contrast, classifies that same visit 急診(EMER) from its
      // 檢傷 處置 codes. So an AMB-class med must accept EITHER a 門診(AMB) or a
      // 急診(EMER) same-day gateway; only 住院(IMP) is matched exactly. Without
      // this, ER-prescribed drugs (e.g. 1/28 Molnupiravir) where the gateway is
      // EMER had no AMB to match and stayed unlinked.
      const classHits = cands.filter((e) => {
        const c = (e.class ?? {}).code;
        return visitClass === "IMP" ? c === "IMP" : c === "AMB" || c === "EMER";
      });
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
    // Diagnosis-less resource (lab Observation / report): FIRST try the visit's
    // 檢驗醫令 list (#26 for labs) — link to the visit whose sp_IHKE3302S07/S10
    // listed this lab's NHI 醫令碼. Resolves the 多筆同日同院門診 case the date
    // gateway below cannot: 3 visits share (hospital, date), but only the CKD
    // visit's list carries 09015C/09002C… so the Cr/BUN obs pin THERE. Conservative
    // like #26: link only on a UNIQUE hit; 0 or >1 (lab listed at multiple same-day
    // visits, or no list captured) falls through to the gateway — never strand a
    // lab on an ambiguous order-code match.
    const lCodes = labOrderCodes(r);
    if (lCodes.length > 0) {
      const labHits = cands.filter((e) => {
        const set = labCodesByEnc.get(e);
        return !!set && lCodes.some((c) => set.has(c));
      });
      if (labHits.length === 1) {
        r.encounter = { reference: `Encounter/${labHits[0]!.id}` };
        continue;
      }
    }
    // Date gateway fallback: prefer the single-day gateway visit over the 住院
    // whose span merely starts that day.
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
