"""Settings / config validation tests.

The conftest.py sets a valid SECRET_KEY before tests run, so the global
`settings` import works. These tests instantiate Settings() directly with
explicit values to exercise the validator.
"""

import pytest
from pydantic import ValidationError

from app.core.config import Settings


class TestSecretKeyValidation:
    def test_empty_secret_key_rejected(self, monkeypatch):
        monkeypatch.setenv("SECRET_KEY", "")
        with pytest.raises(ValidationError, match="at least 32 characters"):
            Settings(_env_file=None)  # type: ignore[call-arg]

    def test_short_secret_key_rejected(self, monkeypatch):
        monkeypatch.setenv("SECRET_KEY", "too-short")
        with pytest.raises(ValidationError, match="at least 32 characters"):
            Settings(_env_file=None)  # type: ignore[call-arg]

    def test_exactly_32_chars_accepted(self, monkeypatch):
        monkeypatch.setenv("SECRET_KEY", "x" * 32)
        s = Settings(_env_file=None)  # type: ignore[call-arg]
        assert len(s.SECRET_KEY) == 32

    def test_long_secret_key_accepted(self, monkeypatch):
        monkeypatch.setenv("SECRET_KEY", "x" * 64)
        s = Settings(_env_file=None)  # type: ignore[call-arg]
        assert len(s.SECRET_KEY) == 64


class TestDefaults:
    def test_sync_api_key_empty_by_default(self, monkeypatch):
        monkeypatch.setenv("SECRET_KEY", "x" * 32)
        s = Settings(_env_file=None)  # type: ignore[call-arg]
        # Empty SYNC_API_KEY = auth disabled (POC mode). Documented in .env.example.
        assert s.SYNC_API_KEY == ""

    def test_default_llm_provider_is_claude(self, monkeypatch):
        monkeypatch.setenv("SECRET_KEY", "x" * 32)
        s = Settings(_env_file=None)  # type: ignore[call-arg]
        assert s.LLM_PROVIDER == "claude"
