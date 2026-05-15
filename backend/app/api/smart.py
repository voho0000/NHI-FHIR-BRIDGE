from typing import Optional
from urllib.parse import urlencode

from fastapi import APIRouter, Body, Depends, Form, HTTPException, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.fhir.server import fhir_server
from app.smart.oauth2 import smart_auth

router = APIRouter(prefix="/smart", tags=["SMART on FHIR"])


@router.get("/.well-known/smart-configuration")
async def smart_configuration():
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
            "offline_access",
        ],
        "response_types_supported": ["code"],
        "code_challenge_methods_supported": ["S256"],
    }


@router.get("/authorize")
async def authorize(
    response_type: str = Query(...),
    client_id: str = Query(...),
    redirect_uri: str = Query(...),
    scope: str = Query(...),
    state: Optional[str] = Query(None),
    code_challenge: Optional[str] = Query(None),
    code_challenge_method: Optional[str] = Query(None),
    launch: Optional[str] = Query(None),
    aud: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    client = await smart_auth.get_client(db, client_id)
    if not client:
        raise HTTPException(400, "Unknown client_id")
    if redirect_uri not in client.redirect_uris:
        raise HTTPException(400, "Invalid redirect_uri")

    # POC: auto-approve. Patient context resolution priority:
    #   1. Launch token created via POST /smart/launch-context (EHR-Launch flow)
    #   2. Fallback to first patient in the store
    patient_id = smart_auth.resolve_launch_context(launch)
    if not patient_id:
        patients = await fhir_server.list_all(db, "Patient")
        patient_id = patients[0]["id"] if patients else None

    scopes = [s for s in scope.split() if s in (client.allowed_scopes or [])]
    code = await smart_auth.create_auth_code(
        db,
        client_id,
        redirect_uri,
        scopes,
        patient_id,
        code_challenge,
        code_challenge_method,
    )

    params: dict = {"code": code}
    if state:
        params["state"] = state
    return RedirectResponse(f"{redirect_uri}?{urlencode(params)}", status_code=302)


@router.post("/launch-context")
async def create_launch_context(
    payload: dict = Body(...),
    db: AsyncSession = Depends(get_db),
):
    """Create a launch token bound to a specific patient.
    Frontend calls this before opening a SMART app so the EHR-Launch flow
    can pre-select the patient context (instead of always defaulting to the
    first patient in the store).
    """
    patient_id = payload.get("patient_id")
    if not patient_id:
        raise HTTPException(400, "patient_id is required")

    # Sanity-check the patient exists in our FHIR store
    if not await fhir_server.read(db, "Patient", patient_id):
        raise HTTPException(404, f"Patient/{patient_id} not found")

    token = smart_auth.create_launch_context(patient_id)
    return {"launch": token, "patient_id": patient_id}


@router.post("/token")
async def token(
    grant_type: str = Form(...),
    code: str = Form(...),
    redirect_uri: str = Form(...),
    client_id: str = Form(...),
    code_verifier: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
):
    if grant_type != "authorization_code":
        raise HTTPException(400, "Unsupported grant_type")

    result = await smart_auth.exchange_code(db, code, client_id, redirect_uri, code_verifier)
    if not result:
        raise HTTPException(400, "Invalid or expired authorization code")
    return result
