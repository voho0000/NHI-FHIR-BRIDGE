// ── Backend ↔ local data-state ───────────────────────────────────────
//
// Independent of the connection banner (which only tells us "can we
// reach the backend"). This card answers two questions:
//
//   1. Does the backend already have this patient's data?
//      → drives whether 🚀 Launch is allowed at all (Launch on an
//        empty backend gives a confusing SMART-app blank).
//   2. Does the user have a local Bundle that's newer than the
//      backend's view?
//      → offer "📤 上傳本地 Bundle 到後端" to push it via /fhir/import
//        without re-fetching NHI (fast, non-destructive: stable IDs
//        upsert so backend resources just bump versionId).
//
// We don't second-guess the user: even when local is clearly newer,
// Launch stays enabled if the backend has the patient — they may
// genuinely want to look at the older state. The UI lays out both
// sides; user decides.

import { derivePatientId } from "@nhi-fhir-bridge/mapper";
import { PENDING_BUNDLE_KEY } from "./constants.js";
import { els } from "./els.js";
import { state } from "./state.js";
import { _fmtRelative, _fmtTimeShort, currentMode } from "./utils.js";
import { getPatientOverride } from "./patient-form.js";
import { _refreshButtonStates } from "./wizard.js";
import { setStatus } from "./status.js";

export function _renderDataState() {
  // Section only visible in backend mode (handled by .backend-only CSS),
  // but we also explicitly hide when the popup has no patient_override
  // set, since both checks key off patient_id.
  const ov = getPatientOverride();
  if (currentMode() !== "backend" || !ov?.id_no) {
    els.dataStateSection.hidden = true;
    if (els.syncStatusHint) els.syncStatusHint.hidden = true;
    return;
  }

  // Card serves as an alert, not a dashboard — show only when there's
  // something actionable / worth flagging. Hide when:
  //   - backend has this patient AND no local bundle to compare against
  //     (Launch is enabled → that's the signal everything's fine), or
  //   - both sides agree on count (already in sync, no upload needed).
  // The remaining states (checking / fail / absent / count mismatch) all
  // either need user attention or are transient loading feedback.
  const localMatches = state.localBundle.exists && state.localBundle.patientId === ov.id_no;
  const inSync =
    state.backendPatient.state === "present" &&
    localMatches &&
    state.backendPatient.count === state.localBundle.count;
  // Quiet "✓ 已同步" hint sits under the download button when in-sync —
  // gives the user a tiny acknowledgement instead of total silence.
  if (els.syncStatusHint) els.syncStatusHint.hidden = !inSync;
  const nothingToShow =
    state.backendPatient.state === "present" && (!localMatches || inSync);
  if (nothingToShow) {
    els.dataStateSection.hidden = true;
    return;
  }
  els.dataStateSection.hidden = false;

  // Backend row
  const bs = els.backendState;
  switch (state.backendPatient.state) {
    case "checking":
      bs.className = "state-value";
      bs.textContent = "檢查中…";
      break;
    case "absent":
      bs.className = "state-value empty";
      // Card sits inside the result zone next to the 🔄 取得 CTA and
      // the 📤 上傳 button — pointing at them with text would be
      // double-talk. Just state the fact.
      bs.textContent = "⚠ 本機伺服器還沒有這位的資料";
      break;
    case "present": {
      const count = state.backendPatient.count;
      const ts = state.backendPatient.lastUpdated;
      bs.className = "state-value ok";
      bs.textContent = `✓ ${count > 0 ? `${count} 筆 · ` : ""}最後更新 ${_fmtTimeShort(ts) || "(unknown)"}`;
      break;
    }
    case "fail":
      bs.className = "state-value fail";
      bs.textContent = "✗ 確認失敗（請看上方提示）";
      break;
    default:
      bs.className = "state-value";
      bs.textContent = "—";
  }

  // Local row — show only when the pending bundle matches this patient.
  // (localMatches was computed above for the early-return check.)
  if (localMatches) {
    els.localStateRow.hidden = false;
    els.localState.className = "state-value ok";
    els.localState.textContent =
      `✓ ${state.localBundle.count} 筆 · ${_fmtRelative(state.localBundle.generatedAt)}產生`;
  } else {
    els.localStateRow.hidden = true;
  }

  // "📤 上傳本地 Bundle" button shows only when there's a local bundle
  // for this patient. We don't reach this branch when in-sync (the
  // whole section gets hidden above), so no need for a separate
  // disabled state — when the button shows, upload is always meaningful.
  els.pushLocalBtn.hidden = !localMatches;
  els.pushLocalBtn.disabled = false;
  els.pushLocalBtn.title = "";
  els.pushLocalBtn.textContent = "把這次資料傳到本機伺服器";
}

export async function _refreshLocalBundleState() {
  const { [PENDING_BUNDLE_KEY]: pending } =
    await chrome.storage.session.get(PENDING_BUNDLE_KEY);
  state.localBundle = pending
    ? {
        exists: true,
        count: Array.isArray(JSON.parse(pending.json)?.entry)
          ? JSON.parse(pending.json).entry.length
          : 0,
        generatedAt: pending.generatedAt || 0,
        patientId: pending.patientId || null,
      }
    : { exists: false, count: 0, generatedAt: 0, patientId: null };
  _renderDataState();
}

export async function checkBackendPatient() {
  const ov = getPatientOverride();
  if (currentMode() !== "backend" || !ov?.id_no || state.connState !== "ok") {
    state.backendPatient = { state: "unknown", count: 0, lastUpdated: null };
    _renderDataState();
    _refreshButtonStates();
    return;
  }
  state.backendPatient = { state: "checking", count: 0, lastUpdated: null };
  _renderDataState();

  const url = els.backendUrl.value.trim().replace(/\/$/, "");
  const key = els.syncApiKey.value.trim();
  const headers = key ? { "X-Sync-API-Key": key } : {};
  // Backend stores Patient under the hashed FHIR id, never under the raw
  // national ID — query / export by the hashed form.
  const fhirPid = derivePatientId(ov.id_no);
  try {
    const pr = await fetch(`${url}/fhir/Patient/${encodeURIComponent(fhirPid)}`, { headers });
    if (pr.status === 404) {
      state.backendPatient = { state: "absent", count: 0, lastUpdated: null };
      _renderDataState(); _refreshButtonStates();
      return;
    }
    if (!pr.ok) {
      state.backendPatient = { state: "fail", count: 0, lastUpdated: null };
      _renderDataState(); _refreshButtonStates();
      return;
    }
    const patient = await pr.json();
    const lastUpdated = patient?.meta?.lastUpdated ?? null;
    // Count via /fhir/export — slightly heavier but it's the only
    // off-the-shelf way to get total resources for a patient. Cap by
    // 5s timeout so a slow backend doesn't lock the popup forever.
    let count = 0;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 5000);
      const er = await fetch(`${url}/fhir/export?patient=${encodeURIComponent(fhirPid)}`, {
        headers, signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (er.ok) {
        const bundle = await er.json();
        if (Array.isArray(bundle.entry)) count = bundle.entry.length;
      }
    } catch { /* leave count = 0; not fatal */ }
    state.backendPatient = { state: "present", count, lastUpdated };
  } catch (_e) {
    state.backendPatient = { state: "fail", count: 0, lastUpdated: null };
  }
  _renderDataState();
  _refreshButtonStates();
}

export async function pushLocalBundleToBackend() {
  const ov = getPatientOverride();
  if (!ov?.id_no || !state.localBundle.exists || state.localBundle.patientId !== ov.id_no) return;
  const url = els.backendUrl.value.trim().replace(/\/$/, "");
  const key = els.syncApiKey.value.trim();
  const headers = {
    "Content-Type": "application/json",
    ...(key ? { "X-Sync-API-Key": key } : {}),
  };
  els.pushLocalBtn.disabled = true;
  els.pushLocalBtn.textContent = "傳送中…";
  try {
    const { [PENDING_BUNDLE_KEY]: pending } =
      await chrome.storage.session.get(PENDING_BUNDLE_KEY);
    if (!pending?.json) throw new Error("no local bundle");
    const r = await fetch(`${url}/fhir/import`, {
      method: "POST", headers, body: pending.json,
    });
    if (!r.ok) {
      const text = await r.text();
      throw new Error(`HTTP ${r.status}: ${text.slice(0, 120)}`);
    }
    const result = await r.json();
    setStatus(`✅ 已上傳 ${result.imported ?? "?"} 筆到後端`, "success");
    await checkBackendPatient();
  } catch (e) {
    setStatus(`⛔ 上傳失敗：${e.message}`, "error");
  } finally {
    // _renderDataState() (already called from checkBackendPatient on
    // success) decides the right disabled state + label based on
    // whether backend and local agree. Call it here too to cover the
    // failure path that skipped checkBackendPatient.
    _renderDataState();
  }
}
