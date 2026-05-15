import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import Response

from app.api import fhir, smart, sync
from app.core.config import settings

# Uvicorn configures its own loggers but leaves application loggers (app.*)
# at the root WARNING level, so logger.info() in our code disappears. Bump
# everything under "app" to INFO so request flows + debug traces are visible
# without needing to reach for logger.warning hacks.
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logging.getLogger("app").setLevel(logging.INFO)


def _run_alembic_upgrade() -> None:
    """Apply any pending Alembic migrations on startup.

    Runs synchronously against a temporary sync engine (Alembic doesn't
    speak async). Idempotent — no-op when DB is already at head.
    """
    import logging
    from pathlib import Path

    from alembic.config import Config

    from alembic import command

    backend_dir = Path(__file__).resolve().parent.parent
    cfg = Config(str(backend_dir / "alembic.ini"))
    cfg.set_main_option("script_location", str(backend_dir / "alembic"))
    logging.getLogger("alembic").setLevel(logging.INFO)
    command.upgrade(cfg, "head")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Apply any pending migrations. Replaces the old `create_all` so that
    # schema changes get tracked + versioned instead of silently diverging.
    _run_alembic_upgrade()

    from app.core.database import AsyncSessionLocal
    from app.smart.oauth2 import smart_auth

    async with AsyncSessionLocal() as db:
        # Seed the built-in demo SMART client
        await smart_auth.seed_demo_client(db)
        # Reap zombie sync logs from a previous interrupted run. If the
        # process was killed mid-flight (Docker restart, host crash, ctrl-C),
        # a row stays as status='running' forever. Mark them failed on boot.
        from datetime import datetime

        from sqlalchemy import update

        from app.models.fhir_store import SyncLog

        result = await db.execute(
            update(SyncLog)
            .where(SyncLog.status == "running")
            .values(
                status="failed",
                message="Backend restarted before this sync finished",
                completed_at=datetime.utcnow(),
            )
        )
        if result.rowcount:
            print(f"[startup] Reaped {result.rowcount} zombie sync log(s)")
        await db.commit()

    yield


app = FastAPI(
    title="NHI-FHIR-Bridge",
    description="AI-powered HIS → FHIR R4 bridge with SMART on FHIR support",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS — locked to known origins. Note: the public-discovery middleware
# below runs OUTSIDE this layer and overrides it for two specific paths.
#
# Defaults cover localhost dev (dashboard + SMART app) and the NHI portal
# (browser-side sync). Add production origins via ALLOW_CORS_ORIGINS in .env
# — they're appended to the defaults, not replacing them.
#
# Chrome extensions are matched separately via origin_regex (extension IDs
# are install-specific so we can't whitelist them by exact URL).
_DEFAULT_CORS_ORIGINS = [
    "http://localhost:3010",  # dashboard (Next.js)
    "http://127.0.0.1:3010",
    "http://localhost:3001",  # medical-note SMART app dev server
    "http://127.0.0.1:3001",
    "http://localhost:3000",  # legacy port — kept so older setups still work
    "http://127.0.0.1:3000",
    "https://myhealthbank.nhi.gov.tw",  # NHI 健康存摺 (browser-side sync)
    # Built-in demo SMART app — DEFAULT_SMART_APP_LAUNCH in extension/popup.js
    # points here, so the OAuth2 launch flow needs CORS access to /smart/* and
    # /fhir/* out of the box. Override the URL via the extension's
    # ⚙️ 進階設定 → SMART App Launch URL if you self-host a different one.
    "https://voho0000.github.io",
]
_EXTRA_CORS_ORIGINS = [
    o.strip() for o in (settings.ALLOW_CORS_ORIGINS or "").split(",") if o.strip()
]
_CORS_ALLOWED_ORIGINS = _DEFAULT_CORS_ORIGINS + _EXTRA_CORS_ORIGINS

# Private Network Access (PNA): Chrome blocks requests from public origins
# to loopback (localhost) unless the server opts in via
# Access-Control-Allow-Private-Network on the preflight. Without
# `allow_private_network=True` Starlette's CORSMiddleware actively rejects
# the preflight with 400 "Disallowed CORS private-network".
app.add_middleware(
    CORSMiddleware,
    allow_origins=_CORS_ALLOWED_ORIGINS,
    allow_origin_regex=r"chrome-extension://[a-z0-9]+",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Sync-API-Key"],
    allow_private_network=True,
)


# ── Public-discovery CORS (registered LAST so it wraps OUTSIDE the strict
#    CORSMiddleware above — Starlette wraps middlewares in reverse-add order).
# These two endpoints carry no PHI — they're the SMART on FHIR discovery
# documents (server capabilities + OAuth2 endpoint locations) that any
# SMART app needs to read before launch. Per SMART App Launch IG §3.1:
# "The server SHALL allow the well-known configuration document to be
# accessed from any origin."
#
# Without this override, a self-hosted SMART app at any non-whitelisted
# origin would hang on "Launching SMART…" because the preflight on
# /smart/.well-known/smart-configuration gets rejected by the strict CORS
# layer above with HTTP 400.
#
# PHI endpoints (/fhir/<resource>, /sync/*, /smart/authorize, /smart/token)
# stay strict — CORS isn't load-bearing for their security; Bearer token +
# OAuth2 redirect-URI allowlist + X-Sync-API-Key are.
_PUBLIC_DISCOVERY_PATHS = frozenset(
    {
        "/fhir/metadata",
        "/smart/.well-known/smart-configuration",
    }
)


@app.middleware("http")
async def public_discovery_cors(request: Request, call_next):
    if request.url.path not in _PUBLIC_DISCOVERY_PATHS:
        return await call_next(request)

    # Preflight: short-circuit before anything else sees the request.
    if request.method == "OPTIONS":
        return Response(
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Max-Age": "600",
                "Vary": "Origin",
            },
        )

    # Actual GET: let it flow through the rest of the stack, then stamp
    # wildcard origin on the way out. Strip credentials — `*` and
    # `Allow-Credentials: true` are incompatible per the CORS spec.
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    if "Access-Control-Allow-Credentials" in response.headers:
        del response.headers["Access-Control-Allow-Credentials"]
    response.headers["Vary"] = "Origin"
    return response


app.include_router(fhir.router)
app.include_router(smart.router)
app.include_router(sync.router)


@app.get("/", tags=["Health"])
async def root():
    return {
        "name": "NHI-FHIR-Bridge",
        "version": "0.1.0",
        "docs": "/docs",
        "fhir": "/fhir/metadata",
        "smart_config": "/smart/.well-known/smart-configuration",
    }
