/**
 * Sync API — capture endpoints + logs + audit.
 *
 * Mounted at `/sync` from main.ts. The only ingest path is
 * /sync/upload-structured — the extension calls NHI's JSON
 * endpoints in-browser, adapts the shape, and POSTs structured
 * items here. There is no LLM-based fallback; previous versions
 * had /sync/upload-html (HTML scraping + LLM extraction) but it
 * was removed in v0.5.0 to keep PHI on-host unconditionally.
 */

import { and, desc, eq, ne, or } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db as defaultDb, sqlite } from "@/core/database";
import { requireSyncApiKey } from "@/core/security";
import { fhirServer } from "@/fhir/server";
import { type SyncLog, auditLog, fhirResources, patientSyncState, syncLogs } from "@/models/schema";
import {
  GROUP_HANDLERS,
  LIST_HANDLERS,
  dedupAdmissionDayAmb,
  derivePatientId,
  linkEncountersInResources,
  mapPatient,
  resolveSexStratifiedRanges,
} from "@nhi-fhir-bridge/mapper";

export const syncApi = new Hono();

// `dedupAdmissionDayAmb`, `linkEncountersInResources`, and
// `resolveSexStratifiedRanges` live in `@nhi-fhir-bridge/mapper`
// as pure functions. Backend feeds them resources fetched from
// SQLite; the extension's local mode feeds them in-memory arrays.

// ── Zod schemas ──────────────────────────────────────────────────────

const PatientOverrideSchema = z
  .object({
    id_no: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    birth_date: z.string().nullable().optional(),
    gender: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

const UploadStructuredPayloadSchema = z.object({
  page_type: z.string(),
  items: z.array(z.record(z.any())).default([]),
  patient_id: z.string().nullable().optional(),
  host: z.string().nullable().optional(),
  patient_override: PatientOverrideSchema,
});

type PatientOverride = z.infer<typeof PatientOverrideSchema>;

// ── Helpers ──────────────────────────────────────────────────────────

function logToDict(log: SyncLog): Record<string, any> {
  return {
    id: log.id,
    status: log.status,
    patient_id: log.patientId,
    message: log.message,
    created_at: log.createdAt.toISOString(),
    completed_at: log.completedAt ? log.completedAt.toISOString() : null,
  };
}

function buildOverridePatient(override: NonNullable<PatientOverride>): Record<string, any> {
  const overrideId = override?.id_no?.trim() || null;
  const raw: Record<string, any> = {
    id: overrideId,
    identifier: overrideId,
    name: override?.name || overrideId,
  };
  if (override?.birth_date) raw.birthDate = override.birth_date;
  if (override?.gender) raw.gender = override.gender;
  return mapPatient(raw);
}

// ── Status / list / write log ────────────────────────────────────────

// All sync routes carry PHI metadata (patient_id in logs, audit, states).
// Gate every route behind the API key, not just writes.
syncApi.use("*", requireSyncApiKey);

syncApi.get("/status/:logId", (c) => {
  const logId = c.req.param("logId");
  const row = defaultDb.select().from(syncLogs).where(eq(syncLogs.id, logId)).get();
  if (!row) return c.json({ detail: "Log not found" }, 404);
  return c.json(logToDict(row));
});

syncApi.get("/logs", (c) => {
  const rows = defaultDb.select().from(syncLogs).orderBy(desc(syncLogs.createdAt)).limit(20).all();
  return c.json(rows.map(logToDict));
});

syncApi.post("/log", requireSyncApiKey, async (c) => {
  let payload: any;
  try {
    payload = await c.req.json();
  } catch {
    return c.json({ detail: "Request body must be JSON" }, 400);
  }

  const now = new Date();
  let started = now;
  if (payload?.started_at) {
    try {
      const d = new Date(String(payload.started_at));
      if (!Number.isNaN(d.getTime())) started = d;
    } catch {
      // ignore
    }
  }

  const details = {
    patient_name: payload?.patient_name ?? "",
    total: Number.parseInt(String(payload?.total ?? 0), 10) || 0,
    breakdown: Array.isArray(payload?.breakdown) ? payload.breakdown : [],
    date_range: payload?.date_range ?? "",
    elapsed_ms: Number.parseInt(String(payload?.elapsed_ms ?? 0), 10) || 0,
    errors: Array.isArray(payload?.errors) ? payload.errors : [],
  };

  const inserted = defaultDb
    .insert(syncLogs)
    .values({
      status: String(payload?.status ?? "success"),
      patientId: payload?.patient_id ?? null,
      message: JSON.stringify(details),
      createdAt: started,
      completedAt: now,
    })
    .returning({ id: syncLogs.id })
    .get();

  return c.json({ id: inserted.id });
});

syncApi.get("/patient-states", (c) => {
  const rows = defaultDb.select().from(patientSyncState).all();
  return c.json(
    rows.map((r) => ({
      patient_id: r.patientId,
      last_synced_at: r.lastSyncedAt ? r.lastSyncedAt.toISOString() : null,
      sync_log_id: r.syncLogId,
    })),
  );
});

syncApi.delete("/logs", (c) => {
  const result = defaultDb.delete(syncLogs).where(ne(syncLogs.status, "running")).run();
  return c.json({ deleted: result.changes });
});

syncApi.delete("/logs/:logId", (c) => {
  const logId = c.req.param("logId");
  const existing = defaultDb.select().from(syncLogs).where(eq(syncLogs.id, logId)).get();
  if (!existing) return c.json({ detail: `Sync log ${logId} not found` }, 404);
  defaultDb.delete(syncLogs).where(eq(syncLogs.id, logId)).run();
  return c.json({ deleted: 1 });
});

syncApi.delete("/patient/:patientId", requireSyncApiKey, (c) => {
  const patientId = c.req.param("patientId");
  // Escape SQL LIKE metacharacters in the patient_id so an ID containing
  // % or _ can't widen the deletion.
  const safeRef = `Patient/${patientId}`
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");
  const result = defaultDb
    .delete(fhirResources)
    .where(
      or(
        and(eq(fhirResources.resourceType, "Patient"), eq(fhirResources.fhirId, patientId)),
        sql`CAST(${fhirResources.resource} AS TEXT) LIKE ${`%${safeRef}%`} ESCAPE '\\'`,
      ),
    )
    .run();
  return c.json({ patient_id: patientId, deleted: result.changes });
});

// ── Latest dates ─────────────────────────────────────────────────────

syncApi.get("/latest-dates", (c) => {
  const patientId = c.req.query("patient_id");
  if (!patientId) return c.json({ detail: "patient_id is required" }, 422);

  const DATE_FIELDS = ["effectiveDateTime", "authoredOn", "performedDateTime", "recordedDate"];
  const extractDate = (r: Record<string, any>): string | null => {
    for (const f of DATE_FIELDS) {
      const v = r[f];
      if (v) return String(v).slice(0, 10);
    }
    const period = r.period ?? {};
    if (period.start) return String(period.start).slice(0, 10);
    const pp = r.performedPeriod ?? {};
    if (pp.start) return String(pp.start).slice(0, 10);
    return null;
  };

  const out: Record<string, string | null> = {};
  for (const rt of [
    "Encounter",
    "MedicationRequest",
    "Observation",
    "DiagnosticReport",
    "Procedure",
    "AllergyIntolerance",
  ]) {
    const resources = fhirServer.search(rt, { patient: patientId });
    let latest: string | null = null;
    for (const r of resources) {
      const d = extractDate(r);
      if (d && (latest === null || d > latest)) latest = d;
    }
    out[rt] = latest;
  }
  return c.json({ patient_id: patientId, latest: out });
});

// ── Audit log ────────────────────────────────────────────────────────

syncApi.get("/audit-log", (c) => {
  const limit = Math.min(Number.parseInt(c.req.query("limit") ?? "100", 10) || 100, 1000);
  const hisUser = c.req.query("his_user");
  const patientId = c.req.query("patient_id");

  const conds = [];
  if (hisUser) conds.push(eq(auditLog.hisUser, hisUser));
  if (patientId) conds.push(eq(auditLog.patientId, patientId));

  const q = defaultDb.select().from(auditLog);
  const filtered = conds.length > 0 ? q.where(and(...conds)) : q;
  const rows = filtered.orderBy(desc(auditLog.timestamp)).limit(limit).all();

  return c.json(
    rows.map((r) => ({
      id: r.id,
      timestamp: r.timestamp.toISOString(),
      his_user: r.hisUser,
      his_host: r.hisHost,
      page_type: r.pageType,
      patient_id: r.patientId,
      html_size: r.htmlSize,
      resources_upserted: r.resourcesUpserted,
      success: r.success,
      error: r.error,
    })),
  );
});

// ── Upload-structured (primary, no LLM) ──────────────────────────────

syncApi.post("/upload-structured", requireSyncApiKey, async (c) => {
  let payload: z.infer<typeof UploadStructuredPayloadSchema>;
  try {
    const raw = await c.req.json();
    payload = UploadStructuredPayloadSchema.parse(raw);
  } catch (e: any) {
    return c.json({ detail: e?.message ?? "Invalid payload" }, 400);
  }

  const override = payload.patient_override ?? null;
  const overrideId = override?.id_no?.trim() || null;
  // Raw national ID (caller-supplied) vs FHIR Patient.id (hashed).
  // Mappers want the hashed form so every subject.reference matches
  // the Patient.id; lookups by Patient also use the hashed form.
  const rawPid = overrideId ?? payload.patient_id ?? null;
  const effectivePid = rawPid ? derivePatientId(rawPid) : null;

  // patient_info + override → bypass extraction, build Patient directly.
  if (payload.page_type === "patient_info" && overrideId) {
    const patient = buildOverridePatient(override!);
    fhirServer.upsert(patient);
    defaultDb
      .insert(auditLog)
      .values({
        hisHost: payload.host ?? null,
        pageType: payload.page_type,
        patientId: patient.id,
        htmlSize: 0,
        resourcesUpserted: 1,
      })
      .run();
    return c.json({
      page_type: "patient_info",
      patient_id: patient.id,
      count: 1,
      patient_source: "manual_override",
    });
  }

  if (!effectivePid) {
    return c.json(
      {
        detail: `page_type=${payload.page_type} requires patient_id (or patient_override.id_no)`,
      },
      400,
    );
  }

  // Auto-create Patient from override when not yet in FHIR.
  if (overrideId) {
    if (!fhirServer.read("Patient", effectivePid)) {
      fhirServer.upsert(buildOverridePatient(override!));
    }
  }

  let resources: Record<string, any>[];
  if (payload.page_type in GROUP_HANDLERS) {
    resources = GROUP_HANDLERS[payload.page_type]!(payload.items, effectivePid);
  } else if (payload.page_type in LIST_HANDLERS) {
    const [mapper] = LIST_HANDLERS[payload.page_type]!;
    const mapped = payload.items
      .filter((it) => it && typeof it === "object")
      .map((it) => mapper(it, effectivePid));
    resources = mapped.filter((r): r is Record<string, any> => r !== null);
  } else {
    return c.json({ detail: `Unsupported page_type: ${payload.page_type}` }, 400);
  }

  if (payload.page_type === "encounters") {
    resources = dedupAdmissionDayAmb(resources);
  }
  const dbEncounters = fhirServer.search("Encounter", { patient: effectivePid });
  linkEncountersInResources(dbEncounters, resources);
  resolveSexStratifiedRanges(fhirServer.read("Patient", effectivePid), resources);

  // Wrap the upsert burst + audit log in a single SQLite transaction.
  // Without this, every fhirServer.upsert() commits and fsyncs separately
  // — fine on a local SSD (~1ms each) but devastating on macOS Docker
  // bind-mounts where each fsync hits the gRPC FUSE layer (~100ms each).
  // 1000-row sync drops from ~100s to <1s with one transaction.
  const upserted: Array<{ resourceType: string; id: string }> = [];
  const runUpserts = sqlite.transaction(() => {
    for (const r of resources) {
      fhirServer.upsert(r);
      upserted.push({ resourceType: r.resourceType, id: r.id });
    }
    defaultDb
      .insert(auditLog)
      .values({
        hisHost: payload.host ?? null,
        pageType: payload.page_type,
        patientId: effectivePid,
        htmlSize: 0,
        resourcesUpserted: resources.length,
      })
      .run();
  });
  runUpserts();

  return c.json({
    page_type: payload.page_type,
    patient_id: effectivePid,
    count: upserted.length,
    resources: upserted,
  });
});

// /sync/upload-html (the LLM fallback path) was removed in v0.5.0.
// Reason: every NHI page-type we support has a stable JSON endpoint
// the extension hits directly, so the LLM path was paying for
// dependencies (Anthropic SDK, Ollama, cheerio) and a privacy footgun
// (raw HTML containing PHI shipped to an LLM) without delivering value.
