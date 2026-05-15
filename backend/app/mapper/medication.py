import hashlib
import re
from collections import OrderedDict
from datetime import date, timedelta

from app.fhir import systems
from app.mapper.condition import _normalize_icd10_cm


def _med_status(authored_iso: str, duration_days) -> str:
    """Best-effort active vs completed decision for a MedicationRequest.

    NHI 健保存摺 gives us authored date (ROC date converted upstream to ISO)
    and `order_drug_day` — total days supplied. The medication is
    "active" while  authored_date + duration > today  ; otherwise the
    prescription's supply has run out and we mark it "completed".

    When duration is missing or unparseable we treat anything older than
    90 days as completed — typical refill cadence — and anything more
    recent as active, since most patients are still on the drug.
    Conservative defaults so the SMART app's "current medications" view
    doesn't surface year-old prescriptions as if they're current.
    """
    if not authored_iso:
        return "completed"
    try:
        d = date.fromisoformat(authored_iso[:10])
    except (ValueError, TypeError):
        return "completed"
    try:
        days = int(duration_days) if duration_days not in (None, "") else None
    except (ValueError, TypeError):
        days = None
    if days is None:
        days = 90  # heuristic supply window when NHI didn't tell us
    today = date.today()
    end = d + timedelta(days=days)
    return "active" if end >= today else "completed"


def map_medications_dedup(raw_items: list[dict], patient_id: str) -> list[dict]:
    """Group-aware medication mapper that dedupes 中英 雙語 duplicates.

    NHI 健康存摺's 用藥紀錄 lists the SAME prescription multiple times because
    each drug is reported in 3 formats by different data sources:
      - "TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION"           (English only)
      - "TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION (青眼露…)" (Eng + 中)
      - "青眼露… (TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION)" (中 + Eng)
    The current backend creates one MedicationRequest per row → 3x duplicates
    per drug per visit.

    Strategy:
      1. Compute a canonical key per drug name (longest English chunk after
         stripping parens and casefolding). All three formats above collapse
         to the same key.
      2. Group by (date, canonical_key). For each group, keep ONE entry,
         preferring the name with the most CJK characters (Chinese display
         is what clinicians read).
      3. Map each kept entry through map_medication_request.

    Falls back gracefully — drugs with no English component (rare for NHI)
    use their full name as the key, so different drugs don't collide.
    """
    by_key: OrderedDict[tuple, dict] = OrderedDict()
    for item in raw_items:
        if not isinstance(item, dict):
            continue
        drug_name = (item.get("drug_name") or "").strip()
        if not drug_name:
            continue
        date = (item.get("date") or "")[:10]
        key = (date, _canonical_drug_key(drug_name))
        existing = by_key.get(key)
        if existing is None:
            by_key[key] = item
        else:
            # Prefer the English form (fewer CJK characters). Clinicians
            # read prescriptions in English brand names (TIMOPTOL, XYZAL,
            # CURAM) — the Chinese 商品名 appended in parens is verbose
            # and adds little when scanning a med list.
            if _cjk_chars(drug_name) < _cjk_chars(existing.get("drug_name", "")):
                by_key[key] = item

    out: list[dict] = []
    for item in by_key.values():
        m = map_medication_request(item, patient_id)
        if m is not None:
            out.append(m)
    return out


def _cjk_chars(s: str) -> int:
    return sum(1 for c in (s or "") if "一" <= c <= "鿿")


# Match a "long" English chunk (≥4 chars of A-Z/0-9/punctuation common to
# drug names). Avoid matching short tokens like "D" or "PO" that appear
# inside Chinese names.
_EN_CHUNK = re.compile(r"[A-Z][A-Z0-9.%/\-\"'\s]{3,}")


def _canonical_drug_key(name: str) -> str:
    """Reduce a drug-name string to a stable canonical key.

    Strategy: extract the longest English fragment, then truncate at
    common separators (" - ", " / ") so a name with extra trailing
    modifiers still collapses to the brand+strength prefix.

    Examples (all map to the same key):
      "TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION"
      "TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION (青眼露…)"
      "青眼露… (TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION)"
      → "timoptol xe 0.5% ophthalmic solution"

      "FLUCASON OPHTHALMIC SUSPENSION 0.02% (FLUOROMETHOLONE)"
      "護康視懸濁點眼液 0.02% (FLUCASON OPHTHALMIC SUSPENSION 0.02% - FLUOROMETHOLONE)"
      → "flucason ophthalmic suspension 0.02%"
    """
    s = (name or "").upper()
    chunks = _EN_CHUNK.findall(s)
    if not chunks:
        return (name or "").strip().lower()
    longest = max(chunks, key=len).strip()
    # Drop trailing dashed/slashed modifiers (typically the generic name
    # appended after the brand+strength).
    for sep in (" - ", " – ", " / "):
        if sep in longest:
            longest = longest.split(sep)[0]
    return re.sub(r"\s+", " ", longest).lower().strip()


def map_medication_request(raw: dict, patient_id: str) -> dict | None:
    """Convert scraped prescription dict → FHIR R4 MedicationRequest resource.

    Returns None when the raw item has no drug name (e.g. a ghost entry
    extracted from a visit header or a non-drug order row) so the caller
    can filter it out.
    """
    drug_name = (raw.get("drug_name") or "").strip()
    if not drug_name:
        return None  # skip visit-header / non-drug-order ghost entries

    # Use canonical key (not raw drug_name) for the stable id so the three
    # NHI 中英 variants of the same drug collapse to one FHIR resource even
    # when they arrive in separate /sync/upload-html POSTs.
    med_id = _stable_id(patient_id, _canonical_drug_key(drug_name), raw.get("date", ""))

    # Prefer the actual prescription code (e.g. NHI 健保藥品代碼 "BC23792100")
    # over reusing the display name as a code. The HIS-specific OID lets
    # downstream tools recognise the namespace.
    drug_code = (raw.get("code") or "").strip()
    coding = {
        "system": systems.NHI_DRUG_CODE if drug_code else systems.HIS_LOCAL_MEDICATION_CODE,
        "code": drug_code or drug_name,
        "display": drug_name,
    }

    resource: dict = {
        "resourceType": "MedicationRequest",
        "id": med_id,
        "meta": {"versionId": "1", "source": "nhi-fhir-bridge/scraper"},
        "status": _med_status(raw.get("date", ""), raw.get("duration_days")),
        "intent": "order",
        "medicationCodeableConcept": {
            "coding": [coding],
            "text": drug_name,
        },
        "subject": {"reference": f"Patient/{patient_id}"},
    }

    if raw.get("date"):
        resource["authoredOn"] = raw["date"] + "T00:00:00+08:00"

    # ATC-style drug class (NHI's `act` field — "ANTIHISTAMINE DRUGS" etc.).
    # FHIR puts pharmacological class on MedicationRequest.category.
    drug_class = (raw.get("drug_class") or "").strip()
    if drug_class:
        resource["category"] = [{"text": drug_class}]

    # Hospital/院所 → MedicationRequest.requester.display. NHI's data is
    # billing-tracked: the hospital that submitted the medication claim
    # is the prescriber+dispenser (for outpatient meds in healthcare-bank
    # context the two are the same). Setting this is also how the
    # post-mapping linker finds the matching Encounter by (hospital, date).
    hospital = (raw.get("hospital") or "").strip()
    if hospital:
        resource["requester"] = {"display": hospital}

    # Dosage instruction — only emit when the source actually gave us
    # dose / frequency / route. NHI's medication-list endpoint provides
    # none of these (only qty + duration on dispenseRequest), so for
    # NHI-sourced data this block stays empty. Other HIS adapters that
    # populate these fields still get a structured dosage out.
    dosage: dict = {}
    parts = [str(raw[k]) for k in ("dose", "unit", "frequency") if raw.get(k)]
    if parts:
        dosage["text"] = " ".join(parts)
    if raw.get("route"):
        dosage["route"] = {
            "coding": [{"system": "http://snomed.info/sct", "display": raw["route"]}]
        }
    if dosage:
        resource["dosageInstruction"] = [dosage]

    # dispenseRequest now carries BOTH the total quantity and the supply
    # duration when NHI gives us both — previously we only kept duration.
    # No unit on quantity: NHI doesn't tell us whether 14 is tablets,
    # capsules, mL, etc. — adding "{tablet}" would be a fabrication.
    dr: dict = {}
    qty_raw = raw.get("quantity")
    if qty_raw not in (None, ""):
        try:
            dr["quantity"] = {"value": float(str(qty_raw).replace(",", ""))}
        except (ValueError, TypeError):
            pass
    if raw.get("duration_days"):
        try:
            days = int(raw["duration_days"])
            dr["expectedSupplyDuration"] = {
                "value": days,
                "unit": "days",
                "system": "http://unitsofmeasure.org",
                "code": "d",
            }
        except (ValueError, TypeError):
            pass
    if dr:
        resource["dispenseRequest"] = dr

    # Indication: prefer the structured ICD code when present, fall back
    # to the free-text name. Both arrive from NHI as separate fields:
    # icd9cm_CODE → indication_code, icd9cm_CODE_CNAME → indication.
    indication = (raw.get("indication") or "").strip()
    indication_code = (raw.get("indication_code") or "").strip()
    if indication or indication_code:
        rc: dict = {}
        if indication_code:
            rc["coding"] = [
                {
                    # NHI's indication codes are ICD-10-CM (e.g. E11.22), not
                    # the base ICD-10 ValueSet — switching the system URL
                    # so the validator's terminology lookup resolves correctly.
                    # Also normalise NHI's no-dot form ('E1122' → 'E11.22')
                    # to match the canonical ValueSet.
                    "system": systems.ICD_10_CM,
                    "code": _normalize_icd10_cm(indication_code),
                    "display": indication or indication_code,
                }
            ]
        if indication:
            rc["text"] = (
                f"{indication_code} {indication}".strip() if indication_code else indication
            )
        resource["reasonCode"] = [rc]

    return resource


def _stable_id(patient_id: str, *parts: str) -> str:
    key = "|".join([patient_id, *parts])
    return hashlib.sha1(key.encode()).hexdigest()[:32]
