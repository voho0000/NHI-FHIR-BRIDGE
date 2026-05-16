"""Shared pytest fixtures.

Run from the backend/ directory:

    cd backend && pip install -r requirements-dev.txt
    pytest

Important: env vars that the app reads at import time (DATABASE_URL, etc.)
MUST be set at module-top here BEFORE any `from app.*` import happens.
`Settings()` is a singleton instantiated once when `app.core.config` is
imported, so it caches whatever the env says at that moment.
"""

from __future__ import annotations

import os
import sys
import tempfile
from pathlib import Path

import pytest

# Ensure `app.*` imports work when pytest is invoked from backend/.
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

# One shared on-disk SQLite for the whole test session. Used by integration
# tests that need real persistence (TestClient + Alembic + writes). Each
# integration test module manages its own row isolation via unique IDs.
#
# We use a real file (not :memory:) because Alembic's sync engine and the
# app's async engine are SEPARATE — they don't share in-memory state.
_TEST_DB = Path(tempfile.gettempdir()) / "nhi_fhir_bridge_pytest.db"
if _TEST_DB.exists():
    _TEST_DB.unlink()
os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{_TEST_DB}"

# LLM_PROVIDER defaults to "none" in production. Tests that want to
# exercise the fallback path should monkeypatch this.
os.environ.setdefault("LLM_PROVIDER", "none")


def pytest_sessionfinish(session, exitstatus):
    """Best-effort cleanup of the shared test DB at session end."""
    if _TEST_DB.exists():
        try:
            _TEST_DB.unlink()
        except OSError:
            pass


@pytest.fixture
def patient_id() -> str:
    """A deterministic Taiwan-formatted national ID for use in tests."""
    return "A123456789"


@pytest.fixture
def sample_patient_override() -> dict:
    return {
        "id_no": "A123456789",
        "name": "陳大文",
        "birth_date": "1980-05-15",
        "gender": "male",
    }
