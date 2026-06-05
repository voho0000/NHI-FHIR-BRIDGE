// ── 3-step wizard ────────────────────────────────────────────────────
//
// Conceptually:
//   Step 1 — 登入：on NHI tab + session token is valid
//   Step 2 — 設定：gender filled + (mode==local OR backend reachable)
//                + birth_date if entered must be valid
//   Step 3 — 取得：the action itself (sync CTA, status, results)
//
// Steps auto-advance when their precondition flips green; users can
// click the stepper to revisit any step. We never auto-step BACK on
// state change — once the user has moved forward, only an explicit
// stepper click brings them back. Otherwise opening the popup mid-
// sync would jerk them back to step 1.

import { els } from "./els.js";
import { getPatientOverride, validateBirthDate } from "./patient-form.js";
import { state } from "./state.js";
import { _stepNumGlyph, currentMode } from "./utils.js";

// Step 2 is "done" only after the user has clicked ✓ 確定 with valid
// inputs. We track this with a boolean rather than reading live DOM
// state — otherwise the wizard would auto-advance the moment the
// fields happened to look right, before the user had a chance to
// review. Flipped true in savePatientOverride success, false in
// clearPatientOverride and on a load that yields no saved record.
export function _markStep2Confirmed(yes) {
  state.step2Confirmed = !!yes;
}

export function _isStepDone(step) {
  const onNhi = !els.syncApiBtn.dataset.offNhi;
  const loggedIn = els.syncApiBtn.dataset.nhiLoggedIn !== "no";
  switch (step) {
    case 1:
      return onNhi && loggedIn;
    case 2:
      // Confirmed = user clicked ✓ 確定 AND the override is currently
      // valid (so revisits with a now-invalid override don't show a
      // false green check).
      return state.step2Confirmed;
    case 3:
      // Done = a pending FHIR bundle exists (sync succeeded). The
      // download UI inside step 3 stays visible — this flag exists
      // purely so the stepper shows ✓ on step 3 once data is ready,
      // letting the user jump forward to step 4 (open SMART App).
      // els.pendingBundle.hidden is the source of truth — refreshed
      // by refreshPendingBundle() whenever the session-stash changes.
      return !!els.pendingBundle && !els.pendingBundle.hidden;
    case 4:
      // Terminal step. The "doneness" is the user opening the SMART
      // App, which we can't observe; leaving as false keeps the
      // stepper from showing a misleading ✓ before they've actually
      // viewed anything.
      return false;
    default:
      return false;
  }
}

// v0.16.1: localStorage key for the wizard's last-active step. Used
// to restore the user's view synchronously on popup open BEFORE any
// chrome.storage async I/O — without this restore, popup defaulted
// to step 1's CSS until _initWizard ran, briefly flashing the wrong
// content. localStorage is synchronous so the read happens before
// the first paint.
const ACTIVE_STEP_LS_KEY = "nhi-bridge:activeStep";

export function _restoreActiveStepFromCache(): void {
  try {
    const raw = localStorage.getItem(ACTIVE_STEP_LS_KEY);
    if (!raw) return;
    const n = Number(raw);
    if (Number.isFinite(n) && n >= 1 && n <= 4) {
      state.activeStep = n;
      document.body.dataset.activeStep = String(n);
    }
  } catch {
    // localStorage access can throw in some privacy modes — non-fatal.
  }
}

export function _setActiveStep(n, opts: any = {}) {
  const clamped = Math.max(1, Math.min(4, n));
  state.activeStep = clamped;
  document.body.dataset.activeStep = String(clamped);
  // Persist so the NEXT popup open can restore synchronously.
  try {
    localStorage.setItem(ACTIVE_STEP_LS_KEY, String(clamped));
  } catch {}
  _refreshWizardUi();
  if (!opts.silent) {
    // Auto-scroll the popup to the top of the step so users always
    // see the step header / first input after navigation.
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export function _refreshWizardUi() {
  if (!els.wizardStepper) return;
  const lis = els.wizardStepper.querySelectorAll("li[data-step]");
  for (const li of lis) {
    const n = Number(li.dataset.step);
    const isActive = n === state.activeStep;
    const isDone = _isStepDone(n);
    if (isActive) li.setAttribute("aria-current", "true");
    else li.removeAttribute("aria-current");
    if (isDone) li.dataset.done = "true";
    else delete li.dataset.done;
  }
  // Step 1's three sub-cards (off-nhi / needs-login / login-ok) are
  // mutually exclusive — pick the one that matches current state.
  const onNhi = !els.syncApiBtn.dataset.offNhi;
  const loggedIn = els.syncApiBtn.dataset.nhiLoggedIn !== "no";
  if (els.openNhiSection) els.openNhiSection.hidden = onNhi;
  if (els.nhiNeedsLoginSection) els.nhiNeedsLoginSection.hidden = !onNhi || loggedIn;
  if (els.loginOkSection) els.loginOkSection.hidden = !(onNhi && loggedIn);

  _refreshResultZone();
}

// Show/hide step-3 result cards based on whether each has content.
// Empty cards (e.g. a summary card with no status + no data-state in
// local mode pre-sync) used to render as a blank stripe — now they
// stay collapsed individually, and the whole zone goes away when all
// three cards would be empty.
export function _refreshResultZone() {
  if (!els.resultZone) return;
  const hasStatus = (els.status?.textContent ?? "").trim() !== "";
  const dataStateShown = els.dataStateSection && !els.dataStateSection.hidden;
  const bundleShown = els.pendingBundle && !els.pendingBundle.hidden;
  // Launch button only counts when usable — backend mode + the patient
  // actually exists on the backend (`launchBtn.disabled === false`).
  // A perma-disabled button shouldn't pin the zone open.
  const launchUsable = currentMode() === "backend" && els.launchBtn && !els.launchBtn.disabled;

  // Hide the entire result section (the divider + everything after) when
  // there's nothing meaningful to show.
  els.resultZone.hidden = !(hasStatus || bundleShown || dataStateShown || launchUsable);

  // Bundle filename / size block follows bundle visibility.
  if (els.bundleMetaBlock) {
    els.bundleMetaBlock.hidden = !bundleShown;
  }
  // Launch button hide-when-not-usable so the .next-actions row
  // doesn't show a perma-disabled outline button next to nothing.
  if (els.launchBtn) {
    els.launchBtn.hidden = currentMode() !== "backend" || !launchUsable;
  }

  // Demote the 取得 CTA once we have a result + a usable next-step
  // action. The "primary action" baton passes to 下載 / 開啟 App so
  // the user's eye lands on what's next, not on "redo the thing".
  const hasResultArtifact = bundleShown || launchUsable;
  if (els.syncApiBtn) {
    const shouldDemote = hasResultArtifact && !els.syncApiBtn.disabled;
    els.syncApiBtn.classList.toggle("is-secondary", shouldDemote);
    // Relabel to match the new role. While the sync is running we keep
    // the prompt mid-render text alone (applySyncStatus owns that).
    if (!state.latestStatus?.running) {
      els.syncApiBtn.textContent = shouldDemote ? "重新取得" : "取得健保存摺資料";
    }
  }
}

export function _maybeAutoAdvance() {
  // Only advance forward, never back. Save user's place if they've
  // clicked into a later step manually.
  //
  // Deliberately do NOT auto-advance 3 → 4. Step 3 contains the
  // "✅ 已產生 N 筆 · 📥 下載" success state — jumping the user past
  // that the moment sync completes would steal the moment they're
  // waiting 30 seconds for. They click step 4 (or the stepper item)
  // themselves when they're ready to open the SMART App.
  if (state.activeStep === 1 && _isStepDone(1)) _setActiveStep(2);
  else if (state.activeStep === 2 && _isStepDone(2)) _setActiveStep(3);
}

export function _initWizard() {
  if (state.wizardInitialized) return;
  state.wizardInitialized = true;
  // Initial step: whichever is the FIRST not-yet-done step at popup open.
  // First-time user → step 1. Returning user with valid session + saved
  // patient → step 3. If a fresh bundle is sitting in session-storage
  // (sync done in a prior popup open of the same browser session) →
  // step 4, so the natural next action — "open SMART App" — is visible.
  let start: number;
  if (!_isStepDone(1)) start = 1;
  else if (!_isStepDone(2)) start = 2;
  else if (!_isStepDone(3)) start = 3;
  else start = 4;
  _setActiveStep(start, { silent: true });

  // Stepper clicks → jump
  for (const li of els.wizardStepper.querySelectorAll("li[data-step]")) {
    li.addEventListener("click", () => _setActiveStep(Number(li.dataset.step)));
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        _setActiveStep(Number(li.dataset.step));
      }
    });
  }
}

export function _refreshButtonStates() {
  // Sync button. Conditions, in priority order:
  //   1. on an NHI tab
  //   2. logged in to NHI (detected via background pre-flight)
  //   3. backend mode → backend connected
  //   4. gender filled (other patient fields all optional)
  // Whatever blocks the CTA also gets surfaced as an inline message
  // below the button — tooltips are invisible in the 360px popup.
  const onNhi = !els.syncApiBtn.dataset.offNhi;
  const loggedIn = els.syncApiBtn.dataset.nhiLoggedIn !== "no";
  const modeOk = currentMode() === "local" || state.connState === "ok";
  // Step 2 hard requirements: gender, birth_date (valid), and name.
  // Tracked as one rolled-up flag so the blocked-CTA strip says
  // "complete the basic info" generically regardless of which field
  // is missing first.
  const step2BasicOk = !!els.ovGender?.value && !!els.ovName?.value?.trim();
  const dobError = validateBirthDate();

  // Each blocking reason names the step that needs attention. Mode +
  // connection now live in step 3 alongside the CTA itself, so those
  // reasons reference what's directly above the button rather than
  // sending the user back through the stepper.
  //
  // EXCEPT the conn-failed case: the conn banner directly above the
  // CTA already shouts "✗ 連不上後端" + retry button + help. Adding
  // another inline strip just to repeat the same fact (with a slightly
  // longer sentence) is noise — silently disable the CTA instead, with
  // a tooltip explanation. inlineReason is what shows in the warning
  // strip; tooltipReason is what the disabled button advertises on hover.
  // Reason for blocked CTA. inlineMsg renders in the warning strip;
  // tooltip is what the disabled button advertises on hover; jumpTo
  // (when set) makes the strip a clickable shortcut back to that step.
  let inlineMsg = "";
  let jumpTo = null; // { step: 1|2, label: "登入" | "您的資料" }
  let tooltipReason = "";
  if (!onNhi) {
    inlineMsg = "請切到健保存摺分頁";
    jumpTo = { step: 1, label: "登入" };
  } else if (!loggedIn) {
    inlineMsg = "健保存摺分頁尚未登入";
    jumpTo = { step: 1, label: "登入" };
  } else if (!step2BasicOk) {
    // Don't enumerate which field is missing — there could be more
    // than one (gender, name, both), and step 2 already marks each
    // required field with a red * the user will see after the one-
    // click jump. Keep the message about the high-level action
    // (complete + confirm).
    inlineMsg = "請完成基本資料並按確定";
    jumpTo = { step: 2, label: "您的資料" };
  } else if (dobError) {
    inlineMsg = dobError;
    jumpTo = { step: 2, label: "您的資料" };
  } else if (!modeOk) {
    inlineMsg = ""; // conn banner above carries the message
    tooltipReason = "後端尚未連線";
  }
  if (jumpTo) tooltipReason = `回 ${_stepNumGlyph(jumpTo.step)} ${jumpTo.label}：${inlineMsg}`;

  // Don't flip the CTA back to enabled if a sync is currently running
  // — the SW updates `patientOverride` mid-sync (auto-fetched cid),
  // which triggers storage.onChanged → loadPatientOverride →
  // _refreshButtonStates. Without this guard the button would re-enable
  // halfway through a sync and the user could click it again.
  const syncRunning = state.latestStatus?.running === true;
  els.syncApiBtn.disabled = syncRunning || tooltipReason !== "";
  els.syncApiBtn.title = syncRunning ? "" : tooltipReason;
  if (els.syncBlockedReason) {
    const show = !syncRunning && inlineMsg !== "";
    els.syncBlockedReason.hidden = !show;
    if (show) {
      // Build the strip's content: "→ {msg}    回 ① 登入 →" so the
      // user sees both the reason and where the click will take them.
      // "→" arrow signals "do this next" (information/guidance);
      // the original ⚠️ was alarm-grade and clashed with the genuine
      // disclaimer card below. Blue palette in CSS reinforces the
      // info-not-warning framing.
      els.syncBlockedReason.textContent = "";
      const msgEl = document.createElement("span");
      msgEl.className = "cta-reason-msg";
      msgEl.textContent = `→ ${inlineMsg}`;
      els.syncBlockedReason.appendChild(msgEl);
      if (jumpTo) {
        const jumpEl = document.createElement("span");
        jumpEl.className = "cta-reason-jump";
        jumpEl.textContent = `回 ${_stepNumGlyph(jumpTo.step)} ${jumpTo.label} →`;
        els.syncBlockedReason.appendChild(jumpEl);
        els.syncBlockedReason.dataset.targetStep = String(jumpTo.step);
      } else {
        delete els.syncBlockedReason.dataset.targetStep;
      }
    }
  }
  // Mirror the stop-button visibility so the user can always cancel
  // mid-sync even if the popup re-renders due to onChanged.
  if (els.stopBtn) els.stopBtn.hidden = !syncRunning;

  // Launch button: backend mode + conn ok + patient set + backend
  // actually has this patient (otherwise the SMART app launches into
  // an empty FHIR store — confusing blank screen).
  const ov = getPatientOverride();
  const haveBackendPatient = state.backendPatient.state === "present";
  els.launchBtn.disabled = !(
    currentMode() === "backend" &&
    state.connState === "ok" &&
    !!ov?.id_no &&
    haveBackendPatient
  );
  els.launchBtn.title =
    currentMode() !== "backend"
      ? "請切到「🏥 本機伺服器 (進階)」模式"
      : state.connState !== "ok"
        ? "後端尚未連線"
        : !ov?.id_no
          ? "請回到「② 您的資料」填寫資料"
          : !haveBackendPatient
            ? "本機伺服器還沒有這位的資料 — 先按「取得健保存摺資料」或下方「把這次資料傳到本機伺服器」"
            : "";

  // Refresh the stepper UI on every state change, but DON'T auto-
  // advance from here — incidental input changes (typing in a field
  // while revisiting step 2) shouldn't yank the user forward. Auto-
  // advance is only fired from the events that signal intent:
  //   - login probe flipping to true → forward into step 2
  //   - savePatientOverride success → forward into step 3
  if (state.wizardInitialized) _refreshWizardUi();
}
