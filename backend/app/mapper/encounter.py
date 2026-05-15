import hashlib

_CLASS_MAP = {
    "AMB": ("http://terminology.hl7.org/CodeSystem/v3-ActCode", "AMB", "ambulatory"),
    "IMP": ("http://terminology.hl7.org/CodeSystem/v3-ActCode", "IMP", "inpatient encounter"),
    "EMER": ("http://terminology.hl7.org/CodeSystem/v3-ActCode", "EMER", "emergency"),
}


def map_encounter(raw: dict, patient_id: str) -> dict:
    """Convert scraped encounter dict → FHIR R4 Encounter resource."""
    enc_class = raw.get("class", "AMB").upper()
    class_entry = _CLASS_MAP.get(enc_class, _CLASS_MAP["AMB"])

    # Stable id includes hospital so same-day visits to different
    # institutions (e.g. morning hospital + afternoon pharmacy) each
    # get their own Encounter. Without it, the second one overwrites
    # the first on upsert and the (hospital, date) linker can't
    # disambiguate.
    resource: dict = {
        "resourceType": "Encounter",
        "id": _stable_id(
            patient_id,
            raw.get("date", ""),
            enc_class,
            (raw.get("hospital") or "").strip(),
        ),
        "meta": {"versionId": "1", "source": "nhi-fhir-bridge/scraper"},
        "status": "finished",
        "class": {
            "system": class_entry[0],
            "code": class_entry[1],
            "display": class_entry[2],
        },
        "subject": {"reference": f"Patient/{patient_id}"},
    }

    # NHI's encounter "type" markers — 'IC卡資料' / '申報資料' / '住院'
    # — are data-origin labels, not SNOMED clinical types. Previous
    # code shoved them into a SNOMED coding which the validator
    # rightfully rejected ('Unknown code "申報資料" in CodeSystem
    # http://snomed.info/sct'). The labels are still useful for
    # downstream filtering, so we keep them as CodeableConcept.text
    # (no coding[]) — preserves the info without claiming SNOMED.
    # '住院' is also already captured in Encounter.class = IMP so
    # the dup is harmless and gives readability to consumers that
    # surface Encounter.type.text in their UI.
    type_display = (raw.get("type_display") or "").strip()
    if type_display:
        resource["type"] = [{"text": type_display}]

    period: dict = {}
    if raw.get("date"):
        period["start"] = raw["date"] + "T00:00:00+08:00"
    if raw.get("end_date"):
        period["end"] = raw["end_date"] + "T00:00:00+08:00"
    if period:
        resource["period"] = period

    department = raw.get("department", "")
    provider = raw.get("provider", "")
    if department or provider:
        participant: dict = {}
        if provider:
            participant["individual"] = {"display": provider}
        resource["participant"] = [participant] if participant else []
        if department:
            resource["serviceType"] = {"text": department}

    # Hospital → Encounter.serviceProvider.display. Required for the
    # post-mapping linker that ties Observations / Medications /
    # DiagnosticReports back to the visit they belong to via
    # (hospital, date) match.
    hospital = (raw.get("hospital") or "").strip()
    if hospital:
        resource["serviceProvider"] = {"display": hospital}

    reason = raw.get("reason", "")
    if reason:
        resource["reasonCode"] = [{"text": reason}]

    discharge = raw.get("discharge_disposition", "")
    if discharge:
        resource["hospitalization"] = {"dischargeDisposition": {"text": discharge}}

    clinical_note = (raw.get("clinical_note") or "").strip()
    if clinical_note:
        resource["note"] = [{"text": clinical_note}]

    return resource


def _stable_id(patient_id: str, *parts: str) -> str:
    key = "|".join([patient_id, *parts])
    return hashlib.sha1(key.encode()).hexdigest()[:32]
