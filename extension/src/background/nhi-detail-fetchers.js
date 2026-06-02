// Detail fan-out for the six NHI S02 endpoints (meds / chronic meds /
// imaging / procedures / encounters / inpatient). Each endpoint's list
// call only ships visit metadata; the actual drugs / reports / PCS codes
// / bilingual diagnoses live behind a per-row S02 detail fetch.
//
// All six used to be ~90%-identical copy-pastes. They differ only in
// SERIALIZABLE data — NHI path, main-data JSON key, the ctype probe
// order, and how "this body has data" is decided — so a single
// config-driven in-tab fetcher (`fetchDetailsInTab`) does the network
// fan-out and the per-endpoint wrappers handle SW-side adaptation.
//
// Risk note (executeScript closure boundary): the injected `func` runs
// in the NHI page's context and CANNOT capture anything from this
// module — only the serializable `args` cross. So the spec is plain
// data (strings / numbers / booleans) and every adapter call happens
// back here in the service worker, never inside the tab.

import {
  adaptImagingReportFromDetail,
  adaptMedicationFromDetail,
  adaptProcedureFromDetail,
} from "../nhi-adapters.js";
import { SESSION_EXPIRED_ERROR } from "./constants.js";

// Generic per-row detail fan-out inside the NHI tab. `spec` is fully
// serializable (see the per-endpoint constants below). Returns the raw
// per-row results array: each element is `{ body }`, `{ error }`, or
// `{ body: null }`. SW-side wrappers turn that into adapted resources or
// an index→body Map. Throws SESSION_EXPIRED_ERROR only on the pre-fetch
// token/IDLE check — per-row session expiry is left in the results and
// skipped downstream (matches the pre-split behaviour).
async function fetchDetailsInTab(tabId, baseUrl, items, spec) {
  if (items.length === 0) return [];

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: async (base, reqs, cfg) => {
      const token = sessionStorage.getItem("token");
      if (!token) return { error: "SESSION_EXPIRED" };
      if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
        return { error: "SESSION_EXPIRED" };
      }
      const auth = `Bearer ${token}`;

      async function fetchOne(rowId, ctype) {
        const url = `${base}/api/ihke3000/${cfg.path}/page_load?crid=${encodeURIComponent(rowId)}&ctype=${encodeURIComponent(ctype)}`;
        const ac = new AbortController();
        const t = setTimeout(() => ac.abort(), 30000);
        try {
          const r = await fetch(url, {
            method: "GET", credentials: "same-origin", signal: ac.signal,
            headers: { "Accept": "application/json", "Authorization": auth },
          });
          clearTimeout(t);
          if (r.status === 401 || r.status === 403) return { error: "SESSION_EXPIRED" };
          if (!r.ok) return { error: `HTTP ${r.status}` };
          return { body: await r.json() };
        } catch (e) {
          clearTimeout(t);
          return { error: e.name === "AbortError" ? "timeout 30s" : String(e?.message || e) };
        }
      }

      // "this body carries data" — drugs (nested sub-list) vs a non-empty
      // main-data array.
      function hasData(body) {
        const main = Array.isArray(body?.[cfg.mainDataKey]) ? body[cfg.mainDataKey] : [];
        if (cfg.presence === "drugs") {
          return main.some(
            (v) => Array.isArray(v?.[cfg.drugListKey]) && v[cfg.drugListKey].length > 0,
          );
        }
        return main.length > 0;
      }

      // Ordered ctype probe list: the row's own ctype first (when the
      // endpoint declares one), then the brute-force fallbacks, deduped.
      function ctypeSeq(rowCtype) {
        const seq = [];
        if (cfg.useRowCtype && rowCtype) seq.push(rowCtype);
        for (const ct of cfg.ctypes) {
          if (!seq.map(String).includes(String(ct))) seq.push(ct);
        }
        return seq;
      }

      async function one(rowId, rowCtype) {
        const seq = ctypeSeq(rowCtype);
        // presence:"none" → single fetch, take whatever comes back
        // (imaging — the row's ctype is authoritative, no probing).
        if (cfg.presence === "none") return await fetchOne(rowId, seq[0]);

        let lastOk = null;
        for (const ct of seq) {
          const r = await fetchOne(rowId, ct);
          if (r.error === "SESSION_EXPIRED") return r;
          if (r.error) continue;
          if (hasData(r.body)) return r;
          lastOk = r; // body present but empty main-data
        }
        // No ctype yielded data — endpoint-specific fallback.
        if (cfg.fallback === "fetch") return await fetchOne(rowId, cfg.fallbackCtype);
        if (cfg.fallback === "last-ok") return lastOk || { error: "no detail body" };
        if (cfg.fallback === "null") return null;
        return { body: null }; // "empty-body"
      }

      const out = new Array(reqs.length);
      let next = 0;
      const CONC = 3;
      async function worker() {
        while (next < reqs.length) {
          const i = next++;
          await new Promise((r) => setTimeout(r, Math.random() * 50));
          out[i] = await one(reqs[i].row_ID, reqs[i].ctype);
        }
      }
      const ws = [];
      for (let w = 0; w < CONC && w < reqs.length; w++) ws.push(worker());
      await Promise.all(ws);
      return { results: out };
    },
    args: [baseUrl, items, spec],
  });

  if (result?.error === "SESSION_EXPIRED") throw new Error(SESSION_EXPIRED_ERROR);
  return result?.results || [];
}

// IHKE3306S02 — drugs live under ihke3306S02_main_data[*].sp_IHKE3306S03_data_list.
// NHI uses different ctype values for 西醫/中醫/牙醫/處方箋; we don't have the
// public mapping, so brute-force 2,1,3,4 and stop on the first body with
// drugs. If none yield drugs, fall back to ctype 2's body so diagnostics
// still see the visit metadata.
const MEDICATION_SPEC = {
  path: "IHKE3306S02",
  mainDataKey: "ihke3306S02_main_data",
  drugListKey: "sp_IHKE3306S03_data_list",
  ctypes: [2, 1, 3, 4],
  useRowCtype: false,
  presence: "drugs",
  fallback: "fetch",
  fallbackCtype: 2,
};

// Chronic prescriptions: same endpoint, but rows carry their own
// ori_TYPE (1=門診, 2=IC卡, 8=藥局) — probe it first, then brute-force
// 1,2,8,3,4 so a misclassified row still surfaces its drugs. No fallback
// body (return null) when nothing comes back. Every drug → is_chronic.
const CHRONIC_MEDICATION_SPEC = {
  path: "IHKE3306S02",
  mainDataKey: "ihke3306S02_main_data",
  drugListKey: "sp_IHKE3306S03_data_list",
  ctypes: [1, 2, 8, 3, 4],
  useRowCtype: true,
  presence: "drugs",
  fallback: "null",
};

// IHKE3408S02 imaging report — single fetch with the row's ori_TYPE
// (A / E / …); no probing, no presence gate.
const IMAGING_SPEC = {
  path: "IHKE3408S02",
  mainDataKey: "ihke3408S02_main_data",
  ctypes: [],
  useRowCtype: true,
  presence: "none",
};

// IHKE3308S02 procedures — the row's ori_type first, then brute-force
// 3,5,1,2,4. Presence = non-empty main-data (the ICD-10-PCS op_CODE +
// exe_S_DATE live there). On total miss return the last body-present
// response so partial metadata still surfaces.
const PROCEDURE_SPEC = {
  path: "IHKE3308S02",
  mainDataKey: "ihke3308S02_main_data",
  ctypes: ["3", "5", "1", "2", "4"],
  useRowCtype: true,
  presence: "main",
  fallback: "last-ok",
};

// IHKE3303S02 OPD encounter classification — probe 2,1,3,4,5 for the
// ctype that returns non-empty main-data. Returns body-by-index; the
// orchestrator re-adapts each visit with the discovered class +
// bilingual primary ICD + secondary diagnoses.
const ENCOUNTER_SPEC = {
  path: "IHKE3303S02",
  mainDataKey: "ihke3303S02_main_data",
  ctypes: [2, 1, 3, 4, 5],
  useRowCtype: false,
  presence: "main",
  fallback: "empty-body",
};

// IHKE3309S02 inpatient — ctype=3 (住院) is the only value that returns
// data per live probe; 2/1 kept as defensive fallbacks. Returns
// body-by-index like encounters.
const INPATIENT_SPEC = {
  path: "IHKE3309S02",
  mainDataKey: "ihke3309S02_main_data",
  ctypes: [3, 2, 1],
  useRowCtype: false,
  presence: "main",
  fallback: "empty-body",
};

function rowId(v) {
  return v.row_ID || v.rowid || v.rowID || "";
}

// Flatten S02 medication bodies → adapted drug rows. `adaptOpts` is
// passed through to adaptMedicationFromDetail (null for regular meds,
// { is_chronic: true } for chronic prescriptions).
function collectDrugs(results, spec, adaptOpts) {
  const drugs = [];
  for (const r of results) {
    if (!r || r.error || !r.body) continue;
    const main = Array.isArray(r.body[spec.mainDataKey]) ? r.body[spec.mainDataKey] : [];
    for (const visit of main) {
      const drugList = Array.isArray(visit[spec.drugListKey]) ? visit[spec.drugListKey] : [];
      for (const d of drugList) {
        const adapted = adaptMedicationFromDetail(d, visit, adaptOpts);
        if (adapted) drugs.push(adapted);
      }
    }
  }
  return drugs;
}

// Pair each result back to its visit index → Map<idx, body|null>. Used
// by encounters + inpatient, whose re-adaptation runs in the orchestrator.
function byVisitIndex(reqs, results) {
  const byIdx = new Map();
  for (let i = 0; i < reqs.length; i++) {
    byIdx.set(reqs[i].idx, results[i]?.body || null);
  }
  return byIdx;
}

// `skipRowIds`: Set<string> of row_IDs already fetched by another fan-out
// (the chronic prescriptions pass). When the chronic list and the regular
// meds list share a row_ID, we skip the regular call to avoid double-
// emitting the same drugs.
export async function fetchMedicationDetails({ tabId, baseUrl, visits, skipRowIds }) {
  const skip = skipRowIds instanceof Set ? skipRowIds : new Set(skipRowIds || []);
  const reqs = visits
    .map((v) => ({ row_ID: rowId(v) }))
    .filter((r) => r.row_ID && !skip.has(r.row_ID));
  const results = await fetchDetailsInTab(tabId, baseUrl, reqs, MEDICATION_SPEC);
  return collectDrugs(results, MEDICATION_SPEC, null);
}

export async function fetchChronicMedicationDetails({ tabId, baseUrl, visits }) {
  const reqs = visits
    .map((v) => ({ row_ID: rowId(v), ctype: String(v.ori_TYPE || v.ori_type || "") }))
    .filter((r) => r.row_ID);
  const results = await fetchDetailsInTab(tabId, baseUrl, reqs, CHRONIC_MEDICATION_SPEC);
  return collectDrugs(results, CHRONIC_MEDICATION_SPEC, { is_chronic: true });
}

export async function fetchImagingDetails({ tabId, baseUrl, visits }) {
  const reqs = visits
    .map((v) => ({ row_ID: rowId(v), ctype: v.ori_TYPE || v.ori_type || "A" }))
    .filter((r) => r.row_ID);
  const results = await fetchDetailsInTab(tabId, baseUrl, reqs, IMAGING_SPEC);
  const reports = [];
  for (const r of results) {
    if (!r || r.error || !r.body) continue;
    const main = Array.isArray(r.body[IMAGING_SPEC.mainDataKey]) ? r.body[IMAGING_SPEC.mainDataKey] : [];
    for (const visit of main) {
      const adapted = adaptImagingReportFromDetail(visit);
      if (adapted) reports.push(adapted);
    }
  }
  return reports;
}

export async function fetchProcedureDetails({ tabId, baseUrl, visits }) {
  const reqs = visits
    .map((v) => ({
      row_ID: v.row_ID || v.row_id || v.rowid || v.rowID || "",
      ctype: v.ori_type || v.ori_TYPE || "",
    }))
    .filter((r) => r.row_ID);
  const results = await fetchDetailsInTab(tabId, baseUrl, reqs, PROCEDURE_SPEC);
  const procedures = [];
  for (const r of results) {
    if (!r || r.error || !r.body) continue;
    const main = Array.isArray(r.body[PROCEDURE_SPEC.mainDataKey]) ? r.body[PROCEDURE_SPEC.mainDataKey] : [];
    for (const row of main) {
      const adapted = adaptProcedureFromDetail(row);
      if (adapted) procedures.push(adapted);
    }
  }
  return procedures;
}

export async function fetchEncounterDetails({ tabId, baseUrl, visits }) {
  const reqs = visits
    .map((v, idx) => ({ idx, row_ID: v.roW_ID || v.row_ID || "" }))
    .filter((r) => r.row_ID);
  if (reqs.length === 0) return new Map();
  const results = await fetchDetailsInTab(tabId, baseUrl, reqs, ENCOUNTER_SPEC);
  return byVisitIndex(reqs, results);
}

export async function fetchInpatientDetails({ tabId, baseUrl, visits }) {
  const reqs = visits
    .map((v, idx) => ({ idx, row_ID: v.row_ID || v.row_id || v.roW_ID || "" }))
    .filter((r) => r.row_ID);
  if (reqs.length === 0) return new Map();
  const results = await fetchDetailsInTab(tabId, baseUrl, reqs, INPATIENT_SPEC);
  return byVisitIndex(reqs, results);
}
