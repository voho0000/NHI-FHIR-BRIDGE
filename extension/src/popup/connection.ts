// ── Backend connection + sync-mode ───────────────────────────────────
//
// Single source of truth: `state.connState` reflects the latest backend
// connectivity check. Both the banner UI and the enabled-state of the
// 📥 Sync / 🚀 Launch buttons read from it.
//
// States:
//   "unknown"  — not yet checked (e.g. first paint in local mode)
//   "checking" — fetch in flight
//   "ok"       — GET /fhir/metadata returned a FHIR CapabilityStatement
//   "fail"     — anything else; `state.connFailReason` carries detail
//
// Backend connectivity is treated as a *prerequisite* for backend mode,
// not as a per-action check. Switching to backend mode triggers a test
// immediately; failure shows a banner with actionable guidance and
// disables both action buttons until connectivity recovers.

import { DEFAULT_BACKEND, DEFAULT_MODE, DEFAULT_SMART_APP_LAUNCH } from "./constants.js";
import { _renderDataState, checkBackendPatient } from "./data-state.js";
import { els } from "./els.js";
import { state } from "./state.js";
import { _originPatternFor, currentMode } from "./utils.js";
import { _refreshButtonStates } from "./wizard.js";

// Persisted-state keys. Backend URL and API key persist across browser sessions.
export async function loadBackendUrl() {
  const { backendUrl, syncApiKey, smartAppLaunchUrl } = await chrome.storage.local.get([
    "backendUrl",
    "syncApiKey",
    "smartAppLaunchUrl",
  ]);
  els.backendUrl.value = backendUrl || DEFAULT_BACKEND;
  els.syncApiKey.value = syncApiKey || "";
  els.smartAppUrl.value = smartAppLaunchUrl || DEFAULT_SMART_APP_LAUNCH;
  els.dashboardLink.href = els.backendUrl.value.replace(/:8010.*$/, ":3010");
}

// Banner copy. Drop the leading ✗ — the red dot left of the text is
// already the "fail" signal, and the row was reading "● ✗ 連不上後端"
// = three indicators stacked.
const _CONN_LABELS = {
  unknown: "尚未檢查",
  checking: "確認中…",
  ok: () => `已連線 — ${els.backendUrl.value.trim()}`,
  fail: () => {
    const r = state.connFailReason || {};
    return (
      {
        "no-url": "未設定 Backend URL",
        "no-permission": "未授權連線",
        network: "連不上後端",
        timeout: "連線逾時",
        http: `HTTP ${r.detail || ""}`.trim(),
        "not-fhir": "回應不是 FHIR",
      }[r.kind] ?? "連線失敗"
    );
  },
};

const _CONN_HELP = {
  "no-url": "請到「進階設定」填入 Backend URL，例如 <code>http://localhost:8010</code>。",
  "no-permission": "Chrome 阻擋了跨來源請求。請重新開 popup，當權限對話框跳出時按「允許」。",
  network:
    "後端可能還沒啟動。請執行：<br><code>docker compose up -d</code><br>確認 backend 容器跑起來再重試。",
  timeout: "5 秒內沒收到回應 — backend 可能還在啟動中，等 30 秒再按重試。",
  http: "Backend 回應錯誤狀態碼。檢查 backend 的 log：<br><code>docker compose logs backend</code>",
  "not-fhir":
    "這個 URL 回了東西，但不是 FHIR CapabilityStatement。確認 Backend URL 指向 NHI-FHIR-Bridge 的 /fhir 根目錄。",
};

export function _renderConnBanner() {
  const banner = els.connBanner;
  if (!banner) return;
  banner.dataset.state = state.connState;
  // Mirror state onto the outer .conn-block so the wrapper border
  // (which holds banner + help body inside ONE card) tracks the same
  // color the banner is using.
  if (els.connSection) els.connSection.dataset.state = state.connState;
  const label = _CONN_LABELS[state.connState];
  els.connMsg.textContent = typeof label === "function" ? label() : label;
  els.connRetryBtn.hidden = state.connState !== "fail";
  if (state.connState === "fail" && state.connFailReason?.kind) {
    els.connHelp.hidden = false;
    els.connHelp.innerHTML = _CONN_HELP[state.connFailReason.kind] ?? "";
  } else {
    els.connHelp.hidden = true;
    els.connHelp.innerHTML = "";
  }

  // Compact-pill vs full-banner swap: when everything's fine, shrink to
  // a small green pill in the header so the popup body has more room
  // for actionable content. Anything else (unknown / checking / fail)
  // keeps the full banner so progress + error help has space to render.
  const isOk = state.connState === "ok";
  if (els.connSection) els.connSection.hidden = isOk;
  if (els.connMini) {
    els.connMini.hidden = !isOk;
    if (isOk) els.connMini.title = `已連線 — ${els.backendUrl.value.trim()}`;
  }
}

// Backend-mode pre-flight: ensure the extension has host permission for
// the user-configured backend URL. Localhost / 127.0.0.1 are covered by
// the default manifest host_permissions; remote / LAN / production URLs
// need a one-time user grant. Must run from a user gesture (button click).
export async function ensureBackendPermission(backendUrl) {
  const pattern = _originPatternFor(backendUrl);
  if (!pattern) return { ok: false, reason: `Backend URL 無法解析: ${backendUrl}` };
  const already = await chrome.permissions.contains({ origins: [pattern] });
  if (already) return { ok: true };
  let granted: any;
  try {
    granted = await chrome.permissions.request({ origins: [pattern] });
  } catch (e) {
    return { ok: false, reason: `權限請求失敗: ${e.message}` };
  }
  return granted ? { ok: true } : { ok: false, reason: `未授權連線到 ${pattern} — 取消` };
}

export async function testBackendConnection() {
  const url = els.backendUrl.value.trim();
  if (!url) {
    state.connState = "fail";
    state.connFailReason = { kind: "no-url" };
    _renderConnBanner();
    _refreshButtonStates();
    return false;
  }
  state.connState = "checking";
  state.connFailReason = null;
  _renderConnBanner();
  _refreshButtonStates();

  const perm = await ensureBackendPermission(url);
  if (!perm.ok) {
    state.connState = "fail";
    state.connFailReason = { kind: "no-permission" };
    _renderConnBanner();
    _refreshButtonStates();
    return false;
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 5000);
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/fhir/metadata`, { signal: ctrl.signal });
    if (!res.ok) {
      state.connState = "fail";
      state.connFailReason = { kind: "http", detail: res.status };
    } else {
      const body = await res.json().catch(() => null);
      if (body?.resourceType !== "CapabilityStatement") {
        state.connState = "fail";
        state.connFailReason = { kind: "not-fhir" };
      } else {
        state.connState = "ok";
        state.connFailReason = null;
      }
    }
  } catch (e) {
    state.connState = "fail";
    state.connFailReason = { kind: e.name === "AbortError" ? "timeout" : "network" };
  } finally {
    clearTimeout(timer);
  }

  _renderConnBanner();
  _refreshButtonStates();
  // Whenever connectivity flips, re-check whether this patient already
  // exists on backend. (Stale "state.backendPatient" state would otherwise
  // cause Launch to look enabled / disabled wrongly.)
  if (currentMode() === "backend") checkBackendPatient();
  return state.connState === "ok";
}

// ── Backend mode feature gate ────────────────────────────────────────
// Layperson default: backend mode (Docker server + Dashboard + SMART
// App) is hidden behind a toggle in 進階設定. When OFF (default), the
// mode-toggle row in step 3 doesn't render and syncMode is forced to
// "local" regardless of what's in storage.
export async function loadBackendModeEnabled() {
  const { backendModeEnabled } = await chrome.storage.local.get("backendModeEnabled");
  const enabled = backendModeEnabled === true;
  els.backendModeEnabled.checked = enabled;
  document.body.dataset.backendEnabled = enabled ? "true" : "false";
}

// Backend-mode toggle change handler (wired in the entry).
export async function onBackendModeToggle() {
  const enabled = els.backendModeEnabled.checked;
  document.body.dataset.backendEnabled = enabled ? "true" : "false";
  await chrome.storage.local.set({ backendModeEnabled: enabled });
  if (enabled) {
    // Auto-switch to backend mode so the user immediately sees the
    // mode tab + the backend config fields they just unlocked. Beats
    // "I enabled it but nothing happened".
    for (const r of els.modeRadios()) r.checked = r.value === "backend";
    document.body.dataset.mode = "backend";
    await chrome.storage.local.set({ syncMode: "backend" });
    testBackendConnection();
  } else {
    // Force back to local; clear any leftover backend connection state
    // so the next time they re-enable it doesn't show stale "已連線".
    for (const r of els.modeRadios()) r.checked = r.value === "local";
    document.body.dataset.mode = "local";
    await chrome.storage.local.set({ syncMode: "local" });
    state.connState = "unknown";
    state.connFailReason = null;
    state.backendPatient = { state: "unknown", count: 0, lastUpdated: null };
    _renderConnBanner();
    _renderDataState();
    _refreshButtonStates();
  }
}

// ── Sync mode (local | backend) ──────────────────────────────────────
export async function loadSyncMode() {
  const { syncMode } = await chrome.storage.local.get("syncMode");
  // Backend mode disabled in 進階設定 → ignore any stored backend mode.
  const backendEnabled = document.body.dataset.backendEnabled === "true";
  const mode = backendEnabled && syncMode === "backend" ? "backend" : DEFAULT_MODE;
  for (const r of els.modeRadios()) r.checked = r.value === mode;
  document.body.dataset.mode = mode;
  if (mode === "backend") {
    // Auto-test on open so the user sees status without clicking. Awaiting
    // here serializes the rest of init() until we know the answer.
    await testBackendConnection();
  } else {
    state.connState = "unknown";
    state.connFailReason = null;
    _renderConnBanner();
  }
}

// Sync-mode radio change handler (wired in the entry).
export function onModeChange() {
  const mode = currentMode();
  document.body.dataset.mode = mode;
  chrome.storage.local.set({ syncMode: mode });
  if (mode === "backend") {
    testBackendConnection(); // triggers checkBackendPatient on success
  } else {
    state.connState = "unknown";
    state.connFailReason = null;
    state.backendPatient = { state: "unknown", count: 0, lastUpdated: null };
    _renderConnBanner();
    _renderDataState();
    _refreshButtonStates();
  }
}

// Backend-URL change handler (wired in the entry).
export function onBackendUrlChange() {
  chrome.storage.local.set({ backendUrl: els.backendUrl.value.trim() });
  els.dashboardLink.href = els.backendUrl.value.replace(/:8010.*$/, ":3010");
  if (currentMode() === "backend") testBackendConnection();
}
