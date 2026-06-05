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
 * Returns `Map<row_ID, htmlString>` for rows that succeeded; row IDs
 * that errored or returned no `file_name` simply don't appear in the
 * map. Caller (orchestrator) consults the map by row_ID when building
 * adapter rows for the mapper.
 */
export async function fetchDischargeSummaryHtmls({
  tabId,
  baseUrl,
  candidates,
}: {
  tabId: number;
  baseUrl: string;
  candidates: Array<{ rowId: string; ctype: string }>;
}): Promise<Map<string, string>> {
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return new Map();
  }
  const reqs = candidates.filter((c) => c?.rowId);
  if (reqs.length === 0) return new Map();

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: async (base: string, items: Array<{ rowId: string; ctype: string }>) => {
      const token = sessionStorage.getItem("token");
      if (!token) return { error: "SESSION_EXPIRED" };
      if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
        return { error: "SESSION_EXPIRED" };
      }
      const auth = `Bearer ${token}`;

      async function fetchOne(rowId: string, ctype: string) {
        const url =
          `${base}/api/ihke3000/IHKE3309S02/getxml` +
          `?crid=${encodeURIComponent(rowId)}&ctype=${encodeURIComponent(ctype || "3")}`;
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
          if (!html) return { error: "no html in body" };
          return { html };
        } catch (e: any) {
          clearTimeout(t);
          return { error: e?.name === "AbortError" ? "timeout 20s" : String(e?.message || e) };
        }
      }

      // Bounded concurrency mirroring `fetchDetailsInTab`. The getxml
      // endpoint streams ~13 KB per row; CONC=3 keeps NHI side from
      // throttling without making 100-row patients take a minute.
      const out: Array<{ rowId: string; html?: string; error?: string }> = new Array(items.length);
      let next = 0;
      const CONC = 3;
      async function worker() {
        while (next < items.length) {
          const i = next++;
          // Tiny jitter so 3 workers don't all hit NHI at the same
          // microsecond (mirrors fetchDetailsInTab).
          await new Promise((r) => setTimeout(r, Math.random() * 50));
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
  const results: Array<{ rowId: string; html?: string }> = (result as any)?.results || [];
  const map = new Map<string, string>();
  for (const r of results) {
    if (r && r.rowId && typeof r.html === "string" && r.html.length > 0) {
      map.set(r.rowId, r.html);
    }
  }
  return map;
}
