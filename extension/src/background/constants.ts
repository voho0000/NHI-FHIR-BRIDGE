// Shared constants for the background service worker modules.
// Pure values only — no chrome.* calls, no imports — so every other
// background module can depend on this without creating cycles.

export const STORAGE_KEY = "syncStatus";

export const NHI_HOST = "myhealthbank.nhi.gov.tw";

// Thrown when the popup's stop button sets the cancel flag; the in-flight
// sync re-checks the flag between phases and throws this to unwind promptly.
export const CANCEL_ERROR = "__SYNC_CANCELLED__";
// Thrown when NHI detects the session has expired (login page rendered, or
// tab redirected to auth namespace). Aborts sync immediately so the user can
// re-login and retry instead of timing out on every remaining page.
export const SESSION_EXPIRED_ERROR = "__SESSION_EXPIRED__";

// Local mode stashes the assembled Bundle in chrome.storage.session under a
// single slot. Why session (not local) — security audit #5: PHI in
// chrome.storage.local survives browser restarts indefinitely; the
// MV3-native chrome.storage.session is wiped automatically when the browser
// closes, drastically shrinking the disk-resident PHI window.
export const PENDING_BUNDLE_KEY = "pendingFhirBundle";
export const PENDING_BUNDLE_TTL_MS = 60 * 60 * 1000; // 1 hour
export const PENDING_BUNDLE_SWEEP_ALARM = "pending-bundle-sweep";

// Debug toggle for the per-endpoint "first body sample" stash used to
// diagnose adapter mismatches (raw_count > 0 but adapted_count == 0).
// HARD-OFF in the published extension: the sample contains raw NHI payload
// (lab values, drug names, encounter records — PHI). Flip to true *locally*
// during adapter development; never commit `true`.
export const DEBUG_STASH_BODY_SAMPLES = false;

// Local-mode mapper order — mirrors backend/upload-structured: encounters
// first so linkEncountersInResources can attach references to downstream
// observations / medications / etc.
export const LOCAL_PAGE_TYPE_ORDER = [
  "encounters",
  "observations",
  "medications",
  "conditions",
  "allergies",
  "diagnostic_reports",
  "procedures",
  "immunizations",
];

// One-time migration from chrome.storage.sync → chrome.storage.local.
// Previous versions stored syncApiKey + patientOverride (containing the
// national ID) under .sync, which Chrome replicates to the user's Google
// account and pushes to every device they sign into.
export const SYNC_KEYS_TO_MIGRATE = [
  "backendUrl",
  "syncApiKey",
  "smartAppLaunchUrl",
  "patientOverride",
  "syncMode",
  "maskNameEnabled",
];
