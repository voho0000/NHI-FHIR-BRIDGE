import hashlib
import re

from app.fhir import systems

_CATEGORY_MAP = {
    "LAB": ("http://terminology.hl7.org/CodeSystem/v2-0074", "LAB", "Laboratory"),
    "RAD": ("http://terminology.hl7.org/CodeSystem/v2-0074", "RAD", "Radiology"),
    "CAR": ("http://terminology.hl7.org/CodeSystem/v2-0074", "CAR", "Cardiology"),
    "PATH": ("http://terminology.hl7.org/CodeSystem/v2-0074", "PAT", "Pathology"),
}


# Lab-result patterns that the LLM sometimes mistakenly serializes as a
# DR conclusion when fan-out runs the diagnostic_reports schema over a
# lab page. These are NOT narrative reports — they're single-value lab
# results that already exist as Observations + a proper lab DR. Skipping
# them here avoids noisy duplicate "DR" entries with no result[].
_LAB_UNIT_RE = re.compile(
    r"\d+(?:\.\d+)?\s*(?:%|mg/dL|g/dL|mmol/L|U/L|IU/L|mIU/L|"
    r"ng/mL|μg/dL|ug/dL|pg/mL|fL|/uL|10\^?\d+/uL|"
    r"x10\^?\d+/uL|sec|秒|copies/mL)"
)


def _looks_like_lab_value_only(conclusion: str) -> bool:
    """Heuristic: conclusion is just a single lab value, not a narrative.

    True examples (should be filtered out → return True):
      "醣化血紅素 5.9%（參考值：4-6%）"            (lab value as sentence)
      "Hemoglobin 14.2 g/dL"                     (single result)
      "WBC 4.1 x10^3/uL ; reference 4-10"         (one-liner)

    False examples (legit narrative reports → keep → return False):
      "Conjunctiva: mild congested OU. Cornea: clear OU. Anterior Chamber:
       silent and formed OU…" (multi-clause OCT report)
      "PVD with Weiss ring OS; fine ERM OS." (still narrative-ish)
    """
    if not conclusion:
        return True
    text = conclusion.strip()
    # Real narrative reports almost always contain multiple sentences.
    if len(text) > 100:
        return False
    # Single value pattern + parenthetical reference range = lab line.
    if _LAB_UNIT_RE.search(text):
        # Reject only if the text is short; long radiology reports may also
        # mention numeric findings but they have lots of other content.
        return True
    return False


def map_diagnostic_report(raw: dict, patient_id: str) -> dict | None:
    """Convert scraped diagnostic report dict → FHIR R4 DiagnosticReport resource.

    Returns None when:
      - row has no conclusion (list-page item)
      - category=LAB and conclusion is just a single lab value (would be a
        duplicate of the proper Observation/lab DR)
    """
    conclusion = (raw.get("conclusion") or "").strip()
    if not conclusion:
        return None

    cat_key_raw = (raw.get("category") or "").upper()
    if cat_key_raw == "LAB" and _looks_like_lab_value_only(conclusion):
        return None

    display = raw.get("display", "Unknown Report")
    code = raw.get("code")
    system_hint = raw.get("system") or ""
    system = (
        systems.LOINC
        if isinstance(system_hint, str) and system_hint.upper() == "LOINC"
        else systems.HIS_LOCAL_REPORT_CODE
    )

    resource: dict = {
        "resourceType": "DiagnosticReport",
        "id": _stable_id(patient_id, code or display, raw.get("date", "")),
        "meta": {"versionId": "1", "source": "nhi-fhir-bridge/scraper"},
        "status": raw.get("status", "final"),
        "subject": {"reference": f"Patient/{patient_id}"},
        "code": {
            "coding": [{"system": system, "code": code or display, "display": display}],
            "text": display,
        },
        "conclusion": conclusion,
    }

    cat_entry = _CATEGORY_MAP.get(cat_key_raw)
    if cat_entry:
        cat_sys, cat_code, cat_display = cat_entry
        resource["category"] = [
            {"coding": [{"system": cat_sys, "code": cat_code, "display": cat_display}]}
        ]

    # effectiveDateTime = clinically relevant time (when the exam was
    # performed). issued = when the report was finalised. NHI's
    # IHKE3408S02 separates these (func_DATE vs assay_UPLOAD_DATE);
    # when only `date` is available we fill both fields with it.
    if raw.get("date"):
        resource["effectiveDateTime"] = raw["date"] + "T00:00:00+08:00"
    if raw.get("issued"):
        resource["issued"] = raw["issued"] + "T00:00:00+08:00"
    elif raw.get("date"):
        resource["issued"] = raw["date"] + "T00:00:00+08:00"

    # Performer (hospital where the exam was done). Required for the
    # post-mapping encounter linker — without it, imaging DRs from NHI
    # land with performer=? and the (hospital, date) join can't fire.
    hospital = (raw.get("hospital") or "").strip()
    if hospital:
        resource["performer"] = [{"display": hospital}]

    return resource


def _stable_id(patient_id: str, *parts: str) -> str:
    key = "|".join([patient_id, *parts])
    return hashlib.sha1(key.encode()).hexdigest()[:32]
