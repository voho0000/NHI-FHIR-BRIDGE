// ── Pending FHIR Bundle (local-mode result) ──────────────────────────
//
// v0.14+ flow: the SW auto-triggers the native Save As dialog at sync
// completion via an offscreen document (see background/bundle.ts). The
// popup's role here narrows to:
//   1. Read the metadata record from chrome.storage.local and surface
//      filename + size + ✓ / ✕ status to the user.
//   2. Offer a "再儲存一次" button ONLY when the auto-save was cancelled
//      or errored — in that case the SW also stashed the JSON itself so
//      the popup can re-trigger chrome.downloads.download.
// chrome.storage.session is no longer used for this slot — bundles can
// exceed its 10 MB ceiling once imaging is enabled.

import { PENDING_BUNDLE_KEY } from "./constants.js";
import { els } from "./els.js";
import { getPatientOverride } from "./patient-form.js";
import { state } from "./state.js";
import { setStatus } from "./status.js";
import { _fmtBytes, _fmtRelative } from "./utils.js";
import { _refreshResultZone } from "./wizard.js";

export async function refreshPendingBundle() {
  const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.local.get(PENDING_BUNDLE_KEY);
  // Diagnostic log so we can verify the popup is reacting to SW-side
  // hot-patches (bg poll writes new bundle.bytes → onChanged fires →
  // popup should re-read + re-render). Remove once verified.
  console.info(
    "[popup] refreshPendingBundle:",
    pending
      ? `${((pending.bytes || 0) / 1024 / 1024).toFixed(2)} MB, generatedAt=${pending.generatedAt ? new Date(pending.generatedAt).toLocaleTimeString() : "(none)"}, lastPatchedAt=${pending.lastPatchedAt ? new Date(pending.lastPatchedAt).toLocaleTimeString() : "(none)"}`
      : "(no pending bundle)",
  );
  if (!pending) {
    els.pendingBundle.hidden = true;
    if (state.wizardInitialized) _refreshResultZone();
    return;
  }
  // If the user has switched override to a different patient, the
  // stashed record is for the *previous* patient. Hide it so they
  // can't accidentally re-save the wrong file. The record stays in
  // storage; re-entering the matching override will surface it again.
  const ov = getPatientOverride();
  if (ov?.id_no && pending.patientId && pending.patientId !== ov.id_no) {
    els.pendingBundle.hidden = true;
    if (state.wizardInitialized) _refreshResultZone();
    return;
  }
  els.pendingBundle.hidden = false;
  const ago = pending.generatedAt ? _fmtRelative(pending.generatedAt) : "";
  if (els.bundleFilename) {
    els.bundleFilename.textContent = pending.filename;
    els.bundleFilename.title = pending.filename;
  }
  if (els.bundleSizeage) {
    const parts = [_fmtBytes(pending.bytes || 0)];
    if (ago) parts.push(ago);
    els.bundleSizeage.textContent = parts.join(" · ");
  }
  // Always show the download button when a pending bundle exists.
  // SW no longer auto-saves; the user is the only path to disk and
  // the popup click is what Chrome accepts for the saveAs:true
  // dialog (which gives the user control over file location).
  if (els.downloadBundleBtn) {
    els.downloadBundleBtn.hidden = !pending.json;
    els.downloadBundleBtn.textContent = "下載健康紀錄檔";
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
  const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.local.get(PENDING_BUNDLE_KEY);
  if (!pending || !pending.json) return;
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
  // Wipe the locally-stashed copy once the download actually starts.
  // The file is now on the user's disk under their chosen path —
  // keeping a duplicate in chrome.storage.local is pure PHI surface.
  // We listen for the download's terminal state (complete or interrupted)
  // before wiping, so a half-written file followed by a retry still has
  // something to fall back on. Belt-and-suspenders only — TTL sweep in
  // the SW will catch any case where the listener never fires.
  const _onChange = (delta) => {
    if (delta.id !== downloadId) return;
    const final = delta.state?.current;
    if (final === "complete") {
      chrome.storage.local.remove(PENDING_BUNDLE_KEY).catch(() => {});
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
  await chrome.storage.local.remove(PENDING_BUNDLE_KEY);
  await refreshPendingBundle();
  // Clearing the download is the user's "I'm done with this result"
  // gesture — wipe the completion status banner too so the result zone
  // collapses entirely instead of lingering with a stale "✅ 取得完成"
  // and no download button next to it.
  state.latestStatus = null;
  setStatus("", null);
  await chrome.runtime.sendMessage({ type: "clearSyncStatus" }).catch(() => {});
}
