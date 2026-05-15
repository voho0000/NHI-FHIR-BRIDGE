import re

from app.fhir import systems

# Taiwan national ID: 1 letter + 9 digits (A123456789). Used to decide
# whether the popup-supplied patient_id should be coded under the
# canonical national-id system or as a local hospital MRN.
_TW_NATIONAL_ID_RE = re.compile(r"^[A-Z][12]\d{8}$")


def _looks_like_tw_national_id(value: str) -> bool:
    return bool(_TW_NATIONAL_ID_RE.match((value or "").strip().upper()))


def map_patient(raw: dict) -> dict:
    """Convert scraped patient dict → FHIR R4 Patient resource."""
    patient_id = str(raw.get("identifier") or raw.get("id") or "unknown")

    # Use `or` (not dict.get default) so explicit None from the LLM also falls
    # back. Local models — and occasionally Claude — sometimes fill schema
    # slots with null instead of omitting the key.
    name_text = raw.get("name") or "Unknown"
    phone = raw.get("phone") or ""
    address = raw.get("address") or ""

    family, given = _split_name(name_text)
    name_entry: dict = {"use": "official", "text": name_text}
    if family:
        name_entry["family"] = family
    if given:
        name_entry["given"] = given

    resource: dict = {
        "resourceType": "Patient",
        "id": patient_id,
        "meta": {"versionId": "1", "source": "nhi-fhir-bridge/scraper"},
        # When the popup's 病人資料 override is filled, patient_id IS
        # the Taiwan national ID — use the TW national-id system.
        # Otherwise the patient_id is a local MRN-shaped value.
        "identifier": [
            {
                "use": "official",
                "system": (
                    systems.TW_NATIONAL_ID
                    if _looks_like_tw_national_id(patient_id)
                    else systems.HIS_LOCAL_PATIENT_MRN
                ),
                "value": patient_id,
            }
        ],
        "name": [name_entry],
        "gender": _map_gender(raw.get("gender")),
    }

    birth_date = raw.get("birthDate")
    if birth_date:
        resource["birthDate"] = birth_date

    if phone:
        resource["telecom"] = [{"system": "phone", "use": "home", "value": phone}]

    if address:
        resource["address"] = [{"use": "home", "text": address}]

    return resource


def _split_name(full_name: str) -> tuple[str, list[str]]:
    """Split a full name into (family, [given]) for FHIR Patient.name.

    SMART apps (and most FHIR consumers) display names from `family` +
    `given`, not from the free-form `text` field. We need to populate
    both even when the HIS only gives us a single string.

    Heuristics:
    - Contains whitespace → Western convention: last token = family, rest = given.
      "John Doe" → ("Doe", ["John"]); "Mary Jane Watson" → ("Watson", ["Mary", "Jane"])
    - Otherwise (CJK names) → first character = family, remainder = given.
      "王小明" → ("王", ["小明"]); "李美華" → ("李", ["美華"])
      Two-character family names (歐陽, 司馬, ...) are rare and not
      auto-detected here; if needed, override raw['name'] before mapping.
    - "Unknown" or empty → ("", [])
    """
    name = (full_name or "").strip()
    if not name or name == "Unknown":
        return ("", [])
    if any(ch.isspace() for ch in name):
        parts = name.split()
        return (parts[-1], parts[:-1])
    # CJK fallback
    return (name[0], [name[1:]]) if len(name) > 1 else (name, [])


def _map_gender(gender) -> str:
    g = gender.lower() if isinstance(gender, str) else ""
    if g in ("male", "m", "男", "男性"):
        return "male"
    if g in ("female", "f", "女", "女性"):
        return "female"
    return "unknown"
