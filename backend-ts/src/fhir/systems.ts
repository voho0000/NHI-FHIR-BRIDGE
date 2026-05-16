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

// ── International code systems ───────────────────────────────────────

export const LOINC = "http://loinc.org";
export const SNOMED_CT = "http://snomed.info/sct";
/** ICD-10-CM (Taiwan / 健保 uses this, not bare ICD-10). */
export const ICD_10_CM = "http://hl7.org/fhir/sid/icd-10-cm";
export const ICD_10_PCS = "http://hl7.org/fhir/sid/icd-10-pcs";
