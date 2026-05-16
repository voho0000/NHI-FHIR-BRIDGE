"""Auth / authz regression tests.

Covers fixes from the pre-release security audit:
- /fhir/import, /fhir/export, /smart/launch-context all require SYNC_API_KEY
- PKCE is mandatory for public SMART clients
- Patient-scoped tokens can't read other patients via substring tricks
"""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

VALID_KEY = "test-sync-api-key-very-secret"


@pytest.fixture(scope="module")
def client():
    # Enable API-key enforcement for the duration of this module by mutating
    # the cached `settings` singleton — env-var changes here are too late
    # because settings is instantiated at first import. The dep
    # `require_sync_api_key` reads `settings.SYNC_API_KEY` at request time,
    # so mutation takes effect immediately.
    from app.core.config import settings
    from app.main import app

    original_key = settings.SYNC_API_KEY
    settings.SYNC_API_KEY = VALID_KEY
    try:
        with TestClient(app) as c:
            yield c
    finally:
        settings.SYNC_API_KEY = original_key


# ── /sync/* and /smart/launch-context, /fhir/import|export auth ──────────


class TestSyncApiKeyEnforcement:
    """All endpoints that write PHI or mint launch tokens must require the key."""

    def test_fhir_import_rejects_missing_key(self, client):
        r = client.post("/fhir/import", json={"resourceType": "Patient", "id": "x"})
        assert r.status_code == 401

    def test_fhir_import_rejects_wrong_key(self, client):
        r = client.post(
            "/fhir/import",
            json={"resourceType": "Patient", "id": "x"},
            headers={"X-Sync-API-Key": "wrong"},
        )
        assert r.status_code == 401

    def test_fhir_import_accepts_correct_key(self, client):
        r = client.post(
            "/fhir/import",
            json={"resourceType": "Patient", "id": "test-import-1"},
            headers={"X-Sync-API-Key": VALID_KEY},
        )
        assert r.status_code == 200

    def test_fhir_export_rejects_missing_key(self, client):
        r = client.get("/fhir/export")
        assert r.status_code == 401

    def test_fhir_export_accepts_correct_key(self, client):
        r = client.get("/fhir/export", headers={"X-Sync-API-Key": VALID_KEY})
        assert r.status_code == 200

    def test_smart_launch_context_rejects_missing_key(self, client):
        r = client.post("/smart/launch-context", json={"patient_id": "test-import-1"})
        assert r.status_code == 401

    def test_smart_launch_context_accepts_correct_key(self, client):
        r = client.post(
            "/smart/launch-context",
            json={"patient_id": "test-import-1"},
            headers={"X-Sync-API-Key": VALID_KEY},
        )
        # 200 = patient existed (from earlier test), 404 = does not — either
        # proves the auth dep passed.
        assert r.status_code in (200, 404)


# ── PKCE enforcement on /smart/authorize ─────────────────────────────────


class TestPkceEnforcement:
    """Public SMART clients (is_confidential=False) MUST send code_challenge."""

    def test_public_client_without_pkce_rejected(self, client):
        r = client.get(
            "/smart/authorize",
            params={
                "response_type": "code",
                "client_id": "demo-smart-app",  # seeded as public client
                "redirect_uri": "http://localhost:3001/callback",
                "scope": "patient/*.read",
                "state": "xyz",
            },
            follow_redirects=False,
        )
        assert r.status_code == 400
        assert "code_challenge is required" in r.text

    def test_public_client_with_pkce_proceeds(self, client):
        r = client.get(
            "/smart/authorize",
            params={
                "response_type": "code",
                "client_id": "demo-smart-app",
                "redirect_uri": "http://localhost:3001/callback",
                "scope": "patient/*.read",
                "state": "xyz",
                "code_challenge": "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
                "code_challenge_method": "S256",
            },
            follow_redirects=False,
        )
        # 302 redirect to redirect_uri with ?code=
        assert r.status_code == 302
        assert "code=" in r.headers["location"]

    def test_invalid_pkce_method_rejected(self, client):
        r = client.get(
            "/smart/authorize",
            params={
                "response_type": "code",
                "client_id": "demo-smart-app",
                "redirect_uri": "http://localhost:3001/callback",
                "scope": "patient/*.read",
                "code_challenge": "x" * 43,
                "code_challenge_method": "MD5",  # not S256/plain
            },
            follow_redirects=False,
        )
        assert r.status_code == 400


# ── Patient-ID exact match (no substring leak) ──────────────────────────


class TestPatientIdExactMatch:
    """Substring matching on patient IDs would let A12345678 read A123456789."""

    def test_substring_match_does_not_leak(self):
        # _patient_ref_matches is the gatekeeper for search-time filtering;
        # _enforce_read_access is the equivalent for single-resource reads.
        # Both must reject substring matches.
        from app.fhir.server import _patient_ref_matches

        # Resource belongs to A123456789 (full ID)
        resource = {
            "resourceType": "Observation",
            "subject": {"reference": "Patient/A123456789"},
        }

        # A token bound to a SHORTER prefix must NOT match.
        assert _patient_ref_matches(resource, "A12345678") is False
        # A token bound to a longer string must NOT match.
        assert _patient_ref_matches(resource, "XA123456789") is False
        # Exact match still works.
        assert _patient_ref_matches(resource, "A123456789") is True

    def test_enforce_read_access_exact(self):
        from fastapi import HTTPException

        from app.api.fhir import _enforce_read_access

        resource = {"subject": {"reference": "Patient/A123456789"}}

        # No bound patient → no enforcement
        _enforce_read_access(resource, None)

        # Exact match → no error
        _enforce_read_access(resource, "A123456789")

        # Prefix match → 404 (not authorised)
        with pytest.raises(HTTPException) as exc:
            _enforce_read_access(resource, "A12345678")
        assert exc.value.status_code == 404
