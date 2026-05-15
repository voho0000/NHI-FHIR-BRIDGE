from typing import Literal

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Database (SQLite for POC)
    DATABASE_URL: str = "sqlite+aiosqlite:///./data/ehr_bridge.db"

    # LLM Provider — only used by the /sync/upload-html fallback path.
    # The primary /sync/upload-structured path bypasses LLM entirely.
    LLM_PROVIDER: Literal["claude", "ollama"] = "claude"
    ANTHROPIC_API_KEY: str = ""
    OLLAMA_BASE_URL: str = "http://host.docker.internal:11434"
    OLLAMA_MODEL: str = "qwen2.5vl:7b"

    # JWT signing key. **MUST** be at least 32 characters in production —
    # there is no built-in default. We refuse to start if it's too short.
    # Generate one with: python -c 'import secrets; print(secrets.token_urlsafe(48))'
    SECRET_KEY: str = ""

    @field_validator("SECRET_KEY")
    @classmethod
    def _secret_key_must_be_strong(cls, v: str) -> str:
        if len(v) < 32:
            raise ValueError(
                "SECRET_KEY must be at least 32 characters long. "
                "Generate one with: python -c 'import secrets; print(secrets.token_urlsafe(48))'"
            )
        return v

    # API key that callers must supply as `X-Sync-API-Key: <value>` when hitting
    # /sync/upload-html and /sync/upload-structured. Empty string = no auth
    # (POC / single-user mode). Required for any deployment beyond localhost.
    SYNC_API_KEY: str = ""

    # FHIR
    FHIR_BASE_URL: str = "http://localhost:8010/fhir"

    # CORS — comma-separated list of origins allowed to call the backend.
    # The defaults baked into main.py cover localhost dev (dashboard +
    # SMART app). Add your production origins here.
    # Chrome extensions are matched separately via origin_regex.
    ALLOW_CORS_ORIGINS: str = ""


settings = Settings()
