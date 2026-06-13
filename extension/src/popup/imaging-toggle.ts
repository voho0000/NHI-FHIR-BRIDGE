// Step 3 "抓影像檢查報告" opt-in toggle. Persists across popup opens via
// chrome.storage.local. Default OFF — NHI imaging fetch requires a 1-3
// min lazy-prepare per first-touch row and each base64 JPG is ~2-3 MB,
// so the cost is paid only when the user explicitly asks for it.
//
// The flag is read at sync time by sync-client.ts (els.fetchImagingEnabled
// .checked) and passed through to the background orchestrator as part
// of the startNhiApiSync payload.
import { els } from "./els.js";

// The JPG≠DICOM reminder is only relevant once the user opts into imaging,
// so it tracks the checkbox state (hidden when off → zero footprint for the
// common text-report-only path).
function syncJpgNote(enabled: boolean) {
  if (els.imagingJpgNote) {
    els.imagingJpgNote.hidden = !enabled;
  }
}

export async function loadFetchImagingEnabled() {
  const { fetchImagingEnabled } = await chrome.storage.local.get("fetchImagingEnabled");
  const enabled = fetchImagingEnabled === true;
  if (els.fetchImagingEnabled) {
    els.fetchImagingEnabled.checked = enabled;
  }
  syncJpgNote(enabled);
}

export async function onFetchImagingToggle() {
  const enabled = els.fetchImagingEnabled.checked === true;
  await chrome.storage.local.set({ fetchImagingEnabled: enabled });
  syncJpgNote(enabled);
}
