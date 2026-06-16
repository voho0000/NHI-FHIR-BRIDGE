// The "Sync This Patient" workflow. Owns the ordered phase sequence:
// resolve patient ID → parallel list fetch → per-endpoint detail fan-outs
// (encounters / inpatient / imaging / procedures / chronic + regular
// meds) → aggregate by page_type → local-bundle assembly OR backend
// upload → completion status + history log.
//
// Modes:
//   - "local"   → run mappers in-extension, stash a FHIR Bundle for
//                 download. No backend required.
//   - "backend" → POST per-page_type items to /sync/upload-structured,
//                 then export the cumulative bundle for the popup.

import {
  dedupImagingItems,
  maskId,
  maskName,
  stripJpegMetadataBase64,
} from "@nhi-fhir-bridge/mapper";
import {
  // adaptEncounterFromMedExpense is invoked directly from the
  // IHKE3303S02 detail fan-out (overrides the registry's classHint
  // with 急診/住院 derived from the detail body), so it needs to be
  // a named import — not only reachable via NHI_API_ENDPOINTS[i].adapt.
  // Forgetting this re-import after extracting the endpoint registry
  // in v0.6.3 shipped a ReferenceError that only fired in production
  // syncs with non-empty encounters. Tests don't exercise that path.
  adaptEncounterFromMedExpense,
  adaptImageOnlyReportFromMeta,
  adaptInpatientEncounter,
  adaptInpatientProcedures,
} from "../nhi-adapters.js";
import { ENDPOINT_LABEL_ZH, NHI_API_ENDPOINTS } from "../nhi-endpoints.js";
import { maybeFetchPatientIdFromNhi } from "./auth.js";
import { exportPatientBundle, postStructuredChunked, postSyncLog } from "./backend-upload.js";
import { clearResultBadge, showResultBadge } from "./badge.js";
import { assembleLocalBundle, stashFhirBundle } from "./bundle.js";
import {
  CANCEL_ERROR,
  DEBUG_STASH_BODY_SAMPLES,
  NHI_HOST,
  PENDING_BUNDLE_JSON_KEY,
  PENDING_BUNDLE_KEY,
  SESSION_EXPIRED_ERROR,
} from "./constants.js";
import { startPrepPolling, stopPrepPolling } from "./imaging-prep-poll.js";
import {
  fetchChronicMedicationDetails,
  fetchEncounterDetails,
  fetchImagingDetails,
  fetchInpatientDetails,
  fetchMedicationDetails,
  fetchProcedureDetails,
} from "./nhi-detail-fetchers.js";
import {
  appendPendingImaging,
  loadPendingImaging,
  pollFetchImagingJpegs,
  removePendingImaging,
  saveBearerTokenForBgPoll,
  sweepPendingImagingWithTimeout,
  // triggerImagingRowsViaHiddenTab — legacy Vue-click flow. v0.15+
  // routes via the SW-direct fetch path below; this stays exported
  // for emergency rollback. Per-row rownum extraction (see
  // triggerImagingRowsViaSwFetch comments) closed the gap that
  // previously made direct API trigger fail.
  triggerImagingRowsViaSwFetch,
} from "./nhi-imaging-jpeg.js";

// Wait for a tab to finish loading after chrome.tabs.update navigation.
// Resolves when status === "complete", or after timeoutMs (whichever
// comes first). Used by the imaging trigger phase, which must run
// chrome.scripting.executeScript on a fully-loaded page (else the
// in-tab Vue app isn't mounted yet and the trigger flow can't find
// the list component).
function waitForTabComplete(tabId: number, timeoutMs: number): Promise<void> {
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
import { rocToISO } from "../nhi-adapters.js";
import { fetchDischargeSummaryHtmls } from "./discharge-summary-fetcher.js";
import { imagingListNeedsResolve } from "./imaging-list-status.js";
import {
  adaptSettledLists,
  fetchNhiListsInTab,
  refetchImagingListUntilResolved,
} from "./nhi-list-fetch.js";
import {
  applyDateRangeToPath,
  deidentifyOverride,
  isMaskEnabled,
  replaceNameDeep,
} from "./patient-override.js";
import {
  classFromS02Detail,
  pickS02MainRow,
  primaryIcdFromS02Detail,
  secondaryIcdsFromS02Detail,
} from "./s02-detail.js";
import {
  isCancelled,
  resetCancelled,
  setActiveSyncCtx,
  setStatus,
  withProgressTimer,
} from "./sync-state.js";

const SESSION_EXPIRED_HINT =
  "健康存摺登入逾時（電腦休眠或閒置太久），請回健康存摺分頁重新登入，再按一次「取得健康存摺資料」即可補齊。";

// Final pass over the breakdown's failure list: swap the internal
// SESSION_EXPIRED_ERROR sentinel ("__SESSION_EXPIRED__") for plain wording.
// It was leaking raw to the UI when the bearer token expired mid-sync — e.g.
// the laptop slept / was closed during a long imaging wait and the NHI
// session timed out. Done as ONE pass over the whole array (not per
// catch-site) so the sentinel is humanised no matter which endpoint's catch
// composed the line.
function _humanizeErrors(errs: string[]): string[] {
  return errs.map((line) =>
    line.includes(SESSION_EXPIRED_ERROR)
      ? line.split(SESSION_EXPIRED_ERROR).join(SESSION_EXPIRED_HINT)
      : line,
  );
}

export async function runNhiApiSync({
  tabId,
  mode,
  backend,
  syncApiKey,
  nhiBase,
  patientOverride,
  dateRange,
  dateRangeLabel,
  fetchImagingEnabled,
}) {
  resetCancelled();
  const BASE = nhiBase || `https://${NHI_HOST}`;

  if (!patientOverride) {
    await chrome.storage.local.set({
      syncStatus: {
        running: false,
        progress: "⛔ 請先到「② 您的資料」填寫資料後再試",
        phase: "error",
        ts: Date.now(),
        completed: Date.now(),
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
  patientOverride = await maybeFetchPatientIdFromNhi(tabId, patientOverride);

  // Snapshot the Bearer token EARLY (right after patient id is known)
  // so the sync-time sweep — kicked off in parallel with trigger
  // below — can SW-direct-fetch NHI's IHKE3408 endpoints without
  // chrome.scripting on a visible tab. Without this early save the
  // sweep races sync end and fails with SESSION_EXPIRED.
  if (fetchImagingEnabled && patientOverride.id_no) {
    try {
      await saveBearerTokenForBgPoll(tabId, patientOverride.id_no);
    } catch {}
  }

  // Stash context so the stopSync message handler can wipe partial
  // data (DELETE /sync/patient/{id_no}) without us having to send it
  // back through chrome.runtime.sendMessage.
  setActiveSyncCtx({ backend, syncApiKey, patientId: patientOverride.id_no });

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
    running: true,
    progress: "🚀 開始取得健康存摺資料…",
    phase: "init",
    started: _t0,
    totalResources: 0,
    host: NHI_HOST,
    errors: [],
  });
  // Drop any unseen-result badge from a previous run so the toolbar dot
  // reflects THIS sync once it finishes (and isn't a stale leftover while
  // the new run is in progress).
  await clearResultBadge();
  // Drop the previous sync's stashed FHIR bundle (the file the popup's
  // "下載健康紀錄檔" panel was offering). Otherwise during a re-sync the
  // user sees the OLD filename + size + "X 分鐘前" timestamp underneath
  // the live progress banner — visually identical to the new one being
  // built, so it's easy to assume the in-flight sync is already done
  // and download last-time's stale data. Cleared at sync START (not
  // sync end) on purpose: at end the new bundle is written into the
  // same slot, so an end-of-sync clear would race the new write.
  // v0.16.1: remove BOTH metadata + JSON keys (storage split).
  await chrome.storage.local.remove([PENDING_BUNDLE_KEY, PENDING_BUNDLE_JSON_KEY]).catch(() => {});
  // v0.16.0: a new sync supersedes whatever the prep poller was
  // tracking. Clear it now so the banner disappears and the alarm
  // doesn't fire mid-sync trying to use a possibly-stale token.
  await stopPrepPolling().catch(() => {});

  // Step 1: fetch all endpoints in PARALLEL inside the NHI tab. Inject
  // the ISO date range into each endpoint that supports it; skipped
  // endpoints keep their default NHI-side window. Pass only serialisable
  // data (paths, method, name); adapters stay in the SW.
  const fetchSpec = NHI_API_ENDPOINTS.map((ep) => {
    const path = ep.supportsDateRange ? applyDateRangeToPath(ep.path, dateRange) : ep.path;
    return { name: ep.name, url: BASE + path, method: "GET" };
  });

  const settledRaw = await fetchNhiListsInTab(tabId, fetchSpec);

  const errors = [];

  // Apply SW-side adapters to each endpoint's body.
  const settled = adaptSettledLists(settledRaw);

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
        const detailMap = await withProgressTimer(
          (sec) =>
            sec === 0
              ? `📥 取得 ${visits.length} 筆就醫紀錄詳情…`
              : `📥 取得 ${visits.length} 筆就醫紀錄詳情…（已 ${sec} 秒）`,
          () => fetchEncounterDetails({ tabId, baseUrl: BASE, visits }),
        );
        // Re-adapt with classHint + secondary diagnoses + bilingual
        // primary ICD all sourced from the S02 detail body.
        const reAdapted = [];
        for (let i = 0; i < visits.length; i++) {
          const detail = detailMap?.get(i) || null;
          const cls = classFromS02Detail(detail) || "AMB";
          const secondaryDiagnoses = secondaryIcdsFromS02Detail(detail);
          const primaryDiagnosis = primaryIcdFromS02Detail(detail);
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
  // dischargeSummaryItems is hoisted so the post-aggregation step
  // (byType.document_references) sees it regardless of which branch
  // populated it. Lives at outer scope so an empty inpatient list
  // still hits the breakdown loop with a stable variable.
  const dischargeSummaryItems: Record<string, any>[] = [];
  // Sub-metrics surfaced under the 住院 breakdown line so users see
  // why some inpatient rows didn't produce DocumentReferences.
  let dischargeCandidates = 0;
  // Surgeries extracted from 住院 details (IHKE3309S02 op_CODE / opcode_data) —
  // collected during the inpatient walk, merged into the `procedures` bucket
  // after that endpoint is built (it runs later and would otherwise overwrite).
  const inpatientProcedureItems: any[] = [];
  let dischargeFetched = 0;
  let dischargeFetchFailed = 0;
  const inpIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "inpatient");
  if (inpIdx >= 0 && settled[inpIdx].status === "fulfilled") {
    const visits = settled[inpIdx].value.rawList || [];
    if (visits.length > 0) {
      try {
        const detailMap = await withProgressTimer(
          (sec) =>
            sec === 0
              ? `📥 取得 ${visits.length} 筆住院紀錄詳情…`
              : `📥 取得 ${visits.length} 筆住院紀錄詳情…（已 ${sec} 秒）`,
          () => fetchInpatientDetails({ tabId, baseUrl: BASE, visits }),
        );
        const reAdapted = [];
        // Build the discharge-summary candidate list during the same
        // visit walk that runs the encounter re-adaptation, so the
        // S02-detail body is iterated only once per row.
        const dischargeCandidatesRaw: Array<{
          rowId: string;
          ctype: string;
          hospital: string;
          admissionDate: string;
          dischargeDate: string;
        }> = [];
        for (let i = 0; i < visits.length; i++) {
          const detail = detailMap?.get(i) || null;
          const primaryDiagnosis = primaryIcdFromS02Detail(detail);
          const secondaryDiagnoses = secondaryIcdsFromS02Detail(detail);
          const it = adaptInpatientEncounter(visits[i], {
            primary_diagnosis: primaryDiagnosis,
            secondary_diagnoses: secondaryDiagnoses,
          });
          if (it) reAdapted.push(it);
          // 出院病摘 candidacy gate — `has_XML` on the S02 detail body
          // is NHI's signal that a discharge summary HTML document is
          // available for this row via /getxml. `has_PDF` is a parallel
          // signal for PDF rendering — v0.16 intentionally HTML-only.
          const mainRow = pickS02MainRow(detail);
          // Surgeries done during this stay (op_CODE / opcode_data) → Procedures.
          // The 手術 list (IHKE3301S05) misses most of these; the 住院 detail is
          // their only faithful source. Merged into the procedures bucket below.
          if (mainRow) inpatientProcedureItems.push(...adaptInpatientProcedures(mainRow));
          const hasXml = String(mainRow?.has_XML || mainRow?.has_xml || "").toUpperCase() === "Y";
          if (!hasXml) continue;
          const v = visits[i];
          const rowId = String(v?.row_ID || v?.row_id || v?.roW_ID || "");
          if (!rowId) continue;
          dischargeCandidatesRaw.push({
            rowId,
            // ctype=3 (住院) — same value the detail page_load uses.
            // Hardcoded because IHKE3309S02 only returns data for ctype=3
            // and the modal's "查看檔案" link always sends t=3.
            ctype: "3",
            hospital: String(v?.hosp_ABBR || v?.hosp_abbr || ""),
            admissionDate: rocToISO(v?.in_DATE || v?.func_DATE || "") || "",
            dischargeDate: rocToISO(v?.out_DATE || "") || "",
          });
        }
        settled[inpIdx].value.items = reAdapted;
        settled[inpIdx].value.raw_count = reAdapted.length;
        dischargeCandidates = dischargeCandidatesRaw.length;

        // Fan-out for the actual HTML payloads. Runs after the visit
        // walk above is fully synchronous so detail-body parsing /
        // candidate identification is never raced by the network step.
        if (dischargeCandidatesRaw.length > 0) {
          try {
            const htmlMap = await withProgressTimer(
              (sec) =>
                sec === 0
                  ? `📥 取得 ${dischargeCandidatesRaw.length} 份出院病摘…`
                  : `📥 取得 ${dischargeCandidatesRaw.length} 份出院病摘…（已 ${sec} 秒）`,
              () =>
                fetchDischargeSummaryHtmls({
                  tabId,
                  baseUrl: BASE,
                  candidates: dischargeCandidatesRaw.map(({ rowId, ctype }) => ({ rowId, ctype })),
                }),
            );
            for (const cand of dischargeCandidatesRaw) {
              const html = htmlMap.get(cand.rowId);
              if (!html) {
                dischargeFetchFailed++;
                continue;
              }
              dischargeFetched++;
              dischargeSummaryItems.push({
                html,
                row_id: cand.rowId,
                hospital: cand.hospital,
                admission_date: cand.admissionDate,
                discharge_date: cand.dischargeDate,
              });
            }
          } catch (e: any) {
            errors.push(`discharge summary: ${e?.message || e}`);
          }
        }
      } catch (e) {
        errors.push(`inpatient detail: ${e.message}`);
      }
    }
  }
  _markPhase("inpatient-detail");

  // Step 1c: imaging needs IHKE3408S02 for the actual report narrative.
  // List endpoint only has order metadata; ctype param mirrors the
  // visit's ori_TYPE (A / E / …).
  const imgIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "imaging");
  let imagingJpegCandidates = [];
  if (imgIdx >= 0 && settled[imgIdx].status === "fulfilled") {
    let visits = settled[imgIdx].value.rawList || [];
    // First-entry "資料確認中 / 資料準備中" resolve. On the FIRST access
    // to a never-synced patient's imaging list, NHI lazily confirms it
    // server-side and the bulk fetch above can capture a transient,
    // INCOMPLETE snapshot — its SPA labels these "資料確認中" or "資料準備
    // 中". Observed shapes differ: a brand-new patient returns rows with
    // jpG_STATUS "-"; another returned a single "資料準備中" row (no "-")
    // and the real image candidate only appeared as a SECOND row after a
    // refresh. We therefore do NOT key off any specific transient code
    // (v0.17.5 only watched "-" and missed the "資料準備中" shape). Rule:
    // if NO row exposes a usable image yet (jpG_STATUS "A" needs-trigger
    // or "1" bytes-ready), treat the list as still-preparing and refetch
    // (cache-busted, polls until an A/1 appears or the attempt budget is
    // spent → genuinely no image). Only when the user opted into image
    // download — narrative DR emission is unaffected by jpG_STATUS, so an
    // opted-out sync gets identical reports either way. Non-fatal — any
    // failure falls back to the original snapshot.
    if (fetchImagingEnabled && visits.length > 0 && imagingListNeedsResolve(visits)) {
      try {
        const imgEp = NHI_API_ENDPOINTS[imgIdx];
        const imagingUrl =
          BASE +
          (imgEp.supportsDateRange ? applyDateRangeToPath(imgEp.path, dateRange) : imgEp.path);
        const resolved = await withProgressTimer(
          (sec) =>
            sec === 0
              ? "🔄 健康存摺正在確認影像清單，請稍候…"
              : `🔄 健康存摺正在確認影像清單，請稍候…（已 ${sec} 秒）`,
          () =>
            refetchImagingListUntilResolved({
              tabId,
              url: imagingUrl,
              // 8×3s ≈ 24s. A first entry after the ~1wk image cache expires
              // re-confirms the list slower than a brand-new patient (~10s),
              // so give it more headroom — only costs latency when image
              // download is on AND the list is genuinely still preparing.
              maxAttempts: 8,
              intervalMs: 3000,
            }),
        );
        if (resolved?.rows?.length) {
          visits = resolved.rows;
          settled[imgIdx].value.rawList = resolved.rows;
        }
      } catch (e: any) {
        errors.push(`imaging list confirm: ${e?.message || e}`);
      }
    }
    if (visits.length > 0) {
      try {
        const detail = await withProgressTimer(
          (sec) =>
            sec === 0
              ? `📥 取得 ${visits.length} 筆影像檢查報告…`
              : `📥 取得 ${visits.length} 筆影像檢查報告…（已 ${sec} 秒）`,
          () => fetchImagingDetails({ tabId, baseUrl: BASE, visits }),
        );
        settled[imgIdx].value.items = detail.reports;
        settled[imgIdx].value.raw_count = detail.reports.length;
        settled[imgIdx].value.visitCount = visits.length;
        imagingJpegCandidates = detail.jpegCandidates || [];
      } catch (e) {
        errors.push(`imaging detail: ${e.message}`);
      }
    }
  }
  _markPhase("imaging-detail");

  // Step 1c′: imaging JPEG trigger phase — sequential, visible Vue-
  // click flow. Runs HERE (before procedures/chronic/meds detail) so:
  //   • the user sees trigger progress within seconds instead of a
  //     minute (faster dev iteration when validating the trigger path)
  //   • the 1-3 min NHI lazy-prep window we wait for in the next
  //     phase overlaps with the other detail fan-outs — pure win
  //
  // Pending stash (v0.15+): rows that triggered successfully last sync
  // but didn't get base64 in time are persisted to chrome.storage. On
  // this sync's start, we:
  //   • Suppress needsTrigger for pending rows so they don't burn the
  //     dev cap — NHI has the trigger queued already, we just need
  //     to wait for prep to finish.
  //   • Kick off sweepPendingImaging() in parallel with the poll-fetch.
  //     Sweep re-hits the list endpoint (cache-busted) and fetches
  //     IHKE3408S03 for any pending row whose seq is now allocated.
  let imagingSweepPromise: Promise<any[]> | null = null;
  let pendingImagingRows: Array<{
    rid: string;
    ctype: string;
    triggeredAt: number;
  }> = [];
  // polledCandidates = jpegCandidates MINUS rows already in pending.
  // We pass this slimmer list to triggerImagingRows + pollFetchImagingJpegs
  // so pending rows don't burn the dev cap (already-triggered prior sync)
  // AND don't get double-fetched (sweep covers them with its own
  // cache-busted list refresh and S03 fetch).
  let polledCandidates = imagingJpegCandidates;
  if (fetchImagingEnabled && imagingJpegCandidates.length > 0 && patientOverride.id_no) {
    try {
      pendingImagingRows = await loadPendingImaging(patientOverride.id_no);
      if (pendingImagingRows.length > 0) {
        // Index by (rid|ctype) → triggeredAt for the stuck-retry gate
        // (a recently-attempted row is left to sweep; an old one is
        // re-included so the trigger phase tries again — NHI's
        // server-side prep system occasionally silent-fails the
        // first attempt and a second click wakes it up).
        const pendingTriggeredAt = new Map<string, number>(
          pendingImagingRows.map((p) => [`${p.rid}|${p.ctype}`, p.triggeredAt]),
        );
        // v0.15+: 10-minute stuck-retry threshold. Pending entries
        // older than this go back into the trigger flow; younger
        // ones are left to sweep.
        const STUCK_RETRY_MS = 10 * 60 * 1000;
        const _nowForRetry = Date.now();
        polledCandidates = imagingJpegCandidates.filter((c: any) => {
          // Ready rows always included (poll-fetch readyIdx path
          // grabs bytes via cache-hit; matchedKeys cleanup at sync
          // end then removes them from the pending stash, regardless
          // of whether they were there before).
          if (!c.needsTrigger) return true;
          const triggeredAt = pendingTriggeredAt.get(`${c.rid}|${c.ctype}`);
          if (triggeredAt === undefined) return true; // not pending → normal trigger path
          // Pending. Re-trigger if older than the retry threshold.
          return _nowForRetry - triggeredAt >= STUCK_RETRY_MS;
        });
      }
    } catch (e: any) {
      errors.push(`imaging pending load: ${e.message}`);
    }
  }
  // v0.15+ refactor: trigger + poll-fetch run as a SINGLE async promise,
  // kicked off here and awaited at the very end. This lets the procedures
  // / chronic / meds detail fan-outs run IN PARALLEL with imaging work
  // — the trigger phase uses a hidden tab while detail fan-outs use the
  // visible tab, so there's no tab-level contention.
  //
  // Pre-refactor flow (sequential): trigger (~2 min sync block) →
  //   poll-fetch starts → procedures/chronic/meds (~1 min) →
  //   await poll-fetch (~remaining of 3 min) ≈ 5 min total.
  // Post-refactor flow (parallel): kick off (trigger+poll) → procedures
  //   /chronic/meds (~1 min) → await imaging promise. Total wall time
  //   ≈ max(trigger + poll, other-detail) ≈ ~2-3 min.
  let imagingPromise: Promise<any[]> | null = null;
  const _imagingStartedAt = Date.now();
  // Bail-out: if the user already pressed stop by this point, don't
  // even kick off the imaging promise (which would otherwise open
  // the hidden tab and burn user-visible work despite cancellation).
  if (isCancelled()) throw new Error(CANCEL_ERROR);
  if (fetchImagingEnabled && polledCandidates.length > 0) {
    const _toTrigger = polledCandidates.filter((c: any) => c.needsTrigger).length;
    // v0.15+ trigger phase = pure SW-direct fetch. Each row:
    //   GET /S02 page_load → extract rownum from response
    //   POST /S02/add { ipl_CASE_SEQ_NO: <rownum> }
    //   GET /S02 page_load → verify jpg_STATUS flipped A → 0
    // No hidden tab, no Vue click, no DOM operations. ~2s/row.
    await setStatus({
      progress: `🖼️ 開始預備影像（背景傳送觸發請求，共 ${_toTrigger} 張，不影響您正在看的分頁）…`,
      phase: "imaging",
    });
    imagingPromise = (async () => {
      try {
        const triggerOutcomes = await triggerImagingRowsViaSwFetch(
          BASE,
          patientOverride.id_no,
          polledCandidates,
        );
        return await pollFetchImagingJpegs(tabId, BASE, polledCandidates, triggerOutcomes);
      } catch (e: any) {
        errors.push(`影像取得：${e?.message ?? e}`);
        return [] as any[];
      }
    })();
  }
  if (fetchImagingEnabled && pendingImagingRows.length > 0 && patientOverride.id_no) {
    imagingSweepPromise = sweepPendingImagingWithTimeout(BASE, patientOverride.id_no, 60_000).catch(
      (e) => {
        errors.push(`前次影像補抓：${e?.message ?? e}`);
        return [] as any[];
      },
    );
  }
  _markPhase("imaging-kickoff");
  const _imgPending = imagingPromise !== null || imagingSweepPromise !== null;
  const _withImgTag = (msg: string) => (_imgPending ? `${msg} · 🖼️ 影像準備中` : msg);

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
        const procs = await withProgressTimer(
          (sec) =>
            _withImgTag(
              sec === 0
                ? `📥 取得 ${visits.length} 筆處置/手術詳情…`
                : `📥 取得 ${visits.length} 筆處置/手術詳情…（已 ${sec} 秒）`,
            ),
          () => fetchProcedureDetails({ tabId, baseUrl: BASE, visits }),
        );
        settled[procIdx].value.items = procs;
        settled[procIdx].value.raw_count = procs.length;
        settled[procIdx].value.visitCount = visits.length;
      } catch (e) {
        errors.push(`procedures detail: ${e.message}`);
      }
    }
  }
  // Merge 住院-detail surgeries into the procedures bucket. Appended HERE (not in
  // the inpatient block) because the IHKE3301S05 fan-out above overwrites
  // `.items`; appending after keeps both. Same page_type → they map + dedup
  // (dedupProcedures) together at bundle assembly. Works even when the 手術 list
  // had zero rows (the common case for inpatient surgeries).
  if (
    inpatientProcedureItems.length > 0 &&
    procIdx >= 0 &&
    settled[procIdx]?.status === "fulfilled"
  ) {
    const existing = settled[procIdx].value.items || [];
    settled[procIdx].value.items = [...existing, ...inpatientProcedureItems];
    settled[procIdx].value.raw_count = settled[procIdx].value.items.length;
  }
  _markPhase("procedures-detail");

  // Step 1e: chronic prescriptions (IHKE3307S01). Must run BEFORE the
  // regular medication fan-out because ~52/126 (observed) chronic rows
  // share row_IDs with regular IHKE3306S01 — we collect chronic IDs
  // first and pass them as skipRowIds to the regular fan-out so each
  // row is fetched exactly once. Chronic drugs get is_chronic=true →
  // MedicationRequest.courseOfTherapyType=continuous.
  const chronicRowIds = new Set();
  const chronicIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "chronic_prescriptions");
  if (chronicIdx >= 0 && settled[chronicIdx].status === "fulfilled") {
    const visits = settled[chronicIdx].value.rawList || [];
    if (visits.length > 0) {
      try {
        const drugItems = await withProgressTimer(
          (sec) =>
            _withImgTag(
              sec === 0
                ? `📥 取得 ${visits.length} 筆慢性處方箋…`
                : `📥 取得 ${visits.length} 筆慢性處方箋…（已 ${sec} 秒）`,
            ),
          () => fetchChronicMedicationDetails({ tabId, baseUrl: BASE, visits }),
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
        const drugItems = await withProgressTimer(
          (sec) =>
            _withImgTag(
              sec === 0
                ? `📥 取得 ${remaining} 筆用藥明細…`
                : `📥 取得 ${remaining} 筆用藥明細…（已 ${sec} 秒）`,
            ),
          () =>
            fetchMedicationDetails({
              tabId,
              baseUrl: BASE,
              visits,
              skipRowIds: chronicRowIds,
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

  // Step 1f: await the imaging promise (trigger + poll-fetch combined)
  // kicked off at step 1c″. By the time we get here, procedures /
  // chronic / meds detail have all resolved sequentially (~1 min);
  // imaging has been running in parallel on the hidden tab + HTTP
  // poll. Whatever's left of the trigger-or-poll budget gets waited
  // here. In the fast path the imaging promise is already resolved
  // when this await is reached.
  if (imagingPromise || imagingSweepPromise) {
    try {
      const N = imagingJpegCandidates.length;
      const needsTrigger = polledCandidates.filter((c: any) => c.needsTrigger).length;
      const alreadyPending = pendingImagingRows.length;
      const jpegResults = await withProgressTimer(
        (sec) => {
          // Wording note (revised 2026-06-05 after user feedback):
          // The earlier "X 張準備中" implied a live "currently in prep"
          // count — but `needsTrigger` is fixed at the start of this
          // phase (count of rows we ASKED NHI to prep) and doesn't
          // decrement as NHI completes them. Users who checked the
          // raw NHI list mid-sync saw zero rows in status="0" yet
          // bridge still showed "X 張準備中" → confusing.
          //
          // New wording focuses on what bridge is doing (waiting for
          // NHI to return bytes) rather than NHI's internal state.
          // "已請求 N 張" = "requested N images" — accurately reflects
          // bridge's action; users understand the actual prep status
          // is on NHI's side and out of bridge's view.
          const pendingPart = alreadyPending > 0 ? `；前次 ${alreadyPending} 張補抓中` : "";
          const head =
            needsTrigger > 0
              ? `🖼️ 等候健保署回傳影像（本次已請求 ${needsTrigger} 張${pendingPart}）`
              : alreadyPending > 0
                ? `🖼️ 等候健保署回傳影像${pendingPart}…`
                : `🖼️ 等候健保署回傳影像（共 ${N} 張）…`;
          return sec === 0 ? `${head}…` : `${head}…（已 ${sec} 秒）`;
        },
        async () => {
          const [pollRes, sweepRes] = await Promise.all([
            imagingPromise ?? Promise.resolve([] as any[]),
            imagingSweepPromise ?? Promise.resolve([] as any[]),
          ]);
          return { pollRes, sweepRes };
        },
      );
      // Merge poll results + sweep results by (rid|ctype). Sweep wins
      // when both fire (sweep only acts on pending rows; pollRes
      // never contains pending rows since we filtered them out via
      // polledCandidates). They're disjoint by construction — the
      // merge is technically a concat. Keeping the Map dedupe as
      // belt-and-suspenders.
      const mergedMap = new Map<string, any>();
      for (const r of jpegResults.pollRes ?? []) {
        if (!r) continue;
        mergedMap.set(`${r.rid}|${r.ctype}`, r);
      }
      for (const r of jpegResults.sweepRes ?? []) {
        if (!r) continue;
        const k = `${r.rid}|${r.ctype}`;
        const existing = mergedMap.get(k);
        // Prefer the one with non-empty jpgBase64s.
        if (!existing || (Array.isArray(r.jpgBase64s) && r.jpgBase64s.length > 0)) {
          mergedMap.set(k, r);
        }
      }
      const allResults: any[] = Array.from(mergedMap.values());

      // Stash counts for telemetry / debug.
      if (imgIdx >= 0 && settled[imgIdx].status === "fulfilled") {
        settled[imgIdx].value.jpegResults = allResults;
        // "Ready" means we got at least one base64 frame. Counts are
        // per-row, not per-frame — N rows succeeded, regardless of
        // whether each contributed 1 or 10 frames. Frame-level total
        // is computed separately for the breakdown's optional hint.
        const readyCount = allResults.filter(
          (r: any) => Array.isArray(r.jpgBase64s) && r.jpgBase64s.length > 0,
        ).length;
        const frameCount = allResults.reduce(
          (n: number, r: any) => n + (Array.isArray(r.jpgBase64s) ? r.jpgBase64s.length : 0),
          0,
        );
        settled[imgIdx].value.jpegReadyCount = readyCount;
        settled[imgIdx].value.jpegTotal = allResults.length;
        settled[imgIdx].value.jpegFrameCount = frameCount;
        // Split by outcome so the breakdown can show cache hits vs
        // brand-new triggers vs failures. Helpful for the dev loop —
        // a quiet "9/11" tells you nothing about whether NHI's queue
        // is unhealthy or whether you just ran out of fresh rows.
        settled[imgIdx].value.jpegCacheHitCount = allResults.filter(
          (r: any) => r.outcome === "ready",
        ).length;
        settled[imgIdx].value.jpegFreshTriggerCount = allResults.filter(
          (r: any) => r.outcome === "triggered-ready",
        ).length;
        // Trigger-failed splits into "dev-cap-skipped" (intentional —
        // we capped to N to keep dev iterations fast) vs everything
        // else (button-not-shown, mount-timeout, list-comp-missing).
        // The user wants these surfaced separately so the breakdown
        // says "X cap-skipped" instead of inflating an alarming
        // "100+ trigger-fail" count.
        const trigFailed = allResults.filter((r: any) => r.outcome === "trigger-failed");
        const realFailures = trigFailed.filter((r: any) => r.error !== "dev-cap-skipped");
        settled[imgIdx].value.jpegDevCapSkippedCount = trigFailed.filter(
          (r: any) => r.error === "dev-cap-skipped",
        ).length;
        // v0.15+: NHI silent-fail count — rows where bridge's Vue
        // click flow completed but post-verification (re-fetch S02
        // detail) shows jpg_STATUS still "A" (not "0"). Indicates
        // NHI's backend silently rejected the trigger. Surfaced
        // separately so the user can see "bridge clicked but NHI
        // didn't accept" vs the Vue-click-broken failures.
        settled[imgIdx].value.jpegNhiSilentFailCount = realFailures.filter(
          (r: any) => r.error === "nhi-silent-fail",
        ).length;
        // jpegTriggerFailedCount now EXCLUDES silent-fails so the
        // two categories don't double-count.
        settled[imgIdx].value.jpegTriggerFailedCount = realFailures.filter(
          (r: any) => r.error !== "nhi-silent-fail",
        ).length;
        // Collect distinct failure reasons so the breakdown can tell
        // the user *why* triggers failed (vue mount timeout vs NHI
        // button not shown vs network etc.) — not just a bare count.
        const reasonCounts = new Map<string, number>();
        for (const r of realFailures) {
          const reason = String(r.error || "unknown");
          reasonCounts.set(reason, (reasonCounts.get(reason) ?? 0) + 1);
        }
        settled[imgIdx].value.jpegTriggerFailReasons = Array.from(reasonCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3); // top 3 reasons
        // triggered-waiting = trigger Vue flow succeeded but base64
        // didn't arrive within poll window. Recoverable — persisted to
        // chrome.storage so next sync's sweep can pick them up.
        //
        // Split into two sub-counts so the breakdown can show "X new
        // this sync + Y carried-over from previous syncs". Without
        // this split the user sees "9 健康存摺準備中" while dev cap is
        // 3 and wonders if cap is broken — the 9 actually contains 3
        // new + 6 from previous syncs that NHI hasn't finished prep on.
        const pendingKeysSnap = new Set(pendingImagingRows.map((p) => `${p.rid}|${p.ctype}`));
        const waitingResults = allResults.filter((r: any) => r.outcome === "triggered-waiting");
        settled[imgIdx].value.jpegTriggeredWaitingCount = waitingResults.length;
        settled[imgIdx].value.jpegTriggeredWaitingNewCount = waitingResults.filter(
          (r: any) => !pendingKeysSnap.has(`${r.rid}|${r.ctype}`),
        ).length;
        settled[imgIdx].value.jpegTriggeredWaitingCarriedCount = waitingResults.filter((r: any) =>
          pendingKeysSnap.has(`${r.rid}|${r.ctype}`),
        ).length;
        settled[imgIdx].value.jpegTimeoutCount = allResults.filter(
          (r: any) => r.outcome === "timeout",
        ).length;
        settled[imgIdx].value.jpegFetchFailedCount = allResults.filter(
          (r: any) => r.outcome === "fetch-failed",
        ).length;
        // Collect fetch-failed reasons (top 3) so breakdown can surface
        // why bytes didn't land. Mirrors the trigger-fail reason
        // exposure below. Common reasons:
        //   - "missing seq for ready row" → listRow.iplCaseSeqNo was
        //     "-" or empty despite status="1" (NHI listing inconsistency)
        //   - "no base64 in response" → S03 returned 200 OK but pics[]
        //     was empty (NHI cache miss / eviction)
        //   - "HTTP 4xx/5xx" → S03 endpoint error
        //   - "timeout 30s" → S03 didn't respond within deadline
        const fetchFailReasonCounts = new Map<string, number>();
        for (const r of allResults) {
          if (r?.outcome !== "fetch-failed") continue;
          const reason = String(r.error || "unknown");
          fetchFailReasonCounts.set(reason, (fetchFailReasonCounts.get(reason) ?? 0) + 1);
        }
        settled[imgIdx].value.jpegFetchFailReasons = Array.from(fetchFailReasonCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);

        // Re-key allResults by (rid|ctype) so we can match them back
        // to the narrative items. Multiple rows share order_CODE so
        // (rid|ctype) is the only safe identity.
        const resultByKey = new Map<string, any>();
        for (const r of allResults) {
          if (!Array.isArray(r?.jpgBase64s) || r.jpgBase64s.length === 0) continue;
          resultByKey.set(`${r.rid}|${r.ctype}`, r);
        }

        // Pass 1: inject jpgBase64s into existing narrative reports.
        const items = settled[imgIdx].value.items || [];
        const matchedKeys = new Set<string>();
        for (const item of items) {
          if (!item) continue;
          const key = `${item.rid || ""}|${item.ctype || ""}`;
          const match = resultByKey.get(key);
          if (match) {
            item.jpgBase64s = match.jpgBase64s;
            item.iplCaseSeqNo = match.iplCaseSeqNo || null;
            matchedKeys.add(key);
          }
        }

        // Pass 2: for jpeg-ready candidates whose narrative path
        // returned null (image-only rows), synthesize a DR item from
        // mainMeta + jpgBase64s. Without this, X-ray / endoscopy
        // rows with no typed report disappear from the bundle
        // entirely even though the patient can see the image in
        // 健康存摺.
        for (const cand of imagingJpegCandidates) {
          if (cand.hasNarrativeReport) continue;
          const key = `${cand.rid}|${cand.ctype}`;
          const match = resultByKey.get(key);
          if (!match || !Array.isArray(match.jpgBase64s) || match.jpgBase64s.length === 0) {
            continue;
          }
          const synth: any = adaptImageOnlyReportFromMeta(cand.mainMeta, {
            rid: cand.rid,
            ctype: cand.ctype,
          });
          if (!synth) continue;
          synth.jpgBase64s = match.jpgBase64s;
          synth.iplCaseSeqNo = match.iplCaseSeqNo || null;
          items.push(synth);
          matchedKeys.add(key);
        }
        settled[imgIdx].value.items = items;
        settled[imgIdx].value.raw_count = items.length;

        // ── Pending stash cleanup + appendage ─────────────────────
        // Successfully-bundled rows whose key was in pending → remove.
        // Newly triggered-waiting rows → append to pending.
        if (patientOverride.id_no) {
          try {
            const pendingKeysSet = new Set(pendingImagingRows.map((p) => `${p.rid}|${p.ctype}`));
            const removeKeys = new Set<string>();
            for (const k of matchedKeys) {
              if (pendingKeysSet.has(k)) removeKeys.add(k);
            }
            if (removeKeys.size > 0) {
              await removePendingImaging(patientOverride.id_no, removeKeys);
            }
            // Upsert ALL triggered-waiting rows — both new (not in
            // pending before this sync) AND re-triggered (already in
            // pending but stuck-retry threshold elapsed). The upsert
            // semantics in appendPendingImaging refreshes triggeredAt
            // for re-triggered rows, so the next sync's retry gate
            // gives them another 10-min window before re-triggering
            // again. Without this refresh, every sync would re-trigger
            // them in a tight loop.
            const waiting = allResults
              .filter((r: any) => r.outcome === "triggered-waiting")
              .map((r: any) => ({ rid: r.rid, ctype: r.ctype }));
            if (waiting.length > 0) {
              await appendPendingImaging(patientOverride.id_no, waiting);
            }
          } catch (e: any) {
            errors.push(`imaging pending update: ${e.message}`);
          }
        }
      }
    } catch (e) {
      errors.push(`imaging jpeg await: ${(e as any).message}`);
    }
  }
  _markPhase("imaging-jpeg-await");

  // Step 2: aggregate items by page_type, POST to backend.
  const byType = {};
  // Per-endpoint breakdown so the final status can tell user exactly
  // which endpoints came back empty / mis-shaped. Use the Chinese label
  // when known; only fall back to the raw endpoint name for unmapped
  // endpoints. Empty-result endpoints are omitted from the success
  // summary entirely — they add noise. Errors always show.
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
    if (raw_count === 0) continue; // nothing to show
    let line: string;
    if (items.length > raw_count && raw_count > 0) {
      // 1-to-many adapter (e.g. adult_preventive: one screening row →
      // ~18 Observations). Show both numbers so the user understands
      // why one record produced many.
      line = `${label}：${raw_count} 筆 → ${items.length} 項`;
    } else {
      line = `${label}：${items.length} 筆`;
    }
    breakdown.push(line);
    // v0.14 imaging: when the user opted in to JPG fetch, surface how
    // many actually landed vs how many NHI rows were image-bearing
    // candidates. Pushed as a SECOND breakdown row (no full-width
    // colon → routed to br-row-plain in popup/status.ts → block layout
    // that wraps cleanly) to prevent the flex "label: value" row from
    // squeezing the long imaging stats line to 1 char per line.
    if (ep.name === "imaging" && typeof s.value.jpegTotal === "number") {
      const ready = s.value.jpegReadyCount ?? 0;
      const total = s.value.jpegTotal ?? 0;
      const frames = s.value.jpegFrameCount ?? 0;
      const cache = s.value.jpegCacheHitCount ?? 0;
      const fresh = s.value.jpegFreshTriggerCount ?? 0;
      const trigFail = s.value.jpegTriggerFailedCount ?? 0;
      const silentFail = s.value.jpegNhiSilentFailCount ?? 0;
      const capSkipped = s.value.jpegDevCapSkippedCount ?? 0;
      const waiting = s.value.jpegTriggeredWaitingCount ?? 0;
      const waitingNew = s.value.jpegTriggeredWaitingNewCount ?? 0;
      const waitingCarried = s.value.jpegTriggeredWaitingCarriedCount ?? 0;
      const timeout = s.value.jpegTimeoutCount ?? 0;
      const fetchFail = s.value.jpegFetchFailedCount ?? 0;
      // Headline of the imaging detail line: row count + frame count
      // when distinct. Also count narrative-only rows (the "X" in
      // "影像檢查：Y 筆" that have no image — typically ori_TYPE=A/B
      // upload channels that carry the radiology report `desc` text
      // but never have JPGs) so the user can see what bridge skipped
      // from trigger flow.
      const totalItems = (items?.length ?? 0) || 0;
      const narrativeOnly = Math.max(0, totalItems - total);
      let imagingLine =
        frames > ready
          ? `　含 ${ready}/${total} 筆影像 (${frames} frames)`
          : `　含 ${ready}/${total} 張影像`;
      if (narrativeOnly > 0) {
        imagingLine += `，另 ${narrativeOnly} 筆僅敘述`;
      }
      // Secondary breakdown: cache vs fresh trigger vs waiting vs
      // failures. "等 NHI 端準備" is the user-facing label for
      // triggered-waiting — rows whose trigger went through but NHI
      // prep didn't finish in time; persisted to chrome.storage for
      // next sync's sweep to pick them up.
      const parts: string[] = [];
      // ALL primary metrics — ALWAYS shown so the user can verify
      // every imaging candidate is accounted for, even with zeros.
      // The seven states cover bridge's full possibility tree:
      //   - 已快取: NHI already had the bytes; bridge fetched.
      //   - 本次新抓 (fresh = triggered-ready): bridge triggered AND
      //     NHI returned bytes within the 90s poll window (rare —
      //     NHI's lazy prep usually takes 1-30 min so this stays
      //     near 0 even on busy syncs).
      //   - 等候健保備齊 (waitingNew): bridge triggered this sync,
      //     NHI is still preparing — bytes will come next sync.
      //   - 前次等候 (waitingCarried): leftover pending entries from
      //     past syncs, NHI still preparing.
      //   - 觸發失敗 (trigFail): bridge tried but Vue click flow
      //     couldn't complete (detail-mount-timeout, button not
      //     shown, wall-clock 90s exceeded, etc.). User can see
      //     specific reasons in the (failures: …) suffix below.
      //   - 健康存摺拒收 (silentFail): Vue click finished but NHI's
      //     backend silently rejected — post-verify S02 detail
      //     showed jpg_STATUS still "A". Means bridge needs a
      //     different trigger path (e.g. direct API).
      //   - 抓取失敗 (fetchFail): seq was populated but S03 endpoint
      //     returned no base64 (rare NHI server-side glitch).
      parts.push(`${cache} 已快取`);
      parts.push(`${fresh} 本次新抓`);
      parts.push(`${waitingNew} 等候健保備齊`);
      parts.push(`${waitingCarried} 前次等候`);
      parts.push(`${trigFail} 觸發失敗`);
      parts.push(`${silentFail} 健康存摺拒收`);
      parts.push(`${fetchFail} 抓取失敗`);
      // dev-cap-skip + sync-time timeout: only when > 0 (rare,
      // not part of the standard mental model).
      if (capSkipped > 0) parts.push(`${capSkipped} dev-cap-skip`);
      if (timeout > 0) parts.push(`${timeout} timeout`);
      imagingLine += ` · ${parts.join(" / ")}`;
      // Surface the top trigger-failure reasons so the user can
      // diagnose without opening DevTools. Only when there were real
      // failures (dev-cap-skipped intentionally not surfaced here).
      const reasons = s.value.jpegTriggerFailReasons as Array<[string, number]> | undefined;
      if (Array.isArray(reasons) && reasons.length > 0) {
        const reasonStr = reasons.map(([r, n]) => (n > 1 ? `${r}×${n}` : r)).join(", ");
        imagingLine += ` (trigger failures: ${reasonStr})`;
      }
      // Same treatment for fetch-failures (Step A — S03 fetch).
      const fetchReasons = s.value.jpegFetchFailReasons as Array<[string, number]> | undefined;
      if (Array.isArray(fetchReasons) && fetchReasons.length > 0) {
        const reasonStr = fetchReasons.map(([r, n]) => (n > 1 ? `${r}×${n}` : r)).join(", ");
        imagingLine += ` (fetch failures: ${reasonStr})`;
      }
      breakdown.push(imagingLine);
    } else if (ep.name === "imaging" && items.length > 0) {
      // No JPG-stats line was produced (jpegTotal unset) yet there ARE
      // imaging rows. Explain why, so a bare "影像檢查：N 筆" never
      // misleads the user into thinking the bundle holds the pictures.
      // Two distinct reasons → two distinct notices. Plain rows (no
      // full-width colon) so popup/status.ts block-wraps them cleanly.
      if (!fetchImagingEnabled) {
        // Opted out: images were never fetched this sync.
        breakdown.push(
          "　此次只取得文字報告，未下載影像圖片。如需 X 光／電腦斷層等圖片，請勾選「一併下載影像圖片」後重新取得。",
        );
      } else {
        // Opted IN, but EVERY imaging row was image-less at NHI side
        // (jpG_STATUS "2" 無影像檔 / no fetchable candidate) → the gate
        // at "imagingJpegCandidates.length > 0" never fired, so jpegTotal
        // stayed unset and the detailed stats line above was skipped.
        // Tell the user these rows are text-only rather than leaving the
        // bare count to imply a missing-image bug.
        breakdown.push(`　這 ${items.length} 筆影像檢查沒有可下載的圖片，只取得文字報告。`);
      }
    }
    // Save body sample for first endpoint with raw>0 but adapted=0 (adapter
    // mismatch) so we can iterate. GATED on DEBUG_STASH_BODY_SAMPLES: the
    // sample contains raw NHI PHI (lab values, drug names) — flip the flag
    // in constants.js *locally* when diagnosing adapter mismatches.
    if (DEBUG_STASH_BODY_SAMPLES && raw_count > 0 && items.length === 0) {
      try {
        await chrome.storage.local.set({
          [`__sampleBody_${ep.name}`]: s.value.bodySample || "n/a",
        });
      } catch {}
    }
    // 出院病摘 sub-line under the 住院 endpoint. Mirrors the imaging
    // JPG-stats secondary line (no full-width colon → wraps cleanly as
    // a plain row). Always shown when there were inpatient rows so the
    // user can see "0 已抓 / N 候選" when none succeeded, not silence.
    if (ep.name === "inpatient" && dischargeCandidates > 0) {
      const parts: string[] = [`${dischargeFetched}/${dischargeCandidates} 出院病摘`];
      if (dischargeFetchFailed > 0) parts.push(`${dischargeFetchFailed} 抓取失敗`);
      breakdown.push(`　${parts.join(" / ")}`);
    }
    if (items.length === 0) continue;
    byType[ep.page_type] = byType[ep.page_type] || [];
    byType[ep.page_type].push(...items);
  }

  // 出院病摘 — separate page_type fed by the inpatient detail step
  // above. Items skip the breakdown loop's settled-endpoint reading
  // because they don't belong to a NHI list endpoint of their own
  // (one per inpatient row with has_XML="Y" — the count was already
  // surfaced as a sub-line on the 住院 breakdown row).
  if (dischargeSummaryItems.length > 0) {
    // biome-ignore lint/complexity/useLiteralKeys: byType is typed as {}; bracket notation works around inference gap
    byType["document_references"] = byType["document_references"] || [];
    // biome-ignore lint/complexity/useLiteralKeys: see above
    byType["document_references"].push(...dischargeSummaryItems);
  }

  // v0.15+: collapse multi-channel NHI duplicates of the same imaging
  // study. NHI's IHKE3408S01 can ship the same CT/US under multiple
  // ori_TYPE channels — each gets its own ipL_CASE_SEQ_NO, so the
  // mapper would otherwise emit N separate DRs with identical 10-frame
  // payloads. dedupImagingItems groups by (code, date, hospital), hashes
  // by first-frame content, and merges same-content buckets into one.
  // Front+lateral X-ray (different content under same code/date/hospital)
  // is preserved — different hashes → different items.
  const drBucket = (byType as any).diagnostic_reports;
  if (Array.isArray(drBucket) && drBucket.length > 0) {
    const before = drBucket.length;
    (byType as any).diagnostic_reports = dedupImagingItems(drBucket);
    const after = (byType as any).diagnostic_reports.length;
    if (after < before) {
      console.info(
        `[imaging-dedup] ${before} → ${after} items (collapsed ${before - after} multi-channel duplicates)`,
      );
    }
  }

  // Mask gate is read fresh per sync — defaults OFF per the discussion
  // (citizen-self-download doesn't need anonymization). When ON, also
  // scrub the user's real name out of any NHI narrative field before
  // it flows into the mapper.
  const maskEnabled = await isMaskEnabled();
  if (maskEnabled && patientOverride.name) {
    const replacement = maskName(patientOverride.name);
    for (const key of Object.keys(byType)) {
      byType[key] = replaceNameDeep(byType[key], patientOverride.name, replacement);
    }
  }
  // Defense-in-depth: NHI report headers (radiology / pathology) sometimes
  // echo the patient's 身分證 in narrative text. When de-identifying, scrub
  // it out of the same byType narratives — exact-token replace with the
  // half-masked form so it stays consistent with Patient.identifier.value.
  if (maskEnabled && patientOverride.id_no) {
    const idReplacement = maskId(patientOverride.id_no, "X");
    for (const key of Object.keys(byType)) {
      byType[key] = replaceNameDeep(byType[key], patientOverride.id_no, idReplacement);
    }
  }
  // Audit P2-7 (2026-06-12): PACS-exported JPEGs can carry patient
  // demographics in EXIF/COM metadata that field masking never touches.
  // With the toggle on, strip those segments (pixels untouched) BEFORE
  // the frames reach the local mapper or the backend upload — both read
  // jpgBase64s off these items. Burned-in pixel text cannot be removed;
  // the popup's de-identify disclaimer says so.
  const drItems = (byType as Record<string, any[]>).diagnostic_reports;
  if (maskEnabled && Array.isArray(drItems)) {
    for (const item of drItems as any[]) {
      if (Array.isArray(item?.jpgBase64s)) {
        item.jpgBase64s = item.jpgBase64s.map((b64: string) => stripJpegMetadataBase64(b64));
      }
      if (typeof item?.jpgBase64 === "string") {
        item.jpgBase64 = stripJpegMetadataBase64(item.jpgBase64);
      }
    }
  }

  let total = 0;
  let _localFilename = null;
  if (mode === "local") {
    if (isCancelled()) throw new Error(CANCEL_ERROR);
    await setStatus({ progress: "🧬 轉換為健康紀錄檔…", totalResources: 0 });
    let bundle: any;
    try {
      bundle = assembleLocalBundle(byType, patientOverride, maskEnabled);
    } catch (e) {
      errors.push(`local mapping: ${e.message}`);
      bundle = null;
    }
    if (bundle) {
      total = bundle.entry.length;
      await setStatus({ progress: `💾 準備 ${total} 筆健康資料…`, totalResources: total });
      try {
        const dl = await stashFhirBundle(
          bundle,
          patientOverride.id_no,
          dateRange,
          fetchImagingEnabled,
        );
        _localFilename = dl.filename;
      } catch (e) {
        errors.push(`stash bundle: ${e.message}`);
      }
    }
  } else {
    // Build the override we send to backend so its auto-created Patient
    // matches the de-identification the user opted into. v0.18.3: extend
    // the mask to the SAME three fields as the local-bundle path
    // (buildOverridePatient) — name + 身分證 + 生日 — so a de-identified
    // backend upload never carries the real ID/DOB either. Backend's
    // buildOverridePatient derives Patient.id (hash), identifier.value AND
    // the subject-reference key all from this id_no, so masking it here
    // de-identifies the resource while keeping its references internally
    // consistent. Items themselves were already scrubbed above (byType
    // name+id pass). Default OFF — real-data uploads are unaffected.
    const uploadOverride = maskEnabled ? deidentifyOverride(patientOverride) : patientOverride;
    for (const [page_type, items] of Object.entries(byType as Record<string, any[]>)) {
      if (isCancelled()) throw new Error(CANCEL_ERROR);
      await setStatus({
        progress: `⬆️ 上傳 ${ENDPOINT_LABEL_ZH[page_type] ?? page_type}（${items.length} 筆）…`,
        totalResources: total,
      });
      try {
        const data = await postStructuredChunked(
          backend,
          page_type,
          items,
          syncApiKey,
          uploadOverride,
        );
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
        const bundle = await exportPatientBundle(
          backend,
          syncApiKey,
          patientOverride.id_no,
          maskEnabled,
        );
        // Pass the same dateRange the user picked through so the
        // downloaded filename reflects "最近 3 年" → 2023-2026 instead
        // of always synthesizing today-1y → today.
        const dl = await stashFhirBundle(
          bundle,
          patientOverride.id_no,
          dateRange,
          fetchImagingEnabled,
        );
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
      } catch (e) {
        errors.push(`export bundle: ${e.message}`);
      }
    }
  }
  _markPhase(mode === "local" ? "assemble+stash" : "backend-upload");

  // Format elapsed wall-clock time: seconds (1 dp) for short syncs,
  // "mm:ss" once we cross the minute mark so the popup status stays readable.
  const _elapsedMs = Date.now() - _t0;
  const _elapsedStr =
    _elapsedMs < 60_000
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
  // Imaging-pending hint: rows whose trigger Vue flow fired this sync
  // (or a prior one) but whose NHI lazy-prep didn't return base64 in
  // time. They're stashed in chrome.storage; next sync's sweep picks
  // them up the moment NHI's seq is allocated. Surface a one-liner so
  // users know "imaging is incomplete by design — re-sync to fill in".
  const _waitingCount =
    imgIdx >= 0 && settled[imgIdx].status === "fulfilled"
      ? (settled[imgIdx].value.jpegTriggeredWaitingCount ?? 0)
      : 0;
  // v0.15+: bridge no longer auto-patches the bundle after sync end —
  // simpler architecture, user just re-syncs when ready. NHI imaging
  // prep typically takes 5–10 min; re-sync after that picks the
  // newly-ready rows up via the normal cache-hit path AND lets sync-
  // time sweep clear the pending stash for any rows that finished.
  //
  // fetch-failed rows are a DIFFERENT actionable case (added v0.15.1
  // after user feedback): the row IS ready at NHI (status=1, seq
  // populated) but the bytes didn't make it across — typically a
  // network blip on slow links even after the batch+retry mitigation.
  // These rows don't go into the pending stash (they're not
  // triggered-waiting), so the next sync's normal cached-row fetch
  // path will retry from scratch. Telling the user that means they
  // don't have to wait the 5-10 min that the prep case requires —
  // they can re-press immediately when network improves.
  const _fetchFailCount =
    imgIdx >= 0 && settled[imgIdx].status === "fulfilled"
      ? (settled[imgIdx].value.jpegFetchFailedCount ?? 0)
      : 0;
  // Both cases asking the user to re-sync are surfaced as ONE
  // consolidated trailing parenthetical when at least one is non-zero;
  // wording adapts to which case(s) apply. Single tail avoids the
  // long-summary-line wrapping that two separate (…) suffixes would
  // produce.
  let _imagingTail = "";
  if (_waitingCount > 0 && _fetchFailCount > 0) {
    _imagingTail = `（健康存摺正在準備 ${_waitingCount} 張影像、另 ${_fetchFailCount} 張影像因網路問題未抓到，請過 5–10 分鐘後再按「取得健康存摺資料」即可補齊）`;
  } else if (_waitingCount > 0) {
    _imagingTail = `（健康存摺正在準備 ${_waitingCount} 張影像，請過 5–10 分鐘後再按「取得健康存摺資料」即可補齊）`;
  } else if (_fetchFailCount > 0) {
    _imagingTail = `（${_fetchFailCount} 張影像因網路問題未抓到，請再按一次「取得健康存摺資料」即可補抓）`;
  }
  // Keep the old _waitingTail name for backward compatibility with
  // the assignment at _summaryLine — _imagingTail subsumes it.
  const _waitingTail = _imagingTail;

  let _summaryLine: string;
  if (errors.length) {
    _summaryLine = `⚠️ 取得完成 · ${_successVerb} ${total} 筆健康紀錄，${errors.length} 項失敗（${_elapsedStr}）${_localTail}${_waitingTail}`;
  } else if (total === 0) {
    _summaryLine = `⚠️ 取得完成但沒抓到任何資料（${_elapsedStr}）— 健康存摺 session 可能過期，請回該分頁重新登入；或拉長「日期範圍」再試。`;
  } else {
    _summaryLine = `✅ 取得完成 · ${_successVerb} ${total} 筆健康紀錄（${_elapsedStr}）${_localTail}${_waitingTail}`;
  }

  await setStatus({
    running: false,
    progress: _summaryLine,
    phase: "done",
    totalResources: total,
    completed: Date.now(),
    elapsedMs: _elapsedMs,
    // Per-endpoint breakdown for the popup's '查看明細' collapsible.
    breakdown: _fullBreakdown,
    errors: _humanizeErrors(errors),
    histno: patientOverride.id_no,
    mode,
    localFilename: _localFilename,
  });

  // Paint a red dot on the toolbar icon so a user who closed the popup
  // still sees fresh records are waiting. Cleared when they next open the
  // popup (markSyncSeen). A 0-resource finish shows no dot.
  await showResultBadge(total);

  // v0.16.0: when imaging rows ended this sync in triggered-waiting
  // (NHI accepted trigger, prep still in flight), kick off a 1-min
  // background counter that polls the IHKE3408S01 list and updates
  // chrome.storage so the popup banner shows live progress. Stops on
  // count=0 / 30-min cap / session expired / new sync / user dismiss.
  // Counts only — NEVER fetches bytes or modifies the stashed bundle.
  if (fetchImagingEnabled && patientOverride.id_no && _waitingCount > 0 && !errors.length) {
    try {
      // Baseline = images already fetchable ("1" + real seq) in THIS sync's
      // list, captured before the triggered rows can prepare. The poll then
      // declares "ready" only when the live fetchable count rises ABOVE this
      // (a real 0→1) — not when "0"/"A" merely vanish (which also happens on
      // 0→"2" no-image or a phantom revert).
      const _imgList: any[] =
        (imgIdx >= 0 && settled[imgIdx]?.status === "fulfilled"
          ? (settled[imgIdx] as any).value?.rawList
          : null) ?? [];
      const _baselineReady = _imgList.filter((row) => {
        const st = String(row?.jpG_STATUS ?? row?.jpg_STATUS ?? "");
        const seq = String(row?.ipL_CASE_SEQ_NO ?? row?.ipl_CASE_SEQ_NO ?? "");
        return st === "1" && seq !== "" && seq !== "-";
      }).length;
      await startPrepPolling(patientOverride.id_no, _waitingCount, BASE, _baselineReady);
    } catch (e) {
      console.warn("[imaging-prep-poll] start failed:", e);
    }
  }

  // Best-effort: write a Sync History row to the backend so the dashboard
  // can show when/who/how-long/what/range. Skipped in local mode (there
  // is no backend). Wrapped + swallowed so a logging failure never
  // propagates back to the user-facing sync status.
  if (mode !== "local")
    try {
      await postSyncLog(backend, syncApiKey, {
        status: errors.length ? "partial" : "success",
        // /sync/log lands in the dashboard's sync-history row. When the user
        // opted into de-identification, mask BOTH the id and the name here
        // too (v0.18.3) so the real 身分證 never reaches the backend on the
        // de-id path. Default OFF → dashboard sees the raw values they typed
        // (consistent with "民眾自用").
        // Audit P2-2 (2026-06-12): the history log NEVER needs the full
        // national ID — the dashboard only displays it. Always send the
        // half-masked form (human-recognizable, shoulder-surfing-safe)
        // regardless of the de-identify toggle.
        patient_id: maskId(patientOverride.id_no || "", "X"),
        patient_name: maskEnabled
          ? maskName(patientOverride.name || "")
          : patientOverride.name || "",
        total,
        breakdown,
        date_range: dateRangeLabel || "",
        elapsed_ms: _elapsedMs,
        started_at: new Date(_t0).toISOString(),
        errors: _humanizeErrors(errors),
      });
    } catch (e) {
      console.warn("[NHI sync] failed to write history log:", e);
    }
  setActiveSyncCtx(null);
}
