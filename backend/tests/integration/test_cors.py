"""CORS layer integration tests.

Verifies the dual-tier model:
1. Public discovery endpoints (`/fhir/metadata`, `/smart/.well-known/smart-configuration`)
   → wildcard CORS, any origin works (SMART on FHIR App Launch IG §3.1).
2. Everything else → strict allow list; unknown origins rejected at preflight.
"""

from __future__ import annotations

import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

# Point the app at a throw-away DB so import doesn't touch real data.
# Each module-scoped client gets a fresh file.
_TEST_DB = Path("/tmp/cors_test.db")
os.environ.setdefault("SECRET_KEY", "test-secret-key-min-32-characters-long")
os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{_TEST_DB}"


@pytest.fixture(scope="module")
def client():
    if _TEST_DB.exists():
        _TEST_DB.unlink()
    # Import inside the fixture so the env vars set above are honoured.
    from app.main import app

    with TestClient(app) as c:
        yield c
    if _TEST_DB.exists():
        _TEST_DB.unlink()


ARBITRARY_ORIGIN = "https://random-smart-app.example.com"


class TestPublicDiscoveryCors:
    """SMART discovery endpoints must accept any origin."""

    def test_metadata_preflight_from_any_origin(self, client):
        r = client.options(
            "/fhir/metadata",
            headers={
                "Origin": ARBITRARY_ORIGIN,
                "Access-Control-Request-Method": "GET",
            },
        )
        assert r.status_code == 200
        assert r.headers.get("access-control-allow-origin") == "*"
        # Wildcard origin must NOT be paired with credentials per CORS spec.
        assert "access-control-allow-credentials" not in {k.lower() for k in r.headers}

    def test_metadata_get_from_any_origin(self, client):
        r = client.get("/fhir/metadata", headers={"Origin": ARBITRARY_ORIGIN})
        assert r.status_code == 200
        assert r.headers.get("access-control-allow-origin") == "*"
        body = r.json()
        assert body["resourceType"] == "CapabilityStatement"

    def test_smart_config_preflight_from_any_origin(self, client):
        r = client.options(
            "/smart/.well-known/smart-configuration",
            headers={
                "Origin": ARBITRARY_ORIGIN,
                "Access-Control-Request-Method": "GET",
            },
        )
        assert r.status_code == 200
        assert r.headers.get("access-control-allow-origin") == "*"

    def test_smart_config_get_from_any_origin(self, client):
        r = client.get(
            "/smart/.well-known/smart-configuration",
            headers={"Origin": ARBITRARY_ORIGIN},
        )
        assert r.status_code == 200
        assert r.headers.get("access-control-allow-origin") == "*"


class TestStrictCorsForPhiEndpoints:
    """PHI / state-changing endpoints must reject unknown origins at preflight."""

    def test_fhir_patient_preflight_from_unknown_origin_blocked(self, client):
        r = client.options(
            "/fhir/Patient",
            headers={
                "Origin": ARBITRARY_ORIGIN,
                "Access-Control-Request-Method": "GET",
            },
        )
        # Starlette's CORSMiddleware returns 400 for unknown origins, OR
        # 200 without the Allow-Origin header — both block the browser.
        # We assert: no wildcard, and origin is NOT echoed.
        allow_origin = r.headers.get("access-control-allow-origin", "")
        assert allow_origin != "*"
        assert allow_origin != ARBITRARY_ORIGIN

    def test_sync_upload_preflight_from_unknown_origin_blocked(self, client):
        r = client.options(
            "/sync/upload-structured",
            headers={
                "Origin": ARBITRARY_ORIGIN,
                "Access-Control-Request-Method": "POST",
            },
        )
        allow_origin = r.headers.get("access-control-allow-origin", "")
        assert allow_origin != "*"
        assert allow_origin != ARBITRARY_ORIGIN

    def test_smart_authorize_preflight_from_unknown_origin_blocked(self, client):
        r = client.options(
            "/smart/authorize",
            headers={
                "Origin": ARBITRARY_ORIGIN,
                "Access-Control-Request-Method": "GET",
            },
        )
        allow_origin = r.headers.get("access-control-allow-origin", "")
        assert allow_origin != "*"
        assert allow_origin != ARBITRARY_ORIGIN


class TestStrictCorsAllowsWhitelisted:
    """Sanity: whitelisted origins still get CORS access to PHI endpoints."""

    def test_dashboard_origin_can_preflight_phi_endpoint(self, client):
        r = client.options(
            "/fhir/Patient",
            headers={
                "Origin": "http://localhost:3010",
                "Access-Control-Request-Method": "GET",
            },
        )
        # Either explicit origin echoed back or — with credentials enabled —
        # the exact origin. Not wildcard.
        assert r.headers.get("access-control-allow-origin") == "http://localhost:3010"

    def test_demo_smart_app_origin_can_preflight_token_endpoint(self, client):
        r = client.options(
            "/smart/token",
            headers={
                "Origin": "https://voho0000.github.io",
                "Access-Control-Request-Method": "POST",
            },
        )
        assert r.headers.get("access-control-allow-origin") == "https://voho0000.github.io"
