// ── Pending FHIR Bundle (local-mode result) ──────────────────────────
//
// Background stashes the generated Bundle into chrome.storage.session
// under `pendingFhirBundle` (auto-clears when the browser closes — see
// security audit #5). Popup renders a download button. User must click
// to actually trigger chrome.downloads.download — the file never hits
// the disk unsolicited.

import { PENDING_BUNDLE_KEY } from "./constants.js";
import { els } from "./els.js";
import { getPatientOverride } from "./patient-form.js";
import { state } from "./state.js";
import { setStatus } from "./status.js";
import { _fmtBytes, _fmtRelative } from "./utils.js";
import { _refreshResultZone } from "./wizard.js";

export async function refreshPendingBundle() {
  const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.session.get(PENDING_BUNDLE_KEY);
  if (!pending || !pending.json) {
    els.pendingBundle.hidden = true;
    if (state.wizardInitialized) _refreshResultZone();
    return;
  }
  // If the user has switched override to a different patient, the
  // stashed bundle is for the *previous* patient. Hide it so they
  // can't accidentally download the wrong file. The bundle stays in
  // storage; re-entering the matching override will surface it again.
  const ov = getPatientOverride();
  if (ov?.id_no && pending.patientId && pending.patientId !== ov.id_no) {
    els.pendingBundle.hidden = true;
    if (state.wizardInitialized) _refreshResultZone();
    return;
  }
  els.pendingBundle.hidden = false;
  // Filename + sizeage live in separate sibling elements in the new
  // single-panel layout so we just update each directly.
  const ago = pending.generatedAt ? _fmtRelative(pending.generatedAt) : "";
  if (els.bundleFilename) {
    els.bundleFilename.textContent = pending.filename;
    els.bundleFilename.title = pending.filename;
  }
  if (els.bundleSizeage) {
    els.bundleSizeage.textContent = `${_fmtBytes(pending.bytes || 0)}${ago ? ` · ${ago}` : ""}`;
  }
  if (state.wizardInitialized) _refreshResultZone();
}

// Rewrite the sync-status banner from "✅ 取得完成" → "✅ 已下載" once
// the user has actually saved the bundle to disk. Keeps totalResources
// + elapsed info that was in the original message so the user still
// sees "what got downloaded" at a glance. Idempotent — re-runs noop
// if phase is already "downloaded".
async function _transitionStatusToDownloaded(bytes) {
  try {
    const { syncStatus } = await chrome.storage.local.get("syncStatus");
    if (!syncStatus || syncStatus.phase === "downloaded") return;
    const total = syncStatus.totalResources ?? 0;
    const sizeStr = bytes ? ` · ${_fmtBytes(bytes)}` : "";
    const next = {
      ...syncStatus,
      progress: `✅ 已下載健康紀錄檔（共 ${total} 筆${sizeStr}）`,
      phase: "downloaded",
      ts: Date.now(),
    };
    await chrome.storage.local.set({ syncStatus: next });
  } catch {}
}

export async function downloadPendingBundle() {
  const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.session.get(PENDING_BUNDLE_KEY);
  if (!pending) return;
  const blob = new Blob([pending.json], { type: "application/fhir+json" });
  const url = URL.createObjectURL(blob);
  let downloadId = null;
  try {
    // saveAs: true → Chrome opens a native "save as" dialog so the user
    // explicitly chooses the destination and can review the filename
    // before PHI lands on disk. Better than silently dropping into the
    // default Downloads folder.
    downloadId = await chrome.downloads.download({
      url,
      filename: pending.filename,
      saveAs: true,
    });
  } catch (e) {
    // User cancelled the save dialog or the download otherwise failed —
    // leave the pending bundle in place so the user can try again.
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return;
  }
  if (downloadId == null) {
    // User dismissed the saveAs dialog (Chrome resolves the promise
    // with undefined in that case). Don't wipe the stash.
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return;
  }
  // Wipe the session-stashed copy once the download actually starts.
  // The file is now on the user's disk under their chosen path —
  // keeping a duplicate in chrome.storage.session is pure PHI surface.
  // We listen for the download's terminal state (complete or interrupted)
  // before wiping, so a half-written file followed by a retry still has
  // something to fall back on. Belt-and-suspenders only — TTL sweep in
  // the SW will catch any case where the listener never fires.
  const _onChange = (delta) => {
    if (delta.id !== downloadId) return;
    const final = delta.state?.current;
    if (final === "complete") {
      chrome.storage.session.remove(PENDING_BUNDLE_KEY).catch(() => {});
      chrome.downloads.onChanged.removeListener(_onChange);
      // Transition the sync status banner from "✅ 取得完成" to
      // "✅ 已下載" so users who close + reopen the popup (or just
      // glance at the banner) see an accurate up-to-date state
      // rather than a stale "completed sync" message. The breakdown
      // (查看明細) stays so the count of what was downloaded is
      // still inspectable.
      _transitionStatusToDownloaded(pending.bytes);
    } else if (final === "interrupted") {
      // Keep the stash; user might retry.
      chrome.downloads.onChanged.removeListener(_onChange);
    }
  };
  chrome.downloads.onChanged.addListener(_onChange);
  // Release object URL after the download has time to start.
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export async function clearPendingBundle() {
  await chrome.storage.session.remove(PENDING_BUNDLE_KEY);
  await refreshPendingBundle();
  // Clearing the download is the user's "I'm done with this result"
  // gesture — wipe the completion status banner too so the result zone
  // collapses entirely instead of lingering with a stale "✅ 取得完成"
  // and no download button next to it.
  state.latestStatus = null;
  setStatus("", null);
  await chrome.runtime.sendMessage({ type: "clearSyncStatus" }).catch(() => {});
}
