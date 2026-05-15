import hashlib

from app.fhir import systems


# Procedure list rows often look identical to lab / imaging orders: same
# name + date + request_no shape, no description. Only the actual detail
# capture has a note / body_site / report content. Skip rows lacking
# those — the alternative is the SMART app showing 25 "procedures"
# called Mycobacteria culture / Vaginal ultrasound / etc. which are
# clinically wrong.
def map_procedure(raw: dict, patient_id: str) -> dict | None:
    """Convert scraped procedure dict → FHIR R4 Procedure resource.

    Returns None for list-page rows without procedural detail (no note,
    no body site). The caller (extract_and_map) filters these out.
    """
    note = (raw.get("note") or "").strip()
    body_site = (raw.get("body_site") or "").strip()
    if not note and not body_site:
        return None

    display = raw.get("display", "Unknown Procedure")
    code = raw.get("code")
    system = _map_system(raw.get("system", ""))

    resource: dict = {
        "resourceType": "Procedure",
        "id": _stable_id(patient_id, code or display, raw.get("date", "")),
        "meta": {"versionId": "1", "source": "nhi-fhir-bridge/scraper"},
        "status": raw.get("status", "completed"),
        "subject": {"reference": f"Patient/{patient_id}"},
        "code": {
            "coding": [{"system": system, "code": code or display, "display": display}],
            "text": display,
        },
    }

    if raw.get("date"):
        resource["performedDateTime"] = raw["date"] + "T00:00:00+08:00"

    body_site = raw.get("body_site", "")
    if body_site:
        resource["bodySite"] = [{"text": body_site}]

    note = raw.get("note", "")
    if note:
        resource["note"] = [{"text": note}]

    return resource


def _stable_id(patient_id: str, *parts: str) -> str:
    key = "|".join([patient_id, *parts])
    return hashlib.sha1(key.encode()).hexdigest()[:32]


def _map_system(system_hint) -> str:
    s = system_hint.lower() if isinstance(system_hint, str) else ""
    if "snomed" in s:
        return systems.SNOMED_CT
    if "icd" in s:
        return systems.ICD_10_PCS
    return systems.HIS_LOCAL_PROCEDURE_CODE
