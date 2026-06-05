// Background "still preparing" count poller (v0.16.0).
//
// Purpose: after a sync ends with triggered-waiting rows, give the
// user a live progress indicator without forcing them to re-sync to
// check. Polls NHI's IHKE3408S01 list endpoint every minute, counts
// rows whose jpG_STATUS is still "0", writes the count to
// chrome.storage.local. Popup banner reads it and updates in real
// time via chrome.storage.onChanged.
//
// What this MODULE EXPLICITLY DOES NOT DO (lessons from the deleted
// v0.14.x bg poll):
//   1. Does NOT fetch JPG bytes.
//   2. Does NOT modify pendingFhirBundle. The downloaded bundle stays
//      whatever the user-driven sync produced. User must re-sync to
//      pull newly-ready bytes in.
//   3. Does NOT survive past 30 min (bearer TTL ceiling).
//   4. Does NOT resume across browser restarts beyond the 30-min cap.
//
// Stop conditions (any one):
//   - count reaches 0 (everything prepped)
//   - 30 min elapsed since start (bearer ceiling)
//   - 401/403 on poll (session expired)
//   - sync orchestrator starts a new sync (calls stopPrepPolling)
//   - user dismisses popup banner (sends dismissPrepBanner message)

import {
  IMAGING_PREP_BASE_KEY,
  IMAGING_PREP_MAX_MS,
  IMAGING_PREP_POLL_ALARM,
  IMAGING_PREP_POLL_INTERVAL_MIN,
  IMAGING_PREP_STATE_KEY,
  NHI_BEARER_TOKEN_KEY,
  NHI_BEARER_TOKEN_TTL_MS,
} from "./constants.js";

export type ImagingPrepStatus = "polling" | "ready" | "timeout" | "session-expired";

export interface ImagingPrepState {
  patientId: string;
  startedAt: number; // epoch ms when polling started
  initialCount: number; // waiting count at sync end (for progress display)
  count: number; // last polled status=0 count
  lastPolledAt: number; // epoch ms of last successful poll (0 = never)
  pollAttempts: number; // # poll cycles executed
  status: ImagingPrepStatus;
  /** Last error string if a poll cycle failed (non-fatal — keeps polling). */
  error?: string;
}

/**
 * Begin polling for this patient. Called by sync-orchestrator at
 * end of sync when waitingCount > 0. No-op when initialCount <= 0.
 *
 * Idempotent: re-registers the alarm + overwrites state. Safe to
 * call again after a stopPrepPolling.
 */
export async function startPrepPolling(
  patientId: string,
  initialCount: number,
  baseUrl: string,
): Promise<void> {
  if (!patientId || initialCount <= 0) return;
  const now = Date.now();
  const state: ImagingPrepState = {
    patientId,
    startedAt: now,
    initialCount,
    count: initialCount,
    lastPolledAt: 0,
    pollAttempts: 0,
    status: "polling",
  };
  await chrome.storage.local.set({
    [IMAGING_PREP_STATE_KEY]: state,
    [IMAGING_PREP_BASE_KEY]: baseUrl,
  });
  // periodInMinutes triggers every N minutes; delayInMinutes is the
  // delay before the FIRST fire. Setting both to 1 = first poll
  // at ~1 min after sync end, then every minute.
  chrome.alarms.create(IMAGING_PREP_POLL_ALARM, {
    periodInMinutes: IMAGING_PREP_POLL_INTERVAL_MIN,
    delayInMinutes: IMAGING_PREP_POLL_INTERVAL_MIN,
  });
}

/**
 * Stop polling and (by default) wipe the state — used by:
 *   - the alarm itself when it detects a stop condition
 *   - sync orchestrator at sync start (new sync supersedes)
 *   - background.ts on stopSync message
 *   - popup on dismissPrepBanner message
 *
 * `keepState: true` clears the alarm but leaves the state so the
 * popup can still render the final status (e.g. "session expired").
 */
export async function stopPrepPolling(opts?: {
  keepState?: boolean;
}): Promise<void> {
  await chrome.alarms.clear(IMAGING_PREP_POLL_ALARM).catch(() => {});
  if (!opts?.keepState) {
    await chrome.storage.local
      .remove([IMAGING_PREP_STATE_KEY, IMAGING_PREP_BASE_KEY])
      .catch(() => {});
  }
}

async function _loadBearerToken(patientId: string): Promise<string | null> {
  const obj = await chrome.storage.local.get(NHI_BEARER_TOKEN_KEY);
  const stash = obj[NHI_BEARER_TOKEN_KEY] as
    | { token: string; patientId: string; savedAt: number }
    | undefined;
  if (!stash) return null;
  if (stash.patientId !== patientId) return null;
  if (Date.now() - stash.savedAt > NHI_BEARER_TOKEN_TTL_MS) return null;
  return stash.token || null;
}

async function _writeState(state: ImagingPrepState): Promise<void> {
  await chrome.storage.local.set({ [IMAGING_PREP_STATE_KEY]: state });
}

/**
 * Single poll cycle — called from the chrome.alarms.onAlarm listener
 * in background.ts. Counts status=0 rows in the current IHKE3408S01
 * list and updates state. Self-stops on terminal conditions.
 */
export async function pollPrepCount(): Promise<void> {
  const stored = await chrome.storage.local.get([IMAGING_PREP_STATE_KEY, IMAGING_PREP_BASE_KEY]);
  const state = stored[IMAGING_PREP_STATE_KEY] as ImagingPrepState | undefined;
  const baseUrl = stored[IMAGING_PREP_BASE_KEY] as string | undefined;
  if (!state || !baseUrl) {
    // Stale alarm leftover from a previous session — clear it.
    await stopPrepPolling();
    return;
  }
  // Hard cap — bearer TTL is 30 min, so polling past that point
  // would fail on auth anyway. Surfacing "timeout" lets the popup
  // tell the user to re-login if they still need updates.
  if (Date.now() - state.startedAt >= IMAGING_PREP_MAX_MS) {
    await _writeState({ ...state, status: "timeout" });
    await chrome.alarms.clear(IMAGING_PREP_POLL_ALARM).catch(() => {});
    return;
  }
  const token = await _loadBearerToken(state.patientId);
  if (!token) {
    await _writeState({ ...state, status: "session-expired" });
    await chrome.alarms.clear(IMAGING_PREP_POLL_ALARM).catch(() => {});
    return;
  }
  // Cache-bust forces NHI's CDN to revalidate so we see fresh
  // jpG_STATUS values. Without it the list can lag by minutes.
  const url = `${baseUrl}/api/ihke3000/ihke3408s01/page_load?s_type=&s_sort=A1&_=${Date.now()}`;
  let nextCount = state.count;
  try {
    const r = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    if (r.status === 401 || r.status === 403) {
      await _writeState({ ...state, status: "session-expired" });
      await chrome.alarms.clear(IMAGING_PREP_POLL_ALARM).catch(() => {});
      return;
    }
    if (!r.ok) {
      // Non-auth HTTP error — retry next tick. Stash the error so
      // popup can decide whether to surface it.
      await _writeState({
        ...state,
        pollAttempts: state.pollAttempts + 1,
        lastPolledAt: Date.now(),
        error: `HTTP ${r.status}`,
      });
      return;
    }
    const body = await r.json();
    const list = (body && (body.sp_IHKE3408S01_data as unknown[])) || [];
    let c = 0;
    for (const row of list) {
      const status = String((row as any)?.jpG_STATUS ?? (row as any)?.jpg_STATUS ?? "");
      if (status === "0") c++;
    }
    nextCount = c;
  } catch (e: any) {
    await _writeState({
      ...state,
      pollAttempts: state.pollAttempts + 1,
      lastPolledAt: Date.now(),
      error: String(e?.message || e),
    });
    return;
  }
  const isReady = nextCount === 0;
  await _writeState({
    ...state,
    count: nextCount,
    pollAttempts: state.pollAttempts + 1,
    lastPolledAt: Date.now(),
    status: isReady ? "ready" : "polling",
    error: undefined,
  });
  if (isReady) {
    await chrome.alarms.clear(IMAGING_PREP_POLL_ALARM).catch(() => {});
  }
}
