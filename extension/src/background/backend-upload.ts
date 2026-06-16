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
  if (r.status === 401) {
    // Audit P2-8: raw English 401 JSON was the only hint that the API key
    // is wrong — point the user at the actual fix.
    throw new Error("API Key 驗證失敗（401）— 請到「⚙️ 進階設定」檢查 Sync API Key 是否與後端一致");
  }
  if (!r.ok)
    throw new Error(`POST upload-structured ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return await r.json();
}

// Backend caps any request body at 32 MB (backend-ts/src/main.ts bodyLimit).
// The "抓影像" opt-in inlines base64 JPGs into imaging items (~2-3 MB each),
// so a heavy-imaging patient's single `page_type="imaging"` POST can exceed
// 32 MB → 413, and that whole page_type silently fails to land on the backend.
// We pack items into sub-batches under a budget well below 32 MB (margin for
// the JSON envelope + multi-byte chars), then POST each batch. Backend upsert
// is per-resource idempotent, so N POSTs of the same page_type accumulate
// correctly.
export const MAX_UPLOAD_BYTES = 24 * 1024 * 1024;

// Greedily pack items into batches whose serialized size stays under
// `maxBytes`. An item larger than the budget gets its own batch (it can't be
// split — one item is one FHIR resource); if such a lone item still exceeds
// the backend's hard 32 MB cap it will 413, but that is an irreducible
// single-resource limit (one study with too many inlined frames). Pure +
// deterministic so it can be unit-tested without the network.
export function chunkItemsBySize(items, maxBytes = MAX_UPLOAD_BYTES) {
  const batches = [];
  let cur = [];
  let curBytes = 0;
  for (const it of items) {
    const sz = JSON.stringify(it).length;
    if (cur.length > 0 && curBytes + sz > maxBytes) {
      batches.push(cur);
      cur = [];
      curBytes = 0;
    }
    cur.push(it);
    curBytes += sz;
  }
  if (cur.length > 0) batches.push(cur);
  return batches;
}

// Size-aware wrapper around postStructured: chunks oversized page_types into
// multiple POSTs. For the common case (small page_types → one batch) it is
// byte-for-byte the old single-POST behavior. Returns the summed resource
// count so the caller's progress total stays accurate.
export async function postStructuredChunked(
  backend,
  page_type,
  items,
  syncApiKey,
  patientOverride,
) {
  const batches = chunkItemsBySize(items);
  if (batches.length <= 1) {
    return await postStructured(backend, page_type, items, syncApiKey, patientOverride);
  }
  let count = 0;
  for (const batch of batches) {
    const data = await postStructured(backend, page_type, batch, syncApiKey, patientOverride);
    count += data.count || 0;
  }
  return { count, batches: batches.length };
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
