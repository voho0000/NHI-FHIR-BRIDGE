// NHI-FHIR Bridge popup logic.
//
// Flow:
//   1. On open, check the active tab is an NHI 健康存摺 page.
//   2. User confirms patient identity (身分證字號) in the patient-override card.
//   3. Clicks "📥 同步健保存摺資料" → background runs runNhiApiSync().
//   4. Progress streamed back via chrome.storage.local.syncStatus.
//   5. After sync completes, "🚀 開啟 SMART App" launches with that patient.

const DEFAULT_BACKEND = "http://localhost:8010";
// Default SMART app for a fresh install. Users can override via
// the '⚙️ 進階設定 → SMART App Launch URL' field; the value is
// persisted in chrome.storage.sync under `smartAppLaunchUrl`.
const DEFAULT_SMART_APP_LAUNCH = "https://voho0000.github.io/medical-note-smart-on-fhir/smart/launch";

// True if the active tab is an NHI 健康存摺 page (real site).
function isNhiTab(url) {
  if (!url) return false;
  try {
    const u = typeof url === "string" ? new URL(url) : url;
    return /myhealthbank\.nhi\.gov\.tw/.test(u.hostname);
  } catch {
    return false;
  }
}

const els = {
  backendUrl: document.getElementById("backend-url"),
  syncApiKey: document.getElementById("sync-api-key"),
  smartAppUrl: document.getElementById("smart-app-url"),
  syncApiBtn: document.getElementById("sync-api-btn"),
  apiSyncRange: document.getElementById("api-sync-range"),
  stopBtn: document.getElementById("stop-btn"),
  ovIdNo: document.getElementById("ov-id-no"),
  ovName: document.getElementById("ov-name"),
  ovBirthDate: document.getElementById("ov-birth-date"),
  ovGender: document.getElementById("ov-gender"),
  ovSaveBtn: document.getElementById("ov-save-btn"),
  ovClearBtn: document.getElementById("ov-clear-btn"),
  ovSummary: document.getElementById("override-summary"),
  patientOverrideDetails: document.getElementById("patient-override"),
  launchBtn: document.getElementById("launch-btn"),
  status: document.getElementById("status"),
  dashboardLink: document.getElementById("dashboard-link"),
};

// Persisted-state keys. Backend URL and API key persist across browser sessions.
async function loadBackendUrl() {
  const { backendUrl, syncApiKey, smartAppLaunchUrl } = await chrome.storage.sync.get(
    ["backendUrl", "syncApiKey", "smartAppLaunchUrl"]
  );
  els.backendUrl.value = backendUrl || DEFAULT_BACKEND;
  els.syncApiKey.value = syncApiKey || "";
  els.smartAppUrl.value = smartAppLaunchUrl || DEFAULT_SMART_APP_LAUNCH;
  els.dashboardLink.href = els.backendUrl.value.replace(/:8010.*$/, ":3010");
}

// ── Patient override (manual NHI identity) ────────────────────────────────
// NHI 健康存摺 doesn't expose the user's national ID in the URL. The user
// fills these once and they're sent with every upload call until cleared.

async function loadPatientOverride() {
  const { patientOverride } = await chrome.storage.sync.get("patientOverride");
  if (patientOverride) {
    els.ovIdNo.value = patientOverride.id_no || "";
    els.ovName.value = patientOverride.name || "";
    els.ovBirthDate.value = patientOverride.birth_date || "";
    els.ovGender.value = patientOverride.gender || "";
  }
  // First-time UX: if no id_no is stored, auto-expand the patient-data
  // details so the user immediately sees the required fields. Once
  // they've saved a value, default to collapsed.
  if (els.patientOverrideDetails) {
    els.patientOverrideDetails.open = !patientOverride?.id_no;
  }
  refreshOverrideSummary();
}

function getPatientOverride() {
  // Returns {id_no, name, birth_date, gender} only if id_no has a value.
  // Backend treats id_no as the trigger — without it, override is ignored.
  const id_no = els.ovIdNo.value.trim();
  if (!id_no) return null;
  const out = { id_no };
  const name = els.ovName.value.trim();
  const birth_date = els.ovBirthDate.value.trim();
  const gender = els.ovGender.value;
  if (name) out.name = name;
  if (birth_date) out.birth_date = birth_date;
  if (gender) out.gender = gender;
  return out;
}

function refreshOverrideSummary() {
  const ov = getPatientOverride();
  const card = els.patientOverrideDetails;
  if (!ov) {
    els.ovSummary.textContent = "未設定";
    if (card) card.dataset.state = "empty";
    els.launchBtn.disabled = true;
    return;
  }
  const parts = [ov.id_no];
  if (ov.name) parts.push(ov.name);
  els.ovSummary.textContent = `✓ ${parts.join("  ·  ")}`;
  if (card) card.dataset.state = "filled";
  // Once an id_no is on file we can always launch SMART for that patient.
  els.launchBtn.disabled = false;
}

async function savePatientOverride() {
  const ov = getPatientOverride();
  if (!ov) {
    setStatus("身分證字號為必填", "error");
    return;
  }
  await chrome.storage.sync.set({ patientOverride: ov });
  refreshOverrideSummary();
  if (els.patientOverrideDetails) els.patientOverrideDetails.open = false;
  setStatus(`✅ 已儲存病人資料：${ov.id_no}${ov.name ? ` (${ov.name})` : ""}`, "success");
}

async function clearPatientOverride() {
  await chrome.storage.sync.remove("patientOverride");
  els.ovIdNo.value = "";
  els.ovName.value = "";
  els.ovBirthDate.value = "";
  els.ovGender.value = "";
  refreshOverrideSummary();
  if (els.patientOverrideDetails) els.patientOverrideDetails.open = true;
  setStatus("已清除病人資料", "info");
}

els.backendUrl.addEventListener("change", () => {
  chrome.storage.sync.set({ backendUrl: els.backendUrl.value.trim() });
  els.dashboardLink.href = els.backendUrl.value.replace(/:8010.*$/, ":3010");
});
els.syncApiKey.addEventListener("change", () => {
  chrome.storage.sync.set({ syncApiKey: els.syncApiKey.value.trim() });
});
els.smartAppUrl.addEventListener("change", () => {
  // Persist trimmed value. Empty string → restore default on next load.
  const v = els.smartAppUrl.value.trim();
  if (v) {
    chrome.storage.sync.set({ smartAppLaunchUrl: v });
  } else {
    chrome.storage.sync.remove("smartAppLaunchUrl");
    els.smartAppUrl.value = DEFAULT_SMART_APP_LAUNCH;
  }
});

function setStatus(text, kind, breakdown) {
  // Build with DOM API — avoids innerHTML / XSS risk. When `breakdown`
  // (array of per-endpoint result tags) is provided, append a collapsible
  // '查看明細' section below the main message.
  els.status.className = kind || "";
  els.status.textContent = "";
  if (!text && !(breakdown && breakdown.length)) return;
  els.status.appendChild(document.createTextNode(text || ""));
  if (breakdown && breakdown.length) {
    const details = document.createElement("details");
    details.className = "status-detail";
    const summary = document.createElement("summary");
    summary.textContent = "查看明細";
    details.appendChild(summary);
    const body = document.createElement("div");
    body.className = "status-breakdown";
    body.textContent = breakdown.join(" · ");
    details.appendChild(body);
    els.status.appendChild(details);
  }
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function init() {
  await loadBackendUrl();
  await loadPatientOverride();

  const tab = await getActiveTab();
  if (!tab?.url) {
    setStatus("no active tab", "error");
    els.syncApiBtn.disabled = true;
    return;
  }

  // Enable sync button only when we're on an NHI tab (cookies/session
  // need to be from myhealthbank.nhi.gov.tw to call its JSON API).
  els.syncApiBtn.disabled = !isNhiTab(tab.url);

  // Re-attach to any sync that's currently running in the service worker.
  // This is what lets the user close + reopen the popup mid-sync.
  await refreshSyncStatusFromBackground();
}

async function refreshSyncStatusFromBackground() {
  const status = await chrome.runtime.sendMessage({ type: "getSyncStatus" }).catch(() => null);
  if (!status) return;
  applySyncStatus(status);
}

// Latest status snapshot — keeping it lets the live-elapsed ticker
// repaint the same progress text with an updated `[Ns]` prefix every
// second without spamming chrome.storage from the service worker.
let _latestStatus = null;
let _elapsedTickerId = null;

function _fmtElapsed(ms) {
  if (ms < 60_000) return `${Math.floor(ms / 1000)}s`;
  return `${Math.floor(ms / 60_000)}m${Math.round((ms % 60_000) / 1000)}s`;
}

function _renderStatus() {
  const status = _latestStatus;
  if (!status) return;
  let text = status.progress || "(sync 進行中)";
  if (status.running && status.started) {
    const elapsed = Date.now() - status.started;
    text = `⏱ ${_fmtElapsed(elapsed)} · ${text}`;
  }
  const kind = status.running ? "info" : (status.phase === "error" ? "error" : "success");
  const breakdown = status.running ? null : status.breakdown;
  setStatus(text, kind, breakdown);
}

function applySyncStatus(status) {
  if (!status) return;
  _latestStatus = status;
  _renderStatus();
  if (status.running) {
    els.syncApiBtn.disabled = true;
    els.stopBtn.hidden = false;
    if (!_elapsedTickerId) {
      _elapsedTickerId = setInterval(_renderStatus, 1000);
    }
  } else {
    els.syncApiBtn.disabled = false;
    els.stopBtn.hidden = true;
    if (_elapsedTickerId) {
      clearInterval(_elapsedTickerId);
      _elapsedTickerId = null;
    }
    // SMART launch availability is gated on patient_override id_no
    // (refreshOverrideSummary keeps launchBtn in sync), not on this status.
  }
}

// Stop the in-progress sync. Two-pronged so it works even when the
// service worker has died: (1) tell the SW to set its cancel flag,
// (2) write storage directly to running:false so the popup UI unfreezes
// immediately even if the SW message can't be delivered.
async function stopSync() {
  await chrome.storage.local.set({
    syncStatus: {
      running: false,
      progress: "⛔ 停止中，正在清除部分同步資料…",
      phase: "cancelled",
      ts: Date.now(),
      completed: Date.now(),
    },
  });
  setStatus("⛔ 停止中，正在清除部分同步資料…", "info");
  chrome.runtime.sendMessage({ type: "stopSync" }).catch(() => {});
  els.stopBtn.hidden = true;
  els.syncApiBtn.disabled = false;
}

// Live progress updates — listen on chrome.storage.onChanged so we get
// every update the SW writes, regardless of whether the SW's broadcast
// sendMessage reached us.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.syncStatus) {
    applySyncStatus(changes.syncStatus.newValue);
  }
});

// (Legacy in-memory broadcast still listened to as a backup.)
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "syncProgress") {
    applySyncStatus(msg.status);
  }
});

// Pre-flight detection for NHI login state. Two signals (either triggers):
//  1. URL is in NHI auth namespace (IHKE3099Sxx) — login / IC card pages
//  2. Page contains a password input or known logged-out phrases
async function isOnNhiLoginPage(tabId, url) {
  if (url?.pathname && /IHKE3099/.test(url.pathname)) return true;
  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        if (document.querySelector('input[type="password"]')) return true;
        const text = (document.body?.innerText || "").trim();
        const phrases = [
          "請使用健保卡", "請插入健保卡", "請插入您的健保卡",
          "登入健康存摺", "登入失敗", "請重新登入",
          "Session 已逾時", "session 已逾時", "已逾時",
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

// ⚡ NHI API-direct sync — primary path. Hits NHI's underlying JSON
// endpoints in parallel and posts adapted items to /sync/upload-structured.
// Requires patient_override to be filled.
async function apiSyncNhi() {
  const ov = getPatientOverride();
  if (!ov) {
    setStatus("⛔ 請先填寫上方病人資料（身分證字號）", "error");
    return;
  }

  // Pre-flight: check we're on an NHI tab so cookies are usable from SW.
  const tab = await getActiveTab();
  let url;
  try { url = new URL(tab.url); } catch { setStatus("active tab has no URL", "error"); return; }
  const onLogin = await isOnNhiLoginPage(tab.id, url);
  if (onLogin) {
    setStatus("🔒 尚未登入健保存摺 — 請先以健保卡登入後再試", "error");
    return;
  }

  els.syncApiBtn.disabled = true;

  await chrome.storage.local.set({
    syncStatus: {
      running: true,
      progress: "🚀 開始同步健保存摺資料…",
      phase: "starting", started: Date.now(), ts: Date.now(),
    },
  });
  setStatus("🚀 開始同步健保存摺資料…", "info");

  // Compute date range from the dropdown. "1" = NHI's default window;
  // anything else is "today back N years". Helper inside background.js
  // converts to 民國 for NHI's API.
  const rangeSel = els.apiSyncRange?.value || "3";
  let dateRange = null;
  const RANGE_LABELS = {
    "1":   "最近 1 年",
    "3":   "最近 3 年",
    "5":   "最近 5 年",
    "10":  "最近 10 年",
    "all": "全部歷史紀錄",
  };
  const dateRangeLabel = RANGE_LABELS[rangeSel] || `最近 ${rangeSel} 年`;
  if (rangeSel !== "1") {
    const today = new Date();
    const end = today.toISOString().slice(0, 10);
    let start;
    if (rangeSel === "all") {
      start = "2001-01-01";  // 民國 90 — far enough back for any clinical case
    } else {
      const years = parseInt(rangeSel, 10);
      const s = new Date(today);
      s.setFullYear(s.getFullYear() - years);
      start = s.toISOString().slice(0, 10);
    }
    dateRange = { start, end };
  }

  chrome.runtime.sendMessage({
    type: "startNhiApiSync",
    payload: {
      tabId: tab.id,
      backend: els.backendUrl.value.trim(),
      syncApiKey: els.syncApiKey.value.trim(),
      nhiBase: "https://myhealthbank.nhi.gov.tw",
      patientOverride: ov,
      dateRange,
      dateRangeLabel,
    },
  }).catch(() => {});
}

async function launch() {
  const backend = els.backendUrl.value.trim();
  const ov = getPatientOverride();
  const patientId = ov?.id_no;
  const smartAppLaunch = els.smartAppUrl.value.trim() || DEFAULT_SMART_APP_LAUNCH;
  if (!patientId) {
    setStatus("沒有病人身分證字號可以 launch — 請先填寫病人資料", "error");
    return;
  }
  setStatus("建立 launch context…", "info");
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
    setStatus(`❌ Launch 失敗：${e.message}`, "error");
  }
}

els.syncApiBtn.addEventListener("click", apiSyncNhi);
els.stopBtn.addEventListener("click", stopSync);
els.ovSaveBtn.addEventListener("click", savePatientOverride);
els.ovClearBtn.addEventListener("click", clearPatientOverride);
[els.ovIdNo, els.ovName, els.ovBirthDate, els.ovGender].forEach((el) =>
  el.addEventListener("input", refreshOverrideSummary)
);
els.launchBtn.addEventListener("click", launch);
init();
