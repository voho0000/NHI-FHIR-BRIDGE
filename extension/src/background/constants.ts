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

// v0.14+: bundle slot moved from chrome.storage.session (10 MB ceiling
// that imaging blew past) to chrome.storage.local with the
// unlimitedStorage permission. Happy-path stash is metadata-only because
// the SW auto-triggers chrome.downloads.download via an offscreen doc
// at sync completion — only cancel/error paths keep the JSON for retry.
// TTL sweep (PENDING_BUNDLE_TTL_MS) and explicit clear gestures bound
// the PHI window in the same way the session-storage approach did.
export const PENDING_BUNDLE_KEY = "pendingFhirBundle";
// v0.16.1: bundle storage split. PENDING_BUNDLE_KEY now holds metadata
// only (~200 B: filename / bytes / generatedAt / patientId / hasJson).
// The actual JSON string lives in PENDING_BUNDLE_JSON_KEY and is read
// ONLY when the user clicks the download button. Imaging bundles can
// be 80+ MB; reading them on every popup-open via the metadata path
// caused 2-3 sec freezes that delayed the wizard's data-active-step
// assignment, manifesting as FOUC of step 2 + step 3 overlapping.
export const PENDING_BUNDLE_JSON_KEY = "pendingFhirBundleJson";
export const PENDING_BUNDLE_TTL_MS = 60 * 60 * 1000; // 1 hour
export const PENDING_BUNDLE_SWEEP_ALARM = "pending-bundle-sweep";

// v0.15: per-patient "imaging triggered but base64 not yet fetched"
// stash. Survives across syncs so a row triggered but timed out in
// sync #1 is re-attempted at the start of sync #2 (by then the NHI
// 7-day cache has the base64 ready, so fetch is immediate). Keyed by
// patient ID so multiple-account users don't cross-contaminate.
// Cleared per-row as the seq arrives + base64 is fetched. TTL bounds
// the staleness window (NHI cache is 7 days; we use 8 for safety
// margin — after which the trigger is presumed to have rolled off and
// the row will be re-triggered next sync if still candidate).
export const PENDING_IMAGING_KEY_PREFIX = "nhiImagingPending:";
export const PENDING_IMAGING_TTL_MS = 8 * 24 * 60 * 60 * 1000; // 8 days

// v0.15+: Bearer token snapshot saved at sync end so the SW can do
// direct fetch calls to NHI during background polling, without going
// through chrome.scripting on a visible tab (which proved unreliable —
// tab throttling, discards, and Vue conflicts caused hangs).
//
// TTL: NHI bearer tokens probably expire in 15-30 min; treat anything
// older than 30 min as stale and trigger session-expired path.
export const NHI_BEARER_TOKEN_KEY = "nhiBearerToken";
export const NHI_BEARER_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 min

// v0.16.0 — imaging prep poll (count-only, no bundle hot-patch).
// After a sync ends with N triggered-waiting rows, SW polls NHI's
// IHKE3408S01 list endpoint every minute to count remaining
// status=0 rows so the popup banner can show prep progress. Does
// NOT auto-patch the bundle — user must re-sync to pull in newly-
// ready bytes (per v0.15 architectural simplification — auto-patch
// was removed because the moving-bundle UX was confusing).
//
// Differences from the deleted v0.14.x background poll:
//   - Counts only, never fetches bytes or modifies pendingFhirBundle.
//   - Single 30-min budget (matches NHI bearer TTL); no resume across
//     browser restarts beyond that window.
//   - Stops promptly on session-expired, count=0, new sync, or
//     user-dismiss.
export const IMAGING_PREP_POLL_ALARM = "imaging-prep-poll";
export const IMAGING_PREP_STATE_KEY = "imagingPrepState";
export const IMAGING_PREP_BASE_KEY = "imagingPrepBase";
export const IMAGING_PREP_MAX_MS = 30 * 60 * 1000; // 30 min
export const IMAGING_PREP_POLL_INTERVAL_MIN = 1;

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
  "care_plans",
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
