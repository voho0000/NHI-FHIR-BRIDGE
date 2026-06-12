// Service worker entry for NHI-FHIR Bridge — owns the long-running
// "Sync This Patient" workflow so the popup can close mid-sync without
// aborting it.
//
// Lifecycle:
//   - popup posts {type: "startNhiApiSync", payload}  → NHI JSON-API sync
//   - background runs the full sync sequence, updating chrome.storage.local
//   - popup reads chrome.storage.local on reopen to show progress
//
// This file is just the SW wiring: the onMessage router, the install/
// startup migrations, and the keepalive + PHI-sweep alarms. The actual
// work lives in ./background/*.js — esbuild inlines every transitively
// imported module into the single dist/background.js bundle. Keeping the
// entry point at src/background.js (not src/background/index.js) means
// manifest.json + build.mjs need no change.

import { checkNhiLoginState } from "./background/auth.js";
import { deletePartialPatientData } from "./background/backend-upload.js";
import { clearResultBadge, restoreResultBadge } from "./background/badge.js";
import {
  CANCEL_ERROR,
  IMAGING_PREP_POLL_ALARM,
  PENDING_BUNDLE_SWEEP_ALARM,
  SESSION_EXPIRED_ERROR,
  STORAGE_KEY,
} from "./background/constants.js";
import { pollPrepCount, stopPrepPolling } from "./background/imaging-prep-poll.js";
import {
  migrateSyncToLocal,
  purgeBearerToken,
  sweepPendingBundleIfStale,
  sweepStaleBearerToken,
  sweepStaleLocalKeys,
} from "./background/storage-migration.js";
import { runNhiApiSync } from "./background/sync-orchestrator.js";
import {
  getActiveImagingTabId,
  getActiveSyncCtx,
  requestCancel,
  setActiveImagingTabId,
  setActiveSyncCtx,
  setStatus,
} from "./background/sync-state.js";

chrome.runtime.onInstalled.addListener(async () => {
  await migrateSyncToLocal();
  // Security audit #5 cleanup: sweep PHI dead-weight keys left in
  // chrome.storage.local by extension versions <= v0.8.7.
  await sweepStaleLocalKeys();
  // Audit P0-4/P1-6 (2026-06-12): an update may have orphaned the
  // bundle JSON, and a stale NHI bearer token may sit on disk.
  await sweepPendingBundleIfStale();
  await sweepStaleBearerToken();
});

// Also run migration on service-worker wake-up (covers reload/restart
// paths where onInstalled doesn't fire).
chrome.runtime.onStartup?.addListener?.(() => {
  migrateSyncToLocal();
  // Re-apply an unseen-result badge that a browser restart would
  // otherwise drop (the MV3 worker starts with no in-memory state).
  restoreResultBadge();
});
migrateSyncToLocal();
// Top-level too — covers SW reloads where onStartup doesn't fire (mirrors
// the migrateSyncToLocal() belt-and-suspenders call above).
restoreResultBadge();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // Security audit #6: only accept messages originating from THIS
  // extension. sender.id is populated for chrome.runtime.sendMessage
  // calls; an unrelated extension calling chrome.runtime.sendMessage(
  // myExtId, …) would have its own id and be dropped silently. Without
  // this check, any other extension the user installs could trigger a
  // sync at an attacker-chosen backend URL with attacker-supplied API
  // key, fanning out the NHI tab's PHI through our pipeline.
  // (msg.sender.id is undefined for native-app messages — we don't use
  // those, so we treat undefined as foreign and reject.)
  if (sender?.id !== chrome.runtime.id) return;
  if (msg?.type === "startNhiApiSync") {
    runNhiApiSync(msg.payload).then(
      () => {
        try {
          sendResponse({ ok: true });
        } catch {}
      },
      async (e) => {
        if (e?.message === CANCEL_ERROR) {
          try {
            sendResponse({ ok: true, cancelled: true });
          } catch {}
          return;
        }
        if (e?.message === SESSION_EXPIRED_ERROR) {
          // Audit P1-6: NHI just told us the session is dead — the saved
          // bearer snapshot is useless; don't leave it on disk.
          await purgeBearerToken();
          await chrome.storage.local.set({
            syncStatus: {
              running: false,
              progress:
                "🔒 健保存摺登入逾時 — 請回到健保存摺分頁重新登入，然後再按「取得健保存摺資料」",
              phase: "session_expired",
              ts: Date.now(),
              completed: Date.now(),
            },
          });
          try {
            sendResponse({ ok: false, expired: true });
          } catch {}
          return;
        }
        console.error("runNhiApiSync failed", e);
        await setStatus({ running: false, progress: `❌ ${e.message}`, phase: "error" });
        try {
          sendResponse({ ok: false, error: e.message });
        } catch {}
      },
    );
    return true;
  }
  if (msg?.type === "stopSync") {
    // Set the cancellation flag; the in-flight sync will throw
    // CANCEL_ERROR at its next isCancelled() check. Storage is already
    // updated by the popup, so we don't touch it here.
    requestCancel();
    // v0.15+: the imaging trigger runs in a hidden tab via a fire-
    // and-forget promise that doesn't observe the cancel flag mid-
    // script. Close the registered hidden tab here so the in-flight
    // chrome.scripting.executeScript throws → the trigger promise
    // unwinds → the orchestrator's await resolves to []. Without this,
    // cancelling during the imaging phase would still leave the
    // hidden tab open + clicking through Vue, which user observed.
    const imagingTabId = getActiveImagingTabId();
    if (imagingTabId != null) {
      chrome.tabs.remove(imagingTabId).catch(() => {});
      setActiveImagingTabId(null);
    }
    // Discard any partial data uploaded so far. The user's stated
    // contract is 'stop = abort, I'll resync from scratch later' — we
    // don't want to leave a half-loaded patient in the FHIR store that
    // looks complete to downstream SMART apps.
    const ctx = getActiveSyncCtx();
    if (ctx?.patientId && ctx.backend) {
      (async () => {
        try {
          await deletePartialPatientData(ctx.backend, ctx.syncApiKey, ctx.patientId);
          // Surface the wipe in the status so user sees it actually happened.
          const prev = (await chrome.storage.local.get(STORAGE_KEY))[STORAGE_KEY] || {};
          await chrome.storage.local.set({
            [STORAGE_KEY]: {
              ...prev,
              running: false,
              progress: "⛔ 已停止並清除部分資料 — 請重新取得",
              phase: "cancelled",
              ts: Date.now(),
              completed: Date.now(),
            },
          });
        } catch (e) {
          console.warn("[NHI sync] cancel wipe failed:", e);
        }
      })();
    }
    setActiveSyncCtx(null);
    // v0.16.0: stop the imaging prep poll banner too — the cancelled
    // sync invalidates whatever the poller was tracking.
    stopPrepPolling().catch(() => {});
    try {
      sendResponse({ ok: true });
    } catch {}
    return true;
  }
  if (msg?.type === "dismissPrepBanner") {
    // v0.16.0: user clicked the X on the popup's "still preparing N"
    // banner. Stop polling + wipe state so the banner stays hidden
    // until the next sync triggers a fresh poll.
    stopPrepPolling()
      .then(() => {
        try {
          sendResponse({ ok: true });
        } catch {}
      })
      .catch(() => {
        try {
          sendResponse({ ok: false });
        } catch {}
      });
    return true;
  }
  if (msg?.type === "getSyncStatus") {
    chrome.storage.local.get(STORAGE_KEY).then((data) => sendResponse(data[STORAGE_KEY] || null));
    return true; // async response
  }
  if (msg?.type === "clearSyncStatus") {
    chrome.storage.local
      .remove(STORAGE_KEY)
      .then(() => sendResponse({ ok: true }))
      .catch(() => sendResponse({ ok: false }));
    return true;
  }
  if (msg?.type === "markSyncSeen") {
    // Popup was opened — the user has "seen" any completed result, so
    // drop the toolbar badge + its persisted flag.
    clearResultBadge().then(() => {
      try {
        sendResponse({ ok: true });
      } catch {}
    });
    return true;
  }
  if (msg?.type === "checkNhiLogin") {
    checkNhiLoginState(msg.tabId).then(
      (state) => {
        try {
          sendResponse({ loggedIn: state });
        } catch {}
      },
      () => {
        try {
          sendResponse({ loggedIn: null });
        } catch {}
      },
    );
    return true;
  }
});

// Belt-and-suspenders SW keepalive: an alarm every 20 s wakes the SW if
// idle. Combined with the return-true pattern above, this prevents the
// 30 s idle shutdown from ending an in-progress sync.
chrome.alarms.create("sw-keepalive", { periodInMinutes: 0.34 });

// PHI TTL sweep (security audit #5): drop the pending FHIR bundle once it
// exceeds PENDING_BUNDLE_TTL_MS so a sync left unconsumed for hours
// doesn't keep an in-memory PHI copy around.
chrome.alarms.create(PENDING_BUNDLE_SWEEP_ALARM, { periodInMinutes: 10 });

// Async listener — Chrome 116+ keeps the SW alive for the duration of
// a returned promise from chrome.alarms.onAlarm.
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === PENDING_BUNDLE_SWEEP_ALARM) {
    await sweepPendingBundleIfStale().catch(() => {});
    // Audit P1-6: the NHI bearer token must not outlive its 30-min TTL.
    await sweepStaleBearerToken().catch(() => {});
  }
  if (alarm.name === IMAGING_PREP_POLL_ALARM) {
    await pollPrepCount().catch((e) => {
      console.warn("[imaging-prep-poll] cycle failed:", e);
    });
  }
  // sw-keepalive is a no-op; the alarm firing is what keeps the SW alive.
});
