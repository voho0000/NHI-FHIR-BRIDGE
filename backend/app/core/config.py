from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Database (SQLite for POC)
    DATABASE_URL: str = "sqlite+aiosqlite:///./data/ehr_bridge.db"

    # LLM Provider — only used by the /sync/upload-html fallback path.
    # The primary /sync/upload-structured path bypasses LLM entirely.
    #
    # Default is "none" so a fresh install never accidentally sends PHI to
    # any third party. Set to "claude" or "ollama" only after you've thought
    # about where captured HTML goes (cloud vs local respectively).
    LLM_PROVIDER: Literal["claude", "ollama", "none"] = "none"
    ANTHROPIC_API_KEY: str = ""
    OLLAMA_BASE_URL: str = "http://host.docker.internal:11434"
    OLLAMA_MODEL: str = "qwen2.5vl:7b"

    # API key required as `X-Sync-API-Key: <value>` on PHI-writing endpoints
    # (/sync/upload-*, /smart/launch-context, /fhir/import, /fhir/export).
    # Empty string = no auth — fine for single-user localhost setups, but
    # any networked deployment MUST set a long random value.
    SYNC_API_KEY: str = ""

    # FHIR
    FHIR_BASE_URL: str = "http://localhost:8010/fhir"

    # CORS — comma-separated list of origins allowed to call the backend.
    # The defaults baked into main.py cover localhost dev (dashboard +
    # SMART app). Add your production origins here.
    # Chrome extensions are matched separately via origin_regex.
    ALLOW_CORS_ORIGINS: str = ""


settings = Settings()
