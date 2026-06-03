/**
 * Centralised FHIR CodeSystem / IdentifierSystem URIs used by the mappers.
 *
 * Port of `backend/app/fhir/systems.py`. We use URL-form systems instead
 * of OIDs because:
 *   - it doesn't require minting/owning a real NHI/TW core OID,
 *   - it's self-describing in tools that don't recognise the OID,
 *   - it cleanly survives the TWNHIFHIR validator's syntactic check.
 *
 * All systems live here so a single change ripples to every mapper.
 */

// ── NHI national code systems ────────────────────────────────────────

/** 健保署醫令代碼 (lab + procedure order codes — same namespace). */
export const NHI_MEDICAL_ORDER_CODE =
  "https://twcore.mohw.gov.tw/CodeSystem/nhi-medical-order-code";

/** 健保署藥品代碼 (drug code). */
export const NHI_DRUG_CODE = "https://twcore.mohw.gov.tw/CodeSystem/nhi-drug-code";

// ── Taiwan patient identifiers ───────────────────────────────────────

/** 身分證字號 (Taiwan national ID). */
export const TW_NATIONAL_ID = "https://twcore.mohw.gov.tw/IdentifierSystem/national-id";

// ── Local fallbacks (per-deployment, NOT cross-system canonical) ─────

export const HIS_LOCAL_LAB_CODE = "https://nhi-fhir-bridge.local/CodeSystem/his-local-lab";
export const HIS_LOCAL_MEDICATION_CODE =
  "https://nhi-fhir-bridge.local/CodeSystem/his-local-medication";
export const HIS_LOCAL_REPORT_CODE = "https://nhi-fhir-bridge.local/CodeSystem/his-local-report";
export const HIS_LOCAL_CONDITION_CODE =
  "https://nhi-fhir-bridge.local/CodeSystem/his-local-condition";
export const HIS_LOCAL_PROCEDURE_CODE =
  "https://nhi-fhir-bridge.local/CodeSystem/his-local-procedure";
export const HIS_LOCAL_ALLERGEN_CODE =
  "https://nhi-fhir-bridge.local/CodeSystem/his-local-allergen";
export const HIS_LOCAL_PATIENT_MRN = "https://nhi-fhir-bridge.local/IdentifierSystem/his-mrn";

// ── Bridge-defined Encounter dimensions (v0.9.2+) ────────────────────
//
// NHI encounters carry two independent classification dimensions:
//   • kind     — 門診 / 急診 / 住院 / 藥局         (clinical visit type)
//   • channel  — IC卡資料 / 申報資料               (NHI data origin)
//
// FHIR's `Encounter.type` is 0..* CodeableConcept with no positional
// semantics, so we tag each entry with its own `coding.system` to make
// the dimension self-describing. Consumers should look up entries via
//   encounter.type.find(t => t.coding[0].system === ENCOUNTER_KIND_SYSTEM)
// rather than relying on array index. This keeps the contract
// FHIR-conformant (any standards-compliant SMART app can parse it
// without needing to know our private array-order convention).

/** Bridge-defined kind dimension on Encounter.type. */
export const ENCOUNTER_KIND_SYSTEM =
  "https://nhi-fhir-bridge.github.io/CodeSystem/encounter-kind";

/** Bridge-defined channel (data origin) dimension on Encounter.type. */
export const ENCOUNTER_CHANNEL_SYSTEM =
  "https://nhi-fhir-bridge.github.io/CodeSystem/encounter-channel";

// ── Bridge-defined CarePlan programme code (v0.14.0+) ────────────────
//
// NHI 我參與的照護計畫 (IHKE3213S01) rows carry an optional `prgcode`
// (e.g. "IHKE3505S01") identifying the NHI case-management programme.
// There's no published terminology for these, so we surface them under
// a bridge-defined CodeSystem on CarePlan.category[].coding[].system —
// self-describing, doesn't collide with clinical category codes, and
// queryable without owning a real NHI OID. The programme NAME itself
// rides on CarePlan.title (verbatim from NHI), so consumers that don't
// recognise the code still get the human-readable label.
export const NHI_CARE_PLAN_PROGRAM =
  "https://nhi-fhir-bridge.github.io/CodeSystem/nhi-care-plan-program";

// ── International code systems ───────────────────────────────────────

export const LOINC = "http://loinc.org";
export const SNOMED_CT = "http://snomed.info/sct";
/** ICD-10-CM (Taiwan / 健保 uses this, not bare ICD-10). */
export const ICD_10_CM = "http://hl7.org/fhir/sid/icd-10-cm";
export const ICD_10_PCS = "http://hl7.org/fhir/sid/icd-10-pcs";
