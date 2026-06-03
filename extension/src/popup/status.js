// ── Sync status banner + live progress ───────────────────────────────
//
// The SW writes progress into chrome.storage.local.syncStatus; the
// popup mirrors it into the step-3 result zone. setStatus builds the
// banner via the DOM API (no innerHTML → no XSS); applySyncStatus
// re-attaches to an in-flight sync and drives the live-elapsed ticker.

import { els } from "./els.js";
import { state } from "./state.js";
import { _fmtElapsed, currentMode } from "./utils.js";
import {
  _refreshButtonStates,
  _refreshResultZone,
  _setActiveStep,
} from "./wizard.js";
import { _refreshLocalBundleState, checkBackendPatient } from "./data-state.js";

// Latest status snapshot lives in state.latestStatus — keeping it lets
// the live-elapsed ticker repaint the same progress text with an updated
// `[Ns]` prefix every second without spamming chrome.storage from the SW.
let _elapsedTickerId = null;

export function setStatus(text, kind, breakdown, errors, action) {
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
  if (!text && !(breakdown && breakdown.length) && !hasErrors) return;

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
      chrome.runtime
        .sendMessage({ type: "clearSyncStatus" })
        .catch(() => {});
      state.latestStatus = null;
      setStatus("", null);
    });
    header.appendChild(dismissBtn);
  }
  els.status.appendChild(header);

  // Optional call-to-action button. Rendered between header and any
  // breakdown/error details so it stays visually adjacent to the
  // status text. Used by the "downloaded" phase to take users straight
  // to step 4 (where the SMART app launcher lives) without making
  // them mentally parse the wizard tabs.
  if (action && typeof action.onClick === "function") {
    const actionBtn = document.createElement("button");
    actionBtn.type = "button";
    actionBtn.className = "status-action";
    actionBtn.textContent = action.label;
    actionBtn.addEventListener("click", action.onClick);
    els.status.appendChild(actionBtn);
  }

  if ((breakdown && breakdown.length) || hasErrors) {
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
  const kind = status.running ? "info" : (status.phase === "error" ? "error" : "success");
  const breakdown = status.running ? null : status.breakdown;
  const errors = status.running ? null : status.errors;
  // Phase-specific CTA: after the bundle hits disk, surface a button
  // that jumps the wizard to step 4 (SMART app launcher) so the user
  // doesn't have to mentally locate "step ④" themselves. The status
  // message body no longer includes the "接著至 ④ 查看..." suffix —
  // it became this button.
  let action = null;
  if (status.phase === "downloaded") {
    action = {
      label: "→ 至 ④ 查看 開啟「醫析 MediPrisma」",
      onClick: () => _setActiveStep(4),
    };
  }
  setStatus(text, kind, breakdown, errors, action);
}

export function applySyncStatus(status) {
  if (!status) return;
  state.latestStatus = status;
  _renderStatus();
  // Status banner lives inside step 3 — force-jump there so it's
  // actually visible. Running sync OR a fresh completion both warrant
  // being on the result step.
  if (state.wizardInitialized && state.activeStep !== 3) {
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
