import hashlib

from app.fhir import systems


def map_allergy_intolerance(raw: dict, patient_id: str) -> dict:
    """Convert scraped allergy dict → FHIR R4 AllergyIntolerance resource."""
    display = raw.get("display", "Unknown Allergen")
    code = raw.get("code")
    system = _map_system(raw.get("system", ""))

    resource: dict = {
        "resourceType": "AllergyIntolerance",
        "id": _stable_id(patient_id, code or display, raw.get("recorded_date", "")),
        "meta": {"versionId": "1", "source": "nhi-fhir-bridge/scraper"},
        "patient": {"reference": f"Patient/{patient_id}"},
        "clinicalStatus": {
            "coding": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
                    "code": "active",
                }
            ]
        },
        "verificationStatus": {
            "coding": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
                    "code": "confirmed",
                }
            ]
        },
        "code": {
            "coding": [{"system": system, "code": code or display, "display": display}],
            "text": display,
        },
    }

    category = raw.get("category", "")
    if category in ("medication", "food", "environment", "biologic"):
        resource["category"] = [category]

    criticality = raw.get("criticality", "")
    if criticality in ("high", "low", "unable-to-assess"):
        resource["criticality"] = criticality

    if raw.get("recorded_date"):
        resource["recordedDate"] = raw["recorded_date"] + "T00:00:00+08:00"

    reaction_note = raw.get("reaction", "")
    if reaction_note:
        resource["reaction"] = [{"description": reaction_note}]

    return resource


def _stable_id(patient_id: str, *parts: str) -> str:
    key = "|".join([patient_id, *parts])
    return hashlib.sha1(key.encode()).hexdigest()[:32]


def _map_system(system_hint) -> str:
    s = system_hint.lower() if isinstance(system_hint, str) else ""
    if "snomed" in s:
        return systems.SNOMED_CT
    if "rxnorm" in s:
        return "http://www.nlm.nih.gov/research/umls/rxnorm"
    return systems.HIS_LOCAL_ALLERGEN_CODE
