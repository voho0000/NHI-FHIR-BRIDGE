// IHKE3408 imaging JPEG state machine — two-phase implementation:
//
//   1. `triggerImagingRows()`  — visible Vue-click flow per row. Tab
//      navigates list → detail → 載入影像檔 → 載入影像 → back.
//      Must run sequentially, must NOT be parallel with any other
//      executeScript on the same tab (Chrome's "Frame with ID 0 was
//      removed" error kills siblings when the frame URL changes).
//
//   2. `pollFetchImagingJpegs()` — silent HTTP fetch loop. Polls
//      IHKE3408S03 (no navigation), parallel-safe with everything else.
//
// The orchestrator runs (1) up-front and serial, then kicks off (2)
// non-awaited while the other detail fan-outs run. This is the inverse
// of v0.14.0/v0.14.1 ordering: putting imaging FIRST means the user
// sees "image trigger 1/3 …" within seconds rather than after a full
// minute of other detail traffic, which makes dev iteration fast.
//
// Survey-verified protocol (live capture 2026-06-05 — Chrome MCP
// driven; fetch + XHR prototype hooks on a fresh-case patient's
// NHI tab; verified on two distinct A×E rows with the SW-style
// fetch-only path, no Vue click):
//
//   Trigger (3 steps in the SAME session):
//     1. GET  /api/ihke3000/IHKE3408S02/page_load?crid=<rid>&ctype=<ctype>
//          → reads detail body → response[ihke3408S02_main_data][0]
//            carries `rownum` field, a per-row sentinel like "-7"
//            (DIFFERENT FOR EACH ROW — it is NOT "-3" universally).
//     2. POST /api/ihke3000/IHKE3408S02/add
//          body { "ipl_CASE_SEQ_NO": "<rownum from step 1>" }
//          → response { status: "Y", message: "已申請載入影像檔。" }
//          on accept; { status: "Y", message: "申請載入影像檔時發生
//          錯誤。" } on row-not-found-by-rownum reject.
//          NOTE: `status:"Y"` is a constant in NHI's contract, NOT a
//          success indicator. Check `message` instead, OR (better)
//          run step 3 below.
//     3. (verification) GET S02 page_load again → row's jpg_STATUS
//          should flip "A" → "0" (preparing).
//
//   The earlier Part B sniff (2026-06-03) captured a single row whose
//   rownum happened to be "-3" — which we mistakenly hardcoded as a
//   universal sentinel. NHI's add handler matches the body's
//   ipl_CASE_SEQ_NO against the rownum of the row established by
//   step 1's GET; mismatched rownum → "錯誤" reject. Once we read
//   rownum from the GET response and feed it back in step 2, the
//   SW path triggers reliably without any tab / DOM / Vue dependency.
//
//   Fetch: GET IHKE3408S03 page_load?IPL_CASE_SEQ_NO=<seq>
//     → response { pics: [<base64 JPG>, …] } (multi-frame for CT/US).
//
// Two trigger implementations exist in this module:
//   - triggerImagingRowsViaSwFetch  (v0.15+, default) — SW-direct
//     fetch using the protocol above. No tab, no Vue, no DOM.
//   - triggerImagingRowsViaHiddenTab + triggerImagingRows — legacy
//     Vue-click flow in a hidden tab. Kept as dead code for emergency
//     rollback; remove after a few release cycles of verified SW-fetch
//     stability.

import {
  CANCEL_ERROR,
  NHI_BEARER_TOKEN_KEY,
  NHI_BEARER_TOKEN_TTL_MS,
  PENDING_IMAGING_KEY_PREFIX,
  PENDING_IMAGING_TTL_MS,
  SESSION_EXPIRED_ERROR,
} from "./constants.js";
import { shouldEvictPendingRow } from "./imaging-list-status.js";
import { isCancelled, setActiveImagingTabId } from "./sync-state.js";

const POLL_INTERVAL_MS = 15_000;
// 90s poll budget. v0.15+: SW background polling auto-fills the bundle
// after sync end, so this in-sync poll just needs to catch the fast
// cases (NHI prep < 90s). Slower ones → triggered-waiting → background
// alarm handles them via sweep.
const TIMEOUT_MS = 90_000;
// 15s initial wait — give NHI a brief head start, but 90s total budget
// would leave only 30s polling if we kept the old 60s wait. Reduced
// proportionally.
const INITIAL_WAIT_MS = 15_000;

/**
 * Per-sync trigger cap. Staged rollout for the SW-direct trigger flow
 * (Part B → production):
 *   1 → smoke test (single trigger, verify GET→POST→GET cycle works,
 *        check breakdown for trigger-confirmed vs direct-api-silent-fail)
 *   3 → confirm sequence-of-calls works (server-side row state isn't
 *        leaking between rows)
 *   Infinity → full production: every needsTrigger row attempted; the
 *        SW_TRIGGER_LOOP_WALL_CLOCK_MS cap (90s) inside the loop is the
 *        actual upper bound
 *
 * Tracked as a constant so the tester can temporarily flip it without
 * restructuring loop logic. The Vue-click legacy paths share this
 * constant.
 */
const MAX_TRIGGER_PER_SYNC_DEV = Number.POSITIVE_INFINITY;

export interface ImagingJpegRequest {
  rid: string; // crid from list — used to find row's 詳細資料 button
  ctype: string; // A / B / C / D / E — same, narrative match key
  iplCaseSeqNo: string; // NHI case identifier — used for /S03 fetch
  needsTrigger: boolean; // true when jpG_STATUS != "1" (i.e. "2")
  /**
   * The row's index in the IHKE3408S01 list endpoint response.
   * NHI renders one 詳細資料 button per row in document order so
   * `document.querySelectorAll('a[title="詳細資料"]')[listIdx]` is
   * this row's button. We compute this in the SW (from the raw
   * list endpoint result) and pass it through so the in-tab script
   * doesn't have to introspect Vue component state — that proved
   * fragile (the list-page Vue component's data shape doesn't
   * match the detail-page's, so heuristic walks would miss).
   */
  listIdx: number;
}

export interface ImagingJpegResult {
  rid: string;
  ctype: string;
  iplCaseSeqNo: string | null;
  /**
   * IHKE3408S03's pics[] array — every multi-frame study (CT, US) ships
   * one base64 entry per frame; X-rays / single-shot exams ship 1.
   */
  jpgBase64s: string[];
  /**
   * - "ready" = list said status=1, JPGs fetched without trigger
   * - "triggered-ready" = status=A, trigger succeeded, JPGs fetched
   * - "trigger-failed" = Vue click flow couldn't trigger (or dev-cap-skipped)
   * - "triggered-waiting" = trigger sent successfully, but NHI's lazy prep
   *     hasn't produced a seqNo / base64 within TIMEOUT_MS. This is
   *     RECOVERABLE: NHI caches the trigger for ~7 days so the next sync
   *     will pick it up as status="1" and fetch immediately. The
   *     orchestrator persists these rows to chrome.storage.local so the
   *     next sweepPendingImaging() call catches them.
   * - "fetch-failed" = ready but IHKE3408S03 returned no base64 (NHI
   *     server-side glitch; not recoverable by retry, would need a
   *     re-trigger)
   * - "timeout" reserved for true edge cases (kept in type for forward
   *     compat — current paths route everything through one of the above)
   */
  outcome:
    | "ready"
    | "triggered-ready"
    | "trigger-failed"
    | "triggered-waiting"
    | "timeout"
    | "fetch-failed";
  error?: string;
}

interface TriggerOutcome {
  rid: string;
  ctype: string;
  ok: boolean;
  reason?: string;
}

// ────────────────────────────────────────────────────────────────────
// PHASE 1: TRIGGER — visible Vue-click flow.
//
// Pre-conditions: the caller (sync-orchestrator) must navigate the tab
// to the IHKE3408S01 list page via chrome.tabs.update BEFORE calling
// this. We don't navigate from inside the script because that triggers
// "Frame with ID 0 was removed" — the chrome.scripting.executeScript
// can't survive top-level navigation it initiates.
// ────────────────────────────────────────────────────────────────────
export async function triggerImagingRows(
  tabId: number,
  requests: ImagingJpegRequest[],
): Promise<TriggerOutcome[]> {
  if (!Array.isArray(requests) || requests.length === 0) return [];

  // Pre-seed outcomes — ready rows pass through, needs-trigger rows
  // default to "not-attempted" and get overwritten by the script. Dev
  // cap is enforced INSIDE the script ("3 actual 載入影像 clicks"
  // semantics), so we pass the full triggerable list and let it
  // short-circuit when it's done.
  const triggerable = requests.filter((r) => r.needsTrigger);
  const outcomes: TriggerOutcome[] = requests.map((r) => ({
    rid: r.rid,
    ctype: r.ctype,
    ok: !r.needsTrigger,
    reason: r.needsTrigger ? "not-attempted" : undefined,
  }));

  if (triggerable.length === 0) return outcomes;

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: async (cappedReqs: any, devCap: number) => {
      const token = sessionStorage.getItem("token");
      if (!token) return { error: "SESSION_EXPIRED" };
      if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
        return { error: "SESSION_EXPIRED" };
      }
      if (!location.pathname.includes("IHKE3408S01")) {
        return { error: "WRONG_PAGE", url: location.pathname };
      }

      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

      // DOM-level wait: poll until the 詳細資料 buttons for the rows
      // we need are rendered. NHI's Vue list renders one button per
      // row in the same order as the list endpoint response — so the
      // SW-supplied listIdx maps directly to detailBtns[listIdx].
      // Vue introspection (looking for a component with `list` array)
      // proved unreliable: the list page's component shape differs
      // from the detail page's so heuristic walks miss.
      const maxNeededIdx = Math.max(...cappedReqs.map((r: any) => r.listIdx ?? -1), -1);
      const listReady = await (async () => {
        const deadline = Date.now() + 15_000;
        while (Date.now() < deadline) {
          const btnCount = document.querySelectorAll('a[title="詳細資料"]').length;
          if (btnCount > maxNeededIdx) return true;
          await sleep(200);
        }
        return false;
      })();
      if (!listReady) {
        return {
          error: "LIST_BTN_RENDER_TIMEOUT",
          maxNeededIdx,
          actualCount: document.querySelectorAll('a[title="詳細資料"]').length,
        };
      }

      async function poll<T>(
        fn: () => T | null | undefined,
        opts: { maxMs: number; intervalMs: number },
      ): Promise<T | null> {
        const deadline = Date.now() + opts.maxMs;
        while (Date.now() < deadline) {
          const v = fn();
          if (v) return v;
          await sleep(opts.intervalMs);
        }
        return null;
      }

      function findVueRoot(): any {
        const app = document.querySelector("#app") as any;
        return app?.__vue__ || null;
      }

      function findVueByMethod(methodName: string): any {
        const root = findVueRoot();
        if (!root) return null;
        let found: any = null;
        function walk(vm: any) {
          if (!vm || found) return;
          if (vm.$options?.methods?.[methodName]) {
            found = vm;
            return;
          }
          (vm.$children || []).forEach(walk);
        }
        walk(root);
        return found;
      }

      function findBtnByText(text: string): HTMLElement | null {
        const all = document.querySelectorAll("a, button");
        for (const el of all) {
          if ((el as HTMLElement).innerText?.trim() === text) {
            return el as HTMLElement;
          }
        }
        return null;
      }

      // ── trigger one row ───────────────────────────────────────────
      async function triggerOneRow(
        listIdx: number,
        rid: string,
        ctype: string,
      ): Promise<{ ok: boolean; reason?: string; newStatus?: string }> {
        const detailBtns = document.querySelectorAll<HTMLElement>('a[title="詳細資料"]');
        const detailBtn = detailBtns[listIdx];
        if (!detailBtn) {
          return {
            ok: false,
            reason: `detail-btn-not-at-idx-${listIdx}-of-${detailBtns.length}`,
          };
        }
        detailBtn.click();

        // Wait for the detail page's 載入影像檔 button. NHI renders
        // it only after Vue mounts the detail component AND the
        // page_load API returns. If the row's image is already
        // prepared, Vue shows "瀏覽影像內容" instead — that means
        // status="1" (cached) and shouldn't have been a trigger
        // candidate; skip with that reason. This is also more
        // reliable than poking at Vue internals (the detail
        // component's data shape varies and Vue mount timing is
        // race-prone).
        //
        // 8s wait: NHI's detail page typically mounts in 1-2s when
        // the row has an image. Rows that don't mount in 8s are
        // almost always going to time out at 15s too — and stuck-
        // retry pushes ~12-20 likely-failing rows through this each
        // sync. 15s × 20 = 5 min wasted; 8s × 20 = 2.6 min. Pair
        // with the loop-level wall-clock cap below for a hard upper
        // bound on the whole trigger phase.
        const loadBtn = await poll(
          () => {
            const lb = findBtnByText("載入影像檔");
            if (lb) return { kind: "load", el: lb };
            const bb = findBtnByText("瀏覽影像內容");
            if (bb) return { kind: "browse", el: bb };
            return null;
          },
          { maxMs: 8000, intervalMs: 200 },
        );
        if (!loadBtn) {
          try {
            history.back();
          } catch {}
          await sleep(800);
          return { ok: false, reason: "detail-mount-timeout" };
        }
        if (loadBtn.kind === "browse") {
          // Already cached at NHI — list should have shown status=1
          // for this row. Skip rather than try to re-trigger.
          try {
            history.back();
          } catch {}
          await sleep(500);
          return { ok: false, reason: "already-cached" };
        }
        loadBtn.el.click();

        // Find the Vue detail component for the openAGR state flag,
        // which the next confirmation step polls on.
        const detailComp = findVueByMethod("ok_add");

        const confirmBtn = await poll(() => findBtnByText("載入影像"), {
          maxMs: 3000,
          intervalMs: 100,
        });
        if (!confirmBtn) {
          try {
            history.back();
          } catch {}
          await sleep(800);
          return { ok: false, reason: "dialog-confirm-btn-not-found" };
        }
        confirmBtn.click();

        // Wait for openAGR=false (POST sent + dialog closed). If we
        // couldn't get the Vue component, fall back to waiting until
        // the confirm button is gone from DOM (signals dialog closed).
        if (detailComp) {
          await poll(() => detailComp.openAGR === false, { maxMs: 5000, intervalMs: 100 });
        } else {
          await poll(() => !findBtnByText("載入影像"), { maxMs: 5000, intervalMs: 100 });
        }

        // Close any "已申請載入影像檔" notification
        await sleep(500);
        const okBtn = findBtnByText("確認") || findBtnByText("確定");
        if (okBtn) okBtn.click();

        // Back to list
        try {
          history.back();
        } catch {}
        await poll(
          () =>
            location.pathname.includes("IHKE3408S01") &&
            document.querySelectorAll('a[title="詳細資料"]').length > 0,
          { maxMs: 5000, intervalMs: 100 },
        );
        await sleep(300);

        // ── POST-VERIFICATION (v0.15+, NHI status flip A → 0) ──────
        // The Vue click flow above can SILENT-FAIL: clicks succeed,
        // dialog closes, no exception — but NHI's backend doesn't
        // actually queue the prep. The only reliable signal that NHI
        // accepted the trigger is the row's jpg_STATUS flipping from
        // "A" (needs trigger) to "0" (preparing) in IHKE3408S02 detail.
        // User-verified 2026-06-04: manual click on a previously-stuck
        // row immediately moved status A → 0, confirming the flip
        // is fast enough to check synchronously.
        //
        // Status values found via live probe:
        //   "A" → needs trigger (our click silent-failed)
        //   "0" → preparing (trigger accepted, NHI processing)
        //   "1" → ready (cached, fetchable via S03)
        //   "2" → no image (narrative-only / archived)
        try {
          const verifyUrl = `${location.origin}/api/ihke3000/IHKE3408S02/page_load?crid=${encodeURIComponent(rid)}&ctype=${encodeURIComponent(ctype)}`;
          const r = await fetch(verifyUrl, {
            method: "GET",
            credentials: "same-origin",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
              "X-Requested-With": "XMLHttpRequest",
            },
          });
          if (r.ok) {
            const body = await r.json();
            const main = body?.ihke3408S02_main_data?.[0];
            const newStatus = String(main?.jpg_STATUS ?? "");
            if (newStatus === "0") {
              return { ok: true, reason: "trigger-confirmed", newStatus };
            }
            if (newStatus === "1") {
              // Race: NHI prep completed between trigger click + verify
              // fetch. Still count as success.
              return { ok: true, reason: "trigger-already-ready", newStatus };
            }
            if (newStatus === "A") {
              // Silent fail: Vue click didn't actually queue NHI prep.
              return { ok: false, reason: "nhi-silent-fail", newStatus };
            }
            // Other status (2, empty, etc.): unexpected. Surface
            // verbatim so we can see in the breakdown.
            return {
              ok: false,
              reason: `nhi-unexpected-status-${newStatus || "blank"}`,
              newStatus,
            };
          }
          // HTTP error on verify fetch — assume optimistic success.
          // Sweep will figure out true state next tick anyway.
          return {
            ok: true,
            reason: `verify-http-${r.status}`,
          };
        } catch (e: any) {
          // Verify fetch network error — assume optimistic success.
          return {
            ok: true,
            reason: `verify-error-${e?.message || "unknown"}`,
          };
        }
      }

      // Build a (listIdx → hasImageLabel) map BEFORE the trigger loop.
      // Strategy:
      //   1. Scan all DOM elements; pick the leaf nodes whose trimmed
      //      textContent is exactly "有影像檔" or "無影像檔". These are
      //      the per-row labels (NHI renders them in their own span).
      //   2. From each such leaf, walk UP until we find an ancestor
      //      that contains a 詳細資料 button — that's the row container.
      //   3. Use the button's index in detailBtns as the key.
      // The previous attempt walked UP from the button looking for any
      // ancestor containing "影像檔" + label — but the imaging list's
      // parent container has ALL rows' labels concatenated in its
      // innerText (a row container we'd want to find is nested too
      // deeply; the walk found list-level containers showing "無影像
      // 檔" because that label was present somewhere in the page).
      function buildImageLabelMap(): Map<number, boolean> {
        const detailBtns = Array.from(
          document.querySelectorAll<HTMLElement>('a[title="詳細資料"]'),
        );
        const btnToIndex = new Map<HTMLElement, number>();
        detailBtns.forEach((b, i) => btnToIndex.set(b, i));
        const result = new Map<number, boolean>();
        const allEls = document.querySelectorAll("*");
        for (const el of Array.from(allEls)) {
          const t = (el as HTMLElement).textContent?.trim();
          if (t !== "有影像檔" && t !== "無影像檔") continue;
          // Walk up to the nearest ancestor that contains a 詳細資料
          // button. NHI's row container is typically 3-5 levels up.
          let cur: HTMLElement | null = el as HTMLElement;
          for (let d = 0; d < 15 && cur; d++) {
            const btn = cur.querySelector<HTMLElement>('a[title="詳細資料"]');
            if (btn && btnToIndex.has(btn)) {
              result.set(btnToIndex.get(btn)!, t === "有影像檔");
              break;
            }
            cur = cur.parentElement;
          }
        }
        return result;
      }
      const imageLabelMap = buildImageLabelMap();
      function rowHasImageLabel(listIdx: number): boolean | null {
        if (imageLabelMap.has(listIdx)) return imageLabelMap.get(listIdx)!;
        return null;
      }

      // Sequential per-row trigger. Dev cap counts ONLY rows whose
      // 載入影像 dialog button was actually clicked (i.e. the POST
      // really fired) — not just "rows we tried". Skipped rows
      // (無影像檔 in UI, no button shown, mount timeout) don't burn
      // the cap and we keep looking for the next viable row.
      const results: any[] = [];
      let successfulTriggers = 0;
      // Wall-clock cap on the whole trigger loop. With stuck-retry
      // shipping (v0.15+) the candidate list can include 12-20+ rows
      // that NHI previously refused to prep — each one wastes ~10s
      // on the detail-mount-timeout path. Without a hard cap, the
      // entire trigger phase can run 5-7 min. 90s leaves room for
      // 3 successful triggers (~3×15s) plus several failed attempts.
      const TRIGGER_LOOP_WALL_CLOCK_MS = 90_000;
      const triggerLoopStart = Date.now();
      for (const r of cappedReqs) {
        if (successfulTriggers >= devCap) {
          results.push({
            rid: r.rid,
            ctype: r.ctype,
            ok: false,
            reason: "dev-cap-skipped",
          });
          continue;
        }
        if (Date.now() - triggerLoopStart > TRIGGER_LOOP_WALL_CLOCK_MS) {
          // Wall-clock budget exhausted. Skip remaining candidates
          // with a distinct reason so the breakdown can show what
          // happened. Sweep + bg poll will reconsider them next sync.
          results.push({
            rid: r.rid,
            ctype: r.ctype,
            ok: false,
            reason: "trigger-phase-timeout",
          });
          continue;
        }
        // DOM-level pre-check: skip 無影像檔 rows entirely.
        const hasImageLabel = rowHasImageLabel(r.listIdx);
        if (hasImageLabel === false) {
          results.push({
            rid: r.rid,
            ctype: r.ctype,
            ok: false,
            reason: "no-image-ui-label",
          });
          continue;
        }
        try {
          const out = await triggerOneRow(r.listIdx, r.rid, r.ctype);
          results.push({ rid: r.rid, ctype: r.ctype, ...out });
          if (out.ok) successfulTriggers++;
        } catch (e: any) {
          results.push({
            rid: r.rid,
            ctype: r.ctype,
            ok: false,
            reason: String(e?.message || e),
          });
        }
      }
      return { results };
    },
    args: [triggerable, MAX_TRIGGER_PER_SYNC_DEV],
  });

  if (result?.error === "SESSION_EXPIRED") {
    throw new Error(SESSION_EXPIRED_ERROR);
  }
  if (result?.error) {
    // Page mismatch or other early failure — mark all triggerable as failed.
    for (const r of triggerable) {
      const i = requests.findIndex((x) => x.rid === r.rid && x.ctype === r.ctype);
      if (i >= 0) {
        outcomes[i].ok = false;
        outcomes[i].reason = `pre-flight: ${result.error}`;
      }
    }
    return outcomes;
  }
  const scriptResults: any[] = result?.results || [];
  for (const sr of scriptResults) {
    const i = requests.findIndex((x) => x.rid === sr.rid && x.ctype === sr.ctype);
    if (i >= 0) {
      outcomes[i].ok = sr.ok;
      outcomes[i].reason = sr.reason;
    }
  }
  return outcomes;
}

// ────────────────────────────────────────────────────────────────────
// PHASE 1b: TRIGGER VIA HIDDEN TAB.
//
// Production-friendly variant of triggerImagingRows. Runs the same
// Vue-click flow in a background tab (chrome.tabs.create with
// active:false) so the user's visible NHI tab keeps its scroll
// position and current page — no more "the page just jumped to a
// different screen while I was reading" surprise.
//
// Auth handoff: NHI's auth lives in two places —
//   1. Bearer token in sessionStorage (per-tab-per-origin)
//   2. HTTP-only cookies (shared across tabs)
// A new tab inherits cookies but NOT sessionStorage. Vue's first paint
// reads sessionStorage.token; if missing it redirects to login. To
// avoid that round-trip, we:
//   (a) Read the visible tab's token via chrome.scripting
//   (b) Create the hidden tab pointed at /IHKE3408S01
//   (c) Wait for first complete (likely login or error page)
//   (d) Inject the token into the hidden tab's sessionStorage
//   (e) chrome.tabs.update back to /IHKE3408S01 → Vue boots with token
//   (f) Run the existing triggerImagingRows on the hidden tab
//   (g) Close the hidden tab when done
//
// Poll-fetch and sweep continue to use the visible tab — they're
// HTTP-only and just need ANY NHI tab with valid session for their
// fetch calls to inherit cookies + sessionStorage token.
// ────────────────────────────────────────────────────────────────────
function waitForTabCompleteLocal(tabId: number, timeoutMs: number): Promise<void> {
  return new Promise<void>((resolve) => {
    const done = () => {
      chrome.tabs.onUpdated.removeListener(listener);
      clearTimeout(timer);
      resolve();
    };
    const listener = (updatedTabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
      if (updatedTabId === tabId && changeInfo.status === "complete") {
        done();
      }
    };
    chrome.tabs.onUpdated.addListener(listener);
    const timer = setTimeout(done, timeoutMs);
  });
}

export async function triggerImagingRowsViaHiddenTab(
  visibleTabId: number,
  baseUrl: string,
  requests: ImagingJpegRequest[],
): Promise<TriggerOutcome[]> {
  if (!Array.isArray(requests) || requests.length === 0) return [];
  const triggerable = requests.filter((r) => r.needsTrigger);
  // If nothing needs triggering, skip the hidden tab entirely.
  if (triggerable.length === 0) {
    return requests.map((r) => ({
      rid: r.rid,
      ctype: r.ctype,
      ok: !r.needsTrigger,
      reason: undefined,
    }));
  }

  // Cancellation early-out: if the user pressed stop between sync
  // start and the imagingPromise getting a chance to run, don't
  // open the hidden tab at all.
  if (isCancelled()) throw new Error(CANCEL_ERROR);

  // Step (a): read token from visible tab.
  let token: string | null = null;
  try {
    const [res] = await chrome.scripting.executeScript({
      target: { tabId: visibleTabId },
      func: () => sessionStorage.getItem("token"),
    });
    const v = (res as any)?.result;
    if (typeof v === "string" && v.length > 0) token = v;
  } catch {
    // ignored — we'll throw SESSION_EXPIRED below
  }
  if (!token) throw new Error(SESSION_EXPIRED_ERROR);

  if (isCancelled()) throw new Error(CANCEL_ERROR);

  // Step (b): create hidden tab on the imaging list URL.
  const targetUrl = `${baseUrl}/IHKE3000/IHKE3408S01`;
  const hiddenTab = await chrome.tabs.create({
    active: false,
    url: targetUrl,
  });
  const hiddenTabId = hiddenTab.id;
  if (hiddenTabId == null) {
    throw new Error("hidden-tab: create returned no tab id");
  }
  // Register so the stopSync handler can close this tab on cancel.
  setActiveImagingTabId(hiddenTabId);

  try {
    // Step (c): wait for initial load (likely lands on login if token
    // is missing, but cookies might be enough for some NHI subpages).
    await waitForTabCompleteLocal(hiddenTabId, 15_000);

    // Step (d): inject token into the tab's sessionStorage. Even
    // though chrome.scripting runs in the ISOLATED world by default,
    // sessionStorage is shared across worlds (it's a per-origin-per-tab
    // browser-level store), so the page sees this write.
    await chrome.scripting.executeScript({
      target: { tabId: hiddenTabId },
      func: (tok: string) => {
        try {
          sessionStorage.setItem("token", tok);
        } catch {}
      },
      args: [token],
    });

    // Step (e): re-navigate so Vue re-mounts with the token in place.
    // If the first load redirected to /login, this returns us to the
    // imaging list. Idempotent if first load already landed there.
    await chrome.tabs.update(hiddenTabId, { url: targetUrl });
    await waitForTabCompleteLocal(hiddenTabId, 15_000);

    // Step (f): delegate to the visible-tab trigger logic — same script,
    // same DOM/Vue interaction, just running in a tab the user can't see.
    // Note: if the user pressed stop mid-script, the stopSync handler
    // will close hiddenTabId, which makes chrome.scripting throw — the
    // catch path falls through to the finally and re-throws CANCEL_ERROR
    // so the orchestrator's imagingPromise rejects cleanly.
    const outcomes = await triggerImagingRows(hiddenTabId, requests);
    return outcomes;
  } finally {
    // Step (g): close the hidden tab regardless of success / failure.
    // chrome.tabs.remove can throw if the tab was already closed (e.g.
    // user manually closed it mid-trigger, or stopSync already closed
    // it). Swallow either way.
    try {
      await chrome.tabs.remove(hiddenTabId);
    } catch {}
    setActiveImagingTabId(null);
  }
}

// ────────────────────────────────────────────────────────────────────
// ⚠️ DEPRECATED / UNUSED since v1.0.7 — do NOT re-wire these two functions.
// The hidden-tab arm is UNRELIABLE: Chrome throttles background-tab timers, so
// the imaging SPA's confirmation loop barely runs (its only real-world run
// failed exactly this way, and forcing it through with a reload loop tripped
// NHI's per-patient JPG cooldown). The sync flow now does ONE gentle
// openImagingConfirmForegroundTab render + leans on the user-driven 前往影像頁
// button (imagingArmUrl) as the dependable path. Kept only as reference.
//
// "資料準備中" ARM: render IHKE3408S01 in a hidden tab to kick off NHI's
// server-side image confirmation.
//
// Live-verified 2026-06-17 (brand-new patient who had NEVER opened the
// 影像清單 page): the IHKE3408S01 list API returns EVERY row as
// jpG_STATUS "-" (資料準備中) and they NEVER advance — NHI lazily starts
// confirming a patient's images only when the IHKE3408S01 page is actually
// RENDERED. A pure-API page_load poll (what the orchestrator's
// refetchImagingListUntilResolved does on the visible tab) does NOT trigger
// it, so the rows sit at "-" forever and bridge reports no images. Rendering
// the page once (27×"-" → 11×"A" + 20×"2" in the probe) arms it; thereafter
// NHI keeps advancing the status on its own (this is why users who HAD
// clicked into the imaging list once saw it "settle over minutes" — the
// page visit was the hidden precondition).
//
// We render in a HIDDEN tab so the user's active tab is undisturbed.
// Confirmation is per-PATIENT server-side, so once armed here the caller's
// existing list poll (run against THIS hidden tab, or the visible one) sees
// the rows resolve. Returns the rendered + token-injected hidden tab id; the
// caller MUST close it via closeImagingConfirmHiddenTab once polling is done.
export async function openImagingConfirmHiddenTab(
  visibleTabId: number,
  baseUrl: string,
): Promise<number> {
  // Read the session token from the visible tab (per-tab sessionStorage;
  // a fresh hidden tab inherits cookies but NOT the token).
  let token: string | null = null;
  try {
    const [res] = await chrome.scripting.executeScript({
      target: { tabId: visibleTabId },
      func: () => sessionStorage.getItem("token"),
    });
    const v = (res as any)?.result;
    if (typeof v === "string" && v.length > 0) token = v;
  } catch {
    // ignored — throw SESSION_EXPIRED below
  }
  if (!token) throw new Error(SESSION_EXPIRED_ERROR);
  if (isCancelled()) throw new Error(CANCEL_ERROR);

  const targetUrl = `${baseUrl}/IHKE3000/IHKE3408S01`;
  const hiddenTab = await chrome.tabs.create({ active: false, url: targetUrl });
  const hiddenTabId = hiddenTab.id;
  if (hiddenTabId == null) {
    throw new Error("imaging-confirm: hidden tab create returned no id");
  }
  // Register so stopSync can close it on cancel.
  setActiveImagingTabId(hiddenTabId);
  try {
    await waitForTabCompleteLocal(hiddenTabId, 15_000);
    // Inject the token (sessionStorage is shared across script worlds and
    // survives the same-origin re-navigation below).
    await chrome.scripting.executeScript({
      target: { tabId: hiddenTabId },
      func: (tok: string) => {
        try {
          sessionStorage.setItem("token", tok);
        } catch {}
      },
      args: [token],
    });
    // Re-navigate so the SPA re-mounts WITH the token → it fires the real
    // IHKE3408S01 list call that arms NHI's confirmation. Idempotent if the
    // first load already landed on the list.
    await chrome.tabs.update(hiddenTabId, { url: targetUrl });
    await waitForTabCompleteLocal(hiddenTabId, 15_000);
    return hiddenTabId;
  } catch (e) {
    // Render failed — close the tab so we don't leak it, then rethrow so
    // the caller falls back to the visible-tab poll.
    try {
      await chrome.tabs.remove(hiddenTabId);
    } catch {}
    setActiveImagingTabId(null);
    throw e;
  }
}

export async function closeImagingConfirmHiddenTab(tabId: number | null): Promise<void> {
  if (tabId == null) return;
  try {
    await chrome.tabs.remove(tabId);
  } catch {}
  setActiveImagingTabId(null);
}

// Foreground arm (v1.0.7, user-chosen 2026-06-25) — REPLACES the hidden-tab arm
// above for the sync flow. The hidden-tab arm is UNRELIABLE: Chrome throttles
// background-tab timers, so the imaging SPA's confirmation loop barely runs →
// rows stay "-"/"2" → 0 images (its first real-world run failed exactly this way,
// and trying to force it through with a 6×-reload loop is what tripped NHI's
// per-patient JPG cooldown). Instead, navigate the user's MAIN (foreground,
// already-logged-in) tab to IHKE3408S01 ONCE and LEAVE it there (the user opted
// to NOT navigate back). Foreground tabs are NOT throttled → reliable arm; the
// main tab already holds the session token in sessionStorage (it survives the
// same-origin navigation) → no token inject, no login bounce. ONE render, never a
// re-render loop — gentle, so it cannot trip the per-patient cooldown.
// SESSION_EXPIRED / CANCEL propagate; any other failure lets the caller fall back
// to polling the (un-armed) tab.
export async function openImagingConfirmForegroundTab(
  tabId: number,
  baseUrl: string,
): Promise<void> {
  let token: string | null = null;
  try {
    const [res] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => sessionStorage.getItem("token"),
    });
    const v = (res as any)?.result;
    if (typeof v === "string" && v.length > 0) token = v;
  } catch {
    // ignored — throw SESSION_EXPIRED below
  }
  if (!token) throw new Error(SESSION_EXPIRED_ERROR);
  if (isCancelled()) throw new Error(CANCEL_ERROR);
  const targetUrl = `${baseUrl}/IHKE3000/IHKE3408S01`;
  await chrome.tabs.update(tabId, { active: true, url: targetUrl });
  await waitForTabCompleteLocal(tabId, 15_000);
}

// ────────────────────────────────────────────────────────────────────
// PHASE 1c: TRIGGER VIA SW-DIRECT FETCH (v0.15+, default).
//
// Mirrors NHI's real Vue-click protocol (see top-of-file comment block)
// but runs entirely in the service worker — no hidden tab, no DOM
// scripting, no Vue introspection. Per-row latency is bounded by
// network only (~500-800ms × 3 calls = ~2s/row), so the whole trigger
// phase for 20 rows finishes in ~30-40s vs the Vue-click flow's
// ~5-7 min on the same data.
//
// Auth:
//   - Bearer token: read from the snapshot saveBearerTokenForBgPoll
//     stashed in chrome.storage.local at sync start. Refreshes every
//     sync; TTL 30 min.
//   - Cookies: attached via credentials: "include" — Chrome ships
//     myhealthbank cookies because the host is in manifest
//     host_permissions.
//
// Outcome semantics match the legacy Vue flow's TriggerOutcome so
// pollFetchImagingJpegs is unchanged. Each row's verify-fetch maps to:
//   "0" → ok: true,  reason: "trigger-confirmed"  (NHI queued prep)
//   "1" → ok: true,  reason: "trigger-already-ready" (race: ready
//                    between POST and verify)
//   "A" → ok: false, reason: "direct-api-silent-fail" (POST returned
//                    Y but row state didn't move — NHI's silent reject)
//   other / blank → ok: false, reason: `unexpected-${status}`
// ────────────────────────────────────────────────────────────────────

/**
 * Wall-clock budget for the SW trigger loop. With sequential row
 * processing at ~2s/row this comfortably covers 30+ rows; anything
 * beyond falls into "trigger-phase-timeout" and is processed next sync
 * the same way the Vue-click flow's wall-clock cap handled it.
 */
const SW_TRIGGER_LOOP_WALL_CLOCK_MS = 90_000;

/**
 * Per-row inter-step wait. NHI's server-side state machine seems to
 * tolerate back-to-back GET→POST→GET without delay, but a small
 * cushion buys us margin against future tightening + smooths burst
 * load. Empirically 200ms is enough; bumped to 300 for safety.
 */
const SW_TRIGGER_INTER_STEP_MS = 300;

/**
 * SW-side POST helper. Mirrors swFetchNhiJson (GET) but with
 * JSON body and POST verb. Used by the trigger flow's /S02/add call.
 */
async function swPostNhiJson(
  url: string,
  body: any,
  token: string,
  timeoutMs = 15_000,
): Promise<{ body?: any; error?: string }> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const r = await fetch(url, {
      method: "POST",
      credentials: "include",
      signal: ac.signal,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(body),
    });
    clearTimeout(t);
    if (r.status === 401 || r.status === 403) {
      return { error: "SESSION_EXPIRED" };
    }
    if (!r.ok) return { error: `HTTP ${r.status}` };
    return { body: await r.json() };
  } catch (e: any) {
    clearTimeout(t);
    return {
      error:
        e?.name === "AbortError"
          ? `timeout ${Math.round(timeoutMs / 1000)}s`
          : String(e?.message || e),
    };
  }
}

export async function triggerImagingRowsViaSwFetch(
  baseUrl: string,
  patientId: string,
  requests: ImagingJpegRequest[],
): Promise<TriggerOutcome[]> {
  if (!Array.isArray(requests) || requests.length === 0) return [];

  // Pass-through: ready rows don't need triggering.
  const triggerable = requests.filter((r) => r.needsTrigger);
  const outcomes: TriggerOutcome[] = requests.map((r) => ({
    rid: r.rid,
    ctype: r.ctype,
    ok: !r.needsTrigger,
    reason: r.needsTrigger ? "not-attempted" : undefined,
  }));
  if (triggerable.length === 0) return outcomes;

  if (isCancelled()) throw new Error(CANCEL_ERROR);

  const token = await loadBearerToken(patientId);
  if (!token) {
    // Mirror the Vue-flow's session-expired path so the orchestrator's
    // existing handling kicks in (user gets re-login prompt).
    throw new Error(SESSION_EXPIRED_ERROR);
  }

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // Sequential per-row. NHI's `add` handler reads the row from the
  // most-recent S02 page_load GET in the same session — running these
  // in parallel races the server-side state and the wrong row gets
  // queued. Per-row latency is ~2s so 20-30 rows ≈ 40-60s, well
  // inside the wall-clock cap.
  const triggerStart = Date.now();
  let successfulTriggers = 0;
  const scriptResults: Array<{
    rid: string;
    ctype: string;
    ok: boolean;
    reason?: string;
    newStatus?: string;
  }> = [];

  for (const r of triggerable) {
    if (isCancelled()) throw new Error(CANCEL_ERROR);
    if (successfulTriggers >= MAX_TRIGGER_PER_SYNC_DEV) {
      scriptResults.push({
        rid: r.rid,
        ctype: r.ctype,
        ok: false,
        reason: "dev-cap-skipped",
      });
      continue;
    }
    if (Date.now() - triggerStart > SW_TRIGGER_LOOP_WALL_CLOCK_MS) {
      scriptResults.push({
        rid: r.rid,
        ctype: r.ctype,
        ok: false,
        reason: "trigger-phase-timeout",
      });
      continue;
    }

    const detailUrl = `${baseUrl}/api/ihke3000/IHKE3408S02/page_load?crid=${encodeURIComponent(r.rid)}&ctype=${encodeURIComponent(r.ctype)}`;
    const addUrl = `${baseUrl}/api/ihke3000/IHKE3408S02/add`;

    // Step 1: GET S02 page_load — sets NHI's server-side "current row"
    // state. Without this, the POST below silently no-ops.
    const setupResp = await swFetchNhiJson(detailUrl, token);
    if (setupResp.error === "SESSION_EXPIRED") {
      throw new Error(SESSION_EXPIRED_ERROR);
    }
    if (setupResp.error) {
      scriptResults.push({
        rid: r.rid,
        ctype: r.ctype,
        ok: false,
        reason: `setup-get-error: ${setupResp.error}`,
      });
      continue;
    }

    // Belt-and-suspenders: if the row's status was already "1" or "0"
    // when we did the setup GET (race with another trigger from same
    // patient in another tab), skip the POST.
    const setupMain = setupResp.body?.ihke3408S02_main_data?.[0];
    const setupStatus = String(setupMain?.jpg_STATUS ?? "");
    if (setupStatus === "0") {
      scriptResults.push({
        rid: r.rid,
        ctype: r.ctype,
        ok: true,
        reason: "already-preparing",
        newStatus: "0",
      });
      successfulTriggers++;
      continue;
    }
    if (setupStatus === "1") {
      scriptResults.push({
        rid: r.rid,
        ctype: r.ctype,
        ok: true,
        reason: "already-ready",
        newStatus: "1",
      });
      successfulTriggers++;
      continue;
    }

    // Extract the row's `rownum` from the detail body — this is the
    // per-row sentinel NHI's /add handler matches the POST body
    // against. It's NOT a fixed value across rows (verified live: row
    // AAtEGaABMAAJummAAn returned rownum="-10"; row AAtEGaABMAAJumRAAE
    // returned rownum="-7"). Hard-coding "-3" worked once because the
    // single row sniffed in Part B happened to have rownum="-3"; on
    // any other row, NHI's add handler responds with literal "申請載入
    // 影像檔時發生錯誤" reject and the row stays in status "A".
    const rownum = setupMain?.rownum;
    if (!rownum || typeof rownum !== "string") {
      scriptResults.push({
        rid: r.rid,
        ctype: r.ctype,
        ok: false,
        reason: "no-rownum-in-detail-body",
      });
      continue;
    }

    await sleep(SW_TRIGGER_INTER_STEP_MS);

    // Step 2: POST /S02/add with the row's REAL rownum (extracted
    // above from step 1's response body). The HTTP-level state NHI's
    // add handler reads is set by:
    //   (a) the most-recent S02 page_load GET in this session
    //       (provides crid/ctype-derived row context)
    //   (b) the rownum value in this POST body matching the GET's
    //       response.rownum (provides explicit row identity)
    // If (a) and (b) disagree, NHI rejects with "錯誤" in the message.
    const addResp = await swPostNhiJson(addUrl, { ipl_CASE_SEQ_NO: rownum }, token);
    if (addResp.error === "SESSION_EXPIRED") {
      throw new Error(SESSION_EXPIRED_ERROR);
    }
    if (addResp.error) {
      scriptResults.push({
        rid: r.rid,
        ctype: r.ctype,
        ok: false,
        reason: `add-post-error: ${addResp.error}`,
      });
      continue;
    }
    // NHI returns {status:"Y", message:"已申請載入影像檔。"} on accept.
    // We DO NOT trust this status field alone — the silent-fail bug
    // showed it can be "Y" while the row state doesn't move.
    const ackStatus = String(addResp.body?.status ?? "");
    if (ackStatus && ackStatus !== "Y") {
      scriptResults.push({
        rid: r.rid,
        ctype: r.ctype,
        ok: false,
        reason: `add-rejected-${ackStatus}`,
      });
      continue;
    }

    await sleep(SW_TRIGGER_INTER_STEP_MS);

    // Step 3: GET S02 page_load again to verify status flipped A → 0.
    // This is the same authoritative check the Vue-flow's
    // post-verification used; the SW path inherits its semantics
    // unchanged (so the orchestrator + breakdown logic doesn't have
    // to special-case the new trigger source).
    const verifyResp = await swFetchNhiJson(detailUrl, token);
    if (verifyResp.error === "SESSION_EXPIRED") {
      throw new Error(SESSION_EXPIRED_ERROR);
    }
    if (verifyResp.error) {
      // Verify network blip — assume optimistic success (sweep will
      // catch up next tick). Same fallback the Vue-flow used.
      scriptResults.push({
        rid: r.rid,
        ctype: r.ctype,
        ok: true,
        reason: `verify-${verifyResp.error}`,
      });
      successfulTriggers++;
      continue;
    }
    const main = verifyResp.body?.ihke3408S02_main_data?.[0];
    const newStatus = String(main?.jpg_STATUS ?? "");
    if (newStatus === "0") {
      scriptResults.push({
        rid: r.rid,
        ctype: r.ctype,
        ok: true,
        reason: "trigger-confirmed",
        newStatus,
      });
      successfulTriggers++;
    } else if (newStatus === "1") {
      scriptResults.push({
        rid: r.rid,
        ctype: r.ctype,
        ok: true,
        reason: "trigger-already-ready",
        newStatus,
      });
      successfulTriggers++;
    } else if (newStatus === "A") {
      scriptResults.push({
        rid: r.rid,
        ctype: r.ctype,
        ok: false,
        reason: "direct-api-silent-fail",
        newStatus,
      });
    } else {
      scriptResults.push({
        rid: r.rid,
        ctype: r.ctype,
        ok: false,
        reason: `nhi-unexpected-status-${newStatus || "blank"}`,
        newStatus,
      });
    }
  }

  for (const sr of scriptResults) {
    const i = requests.findIndex((x) => x.rid === sr.rid && x.ctype === sr.ctype);
    if (i >= 0) {
      outcomes[i].ok = sr.ok;
      outcomes[i].reason = sr.reason;
    }
  }
  return outcomes;
}

// ────────────────────────────────────────────────────────────────────
// PHASE 2: POLL + FETCH — silent HTTP, parallel-safe.
//
// No navigation happens here, only fetches. Can run in parallel with
// other detail fan-outs since chrome.scripting.executeScript calls on
// the same tab don't collide when none of them navigate.
// ────────────────────────────────────────────────────────────────────
export async function pollFetchImagingJpegs(
  tabId: number,
  baseUrl: string,
  requests: ImagingJpegRequest[],
  triggerOutcomes: TriggerOutcome[],
): Promise<ImagingJpegResult[]> {
  if (!Array.isArray(requests) || requests.length === 0) return [];

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: async (base: any, reqs: any, outcomes: any, tuning: any) => {
      const token = sessionStorage.getItem("token");
      if (!token) return { error: "SESSION_EXPIRED" };
      if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
        return { error: "SESSION_EXPIRED" };
      }
      const auth = `Bearer ${token}`;

      // Initial outcome is "triggered-waiting" — that's where rows land
      // when their trigger succeeded but the poll loop runs out of window
      // before NHI's lazy prep returns base64. Recoverable on next sync.
      // Rows with !needsTrigger or failed trigger are overwritten below.
      const out = reqs.map((r: any) => ({
        rid: r.rid,
        ctype: r.ctype,
        iplCaseSeqNo: r.iplCaseSeqNo || null,
        jpgBase64s: [] as string[],
        outcome: "triggered-waiting",
      }));

      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

      async function httpGetJson(url: string): Promise<any> {
        const ac = new AbortController();
        const t = setTimeout(() => ac.abort(), 30000);
        try {
          const r = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
            signal: ac.signal,
            headers: {
              Accept: "application/json",
              Authorization: auth,
              "X-Requested-With": "XMLHttpRequest",
            },
          });
          clearTimeout(t);
          if (r.status === 401 || r.status === 403) {
            return { error: "SESSION_EXPIRED" };
          }
          if (!r.ok) return { error: `HTTP ${r.status}` };
          return { body: await r.json() };
        } catch (e: any) {
          clearTimeout(t);
          return {
            error: e?.name === "AbortError" ? "timeout 30s" : String(e?.message || e),
          };
        }
      }

      function readBase64Jpgs(body: any): string[] {
        if (!body || typeof body !== "object") return [];
        if (Array.isArray(body.pics) && body.pics.length > 0) {
          const acc: string[] = [];
          for (const p of body.pics) {
            if (typeof p === "string" && p.length > 1000) acc.push(p);
          }
          if (acc.length > 0) return acc;
        }
        for (const k of ["img", "imG", "jpg", "base64", "imgBase64", "data"]) {
          const v = body[k];
          if (typeof v === "string" && v.length > 1000) return [v];
        }
        return [];
      }

      async function fetchJpg(seqNo: string) {
        const u = `${base}/api/ihke3000/IHKE3408S03/page_load?IPL_CASE_SEQ_NO=${encodeURIComponent(seqNo)}`;
        return await httpGetJson(u);
      }

      // ── Robustness helpers (slow-network + transient-fail tolerant) ──
      //
      // Why these matter (user report 2026-06-05, slow network):
      // cap=Infinity sync with 20/20 ready candidates → 10 successful +
      // 10 fetch-failed. All 20 fetches fired in one Promise.all burst
      // saturated the (slow) link; ~half timed out at the 30s per-fetch
      // budget. Net effect: half the patient's imaging silently dropped.
      //
      // Two helpers added below:
      //
      //   runBatched(items, n, fn) — chunks `items` into windows of `n`
      //     and processes each window with Promise.all internally, awaiting
      //     each window before starting the next. Caps concurrent in-flight
      //     bandwidth at `n` requests. On fast networks the wall-clock
      //     cost is small (extra serialisation between batches); on slow
      //     networks each batch finishes before the next starts, so a
      //     single fetch's bandwidth share doesn't shrink to a tenth.
      //
      //   fetchJpgWithRetry(seqNo, attempts) — retries the S03 fetch up
      //     to `attempts-1` times on transient errors (timeout, HTTP 5xx,
      //     HTTP 429, network blip, or 200-OK-but-empty-pics). Does NOT
      //     retry on SESSION_EXPIRED (let outer handle) or HTTP 4xx
      //     (deterministic). 1.5s backoff between attempts.
      //
      // Step A (ready rows) uses BOTH helpers because failures here are
      // unrecoverable in the current sync — the row doesn't go into the
      // pending stash, so a missed cached fetch is gone until the user
      // manually re-syncs. Step C uses batching only — the poll loop
      // already retries naturally through multiple cycles, so per-fetch
      // retry would over-spend the 90s budget.
      const STEP_A_BATCH_SIZE = 5;
      const STEP_A_RETRY_ATTEMPTS = 2;
      const STEP_C_BATCH_SIZE = 5;

      async function runBatched<T, R>(
        items: T[],
        size: number,
        fn: (it: T) => Promise<R>,
      ): Promise<R[]> {
        const results: R[] = [];
        for (let i = 0; i < items.length; i += size) {
          const batchResults = await Promise.all(items.slice(i, i + size).map(fn));
          for (const r of batchResults) results.push(r);
        }
        return results;
      }

      function isTransientFetchError(errStr: string, gotBodyButNoBase64: boolean): boolean {
        if (gotBodyButNoBase64) return true;
        if (!errStr) return false;
        return (
          errStr.includes("timeout") ||
          errStr.includes("HTTP 5") ||
          errStr.includes("HTTP 429") ||
          errStr.includes("Failed to fetch") ||
          errStr.includes("NetworkError")
        );
      }

      async function fetchJpgWithRetry(
        seqNo: string,
        attempts: number,
      ): Promise<{ body?: any; error?: string; b64s?: string[] }> {
        let lastErr = "";
        for (let attempt = 1; attempt <= attempts; attempt++) {
          const r = await fetchJpg(seqNo);
          if (r.error === "SESSION_EXPIRED") return r;
          if (!r.error) {
            const b64s = readBase64Jpgs(r.body);
            if (b64s.length > 0) return { body: r.body, b64s };
            // 200-OK but no base64 → transient (NHI cache miss / not
            // ready yet); retry once if budget allows.
            if (attempt < attempts && isTransientFetchError("", true)) {
              await sleep(1500);
              continue;
            }
            return { error: "no base64 in response" };
          }
          lastErr = String(r.error);
          if (attempt < attempts && isTransientFetchError(lastErr, false)) {
            await sleep(1500);
            continue;
          }
          return { error: lastErr };
        }
        return { error: lastErr || "exhausted retries" };
      }

      // Pull the current list endpoint to refresh per-row state.
      // After a successful trigger, the row's ipL_CASE_SEQ_NO transitions
      // from "-" to a real 16-char seq once NHI's lazy prep completes —
      // and that's the value we need for the IHKE3408S03 fetch. Polling
      // list periodically catches that transition.
      //
      // Cache-bust note: NHI's list endpoint sits behind a caching layer
      // (verified empirically — a sync that triggered 3 rows still saw
      // seq="-" in the polled list for the full 4-min window). Appending
      // `&_=${Date.now()}` forces a cache miss every cycle so we actually
      // see freshly-allocated seqs.
      //
      // Key shape: just row_ID (not row_ID|ori_TYPE). The ori_TYPE
      // string we get on the request side comes from `ctype` which is
      // the page_load detail's narrative type — different code path than
      // the list endpoint's `ori_TYPE` field, and the two strings can
      // disagree on case/whitespace. row_ID is already globally unique
      // per imaging row so the disambiguator wasn't actually needed.
      async function refreshSeqMap(): Promise<Map<string, string>> {
        const url = `${base}/api/ihke3000/ihke3408s01/page_load?s_type=&s_sort=A1&_=${Date.now()}`;
        const r = await httpGetJson(url);
        if (r.error || !r.body) return new Map();
        const list = r.body.sp_IHKE3408S01_data || [];
        const m = new Map<string, string>();
        for (const row of list) {
          const seq = String(row?.ipL_CASE_SEQ_NO ?? row?.ipl_CASE_SEQ_NO ?? "");
          if (seq && seq !== "-" && row?.row_ID) {
            m.set(String(row.row_ID), seq);
          }
        }
        return m;
      }

      // Categorise per row:
      //   readyIdx     — status=1 in list, valid seq → fetch directly
      //   preparingIdx — status=0 in list (v0.15.7); NHI prep in flight
      //                  → optimistic fetch, fall back to waiting
      //   triggeredIdx — needsTrigger AND trigger succeeded → poll loop
      //   trigger-failed — needsTrigger AND trigger failed → report only
      const readyIdx: number[] = [];
      const preparingIdx: number[] = [];
      const triggeredIdx: number[] = [];
      for (let i = 0; i < reqs.length; i++) {
        const r = reqs[i];
        const outc = outcomes[i];
        if (r.isPreparing) {
          preparingIdx.push(i);
        } else if (!r.needsTrigger) {
          readyIdx.push(i);
        } else if (outc?.ok) {
          triggeredIdx.push(i);
        } else {
          out[i].outcome = "trigger-failed";
          out[i].error = outc?.reason || "unknown";
        }
      }

      // Step A: fetch ready + preparing rows in BATCHED parallel + with
      // per-fetch retry. Slow networks + 20 simultaneous 1-3 MB downloads
      // were shown to fail half the cached fetches (user report 2026-06-05).
      // Batched concurrency caps in-flight bandwidth share; retry reclaims
      // transient timeouts. Cached rows already had a valid iplCaseSeqNo
      // at narrative-detail time (status=1 with imG_SIZE>0).
      //
      // Preparing rows (v0.15.7) share the same fetch path but treat
      // empty-bytes differently — they're not cached failures, they're
      // NHI still preparing, so they roll into triggered-waiting (→
      // 等候健保備齊 in breakdown, → pending stash for next sync).
      type StepAItem = { i: number; isPreparingRow: boolean };
      const stepAItems: StepAItem[] = [
        ...readyIdx.map((i) => ({ i, isPreparingRow: false })),
        ...preparingIdx.map((i) => ({ i, isPreparingRow: true })),
      ];
      await runBatched(stepAItems, STEP_A_BATCH_SIZE, async (it) => {
        const seqNo = reqs[it.i].iplCaseSeqNo;
        if (!seqNo || seqNo === "-") {
          if (it.isPreparingRow) {
            // Preparing without a seq → NHI just queued, hasn't allocated.
            // Mark as waiting; next sync's sweep / cached path picks up.
            out[it.i].outcome = "triggered-waiting";
            out[it.i].error = "preparing-no-seq";
          } else {
            out[it.i].outcome = "fetch-failed";
            out[it.i].error = "missing seq for ready row";
          }
          return;
        }
        const r = await fetchJpgWithRetry(seqNo, STEP_A_RETRY_ATTEMPTS);
        if (r.error === "SESSION_EXPIRED") return;
        if (r.error) {
          if (it.isPreparingRow) {
            out[it.i].outcome = "triggered-waiting";
            out[it.i].error = `preparing: ${r.error}`;
          } else {
            out[it.i].outcome = "fetch-failed";
            out[it.i].error = r.error;
          }
          return;
        }
        if (!r.b64s || r.b64s.length === 0) {
          if (it.isPreparingRow) {
            out[it.i].outcome = "triggered-waiting";
            out[it.i].error = "preparing: no bytes yet";
          } else {
            out[it.i].outcome = "fetch-failed";
            out[it.i].error = "no base64 in response";
          }
          return;
        }
        // Either case, bytes landed → "ready" (counted as 已快取).
        out[it.i].outcome = "ready";
        out[it.i].jpgBase64s = r.b64s;
      });

      // Step B: initial wait window for triggered rows.
      const t0 = Date.now();
      if (triggeredIdx.length > 0) {
        await sleep(tuning.initialWaitMs);
      }

      // ── Rid re-keying mitigation ──────────────────────────────────
      // NHI re-keys row_ID after prep completes (verified live
      // 2026-06-05): the original status=A row disappears and a NEW
      // status=1 row is created with a different rid (in a different
      // rid "family"). The 3 rids I triggered yesterday via MCP
      // (AAtEGaABMAAJummAAn etc) were ABSENT from today's list, while
      // all current status=1 × E rows had a fresh `AAAyWRAF3AAFB…`
      // prefix.
      //
      // Effect on bridge: direct rid lookup in seqMap NEVER finds the
      // triggered row (the rid bridge has is the dead status=A rid).
      // Bridge incorrectly marks rows as triggered-waiting even after
      // NHI has prep'd them and the bytes are fetchable.
      //
      // Fix: shape-based fallback — match triggered rows to status=1
      // × E rows in the current list by (order_CODE, real_INSPECT_DATE,
      // hosp_ABBR, ori_TYPE). The 4-tuple uniquely identifies a study;
      // any new status=1 row matching it must be the prep'd version
      // of the triggered row.
      //
      // Conflict-avoidance: `consumedRids` excludes (a) rids that are
      // already-cached candidates (we'll match those directly) and (b)
      // rids that this iteration's shape-match already claimed. Without
      // (b), two triggered rows with the same shape could both grab
      // the same first matching rid.
      //
      // refreshSeqMapAndShapeMap returns both indices in one list fetch
      // so the in-loop cost is unchanged.
      async function refreshSeqMapAndShapeMap(): Promise<{
        seqMap: Map<string, string>;
        shapeMap: Map<string, Array<{ rid: string; seq: string }>>;
      }> {
        const url = `${base}/api/ihke3000/ihke3408s01/page_load?s_type=&s_sort=A1&_=${Date.now()}`;
        const r = await httpGetJson(url);
        const seqMap = new Map<string, string>();
        const shapeMap = new Map<string, Array<{ rid: string; seq: string }>>();
        if (r.error || !r.body) return { seqMap, shapeMap };
        const list = r.body.sp_IHKE3408S01_data || [];
        for (const row of list) {
          const seq = String(row?.ipL_CASE_SEQ_NO ?? row?.ipl_CASE_SEQ_NO ?? "");
          const rid = String(row?.row_ID ?? "");
          if (seq && seq !== "-" && rid) {
            seqMap.set(rid, seq);
            const status = String(row?.jpG_STATUS ?? row?.jpg_STATUS ?? "");
            const oriType = String(row?.ori_TYPE ?? row?.ori_type ?? "");
            // Only rows in "ready" state are eligible for shape match.
            // Rows in status=A/0/2 with allocated seq shouldn't happen
            // for ori=E, but defensive filter anyway.
            if (status === "1" && oriType === "E") {
              const code = String(row?.order_CODE ?? row?.order_code ?? "");
              const date = String(row?.real_INSPECT_DATE ?? row?.real_inspect_date ?? "");
              const hospital = String(row?.hosp_ABBR ?? row?.hosp_abbr ?? "");
              const sig = `${code}|${date}|${hospital}|${oriType}`;
              if (!shapeMap.has(sig)) shapeMap.set(sig, []);
              shapeMap.get(sig)!.push({ rid, seq });
            }
          }
        }
        return { seqMap, shapeMap };
      }

      // Seed consumedRids with already-cached candidates' rids so the
      // shape fallback doesn't redirect a triggered row to a rid we're
      // already fetching directly in Step A.
      const consumedRids = new Set<string>();
      for (let i = 0; i < reqs.length; i++) {
        if (!reqs[i].needsTrigger && reqs[i].rid) {
          consumedRids.add(String(reqs[i].rid));
        }
      }

      // Try (a) direct rid match in seqMap, then (b) shape match in
      // shapeMap; in either case return the {seq, rid} to use, or null
      // if neither hits. Mutates consumedRids on success.
      function resolveSeqForReq(
        req: any,
        seqMap: Map<string, string>,
        shapeMap: Map<string, Array<{ rid: string; seq: string }>>,
      ): { seq: string; rid: string } | null {
        const directSeq = seqMap.get(String(req.rid));
        if (directSeq) {
          consumedRids.add(String(req.rid));
          return { seq: directSeq, rid: String(req.rid) };
        }
        const meta = req.mainMeta || {};
        const sig = `${meta.orderCode || ""}|${meta.date || ""}|${meta.hospital || ""}|${req.ctype || ""}`;
        const candidates = shapeMap.get(sig);
        if (!candidates || candidates.length === 0) return null;
        for (const c of candidates) {
          if (!consumedRids.has(c.rid)) {
            consumedRids.add(c.rid);
            return c;
          }
        }
        return null;
      }

      // Step C: poll-fetch triggered rows. Each cycle we re-fetch the
      // list to refresh seqs + shape map, then try direct + shape
      // resolution for each pending row.
      const pending = [...triggeredIdx];
      while (pending.length > 0 && Date.now() - t0 < tuning.timeoutMs) {
        const { seqMap, shapeMap } = await refreshSeqMapAndShapeMap();
        const stillPending: number[] = [];
        // Resolve sync first (claim phase), then fetch in parallel.
        const assignments: Array<{ i: number; seq: string; rid: string }> = [];
        for (const i of pending) {
          const r = resolveSeqForReq(reqs[i], seqMap, shapeMap);
          if (r) assignments.push({ i, seq: r.seq, rid: r.rid });
          else stillPending.push(i);
        }
        await runBatched(assignments, STEP_C_BATCH_SIZE, async (a) => {
          const r = await fetchJpg(a.seq);
          if (r.error === "SESSION_EXPIRED") {
            stillPending.push(a.i);
            return;
          }
          if (r.error) {
            stillPending.push(a.i);
            return;
          }
          const b64s = readBase64Jpgs(r.body);
          if (b64s.length > 0) {
            out[a.i].iplCaseSeqNo = a.seq;
            out[a.i].outcome = "triggered-ready";
            out[a.i].jpgBase64s = b64s;
          } else {
            stillPending.push(a.i);
          }
        });
        pending.length = 0;
        pending.push(...stillPending);
        if (pending.length === 0) break;
        await sleep(tuning.pollIntervalMs);
      }

      // ── FINAL ATTEMPT after deadline ──────────────────────────────
      // Belt-and-suspenders: the poll loop exits at deadline but NHI
      // may have completed prep right at the boundary. One more
      // refresh + resolve attempt closes that race. Uses the same
      // direct+shape resolution so re-keyed rows are still caught.
      if (pending.length > 0) {
        const { seqMap, shapeMap } = await refreshSeqMapAndShapeMap();
        const assignments: Array<{ i: number; seq: string; rid: string }> = [];
        for (const i of pending) {
          const r = resolveSeqForReq(reqs[i], seqMap, shapeMap);
          if (r) assignments.push({ i, seq: r.seq, rid: r.rid });
        }
        await runBatched(assignments, STEP_C_BATCH_SIZE, async (a) => {
          const r = await fetchJpg(a.seq);
          if (r.error) return;
          const b64s = readBase64Jpgs(r.body);
          if (b64s.length > 0) {
            out[a.i].iplCaseSeqNo = a.seq;
            out[a.i].outcome = "triggered-ready";
            out[a.i].jpgBase64s = b64s;
          }
        });
      }

      return { results: out };
    },
    args: [
      baseUrl,
      requests,
      triggerOutcomes,
      {
        initialWaitMs: INITIAL_WAIT_MS,
        pollIntervalMs: POLL_INTERVAL_MS,
        timeoutMs: TIMEOUT_MS,
      },
    ],
  });

  if (result?.error === "SESSION_EXPIRED") {
    throw new Error(SESSION_EXPIRED_ERROR);
  }
  return (result?.results || []) as ImagingJpegResult[];
}

// ────────────────────────────────────────────────────────────────────
// PHASE 3 (cross-sync): PENDING STASH + SWEEP.
//
// When a row's trigger Vue flow succeeds but NHI's lazy prep doesn't
// produce a seq within the poll window, the row is "triggered-waiting"
// (recoverable). We persist its (rid, ctype, triggeredAt) so the next
// sync can:
//   a) skip re-triggering it (don't burn the dev cap on rows already
//      in the queue) — see filterPendingFromTriggerable() below
//   b) directly fetch the JPGs the moment NHI's list endpoint exposes
//      a seq — see sweepPendingImaging() below
//
// NHI's server-side imaging cache is patient-bound and lives ~7 days.
// Storage TTL is 8 days for safety margin — beyond that the trigger has
// expired NHI-side and the row will appear as needs-trigger=true on
// the next list endpoint hit anyway.
// ────────────────────────────────────────────────────────────────────

export interface PendingImagingRow {
  rid: string;
  ctype: string;
  triggeredAt: number;
}

interface PendingImagingStash {
  rows: PendingImagingRow[];
  updatedAt: number;
}

function pendingKey(patientId: string): string {
  return `${PENDING_IMAGING_KEY_PREFIX}${patientId}`;
}

/**
 * Read the per-patient pending stash, evicting TTL-expired entries on
 * read. Returns the surviving rows. Returns [] for unknown patient.
 */
export async function loadPendingImaging(patientId: string): Promise<PendingImagingRow[]> {
  if (!patientId) return [];
  const key = pendingKey(patientId);
  const obj = await chrome.storage.local.get(key);
  const stash = obj[key] as PendingImagingStash | undefined;
  if (!stash || !Array.isArray(stash.rows)) return [];
  const now = Date.now();
  const fresh = stash.rows.filter(
    (r) =>
      r &&
      typeof r.rid === "string" &&
      typeof r.ctype === "string" &&
      typeof r.triggeredAt === "number" &&
      now - r.triggeredAt < PENDING_IMAGING_TTL_MS,
  );
  if (fresh.length !== stash.rows.length) {
    if (fresh.length === 0) {
      await chrome.storage.local.remove(key);
    } else {
      await chrome.storage.local.set({
        [key]: { rows: fresh, updatedAt: now },
      });
    }
  }
  return fresh;
}

/**
 * Upsert rows to the per-patient pending stash. v0.15+: behaves as an
 * upsert (not just append) — re-triggered rows get their triggeredAt
 * refreshed to now, so the stuck-retry gate (polledCandidates filter
 * in sync-orchestrator) treats them as freshly-attempted and won't
 * thrash by re-triggering them on every consecutive sync.
 *
 * Kept under the old name `appendPendingImaging` for call-site stability.
 */
export async function appendPendingImaging(
  patientId: string,
  newRows: Array<{ rid: string; ctype: string }>,
): Promise<void> {
  if (!patientId || newRows.length === 0) return;
  const key = pendingKey(patientId);
  const existing = await loadPendingImaging(patientId);
  const now = Date.now();
  const byKey = new Map<string, PendingImagingRow>();
  for (const r of existing) {
    byKey.set(`${r.rid}|${r.ctype}`, r);
  }
  let updated = 0;
  for (const r of newRows) {
    if (!r.rid || !r.ctype) continue;
    const k = `${r.rid}|${r.ctype}`;
    const found = byKey.get(k);
    if (found) {
      // Re-triggered: refresh triggeredAt.
      found.triggeredAt = now;
      updated++;
    } else {
      byKey.set(k, { rid: r.rid, ctype: r.ctype, triggeredAt: now });
    }
  }
  await chrome.storage.local.set({
    [key]: { rows: Array.from(byKey.values()), updatedAt: now },
  });
  if (updated > 0) {
    console.info(`[pending] upsert: ${updated} re-triggered rows refreshed triggeredAt`);
  }
}

/**
 * Remove rows from the per-patient pending stash. Called after sweep
 * successfully fetches the base64 for those rows.
 */
export async function removePendingImaging(
  patientId: string,
  removeKeys: Set<string>,
): Promise<void> {
  if (!patientId || removeKeys.size === 0) return;
  const key = pendingKey(patientId);
  const existing = await loadPendingImaging(patientId);
  const remaining = existing.filter((r) => !removeKeys.has(`${r.rid}|${r.ctype}`));
  if (remaining.length === existing.length) return;
  if (remaining.length === 0) {
    await chrome.storage.local.remove(key);
  } else {
    await chrome.storage.local.set({
      [key]: { rows: remaining, updatedAt: Date.now() },
    });
  }
}

// ────────────────────────────────────────────────────────────────────
// BEARER TOKEN SNAPSHOT (v0.15+ direct-fetch architecture)
//
// Background polling no longer uses chrome.scripting on the visible
// tab (unreliable — tab throttling / discards / Vue conflicts cause
// hangs). Instead, the SW does direct fetch against NHI endpoints
// using:
//   1. Cookies attached automatically via credentials: "include"
//      (allowed for hosts listed in manifest host_permissions)
//   2. Bearer token snapshot saved here at sync end
// host_permissions for myhealthbank.nhi.gov.tw lets Chrome bypass CORS
// on SW-side fetches to that host, so this works without any third-
// party permission grants.
// ────────────────────────────────────────────────────────────────────

/**
 * Save the visible tab's sessionStorage token snapshot so background
 * polling can use it. Called once at the end of each sync.
 */
export async function saveBearerTokenForBgPoll(tabId: number, patientId: string): Promise<void> {
  try {
    const [res] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => sessionStorage.getItem("token"),
    });
    const token = (res as any)?.result;
    if (typeof token === "string" && token.length > 0) {
      await chrome.storage.local.set({
        [NHI_BEARER_TOKEN_KEY]: {
          token,
          patientId,
          savedAt: Date.now(),
        },
      });
    }
  } catch {
    // best-effort — bg poll will fail with SESSION_EXPIRED if token
    // can't be retrieved at sweep time
  }
}

async function loadBearerToken(patientId: string): Promise<string | null> {
  const obj = await chrome.storage.local.get(NHI_BEARER_TOKEN_KEY);
  const stash = obj[NHI_BEARER_TOKEN_KEY] as
    | { token: string; patientId: string; savedAt: number }
    | undefined;
  if (!stash) return null;
  if (Date.now() - stash.savedAt > NHI_BEARER_TOKEN_TTL_MS) {
    // Audit P1-6 (2026-06-12): self-clean — an expired session token is
    // a credential, never leave it on disk just because reads reject it.
    await chrome.storage.local.remove(NHI_BEARER_TOKEN_KEY).catch(() => {});
    return null;
  }
  if (stash.patientId !== patientId) return null;
  return stash.token || null;
}

/**
 * SW-side direct fetch to NHI API. Uses host_permissions to bypass
 * CORS; cookies attached via credentials: "include"; Bearer header
 * from the saved snapshot. Returns parsed JSON body or an error tag.
 */
async function swFetchNhiJson(
  url: string,
  token: string,
  timeoutMs = 15_000,
): Promise<{ body?: any; error?: string }> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const r = await fetch(url, {
      method: "GET",
      credentials: "include",
      signal: ac.signal,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    clearTimeout(t);
    if (r.status === 401 || r.status === 403) {
      return { error: "SESSION_EXPIRED" };
    }
    if (!r.ok) return { error: `HTTP ${r.status}` };
    return { body: await r.json() };
  } catch (e: any) {
    clearTimeout(t);
    return {
      error:
        e?.name === "AbortError"
          ? `timeout ${Math.round(timeoutMs / 1000)}s`
          : String(e?.message || e),
    };
  }
}

function readBase64JpgsFromBody(body: any): string[] {
  if (!body || typeof body !== "object") return [];
  if (Array.isArray(body.pics) && body.pics.length > 0) {
    const acc: string[] = [];
    for (const p of body.pics) {
      if (typeof p === "string" && p.length > 1000) acc.push(p);
    }
    if (acc.length > 0) return acc;
  }
  return [];
}

/**
 * Sweep pending rows for the given patient. For each pending row, hit
 * the IHKE3408S01 list endpoint (cache-busted) to find its current
 * seq, and fetch JPGs for rows whose seq is now allocated.
 *
 * v0.15+: SW direct fetch (no chrome.scripting). Cookies via
 * credentials: "include"; Bearer from saved token snapshot.
 *
 * Returns ImagingJpegResult-shaped objects so the caller can fold them
 * into the same Pass 1 / Pass 2 injection that pollFetchImagingJpegs
 * results go through.
 *
 * Does NOT modify the pending stash. The caller (sync orchestrator
 * or bg poll) is responsible for calling removePendingImaging() for
 * keys that successfully landed in the FHIR bundle — that way a row
 * whose bytes were fetched but couldn't be matched to a narrative
 * candidate (out of this sync's date range) stays in the stash for the
 * next sync to retry, instead of getting silently dropped.
 */
export async function sweepPendingImaging(
  baseUrl: string,
  patientId: string,
): Promise<ImagingJpegResult[]> {
  if (!patientId) return [];
  const pending = await loadPendingImaging(patientId);
  if (pending.length === 0) return [];

  const token = await loadBearerToken(patientId);
  if (!token) {
    console.warn(
      "[sweep] no bearer token snapshot for patient",
      patientId,
      "— treating as session-expired",
    );
    throw new Error(SESSION_EXPIRED_ERROR);
  }

  // Refresh list (cache-busted) to learn allocated seqs.
  const listUrl = `${baseUrl}/api/ihke3000/ihke3408s01/page_load?s_type=&s_sort=A1&_=${Date.now()}`;
  const listResp = await swFetchNhiJson(listUrl, token);
  if (listResp.error === "SESSION_EXPIRED") {
    throw new Error(SESSION_EXPIRED_ERROR);
  }
  if (listResp.error || !listResp.body) {
    console.warn("[sweep] list refresh failed:", listResp.error);
    return [];
  }
  const list = (listResp.body as any).sp_IHKE3408S01_data || [];
  // Indexes over the list for sweep-time eviction + JPG lookup:
  //   seqByRid     — rid → ipL_CASE_SEQ_NO (only rows that have one)
  //   oriTypeByRid — rid → ori_TYPE (E/A/B/C/D). Pending rids that
  //                  resolve to non-E channels are narrative channels
  //                  (A=不定期 / B=定期 upload) that can NEVER produce
  //                  JPGs by design — confirmed via NHI's own
  //                  ori_TYPE_NAME field in IHKE3408S02 detail body
  //                  (live-probed 2026-06-04).
  // Multi-casing fallback throughout because NHI's field naming drifts
  // between endpoints.
  const seqByRid = new Map<string, string>();
  const oriTypeByRid = new Map<string, string>();
  const statusByRid = new Map<string, string>();
  let rowsWithSeq = 0;
  for (const row of list) {
    const seq = String(row?.ipL_CASE_SEQ_NO ?? row?.ipl_CASE_SEQ_NO ?? row?.IPL_CASE_SEQ_NO ?? "");
    const rid = String(row?.row_ID ?? row?.rowid ?? row?.rowID ?? row?.roW_ID ?? "");
    const oriType = String(row?.ori_TYPE ?? row?.ori_type ?? "");
    const status = String(row?.jpG_STATUS ?? row?.jpg_STATUS ?? row?.JPG_STATUS ?? "");
    if (rid) {
      oriTypeByRid.set(rid, oriType);
      statusByRid.set(rid, status);
    }
    if (seq && seq !== "-" && rid) {
      seqByRid.set(rid, seq);
      rowsWithSeq++;
    }
  }
  // Auto-evict pending entries whose rid is no longer in the current
  // list at all — those rows have rolled off NHI's window and aren't
  // recoverable. Channel-based eviction (the old "rid resolves to
  // non-E → drop") was removed in v0.15.5 because the candidate gate
  // no longer filters by channel either. If a pending entry's rid is
  // still in list, it's a legitimate in-flight prep regardless of
  // channel — let stuck-retry attempt re-trigger and content dedup
  // handle the rest. 8-day pending-stash TTL is the upper bound.
  // Evict pending entries NHI can no longer fulfil — rid rolled off the list,
  // OR settled to "2" (無影像檔 final verdict; e.g. a DCM-only row whose S03
  // returns empty pics forever). Without the "2" rule such a row loops as
  // 前次等候 every sync + fires the false "備製中" tail. See shouldEvictPendingRow.
  const evictKeys = new Set<string>();
  for (const p of pending) {
    const rid = String(p.rid);
    if (shouldEvictPendingRow(oriTypeByRid.get(rid), statusByRid.get(rid))) {
      evictKeys.add(`${p.rid}|${p.ctype}`);
    }
  }
  if (evictKeys.size > 0) {
    console.info(
      `[sweep] auto-evicting ${evictKeys.size} stale pending entries (rid missing from current list)`,
    );
    try {
      await removePendingImaging(patientId, evictKeys);
    } catch {}
  }
  // Filter pending down to live image-channel entries only.
  const livePending = pending.filter((p) => !evictKeys.has(`${p.rid}|${p.ctype}`));
  if (livePending.length === 0) {
    console.info("[sweep] all pending entries evicted, nothing to fetch");
    return [];
  }
  // Diagnostic: dump list size + seq availability + sample so the user
  // can compare against what the NHI UI shows. Remove once auto-sweep
  // is verified end-to-end in production.
  console.info(`[sweep] list returned ${list.length} rows, ${rowsWithSeq} with seq populated`);
  if (list.length > 0) {
    const sample = list.slice(0, 3).map((r: any) => ({
      row_ID: r?.row_ID ?? r?.rowid ?? r?.rowID ?? r?.roW_ID ?? "(missing)",
      jpG_STATUS: r?.jpG_STATUS ?? r?.jpg_STATUS ?? r?.JPG_STATUS ?? "(missing)",
      ipL_CASE_SEQ_NO:
        r?.ipL_CASE_SEQ_NO ?? r?.ipl_CASE_SEQ_NO ?? r?.IPL_CASE_SEQ_NO ?? "(missing)",
    }));
    console.info("[sweep] list sample (first 3 rows):", sample);
  }
  console.info(
    `[sweep] live pending rids (${livePending.length}/${pending.length}, after evict):`,
    livePending.slice(0, 5).map((p) => p.rid),
    pending.length > 5 ? `(+${pending.length - 5} more)` : "",
  );

  // Batched parallel fetch JPGs per pending row (live entries only —
  // shadow and missing-from-list entries were already evicted above).
  //
  // v0.15+: cap concurrent in-flight S03 fetches at SWEEP_BATCH_SIZE.
  // Same rationale as Step A in pollFetchImagingJpegs — slow networks
  // + many parallel 1-3 MB image fetches saturate the link and time
  // out individually. Sweep can contain 10+ rows (carried from many
  // syncs), so capacity-capping is especially important here.
  const SWEEP_BATCH_SIZE = 5;
  async function runSweepBatched<T, R>(
    items: T[],
    size: number,
    fn: (it: T) => Promise<R>,
  ): Promise<R[]> {
    const results: R[] = [];
    for (let i = 0; i < items.length; i += size) {
      const batchResults = await Promise.all(items.slice(i, i + size).map(fn));
      for (const r of batchResults) results.push(r);
    }
    return results;
  }
  const SESSION_SENTINEL = Symbol("session-expired");
  const settled = await runSweepBatched(livePending, SWEEP_BATCH_SIZE, async (p) => {
    const seq = seqByRid.get(String(p.rid));
    if (!seq) {
      return {
        rid: p.rid,
        ctype: p.ctype,
        iplCaseSeqNo: null,
        jpgBase64s: [] as string[],
        outcome: "triggered-waiting" as const,
      };
    }
    const u = `${baseUrl}/api/ihke3000/IHKE3408S03/page_load?IPL_CASE_SEQ_NO=${encodeURIComponent(seq)}`;
    const r = await swFetchNhiJson(u, token);
    if (r.error === "SESSION_EXPIRED") {
      return SESSION_SENTINEL as unknown as ImagingJpegResult;
    }
    if (r.error) {
      return {
        rid: p.rid,
        ctype: p.ctype,
        iplCaseSeqNo: seq,
        jpgBase64s: [] as string[],
        outcome: "triggered-waiting" as const,
        error: r.error,
      };
    }
    const b64s = readBase64JpgsFromBody(r.body);
    if (b64s.length === 0) {
      return {
        rid: p.rid,
        ctype: p.ctype,
        iplCaseSeqNo: seq,
        jpgBase64s: [] as string[],
        outcome: "triggered-waiting" as const,
      };
    }
    return {
      rid: p.rid,
      ctype: p.ctype,
      iplCaseSeqNo: seq,
      jpgBase64s: b64s,
      outcome: "triggered-ready" as const,
    };
  });
  if (settled.some((x) => (x as any) === SESSION_SENTINEL)) {
    throw new Error(SESSION_EXPIRED_ERROR);
  }
  return settled as ImagingJpegResult[];
}

/**
 * Legacy chrome.scripting-based sweep — kept around as DEAD CODE for
 * now. Replaced by the SW-direct-fetch version above. Will be removed
 * once the new implementation has shipped + been verified for a few
 * release cycles. The signature differs (no tabId) so callers must
 * migrate to the new function.
 *
 * @deprecated Use sweepPendingImaging (SW-fetch). Remove after verification.
 */
async function _legacySweepPendingImagingViaScript(
  tabId: number,
  baseUrl: string,
  patientId: string,
): Promise<ImagingJpegResult[]> {
  if (!patientId) return [];
  const pending = await loadPendingImaging(patientId);
  if (pending.length === 0) return [];

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: async (base: any, pendingList: any) => {
      const token = sessionStorage.getItem("token");
      if (!token) return { error: "SESSION_EXPIRED" };
      if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
        return { error: "SESSION_EXPIRED" };
      }
      const auth = `Bearer ${token}`;

      async function httpGetJson(url: string): Promise<any> {
        const ac = new AbortController();
        // 15s per-request (down from 30s). With parallel row fetches,
        // a single slow fetch shouldn't block the others for long;
        // 15s is plenty for NHI's normal response time.
        const t = setTimeout(() => ac.abort(), 15000);
        try {
          const r = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
            signal: ac.signal,
            headers: {
              Accept: "application/json",
              Authorization: auth,
              "X-Requested-With": "XMLHttpRequest",
            },
          });
          clearTimeout(t);
          if (r.status === 401 || r.status === 403) {
            return { error: "SESSION_EXPIRED" };
          }
          if (!r.ok) return { error: `HTTP ${r.status}` };
          return { body: await r.json() };
        } catch (e: any) {
          clearTimeout(t);
          return {
            error: e?.name === "AbortError" ? "timeout 15s" : String(e?.message || e),
          };
        }
      }

      function readBase64Jpgs(body: any): string[] {
        if (!body || typeof body !== "object") return [];
        if (Array.isArray(body.pics) && body.pics.length > 0) {
          const acc: string[] = [];
          for (const p of body.pics) {
            if (typeof p === "string" && p.length > 1000) acc.push(p);
          }
          if (acc.length > 0) return acc;
        }
        return [];
      }

      // Refresh list with cache-bust to see latest seq state.
      const listUrl = `${base}/api/ihke3000/ihke3408s01/page_load?s_type=&s_sort=A1&_=${Date.now()}`;
      const listResp = await httpGetJson(listUrl);
      if (listResp.error === "SESSION_EXPIRED") {
        return { error: "SESSION_EXPIRED" };
      }
      if (listResp.error || !listResp.body) return { results: [] };
      const list = listResp.body.sp_IHKE3408S01_data || [];
      const seqByRid = new Map<string, string>();
      for (const row of list) {
        const seq = String(row?.ipL_CASE_SEQ_NO ?? row?.ipl_CASE_SEQ_NO ?? "");
        if (seq && seq !== "-" && row?.row_ID) {
          seqByRid.set(String(row.row_ID), seq);
        }
      }

      // Parallel fetches — sweep can have 10–50 pending rows (carried
      // from many syncs); sequential would take 10+ min. NHI's per-
      // token concurrent limit hasn't shown up in our testing; if it
      // does we'll throttle here.
      const SESSION_SENTINEL = Symbol("session-expired");
      const settled = await Promise.all(
        pendingList.map(async (p: any) => {
          const seq = seqByRid.get(String(p.rid));
          if (!seq) {
            return {
              rid: p.rid,
              ctype: p.ctype,
              iplCaseSeqNo: null,
              jpgBase64s: [],
              outcome: "triggered-waiting",
            };
          }
          const u = `${base}/api/ihke3000/IHKE3408S03/page_load?IPL_CASE_SEQ_NO=${encodeURIComponent(seq)}`;
          const r = await httpGetJson(u);
          if (r.error === "SESSION_EXPIRED") {
            return SESSION_SENTINEL;
          }
          if (r.error) {
            return {
              rid: p.rid,
              ctype: p.ctype,
              iplCaseSeqNo: seq,
              jpgBase64s: [],
              outcome: "triggered-waiting",
              error: r.error,
            };
          }
          const b64s = readBase64Jpgs(r.body);
          if (b64s.length === 0) {
            return {
              rid: p.rid,
              ctype: p.ctype,
              iplCaseSeqNo: seq,
              jpgBase64s: [],
              outcome: "triggered-waiting",
            };
          }
          return {
            rid: p.rid,
            ctype: p.ctype,
            iplCaseSeqNo: seq,
            jpgBase64s: b64s,
            outcome: "triggered-ready",
          };
        }),
      );
      if (settled.some((x) => x === SESSION_SENTINEL)) {
        return { error: "SESSION_EXPIRED" };
      }
      return { results: settled };
    },
    args: [baseUrl, pending],
  });

  if (result?.error === "SESSION_EXPIRED") {
    throw new Error(SESSION_EXPIRED_ERROR);
  }
  return (result?.results || []) as ImagingJpegResult[];
}

/**
 * Race a promise against a timeout. Resolves with the promise's value
 * if it settles first; rejects with a timeout error if the timeout
 * fires first. Used by sweep / poll callers to bound chrome.scripting
 * .executeScript hangs (the API has no native timeout — if the target
 * tab is throttled or unresponsive, calls can hang indefinitely).
 */
function raceTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timeout ${Math.round(ms / 1000)}s`)), ms),
    ),
  ]);
}

/**
 * Sweep with a hard SW-side timeout. Belt-and-suspenders: the SW-fetch
 * implementation has per-request AbortController timeouts already, so
 * a top-level timeout shouldn't fire in practice — but it bounds the
 * worst case if something unexpected hangs (e.g. NHI returns a streaming
 * response that never closes).
 */
export async function sweepPendingImagingWithTimeout(
  baseUrl: string,
  patientId: string,
  timeoutMs = 60_000,
): Promise<ImagingJpegResult[]> {
  return raceTimeout(sweepPendingImaging(baseUrl, patientId), timeoutMs, "sweep");
}
