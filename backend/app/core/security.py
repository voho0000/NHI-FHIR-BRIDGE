"""Shared auth dependencies used by multiple routers.

`require_sync_api_key` is the project-wide guard for any endpoint that
either writes PHI to the FHIR store or mints SMART launch tokens. When
`SYNC_API_KEY` is unset (the POC default) the dep is a no-op so first-time
users can `docker compose up` and try things out. Once `SYNC_API_KEY` is
set in `.env`, callers MUST include `X-Sync-API-Key: <value>`.
"""

from __future__ import annotations

from typing import Optional

from fastapi import Header, HTTPException

from app.core.config import settings


def require_sync_api_key(x_sync_api_key: Optional[str] = Header(None)) -> None:
    """Reject requests when SYNC_API_KEY is configured but the header is missing or wrong."""
    if not settings.SYNC_API_KEY:
        return  # auth disabled — POC / dev mode
    if x_sync_api_key != settings.SYNC_API_KEY:
        raise HTTPException(401, "Invalid or missing X-Sync-API-Key header")
