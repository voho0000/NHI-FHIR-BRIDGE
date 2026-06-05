// Popup-side imaging prep banner (v0.16.0).
//
// Reads chrome.storage.local["imagingPrepState"] written by the SW
// poller in extension/src/background/imaging-prep-poll.ts and renders
// a live progress banner. Updates immediately on storage changes so
// the user sees the count drop each minute without re-opening popup.
//
// Three user controls:
//   - X close button → sends `dismissPrepBanner` to SW (stops poll +
//     wipes state); banner hides via storage.onChanged.
//   - "立即取得健康存摺資料" CTA (only shown when count=0) → invokes
//     the existing main sync flow via the sync-client module.
//   - (implicit) starting a new sync via the main button → SW
//     orchestrator clears prep state at sync start → banner hides.

import { els } from "./els.js";
import { apiSyncNhi } from "./sync-client.js";

const IMAGING_PREP_STATE_KEY = "imagingPrepState";

type ImagingPrepStatus = "polling" | "ready" | "timeout" | "session-expired";

interface ImagingPrepState {
  patientId: string;
  startedAt: number;
  initialCount: number;
  count: number;
  lastPolledAt: number;
  pollAttempts: number;
  status: ImagingPrepStatus;
  error?: string;
}

function _elapsedText(state: ImagingPrepState): string {
  const ms = Date.now() - state.startedAt;
  const minutes = Math.max(0, Math.floor(ms / 60_000));
  if (minutes < 1) return "剛開始";
  if (minutes === 1) return "已等候 1 分鐘";
  return `已等候 ${minutes} 分鐘`;
}

function _render(state: ImagingPrepState | null): void {
  const banner = els.prepBanner as HTMLElement | null;
  if (!banner) return;
  if (!state) {
    banner.hidden = true;
    return;
  }
  banner.hidden = false;
  banner.dataset.state = state.status;
  const title = els.prepTitle as HTMLElement;
  const progress = els.prepProgress as HTMLElement;
  const cta = els.prepCtaBtn as HTMLButtonElement;
  if (state.status === "ready") {
    title.textContent = "✅ 影像已備齊";
    progress.textContent = `健保署已準備好 ${state.initialCount} 張影像，按下方按鈕取得最新資料。`;
    cta.hidden = false;
  } else if (state.status === "timeout") {
    title.textContent = "⏱ 等候逾時（已過 30 分鐘）";
    progress.textContent = `仍有 ${state.count} 張影像未準備完成；可關閉此提示，稍後手動再按「取得健康存摺資料」。`;
    cta.hidden = true;
  } else if (state.status === "session-expired") {
    title.textContent = "🔒 健保存摺登入逾時";
    progress.textContent = "請回到健保存摺分頁重新登入後，再按「取得健康存摺資料」即可繼續。";
    cta.hidden = true;
  } else {
    // polling
    title.textContent = "🖼️ 健保署準備中";
    progress.textContent = `剩 ${state.count} / ${state.initialCount} 張 · ${_elapsedText(state)}`;
    cta.hidden = true;
  }
}

async function _loadInitial(): Promise<void> {
  try {
    const obj = await chrome.storage.local.get(IMAGING_PREP_STATE_KEY);
    const state = (obj[IMAGING_PREP_STATE_KEY] as ImagingPrepState) || null;
    _render(state);
  } catch (e) {
    console.warn("[imaging-prep-banner] initial load failed:", e);
  }
}

export function initImagingPrepBanner(): void {
  if (!els.prepBanner) return; // popup view without banner element
  // Hidden by default; storage load + onChanged listener drive it.
  _loadInitial();

  // Re-render whenever SW updates the state. Storage events on
  // chrome.storage.local fire across all extension contexts including
  // this popup, so we don't need a polling loop here — the SW poll
  // every minute writes new state, banner picks it up.
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (!(IMAGING_PREP_STATE_KEY in changes)) return;
    const newVal =
      (changes[IMAGING_PREP_STATE_KEY]?.newValue as ImagingPrepState | undefined) || null;
    _render(newVal);
  });

  // X close → SW stops poll + wipes state, banner hides via the
  // onChanged listener above.
  (els.prepCloseBtn as HTMLButtonElement)?.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "dismissPrepBanner" }).catch(() => {
      // Belt + suspenders: if SW didn't respond, hide the banner
      // locally too so the click feels responsive. Storage state
      // will be cleared on next SW restart anyway.
      _render(null);
    });
  });

  // "立即取得" CTA → run the standard sync. Reuses the same path the
  // main 取得 button calls, including any pre-flight checks.
  (els.prepCtaBtn as HTMLButtonElement)?.addEventListener("click", () => {
    apiSyncNhi();
  });
}
