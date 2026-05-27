// Service worker for NHI-FHIR Bridge — owns the long-running
// "Sync This Patient" workflow so the popup can close mid-sync without
// aborting it.
//
// Lifecycle:
//   - popup posts {type: "startNhiApiSync", payload}  → NHI JSON-API sync
//   - background runs the full sync sequence, updating chrome.storage.local
//   - popup reads chrome.storage.local on reopen to show progress
//
// Modes:
//   - "local"   → after NHI fetch, run mappers in-extension, download a
//                 FHIR Bundle to the user's machine. No backend required.
//   - "backend" → POST per-page_type items to /sync/upload-structured
//                 (existing behaviour); dashboard + SMART app use the
//                 backend's FHIR store.

import {
  GROUP_HANDLERS,
  LIST_HANDLERS,
  dedupAdmissionDayAmb,
  derivePatientId,
  linkEncountersInResources,
  mapPatient,
  maskId,
  maskName,
  resolveSexStratifiedRanges,
} from "@nhi-fhir-bridge/mapper";
import {
  // adaptEncounterFromMedExpense is invoked directly from the
  // IHKE3303S02 detail fan-out (overrides the registry's classHint
  // with 急診/住院 derived from the detail body), so it needs to be
  // a named import — not only reachable via NHI_API_ENDPOINTS[i].adapt.
  // Forgetting this re-import after extracting the endpoint registry
  // in v0.6.3 shipped a ReferenceError that only fired in production
  // syncs with non-empty encounters. Tests don't exercise that path
  // — see TODO_FOLLOWUP for a SW-flow integration test idea.
  adaptEncounterFromMedExpense,
  adaptImagingReportFromDetail,
  adaptInpatientEncounter,
  adaptMedicationFromDetail,
  adaptProcedureFromDetail,
  isoToROC,
  pickEnglish,
  rocToISO,
} from "./nhi-adapters.js";
import { ENDPOINT_LABEL_ZH, NHI_API_ENDPOINTS } from "./nhi-endpoints.js";

const STORAGE_KEY = "syncStatus";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Cancellation flag set by popup's stop button. Checked at strategic points
// in runNhiApiSync (between phases, before each detail page) so the
// in-progress sync exits promptly when the user hits Stop. Cleared at the
// start of each new sync run.
let _cancelled = false;
// Context for the in-flight sync so the stopSync handler can wipe partial
// data without the popup needing to pass it back. Set at the top of
// runNhiApiSync; cleared on completion (success/failure/cancel).
let _activeSyncCtx = null;
const CANCEL_ERROR = "__SYNC_CANCELLED__";
// Thrown when NHI detects the session has expired (login page rendered, or
// tab redirected to auth namespace). Aborts sync immediately so the user can
// re-login and retry instead of timing out on every remaining page.
const SESSION_EXPIRED_ERROR = "__SESSION_EXPIRED__";
// Errors that should abort the entire sync instead of being swallowed
// per-phase.
const ABORT_ERRORS = new Set([CANCEL_ERROR, SESSION_EXPIRED_ERROR]);
function checkCancel() {
  if (_cancelled) throw new Error(CANCEL_ERROR);
}

async function setStatus(partial) {
  // After cancellation, the popup has already written the definitive
  // "stopped" status — silence any further progress writes from the
  // in-flight sync code so the UI doesn't bounce while it unwinds.
  if (_cancelled) return;
  const prev = (await chrome.storage.local.get(STORAGE_KEY))[STORAGE_KEY] || {};
  const next = { ...prev, ...partial, ts: Date.now() };
  await chrome.storage.local.set({ [STORAGE_KEY]: next });
  // Broadcast to any open popup. If no listener (popup closed),
  // sendMessage rejects — swallow.
  chrome.runtime.sendMessage({ type: "syncProgress", status: next }).catch(() => {});
}

// Wrap a long-running fan-out with a periodic elapsed-time ticker so
// the popup doesn't look frozen during 60-90 second NHI detail fetches
// (each S02 detail triggers a real DB JOIN server-side; the fan-out
// time is bound by NHI's per-request processing cost, not anything
// we can speed up client-side).
//
// label is a function (elapsedSec) → string that formats the progress
// message; called every 3 seconds while the awaited promise is in
// flight. Final setStatus call fires only on completion (so the
// "complete" message replaces the "in-progress" one cleanly).
async function _withProgressTimer(makeLabel, fn) {
  const start = Date.now();
  // Initial status set immediately so the user sees the message before
  // the first 3-second tick. Subsequent ticks update the elapsed seconds.
  await setStatus({ progress: makeLabel(0) });
  const interval = setInterval(() => {
    const elapsed = Math.round((Date.now() - start) / 1000);
    setStatus({ progress: makeLabel(elapsed) }).catch(() => {});
  }, 3000);
  try {
    return await fn();
  } finally {
    clearInterval(interval);
  }
}

// ── NHI API-direct sync (parallel, no LLM) ─────────────────────────────────
//
// Instead of navigating the user's tab to each NHI page, waiting for Vue to
// render, capturing HTML, then sending it through LLM extraction, we call
// NHI's underlying JSON API endpoints directly. The 健保署 SPA fronts a set
// of REST endpoints under /api/ihke3000/<page>/* that return well-formed
// JSON; calling them in parallel cuts a 5-10 minute sync to ~10 seconds and
// removes the LLM cost entirely.

const NHI_HOST = "myhealthbank.nhi.gov.tw";


// NHI JSON adapters + date/string helpers live in ./nhi-adapters.js
// so they can be unit-tested in isolation (background.js can't be
// loaded under vitest — chrome.* APIs, SW globals). See that module
// for the field-priority decisions per adapter.
//
// The NHI API endpoint registry + 中文 label mapping live in
// ./nhi-endpoints.js — extracted so a unit test can guarantee every
// endpoint name has a label (we used to ship raw page_type keys like
// "other_labs" into the popup's 查看明細 when someone forgot to
// register the Chinese version).

// Apply a {start, end} ISO date range to an endpoint path:
//   - If path already has s_date= placeholders, fill them in.
//   - Otherwise append s_date=...&e_date=... to the query string.
// Endpoints without `supportsDateRange` pass through unchanged.
function applyDateRangeToPath(path, dateRange) {
  if (!dateRange || (!dateRange.start && !dateRange.end)) return path;
  // NHI expects 西元 ISO dates with dashes: 2023-01-01 (not 民國, not
  // slashes). Confirmed by observing the SPA's request when user picks
  // a custom date range. URL-encoding the dashes is unnecessary.
  const s = (dateRange.start || "").slice(0, 10);
  const e = (dateRange.end || "").slice(0, 10);
  let p = path;
  if (/[?&]s_date=/.test(p)) {
    p = p.replace(/([?&]s_date=)[^&]*/, `$1${s}`);
  } else {
    p += (p.includes("?") ? "&" : "?") + `s_date=${s}`;
  }
  if (/[?&]e_date=/.test(p)) {
    p = p.replace(/([?&]e_date=)[^&]*/, `$1${e}`);
  } else {
    p += `&e_date=${e}`;
  }
  return p;
}

// Fan out IHKE3306S02 detail fetches inside the NHI tab so cookies + JWT
// auth flow naturally. We pass the visit list (just row_IDs + their parent
// fields needed for adaptation) into the tab; the tab returns parallel
// fetched bodies; we adapt back in the SW.
//
// `skipRowIds`: Set<string> of row_IDs whose drugs have already been
// fetched by another fan-out (currently: chronic prescriptions). When
// the chronic list (IHKE3307S01) and the regular meds list
// (IHKE3306S01) both contain the same row_ID (~52 overlap on observed
// patient), we skip the regular call to avoid double-emitting the
// same drugs.
async function _fetchMedicationDetailsInTab({ tabId, baseUrl, visits, skipRowIds }) {
  const skip = skipRowIds instanceof Set ? skipRowIds : new Set(skipRowIds || []);
  const reqs = visits
    .map((v) => ({
      row_ID: v.row_ID || v.rowid || v.rowID || "",
      // Keep parent fields needed by adaptMedicationFromDetail.
      parent: {
        func_DATE: v.func_DATE || v.func_date || "",
        icd9cm_CODE: v.icd9cm_CODE || v.icd9cm_code || "",
        icd9cm_CODE_CNAME: v.icd9cm_CODE_CNAME || v.icd9cm_name || "",
        hosp_ABBR: v.hosp_ABBR || v.hosp_abbr || "",
      },
    }))
    .filter((r) => r.row_ID && !skip.has(r.row_ID));
  if (reqs.length === 0) return [];

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: async (base, items) => {
      const token = sessionStorage.getItem("token");
      if (!token) return { error: "SESSION_EXPIRED" };
      if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
        return { error: "SESSION_EXPIRED" };
      }
      const auth = `Bearer ${token}`;
      async function fetchOne(rowId, ctype) {
        const url = `${base}/api/ihke3000/IHKE3306S02/page_load?crid=${encodeURIComponent(rowId)}&ctype=${ctype}`;
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
      // NHI uses different ctype values for 西醫/中醫/牙醫/處方箋. We don't
      // have the public mapping, so try ctype 1..4 in order and stop as
      // soon as one returns drugs. ctype=2 covered IC卡 門診 in our sample.
      async function one(rowId) {
        for (const ct of [2, 1, 3, 4]) {
          const r = await fetchOne(rowId, ct);
          if (r.error === "SESSION_EXPIRED") return r;
          if (r.error) continue;
          const main = Array.isArray(r.body?.ihke3306S02_main_data) ? r.body.ihke3306S02_main_data : [];
          const hasDrugs = main.some((v) =>
            Array.isArray(v?.sp_IHKE3306S03_data_list) && v.sp_IHKE3306S03_data_list.length > 0
          );
          if (hasDrugs) return r;
        }
        // No ctype yielded drugs — return last successful body anyway so
        // diagnostics can still see the visit metadata.
        return await fetchOne(rowId, 2);
      }
      const out = new Array(items.length);
      let next = 0;
      const CONC = 3;
      async function worker() {
        while (next < items.length) {
          const i = next++;
          await new Promise((r) => setTimeout(r, Math.random() * 50));
          out[i] = await one(items[i].row_ID);
        }
      }
      const ws = [];
      for (let w = 0; w < CONC && w < items.length; w++) ws.push(worker());
      await Promise.all(ws);
      return { results: out };
    },
    args: [baseUrl, reqs],
  });

  if (result?.error === "SESSION_EXPIRED") throw new Error(SESSION_EXPIRED_ERROR);
  const drugs = [];
  const results = result?.results || [];
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (!r || r.error || !r.body) continue;
    const main = Array.isArray(r.body.ihke3306S02_main_data) ? r.body.ihke3306S02_main_data : [];
    for (const visit of main) {
      const drugList = Array.isArray(visit.sp_IHKE3306S03_data_list) ? visit.sp_IHKE3306S03_data_list : [];
      for (const d of drugList) {
        const adapted = adaptMedicationFromDetail(d, visit);
        if (adapted) drugs.push(adapted);
      }
    }
  }
  return drugs;
}

// Fan out IHKE3306S02 detail fetches for chronic prescriptions. Uses
// per-row `ori_TYPE` for ctype (1=門診, 2=IC卡, 8=藥局) instead of
// brute-forcing 1..4 like the regular medication fan-out: chronic
// list rows always carry ori_TYPE and detail-empty responses confirm
// that mismatching ctype returns an empty array. Every drug produced
// here gets is_chronic=true → mapper emits courseOfTherapyType=
// continuous on the resulting MedicationRequest.
async function _fetchChronicMedicationDetailsInTab({ tabId, baseUrl, visits }) {
  const reqs = visits
    .map((v) => ({
      row_ID: v.row_ID || v.rowid || v.rowID || "",
      // Chronic list rows always have ori_TYPE; fall back to brute-
      // force only if NHI ever ships a row without it.
      ctype: String(v.ori_TYPE || v.ori_type || ""),
    }))
    .filter((r) => r.row_ID);
  if (reqs.length === 0) return [];

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: async (base, items) => {
      const token = sessionStorage.getItem("token");
      if (!token) return { error: "SESSION_EXPIRED" };
      if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
        return { error: "SESSION_EXPIRED" };
      }
      const auth = `Bearer ${token}`;
      async function fetchOne(rowId, ctype) {
        const url = `${base}/api/ihke3000/IHKE3306S02/page_load?crid=${encodeURIComponent(rowId)}&ctype=${encodeURIComponent(ctype)}`;
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
      // Try the row's declared ctype first; if empty, fall back to
      // brute-force so a misclassified row still surfaces its drugs.
      async function one(rowId, declaredCtype) {
        const seq = declaredCtype
          ? [declaredCtype, ...[1, 2, 8, 3, 4].filter((c) => String(c) !== String(declaredCtype))]
          : [1, 2, 8, 3, 4];
        for (const ct of seq) {
          const r = await fetchOne(rowId, ct);
          if (r.error === "SESSION_EXPIRED") return r;
          if (r.error) continue;
          const main = Array.isArray(r.body?.ihke3306S02_main_data) ? r.body.ihke3306S02_main_data : [];
          const hasDrugs = main.some((v) =>
            Array.isArray(v?.sp_IHKE3306S03_data_list) && v.sp_IHKE3306S03_data_list.length > 0,
          );
          if (hasDrugs) return r;
        }
        return null;
      }
      const out = new Array(items.length);
      let next = 0;
      const CONC = 3;
      async function worker() {
        while (next < items.length) {
          const i = next++;
          await new Promise((r) => setTimeout(r, Math.random() * 50));
          out[i] = await one(items[i].row_ID, items[i].ctype);
        }
      }
      const ws = [];
      for (let w = 0; w < CONC && w < items.length; w++) ws.push(worker());
      await Promise.all(ws);
      return { results: out };
    },
    args: [baseUrl, reqs],
  });

  if (result?.error === "SESSION_EXPIRED") throw new Error(SESSION_EXPIRED_ERROR);
  const drugs = [];
  const results = result?.results || [];
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (!r || r.error || !r.body) continue;
    const main = Array.isArray(r.body.ihke3306S02_main_data) ? r.body.ihke3306S02_main_data : [];
    for (const visit of main) {
      const drugList = Array.isArray(visit.sp_IHKE3306S03_data_list) ? visit.sp_IHKE3306S03_data_list : [];
      for (const d of drugList) {
        const adapted = adaptMedicationFromDetail(d, visit, { is_chronic: true });
        if (adapted) drugs.push(adapted);
      }
    }
  }
  return drugs;
}

// Fan out IHKE3408S02 detail fetches for imaging — same pattern as the
// medication 2-step. ctype mirrors the visit's ori_TYPE (A / E / …).
async function _fetchImagingDetailsInTab({ tabId, baseUrl, visits }) {
  const reqs = visits
    .map((v) => ({
      row_ID: v.row_ID || v.rowid || v.rowID || "",
      ctype: v.ori_TYPE || v.ori_type || "A",
    }))
    .filter((r) => r.row_ID);
  if (reqs.length === 0) return [];

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: async (base, items) => {
      const token = sessionStorage.getItem("token");
      if (!token) return { error: "SESSION_EXPIRED" };
      if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
        return { error: "SESSION_EXPIRED" };
      }
      const auth = `Bearer ${token}`;
      async function one(rowId, ctype) {
        const url = `${base}/api/ihke3000/IHKE3408S02/page_load?crid=${encodeURIComponent(rowId)}&ctype=${encodeURIComponent(ctype)}`;
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
      const out = new Array(items.length);
      let next = 0;
      const CONC = 3;
      async function worker() {
        while (next < items.length) {
          const i = next++;
          await new Promise((r) => setTimeout(r, Math.random() * 50));
          out[i] = await one(items[i].row_ID, items[i].ctype);
        }
      }
      const ws = [];
      for (let w = 0; w < CONC && w < items.length; w++) ws.push(worker());
      await Promise.all(ws);
      return { results: out };
    },
    args: [baseUrl, reqs],
  });

  if (result?.error === "SESSION_EXPIRED") throw new Error(SESSION_EXPIRED_ERROR);
  const reports = [];
  const results = result?.results || [];
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (!r || r.error || !r.body) continue;
    const main = Array.isArray(r.body.ihke3408S02_main_data) ? r.body.ihke3408S02_main_data : [];
    for (const visit of main) {
      const adapted = adaptImagingReportFromDetail(visit);
      if (adapted) reports.push(adapted);
    }
  }
  return reports;
}

// Fan out IHKE3308S02 detail fetches for procedures — same 2-step
// pattern as imaging IHKE3408S01 → S02. The list (IHKE3301S05) only
// carries metadata; the actual ICD-10-PCS code (op_CODE) and the real
// performance date (exe_S_DATE on sub-list entries) live in the detail.
// ctype mirrors the list row's ori_type (3=住院 / 5=門診 observed
// against live payloads). NHI doesn't publish the mapping so we
// brute-force on miss like the medication fan-out, just in case.
async function _fetchProcedureDetailsInTab({ tabId, baseUrl, visits }) {
  const reqs = visits
    .map((v) => ({
      row_ID: v.row_ID || v.row_id || v.rowid || v.rowID || "",
      ctype: v.ori_type || v.ori_TYPE || "",
    }))
    .filter((r) => r.row_ID);
  if (reqs.length === 0) return [];

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: async (base, items) => {
      const token = sessionStorage.getItem("token");
      if (!token) return { error: "SESSION_EXPIRED" };
      if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
        return { error: "SESSION_EXPIRED" };
      }
      const auth = `Bearer ${token}`;
      async function fetchOne(rowId, ctype) {
        const url = `${base}/api/ihke3000/IHKE3308S02/page_load?crid=${encodeURIComponent(rowId)}&ctype=${encodeURIComponent(ctype)}`;
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
      // Prefer the row's own ori_type. If that returns empty (NHI
      // sometimes ships rows where ctype expects a different value),
      // brute-force 1..5 until something comes back.
      async function one(rowId, preferred) {
        const candidates = [];
        if (preferred) candidates.push(preferred);
        for (const ct of ["3", "5", "1", "2", "4"]) {
          if (!candidates.includes(ct)) candidates.push(ct);
        }
        let lastOk = null;
        for (const ct of candidates) {
          const r = await fetchOne(rowId, ct);
          if (r.error === "SESSION_EXPIRED") return r;
          if (r.error) continue;
          const main = Array.isArray(r.body?.ihke3308S02_main_data)
            ? r.body.ihke3308S02_main_data : [];
          if (main.length > 0) return r;
          lastOk = r;
        }
        return lastOk || { error: "no detail body" };
      }
      const out = new Array(items.length);
      let next = 0;
      const CONC = 3;
      async function worker() {
        while (next < items.length) {
          const i = next++;
          await new Promise((r) => setTimeout(r, Math.random() * 50));
          out[i] = await one(items[i].row_ID, items[i].ctype);
        }
      }
      const ws = [];
      for (let w = 0; w < CONC && w < items.length; w++) ws.push(worker());
      await Promise.all(ws);
      return { results: out };
    },
    args: [baseUrl, reqs],
  });

  if (result?.error === "SESSION_EXPIRED") throw new Error(SESSION_EXPIRED_ERROR);
  const procedures = [];
  const results = result?.results || [];
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (!r || r.error || !r.body) continue;
    const main = Array.isArray(r.body.ihke3308S02_main_data) ? r.body.ihke3308S02_main_data : [];
    for (const row of main) {
      const adapted = adaptProcedureFromDetail(row);
      if (adapted) procedures.push(adapted);
    }
  }
  return procedures;
}

// Fan out IHKE3303S02 detail to classify each IHKE3303S01 visit as
// AMB / EMER / IMP based on hosp_DATA_TYPE_NAME. Uses ?rid=<row_ID>&t=N
// where N is the visit type bucket; we don't know the mapping a priori,
// so for each visit we try t=1..5 until one returns non-empty main_data.
async function _fetchEncounterDetailsInTab({ tabId, baseUrl, visits }) {
  const reqs = visits
    .map((v, idx) => ({ idx, row_ID: v.roW_ID || v.row_ID || "" }))
    .filter((r) => r.row_ID);
  if (reqs.length === 0) return [];

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: async (base, items) => {
      const token = sessionStorage.getItem("token");
      if (!token) return { error: "SESSION_EXPIRED" };
      if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
        return { error: "SESSION_EXPIRED" };
      }
      const auth = `Bearer ${token}`;
      async function fetchOne(rowId, ctype) {
        // IHKE3303S02 takes crid + ctype (mirrors IHKE3306S02 /
        // IHKE3308S02 detail endpoints). Earlier code used rid + t
        // — that matched NHI's UI route querystring but NOT the API
        // endpoint, which silently returned {ihke3303S02_main_data:[]}
        // for every visit. That made classHint, secondary diagnoses,
        // and primary-ICD-bilingual all fall through to defaults.
        const url = `${base}/api/ihke3000/IHKE3303S02/page_load?crid=${encodeURIComponent(rowId)}&ctype=${ctype}`;
        const ac = new AbortController();
        const tm = setTimeout(() => ac.abort(), 30000);
        try {
          const r = await fetch(url, {
            method: "GET", credentials: "same-origin", signal: ac.signal,
            headers: { "Accept": "application/json", "Authorization": auth },
          });
          clearTimeout(tm);
          if (r.status === 401 || r.status === 403) return { error: "SESSION_EXPIRED" };
          if (!r.ok) return { error: `HTTP ${r.status}` };
          return { body: await r.json() };
        } catch (e) {
          clearTimeout(tm);
          return { error: e.name === "AbortError" ? "timeout 30s" : String(e?.message || e) };
        }
      }
      // For each visit, find the ctype that returns non-empty data. NHI
      // observed: ctype=2 covers 西醫 / IC卡 / 申報 OPD, others may
      // correspond to 中醫 / 牙醫 / 住院. We probe a small set.
      async function one(rowId) {
        for (const ct of [2, 1, 3, 4, 5]) {
          const r = await fetchOne(rowId, ct);
          if (r.error === "SESSION_EXPIRED") return r;
          if (r.error) continue;
          const main = (r.body?.ihke3303S02_main_data) || [];
          if (main.length > 0) return { body: r.body, ctype: ct };
        }
        return { body: null };
      }
      const out = new Array(items.length);
      let next = 0;
      const CONC = 3;
      async function worker() {
        while (next < items.length) {
          const i = next++;
          await new Promise((r) => setTimeout(r, Math.random() * 50));
          out[i] = await one(items[i].row_ID);
        }
      }
      const ws = [];
      for (let w = 0; w < CONC && w < items.length; w++) ws.push(worker());
      await Promise.all(ws);
      return { results: out };
    },
    args: [baseUrl, reqs],
  });

  if (result?.error === "SESSION_EXPIRED") throw new Error(SESSION_EXPIRED_ERROR);
  // Pair each detail body back to its visit position.
  const byIdx = new Map();
  const results = result?.results || [];
  for (let i = 0; i < reqs.length; i++) {
    byIdx.set(reqs[i].idx, results[i]?.body || null);
  }
  return byIdx;
}

// Fan out IHKE3309S02 detail fetches for inpatient encounters. List
// endpoint IHKE3309S01 ships icd9cm_CODE_CNAME Chinese-only and has
// no secondary diagnoses field; detail ships full bilingual primary
// ICD + icdcode_data[] with up to 12+ 次診斷 (住院 visits tend to
// have richer differential — observed sample had 12 secondaries vs
// 4 for the eye-clinic OPD case). ctype is fixed to 3 (= 住院) for
// this endpoint; probing other values returns empty arrays.
async function _fetchInpatientDetailsInTab({ tabId, baseUrl, visits }) {
  const reqs = visits
    .map((v, idx) => ({ idx, row_ID: v.row_ID || v.row_id || v.roW_ID || "" }))
    .filter((r) => r.row_ID);
  if (reqs.length === 0) return new Map();

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: async (base, items) => {
      const token = sessionStorage.getItem("token");
      if (!token) return { error: "SESSION_EXPIRED" };
      if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
        return { error: "SESSION_EXPIRED" };
      }
      const auth = `Bearer ${token}`;
      async function fetchOne(rowId) {
        // IHKE3309S02 takes crid + ctype like the other S02 detail
        // endpoints. ctype=3 (住院) is the only value that returns
        // data on this endpoint per live probe; we still fallback to
        // 1/2 defensively in case NHI's mapping changes.
        for (const ct of [3, 2, 1]) {
          const url = `${base}/api/ihke3000/IHKE3309S02/page_load?crid=${encodeURIComponent(rowId)}&ctype=${ct}`;
          const ac = new AbortController();
          const tm = setTimeout(() => ac.abort(), 30000);
          try {
            const r = await fetch(url, {
              method: "GET", credentials: "same-origin", signal: ac.signal,
              headers: { "Accept": "application/json", "Authorization": auth },
            });
            clearTimeout(tm);
            if (r.status === 401 || r.status === 403) return { error: "SESSION_EXPIRED" };
            if (!r.ok) continue;
            const body = await r.json();
            const main = body?.ihke3309S02_main_data || [];
            if (main.length > 0) return { body };
          } catch (e) {
            clearTimeout(tm);
            if (e?.name !== "AbortError") continue;
            return { error: "timeout 30s" };
          }
        }
        return { body: null };
      }
      const out = new Array(items.length);
      let next = 0;
      const CONC = 3;
      async function worker() {
        while (next < items.length) {
          const i = next++;
          await new Promise((r) => setTimeout(r, Math.random() * 50));
          out[i] = await fetchOne(items[i].row_ID);
        }
      }
      const ws = [];
      for (let w = 0; w < CONC && w < items.length; w++) ws.push(worker());
      await Promise.all(ws);
      return { results: out };
    },
    args: [baseUrl, reqs],
  });

  if (result?.error === "SESSION_EXPIRED") throw new Error(SESSION_EXPIRED_ERROR);
  const byIdx = new Map();
  const results = result?.results || [];
  for (let i = 0; i < reqs.length; i++) {
    byIdx.set(reqs[i].idx, results[i]?.body || null);
  }
  return byIdx;
}

// NHI's S02 detail endpoints (IHKE3303S02 encounter, IHKE3309S02
// inpatient, ...) wrap the main row under a key named after the
// endpoint — ihke3303S02_main_data / ihke3309S02_main_data / etc.
// This helper picks out main_data[0] regardless of which S02 we hit,
// so the three downstream extractors (_classFromS02Detail,
// _primaryIcdFromS02Detail, _secondaryIcdsFromS02Detail) work uniformly.
function _pickS02MainRow(body) {
  if (!body || typeof body !== "object") return null;
  for (const k of Object.keys(body)) {
    if (/^ihke\d+S02_main_data$/i.test(k) && Array.isArray(body[k]) && body[k].length > 0) {
      return body[k][0];
    }
  }
  return null;
}

function _classFromS02Detail(body) {
  const main = _pickS02MainRow(body);
  if (!main) return null;
  const tn = String(main.hosp_DATA_TYPE_NAME || "");
  if (tn.includes("急")) return "EMER";  // 急診
  if (tn.includes("住院")) return "IMP";
  // 西醫 / 中醫 / 牙醫 / 藥局 all default to AMB
  return "AMB";
}

// Pull the primary ICD's bilingual name from IHKE3303S02 detail. The
// list endpoint IHKE3303S01 sometimes ships icD9CM_CODE_CNAME as
// Chinese-only "<code>/<中文>"; detail consistently ships full bilingual
// "<code>/<中文>||<code>/<English>". Caller passes the result via
// options.primary_diagnosis to the encounter adapter, which prefers
// it over the (potentially Chinese-only) list-level field. Result:
// Encounter.reasonCode[0].coding[0].display is reliably English.
function _primaryIcdFromS02Detail(body) {
  const main = _pickS02MainRow(body);
  if (!main) return null;
  const codeName = main.icd9cm_CODE_CNAME || main.icd9cm_code_cname || "";
  if (!codeName) return null;
  const code = main.icd9cm_CODE || main.icd9cm_code || "";
  const stripIcdPrefix = (s) => String(s || "").replace(/^[A-Z0-9.]+\/\s*/, "");
  const pickHalf = (s, half) => {
    const str = String(s || "");
    const idx = str.indexOf("||");
    if (idx === -1) return str.trim();
    if (half === "zh") return str.slice(0, idx).trim() || str.slice(idx + 2).trim();
    return str.slice(idx + 2).trim() || str.slice(0, idx).trim();
  };
  const name_en = stripIcdPrefix(pickHalf(codeName, "en"));
  const name_zh = stripIcdPrefix(pickHalf(codeName, "zh"));
  if (!code && !name_en && !name_zh) return null;
  return { code, name_en, name_zh };
}

// Pull secondary diagnoses (次診斷) from IHKE3303S02 detail. Live data
// shows 0-4 entries per encounter; the eye-clinic case in the test
// sample maxes out at 4. Each entry is shaped:
//   { icd_tit: "次診斷N||Secondary Diagnosis N",
//     icd_code_name: "<code>/<中文>||<code>/<English>" }
// Returns a normalized array passed via the encounter adapter's
// options.secondary_diagnoses → mapper emits one reasonCode[] entry per item.
function _secondaryIcdsFromS02Detail(body) {
  const main = _pickS02MainRow(body);
  if (!main) return [];
  const list = Array.isArray(main.icdcode_data) ? main.icdcode_data : [];
  const out = [];
  // strip the "<CODE>/" prefix from each half (same pattern as
  // medication / encounter primary ICD bilingual)
  const stripIcdPrefix = (s) => String(s || "").replace(/^[A-Z0-9.]+\/\s*/, "");
  const pickHalf = (s, half) => {
    const str = String(s || "");
    const idx = str.indexOf("||");
    if (idx === -1) return str.trim();
    if (half === "zh") return str.slice(0, idx).trim() || str.slice(idx + 2).trim();
    return str.slice(idx + 2).trim() || str.slice(0, idx).trim();
  };
  for (const item of list) {
    const codeName = item?.icd_code_name || item?.icd_CODE_NAME || "";
    // Extract code from either half (both sides prefix with same code).
    const codeMatch = String(codeName).match(/^([A-Z0-9.]+)\//);
    const code = codeMatch ? codeMatch[1] : "";
    const name_en = stripIcdPrefix(pickHalf(codeName, "en"));
    const name_zh = stripIcdPrefix(pickHalf(codeName, "zh"));
    if (!code && !name_en && !name_zh) continue;
    out.push({ code, name_en, name_zh });
  }
  return out;
}

async function _postStructured(backend, page_type, items, syncApiKey, patientOverride) {
  const r = await fetch(`${backend}/sync/upload-structured`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(syncApiKey ? { "X-Sync-API-Key": syncApiKey } : {}),
    },
    body: JSON.stringify({
      page_type,
      host: NHI_HOST,
      items,
      patient_override: patientOverride || null,
    }),
  });
  if (!r.ok) throw new Error(`POST upload-structured ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return await r.json();
}

// ── Local mode ─────────────────────────────────────────────────────────
//
// Runs the same mappers the backend runs, then triggers a download of the
// resulting FHIR Bundle. Nothing leaves the user's machine; no backend
// required. Mirrors backend/upload-structured order: encounters first so
// that linkEncountersInResources can attach references to downstream
// observations/medications/etc.

const _LOCAL_PAGE_TYPE_ORDER = [
  "encounters",
  "observations",
  "medications",
  "conditions",
  "allergies",
  "diagnostic_reports",
  "procedures",
  "immunizations",
];

// Cheap pre-flight: does this NHI tab have an authenticated session?
// Uses the same sessionStorage.token + lightweight API call pattern as
// _maybeFetchPatientIdFromNhi. Doesn't return anything PII — just a
// boolean for the popup to decide whether to surface a "log in first"
// banner. Returns null when we can't tell (script-injection blocked,
// timeout, etc.) so the popup can fall back to "enabled" rather than
// scaring the user with a false negative.
async function _checkNhiLoginState(tabId) {
  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: async () => {
        const t = sessionStorage.getItem("token");
        if (!t) return false;
        try {
          // Same endpoint as the cid auto-fetch — known to need an
          // authenticated session and to be cheap.
          const r = await fetch("/api/ihke3000/ihke3410s01/page_load", {
            credentials: "same-origin",
            headers: { Accept: "application/json", Authorization: `Bearer ${t}` },
          });
          // 401/403 → session token rejected. 200 → logged in.
          return r.ok;
        } catch {
          return false;
        }
      },
    });
    return typeof result === "boolean" ? result : null;
  } catch {
    return null;
  }
}

// NHI 健康存摺 endpoint IHKE3410S01 (我接種紀錄 / COVID 篩檢紀錄) happens
// to carry the logged-in user's real citizen ID in the response (`cid`
// field, e.g. "P123450866"). Use it to seed / refresh the patient_
// override's id_no so it always tracks "whose session is currently
// active in the NHI tab".
//
// History note: this function used to early-return whenever id_no was
// already a real-looking cid ("don't touch a manually-entered ID").
// That short-circuit pre-dated v0.6.0 which removed id_no from the UI
// — there's no "manual" path anymore, the field is purely internal.
// The short-circuit also produced the bug pattern: user starts sync
// with Patient B logged in (cid_B written to override), realises wrong
// tab, switches NHI tab to Patient A, re-syncs — id_no stays cid_B
// because "already a real cid". Now we always probe and follow the
// session's truth. Manual override is gone, NHI session is authoritative.
async function _maybeFetchPatientIdFromNhi(tabId, patientOverride) {
  const current = patientOverride.id_no || "";

  let cid = null;
  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: async () => {
        const t = sessionStorage.getItem("token");
        if (!t) return null;
        try {
          const r = await fetch("/api/ihke3000/ihke3410s01/page_load", {
            credentials: "same-origin",
            headers: { Accept: "application/json", Authorization: `Bearer ${t}` },
          });
          if (!r.ok) return null;
          const body = await r.json();
          return body?.cid || null;
        } catch {
          return null;
        }
      },
    });
    // Validate it looks like a Taiwan national ID (1 letter + 9 digits)
    // before trusting it. Avoids accidentally promoting garbage to the
    // Patient resource's unique key.
    if (result && /^[A-Z][12]\d{8}$/.test(result)) cid = result;
  } catch (e) {
    console.warn("[NHI sync] IHKE3410 cid fetch failed:", e?.message ?? e);
  }

  if (cid && cid !== current) {
    patientOverride = { ...patientOverride, id_no: cid };
    await chrome.storage.local.set({ patientOverride }).catch(() => {});

    // Patient-switch cleanup. If the cid just changed from one real
    // cid to another (not just "auto-XXXX → real cid" first-sync swap),
    // the previously-stashed FHIR bundle belongs to the OTHER patient.
    // Drop it so the popup's download button doesn't keep offering the
    // wrong patient's file. Same set of wipes popup.js does in
    // savePatientOverride when it detects patientChanged.
    const switchedRealPatients =
      current && !current.startsWith("auto-") && current !== cid;
    if (switchedRealPatients) {
      await chrome.storage.session.remove(PENDING_BUNDLE_KEY).catch(() => {});
    }
  }
  return patientOverride;
}

// Read the mask-name preference fresh from storage. We don't cache —
// runNhiApiSync is invoked at most a few times per session and the SW
// can be torn down + restarted any time, so a single get() per sync is
// cheaper than syncing state across SW lifecycles.
async function _isMaskEnabled() {
  try {
    const { maskNameEnabled } = await chrome.storage.local.get("maskNameEnabled");
    return maskNameEnabled === true;
  } catch {
    return false;
  }
}

function _buildOverridePatient(ov, maskEnabled) {
  const displayName = maskEnabled ? maskName(ov.name || "") : ov.name || "";
  const raw = {
    id: ov.id_no,
    identifier: ov.id_no,
    name: displayName || ov.id_no,
  };
  if (ov.birth_date) raw.birthDate = ov.birth_date;
  if (ov.gender) raw.gender = ov.gender;
  return mapPatient(raw);
}

// Walk a JSON-like value and replace every string token equal to or
// containing `needle` with `replacement`. Used to scrub the real
// patient name out of NHI narrative fields (clinical_note, conclusion,
// note, etc.) before the items reach the mapper. Only triggered when
// the user has opted into masking AND supplied a name — and the
// substitution is exact-token-replace, not fuzzy, so it can't surprise
// the user by clobbering unrelated content.
function _replaceNameDeep(value, needle, replacement) {
  if (!needle || needle === replacement) return value;
  if (typeof value === "string") return value.split(needle).join(replacement);
  if (Array.isArray(value)) return value.map((v) => _replaceNameDeep(v, needle, replacement));
  if (value && typeof value === "object") {
    const out = {};
    for (const k in value) out[k] = _replaceNameDeep(value[k], needle, replacement);
    return out;
  }
  return value;
}

function _assembleLocalBundle(byType, patientOverride, maskEnabled) {
  const patient = _buildOverridePatient(patientOverride, maskEnabled);
  const pid = patient.id;
  const all = [patient];

  for (const pt of _LOCAL_PAGE_TYPE_ORDER) {
    const items = byType[pt];
    if (!items || items.length === 0) continue;
    let mapped;
    if (GROUP_HANDLERS[pt]) {
      mapped = GROUP_HANDLERS[pt](items, pid);
    } else if (LIST_HANDLERS[pt]) {
      const [fn] = LIST_HANDLERS[pt];
      mapped = items
        .filter((it) => it && typeof it === "object")
        .map((it) => fn(it, pid))
        .filter((r) => r !== null);
    } else {
      continue;
    }
    if (pt === "encounters") mapped = dedupAdmissionDayAmb(mapped);
    all.push(...mapped);
  }

  // Dedup by (resourceType, id) before assembling the Bundle. Multiple
  // NHI endpoints can feed the same page_type (e.g. encounters /
  // inpatient / inpatient_legacy all → page_type="encounters"), and the
  // mapper produces deterministic stable IDs — so two raw items that
  // describe the same medical event collapse to one resource. Backend
  // upsert handles this automatically (same stable ID = same DB row);
  // local mode has to do it explicitly. Without this dedup, the local
  // Bundle ends up inflated relative to what backend stores from the
  // identical NHI input.
  const seen = new Set();
  const unique = [];
  for (const r of all) {
    const key = `${r.resourceType}/${r.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(r);
  }

  // Linker + sex-stratified resolver run once over the full assembled
  // list (same pipeline backend's /sync/upload-structured runs, just
  // against an in-memory candidate array instead of a SQLite query).
  linkEncountersInResources(unique, unique);
  resolveSexStratifiedRanges(patient, unique);

  // Bundle.meta.tag carries bridge version + source identifier so SMART
  // app devs / IRB reviewers can identify the producing bridge even
  // after the file is renamed (the filename also has the version, but
  // file rename is common). Tag system uses a bridge-specific URI so it
  // can be queried without colliding with clinical tags.
  // Bug report 2026-05-27 Part 6 U4: bundle had no version marker → bug
  // reports couldn't pin down which bridge version produced the data.
  const bridgeVersion = chrome.runtime.getManifest()?.version || "unknown";
  return {
    resourceType: "Bundle",
    type: "collection",
    timestamp: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
    meta: {
      tag: [
        {
          system: "https://github.com/voho0000/NHI-FHIR-BRIDGE/bridge-version",
          code: bridgeVersion,
          display: `NHI-FHIR-Bridge v${bridgeVersion}`,
        },
      ],
    },
    entry: unique.map((r) => ({
      fullUrl: `${r.resourceType}/${r.id}`,
      resource: r,
    })),
  };
}

// Local mode stashes the assembled Bundle in chrome.storage.session
// under a single "pendingFhirBundle" slot. The popup shows a download
// button when this slot is non-empty; the actual chrome.downloads.download
// call happens from the popup (in response to a user click) so the file
// doesn't appear in the Downloads bar uninvited.
//
// Why session (not local) — security audit #5: PHI persisted in
// chrome.storage.local survives browser restarts indefinitely. The
// MV3-native chrome.storage.session is wiped automatically when the
// browser closes, drastically shrinking the disk-resident PHI window.
//
// Additionally:
//   - Single slot means a new sync overwrites the previous pending bundle.
//   - The popup's downloadPendingBundle wipes the slot the moment the
//     user-initiated download completes.
//   - A periodic chrome.alarms sweep (PENDING_BUNDLE_TTL_MS) wipes the
//     slot if the user leaves a sync sitting unconsumed for an hour.
// chrome.storage.session default quota is 10 MB; a typical NHI sync is
// well under 2 MB.
const PENDING_BUNDLE_KEY = "pendingFhirBundle";
const PENDING_BUNDLE_TTL_MS = 60 * 60 * 1000; // 1 hour
const PENDING_BUNDLE_SWEEP_ALARM = "pending-bundle-sweep";

// Debug toggle for the per-endpoint "first body sample" stash used to
// diagnose adapter mismatches (raw_count > 0 but adapted_count == 0).
// HARD-OFF in the published extension: the sample contains raw NHI
// payload (lab values, drug names, encounter records — PHI). Flip to
// true *locally* during adapter development; never commit `true`.
const DEBUG_STASH_BODY_SAMPLES = false;

async function _stashFhirBundle(bundle, patientId, dateRange) {
  // Filename: nhi-{pid}-{startYYYYMMDD}-{endYYYYMMDD}.json
  // When no explicit dateRange (NHI default = 近 1 年), synthesize today-1y → today.
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const fmt = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  // Half-mask the ID in the filename so the user's Downloads folder
  // doesn't leak the full 身分證 (would be visible to anyone seeing
  // a file listing or download-bar preview). `X` because `*` is
  // invalid in Windows paths. Bundle CONTENTS still carry the real
  // ID under Patient.id — file owner knows whose data it is.
  const maskedPid = maskId(patientId || "unknown", "X");
  const safePid = maskedPid.replace(/[^A-Za-z0-9_-]/g, "_");
  const compact = (d) => (d || "").slice(0, 10).replace(/-/g, "");
  let s, e;
  if (dateRange && (dateRange.start || dateRange.end)) {
    s = compact(dateRange.start) || fmt(now);
    e = compact(dateRange.end) || fmt(now);
  } else {
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    s = fmt(oneYearAgo);
    e = fmt(now);
  }
  // Bridge version embedded in the filename (v0.9.3+) so anyone
  // receiving the bundle file later — the user, a SMART app dev, an
  // IRB reviewer — can immediately see which bridge produced it.
  // Matters for contract evolution (e.g. v0.9.2 changed Encounter.type
  // shape) and bug triage. chrome.runtime.getManifest() reads from the
  // bundled manifest.json — guaranteed available in an MV3 SW.
  const version = chrome.runtime.getManifest()?.version || "unknown";
  const filename = `nhi-${safePid}-${s}-${e}-v${version}.json`;
  const json = JSON.stringify(bundle, null, 2);
  await chrome.storage.session.set({
    [PENDING_BUNDLE_KEY]: {
      filename,
      json,
      bytes: json.length,
      generatedAt: Date.now(),
      patientId: patientId || null,
    },
  });
  return { filename, bytes: json.length };
}

async function runNhiApiSync({ tabId, mode, backend, syncApiKey, nhiBase, patientOverride, dateRange, dateRangeLabel }) {
  _cancelled = false;
  const BASE = nhiBase || `https://${NHI_HOST}`;

  if (!patientOverride) {
    await chrome.storage.local.set({
      syncStatus: {
        running: false,
        progress: "⛔ 請先到「② 您的資料」填寫資料後再試",
        phase: "error", ts: Date.now(), completed: Date.now(),
      },
    });
    return;
  }
  if (!tabId) {
    throw new Error("API sync requires NHI tab id (cookies are first-party)");
  }

  // First chance to upgrade the patient ID: if the popup gave us an
  // "auto-XXXXXXXX" placeholder (user didn't manually type one),
  // fetch the real one from NHI's IHKE3410S01 endpoint (response.cid
  // is the citizen ID). Persist back to storage so subsequent syncs
  // are stable. Manually-typed IDs are respected as-is.
  patientOverride = await _maybeFetchPatientIdFromNhi(tabId, patientOverride);

  // Stash context so the stopSync message handler can wipe partial
  // data (DELETE /sync/patient/{id_no}) without us having to send it
  // back through chrome.runtime.sendMessage.
  _activeSyncCtx = { backend, syncApiKey, patientId: patientOverride.id_no };

  // Wall-clock start time — used to compute elapsed seconds for the
  // final status line ("總耗時 12.3 秒"). Stash on a local so we can
  // reach it from the completion message at the very end.
  const _t0 = Date.now();
  // Per-phase timings, surfaced into the popup's "查看明細" so the user
  // can see exactly where time is going. Each entry: { name, ms }.
  const _phases = [];
  let _phaseStart = _t0;
  const _markPhase = (name) => {
    const now = Date.now();
    _phases.push({ name, ms: now - _phaseStart });
    _phaseStart = now;
  };
  await setStatus({
    running: true, progress: "🚀 開始取得健保存摺資料…", phase: "init",
    started: _t0, totalResources: 0, host: NHI_HOST, errors: [],
  });

  // Step 1: fetch all endpoints in PARALLEL inside the NHI tab. Running in
  // tab context means same-origin cookies are sent automatically — fetch
  // from the SW would be cross-origin and SameSite blocks the session
  // cookie, hence we got "session expired" even when logged in.
  // Pass only serialisable data (paths, method, name); adapters stay in SW.
  // Inject ISO-date range into each endpoint that supports it (converts
  // to 民國 format via isoToROC). Skipped endpoints keep their default
  // NHI-side window (1-2 years depending on the page).
  const fetchSpec = NHI_API_ENDPOINTS.map((ep) => {
    const path = ep.supportsDateRange ? applyDateRangeToPath(ep.path, dateRange) : ep.path;
    return { name: ep.name, url: BASE + path, method: "GET" };
  });
  if (dateRange && (dateRange.start || dateRange.end)) {
    console.log("[NHI API sync] date range:",
      `${dateRange.start || "(unbounded)"} → ${dateRange.end || "(unbounded)"}`);
  }

  let settledRaw;
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
              headers: { "Accept": "application/json", "Authorization": auth },
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
            let body;
            try { body = await r.json(); }
            catch (e) { return { name: s.name, error: "JSON parse: " + e.message }; }
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
            await new Promise(r => setTimeout(r, Math.random() * JITTER_MS));
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

  const errors = [];

  // Generic list extraction: handles all observed NHI shapes.
  //   - Plain array (IHKE3409 lab)
  //   - {sp_IHKE<X>_data: [...]}  (medications, allergies)
  //   - {western_data, chinese_data, dentist_data: [...]} (encounter list,
  //     split by 西醫/中醫/牙醫 — we want all three)
  // For multi-array shapes we merge all arrays and tag each item with
  // `__section` (the source key) so adapters can disambiguate.
  function extractList(body) {
    if (Array.isArray(body)) return body;
    if (!body || typeof body !== "object") return [];
    let arrayKeys = Object.entries(body).filter(([_, v]) => Array.isArray(v));
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

  // Apply SW-side adapters to each endpoint's body.
  const settled = settledRaw.map((r, i) => {
    const ep = NHI_API_ENDPOINTS[i];
    if (r.error) {
      return { status: "rejected", reason: { message: `${ep.name}: ${r.error}` } };
    }
    const list = extractList(r.body);
    // Adapters return either:
    //   - one item   (most adapters — labs, meds, encounters, imaging)
    //   - null/undefined (skip)
    //   - array of items (adaptAdultPreventive — unfolds one screening
    //     row into ~15 Observation entries)
    // Flat-handle both shapes so each adapter can pick whatever's clearest.
    const items = [];
    for (const it of list) {
      const r = ep.adapt(it);
      if (r === null || r === undefined) continue;
      if (Array.isArray(r)) {
        for (const x of r) if (x) items.push(x);
      } else {
        items.push(r);
      }
    }
    // Snapshot a body sample for shapes where adapter rejected everything
    // — used by the diagnostic breakdown in step 2.
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
    return { status: "fulfilled", value: { ep, items, raw_count: list.length, bodySample, rawList: list } };
  });

  _markPhase("nhi-parallel");

  // Step 1a: encounter detail fan-out (IHKE3303S02) → classify each
  // IHKE3303S01 visit as AMB / EMER / IMP via hosp_DATA_TYPE_NAME.
  // List endpoint doesn't expose 急診 distinction; detail does. We re-
  // adapt each encounter item with the discovered class before the
  // backend upload step.
  // Cross-reference: build a set of row_IDs that the medication / chronic
  // list endpoints reported as ori_TYPE_NAME="藥局". IHKE3303 itself
  // lacks the visit-type field, so this is how we classify pharmacy
  // pickup events without resorting to hospital-name string matching.
  // (Adapter still uses hospital name as a defensive fallback if either
  // medication endpoint failed.)
  const pharmacyRowIds = new Set();
  for (const name of ["medications", "chronic_prescriptions"]) {
    const idx = NHI_API_ENDPOINTS.findIndex((e) => e.name === name);
    if (idx < 0 || settled[idx]?.status !== "fulfilled") continue;
    for (const v of settled[idx].value.rawList || []) {
      const id = v.row_ID || v.rowid || v.rowID;
      const oriTypeName = v.ori_TYPE_NAME || v.ori_type_name || "";
      if (id && oriTypeName.includes("藥局")) {
        pharmacyRowIds.add(id);
      }
    }
  }

  const encIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "encounters");
  if (encIdx >= 0 && settled[encIdx].status === "fulfilled") {
    const visits = settled[encIdx].value.rawList || [];
    if (visits.length > 0) {
      try {
        const detailMap = await _withProgressTimer(
          (sec) =>
            sec === 0
              ? `📥 取得 ${visits.length} 筆就醫紀錄詳情…`
              : `📥 取得 ${visits.length} 筆就醫紀錄詳情…（已 ${sec} 秒）`,
          () => _fetchEncounterDetailsInTab({ tabId, baseUrl: BASE, visits }),
        );
        // Re-adapt with classHint + secondary diagnoses + bilingual
        // primary ICD all sourced from the S02 detail body.
        const reAdapted = [];
        for (let i = 0; i < visits.length; i++) {
          const detail = detailMap?.get(i) || null;
          const cls = _classFromS02Detail(detail) || "AMB";
          const secondaryDiagnoses = _secondaryIcdsFromS02Detail(detail);
          const primaryDiagnosis = _primaryIcdFromS02Detail(detail);
          const visit = visits[i];
          const rowId = visit.roW_ID || visit.row_id || visit.row_ID;
          const isPharmacy = rowId ? pharmacyRowIds.has(rowId) : false;
          const it = adaptEncounterFromMedExpense(visit, cls, {
            pharmacy: isPharmacy,
            primary_diagnosis: primaryDiagnosis,
            secondary_diagnoses: secondaryDiagnoses,
          });
          if (it) reAdapted.push(it);
        }
        settled[encIdx].value.items = reAdapted;
        settled[encIdx].value.raw_count = reAdapted.length;
      } catch (e) {
        errors.push(`encounter detail: ${e.message}`);
      }
    }
  }
  _markPhase("encounter-detail");

  // Step 1a': inpatient encounters get the same S02 detail enrichment
  // as IHKE3303 OPD encounters — IHKE3309S01 list ships Chinese-only
  // ICD + zero secondaries, IHKE3309S02 detail (ctype=3) ships full
  // bilingual primary + up to 12+ secondary diagnoses (住院 cases are
  // diagnostically richer than OPD). Without this fan-out, inpatient
  // FHIR Encounters have Chinese-only reasonCode display and no
  // secondary diagnoses at all.
  const inpIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "inpatient");
  if (inpIdx >= 0 && settled[inpIdx].status === "fulfilled") {
    const visits = settled[inpIdx].value.rawList || [];
    if (visits.length > 0) {
      try {
        const detailMap = await _withProgressTimer(
          (sec) =>
            sec === 0
              ? `📥 取得 ${visits.length} 筆住院紀錄詳情…`
              : `📥 取得 ${visits.length} 筆住院紀錄詳情…（已 ${sec} 秒）`,
          () => _fetchInpatientDetailsInTab({ tabId, baseUrl: BASE, visits }),
        );
        const reAdapted = [];
        for (let i = 0; i < visits.length; i++) {
          const detail = detailMap?.get(i) || null;
          const primaryDiagnosis = _primaryIcdFromS02Detail(detail);
          const secondaryDiagnoses = _secondaryIcdsFromS02Detail(detail);
          const it = adaptInpatientEncounter(visits[i], {
            primary_diagnosis: primaryDiagnosis,
            secondary_diagnoses: secondaryDiagnoses,
          });
          if (it) reAdapted.push(it);
        }
        settled[inpIdx].value.items = reAdapted;
        settled[inpIdx].value.raw_count = reAdapted.length;
      } catch (e) {
        errors.push(`inpatient detail: ${e.message}`);
      }
    }
  }
  _markPhase("inpatient-detail");

  // Step 1b: medications need a 2-step fetch — IHKE3306S01 only returns
  // visit metadata (date, ICD, hospital), no drug names. Drugs live at
  // IHKE3306S02/page_load?crid=<row_ID>&ctype=2 under
  // ihke3306S02_main_data[*].sp_IHKE3306S03_data_list. Fan out detail
  // fetches inside the same tab context (cookies + JWT), keeping
  // concurrency limited so NHI doesn't IDLE-redirect us.
  // Step 1c: imaging needs IHKE3408S02 for the actual report narrative.
  // List endpoint only has order metadata; ctype param mirrors the
  // visit's ori_TYPE (A / E / …).
  const imgIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "imaging");
  if (imgIdx >= 0 && settled[imgIdx].status === "fulfilled") {
    const visits = settled[imgIdx].value.rawList || [];
    if (visits.length > 0) {
      try {
        const reports = await _withProgressTimer(
          (sec) =>
            sec === 0
              ? `📥 取得 ${visits.length} 筆影像檢查報告…`
              : `📥 取得 ${visits.length} 筆影像檢查報告…（已 ${sec} 秒）`,
          () => _fetchImagingDetailsInTab({ tabId, baseUrl: BASE, visits }),
        );
        settled[imgIdx].value.items = reports;
        settled[imgIdx].value.raw_count = reports.length;
        settled[imgIdx].value.visitCount = visits.length;
      } catch (e) {
        errors.push(`imaging detail: ${e.message}`);
      }
    }
  }
  _markPhase("imaging-detail");

  // Step 1d: procedures need IHKE3308S02 for the actual ICD-10-PCS
  // op_CODE and the real execution date (exe_S_DATE on sub-list
  // entries). The list endpoint IHKE3301S05 only exposes metadata;
  // without this fan-out, inpatient procedures get anchored to the
  // admission day (func_date) and emitted with code:"" (no PCS code).
  const procIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "procedures");
  if (procIdx >= 0 && settled[procIdx].status === "fulfilled") {
    const visits = settled[procIdx].value.rawList || [];
    if (visits.length > 0) {
      try {
        const procs = await _withProgressTimer(
          (sec) =>
            sec === 0
              ? `📥 取得 ${visits.length} 筆處置/手術詳情…`
              : `📥 取得 ${visits.length} 筆處置/手術詳情…（已 ${sec} 秒）`,
          () => _fetchProcedureDetailsInTab({ tabId, baseUrl: BASE, visits }),
        );
        settled[procIdx].value.items = procs;
        settled[procIdx].value.raw_count = procs.length;
        settled[procIdx].value.visitCount = visits.length;
      } catch (e) {
        errors.push(`procedures detail: ${e.message}`);
      }
    }
  }
  _markPhase("procedures-detail");

  // Step 1e: chronic prescriptions (IHKE3307S01). Must run BEFORE the
  // regular medication fan-out because ~52/126 (observed) chronic rows
  // share row_IDs with regular IHKE3306S01 — we collect chronic IDs
  // first and pass them as skipRowIds to the regular fan-out so each
  // row is fetched exactly once. Chronic drugs get is_chronic=true →
  // MedicationRequest.courseOfTherapyType=continuous.
  const chronicRowIds = new Set();
  const chronicIdx = NHI_API_ENDPOINTS.findIndex(
    (e) => e.name === "chronic_prescriptions",
  );
  if (chronicIdx >= 0 && settled[chronicIdx].status === "fulfilled") {
    const visits = settled[chronicIdx].value.rawList || [];
    if (visits.length > 0) {
      try {
        const drugItems = await _withProgressTimer(
          (sec) =>
            sec === 0
              ? `📥 取得 ${visits.length} 筆慢性處方箋…`
              : `📥 取得 ${visits.length} 筆慢性處方箋…（已 ${sec} 秒）`,
          () => _fetchChronicMedicationDetailsInTab({ tabId, baseUrl: BASE, visits }),
        );
        settled[chronicIdx].value.items = drugItems;
        settled[chronicIdx].value.visitCount = visits.length;
        settled[chronicIdx].value.raw_count = drugItems.length;
        for (const v of visits) {
          const id = v.row_ID || v.rowid || v.rowID;
          if (id) chronicRowIds.add(id);
        }
      } catch (e) {
        errors.push(`chronic prescriptions detail: ${e.message}`);
      }
    }
  }
  _markPhase("chronic-detail");

  const medIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "medications");
  if (medIdx >= 0 && settled[medIdx].status === "fulfilled") {
    const visits = settled[medIdx].value.rawList || [];
    if (visits.length > 0) {
      const remaining = visits.filter((v) => {
        const id = v.row_ID || v.rowid || v.rowID;
        return id && !chronicRowIds.has(id);
      }).length;
      try {
        const drugItems = await _withProgressTimer(
          (sec) =>
            sec === 0
              ? `📥 取得 ${remaining} 筆用藥明細…`
              : `📥 取得 ${remaining} 筆用藥明細…（已 ${sec} 秒）`,
          () =>
            _fetchMedicationDetailsInTab({
              tabId, baseUrl: BASE, visits, skipRowIds: chronicRowIds,
            }),
        );
        settled[medIdx].value.items = drugItems;
        // raw_count now reflects the *drug-level* count for the breakdown
        // (visits → drugs). Keep the visit count in a side field for debug.
        settled[medIdx].value.visitCount = visits.length;
        settled[medIdx].value.raw_count = drugItems.length;
      } catch (e) {
        errors.push(`medications detail: ${e.message}`);
      }
    }
  }
  _markPhase("medication-detail");

  // Step 2: aggregate items by page_type, POST to backend.
  const byType = {};
  let raw_total = 0;
  let adapted_total = 0;
  // Per-endpoint breakdown so the final status can tell user exactly
  // which endpoints came back empty / mis-shaped — much more useful than
  // a single aggregated number.
  // Breakdown shown to the user under "查看明細". Use the Chinese label
  // when known; only fall back to the raw endpoint name for unmapped
  // (newly added) endpoints. Empty-result endpoints are omitted from
  // the success summary entirely — they add noise. Errors always show
  // so the user knows something didn't come through.
  const breakdown = [];
  for (let i = 0; i < settled.length; i++) {
    const ep = NHI_API_ENDPOINTS[i];
    const s = settled[i];
    const label = ENDPOINT_LABEL_ZH[ep.name] ?? ep.name;
    if (s.status === "rejected") {
      errors.push(`${ep.name}: ${s.reason.message}`);
      breakdown.push(`❌ ${label}：取得失敗`);
      continue;
    }
    const { items, raw_count } = s.value;
    raw_total += raw_count;
    adapted_total += items.length;
    if (raw_count === 0) continue; // nothing to show
    if (items.length > raw_count && raw_count > 0) {
      // 1-to-many adapter (e.g. adult_preventive: one screening row →
      // ~18 Observations). Show both numbers so the user understands
      // why one record produced many.
      breakdown.push(`${label}：${raw_count} 筆 → ${items.length} 項`);
    } else {
      breakdown.push(`${label}：${items.length} 筆`);
    }
    // Save body sample for first endpoint with raw>0 but adapted=0 (adapter
    // mismatch) so we can iterate. Stored under chrome.storage.local for
    // inspection via service worker DevTools.
    //
    // GATED on DEBUG_STASH_BODY_SAMPLES: the sample contains raw NHI
    // PHI (lab values, drug names) and we don't want it sitting in
    // chrome.storage.local indefinitely in the published extension.
    // Flip the flag at the top of this file to true *locally* when
    // diagnosing adapter mismatches.
    if (DEBUG_STASH_BODY_SAMPLES && raw_count > 0 && items.length === 0) {
      try {
        await chrome.storage.local.set({
          [`__sampleBody_${ep.name}`]: s.value.bodySample || "n/a",
        });
      } catch {}
    }
    if (items.length === 0) continue;
    (byType[ep.page_type] = byType[ep.page_type] || []).push(...items);
  }

  // Mask gate is read fresh per sync — defaults OFF per the discussion
  // (citizen-self-download doesn't need anonymization). When ON, also
  // scrub the user's real name out of any NHI narrative field before
  // it flows into the mapper.
  const maskEnabled = await _isMaskEnabled();
  if (maskEnabled && patientOverride.name) {
    const replacement = maskName(patientOverride.name);
    for (const key of Object.keys(byType)) {
      byType[key] = _replaceNameDeep(byType[key], patientOverride.name, replacement);
    }
  }

  let total = 0;
  let _localFilename = null;
  if (mode === "local") {
    if (_cancelled) throw new Error(CANCEL_ERROR);
    await setStatus({ progress: "🧬 轉換為健康紀錄檔…", totalResources: 0 });
    let bundle;
    try {
      bundle = _assembleLocalBundle(byType, patientOverride, maskEnabled);
    } catch (e) {
      errors.push(`local mapping: ${e.message}`);
      bundle = null;
    }
    if (bundle) {
      total = bundle.entry.length;
      await setStatus({ progress: `💾 準備 ${total} 筆健康資料…`, totalResources: total });
      try {
        const dl = await _stashFhirBundle(bundle, patientOverride.id_no, dateRange);
        _localFilename = dl.filename;
      } catch (e) {
        errors.push(`stash bundle: ${e.message}`);
      }
    }
  } else {
    // Build the override we send to backend with the maybe-masked name
    // so backend's auto-created Patient + the per-item subject.display
    // see the same value the user opted into. Items themselves were
    // already scrubbed above (byType pass), so this just covers the
    // override-derived Patient.
    const uploadOverride = maskEnabled && patientOverride.name
      ? { ...patientOverride, name: maskName(patientOverride.name) }
      : patientOverride;
    for (const [page_type, items] of Object.entries(byType)) {
      if (_cancelled) throw new Error(CANCEL_ERROR);
      await setStatus({
        progress: `⬆️ 上傳 ${ENDPOINT_LABEL_ZH[page_type] ?? page_type}（${items.length} 筆）…`,
        totalResources: total,
      });
      try {
        const data = await _postStructured(backend, page_type, items, syncApiKey, uploadOverride);
        total += data.count || 0;
      } catch (e) {
        errors.push(`upload ${page_type}: ${e.message}`);
      }
    }

    // After backend upload, also fetch a snapshot of the patient's full
    // cumulative FHIR Bundle and stash it for the popup's "📥 下載" button.
    // This is what `/fhir/export` returns — the backend's complete view
    // of this patient (this sync + any prior syncs), as opposed to local
    // mode's "just this sync" bundle.
    //
    // Skip stashing entirely when the upload pass produced no resources
    // — exporting 0 entries then stashing them creates a misleading
    // "本地 ✓ 0 筆" indicator and a useless 📤 上傳 button.
    if (patientOverride.id_no && total > 0) {
      try {
        await setStatus({ progress: "📦 整理伺服器上的完整資料…", totalResources: total });
        // Backend stores Patient under derivePatientId(rawId), so the
        // export filter must use the hashed form — querying with the
        // raw national ID matches zero rows even when data is there.
        const fhirPid = derivePatientId(patientOverride.id_no);
        const expUrl = `${backend}/fhir/export?patient=${encodeURIComponent(fhirPid)}`;
        const r = await fetch(expUrl, {
          headers: syncApiKey ? { "X-Sync-API-Key": syncApiKey } : {},
        });
        if (r.ok) {
          const bundle = await r.json();
          // Pass the same dateRange the user picked through so the
          // downloaded filename reflects "最近 3 年" → 2023-2026 instead
          // of always synthesizing today-1y → today.
          const dl = await _stashFhirBundle(bundle, patientOverride.id_no, dateRange);
          _localFilename = dl.filename;
          // Align reported count with local mode: bundle.entry.length
          // includes the Patient resource (which the per-page-type POST
          // counts had previously omitted because Patient is auto-created
          // silently from patient_override). Same data → same number.
          //
          // Defensive: only OVERWRITE total when export actually returned
          // something. If export returns 0 entries despite a successful
          // upload (could happen with a stale-DB hash mismatch we haven't
          // fixed yet), don't clobber the truthful upload count — that's
          // exactly the bug that made "已更新 81 筆" silently become
          // "已更新 0 筆".
          if (Array.isArray(bundle.entry) && bundle.entry.length > 0) {
            total = bundle.entry.length;
          }
        } else {
          errors.push(`export bundle: HTTP ${r.status}`);
        }
      } catch (e) {
        errors.push(`export bundle: ${e.message}`);
      }
    }
  }
  _markPhase(mode === "local" ? "assemble+stash" : "backend-upload");

  // Format elapsed wall-clock time: seconds (1 dp) for short syncs,
  // "mm:ss" once we cross the minute mark so the popup status stays readable.
  const _elapsedMs = Date.now() - _t0;
  const _elapsedStr = _elapsedMs < 60_000
    ? `${(_elapsedMs / 1000).toFixed(1)}s`
    : `${Math.floor(_elapsedMs / 60_000)}m${Math.round((_elapsedMs % 60_000) / 1000)}s`;
  // No more "檔案已備妥…" tail — the 📥 download button sits right
  // below the status, so saying "點下方按鈕" is just noise.
  const _localTail = "";
  const _successVerb = mode === "local" ? "已產生" : "已更新";
  // Phase timings (`nhi-parallel=8s`, `backend-upload=0.8s`) are dev
  // info — useful when investigating a slow sync but noise for an end
  // user. Keep them, but tag with the "⏱" prefix the popup uses to
  // tuck them into a deeper "技術細節" sub-toggle.
  const _phaseLines = _phases.map((p) => `⏱ ${p.name}=${(p.ms / 1000).toFixed(1)}s`);
  const _fullBreakdown = [...breakdown, ..._phaseLines];

  // Pick the right summary line. Zero-result is the trickiest case:
  // we don't want a green ✅ saying "0 筆" because that reads as
  // "succeeded with zero data". That's almost always one of:
  //   - NHI session expired between the login probe and the sync
  //     (the IHKE3410 probe can still succeed while data endpoints
  //     respond with empty arrays);
  //   - the user truly has no records in the selected date range.
  // Either way the actionable next step is "重新登入 NHI 再試一次".
  let _summaryLine;
  if (errors.length) {
    _summaryLine = `⚠️ 取得完成 · ${_successVerb} ${total} 筆健康紀錄，${errors.length} 項失敗（${_elapsedStr}）${_localTail}`;
  } else if (total === 0) {
    _summaryLine =
      `⚠️ 取得完成但沒抓到任何資料（${_elapsedStr}）— ` +
      `健保存摺 session 可能過期，請回該分頁重新登入；或拉長「日期範圍」再試。`;
  } else {
    _summaryLine = `✅ 取得完成 · ${_successVerb} ${total} 筆健康紀錄（${_elapsedStr}）${_localTail}`;
  }

  await setStatus({
    running: false,
    progress: _summaryLine,
    phase: "done",
    totalResources: total,
    completed: Date.now(),
    elapsedMs: _elapsedMs,
    // Per-endpoint breakdown for the popup's '查看明細' collapsible.
    // Keep as a plain array so popup.js can render with DOM API (no
    // innerHTML / no escaping concerns). Items look like
    // 'encounters=12/12' or 'adult_preventive=2 rows → 36 obs'.
    breakdown: _fullBreakdown,
    errors,
    histno: patientOverride.id_no,
    mode,
    localFilename: _localFilename,
  });

  // Best-effort: write a Sync History row to the backend so the dashboard
  // can show when/who/how-long/what/range. Skipped in local mode (there
  // is no backend). Wrapped + swallowed so a logging failure never
  // propagates back to the user-facing sync status.
  if (mode !== "local") try {
    await fetch(`${backend}/sync/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(syncApiKey ? { "X-Sync-API-Key": syncApiKey } : {}),
      },
      body: JSON.stringify({
        status: errors.length ? "partial" : "success",
        patient_id: patientOverride.id_no || "",
        // /sync/log lands in the dashboard's sync-history row. Only
        // mask when the user has opted in — otherwise dashboard sees
        // the raw name they typed (consistent with "民眾自用" default).
        patient_name: maskEnabled
          ? maskName(patientOverride.name || "")
          : patientOverride.name || "",
        total,
        breakdown,
        date_range: dateRangeLabel || "",
        elapsed_ms: _elapsedMs,
        started_at: new Date(_t0).toISOString(),
        errors,
      }),
    });
  } catch (e) {
    console.warn("[NHI sync] failed to write history log:", e);
  }
  _activeSyncCtx = null;
}

// One-time migration from chrome.storage.sync → chrome.storage.local.
// Previous versions stored syncApiKey + patientOverride (containing the
// national ID) under .sync, which Chrome replicates to the user's Google
// account and pushes to every device they sign into. Move everything
// settings-related to .local; clear the sync copy.
const SYNC_KEYS_TO_MIGRATE = [
  "backendUrl",
  "syncApiKey",
  "smartAppLaunchUrl",
  "patientOverride",
  "syncMode",
  "maskNameEnabled",
];

async function migrateSyncToLocal() {
  try {
    const synced = await chrome.storage.sync.get(SYNC_KEYS_TO_MIGRATE);
    const present = Object.fromEntries(
      Object.entries(synced).filter(([, v]) => v !== undefined),
    );
    if (Object.keys(present).length === 0) return;
    const local = await chrome.storage.local.get(Object.keys(present));
    // Don't overwrite anything the user already set on this machine.
    const toWrite = Object.fromEntries(
      Object.entries(present).filter(([k]) => local[k] === undefined),
    );
    if (Object.keys(toWrite).length > 0) {
      await chrome.storage.local.set(toWrite);
    }
    await chrome.storage.sync.remove(Object.keys(present));
  } catch {
    // Migration is best-effort. The next run gets to try again.
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  await migrateSyncToLocal();
  // Security audit #5 cleanup: users upgrading from <= v0.8.7 may have
  // a `pendingFhirBundle` (entire FHIR Bundle JSON) and/or
  // `__sampleBody_*` entries (raw NHI payload) sitting in
  // chrome.storage.local from previous installs. The new version uses
  // chrome.storage.session for the pending bundle and gates the body
  // samples behind a debug flag — so those local entries are now pure
  // PHI dead weight. Sweep them on every install/update.
  try {
    const all = await chrome.storage.local.get(null);
    const stale = Object.keys(all).filter(
      (k) => k === "pendingFhirBundle" || k.startsWith("__sampleBody_"),
    );
    if (stale.length) await chrome.storage.local.remove(stale);
  } catch {}
});

// Also run migration on service-worker wake-up (covers reload/restart
// paths where onInstalled doesn't fire).
chrome.runtime.onStartup?.addListener?.(() => {
  migrateSyncToLocal();
});
migrateSyncToLocal();

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
      () => { try { sendResponse({ ok: true }); } catch {} },
      async (e) => {
        if (e?.message === CANCEL_ERROR) {
          try { sendResponse({ ok: true, cancelled: true }); } catch {}
          return;
        }
        if (e?.message === SESSION_EXPIRED_ERROR) {
          await chrome.storage.local.set({
            syncStatus: {
              running: false,
              progress: "🔒 健保存摺登入逾時 — 請回到健保存摺分頁重新登入，然後再按「取得健保存摺資料」",
              phase: "session_expired",
              ts: Date.now(), completed: Date.now(),
            },
          });
          try { sendResponse({ ok: false, expired: true }); } catch {}
          return;
        }
        console.error("runNhiApiSync failed", e);
        await setStatus({ running: false, progress: `❌ ${e.message}`, phase: "error" });
        try { sendResponse({ ok: false, error: e.message }); } catch {}
      },
    );
    return true;
  }
  if (msg?.type === "stopSync") {
    // Set the cancellation flag; the in-flight sync will throw
    // CANCEL_ERROR at its next checkCancel() call.  Storage is already
    // updated by the popup, so we don't touch it here.
    _cancelled = true;
    // Discard any partial data uploaded so far. The user's stated
    // contract is 'stop = abort, I'll resync from scratch later' — we
    // don't want to leave a half-loaded patient in the FHIR store that
    // looks complete to downstream SMART apps.
    const ctx = _activeSyncCtx;
    if (ctx?.patientId && ctx.backend) {
      (async () => {
        try {
          // Backend stores Patient under derivePatientId(rawId), so the
          // DELETE path must use the hashed form — sending the raw ID
          // matches nothing and leaves the partial upload in the store.
          const fhirPid = derivePatientId(ctx.patientId);
          await fetch(
            `${ctx.backend}/sync/patient/${encodeURIComponent(fhirPid)}`,
            {
              method: "DELETE",
              headers: ctx.syncApiKey ? { "X-Sync-API-Key": ctx.syncApiKey } : {},
            },
          );
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
    _activeSyncCtx = null;
    try { sendResponse({ ok: true }); } catch {}
    return true;
  }
  if (msg?.type === "getSyncStatus") {
    chrome.storage.local.get(STORAGE_KEY).then((data) => sendResponse(data[STORAGE_KEY] || null));
    return true;  // async response
  }
  if (msg?.type === "clearSyncStatus") {
    chrome.storage.local.remove(STORAGE_KEY).then(() => sendResponse({ ok: true }));
    return true;
  }
  if (msg?.type === "checkNhiLogin") {
    _checkNhiLoginState(msg.tabId).then(
      (state) => { try { sendResponse({ loggedIn: state }); } catch {} },
      () => { try { sendResponse({ loggedIn: null }); } catch {} },
    );
    return true;
  }
});

// Belt-and-suspenders SW keepalive: an alarm every 20 s wakes the SW if
// idle. Combined with the return-true pattern above, this prevents the
// 30 s idle shutdown from ending an in-progress sync.
chrome.alarms.create("sw-keepalive", { periodInMinutes: 0.34 });

// PHI TTL sweep (security audit #5): even though pendingFhirBundle now
// lives in chrome.storage.session (auto-cleared on browser close) and
// downloadPendingBundle wipes it on user-initiated save, a user who
// completes a sync and then leaves the browser open for hours without
// downloading would still have an in-memory copy lingering. The 10-min
// alarm checks the stash's age and drops it once it exceeds
// PENDING_BUNDLE_TTL_MS (1 hour).
chrome.alarms.create(PENDING_BUNDLE_SWEEP_ALARM, { periodInMinutes: 10 });

async function _sweepPendingBundleIfStale() {
  try {
    const { [PENDING_BUNDLE_KEY]: pending } =
      await chrome.storage.session.get(PENDING_BUNDLE_KEY);
    if (!pending) return;
    const age = Date.now() - (pending.generatedAt || 0);
    if (age > PENDING_BUNDLE_TTL_MS) {
      await chrome.storage.session.remove(PENDING_BUNDLE_KEY);
    }
  } catch {}
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === PENDING_BUNDLE_SWEEP_ALARM) {
    _sweepPendingBundleIfStale();
  }
  // sw-keepalive is a no-op; the alarm firing is what keeps the SW alive.
});
