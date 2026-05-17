/**
 * FHIR R4 REST endpoints.
 *
 * Port of `backend/app/api/fhir.py`. Mounted at `/fhir` from main.ts.
 * Same routes, headers, response shapes — extension + dashboard +
 * SMART apps require byte-for-byte parity here.
 */

import { Hono } from "hono";

import { settings } from "@/core/config";
import { requireFhirAuth, requireSyncApiKey } from "@/core/security";
import { buildCapabilityStatement } from "@/fhir/capability";
import { fhirServer } from "@/fhir/server";
import { smartAuth } from "@/smart/oauth2";

export const fhirApi = new Hono();

// ── Auth helpers ─────────────────────────────────────────────────────

function getAuthenticatedPatientId(authorization: string | undefined): string | null {
  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return null;
  }
  const token = authorization.slice(7).trim();
  const row = smartAuth.validateToken(token);
  return row?.patientId ?? null;
}

function resolvePatientFilter(
  authPatientId: string | null,
  queryPatient: string | null,
): string | null {
  // Token present → always force the token's patient (overrides any
  // ?patient= query) to prevent a SMART app with a P002 token from
  // reading P001's data.
  return authPatientId || queryPatient;
}

/**
 * For single-resource reads: when the token is patient-bound, verify
 * the fetched resource belongs to that patient. EXACT match against
 * `Patient/<id>`. Returns null on success, an HTTPError-like object on
 * failure (the caller throws).
 */
function enforceReadAccess(resource: Record<string, any>, authPatientId: string | null): boolean {
  if (!authPatientId) return true;
  const expected = `Patient/${authPatientId}`;
  for (const field of ["subject", "patient"]) {
    const ref = resource[field];
    if (ref && typeof ref === "object" && ref.reference === expected) {
      return true;
    }
  }
  return false;
}

// ── Bundle helpers ───────────────────────────────────────────────────

function bundleEntry(resource: Record<string, any>): Record<string, any> {
  const rtype = resource.resourceType ?? "";
  const rid = resource.id ?? "";
  return {
    fullUrl: `${settings.FHIR_BASE_URL}/${rtype}/${rid}`,
    resource,
  };
}

function makeBundle(resources: Record<string, any>[]): Record<string, any> {
  return {
    resourceType: "Bundle",
    type: "searchset",
    total: resources.length,
    entry: resources.map(bundleEntry),
  };
}

// ── Discovery ────────────────────────────────────────────────────────

fhirApi.get("/metadata", (c) => c.json(buildCapabilityStatement()));

fhirApi.get("/.well-known/smart-configuration", (c) => {
  const base = settings.FHIR_BASE_URL.replace("/fhir", "");
  return c.json({
    issuer: base,
    authorization_endpoint: `${base}/smart/authorize`,
    token_endpoint: `${base}/smart/token`,
    capabilities: [
      "launch-standalone",
      "launch-ehr",
      "client-public",
      "context-standalone-patient",
      "permission-patient",
      "sso-openid-connect",
    ],
    scopes_supported: [
      "openid",
      "fhirUser",
      "launch",
      "launch/patient",
      "patient/*.read",
      "online_access",
      "offline_access",
    ],
    response_types_supported: ["code"],
    code_challenge_methods_supported: ["S256"],
  });
});

// ── PHI auth gate for everything below ───────────────────────────────
// All /Patient and per-patient resource routes require either a SMART
// bearer or the X-Sync-API-Key. Discovery routes above stay open.
fhirApi.use("/Patient", requireFhirAuth);
fhirApi.use("/Patient/*", requireFhirAuth);

// ── Patient ──────────────────────────────────────────────────────────

fhirApi.get("/Patient", (c) => {
  const authPid = getAuthenticatedPatientId(c.req.header("Authorization"));
  if (authPid) {
    const patient = fhirServer.read("Patient", authPid);
    return c.json(makeBundle(patient ? [patient] : []));
  }
  return c.json(makeBundle(fhirServer.listAll("Patient")));
});

fhirApi.get("/Patient/:patientId", (c) => {
  const patientId = c.req.param("patientId");
  const authPid = getAuthenticatedPatientId(c.req.header("Authorization"));
  if (authPid && authPid !== patientId) {
    return c.json({ detail: `Patient/${patientId} not found` }, 404);
  }
  const r = fhirServer.read("Patient", patientId);
  if (!r) {
    return c.json({ detail: `Patient/${patientId} not found` }, 404);
  }
  return c.json(r);
});

// ── Per-patient resources ────────────────────────────────────────────

const PER_PATIENT_RESOURCES = [
  "Observation",
  "MedicationRequest",
  "Condition",
  "AllergyIntolerance",
  "DiagnosticReport",
  "Procedure",
  "Encounter",
  // Empty-bundle stubs so SMART apps querying these don't get 404s.
  "DocumentReference",
  "Immunization",
  "CarePlan",
  "Goal",
  "FamilyMemberHistory",
  "Composition",
  "ServiceRequest",
  "ImagingStudy",
];

for (const rtype of PER_PATIENT_RESOURCES) {
  fhirApi.use(`/${rtype}`, requireFhirAuth);
  fhirApi.use(`/${rtype}/*`, requireFhirAuth);

  fhirApi.get(`/${rtype}`, (c) => {
    const authPid = getAuthenticatedPatientId(c.req.header("Authorization"));
    const queryPid = c.req.query("patient") ?? null;
    const pid = resolvePatientFilter(authPid, queryPid);
    const params: Record<string, string> = {};
    if (pid) params.patient = pid;
    const enc = c.req.query("encounter");
    if (enc) params.encounter = enc;
    const date = c.req.query("date");
    if (date) params.date = date;
    const code = c.req.query("code");
    if (code) params.code = code;
    return c.json(makeBundle(fhirServer.search(rtype, params)));
  });

  fhirApi.get(`/${rtype}/:resourceId`, (c) => {
    const resourceId = c.req.param("resourceId");
    const authPid = getAuthenticatedPatientId(c.req.header("Authorization"));
    const r = fhirServer.read(rtype, resourceId);
    if (!r) {
      return c.json({ detail: `${rtype}/${resourceId} not found` }, 404);
    }
    if (!enforceReadAccess(r, authPid)) {
      return c.json({ detail: "Resource not found" }, 404);
    }
    return c.json(r);
  });
}

// ── Export (PHI dump — SYNC_API_KEY-gated) ───────────────────────────

fhirApi.get("/export", requireSyncApiKey, (c) => {
  const patient = c.req.query("patient");
  const all: Record<string, any>[] = [];

  if (patient) {
    const p = fhirServer.read("Patient", patient);
    if (p) all.push(p);
  } else {
    all.push(...fhirServer.listAll("Patient"));
  }

  for (const rtype of PER_PATIENT_RESOURCES) {
    const params: Record<string, string> = patient ? { patient } : {};
    all.push(...fhirServer.search(rtype, params));
  }

  return c.json({
    resourceType: "Bundle",
    type: "collection",
    timestamp: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
    entry: all.map(bundleEntry),
  });
});

// ── Import (PHI write — SYNC_API_KEY-gated) ──────────────────────────

fhirApi.post("/import", requireSyncApiKey, async (c) => {
  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ detail: "Request body must be valid JSON" }, 400);
  }

  let resources: any[];
  if (Array.isArray(body)) {
    resources = body;
  } else if (body && typeof body === "object") {
    const rtype = body.resourceType ?? "";
    if (rtype === "Bundle") {
      resources = (body.entry ?? []).map((e: any) => e.resource ?? e);
    } else if (rtype) {
      resources = [body];
    } else {
      return c.json({ detail: "Expected a FHIR Bundle, resource, or array of resources" }, 400);
    }
  } else {
    return c.json({ detail: "Unexpected body type" }, 400);
  }

  let imported = 0;
  let skipped = 0;
  for (const r of resources) {
    if (r && typeof r === "object" && r.resourceType && r.id) {
      fhirServer.upsert(r);
      imported++;
    } else {
      skipped++;
    }
  }
  return c.json({ imported, skipped, total: resources.length });
});
