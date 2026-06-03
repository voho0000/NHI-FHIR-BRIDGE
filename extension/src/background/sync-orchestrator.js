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

import { maskName } from "@nhi-fhir-bridge/mapper";
import {
  // adaptEncounterFromMedExpense is invoked directly from the
  // IHKE3303S02 detail fan-out (overrides the registry's classHint
  // with 急診/住院 derived from the detail body), so it needs to be
  // a named import — not only reachable via NHI_API_ENDPOINTS[i].adapt.
  // Forgetting this re-import after extracting the endpoint registry
  // in v0.6.3 shipped a ReferenceError that only fired in production
  // syncs with non-empty encounters. Tests don't exercise that path.
  adaptEncounterFromMedExpense,
  adaptInpatientEncounter,
} from "../nhi-adapters.js";
import { ENDPOINT_LABEL_ZH, NHI_API_ENDPOINTS } from "../nhi-endpoints.js";
import { CANCEL_ERROR, DEBUG_STASH_BODY_SAMPLES, NHI_HOST } from "./constants.js";
import {
  isCancelled,
  resetCancelled,
  setActiveSyncCtx,
  setStatus,
  withProgressTimer,
} from "./sync-state.js";
import { maybeFetchPatientIdFromNhi } from "./auth.js";
import { applyDateRangeToPath, isMaskEnabled, replaceNameDeep } from "./patient-override.js";
import { adaptSettledLists, fetchNhiListsInTab } from "./nhi-list-fetch.js";
import {
  fetchChronicMedicationDetails,
  fetchEncounterDetails,
  fetchImagingDetails,
  fetchInpatientDetails,
  fetchMedicationDetails,
  fetchProcedureDetails,
} from "./nhi-detail-fetchers.js";
import {
  classFromS02Detail,
  primaryIcdFromS02Detail,
  secondaryIcdsFromS02Detail,
} from "./s02-detail.js";
import { assembleLocalBundle, stashFhirBundle } from "./bundle.js";
import { exportPatientBundle, postStructured, postSyncLog } from "./backend-upload.js";
import { clearResultBadge, showResultBadge } from "./badge.js";

export async function runNhiApiSync({ tabId, mode, backend, syncApiKey, nhiBase, patientOverride, dateRange, dateRangeLabel }) {
  resetCancelled();
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
  patientOverride = await maybeFetchPatientIdFromNhi(tabId, patientOverride);

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
    running: true, progress: "🚀 開始取得健保存摺資料…", phase: "init",
    started: _t0, totalResources: 0, host: NHI_HOST, errors: [],
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
  if (imgIdx >= 0 && settled[imgIdx].status === "fulfilled") {
    const visits = settled[imgIdx].value.rawList || [];
    if (visits.length > 0) {
      try {
        const reports = await withProgressTimer(
          (sec) =>
            sec === 0
              ? `📥 取得 ${visits.length} 筆影像檢查報告…`
              : `📥 取得 ${visits.length} 筆影像檢查報告…（已 ${sec} 秒）`,
          () => fetchImagingDetails({ tabId, baseUrl: BASE, visits }),
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
        const procs = await withProgressTimer(
          (sec) =>
            sec === 0
              ? `📥 取得 ${visits.length} 筆處置/手術詳情…`
              : `📥 取得 ${visits.length} 筆處置/手術詳情…（已 ${sec} 秒）`,
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
  const chronicIdx = NHI_API_ENDPOINTS.findIndex(
    (e) => e.name === "chronic_prescriptions",
  );
  if (chronicIdx >= 0 && settled[chronicIdx].status === "fulfilled") {
    const visits = settled[chronicIdx].value.rawList || [];
    if (visits.length > 0) {
      try {
        const drugItems = await withProgressTimer(
          (sec) =>
            sec === 0
              ? `📥 取得 ${visits.length} 筆慢性處方箋…`
              : `📥 取得 ${visits.length} 筆慢性處方箋…（已 ${sec} 秒）`,
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
            sec === 0
              ? `📥 取得 ${remaining} 筆用藥明細…`
              : `📥 取得 ${remaining} 筆用藥明細…（已 ${sec} 秒）`,
          () =>
            fetchMedicationDetails({
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
    if (items.length > raw_count && raw_count > 0) {
      // 1-to-many adapter (e.g. adult_preventive: one screening row →
      // ~18 Observations). Show both numbers so the user understands
      // why one record produced many.
      breakdown.push(`${label}：${raw_count} 筆 → ${items.length} 項`);
    } else {
      breakdown.push(`${label}：${items.length} 筆`);
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
    (byType[ep.page_type] = byType[ep.page_type] || []).push(...items);
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
    let bundle;
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
    const uploadOverride = maskEnabled && patientOverride.name
      ? { ...patientOverride, name: maskName(patientOverride.name) }
      : patientOverride;
    for (const [page_type, items] of Object.entries(byType)) {
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
  if (mode !== "local") try {
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
