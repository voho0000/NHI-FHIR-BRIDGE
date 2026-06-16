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
import { ICON_ALERT, ICON_CHECK, ICON_CLOCK, ICON_INFO, ICON_LOCK } from "./icons.js";
import { apiSyncNhi } from "./sync-client.js";

const IMAGING_PREP_STATE_KEY = "imagingPrepState";

type ImagingPrepStatus = "polling" | "ready" | "unavailable" | "timeout" | "session-expired";

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
  const icon = els.prepIcon as HTMLElement;
  const title = els.prepTitle as HTMLElement;
  const progress = els.prepProgress as HTMLElement;
  const cta = els.prepCtaBtn as HTMLButtonElement;
  // Client-side enforcement of the 30-min cap. The SW poll's own timeout only
  // fires while chrome.alarms keeps ticking — but the alarm can stop (SW
  // evicted without wake / laptop sleep / extension reload), freezing a
  // "polling" state whose elapsed time then climbs forever ("已等候 139 分
  // 鐘"). Re-derive the status here so the banner never claims it's still
  // preparing past the deadline, regardless of whether the alarm fired.
  const IMAGING_PREP_MAX_MS = 30 * 60 * 1000;
  const overdue = Date.now() - state.startedAt >= IMAGING_PREP_MAX_MS;
  const status: ImagingPrepStatus =
    state.status === "polling" && overdue ? "timeout" : state.status;
  banner.dataset.state = status;
  if (status === "ready") {
    icon.innerHTML = ICON_CHECK;
    title.textContent = "影像已備齊";
    progress.textContent = `健康存摺已準備好 ${state.initialCount} 張影像，按下方按鈕取得最新資料。`;
    cta.hidden = false;
  } else if (status === "unavailable") {
    // Reached only when NONE of the triggered images became fetchable
    // (gotNewBytes=false) — rows stuck at "A" (phantoms) or resolved to "2"
    // (no image). Show initialCount (how many we waited on), NOT state.count
    // (= preparing+stuck), which is 0 in the "2" case → the nonsensical
    // "有 0 張無法備齊". Re-syncing won't help, so no CTA.
    icon.innerHTML = ICON_INFO;
    title.textContent = "部分影像健康存摺無法提供";
    progress.textContent = `有 ${state.initialCount} 張影像健康存摺目前無法備齊（常見於較舊的檢查），這些項目只會有文字報告，其餘資料已可下載。`;
    cta.hidden = true;
  } else if (status === "timeout") {
    // Past the 30-min cap (alarm-fired OR client-side override above). The
    // count can be stale/0 when the override fires, so fall back to
    // initialCount. CTA lets the user retry once in case NHI caught up.
    icon.innerHTML = ICON_ALERT;
    title.textContent = "等候逾時（已超過 30 分鐘）";
    progress.textContent = `仍有 ${state.count || state.initialCount} 張影像尚未備齊，健康存摺可能無法提供。可按下方按鈕再試一次，或關閉此提示（文字報告已可下載）。`;
    cta.hidden = false;
  } else if (status === "session-expired") {
    // The poll's stashed token expired — re-logging into 健康存摺 refreshes the
    // NHI tab but NOT this stashed token, so the banner can't clear itself.
    // A fresh sync re-stashes a token and clears this state. Surface the CTA
    // so the user has a one-click recovery right here (after re-login).
    icon.innerHTML = ICON_LOCK;
    title.textContent = "健康存摺登入逾時";
    progress.textContent = "請先回到健康存摺分頁重新登入，再按下方按鈕即可繼續取得。";
    cta.hidden = false;
  } else {
    // polling
    icon.innerHTML = ICON_CLOCK;
    title.textContent = "健康存摺準備中";
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
