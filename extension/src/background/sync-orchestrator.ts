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

import { dedupImagingItems, maskName } from "@nhi-fhir-bridge/mapper";
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
} from "../nhi-adapters.js";
import { ENDPOINT_LABEL_ZH, NHI_API_ENDPOINTS } from "../nhi-endpoints.js";
import { maybeFetchPatientIdFromNhi } from "./auth.js";
import { exportPatientBundle, postStructured, postSyncLog } from "./backend-upload.js";
import { clearResultBadge, showResultBadge } from "./badge.js";
import { assembleLocalBundle, stashFhirBundle } from "./bundle.js";
import { CANCEL_ERROR, DEBUG_STASH_BODY_SAMPLES, NHI_HOST } from "./constants.js";
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
function waitForTabComplete(
  tabId: number,
  timeoutMs: number,
): Promise<void> {
  return new Promise<void>((resolve) => {
    const done = () => {
      chrome.tabs.onUpdated.removeListener(listener);
      clearTimeout(timer);
      resolve();
    };
    const listener = (
      updatedTabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
    ) => {
      if (updatedTabId === tabId && changeInfo.status === "complete") {
        done();
      }
    };
    chrome.tabs.onUpdated.addListener(listener);
    const timer = setTimeout(done, timeoutMs);
  });
}
import { adaptSettledLists, fetchNhiListsInTab } from "./nhi-list-fetch.js";
import { applyDateRangeToPath, isMaskEnabled, replaceNameDeep } from "./patient-override.js";
import {
  classFromS02Detail,
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
    progress: "🚀 開始取得健保存摺資料…",
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
        for (let i = 0; i < visits.length; i++) {
          const detail = detailMap?.get(i) || null;
          const primaryDiagnosis = primaryIcdFromS02Detail(detail);
          const secondaryDiagnoses = secondaryIcdsFromS02Detail(detail);
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

  // Step 1c: imaging needs IHKE3408S02 for the actual report narrative.
  // List endpoint only has order metadata; ctype param mirrors the
  // visit's ori_TYPE (A / E / …).
  const imgIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "imaging");
  let imagingJpegCandidates = [];
  if (imgIdx >= 0 && settled[imgIdx].status === "fulfilled") {
    const visits = settled[imgIdx].value.rawList || [];
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
    const _toTrigger = polledCandidates.filter(
      (c: any) => c.needsTrigger,
    ).length;
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
        return await pollFetchImagingJpegs(
          tabId,
          BASE,
          polledCandidates,
          triggerOutcomes,
        );
      } catch (e: any) {
        errors.push(`imaging: ${e.message}`);
        return [] as any[];
      }
    })();
  }
  if (
    fetchImagingEnabled &&
    pendingImagingRows.length > 0 &&
    patientOverride.id_no
  ) {
    imagingSweepPromise = sweepPendingImagingWithTimeout(
      BASE,
      patientOverride.id_no,
      60_000,
    ).catch((e) => {
      errors.push(`前次影像補抓: ${e.message}`);
      return [] as any[];
    });
  }
  _markPhase("imaging-kickoff");
  const _imgPending = imagingPromise !== null || imagingSweepPromise !== null;
  const _withImgTag = (msg: string) =>
    _imgPending ? `${msg} · 🖼️ 影像準備中` : msg;

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
      const needsTrigger = polledCandidates.filter(
        (c: any) => c.needsTrigger,
      ).length;
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
          const pendingPart =
            alreadyPending > 0 ? `；前次 ${alreadyPending} 張補抓中` : "";
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
        if (
          !existing ||
          (Array.isArray(r.jpgBase64s) && r.jpgBase64s.length > 0)
        ) {
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
          (n: number, r: any) =>
            n + (Array.isArray(r.jpgBase64s) ? r.jpgBase64s.length : 0),
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
        const trigFailed = allResults.filter(
          (r: any) => r.outcome === "trigger-failed",
        );
        const realFailures = trigFailed.filter(
          (r: any) => r.error !== "dev-cap-skipped",
        );
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
        settled[imgIdx].value.jpegTriggerFailReasons = Array.from(
          reasonCounts.entries(),
        )
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
        const pendingKeysSnap = new Set(
          pendingImagingRows.map((p) => `${p.rid}|${p.ctype}`),
        );
        const waitingResults = allResults.filter(
          (r: any) => r.outcome === "triggered-waiting",
        );
        settled[imgIdx].value.jpegTriggeredWaitingCount = waitingResults.length;
        settled[imgIdx].value.jpegTriggeredWaitingNewCount =
          waitingResults.filter(
            (r: any) => !pendingKeysSnap.has(`${r.rid}|${r.ctype}`),
          ).length;
        settled[imgIdx].value.jpegTriggeredWaitingCarriedCount =
          waitingResults.filter((r: any) =>
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
          fetchFailReasonCounts.set(
            reason,
            (fetchFailReasonCounts.get(reason) ?? 0) + 1,
          );
        }
        settled[imgIdx].value.jpegFetchFailReasons = Array.from(
          fetchFailReasonCounts.entries(),
        )
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
            const pendingKeysSet = new Set(
              pendingImagingRows.map((p) => `${p.rid}|${p.ctype}`),
            );
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
      const reasons = s.value.jpegTriggerFailReasons as
        | Array<[string, number]>
        | undefined;
      if (Array.isArray(reasons) && reasons.length > 0) {
        const reasonStr = reasons
          .map(([r, n]) => (n > 1 ? `${r}×${n}` : r))
          .join(", ");
        imagingLine += ` (trigger failures: ${reasonStr})`;
      }
      // Same treatment for fetch-failures (Step A — S03 fetch).
      const fetchReasons = s.value.jpegFetchFailReasons as
        | Array<[string, number]>
        | undefined;
      if (Array.isArray(fetchReasons) && fetchReasons.length > 0) {
        const reasonStr = fetchReasons
          .map(([r, n]) => (n > 1 ? `${r}×${n}` : r))
          .join(", ");
        imagingLine += ` (fetch failures: ${reasonStr})`;
      }
      breakdown.push(imagingLine);
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
    if (items.length === 0) continue;
    byType[ep.page_type] = byType[ep.page_type] || [];
    byType[ep.page_type].push(...items);
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
        const dl = await stashFhirBundle(bundle, patientOverride.id_no, dateRange);
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
    const uploadOverride =
      maskEnabled && patientOverride.name
        ? { ...patientOverride, name: maskName(patientOverride.name) }
        : patientOverride;
    for (const [page_type, items] of Object.entries(byType as Record<string, any[]>)) {
      if (isCancelled()) throw new Error(CANCEL_ERROR);
      await setStatus({
        progress: `⬆️ 上傳 ${ENDPOINT_LABEL_ZH[page_type] ?? page_type}（${items.length} 筆）…`,
        totalResources: total,
      });
      try {
        const data = await postStructured(backend, page_type, items, syncApiKey, uploadOverride);
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
        const bundle = await exportPatientBundle(backend, syncApiKey, patientOverride.id_no);
        // Pass the same dateRange the user picked through so the
        // downloaded filename reflects "最近 3 年" → 2023-2026 instead
        // of always synthesizing today-1y → today.
        const dl = await stashFhirBundle(bundle, patientOverride.id_no, dateRange);
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
  const _waitingTail =
    _waitingCount > 0
      ? `（健康存摺正在準備 ${_waitingCount} 張影像，請過 5–10 分鐘後再按「取得健康存摺資料」即可補齊）`
      : "";

  let _summaryLine: string;
  if (errors.length) {
    _summaryLine = `⚠️ 取得完成 · ${_successVerb} ${total} 筆健康紀錄，${errors.length} 項失敗（${_elapsedStr}）${_localTail}${_waitingTail}`;
  } else if (total === 0) {
    _summaryLine = `⚠️ 取得完成但沒抓到任何資料（${_elapsedStr}）— 健保存摺 session 可能過期，請回該分頁重新登入；或拉長「日期範圍」再試。`;
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
    errors,
    histno: patientOverride.id_no,
    mode,
    localFilename: _localFilename,
  });

  // Paint a red dot on the toolbar icon so a user who closed the popup
  // still sees fresh records are waiting. Cleared when they next open the
  // popup (markSyncSeen). A 0-resource finish shows no dot.
  await showResultBadge(total);

  // Best-effort: write a Sync History row to the backend so the dashboard
  // can show when/who/how-long/what/range. Skipped in local mode (there
  // is no backend). Wrapped + swallowed so a logging failure never
  // propagates back to the user-facing sync status.
  if (mode !== "local")
    try {
      await postSyncLog(backend, syncApiKey, {
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
      });
    } catch (e) {
      console.warn("[NHI sync] failed to write history log:", e);
    }
  setActiveSyncCtx(null);
}
