// Backend-mode HTTP calls: per-page_type structured upload, the
// cumulative FHIR export, the cancel-time partial-data wipe, and the
// best-effort sync-history log. All take the RAW national ID and hash it
// internally — backend stores Patient under the hashed id, so every
// patient-scoped path must use the hashed form (sending the raw ID
// matches zero rows). Audit P1-1 (2026-06-12): with the de-identify
// toggle ON, the backend ingests a MASKED id (deidentifyOverride), so
// the lookup key must be derived from the masked form too —
// effectiveFhirPatientId is the shared source of truth. Callers that
// know the sync's mask state pass it explicitly; otherwise we read the
// current toggle.

import { effectiveFhirPatientId } from "@nhi-fhir-bridge/mapper";
import { NHI_HOST } from "./constants.js";
import { isMaskEnabled } from "./patient-override.js";

export async function postStructured(backend, page_type, items, syncApiKey, patientOverride) {
  const r = await fetch(`${backend}/sync/upload-structured`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(syncApiKey ? { "X-Sync-API-Key": syncApiKey } : {}),
    },
    body: JSON.stringify({
      page_type,
      host: NHI_HOST,
      items,
      patient_override: patientOverride || null,
    }),
  });
  if (!r.ok)
    throw new Error(`POST upload-structured ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return await r.json();
}

// Fetch the backend's complete cumulative FHIR Bundle for a patient
// (this sync + any prior syncs) — what the popup's 📥 download button
// saves in backend mode. Throws on non-2xx so the caller can record the
// failure without clobbering the truthful upload count.
export async function exportPatientBundle(backend, syncApiKey, patientId, deidentify?: boolean) {
  const fhirPid = effectiveFhirPatientId(patientId, deidentify ?? (await isMaskEnabled()));
  const expUrl = `${backend}/fhir/export?patient=${encodeURIComponent(fhirPid)}`;
  const r = await fetch(expUrl, {
    headers: syncApiKey ? { "X-Sync-API-Key": syncApiKey } : {},
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return await r.json();
}

// Discard any partial data uploaded before the user hit Stop. The user's
// contract is "stop = abort, I'll resync from scratch" — we don't want a
// half-loaded patient in the FHIR store that looks complete to downstream
// SMART apps.
export async function deletePartialPatientData(
  backend,
  syncApiKey,
  patientId,
  deidentify?: boolean,
) {
  const fhirPid = effectiveFhirPatientId(patientId, deidentify ?? (await isMaskEnabled()));
  await fetch(`${backend}/sync/patient/${encodeURIComponent(fhirPid)}`, {
    method: "DELETE",
    headers: syncApiKey ? { "X-Sync-API-Key": syncApiKey } : {},
  });
}

// Best-effort sync-history row for the dashboard (when/who/how-long/what/
// range). Caller wraps in try/catch — a logging failure must never
// surface to the user-facing sync status.
export async function postSyncLog(backend, syncApiKey, logBody) {
  await fetch(`${backend}/sync/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(syncApiKey ? { "X-Sync-API-Key": syncApiKey } : {}),
    },
    body: JSON.stringify(logBody),
  });
}
