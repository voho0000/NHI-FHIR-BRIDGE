import base64
import hashlib
import secrets
from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.fhir_store import AuthorizationCode, OAuthClient, OAuthToken


class SMARTAuthServer:
    def __init__(self):
        # In-memory launch context store: launch_token → {"patient_id": ..., "expires_at": ...}
        # Used for SMART EHR-Launch flow: the EHR generates a token tied to a patient,
        # the SMART app then redeems it via /authorize to get that patient's context.
        self._launch_contexts: dict[str, dict] = {}

    # ── Launch context (EHR-Launch flow) ──────────────────────────────────

    def create_launch_context(self, patient_id: str) -> str:
        token = secrets.token_urlsafe(24)
        self._launch_contexts[token] = {
            "patient_id": patient_id,
            "expires_at": datetime.utcnow() + timedelta(minutes=10),
        }
        return token

    def resolve_launch_context(self, token: str | None) -> str | None:
        """Look up the patient_id bound to a launch token. Returns None if missing/expired."""
        if not token:
            return None
        ctx = self._launch_contexts.get(token)
        if not ctx:
            return None
        if ctx["expires_at"] < datetime.utcnow():
            self._launch_contexts.pop(token, None)
            return None
        return ctx["patient_id"]

    # ── Client management ────────────────────────────────────────────────

    async def get_client(self, db: AsyncSession, client_id: str) -> OAuthClient | None:
        return (
            await db.execute(select(OAuthClient).where(OAuthClient.client_id == client_id))
        ).scalar_one_or_none()

    async def seed_demo_client(self, db: AsyncSession):
        """Ensure the built-in SMART clients exist and their redirect_uri
        whitelists are up to date. Idempotent: on every backend start we
        upsert the canonical URI list, so when the medical-note dev port
        moves (3000 → 3001 etc.) existing installs pick up the new URI
        without a manual DB migration."""
        # Demo client (for testing with our own frontend) — keep
        # localhost:3000 AND :3001 so either port works during transitions.
        demo_uris = [
            "http://localhost:3001/callback",
            "http://localhost:3001/launch",
            "http://localhost:3000/callback",
            "http://localhost:3000/launch",
        ]
        demo = await self.get_client(db, "demo-smart-app")
        if not demo:
            db.add(
                OAuthClient(
                    client_id="demo-smart-app",
                    client_name="Demo SMART App",
                    redirect_uris=demo_uris,
                    allowed_scopes=[
                        "openid",
                        "fhirUser",
                        "launch/patient",
                        "patient/*.read",
                        "offline_access",
                    ],
                    is_confidential=False,
                )
            )
        else:
            demo.redirect_uris = demo_uris

        # voho0000/medical-note-smart-on-fhir — registered to consume our FHIR data
        mn_uris = [
            "https://voho0000.github.io/medical-note-smart-on-fhir/smart/callback",
            "http://localhost:3001/smart/callback",
            "http://localhost:3000/smart/callback",  # kept for backward compat
        ]
        mn = await self.get_client(db, "my_web_app")
        if not mn:
            db.add(
                OAuthClient(
                    client_id="my_web_app",
                    client_name="Medical Note SMART App",
                    redirect_uris=mn_uris,
                    allowed_scopes=[
                        "launch",
                        "openid",
                        "fhirUser",
                        "patient/*.read",
                        "online_access",
                        "offline_access",
                    ],
                    is_confidential=False,
                )
            )
        else:
            mn.redirect_uris = mn_uris

        await db.commit()

    # ── Authorization Code ───────────────────────────────────────────────

    async def create_auth_code(
        self,
        db: AsyncSession,
        client_id: str,
        redirect_uri: str,
        scopes: list[str],
        patient_id: str | None,
        code_challenge: str | None,
        code_challenge_method: str | None,
    ) -> str:
        code = secrets.token_urlsafe(32)
        db.add(
            AuthorizationCode(
                code=code,
                client_id=client_id,
                redirect_uri=redirect_uri,
                scopes=scopes,
                patient_id=patient_id,
                code_challenge=code_challenge,
                code_challenge_method=code_challenge_method,
                expires_at=datetime.utcnow() + timedelta(minutes=10),
            )
        )
        await db.commit()
        return code

    # ── Token exchange ───────────────────────────────────────────────────

    async def exchange_code(
        self,
        db: AsyncSession,
        code: str,
        client_id: str,
        redirect_uri: str,
        code_verifier: str | None,
    ) -> dict | None:
        row = (
            await db.execute(
                select(AuthorizationCode).where(
                    AuthorizationCode.code == code,
                    AuthorizationCode.used == False,  # noqa: E712
                )
            )
        ).scalar_one_or_none()

        if not row:
            return None
        if row.client_id != client_id or row.redirect_uri != redirect_uri:
            return None
        if row.expires_at < datetime.utcnow():
            return None

        # PKCE verification
        if row.code_challenge:
            if not code_verifier:
                return None
            if row.code_challenge_method == "S256":
                digest = hashlib.sha256(code_verifier.encode()).digest()
                computed = base64.urlsafe_b64encode(digest).rstrip(b"=").decode()
            else:
                computed = code_verifier
            if computed != row.code_challenge:
                return None

        row.used = True
        access_token = secrets.token_urlsafe(32)
        db.add(
            OAuthToken(
                client_id=client_id,
                access_token=access_token,
                scopes=row.scopes,
                patient_id=row.patient_id,
                expires_at=datetime.utcnow() + timedelta(hours=1),
            )
        )
        await db.commit()

        response: dict = {
            "access_token": access_token,
            "token_type": "Bearer",
            "expires_in": 3600,
            "scope": " ".join(row.scopes),
        }
        if row.patient_id:
            response["patient"] = row.patient_id
        return response

    # ── Token validation ─────────────────────────────────────────────────

    async def validate_token(self, db: AsyncSession, token: str) -> OAuthToken | None:
        row = (
            await db.execute(select(OAuthToken).where(OAuthToken.access_token == token))
        ).scalar_one_or_none()
        if row and row.expires_at > datetime.utcnow():
            return row
        return None


smart_auth = SMARTAuthServer()
