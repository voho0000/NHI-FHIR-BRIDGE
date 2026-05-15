"""Shared pytest fixtures.

Run from the backend/ directory:

    cd backend && pip install -r requirements-dev.txt
    pytest
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

import pytest

# Ensure `app.*` imports work when pytest is invoked from backend/.
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

# Use an in-memory SQLite by default so tests don't touch dev DB.
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///:memory:")
os.environ.setdefault("SECRET_KEY", "test-secret-key-min-32-characters-long")
os.environ.setdefault("LLM_PROVIDER", "claude")
os.environ.setdefault("ANTHROPIC_API_KEY", "test-key-not-real")


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
