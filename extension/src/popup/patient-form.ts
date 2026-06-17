// ── Patient override (manual NHI identity) ────────────────────────────────
// NHI 健康存摺 doesn't expose the user's national ID in the URL. The user
// fills these once and they're sent with every upload call until cleared.

import { maskName } from "@nhi-fhir-bridge/mapper";
import { refreshPendingBundle } from "./bundle.js";
import { PENDING_BUNDLE_JSON_KEY, PENDING_BUNDLE_KEY } from "./constants.js";
import { _renderDataState, checkBackendPatient } from "./data-state.js";
import { els } from "./els.js";
import { state } from "./state.js";
import { setStatus } from "./status.js";
import {
  _ageFromBirthDate,
  _displayId,
  _genderZh,
  _generateAutoPatientId,
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
// masked form (郭一新 → 郭O新) instead of the real name. De-identify
// defaults ON (privacy-first) — see loadMaskNameEnabled.
let _maskNameEnabled = true;

// ── 生日 = 年/月/日 三個下拉 ───────────────────────────────────────────────
// Native <input type="date"> made picking a birthday painful (the calendar
// opens on the current month, so reaching a year decades back is many clicks).
// Three <select>s are far easier. Storage format is UNCHANGED: ISO "YYYY-MM-DD".
const _pad2 = (n: number) => String(n).padStart(2, "0");

function _daysInMonth(year: number, month: number): number {
  if (!month) return 31;
  if (month === 2) {
    // Allow 29 until a year is chosen so a leap-day birthday isn't blocked.
    if (!year) return 29;
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  }
  return month === 4 || month === 6 || month === 9 || month === 11 ? 30 : 31;
}

function _fillSelect(sel: any, placeholder: string, items: Array<[string, string]>) {
  if (!sel) return;
  const keep = sel.value;
  sel.innerHTML = "";
  const ph = document.createElement("option");
  ph.value = "";
  ph.textContent = placeholder;
  sel.appendChild(ph);
  for (const [value, label] of items) {
    const o = document.createElement("option");
    o.value = value;
    o.textContent = label;
    sel.appendChild(o);
  }
  // Preserve a prior selection if it's still a valid option.
  if (keep && items.some(([v]) => v === keep)) sel.value = keep;
}

// Rebuild the 日 options for the picked 年/月 so impossible days (e.g. 2/30)
// never show; preserves the chosen day when it still fits the month.
export function _rebuildBirthDays() {
  const y = Number(els.ovBirthYear?.value) || 0;
  const m = Number(els.ovBirthMonth?.value) || 0;
  const max = _daysInMonth(y, m);
  const days: Array<[string, string]> = [];
  for (let d = 1; d <= max; d++) days.push([String(d), String(d)]);
  _fillSelect(els.ovBirthDay, "日", days);
}

function _populateBirthSelects() {
  if (!els.ovBirthYear) return;
  const curY = new Date().getFullYear();
  const years: Array<[string, string]> = [];
  for (let y = curY; y >= 1900; y--) years.push([String(y), String(y)]);
  _fillSelect(els.ovBirthYear, "年", years);
  const months: Array<[string, string]> = [];
  for (let m = 1; m <= 12; m++) months.push([String(m), String(m)]);
  _fillSelect(els.ovBirthMonth, "月", months);
  _rebuildBirthDays();
}

function getBirthDateIso(): string {
  const y = els.ovBirthYear?.value;
  const m = els.ovBirthMonth?.value;
  const d = els.ovBirthDay?.value;
  if (!y || !m || !d) return "";
  return `${y}-${_pad2(Number(m))}-${_pad2(Number(d))}`;
}

function setBirthDateIso(iso: string) {
  const mm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  if (els.ovBirthYear) els.ovBirthYear.value = mm ? mm[1] : "";
  if (els.ovBirthMonth) els.ovBirthMonth.value = mm ? String(Number(mm[2])) : "";
  _rebuildBirthDays();
  if (els.ovBirthDay) els.ovBirthDay.value = mm ? String(Number(mm[3])) : "";
}

// Wired in popup.ts to 年/月 change: rebuild 日 options then refresh summary.
export function onBirthPartChange() {
  _rebuildBirthDays();
  refreshOverrideSummary();
}

export async function loadPatientOverride() {
  const { patientOverride } = await chrome.storage.local.get("patientOverride");
  _storedIdNo = patientOverride?.id_no || null;
  // Fill the 年/月/日 option lists once (idempotent guard: only the
  // placeholder present) before assigning a stored value.
  if (els.ovBirthYear && els.ovBirthYear.options.length <= 1) _populateBirthSelects();
  if (patientOverride) {
    els.ovName.value = patientOverride.name || "";
    setBirthDateIso(patientOverride.birth_date || "");
    els.ovGender.value = patientOverride.gender || "";
  }
  // A stored override with all required fields (name + gender + birth_date)
  // counts as "step 2 already confirmed" — returning user shouldn't be
  // forced to click ✓ 確定 again to advance the wizard. Name is now a
  // required field (saveOverride rejects an empty name); legacy overrides
  // saved before that rule lack a name, so they correctly stay unconfirmed
  // until the user fills it in — matching what the form actually enforces.
  _markStep2Confirmed(
    !!(patientOverride?.name && patientOverride?.gender && patientOverride?.birth_date),
  );
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
  const birth_date = getBirthDateIso();
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
 * Validate the patient card's birth-date (three 年/月/日 <select>s).
 * Returns null when OK, otherwise a user-facing error string.
 *
 * Allowed: all three picked AND the composed date round-trips through Date().
 * Rejected:
 *   - nothing picked (field is required)
 *   - only some of 年/月/日 picked (partial)
 *   - an impossible date (the 日 list is month-aware, so this is a guard)
 *   - dates in the future
 *   - implausibly old dates (year < 1900 — the 年 list starts at 1900,
 *     so this is a belt-and-suspenders guard)
 */
export function validateBirthDate() {
  const y = els.ovBirthYear?.value;
  const m = els.ovBirthMonth?.value;
  const d = els.ovBirthDay?.value;
  // Birth date is required — age affects every reference range and any
  // downstream age-based UI.
  if (!y && !m && !d) return "請填生日";
  if (!y || !m || !d) return "生日請選完整年月日";
  const iso = getBirthDateIso();
  const [yy, mm, dd] = iso.split("-").map(Number);
  const dt = new Date(`${iso}T00:00:00Z`);
  if (
    Number.isNaN(dt.getTime()) ||
    dt.getUTCFullYear() !== yy ||
    dt.getUTCMonth() + 1 !== mm ||
    dt.getUTCDate() !== dd
  ) {
    return "生日不是有效日期";
  }
  if (dt.getTime() > Date.now()) return "生日不能是未來";
  if (yy < 1900) return "生日年份太早，請確認";
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
    // filling in step 2. Live-refreshed on every input/change event via
    // popup.ts's ovName/ovGender input + 生日 年/月/日 change listeners.
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
    els.ovBirthYear?.focus();
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
    birth_date: getBirthDateIso(),
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
    // v0.16.1: drop both metadata + JSON keys (storage split).
    await chrome.storage.local
      .remove([PENDING_BUNDLE_KEY, PENDING_BUNDLE_JSON_KEY])
      .catch(() => {});
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
  setBirthDateIso("");
  els.ovGender.value = "";
  _markStep2Confirmed(false);
  refreshOverrideSummary();
  _refreshButtonStates();
  setStatus("已清除病人資料", "info");
}

// The masking detail + ⚠️ warning only matter once 去識別化 is 開啟, so they
// reveal with the toggle (hidden by default → compact card).
function syncDeidDetail(enabled: boolean) {
  if (els.maskDeidDetail) els.maskDeidDetail.hidden = !enabled;
}

export async function loadMaskNameEnabled() {
  // Default ON: an absent key (user never chose) is treated as 開啟; only an
  // explicit false (toggled off for a full personal backup) shows 關閉.
  const { maskNameEnabled } = await chrome.storage.local.get("maskNameEnabled");
  _maskNameEnabled = maskNameEnabled !== false;
  // Segmented toggle: set both radios (the 關閉 radio doesn't auto-check when
  // only the 開啟 radio is cleared).
  if (els.maskNameEnabled) els.maskNameEnabled.checked = _maskNameEnabled;
  if (els.maskNameOff) els.maskNameOff.checked = !_maskNameEnabled;
  syncDeidDetail(_maskNameEnabled);
}

export function _maybeMask(name) {
  return _maskNameEnabled ? maskName(name) : name || "";
}

// Mask-name toggle change handler (wired in the entry). Mutates the
// module-private _maskNameEnabled so it stays a single source of truth.
export async function onMaskNameToggle() {
  _maskNameEnabled = els.maskNameEnabled?.checked === true;
  await chrome.storage.local.set({ maskNameEnabled: _maskNameEnabled });
  syncDeidDetail(_maskNameEnabled);
  // Re-render popup chrome (summary line is the only spot that reads
  // _maybeMask reactively; everywhere else samples it just-in-time).
  refreshOverrideSummary();
}
