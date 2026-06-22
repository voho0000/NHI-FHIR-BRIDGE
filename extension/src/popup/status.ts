// ── Sync status banner + live progress ───────────────────────────────
//
// The SW writes progress into chrome.storage.local.syncStatus; the
// popup mirrors it into the step-3 result zone. setStatus builds the
// banner via the DOM API (no innerHTML → no XSS); applySyncStatus
// re-attaches to an in-flight sync and drives the live-elapsed ticker.

import { _refreshLocalBundleState, checkBackendPatient } from "./data-state.js";
import { els } from "./els.js";
import { ICON_CHEVRON } from "./icons.js";
import { state } from "./state.js";
import { _shouldJumpToResultStep } from "./step-logic.js";
import { _fmtElapsed, currentMode } from "./utils.js";
import { _refreshButtonStates, _refreshResultZone, _setActiveStep } from "./wizard.js";

// Latest status snapshot lives in state.latestStatus — keeping it lets
// the live-elapsed ticker repaint the same progress text with an updated
// `[Ns]` prefix every second without spamming chrome.storage from the SW.
let _elapsedTickerId = null;

export function setStatus(text, kind?, breakdown?, errors?, actions?) {
  // Build with DOM API — avoids innerHTML / XSS risk.
  // breakdown is an array of mixed entries:
  //   - phase timings prefixed with "⏱"  → 階段耗時
  //   - per-endpoint counts                → 各 endpoint 抓到幾筆
  // errors (optional) is the raw `${ep}: ${msg}` strings from the SW,
  // surfaced under a "失敗明細" sub-section so the user can see what
  // the "N 項失敗" summary actually points at (no longer DevTools-only).
  // Both groups are tucked inside a single "查看明細" toggle so the
  // popup stays compact by default.
  els.status.className = kind || "";
  els.status.textContent = "";
  const hasErrors = Array.isArray(errors) && errors.length > 0;
  if (!text && !breakdown?.length && !hasErrors) return;

  // Header row: status text + dismiss button (only when sync not
  // running, so the user can declutter the popup once they're done
  // reading the result). Mid-sync the button is suppressed so the
  // user can't accidentally hide the live progress.
  const header = document.createElement("div");
  header.className = "status-header";
  const textSpan = document.createElement("span");
  textSpan.className = "status-text";
  textSpan.textContent = text || "";
  header.appendChild(textSpan);
  const running = state.latestStatus?.running === true;
  if (!running) {
    const dismissBtn = document.createElement("button");
    dismissBtn.type = "button";
    dismissBtn.className = "status-dismiss";
    dismissBtn.textContent = "✕";
    dismissBtn.title = "清除這則訊息";
    dismissBtn.setAttribute("aria-label", "清除訊息");
    dismissBtn.addEventListener("click", () => {
      // Mirror what the existing clearPendingBundle flow does for
      // its sibling stale-result wipe — drop SW-side persisted
      // syncStatus, drop popup-side cached _latestStatus, then
      // re-render empty.
      chrome.runtime.sendMessage({ type: "clearSyncStatus" }).catch(() => {});
      state.latestStatus = null;
      setStatus("", null);
    });
    header.appendChild(dismissBtn);
  }
  els.status.appendChild(header);

  // Optional call-to-action chip(s). Rendered between header and any
  // breakdown/error details so they stay visually adjacent to the status
  // text. Used by the "downloaded" phase (jump to step 4 — the SMART app
  // launcher) and the imaging-arm case (open the 影像清單 page). Accepts a
  // single action or an array; normalize so multiple chips can stack.
  const actionList = (Array.isArray(actions) ? actions : actions ? [actions] : []).filter(
    (a) => a && typeof a.onClick === "function",
  );
  for (const act of actionList) {
    const actionBtn = document.createElement("button");
    actionBtn.type = "button";
    actionBtn.className = "status-action";
    // Chip layout: label span (textContent — safe) + trailing chevron
    // span (innerHTML of a trusted constant SVG, not user data).
    const msg = document.createElement("span");
    msg.className = "status-action-msg";
    msg.textContent = act.label;
    actionBtn.appendChild(msg);
    const jump = document.createElement("span");
    jump.className = "status-action-jump";
    jump.innerHTML = ICON_CHEVRON;
    actionBtn.appendChild(jump);
    actionBtn.addEventListener("click", act.onClick);
    els.status.appendChild(actionBtn);
  }

  if (breakdown?.length || hasErrors) {
    const bd = breakdown || [];
    const phaseRows = bd.filter((b) => b.startsWith("⏱"));
    const otherRows = bd.filter((b) => !b.startsWith("⏱"));

    const details = document.createElement("details");
    details.className = "status-detail";
    const summary = document.createElement("summary");
    summary.textContent = "查看明細";
    details.appendChild(summary);

    if (otherRows.length) {
      const body = document.createElement("div");
      body.className = "status-breakdown";
      // Each breakdown string looks like "就醫：164 筆". Split on the
      // full-width colon and render label left / value right so the
      // count column lines up cleanly. Rows that don't have a clean
      // colon split (or have multiple, e.g. composite "成人健檢：
      // 2 筆 → 34 項") fall back to one-line plain rendering.
      for (const row of otherRows) {
        const lineEl = document.createElement("div");
        lineEl.className = "br-row";
        const colonIdx = row.indexOf("：");
        if (colonIdx > 0 && colonIdx < row.length - 1) {
          const labelSpan = document.createElement("span");
          labelSpan.className = "br-label";
          labelSpan.textContent = row.slice(0, colonIdx);
          const valueSpan = document.createElement("span");
          valueSpan.className = "br-value";
          valueSpan.textContent = row.slice(colonIdx + 1).trim();
          lineEl.appendChild(labelSpan);
          lineEl.appendChild(valueSpan);
        } else {
          lineEl.classList.add("br-row-plain");
          lineEl.textContent = row;
        }
        body.appendChild(lineEl);
      }
      details.appendChild(body);
    }
    if (hasErrors) {
      // Failure-detail nested section. Per-error raw messages are
      // dev-ish (e.g. "imaging detail: HTTP 504") but surfacing them
      // beats the previous "N 項失敗 — DevTools to read" UX. Folded
      // by default so the success summary stays the dominant signal
      // when something did still get through.
      const errDetails = document.createElement("details");
      errDetails.className = "status-detail status-errors";
      const errSummary = document.createElement("summary");
      errSummary.textContent = `失敗明細（${errors.length}）`;
      errDetails.appendChild(errSummary);
      const errBody = document.createElement("div");
      errBody.className = "status-error-list";
      for (const e of errors) {
        const line = document.createElement("div");
        line.textContent = `• ${e}`;
        errBody.appendChild(line);
      }
      errDetails.appendChild(errBody);
      details.appendChild(errDetails);
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
      // Each phaseRow looks like "⏱ nhi-parallel=2.6s". Strip the
      // stopwatch prefix, split on "=", render as label / value pair
      // so durations align vertically (tabular-nums in CSS).
      for (const raw of phaseRows) {
        const clean = raw.replace(/^⏱\s*/, "");
        const eqIdx = clean.indexOf("=");
        const rowEl = document.createElement("div");
        rowEl.className = "ph-row";
        if (eqIdx > 0 && eqIdx < clean.length - 1) {
          const labelSpan = document.createElement("span");
          labelSpan.className = "ph-label";
          labelSpan.textContent = clean.slice(0, eqIdx);
          const valueSpan = document.createElement("span");
          valueSpan.className = "ph-value";
          valueSpan.textContent = clean.slice(eqIdx + 1);
          rowEl.appendChild(labelSpan);
          rowEl.appendChild(valueSpan);
        } else {
          rowEl.textContent = clean;
        }
        phases.appendChild(rowEl);
      }
      techDetails.appendChild(phases);
      details.appendChild(techDetails);
    }
    els.status.appendChild(details);
  }
  // Status visibility drives whether the result zone shows at all.
  if (state.wizardInitialized) _refreshResultZone();
}

export async function refreshSyncStatusFromBackground() {
  const status = await chrome.runtime.sendMessage({ type: "getSyncStatus" }).catch(() => null);
  if (!status) return;
  applySyncStatus(status);
}

// Label for the imaging-arm chip — shared by _renderStatus and the
// session-expiry retry render so the two never drift.
const IMAGING_ARM_LABEL = "🖼️ 開啟影像清單頁，查看是否有影像檔";

// CTA chip(s) for the current status. Two independent triggers, stacked when
// both apply:
//   1. imagingArmUrl — imaging opted-in but 0 image bytes came back (NHI
//      confirmation expired / not yet armed). Opens the 影像清單 page in the
//      user's EXISTING logged-in tab (see _openImagingArmTab).
//   2. phase "downloaded" — bundle saved; jump to step 4 (SMART app launcher).
function _buildStatusActions(status) {
  const actions: Array<{ label: string; onClick: () => void }> = [];
  if (!status.running && status.imagingArmUrl) {
    actions.push({
      label: IMAGING_ARM_LABEL,
      onClick: () => _openImagingArmTab(status.imagingArmUrl),
    });
  }
  if (status.phase === "downloaded") {
    actions.push({ label: "至 ④ 查看「醫析 MediPrisma」", onClick: () => _setActiveStep(4) });
  }
  return actions;
}

// Open the 影像清單 page in the user's EXISTING logged-in NHI tab — it holds the
// per-tab sessionStorage token AND the currently-selected 就醫對象 (for 眷屬
// accounts a fresh tab / new login defaults back to 自己). Before navigating we
// CHECK the tab is still logged in: a fresh tab, or a session that idled out
// (NHI bounces it to IHKE3095S01 login / IHKE3001S99 IDLE and drops the token),
// would otherwise dump the user on the login page with no explanation. When not
// logged in we keep the popup open and re-render the SAME result card (breakdown
// + chips preserved) with a clear "請先重新登入" hint so they can retry after.
async function _openImagingArmTab(url) {
  const showLoginHint = (msg) => {
    const s = state.latestStatus;
    setStatus(
      msg,
      "info",
      s?.breakdown ?? null,
      s?.errors ?? null,
      s ? _buildStatusActions(s) : [],
    );
  };
  try {
    const tabs = await chrome.tabs.query({ url: "https://myhealthbank.nhi.gov.tw/*" });
    const target = tabs.find((t) => t.active) ?? tabs[0];
    if (target?.id == null) {
      showLoginHint("找不到已登入的健康存摺分頁 — 請先回 ① 登入健康存摺，再點一次下方按鈕。");
      return;
    }
    // Authenticated? token present AND not already on NHI's login / idle pages.
    // executeScript failure (rare — tab mid-navigation) → assume OK + navigate.
    let loggedIn = true;
    try {
      const [res] = await chrome.scripting.executeScript({
        target: { tabId: target.id },
        func: () =>
          !!sessionStorage.getItem("token") && !/IHKE3095S01|IHKE3001S99|IDLE/i.test(location.href),
      });
      loggedIn = res?.result === true;
    } catch {
      loggedIn = true;
    }
    if (!loggedIn) {
      showLoginHint("健康存摺登入已逾時 — 請先回健康存摺分頁重新登入，再點一次下方按鈕。");
      return;
    }
    await chrome.tabs.update(target.id, { url, active: true });
    if (target.windowId != null) {
      await chrome.windows.update(target.windowId, { focused: true }).catch(() => {});
    }
  } catch {
    showLoginHint("無法開啟影像清單頁 — 請手動回健康存摺分頁、進入「影像清單」頁後再重新取得。");
  }
}

function _renderStatus() {
  const status = state.latestStatus;
  if (!status) return;
  let text = status.progress || "(sync 進行中)";
  // Strip legacy "— 接著至 ④ 查看 開啟「醫析 MediPrisma」..." suffix
  // from any syncStatus that was persisted by pre-v0.11.2 builds. The
  // suffix became a CTA button below; without this strip, freshly-
  // upgraded popups show both old text AND the new button until the
  // user does the next sync. Idempotent (no-op once already stripped).
  text = text.replace(/\s*[—-]\s*接著至\s*④.*$/u, "").trim();
  if (status.running && status.started) {
    const elapsed = Date.now() - status.started;
    text = `⏱ ${_fmtElapsed(elapsed)} · ${text}`;
  }
  const kind = status.running ? "info" : status.phase === "error" ? "error" : "success";
  const breakdown = status.running ? null : status.breakdown;
  const errors = status.running ? null : status.errors;
  // CTA chip(s) built by the shared helper (imaging-arm + downloaded → step 4).
  // The imaging chip survives the "done"→"downloaded" transition because
  // _transitionStatusToDownloaded spreads the prior status (imagingArmUrl).
  setStatus(text, kind, breakdown, errors, _buildStatusActions(status));
}

export function applySyncStatus(status) {
  if (!status) return;
  const prev = state.latestStatus;
  state.latestStatus = status;
  _renderStatus();
  if (state.wizardInitialized && state.activeStep !== 3 && _shouldJumpToResultStep(prev, status)) {
    _setActiveStep(3, { silent: true });
  }
  if (status.running) {
    els.syncApiBtn.disabled = true;
    els.syncApiBtn.textContent = "取得中…";
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
    if (currentMode() === "backend" && state.connState === "ok") checkBackendPatient();
  }
}

// Stop the in-progress sync. Two-pronged so it works even when the
// service worker has died: (1) tell the SW to set its cancel flag,
// (2) write storage directly to running:false so the popup UI unfreezes
// immediately even if the SW message can't be delivered.
export async function stopSync() {
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
