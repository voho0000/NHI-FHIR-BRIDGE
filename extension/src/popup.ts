// NHI-FHIR Bridge popup — entry point.
//
// Flow:
//   1. On open, check the active tab is an NHI 健康存摺 page.
//   2. User confirms patient identity (身分證字號) in the patient-override card.
//   3. Clicks "📥 同步健保存摺資料" → background runs runNhiApiSync().
//   4. Progress streamed back via chrome.storage.local.syncStatus.
//   5. After sync completes, "🚀 開啟 SMART App" launches with that patient.
//
// The popup logic lives across src/popup/*.js (split out of the former
// 2100-line popup.js). This entry owns two things only:
//   • init() — load persisted state, probe the NHI tab, start the wizard.
//   • ALL event wiring — every addEventListener is consolidated here so
//     a listener can't be silently dropped during a module move (the
//     popup has no automated test coverage; this file is the wiring
//     source of truth). Each handler delegates to an imported function.

import { clearPendingBundle, downloadPendingBundle, refreshPendingBundle } from "./popup/bundle.js";
import {
  loadBackendModeEnabled,
  loadBackendUrl,
  loadSyncMode,
  onBackendModeToggle,
  onBackendUrlChange,
  onModeChange,
  testBackendConnection,
} from "./popup/connection.js";
import {
  NHI_LANDING,
  NHI_LOGIN_URL,
  PENDING_BUNDLE_KEY,
  STANDALONE_SMART_APP_URL,
} from "./popup/constants.js";
import { _refreshLocalBundleState, pushLocalBundleToBackend } from "./popup/data-state.js";
import { els } from "./popup/els.js";
import { initImagingPrepBanner } from "./popup/imaging-prep-banner.js";
import { loadFetchImagingEnabled, onFetchImagingToggle } from "./popup/imaging-toggle.js";
import {
  clearPatientOverride,
  loadMaskNameEnabled,
  loadPatientOverride,
  onMaskNameToggle,
  refreshOverrideSummary,
  savePatientOverride,
} from "./popup/patient-form.js";
import { state } from "./popup/state.js";
import {
  applySyncStatus,
  refreshSyncStatusFromBackground,
  setStatus,
  stopSync,
} from "./popup/status.js";
import { apiSyncNhi, launch, onSmartAppUrlChange } from "./popup/sync-client.js";
import { _hideHelpTooltip, _showHelpTooltip } from "./popup/tooltip.js";
import { getActiveTab, isNhiTab } from "./popup/utils.js";
import {
  _initWizard,
  _maybeAutoAdvance,
  _refreshButtonStates,
  _refreshWizardUi,
  _restoreActiveStepFromCache,
  _setActiveStep,
} from "./popup/wizard.js";

// v0.16.1: synchronous wizard-step restore BEFORE the rest of the
// init promise chain even starts. localStorage is sync, body.dataset
// gets the correct value immediately, CSS hides non-active steps —
// the popup never visibly flashes step 1 → step 3 transitions on
// reopens. Async chrome.storage reads later may further refine state
// but the visual jump is gone.
_restoreActiveStepFromCache();

async function init() {
  document.getElementById("version").textContent = `v${chrome.runtime.getManifest().version}`;

  // Opening the popup counts as "seeing" any completed sync — clear the
  // red result badge on the toolbar icon (set by the SW on sync done).
  chrome.runtime.sendMessage({ type: "markSyncSeen" }).catch(() => {});

  document.getElementById("login-ok-next")?.addEventListener("click", () => _setActiveStep(2));

  await loadMaskNameEnabled();
  await loadFetchImagingEnabled();
  // v0.16.0: imaging prep banner reads chrome.storage and self-renders.
  // Safe to init early — element is hidden by default; only shows when
  // the SW poller has written state.
  initImagingPrepBanner();

  // Seed local bundle state from storage so the data-state card is
  // populated as soon as the popup renders (no flash of "未產生").
  await _refreshLocalBundleState();

  // Order matters: loadBackendUrl populates els.backendUrl.value, which
  // loadSyncMode() reads via testBackendConnection(). Reverse this and
  // the auto-test sees an empty URL and falsely reports "未設定 Backend URL"
  // on every popup open. loadBackendModeEnabled also has to land before
  // loadSyncMode: the latter consults body[data-backend-enabled] to
  // decide whether a stored "backend" mode is honored or forced to local.
  await loadBackendModeEnabled();
  await loadBackendUrl();
  await loadSyncMode();
  await loadPatientOverride();
  await refreshPendingBundle();

  const tab = await getActiveTab();
  if (!tab?.url) {
    setStatus("no active tab", "error");
    els.syncApiBtn.dataset.offNhi = "1";
    _refreshButtonStates();
    return;
  }

  // Sync requires being on an NHI tab so cookies/session are usable from
  // the SW. Flag via dataset so _refreshButtonStates can combine this
  // with the mode + conn state. When off-NHI, also surface the
  // "🔗 開啟健保存摺登入" banner so users don't wonder where to go.
  const onNhi = isNhiTab(tab.url);
  if (onNhi) delete els.syncApiBtn.dataset.offNhi;
  else els.syncApiBtn.dataset.offNhi = "1";
  if (els.openNhiSection) els.openNhiSection.hidden = onNhi;
  // Stash the NHI tab id so the "重新整理頁面" button inside the
  // needs-login banner can reload it without having to re-query tabs.
  state.nhiTabId = onNhi ? tab.id : null;

  // When on the NHI tab, ask background to verify there's an active
  // session. The SW probes IHKE3410 with sessionStorage.token — cheap
  // and only succeeds when the user has logged in. Anything but `true`
  // (false, null, or no response) makes us assume "not logged in" so
  // the user sees the actionable banner instead of mashing the CTA
  // into a delayed "🔒 尚未登入" status.
  if (onNhi && tab.id) {
    chrome.runtime
      .sendMessage({ type: "checkNhiLogin", tabId: tab.id })
      .then((resp) => {
        const loggedIn = resp?.loggedIn === true;
        if (loggedIn) delete els.syncApiBtn.dataset.nhiLoggedIn;
        else els.syncApiBtn.dataset.nhiLoggedIn = "no";
        if (els.nhiNeedsLoginSection) {
          els.nhiNeedsLoginSection.hidden = loggedIn;
        }
        _refreshButtonStates();
        // Login probe completing positively is the step-1 intentional
        // completion event — advance the wizard once if the user is
        // currently looking at step 1.
        if (loggedIn && state.wizardInitialized) _maybeAutoAdvance();
      })
      .catch(() => {
        // If the probe fails (SW unreachable, etc), don't punish the
        // user — leave the CTA enabled and let the sync's own session
        // check surface a real error if needed.
        delete els.syncApiBtn.dataset.nhiLoggedIn;
        if (els.nhiNeedsLoginSection) els.nhiNeedsLoginSection.hidden = true;
        _refreshButtonStates();
      });
  } else {
    delete els.syncApiBtn.dataset.nhiLoggedIn;
    if (els.nhiNeedsLoginSection) els.nhiNeedsLoginSection.hidden = true;
  }

  _refreshButtonStates();

  // Start the wizard AFTER all initial state is loaded — this picks
  // the correct starting step (e.g. returning user with valid session
  // lands on step 3 directly).
  _initWizard();

  // Re-attach to any sync that's currently running in the service worker.
  // This is what lets the user close + reopen the popup mid-sync.
  await refreshSyncStatusFromBackground();
}

// ── Settings view toggle ─────────────────────────────────────────────
//
// Gear icon in the header opens a dedicated settings view that replaces
// the wizard. Returning is via the "← 返回" button at the top of that
// view. The CSS is driven by body[data-view="settings"] — toggling that
// attribute is all the JS does. We deliberately do NOT auto-jump back to
// the wizard after a field change: users editing the backend URL may
// need to verify changes across multiple fields before closing.
function _openSettingsView() {
  document.body.dataset.view = "settings";
  window.scrollTo({ top: 0, behavior: "instant" });
}
function _closeSettingsView() {
  delete document.body.dataset.view;
  // Pop back to whichever wizard step is current — refresh visual
  // state so the user lands on the same step they came from.
  _refreshWizardUi();
  window.scrollTo({ top: 0, behavior: "instant" });
}

// ════════════════════════════════════════════════════════════════════
//  Event wiring — single source of truth (see file header).
// ════════════════════════════════════════════════════════════════════

// Connection banner retry.
els.connRetryBtn?.addEventListener("click", testBackendConnection);

// Data-state: upload local bundle to backend.
els.pushLocalBtn?.addEventListener("click", pushLocalBundleToBackend);

// The blocked-reason warning strip doubles as a "jump back to the
// relevant step" button when there's a known target step. Click anywhere
// on it to navigate; the trailing "回 ① 登入 →" hint telegraphs where
// the click will land.
els.syncBlockedReason?.addEventListener("click", () => {
  const target = Number(els.syncBlockedReason.dataset.targetStep);
  if (target >= 1 && target <= 3) _setActiveStep(target);
});

// "🔗 開啟健保存摺登入" — opens the NHI landing page so the user
// doesn't have to remember / google the URL. Closes the popup so they
// don't have to dismiss it manually after the new tab opens.
els.openNhiBtn?.addEventListener("click", async () => {
  await chrome.tabs.create({ url: NHI_LANDING });
  window.close();
});

// "前往登入頁面" inside the needs-login banner. Covers both:
//   1. Session expired silently while on a logged-in page (looks
//      "still logged in" to the user → they're confused why we say
//      otherwise).
//   2. User is on a public sub-page like 問答專區 — a plain reload
//      would just re-render the same un-auth page without surfacing a
//      login form. Navigating directly to the login URL handles both.
// Drives chrome.tabs.update with a url so the existing NHI tab goes
// straight to the login picker; focuses + closes popup so the user
// lands on the page they need to act on.
els.nhiReloadBtn?.addEventListener("click", async () => {
  if (!state.nhiTabId) {
    // Defensive: banner shouldn't be visible when off-NHI, but if
    // something went sideways just open the login page in a new tab.
    await chrome.tabs.create({ url: NHI_LOGIN_URL });
    window.close();
    return;
  }
  try {
    await chrome.tabs.update(state.nhiTabId, { url: NHI_LOGIN_URL, active: true });
  } catch {}
  window.close();
});

// Backend-mode feature gate + sync-mode radios + persisted config fields.
els.backendModeEnabled?.addEventListener("change", onBackendModeToggle);
for (const r of els.modeRadios()) {
  r.addEventListener("change", onModeChange);
}
els.backendUrl.addEventListener("change", onBackendUrlChange);
els.syncApiKey.addEventListener("change", () => {
  chrome.storage.local.set({ syncApiKey: els.syncApiKey.value.trim() });
});
els.maskNameEnabled?.addEventListener("change", onMaskNameToggle);
els.fetchImagingEnabled?.addEventListener("change", onFetchImagingToggle);
els.smartAppUrl.addEventListener("change", onSmartAppUrlChange);

// Pending-bundle download / clear buttons.
els.downloadBundleBtn.addEventListener("click", downloadPendingBundle);
els.clearBundleBtn.addEventListener("click", clearPendingBundle);

// chrome.storage.onChanged listeners. v0.14+ the pending bundle slot
// moved from chrome.storage.session (10 MB ceiling) to chrome.storage
// .local with unlimitedStorage permission so imaging bundles fit. We
// keep the two listeners separate (data-state vs download UI) so a
// failure in one path doesn't take the other down.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && PENDING_BUNDLE_KEY in changes) _refreshLocalBundleState();
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && PENDING_BUNDLE_KEY in changes) refreshPendingBundle();
});
// Background-side flow can mutate the patientOverride mid-sync — most
// importantly _maybeFetchPatientIdFromNhi swaps the auto-XXXXXXXX
// placeholder for the real NHI cid. Reload the override into the inputs
// whenever storage changes so every downstream guard sees consistent
// values.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.patientOverride) loadPatientOverride();
});
// Live progress updates — listen on chrome.storage.onChanged so we get
// every update the SW writes, regardless of whether the SW's broadcast
// sendMessage reached us.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.syncStatus) {
    applySyncStatus(changes.syncStatus.newValue);
  }
});

// (Legacy in-memory broadcast still listened to as a backup.)
// Reject messages from any *other* extension installed in the user's
// browser. Internal sends (background SW → popup, popup → background)
// have sender.id === chrome.runtime.id; an unrelated extension's
// chrome.runtime.sendMessage(myExtId, …) would have its own id and be
// dropped silently. Defends against rogue extensions spoofing sync
// progress and tricking the popup UI. (Security audit #6.)
chrome.runtime.onMessage.addListener((msg, sender) => {
  // Strict equality with background.js handler: undefined sender.id
  // (e.g. native-app channels — we don't use them) also rejected.
  if (sender?.id !== chrome.runtime.id) return;
  if (msg?.type === "syncProgress") {
    applySyncStatus(msg.status);
  }
});

// Delegated help-tooltip hover handlers — works for icons added after
// popup load too (e.g. when mode toggle reveals backend-only fields).
document.addEventListener("mouseover", (e) => {
  const icon = (e.target as HTMLElement).closest?.(".help-icon");
  if (icon) _showHelpTooltip(icon);
});
document.addEventListener("mouseout", (e) => {
  const icon = (e.target as HTMLElement).closest?.(".help-icon");
  if (icon) _hideHelpTooltip();
});

// Primary action buttons + patient-form controls.
els.syncApiBtn.addEventListener("click", apiSyncNhi);
els.stopBtn.addEventListener("click", stopSync);
els.ovSaveBtn.addEventListener("click", savePatientOverride);
els.ovClearBtn.addEventListener("click", clearPatientOverride);
[els.ovName, els.ovBirthDate, els.ovGender].forEach((el) =>
  el.addEventListener("input", refreshOverrideSummary),
);
els.launchBtn.addEventListener("click", launch);

// Step 4: plain new-tab open of the SMART App. URL is hardcoded
// (STANDALONE_SMART_APP_URL); no FHIR data is passed via URL — the user
// manually drops the downloaded JSON onto the SMART App page. Decoupling
// extension <-> SMART App keeps both sides simple, leaks zero PHI through
// query strings or hash fragments, and lets the extension survive any
// SMART App protocol change.
els.openSmartAppBtn?.addEventListener("click", () => {
  chrome.tabs.create({ url: STANDALONE_SMART_APP_URL });
  // Don't auto-close the popup — user may want to re-download or
  // re-launch (e.g. drag failed first time).
});

// Settings view open / close.
els.openSettingsBtn?.addEventListener("click", _openSettingsView);
els.settingsBackBtn?.addEventListener("click", _closeSettingsView);

// "取得對象" banner: click / Enter / Space jumps back to step 2 so the
// user can adjust the identity.
els.activePatient?.addEventListener("click", () => _setActiveStep(2));
els.activePatient?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    _setActiveStep(2);
  }
});

init();
