// Shared constants for the popup modules. Pure values only.

export const DEFAULT_BACKEND = "http://localhost:8010";

// Default SMART app for a fresh install. Users can override via
// the '⚙️ 進階設定 → SMART App Launch URL' field; the value is
// persisted in chrome.storage.local under `smartAppLaunchUrl`.
// This URL is used for Mode B's OAuth launch flow (it expects to
// receive iss + launch query params from a SMART on FHIR launch).
export const DEFAULT_SMART_APP_LAUNCH =
  "https://voho0000.github.io/medical-note-smart-on-fhir/smart/launch";

// Step 4 standalone-open URL. Hardcoded — the step 4 button always
// opens this URL in a new tab with no query params (Mode A users
// manually drag the downloaded JSON into the page). Distinct from
// DEFAULT_SMART_APP_LAUNCH because that one is the OAuth /smart/launch
// endpoint; this one is the SMART app's plain entry page.
export const STANDALONE_SMART_APP_URL = "https://voho0000.github.io/medical-note-smart-on-fhir/";

export const DEFAULT_MODE = "local";

export const NHI_LANDING = "https://myhealthbank.nhi.gov.tw/IHKE3000";
// Direct URL of the login picker page (a generic landing → login redirect
// happens automatically for unauthenticated visits, but going straight
// here also handles users sitting on a public sub-page like 問答專區
// where a plain reload would just re-render the same un-auth page).
export const NHI_LOGIN_URL = "https://myhealthbank.nhi.gov.tw/IHKE3000/IHKE3095S01";

export const PENDING_BUNDLE_KEY = "pendingFhirBundle";
// v0.16.1: bundle storage split. Metadata (~200 B) lives in
// PENDING_BUNDLE_KEY for fast popup-open reads; the 80+ MB JSON
// string lives in this separate key, read only on download click.
export const PENDING_BUNDLE_JSON_KEY = "pendingFhirBundleJson";

// Date-range dropdown labels (apiSyncNhi). "1" = NHI's default window.
export const RANGE_LABELS = {
  "1": "最近 1 年",
  "3": "最近 3 年",
  "5": "最近 5 年",
  "10": "最近 10 年",
  all: "全部歷史紀錄",
};

// Help-tooltip: keep this many px clear of popup edges when clamping.
export const VIEWPORT_MARGIN = 6;
