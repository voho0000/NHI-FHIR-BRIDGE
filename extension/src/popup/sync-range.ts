// Step 2「日期範圍」(<select id="api-sync-range">) persistence. Without this
// the select reset to its HTML default (`selected="3"` → 最近 3 年) every time
// the popup was reopened, silently discarding the user's choice. Mirrors the
// imaging-toggle.ts load/onChange pattern: restore on popup open, persist on
// change, under chrome.storage.local["syncRange"].
//
// sync-client.ts reads els.apiSyncRange.value at sync time, so once the value
// is restored here the correct range flows through unchanged.
import { els } from "./els.js";

export async function loadSyncRange() {
  const { syncRange } = await chrome.storage.local.get("syncRange");
  const sel = els.apiSyncRange;
  if (!sel || typeof syncRange !== "string" || !syncRange) return;
  // Only assign when the stored value is still one of the rendered options —
  // assigning an unknown value to a <select> blanks it in some browsers.
  if ([...sel.options].some((o) => o.value === syncRange)) {
    sel.value = syncRange;
  }
}

export async function onSyncRangeChange() {
  const v = els.apiSyncRange?.value;
  if (v) await chrome.storage.local.set({ syncRange: v });
}
