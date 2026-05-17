(() => {
  // src/popup.js
  var DEFAULT_BACKEND = "http://localhost:8010";
  var DEFAULT_SMART_APP_LAUNCH = "https://voho0000.github.io/medical-note-smart-on-fhir/smart/launch";
  function isNhiTab(url) {
    if (!url) return false;
    try {
      const u = typeof url === "string" ? new URL(url) : url;
      return /myhealthbank\.nhi\.gov\.tw/.test(u.hostname);
    } catch {
      return false;
    }
  }
  var DEFAULT_MODE = "local";
  var els = {
    modeRadios: () => document.querySelectorAll('input[name="sync-mode"]'),
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
    pendingBundle: document.getElementById("pending-bundle"),
    downloadBundleBtn: document.getElementById("download-bundle-btn"),
    clearBundleBtn: document.getElementById("clear-bundle-btn"),
    bundleMeta: document.getElementById("bundle-meta"),
    connBanner: document.getElementById("conn-banner"),
    connMsg: document.getElementById("conn-msg"),
    connRetryBtn: document.getElementById("conn-retry-btn"),
    connHelp: document.getElementById("conn-help")
  };
  var PENDING_BUNDLE_KEY = "pendingFhirBundle";
  async function loadBackendUrl() {
    const { backendUrl, syncApiKey, smartAppLaunchUrl } = await chrome.storage.sync.get(
      ["backendUrl", "syncApiKey", "smartAppLaunchUrl"]
    );
    els.backendUrl.value = backendUrl || DEFAULT_BACKEND;
    els.syncApiKey.value = syncApiKey || "";
    els.smartAppUrl.value = smartAppLaunchUrl || DEFAULT_SMART_APP_LAUNCH;
    els.dashboardLink.href = els.backendUrl.value.replace(/:8010.*$/, ":3010");
  }
  async function loadPatientOverride() {
    const { patientOverride } = await chrome.storage.sync.get("patientOverride");
    if (patientOverride) {
      els.ovIdNo.value = patientOverride.id_no || "";
      els.ovName.value = patientOverride.name || "";
      els.ovBirthDate.value = patientOverride.birth_date || "";
      els.ovGender.value = patientOverride.gender || "";
    }
    if (els.patientOverrideDetails) {
      els.patientOverrideDetails.open = !patientOverride?.id_no;
    }
    refreshOverrideSummary();
  }
  function getPatientOverride() {
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
      els.ovSummary.textContent = "\u672A\u8A2D\u5B9A";
      if (card) card.dataset.state = "empty";
    } else {
      const parts = [ov.id_no];
      if (ov.name) parts.push(ov.name);
      els.ovSummary.textContent = `\u2713 ${parts.join("  \xB7  ")}`;
      if (card) card.dataset.state = "filled";
    }
    _refreshButtonStates();
  }
  async function savePatientOverride() {
    const ov = getPatientOverride();
    if (!ov) {
      setStatus("\u8EAB\u5206\u8B49\u5B57\u865F\u70BA\u5FC5\u586B", "error");
      return;
    }
    await chrome.storage.sync.set({ patientOverride: ov });
    refreshOverrideSummary();
    if (els.patientOverrideDetails) els.patientOverrideDetails.open = false;
    setStatus(`\u2705 \u5DF2\u5132\u5B58\u75C5\u4EBA\u8CC7\u6599\uFF1A${ov.id_no}${ov.name ? ` (${ov.name})` : ""}`, "success");
  }
  async function clearPatientOverride() {
    await chrome.storage.sync.remove("patientOverride");
    els.ovIdNo.value = "";
    els.ovName.value = "";
    els.ovBirthDate.value = "";
    els.ovGender.value = "";
    refreshOverrideSummary();
    if (els.patientOverrideDetails) els.patientOverrideDetails.open = true;
    setStatus("\u5DF2\u6E05\u9664\u75C5\u4EBA\u8CC7\u6599", "info");
  }
  var _connState = "unknown";
  var _connFailReason = null;
  var _CONN_LABELS = {
    unknown: "\u672A\u6AA2\u6E2C",
    checking: "\u6AA2\u6E2C\u4E2D\u2026",
    ok: () => `\u5DF2\u9023\u7DDA \u2014 ${els.backendUrl.value.trim()}`,
    fail: () => {
      const r = _connFailReason || {};
      return {
        "no-url": "\u2717 \u672A\u8A2D\u5B9A Backend URL",
        "no-permission": "\u2717 \u672A\u6388\u6B0A\u9023\u7DDA",
        "network": "\u2717 \u9023\u4E0D\u4E0A\u5F8C\u7AEF",
        "timeout": "\u2717 \u9023\u7DDA\u903E\u6642",
        "http": `\u2717 HTTP ${r.detail || ""}`.trim(),
        "not-fhir": "\u2717 \u56DE\u61C9\u4E0D\u662F FHIR"
      }[r.kind] ?? "\u2717 \u9023\u7DDA\u5931\u6557";
    }
  };
  var _CONN_HELP = {
    "no-url": "\u8ACB\u5230\u300C\u9032\u968E\u8A2D\u5B9A\u300D\u586B\u5165 Backend URL\uFF0C\u4F8B\u5982 <code>http://localhost:8010</code>\u3002",
    "no-permission": "Chrome \u963B\u64CB\u4E86\u8DE8\u4F86\u6E90\u8ACB\u6C42\u3002\u8ACB\u91CD\u65B0\u958B popup\uFF0C\u7576\u6B0A\u9650\u5C0D\u8A71\u6846\u8DF3\u51FA\u6642\u6309\u300C\u5141\u8A31\u300D\u3002",
    "network": "\u5F8C\u7AEF\u53EF\u80FD\u9084\u6C92\u555F\u52D5\u3002\u8ACB\u57F7\u884C\uFF1A<br><code>docker compose up -d</code><br>\u78BA\u8A8D backend \u5BB9\u5668\u8DD1\u8D77\u4F86\u518D\u91CD\u8A66\u3002",
    "timeout": "5 \u79D2\u5167\u6C92\u6536\u5230\u56DE\u61C9 \u2014 backend \u53EF\u80FD\u9084\u5728\u555F\u52D5\u4E2D\uFF0C\u7B49 30 \u79D2\u518D\u6309\u91CD\u8A66\u3002",
    "http": "Backend \u56DE\u61C9\u932F\u8AA4\u72C0\u614B\u78BC\u3002\u6AA2\u67E5 backend \u7684 log\uFF1A<br><code>docker compose logs backend</code>",
    "not-fhir": "\u9019\u500B URL \u56DE\u4E86\u6771\u897F\uFF0C\u4F46\u4E0D\u662F FHIR CapabilityStatement\u3002\u78BA\u8A8D Backend URL \u6307\u5411 NHI-FHIR-Bridge \u7684 /fhir \u6839\u76EE\u9304\u3002"
  };
  function _renderConnBanner() {
    const banner = els.connBanner;
    if (!banner) return;
    banner.dataset.state = _connState;
    const label = _CONN_LABELS[_connState];
    els.connMsg.textContent = typeof label === "function" ? label() : label;
    els.connRetryBtn.hidden = _connState !== "fail";
    if (_connState === "fail" && _connFailReason?.kind) {
      els.connHelp.hidden = false;
      els.connHelp.innerHTML = _CONN_HELP[_connFailReason.kind] ?? "";
    } else {
      els.connHelp.hidden = true;
      els.connHelp.innerHTML = "";
    }
  }
  function _refreshButtonStates() {
    const onNhi = !els.syncApiBtn.dataset.offNhi;
    const modeOk = currentMode() === "local" || _connState === "ok";
    els.syncApiBtn.disabled = !(onNhi && modeOk);
    els.syncApiBtn.title = !onNhi ? "\u8ACB\u5148\u5207\u5230\u5065\u4FDD\u5B58\u647A\u5206\u9801\u518D\u540C\u6B65" : !modeOk ? "\u5F8C\u7AEF\u5C1A\u672A\u9023\u7DDA" : "";
    const ov = getPatientOverride();
    els.launchBtn.disabled = !(currentMode() === "backend" && _connState === "ok" && !!ov?.id_no);
    els.launchBtn.title = currentMode() !== "backend" ? "\u8ACB\u5207\u5230\u300C\u4E0A\u50B3\u5F8C\u7AEF\u300D\u6A21\u5F0F" : _connState !== "ok" ? "\u5F8C\u7AEF\u5C1A\u672A\u9023\u7DDA" : !ov?.id_no ? "\u8ACB\u5148\u586B\u75C5\u4EBA\u8CC7\u6599" : "";
  }
  async function testBackendConnection() {
    const url = els.backendUrl.value.trim();
    if (!url) {
      _connState = "fail";
      _connFailReason = { kind: "no-url" };
      _renderConnBanner();
      _refreshButtonStates();
      return false;
    }
    _connState = "checking";
    _connFailReason = null;
    _renderConnBanner();
    _refreshButtonStates();
    const perm = await ensureBackendPermission(url);
    if (!perm.ok) {
      _connState = "fail";
      _connFailReason = { kind: "no-permission" };
      _renderConnBanner();
      _refreshButtonStates();
      return false;
    }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5e3);
    try {
      const res = await fetch(`${url.replace(/\/$/, "")}/fhir/metadata`, { signal: ctrl.signal });
      if (!res.ok) {
        _connState = "fail";
        _connFailReason = { kind: "http", detail: res.status };
      } else {
        const body = await res.json().catch(() => null);
        if (body?.resourceType !== "CapabilityStatement") {
          _connState = "fail";
          _connFailReason = { kind: "not-fhir" };
        } else {
          _connState = "ok";
          _connFailReason = null;
        }
      }
    } catch (e) {
      _connState = "fail";
      _connFailReason = { kind: e.name === "AbortError" ? "timeout" : "network" };
    } finally {
      clearTimeout(timer);
    }
    _renderConnBanner();
    _refreshButtonStates();
    return _connState === "ok";
  }
  els.connRetryBtn?.addEventListener("click", testBackendConnection);
  async function loadSyncMode() {
    const { syncMode } = await chrome.storage.sync.get("syncMode");
    const mode = syncMode === "backend" ? "backend" : DEFAULT_MODE;
    for (const r of els.modeRadios()) r.checked = r.value === mode;
    document.body.dataset.mode = mode;
    if (mode === "backend") {
      await testBackendConnection();
    } else {
      _connState = "unknown";
      _connFailReason = null;
      _renderConnBanner();
    }
  }
  function currentMode() {
    for (const r of els.modeRadios()) if (r.checked) return r.value;
    return DEFAULT_MODE;
  }
  for (const r of els.modeRadios()) {
    r.addEventListener("change", () => {
      const mode = currentMode();
      document.body.dataset.mode = mode;
      chrome.storage.sync.set({ syncMode: mode });
      if (mode === "backend") {
        testBackendConnection();
      } else {
        _connState = "unknown";
        _connFailReason = null;
        _renderConnBanner();
        _refreshButtonStates();
      }
    });
  }
  els.backendUrl.addEventListener("change", () => {
    chrome.storage.sync.set({ backendUrl: els.backendUrl.value.trim() });
    els.dashboardLink.href = els.backendUrl.value.replace(/:8010.*$/, ":3010");
    if (currentMode() === "backend") testBackendConnection();
  });
  els.syncApiKey.addEventListener("change", () => {
    chrome.storage.sync.set({ syncApiKey: els.syncApiKey.value.trim() });
  });
  els.smartAppUrl.addEventListener("change", () => {
    const v = els.smartAppUrl.value.trim();
    if (v) {
      chrome.storage.sync.set({ smartAppLaunchUrl: v });
    } else {
      chrome.storage.sync.remove("smartAppLaunchUrl");
      els.smartAppUrl.value = DEFAULT_SMART_APP_LAUNCH;
    }
  });
  function setStatus(text, kind, breakdown) {
    els.status.className = kind || "";
    els.status.textContent = "";
    if (!text && !(breakdown && breakdown.length)) return;
    els.status.appendChild(document.createTextNode(text || ""));
    if (breakdown && breakdown.length) {
      const phaseRows = breakdown.filter((b) => b.startsWith("\u23F1"));
      const otherRows = breakdown.filter((b) => !b.startsWith("\u23F1"));
      const details = document.createElement("details");
      details.className = "status-detail";
      const summary = document.createElement("summary");
      summary.textContent = "\u67E5\u770B\u660E\u7D30";
      details.appendChild(summary);
      if (phaseRows.length) {
        const phases = document.createElement("div");
        phases.className = "status-phases";
        phases.textContent = phaseRows.map((p) => p.replace(/^⏱\s*/, "")).join(" \xB7 ");
        details.appendChild(phases);
      }
      if (otherRows.length) {
        const body = document.createElement("div");
        body.className = "status-breakdown";
        body.textContent = otherRows.join(" \xB7 ");
        details.appendChild(body);
      }
      els.status.appendChild(details);
    }
  }
  async function getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }
  function _fmtBytes(n) {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(2)} MB`;
  }
  async function refreshPendingBundle() {
    const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.local.get(PENDING_BUNDLE_KEY);
    if (!pending || !pending.json) {
      els.pendingBundle.hidden = true;
      return;
    }
    els.pendingBundle.hidden = false;
    const ago = pending.generatedAt ? `${Math.max(1, Math.round((Date.now() - pending.generatedAt) / 1e3))} \u79D2\u524D` : "";
    els.bundleMeta.textContent = `${pending.filename} \xB7 ${_fmtBytes(pending.bytes || 0)}${ago ? ` \xB7 ${ago}` : ""}`;
  }
  async function downloadPendingBundle() {
    const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.local.get(PENDING_BUNDLE_KEY);
    if (!pending) return;
    const blob = new Blob([pending.json], { type: "application/fhir+json" });
    const url = URL.createObjectURL(blob);
    try {
      await chrome.downloads.download({ url, filename: pending.filename, saveAs: false });
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 5e3);
    }
  }
  async function clearPendingBundle() {
    await chrome.storage.local.remove(PENDING_BUNDLE_KEY);
    await refreshPendingBundle();
  }
  els.downloadBundleBtn.addEventListener("click", downloadPendingBundle);
  els.clearBundleBtn.addEventListener("click", clearPendingBundle);
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && PENDING_BUNDLE_KEY in changes) refreshPendingBundle();
  });
  async function init() {
    await loadBackendUrl();
    await loadSyncMode();
    await loadPatientOverride();
    await refreshPendingBundle();
    const tab = await getActiveTab();
    if (!tab?.url) {
      setStatus("no active tab", "error");
      els.syncApiBtn.dataset.offNhi = "1";
      _refreshButtonStates();
      return;
    }
    if (isNhiTab(tab.url)) delete els.syncApiBtn.dataset.offNhi;
    else els.syncApiBtn.dataset.offNhi = "1";
    _refreshButtonStates();
    await refreshSyncStatusFromBackground();
  }
  async function refreshSyncStatusFromBackground() {
    const status = await chrome.runtime.sendMessage({ type: "getSyncStatus" }).catch(() => null);
    if (!status) return;
    applySyncStatus(status);
  }
  var _latestStatus = null;
  var _elapsedTickerId = null;
  function _fmtElapsed(ms) {
    if (ms < 6e4) return `${Math.floor(ms / 1e3)}s`;
    return `${Math.floor(ms / 6e4)}m${Math.round(ms % 6e4 / 1e3)}s`;
  }
  function _renderStatus() {
    const status = _latestStatus;
    if (!status) return;
    let text = status.progress || "(sync \u9032\u884C\u4E2D)";
    if (status.running && status.started) {
      const elapsed = Date.now() - status.started;
      text = `\u23F1 ${_fmtElapsed(elapsed)} \xB7 ${text}`;
    }
    const kind = status.running ? "info" : status.phase === "error" ? "error" : "success";
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
        _elapsedTickerId = setInterval(_renderStatus, 1e3);
      }
    } else {
      els.stopBtn.hidden = true;
      if (_elapsedTickerId) {
        clearInterval(_elapsedTickerId);
        _elapsedTickerId = null;
      }
      _refreshButtonStates();
    }
  }
  async function stopSync() {
    await chrome.storage.local.set({
      syncStatus: {
        running: false,
        progress: "\u26D4 \u505C\u6B62\u4E2D\uFF0C\u6B63\u5728\u6E05\u9664\u90E8\u5206\u540C\u6B65\u8CC7\u6599\u2026",
        phase: "cancelled",
        ts: Date.now(),
        completed: Date.now()
      }
    });
    setStatus("\u26D4 \u505C\u6B62\u4E2D\uFF0C\u6B63\u5728\u6E05\u9664\u90E8\u5206\u540C\u6B65\u8CC7\u6599\u2026", "info");
    chrome.runtime.sendMessage({ type: "stopSync" }).catch(() => {
    });
    els.stopBtn.hidden = true;
    _refreshButtonStates();
  }
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.syncStatus) {
      applySyncStatus(changes.syncStatus.newValue);
    }
  });
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type === "syncProgress") {
      applySyncStatus(msg.status);
    }
  });
  async function isOnNhiLoginPage(tabId, url) {
    if (url?.pathname && /IHKE3099/.test(url.pathname)) return true;
    try {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          if (document.querySelector('input[type="password"]')) return true;
          const text = (document.body?.innerText || "").trim();
          const phrases = [
            "\u8ACB\u4F7F\u7528\u5065\u4FDD\u5361",
            "\u8ACB\u63D2\u5165\u5065\u4FDD\u5361",
            "\u8ACB\u63D2\u5165\u60A8\u7684\u5065\u4FDD\u5361",
            "\u767B\u5165\u5065\u5EB7\u5B58\u647A",
            "\u767B\u5165\u5931\u6557",
            "\u8ACB\u91CD\u65B0\u767B\u5165",
            "Session \u5DF2\u903E\u6642",
            "session \u5DF2\u903E\u6642",
            "\u5DF2\u903E\u6642",
            "\u8ACB\u4EE5\u5065\u4FDD\u5361\u767B\u5165"
          ];
          return phrases.some((p) => text.includes(p));
        }
      });
      return !!result;
    } catch {
      return false;
    }
  }
  function _originPatternFor(url) {
    try {
      const u = new URL(url);
      return `${u.protocol}//${u.host}/*`;
    } catch {
      return null;
    }
  }
  async function ensureBackendPermission(backendUrl) {
    const pattern = _originPatternFor(backendUrl);
    if (!pattern) return { ok: false, reason: `Backend URL \u7121\u6CD5\u89E3\u6790: ${backendUrl}` };
    const already = await chrome.permissions.contains({ origins: [pattern] });
    if (already) return { ok: true };
    let granted;
    try {
      granted = await chrome.permissions.request({ origins: [pattern] });
    } catch (e) {
      return { ok: false, reason: `\u6B0A\u9650\u8ACB\u6C42\u5931\u6557: ${e.message}` };
    }
    return granted ? { ok: true } : { ok: false, reason: `\u672A\u6388\u6B0A\u9023\u7DDA\u5230 ${pattern} \u2014 \u540C\u6B65\u53D6\u6D88` };
  }
  async function apiSyncNhi() {
    const ov = getPatientOverride();
    if (!ov) {
      setStatus("\u26D4 \u8ACB\u5148\u586B\u5BEB\u4E0A\u65B9\u75C5\u4EBA\u8CC7\u6599\uFF08\u8EAB\u5206\u8B49\u5B57\u865F\uFF09", "error");
      return;
    }
    const tab = await getActiveTab();
    let url;
    try {
      url = new URL(tab.url);
    } catch {
      setStatus("active tab has no URL", "error");
      return;
    }
    const onLogin = await isOnNhiLoginPage(tab.id, url);
    if (onLogin) {
      setStatus("\u{1F512} \u5C1A\u672A\u767B\u5165\u5065\u4FDD\u5B58\u647A \u2014 \u8ACB\u5148\u4EE5\u5065\u4FDD\u5361\u767B\u5165\u5F8C\u518D\u8A66", "error");
      return;
    }
    if (currentMode() === "backend") {
      const ok = await testBackendConnection();
      if (!ok) {
        setStatus("\u26D4 \u5F8C\u7AEF\u9023\u7DDA\u5931\u6557 \u2014 \u8ACB\u770B\u9802\u90E8 banner \u7684\u8AAA\u660E", "error");
        return;
      }
    }
    els.syncApiBtn.disabled = true;
    await chrome.storage.local.set({
      syncStatus: {
        running: true,
        progress: "\u{1F680} \u958B\u59CB\u540C\u6B65\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u2026",
        phase: "starting",
        started: Date.now(),
        ts: Date.now()
      }
    });
    setStatus("\u{1F680} \u958B\u59CB\u540C\u6B65\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u2026", "info");
    const rangeSel = els.apiSyncRange?.value || "3";
    let dateRange = null;
    const RANGE_LABELS = {
      "1": "\u6700\u8FD1 1 \u5E74",
      "3": "\u6700\u8FD1 3 \u5E74",
      "5": "\u6700\u8FD1 5 \u5E74",
      "10": "\u6700\u8FD1 10 \u5E74",
      "all": "\u5168\u90E8\u6B77\u53F2\u7D00\u9304"
    };
    const dateRangeLabel = RANGE_LABELS[rangeSel] || `\u6700\u8FD1 ${rangeSel} \u5E74`;
    if (rangeSel !== "1") {
      const today = /* @__PURE__ */ new Date();
      const end = today.toISOString().slice(0, 10);
      let start;
      if (rangeSel === "all") {
        start = "2001-01-01";
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
        mode: currentMode(),
        backend: els.backendUrl.value.trim(),
        syncApiKey: els.syncApiKey.value.trim(),
        nhiBase: "https://myhealthbank.nhi.gov.tw",
        patientOverride: ov,
        dateRange,
        dateRangeLabel
      }
    }).catch(() => {
    });
  }
  async function launch() {
    const backend = els.backendUrl.value.trim();
    const ov = getPatientOverride();
    const patientId = ov?.id_no;
    const smartAppLaunch = els.smartAppUrl.value.trim() || DEFAULT_SMART_APP_LAUNCH;
    if (!patientId) {
      setStatus("\u6C92\u6709\u75C5\u4EBA\u8EAB\u5206\u8B49\u5B57\u865F\u53EF\u4EE5 launch \u2014 \u8ACB\u5148\u586B\u5BEB\u75C5\u4EBA\u8CC7\u6599", "error");
      return;
    }
    const ok = await testBackendConnection();
    if (!ok) {
      setStatus("\u26D4 \u5F8C\u7AEF\u9023\u7DDA\u5931\u6557 \u2014 \u8ACB\u770B\u9802\u90E8 banner \u7684\u8AAA\u660E", "error");
      return;
    }
    setStatus("\u5EFA\u7ACB launch context\u2026", "info");
    try {
      const res = await fetch(`${backend}/smart/launch-context`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patientId })
      });
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
      const { launch: launch2 } = await res.json();
      const params = new URLSearchParams({ iss: `${backend}/fhir`, launch: launch2 });
      const sep = smartAppLaunch.includes("?") ? "&" : "?";
      chrome.tabs.create({ url: `${smartAppLaunch}${sep}${params}` });
      window.close();
    } catch (e) {
      setStatus(`\u274C Launch \u5931\u6557\uFF1A${e.message}`, "error");
    }
  }
  els.syncApiBtn.addEventListener("click", apiSyncNhi);
  els.stopBtn.addEventListener("click", stopSync);
  els.ovSaveBtn.addEventListener("click", savePatientOverride);
  els.ovClearBtn.addEventListener("click", clearPatientOverride);
  [els.ovIdNo, els.ovName, els.ovBirthDate, els.ovGender].forEach(
    (el) => el.addEventListener("input", refreshOverrideSummary)
  );
  els.launchBtn.addEventListener("click", launch);
  init();
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3BvcHVwLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBOSEktRkhJUiBCcmlkZ2UgcG9wdXAgbG9naWMuXG4vL1xuLy8gRmxvdzpcbi8vICAgMS4gT24gb3BlbiwgY2hlY2sgdGhlIGFjdGl2ZSB0YWIgaXMgYW4gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBwYWdlLlxuLy8gICAyLiBVc2VyIGNvbmZpcm1zIHBhdGllbnQgaWRlbnRpdHkgKFx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1RikgaW4gdGhlIHBhdGllbnQtb3ZlcnJpZGUgY2FyZC5cbi8vICAgMy4gQ2xpY2tzIFwiXHVEODNEXHVEQ0U1IFx1NTQwQ1x1NkI2NVx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVwiIFx1MjE5MiBiYWNrZ3JvdW5kIHJ1bnMgcnVuTmhpQXBpU3luYygpLlxuLy8gICA0LiBQcm9ncmVzcyBzdHJlYW1lZCBiYWNrIHZpYSBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zeW5jU3RhdHVzLlxuLy8gICA1LiBBZnRlciBzeW5jIGNvbXBsZXRlcywgXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1NTVGIFNNQVJUIEFwcFwiIGxhdW5jaGVzIHdpdGggdGhhdCBwYXRpZW50LlxuXG5jb25zdCBERUZBVUxUX0JBQ0tFTkQgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODAxMFwiO1xuLy8gRGVmYXVsdCBTTUFSVCBhcHAgZm9yIGEgZnJlc2ggaW5zdGFsbC4gVXNlcnMgY2FuIG92ZXJyaWRlIHZpYVxuLy8gdGhlICdcdTI2OTlcdUZFMEYgXHU5MDMyXHU5NjhFXHU4QTJEXHU1QjlBIFx1MjE5MiBTTUFSVCBBcHAgTGF1bmNoIFVSTCcgZmllbGQ7IHRoZSB2YWx1ZSBpc1xuLy8gcGVyc2lzdGVkIGluIGNocm9tZS5zdG9yYWdlLnN5bmMgdW5kZXIgYHNtYXJ0QXBwTGF1bmNoVXJsYC5cbmNvbnN0IERFRkFVTFRfU01BUlRfQVBQX0xBVU5DSCA9IFwiaHR0cHM6Ly92b2hvMDAwMC5naXRodWIuaW8vbWVkaWNhbC1ub3RlLXNtYXJ0LW9uLWZoaXIvc21hcnQvbGF1bmNoXCI7XG5cbi8vIFRydWUgaWYgdGhlIGFjdGl2ZSB0YWIgaXMgYW4gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBwYWdlIChyZWFsIHNpdGUpLlxuZnVuY3Rpb24gaXNOaGlUYWIodXJsKSB7XG4gIGlmICghdXJsKSByZXR1cm4gZmFsc2U7XG4gIHRyeSB7XG4gICAgY29uc3QgdSA9IHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIgPyBuZXcgVVJMKHVybCkgOiB1cmw7XG4gICAgcmV0dXJuIC9teWhlYWx0aGJhbmtcXC5uaGlcXC5nb3ZcXC50dy8udGVzdCh1Lmhvc3RuYW1lKTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmNvbnN0IERFRkFVTFRfTU9ERSA9IFwibG9jYWxcIjtcblxuY29uc3QgZWxzID0ge1xuICBtb2RlUmFkaW9zOiAoKSA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwic3luYy1tb2RlXCJdJyksXG4gIGJhY2tlbmRVcmw6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmFja2VuZC11cmxcIiksXG4gIHN5bmNBcGlLZXk6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3luYy1hcGkta2V5XCIpLFxuICBzbWFydEFwcFVybDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzbWFydC1hcHAtdXJsXCIpLFxuICBzeW5jQXBpQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN5bmMtYXBpLWJ0blwiKSxcbiAgYXBpU3luY1JhbmdlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFwaS1zeW5jLXJhbmdlXCIpLFxuICBzdG9wQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0b3AtYnRuXCIpLFxuICBvdklkTm86IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3YtaWQtbm9cIiksXG4gIG92TmFtZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1uYW1lXCIpLFxuICBvdkJpcnRoRGF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1iaXJ0aC1kYXRlXCIpLFxuICBvdkdlbmRlcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1nZW5kZXJcIiksXG4gIG92U2F2ZUJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1zYXZlLWJ0blwiKSxcbiAgb3ZDbGVhckJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1jbGVhci1idG5cIiksXG4gIG92U3VtbWFyeTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVycmlkZS1zdW1tYXJ5XCIpLFxuICBwYXRpZW50T3ZlcnJpZGVEZXRhaWxzOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhdGllbnQtb3ZlcnJpZGVcIiksXG4gIGxhdW5jaEJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsYXVuY2gtYnRuXCIpLFxuICBzdGF0dXM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RhdHVzXCIpLFxuICBkYXNoYm9hcmRMaW5rOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhc2hib2FyZC1saW5rXCIpLFxuICBwZW5kaW5nQnVuZGxlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBlbmRpbmctYnVuZGxlXCIpLFxuICBkb3dubG9hZEJ1bmRsZUJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkb3dubG9hZC1idW5kbGUtYnRuXCIpLFxuICBjbGVhckJ1bmRsZUJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjbGVhci1idW5kbGUtYnRuXCIpLFxuICBidW5kbGVNZXRhOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1bmRsZS1tZXRhXCIpLFxuICBjb25uQmFubmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4tYmFubmVyXCIpLFxuICBjb25uTXNnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4tbXNnXCIpLFxuICBjb25uUmV0cnlCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1yZXRyeS1idG5cIiksXG4gIGNvbm5IZWxwOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4taGVscFwiKSxcbn07XG5cbmNvbnN0IFBFTkRJTkdfQlVORExFX0tFWSA9IFwicGVuZGluZ0ZoaXJCdW5kbGVcIjtcblxuLy8gUGVyc2lzdGVkLXN0YXRlIGtleXMuIEJhY2tlbmQgVVJMIGFuZCBBUEkga2V5IHBlcnNpc3QgYWNyb3NzIGJyb3dzZXIgc2Vzc2lvbnMuXG5hc3luYyBmdW5jdGlvbiBsb2FkQmFja2VuZFVybCgpIHtcbiAgY29uc3QgeyBiYWNrZW5kVXJsLCBzeW5jQXBpS2V5LCBzbWFydEFwcExhdW5jaFVybCB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoXG4gICAgW1wiYmFja2VuZFVybFwiLCBcInN5bmNBcGlLZXlcIiwgXCJzbWFydEFwcExhdW5jaFVybFwiXVxuICApO1xuICBlbHMuYmFja2VuZFVybC52YWx1ZSA9IGJhY2tlbmRVcmwgfHwgREVGQVVMVF9CQUNLRU5EO1xuICBlbHMuc3luY0FwaUtleS52YWx1ZSA9IHN5bmNBcGlLZXkgfHwgXCJcIjtcbiAgZWxzLnNtYXJ0QXBwVXJsLnZhbHVlID0gc21hcnRBcHBMYXVuY2hVcmwgfHwgREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIO1xuICBlbHMuZGFzaGJvYXJkTGluay5ocmVmID0gZWxzLmJhY2tlbmRVcmwudmFsdWUucmVwbGFjZSgvOjgwMTAuKiQvLCBcIjozMDEwXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUGF0aWVudCBvdmVycmlkZSAobWFudWFsIE5ISSBpZGVudGl0eSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIGRvZXNuJ3QgZXhwb3NlIHRoZSB1c2VyJ3MgbmF0aW9uYWwgSUQgaW4gdGhlIFVSTC4gVGhlIHVzZXJcbi8vIGZpbGxzIHRoZXNlIG9uY2UgYW5kIHRoZXkncmUgc2VudCB3aXRoIGV2ZXJ5IHVwbG9hZCBjYWxsIHVudGlsIGNsZWFyZWQuXG5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRQYXRpZW50T3ZlcnJpZGUoKSB7XG4gIGNvbnN0IHsgcGF0aWVudE92ZXJyaWRlIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChcInBhdGllbnRPdmVycmlkZVwiKTtcbiAgaWYgKHBhdGllbnRPdmVycmlkZSkge1xuICAgIGVscy5vdklkTm8udmFsdWUgPSBwYXRpZW50T3ZlcnJpZGUuaWRfbm8gfHwgXCJcIjtcbiAgICBlbHMub3ZOYW1lLnZhbHVlID0gcGF0aWVudE92ZXJyaWRlLm5hbWUgfHwgXCJcIjtcbiAgICBlbHMub3ZCaXJ0aERhdGUudmFsdWUgPSBwYXRpZW50T3ZlcnJpZGUuYmlydGhfZGF0ZSB8fCBcIlwiO1xuICAgIGVscy5vdkdlbmRlci52YWx1ZSA9IHBhdGllbnRPdmVycmlkZS5nZW5kZXIgfHwgXCJcIjtcbiAgfVxuICAvLyBGaXJzdC10aW1lIFVYOiBpZiBubyBpZF9ubyBpcyBzdG9yZWQsIGF1dG8tZXhwYW5kIHRoZSBwYXRpZW50LWRhdGFcbiAgLy8gZGV0YWlscyBzbyB0aGUgdXNlciBpbW1lZGlhdGVseSBzZWVzIHRoZSByZXF1aXJlZCBmaWVsZHMuIE9uY2VcbiAgLy8gdGhleSd2ZSBzYXZlZCBhIHZhbHVlLCBkZWZhdWx0IHRvIGNvbGxhcHNlZC5cbiAgaWYgKGVscy5wYXRpZW50T3ZlcnJpZGVEZXRhaWxzKSB7XG4gICAgZWxzLnBhdGllbnRPdmVycmlkZURldGFpbHMub3BlbiA9ICFwYXRpZW50T3ZlcnJpZGU/LmlkX25vO1xuICB9XG4gIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkoKTtcbn1cblxuZnVuY3Rpb24gZ2V0UGF0aWVudE92ZXJyaWRlKCkge1xuICAvLyBSZXR1cm5zIHtpZF9ubywgbmFtZSwgYmlydGhfZGF0ZSwgZ2VuZGVyfSBvbmx5IGlmIGlkX25vIGhhcyBhIHZhbHVlLlxuICAvLyBCYWNrZW5kIHRyZWF0cyBpZF9ubyBhcyB0aGUgdHJpZ2dlciBcdTIwMTQgd2l0aG91dCBpdCwgb3ZlcnJpZGUgaXMgaWdub3JlZC5cbiAgY29uc3QgaWRfbm8gPSBlbHMub3ZJZE5vLnZhbHVlLnRyaW0oKTtcbiAgaWYgKCFpZF9ubykgcmV0dXJuIG51bGw7XG4gIGNvbnN0IG91dCA9IHsgaWRfbm8gfTtcbiAgY29uc3QgbmFtZSA9IGVscy5vdk5hbWUudmFsdWUudHJpbSgpO1xuICBjb25zdCBiaXJ0aF9kYXRlID0gZWxzLm92QmlydGhEYXRlLnZhbHVlLnRyaW0oKTtcbiAgY29uc3QgZ2VuZGVyID0gZWxzLm92R2VuZGVyLnZhbHVlO1xuICBpZiAobmFtZSkgb3V0Lm5hbWUgPSBuYW1lO1xuICBpZiAoYmlydGhfZGF0ZSkgb3V0LmJpcnRoX2RhdGUgPSBiaXJ0aF9kYXRlO1xuICBpZiAoZ2VuZGVyKSBvdXQuZ2VuZGVyID0gZ2VuZGVyO1xuICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCkge1xuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBjb25zdCBjYXJkID0gZWxzLnBhdGllbnRPdmVycmlkZURldGFpbHM7XG4gIGlmICghb3YpIHtcbiAgICBlbHMub3ZTdW1tYXJ5LnRleHRDb250ZW50ID0gXCJcdTY3MkFcdThBMkRcdTVCOUFcIjtcbiAgICBpZiAoY2FyZCkgY2FyZC5kYXRhc2V0LnN0YXRlID0gXCJlbXB0eVwiO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHBhcnRzID0gW292LmlkX25vXTtcbiAgICBpZiAob3YubmFtZSkgcGFydHMucHVzaChvdi5uYW1lKTtcbiAgICBlbHMub3ZTdW1tYXJ5LnRleHRDb250ZW50ID0gYFx1MjcxMyAke3BhcnRzLmpvaW4oXCIgIFx1MDBCNyAgXCIpfWA7XG4gICAgaWYgKGNhcmQpIGNhcmQuZGF0YXNldC5zdGF0ZSA9IFwiZmlsbGVkXCI7XG4gIH1cbiAgLy8gQm90aCBsYXVuY2ggKyBzeW5jIGVuYWJsZWQgc3RhdGUgZGVwZW5kIG9uIHBhdGllbnQgKyBtb2RlICsgY29ubi5cbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2F2ZVBhdGllbnRPdmVycmlkZSgpIHtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgaWYgKCFvdikge1xuICAgIHNldFN0YXR1cyhcIlx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1Rlx1NzBCQVx1NUZDNVx1NTg2QlwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHBhdGllbnRPdmVycmlkZTogb3YgfSk7XG4gIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkoKTtcbiAgaWYgKGVscy5wYXRpZW50T3ZlcnJpZGVEZXRhaWxzKSBlbHMucGF0aWVudE92ZXJyaWRlRGV0YWlscy5vcGVuID0gZmFsc2U7XG4gIHNldFN0YXR1cyhgXHUyNzA1IFx1NURGMlx1NTEzMlx1NUI1OFx1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVx1RkYxQSR7b3YuaWRfbm99JHtvdi5uYW1lID8gYCAoJHtvdi5uYW1lfSlgIDogXCJcIn1gLCBcInN1Y2Nlc3NcIik7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNsZWFyUGF0aWVudE92ZXJyaWRlKCkge1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLnJlbW92ZShcInBhdGllbnRPdmVycmlkZVwiKTtcbiAgZWxzLm92SWROby52YWx1ZSA9IFwiXCI7XG4gIGVscy5vdk5hbWUudmFsdWUgPSBcIlwiO1xuICBlbHMub3ZCaXJ0aERhdGUudmFsdWUgPSBcIlwiO1xuICBlbHMub3ZHZW5kZXIudmFsdWUgPSBcIlwiO1xuICByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCk7XG4gIGlmIChlbHMucGF0aWVudE92ZXJyaWRlRGV0YWlscykgZWxzLnBhdGllbnRPdmVycmlkZURldGFpbHMub3BlbiA9IHRydWU7XG4gIHNldFN0YXR1cyhcIlx1NURGMlx1NkUwNVx1OTY2NFx1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVwiLCBcImluZm9cIik7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBCYWNrZW5kIGNvbm5lY3Rpb24gc3RhdGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gU2luZ2xlIHNvdXJjZSBvZiB0cnV0aDogYF9jb25uU3RhdGVgIHJlZmxlY3RzIHRoZSBsYXRlc3QgYmFja2VuZFxuLy8gY29ubmVjdGl2aXR5IGNoZWNrLiBCb3RoIHRoZSBiYW5uZXIgVUkgYW5kIHRoZSBlbmFibGVkLXN0YXRlIG9mIHRoZVxuLy8gXHVEODNEXHVEQ0U1IFN5bmMgLyBcdUQ4M0RcdURFODAgTGF1bmNoIGJ1dHRvbnMgcmVhZCBmcm9tIGl0LlxuLy9cbi8vIFN0YXRlczpcbi8vICAgXCJ1bmtub3duXCIgIFx1MjAxNCBub3QgeWV0IGNoZWNrZWQgKGUuZy4gZmlyc3QgcGFpbnQgaW4gbG9jYWwgbW9kZSlcbi8vICAgXCJjaGVja2luZ1wiIFx1MjAxNCBmZXRjaCBpbiBmbGlnaHRcbi8vICAgXCJva1wiICAgICAgIFx1MjAxNCBHRVQgL2ZoaXIvbWV0YWRhdGEgcmV0dXJuZWQgYSBGSElSIENhcGFiaWxpdHlTdGF0ZW1lbnRcbi8vICAgXCJmYWlsXCIgICAgIFx1MjAxNCBhbnl0aGluZyBlbHNlOyBgX2Nvbm5GYWlsUmVhc29uYCBjYXJyaWVzIGRldGFpbFxuLy9cbi8vIEJhY2tlbmQgY29ubmVjdGl2aXR5IGlzIHRyZWF0ZWQgYXMgYSAqcHJlcmVxdWlzaXRlKiBmb3IgYmFja2VuZCBtb2RlLFxuLy8gbm90IGFzIGEgcGVyLWFjdGlvbiBjaGVjay4gU3dpdGNoaW5nIHRvIGJhY2tlbmQgbW9kZSB0cmlnZ2VycyBhIHRlc3Rcbi8vIGltbWVkaWF0ZWx5OyBmYWlsdXJlIHNob3dzIGEgYmFubmVyIHdpdGggYWN0aW9uYWJsZSBndWlkYW5jZSBhbmRcbi8vIGRpc2FibGVzIGJvdGggYWN0aW9uIGJ1dHRvbnMgdW50aWwgY29ubmVjdGl2aXR5IHJlY292ZXJzLlxuXG5sZXQgX2Nvbm5TdGF0ZSA9IFwidW5rbm93blwiO1xubGV0IF9jb25uRmFpbFJlYXNvbiA9IG51bGw7IC8vIHsga2luZDogXCJuby1wZXJtaXNzaW9uXCIgfCBcIm5vLXVybFwiIHwgXCJuZXR3b3JrXCIgfCBcInRpbWVvdXRcIiB8IFwiaHR0cFwiIHwgXCJub3QtZmhpclwiLCBkZXRhaWw/IH1cblxuY29uc3QgX0NPTk5fTEFCRUxTID0ge1xuICB1bmtub3duOiBcIlx1NjcyQVx1NkFBMlx1NkUyQ1wiLFxuICBjaGVja2luZzogXCJcdTZBQTJcdTZFMkNcdTRFMkRcdTIwMjZcIixcbiAgb2s6ICgpID0+IGBcdTVERjJcdTkwMjNcdTdEREEgXHUyMDE0ICR7ZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpfWAsXG4gIGZhaWw6ICgpID0+IHtcbiAgICBjb25zdCByID0gX2Nvbm5GYWlsUmVhc29uIHx8IHt9O1xuICAgIHJldHVybiAoe1xuICAgICAgXCJuby11cmxcIjogXCJcdTI3MTcgXHU2NzJBXHU4QTJEXHU1QjlBIEJhY2tlbmQgVVJMXCIsXG4gICAgICBcIm5vLXBlcm1pc3Npb25cIjogXCJcdTI3MTcgXHU2NzJBXHU2Mzg4XHU2QjBBXHU5MDIzXHU3RERBXCIsXG4gICAgICBcIm5ldHdvcmtcIjogXCJcdTI3MTcgXHU5MDIzXHU0RTBEXHU0RTBBXHU1RjhDXHU3QUVGXCIsXG4gICAgICBcInRpbWVvdXRcIjogXCJcdTI3MTcgXHU5MDIzXHU3RERBXHU5MDNFXHU2NjQyXCIsXG4gICAgICBcImh0dHBcIjogYFx1MjcxNyBIVFRQICR7ci5kZXRhaWwgfHwgXCJcIn1gLnRyaW0oKSxcbiAgICAgIFwibm90LWZoaXJcIjogXCJcdTI3MTcgXHU1NkRFXHU2MUM5XHU0RTBEXHU2NjJGIEZISVJcIixcbiAgICB9KVtyLmtpbmRdID8/IFwiXHUyNzE3IFx1OTAyM1x1N0REQVx1NTkzMVx1NjU1N1wiO1xuICB9LFxufTtcblxuY29uc3QgX0NPTk5fSEVMUCA9IHtcbiAgXCJuby11cmxcIjogICAgICAgIFwiXHU4QUNCXHU1MjMwXHUzMDBDXHU5MDMyXHU5NjhFXHU4QTJEXHU1QjlBXHUzMDBEXHU1ODZCXHU1MTY1IEJhY2tlbmQgVVJMXHVGRjBDXHU0RjhCXHU1OTgyIDxjb2RlPmh0dHA6Ly9sb2NhbGhvc3Q6ODAxMDwvY29kZT5cdTMwMDJcIixcbiAgXCJuby1wZXJtaXNzaW9uXCI6IFwiQ2hyb21lIFx1OTYzQlx1NjRDQlx1NEU4Nlx1OERFOFx1NEY4Nlx1NkU5MFx1OEFDQlx1NkM0Mlx1MzAwMlx1OEFDQlx1OTFDRFx1NjVCMFx1OTU4QiBwb3B1cFx1RkYwQ1x1NzU3Nlx1NkIwQVx1OTY1MFx1NUMwRFx1OEE3MVx1Njg0Nlx1OERGM1x1NTFGQVx1NjY0Mlx1NjMwOVx1MzAwQ1x1NTE0MVx1OEEzMVx1MzAwRFx1MzAwMlwiLFxuICBcIm5ldHdvcmtcIjogICAgICAgXCJcdTVGOENcdTdBRUZcdTUzRUZcdTgwRkRcdTkwODRcdTZDOTJcdTU1NUZcdTUyRDVcdTMwMDJcdThBQ0JcdTU3RjdcdTg4NENcdUZGMUE8YnI+PGNvZGU+ZG9ja2VyIGNvbXBvc2UgdXAgLWQ8L2NvZGU+PGJyPlx1NzhCQVx1OEE4RCBiYWNrZW5kIFx1NUJCOVx1NTY2OFx1OEREMVx1OEQ3N1x1NEY4Nlx1NTE4RFx1OTFDRFx1OEE2Nlx1MzAwMlwiLFxuICBcInRpbWVvdXRcIjogICAgICAgXCI1IFx1NzlEMlx1NTE2N1x1NkM5Mlx1NjUzNlx1NTIzMFx1NTZERVx1NjFDOSBcdTIwMTQgYmFja2VuZCBcdTUzRUZcdTgwRkRcdTkwODRcdTU3MjhcdTU1NUZcdTUyRDVcdTRFMkRcdUZGMENcdTdCNDkgMzAgXHU3OUQyXHU1MThEXHU2MzA5XHU5MUNEXHU4QTY2XHUzMDAyXCIsXG4gIFwiaHR0cFwiOiAgICAgICAgICBcIkJhY2tlbmQgXHU1NkRFXHU2MUM5XHU5MzJGXHU4QUE0XHU3MkMwXHU2MTRCXHU3OEJDXHUzMDAyXHU2QUEyXHU2N0U1IGJhY2tlbmQgXHU3Njg0IGxvZ1x1RkYxQTxicj48Y29kZT5kb2NrZXIgY29tcG9zZSBsb2dzIGJhY2tlbmQ8L2NvZGU+XCIsXG4gIFwibm90LWZoaXJcIjogICAgICBcIlx1OTAxOVx1NTAwQiBVUkwgXHU1NkRFXHU0RTg2XHU2NzcxXHU4OTdGXHVGRjBDXHU0RjQ2XHU0RTBEXHU2NjJGIEZISVIgQ2FwYWJpbGl0eVN0YXRlbWVudFx1MzAwMlx1NzhCQVx1OEE4RCBCYWNrZW5kIFVSTCBcdTYzMDdcdTU0MTEgTkhJLUZISVItQnJpZGdlIFx1NzY4NCAvZmhpciBcdTY4MzlcdTc2RUVcdTkzMDRcdTMwMDJcIixcbn07XG5cbmZ1bmN0aW9uIF9yZW5kZXJDb25uQmFubmVyKCkge1xuICBjb25zdCBiYW5uZXIgPSBlbHMuY29ubkJhbm5lcjtcbiAgaWYgKCFiYW5uZXIpIHJldHVybjtcbiAgYmFubmVyLmRhdGFzZXQuc3RhdGUgPSBfY29ublN0YXRlO1xuICBjb25zdCBsYWJlbCA9IF9DT05OX0xBQkVMU1tfY29ublN0YXRlXTtcbiAgZWxzLmNvbm5Nc2cudGV4dENvbnRlbnQgPSB0eXBlb2YgbGFiZWwgPT09IFwiZnVuY3Rpb25cIiA/IGxhYmVsKCkgOiBsYWJlbDtcbiAgZWxzLmNvbm5SZXRyeUJ0bi5oaWRkZW4gPSBfY29ublN0YXRlICE9PSBcImZhaWxcIjtcbiAgaWYgKF9jb25uU3RhdGUgPT09IFwiZmFpbFwiICYmIF9jb25uRmFpbFJlYXNvbj8ua2luZCkge1xuICAgIGVscy5jb25uSGVscC5oaWRkZW4gPSBmYWxzZTtcbiAgICBlbHMuY29ubkhlbHAuaW5uZXJIVE1MID0gX0NPTk5fSEVMUFtfY29ubkZhaWxSZWFzb24ua2luZF0gPz8gXCJcIjtcbiAgfSBlbHNlIHtcbiAgICBlbHMuY29ubkhlbHAuaGlkZGVuID0gdHJ1ZTtcbiAgICBlbHMuY29ubkhlbHAuaW5uZXJIVE1MID0gXCJcIjtcbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVmcmVzaEJ1dHRvblN0YXRlcygpIHtcbiAgLy8gU3luYyBidXR0b246IE5ISSB0YWIgcmVxdWlyZWQgKHNldCBlbHNld2hlcmUgdmlhIHN5bmNBcGlCdG4uZGlzYWJsZWQpLlxuICAvLyBJbiBiYWNrZW5kIG1vZGUsIGFkZGl0aW9uYWxseSByZXF1aXJlIGNvbm4gPT09IG9rLlxuICAvLyBJbiBsb2NhbCBtb2RlLCBjb25uIGRvZXNuJ3QgYXBwbHkuXG4gIGNvbnN0IG9uTmhpID0gIWVscy5zeW5jQXBpQnRuLmRhdGFzZXQub2ZmTmhpO1xuICBjb25zdCBtb2RlT2sgPSBjdXJyZW50TW9kZSgpID09PSBcImxvY2FsXCIgfHwgX2Nvbm5TdGF0ZSA9PT0gXCJva1wiO1xuICBlbHMuc3luY0FwaUJ0bi5kaXNhYmxlZCA9ICEob25OaGkgJiYgbW9kZU9rKTtcbiAgZWxzLnN5bmNBcGlCdG4udGl0bGUgPSAhb25OaGlcbiAgICA/IFwiXHU4QUNCXHU1MTQ4XHU1MjA3XHU1MjMwXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU1MjA2XHU5ODAxXHU1MThEXHU1NDBDXHU2QjY1XCJcbiAgICA6ICghbW9kZU9rID8gXCJcdTVGOENcdTdBRUZcdTVDMUFcdTY3MkFcdTkwMjNcdTdEREFcIiA6IFwiXCIpO1xuXG4gIC8vIExhdW5jaCBidXR0b246IGJhY2tlbmQgbW9kZSArIGNvbm4gb2sgKyBwYXRpZW50IHNldC5cbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgZWxzLmxhdW5jaEJ0bi5kaXNhYmxlZCA9ICEoY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIgJiYgX2Nvbm5TdGF0ZSA9PT0gXCJva1wiICYmICEhb3Y/LmlkX25vKTtcbiAgZWxzLmxhdW5jaEJ0bi50aXRsZSA9IGN1cnJlbnRNb2RlKCkgIT09IFwiYmFja2VuZFwiXG4gICAgPyBcIlx1OEFDQlx1NTIwN1x1NTIzMFx1MzAwQ1x1NEUwQVx1NTBCM1x1NUY4Q1x1N0FFRlx1MzAwRFx1NkEyMVx1NUYwRlwiXG4gICAgOiAoX2Nvbm5TdGF0ZSAhPT0gXCJva1wiID8gXCJcdTVGOENcdTdBRUZcdTVDMUFcdTY3MkFcdTkwMjNcdTdEREFcIiA6ICghb3Y/LmlkX25vID8gXCJcdThBQ0JcdTUxNDhcdTU4NkJcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTlcIiA6IFwiXCIpKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdGVzdEJhY2tlbmRDb25uZWN0aW9uKCkge1xuICBjb25zdCB1cmwgPSBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCk7XG4gIGlmICghdXJsKSB7XG4gICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwibm8tdXJsXCIgfTtcbiAgICBfcmVuZGVyQ29ubkJhbm5lcigpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpOyByZXR1cm4gZmFsc2U7XG4gIH1cbiAgX2Nvbm5TdGF0ZSA9IFwiY2hlY2tpbmdcIjsgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDtcbiAgX3JlbmRlckNvbm5CYW5uZXIoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcblxuICBjb25zdCBwZXJtID0gYXdhaXQgZW5zdXJlQmFja2VuZFBlcm1pc3Npb24odXJsKTtcbiAgaWYgKCFwZXJtLm9rKSB7XG4gICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwibm8tcGVybWlzc2lvblwiIH07XG4gICAgX3JlbmRlckNvbm5CYW5uZXIoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTsgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgY3RybCA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IGN0cmwuYWJvcnQoKSwgNTAwMCk7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYCR7dXJsLnJlcGxhY2UoL1xcLyQvLCBcIlwiKX0vZmhpci9tZXRhZGF0YWAsIHsgc2lnbmFsOiBjdHJsLnNpZ25hbCB9KTtcbiAgICBpZiAoIXJlcy5vaykge1xuICAgICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwiaHR0cFwiLCBkZXRhaWw6IHJlcy5zdGF0dXMgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcy5qc29uKCkuY2F0Y2goKCkgPT4gbnVsbCk7XG4gICAgICBpZiAoYm9keT8ucmVzb3VyY2VUeXBlICE9PSBcIkNhcGFiaWxpdHlTdGF0ZW1lbnRcIikge1xuICAgICAgICBfY29ublN0YXRlID0gXCJmYWlsXCI7IF9jb25uRmFpbFJlYXNvbiA9IHsga2luZDogXCJub3QtZmhpclwiIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfY29ublN0YXRlID0gXCJva1wiOyBfY29ubkZhaWxSZWFzb24gPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIF9jb25uU3RhdGUgPSBcImZhaWxcIjtcbiAgICBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgPyBcInRpbWVvdXRcIiA6IFwibmV0d29ya1wiIH07XG4gIH0gZmluYWxseSB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgfVxuXG4gIF9yZW5kZXJDb25uQmFubmVyKCk7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gIHJldHVybiBfY29ublN0YXRlID09PSBcIm9rXCI7XG59XG5cbmVscy5jb25uUmV0cnlCdG4/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0ZXN0QmFja2VuZENvbm5lY3Rpb24pO1xuXG4vLyBcdTI1MDBcdTI1MDAgU3luYyBtb2RlIChsb2NhbCB8IGJhY2tlbmQpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuYXN5bmMgZnVuY3Rpb24gbG9hZFN5bmNNb2RlKCkge1xuICBjb25zdCB7IHN5bmNNb2RlIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChcInN5bmNNb2RlXCIpO1xuICBjb25zdCBtb2RlID0gc3luY01vZGUgPT09IFwiYmFja2VuZFwiID8gXCJiYWNrZW5kXCIgOiBERUZBVUxUX01PREU7XG4gIGZvciAoY29uc3QgciBvZiBlbHMubW9kZVJhZGlvcygpKSByLmNoZWNrZWQgPSByLnZhbHVlID09PSBtb2RlO1xuICBkb2N1bWVudC5ib2R5LmRhdGFzZXQubW9kZSA9IG1vZGU7XG4gIGlmIChtb2RlID09PSBcImJhY2tlbmRcIikge1xuICAgIC8vIEF1dG8tdGVzdCBvbiBvcGVuIHNvIHRoZSB1c2VyIHNlZXMgc3RhdHVzIHdpdGhvdXQgY2xpY2tpbmcuIEF3YWl0aW5nXG4gICAgLy8gaGVyZSBzZXJpYWxpemVzIHRoZSByZXN0IG9mIGluaXQoKSB1bnRpbCB3ZSBrbm93IHRoZSBhbnN3ZXIuXG4gICAgYXdhaXQgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCk7XG4gIH0gZWxzZSB7XG4gICAgX2Nvbm5TdGF0ZSA9IFwidW5rbm93blwiOyBfY29ubkZhaWxSZWFzb24gPSBudWxsO1xuICAgIF9yZW5kZXJDb25uQmFubmVyKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3VycmVudE1vZGUoKSB7XG4gIGZvciAoY29uc3QgciBvZiBlbHMubW9kZVJhZGlvcygpKSBpZiAoci5jaGVja2VkKSByZXR1cm4gci52YWx1ZTtcbiAgcmV0dXJuIERFRkFVTFRfTU9ERTtcbn1cblxuZm9yIChjb25zdCByIG9mIGVscy5tb2RlUmFkaW9zKCkpIHtcbiAgci5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgICBjb25zdCBtb2RlID0gY3VycmVudE1vZGUoKTtcbiAgICBkb2N1bWVudC5ib2R5LmRhdGFzZXQubW9kZSA9IG1vZGU7XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBzeW5jTW9kZTogbW9kZSB9KTtcbiAgICBpZiAobW9kZSA9PT0gXCJiYWNrZW5kXCIpIHtcbiAgICAgIHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBfY29ublN0YXRlID0gXCJ1bmtub3duXCI7IF9jb25uRmFpbFJlYXNvbiA9IG51bGw7XG4gICAgICBfcmVuZGVyQ29ubkJhbm5lcigpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgIH1cbiAgfSk7XG59XG5cbmVscy5iYWNrZW5kVXJsLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IGJhY2tlbmRVcmw6IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKSB9KTtcbiAgZWxzLmRhc2hib2FyZExpbmsuaHJlZiA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnJlcGxhY2UoLzo4MDEwLiokLywgXCI6MzAxMFwiKTtcbiAgaWYgKGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiKSB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKTtcbn0pO1xuZWxzLnN5bmNBcGlLZXkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgc3luY0FwaUtleTogZWxzLnN5bmNBcGlLZXkudmFsdWUudHJpbSgpIH0pO1xufSk7XG5lbHMuc21hcnRBcHBVcmwuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gIC8vIFBlcnNpc3QgdHJpbW1lZCB2YWx1ZS4gRW1wdHkgc3RyaW5nIFx1MjE5MiByZXN0b3JlIGRlZmF1bHQgb24gbmV4dCBsb2FkLlxuICBjb25zdCB2ID0gZWxzLnNtYXJ0QXBwVXJsLnZhbHVlLnRyaW0oKTtcbiAgaWYgKHYpIHtcbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHNtYXJ0QXBwTGF1bmNoVXJsOiB2IH0pO1xuICB9IGVsc2Uge1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMucmVtb3ZlKFwic21hcnRBcHBMYXVuY2hVcmxcIik7XG4gICAgZWxzLnNtYXJ0QXBwVXJsLnZhbHVlID0gREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIO1xuICB9XG59KTtcblxuZnVuY3Rpb24gc2V0U3RhdHVzKHRleHQsIGtpbmQsIGJyZWFrZG93bikge1xuICAvLyBCdWlsZCB3aXRoIERPTSBBUEkgXHUyMDE0IGF2b2lkcyBpbm5lckhUTUwgLyBYU1Mgcmlzay5cbiAgLy8gYnJlYWtkb3duIGlzIGFuIGFycmF5IG9mIG1peGVkIGVudHJpZXM6XG4gIC8vICAgLSBwaGFzZSB0aW1pbmdzIHByZWZpeGVkIHdpdGggXCJcdTIzRjFcIiAgXHUyMTkyIFx1OTY4RVx1NkJCNVx1ODAxN1x1NjY0MlxuICAvLyAgIC0gcGVyLWVuZHBvaW50IGNvdW50cyAgICAgICAgICAgICAgICBcdTIxOTIgXHU1NDA0IGVuZHBvaW50IFx1NjI5M1x1NTIzMFx1NUU3RVx1N0I0NlxuICAvLyBCb3RoIGtpbmRzIGFyZSB0dWNrZWQgaW5zaWRlIGEgc2luZ2xlIFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCIgdG9nZ2xlIHNvIHRoZVxuICAvLyBwb3B1cCBzdGF5cyBjb21wYWN0IGJ5IGRlZmF1bHQuXG4gIGVscy5zdGF0dXMuY2xhc3NOYW1lID0ga2luZCB8fCBcIlwiO1xuICBlbHMuc3RhdHVzLnRleHRDb250ZW50ID0gXCJcIjtcbiAgaWYgKCF0ZXh0ICYmICEoYnJlYWtkb3duICYmIGJyZWFrZG93bi5sZW5ndGgpKSByZXR1cm47XG4gIGVscy5zdGF0dXMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCB8fCBcIlwiKSk7XG4gIGlmIChicmVha2Rvd24gJiYgYnJlYWtkb3duLmxlbmd0aCkge1xuICAgIGNvbnN0IHBoYXNlUm93cyA9IGJyZWFrZG93bi5maWx0ZXIoKGIpID0+IGIuc3RhcnRzV2l0aChcIlx1MjNGMVwiKSk7XG4gICAgY29uc3Qgb3RoZXJSb3dzID0gYnJlYWtkb3duLmZpbHRlcigoYikgPT4gIWIuc3RhcnRzV2l0aChcIlx1MjNGMVwiKSk7XG5cbiAgICBjb25zdCBkZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRldGFpbHNcIik7XG4gICAgZGV0YWlscy5jbGFzc05hbWUgPSBcInN0YXR1cy1kZXRhaWxcIjtcbiAgICBjb25zdCBzdW1tYXJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN1bW1hcnlcIik7XG4gICAgc3VtbWFyeS50ZXh0Q29udGVudCA9IFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCI7XG4gICAgZGV0YWlscy5hcHBlbmRDaGlsZChzdW1tYXJ5KTtcblxuICAgIGlmIChwaGFzZVJvd3MubGVuZ3RoKSB7XG4gICAgICBjb25zdCBwaGFzZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgcGhhc2VzLmNsYXNzTmFtZSA9IFwic3RhdHVzLXBoYXNlc1wiO1xuICAgICAgcGhhc2VzLnRleHRDb250ZW50ID0gcGhhc2VSb3dzLm1hcCgocCkgPT4gcC5yZXBsYWNlKC9eXHUyM0YxXFxzKi8sIFwiXCIpKS5qb2luKFwiIFx1MDBCNyBcIik7XG4gICAgICBkZXRhaWxzLmFwcGVuZENoaWxkKHBoYXNlcyk7XG4gICAgfVxuICAgIGlmIChvdGhlclJvd3MubGVuZ3RoKSB7XG4gICAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGJvZHkuY2xhc3NOYW1lID0gXCJzdGF0dXMtYnJlYWtkb3duXCI7XG4gICAgICBib2R5LnRleHRDb250ZW50ID0gb3RoZXJSb3dzLmpvaW4oXCIgXHUwMEI3IFwiKTtcbiAgICAgIGRldGFpbHMuYXBwZW5kQ2hpbGQoYm9keSk7XG4gICAgfVxuICAgIGVscy5zdGF0dXMuYXBwZW5kQ2hpbGQoZGV0YWlscyk7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QWN0aXZlVGFiKCkge1xuICBjb25zdCBbdGFiXSA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0pO1xuICByZXR1cm4gdGFiO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUGVuZGluZyBGSElSIEJ1bmRsZSAobG9jYWwtbW9kZSByZXN1bHQpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIEJhY2tncm91bmQgc3Rhc2hlcyB0aGUgZ2VuZXJhdGVkIEJ1bmRsZSBpbnRvIGNocm9tZS5zdG9yYWdlLmxvY2FsXG4vLyB1bmRlciBgcGVuZGluZ0ZoaXJCdW5kbGVgLiBQb3B1cCByZW5kZXJzIGEgZG93bmxvYWQgYnV0dG9uLiBVc2VyIG11c3Rcbi8vIGNsaWNrIHRvIGFjdHVhbGx5IHRyaWdnZXIgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCBcdTIwMTQgdGhlIGZpbGUgbmV2ZXJcbi8vIGhpdHMgdGhlIGRpc2sgdW5zb2xpY2l0ZWQuXG5cbmZ1bmN0aW9uIF9mbXRCeXRlcyhuKSB7XG4gIGlmIChuIDwgMTAyNCkgcmV0dXJuIGAke259IEJgO1xuICBpZiAobiA8IDEwMjQgKiAxMDI0KSByZXR1cm4gYCR7KG4gLyAxMDI0KS50b0ZpeGVkKDEpfSBLQmA7XG4gIHJldHVybiBgJHsobiAvICgxMDI0ICogMTAyNCkpLnRvRml4ZWQoMil9IE1CYDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVmcmVzaFBlbmRpbmdCdW5kbGUoKSB7XG4gIGNvbnN0IHsgW1BFTkRJTkdfQlVORExFX0tFWV06IHBlbmRpbmcgfSA9XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFBFTkRJTkdfQlVORExFX0tFWSk7XG4gIGlmICghcGVuZGluZyB8fCAhcGVuZGluZy5qc29uKSB7XG4gICAgZWxzLnBlbmRpbmdCdW5kbGUuaGlkZGVuID0gdHJ1ZTtcbiAgICByZXR1cm47XG4gIH1cbiAgZWxzLnBlbmRpbmdCdW5kbGUuaGlkZGVuID0gZmFsc2U7XG4gIGNvbnN0IGFnbyA9IHBlbmRpbmcuZ2VuZXJhdGVkQXRcbiAgICA/IGAke01hdGgubWF4KDEsIE1hdGgucm91bmQoKERhdGUubm93KCkgLSBwZW5kaW5nLmdlbmVyYXRlZEF0KSAvIDEwMDApKX0gXHU3OUQyXHU1MjREYFxuICAgIDogXCJcIjtcbiAgZWxzLmJ1bmRsZU1ldGEudGV4dENvbnRlbnQgPSBgJHtwZW5kaW5nLmZpbGVuYW1lfSBcdTAwQjcgJHtfZm10Qnl0ZXMocGVuZGluZy5ieXRlcyB8fCAwKX0ke2FnbyA/IGAgXHUwMEI3ICR7YWdvfWAgOiBcIlwifWA7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGRvd25sb2FkUGVuZGluZ0J1bmRsZSgpIHtcbiAgY29uc3QgeyBbUEVORElOR19CVU5ETEVfS0VZXTogcGVuZGluZyB9ID1cbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoUEVORElOR19CVU5ETEVfS0VZKTtcbiAgaWYgKCFwZW5kaW5nKSByZXR1cm47XG4gIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbcGVuZGluZy5qc29uXSwgeyB0eXBlOiBcImFwcGxpY2F0aW9uL2ZoaXIranNvblwiIH0pO1xuICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICB0cnkge1xuICAgIGF3YWl0IGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQoeyB1cmwsIGZpbGVuYW1lOiBwZW5kaW5nLmZpbGVuYW1lLCBzYXZlQXM6IGZhbHNlIH0pO1xuICB9IGZpbmFsbHkge1xuICAgIC8vIFJlbGVhc2UgYWZ0ZXIgYSB0aWNrIHNvIHRoZSBkb3dubG9hZCBoYXMgdGltZSB0byBzdGFydC5cbiAgICBzZXRUaW1lb3V0KCgpID0+IFVSTC5yZXZva2VPYmplY3RVUkwodXJsKSwgNTAwMCk7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gY2xlYXJQZW5kaW5nQnVuZGxlKCkge1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5yZW1vdmUoUEVORElOR19CVU5ETEVfS0VZKTtcbiAgYXdhaXQgcmVmcmVzaFBlbmRpbmdCdW5kbGUoKTtcbn1cblxuZWxzLmRvd25sb2FkQnVuZGxlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBkb3dubG9hZFBlbmRpbmdCdW5kbGUpO1xuZWxzLmNsZWFyQnVuZGxlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGVhclBlbmRpbmdCdW5kbGUpO1xuXG4vLyBMaXZlIHVwZGF0ZSB3aGVuIGJhY2tncm91bmQgc3Rhc2hlcyBhIG5ldyBidW5kbGUgd2hpbGUgcG9wdXAgaXMgb3Blbi5cbmNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlcywgYXJlYSkgPT4ge1xuICBpZiAoYXJlYSA9PT0gXCJsb2NhbFwiICYmIFBFTkRJTkdfQlVORExFX0tFWSBpbiBjaGFuZ2VzKSByZWZyZXNoUGVuZGluZ0J1bmRsZSgpO1xufSk7XG5cbmFzeW5jIGZ1bmN0aW9uIGluaXQoKSB7XG4gIC8vIE9yZGVyIG1hdHRlcnM6IGxvYWRCYWNrZW5kVXJsIHBvcHVsYXRlcyBlbHMuYmFja2VuZFVybC52YWx1ZSwgd2hpY2hcbiAgLy8gbG9hZFN5bmNNb2RlKCkgcmVhZHMgdmlhIHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpLiBSZXZlcnNlIHRoaXMgYW5kXG4gIC8vIHRoZSBhdXRvLXRlc3Qgc2VlcyBhbiBlbXB0eSBVUkwgYW5kIGZhbHNlbHkgcmVwb3J0cyBcIlx1NjcyQVx1OEEyRFx1NUI5QSBCYWNrZW5kIFVSTFwiXG4gIC8vIG9uIGV2ZXJ5IHBvcHVwIG9wZW4uXG4gIGF3YWl0IGxvYWRCYWNrZW5kVXJsKCk7XG4gIGF3YWl0IGxvYWRTeW5jTW9kZSgpO1xuICBhd2FpdCBsb2FkUGF0aWVudE92ZXJyaWRlKCk7XG4gIGF3YWl0IHJlZnJlc2hQZW5kaW5nQnVuZGxlKCk7XG5cbiAgY29uc3QgdGFiID0gYXdhaXQgZ2V0QWN0aXZlVGFiKCk7XG4gIGlmICghdGFiPy51cmwpIHtcbiAgICBzZXRTdGF0dXMoXCJubyBhY3RpdmUgdGFiXCIsIFwiZXJyb3JcIik7XG4gICAgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGkgPSBcIjFcIjtcbiAgICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFN5bmMgcmVxdWlyZXMgYmVpbmcgb24gYW4gTkhJIHRhYiBzbyBjb29raWVzL3Nlc3Npb24gYXJlIHVzYWJsZSBmcm9tXG4gIC8vIHRoZSBTVy4gRmxhZyB2aWEgZGF0YXNldCBzbyBfcmVmcmVzaEJ1dHRvblN0YXRlcyBjYW4gY29tYmluZSB0aGlzXG4gIC8vIHdpdGggdGhlIG1vZGUgKyBjb25uIHN0YXRlLlxuICBpZiAoaXNOaGlUYWIodGFiLnVybCkpIGRlbGV0ZSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm9mZk5oaTtcbiAgZWxzZSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm9mZk5oaSA9IFwiMVwiO1xuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuXG4gIC8vIFJlLWF0dGFjaCB0byBhbnkgc3luYyB0aGF0J3MgY3VycmVudGx5IHJ1bm5pbmcgaW4gdGhlIHNlcnZpY2Ugd29ya2VyLlxuICAvLyBUaGlzIGlzIHdoYXQgbGV0cyB0aGUgdXNlciBjbG9zZSArIHJlb3BlbiB0aGUgcG9wdXAgbWlkLXN5bmMuXG4gIGF3YWl0IHJlZnJlc2hTeW5jU3RhdHVzRnJvbUJhY2tncm91bmQoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVmcmVzaFN5bmNTdGF0dXNGcm9tQmFja2dyb3VuZCgpIHtcbiAgY29uc3Qgc3RhdHVzID0gYXdhaXQgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiBcImdldFN5bmNTdGF0dXNcIiB9KS5jYXRjaCgoKSA9PiBudWxsKTtcbiAgaWYgKCFzdGF0dXMpIHJldHVybjtcbiAgYXBwbHlTeW5jU3RhdHVzKHN0YXR1cyk7XG59XG5cbi8vIExhdGVzdCBzdGF0dXMgc25hcHNob3QgXHUyMDE0IGtlZXBpbmcgaXQgbGV0cyB0aGUgbGl2ZS1lbGFwc2VkIHRpY2tlclxuLy8gcmVwYWludCB0aGUgc2FtZSBwcm9ncmVzcyB0ZXh0IHdpdGggYW4gdXBkYXRlZCBgW05zXWAgcHJlZml4IGV2ZXJ5XG4vLyBzZWNvbmQgd2l0aG91dCBzcGFtbWluZyBjaHJvbWUuc3RvcmFnZSBmcm9tIHRoZSBzZXJ2aWNlIHdvcmtlci5cbmxldCBfbGF0ZXN0U3RhdHVzID0gbnVsbDtcbmxldCBfZWxhcHNlZFRpY2tlcklkID0gbnVsbDtcblxuZnVuY3Rpb24gX2ZtdEVsYXBzZWQobXMpIHtcbiAgaWYgKG1zIDwgNjBfMDAwKSByZXR1cm4gYCR7TWF0aC5mbG9vcihtcyAvIDEwMDApfXNgO1xuICByZXR1cm4gYCR7TWF0aC5mbG9vcihtcyAvIDYwXzAwMCl9bSR7TWF0aC5yb3VuZCgobXMgJSA2MF8wMDApIC8gMTAwMCl9c2A7XG59XG5cbmZ1bmN0aW9uIF9yZW5kZXJTdGF0dXMoKSB7XG4gIGNvbnN0IHN0YXR1cyA9IF9sYXRlc3RTdGF0dXM7XG4gIGlmICghc3RhdHVzKSByZXR1cm47XG4gIGxldCB0ZXh0ID0gc3RhdHVzLnByb2dyZXNzIHx8IFwiKHN5bmMgXHU5MDMyXHU4ODRDXHU0RTJEKVwiO1xuICBpZiAoc3RhdHVzLnJ1bm5pbmcgJiYgc3RhdHVzLnN0YXJ0ZWQpIHtcbiAgICBjb25zdCBlbGFwc2VkID0gRGF0ZS5ub3coKSAtIHN0YXR1cy5zdGFydGVkO1xuICAgIHRleHQgPSBgXHUyM0YxICR7X2ZtdEVsYXBzZWQoZWxhcHNlZCl9IFx1MDBCNyAke3RleHR9YDtcbiAgfVxuICBjb25zdCBraW5kID0gc3RhdHVzLnJ1bm5pbmcgPyBcImluZm9cIiA6IChzdGF0dXMucGhhc2UgPT09IFwiZXJyb3JcIiA/IFwiZXJyb3JcIiA6IFwic3VjY2Vzc1wiKTtcbiAgY29uc3QgYnJlYWtkb3duID0gc3RhdHVzLnJ1bm5pbmcgPyBudWxsIDogc3RhdHVzLmJyZWFrZG93bjtcbiAgc2V0U3RhdHVzKHRleHQsIGtpbmQsIGJyZWFrZG93bik7XG59XG5cbmZ1bmN0aW9uIGFwcGx5U3luY1N0YXR1cyhzdGF0dXMpIHtcbiAgaWYgKCFzdGF0dXMpIHJldHVybjtcbiAgX2xhdGVzdFN0YXR1cyA9IHN0YXR1cztcbiAgX3JlbmRlclN0YXR1cygpO1xuICBpZiAoc3RhdHVzLnJ1bm5pbmcpIHtcbiAgICBlbHMuc3luY0FwaUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgZWxzLnN0b3BCdG4uaGlkZGVuID0gZmFsc2U7XG4gICAgaWYgKCFfZWxhcHNlZFRpY2tlcklkKSB7XG4gICAgICBfZWxhcHNlZFRpY2tlcklkID0gc2V0SW50ZXJ2YWwoX3JlbmRlclN0YXR1cywgMTAwMCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGVscy5zdG9wQnRuLmhpZGRlbiA9IHRydWU7XG4gICAgaWYgKF9lbGFwc2VkVGlja2VySWQpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwoX2VsYXBzZWRUaWNrZXJJZCk7XG4gICAgICBfZWxhcHNlZFRpY2tlcklkID0gbnVsbDtcbiAgICB9XG4gICAgLy8gUmUtZGVyaXZlIHN5bmMgYnV0dG9uIGVuYWJsZWQgc3RhdGUgZnJvbSBtb2RlL2Nvbm4vTkhJLXRhYiBpbnN0ZWFkXG4gICAgLy8gb2YgdW5jb25kaXRpb25hbGx5IGVuYWJsaW5nIFx1MjAxNCBrZWVwcyB0aGUgYnV0dG9uIGRpc2FibGVkIHdoZW4gd2VcbiAgICAvLyBrbm93IHdlIHNob3VsZG4ndCBzeW5jIChlLmcuIGJhY2tlbmQgZG93biwgb2ZmLU5ISSB0YWIpLlxuICAgIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gIH1cbn1cblxuLy8gU3RvcCB0aGUgaW4tcHJvZ3Jlc3Mgc3luYy4gVHdvLXByb25nZWQgc28gaXQgd29ya3MgZXZlbiB3aGVuIHRoZVxuLy8gc2VydmljZSB3b3JrZXIgaGFzIGRpZWQ6ICgxKSB0ZWxsIHRoZSBTVyB0byBzZXQgaXRzIGNhbmNlbCBmbGFnLFxuLy8gKDIpIHdyaXRlIHN0b3JhZ2UgZGlyZWN0bHkgdG8gcnVubmluZzpmYWxzZSBzbyB0aGUgcG9wdXAgVUkgdW5mcmVlemVzXG4vLyBpbW1lZGlhdGVseSBldmVuIGlmIHRoZSBTVyBtZXNzYWdlIGNhbid0IGJlIGRlbGl2ZXJlZC5cbmFzeW5jIGZ1bmN0aW9uIHN0b3BTeW5jKCkge1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgIHN5bmNTdGF0dXM6IHtcbiAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgcHJvZ3Jlc3M6IFwiXHUyNkQ0IFx1NTA1Q1x1NkI2Mlx1NEUyRFx1RkYwQ1x1NkI2M1x1NTcyOFx1NkUwNVx1OTY2NFx1OTBFOFx1NTIwNlx1NTQwQ1x1NkI2NVx1OENDN1x1NjU5OVx1MjAyNlwiLFxuICAgICAgcGhhc2U6IFwiY2FuY2VsbGVkXCIsXG4gICAgICB0czogRGF0ZS5ub3coKSxcbiAgICAgIGNvbXBsZXRlZDogRGF0ZS5ub3coKSxcbiAgICB9LFxuICB9KTtcbiAgc2V0U3RhdHVzKFwiXHUyNkQ0IFx1NTA1Q1x1NkI2Mlx1NEUyRFx1RkYwQ1x1NkI2M1x1NTcyOFx1NkUwNVx1OTY2NFx1OTBFOFx1NTIwNlx1NTQwQ1x1NkI2NVx1OENDN1x1NjU5OVx1MjAyNlwiLCBcImluZm9cIik7XG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJzdG9wU3luY1wiIH0pLmNhdGNoKCgpID0+IHt9KTtcbiAgZWxzLnN0b3BCdG4uaGlkZGVuID0gdHJ1ZTtcbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbn1cblxuLy8gTGl2ZSBwcm9ncmVzcyB1cGRhdGVzIFx1MjAxNCBsaXN0ZW4gb24gY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkIHNvIHdlIGdldFxuLy8gZXZlcnkgdXBkYXRlIHRoZSBTVyB3cml0ZXMsIHJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGUgU1cncyBicm9hZGNhc3Rcbi8vIHNlbmRNZXNzYWdlIHJlYWNoZWQgdXMuXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIGFyZWEpID0+IHtcbiAgaWYgKGFyZWEgPT09IFwibG9jYWxcIiAmJiBjaGFuZ2VzLnN5bmNTdGF0dXMpIHtcbiAgICBhcHBseVN5bmNTdGF0dXMoY2hhbmdlcy5zeW5jU3RhdHVzLm5ld1ZhbHVlKTtcbiAgfVxufSk7XG5cbi8vIChMZWdhY3kgaW4tbWVtb3J5IGJyb2FkY2FzdCBzdGlsbCBsaXN0ZW5lZCB0byBhcyBhIGJhY2t1cC4pXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZykgPT4ge1xuICBpZiAobXNnPy50eXBlID09PSBcInN5bmNQcm9ncmVzc1wiKSB7XG4gICAgYXBwbHlTeW5jU3RhdHVzKG1zZy5zdGF0dXMpO1xuICB9XG59KTtcblxuLy8gUHJlLWZsaWdodCBkZXRlY3Rpb24gZm9yIE5ISSBsb2dpbiBzdGF0ZS4gVHdvIHNpZ25hbHMgKGVpdGhlciB0cmlnZ2Vycyk6XG4vLyAgMS4gVVJMIGlzIGluIE5ISSBhdXRoIG5hbWVzcGFjZSAoSUhLRTMwOTlTeHgpIFx1MjAxNCBsb2dpbiAvIElDIGNhcmQgcGFnZXNcbi8vICAyLiBQYWdlIGNvbnRhaW5zIGEgcGFzc3dvcmQgaW5wdXQgb3Iga25vd24gbG9nZ2VkLW91dCBwaHJhc2VzXG5hc3luYyBmdW5jdGlvbiBpc09uTmhpTG9naW5QYWdlKHRhYklkLCB1cmwpIHtcbiAgaWYgKHVybD8ucGF0aG5hbWUgJiYgL0lIS0UzMDk5Ly50ZXN0KHVybC5wYXRobmFtZSkpIHJldHVybiB0cnVlO1xuICB0cnkge1xuICAgIGNvbnN0IFt7IHJlc3VsdCB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICAgIGZ1bmM6ICgpID0+IHtcbiAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJwYXNzd29yZFwiXScpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgY29uc3QgdGV4dCA9IChkb2N1bWVudC5ib2R5Py5pbm5lclRleHQgfHwgXCJcIikudHJpbSgpO1xuICAgICAgICBjb25zdCBwaHJhc2VzID0gW1xuICAgICAgICAgIFwiXHU4QUNCXHU0RjdGXHU3NTI4XHU1MDY1XHU0RkREXHU1MzYxXCIsIFwiXHU4QUNCXHU2M0QyXHU1MTY1XHU1MDY1XHU0RkREXHU1MzYxXCIsIFwiXHU4QUNCXHU2M0QyXHU1MTY1XHU2MEE4XHU3Njg0XHU1MDY1XHU0RkREXHU1MzYxXCIsXG4gICAgICAgICAgXCJcdTc2N0JcdTUxNjVcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0FcIiwgXCJcdTc2N0JcdTUxNjVcdTU5MzFcdTY1NTdcIiwgXCJcdThBQ0JcdTkxQ0RcdTY1QjBcdTc2N0JcdTUxNjVcIixcbiAgICAgICAgICBcIlNlc3Npb24gXHU1REYyXHU5MDNFXHU2NjQyXCIsIFwic2Vzc2lvbiBcdTVERjJcdTkwM0VcdTY2NDJcIiwgXCJcdTVERjJcdTkwM0VcdTY2NDJcIixcbiAgICAgICAgICBcIlx1OEFDQlx1NEVFNVx1NTA2NVx1NEZERFx1NTM2MVx1NzY3Qlx1NTE2NVwiLFxuICAgICAgICBdO1xuICAgICAgICByZXR1cm4gcGhyYXNlcy5zb21lKChwKSA9PiB0ZXh0LmluY2x1ZGVzKHApKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuICEhcmVzdWx0O1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLy8gXHUyNkExIE5ISSBBUEktZGlyZWN0IHN5bmMgXHUyMDE0IHByaW1hcnkgcGF0aC4gSGl0cyBOSEkncyB1bmRlcmx5aW5nIEpTT05cbi8vIGVuZHBvaW50cyBpbiBwYXJhbGxlbCBhbmQgcG9zdHMgYWRhcHRlZCBpdGVtcyB0byAvc3luYy91cGxvYWQtc3RydWN0dXJlZC5cbi8vIFJlcXVpcmVzIHBhdGllbnRfb3ZlcnJpZGUgdG8gYmUgZmlsbGVkLlxuLy8gQ29udmVydCBhIGJhY2tlbmQgVVJMIFx1MjE5MiB0aGUgb3JpZ2luLXBhdHRlcm4gQ2hyb21lIHdhbnRzIGZvciBwZXJtaXNzaW9uXG4vLyByZXF1ZXN0cy4gXCJodHRwOi8vMTkyLjE2OC4xLjU6ODAxMFwiIFx1MjE5MiBcImh0dHA6Ly8xOTIuMTY4LjEuNTo4MDEwLypcIi5cbi8vIFJldHVybnMgbnVsbCB3aGVuIHRoZSBVUkwgaXNuJ3QgcGFyc2VhYmxlIHNvIHRoZSBjYWxsZXIgY2FuIHNob3J0LWNpcmN1aXQuXG5mdW5jdGlvbiBfb3JpZ2luUGF0dGVybkZvcih1cmwpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB1ID0gbmV3IFVSTCh1cmwpO1xuICAgIHJldHVybiBgJHt1LnByb3RvY29sfS8vJHt1Lmhvc3R9LypgO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vLyBCYWNrZW5kLW1vZGUgcHJlLWZsaWdodDogZW5zdXJlIHRoZSBleHRlbnNpb24gaGFzIGhvc3QgcGVybWlzc2lvbiBmb3Jcbi8vIHRoZSB1c2VyLWNvbmZpZ3VyZWQgYmFja2VuZCBVUkwuIExvY2FsaG9zdCAvIDEyNy4wLjAuMSBhcmUgY292ZXJlZCBieVxuLy8gdGhlIGRlZmF1bHQgbWFuaWZlc3QgaG9zdF9wZXJtaXNzaW9uczsgcmVtb3RlIC8gTEFOIC8gcHJvZHVjdGlvbiBVUkxzXG4vLyBuZWVkIGEgb25lLXRpbWUgdXNlciBncmFudC4gTXVzdCBydW4gZnJvbSBhIHVzZXIgZ2VzdHVyZSAoYnV0dG9uIGNsaWNrKS5cbmFzeW5jIGZ1bmN0aW9uIGVuc3VyZUJhY2tlbmRQZXJtaXNzaW9uKGJhY2tlbmRVcmwpIHtcbiAgY29uc3QgcGF0dGVybiA9IF9vcmlnaW5QYXR0ZXJuRm9yKGJhY2tlbmRVcmwpO1xuICBpZiAoIXBhdHRlcm4pIHJldHVybiB7IG9rOiBmYWxzZSwgcmVhc29uOiBgQmFja2VuZCBVUkwgXHU3MTIxXHU2Q0Q1XHU4OUUzXHU2NzkwOiAke2JhY2tlbmRVcmx9YCB9O1xuICBjb25zdCBhbHJlYWR5ID0gYXdhaXQgY2hyb21lLnBlcm1pc3Npb25zLmNvbnRhaW5zKHsgb3JpZ2luczogW3BhdHRlcm5dIH0pO1xuICBpZiAoYWxyZWFkeSkgcmV0dXJuIHsgb2s6IHRydWUgfTtcbiAgbGV0IGdyYW50ZWQ7XG4gIHRyeSB7XG4gICAgZ3JhbnRlZCA9IGF3YWl0IGNocm9tZS5wZXJtaXNzaW9ucy5yZXF1ZXN0KHsgb3JpZ2luczogW3BhdHRlcm5dIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHsgb2s6IGZhbHNlLCByZWFzb246IGBcdTZCMEFcdTk2NTBcdThBQ0JcdTZDNDJcdTU5MzFcdTY1NTc6ICR7ZS5tZXNzYWdlfWAgfTtcbiAgfVxuICByZXR1cm4gZ3JhbnRlZFxuICAgID8geyBvazogdHJ1ZSB9XG4gICAgOiB7IG9rOiBmYWxzZSwgcmVhc29uOiBgXHU2NzJBXHU2Mzg4XHU2QjBBXHU5MDIzXHU3RERBXHU1MjMwICR7cGF0dGVybn0gXHUyMDE0IFx1NTQwQ1x1NkI2NVx1NTNENlx1NkQ4OGAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gYXBpU3luY05oaSgpIHtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgaWYgKCFvdikge1xuICAgIHNldFN0YXR1cyhcIlx1MjZENCBcdThBQ0JcdTUxNDhcdTU4NkJcdTVCRUJcdTRFMEFcdTY1QjlcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTlcdUZGMDhcdThFQUJcdTUyMDZcdThCNDlcdTVCNTdcdTg2NUZcdUZGMDlcIiwgXCJlcnJvclwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBQcmUtZmxpZ2h0OiBjaGVjayB3ZSdyZSBvbiBhbiBOSEkgdGFiIHNvIGNvb2tpZXMgYXJlIHVzYWJsZSBmcm9tIFNXLlxuICBjb25zdCB0YWIgPSBhd2FpdCBnZXRBY3RpdmVUYWIoKTtcbiAgbGV0IHVybDtcbiAgdHJ5IHsgdXJsID0gbmV3IFVSTCh0YWIudXJsKTsgfSBjYXRjaCB7IHNldFN0YXR1cyhcImFjdGl2ZSB0YWIgaGFzIG5vIFVSTFwiLCBcImVycm9yXCIpOyByZXR1cm47IH1cbiAgY29uc3Qgb25Mb2dpbiA9IGF3YWl0IGlzT25OaGlMb2dpblBhZ2UodGFiLmlkLCB1cmwpO1xuICBpZiAob25Mb2dpbikge1xuICAgIHNldFN0YXR1cyhcIlx1RDgzRFx1REQxMiBcdTVDMUFcdTY3MkFcdTc2N0JcdTUxNjVcdTUwNjVcdTRGRERcdTVCNThcdTY0N0EgXHUyMDE0IFx1OEFDQlx1NTE0OFx1NEVFNVx1NTA2NVx1NEZERFx1NTM2MVx1NzY3Qlx1NTE2NVx1NUY4Q1x1NTE4RFx1OEE2NlwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEJhY2tlbmQgbW9kZTogcmUtdmVyaWZ5IGNvbm5lY3Rpdml0eSByaWdodCBoZXJlIGV2ZW4gaWYgdGhlIGJhbm5lclxuICAvLyBsYXN0IHNhaWQgb2suIEJldHdlZW4gdGhlIHByZXZpb3VzIGNoZWNrIGFuZCB0aGlzIGNsaWNrIHRoZSB1c2VyXG4gIC8vIG1heSBoYXZlIHN0b3BwZWQgZG9ja2VyOyB3aXRob3V0IGEgZnJlc2ggcHJvYmUgd2UnZCBzdGFydCBhbiB1cGxvYWRcbiAgLy8gdGhhdCBmYWlscyBtaWQtZmxpZ2h0IGFmdGVyIHBhcnRpYWwgZGF0YSBoYXMgaGl0IChvciBmYWlsZWQgdG8gaGl0KVxuICAvLyB0aGUgYmFja2VuZC4gQ2hlYXAgKFx1MjI2NDVzKSBhbmQgc2F2ZXMgYSBsb3Qgb2YgY29uZnVzaW9uLlxuICBpZiAoY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIpIHtcbiAgICBjb25zdCBvayA9IGF3YWl0IHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpO1xuICAgIGlmICghb2spIHtcbiAgICAgIHNldFN0YXR1cyhcIlx1MjZENCBcdTVGOENcdTdBRUZcdTkwMjNcdTdEREFcdTU5MzFcdTY1NTcgXHUyMDE0IFx1OEFDQlx1NzcwQlx1OTgwMlx1OTBFOCBiYW5uZXIgXHU3Njg0XHU4QUFBXHU2NjBFXCIsIFwiZXJyb3JcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgZWxzLnN5bmNBcGlCdG4uZGlzYWJsZWQgPSB0cnVlO1xuXG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgc3luY1N0YXR1czoge1xuICAgICAgcnVubmluZzogdHJ1ZSxcbiAgICAgIHByb2dyZXNzOiBcIlx1RDgzRFx1REU4MCBcdTk1OEJcdTU5Q0JcdTU0MENcdTZCNjVcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTIwMjZcIixcbiAgICAgIHBoYXNlOiBcInN0YXJ0aW5nXCIsIHN0YXJ0ZWQ6IERhdGUubm93KCksIHRzOiBEYXRlLm5vdygpLFxuICAgIH0sXG4gIH0pO1xuICBzZXRTdGF0dXMoXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1OUNCXHU1NDBDXHU2QjY1XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XHUyMDI2XCIsIFwiaW5mb1wiKTtcblxuICAvLyBDb21wdXRlIGRhdGUgcmFuZ2UgZnJvbSB0aGUgZHJvcGRvd24uIFwiMVwiID0gTkhJJ3MgZGVmYXVsdCB3aW5kb3c7XG4gIC8vIGFueXRoaW5nIGVsc2UgaXMgXCJ0b2RheSBiYWNrIE4geWVhcnNcIi4gSGVscGVyIGluc2lkZSBiYWNrZ3JvdW5kLmpzXG4gIC8vIGNvbnZlcnRzIHRvIFx1NkMxMVx1NTcwQiBmb3IgTkhJJ3MgQVBJLlxuICBjb25zdCByYW5nZVNlbCA9IGVscy5hcGlTeW5jUmFuZ2U/LnZhbHVlIHx8IFwiM1wiO1xuICBsZXQgZGF0ZVJhbmdlID0gbnVsbDtcbiAgY29uc3QgUkFOR0VfTEFCRUxTID0ge1xuICAgIFwiMVwiOiAgIFwiXHU2NzAwXHU4RkQxIDEgXHU1RTc0XCIsXG4gICAgXCIzXCI6ICAgXCJcdTY3MDBcdThGRDEgMyBcdTVFNzRcIixcbiAgICBcIjVcIjogICBcIlx1NjcwMFx1OEZEMSA1IFx1NUU3NFwiLFxuICAgIFwiMTBcIjogIFwiXHU2NzAwXHU4RkQxIDEwIFx1NUU3NFwiLFxuICAgIFwiYWxsXCI6IFwiXHU1MTY4XHU5MEU4XHU2Qjc3XHU1M0YyXHU3RDAwXHU5MzA0XCIsXG4gIH07XG4gIGNvbnN0IGRhdGVSYW5nZUxhYmVsID0gUkFOR0VfTEFCRUxTW3JhbmdlU2VsXSB8fCBgXHU2NzAwXHU4RkQxICR7cmFuZ2VTZWx9IFx1NUU3NGA7XG4gIGlmIChyYW5nZVNlbCAhPT0gXCIxXCIpIHtcbiAgICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgZW5kID0gdG9kYXkudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCk7XG4gICAgbGV0IHN0YXJ0O1xuICAgIGlmIChyYW5nZVNlbCA9PT0gXCJhbGxcIikge1xuICAgICAgc3RhcnQgPSBcIjIwMDEtMDEtMDFcIjsgIC8vIFx1NkMxMVx1NTcwQiA5MCBcdTIwMTQgZmFyIGVub3VnaCBiYWNrIGZvciBhbnkgY2xpbmljYWwgY2FzZVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB5ZWFycyA9IHBhcnNlSW50KHJhbmdlU2VsLCAxMCk7XG4gICAgICBjb25zdCBzID0gbmV3IERhdGUodG9kYXkpO1xuICAgICAgcy5zZXRGdWxsWWVhcihzLmdldEZ1bGxZZWFyKCkgLSB5ZWFycyk7XG4gICAgICBzdGFydCA9IHMudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCk7XG4gICAgfVxuICAgIGRhdGVSYW5nZSA9IHsgc3RhcnQsIGVuZCB9O1xuICB9XG5cbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgIHR5cGU6IFwic3RhcnROaGlBcGlTeW5jXCIsXG4gICAgcGF5bG9hZDoge1xuICAgICAgdGFiSWQ6IHRhYi5pZCxcbiAgICAgIG1vZGU6IGN1cnJlbnRNb2RlKCksXG4gICAgICBiYWNrZW5kOiBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCksXG4gICAgICBzeW5jQXBpS2V5OiBlbHMuc3luY0FwaUtleS52YWx1ZS50cmltKCksXG4gICAgICBuaGlCYXNlOiBcImh0dHBzOi8vbXloZWFsdGhiYW5rLm5oaS5nb3YudHdcIixcbiAgICAgIHBhdGllbnRPdmVycmlkZTogb3YsXG4gICAgICBkYXRlUmFuZ2UsXG4gICAgICBkYXRlUmFuZ2VMYWJlbCxcbiAgICB9LFxuICB9KS5jYXRjaCgoKSA9PiB7fSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGxhdW5jaCgpIHtcbiAgY29uc3QgYmFja2VuZCA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKTtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgY29uc3QgcGF0aWVudElkID0gb3Y/LmlkX25vO1xuICBjb25zdCBzbWFydEFwcExhdW5jaCA9IGVscy5zbWFydEFwcFVybC52YWx1ZS50cmltKCkgfHwgREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIO1xuICBpZiAoIXBhdGllbnRJZCkge1xuICAgIHNldFN0YXR1cyhcIlx1NkM5Mlx1NjcwOVx1NzVDNVx1NEVCQVx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1Rlx1NTNFRlx1NEVFNSBsYXVuY2ggXHUyMDE0IFx1OEFDQlx1NTE0OFx1NTg2Qlx1NUJFQlx1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBSZS10ZXN0IGNvbm5lY3Rpb24gZXZlbiBpZiBiYW5uZXIgc2hvd3Mgb2sgXHUyMDE0IGJhY2tlbmQgbWF5IGhhdmUgZ29uZVxuICAvLyBkb3duIHNpbmNlIHRoZSBsYXN0IHByb2JlLlxuICBjb25zdCBvayA9IGF3YWl0IHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpO1xuICBpZiAoIW9rKSB7XG4gICAgc2V0U3RhdHVzKFwiXHUyNkQ0IFx1NUY4Q1x1N0FFRlx1OTAyM1x1N0REQVx1NTkzMVx1NjU1NyBcdTIwMTQgXHU4QUNCXHU3NzBCXHU5ODAyXHU5MEU4IGJhbm5lciBcdTc2ODRcdThBQUFcdTY2MEVcIiwgXCJlcnJvclwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgc2V0U3RhdHVzKFwiXHU1RUZBXHU3QUNCIGxhdW5jaCBjb250ZXh0XHUyMDI2XCIsIFwiaW5mb1wiKTtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHtiYWNrZW5kfS9zbWFydC9sYXVuY2gtY29udGV4dGAsIHtcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHBhdGllbnRfaWQ6IHBhdGllbnRJZCB9KSxcbiAgICB9KTtcbiAgICBpZiAoIXJlcy5vaykgdGhyb3cgbmV3IEVycm9yKGAke3Jlcy5zdGF0dXN9OiAke2F3YWl0IHJlcy50ZXh0KCl9YCk7XG4gICAgY29uc3QgeyBsYXVuY2ggfSA9IGF3YWl0IHJlcy5qc29uKCk7XG4gICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh7IGlzczogYCR7YmFja2VuZH0vZmhpcmAsIGxhdW5jaCB9KTtcbiAgICAvLyBBcHBlbmQgaXNzICsgbGF1bmNoIHBhcmFtcywgcmVzcGVjdGluZyBhbnkgZXhpc3RpbmcgcXVlcnkgc3RyaW5nLlxuICAgIGNvbnN0IHNlcCA9IHNtYXJ0QXBwTGF1bmNoLmluY2x1ZGVzKFwiP1wiKSA/IFwiJlwiIDogXCI/XCI7XG4gICAgY2hyb21lLnRhYnMuY3JlYXRlKHsgdXJsOiBgJHtzbWFydEFwcExhdW5jaH0ke3NlcH0ke3BhcmFtc31gIH0pO1xuICAgIHdpbmRvdy5jbG9zZSgpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgc2V0U3RhdHVzKGBcdTI3NEMgTGF1bmNoIFx1NTkzMVx1NjU1N1x1RkYxQSR7ZS5tZXNzYWdlfWAsIFwiZXJyb3JcIik7XG4gIH1cbn1cblxuZWxzLnN5bmNBcGlCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFwaVN5bmNOaGkpO1xuZWxzLnN0b3BCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0b3BTeW5jKTtcbmVscy5vdlNhdmVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNhdmVQYXRpZW50T3ZlcnJpZGUpO1xuZWxzLm92Q2xlYXJCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsZWFyUGF0aWVudE92ZXJyaWRlKTtcbltlbHMub3ZJZE5vLCBlbHMub3ZOYW1lLCBlbHMub3ZCaXJ0aERhdGUsIGVscy5vdkdlbmRlcl0uZm9yRWFjaCgoZWwpID0+XG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KVxuKTtcbmVscy5sYXVuY2hCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxhdW5jaCk7XG5pbml0KCk7XG4iXSwKICAibWFwcGluZ3MiOiAiOztBQVNBLE1BQU0sa0JBQWtCO0FBSXhCLE1BQU0sMkJBQTJCO0FB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
