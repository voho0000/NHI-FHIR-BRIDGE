// Phase-1 list fetch: pull every NHI list endpoint in parallel inside
// the NHI tab (so same-origin cookies + the SPA's Bearer token flow
// naturally), then run each endpoint's SW-side adapter over the result.
//
// Detail enrichment (drugs / reports / diagnoses) happens later, per
// endpoint, in nhi-detail-fetchers.js.

import { NHI_API_ENDPOINTS } from "../nhi-endpoints.js";
import { SESSION_EXPIRED_ERROR } from "./constants.js";

// Fetch all endpoints in PARALLEL inside the NHI tab. Running in tab
// context means same-origin cookies are sent automatically — a fetch
// from the SW would be cross-origin and SameSite blocks the session
// cookie. `fetchSpec` is serializable ({ name, url, method }[]); adapters
// stay in the SW. Throws SESSION_EXPIRED_ERROR if any endpoint reports a
// rejected session, or "executeScript failed: …" if injection itself
// fails.
export async function fetchNhiListsInTab(tabId, fetchSpec) {
  let settledRaw: any;
  try {
    [{ result: settledRaw }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: async (specs) => {
        // NHI auth: cookies + JWT in sessionStorage. The SPA's axios sets
        // `Authorization: Bearer <token>` on every API call. Session
        // cookies alone return 401.
        const token = sessionStorage.getItem("token");
        if (!token) return [{ error: "SESSION_EXPIRED" }];
        const auth = `Bearer ${token}`;

        // Detect IDLE/timeout page already redirected on this tab.
        if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
          return [{ error: "SESSION_EXPIRED" }];
        }

        // 60-second timeout per fetch — some NHI endpoints (encounters,
        // meds) take 20+ seconds.
        async function fetchOne(s, ms) {
          const ac = new AbortController();
          const timer = setTimeout(() => ac.abort(), ms);
          try {
            const r = await fetch(s.url, {
              method: s.method,
              credentials: "same-origin",
              signal: ac.signal,
              headers: { Accept: "application/json", Authorization: auth },
            });
            clearTimeout(timer);
            const ct = r.headers.get("content-type") || "";
            if (r.status === 401 || r.status === 403) {
              return { name: s.name, error: "SESSION_EXPIRED" };
            }
            if (!r.ok) return { name: s.name, error: `HTTP ${r.status}` };
            if (!ct.includes("application/json")) {
              return { name: s.name, error: `non-JSON (ct=${ct})` };
            }
            let body: any;
            try {
              body = await r.json();
            } catch (e) {
              return { name: s.name, error: `JSON parse: ${e.message}` };
            }
            return { name: s.name, body };
          } catch (e) {
            clearTimeout(timer);
            if (e.name === "AbortError") return { name: s.name, error: "timeout 60s" };
            return { name: s.name, error: String(e?.message || e) };
          }
        }

        // Concurrency-limited execution: max 3 in flight at once. NHI's
        // abuse detection blocks bursts; with 11 parallel fetches it
        // throttled the session and redirected to IHKE3001S99_IDLE.
        // 3 at a time + 200ms jitter is gentle enough for 1-shot sync.
        const CONCURRENCY = 3;
        const JITTER_MS = 200;
        const results = new Array(specs.length);
        let nextIdx = 0;
        async function worker() {
          while (nextIdx < specs.length) {
            const i = nextIdx++;
            await new Promise((r) => setTimeout(r, Math.random() * JITTER_MS));
            results[i] = await fetchOne(specs[i], 60000);
          }
        }
        const workers = [];
        for (let w = 0; w < CONCURRENCY && w < specs.length; w++) {
          workers.push(worker());
        }
        await Promise.all(workers);
        return results;
      },
      args: [fetchSpec],
    });
  } catch (e) {
    throw new Error(`executeScript failed: ${e.message}`);
  }

  // Detect session expired across results.
  if (settledRaw.some((r) => r.error === "SESSION_EXPIRED")) {
    throw new Error(SESSION_EXPIRED_ERROR);
  }
  return settledRaw;
}

// First-entry "資料確認中" resolver for the imaging list (IHKE3408S01).
//
// On the FIRST access to a brand-new patient's imaging list, NHI returns
// every row with jpG_STATUS = "-" — its lazy server-side confirmation
// hasn't run yet. NHI's own SPA shows these rows as "資料確認中". A
// second list fetch a few seconds later flips each "-" to its real
// status ("1" ready / "A" needs-trigger / "0" preparing / "2" no-image).
// Live-probed 2026-06-08 on a fresh patient: 4 rows came back "-", all
// resolved to "2" within a single 10s wait.
//
// The bulk fetch in fetchNhiListsInTab captures whatever snapshot exists
// at sync start, so a never-before-synced patient's imaging list lands
// entirely as "-". Every "-" row then decodes as a NON-candidate (status
// is neither "1"/"A"/"0"), so bridge silently skips real images — the
// user had to run a SECOND sync to pick them up. This resolver closes
// that gap by re-fetching the list (cache-busted, same in-tab Bearer +
// same-origin cookie path as the bulk fetch) and polling until no row is
// "-" or maxAttempts is reached.
//
// The whole poll loop runs INSIDE one executeScript so the inter-attempt
// waits happen in the page context (no repeated SW round-trips). Returns
// the resolved rows (already run through extractList) for the caller to
// substitute. Caller decides whether to invoke this at all — it's only
// worth the latency when the user opted into image download, since
// narrative DR emission is unaffected by jpG_STATUS.
export async function refetchImagingListUntilResolved({
  tabId,
  url,
  maxAttempts = 4,
  intervalMs = 3000,
}: {
  tabId: number;
  url: string;
  maxAttempts?: number;
  intervalMs?: number;
}): Promise<{ rows: any[]; attempts: number; stillUnresolved: boolean; error?: string }> {
  let out: any;
  try {
    [{ result: out }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: async (baseUrl: string, maxA: number, intMs: number) => {
        const token = sessionStorage.getItem("token");
        if (!token) return { error: "SESSION_EXPIRED" };
        if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
          return { error: "SESSION_EXPIRED" };
        }
        const auth = `Bearer ${token}`;
        // In-page row extraction — mirrors the SW-side extractList's
        // imaging case. The list array key is sp_IHKE3408S01_data; NHI
        // mixes in UI-helper arrays (icd9cm_select etc.) we skip.
        const HELPER_RE = /select|option|dropdown|filter|sort|lookup/i;
        function rowsOf(body: any): any[] {
          if (body && Array.isArray(body.sp_IHKE3408S01_data)) return body.sp_IHKE3408S01_data;
          if (body && typeof body === "object") {
            for (const k of Object.keys(body)) {
              const v = (body as any)[k];
              if (Array.isArray(v) && !HELPER_RE.test(k)) return v;
            }
          }
          return [];
        }
        function hasUnresolved(rows: any[]): boolean {
          return rows.some((row) => {
            const s = String((row && (row.jpG_STATUS ?? row.jpg_STATUS ?? row.JPG_STATUS)) ?? "");
            return s === "-";
          });
        }
        async function fetchOnce() {
          const sep = baseUrl.includes("?") ? "&" : "?";
          const r = await fetch(`${baseUrl}${sep}_=${Date.now()}`, {
            method: "GET",
            credentials: "same-origin",
            headers: {
              Accept: "application/json",
              Authorization: auth,
              "X-Requested-With": "XMLHttpRequest",
            },
          });
          if (r.status === 401 || r.status === 403) return { error: "SESSION_EXPIRED" };
          if (!r.ok) return { error: `HTTP ${r.status}` };
          return { body: await r.json() };
        }
        let res: any = await fetchOnce();
        if (res.error) return res;
        let attempts = 1;
        while (hasUnresolved(rowsOf(res.body)) && attempts < maxA) {
          await new Promise((r) => setTimeout(r, intMs));
          const next: any = await fetchOnce();
          if (next.error) return { ...next, attempts };
          res = next;
          attempts++;
        }
        return { body: res.body, attempts, stillUnresolved: hasUnresolved(rowsOf(res.body)) };
      },
      args: [url, maxAttempts, intervalMs],
    });
  } catch (e: any) {
    throw new Error(`executeScript failed: ${e.message}`);
  }
  if (out?.error === "SESSION_EXPIRED") throw new Error(SESSION_EXPIRED_ERROR);
  if (out?.error) {
    return { rows: [], attempts: out.attempts ?? 0, stillUnresolved: true, error: out.error };
  }
  return {
    rows: extractList(out.body),
    attempts: out.attempts ?? 1,
    stillUnresolved: !!out.stillUnresolved,
  };
}

// Generic list extraction: handles all observed NHI shapes.
//   - Plain array (IHKE3409 lab)
//   - {sp_IHKE<X>_data: [...]}  (medications, allergies)
//   - {western_data, chinese_data, dentist_data: [...]} (encounter list,
//     split by 西醫/中醫/牙醫 — we want all three)
// For multi-array shapes we merge all arrays and tag each item with
// `__section` (the source key) so adapters can disambiguate.
export function extractList(body: any): any[] {
  if (Array.isArray(body)) return body;
  if (!body || typeof body !== "object") return [];
  let arrayKeys: [string, any[]][] = Object.entries(body as Record<string, any>).filter(([_, v]) =>
    Array.isArray(v),
  );
  if (arrayKeys.length === 0) return [];
  if (arrayKeys.length === 1) return arrayKeys[0][1];
  // Multiple arrays — drop UI-helper arrays (dropdown options, sort
  // selectors, lookup tables). NHI mixes them into the same response
  // (e.g. imaging returns sp_IHKE3408S01_data + icd9cm_select).
  const HELPER_RE = /select|option|dropdown|filter|sort|lookup/i;
  const dataKeys = arrayKeys.filter(([k]) => !HELPER_RE.test(k));
  if (dataKeys.length === 1) return dataKeys[0][1];
  if (dataKeys.length === 0) return arrayKeys[0][1]; // fallback
  arrayKeys = dataKeys;
  // Multiple data arrays (e.g. western_data/chinese_data/dentist_data)
  // — merge with __section tag so adapters can disambiguate.
  const merged = [];
  for (const [k, v] of arrayKeys) {
    for (const item of v) {
      if (item && typeof item === "object") {
        merged.push({ ...item, __section: k });
      } else {
        merged.push(item);
      }
    }
  }
  return merged;
}

// Apply each endpoint's SW-side adapter to its raw body. Mirrors the
// settled-promise shape ({ status, value | reason }) the orchestrator
// expects. Adapters return one item, null/undefined (skip), or an array
// (e.g. adaptAdultPreventive unfolds one screening row into ~15 obs);
// all three shapes are flattened. A `bodySample` snapshot is captured
// for endpoints where the adapter rejected every row (raw>0, adapted=0)
// so the diagnostic breakdown can show what shape we failed to read.
export function adaptSettledLists(settledRaw) {
  return settledRaw.map((r, i) => {
    const ep = NHI_API_ENDPOINTS[i];
    if (r.error) {
      return { status: "rejected", reason: { message: `${ep.name}: ${r.error}` } };
    }
    const list = extractList(r.body);
    const items = [];
    for (const it of list) {
      const r = (ep.adapt as any)(it);
      if (r === null || r === undefined) continue;
      if (Array.isArray(r)) {
        for (const x of r) if (x) items.push(x);
      } else {
        items.push(r);
      }
    }
    let bodySample = null;
    if (list.length > 0 && items.length === 0) {
      // Include the FIRST ITEM (full keys+values) so we can build the
      // correct adapter without another round-trip. NHI items may include
      // PII; the user inspects this locally via service-worker devtools.
      bodySample = JSON.stringify({
        topLevelKeys: Array.isArray(r.body) ? null : Object.keys(r.body || {}).slice(0, 10),
        wasArray: Array.isArray(r.body),
        firstItem: list[0] ?? null,
        secondItem: list[1] ?? null,
      }).slice(0, 4000);
    }
    return {
      status: "fulfilled",
      value: { ep, items, raw_count: list.length, bodySample, rawList: list },
    };
  });
}
