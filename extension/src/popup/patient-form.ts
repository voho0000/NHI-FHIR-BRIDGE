// ── Patient override (manual NHI identity) ────────────────────────────────
// NHI 健康存摺 doesn't expose the user's national ID in the URL. The user
// fills these once and they're sent with every upload call until cleared.

import { maskName } from "@nhi-fhir-bridge/mapper";
import { refreshPendingBundle } from "./bundle.js";
import { PENDING_BUNDLE_KEY } from "./constants.js";
import { _renderDataState, checkBackendPatient } from "./data-state.js";
import { els } from "./els.js";
import { state } from "./state.js";
import { setStatus } from "./status.js";
import {
  _ageFromBirthDate,
  _displayId,
  _generateAutoPatientId,
  _genderZh,
  currentMode,
} from "./utils.js";
import { _markStep2Confirmed, _maybeAutoAdvance, _refreshButtonStates } from "./wizard.js";

// id_no is no longer a UI field, so getPatientOverride() (sync, called
// in many hot paths) can't read it from the form. Cache it here from
// storage; loadPatientOverride / savePatientOverride / clear keep it
// fresh, and applySyncStatus pokes it when background swaps the
// placeholder for the real cid.
let _storedIdNo = null;

// Mask-patient-name toggle — defaults OFF (citizens downloading their
// own data don't need anonymization). When ON: popup summary, FHIR
// Bundle output, sync-log, and NHI report narrative all use the
// masked form (郭一新 → 郭O新) instead of the real name.
let _maskNameEnabled = false;

export async function loadPatientOverride() {
  const { patientOverride } = await chrome.storage.local.get("patientOverride");
  _storedIdNo = patientOverride?.id_no || null;
  if (patientOverride) {
    els.ovName.value = patientOverride.name || "";
    els.ovBirthDate.value = patientOverride.birth_date || "";
    els.ovGender.value = patientOverride.gender || "";
  }
  // A stored override with both required fields counts as "step 2
  // already confirmed" — returning user shouldn't be forced to click
  // ✓ 確定 again to advance the wizard.
  _markStep2Confirmed(!!(patientOverride?.gender && patientOverride?.birth_date));
  // Patient panel is now always-expanded (step 2 owns its own page);
  // the previous collapse-when-confirmed behaviour was a leftover from
  // the single-scroll layout.
  refreshOverrideSummary();
}

export function getPatientOverride() {
  // Returns {id_no, name?, birth_date?, gender?}.
  // id_no comes from the storage cache (_storedIdNo) since it's no
  // longer a UI field — it's auto-minted at save time and replaced
  // with the real cid by background's NHI fetch on first sync.
  // Returns null when nothing identifying is filled.
  const name = els.ovName.value.trim();
  const birth_date = els.ovBirthDate.value.trim();
  const gender = els.ovGender.value;
  if (!_storedIdNo && !name && !birth_date && !gender) return null;
  // Phase-1 migration: incrementally-built override record.
  const out: any = {};
  if (_storedIdNo) out.id_no = _storedIdNo;
  if (name) out.name = name;
  if (birth_date) out.birth_date = birth_date;
  if (gender) out.gender = gender;
  return out;
}

/**
 * Validate the patient card's birth-date input. Returns null when OK,
 * otherwise a user-facing error string. Reads directly from the
 * <input type="date"> so we can detect partial-input states that
 * Chrome reports through `validity.badInput` (the input's `.value`
 * is "" in that case, indistinguishable from "blank" by string check
 * alone — that's why the old version of this function let partial
 * year-only entries slip through).
 *
 * Allowed states:
 *   - genuinely empty (the field is optional)
 *   - full ISO YYYY-MM-DD that round-trips through Date()
 * Rejected:
 *   - year-only / year+month: the input renders blank value but
 *     validity.badInput is true
 *   - dates in the future
 *   - implausibly old dates (year < 1900)
 */
export function validateBirthDate() {
  const el = els.ovBirthDate;
  if (!el) return null;
  // Chrome's native date input: partial entry (just year, just yyyy-mm)
  // surfaces here even though .value is "".
  if (el.validity?.badInput) {
    return "生日請填完整年月日";
  }
  const s = (el.value || "").trim();
  // Birth date is now required — age affects every reference range
  // and any downstream age-based UI; empty input lets a typo / browser
  // quirk silently propagate as NaN.
  if (!s) return "請填生日";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return "生日請填完整年月日";
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(`${s}T00:00:00Z`);
  if (
    Number.isNaN(dt.getTime()) ||
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() + 1 !== m ||
    dt.getUTCDate() !== d
  ) {
    return "生日不是有效日期";
  }
  const now = new Date();
  if (dt.getTime() > now.getTime()) return "生日不能是未來";
  if (y < 1900) return "生日年份太早，請確認";
  return null;
}

export function refreshOverrideSummary() {
  const ov = getPatientOverride();
  const card = els.patientOverrideDetails;
  let summaryText = "";
  if (!ov || !ov.name) {
    els.ovSummary.textContent = "未設定";
    if (card) card.dataset.state = "empty";
  } else {
    // Build the summary as 「name · age · gender · masked-cid」 — each
    // optional segment skips itself when the underlying field is
    // unset / invalid, so the line stays clean while users are still
    // filling in step 2. Live-refreshed on every input event via
    // popup.ts's [ovName, ovBirthDate, ovGender]-input listener.
    //
    //   _maybeMask: respects the mask-name toggle (demo: 陳O明)
    //   _ageFromBirthDate: anniversary years, null on parse failure
    //   _genderZh: maps FHIR code → 男/女/其他
    //   _displayId: half-masks the real cid, hides auto-placeholders
    const parts = [_maybeMask(ov.name)];
    if (ov.birth_date) {
      const age = _ageFromBirthDate(ov.birth_date);
      if (age != null) parts.push(`${age}歲`);
    }
    if (ov.gender) {
      const g = _genderZh(ov.gender);
      if (g) parts.push(g);
    }
    const idLabel = _displayId(ov.id_no);
    if (idLabel) parts.push(idLabel);
    summaryText = parts.join("  ·  ");
    els.ovSummary.textContent = `✓ ${summaryText}`;
    if (card) card.dataset.state = "filled";
  }
  // Mirror onto step 3's "取得對象" banner so the user knows who
  // they're about to fetch without scrolling back to step 2. Only
  // when step 2 has been confirmed (which now implies a saved name).
  if (els.activePatient && els.activePatientValue) {
    const showActive = state.step2Confirmed && !!summaryText;
    els.activePatient.hidden = !showActive;
    if (showActive) els.activePatientValue.textContent = summaryText;
  }
  // Both launch + sync enabled state depend on patient + mode + conn.
  _refreshButtonStates();
  // Changing patient ID invalidates: (a) backend-state cache (new
  // patient might not be on backend); (b) local-bundle row in the
  // data-state card; (c) the 📥 download bundle section, which would
  // otherwise still show the previous patient's stashed file; (d)
  // the last completed sync's success message, which was tagged for
  // the previous patient.
  _renderDataState();
  refreshPendingBundle();
  _clearStaleSyncStatus(getPatientOverride());
  if (currentMode() === "backend" && state.connState === "ok") checkBackendPatient();
}

// Drop a "✅ 同步完成 …" status banner that was recorded for a
// different patient. Mid-flight syncs are left alone (status.running)
// so the user can still see progress of the in-flight sync.
function _clearStaleSyncStatus(ov) {
  if (!state.latestStatus) return;
  if (state.latestStatus.running) return;
  if (!state.latestStatus.histno) return;
  if (ov?.id_no === state.latestStatus.histno) return;
  state.latestStatus = null;
  setStatus("", null);
  chrome.storage.local.remove("syncStatus").catch(() => {});
}

export async function savePatientOverride() {
  // Gender + birth_date + name are required. id_no is the only optional
  // field — it's auto-fetched from NHI on sync, never user-entered.
  if (!els.ovGender.value) {
    setStatus("⛔ 請選擇性別", "error");
    els.ovGender.focus();
    return;
  }
  const dobError = validateBirthDate();
  if (dobError) {
    setStatus(`⛔ ${dobError}`, "error");
    els.ovBirthDate.focus();
    return;
  }
  if (!els.ovName.value.trim()) {
    setStatus("⛔ 請填寫姓名", "error");
    els.ovName.focus();
    return;
  }
  // Build the override directly so we don't depend on
  // getPatientOverride's null-return — the required-field path above
  // has already validated what matters.
  // Phase-1 migration: id_no is added below.
  const ov: any = {
    name: els.ovName.value.trim() || null,
    birth_date: els.ovBirthDate.value.trim(),
    gender: els.ovGender.value,
  };
  // Drop the key entirely (not set undefined) so the stored override stays clean.
  // biome-ignore lint/performance/noDelete: intentional key removal, see above
  if (!ov.name) delete ov.name;
  // Read previous stored override so we can:
  //   1. Detect whether the user is editing the SAME person (re-save)
  //      or has switched to a DIFFERENT person.
  //   2. Decide whether to reuse the previously stored id_no
  //      (placeholder OR real cid) or mint a fresh one.
  const prevStored = (await chrome.storage.local.get("patientOverride")).patientOverride;

  // Identity-change detection runs on the user-editable identity fields
  // (name / gender / birth_date). id_no is auto-generated / auto-fetched
  // so it CAN'T be the signal — the user never types it. Any of these
  // changing means "switched to a different person":
  //   - name:        manually editing name (clinic doctor swaps patients
  //                  on the same NHI session)
  //   - gender:      identity-defining; also affects sex-stratified
  //                  reference ranges for labs
  //   - birth_date:  same person can't have two DOBs
  const _norm = (v) => (v == null ? "" : String(v));
  const patientChanged =
    !!prevStored &&
    (_norm(prevStored.name) !== _norm(ov.name) ||
      _norm(prevStored.gender) !== _norm(ov.gender) ||
      _norm(prevStored.birth_date) !== _norm(ov.birth_date));

  // id_no policy:
  //   • Same person (just re-saving the same identity) → reuse prev
  //     id_no so we don't keep minting new placeholders and orphaning
  //     backend resources keyed on the old one.
  //   • Different person → mint a fresh placeholder; do NOT carry over
  //     the previous patient's real cid (e.g. F22345****) onto the new
  //     identity. The "✅ 病人身份已記住：[new name] · [old masked cid]"
  //     UX bug came from carrying the cid forward indiscriminately.
  //   • background's NHI fetch swaps the placeholder for the real cid
  //     on first sync.
  if (patientChanged) {
    ov.id_no = _generateAutoPatientId();
  } else {
    ov.id_no = prevStored?.id_no || _generateAutoPatientId();
  }
  _storedIdNo = ov.id_no;

  // PHI safety: any of the identity fields changing → drop the
  // previously-captured bundle so the user can't accidentally download
  // a JSON file labelled with the NEW patient's identity but populated
  // with the OLD patient's medical records.
  await chrome.storage.local.set({ patientOverride: ov });

  if (patientChanged) {
    // 1. drop the prior local FHIR bundle (download button content)
    // 2. drop the SW's last sync status so the result zone doesn't
    //    keep showing "✅ 取得完成 · A 的 81 筆…"
    // 3. drop the in-popup latest-status snapshot
    await chrome.storage.local.remove(PENDING_BUNDLE_KEY).catch(() => {});
    await chrome.runtime.sendMessage({ type: "clearSyncStatus" }).catch(() => {});
    state.latestStatus = null;
    setStatus("", null);
    // 4. Reset in-memory caches that _renderDataState reads. Without
    //    this, when refreshOverrideSummary calls _renderDataState
    //    synchronously below, the data-state card still shows
    //    「✓ A 的 81 筆 · 最後更新…」for the brief moment until the
    //    async checkBackendPatient + chrome.storage.onChanged events
    //    fire. Flip to "checking" / empty so the UI shows the loading
    //    state immediately, then the async refreshes paint the truth.
    state.backendPatient = { state: "checking", count: 0, lastUpdated: null };
    state.localBundle = { exists: false, count: 0, generatedAt: 0, patientId: null };
  }

  _markStep2Confirmed(true);
  refreshOverrideSummary();
  _refreshButtonStates();
  // Successful save is THE intentional step-2 completion event — this
  // is where the wizard is allowed to advance forward.
  if (state.wizardInitialized) _maybeAutoAdvance();
  // Make clear this is the identity save, not a medical-record sync —
  // 「病人資料」alone reads as "patient data" (medical) for some users.
  // _displayId suppresses the auto-XXXX placeholder (no value to the
  // user) but keeps the masked real cid (P12345****) when it's
  // available — confirms we captured their actual identity.
  const idLabel = _displayId(ov.id_no);
  const tail = idLabel ? ` · ${idLabel}` : "";
  setStatus(`✅ 病人身份已記住：${_maybeMask(ov.name)}${tail}`, "success");
}

export async function clearPatientOverride() {
  await chrome.storage.local.remove("patientOverride");
  _storedIdNo = null;
  els.ovName.value = "";
  els.ovBirthDate.value = "";
  els.ovGender.value = "";
  _markStep2Confirmed(false);
  refreshOverrideSummary();
  _refreshButtonStates();
  setStatus("已清除病人資料", "info");
}

export async function loadMaskNameEnabled() {
  const { maskNameEnabled } = await chrome.storage.local.get("maskNameEnabled");
  _maskNameEnabled = maskNameEnabled === true;
  if (els.maskNameEnabled) els.maskNameEnabled.checked = _maskNameEnabled;
}

export function _maybeMask(name) {
  return _maskNameEnabled ? maskName(name) : name || "";
}

// Mask-name toggle change handler (wired in the entry). Mutates the
// module-private _maskNameEnabled so it stays a single source of truth.
export async function onMaskNameToggle() {
  _maskNameEnabled = els.maskNameEnabled.checked;
  await chrome.storage.local.set({ maskNameEnabled: _maskNameEnabled });
  // Re-render popup chrome (summary line is the only spot that reads
  // _maybeMask reactively; everywhere else samples it just-in-time).
  refreshOverrideSummary();
}
