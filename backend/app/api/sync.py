import logging
import re
from datetime import UTC, datetime
from typing import Optional

from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.security import require_sync_api_key as _require_sync_api_key
from app.models.fhir_store import AuditLog, SyncLog

router = APIRouter(prefix="/sync", tags=["Sync"])
logger = logging.getLogger(__name__)


# Regex extractors for the HIS user identifier shown in the captured HTML's
# navbar. We deliberately avoid generic English patterns like "user:..."
# because inlined JS may contain variable assignments such as
# `userid: TRAID,` that would otherwise match against JS code rather than
# UI text.
_HIS_USER_PATTERNS = (
    re.compile(r"使用者[:：]\s*([A-Za-z0-9_\-]+)"),
    re.compile(r"操作人員[:：]\s*([A-Za-z0-9_\-]+)"),
)


def _parse_his_user(html: str) -> Optional[str]:
    """Extract the logged-in HIS user identifier from the captured HTML.

    Returns None when no recognized pattern is found. The HIS user is what
    we record in the audit log — it's the only identity signal we have
    for /sync/upload-html, since the backend itself doesn't authenticate
    callers in the POC.

    We scan the full HTML and reject matches that look like JS comments
    (line starts with `//`) to avoid false positives from stylized source
    comments such as `// 使用者帳號`.
    """
    if not html:
        return None
    for rx in _HIS_USER_PATTERNS:
        for m in rx.finditer(html):
            # Reject JS comment / source-code occurrences
            line_start = html.rfind("\n", 0, m.start()) + 1
            line_prefix = html[line_start : m.start()]
            if line_prefix.lstrip().startswith("//"):
                continue
            return m.group(1)
    return None


class PatientOverride(BaseModel):
    """Manually-entered patient identity from the extension popup.

    NHI 健康存摺 doesn't always expose the user's national ID + name in a
    way the LLM can extract reliably (some pages use images / get stripped
    by preprocessor). When the user fills these in extension-side, we trust
    them as the canonical Patient identity and skip LLM extraction for
    patient_info pages.
    """

    id_no: Optional[str] = None  # 身分證 — becomes Patient.id
    name: Optional[str] = None  # 姓名
    birth_date: Optional[str] = None  # YYYY-MM-DD
    gender: Optional[str] = None  # male / female / 男 / 女


class UploadHTMLPayload(BaseModel):
    page_type: str = Field(
        ...,
        description="One of: patient_info, observations, medications, conditions, "
        "allergies, diagnostic_reports, procedures, encounters",
    )
    html: str = Field(..., description="Raw outerHTML of the HIS page")
    patient_id: Optional[str] = Field(
        None,
        description="Required for all page_types except patient_info "
        "(Patient resource carries its own ID).",
    )
    host: Optional[str] = Field(
        None,
        description="HIS hostname (e.g. 'myhealthbank.nhi.gov.tw'). When set "
        "to the NHI host, the backend strips vendor cruft from the HTML "
        "before sending it to the LLM. Optional.",
    )
    patient_override: Optional[PatientOverride] = Field(
        None,
        description="Manually-entered patient identity from the extension. "
        "When id_no is set: takes precedence over LLM-extracted patient_id "
        "for ALL pages, AND bypasses LLM extraction on patient_info pages "
        "(builds Patient resource from these fields directly). For other "
        "pages, ensures the Patient resource exists in FHIR before "
        "downstream resources reference it.",
    )


# Resources that legitimately carry an `encounter` reference in FHIR R4.
# AllergyIntolerance uses `encounter` too, Condition uses `encounter`,
# DiagnosticReport / Observation / MedicationRequest / Procedure all do.
_ENCOUNTER_LINKABLE = {
    "Observation",
    "MedicationRequest",
    "DiagnosticReport",
    "Procedure",
    "Condition",
    "AllergyIntolerance",
}


def _resource_date(r: dict) -> str:
    """Pull the clinically-relevant date out of any resource type — the
    first field that looks like an ISO date wins. Returns just the
    YYYY-MM-DD portion."""
    for key in (
        "effectiveDateTime",
        "authoredOn",
        "performedDateTime",
        "onsetDateTime",
        "recordedDate",
        "issued",
    ):
        v = r.get(key)
        if v:
            return str(v)[:10]
    # effectivePeriod / performedPeriod fall back to .start
    for key in ("effectivePeriod", "performedPeriod"):
        period = r.get(key)
        if isinstance(period, dict) and period.get("start"):
            return str(period["start"])[:10]
    return ""


def _resource_hospital(r: dict) -> str:
    """Hospital name as it appears on the resource. Different FHIR resources
    park the institution on different slots:
      - Observation, DiagnosticReport, Procedure → performer[*].display
      - MedicationRequest → requester.display (no `performer` field
        on R4 MedicationRequest; the prescriber/院所 lives on requester)
      - Encounter → serviceProvider.display (but we don't link encounters
        to themselves so this path is moot here)
    """
    for p in r.get("performer") or []:
        d = (p or {}).get("display", "")
        if d:
            return d
    req = r.get("requester") or {}
    if isinstance(req, dict) and req.get("display"):
        return req["display"]
    return ""


def _dedup_admission_day_amb(resources: list[dict]) -> list[dict]:
    """Drop AMB Encounters whose (hospital, start_date) is already covered
    by an IMP Encounter's admission day.

    NHI emits the same inpatient stay twice: once via IHKE3303 as an
    AMB billing entry on the admission day (no period.end), and once
    via IHKE3309 with the full IMP period (start = admission day,
    end = discharge day). The IMP one is the canonical encounter; the
    AMB one is a billing artefact of the same visit.

    Without this pass the (hospital, date) linker sees both candidates
    for any lab drawn on the admission day, refuses to link due to
    ambiguity, and the entire admission's labs end up unlinked.
    """
    imp_starts: set[tuple[str, str]] = set()
    for r in resources:
        if r.get("resourceType") != "Encounter":
            continue
        if (r.get("class") or {}).get("code") != "IMP":
            continue
        hosp = (r.get("serviceProvider") or {}).get("display", "")
        start = ((r.get("period") or {}).get("start") or "")[:10]
        if hosp and start:
            imp_starts.add((hosp, start))
    if not imp_starts:
        return resources
    out: list[dict] = []
    for r in resources:
        if r.get("resourceType") == "Encounter" and (r.get("class") or {}).get("code") == "AMB":
            hosp = (r.get("serviceProvider") or {}).get("display", "")
            start = ((r.get("period") or {}).get("start") or "")[:10]
            if (hosp, start) in imp_starts:
                continue
        out.append(r)
    return out


async def _link_encounters_in_resources(
    db: AsyncSession,
    patient_id: str,
    resources: list[dict],
) -> None:
    """Mutate `resources` in place: add `encounter` reference where we
    can confidently match the resource's (hospital, date) to an existing
    Encounter for the same patient.

    Strategy is intentionally conservative — we only link when the
    (hospital, date) tuple matches exactly ONE Encounter. If there are
    zero matches (lab arrived from a hospital we don't have an Encounter
    for) or multiple (rare same-day double-visit), we leave the resource
    unlinked rather than guess.

    Why this lives at upload-time and not in the mapper: mappers don't
    have DB access, and at sync time encounters always upload BEFORE
    observations/medications/imaging (extension's runNhiApiSync
    iterates NHI_API_ENDPOINTS in registry order, with encounters
    first). So by the time we run, Encounters are already in the DB.
    """
    from app.fhir.server import fhir_server

    encounters = await fhir_server.search(db, "Encounter", {"patient": patient_id})
    if not encounters:
        return
    # Exact (hospital, date) index — used for outpatient AMB visits where
    # the resource's date should match the encounter's period.start.
    exact_index: dict[tuple[str, str], list[str]] = {}
    # Per-hospital list of (start, end, id) for IMP encounters — used for
    # period-interval matching: inpatient lab executed mid-stay where
    # exe_date is between admission and discharge. period.end is the
    # discharge date (NHI's out_DATE → encounter mapper sets it).
    imp_by_hosp: dict[str, list[tuple[str, str, str]]] = {}
    for e in encounters:
        hosp = (e.get("serviceProvider") or {}).get("display", "")
        start = ((e.get("period") or {}).get("start") or "")[:10]
        if not hosp or not start:
            continue
        exact_index.setdefault((hosp, start), []).append(e["id"])
        cls = (e.get("class") or {}).get("code", "")
        if cls == "IMP":
            end = ((e.get("period") or {}).get("end") or "")[:10]
            if end:
                imp_by_hosp.setdefault(hosp, []).append((start, end, e["id"]))
    if not exact_index and not imp_by_hosp:
        return
    for r in resources:
        if r.get("resourceType") not in _ENCOUNTER_LINKABLE:
            continue
        if r.get("encounter") or r.get("context"):  # already linked
            continue
        hosp = _resource_hospital(r)
        date = _resource_date(r)
        if not hosp or not date:
            continue
        # 1. Exact (hospital, date) match — outpatient ambulatory case.
        candidates = exact_index.get((hosp, date)) or []
        # 2. If no exact match, look for an IMP encounter at the same
        #    hospital whose period contains this date. Lab dates DURING
        #    a hospitalisation (in_DATE ≤ exe_date ≤ out_DATE) reflect
        #    real NHI billing data, not inference — the hospital itself
        #    reported the admission with discharge date.
        if not candidates:
            for start, end, eid in imp_by_hosp.get(hosp, []):
                if start <= date <= end:
                    candidates.append(eid)
        if not candidates or len(candidates) > 1:
            continue
        r["encounter"] = {"reference": f"Encounter/{candidates[0]}"}


async def _resolve_sex_stratified_ranges(
    db: AsyncSession,
    patient_id: str,
    resources: list[dict],
) -> None:
    """When an Observation carries multiple referenceRange entries tagged
    with appliesTo[*].coding.code in {male, female}, pick the one that
    matches the patient's gender and re-derive interpretation against it.

    Without this, the SMART app receives a list of sex-stratified ranges
    and has to do gender-aware Layer A itself — defeating the point of
    deriving interpretation centrally. By the time this runs the Patient
    resource is already in the DB (extension always sends patient_info /
    builds an override Patient before downstream uploads).
    """
    from app.fhir.server import fhir_server
    from app.mapper.observation import _derive_interpretation

    patient = await fhir_server.read(db, "Patient", patient_id)
    if not patient:
        return
    gender = (patient.get("gender") or "").lower()
    if gender not in ("male", "female"):
        # `other` / `unknown` / missing — can't pick, leave the array as-is.
        return

    for r in resources:
        if r.get("resourceType") != "Observation":
            continue
        rrs = r.get("referenceRange") or []
        if len(rrs) < 2:
            continue
        # Find the entry whose appliesTo matches the patient's gender.
        match = None
        for entry in rrs:
            for ap in entry.get("appliesTo") or []:
                for c in ap.get("coding") or []:
                    if (c.get("code") or "").lower() == gender:
                        match = entry
                        break
                if match:
                    break
            if match:
                break
        if not match:
            continue
        # Replace referenceRange with just the matching entry; keep the
        # appliesTo so downstream still knows which sex it applies to.
        r["referenceRange"] = [match]
        # Re-derive interpretation against the correct range.
        new_interp = _derive_interpretation(
            str((r.get("valueQuantity") or {}).get("value", "")) or (r.get("valueString") or ""),
            r.get("valueQuantity"),
            match,
        )
        if new_interp:
            r["interpretation"] = [{"coding": [new_interp]}]


@router.get("/status/{log_id}")
async def get_status(log_id: str, db: AsyncSession = Depends(get_db)):
    log = await db.get(SyncLog, log_id)
    if not log:
        raise HTTPException(404, "Log not found")
    return _log_to_dict(log)


@router.get("/logs")
async def list_logs(db: AsyncSession = Depends(get_db)):
    rows = (
        (await db.execute(select(SyncLog).order_by(SyncLog.created_at.desc()).limit(20)))
        .scalars()
        .all()
    )
    return [_log_to_dict(r) for r in rows]


@router.post("/log")
async def write_sync_log(
    payload: dict = Body(...),
    db: AsyncSession = Depends(get_db),
    _: None = Depends(_require_sync_api_key),
):
    """Record one completed NHI sync as a SyncLog row.

    The extension calls this at the END of a sync (success or partial)
    so the dashboard can show a richer Sync History — patient identity,
    elapsed time, per-endpoint breakdown, date range covered. Details
    are JSON-encoded into the existing `message` text column so no
    schema migration is needed; the dashboard parses it on read.

    Expected payload:
        {
          "status":         "success" | "partial" | "failed",
          "patient_id":     "A123456789",
          "patient_name":   "陳阿貴",            # optional
          "total":          1861,
          "breakdown":      ["encounters=12/12", ...],
          "date_range":     "最近 3 年",         # human label, optional
          "elapsed_ms":     104232,
          "started_at":     "2026-05-15T05:23:11Z"  # ISO, optional
        }
    """
    import json

    now = datetime.now(UTC).replace(tzinfo=None)
    # Trust client-provided started_at when present so the row's
    # created_at reflects the actual sync start, not the moment we
    # received the log POST (which is a few hundred ms later).
    started = now
    if payload.get("started_at"):
        try:
            started = datetime.fromisoformat(payload["started_at"].replace("Z", "+00:00")).replace(
                tzinfo=None
            )
        except Exception:
            pass
    details = {
        "patient_name": payload.get("patient_name") or "",
        "total": int(payload.get("total") or 0),
        "breakdown": list(payload.get("breakdown") or []),
        "date_range": payload.get("date_range") or "",
        "elapsed_ms": int(payload.get("elapsed_ms") or 0),
        "errors": list(payload.get("errors") or []),
    }
    log = SyncLog(
        status=str(payload.get("status") or "success"),
        patient_id=payload.get("patient_id") or None,
        message=json.dumps(details, ensure_ascii=False),
        created_at=started,
        completed_at=now,
    )
    db.add(log)
    await db.commit()
    return {"id": log.id}


@router.get("/patient-states")
async def list_patient_states(db: AsyncSession = Depends(get_db)):
    """Return the last_synced_at timestamp for every known patient.

    Useful for the extension to decide which patients need re-syncing.
    """
    from app.models.fhir_store import PatientSyncState

    rows = (await db.execute(select(PatientSyncState))).scalars().all()
    return [
        {
            "patient_id": r.patient_id,
            "last_synced_at": r.last_synced_at.isoformat() if r.last_synced_at else None,
            "sync_log_id": r.sync_log_id,
        }
        for r in rows
    ]


@router.delete("/logs")
async def clear_logs(db: AsyncSession = Depends(get_db)):
    """Clear all completed sync history. In-flight (status=running) logs are
    kept so the dashboard can still poll them."""
    from sqlalchemy import delete

    result = await db.execute(delete(SyncLog).where(SyncLog.status != "running"))
    await db.commit()
    return {"deleted": result.rowcount}


@router.delete("/logs/{log_id}")
async def delete_log(log_id: str, db: AsyncSession = Depends(get_db)):
    """Delete one sync history row by ID. Used by the dashboard's per-row
    ✕ button. Idempotent: deleting a non-existent ID is a 404."""
    log = await db.get(SyncLog, log_id)
    if not log:
        raise HTTPException(404, f"Sync log {log_id} not found")
    await db.delete(log)
    await db.commit()
    return {"deleted": 1}


@router.delete("/patient/{patient_id}")
async def wipe_patient(
    patient_id: str,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(_require_sync_api_key),
):
    """Delete every FHIR resource referencing this patient.

    Use case: stale data accumulates when an earlier sync produced
    Observations/MedicationRequests with display names that didn't match
    the canonical synonym map at the time, so they got different stable
    IDs than fresh syncs would produce now. A clean re-sync after this
    wipe gives you the actual current state.

    Matches three patterns: Patient.id == patient_id, OR any field whose
    JSON contains "Patient/<patient_id>" (subject, performer, recorder…).
    """
    from sqlalchemy import delete, or_, text

    from app.models.fhir_store import FHIRResource

    # Escape SQL LIKE metacharacters (% and _) in the patient_id so a TW
    # national ID containing them (unlikely but contractually possible —
    # the format only locks down structure, not literal codepoints) can't
    # widen the deletion to other patients' rows.
    safe_ref = f"Patient/{patient_id}".replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
    result = await db.execute(
        delete(FHIRResource).where(
            or_(
                # Patient resource itself
                (FHIRResource.resource_type == "Patient") & (FHIRResource.fhir_id == patient_id),
                # Any resource whose JSON references the patient. SQLite
                # stores JSON as TEXT so a simple LIKE on the dumped JSON
                # is fine; for Postgres we'd switch to JSONB ops.
                text("CAST(resource AS TEXT) LIKE :ref ESCAPE '\\'").bindparams(
                    ref=f"%{safe_ref}%"
                ),
            )
        )
    )
    await db.commit()
    return {"patient_id": patient_id, "deleted": result.rowcount}


@router.get("/latest-dates")
async def latest_dates(patient_id: str, db: AsyncSession = Depends(get_db)):
    """Per-resource-type latest date for a patient — drives incremental sync.

    The Chrome extension calls this before sync to know which entries it can
    skip. For each resource type we return the latest date observed in any
    of the standard date-bearing fields (effectiveDateTime / authoredOn /
    period.start / performedDateTime / recordedDate).

    Returns null per type when no resources exist (caller should fall back
    to full sync). Always returns YYYY-MM-DD (date-only); time-of-day is
    irrelevant because NHI capture granularity is daily.
    """
    from app.fhir.server import fhir_server

    # Date fields in priority order — first present wins.
    DATE_FIELDS = (
        "effectiveDateTime",
        "authoredOn",
        "performedDateTime",
        "recordedDate",
    )

    def _extract_date(r: dict) -> str | None:
        for f in DATE_FIELDS:
            v = r.get(f)
            if v:
                return v[:10]
        # Encounter uses period.start
        period = r.get("period") or {}
        if period.get("start"):
            return period["start"][:10]
        # Procedure may use performedPeriod.start
        pp = r.get("performedPeriod") or {}
        if pp.get("start"):
            return pp["start"][:10]
        return None

    out: dict[str, str | None] = {}
    for rt in (
        "Encounter",
        "MedicationRequest",
        "Observation",
        "DiagnosticReport",
        "Procedure",
        "AllergyIntolerance",
    ):
        resources = await fhir_server.search(db, rt, {"patient": patient_id})
        latest: str | None = None
        for r in resources:
            d = _extract_date(r)
            if d and (latest is None or d > latest):
                latest = d
        out[rt] = latest
    return {"patient_id": patient_id, "latest": out}


@router.post("/upload-html")
async def upload_html(
    payload: UploadHTMLPayload,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(_require_sync_api_key),
):
    """Capture endpoint for the Chrome extension.

    The extension grabs the current HIS page's HTML and POSTs it here with
    a page_type hint. Backend runs LLM extraction (same schemas the agent
    uses) → mappers → upsert to the FHIR store. Returns the IDs of every
    upserted resource so the extension can show meaningful feedback.

    No background task / SyncLog row — these calls are fast (one LLM
    call vs the agent's ~16) and the extension is the human in the loop.
    """
    from app.fallback.extractor import extract_and_map
    from app.fhir.server import fhir_server
    from app.mapper.patient import map_patient

    his_user = _parse_his_user(payload.html)

    # Apply patient override: when the extension sent manually-entered
    # patient identity, use it as authoritative.
    override = payload.patient_override
    override_id = (override.id_no.strip() if override and override.id_no else None) or None
    effective_pid = override_id or payload.patient_id

    logger.info(
        "upload-html: page_type=%s patient_id=%s (override=%s) host=%s his_user=%s html_size=%d",
        payload.page_type,
        effective_pid,
        bool(override_id),
        payload.host,
        his_user,
        len(payload.html),
    )

    audit = AuditLog(
        his_user=his_user,
        his_host=payload.host,
        page_type=payload.page_type,
        patient_id=effective_pid,
        html_size=len(payload.html),
    )

    # Build a Patient from the override (used in two paths below).
    def _build_override_patient() -> dict:
        raw = {
            "id": override_id,
            "identifier": override_id,
            "name": (override.name or override_id) if override else override_id,
        }
        if override and override.birth_date:
            raw["birthDate"] = override.birth_date
        if override and override.gender:
            raw["gender"] = override.gender
        return map_patient(raw)

    # ── Patient_info page + override → bypass LLM, build Patient directly. ──
    if payload.page_type == "patient_info" and override_id:
        patient = _build_override_patient()
        await fhir_server.upsert(db, patient)
        audit.patient_id = patient["id"]
        audit.resources_upserted = 1
        db.add(audit)
        await db.commit()
        logger.info("upload-html: built Patient from override id=%s", patient["id"])
        return {
            "page_type": "patient_info",
            "patient_id": patient["id"],
            "count": 1,
            "resources": [{"resourceType": "Patient", "id": patient["id"]}],
            "his_user": his_user,
            "patient_source": "manual_override",
        }

    # ── Non-patient_info page + override → ensure Patient exists, then run LLM. ──
    # Without this, downstream resources would reference a Patient that
    # nobody ever created (because the user skipped the patient_info sync).
    if override_id and payload.page_type != "patient_info":
        existing = await fhir_server.read(db, "Patient", override_id)
        if not existing:
            await fhir_server.upsert(db, _build_override_patient())
            logger.info("upload-html: auto-created Patient from override id=%s", override_id)

    llm = _build_llm_provider()
    try:
        resources = await extract_and_map(
            payload.html,
            payload.page_type,
            effective_pid,
            llm,
            host=payload.host,
        )
    except ValueError as exc:
        audit.success = False
        audit.error = str(exc)
        db.add(audit)
        await db.commit()
        raise HTTPException(400, str(exc)) from exc
    except Exception as exc:
        logger.exception("upload-html extraction failed")
        audit.success = False
        audit.error = str(exc)[:500]
        db.add(audit)
        await db.commit()
        raise HTTPException(500, f"Extraction failed: {exc}") from exc

    upserted = []
    for r in resources:
        await fhir_server.upsert(db, r)
        upserted.append({"resourceType": r["resourceType"], "id": r["id"]})

    resolved_pid = (
        upserted[0]["id"] if payload.page_type == "patient_info" and upserted else effective_pid
    )
    audit.patient_id = resolved_pid  # update with resolved id (patient_info case)
    audit.resources_upserted = len(upserted)
    db.add(audit)
    await db.commit()

    logger.info("upload-html: upserted %d resources for patient_id=%s", len(upserted), resolved_pid)
    return {
        "page_type": payload.page_type,
        "patient_id": resolved_pid,
        "count": len(upserted),
        "resources": upserted,
        "his_user": his_user,
    }


class UploadStructuredPayload(BaseModel):
    """Already-extracted structured items, bypassing LLM extraction.

    Used by the extension's /sync/upload-structured path when the HIS exposes
    a JSON API directly — for NHI 健康存摺 we found ~13 endpoints under
    /api/ihke3000/<page>/(page_load|search|SP_*) that return well-formed
    JSON, so we can adapt that JSON to the mapper-shape items in the
    extension and skip the costly LLM extraction step entirely.
    """

    page_type: str = Field(
        ...,
        description="Same values as upload-html (observations, medications, etc).",
    )
    items: list[dict] = Field(
        default_factory=list,
        description="List of pre-adapted item dicts in the shape each mapper expects.",
    )
    patient_id: Optional[str] = None
    host: Optional[str] = None
    patient_override: Optional[PatientOverride] = None


@router.post("/upload-structured")
async def upload_structured(
    payload: UploadStructuredPayload,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(_require_sync_api_key),
):
    """Bypass-LLM capture endpoint.

    Mirrors upload-html's patient-override + host handling, then runs items
    straight through the existing mappers (the same ones extract_and_map
    feeds with LLM-extracted dicts). Idempotent stable-ID upserts mean
    re-running is safe.
    """
    from app.fhir.server import fhir_server
    from app.mapper.dispatch import GROUP_HANDLERS, LIST_HANDLERS
    from app.mapper.patient import map_patient

    override = payload.patient_override
    override_id = (override.id_no.strip() if override and override.id_no else None) or None
    effective_pid = override_id or payload.patient_id

    logger.info(
        "upload-structured: page_type=%s patient_id=%s (override=%s) host=%s items=%d",
        payload.page_type,
        effective_pid,
        bool(override_id),
        payload.host,
        len(payload.items),
    )

    audit = AuditLog(
        his_host=payload.host,
        page_type=payload.page_type,
        patient_id=effective_pid,
        html_size=0,  # no HTML
    )

    def _build_override_patient() -> dict:
        raw = {
            "id": override_id,
            "identifier": override_id,
            "name": (override.name or override_id) if override else override_id,
        }
        if override and override.birth_date:
            raw["birthDate"] = override.birth_date
        if override and override.gender:
            raw["gender"] = override.gender
        return map_patient(raw)

    # Patient_info short-circuit (same as upload-html).
    if payload.page_type == "patient_info" and override_id:
        patient = _build_override_patient()
        await fhir_server.upsert(db, patient)
        audit.resources_upserted = 1
        db.add(audit)
        await db.commit()
        return {
            "page_type": "patient_info",
            "patient_id": patient["id"],
            "count": 1,
            "patient_source": "manual_override",
        }

    if not effective_pid:
        raise HTTPException(
            400,
            f"page_type={payload.page_type} requires patient_id (or patient_override.id_no)",
        )

    # Auto-create Patient from override if not yet in FHIR.
    if override_id:
        existing = await fhir_server.read(db, "Patient", override_id)
        if not existing:
            await fhir_server.upsert(db, _build_override_patient())
            logger.info("upload-structured: auto-created Patient id=%s", override_id)

    # Skip LLM — run items straight through mapper.
    if payload.page_type in GROUP_HANDLERS:
        resources = GROUP_HANDLERS[payload.page_type](payload.items, effective_pid)
    elif payload.page_type in LIST_HANDLERS:
        mapper, _ignored_key = LIST_HANDLERS[payload.page_type]
        mapped = [mapper(it, effective_pid) for it in payload.items if isinstance(it, dict)]
        resources = [r for r in mapped if r is not None]
    else:
        raise HTTPException(
            400,
            f"Unsupported page_type: {payload.page_type}",
        )

    # Encounter dedup: NHI represents the same admission day in BOTH
    # IHKE3303 (outpatient billing, AMB, admission_day only) AND
    # IHKE3309 (inpatient detail, IMP, admission→discharge period).
    # They're the same visit; the IMP version has more info (period.end,
    # correct class). Drop AMBs whose (hospital, start_date) collides
    # with an IMP's start_date — the linker would otherwise see 2
    # candidates for any admission-day lab and refuse to link.
    if payload.page_type == "encounters":
        resources = _dedup_admission_day_amb(resources)
    # Best-effort: tie each resource to the Encounter it occurred in,
    # using (hospital, date) as the join key. Skips when 0 or >1
    # Encounters match — we'd rather under-link than mis-link.
    await _link_encounters_in_resources(db, effective_pid, resources)
    # Pick the patient-matched referenceRange when an Observation has
    # sex-stratified ranges (中國北港's "[男:13.7 女:11.1][男:17.0 女:15.0]"
    # shape), and re-derive interpretation against that range so the
    # client doesn't have to do gender-aware Layer A on its own.
    await _resolve_sex_stratified_ranges(db, effective_pid, resources)

    upserted = []
    for r in resources:
        await fhir_server.upsert(db, r)
        upserted.append({"resourceType": r["resourceType"], "id": r["id"]})

    audit.resources_upserted = len(upserted)
    db.add(audit)
    await db.commit()

    logger.info(
        "upload-structured: upserted %d resources for patient_id=%s",
        len(upserted),
        effective_pid,
    )
    return {
        "page_type": payload.page_type,
        "patient_id": effective_pid,
        "count": len(upserted),
        "resources": upserted,
    }


@router.get("/audit-log")
async def list_audit(
    limit: int = 100,
    his_user: Optional[str] = None,
    patient_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """Return recent audit entries, newest first.

    Optional filters: his_user (e.g. DOC4544L), patient_id. Useful for
    answering 「誰在什麼時間 sync 了某個病歷」 — an institutional /
    IRB requirement.
    """
    stmt = select(AuditLog).order_by(AuditLog.timestamp.desc()).limit(min(limit, 1000))
    if his_user:
        stmt = stmt.where(AuditLog.his_user == his_user)
    if patient_id:
        stmt = stmt.where(AuditLog.patient_id == patient_id)
    rows = (await db.execute(stmt)).scalars().all()
    return [
        {
            "id": r.id,
            "timestamp": r.timestamp.isoformat(),
            "his_user": r.his_user,
            "his_host": r.his_host,
            "page_type": r.page_type,
            "patient_id": r.patient_id,
            "html_size": r.html_size,
            "resources_upserted": r.resources_upserted,
            "success": r.success,
            "error": r.error,
        }
        for r in rows
    ]


def _build_llm_provider():
    if settings.LLM_PROVIDER == "none":
        # Default — the /sync/upload-html fallback path is disabled. Users
        # who want to opt-in must explicitly set LLM_PROVIDER=claude (sends
        # captured HTML to Anthropic) or ollama (local).
        raise HTTPException(
            503,
            "LLM fallback path is disabled. Set LLM_PROVIDER=claude or "
            "LLM_PROVIDER=ollama in .env to enable /sync/upload-html.",
        )
    if settings.LLM_PROVIDER == "ollama":
        from app.fallback.llm.ollama import OllamaProvider

        return OllamaProvider(base_url=settings.OLLAMA_BASE_URL, model=settings.OLLAMA_MODEL)
    from app.fallback.llm.claude import ClaudeProvider

    return ClaudeProvider(api_key=settings.ANTHROPIC_API_KEY)


def _log_to_dict(log: SyncLog) -> dict:
    return {
        "id": log.id,
        "status": log.status,
        "patient_id": log.patient_id,
        "message": log.message,
        "created_at": log.created_at.isoformat(),
        "completed_at": log.completed_at.isoformat() if log.completed_at else None,
    }
