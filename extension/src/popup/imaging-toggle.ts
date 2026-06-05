// Step 3 "抓影像檢查報告" opt-in toggle. Persists across popup opens via
// chrome.storage.local. Default OFF — NHI imaging fetch requires a 1-3
// min lazy-prepare per first-touch row and each base64 JPG is ~2-3 MB,
// so the cost is paid only when the user explicitly asks for it.
//
// The flag is read at sync time by sync-client.ts (els.fetchImagingEnabled
// .checked) and passed through to the background orchestrator as part
// of the startNhiApiSync payload.
import { els } from "./els.js";

export async function loadFetchImagingEnabled() {
  const { fetchImagingEnabled } = await chrome.storage.local.get("fetchImagingEnabled");
  if (els.fetchImagingEnabled) {
    els.fetchImagingEnabled.checked = fetchImagingEnabled === true;
  }
}

export async function onFetchImagingToggle() {
  await chrome.storage.local.set({
    fetchImagingEnabled: els.fetchImagingEnabled.checked === true,
  });
}
