// NHI-FHIR Bridge popup logic.
//
// Flow:
//   1. On open, check the active tab is an NHI 健康存摺 page.
//   2. User confirms patient identity (身分證字號) in the patient-override card.
//   3. Clicks "📥 同步健保存摺資料" → background runs runNhiApiSync().
//   4. Progress streamed back via chrome.storage.local.syncStatus.
//   5. After sync completes, "🚀 開啟 SMART App" launches with that patient.

import { derivePatientId, maskId, maskName } from "@nhi-fhir-bridge/mapper";

const DEFAULT_BACKEND = "http://localhost:8010";
// Default SMART app for a fresh install. Users can override via
// the '⚙️ 進階設定 → SMART App Launch URL' field; the value is
// persisted in chrome.storage.local under `smartAppLaunchUrl`.
const DEFAULT_SMART_APP_LAUNCH = "https://voho0000.github.io/medical-note-smart-on-fhir/smart/launch";

// True if the active tab is an NHI 健康存摺 page (real site).
function isNhiTab(url) {
  if (!url) return false;
  try {
    const u = typeof url === "string" ? new URL(url) : url;
    return /myhealthbank\.nhi\.gov\.tw/.test(u.hostname);
  } catch {
    return false;
  }
}

const DEFAULT_MODE = "local";

const els = {
  modeRadios: () => document.querySelectorAll('input[name="sync-mode"]'),
  backendUrl: document.getElementById("backend-url"),
  syncApiKey: document.getElementById("sync-api-key"),
  smartAppUrl: document.getElementById("smart-app-url"),
  syncApiBtn: document.getElementById("sync-api-btn"),
  syncBlockedReason: document.getElementById("sync-blocked-reason"),
  apiSyncRange: document.getElementById("api-sync-range"),
  stopBtn: document.getElementById("stop-btn"),
  ovIdNo: document.getElementById("ov-id-no"),
  ovName: document.getElementById("ov-name"),
  ovBirthDate: document.getElementById("ov-birth-date"),
  ovGender: document.getElementById("ov-gender"),
  ovSaveBtn: document.getElementById("ov-save-btn"),
  ovClearBtn: document.getElementById("ov-clear-btn"),
  ovSummary: document.getElementById("override-summary"),
  patientOverrideDetails: document.getElementById("patient-override"),
  launchBtn: document.getElementById("launch-btn"),
  status: document.getElementById("status"),
  dashboardLink: document.getElementById("dashboard-link"),
  pendingBundle: document.getElementById("pending-bundle"),
  downloadBundleBtn: document.getElementById("download-bundle-btn"),
  clearBundleBtn: document.getElementById("clear-bundle-btn"),
  bundleMeta: document.getElementById("bundle-meta"),
  connBanner: document.getElementById("conn-banner"),
  connSection: document.getElementById("conn-section"),
  connMini: document.getElementById("conn-mini"),
  connMsg: document.getElementById("conn-msg"),
  connRetryBtn: document.getElementById("conn-retry-btn"),
  connHelp: document.getElementById("conn-help"),
  dataStateSection: document.getElementById("data-state-section"),
  backendState: document.getElementById("backend-state"),
  localStateRow: document.getElementById("local-state-row"),
  localState: document.getElementById("local-state"),
  pushLocalBtn: document.getElementById("push-local-btn"),
  syncStatusHint: document.getElementById("sync-status-hint"),
  sidebarEnabled: document.getElementById("sidebar-enabled"),
  maskNameEnabled: document.getElementById("mask-name-enabled"),
  openNhiSection: document.getElementById("open-nhi-section"),
  openNhiBtn: document.getElementById("open-nhi-btn"),
  nhiNeedsLoginSection: document.getElementById("nhi-needs-login-section"),
  loginOkSection: document.getElementById("login-ok-section"),
  wizardStepper: document.getElementById("wizard-stepper"),
  resultZone: document.getElementById("result-zone"),
  summaryCard: document.getElementById("summary-card"),
  launchBlock: document.querySelector(".launch-block"),
};

const NHI_LANDING = "https://myhealthbank.nhi.gov.tw/IHKE3000";

const PENDING_BUNDLE_KEY = "pendingFhirBundle";

// Persisted-state keys. Backend URL and API key persist across browser sessions.
async function loadBackendUrl() {
  const { backendUrl, syncApiKey, smartAppLaunchUrl } = await chrome.storage.local.get(
    ["backendUrl", "syncApiKey", "smartAppLaunchUrl"]
  );
  els.backendUrl.value = backendUrl || DEFAULT_BACKEND;
  els.syncApiKey.value = syncApiKey || "";
  els.smartAppUrl.value = smartAppLaunchUrl || DEFAULT_SMART_APP_LAUNCH;
  els.dashboardLink.href = els.backendUrl.value.replace(/:8010.*$/, ":3010");
}

// ── Patient override (manual NHI identity) ────────────────────────────────
// NHI 健康存摺 doesn't expose the user's national ID in the URL. The user
// fills these once and they're sent with every upload call until cleared.

async function loadPatientOverride() {
  const { patientOverride } = await chrome.storage.local.get("patientOverride");
  if (patientOverride) {
    els.ovIdNo.value = patientOverride.id_no || "";
    els.ovName.value = patientOverride.name || "";
    els.ovBirthDate.value = patientOverride.birth_date || "";
    els.ovGender.value = patientOverride.gender || "";
  }
  // A stored override with both required fields counts as "step 2
  // already confirmed" — returning user shouldn't be forced to click
  // ✓ 確定 again to advance the wizard.
  _markStep2Confirmed(
    !!(patientOverride?.gender && patientOverride?.birth_date),
  );
  // Auto-expand the card whenever the required fields aren't already
  // saved — covers first-time AND returning users whose previous save
  // was incomplete. Once required fields are saved, collapse to give
  // breathing room.
  if (els.patientOverrideDetails) {
    els.patientOverrideDetails.open = !_step2Confirmed;
  }
  refreshOverrideSummary();
}

function getPatientOverride() {
  // Returns {id_no, name, birth_date, gender}.
  // id_no is optional in the UI; if blank the popup auto-generates an
  // "auto-XXXXXXXX" identifier at save time. Returns null when both
  // id_no and name are empty (nothing identifying to save).
  const id_no = els.ovIdNo.value.trim();
  const name = els.ovName.value.trim();
  if (!id_no && !name) return null;
  const out = id_no ? { id_no } : {};
  if (name) out.name = name;
  const birth_date = els.ovBirthDate.value.trim();
  const gender = els.ovGender.value;
  if (birth_date) out.birth_date = birth_date;
  if (gender) out.gender = gender;
  return out;
}

/**
 * Validate the patient card's birth-date input. Returns null when OK,
 * otherwise a user-facing error string. Reads directly from the
 * <input type="date"> so we can detect partial-input states that
 * Chrome reports through `validity.badInput` (the input's `.value`
 * is "" in that case, indistinguishable from "blank" by string check
 * alone — that's why the old version of this function let partial
 * year-only entries slip through).
 *
 * Allowed states:
 *   - genuinely empty (the field is optional)
 *   - full ISO YYYY-MM-DD that round-trips through Date()
 * Rejected:
 *   - year-only / year+month: the input renders blank value but
 *     validity.badInput is true
 *   - dates in the future
 *   - implausibly old dates (year < 1900)
 */
function validateBirthDate() {
  const el = els.ovBirthDate;
  if (!el) return null;
  // Chrome's native date input: partial entry (just year, just yyyy-mm)
  // surfaces here even though .value is "".
  if (el.validity && el.validity.badInput) {
    return "生日請填完整年月日";
  }
  const s = (el.value || "").trim();
  // Birth date is now required — age affects every reference range
  // and any downstream age-based UI; empty input lets a typo / browser
  // quirk silently propagate as NaN.
  if (!s) return "請填生日";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return "生日請填完整年月日";
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(s + "T00:00:00Z");
  if (
    Number.isNaN(dt.getTime()) ||
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() + 1 !== m ||
    dt.getUTCDate() !== d
  ) {
    return "生日不是有效日期";
  }
  const now = new Date();
  if (dt.getTime() > now.getTime()) return "生日不能是未來";
  if (y < 1900) return "生日年份太早，請確認";
  return null;
}

// Random "auto-XXXXXXXX" — 8 hex chars from crypto.getRandomValues so
// every fresh popup install gets a different ID and re-syncs are stable.
function _generateAutoPatientId() {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `auto-${hex}`;
}

function refreshOverrideSummary() {
  const ov = getPatientOverride();
  const card = els.patientOverrideDetails;
  if (!ov) {
    els.ovSummary.textContent = "未設定";
    if (card) card.dataset.state = "empty";
  } else {
    // Name first (when present), then masked ID. Name → "the patient
    // I'm working with" reads naturally first; ID is the technical
    // detail. Previously the order was reversed, putting `P12345****`
    // ahead of the actual person's name.
    // ID always half-masked (P123456789 → P12345****) — matches NHI
    // 健康存摺's own UI convention and removes a stable shoulder-
    // surfing target. Raw value still in storage + the input field.
    // Name follows the mask toggle (民眾自用 預設關 = 真名 /
    // multi-patient demo 開啟 = 遮罩).
    const parts = [];
    if (ov.name) parts.push(_maybeMask(ov.name));
    parts.push(maskId(ov.id_no));
    els.ovSummary.textContent = `✓ ${parts.join("  ·  ")}`;
    if (card) card.dataset.state = "filled";
  }
  // Both launch + sync enabled state depend on patient + mode + conn.
  _refreshButtonStates();
  // Changing patient ID invalidates: (a) backend-state cache (new
  // patient might not be on backend); (b) local-bundle row in the
  // data-state card; (c) the 📥 download bundle section, which would
  // otherwise still show the previous patient's stashed file; (d)
  // the last completed sync's success message, which was tagged for
  // the previous patient.
  _renderDataState();
  refreshPendingBundle();
  _clearStaleSyncStatus(getPatientOverride());
  if (currentMode() === "backend" && _connState === "ok") checkBackendPatient();
}

// Drop a "✅ 同步完成 …" status banner that was recorded for a
// different patient. Mid-flight syncs are left alone (status.running)
// so the user can still see progress of the in-flight sync.
function _clearStaleSyncStatus(ov) {
  if (!_latestStatus) return;
  if (_latestStatus.running) return;
  if (!_latestStatus.histno) return;
  if (ov?.id_no === _latestStatus.histno) return;
  _latestStatus = null;
  setStatus("", null);
  chrome.storage.local.remove("syncStatus").catch(() => {});
}

async function savePatientOverride() {
  // Gender + birth_date are required. id_no / name are optional —
  // id_no will be auto-fetched on sync, name can be left blank or fake.
  if (!els.ovGender.value) {
    setStatus("⛔ 請選擇性別", "error");
    els.ovGender.focus();
    return;
  }
  const dobError = validateBirthDate();
  if (dobError) {
    setStatus(`⛔ ${dobError}`, "error");
    els.ovBirthDate.focus();
    return;
  }
  // Build the override directly so we don't depend on
  // getPatientOverride's "must have id_no or name" null-return — the
  // required-field path above has already validated what matters.
  const ov = {
    id_no: els.ovIdNo.value.trim() || null,
    name: els.ovName.value.trim() || null,
    birth_date: els.ovBirthDate.value.trim(),
    gender: els.ovGender.value,
  };
  if (!ov.id_no) delete ov.id_no;
  if (!ov.name) delete ov.name;
  // ID auto-generation: if user left id_no blank, mint an "auto-XXXX"
  // and stash it in the UI so subsequent re-syncs use the same FHIR
  // Patient.id (storage persistence keeps it stable across re-opens).
  if (!ov.id_no) {
    ov.id_no = _generateAutoPatientId();
    els.ovIdNo.value = ov.id_no;
  }
  await chrome.storage.local.set({ patientOverride: ov });
  _markStep2Confirmed(true);
  refreshOverrideSummary();
  _refreshButtonStates();
  if (els.patientOverrideDetails) els.patientOverrideDetails.open = false;
  // Make clear this is the identity save, not a medical-record sync —
  // 「病人資料」alone reads as "patient data" (medical) for some users.
  // ID half-masked in the toast for the same shoulder-surfing reason
  // as the summary line above.
  const displayName = ov.name ? ` (${_maybeMask(ov.name)})` : "";
  setStatus(`✅ 病人身份已記住：${maskId(ov.id_no)}${displayName}`, "success");
}

async function clearPatientOverride() {
  await chrome.storage.local.remove("patientOverride");
  els.ovIdNo.value = "";
  els.ovName.value = "";
  els.ovBirthDate.value = "";
  els.ovGender.value = "";
  _markStep2Confirmed(false);
  refreshOverrideSummary();
  _refreshButtonStates();
  if (els.patientOverrideDetails) els.patientOverrideDetails.open = true;
  setStatus("已清除病人資料", "info");
}

// ── Backend connection state ─────────────────────────────────────────
//
// Single source of truth: `_connState` reflects the latest backend
// connectivity check. Both the banner UI and the enabled-state of the
// 📥 Sync / 🚀 Launch buttons read from it.
//
// States:
//   "unknown"  — not yet checked (e.g. first paint in local mode)
//   "checking" — fetch in flight
//   "ok"       — GET /fhir/metadata returned a FHIR CapabilityStatement
//   "fail"     — anything else; `_connFailReason` carries detail
//
// Backend connectivity is treated as a *prerequisite* for backend mode,
// not as a per-action check. Switching to backend mode triggers a test
// immediately; failure shows a banner with actionable guidance and
// disables both action buttons until connectivity recovers.

let _connState = "unknown";
let _connFailReason = null; // { kind: "no-permission" | "no-url" | "network" | "timeout" | "http" | "not-fhir", detail? }

const _CONN_LABELS = {
  unknown: "未檢測",
  checking: "檢測中…",
  ok: () => `已連線 — ${els.backendUrl.value.trim()}`,
  fail: () => {
    const r = _connFailReason || {};
    return ({
      "no-url": "✗ 未設定 Backend URL",
      "no-permission": "✗ 未授權連線",
      "network": "✗ 連不上後端",
      "timeout": "✗ 連線逾時",
      "http": `✗ HTTP ${r.detail || ""}`.trim(),
      "not-fhir": "✗ 回應不是 FHIR",
    })[r.kind] ?? "✗ 連線失敗";
  },
};

const _CONN_HELP = {
  "no-url":        "請到「進階設定」填入 Backend URL，例如 <code>http://localhost:8010</code>。",
  "no-permission": "Chrome 阻擋了跨來源請求。請重新開 popup，當權限對話框跳出時按「允許」。",
  "network":       "後端可能還沒啟動。請執行：<br><code>docker compose up -d</code><br>確認 backend 容器跑起來再重試。",
  "timeout":       "5 秒內沒收到回應 — backend 可能還在啟動中，等 30 秒再按重試。",
  "http":          "Backend 回應錯誤狀態碼。檢查 backend 的 log：<br><code>docker compose logs backend</code>",
  "not-fhir":      "這個 URL 回了東西，但不是 FHIR CapabilityStatement。確認 Backend URL 指向 NHI-FHIR-Bridge 的 /fhir 根目錄。",
};

function _renderConnBanner() {
  const banner = els.connBanner;
  if (!banner) return;
  banner.dataset.state = _connState;
  const label = _CONN_LABELS[_connState];
  els.connMsg.textContent = typeof label === "function" ? label() : label;
  els.connRetryBtn.hidden = _connState !== "fail";
  if (_connState === "fail" && _connFailReason?.kind) {
    els.connHelp.hidden = false;
    els.connHelp.innerHTML = _CONN_HELP[_connFailReason.kind] ?? "";
  } else {
    els.connHelp.hidden = true;
    els.connHelp.innerHTML = "";
  }

  // Compact-pill vs full-banner swap: when everything's fine, shrink to
  // a small green pill in the header so the popup body has more room
  // for actionable content. Anything else (unknown / checking / fail)
  // keeps the full banner so progress + error help has space to render.
  const isOk = _connState === "ok";
  if (els.connSection) els.connSection.hidden = isOk;
  if (els.connMini) {
    els.connMini.hidden = !isOk;
    if (isOk) els.connMini.title = `已連線 — ${els.backendUrl.value.trim()}`;
  }
}

// ── 3-step wizard ────────────────────────────────────────────────────
//
// Conceptually:
//   Step 1 — 登入：on NHI tab + session token is valid
//   Step 2 — 設定：gender filled + (mode==local OR backend reachable)
//                + birth_date if entered must be valid
//   Step 3 — 取得：the action itself (sync CTA, status, results)
//
// Steps auto-advance when their precondition flips green; users can
// click the stepper to revisit any step. We never auto-step BACK on
// state change — once the user has moved forward, only an explicit
// stepper click brings them back. Otherwise opening the popup mid-
// sync would jerk them back to step 1.
let _activeStep = 1;
let _wizardInitialized = false;
// Step 2 is "done" only after the user has clicked ✓ 確定 with valid
// inputs. We track this with a boolean rather than reading live DOM
// state — otherwise the wizard would auto-advance the moment the
// fields happened to look right, before the user had a chance to
// review. Flipped true in savePatientOverride success, false in
// clearPatientOverride and on a load that yields no saved record.
let _step2Confirmed = false;

function _markStep2Confirmed(yes) {
  _step2Confirmed = !!yes;
}

function _isStepDone(step) {
  const onNhi = !els.syncApiBtn.dataset.offNhi;
  const loggedIn = els.syncApiBtn.dataset.nhiLoggedIn !== "no";
  switch (step) {
    case 1:
      return onNhi && loggedIn;
    case 2:
      // Confirmed = user clicked ✓ 確定 AND the override is currently
      // valid (so revisits with a now-invalid override don't show a
      // false green check).
      return _step2Confirmed;
    case 3:
      // Step 3 is the terminal action step; never "done" for progress
      // purposes (the success banner inside the step is the indicator).
      return false;
    default:
      return false;
  }
}

function _setActiveStep(n, opts = {}) {
  const clamped = Math.max(1, Math.min(3, n));
  _activeStep = clamped;
  document.body.dataset.activeStep = String(clamped);
  _refreshWizardUi();
  if (!opts.silent) {
    // Auto-scroll the popup to the top of the step so users always
    // see the step header / first input after navigation.
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function _refreshWizardUi() {
  if (!els.wizardStepper) return;
  const lis = els.wizardStepper.querySelectorAll("li[data-step]");
  for (const li of lis) {
    const n = Number(li.dataset.step);
    const isActive = n === _activeStep;
    const isDone = _isStepDone(n);
    if (isActive) li.setAttribute("aria-current", "true");
    else li.removeAttribute("aria-current");
    if (isDone) li.dataset.done = "true";
    else delete li.dataset.done;
  }
  // Step 1's three sub-cards (off-nhi / needs-login / login-ok) are
  // mutually exclusive — pick the one that matches current state.
  const onNhi = !els.syncApiBtn.dataset.offNhi;
  const loggedIn = els.syncApiBtn.dataset.nhiLoggedIn !== "no";
  if (els.openNhiSection)
    els.openNhiSection.hidden = onNhi;
  if (els.nhiNeedsLoginSection)
    els.nhiNeedsLoginSection.hidden = !onNhi || loggedIn;
  if (els.loginOkSection)
    els.loginOkSection.hidden = !(onNhi && loggedIn);

  _refreshResultZone();
}

// Show/hide step-3 result cards based on whether each has content.
// Empty cards (e.g. a summary card with no status + no data-state in
// local mode pre-sync) used to render as a blank stripe — now they
// stay collapsed individually, and the whole zone goes away when all
// three cards would be empty.
function _refreshResultZone() {
  if (!els.resultZone) return;
  const hasStatus = (els.status?.textContent ?? "").trim() !== "";
  const dataStateShown =
    els.dataStateSection && !els.dataStateSection.hidden;
  const bundleShown =
    els.pendingBundle && !els.pendingBundle.hidden;
  // Launch button only counts when usable — backend mode + the patient
  // actually exists on the backend (`launchBtn.disabled === false`).
  // A perma-disabled button shouldn't pin the zone open.
  const launchUsable =
    currentMode() === "backend" && els.launchBtn && !els.launchBtn.disabled;

  if (els.summaryCard) {
    els.summaryCard.hidden = !(hasStatus || dataStateShown);
  }
  if (els.launchBlock) {
    // Hide the launch card outright when it'd be just a disabled button
    // — keeps backend mode's pre-sync result zone from showing a faint
    // outlined-but-disabled "🚀 開啟 SMART App" with no context.
    els.launchBlock.hidden = !launchUsable;
  }
  els.resultZone.hidden = !(hasStatus || bundleShown || dataStateShown || launchUsable);
}

function _maybeAutoAdvance() {
  // Only advance forward, never back. Save user's place if they've
  // clicked into a later step manually.
  if (_activeStep === 1 && _isStepDone(1)) _setActiveStep(2);
  else if (_activeStep === 2 && _isStepDone(2)) _setActiveStep(3);
}

function _initWizard() {
  if (_wizardInitialized) return;
  _wizardInitialized = true;
  // Initial step: whichever is the FIRST not-yet-done step at popup open.
  // First-time user → step 1. Returning user with valid session + saved
  // patient → step 3.
  const start = _isStepDone(1) ? (_isStepDone(2) ? 3 : 2) : 1;
  _setActiveStep(start, { silent: true });

  // Stepper clicks → jump
  for (const li of els.wizardStepper.querySelectorAll("li[data-step]")) {
    li.addEventListener("click", () => _setActiveStep(Number(li.dataset.step)));
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        _setActiveStep(Number(li.dataset.step));
      }
    });
  }
}

function _refreshButtonStates() {
  // Sync button. Conditions, in priority order:
  //   1. on an NHI tab
  //   2. logged in to NHI (detected via background pre-flight)
  //   3. backend mode → backend connected
  //   4. gender filled (other patient fields all optional)
  // Whatever blocks the CTA also gets surfaced as an inline message
  // below the button — tooltips are invisible in the 360px popup.
  const onNhi = !els.syncApiBtn.dataset.offNhi;
  const loggedIn = els.syncApiBtn.dataset.nhiLoggedIn !== "no";
  const modeOk = currentMode() === "local" || _connState === "ok";
  const genderOk = !!els.ovGender?.value;
  const dobError = validateBirthDate();

  // Each blocking reason names the step that needs attention. Mode +
  // connection now live in step 3 alongside the CTA itself, so those
  // reasons reference what's directly above the button rather than
  // sending the user back through the stepper.
  let reason = "";
  if (!onNhi) reason = "回 ① 登入：請切到健保存摺分頁";
  else if (!loggedIn) reason = "回 ① 登入：健保存摺分頁尚未登入";
  else if (!genderOk) reason = "回 ② 您的資料：請選擇性別並按確定";
  else if (dobError) reason = `回 ② 您的資料：${dobError}`;
  else if (!modeOk) reason = "後端尚未連線 — 看上方紅色提示，或改回「💾 下載到電腦」";

  els.syncApiBtn.disabled = reason !== "";
  els.syncApiBtn.title = reason;
  if (els.syncBlockedReason) {
    els.syncBlockedReason.textContent = reason ? `⚠️ ${reason}` : "";
    els.syncBlockedReason.hidden = reason === "";
  }

  // Launch button: backend mode + conn ok + patient set + backend
  // actually has this patient (otherwise the SMART app launches into
  // an empty FHIR store — confusing blank screen).
  const ov = getPatientOverride();
  const haveBackendPatient = _backendPatient.state === "present";
  els.launchBtn.disabled = !(
    currentMode() === "backend" &&
    _connState === "ok" &&
    !!ov?.id_no &&
    haveBackendPatient
  );
  els.launchBtn.title =
    currentMode() !== "backend"  ? "請切到「🏥 本機後端 (進階)」模式" :
    _connState !== "ok"           ? "後端尚未連線" :
    !ov?.id_no                    ? "回 ② 您的資料：請填病人資料" :
    !haveBackendPatient           ? "後端尚無此病人資料 — 先按「🔄 取得健保存摺資料」或下方「📤 把本地檔案上傳到後端」" :
                                    "";

  // Wizard depends on the same inputs — refresh stepper + maybe auto-
  // advance. Guard against the initial paint where _wizardInitialized
  // hasn't run yet (init() calls _initWizard explicitly after).
  if (_wizardInitialized) {
    _refreshWizardUi();
    _maybeAutoAdvance();
  }
}

async function testBackendConnection() {
  const url = els.backendUrl.value.trim();
  if (!url) {
    _connState = "fail"; _connFailReason = { kind: "no-url" };
    _renderConnBanner(); _refreshButtonStates(); return false;
  }
  _connState = "checking"; _connFailReason = null;
  _renderConnBanner(); _refreshButtonStates();

  const perm = await ensureBackendPermission(url);
  if (!perm.ok) {
    _connState = "fail"; _connFailReason = { kind: "no-permission" };
    _renderConnBanner(); _refreshButtonStates(); return false;
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 5000);
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/fhir/metadata`, { signal: ctrl.signal });
    if (!res.ok) {
      _connState = "fail"; _connFailReason = { kind: "http", detail: res.status };
    } else {
      const body = await res.json().catch(() => null);
      if (body?.resourceType !== "CapabilityStatement") {
        _connState = "fail"; _connFailReason = { kind: "not-fhir" };
      } else {
        _connState = "ok"; _connFailReason = null;
      }
    }
  } catch (e) {
    _connState = "fail";
    _connFailReason = { kind: e.name === "AbortError" ? "timeout" : "network" };
  } finally {
    clearTimeout(timer);
  }

  _renderConnBanner();
  _refreshButtonStates();
  // Whenever connectivity flips, re-check whether this patient already
  // exists on backend. (Stale "_backendPatient" state would otherwise
  // cause Launch to look enabled / disabled wrongly.)
  if (currentMode() === "backend") checkBackendPatient();
  return _connState === "ok";
}

els.connRetryBtn?.addEventListener("click", testBackendConnection);

// ── Backend ↔ local data-state ───────────────────────────────────────
//
// Independent of the connection banner (which only tells us "can we
// reach the backend"). This card answers two questions:
//
//   1. Does the backend already have this patient's data?
//      → drives whether 🚀 Launch is allowed at all (Launch on an
//        empty backend gives a confusing SMART-app blank).
//   2. Does the user have a local Bundle that's newer than the
//      backend's view?
//      → offer "📤 上傳本地 Bundle 到後端" to push it via /fhir/import
//        without re-fetching NHI (fast, non-destructive: stable IDs
//        upsert so backend resources just bump versionId).
//
// We don't second-guess the user: even when local is clearly newer,
// Launch stays enabled if the backend has the patient — they may
// genuinely want to look at the older state. The UI lays out both
// sides; user decides.

let _backendPatient = { state: "unknown", count: 0, lastUpdated: null };
//   state: "unknown" | "checking" | "absent" | "present" | "fail"
let _localBundle = { exists: false, count: 0, generatedAt: 0, patientId: null };

function _fmtTimeShort(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function _fmtRelative(ms) {
  const diff = Date.now() - ms;
  if (diff < 60_000) return `${Math.max(1, Math.round(diff / 1000))} 秒前`;
  if (diff < 3600_000) return `${Math.round(diff / 60_000)} 分鐘前`;
  if (diff < 86_400_000) return `${Math.round(diff / 3600_000)} 小時前`;
  return _fmtTimeShort(new Date(ms).toISOString());
}

function _renderDataState() {
  // Section only visible in backend mode (handled by .backend-only CSS),
  // but we also explicitly hide when the popup has no patient_override
  // set, since both checks key off patient_id.
  const ov = getPatientOverride();
  if (currentMode() !== "backend" || !ov?.id_no) {
    els.dataStateSection.hidden = true;
    if (els.syncStatusHint) els.syncStatusHint.hidden = true;
    return;
  }

  // Card serves as an alert, not a dashboard — show only when there's
  // something actionable / worth flagging. Hide when:
  //   - backend has this patient AND no local bundle to compare against
  //     (Launch is enabled → that's the signal everything's fine), or
  //   - both sides agree on count (already in sync, no upload needed).
  // The remaining states (checking / fail / absent / count mismatch) all
  // either need user attention or are transient loading feedback.
  const localMatches = _localBundle.exists && _localBundle.patientId === ov.id_no;
  const inSync =
    _backendPatient.state === "present" &&
    localMatches &&
    _backendPatient.count === _localBundle.count;
  // Quiet "✓ 已同步" hint sits under the download button when in-sync —
  // gives the user a tiny acknowledgement instead of total silence.
  if (els.syncStatusHint) els.syncStatusHint.hidden = !inSync;
  const nothingToShow =
    _backendPatient.state === "present" && (!localMatches || inSync);
  if (nothingToShow) {
    els.dataStateSection.hidden = true;
    return;
  }
  els.dataStateSection.hidden = false;

  // Backend row
  const bs = els.backendState;
  switch (_backendPatient.state) {
    case "checking":
      bs.className = "state-value";
      bs.textContent = "檢查中…";
      break;
    case "absent":
      bs.className = "state-value empty";
      // Card sits inside the result zone next to the 🔄 取得 CTA and
      // the 📤 上傳 button — pointing at them with text would be
      // double-talk. Just state the fact.
      bs.textContent = "⚠ 尚無此病人資料";
      break;
    case "present": {
      const count = _backendPatient.count;
      const ts = _backendPatient.lastUpdated;
      bs.className = "state-value ok";
      bs.textContent = `✓ ${count > 0 ? `${count} 筆 · ` : ""}最後更新 ${_fmtTimeShort(ts) || "(unknown)"}`;
      break;
    }
    case "fail":
      bs.className = "state-value fail";
      bs.textContent = "✗ 檢查失敗（看連線 banner）";
      break;
    default:
      bs.className = "state-value";
      bs.textContent = "—";
  }

  // Local row — show only when the pending bundle matches this patient.
  // (localMatches was computed above for the early-return check.)
  if (localMatches) {
    els.localStateRow.hidden = false;
    els.localState.className = "state-value ok";
    els.localState.textContent =
      `✓ ${_localBundle.count} 筆 · ${_fmtRelative(_localBundle.generatedAt)}產生`;
  } else {
    els.localStateRow.hidden = true;
  }

  // "📤 上傳本地 Bundle" button shows only when there's a local bundle
  // for this patient. We don't reach this branch when in-sync (the
  // whole section gets hidden above), so no need for a separate
  // disabled state — when the button shows, upload is always meaningful.
  els.pushLocalBtn.hidden = !localMatches;
  els.pushLocalBtn.disabled = false;
  els.pushLocalBtn.title = "";
  els.pushLocalBtn.textContent = "📤 把本地檔案上傳到後端";
}

async function _refreshLocalBundleState() {
  const { [PENDING_BUNDLE_KEY]: pending } =
    await chrome.storage.local.get(PENDING_BUNDLE_KEY);
  _localBundle = pending
    ? {
        exists: true,
        count: Array.isArray(JSON.parse(pending.json)?.entry)
          ? JSON.parse(pending.json).entry.length
          : 0,
        generatedAt: pending.generatedAt || 0,
        patientId: pending.patientId || null,
      }
    : { exists: false, count: 0, generatedAt: 0, patientId: null };
  _renderDataState();
}

async function checkBackendPatient() {
  const ov = getPatientOverride();
  if (currentMode() !== "backend" || !ov?.id_no || _connState !== "ok") {
    _backendPatient = { state: "unknown", count: 0, lastUpdated: null };
    _renderDataState();
    _refreshButtonStates();
    return;
  }
  _backendPatient = { state: "checking", count: 0, lastUpdated: null };
  _renderDataState();

  const url = els.backendUrl.value.trim().replace(/\/$/, "");
  const key = els.syncApiKey.value.trim();
  const headers = key ? { "X-Sync-API-Key": key } : {};
  // Backend stores Patient under the hashed FHIR id, never under the raw
  // national ID — query / export by the hashed form.
  const fhirPid = derivePatientId(ov.id_no);
  try {
    const pr = await fetch(`${url}/fhir/Patient/${encodeURIComponent(fhirPid)}`, { headers });
    if (pr.status === 404) {
      _backendPatient = { state: "absent", count: 0, lastUpdated: null };
      _renderDataState(); _refreshButtonStates();
      return;
    }
    if (!pr.ok) {
      _backendPatient = { state: "fail", count: 0, lastUpdated: null };
      _renderDataState(); _refreshButtonStates();
      return;
    }
    const patient = await pr.json();
    const lastUpdated = patient?.meta?.lastUpdated ?? null;
    // Count via /fhir/export — slightly heavier but it's the only
    // off-the-shelf way to get total resources for a patient. Cap by
    // 5s timeout so a slow backend doesn't lock the popup forever.
    let count = 0;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 5000);
      const er = await fetch(`${url}/fhir/export?patient=${encodeURIComponent(fhirPid)}`, {
        headers, signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (er.ok) {
        const bundle = await er.json();
        if (Array.isArray(bundle.entry)) count = bundle.entry.length;
      }
    } catch { /* leave count = 0; not fatal */ }
    _backendPatient = { state: "present", count, lastUpdated };
  } catch (_e) {
    _backendPatient = { state: "fail", count: 0, lastUpdated: null };
  }
  _renderDataState();
  _refreshButtonStates();
}

async function pushLocalBundleToBackend() {
  const ov = getPatientOverride();
  if (!ov?.id_no || !_localBundle.exists || _localBundle.patientId !== ov.id_no) return;
  const url = els.backendUrl.value.trim().replace(/\/$/, "");
  const key = els.syncApiKey.value.trim();
  const headers = {
    "Content-Type": "application/json",
    ...(key ? { "X-Sync-API-Key": key } : {}),
  };
  els.pushLocalBtn.disabled = true;
  els.pushLocalBtn.textContent = "上傳中…";
  try {
    const { [PENDING_BUNDLE_KEY]: pending } =
      await chrome.storage.local.get(PENDING_BUNDLE_KEY);
    if (!pending?.json) throw new Error("no local bundle");
    const r = await fetch(`${url}/fhir/import`, {
      method: "POST", headers, body: pending.json,
    });
    if (!r.ok) {
      const text = await r.text();
      throw new Error(`HTTP ${r.status}: ${text.slice(0, 120)}`);
    }
    const result = await r.json();
    setStatus(`✅ 已上傳 ${result.imported ?? "?"} 筆到後端`, "success");
    await checkBackendPatient();
  } catch (e) {
    setStatus(`⛔ 上傳失敗：${e.message}`, "error");
  } finally {
    // _renderDataState() (already called from checkBackendPatient on
    // success) decides the right disabled state + label based on
    // whether backend and local agree. Call it here too to cover the
    // failure path that skipped checkBackendPatient.
    _renderDataState();
  }
}

els.pushLocalBtn?.addEventListener("click", pushLocalBundleToBackend);

// "🔗 開啟健保存摺登入" — opens the NHI landing page so the user
// doesn't have to remember / google the URL. Closes the popup so
// they don't have to dismiss it manually after the new tab opens.
els.openNhiBtn?.addEventListener("click", async () => {
  await chrome.tabs.create({ url: NHI_LANDING });
  window.close();
});

// Local bundle state changes whenever the SW stashes a new sync.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && PENDING_BUNDLE_KEY in changes) _refreshLocalBundleState();
});

// ── Sync mode (local | backend) ──────────────────────────────────────
async function loadSyncMode() {
  const { syncMode } = await chrome.storage.local.get("syncMode");
  const mode = syncMode === "backend" ? "backend" : DEFAULT_MODE;
  for (const r of els.modeRadios()) r.checked = r.value === mode;
  document.body.dataset.mode = mode;
  if (mode === "backend") {
    // Auto-test on open so the user sees status without clicking. Awaiting
    // here serializes the rest of init() until we know the answer.
    await testBackendConnection();
  } else {
    _connState = "unknown"; _connFailReason = null;
    _renderConnBanner();
  }
}

function currentMode() {
  for (const r of els.modeRadios()) if (r.checked) return r.value;
  return DEFAULT_MODE;
}

for (const r of els.modeRadios()) {
  r.addEventListener("change", () => {
    const mode = currentMode();
    document.body.dataset.mode = mode;
    chrome.storage.local.set({ syncMode: mode });
    if (mode === "backend") {
      testBackendConnection(); // triggers checkBackendPatient on success
    } else {
      _connState = "unknown"; _connFailReason = null;
      _backendPatient = { state: "unknown", count: 0, lastUpdated: null };
      _renderConnBanner(); _renderDataState(); _refreshButtonStates();
    }
  });
}

els.backendUrl.addEventListener("change", () => {
  chrome.storage.local.set({ backendUrl: els.backendUrl.value.trim() });
  els.dashboardLink.href = els.backendUrl.value.replace(/:8010.*$/, ":3010");
  if (currentMode() === "backend") testBackendConnection();
});
els.syncApiKey.addEventListener("change", () => {
  chrome.storage.local.set({ syncApiKey: els.syncApiKey.value.trim() });
});
// Sidebar "📋 助理" toggle — persists in chrome.storage.local so the
// preference is sticky across reinstalls. sidebar.js listens to the
// same key and hides itself when set to false.
async function loadSidebarEnabled() {
  const { sidebarEnabled } = await chrome.storage.local.get("sidebarEnabled");
  els.sidebarEnabled.checked = sidebarEnabled !== false; // default ON
}

els.sidebarEnabled?.addEventListener("change", () => {
  chrome.storage.local.set({ sidebarEnabled: els.sidebarEnabled.checked });
});

// Mask-patient-name toggle — defaults OFF (citizens downloading their
// own data don't need anonymization). When ON: popup summary, FHIR
// Bundle output, sync-log, and NHI report narrative all use the
// masked form (郭一新 → 郭O新) instead of the real name.
let _maskNameEnabled = false;
async function loadMaskNameEnabled() {
  const { maskNameEnabled } = await chrome.storage.local.get("maskNameEnabled");
  _maskNameEnabled = maskNameEnabled === true;
  if (els.maskNameEnabled) els.maskNameEnabled.checked = _maskNameEnabled;
}

function _maybeMask(name) {
  return _maskNameEnabled ? maskName(name) : name || "";
}

els.maskNameEnabled?.addEventListener("change", async () => {
  _maskNameEnabled = els.maskNameEnabled.checked;
  await chrome.storage.local.set({ maskNameEnabled: _maskNameEnabled });
  // Re-render popup chrome (summary line is the only spot that reads
  // _maybeMask reactively; everywhere else samples it just-in-time).
  refreshOverrideSummary();
});

els.smartAppUrl.addEventListener("change", () => {
  // Persist trimmed value. Empty string → restore default on next load.
  const v = els.smartAppUrl.value.trim();
  if (v) {
    chrome.storage.local.set({ smartAppLaunchUrl: v });
  } else {
    chrome.storage.local.remove("smartAppLaunchUrl");
    els.smartAppUrl.value = DEFAULT_SMART_APP_LAUNCH;
  }
});

function setStatus(text, kind, breakdown) {
  // Build with DOM API — avoids innerHTML / XSS risk.
  // breakdown is an array of mixed entries:
  //   - phase timings prefixed with "⏱"  → 階段耗時
  //   - per-endpoint counts                → 各 endpoint 抓到幾筆
  // Both kinds are tucked inside a single "查看明細" toggle so the
  // popup stays compact by default.
  els.status.className = kind || "";
  els.status.textContent = "";
  if (!text && !(breakdown && breakdown.length)) return;
  els.status.appendChild(document.createTextNode(text || ""));
  if (breakdown && breakdown.length) {
    const phaseRows = breakdown.filter((b) => b.startsWith("⏱"));
    const otherRows = breakdown.filter((b) => !b.startsWith("⏱"));

    const details = document.createElement("details");
    details.className = "status-detail";
    const summary = document.createElement("summary");
    summary.textContent = "查看明細";
    details.appendChild(summary);

    if (otherRows.length) {
      const body = document.createElement("div");
      body.className = "status-breakdown";
      // One item per line so "就醫 12 筆 / 處方 88 筆 / 檢驗 412 筆"
      // is readable; the 360px popup would have wrapped a flat
      // separator-joined string into a tangled mess.
      for (const row of otherRows) {
        const line = document.createElement("div");
        line.textContent = row;
        body.appendChild(line);
      }
      details.appendChild(body);
    }
    if (phaseRows.length) {
      // Phase timings are dev info — tuck them inside a second toggle
      // so end users don't see "nhi-parallel=8s" right after a success
      // banner and think something's wrong.
      const techDetails = document.createElement("details");
      techDetails.className = "status-detail status-tech";
      const techSummary = document.createElement("summary");
      techSummary.textContent = "技術細節";
      techDetails.appendChild(techSummary);
      const phases = document.createElement("div");
      phases.className = "status-phases";
      phases.textContent = phaseRows.map((p) => p.replace(/^⏱\s*/, "")).join(" · ");
      techDetails.appendChild(phases);
      details.appendChild(techDetails);
    }
    els.status.appendChild(details);
  }
  // Status visibility drives whether the result zone shows at all.
  if (_wizardInitialized) _refreshResultZone();
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// ── Pending FHIR Bundle (local-mode result) ──────────────────────────
//
// Background stashes the generated Bundle into chrome.storage.local
// under `pendingFhirBundle`. Popup renders a download button. User must
// click to actually trigger chrome.downloads.download — the file never
// hits the disk unsolicited.

function _fmtBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

async function refreshPendingBundle() {
  const { [PENDING_BUNDLE_KEY]: pending } =
    await chrome.storage.local.get(PENDING_BUNDLE_KEY);
  if (!pending || !pending.json) {
    els.pendingBundle.hidden = true;
    if (_wizardInitialized) _refreshResultZone();
    return;
  }
  // If the user has switched override to a different patient, the
  // stashed bundle is for the *previous* patient. Hide it so they
  // can't accidentally download the wrong file. The bundle stays in
  // storage; re-entering the matching override will surface it again.
  const ov = getPatientOverride();
  if (ov?.id_no && pending.patientId && pending.patientId !== ov.id_no) {
    els.pendingBundle.hidden = true;
    if (_wizardInitialized) _refreshResultZone();
    return;
  }
  els.pendingBundle.hidden = false;
  const ago = pending.generatedAt
    ? `${Math.max(1, Math.round((Date.now() - pending.generatedAt) / 1000))} 秒前`
    : "";
  // Render in two pieces so a long filename gets its own line + ellipsis,
  // and the size / age info stays compact below it. Avoids "filename ·
  // 169.7 KB · 1 秒前" wrapping awkwardly mid-word in a 360px popup.
  els.bundleMeta.textContent = "";
  const fname = document.createElement("div");
  fname.className = "bundle-filename";
  fname.textContent = pending.filename;
  fname.title = pending.filename;
  const sizeAge = document.createElement("div");
  sizeAge.className = "bundle-sizeage";
  sizeAge.textContent = `${_fmtBytes(pending.bytes || 0)}${ago ? ` · ${ago}` : ""}`;
  els.bundleMeta.appendChild(fname);
  els.bundleMeta.appendChild(sizeAge);
  if (_wizardInitialized) _refreshResultZone();
}

async function downloadPendingBundle() {
  const { [PENDING_BUNDLE_KEY]: pending } =
    await chrome.storage.local.get(PENDING_BUNDLE_KEY);
  if (!pending) return;
  const blob = new Blob([pending.json], { type: "application/fhir+json" });
  const url = URL.createObjectURL(blob);
  try {
    await chrome.downloads.download({ url, filename: pending.filename, saveAs: false });
  } finally {
    // Release after a tick so the download has time to start.
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
}

async function clearPendingBundle() {
  await chrome.storage.local.remove(PENDING_BUNDLE_KEY);
  await refreshPendingBundle();
  // Clearing the download is the user's "I'm done with this result"
  // gesture — wipe the completion status banner too so the result zone
  // collapses entirely instead of lingering with a stale "✅ 取得完成"
  // and no download button next to it.
  _latestStatus = null;
  setStatus("", null);
  await chrome.runtime
    .sendMessage({ type: "clearSyncStatus" })
    .catch(() => {});
}

els.downloadBundleBtn.addEventListener("click", downloadPendingBundle);
els.clearBundleBtn.addEventListener("click", clearPendingBundle);

// Live update when background stashes a new bundle while popup is open.
// (Note: another onChanged listener earlier in the file refreshes the
// data-state card; we leave that one separate so failure of either path
// doesn't take the other down.)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && PENDING_BUNDLE_KEY in changes) refreshPendingBundle();
});

// Background-side flow can mutate the patientOverride mid-sync — most
// importantly _maybeFetchPatientIdFromNhi swaps the auto-XXXXXXXX
// placeholder for the real NHI cid. Without this listener the popup
// inputs stayed stale, refreshPendingBundle's patient-match check
// then compared old input value vs. fresh bundle.patientId and hid
// the download button. Reload the override into the inputs whenever
// storage changes so every downstream guard sees consistent values.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.patientOverride) loadPatientOverride();
});

// ── ⓘ Help-icon tooltip ─────────────────────────────────────────────
//
// One shared <div> appended to the popup body. On hover of any
// .help-icon, we copy its data-tip text and position the tooltip
// inside the popup, clamping to its viewport so it can't clip off
// either edge regardless of where the icon sits. (CSS pseudo-elements
// can't be measured, so a pure-CSS approach inevitably picks one
// anchor side and breaks for icons on the other side of the popup.)
const _helpTip = document.createElement("div");
_helpTip.className = "help-tooltip";
document.body.appendChild(_helpTip);

const VIEWPORT_MARGIN = 6; // keep this many px clear of popup edges

function _showHelpTooltip(icon) {
  _helpTip.textContent = icon.dataset.tip || icon.getAttribute("data-tip") || "";
  _helpTip.classList.add("visible");

  // Measure now that content is set.
  const iconRect = icon.getBoundingClientRect();
  const tipRect = _helpTip.getBoundingClientRect();
  const viewportW = document.documentElement.clientWidth;
  const viewportH = document.documentElement.clientHeight;

  // Horizontal: prefer centered on the icon; clamp into [margin, vw-tip-margin].
  let left = iconRect.left + iconRect.width / 2 - tipRect.width / 2;
  if (left < VIEWPORT_MARGIN) left = VIEWPORT_MARGIN;
  if (left + tipRect.width > viewportW - VIEWPORT_MARGIN) {
    left = viewportW - VIEWPORT_MARGIN - tipRect.width;
  }
  // Vertical: prefer above the icon; flip below if there's no room up top.
  let top = iconRect.top - tipRect.height - 6;
  if (top < VIEWPORT_MARGIN) top = iconRect.bottom + 6;
  // Final safety: clamp into viewport so very long tooltips can't bleed
  // off the bottom either.
  if (top + tipRect.height > viewportH - VIEWPORT_MARGIN) {
    top = Math.max(VIEWPORT_MARGIN, viewportH - VIEWPORT_MARGIN - tipRect.height);
  }

  _helpTip.style.left = `${left}px`;
  _helpTip.style.top = `${top}px`;
}

function _hideHelpTooltip() {
  _helpTip.classList.remove("visible");
}

// Delegated hover handlers — works for icons added after popup load too
// (e.g. when mode toggle reveals backend-only fields).
document.addEventListener("mouseover", (e) => {
  const icon = e.target.closest?.(".help-icon");
  if (icon) _showHelpTooltip(icon);
});
document.addEventListener("mouseout", (e) => {
  const icon = e.target.closest?.(".help-icon");
  if (icon) _hideHelpTooltip();
});

async function init() {
  await loadSidebarEnabled();
  await loadMaskNameEnabled();

  // Seed local bundle state from storage so the data-state card is
  // populated as soon as the popup renders (no flash of "未產生").
  await _refreshLocalBundleState();

  // Order matters: loadBackendUrl populates els.backendUrl.value, which
  // loadSyncMode() reads via testBackendConnection(). Reverse this and
  // the auto-test sees an empty URL and falsely reports "未設定 Backend URL"
  // on every popup open.
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

async function refreshSyncStatusFromBackground() {
  const status = await chrome.runtime.sendMessage({ type: "getSyncStatus" }).catch(() => null);
  if (!status) return;
  applySyncStatus(status);
}

// Latest status snapshot — keeping it lets the live-elapsed ticker
// repaint the same progress text with an updated `[Ns]` prefix every
// second without spamming chrome.storage from the service worker.
let _latestStatus = null;
let _elapsedTickerId = null;

function _fmtElapsed(ms) {
  if (ms < 60_000) return `${Math.floor(ms / 1000)}s`;
  return `${Math.floor(ms / 60_000)}m${Math.round((ms % 60_000) / 1000)}s`;
}

function _renderStatus() {
  const status = _latestStatus;
  if (!status) return;
  let text = status.progress || "(sync 進行中)";
  if (status.running && status.started) {
    const elapsed = Date.now() - status.started;
    text = `⏱ ${_fmtElapsed(elapsed)} · ${text}`;
  }
  const kind = status.running ? "info" : (status.phase === "error" ? "error" : "success");
  const breakdown = status.running ? null : status.breakdown;
  setStatus(text, kind, breakdown);
}

function applySyncStatus(status) {
  if (!status) return;
  _latestStatus = status;
  _renderStatus();
  // Status banner lives inside step 3 — force-jump there so it's
  // actually visible. Running sync OR a fresh completion both warrant
  // being on the result step.
  if (_wizardInitialized && _activeStep !== 3) {
    _setActiveStep(3, { silent: true });
  }
  if (status.running) {
    els.syncApiBtn.disabled = true;
    els.stopBtn.hidden = false;
    if (!_elapsedTickerId) {
      _elapsedTickerId = setInterval(_renderStatus, 1000);
    }
  } else {
    els.stopBtn.hidden = true;
    if (_elapsedTickerId) {
      clearInterval(_elapsedTickerId);
      _elapsedTickerId = null;
    }
    // Re-derive sync button enabled state from mode/conn/NHI-tab instead
    // of unconditionally enabling — keeps the button disabled when we
    // know we shouldn't sync (e.g. backend down, off-NHI tab).
    _refreshButtonStates();
    // Sync just finished — both sides may have changed (backend got
    // new resources in backend mode, local bundle was stashed in either
    // mode). Refresh data-state card so the user sees up-to-date counts.
    _refreshLocalBundleState();
    if (currentMode() === "backend" && _connState === "ok") checkBackendPatient();
  }
}

// Stop the in-progress sync. Two-pronged so it works even when the
// service worker has died: (1) tell the SW to set its cancel flag,
// (2) write storage directly to running:false so the popup UI unfreezes
// immediately even if the SW message can't be delivered.
async function stopSync() {
  await chrome.storage.local.set({
    syncStatus: {
      running: false,
      progress: "⛔ 停止中，正在清除部分資料…",
      phase: "cancelled",
      ts: Date.now(),
      completed: Date.now(),
    },
  });
  setStatus("⛔ 停止中，正在清除部分資料…", "info");
  chrome.runtime.sendMessage({ type: "stopSync" }).catch(() => {});
  els.stopBtn.hidden = true;
  _refreshButtonStates();
}

// Live progress updates — listen on chrome.storage.onChanged so we get
// every update the SW writes, regardless of whether the SW's broadcast
// sendMessage reached us.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.syncStatus) {
    applySyncStatus(changes.syncStatus.newValue);
  }
});

// (Legacy in-memory broadcast still listened to as a backup.)
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "syncProgress") {
    applySyncStatus(msg.status);
  }
});

// Pre-flight detection for NHI login state. Two signals (either triggers):
//  1. URL is in NHI auth namespace (IHKE3099Sxx) — login / IC card pages
//  2. Page contains a password input or known logged-out phrases
async function isOnNhiLoginPage(tabId, url) {
  if (url?.pathname && /IHKE3099/.test(url.pathname)) return true;
  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        if (document.querySelector('input[type="password"]')) return true;
        const text = (document.body?.innerText || "").trim();
        const phrases = [
          "請使用健保卡", "請插入健保卡", "請插入您的健保卡",
          "登入健康存摺", "登入失敗", "請重新登入",
          "Session 已逾時", "session 已逾時", "已逾時",
          "請以健保卡登入",
        ];
        return phrases.some((p) => text.includes(p));
      },
    });
    return !!result;
  } catch {
    return false;
  }
}

// ⚡ NHI API-direct sync — primary path. Hits NHI's underlying JSON
// endpoints in parallel and posts adapted items to /sync/upload-structured.
// Requires patient_override to be filled.
// Convert a backend URL → the origin-pattern Chrome wants for permission
// requests. "http://192.168.1.5:8010" → "http://192.168.1.5:8010/*".
// Returns null when the URL isn't parseable so the caller can short-circuit.
function _originPatternFor(url) {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}/*`;
  } catch {
    return null;
  }
}

// Backend-mode pre-flight: ensure the extension has host permission for
// the user-configured backend URL. Localhost / 127.0.0.1 are covered by
// the default manifest host_permissions; remote / LAN / production URLs
// need a one-time user grant. Must run from a user gesture (button click).
async function ensureBackendPermission(backendUrl) {
  const pattern = _originPatternFor(backendUrl);
  if (!pattern) return { ok: false, reason: `Backend URL 無法解析: ${backendUrl}` };
  const already = await chrome.permissions.contains({ origins: [pattern] });
  if (already) return { ok: true };
  let granted;
  try {
    granted = await chrome.permissions.request({ origins: [pattern] });
  } catch (e) {
    return { ok: false, reason: `權限請求失敗: ${e.message}` };
  }
  return granted
    ? { ok: true }
    : { ok: false, reason: `未授權連線到 ${pattern} — 取消` };
}

async function apiSyncNhi() {
  const ov = getPatientOverride();
  if (!ov) {
    setStatus("⛔ 回 ② 您的資料：請選擇性別、填生日後按確定", "error");
    return;
  }

  // Pre-flight: check we're on an NHI tab so cookies are usable from SW.
  const tab = await getActiveTab();
  let url;
  try { url = new URL(tab.url); } catch { setStatus("active tab has no URL", "error"); return; }
  const onLogin = await isOnNhiLoginPage(tab.id, url);
  if (onLogin) {
    setStatus("🔒 回 ① 登入：尚未登入健保存摺", "error");
    return;
  }

  // Backend mode: re-verify connectivity right here even if the banner
  // last said ok. Between the previous check and this click the user
  // may have stopped docker; without a fresh probe we'd start an upload
  // that fails mid-flight after partial data has hit (or failed to hit)
  // the backend. Cheap (≤5s) and saves a lot of confusion.
  if (currentMode() === "backend") {
    const ok = await testBackendConnection();
    if (!ok) {
      setStatus("⛔ 後端連線失敗 — 請看頂部 banner 的說明", "error");
      return;
    }
  }

  els.syncApiBtn.disabled = true;

  await chrome.storage.local.set({
    syncStatus: {
      running: true,
      progress: "🚀 開始取得健保存摺資料…",
      phase: "starting", started: Date.now(), ts: Date.now(),
    },
  });
  setStatus("🚀 開始取得健保存摺資料…", "info");

  // Compute date range from the dropdown. "1" = NHI's default window;
  // anything else is "today back N years". Helper inside background.js
  // converts to 民國 for NHI's API.
  const rangeSel = els.apiSyncRange?.value || "3";
  let dateRange = null;
  const RANGE_LABELS = {
    "1":   "最近 1 年",
    "3":   "最近 3 年",
    "5":   "最近 5 年",
    "10":  "最近 10 年",
    "all": "全部歷史紀錄",
  };
  const dateRangeLabel = RANGE_LABELS[rangeSel] || `最近 ${rangeSel} 年`;
  if (rangeSel !== "1") {
    const today = new Date();
    const end = today.toISOString().slice(0, 10);
    let start;
    if (rangeSel === "all") {
      start = "2001-01-01";  // 民國 90 — far enough back for any clinical case
    } else {
      const years = parseInt(rangeSel, 10);
      const s = new Date(today);
      s.setFullYear(s.getFullYear() - years);
      start = s.toISOString().slice(0, 10);
    }
    dateRange = { start, end };
  }

  chrome.runtime.sendMessage({
    type: "startNhiApiSync",
    payload: {
      tabId: tab.id,
      mode: currentMode(),
      backend: els.backendUrl.value.trim(),
      syncApiKey: els.syncApiKey.value.trim(),
      nhiBase: "https://myhealthbank.nhi.gov.tw",
      patientOverride: ov,
      dateRange,
      dateRangeLabel,
    },
  }).catch(() => {});
}

async function launch() {
  const backend = els.backendUrl.value.trim();
  const ov = getPatientOverride();
  const rawId = ov?.id_no;
  const smartAppLaunch = els.smartAppUrl.value.trim() || DEFAULT_SMART_APP_LAUNCH;
  if (!rawId) {
    setStatus("⛔ 還沒有病人身分證 — 請先按「🔄 取得健保存摺資料」抓一次", "error");
    return;
  }
  // Backend tracks Patient under its hashed FHIR id, not the raw national ID.
  const patientId = derivePatientId(rawId);
  // Re-test connection even if banner shows ok — backend may have gone
  // down since the last probe.
  const ok = await testBackendConnection();
  if (!ok) {
    setStatus("⛔ 後端連線失敗 — 請看頂部 banner 的說明", "error");
    return;
  }
  setStatus("建立 launch context…", "info");
  try {
    const res = await fetch(`${backend}/smart/launch-context`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patient_id: patientId }),
    });
    if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
    const { launch } = await res.json();
    const params = new URLSearchParams({ iss: `${backend}/fhir`, launch });
    // Append iss + launch params, respecting any existing query string.
    const sep = smartAppLaunch.includes("?") ? "&" : "?";
    chrome.tabs.create({ url: `${smartAppLaunch}${sep}${params}` });
    window.close();
  } catch (e) {
    setStatus(`❌ Launch 失敗：${e.message}`, "error");
  }
}

els.syncApiBtn.addEventListener("click", apiSyncNhi);
els.stopBtn.addEventListener("click", stopSync);
els.ovSaveBtn.addEventListener("click", savePatientOverride);
els.ovClearBtn.addEventListener("click", clearPatientOverride);
[els.ovIdNo, els.ovName, els.ovBirthDate, els.ovGender].forEach((el) =>
  el.addEventListener("input", refreshOverrideSummary)
);
els.launchBtn.addEventListener("click", launch);
init();
