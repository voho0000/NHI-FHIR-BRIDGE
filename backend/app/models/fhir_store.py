import uuid
from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


class FHIRResource(Base):
    """Stores any FHIR R4 resource as JSON."""

    __tablename__ = "fhir_resources"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    resource_type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    fhir_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    version_id: Mapped[str] = mapped_column(String(16), nullable=False, default="1")
    resource: Mapped[dict] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )


class SyncLog(Base):
    """Audit log for each HIS sync job."""

    __tablename__ = "sync_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="running")
    patient_id: Mapped[str] = mapped_column(String(255), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    completed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)


class OAuthClient(Base):
    """Registered SMART on FHIR clients."""

    __tablename__ = "oauth_clients"

    client_id: Mapped[str] = mapped_column(String(255), primary_key=True)
    client_secret: Mapped[str] = mapped_column(String(255), nullable=True)
    client_name: Mapped[str] = mapped_column(String(255), nullable=False)
    redirect_uris: Mapped[list] = mapped_column(JSON, default=list)
    allowed_scopes: Mapped[list] = mapped_column(JSON, default=list)
    is_confidential: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class AuthorizationCode(Base):
    """Short-lived OAuth2 authorization codes."""

    __tablename__ = "authorization_codes"

    code: Mapped[str] = mapped_column(String(255), primary_key=True)
    client_id: Mapped[str] = mapped_column(String(255), nullable=False)
    redirect_uri: Mapped[str] = mapped_column(String(1024), nullable=False)
    scopes: Mapped[list] = mapped_column(JSON, default=list)
    patient_id: Mapped[str] = mapped_column(String(255), nullable=True)
    code_challenge: Mapped[str] = mapped_column(String(255), nullable=True)
    code_challenge_method: Mapped[str] = mapped_column(String(16), nullable=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    used: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class OAuthToken(Base):
    """Active access tokens issued to SMART apps."""

    __tablename__ = "oauth_tokens"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    client_id: Mapped[str] = mapped_column(String(255), nullable=False)
    access_token: Mapped[str] = mapped_column(String(512), unique=True, nullable=False)
    scopes: Mapped[list] = mapped_column(JSON, default=list)
    patient_id: Mapped[str] = mapped_column(String(255), nullable=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class PatientSyncState(Base):
    """Tracks the last successful sync timestamp for each patient.

    The extension records completion here so subsequent syncs can skip
    patients whose last_synced_at is recent.
    """

    __tablename__ = "patient_sync_state"

    patient_id: Mapped[str] = mapped_column(String(255), primary_key=True)
    last_synced_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    sync_log_id: Mapped[str] = mapped_column(String(36), nullable=True)


class AuditLog(Base):
    """Per-capture audit trail for /sync/upload-html.

    Records WHO synced WHAT WHEN, sourced from the HIS user identifier in
    the captured HTML's navbar (e.g. 使用者:XXXX or 操作人員:XXXX) — this is
    the real attribution the institution / IRB needs, not the backend's own
    auth identity (which today doesn't exist for /sync/* endpoints).

    PHI scope: stores patient_id and his_user (a hospital staff identifier).
    Both should be considered sensitive; live in the same SQLite DB as the
    FHIR data and inherit its protections.
    """

    __tablename__ = "audit_log"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    his_user: Mapped[str] = mapped_column(String(64), nullable=True, index=True)
    his_host: Mapped[str] = mapped_column(String(255), nullable=True)
    page_type: Mapped[str] = mapped_column(String(64), nullable=False)
    patient_id: Mapped[str] = mapped_column(String(64), nullable=True, index=True)
    html_size: Mapped[int] = mapped_column(default=0)
    resources_upserted: Mapped[int] = mapped_column(default=0)
    success: Mapped[bool] = mapped_column(Boolean, default=True)
    error: Mapped[str] = mapped_column(Text, nullable=True)
    # Reserved for future Bearer-token auth — keep the column even when
    # auth is not yet enforced so we don't have to migrate the schema.
    auth_token_hint: Mapped[str] = mapped_column(String(64), nullable=True)
