// ── Toolbar-icon result dot ───────────────────────────────────────────
//
// When a sync finishes with data, overlay a small red dot on the top-right
// corner of the action icon so a user who closed the popup still sees that
// fresh records are waiting (like a phone-app notification dot). Cleared
// when the popup is next opened (the popup sends `markSyncSeen` → index
// handler calls clearResultBadge).
//
// We composite the dot onto the existing icon at runtime with OffscreenCanvas
// (available in the MV3 worker) and swap it in via chrome.action.setIcon —
// no extra PNG assets to ship. The icon swap is browser-side UI: it survives
// the worker unloading on its own, but NOT a full browser restart, so we
// persist a boolean `unseenSyncResult` and re-apply on SW spin-up
// (restoreResultBadge). The dot then lasts until the user opens the popup,
// even across restarts.

const UNSEEN_KEY = "unseenSyncResult";
const ICON_SIZES = [16, 32, 48];
const DOT_COLOR = "#d70015"; // iOS-ish notification red
const RING_COLOR = "#ffffff"; // thin outline so the dot reads on any icon
const PLAIN_ICON_PATH = {
  16: "icons/icon-16.png",
  32: "icons/icon-32.png",
  48: "icons/icon-48.png",
};

// Draw the base icon at `size`, then a red dot (white-ringed) in the
// top-right corner. Returns ImageData for chrome.action.setIcon.
async function _buildDottedIcon(size) {
  const url = chrome.runtime.getURL(`icons/icon-${size}.png`);
  const blob = await (await fetch(url)).blob();
  const bmp = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bmp, 0, 0, size, size);

  const r = Math.max(3, Math.round(size * 0.17)); // outer (ring) radius
  const ring = Math.max(1, Math.round(size * 0.05)); // ring thickness
  const cx = size - r;
  const cy = r;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.fillStyle = RING_COLOR;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, r - ring, 0, 2 * Math.PI);
  ctx.fillStyle = DOT_COLOR;
  ctx.fill();

  return ctx.getImageData(0, 0, size, size);
}

async function _paintDot() {
  try {
    const imageData = {};
    for (const s of ICON_SIZES) imageData[s] = await _buildDottedIcon(s);
    await chrome.action.setIcon({ imageData });
  } catch {}
}

// Show the dot for a completed sync. count<=0 (sync finished but fetched
// nothing) intentionally shows NO dot. Persists a flag so a browser
// restart re-applies the dot.
export async function showResultBadge(count) {
  const n = Number(count) || 0;
  if (n <= 0) {
    await clearResultBadge();
    return;
  }
  await chrome.storage.local.set({ [UNSEEN_KEY]: true }).catch(() => {});
  await _paintDot();
}

// Restore the plain icon + clear the flag. Called when the popup is opened
// (user has "seen" the result) and at the start of a fresh sync so a stale
// dot doesn't linger over a new run.
export async function clearResultBadge() {
  try {
    await chrome.action.setIcon({ path: PLAIN_ICON_PATH });
  } catch {}
  await chrome.storage.local.remove(UNSEEN_KEY).catch(() => {});
}

// Re-apply the dot on SW spin-up so an unseen result survives a browser
// restart (the MV3 worker starts with no in-memory state). No-op when
// nothing is pending.
export async function restoreResultBadge() {
  try {
    const { [UNSEEN_KEY]: unseen } = await chrome.storage.local.get(UNSEEN_KEY);
    if (unseen) await _paintDot();
  } catch {}
}
