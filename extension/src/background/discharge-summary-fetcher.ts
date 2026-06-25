// Discharge-summary HTML fan-out — `/api/ihke3000/IHKE3309S02/getxml`.
//
// NHI publishes the inpatient 出院病摘 as a pre-rendered HTML document
// wrapped in a JSON envelope:
//   GET /api/ihke3000/IHKE3309S02/getxml?crid=<rowid>&ctype=3
//   Authorization: Bearer <sessionStorage.token>
//   → 200 application/json
//      { "file_name": "<html string, ~13 KB>" }
//
// The field is misnamed (`file_name`) but it's the actual HTML body the
// 健康存摺 "查看檔案" modal renders verbatim. The `xmlns:IHK="urn:hl7-
// org:v3"` root attribute is residual from NHI's CDA-derived rendering
// pipeline; the payload is HTML, not CDA.
//
// Candidacy gate — the S02 detail body (which the inpatient orchestrator
// already fetches via `fetchInpatientDetails`) ships the binary flags
// `has_XML` and `has_PDF`. v0.16 surfaces only `has_XML="Y"` rows; PDF
// support is a deliberate follow-up (no live-probed example yet).
//
// Same in-tab executeScript pattern as the rest of nhi-detail-fetchers.ts:
// the injected closure runs in the NHI page's context so the Bearer
// token in sessionStorage is reachable. SW-side adaptation happens
// after the network fan-out resolves.

import { SESSION_EXPIRED_ERROR } from "./constants.js";

/**
 * Fetch `getxml` HTML payloads for the given inpatient rows.
 *
 * `candidates` is the orchestrator-filtered list — only rows whose
 * `has_XML === "Y"` flag fired in the S02 detail body. Empty input
 * short-circuits with an empty Map.
 *
 * Returns `{ map: Map<row_ID, htmlString>, reasons: {error → count} }`.
 * Successful rows go in the map; failed rows (error / no `file_name`) are
 * tallied into `reasons` so the breakdown can show WHY 病摘 were lost
 * (登入過期/401 vs 逾時 vs …) instead of a bare "N 抓取失敗".
 */
export async function fetchDischargeSummaryHtmls({
  tabId,
  baseUrl,
  candidates,
}: {
  tabId: number;
  baseUrl: string;
  candidates: Array<{ rowId: string; ctype: string }>;
}): Promise<{ map: Map<string, string>; reasons: Record<string, number> }> {
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return { map: new Map(), reasons: {} };
  }
  const reqs = candidates.filter((c) => c?.rowId);
  if (reqs.length === 0) return { map: new Map(), reasons: {} };

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: async (base: string, items: Array<{ rowId: string; ctype: string }>) => {
      const token = sessionStorage.getItem("token");
      if (!token) return { error: "SESSION_EXPIRED" };
      if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
        return { error: "SESSION_EXPIRED" };
      }
      const auth = `Bearer ${token}`;

      // One getxml attempt → {html} | {error} (stop) | {retry} (transient).
      async function attemptGetxml(url: string) {
        const ac = new AbortController();
        const t = setTimeout(() => ac.abort(), 20000);
        try {
          const r = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
            signal: ac.signal,
            headers: { Accept: "application/json", Authorization: auth },
          });
          clearTimeout(t);
          if (r.status === 401 || r.status === 403) return { error: "SESSION_EXPIRED" };
          // Transient server states — retry rather than drop a 病摘 the gate
          // (has_XML="Y") already confirmed exists.
          if (r.status === 429 || r.status >= 500) return { retry: `HTTP ${r.status}` };
          if (!r.ok) return { error: `HTTP ${r.status}` };
          const body: any = await r.json();
          // NHI's envelope: `file_name` is the field that carries the
          // HTML string. Anything else (string keyed differently, no
          // envelope, etc.) is treated as missing — we'd rather skip a
          // row than emit a DocumentReference with empty/corrupt content.
          const html =
            body && typeof body.file_name === "string" && body.file_name.length > 0
              ? body.file_name
              : null;
          // has_XML="Y" promised a document, so an empty body is far more likely a
          // transient NHI hiccup than a real absence — retry before giving up.
          if (!html) return { retry: "no html in body" };
          return { html };
        } catch (e: any) {
          clearTimeout(t);
          // Network drop / 20s timeout — transient, retry.
          return { retry: e?.name === "AbortError" ? "timeout 20s" : String(e?.message || e) };
        }
      }

      // Retry transient failures (timeout / 5xx / 429 / network / empty body)
      // with backoff. Without this a single network blip SILENTLY drops a 出院
      //病摘 the gate already confirmed exists — the v1.0.6 miss (P22074 2025-01-17
      // etc.: has_XML=Y, getxml 200 + real 病摘, lost to a no-retry blip during a
      // 26-stay fan-out). SESSION_EXPIRED and deterministic 4xx stop immediately.
      async function fetchOne(rowId: string, ctype: string) {
        const url =
          `${base}/api/ihke3000/IHKE3309S02/getxml` +
          `?crid=${encodeURIComponent(rowId)}&ctype=${encodeURIComponent(ctype || "3")}`;
        const MAX = 3;
        let last = "unknown";
        for (let i = 0; i < MAX; i++) {
          if (i > 0) await new Promise((r) => setTimeout(r, 1200 * i)); // 1.2s, 2.4s backoff
          const res: any = await attemptGetxml(url);
          if ("html" in res) return res;
          if (res.error) return res; // SESSION_EXPIRED / deterministic 4xx — stop
          last = res.retry; // transient — loop and retry
        }
        return { error: last };
      }

      // SERIAL (CONC=1) + pacing. NHI throttles rapid getxml bursts by returning
      // 401 — which the retry above deliberately SKIPS (401 = stop), so the 病摘 is
      // silently dropped. Real case (P22074 2026-06-25): 6/23 lost at CONC=3, and a
      // re-sync reproduced the SAME loss = NOT a transient blip — it's the burst
      // tripping NHI's rate limit. One-request-at-a-time with a gap stays under the
      // limit (the imaging "gentle > clever" lesson). ~23 rows × ~0.3s ≈ a few extra
      // seconds — reliability > speed for 出院病摘.
      const out: Array<{ rowId: string; html?: string; error?: string }> = new Array(items.length);
      let next = 0;
      const CONC = 1;
      async function worker() {
        while (next < items.length) {
          const i = next++;
          await new Promise((r) => setTimeout(r, 250)); // pace serial requests
          const item = items[i];
          if (!item) continue;
          const res = await fetchOne(item.rowId, item.ctype);
          if ("html" in res && typeof res.html === "string") {
            out[i] = { rowId: item.rowId, html: res.html };
          } else {
            out[i] = { rowId: item.rowId, error: (res as any).error || "unknown" };
          }
        }
      }
      const ws: Array<Promise<void>> = [];
      for (let w = 0; w < CONC && w < items.length; w++) ws.push(worker());
      await Promise.all(ws);
      return { results: out };
    },
    args: [baseUrl, reqs],
  });

  if ((result as any)?.error === "SESSION_EXPIRED") {
    throw new Error(SESSION_EXPIRED_ERROR);
  }
  const results: Array<{ rowId: string; html?: string; error?: string }> =
    (result as any)?.results || [];
  const map = new Map<string, string>();
  const reasons: Record<string, number> = {};
  for (const r of results) {
    if (r?.rowId && typeof r.html === "string" && r.html.length > 0) {
      map.set(r.rowId, r.html);
    } else if (r) {
      const k = String(r.error || "unknown");
      reasons[k] = (reasons[k] || 0) + 1;
    }
  }
  return { map, reasons };
}
