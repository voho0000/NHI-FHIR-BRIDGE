// Storage housekeeping: one-time sync→local settings migration, the
// install-time PHI sweep for keys older extension versions left behind,
// and the periodic TTL sweep of the pending-bundle slot.

import {
  NHI_BEARER_TOKEN_KEY,
  NHI_BEARER_TOKEN_TTL_MS,
  PENDING_BUNDLE_JSON_KEY,
  PENDING_BUNDLE_KEY,
  PENDING_BUNDLE_TTL_MS,
  SYNC_KEYS_TO_MIGRATE,
} from "./constants.js";

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
// `__sampleBody_*` entries (raw NHI payload) sitting in
// chrome.storage.local from previous installs — pure PHI dead weight.
// Sweep them on every install/update.
//
// 2026-06-12 (audit P0-4): `pendingFhirBundle` was REMOVED from this
// sweep. v0.14 recycled that exact key name as the CURRENT bundle-
// metadata slot, so sweeping it on every extension update deleted the
// live metadata while PENDING_BUNDLE_JSON_KEY (the 80+ MB PHI blob)
// survived — orphaned forever, because the TTL sweep early-returns
// without metadata and the popup hides its download/clear buttons.
// Legacy <= v0.8.7 full-JSON values under this key are still bounded:
// they lack `generatedAt`, so sweepPendingBundleIfStale treats them as
// infinitely old and drops them on the next 10-min alarm.
export async function sweepStaleLocalKeys() {
  try {
    const all: any = await chrome.storage.local.get(null);
    const stale = Object.keys(all).filter((k) => k.startsWith("__sampleBody_"));
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
    // v0.16.1: only need metadata to decide staleness; never pull the
    // 80+ MB JSON into the SW for a sweep check.
    const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.local.get(PENDING_BUNDLE_KEY);
    if (!pending) {
      // 2026-06-12 (audit P0-4): metadata absent but the JSON blob may
      // still exist — pre-fix versions orphaned it on extension update.
      // getBytesInUse checks existence without pulling 80+ MB into the SW.
      const orphanBytes = await chrome.storage.local.getBytesInUse(PENDING_BUNDLE_JSON_KEY);
      if (orphanBytes > 0) await chrome.storage.local.remove(PENDING_BUNDLE_JSON_KEY);
      return;
    }
    const age = Date.now() - (pending.generatedAt || 0);
    if (age > PENDING_BUNDLE_TTL_MS) {
      await chrome.storage.local.remove([PENDING_BUNDLE_KEY, PENDING_BUNDLE_JSON_KEY]);
    }
  } catch {}
}

// 2026-06-12 (audit P1-6): the NHI bearer-token snapshot used to persist
// until the NEXT sync overwrote it — loadBearerToken() rejected expired
// entries but never deleted them, and no sweep listed the key. A live-ish
// NHI session token on disk is a credential, not PHI dead weight; bound
// its life to the 30-min TTL (plus at most one 10-min alarm period).
export async function sweepStaleBearerToken() {
  try {
    const obj: any = await chrome.storage.local.get(NHI_BEARER_TOKEN_KEY);
    const stash = obj[NHI_BEARER_TOKEN_KEY];
    if (stash && Date.now() - (stash.savedAt || 0) > NHI_BEARER_TOKEN_TTL_MS) {
      await chrome.storage.local.remove(NHI_BEARER_TOKEN_KEY);
    }
  } catch {}
}

/** Hard-delete the bearer-token snapshot (poll finished / session expired). */
export async function purgeBearerToken() {
  try {
    await chrome.storage.local.remove(NHI_BEARER_TOKEN_KEY);
  } catch {}
}
