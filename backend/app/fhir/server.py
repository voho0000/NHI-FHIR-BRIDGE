from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.fhir_store import FHIRResource


class FHIRServer:
    """Minimal FHIR R4 CRUD layer backed by SQLite."""

    async def upsert(self, db: AsyncSession, resource: dict) -> dict:
        rtype = resource["resourceType"]
        fid = resource["id"]

        stmt = select(FHIRResource).where(
            and_(FHIRResource.resource_type == rtype, FHIRResource.fhir_id == fid)
        )
        row = (await db.execute(stmt)).scalar_one_or_none()

        if row:
            new_version = str(int(row.version_id) + 1)
            row.version_id = new_version
            row.resource = resource
            resource.setdefault("meta", {})["versionId"] = new_version
        else:
            row = FHIRResource(resource_type=rtype, fhir_id=fid, version_id="1", resource=resource)
            db.add(row)

        await db.commit()
        return resource

    async def read(self, db: AsyncSession, resource_type: str, fhir_id: str) -> dict | None:
        stmt = select(FHIRResource).where(
            and_(FHIRResource.resource_type == resource_type, FHIRResource.fhir_id == fhir_id)
        )
        row = (await db.execute(stmt)).scalar_one_or_none()
        return row.resource if row else None

    async def search(self, db: AsyncSession, resource_type: str, params: dict) -> list[dict]:
        stmt = select(FHIRResource).where(FHIRResource.resource_type == resource_type)
        rows = (await db.execute(stmt)).scalars().all()
        resources = [r.resource for r in rows]

        # Python-level filtering (sufficient for SQLite POC). Each param
        # narrows the candidate list — additive, AND semantics.
        if "patient" in params:
            pid = params["patient"].replace("Patient/", "")
            resources = [r for r in resources if _patient_ref_matches(r, pid)]

        # `encounter=Encounter/<id>` — used by SMART apps to fetch the
        # labs / meds / DRs tied to one visit. We populate
        # resource.encounter.reference on Observation, MedicationRequest,
        # DiagnosticReport, Procedure, Condition, AllergyIntolerance.
        if "encounter" in params:
            eid_full = params["encounter"]
            eid_bare = eid_full.replace("Encounter/", "")
            wanted = {f"Encounter/{eid_bare}", eid_bare}
            resources = [
                r
                for r in resources
                if ((r.get("encounter") or {}).get("reference") or "") in wanted
                or ((r.get("context") or {}).get("reference") or "") in wanted
            ]

        # `date=YYYY-MM-DD` or `date=ge2024-01-01` / `le2024-12-31` —
        # standard FHIR date search. Supports prefix operators on the
        # resource's clinically-relevant date field (effectiveDateTime,
        # authoredOn, performedDateTime, period.start). For SQLite POC
        # we just do prefix-string compare.
        if "date" in params:
            raw = params["date"]
            ops = []
            for prefix in ("ge", "le", "gt", "lt", "eq"):
                if raw.startswith(prefix):
                    ops.append((prefix, raw[2:]))
                    break
            else:
                ops.append(("eq", raw))

            def _rdate(r):
                for k in (
                    "effectiveDateTime",
                    "authoredOn",
                    "performedDateTime",
                    "recordedDate",
                    "issued",
                ):
                    if r.get(k):
                        return str(r[k])[:10]
                p = r.get("effectivePeriod") or r.get("performedPeriod") or r.get("period") or {}
                if isinstance(p, dict) and p.get("start"):
                    return str(p["start"])[:10]
                return ""

            def _cmp(rd, op, val):
                v = val[:10]
                if not rd:
                    return False
                if op == "eq":
                    return rd == v
                if op == "ge":
                    return rd >= v
                if op == "le":
                    return rd <= v
                if op == "gt":
                    return rd > v
                if op == "lt":
                    return rd < v
                return True

            for op, val in ops:
                resources = [r for r in resources if _cmp(_rdate(r), op, val)]

        # `code=<token>` — single-value match against any coding.code in
        # the resource's `code` element. Useful for narrowing to e.g.
        # all HbA1c observations across encounters. Accepts the bare
        # code value; system|code form (FHIR token search) returns matches
        # where either side matches.
        if "code" in params:
            tok = params["code"]
            if "|" in tok:
                _, want = tok.split("|", 1)
            else:
                want = tok

            def _codes(r):
                codings = (r.get("code") or {}).get("coding") or []
                return {c.get("code") for c in codings if c.get("code")}

            resources = [r for r in resources if want in _codes(r)]

        return resources

    async def list_all(self, db: AsyncSession, resource_type: str) -> list[dict]:
        stmt = select(FHIRResource).where(FHIRResource.resource_type == resource_type)
        rows = (await db.execute(stmt)).scalars().all()
        return [r.resource for r in rows]


def _patient_ref_matches(resource: dict, patient_id: str) -> bool:
    # FHIR resources use "subject" (most) or "patient" (AllergyIntolerance, etc.)
    for field in ("subject", "patient"):
        ref = resource.get(field, {})
        if isinstance(ref, dict):
            if patient_id in ref.get("reference", ""):
                return True
    return False


fhir_server = FHIRServer()
