"""Centralised FHIR CodeSystem / IdentifierSystem URIs used by the mappers.

The TWNHIFHIR validator rejected our previous `urn:oid:nhi.lab.code`-style
strings as 'Invalid OID' because OIDs are sequences of integers (e.g.
`urn:oid:2.16.886.101.20003.20013.20004.6`) — anything with letters
after `urn:oid:` is not a valid OID per RFC 3061.

FHIR permits any absolute URI as `Coding.system` (or `Identifier.system`)
— OIDs are one option, http(s) URLs are another. We choose URL form
because:
  - it doesn't require minting/owning a real NHI/TW core OID,
  - it's self-describing in tools that don't recognise the OID,
  - it cleanly survives the validator's syntactic check.

All systems live here so:
  - the same URI string is used across every mapper, and
  - when an official NHI canonical drops, swap-once-and-done.

Sources reviewed (manually verified):
  - HL7 Taiwan TWCore / TWPAS IGs document canonical URLs for the
    NHI 醫令代碼 (medical order) and 藥品代碼 (drug). The exact
    URLs are publishing-target-specific; we use the form most
    commonly seen in publicly available NHI-aligned profiles.
  - The Taiwan National ID identifier system is published at
    `https://twcore.mohw.gov.tw/IdentifierSystem/national-id`.
"""

# ── NHI national code systems ────────────────────────────────────────
# 健保署醫令代碼 (lab + procedure order codes — same namespace).
NHI_MEDICAL_ORDER_CODE = "https://twcore.mohw.gov.tw/CodeSystem/nhi-medical-order-code"
# 健保署藥品代碼 (drug code).
NHI_DRUG_CODE = "https://twcore.mohw.gov.tw/CodeSystem/nhi-drug-code"

# ── Taiwan patient identifiers ───────────────────────────────────────
# 身分證字號 (national ID — Taiwan citizens have one for life).
TW_NATIONAL_ID = "https://twcore.mohw.gov.tw/IdentifierSystem/national-id"

# ── Local fallbacks (per-deployment, NOT cross-system canonical) ─────
# Used when the source HIS provides a code that has no NHI/national
# mapping — typically院內碼. These are local-scope URLs so any external
# system reading them knows they are NOT interoperable identifiers.
HIS_LOCAL_LAB_CODE = "https://nhi-fhir-bridge.local/CodeSystem/his-local-lab"
HIS_LOCAL_MEDICATION_CODE = "https://nhi-fhir-bridge.local/CodeSystem/his-local-medication"
HIS_LOCAL_REPORT_CODE = "https://nhi-fhir-bridge.local/CodeSystem/his-local-report"
HIS_LOCAL_CONDITION_CODE = "https://nhi-fhir-bridge.local/CodeSystem/his-local-condition"
HIS_LOCAL_PROCEDURE_CODE = "https://nhi-fhir-bridge.local/CodeSystem/his-local-procedure"
HIS_LOCAL_ALLERGEN_CODE = "https://nhi-fhir-bridge.local/CodeSystem/his-local-allergen"
HIS_LOCAL_PATIENT_MRN = "https://nhi-fhir-bridge.local/IdentifierSystem/his-mrn"

# ── International code systems (well-known URIs) ─────────────────────
LOINC = "http://loinc.org"
SNOMED_CT = "http://snomed.info/sct"
# ICD-10-CM is what Taiwan / 健保 actually uses (e.g. E11.22 — diabetic
# nephropathy w/ T2DM). The base ICD-10 ValueSet rejects these as
# 'Unknown code' (cf. validator output for E1122, R42, M47892).
ICD_10_CM = "http://hl7.org/fhir/sid/icd-10-cm"
# ICD-10-PCS for procedures (when applicable). Currently retained for
# procedure mapping where the source explicitly tags PCS.
ICD_10_PCS = "http://hl7.org/fhir/sid/icd-10-pcs"
