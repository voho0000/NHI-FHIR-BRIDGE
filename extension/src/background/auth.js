// NHI session probes. Both run a tiny in-tab fetch against IHKE3410S01
// (我接種紀錄) which (a) requires an authenticated session and (b) carries
// the logged-in user's citizen ID in its `cid` field — so the same cheap
// call doubles as a login check and a patient-ID seed.

import { PENDING_BUNDLE_KEY } from "./constants.js";

// Cheap pre-flight: does this NHI tab have an authenticated session?
// Uses the same sessionStorage.token + lightweight API call pattern as
// maybeFetchPatientIdFromNhi. Doesn't return anything PII — just a
// boolean for the popup to decide whether to surface a "log in first"
// banner. Returns null when we can't tell (script-injection blocked,
// timeout, etc.) so the popup can fall back to "enabled" rather than
// scaring the user with a false negative.
export async function checkNhiLoginState(tabId) {
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
export async function maybeFetchPatientIdFromNhi(tabId, patientOverride) {
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
