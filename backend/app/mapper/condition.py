import hashlib
import re

from app.fhir import systems

# ICD-10-CM canonical form is 'XXX.YYY[A-Z]' (category 3 chars, then
# optional dot + subdivision + optional 7th-character extension).
# NHI 健保 sends codes WITHOUT the dot ('E1122', 'M47892', 'S0993XA',
# 'M19271'). Validator rejects un-dotted codes as 'Unknown code'.
# Normalisation: when no dot is present and code is longer than the
# 3-char category, splice one in after position 3.
_ICD10_CATEGORY_RE = re.compile(r"^[A-Z][0-9A-Z]{2}$")


def _normalize_icd10_cm(code: str) -> str:
    """Insert the dot back into NHI's no-dot ICD-10-CM codes.

    Examples:
        E1122    → E11.22
        M47892   → M47.892
        S0993XA  → S09.93XA
        E11      → E11           (no subdivision; pass through)
        E11.22   → E11.22        (already dotted; pass through)
    """
    if not code or "." in code:
        return code
    s = code.strip().upper()
    if len(s) <= 3:
        return s
    head, tail = s[:3], s[3:]
    if _ICD10_CATEGORY_RE.match(head):
        return f"{head}.{tail}"
    return s


def map_condition(raw: dict, patient_id: str) -> dict:
    """Convert scraped condition dict → FHIR R4 Condition resource."""
    resource: dict = {
        "resourceType": "Condition",
        "id": _stable_id(patient_id, raw.get("code", ""), raw.get("onset_date", "")),
        "meta": {"versionId": "1", "source": "nhi-fhir-bridge/scraper"},
        "subject": {"reference": f"Patient/{patient_id}"},
        "clinicalStatus": {
            "coding": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                    "code": raw.get("clinical_status", "active"),
                }
            ]
        },
        "verificationStatus": {
            "coding": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
                    "code": "confirmed",
                }
            ]
        },
    }

    display = raw.get("display", "Unknown Condition")
    code = raw.get("code")
    system = _map_system(raw.get("system", ""))
    # Normalise ICD-10-CM codes that arrive without the canonical dot
    # so the validator's ValueSet lookup recognises them.
    if system == systems.ICD_10_CM and code:
        code = _normalize_icd10_cm(code)
    resource["code"] = {
        "coding": [{"system": system, "code": code or display, "display": display}],
        "text": display,
    }

    severity = raw.get("severity", "")
    if severity:
        resource["severity"] = {"text": severity}

    if raw.get("onset_date"):
        resource["onsetDateTime"] = raw["onset_date"] + "T00:00:00+08:00"

    return resource


def _stable_id(patient_id: str, *parts: str) -> str:
    key = "|".join([patient_id, *parts])
    return hashlib.sha1(key.encode()).hexdigest()[:32]


def _map_system(system_hint) -> str:
    s = system_hint.lower() if isinstance(system_hint, str) else ""
    if "snomed" in s:
        return systems.SNOMED_CT
    if "icd-10" in s or "icd10" in s:
        # NHI 健保 codes are ICD-10-CM (US/Taiwan extended set —
        # e.g. E11.22 'Type 2 diabetes mellitus with diabetic CKD').
        # The base ICD-10 ValueSet rejects these as 'Unknown code'.
        return systems.ICD_10_CM
    return systems.HIS_LOCAL_CONDITION_CODE
