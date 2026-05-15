"""Settings / config validation tests.

The conftest.py provides default test environment, so we override
relevant vars per-test via monkeypatch.
"""

import pytest

from app.core.config import Settings


class TestLlmProviderDefault:
    def test_default_is_none(self, monkeypatch):
        # Strip any pre-set value so we observe the default.
        monkeypatch.delenv("LLM_PROVIDER", raising=False)
        s = Settings(_env_file=None)  # type: ignore[call-arg]
        # Default is "none" so a fresh install never sends PHI to a third
        # party without an explicit opt-in.
        assert s.LLM_PROVIDER == "none"

    def test_claude_accepted(self, monkeypatch):
        monkeypatch.setenv("LLM_PROVIDER", "claude")
        s = Settings(_env_file=None)  # type: ignore[call-arg]
        assert s.LLM_PROVIDER == "claude"

    def test_ollama_accepted(self, monkeypatch):
        monkeypatch.setenv("LLM_PROVIDER", "ollama")
        s = Settings(_env_file=None)  # type: ignore[call-arg]
        assert s.LLM_PROVIDER == "ollama"

    def test_unknown_value_rejected(self, monkeypatch):
        from pydantic import ValidationError

        monkeypatch.setenv("LLM_PROVIDER", "gpt-4")
        with pytest.raises(ValidationError):
            Settings(_env_file=None)  # type: ignore[call-arg]


class TestDefaults:
    def test_sync_api_key_empty_by_default(self, monkeypatch):
        monkeypatch.delenv("SYNC_API_KEY", raising=False)
        s = Settings(_env_file=None)  # type: ignore[call-arg]
        # Empty SYNC_API_KEY = auth disabled (POC mode). Documented in .env.example.
        assert s.SYNC_API_KEY == ""

    def test_fhir_base_url_default(self, monkeypatch):
        monkeypatch.delenv("FHIR_BASE_URL", raising=False)
        s = Settings(_env_file=None)  # type: ignore[call-arg]
        assert s.FHIR_BASE_URL == "http://localhost:8010/fhir"
