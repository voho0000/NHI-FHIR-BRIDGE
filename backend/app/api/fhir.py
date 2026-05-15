from datetime import UTC, datetime
from typing import Optional

from fastapi import APIRouter, Depends, Header, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.fhir.capability import build_capability_statement
from app.fhir.server import fhir_server
from app.smart.oauth2 import smart_auth

router = APIRouter(prefix="/fhir", tags=["FHIR R4"])


# ── Auth dependency ──────────────────────────────────────────────────────


async def get_authenticated_patient_id(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
) -> Optional[str]:
    """Resolve `Authorization: Bearer <token>` to the patient bound to that token.

    Returns None when no token / invalid token / no patient context. Endpoints
    treat None as 'unauthenticated dashboard call' and return unrestricted data.
    """
    if not authorization or not authorization.lower().startswith("bearer "):
        return None
    token = authorization.split(" ", 1)[1].strip()
    row = await smart_auth.validate_token(db, token)
    return row.patient_id if row else None


def _resolve_patient_filter(
    auth_patient_id: Optional[str], query_patient: Optional[str]
) -> Optional[str]:
    """Decide which patient to filter by for a search endpoint.

    - Token present  → always force the token's patient (overrides client query
      to prevent a SMART app with a P002 token from reading P001's data).
    - Token absent   → use the explicit ?patient= query param (dashboard).
    """
    return auth_patient_id or query_patient


def _enforce_read_access(resource: dict, auth_patient_id: Optional[str]) -> None:
    """For single-resource reads: if a token is bound to a patient, verify the
    fetched resource belongs to that patient. If not, 404 (don't leak existence).
    """
    if not auth_patient_id:
        return
    # FHIR reference field is "subject" for most resources, "patient" for
    # AllergyIntolerance and a few others.
    for field in ("subject", "patient"):
        ref = resource.get(field, {})
        if isinstance(ref, dict) and auth_patient_id in ref.get("reference", ""):
            return
    raise HTTPException(404, "Resource not found")


# ── Discovery ────────────────────────────────────────────────────────────


@router.get("/metadata")
async def capability_statement():
    return build_capability_statement()


@router.get("/.well-known/smart-configuration")
async def smart_configuration():
    """SMART discovery endpoint per spec — must live under FHIR base URL."""
    base = settings.FHIR_BASE_URL.replace("/fhir", "")
    return {
        "issuer": base,
        "authorization_endpoint": f"{base}/smart/authorize",
        "token_endpoint": f"{base}/smart/token",
        "capabilities": [
            "launch-standalone",
            "launch-ehr",
            "client-public",
            "context-standalone-patient",
            "permission-patient",
            "sso-openid-connect",
        ],
        "scopes_supported": [
            "openid",
            "fhirUser",
            "launch",
            "launch/patient",
            "patient/*.read",
            "online_access",
            "offline_access",
        ],
        "response_types_supported": ["code"],
        "code_challenge_methods_supported": ["S256"],
    }


# ── Patient ──────────────────────────────────────────────────────────────


@router.get("/Patient")
async def search_patients(
    db: AsyncSession = Depends(get_db),
    auth_patient_id: Optional[str] = Depends(get_authenticated_patient_id),
):
    if auth_patient_id:
        patient = await fhir_server.read(db, "Patient", auth_patient_id)
        return _bundle([patient] if patient else [])
    patients = await fhir_server.list_all(db, "Patient")
    return _bundle(patients)


@router.get("/Patient/{patient_id}")
async def get_patient(
    patient_id: str,
    db: AsyncSession = Depends(get_db),
    auth_patient_id: Optional[str] = Depends(get_authenticated_patient_id),
):
    if auth_patient_id and auth_patient_id != patient_id:
        raise HTTPException(404, f"Patient/{patient_id} not found")
    r = await fhir_server.read(db, "Patient", patient_id)
    if not r:
        raise HTTPException(404, f"Patient/{patient_id} not found")
    return r


# ── Per-patient resources ────────────────────────────────────────────────
# Pattern is identical for all 7 resource types:
#   search: filter by token-bound patient (or ?patient= for dashboard)
#   read:   verify the resource belongs to the token-bound patient

_PER_PATIENT_RESOURCES = [
    "Observation",
    "MedicationRequest",
    "Condition",
    "AllergyIntolerance",
    "DiagnosticReport",
    "Procedure",
    "Encounter",
    # Routes that always return an empty Bundle for resources NHI does
    # not currently expose. FHIR clients (incl. medical-note app)
    # routinely query these — better to return 0 results than 404, which
    # crashes their bundle-aggregator.
    "DocumentReference",
    "Immunization",
    "CarePlan",
    "Goal",
    "FamilyMemberHistory",
    "Composition",
    "ServiceRequest",
    "ImagingStudy",
]


def _make_search_handler(resource_type: str):
    async def handler(
        patient: Optional[str] = None,
        encounter: Optional[str] = None,
        date: Optional[str] = None,
        code: Optional[str] = None,
        db: AsyncSession = Depends(get_db),
        auth_patient_id: Optional[str] = Depends(get_authenticated_patient_id),
    ):
        pid = _resolve_patient_filter(auth_patient_id, patient)
        params: dict = {}
        if pid:
            params["patient"] = pid
        # Standard FHIR search params for clinical narrowing. The
        # SMART app uses `encounter=` to drill into a visit's labs/meds.
        if encounter:
            params["encounter"] = encounter
        if date:
            params["date"] = date
        if code:
            params["code"] = code
        return _bundle(await fhir_server.search(db, resource_type, params))

    return handler


def _make_read_handler(resource_type: str):
    async def handler(
        resource_id: str,
        db: AsyncSession = Depends(get_db),
        auth_patient_id: Optional[str] = Depends(get_authenticated_patient_id),
    ):
        r = await fhir_server.read(db, resource_type, resource_id)
        if not r:
            raise HTTPException(404, f"{resource_type}/{resource_id} not found")
        _enforce_read_access(r, auth_patient_id)
        return r

    return handler


for _rtype in _PER_PATIENT_RESOURCES:
    router.add_api_route(f"/{_rtype}", _make_search_handler(_rtype), methods=["GET"])
    router.add_api_route(f"/{_rtype}/{{resource_id}}", _make_read_handler(_rtype), methods=["GET"])


# ── Export ───────────────────────────────────────────────────────────────


@router.get("/export")
async def export_bundle(
    patient: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """Export all FHIR resources (optionally filtered to one patient) as a
    FHIR Bundle type=collection. Suitable for download + re-import.

    Bundle invariants enforced:
      - bdl-1: `total` MUST NOT be present on collection bundles
        (only valid for searchset / history results).
      - Every entry MUST have a `fullUrl` per FHIR R4 — without it
        the validator emits 'Bundle entry missing fullUrl' and
        every Relative Reference inside the bundle is also flagged
        ('Relative Reference appears inside Bundle whose entry is
        missing a fullUrl'). One missing fullUrl cascades into
        many downstream errors; adding it here removes ~3145
        validation errors at once for our P333333333 case.
    """
    all_resources: list[dict] = []

    if patient:
        p = await fhir_server.read(db, "Patient", patient)
        if p:
            all_resources.append(p)
    else:
        all_resources.extend(await fhir_server.list_all(db, "Patient"))

    for rtype in _PER_PATIENT_RESOURCES:
        params = {"patient": patient} if patient else {}
        all_resources.extend(await fhir_server.search(db, rtype, params))

    return {
        "resourceType": "Bundle",
        "type": "collection",
        "timestamp": datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "entry": [_bundle_entry(r) for r in all_resources],
    }


# ── Import ────────────────────────────────────────────────────────────────


@router.post("/import")
async def import_bundle(request: Request, db: AsyncSession = Depends(get_db)):
    """Import a FHIR Bundle, a single resource, or an array of resources.
    All resources are upserted (create-or-update by resourceType + id).
    Resources missing an id are skipped."""
    try:
        body = await request.json()
    except Exception as exc:
        raise HTTPException(400, "Request body must be valid JSON") from exc

    if isinstance(body, list):
        resources = body
    elif isinstance(body, dict):
        rtype = body.get("resourceType", "")
        if rtype == "Bundle":
            resources = [e.get("resource", e) for e in body.get("entry", [])]
        elif rtype:
            resources = [body]
        else:
            raise HTTPException(400, "Expected a FHIR Bundle, resource, or array of resources")
    else:
        raise HTTPException(400, "Unexpected body type")

    imported = skipped = 0
    for r in resources:
        if isinstance(r, dict) and r.get("resourceType") and r.get("id"):
            await fhir_server.upsert(db, r)
            imported += 1
        else:
            skipped += 1

    return {"imported": imported, "skipped": skipped, "total": len(resources)}


# ── Helpers ───────────────────────────────────────────────────────────────


def _bundle_entry(resource: dict) -> dict:
    """Build a Bundle.entry with the mandatory `fullUrl`.

    For an embedded server like this one, fullUrl is the absolute URL
    where the resource lives — '<FHIR_BASE>/<ResourceType>/<id>'.
    The validator rejects entries without it and cascades that into
    every Relative Reference inside the bundle.
    """
    rtype = resource.get("resourceType", "")
    rid = resource.get("id", "")
    return {
        "fullUrl": f"{settings.FHIR_BASE_URL}/{rtype}/{rid}",
        "resource": resource,
    }


def _bundle(resources: list[dict]) -> dict:
    # searchset is one of the bundle types where `total` IS valid
    # (per bdl-1). fullUrl on each entry is mandatory regardless.
    return {
        "resourceType": "Bundle",
        "type": "searchset",
        "total": len(resources),
        "entry": [_bundle_entry(r) for r in resources],
    }
