// Storage housekeeping: one-time sync→local settings migration, the
// install-time PHI sweep for keys older extension versions left behind,
// and the periodic TTL sweep of the pending-bundle slot.

import { PENDING_BUNDLE_KEY, PENDING_BUNDLE_TTL_MS, SYNC_KEYS_TO_MIGRATE } from "./constants.js";

// One-time migration from chrome.storage.sync → chrome.storage.local.
// Previous versions stored syncApiKey + patientOverride (containing the
// national ID) under .sync, which Chrome replicates to the user's Google
// account and pushes to every device they sign into. Move everything
// settings-related to .local; clear the sync copy.
export async function migrateSyncToLocal() {
  try {
    const synced = await chrome.storage.sync.get(SYNC_KEYS_TO_MIGRATE);
    const present = Object.fromEntries(Object.entries(synced).filter(([, v]) => v !== undefined));
    if (Object.keys(present).length === 0) return;
    const local = await chrome.storage.local.get(Object.keys(present));
    // Don't overwrite anything the user already set on this machine.
    const toWrite = Object.fromEntries(
      Object.entries(present).filter(([k]) => local[k] === undefined),
    );
    if (Object.keys(toWrite).length > 0) {
      await chrome.storage.local.set(toWrite);
    }
    await chrome.storage.sync.remove(Object.keys(present));
  } catch {
    // Migration is best-effort. The next run gets to try again.
  }
}

// Security audit #5 cleanup: users upgrading from <= v0.8.7 may have
// a `pendingFhirBundle` (entire FHIR Bundle JSON) and/or
// `__sampleBody_*` entries (raw NHI payload) sitting in
// chrome.storage.local from previous installs. The new version uses
// chrome.storage.session for the pending bundle and gates the body
// samples behind a debug flag — so those local entries are now pure
// PHI dead weight. Sweep them on every install/update.
export async function sweepStaleLocalKeys() {
  try {
    const all: any = await chrome.storage.local.get(null);
    const stale = Object.keys(all).filter(
      (k) => k === "pendingFhirBundle" || k.startsWith("__sampleBody_"),
    );
    if (stale.length) await chrome.storage.local.remove(stale);
  } catch {}
}

// PHI TTL sweep (security audit #5): v0.14+ the bundle slot lives in
// chrome.storage.local with unlimitedStorage (the offscreen-driven Save
// As flow happens at sync time, so the stash is metadata-only most of
// the time — only cancel/error keeps the JSON for retry). If the user
// leaves the popup unconsumed for hours, the 10-min alarm drops the
// record once it exceeds PENDING_BUNDLE_TTL_MS (1 hour).
export async function sweepPendingBundleIfStale() {
  try {
    const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.local.get(PENDING_BUNDLE_KEY);
    if (!pending) return;
    const age = Date.now() - (pending.generatedAt || 0);
    if (age > PENDING_BUNDLE_TTL_MS) {
      await chrome.storage.local.remove(PENDING_BUNDLE_KEY);
    }
  } catch {}
}
