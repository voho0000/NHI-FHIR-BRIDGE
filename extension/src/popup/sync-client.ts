// ── NHI sync + SMART App launch ──────────────────────────────────────
//
// apiSyncNhi kicks off the SW's runNhiApiSync (the SW hits NHI's JSON
// endpoints in parallel and either stashes a local Bundle or posts to
// /sync/upload-structured). launch wires the backend's /smart/launch-
// context into the configured SMART App URL. Both gate on the patient
// override + a fresh connectivity check.

import { effectiveFhirPatientId } from "@nhi-fhir-bridge/mapper";
import { testBackendConnection } from "./connection.js";
import { DEFAULT_SMART_APP_LAUNCH, RANGE_LABELS } from "./constants.js";
import { els } from "./els.js";
import { getPatientOverride } from "./patient-form.js";
import { setStatus } from "./status.js";
import { _isSafeSmartAppUrl, currentMode, getActiveTab } from "./utils.js";

// Pre-flight detection for NHI login state. Two signals (either triggers):
//  1. URL is in NHI auth namespace (IHKE3099Sxx) — login / IC card pages
//  2. Page contains a password input or known logged-out phrases
export async function isOnNhiLoginPage(tabId, url) {
  if (url?.pathname && /IHKE3099/.test(url.pathname)) return true;
  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        if (document.querySelector('input[type="password"]')) return true;
        const text = (document.body?.innerText || "").trim();
        const phrases = [
          "請使用健保卡",
          "請插入健保卡",
          "請插入您的健保卡",
          "登入健康存摺",
          "登入失敗",
          "請重新登入",
          "Session 已逾時",
          "session 已逾時",
          "已逾時",
          "請以健保卡登入",
        ];
        return phrases.some((p) => text.includes(p));
      },
    });
    return !!result;
  } catch {
    return false;
  }
}

export async function apiSyncNhi() {
  const ov = getPatientOverride();
  if (!ov) {
    setStatus("⛔ 請回到「② 您的資料」，填好性別、生日後按「儲存」", "error");
    return;
  }

  // Pre-flight: check we're on an NHI tab so cookies are usable from SW.
  const tab = await getActiveTab();
  let url: any;
  try {
    url = new URL(tab.url);
  } catch {
    setStatus("active tab has no URL", "error");
    return;
  }
  const onLogin = await isOnNhiLoginPage(tab.id, url);
  if (onLogin) {
    setStatus("🔒 還沒登入健保存摺 — 請回到「① 登入」", "error");
    return;
  }

  // Backend mode: re-verify connectivity right here even if the banner
  // last said ok. Between the previous check and this click the user
  // may have stopped docker; without a fresh probe we'd start an upload
  // that fails mid-flight after partial data has hit (or failed to hit)
  // the backend. Cheap (≤5s) and saves a lot of confusion.
  if (currentMode() === "backend") {
    const ok = await testBackendConnection();
    if (!ok) {
      setStatus("⛔ 連不上本機伺服器 — 請看上方提示說明", "error");
      return;
    }
  }

  els.syncApiBtn.disabled = true;

  await chrome.storage.local.set({
    syncStatus: {
      running: true,
      progress: "開始取得健保存摺資料…",
      phase: "starting",
      started: Date.now(),
      ts: Date.now(),
    },
  });
  setStatus("開始取得健保存摺資料…", "info");

  // Compute date range from the dropdown. "1" = NHI's default window;
  // anything else is "today back N years". Helper inside background.js
  // converts to 民國 for NHI's API.
  const rangeSel = els.apiSyncRange?.value || "3";
  let dateRange = null;
  const dateRangeLabel = RANGE_LABELS[rangeSel] || `最近 ${rangeSel} 年`;
  if (rangeSel !== "1") {
    const today = new Date();
    const end = today.toISOString().slice(0, 10);
    let start: string;
    if (rangeSel === "all") {
      start = "2001-01-01"; // 民國 90 — far enough back for any clinical case
    } else {
      const years = Number.parseInt(rangeSel, 10);
      const s = new Date(today);
      s.setFullYear(s.getFullYear() - years);
      start = s.toISOString().slice(0, 10);
    }
    dateRange = { start, end };
  }

  chrome.runtime
    .sendMessage({
      type: "startNhiApiSync",
      payload: {
        tabId: tab.id,
        mode: currentMode(),
        backend: els.backendUrl.value.trim(),
        syncApiKey: els.syncApiKey.value.trim(),
        nhiBase: "https://myhealthbank.nhi.gov.tw",
        patientOverride: ov,
        dateRange,
        dateRangeLabel,
        fetchImagingEnabled: els.fetchImagingEnabled?.checked === true,
      },
    })
    .catch(() => {});
}

export async function launch() {
  const backend = els.backendUrl.value.trim();
  const ov = getPatientOverride();
  const rawId = ov?.id_no;
  const smartAppLaunch = els.smartAppUrl.value.trim() || DEFAULT_SMART_APP_LAUNCH;
  // Defense-in-depth: even if a malicious browser extension wrote a
  // non-HTTPS / non-loopback URL straight into chrome.storage.local
  // (bypassing the change-listener validator above), the launch path
  // double-checks before sending the launch token anywhere.
  if (!_isSafeSmartAppUrl(smartAppLaunch)) {
    setStatus("⛔ SMART App URL 不安全（必須 https:// 或本機）；請到進階設定修正。", "error");
    return;
  }
  if (!rawId) {
    setStatus("還沒有身分資料 — 請先按「取得健保存摺資料」一次", "error");
    return;
  }
  // Backend tracks Patient under its hashed FHIR id, not the raw national
  // ID. De-identified syncs store under the masked-id hash (audit P1-1).
  const { maskNameEnabled } = await chrome.storage.local.get("maskNameEnabled");
  const patientId = effectiveFhirPatientId(rawId, maskNameEnabled === true);
  // Re-test connection even if banner shows ok — backend may have gone
  // down since the last probe.
  const ok = await testBackendConnection();
  if (!ok) {
    setStatus("⛔ 連不上本機伺服器 — 請看上方提示說明", "error");
    return;
  }
  setStatus("準備開啟醫析…", "info");
  try {
    const res = await fetch(`${backend}/smart/launch-context`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patient_id: patientId }),
    });
    if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
    const { launch } = await res.json();
    const params = new URLSearchParams({ iss: `${backend}/fhir`, launch });
    // Append iss + launch params, respecting any existing query string.
    const sep = smartAppLaunch.includes("?") ? "&" : "?";
    chrome.tabs.create({ url: `${smartAppLaunch}${sep}${params}` });
    window.close();
  } catch (e) {
    setStatus(`❌ 開啟醫析失敗：${e.message}`, "error");
  }
}

// SMART-App-URL change handler (wired in the entry). Persists a trimmed
// value; empty or unsafe input restores the default.
export function onSmartAppUrlChange() {
  const v = els.smartAppUrl.value.trim();
  if (!v) {
    chrome.storage.local.remove("smartAppLaunchUrl");
    els.smartAppUrl.value = DEFAULT_SMART_APP_LAUNCH;
    return;
  }
  if (!_isSafeSmartAppUrl(v)) {
    setStatus("⛔ SMART App URL 必須是 https:// 或本機 (http://localhost)；已還原預設。", "error");
    chrome.storage.local.remove("smartAppLaunchUrl");
    els.smartAppUrl.value = DEFAULT_SMART_APP_LAUNCH;
    return;
  }
  chrome.storage.local.set({ smartAppLaunchUrl: v });
}
