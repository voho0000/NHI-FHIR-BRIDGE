// Shared DOM-element registry. Lookups run at module load, so the
// popup bundle must execute after the DOM is parsed (it does — the
// entry runs at the end of popup.html). modeRadios stays a function
// because the radios are queried live (set may change post-load).
//
// Phase-1 TS migration note: element handles are intentionally typed
// `any` (via byId) so the popup modules can read element-specific
// props (.value / .checked / .href) without a cast at every access
// site. Tightening these to precise element types (HTMLInputElement,
// HTMLAnchorElement, …) is a deliberate follow-up — esbuild strips the
// `any` either way, so this changes no runtime behavior.

// Phase-1 migration escape hatch (see note above): `any` return keeps
// callers reading element-specific props without a per-site cast.
const byId = (id: string): any => document.getElementById(id);

export const els = {
  // live NodeList; callers read .value/.checked off each radio
  modeRadios: (): any => document.querySelectorAll('input[name="sync-mode"]'),
  backendUrl: byId("backend-url"),
  syncApiKey: byId("sync-api-key"),
  smartAppUrl: byId("smart-app-url"),
  syncApiBtn: byId("sync-api-btn"),
  syncBlockedReason: byId("sync-blocked-reason"),
  apiSyncRange: byId("api-sync-range"),
  stopBtn: byId("stop-btn"),
  ovName: byId("ov-name"),
  ovBirthDate: byId("ov-birth-date"),
  ovGender: byId("ov-gender"),
  ovSaveBtn: byId("ov-save-btn"),
  ovClearBtn: byId("ov-clear-btn"),
  ovSummary: byId("override-summary"),
  patientOverrideDetails: byId("patient-override"),
  launchBtn: byId("launch-btn"),
  openSmartAppBtn: byId("open-smart-app-btn"),
  openSettingsBtn: byId("open-settings-btn"),
  settingsBackBtn: byId("settings-back-btn"),
  status: byId("status"),
  dashboardLink: byId("dashboard-link"),
  pendingBundle: byId("pending-bundle"),
  downloadBundleBtn: byId("download-bundle-btn"),
  clearBundleBtn: byId("clear-bundle-btn"),
  // bundleMeta legacy id removed in the panel-merge; filename+size now
  // live in dedicated #bundle-filename / #bundle-sizeage elements
  // below.
  connBanner: byId("conn-banner"),
  connSection: byId("conn-section"),
  connMini: byId("conn-mini"),
  connMsg: byId("conn-msg"),
  connRetryBtn: byId("conn-retry-btn"),
  connHelp: byId("conn-help"),
  dataStateSection: byId("data-state-section"),
  backendState: byId("backend-state"),
  localStateRow: byId("local-state-row"),
  localState: byId("local-state"),
  pushLocalBtn: byId("push-local-btn"),
  syncStatusHint: byId("sync-status-hint"),
  maskNameEnabled: byId("mask-name-enabled"),
  backendModeEnabled: byId("backend-mode-enabled"),
  fetchImagingEnabled: byId("fetch-imaging-enabled"),
  openNhiSection: byId("open-nhi-section"),
  openNhiBtn: byId("open-nhi-btn"),
  nhiNeedsLoginSection: byId("nhi-needs-login-section"),
  nhiReloadBtn: byId("nhi-reload-btn"),
  loginOkSection: byId("login-ok-section"),
  wizardStepper: byId("wizard-stepper"),
  resultZone: byId("result-zone"),
  activePatient: byId("active-patient"),
  activePatientValue: byId("active-patient-value"),
  bundleMetaBlock: byId("bundle-meta-block"),
  bundleFilename: byId("bundle-filename"),
  bundleSizeage: byId("bundle-sizeage"),
};
