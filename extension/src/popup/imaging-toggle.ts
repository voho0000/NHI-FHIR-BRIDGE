// Step 3 "抓影像檢查報告" opt-in toggle. Persists across popup opens via
// chrome.storage.local. Default OFF — NHI imaging fetch requires a 1-3
// min lazy-prepare per first-touch row and each base64 JPG is ~2-3 MB,
// so the cost is paid only when the user explicitly asks for it.
//
// The flag is read at sync time by sync-client.ts (els.fetchImagingEnabled
// .checked) and passed through to the background orchestrator as part
// of the startNhiApiSync payload.
import { els } from "./els.js";
import { state } from "./state.js";

// The imaging note (JPG≠DICOM + inline 前往影像頁 link) is PRE-SYNC guidance.
// Show it only when (一併下載 is on) AND (no sync result is showing yet): once a
// bundle has been generated the result zone carries its OWN 前往影像頁 chip, and
// keeping this note alongside it reads cluttered (user feedback 2026-06-26).
// Called from the toggle handlers AND wizard's _refreshResultZone — so it
// re-hides the moment a sync completes, and re-appears if the user clears the
// result (status dismissed / bundle cleared).
export function refreshImagingNoteVisibility() {
  if (!els.imagingJpgNote) return;
  const enabled = els.fetchImagingEnabled?.checked === true;
  const bundleShown = !!els.pendingBundle && !els.pendingBundle.hidden;
  const st = state.latestStatus;
  const doneStatus = !!st && !st.running && (st.phase === "done" || st.phase === "downloaded");
  els.imagingJpgNote.hidden = !(enabled && !bundleShown && !doneStatus);
}

export async function loadFetchImagingEnabled() {
  const { fetchImagingEnabled } = await chrome.storage.local.get("fetchImagingEnabled");
  const enabled = fetchImagingEnabled === true;
  // Segmented toggle: select the matching radio (the off radio doesn't
  // auto-check when we only clear the on radio, so set both explicitly).
  if (els.fetchImagingEnabled) {
    els.fetchImagingEnabled.checked = enabled;
  }
  if (els.fetchImagingOff) {
    els.fetchImagingOff.checked = !enabled;
  }
  refreshImagingNoteVisibility();
}

export async function onFetchImagingToggle() {
  const enabled = els.fetchImagingEnabled?.checked === true;
  await chrome.storage.local.set({ fetchImagingEnabled: enabled });
  refreshImagingNoteVisibility();
}
