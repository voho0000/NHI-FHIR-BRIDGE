// Mutable cross-cutting state for an in-flight sync, plus the status writer.
//
// CRITICAL: this module owns the single source of truth for the cancel flag
// and the active-sync context. Both the message handler (stop button) and
// the orchestrator import from HERE so they observe the same instance after
// esbuild bundles the worker. Re-declaring these in two modules would
// silently break cancellation.

import { STORAGE_KEY } from "./constants.js";

// Cancellation flag set by the popup's stop button. Read between phases and
// before each detail page so the in-progress sync exits promptly. Cleared at
// the start of each new sync run.
let _cancelled = false;
// Context for the in-flight sync so the stopSync handler can wipe partial
// data without the popup needing to pass it back. Set at the top of
// runNhiApiSync; cleared on completion (success/failure/cancel).
let _activeSyncCtx = null;
// v0.15+: tab id of the currently-open hidden imaging-trigger tab. The
// orchestrator's imagingPromise runs as fire-and-forget; without this,
// a user pressing stop mid-sync would still see the hidden tab open
// and run through the Vue-click flow because the imagingPromise can't
// observe the cancel flag mid-script. The stopSync handler closes
// this tab, which makes chrome.scripting.executeScript throw, which
// unwinds the trigger flow.
let _activeImagingTabId: number | null = null;

export function isCancelled() {
  return _cancelled;
}
export function resetCancelled() {
  _cancelled = false;
}
export function requestCancel() {
  _cancelled = true;
}
export function getActiveSyncCtx() {
  return _activeSyncCtx;
}
export function setActiveSyncCtx(ctx) {
  _activeSyncCtx = ctx;
}
export function getActiveImagingTabId(): number | null {
  return _activeImagingTabId;
}
export function setActiveImagingTabId(tabId: number | null) {
  _activeImagingTabId = tabId;
}

export async function setStatus(partial) {
  // After cancellation, the popup has already written the definitive
  // "stopped" status — silence any further progress writes from the
  // in-flight sync code so the UI doesn't bounce while it unwinds.
  if (_cancelled) return;
  const prev = (await chrome.storage.local.get(STORAGE_KEY))[STORAGE_KEY] || {};
  const next = { ...prev, ...partial, ts: Date.now() };
  await chrome.storage.local.set({ [STORAGE_KEY]: next });
  // Broadcast to any open popup. If no listener (popup closed),
  // sendMessage rejects — swallow.
  chrome.runtime.sendMessage({ type: "syncProgress", status: next }).catch(() => {});
}

// Wrap a long-running fan-out with a periodic elapsed-time ticker so the
// popup doesn't look frozen during 60-90 second NHI detail fetches (each S02
// detail triggers a real DB JOIN server-side; the fan-out time is bound by
// NHI's per-request processing cost, not anything we can speed up
// client-side).
//
// makeLabel is a function (elapsedSec) → string that formats the progress
// message; called every 3 seconds while the awaited promise is in flight.
// Final setStatus call fires only on completion (so the "complete" message
// replaces the "in-progress" one cleanly).
export async function withProgressTimer(makeLabel, fn) {
  const start = Date.now();
  await setStatus({ progress: makeLabel(0) });
  const interval = setInterval(() => {
    const elapsed = Math.round((Date.now() - start) / 1000);
    setStatus({ progress: makeLabel(elapsed) }).catch(() => {});
  }, 3000);
  try {
    return await fn();
  } finally {
    clearInterval(interval);
  }
}
