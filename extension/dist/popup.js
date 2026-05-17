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
    connSection: document.getElementById("conn-section"),
    connMini: document.getElementById("conn-mini"),
    connMsg: document.getElementById("conn-msg"),
    connRetryBtn: document.getElementById("conn-retry-btn"),
    connHelp: document.getElementById("conn-help"),
    dataStateSection: document.getElementById("data-state-section"),
    backendState: document.getElementById("backend-state"),
    localStateRow: document.getElementById("local-state-row"),
    localState: document.getElementById("local-state"),
    pushLocalBtn: document.getElementById("push-local-btn"),
    syncStatusHint: document.getElementById("sync-status-hint"),
    sidebarEnabled: document.getElementById("sidebar-enabled")
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
    _renderDataState();
    if (currentMode() === "backend" && _connState === "ok") checkBackendPatient();
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
    const isOk = _connState === "ok";
    if (els.connSection) els.connSection.hidden = isOk;
    if (els.connMini) {
      els.connMini.hidden = !isOk;
      if (isOk) els.connMini.title = `\u5DF2\u9023\u7DDA \u2014 ${els.backendUrl.value.trim()}`;
    }
  }
  function _refreshButtonStates() {
    const onNhi = !els.syncApiBtn.dataset.offNhi;
    const modeOk = currentMode() === "local" || _connState === "ok";
    els.syncApiBtn.disabled = !(onNhi && modeOk);
    els.syncApiBtn.title = !onNhi ? "\u8ACB\u5148\u5207\u5230\u5065\u4FDD\u5B58\u647A\u5206\u9801\u518D\u540C\u6B65" : !modeOk ? "\u5F8C\u7AEF\u5C1A\u672A\u9023\u7DDA" : "";
    const ov = getPatientOverride();
    const haveBackendPatient = _backendPatient.state === "present";
    els.launchBtn.disabled = !(currentMode() === "backend" && _connState === "ok" && !!ov?.id_no && haveBackendPatient);
    els.launchBtn.title = currentMode() !== "backend" ? "\u8ACB\u5207\u5230\u300C\u4E0A\u50B3\u5F8C\u7AEF\u300D\u6A21\u5F0F" : _connState !== "ok" ? "\u5F8C\u7AEF\u5C1A\u672A\u9023\u7DDA" : !ov?.id_no ? "\u8ACB\u5148\u586B\u75C5\u4EBA\u8CC7\u6599" : !haveBackendPatient ? "\u5F8C\u7AEF\u5C1A\u7121\u6B64\u75C5\u4EBA\u7684\u8CC7\u6599 \u2014 \u8ACB\u5148\u540C\u6B65\u6216\u4E0A\u50B3\u672C\u5730 Bundle" : "";
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
    if (currentMode() === "backend") checkBackendPatient();
    return _connState === "ok";
  }
  els.connRetryBtn?.addEventListener("click", testBackendConnection);
  var _backendPatient = { state: "unknown", count: 0, lastUpdated: null };
  var _localBundle = { exists: false, count: 0, generatedAt: 0, patientId: null };
  function _fmtTimeShort(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  function _fmtRelative(ms) {
    const diff = Date.now() - ms;
    if (diff < 6e4) return `${Math.max(1, Math.round(diff / 1e3))} \u79D2\u524D`;
    if (diff < 36e5) return `${Math.round(diff / 6e4)} \u5206\u9418\u524D`;
    if (diff < 864e5) return `${Math.round(diff / 36e5)} \u5C0F\u6642\u524D`;
    return _fmtTimeShort(new Date(ms).toISOString());
  }
  function _renderDataState() {
    const ov = getPatientOverride();
    if (currentMode() !== "backend" || !ov?.id_no) {
      els.dataStateSection.hidden = true;
      if (els.syncStatusHint) els.syncStatusHint.hidden = true;
      return;
    }
    const localMatches = _localBundle.exists && _localBundle.patientId === ov.id_no;
    const inSync = _backendPatient.state === "present" && localMatches && _backendPatient.count === _localBundle.count;
    if (els.syncStatusHint) els.syncStatusHint.hidden = !inSync;
    const nothingToShow = _backendPatient.state === "present" && (!localMatches || inSync);
    if (nothingToShow) {
      els.dataStateSection.hidden = true;
      return;
    }
    els.dataStateSection.hidden = false;
    const bs = els.backendState;
    switch (_backendPatient.state) {
      case "checking":
        bs.className = "data-state-value";
        bs.textContent = "\u6AA2\u67E5\u4E2D\u2026";
        break;
      case "absent":
        bs.className = "data-state-value empty";
        bs.textContent = "\u26A0 \u5C1A\u7121\u6B64\u75C5\u4EBA \u2014 \u8ACB\u5148\u6309\u4E0B\u65B9\u300C\u540C\u6B65\u300D\u6216\u4E0A\u50B3\u672C\u5730 Bundle";
        break;
      case "present": {
        const count = _backendPatient.count;
        const ts = _backendPatient.lastUpdated;
        bs.className = "data-state-value ok";
        bs.textContent = `\u2713 ${count > 0 ? `${count} \u7B46 \xB7 ` : ""}\u6700\u5F8C\u66F4\u65B0 ${_fmtTimeShort(ts) || "(unknown)"}`;
        break;
      }
      case "fail":
        bs.className = "data-state-value fail";
        bs.textContent = "\u2717 \u6AA2\u67E5\u5931\u6557\uFF08\u770B\u9023\u7DDA banner\uFF09";
        break;
      default:
        bs.className = "data-state-value";
        bs.textContent = "\u2014";
    }
    if (localMatches) {
      els.localStateRow.hidden = false;
      els.localState.className = "data-state-value ok";
      els.localState.textContent = `\u2713 ${_localBundle.count} \u7B46 \xB7 ${_fmtRelative(_localBundle.generatedAt)}\u7522\u751F`;
    } else {
      els.localStateRow.hidden = true;
    }
    els.pushLocalBtn.hidden = !localMatches;
    els.pushLocalBtn.disabled = false;
    els.pushLocalBtn.title = "";
    els.pushLocalBtn.textContent = "\u{1F4E4} \u628A\u672C\u5730 Bundle \u4E0A\u50B3\u5230\u5F8C\u7AEF";
  }
  async function _refreshLocalBundleState() {
    const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.local.get(PENDING_BUNDLE_KEY);
    _localBundle = pending ? {
      exists: true,
      count: Array.isArray(JSON.parse(pending.json)?.entry) ? JSON.parse(pending.json).entry.length : 0,
      generatedAt: pending.generatedAt || 0,
      patientId: pending.patientId || null
    } : { exists: false, count: 0, generatedAt: 0, patientId: null };
    _renderDataState();
  }
  async function checkBackendPatient() {
    const ov = getPatientOverride();
    if (currentMode() !== "backend" || !ov?.id_no || _connState !== "ok") {
      _backendPatient = { state: "unknown", count: 0, lastUpdated: null };
      _renderDataState();
      _refreshButtonStates();
      return;
    }
    _backendPatient = { state: "checking", count: 0, lastUpdated: null };
    _renderDataState();
    const url = els.backendUrl.value.trim().replace(/\/$/, "");
    const key = els.syncApiKey.value.trim();
    const headers = key ? { "X-Sync-API-Key": key } : {};
    try {
      const pr = await fetch(`${url}/fhir/Patient/${encodeURIComponent(ov.id_no)}`, { headers });
      if (pr.status === 404) {
        _backendPatient = { state: "absent", count: 0, lastUpdated: null };
        _renderDataState();
        _refreshButtonStates();
        return;
      }
      if (!pr.ok) {
        _backendPatient = { state: "fail", count: 0, lastUpdated: null };
        _renderDataState();
        _refreshButtonStates();
        return;
      }
      const patient = await pr.json();
      const lastUpdated = patient?.meta?.lastUpdated ?? null;
      let count = 0;
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 5e3);
        const er = await fetch(`${url}/fhir/export?patient=${encodeURIComponent(ov.id_no)}`, {
          headers,
          signal: ctrl.signal
        });
        clearTimeout(timer);
        if (er.ok) {
          const bundle = await er.json();
          if (Array.isArray(bundle.entry)) count = bundle.entry.length;
        }
      } catch {
      }
      _backendPatient = { state: "present", count, lastUpdated };
    } catch (_e) {
      _backendPatient = { state: "fail", count: 0, lastUpdated: null };
    }
    _renderDataState();
    _refreshButtonStates();
  }
  async function pushLocalBundleToBackend() {
    const ov = getPatientOverride();
    if (!ov?.id_no || !_localBundle.exists || _localBundle.patientId !== ov.id_no) return;
    const url = els.backendUrl.value.trim().replace(/\/$/, "");
    const key = els.syncApiKey.value.trim();
    const headers = {
      "Content-Type": "application/json",
      ...key ? { "X-Sync-API-Key": key } : {}
    };
    els.pushLocalBtn.disabled = true;
    els.pushLocalBtn.textContent = "\u4E0A\u50B3\u4E2D\u2026";
    try {
      const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.local.get(PENDING_BUNDLE_KEY);
      if (!pending?.json) throw new Error("no local bundle");
      const r = await fetch(`${url}/fhir/import`, {
        method: "POST",
        headers,
        body: pending.json
      });
      if (!r.ok) {
        const text = await r.text();
        throw new Error(`HTTP ${r.status}: ${text.slice(0, 120)}`);
      }
      const result = await r.json();
      setStatus(`\u2705 \u5DF2\u4E0A\u50B3 ${result.imported ?? "?"} \u7B46\u5230\u5F8C\u7AEF`, "success");
      await checkBackendPatient();
    } catch (e) {
      setStatus(`\u26D4 \u4E0A\u50B3\u5931\u6557\uFF1A${e.message}`, "error");
    } finally {
      _renderDataState();
    }
  }
  els.pushLocalBtn?.addEventListener("click", pushLocalBundleToBackend);
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && PENDING_BUNDLE_KEY in changes) _refreshLocalBundleState();
  });
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
        _backendPatient = { state: "unknown", count: 0, lastUpdated: null };
        _renderConnBanner();
        _renderDataState();
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
  async function loadSidebarEnabled() {
    const { sidebarEnabled } = await chrome.storage.sync.get("sidebarEnabled");
    els.sidebarEnabled.checked = sidebarEnabled !== false;
  }
  els.sidebarEnabled?.addEventListener("change", () => {
    chrome.storage.sync.set({ sidebarEnabled: els.sidebarEnabled.checked });
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
  var _helpTip = document.createElement("div");
  _helpTip.className = "help-tooltip";
  document.body.appendChild(_helpTip);
  var VIEWPORT_MARGIN = 6;
  function _showHelpTooltip(icon) {
    _helpTip.textContent = icon.dataset.tip || icon.getAttribute("data-tip") || "";
    _helpTip.classList.add("visible");
    const iconRect = icon.getBoundingClientRect();
    const tipRect = _helpTip.getBoundingClientRect();
    const viewportW = document.documentElement.clientWidth;
    const viewportH = document.documentElement.clientHeight;
    let left = iconRect.left + iconRect.width / 2 - tipRect.width / 2;
    if (left < VIEWPORT_MARGIN) left = VIEWPORT_MARGIN;
    if (left + tipRect.width > viewportW - VIEWPORT_MARGIN) {
      left = viewportW - VIEWPORT_MARGIN - tipRect.width;
    }
    let top = iconRect.top - tipRect.height - 6;
    if (top < VIEWPORT_MARGIN) top = iconRect.bottom + 6;
    if (top + tipRect.height > viewportH - VIEWPORT_MARGIN) {
      top = Math.max(VIEWPORT_MARGIN, viewportH - VIEWPORT_MARGIN - tipRect.height);
    }
    _helpTip.style.left = `${left}px`;
    _helpTip.style.top = `${top}px`;
  }
  function _hideHelpTooltip() {
    _helpTip.classList.remove("visible");
  }
  document.addEventListener("mouseover", (e) => {
    const icon = e.target.closest?.(".help-icon");
    if (icon) _showHelpTooltip(icon);
  });
  document.addEventListener("mouseout", (e) => {
    const icon = e.target.closest?.(".help-icon");
    if (icon) _hideHelpTooltip();
  });
  async function init() {
    await loadSidebarEnabled();
    await _refreshLocalBundleState();
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
      _refreshLocalBundleState();
      if (currentMode() === "backend" && _connState === "ok") checkBackendPatient();
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3BvcHVwLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBOSEktRkhJUiBCcmlkZ2UgcG9wdXAgbG9naWMuXG4vL1xuLy8gRmxvdzpcbi8vICAgMS4gT24gb3BlbiwgY2hlY2sgdGhlIGFjdGl2ZSB0YWIgaXMgYW4gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBwYWdlLlxuLy8gICAyLiBVc2VyIGNvbmZpcm1zIHBhdGllbnQgaWRlbnRpdHkgKFx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1RikgaW4gdGhlIHBhdGllbnQtb3ZlcnJpZGUgY2FyZC5cbi8vICAgMy4gQ2xpY2tzIFwiXHVEODNEXHVEQ0U1IFx1NTQwQ1x1NkI2NVx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVwiIFx1MjE5MiBiYWNrZ3JvdW5kIHJ1bnMgcnVuTmhpQXBpU3luYygpLlxuLy8gICA0LiBQcm9ncmVzcyBzdHJlYW1lZCBiYWNrIHZpYSBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zeW5jU3RhdHVzLlxuLy8gICA1LiBBZnRlciBzeW5jIGNvbXBsZXRlcywgXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1NTVGIFNNQVJUIEFwcFwiIGxhdW5jaGVzIHdpdGggdGhhdCBwYXRpZW50LlxuXG5jb25zdCBERUZBVUxUX0JBQ0tFTkQgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODAxMFwiO1xuLy8gRGVmYXVsdCBTTUFSVCBhcHAgZm9yIGEgZnJlc2ggaW5zdGFsbC4gVXNlcnMgY2FuIG92ZXJyaWRlIHZpYVxuLy8gdGhlICdcdTI2OTlcdUZFMEYgXHU5MDMyXHU5NjhFXHU4QTJEXHU1QjlBIFx1MjE5MiBTTUFSVCBBcHAgTGF1bmNoIFVSTCcgZmllbGQ7IHRoZSB2YWx1ZSBpc1xuLy8gcGVyc2lzdGVkIGluIGNocm9tZS5zdG9yYWdlLnN5bmMgdW5kZXIgYHNtYXJ0QXBwTGF1bmNoVXJsYC5cbmNvbnN0IERFRkFVTFRfU01BUlRfQVBQX0xBVU5DSCA9IFwiaHR0cHM6Ly92b2hvMDAwMC5naXRodWIuaW8vbWVkaWNhbC1ub3RlLXNtYXJ0LW9uLWZoaXIvc21hcnQvbGF1bmNoXCI7XG5cbi8vIFRydWUgaWYgdGhlIGFjdGl2ZSB0YWIgaXMgYW4gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBwYWdlIChyZWFsIHNpdGUpLlxuZnVuY3Rpb24gaXNOaGlUYWIodXJsKSB7XG4gIGlmICghdXJsKSByZXR1cm4gZmFsc2U7XG4gIHRyeSB7XG4gICAgY29uc3QgdSA9IHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIgPyBuZXcgVVJMKHVybCkgOiB1cmw7XG4gICAgcmV0dXJuIC9teWhlYWx0aGJhbmtcXC5uaGlcXC5nb3ZcXC50dy8udGVzdCh1Lmhvc3RuYW1lKTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmNvbnN0IERFRkFVTFRfTU9ERSA9IFwibG9jYWxcIjtcblxuY29uc3QgZWxzID0ge1xuICBtb2RlUmFkaW9zOiAoKSA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwic3luYy1tb2RlXCJdJyksXG4gIGJhY2tlbmRVcmw6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmFja2VuZC11cmxcIiksXG4gIHN5bmNBcGlLZXk6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3luYy1hcGkta2V5XCIpLFxuICBzbWFydEFwcFVybDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzbWFydC1hcHAtdXJsXCIpLFxuICBzeW5jQXBpQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN5bmMtYXBpLWJ0blwiKSxcbiAgYXBpU3luY1JhbmdlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFwaS1zeW5jLXJhbmdlXCIpLFxuICBzdG9wQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0b3AtYnRuXCIpLFxuICBvdklkTm86IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3YtaWQtbm9cIiksXG4gIG92TmFtZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1uYW1lXCIpLFxuICBvdkJpcnRoRGF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1iaXJ0aC1kYXRlXCIpLFxuICBvdkdlbmRlcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1nZW5kZXJcIiksXG4gIG92U2F2ZUJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1zYXZlLWJ0blwiKSxcbiAgb3ZDbGVhckJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1jbGVhci1idG5cIiksXG4gIG92U3VtbWFyeTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVycmlkZS1zdW1tYXJ5XCIpLFxuICBwYXRpZW50T3ZlcnJpZGVEZXRhaWxzOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhdGllbnQtb3ZlcnJpZGVcIiksXG4gIGxhdW5jaEJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsYXVuY2gtYnRuXCIpLFxuICBzdGF0dXM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RhdHVzXCIpLFxuICBkYXNoYm9hcmRMaW5rOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhc2hib2FyZC1saW5rXCIpLFxuICBwZW5kaW5nQnVuZGxlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBlbmRpbmctYnVuZGxlXCIpLFxuICBkb3dubG9hZEJ1bmRsZUJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkb3dubG9hZC1idW5kbGUtYnRuXCIpLFxuICBjbGVhckJ1bmRsZUJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjbGVhci1idW5kbGUtYnRuXCIpLFxuICBidW5kbGVNZXRhOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1bmRsZS1tZXRhXCIpLFxuICBjb25uQmFubmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4tYmFubmVyXCIpLFxuICBjb25uU2VjdGlvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25uLXNlY3Rpb25cIiksXG4gIGNvbm5NaW5pOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4tbWluaVwiKSxcbiAgY29ubk1zZzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25uLW1zZ1wiKSxcbiAgY29ublJldHJ5QnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4tcmV0cnktYnRuXCIpLFxuICBjb25uSGVscDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25uLWhlbHBcIiksXG4gIGRhdGFTdGF0ZVNlY3Rpb246IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0YS1zdGF0ZS1zZWN0aW9uXCIpLFxuICBiYWNrZW5kU3RhdGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmFja2VuZC1zdGF0ZVwiKSxcbiAgbG9jYWxTdGF0ZVJvdzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2NhbC1zdGF0ZS1yb3dcIiksXG4gIGxvY2FsU3RhdGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9jYWwtc3RhdGVcIiksXG4gIHB1c2hMb2NhbEJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwdXNoLWxvY2FsLWJ0blwiKSxcbiAgc3luY1N0YXR1c0hpbnQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3luYy1zdGF0dXMtaGludFwiKSxcbiAgc2lkZWJhckVuYWJsZWQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2lkZWJhci1lbmFibGVkXCIpLFxufTtcblxuY29uc3QgUEVORElOR19CVU5ETEVfS0VZID0gXCJwZW5kaW5nRmhpckJ1bmRsZVwiO1xuXG4vLyBQZXJzaXN0ZWQtc3RhdGUga2V5cy4gQmFja2VuZCBVUkwgYW5kIEFQSSBrZXkgcGVyc2lzdCBhY3Jvc3MgYnJvd3NlciBzZXNzaW9ucy5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRCYWNrZW5kVXJsKCkge1xuICBjb25zdCB7IGJhY2tlbmRVcmwsIHN5bmNBcGlLZXksIHNtYXJ0QXBwTGF1bmNoVXJsIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChcbiAgICBbXCJiYWNrZW5kVXJsXCIsIFwic3luY0FwaUtleVwiLCBcInNtYXJ0QXBwTGF1bmNoVXJsXCJdXG4gICk7XG4gIGVscy5iYWNrZW5kVXJsLnZhbHVlID0gYmFja2VuZFVybCB8fCBERUZBVUxUX0JBQ0tFTkQ7XG4gIGVscy5zeW5jQXBpS2V5LnZhbHVlID0gc3luY0FwaUtleSB8fCBcIlwiO1xuICBlbHMuc21hcnRBcHBVcmwudmFsdWUgPSBzbWFydEFwcExhdW5jaFVybCB8fCBERUZBVUxUX1NNQVJUX0FQUF9MQVVOQ0g7XG4gIGVscy5kYXNoYm9hcmRMaW5rLmhyZWYgPSBlbHMuYmFja2VuZFVybC52YWx1ZS5yZXBsYWNlKC86ODAxMC4qJC8sIFwiOjMwMTBcIik7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQYXRpZW50IG92ZXJyaWRlIChtYW51YWwgTkhJIGlkZW50aXR5KSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgZG9lc24ndCBleHBvc2UgdGhlIHVzZXIncyBuYXRpb25hbCBJRCBpbiB0aGUgVVJMLiBUaGUgdXNlclxuLy8gZmlsbHMgdGhlc2Ugb25jZSBhbmQgdGhleSdyZSBzZW50IHdpdGggZXZlcnkgdXBsb2FkIGNhbGwgdW50aWwgY2xlYXJlZC5cblxuYXN5bmMgZnVuY3Rpb24gbG9hZFBhdGllbnRPdmVycmlkZSgpIHtcbiAgY29uc3QgeyBwYXRpZW50T3ZlcnJpZGUgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFwicGF0aWVudE92ZXJyaWRlXCIpO1xuICBpZiAocGF0aWVudE92ZXJyaWRlKSB7XG4gICAgZWxzLm92SWROby52YWx1ZSA9IHBhdGllbnRPdmVycmlkZS5pZF9ubyB8fCBcIlwiO1xuICAgIGVscy5vdk5hbWUudmFsdWUgPSBwYXRpZW50T3ZlcnJpZGUubmFtZSB8fCBcIlwiO1xuICAgIGVscy5vdkJpcnRoRGF0ZS52YWx1ZSA9IHBhdGllbnRPdmVycmlkZS5iaXJ0aF9kYXRlIHx8IFwiXCI7XG4gICAgZWxzLm92R2VuZGVyLnZhbHVlID0gcGF0aWVudE92ZXJyaWRlLmdlbmRlciB8fCBcIlwiO1xuICB9XG4gIC8vIEZpcnN0LXRpbWUgVVg6IGlmIG5vIGlkX25vIGlzIHN0b3JlZCwgYXV0by1leHBhbmQgdGhlIHBhdGllbnQtZGF0YVxuICAvLyBkZXRhaWxzIHNvIHRoZSB1c2VyIGltbWVkaWF0ZWx5IHNlZXMgdGhlIHJlcXVpcmVkIGZpZWxkcy4gT25jZVxuICAvLyB0aGV5J3ZlIHNhdmVkIGEgdmFsdWUsIGRlZmF1bHQgdG8gY29sbGFwc2VkLlxuICBpZiAoZWxzLnBhdGllbnRPdmVycmlkZURldGFpbHMpIHtcbiAgICBlbHMucGF0aWVudE92ZXJyaWRlRGV0YWlscy5vcGVuID0gIXBhdGllbnRPdmVycmlkZT8uaWRfbm87XG4gIH1cbiAgcmVmcmVzaE92ZXJyaWRlU3VtbWFyeSgpO1xufVxuXG5mdW5jdGlvbiBnZXRQYXRpZW50T3ZlcnJpZGUoKSB7XG4gIC8vIFJldHVybnMge2lkX25vLCBuYW1lLCBiaXJ0aF9kYXRlLCBnZW5kZXJ9IG9ubHkgaWYgaWRfbm8gaGFzIGEgdmFsdWUuXG4gIC8vIEJhY2tlbmQgdHJlYXRzIGlkX25vIGFzIHRoZSB0cmlnZ2VyIFx1MjAxNCB3aXRob3V0IGl0LCBvdmVycmlkZSBpcyBpZ25vcmVkLlxuICBjb25zdCBpZF9ubyA9IGVscy5vdklkTm8udmFsdWUudHJpbSgpO1xuICBpZiAoIWlkX25vKSByZXR1cm4gbnVsbDtcbiAgY29uc3Qgb3V0ID0geyBpZF9ubyB9O1xuICBjb25zdCBuYW1lID0gZWxzLm92TmFtZS52YWx1ZS50cmltKCk7XG4gIGNvbnN0IGJpcnRoX2RhdGUgPSBlbHMub3ZCaXJ0aERhdGUudmFsdWUudHJpbSgpO1xuICBjb25zdCBnZW5kZXIgPSBlbHMub3ZHZW5kZXIudmFsdWU7XG4gIGlmIChuYW1lKSBvdXQubmFtZSA9IG5hbWU7XG4gIGlmIChiaXJ0aF9kYXRlKSBvdXQuYmlydGhfZGF0ZSA9IGJpcnRoX2RhdGU7XG4gIGlmIChnZW5kZXIpIG91dC5nZW5kZXIgPSBnZW5kZXI7XG4gIHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkoKSB7XG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGNvbnN0IGNhcmQgPSBlbHMucGF0aWVudE92ZXJyaWRlRGV0YWlscztcbiAgaWYgKCFvdikge1xuICAgIGVscy5vdlN1bW1hcnkudGV4dENvbnRlbnQgPSBcIlx1NjcyQVx1OEEyRFx1NUI5QVwiO1xuICAgIGlmIChjYXJkKSBjYXJkLmRhdGFzZXQuc3RhdGUgPSBcImVtcHR5XCI7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgcGFydHMgPSBbb3YuaWRfbm9dO1xuICAgIGlmIChvdi5uYW1lKSBwYXJ0cy5wdXNoKG92Lm5hbWUpO1xuICAgIGVscy5vdlN1bW1hcnkudGV4dENvbnRlbnQgPSBgXHUyNzEzICR7cGFydHMuam9pbihcIiAgXHUwMEI3ICBcIil9YDtcbiAgICBpZiAoY2FyZCkgY2FyZC5kYXRhc2V0LnN0YXRlID0gXCJmaWxsZWRcIjtcbiAgfVxuICAvLyBCb3RoIGxhdW5jaCArIHN5bmMgZW5hYmxlZCBzdGF0ZSBkZXBlbmQgb24gcGF0aWVudCArIG1vZGUgKyBjb25uLlxuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAvLyBDaGFuZ2luZyBwYXRpZW50IElEIGludmFsaWRhdGVzIHRoZSBiYWNrZW5kLXN0YXRlIGNhY2hlICh0aGUgbmV3XG4gIC8vIHBhdGllbnQgbWlnaHQgbm90IGJlIG9uIGJhY2tlbmQpIGFuZCB0aGUgbG9jYWwtYnVuZGxlIHJvdyAobWlnaHRcbiAgLy8gbm8gbG9uZ2VyIG1hdGNoKS4gUmUtZXZhbHVhdGUgYm90aC5cbiAgX3JlbmRlckRhdGFTdGF0ZSgpO1xuICBpZiAoY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIgJiYgX2Nvbm5TdGF0ZSA9PT0gXCJva1wiKSBjaGVja0JhY2tlbmRQYXRpZW50KCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNhdmVQYXRpZW50T3ZlcnJpZGUoKSB7XG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGlmICghb3YpIHtcbiAgICBzZXRTdGF0dXMoXCJcdThFQUJcdTUyMDZcdThCNDlcdTVCNTdcdTg2NUZcdTcwQkFcdTVGQzVcdTU4NkJcIiwgXCJlcnJvclwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBwYXRpZW50T3ZlcnJpZGU6IG92IH0pO1xuICByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCk7XG4gIGlmIChlbHMucGF0aWVudE92ZXJyaWRlRGV0YWlscykgZWxzLnBhdGllbnRPdmVycmlkZURldGFpbHMub3BlbiA9IGZhbHNlO1xuICBzZXRTdGF0dXMoYFx1MjcwNSBcdTVERjJcdTUxMzJcdTVCNThcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTlcdUZGMUEke292LmlkX25vfSR7b3YubmFtZSA/IGAgKCR7b3YubmFtZX0pYCA6IFwiXCJ9YCwgXCJzdWNjZXNzXCIpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjbGVhclBhdGllbnRPdmVycmlkZSgpIHtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5yZW1vdmUoXCJwYXRpZW50T3ZlcnJpZGVcIik7XG4gIGVscy5vdklkTm8udmFsdWUgPSBcIlwiO1xuICBlbHMub3ZOYW1lLnZhbHVlID0gXCJcIjtcbiAgZWxzLm92QmlydGhEYXRlLnZhbHVlID0gXCJcIjtcbiAgZWxzLm92R2VuZGVyLnZhbHVlID0gXCJcIjtcbiAgcmVmcmVzaE92ZXJyaWRlU3VtbWFyeSgpO1xuICBpZiAoZWxzLnBhdGllbnRPdmVycmlkZURldGFpbHMpIGVscy5wYXRpZW50T3ZlcnJpZGVEZXRhaWxzLm9wZW4gPSB0cnVlO1xuICBzZXRTdGF0dXMoXCJcdTVERjJcdTZFMDVcdTk2NjRcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTlcIiwgXCJpbmZvXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQmFja2VuZCBjb25uZWN0aW9uIHN0YXRlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIFNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGg6IGBfY29ublN0YXRlYCByZWZsZWN0cyB0aGUgbGF0ZXN0IGJhY2tlbmRcbi8vIGNvbm5lY3Rpdml0eSBjaGVjay4gQm90aCB0aGUgYmFubmVyIFVJIGFuZCB0aGUgZW5hYmxlZC1zdGF0ZSBvZiB0aGVcbi8vIFx1RDgzRFx1RENFNSBTeW5jIC8gXHVEODNEXHVERTgwIExhdW5jaCBidXR0b25zIHJlYWQgZnJvbSBpdC5cbi8vXG4vLyBTdGF0ZXM6XG4vLyAgIFwidW5rbm93blwiICBcdTIwMTQgbm90IHlldCBjaGVja2VkIChlLmcuIGZpcnN0IHBhaW50IGluIGxvY2FsIG1vZGUpXG4vLyAgIFwiY2hlY2tpbmdcIiBcdTIwMTQgZmV0Y2ggaW4gZmxpZ2h0XG4vLyAgIFwib2tcIiAgICAgICBcdTIwMTQgR0VUIC9maGlyL21ldGFkYXRhIHJldHVybmVkIGEgRkhJUiBDYXBhYmlsaXR5U3RhdGVtZW50XG4vLyAgIFwiZmFpbFwiICAgICBcdTIwMTQgYW55dGhpbmcgZWxzZTsgYF9jb25uRmFpbFJlYXNvbmAgY2FycmllcyBkZXRhaWxcbi8vXG4vLyBCYWNrZW5kIGNvbm5lY3Rpdml0eSBpcyB0cmVhdGVkIGFzIGEgKnByZXJlcXVpc2l0ZSogZm9yIGJhY2tlbmQgbW9kZSxcbi8vIG5vdCBhcyBhIHBlci1hY3Rpb24gY2hlY2suIFN3aXRjaGluZyB0byBiYWNrZW5kIG1vZGUgdHJpZ2dlcnMgYSB0ZXN0XG4vLyBpbW1lZGlhdGVseTsgZmFpbHVyZSBzaG93cyBhIGJhbm5lciB3aXRoIGFjdGlvbmFibGUgZ3VpZGFuY2UgYW5kXG4vLyBkaXNhYmxlcyBib3RoIGFjdGlvbiBidXR0b25zIHVudGlsIGNvbm5lY3Rpdml0eSByZWNvdmVycy5cblxubGV0IF9jb25uU3RhdGUgPSBcInVua25vd25cIjtcbmxldCBfY29ubkZhaWxSZWFzb24gPSBudWxsOyAvLyB7IGtpbmQ6IFwibm8tcGVybWlzc2lvblwiIHwgXCJuby11cmxcIiB8IFwibmV0d29ya1wiIHwgXCJ0aW1lb3V0XCIgfCBcImh0dHBcIiB8IFwibm90LWZoaXJcIiwgZGV0YWlsPyB9XG5cbmNvbnN0IF9DT05OX0xBQkVMUyA9IHtcbiAgdW5rbm93bjogXCJcdTY3MkFcdTZBQTJcdTZFMkNcIixcbiAgY2hlY2tpbmc6IFwiXHU2QUEyXHU2RTJDXHU0RTJEXHUyMDI2XCIsXG4gIG9rOiAoKSA9PiBgXHU1REYyXHU5MDIzXHU3RERBIFx1MjAxNCAke2Vscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKX1gLFxuICBmYWlsOiAoKSA9PiB7XG4gICAgY29uc3QgciA9IF9jb25uRmFpbFJlYXNvbiB8fCB7fTtcbiAgICByZXR1cm4gKHtcbiAgICAgIFwibm8tdXJsXCI6IFwiXHUyNzE3IFx1NjcyQVx1OEEyRFx1NUI5QSBCYWNrZW5kIFVSTFwiLFxuICAgICAgXCJuby1wZXJtaXNzaW9uXCI6IFwiXHUyNzE3IFx1NjcyQVx1NjM4OFx1NkIwQVx1OTAyM1x1N0REQVwiLFxuICAgICAgXCJuZXR3b3JrXCI6IFwiXHUyNzE3IFx1OTAyM1x1NEUwRFx1NEUwQVx1NUY4Q1x1N0FFRlwiLFxuICAgICAgXCJ0aW1lb3V0XCI6IFwiXHUyNzE3IFx1OTAyM1x1N0REQVx1OTAzRVx1NjY0MlwiLFxuICAgICAgXCJodHRwXCI6IGBcdTI3MTcgSFRUUCAke3IuZGV0YWlsIHx8IFwiXCJ9YC50cmltKCksXG4gICAgICBcIm5vdC1maGlyXCI6IFwiXHUyNzE3IFx1NTZERVx1NjFDOVx1NEUwRFx1NjYyRiBGSElSXCIsXG4gICAgfSlbci5raW5kXSA/PyBcIlx1MjcxNyBcdTkwMjNcdTdEREFcdTU5MzFcdTY1NTdcIjtcbiAgfSxcbn07XG5cbmNvbnN0IF9DT05OX0hFTFAgPSB7XG4gIFwibm8tdXJsXCI6ICAgICAgICBcIlx1OEFDQlx1NTIzMFx1MzAwQ1x1OTAzMlx1OTY4RVx1OEEyRFx1NUI5QVx1MzAwRFx1NTg2Qlx1NTE2NSBCYWNrZW5kIFVSTFx1RkYwQ1x1NEY4Qlx1NTk4MiA8Y29kZT5odHRwOi8vbG9jYWxob3N0OjgwMTA8L2NvZGU+XHUzMDAyXCIsXG4gIFwibm8tcGVybWlzc2lvblwiOiBcIkNocm9tZSBcdTk2M0JcdTY0Q0JcdTRFODZcdThERThcdTRGODZcdTZFOTBcdThBQ0JcdTZDNDJcdTMwMDJcdThBQ0JcdTkxQ0RcdTY1QjBcdTk1OEIgcG9wdXBcdUZGMENcdTc1NzZcdTZCMEFcdTk2NTBcdTVDMERcdThBNzFcdTY4NDZcdThERjNcdTUxRkFcdTY2NDJcdTYzMDlcdTMwMENcdTUxNDFcdThBMzFcdTMwMERcdTMwMDJcIixcbiAgXCJuZXR3b3JrXCI6ICAgICAgIFwiXHU1RjhDXHU3QUVGXHU1M0VGXHU4MEZEXHU5MDg0XHU2QzkyXHU1NTVGXHU1MkQ1XHUzMDAyXHU4QUNCXHU1N0Y3XHU4ODRDXHVGRjFBPGJyPjxjb2RlPmRvY2tlciBjb21wb3NlIHVwIC1kPC9jb2RlPjxicj5cdTc4QkFcdThBOEQgYmFja2VuZCBcdTVCQjlcdTU2NjhcdThERDFcdThENzdcdTRGODZcdTUxOERcdTkxQ0RcdThBNjZcdTMwMDJcIixcbiAgXCJ0aW1lb3V0XCI6ICAgICAgIFwiNSBcdTc5RDJcdTUxNjdcdTZDOTJcdTY1MzZcdTUyMzBcdTU2REVcdTYxQzkgXHUyMDE0IGJhY2tlbmQgXHU1M0VGXHU4MEZEXHU5MDg0XHU1NzI4XHU1NTVGXHU1MkQ1XHU0RTJEXHVGRjBDXHU3QjQ5IDMwIFx1NzlEMlx1NTE4RFx1NjMwOVx1OTFDRFx1OEE2Nlx1MzAwMlwiLFxuICBcImh0dHBcIjogICAgICAgICAgXCJCYWNrZW5kIFx1NTZERVx1NjFDOVx1OTMyRlx1OEFBNFx1NzJDMFx1NjE0Qlx1NzhCQ1x1MzAwMlx1NkFBMlx1NjdFNSBiYWNrZW5kIFx1NzY4NCBsb2dcdUZGMUE8YnI+PGNvZGU+ZG9ja2VyIGNvbXBvc2UgbG9ncyBiYWNrZW5kPC9jb2RlPlwiLFxuICBcIm5vdC1maGlyXCI6ICAgICAgXCJcdTkwMTlcdTUwMEIgVVJMIFx1NTZERVx1NEU4Nlx1Njc3MVx1ODk3Rlx1RkYwQ1x1NEY0Nlx1NEUwRFx1NjYyRiBGSElSIENhcGFiaWxpdHlTdGF0ZW1lbnRcdTMwMDJcdTc4QkFcdThBOEQgQmFja2VuZCBVUkwgXHU2MzA3XHU1NDExIE5ISS1GSElSLUJyaWRnZSBcdTc2ODQgL2ZoaXIgXHU2ODM5XHU3NkVFXHU5MzA0XHUzMDAyXCIsXG59O1xuXG5mdW5jdGlvbiBfcmVuZGVyQ29ubkJhbm5lcigpIHtcbiAgY29uc3QgYmFubmVyID0gZWxzLmNvbm5CYW5uZXI7XG4gIGlmICghYmFubmVyKSByZXR1cm47XG4gIGJhbm5lci5kYXRhc2V0LnN0YXRlID0gX2Nvbm5TdGF0ZTtcbiAgY29uc3QgbGFiZWwgPSBfQ09OTl9MQUJFTFNbX2Nvbm5TdGF0ZV07XG4gIGVscy5jb25uTXNnLnRleHRDb250ZW50ID0gdHlwZW9mIGxhYmVsID09PSBcImZ1bmN0aW9uXCIgPyBsYWJlbCgpIDogbGFiZWw7XG4gIGVscy5jb25uUmV0cnlCdG4uaGlkZGVuID0gX2Nvbm5TdGF0ZSAhPT0gXCJmYWlsXCI7XG4gIGlmIChfY29ublN0YXRlID09PSBcImZhaWxcIiAmJiBfY29ubkZhaWxSZWFzb24/LmtpbmQpIHtcbiAgICBlbHMuY29ubkhlbHAuaGlkZGVuID0gZmFsc2U7XG4gICAgZWxzLmNvbm5IZWxwLmlubmVySFRNTCA9IF9DT05OX0hFTFBbX2Nvbm5GYWlsUmVhc29uLmtpbmRdID8/IFwiXCI7XG4gIH0gZWxzZSB7XG4gICAgZWxzLmNvbm5IZWxwLmhpZGRlbiA9IHRydWU7XG4gICAgZWxzLmNvbm5IZWxwLmlubmVySFRNTCA9IFwiXCI7XG4gIH1cblxuICAvLyBDb21wYWN0LXBpbGwgdnMgZnVsbC1iYW5uZXIgc3dhcDogd2hlbiBldmVyeXRoaW5nJ3MgZmluZSwgc2hyaW5rIHRvXG4gIC8vIGEgc21hbGwgZ3JlZW4gcGlsbCBpbiB0aGUgaGVhZGVyIHNvIHRoZSBwb3B1cCBib2R5IGhhcyBtb3JlIHJvb21cbiAgLy8gZm9yIGFjdGlvbmFibGUgY29udGVudC4gQW55dGhpbmcgZWxzZSAodW5rbm93biAvIGNoZWNraW5nIC8gZmFpbClcbiAgLy8ga2VlcHMgdGhlIGZ1bGwgYmFubmVyIHNvIHByb2dyZXNzICsgZXJyb3IgaGVscCBoYXMgc3BhY2UgdG8gcmVuZGVyLlxuICBjb25zdCBpc09rID0gX2Nvbm5TdGF0ZSA9PT0gXCJva1wiO1xuICBpZiAoZWxzLmNvbm5TZWN0aW9uKSBlbHMuY29ublNlY3Rpb24uaGlkZGVuID0gaXNPaztcbiAgaWYgKGVscy5jb25uTWluaSkge1xuICAgIGVscy5jb25uTWluaS5oaWRkZW4gPSAhaXNPaztcbiAgICBpZiAoaXNPaykgZWxzLmNvbm5NaW5pLnRpdGxlID0gYFx1NURGMlx1OTAyM1x1N0REQSBcdTIwMTQgJHtlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCl9YDtcbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVmcmVzaEJ1dHRvblN0YXRlcygpIHtcbiAgLy8gU3luYyBidXR0b246IE5ISSB0YWIgcmVxdWlyZWQgKHNldCBlbHNld2hlcmUgdmlhIHN5bmNBcGlCdG4uZGlzYWJsZWQpLlxuICAvLyBJbiBiYWNrZW5kIG1vZGUsIGFkZGl0aW9uYWxseSByZXF1aXJlIGNvbm4gPT09IG9rLlxuICAvLyBJbiBsb2NhbCBtb2RlLCBjb25uIGRvZXNuJ3QgYXBwbHkuXG4gIGNvbnN0IG9uTmhpID0gIWVscy5zeW5jQXBpQnRuLmRhdGFzZXQub2ZmTmhpO1xuICBjb25zdCBtb2RlT2sgPSBjdXJyZW50TW9kZSgpID09PSBcImxvY2FsXCIgfHwgX2Nvbm5TdGF0ZSA9PT0gXCJva1wiO1xuICBlbHMuc3luY0FwaUJ0bi5kaXNhYmxlZCA9ICEob25OaGkgJiYgbW9kZU9rKTtcbiAgZWxzLnN5bmNBcGlCdG4udGl0bGUgPSAhb25OaGlcbiAgICA/IFwiXHU4QUNCXHU1MTQ4XHU1MjA3XHU1MjMwXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU1MjA2XHU5ODAxXHU1MThEXHU1NDBDXHU2QjY1XCJcbiAgICA6ICghbW9kZU9rID8gXCJcdTVGOENcdTdBRUZcdTVDMUFcdTY3MkFcdTkwMjNcdTdEREFcIiA6IFwiXCIpO1xuXG4gIC8vIExhdW5jaCBidXR0b246IGJhY2tlbmQgbW9kZSArIGNvbm4gb2sgKyBwYXRpZW50IHNldCArIGJhY2tlbmRcbiAgLy8gYWN0dWFsbHkgaGFzIHRoaXMgcGF0aWVudCAob3RoZXJ3aXNlIHRoZSBTTUFSVCBhcHAgbGF1bmNoZXMgaW50b1xuICAvLyBhbiBlbXB0eSBGSElSIHN0b3JlIFx1MjAxNCBjb25mdXNpbmcgYmxhbmsgc2NyZWVuKS5cbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgY29uc3QgaGF2ZUJhY2tlbmRQYXRpZW50ID0gX2JhY2tlbmRQYXRpZW50LnN0YXRlID09PSBcInByZXNlbnRcIjtcbiAgZWxzLmxhdW5jaEJ0bi5kaXNhYmxlZCA9ICEoXG4gICAgY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIgJiZcbiAgICBfY29ublN0YXRlID09PSBcIm9rXCIgJiZcbiAgICAhIW92Py5pZF9ubyAmJlxuICAgIGhhdmVCYWNrZW5kUGF0aWVudFxuICApO1xuICBlbHMubGF1bmNoQnRuLnRpdGxlID1cbiAgICBjdXJyZW50TW9kZSgpICE9PSBcImJhY2tlbmRcIiAgPyBcIlx1OEFDQlx1NTIwN1x1NTIzMFx1MzAwQ1x1NEUwQVx1NTBCM1x1NUY4Q1x1N0FFRlx1MzAwRFx1NkEyMVx1NUYwRlwiIDpcbiAgICBfY29ublN0YXRlICE9PSBcIm9rXCIgICAgICAgICAgID8gXCJcdTVGOENcdTdBRUZcdTVDMUFcdTY3MkFcdTkwMjNcdTdEREFcIiA6XG4gICAgIW92Py5pZF9ubyAgICAgICAgICAgICAgICAgICAgPyBcIlx1OEFDQlx1NTE0OFx1NTg2Qlx1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVwiIDpcbiAgICAhaGF2ZUJhY2tlbmRQYXRpZW50ICAgICAgICAgICA/IFwiXHU1RjhDXHU3QUVGXHU1QzFBXHU3MTIxXHU2QjY0XHU3NUM1XHU0RUJBXHU3Njg0XHU4Q0M3XHU2NTk5IFx1MjAxNCBcdThBQ0JcdTUxNDhcdTU0MENcdTZCNjVcdTYyMTZcdTRFMEFcdTUwQjNcdTY3MkNcdTU3MzAgQnVuZGxlXCIgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcIjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdGVzdEJhY2tlbmRDb25uZWN0aW9uKCkge1xuICBjb25zdCB1cmwgPSBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCk7XG4gIGlmICghdXJsKSB7XG4gICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwibm8tdXJsXCIgfTtcbiAgICBfcmVuZGVyQ29ubkJhbm5lcigpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpOyByZXR1cm4gZmFsc2U7XG4gIH1cbiAgX2Nvbm5TdGF0ZSA9IFwiY2hlY2tpbmdcIjsgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDtcbiAgX3JlbmRlckNvbm5CYW5uZXIoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcblxuICBjb25zdCBwZXJtID0gYXdhaXQgZW5zdXJlQmFja2VuZFBlcm1pc3Npb24odXJsKTtcbiAgaWYgKCFwZXJtLm9rKSB7XG4gICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwibm8tcGVybWlzc2lvblwiIH07XG4gICAgX3JlbmRlckNvbm5CYW5uZXIoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTsgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgY3RybCA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IGN0cmwuYWJvcnQoKSwgNTAwMCk7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYCR7dXJsLnJlcGxhY2UoL1xcLyQvLCBcIlwiKX0vZmhpci9tZXRhZGF0YWAsIHsgc2lnbmFsOiBjdHJsLnNpZ25hbCB9KTtcbiAgICBpZiAoIXJlcy5vaykge1xuICAgICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwiaHR0cFwiLCBkZXRhaWw6IHJlcy5zdGF0dXMgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcy5qc29uKCkuY2F0Y2goKCkgPT4gbnVsbCk7XG4gICAgICBpZiAoYm9keT8ucmVzb3VyY2VUeXBlICE9PSBcIkNhcGFiaWxpdHlTdGF0ZW1lbnRcIikge1xuICAgICAgICBfY29ublN0YXRlID0gXCJmYWlsXCI7IF9jb25uRmFpbFJlYXNvbiA9IHsga2luZDogXCJub3QtZmhpclwiIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfY29ublN0YXRlID0gXCJva1wiOyBfY29ubkZhaWxSZWFzb24gPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIF9jb25uU3RhdGUgPSBcImZhaWxcIjtcbiAgICBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgPyBcInRpbWVvdXRcIiA6IFwibmV0d29ya1wiIH07XG4gIH0gZmluYWxseSB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgfVxuXG4gIF9yZW5kZXJDb25uQmFubmVyKCk7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gIC8vIFdoZW5ldmVyIGNvbm5lY3Rpdml0eSBmbGlwcywgcmUtY2hlY2sgd2hldGhlciB0aGlzIHBhdGllbnQgYWxyZWFkeVxuICAvLyBleGlzdHMgb24gYmFja2VuZC4gKFN0YWxlIFwiX2JhY2tlbmRQYXRpZW50XCIgc3RhdGUgd291bGQgb3RoZXJ3aXNlXG4gIC8vIGNhdXNlIExhdW5jaCB0byBsb29rIGVuYWJsZWQgLyBkaXNhYmxlZCB3cm9uZ2x5LilcbiAgaWYgKGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiKSBjaGVja0JhY2tlbmRQYXRpZW50KCk7XG4gIHJldHVybiBfY29ublN0YXRlID09PSBcIm9rXCI7XG59XG5cbmVscy5jb25uUmV0cnlCdG4/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0ZXN0QmFja2VuZENvbm5lY3Rpb24pO1xuXG4vLyBcdTI1MDBcdTI1MDAgQmFja2VuZCBcdTIxOTQgbG9jYWwgZGF0YS1zdGF0ZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBJbmRlcGVuZGVudCBvZiB0aGUgY29ubmVjdGlvbiBiYW5uZXIgKHdoaWNoIG9ubHkgdGVsbHMgdXMgXCJjYW4gd2Vcbi8vIHJlYWNoIHRoZSBiYWNrZW5kXCIpLiBUaGlzIGNhcmQgYW5zd2VycyB0d28gcXVlc3Rpb25zOlxuLy9cbi8vICAgMS4gRG9lcyB0aGUgYmFja2VuZCBhbHJlYWR5IGhhdmUgdGhpcyBwYXRpZW50J3MgZGF0YT9cbi8vICAgICAgXHUyMTkyIGRyaXZlcyB3aGV0aGVyIFx1RDgzRFx1REU4MCBMYXVuY2ggaXMgYWxsb3dlZCBhdCBhbGwgKExhdW5jaCBvbiBhblxuLy8gICAgICAgIGVtcHR5IGJhY2tlbmQgZ2l2ZXMgYSBjb25mdXNpbmcgU01BUlQtYXBwIGJsYW5rKS5cbi8vICAgMi4gRG9lcyB0aGUgdXNlciBoYXZlIGEgbG9jYWwgQnVuZGxlIHRoYXQncyBuZXdlciB0aGFuIHRoZVxuLy8gICAgICBiYWNrZW5kJ3Mgdmlldz9cbi8vICAgICAgXHUyMTkyIG9mZmVyIFwiXHVEODNEXHVEQ0U0IFx1NEUwQVx1NTBCM1x1NjcyQ1x1NTczMCBCdW5kbGUgXHU1MjMwXHU1RjhDXHU3QUVGXCIgdG8gcHVzaCBpdCB2aWEgL2ZoaXIvaW1wb3J0XG4vLyAgICAgICAgd2l0aG91dCByZS1mZXRjaGluZyBOSEkgKGZhc3QsIG5vbi1kZXN0cnVjdGl2ZTogc3RhYmxlIElEc1xuLy8gICAgICAgIHVwc2VydCBzbyBiYWNrZW5kIHJlc291cmNlcyBqdXN0IGJ1bXAgdmVyc2lvbklkKS5cbi8vXG4vLyBXZSBkb24ndCBzZWNvbmQtZ3Vlc3MgdGhlIHVzZXI6IGV2ZW4gd2hlbiBsb2NhbCBpcyBjbGVhcmx5IG5ld2VyLFxuLy8gTGF1bmNoIHN0YXlzIGVuYWJsZWQgaWYgdGhlIGJhY2tlbmQgaGFzIHRoZSBwYXRpZW50IFx1MjAxNCB0aGV5IG1heVxuLy8gZ2VudWluZWx5IHdhbnQgdG8gbG9vayBhdCB0aGUgb2xkZXIgc3RhdGUuIFRoZSBVSSBsYXlzIG91dCBib3RoXG4vLyBzaWRlczsgdXNlciBkZWNpZGVzLlxuXG5sZXQgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJ1bmtub3duXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuLy8gICBzdGF0ZTogXCJ1bmtub3duXCIgfCBcImNoZWNraW5nXCIgfCBcImFic2VudFwiIHwgXCJwcmVzZW50XCIgfCBcImZhaWxcIlxubGV0IF9sb2NhbEJ1bmRsZSA9IHsgZXhpc3RzOiBmYWxzZSwgY291bnQ6IDAsIGdlbmVyYXRlZEF0OiAwLCBwYXRpZW50SWQ6IG51bGwgfTtcblxuZnVuY3Rpb24gX2ZtdFRpbWVTaG9ydChpc28pIHtcbiAgaWYgKCFpc28pIHJldHVybiBcIlwiO1xuICBjb25zdCBkID0gbmV3IERhdGUoaXNvKTtcbiAgaWYgKE51bWJlci5pc05hTihkLmdldFRpbWUoKSkpIHJldHVybiBcIlwiO1xuICBjb25zdCBwYWQgPSAobikgPT4gU3RyaW5nKG4pLnBhZFN0YXJ0KDIsIFwiMFwiKTtcbiAgcmV0dXJuIGAke2QuZ2V0TW9udGgoKSArIDF9LyR7ZC5nZXREYXRlKCl9ICR7cGFkKGQuZ2V0SG91cnMoKSl9OiR7cGFkKGQuZ2V0TWludXRlcygpKX1gO1xufVxuXG5mdW5jdGlvbiBfZm10UmVsYXRpdmUobXMpIHtcbiAgY29uc3QgZGlmZiA9IERhdGUubm93KCkgLSBtcztcbiAgaWYgKGRpZmYgPCA2MF8wMDApIHJldHVybiBgJHtNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGRpZmYgLyAxMDAwKSl9IFx1NzlEMlx1NTI0RGA7XG4gIGlmIChkaWZmIDwgMzYwMF8wMDApIHJldHVybiBgJHtNYXRoLnJvdW5kKGRpZmYgLyA2MF8wMDApfSBcdTUyMDZcdTk0MThcdTUyNERgO1xuICBpZiAoZGlmZiA8IDg2XzQwMF8wMDApIHJldHVybiBgJHtNYXRoLnJvdW5kKGRpZmYgLyAzNjAwXzAwMCl9IFx1NUMwRlx1NjY0Mlx1NTI0RGA7XG4gIHJldHVybiBfZm10VGltZVNob3J0KG5ldyBEYXRlKG1zKS50b0lTT1N0cmluZygpKTtcbn1cblxuZnVuY3Rpb24gX3JlbmRlckRhdGFTdGF0ZSgpIHtcbiAgLy8gU2VjdGlvbiBvbmx5IHZpc2libGUgaW4gYmFja2VuZCBtb2RlIChoYW5kbGVkIGJ5IC5iYWNrZW5kLW9ubHkgQ1NTKSxcbiAgLy8gYnV0IHdlIGFsc28gZXhwbGljaXRseSBoaWRlIHdoZW4gdGhlIHBvcHVwIGhhcyBubyBwYXRpZW50X292ZXJyaWRlXG4gIC8vIHNldCwgc2luY2UgYm90aCBjaGVja3Mga2V5IG9mZiBwYXRpZW50X2lkLlxuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAoY3VycmVudE1vZGUoKSAhPT0gXCJiYWNrZW5kXCIgfHwgIW92Py5pZF9ubykge1xuICAgIGVscy5kYXRhU3RhdGVTZWN0aW9uLmhpZGRlbiA9IHRydWU7XG4gICAgaWYgKGVscy5zeW5jU3RhdHVzSGludCkgZWxzLnN5bmNTdGF0dXNIaW50LmhpZGRlbiA9IHRydWU7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gQ2FyZCBzZXJ2ZXMgYXMgYW4gYWxlcnQsIG5vdCBhIGRhc2hib2FyZCBcdTIwMTQgc2hvdyBvbmx5IHdoZW4gdGhlcmUnc1xuICAvLyBzb21ldGhpbmcgYWN0aW9uYWJsZSAvIHdvcnRoIGZsYWdnaW5nLiBIaWRlIHdoZW46XG4gIC8vICAgLSBiYWNrZW5kIGhhcyB0aGlzIHBhdGllbnQgQU5EIG5vIGxvY2FsIGJ1bmRsZSB0byBjb21wYXJlIGFnYWluc3RcbiAgLy8gICAgIChMYXVuY2ggaXMgZW5hYmxlZCBcdTIxOTIgdGhhdCdzIHRoZSBzaWduYWwgZXZlcnl0aGluZydzIGZpbmUpLCBvclxuICAvLyAgIC0gYm90aCBzaWRlcyBhZ3JlZSBvbiBjb3VudCAoYWxyZWFkeSBpbiBzeW5jLCBubyB1cGxvYWQgbmVlZGVkKS5cbiAgLy8gVGhlIHJlbWFpbmluZyBzdGF0ZXMgKGNoZWNraW5nIC8gZmFpbCAvIGFic2VudCAvIGNvdW50IG1pc21hdGNoKSBhbGxcbiAgLy8gZWl0aGVyIG5lZWQgdXNlciBhdHRlbnRpb24gb3IgYXJlIHRyYW5zaWVudCBsb2FkaW5nIGZlZWRiYWNrLlxuICBjb25zdCBsb2NhbE1hdGNoZXMgPSBfbG9jYWxCdW5kbGUuZXhpc3RzICYmIF9sb2NhbEJ1bmRsZS5wYXRpZW50SWQgPT09IG92LmlkX25vO1xuICBjb25zdCBpblN5bmMgPVxuICAgIF9iYWNrZW5kUGF0aWVudC5zdGF0ZSA9PT0gXCJwcmVzZW50XCIgJiZcbiAgICBsb2NhbE1hdGNoZXMgJiZcbiAgICBfYmFja2VuZFBhdGllbnQuY291bnQgPT09IF9sb2NhbEJ1bmRsZS5jb3VudDtcbiAgLy8gUXVpZXQgXCJcdTI3MTMgXHU1REYyXHU1NDBDXHU2QjY1XCIgaGludCBzaXRzIHVuZGVyIHRoZSBkb3dubG9hZCBidXR0b24gd2hlbiBpbi1zeW5jIFx1MjAxNFxuICAvLyBnaXZlcyB0aGUgdXNlciBhIHRpbnkgYWNrbm93bGVkZ2VtZW50IGluc3RlYWQgb2YgdG90YWwgc2lsZW5jZS5cbiAgaWYgKGVscy5zeW5jU3RhdHVzSGludCkgZWxzLnN5bmNTdGF0dXNIaW50LmhpZGRlbiA9ICFpblN5bmM7XG4gIGNvbnN0IG5vdGhpbmdUb1Nob3cgPVxuICAgIF9iYWNrZW5kUGF0aWVudC5zdGF0ZSA9PT0gXCJwcmVzZW50XCIgJiYgKCFsb2NhbE1hdGNoZXMgfHwgaW5TeW5jKTtcbiAgaWYgKG5vdGhpbmdUb1Nob3cpIHtcbiAgICBlbHMuZGF0YVN0YXRlU2VjdGlvbi5oaWRkZW4gPSB0cnVlO1xuICAgIHJldHVybjtcbiAgfVxuICBlbHMuZGF0YVN0YXRlU2VjdGlvbi5oaWRkZW4gPSBmYWxzZTtcblxuICAvLyBCYWNrZW5kIHJvd1xuICBjb25zdCBicyA9IGVscy5iYWNrZW5kU3RhdGU7XG4gIHN3aXRjaCAoX2JhY2tlbmRQYXRpZW50LnN0YXRlKSB7XG4gICAgY2FzZSBcImNoZWNraW5nXCI6XG4gICAgICBicy5jbGFzc05hbWUgPSBcImRhdGEtc3RhdGUtdmFsdWVcIjtcbiAgICAgIGJzLnRleHRDb250ZW50ID0gXCJcdTZBQTJcdTY3RTVcdTRFMkRcdTIwMjZcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJhYnNlbnRcIjpcbiAgICAgIGJzLmNsYXNzTmFtZSA9IFwiZGF0YS1zdGF0ZS12YWx1ZSBlbXB0eVwiO1xuICAgICAgYnMudGV4dENvbnRlbnQgPSBcIlx1MjZBMCBcdTVDMUFcdTcxMjFcdTZCNjRcdTc1QzVcdTRFQkEgXHUyMDE0IFx1OEFDQlx1NTE0OFx1NjMwOVx1NEUwQlx1NjVCOVx1MzAwQ1x1NTQwQ1x1NkI2NVx1MzAwRFx1NjIxNlx1NEUwQVx1NTBCM1x1NjcyQ1x1NTczMCBCdW5kbGVcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJwcmVzZW50XCI6IHtcbiAgICAgIGNvbnN0IGNvdW50ID0gX2JhY2tlbmRQYXRpZW50LmNvdW50O1xuICAgICAgY29uc3QgdHMgPSBfYmFja2VuZFBhdGllbnQubGFzdFVwZGF0ZWQ7XG4gICAgICBicy5jbGFzc05hbWUgPSBcImRhdGEtc3RhdGUtdmFsdWUgb2tcIjtcbiAgICAgIGJzLnRleHRDb250ZW50ID0gYFx1MjcxMyAke2NvdW50ID4gMCA/IGAke2NvdW50fSBcdTdCNDYgXHUwMEI3IGAgOiBcIlwifVx1NjcwMFx1NUY4Q1x1NjZGNFx1NjVCMCAke19mbXRUaW1lU2hvcnQodHMpIHx8IFwiKHVua25vd24pXCJ9YDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFwiZmFpbFwiOlxuICAgICAgYnMuY2xhc3NOYW1lID0gXCJkYXRhLXN0YXRlLXZhbHVlIGZhaWxcIjtcbiAgICAgIGJzLnRleHRDb250ZW50ID0gXCJcdTI3MTcgXHU2QUEyXHU2N0U1XHU1OTMxXHU2NTU3XHVGRjA4XHU3NzBCXHU5MDIzXHU3RERBIGJhbm5lclx1RkYwOVwiO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGJzLmNsYXNzTmFtZSA9IFwiZGF0YS1zdGF0ZS12YWx1ZVwiO1xuICAgICAgYnMudGV4dENvbnRlbnQgPSBcIlx1MjAxNFwiO1xuICB9XG5cbiAgLy8gTG9jYWwgcm93IFx1MjAxNCBzaG93IG9ubHkgd2hlbiB0aGUgcGVuZGluZyBidW5kbGUgbWF0Y2hlcyB0aGlzIHBhdGllbnQuXG4gIC8vIChsb2NhbE1hdGNoZXMgd2FzIGNvbXB1dGVkIGFib3ZlIGZvciB0aGUgZWFybHktcmV0dXJuIGNoZWNrLilcbiAgaWYgKGxvY2FsTWF0Y2hlcykge1xuICAgIGVscy5sb2NhbFN0YXRlUm93LmhpZGRlbiA9IGZhbHNlO1xuICAgIGVscy5sb2NhbFN0YXRlLmNsYXNzTmFtZSA9IFwiZGF0YS1zdGF0ZS12YWx1ZSBva1wiO1xuICAgIGVscy5sb2NhbFN0YXRlLnRleHRDb250ZW50ID1cbiAgICAgIGBcdTI3MTMgJHtfbG9jYWxCdW5kbGUuY291bnR9IFx1N0I0NiBcdTAwQjcgJHtfZm10UmVsYXRpdmUoX2xvY2FsQnVuZGxlLmdlbmVyYXRlZEF0KX1cdTc1MjJcdTc1MUZgO1xuICB9IGVsc2Uge1xuICAgIGVscy5sb2NhbFN0YXRlUm93LmhpZGRlbiA9IHRydWU7XG4gIH1cblxuICAvLyBcIlx1RDgzRFx1RENFNCBcdTRFMEFcdTUwQjNcdTY3MkNcdTU3MzAgQnVuZGxlXCIgYnV0dG9uIHNob3dzIG9ubHkgd2hlbiB0aGVyZSdzIGEgbG9jYWwgYnVuZGxlXG4gIC8vIGZvciB0aGlzIHBhdGllbnQuIFdlIGRvbid0IHJlYWNoIHRoaXMgYnJhbmNoIHdoZW4gaW4tc3luYyAodGhlXG4gIC8vIHdob2xlIHNlY3Rpb24gZ2V0cyBoaWRkZW4gYWJvdmUpLCBzbyBubyBuZWVkIGZvciBhIHNlcGFyYXRlXG4gIC8vIGRpc2FibGVkIHN0YXRlIFx1MjAxNCB3aGVuIHRoZSBidXR0b24gc2hvd3MsIHVwbG9hZCBpcyBhbHdheXMgbWVhbmluZ2Z1bC5cbiAgZWxzLnB1c2hMb2NhbEJ0bi5oaWRkZW4gPSAhbG9jYWxNYXRjaGVzO1xuICBlbHMucHVzaExvY2FsQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gIGVscy5wdXNoTG9jYWxCdG4udGl0bGUgPSBcIlwiO1xuICBlbHMucHVzaExvY2FsQnRuLnRleHRDb250ZW50ID0gXCJcdUQ4M0RcdURDRTQgXHU2MjhBXHU2NzJDXHU1NzMwIEJ1bmRsZSBcdTRFMEFcdTUwQjNcdTUyMzBcdTVGOENcdTdBRUZcIjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gX3JlZnJlc2hMb2NhbEJ1bmRsZVN0YXRlKCkge1xuICBjb25zdCB7IFtQRU5ESU5HX0JVTkRMRV9LRVldOiBwZW5kaW5nIH0gPVxuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChQRU5ESU5HX0JVTkRMRV9LRVkpO1xuICBfbG9jYWxCdW5kbGUgPSBwZW5kaW5nXG4gICAgPyB7XG4gICAgICAgIGV4aXN0czogdHJ1ZSxcbiAgICAgICAgY291bnQ6IEFycmF5LmlzQXJyYXkoSlNPTi5wYXJzZShwZW5kaW5nLmpzb24pPy5lbnRyeSlcbiAgICAgICAgICA/IEpTT04ucGFyc2UocGVuZGluZy5qc29uKS5lbnRyeS5sZW5ndGhcbiAgICAgICAgICA6IDAsXG4gICAgICAgIGdlbmVyYXRlZEF0OiBwZW5kaW5nLmdlbmVyYXRlZEF0IHx8IDAsXG4gICAgICAgIHBhdGllbnRJZDogcGVuZGluZy5wYXRpZW50SWQgfHwgbnVsbCxcbiAgICAgIH1cbiAgICA6IHsgZXhpc3RzOiBmYWxzZSwgY291bnQ6IDAsIGdlbmVyYXRlZEF0OiAwLCBwYXRpZW50SWQ6IG51bGwgfTtcbiAgX3JlbmRlckRhdGFTdGF0ZSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjaGVja0JhY2tlbmRQYXRpZW50KCkge1xuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAoY3VycmVudE1vZGUoKSAhPT0gXCJiYWNrZW5kXCIgfHwgIW92Py5pZF9ubyB8fCBfY29ublN0YXRlICE9PSBcIm9rXCIpIHtcbiAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcInVua25vd25cIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gICAgX3JlbmRlckRhdGFTdGF0ZSgpO1xuICAgIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwiY2hlY2tpbmdcIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gIF9yZW5kZXJEYXRhU3RhdGUoKTtcblxuICBjb25zdCB1cmwgPSBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCkucmVwbGFjZSgvXFwvJC8sIFwiXCIpO1xuICBjb25zdCBrZXkgPSBlbHMuc3luY0FwaUtleS52YWx1ZS50cmltKCk7XG4gIGNvbnN0IGhlYWRlcnMgPSBrZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjoga2V5IH0gOiB7fTtcbiAgdHJ5IHtcbiAgICBjb25zdCBwciA9IGF3YWl0IGZldGNoKGAke3VybH0vZmhpci9QYXRpZW50LyR7ZW5jb2RlVVJJQ29tcG9uZW50KG92LmlkX25vKX1gLCB7IGhlYWRlcnMgfSk7XG4gICAgaWYgKHByLnN0YXR1cyA9PT0gNDA0KSB7XG4gICAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcImFic2VudFwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgICAgIF9yZW5kZXJEYXRhU3RhdGUoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFwci5vaykge1xuICAgICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJmYWlsXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICAgICAgX3JlbmRlckRhdGFTdGF0ZSgpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwYXRpZW50ID0gYXdhaXQgcHIuanNvbigpO1xuICAgIGNvbnN0IGxhc3RVcGRhdGVkID0gcGF0aWVudD8ubWV0YT8ubGFzdFVwZGF0ZWQgPz8gbnVsbDtcbiAgICAvLyBDb3VudCB2aWEgL2ZoaXIvZXhwb3J0IFx1MjAxNCBzbGlnaHRseSBoZWF2aWVyIGJ1dCBpdCdzIHRoZSBvbmx5XG4gICAgLy8gb2ZmLXRoZS1zaGVsZiB3YXkgdG8gZ2V0IHRvdGFsIHJlc291cmNlcyBmb3IgYSBwYXRpZW50LiBDYXAgYnlcbiAgICAvLyA1cyB0aW1lb3V0IHNvIGEgc2xvdyBiYWNrZW5kIGRvZXNuJ3QgbG9jayB0aGUgcG9wdXAgZm9yZXZlci5cbiAgICBsZXQgY291bnQgPSAwO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjdHJsID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IGN0cmwuYWJvcnQoKSwgNTAwMCk7XG4gICAgICBjb25zdCBlciA9IGF3YWl0IGZldGNoKGAke3VybH0vZmhpci9leHBvcnQ/cGF0aWVudD0ke2VuY29kZVVSSUNvbXBvbmVudChvdi5pZF9ubyl9YCwge1xuICAgICAgICBoZWFkZXJzLCBzaWduYWw6IGN0cmwuc2lnbmFsLFxuICAgICAgfSk7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgaWYgKGVyLm9rKSB7XG4gICAgICAgIGNvbnN0IGJ1bmRsZSA9IGF3YWl0IGVyLmpzb24oKTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYnVuZGxlLmVudHJ5KSkgY291bnQgPSBidW5kbGUuZW50cnkubGVuZ3RoO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggeyAvKiBsZWF2ZSBjb3VudCA9IDA7IG5vdCBmYXRhbCAqLyB9XG4gICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJwcmVzZW50XCIsIGNvdW50LCBsYXN0VXBkYXRlZCB9O1xuICB9IGNhdGNoIChfZSkge1xuICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwiZmFpbFwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgfVxuICBfcmVuZGVyRGF0YVN0YXRlKCk7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHB1c2hMb2NhbEJ1bmRsZVRvQmFja2VuZCgpIHtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgaWYgKCFvdj8uaWRfbm8gfHwgIV9sb2NhbEJ1bmRsZS5leGlzdHMgfHwgX2xvY2FsQnVuZGxlLnBhdGllbnRJZCAhPT0gb3YuaWRfbm8pIHJldHVybjtcbiAgY29uc3QgdXJsID0gZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpLnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcbiAgY29uc3Qga2V5ID0gZWxzLnN5bmNBcGlLZXkudmFsdWUudHJpbSgpO1xuICBjb25zdCBoZWFkZXJzID0ge1xuICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgIC4uLihrZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjoga2V5IH0gOiB7fSksXG4gIH07XG4gIGVscy5wdXNoTG9jYWxCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICBlbHMucHVzaExvY2FsQnRuLnRleHRDb250ZW50ID0gXCJcdTRFMEFcdTUwQjNcdTRFMkRcdTIwMjZcIjtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IFtQRU5ESU5HX0JVTkRMRV9LRVldOiBwZW5kaW5nIH0gPVxuICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFBFTkRJTkdfQlVORExFX0tFWSk7XG4gICAgaWYgKCFwZW5kaW5nPy5qc29uKSB0aHJvdyBuZXcgRXJyb3IoXCJubyBsb2NhbCBidW5kbGVcIik7XG4gICAgY29uc3QgciA9IGF3YWl0IGZldGNoKGAke3VybH0vZmhpci9pbXBvcnRgLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLCBoZWFkZXJzLCBib2R5OiBwZW5kaW5nLmpzb24sXG4gICAgfSk7XG4gICAgaWYgKCFyLm9rKSB7XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgci50ZXh0KCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyLnN0YXR1c306ICR7dGV4dC5zbGljZSgwLCAxMjApfWApO1xuICAgIH1cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByLmpzb24oKTtcbiAgICBzZXRTdGF0dXMoYFx1MjcwNSBcdTVERjJcdTRFMEFcdTUwQjMgJHtyZXN1bHQuaW1wb3J0ZWQgPz8gXCI/XCJ9IFx1N0I0Nlx1NTIzMFx1NUY4Q1x1N0FFRmAsIFwic3VjY2Vzc1wiKTtcbiAgICBhd2FpdCBjaGVja0JhY2tlbmRQYXRpZW50KCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBzZXRTdGF0dXMoYFx1MjZENCBcdTRFMEFcdTUwQjNcdTU5MzFcdTY1NTdcdUZGMUEke2UubWVzc2FnZX1gLCBcImVycm9yXCIpO1xuICB9IGZpbmFsbHkge1xuICAgIC8vIF9yZW5kZXJEYXRhU3RhdGUoKSAoYWxyZWFkeSBjYWxsZWQgZnJvbSBjaGVja0JhY2tlbmRQYXRpZW50IG9uXG4gICAgLy8gc3VjY2VzcykgZGVjaWRlcyB0aGUgcmlnaHQgZGlzYWJsZWQgc3RhdGUgKyBsYWJlbCBiYXNlZCBvblxuICAgIC8vIHdoZXRoZXIgYmFja2VuZCBhbmQgbG9jYWwgYWdyZWUuIENhbGwgaXQgaGVyZSB0b28gdG8gY292ZXIgdGhlXG4gICAgLy8gZmFpbHVyZSBwYXRoIHRoYXQgc2tpcHBlZCBjaGVja0JhY2tlbmRQYXRpZW50LlxuICAgIF9yZW5kZXJEYXRhU3RhdGUoKTtcbiAgfVxufVxuXG5lbHMucHVzaExvY2FsQnRuPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcHVzaExvY2FsQnVuZGxlVG9CYWNrZW5kKTtcblxuLy8gTG9jYWwgYnVuZGxlIHN0YXRlIGNoYW5nZXMgd2hlbmV2ZXIgdGhlIFNXIHN0YXNoZXMgYSBuZXcgc3luYy5cbmNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlcywgYXJlYSkgPT4ge1xuICBpZiAoYXJlYSA9PT0gXCJsb2NhbFwiICYmIFBFTkRJTkdfQlVORExFX0tFWSBpbiBjaGFuZ2VzKSBfcmVmcmVzaExvY2FsQnVuZGxlU3RhdGUoKTtcbn0pO1xuXG4vLyBcdTI1MDBcdTI1MDAgU3luYyBtb2RlIChsb2NhbCB8IGJhY2tlbmQpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuYXN5bmMgZnVuY3Rpb24gbG9hZFN5bmNNb2RlKCkge1xuICBjb25zdCB7IHN5bmNNb2RlIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChcInN5bmNNb2RlXCIpO1xuICBjb25zdCBtb2RlID0gc3luY01vZGUgPT09IFwiYmFja2VuZFwiID8gXCJiYWNrZW5kXCIgOiBERUZBVUxUX01PREU7XG4gIGZvciAoY29uc3QgciBvZiBlbHMubW9kZVJhZGlvcygpKSByLmNoZWNrZWQgPSByLnZhbHVlID09PSBtb2RlO1xuICBkb2N1bWVudC5ib2R5LmRhdGFzZXQubW9kZSA9IG1vZGU7XG4gIGlmIChtb2RlID09PSBcImJhY2tlbmRcIikge1xuICAgIC8vIEF1dG8tdGVzdCBvbiBvcGVuIHNvIHRoZSB1c2VyIHNlZXMgc3RhdHVzIHdpdGhvdXQgY2xpY2tpbmcuIEF3YWl0aW5nXG4gICAgLy8gaGVyZSBzZXJpYWxpemVzIHRoZSByZXN0IG9mIGluaXQoKSB1bnRpbCB3ZSBrbm93IHRoZSBhbnN3ZXIuXG4gICAgYXdhaXQgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCk7XG4gIH0gZWxzZSB7XG4gICAgX2Nvbm5TdGF0ZSA9IFwidW5rbm93blwiOyBfY29ubkZhaWxSZWFzb24gPSBudWxsO1xuICAgIF9yZW5kZXJDb25uQmFubmVyKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3VycmVudE1vZGUoKSB7XG4gIGZvciAoY29uc3QgciBvZiBlbHMubW9kZVJhZGlvcygpKSBpZiAoci5jaGVja2VkKSByZXR1cm4gci52YWx1ZTtcbiAgcmV0dXJuIERFRkFVTFRfTU9ERTtcbn1cblxuZm9yIChjb25zdCByIG9mIGVscy5tb2RlUmFkaW9zKCkpIHtcbiAgci5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgICBjb25zdCBtb2RlID0gY3VycmVudE1vZGUoKTtcbiAgICBkb2N1bWVudC5ib2R5LmRhdGFzZXQubW9kZSA9IG1vZGU7XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBzeW5jTW9kZTogbW9kZSB9KTtcbiAgICBpZiAobW9kZSA9PT0gXCJiYWNrZW5kXCIpIHtcbiAgICAgIHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpOyAvLyB0cmlnZ2VycyBjaGVja0JhY2tlbmRQYXRpZW50IG9uIHN1Y2Nlc3NcbiAgICB9IGVsc2Uge1xuICAgICAgX2Nvbm5TdGF0ZSA9IFwidW5rbm93blwiOyBfY29ubkZhaWxSZWFzb24gPSBudWxsO1xuICAgICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJ1bmtub3duXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICAgICAgX3JlbmRlckNvbm5CYW5uZXIoKTsgX3JlbmRlckRhdGFTdGF0ZSgpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgIH1cbiAgfSk7XG59XG5cbmVscy5iYWNrZW5kVXJsLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IGJhY2tlbmRVcmw6IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKSB9KTtcbiAgZWxzLmRhc2hib2FyZExpbmsuaHJlZiA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnJlcGxhY2UoLzo4MDEwLiokLywgXCI6MzAxMFwiKTtcbiAgaWYgKGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiKSB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKTtcbn0pO1xuZWxzLnN5bmNBcGlLZXkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgc3luY0FwaUtleTogZWxzLnN5bmNBcGlLZXkudmFsdWUudHJpbSgpIH0pO1xufSk7XG4vLyBTaWRlYmFyIFwiXHVEODNEXHVEQ0NCIFx1NTJBOVx1NzQwNlwiIHRvZ2dsZSBcdTIwMTQgcGVyc2lzdHMgaW4gY2hyb21lLnN0b3JhZ2Uuc3luYyBzbyB0aGVcbi8vIHByZWZlcmVuY2UgaXMgc3RpY2t5IGFjcm9zcyByZWluc3RhbGxzLiBzaWRlYmFyLmpzIGxpc3RlbnMgdG8gdGhlXG4vLyBzYW1lIGtleSBhbmQgaGlkZXMgaXRzZWxmIHdoZW4gc2V0IHRvIGZhbHNlLlxuYXN5bmMgZnVuY3Rpb24gbG9hZFNpZGViYXJFbmFibGVkKCkge1xuICBjb25zdCB7IHNpZGViYXJFbmFibGVkIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChcInNpZGViYXJFbmFibGVkXCIpO1xuICBlbHMuc2lkZWJhckVuYWJsZWQuY2hlY2tlZCA9IHNpZGViYXJFbmFibGVkICE9PSBmYWxzZTsgLy8gZGVmYXVsdCBPTlxufVxuXG5lbHMuc2lkZWJhckVuYWJsZWQ/LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHNpZGViYXJFbmFibGVkOiBlbHMuc2lkZWJhckVuYWJsZWQuY2hlY2tlZCB9KTtcbn0pO1xuXG5lbHMuc21hcnRBcHBVcmwuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gIC8vIFBlcnNpc3QgdHJpbW1lZCB2YWx1ZS4gRW1wdHkgc3RyaW5nIFx1MjE5MiByZXN0b3JlIGRlZmF1bHQgb24gbmV4dCBsb2FkLlxuICBjb25zdCB2ID0gZWxzLnNtYXJ0QXBwVXJsLnZhbHVlLnRyaW0oKTtcbiAgaWYgKHYpIHtcbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHNtYXJ0QXBwTGF1bmNoVXJsOiB2IH0pO1xuICB9IGVsc2Uge1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMucmVtb3ZlKFwic21hcnRBcHBMYXVuY2hVcmxcIik7XG4gICAgZWxzLnNtYXJ0QXBwVXJsLnZhbHVlID0gREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIO1xuICB9XG59KTtcblxuZnVuY3Rpb24gc2V0U3RhdHVzKHRleHQsIGtpbmQsIGJyZWFrZG93bikge1xuICAvLyBCdWlsZCB3aXRoIERPTSBBUEkgXHUyMDE0IGF2b2lkcyBpbm5lckhUTUwgLyBYU1Mgcmlzay5cbiAgLy8gYnJlYWtkb3duIGlzIGFuIGFycmF5IG9mIG1peGVkIGVudHJpZXM6XG4gIC8vICAgLSBwaGFzZSB0aW1pbmdzIHByZWZpeGVkIHdpdGggXCJcdTIzRjFcIiAgXHUyMTkyIFx1OTY4RVx1NkJCNVx1ODAxN1x1NjY0MlxuICAvLyAgIC0gcGVyLWVuZHBvaW50IGNvdW50cyAgICAgICAgICAgICAgICBcdTIxOTIgXHU1NDA0IGVuZHBvaW50IFx1NjI5M1x1NTIzMFx1NUU3RVx1N0I0NlxuICAvLyBCb3RoIGtpbmRzIGFyZSB0dWNrZWQgaW5zaWRlIGEgc2luZ2xlIFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCIgdG9nZ2xlIHNvIHRoZVxuICAvLyBwb3B1cCBzdGF5cyBjb21wYWN0IGJ5IGRlZmF1bHQuXG4gIGVscy5zdGF0dXMuY2xhc3NOYW1lID0ga2luZCB8fCBcIlwiO1xuICBlbHMuc3RhdHVzLnRleHRDb250ZW50ID0gXCJcIjtcbiAgaWYgKCF0ZXh0ICYmICEoYnJlYWtkb3duICYmIGJyZWFrZG93bi5sZW5ndGgpKSByZXR1cm47XG4gIGVscy5zdGF0dXMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCB8fCBcIlwiKSk7XG4gIGlmIChicmVha2Rvd24gJiYgYnJlYWtkb3duLmxlbmd0aCkge1xuICAgIGNvbnN0IHBoYXNlUm93cyA9IGJyZWFrZG93bi5maWx0ZXIoKGIpID0+IGIuc3RhcnRzV2l0aChcIlx1MjNGMVwiKSk7XG4gICAgY29uc3Qgb3RoZXJSb3dzID0gYnJlYWtkb3duLmZpbHRlcigoYikgPT4gIWIuc3RhcnRzV2l0aChcIlx1MjNGMVwiKSk7XG5cbiAgICBjb25zdCBkZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRldGFpbHNcIik7XG4gICAgZGV0YWlscy5jbGFzc05hbWUgPSBcInN0YXR1cy1kZXRhaWxcIjtcbiAgICBjb25zdCBzdW1tYXJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN1bW1hcnlcIik7XG4gICAgc3VtbWFyeS50ZXh0Q29udGVudCA9IFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCI7XG4gICAgZGV0YWlscy5hcHBlbmRDaGlsZChzdW1tYXJ5KTtcblxuICAgIGlmIChwaGFzZVJvd3MubGVuZ3RoKSB7XG4gICAgICBjb25zdCBwaGFzZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgcGhhc2VzLmNsYXNzTmFtZSA9IFwic3RhdHVzLXBoYXNlc1wiO1xuICAgICAgcGhhc2VzLnRleHRDb250ZW50ID0gcGhhc2VSb3dzLm1hcCgocCkgPT4gcC5yZXBsYWNlKC9eXHUyM0YxXFxzKi8sIFwiXCIpKS5qb2luKFwiIFx1MDBCNyBcIik7XG4gICAgICBkZXRhaWxzLmFwcGVuZENoaWxkKHBoYXNlcyk7XG4gICAgfVxuICAgIGlmIChvdGhlclJvd3MubGVuZ3RoKSB7XG4gICAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGJvZHkuY2xhc3NOYW1lID0gXCJzdGF0dXMtYnJlYWtkb3duXCI7XG4gICAgICBib2R5LnRleHRDb250ZW50ID0gb3RoZXJSb3dzLmpvaW4oXCIgXHUwMEI3IFwiKTtcbiAgICAgIGRldGFpbHMuYXBwZW5kQ2hpbGQoYm9keSk7XG4gICAgfVxuICAgIGVscy5zdGF0dXMuYXBwZW5kQ2hpbGQoZGV0YWlscyk7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QWN0aXZlVGFiKCkge1xuICBjb25zdCBbdGFiXSA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0pO1xuICByZXR1cm4gdGFiO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUGVuZGluZyBGSElSIEJ1bmRsZSAobG9jYWwtbW9kZSByZXN1bHQpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIEJhY2tncm91bmQgc3Rhc2hlcyB0aGUgZ2VuZXJhdGVkIEJ1bmRsZSBpbnRvIGNocm9tZS5zdG9yYWdlLmxvY2FsXG4vLyB1bmRlciBgcGVuZGluZ0ZoaXJCdW5kbGVgLiBQb3B1cCByZW5kZXJzIGEgZG93bmxvYWQgYnV0dG9uLiBVc2VyIG11c3Rcbi8vIGNsaWNrIHRvIGFjdHVhbGx5IHRyaWdnZXIgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCBcdTIwMTQgdGhlIGZpbGUgbmV2ZXJcbi8vIGhpdHMgdGhlIGRpc2sgdW5zb2xpY2l0ZWQuXG5cbmZ1bmN0aW9uIF9mbXRCeXRlcyhuKSB7XG4gIGlmIChuIDwgMTAyNCkgcmV0dXJuIGAke259IEJgO1xuICBpZiAobiA8IDEwMjQgKiAxMDI0KSByZXR1cm4gYCR7KG4gLyAxMDI0KS50b0ZpeGVkKDEpfSBLQmA7XG4gIHJldHVybiBgJHsobiAvICgxMDI0ICogMTAyNCkpLnRvRml4ZWQoMil9IE1CYDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVmcmVzaFBlbmRpbmdCdW5kbGUoKSB7XG4gIGNvbnN0IHsgW1BFTkRJTkdfQlVORExFX0tFWV06IHBlbmRpbmcgfSA9XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFBFTkRJTkdfQlVORExFX0tFWSk7XG4gIGlmICghcGVuZGluZyB8fCAhcGVuZGluZy5qc29uKSB7XG4gICAgZWxzLnBlbmRpbmdCdW5kbGUuaGlkZGVuID0gdHJ1ZTtcbiAgICByZXR1cm47XG4gIH1cbiAgZWxzLnBlbmRpbmdCdW5kbGUuaGlkZGVuID0gZmFsc2U7XG4gIGNvbnN0IGFnbyA9IHBlbmRpbmcuZ2VuZXJhdGVkQXRcbiAgICA/IGAke01hdGgubWF4KDEsIE1hdGgucm91bmQoKERhdGUubm93KCkgLSBwZW5kaW5nLmdlbmVyYXRlZEF0KSAvIDEwMDApKX0gXHU3OUQyXHU1MjREYFxuICAgIDogXCJcIjtcbiAgZWxzLmJ1bmRsZU1ldGEudGV4dENvbnRlbnQgPSBgJHtwZW5kaW5nLmZpbGVuYW1lfSBcdTAwQjcgJHtfZm10Qnl0ZXMocGVuZGluZy5ieXRlcyB8fCAwKX0ke2FnbyA/IGAgXHUwMEI3ICR7YWdvfWAgOiBcIlwifWA7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGRvd25sb2FkUGVuZGluZ0J1bmRsZSgpIHtcbiAgY29uc3QgeyBbUEVORElOR19CVU5ETEVfS0VZXTogcGVuZGluZyB9ID1cbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoUEVORElOR19CVU5ETEVfS0VZKTtcbiAgaWYgKCFwZW5kaW5nKSByZXR1cm47XG4gIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbcGVuZGluZy5qc29uXSwgeyB0eXBlOiBcImFwcGxpY2F0aW9uL2ZoaXIranNvblwiIH0pO1xuICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICB0cnkge1xuICAgIGF3YWl0IGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQoeyB1cmwsIGZpbGVuYW1lOiBwZW5kaW5nLmZpbGVuYW1lLCBzYXZlQXM6IGZhbHNlIH0pO1xuICB9IGZpbmFsbHkge1xuICAgIC8vIFJlbGVhc2UgYWZ0ZXIgYSB0aWNrIHNvIHRoZSBkb3dubG9hZCBoYXMgdGltZSB0byBzdGFydC5cbiAgICBzZXRUaW1lb3V0KCgpID0+IFVSTC5yZXZva2VPYmplY3RVUkwodXJsKSwgNTAwMCk7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gY2xlYXJQZW5kaW5nQnVuZGxlKCkge1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5yZW1vdmUoUEVORElOR19CVU5ETEVfS0VZKTtcbiAgYXdhaXQgcmVmcmVzaFBlbmRpbmdCdW5kbGUoKTtcbn1cblxuZWxzLmRvd25sb2FkQnVuZGxlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBkb3dubG9hZFBlbmRpbmdCdW5kbGUpO1xuZWxzLmNsZWFyQnVuZGxlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGVhclBlbmRpbmdCdW5kbGUpO1xuXG4vLyBMaXZlIHVwZGF0ZSB3aGVuIGJhY2tncm91bmQgc3Rhc2hlcyBhIG5ldyBidW5kbGUgd2hpbGUgcG9wdXAgaXMgb3Blbi5cbi8vIChOb3RlOiBhbm90aGVyIG9uQ2hhbmdlZCBsaXN0ZW5lciBlYXJsaWVyIGluIHRoZSBmaWxlIHJlZnJlc2hlcyB0aGVcbi8vIGRhdGEtc3RhdGUgY2FyZDsgd2UgbGVhdmUgdGhhdCBvbmUgc2VwYXJhdGUgc28gZmFpbHVyZSBvZiBlaXRoZXIgcGF0aFxuLy8gZG9lc24ndCB0YWtlIHRoZSBvdGhlciBkb3duLilcbmNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlcywgYXJlYSkgPT4ge1xuICBpZiAoYXJlYSA9PT0gXCJsb2NhbFwiICYmIFBFTkRJTkdfQlVORExFX0tFWSBpbiBjaGFuZ2VzKSByZWZyZXNoUGVuZGluZ0J1bmRsZSgpO1xufSk7XG5cbi8vIFx1MjUwMFx1MjUwMCBcdTI0RDggSGVscC1pY29uIHRvb2x0aXAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gT25lIHNoYXJlZCA8ZGl2PiBhcHBlbmRlZCB0byB0aGUgcG9wdXAgYm9keS4gT24gaG92ZXIgb2YgYW55XG4vLyAuaGVscC1pY29uLCB3ZSBjb3B5IGl0cyBkYXRhLXRpcCB0ZXh0IGFuZCBwb3NpdGlvbiB0aGUgdG9vbHRpcFxuLy8gaW5zaWRlIHRoZSBwb3B1cCwgY2xhbXBpbmcgdG8gaXRzIHZpZXdwb3J0IHNvIGl0IGNhbid0IGNsaXAgb2ZmXG4vLyBlaXRoZXIgZWRnZSByZWdhcmRsZXNzIG9mIHdoZXJlIHRoZSBpY29uIHNpdHMuIChDU1MgcHNldWRvLWVsZW1lbnRzXG4vLyBjYW4ndCBiZSBtZWFzdXJlZCwgc28gYSBwdXJlLUNTUyBhcHByb2FjaCBpbmV2aXRhYmx5IHBpY2tzIG9uZVxuLy8gYW5jaG9yIHNpZGUgYW5kIGJyZWFrcyBmb3IgaWNvbnMgb24gdGhlIG90aGVyIHNpZGUgb2YgdGhlIHBvcHVwLilcbmNvbnN0IF9oZWxwVGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbl9oZWxwVGlwLmNsYXNzTmFtZSA9IFwiaGVscC10b29sdGlwXCI7XG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKF9oZWxwVGlwKTtcblxuY29uc3QgVklFV1BPUlRfTUFSR0lOID0gNjsgLy8ga2VlcCB0aGlzIG1hbnkgcHggY2xlYXIgb2YgcG9wdXAgZWRnZXNcblxuZnVuY3Rpb24gX3Nob3dIZWxwVG9vbHRpcChpY29uKSB7XG4gIF9oZWxwVGlwLnRleHRDb250ZW50ID0gaWNvbi5kYXRhc2V0LnRpcCB8fCBpY29uLmdldEF0dHJpYnV0ZShcImRhdGEtdGlwXCIpIHx8IFwiXCI7XG4gIF9oZWxwVGlwLmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpO1xuXG4gIC8vIE1lYXN1cmUgbm93IHRoYXQgY29udGVudCBpcyBzZXQuXG4gIGNvbnN0IGljb25SZWN0ID0gaWNvbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgdGlwUmVjdCA9IF9oZWxwVGlwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCB2aWV3cG9ydFcgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGg7XG4gIGNvbnN0IHZpZXdwb3J0SCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XG5cbiAgLy8gSG9yaXpvbnRhbDogcHJlZmVyIGNlbnRlcmVkIG9uIHRoZSBpY29uOyBjbGFtcCBpbnRvIFttYXJnaW4sIHZ3LXRpcC1tYXJnaW5dLlxuICBsZXQgbGVmdCA9IGljb25SZWN0LmxlZnQgKyBpY29uUmVjdC53aWR0aCAvIDIgLSB0aXBSZWN0LndpZHRoIC8gMjtcbiAgaWYgKGxlZnQgPCBWSUVXUE9SVF9NQVJHSU4pIGxlZnQgPSBWSUVXUE9SVF9NQVJHSU47XG4gIGlmIChsZWZ0ICsgdGlwUmVjdC53aWR0aCA+IHZpZXdwb3J0VyAtIFZJRVdQT1JUX01BUkdJTikge1xuICAgIGxlZnQgPSB2aWV3cG9ydFcgLSBWSUVXUE9SVF9NQVJHSU4gLSB0aXBSZWN0LndpZHRoO1xuICB9XG4gIC8vIFZlcnRpY2FsOiBwcmVmZXIgYWJvdmUgdGhlIGljb247IGZsaXAgYmVsb3cgaWYgdGhlcmUncyBubyByb29tIHVwIHRvcC5cbiAgbGV0IHRvcCA9IGljb25SZWN0LnRvcCAtIHRpcFJlY3QuaGVpZ2h0IC0gNjtcbiAgaWYgKHRvcCA8IFZJRVdQT1JUX01BUkdJTikgdG9wID0gaWNvblJlY3QuYm90dG9tICsgNjtcbiAgLy8gRmluYWwgc2FmZXR5OiBjbGFtcCBpbnRvIHZpZXdwb3J0IHNvIHZlcnkgbG9uZyB0b29sdGlwcyBjYW4ndCBibGVlZFxuICAvLyBvZmYgdGhlIGJvdHRvbSBlaXRoZXIuXG4gIGlmICh0b3AgKyB0aXBSZWN0LmhlaWdodCA+IHZpZXdwb3J0SCAtIFZJRVdQT1JUX01BUkdJTikge1xuICAgIHRvcCA9IE1hdGgubWF4KFZJRVdQT1JUX01BUkdJTiwgdmlld3BvcnRIIC0gVklFV1BPUlRfTUFSR0lOIC0gdGlwUmVjdC5oZWlnaHQpO1xuICB9XG5cbiAgX2hlbHBUaXAuc3R5bGUubGVmdCA9IGAke2xlZnR9cHhgO1xuICBfaGVscFRpcC5zdHlsZS50b3AgPSBgJHt0b3B9cHhgO1xufVxuXG5mdW5jdGlvbiBfaGlkZUhlbHBUb29sdGlwKCkge1xuICBfaGVscFRpcC5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbn1cblxuLy8gRGVsZWdhdGVkIGhvdmVyIGhhbmRsZXJzIFx1MjAxNCB3b3JrcyBmb3IgaWNvbnMgYWRkZWQgYWZ0ZXIgcG9wdXAgbG9hZCB0b29cbi8vIChlLmcuIHdoZW4gbW9kZSB0b2dnbGUgcmV2ZWFscyBiYWNrZW5kLW9ubHkgZmllbGRzKS5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgKGUpID0+IHtcbiAgY29uc3QgaWNvbiA9IGUudGFyZ2V0LmNsb3Nlc3Q/LihcIi5oZWxwLWljb25cIik7XG4gIGlmIChpY29uKSBfc2hvd0hlbHBUb29sdGlwKGljb24pO1xufSk7XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgKGUpID0+IHtcbiAgY29uc3QgaWNvbiA9IGUudGFyZ2V0LmNsb3Nlc3Q/LihcIi5oZWxwLWljb25cIik7XG4gIGlmIChpY29uKSBfaGlkZUhlbHBUb29sdGlwKCk7XG59KTtcblxuYXN5bmMgZnVuY3Rpb24gaW5pdCgpIHtcbiAgYXdhaXQgbG9hZFNpZGViYXJFbmFibGVkKCk7XG5cbiAgLy8gU2VlZCBsb2NhbCBidW5kbGUgc3RhdGUgZnJvbSBzdG9yYWdlIHNvIHRoZSBkYXRhLXN0YXRlIGNhcmQgaXNcbiAgLy8gcG9wdWxhdGVkIGFzIHNvb24gYXMgdGhlIHBvcHVwIHJlbmRlcnMgKG5vIGZsYXNoIG9mIFwiXHU2NzJBXHU3NTIyXHU3NTFGXCIpLlxuICBhd2FpdCBfcmVmcmVzaExvY2FsQnVuZGxlU3RhdGUoKTtcblxuICAvLyBPcmRlciBtYXR0ZXJzOiBsb2FkQmFja2VuZFVybCBwb3B1bGF0ZXMgZWxzLmJhY2tlbmRVcmwudmFsdWUsIHdoaWNoXG4gIC8vIGxvYWRTeW5jTW9kZSgpIHJlYWRzIHZpYSB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKS4gUmV2ZXJzZSB0aGlzIGFuZFxuICAvLyB0aGUgYXV0by10ZXN0IHNlZXMgYW4gZW1wdHkgVVJMIGFuZCBmYWxzZWx5IHJlcG9ydHMgXCJcdTY3MkFcdThBMkRcdTVCOUEgQmFja2VuZCBVUkxcIlxuICAvLyBvbiBldmVyeSBwb3B1cCBvcGVuLlxuICBhd2FpdCBsb2FkQmFja2VuZFVybCgpO1xuICBhd2FpdCBsb2FkU3luY01vZGUoKTtcbiAgYXdhaXQgbG9hZFBhdGllbnRPdmVycmlkZSgpO1xuICBhd2FpdCByZWZyZXNoUGVuZGluZ0J1bmRsZSgpO1xuXG4gIGNvbnN0IHRhYiA9IGF3YWl0IGdldEFjdGl2ZVRhYigpO1xuICBpZiAoIXRhYj8udXJsKSB7XG4gICAgc2V0U3RhdHVzKFwibm8gYWN0aXZlIHRhYlwiLCBcImVycm9yXCIpO1xuICAgIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQub2ZmTmhpID0gXCIxXCI7XG4gICAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBTeW5jIHJlcXVpcmVzIGJlaW5nIG9uIGFuIE5ISSB0YWIgc28gY29va2llcy9zZXNzaW9uIGFyZSB1c2FibGUgZnJvbVxuICAvLyB0aGUgU1cuIEZsYWcgdmlhIGRhdGFzZXQgc28gX3JlZnJlc2hCdXR0b25TdGF0ZXMgY2FuIGNvbWJpbmUgdGhpc1xuICAvLyB3aXRoIHRoZSBtb2RlICsgY29ubiBzdGF0ZS5cbiAgaWYgKGlzTmhpVGFiKHRhYi51cmwpKSBkZWxldGUgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGk7XG4gIGVsc2UgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGkgPSBcIjFcIjtcbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcblxuICAvLyBSZS1hdHRhY2ggdG8gYW55IHN5bmMgdGhhdCdzIGN1cnJlbnRseSBydW5uaW5nIGluIHRoZSBzZXJ2aWNlIHdvcmtlci5cbiAgLy8gVGhpcyBpcyB3aGF0IGxldHMgdGhlIHVzZXIgY2xvc2UgKyByZW9wZW4gdGhlIHBvcHVwIG1pZC1zeW5jLlxuICBhd2FpdCByZWZyZXNoU3luY1N0YXR1c0Zyb21CYWNrZ3JvdW5kKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlZnJlc2hTeW5jU3RhdHVzRnJvbUJhY2tncm91bmQoKSB7XG4gIGNvbnN0IHN0YXR1cyA9IGF3YWl0IGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJnZXRTeW5jU3RhdHVzXCIgfSkuY2F0Y2goKCkgPT4gbnVsbCk7XG4gIGlmICghc3RhdHVzKSByZXR1cm47XG4gIGFwcGx5U3luY1N0YXR1cyhzdGF0dXMpO1xufVxuXG4vLyBMYXRlc3Qgc3RhdHVzIHNuYXBzaG90IFx1MjAxNCBrZWVwaW5nIGl0IGxldHMgdGhlIGxpdmUtZWxhcHNlZCB0aWNrZXJcbi8vIHJlcGFpbnQgdGhlIHNhbWUgcHJvZ3Jlc3MgdGV4dCB3aXRoIGFuIHVwZGF0ZWQgYFtOc11gIHByZWZpeCBldmVyeVxuLy8gc2Vjb25kIHdpdGhvdXQgc3BhbW1pbmcgY2hyb21lLnN0b3JhZ2UgZnJvbSB0aGUgc2VydmljZSB3b3JrZXIuXG5sZXQgX2xhdGVzdFN0YXR1cyA9IG51bGw7XG5sZXQgX2VsYXBzZWRUaWNrZXJJZCA9IG51bGw7XG5cbmZ1bmN0aW9uIF9mbXRFbGFwc2VkKG1zKSB7XG4gIGlmIChtcyA8IDYwXzAwMCkgcmV0dXJuIGAke01hdGguZmxvb3IobXMgLyAxMDAwKX1zYDtcbiAgcmV0dXJuIGAke01hdGguZmxvb3IobXMgLyA2MF8wMDApfW0ke01hdGgucm91bmQoKG1zICUgNjBfMDAwKSAvIDEwMDApfXNgO1xufVxuXG5mdW5jdGlvbiBfcmVuZGVyU3RhdHVzKCkge1xuICBjb25zdCBzdGF0dXMgPSBfbGF0ZXN0U3RhdHVzO1xuICBpZiAoIXN0YXR1cykgcmV0dXJuO1xuICBsZXQgdGV4dCA9IHN0YXR1cy5wcm9ncmVzcyB8fCBcIihzeW5jIFx1OTAzMlx1ODg0Q1x1NEUyRClcIjtcbiAgaWYgKHN0YXR1cy5ydW5uaW5nICYmIHN0YXR1cy5zdGFydGVkKSB7XG4gICAgY29uc3QgZWxhcHNlZCA9IERhdGUubm93KCkgLSBzdGF0dXMuc3RhcnRlZDtcbiAgICB0ZXh0ID0gYFx1MjNGMSAke19mbXRFbGFwc2VkKGVsYXBzZWQpfSBcdTAwQjcgJHt0ZXh0fWA7XG4gIH1cbiAgY29uc3Qga2luZCA9IHN0YXR1cy5ydW5uaW5nID8gXCJpbmZvXCIgOiAoc3RhdHVzLnBoYXNlID09PSBcImVycm9yXCIgPyBcImVycm9yXCIgOiBcInN1Y2Nlc3NcIik7XG4gIGNvbnN0IGJyZWFrZG93biA9IHN0YXR1cy5ydW5uaW5nID8gbnVsbCA6IHN0YXR1cy5icmVha2Rvd247XG4gIHNldFN0YXR1cyh0ZXh0LCBraW5kLCBicmVha2Rvd24pO1xufVxuXG5mdW5jdGlvbiBhcHBseVN5bmNTdGF0dXMoc3RhdHVzKSB7XG4gIGlmICghc3RhdHVzKSByZXR1cm47XG4gIF9sYXRlc3RTdGF0dXMgPSBzdGF0dXM7XG4gIF9yZW5kZXJTdGF0dXMoKTtcbiAgaWYgKHN0YXR1cy5ydW5uaW5nKSB7XG4gICAgZWxzLnN5bmNBcGlCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgIGVscy5zdG9wQnRuLmhpZGRlbiA9IGZhbHNlO1xuICAgIGlmICghX2VsYXBzZWRUaWNrZXJJZCkge1xuICAgICAgX2VsYXBzZWRUaWNrZXJJZCA9IHNldEludGVydmFsKF9yZW5kZXJTdGF0dXMsIDEwMDApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBlbHMuc3RvcEJ0bi5oaWRkZW4gPSB0cnVlO1xuICAgIGlmIChfZWxhcHNlZFRpY2tlcklkKSB7XG4gICAgICBjbGVhckludGVydmFsKF9lbGFwc2VkVGlja2VySWQpO1xuICAgICAgX2VsYXBzZWRUaWNrZXJJZCA9IG51bGw7XG4gICAgfVxuICAgIC8vIFJlLWRlcml2ZSBzeW5jIGJ1dHRvbiBlbmFibGVkIHN0YXRlIGZyb20gbW9kZS9jb25uL05ISS10YWIgaW5zdGVhZFxuICAgIC8vIG9mIHVuY29uZGl0aW9uYWxseSBlbmFibGluZyBcdTIwMTQga2VlcHMgdGhlIGJ1dHRvbiBkaXNhYmxlZCB3aGVuIHdlXG4gICAgLy8ga25vdyB3ZSBzaG91bGRuJ3Qgc3luYyAoZS5nLiBiYWNrZW5kIGRvd24sIG9mZi1OSEkgdGFiKS5cbiAgICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgIC8vIFN5bmMganVzdCBmaW5pc2hlZCBcdTIwMTQgYm90aCBzaWRlcyBtYXkgaGF2ZSBjaGFuZ2VkIChiYWNrZW5kIGdvdFxuICAgIC8vIG5ldyByZXNvdXJjZXMgaW4gYmFja2VuZCBtb2RlLCBsb2NhbCBidW5kbGUgd2FzIHN0YXNoZWQgaW4gZWl0aGVyXG4gICAgLy8gbW9kZSkuIFJlZnJlc2ggZGF0YS1zdGF0ZSBjYXJkIHNvIHRoZSB1c2VyIHNlZXMgdXAtdG8tZGF0ZSBjb3VudHMuXG4gICAgX3JlZnJlc2hMb2NhbEJ1bmRsZVN0YXRlKCk7XG4gICAgaWYgKGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiICYmIF9jb25uU3RhdGUgPT09IFwib2tcIikgY2hlY2tCYWNrZW5kUGF0aWVudCgpO1xuICB9XG59XG5cbi8vIFN0b3AgdGhlIGluLXByb2dyZXNzIHN5bmMuIFR3by1wcm9uZ2VkIHNvIGl0IHdvcmtzIGV2ZW4gd2hlbiB0aGVcbi8vIHNlcnZpY2Ugd29ya2VyIGhhcyBkaWVkOiAoMSkgdGVsbCB0aGUgU1cgdG8gc2V0IGl0cyBjYW5jZWwgZmxhZyxcbi8vICgyKSB3cml0ZSBzdG9yYWdlIGRpcmVjdGx5IHRvIHJ1bm5pbmc6ZmFsc2Ugc28gdGhlIHBvcHVwIFVJIHVuZnJlZXplc1xuLy8gaW1tZWRpYXRlbHkgZXZlbiBpZiB0aGUgU1cgbWVzc2FnZSBjYW4ndCBiZSBkZWxpdmVyZWQuXG5hc3luYyBmdW5jdGlvbiBzdG9wU3luYygpIHtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICBzeW5jU3RhdHVzOiB7XG4gICAgICBydW5uaW5nOiBmYWxzZSxcbiAgICAgIHByb2dyZXNzOiBcIlx1MjZENCBcdTUwNUNcdTZCNjJcdTRFMkRcdUZGMENcdTZCNjNcdTU3MjhcdTZFMDVcdTk2NjRcdTkwRThcdTUyMDZcdTU0MENcdTZCNjVcdThDQzdcdTY1OTlcdTIwMjZcIixcbiAgICAgIHBoYXNlOiBcImNhbmNlbGxlZFwiLFxuICAgICAgdHM6IERhdGUubm93KCksXG4gICAgICBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgfSxcbiAgfSk7XG4gIHNldFN0YXR1cyhcIlx1MjZENCBcdTUwNUNcdTZCNjJcdTRFMkRcdUZGMENcdTZCNjNcdTU3MjhcdTZFMDVcdTk2NjRcdTkwRThcdTUyMDZcdTU0MENcdTZCNjVcdThDQzdcdTY1OTlcdTIwMjZcIiwgXCJpbmZvXCIpO1xuICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6IFwic3RvcFN5bmNcIiB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gIGVscy5zdG9wQnRuLmhpZGRlbiA9IHRydWU7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG59XG5cbi8vIExpdmUgcHJvZ3Jlc3MgdXBkYXRlcyBcdTIwMTQgbGlzdGVuIG9uIGNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZCBzbyB3ZSBnZXRcbi8vIGV2ZXJ5IHVwZGF0ZSB0aGUgU1cgd3JpdGVzLCByZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhlIFNXJ3MgYnJvYWRjYXN0XG4vLyBzZW5kTWVzc2FnZSByZWFjaGVkIHVzLlxuY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBhcmVhKSA9PiB7XG4gIGlmIChhcmVhID09PSBcImxvY2FsXCIgJiYgY2hhbmdlcy5zeW5jU3RhdHVzKSB7XG4gICAgYXBwbHlTeW5jU3RhdHVzKGNoYW5nZXMuc3luY1N0YXR1cy5uZXdWYWx1ZSk7XG4gIH1cbn0pO1xuXG4vLyAoTGVnYWN5IGluLW1lbW9yeSBicm9hZGNhc3Qgc3RpbGwgbGlzdGVuZWQgdG8gYXMgYSBiYWNrdXAuKVxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtc2cpID0+IHtcbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJzeW5jUHJvZ3Jlc3NcIikge1xuICAgIGFwcGx5U3luY1N0YXR1cyhtc2cuc3RhdHVzKTtcbiAgfVxufSk7XG5cbi8vIFByZS1mbGlnaHQgZGV0ZWN0aW9uIGZvciBOSEkgbG9naW4gc3RhdGUuIFR3byBzaWduYWxzIChlaXRoZXIgdHJpZ2dlcnMpOlxuLy8gIDEuIFVSTCBpcyBpbiBOSEkgYXV0aCBuYW1lc3BhY2UgKElIS0UzMDk5U3h4KSBcdTIwMTQgbG9naW4gLyBJQyBjYXJkIHBhZ2VzXG4vLyAgMi4gUGFnZSBjb250YWlucyBhIHBhc3N3b3JkIGlucHV0IG9yIGtub3duIGxvZ2dlZC1vdXQgcGhyYXNlc1xuYXN5bmMgZnVuY3Rpb24gaXNPbk5oaUxvZ2luUGFnZSh0YWJJZCwgdXJsKSB7XG4gIGlmICh1cmw/LnBhdGhuYW1lICYmIC9JSEtFMzA5OS8udGVzdCh1cmwucGF0aG5hbWUpKSByZXR1cm4gdHJ1ZTtcbiAgdHJ5IHtcbiAgICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgICBmdW5jOiAoKSA9PiB7XG4gICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwicGFzc3dvcmRcIl0nKSkgcmV0dXJuIHRydWU7XG4gICAgICAgIGNvbnN0IHRleHQgPSAoZG9jdW1lbnQuYm9keT8uaW5uZXJUZXh0IHx8IFwiXCIpLnRyaW0oKTtcbiAgICAgICAgY29uc3QgcGhyYXNlcyA9IFtcbiAgICAgICAgICBcIlx1OEFDQlx1NEY3Rlx1NzUyOFx1NTA2NVx1NEZERFx1NTM2MVwiLCBcIlx1OEFDQlx1NjNEMlx1NTE2NVx1NTA2NVx1NEZERFx1NTM2MVwiLCBcIlx1OEFDQlx1NjNEMlx1NTE2NVx1NjBBOFx1NzY4NFx1NTA2NVx1NEZERFx1NTM2MVwiLFxuICAgICAgICAgIFwiXHU3NjdCXHU1MTY1XHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBXCIsIFwiXHU3NjdCXHU1MTY1XHU1OTMxXHU2NTU3XCIsIFwiXHU4QUNCXHU5MUNEXHU2NUIwXHU3NjdCXHU1MTY1XCIsXG4gICAgICAgICAgXCJTZXNzaW9uIFx1NURGMlx1OTAzRVx1NjY0MlwiLCBcInNlc3Npb24gXHU1REYyXHU5MDNFXHU2NjQyXCIsIFwiXHU1REYyXHU5MDNFXHU2NjQyXCIsXG4gICAgICAgICAgXCJcdThBQ0JcdTRFRTVcdTUwNjVcdTRGRERcdTUzNjFcdTc2N0JcdTUxNjVcIixcbiAgICAgICAgXTtcbiAgICAgICAgcmV0dXJuIHBocmFzZXMuc29tZSgocCkgPT4gdGV4dC5pbmNsdWRlcyhwKSk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8vIFx1MjZBMSBOSEkgQVBJLWRpcmVjdCBzeW5jIFx1MjAxNCBwcmltYXJ5IHBhdGguIEhpdHMgTkhJJ3MgdW5kZXJseWluZyBKU09OXG4vLyBlbmRwb2ludHMgaW4gcGFyYWxsZWwgYW5kIHBvc3RzIGFkYXB0ZWQgaXRlbXMgdG8gL3N5bmMvdXBsb2FkLXN0cnVjdHVyZWQuXG4vLyBSZXF1aXJlcyBwYXRpZW50X292ZXJyaWRlIHRvIGJlIGZpbGxlZC5cbi8vIENvbnZlcnQgYSBiYWNrZW5kIFVSTCBcdTIxOTIgdGhlIG9yaWdpbi1wYXR0ZXJuIENocm9tZSB3YW50cyBmb3IgcGVybWlzc2lvblxuLy8gcmVxdWVzdHMuIFwiaHR0cDovLzE5Mi4xNjguMS41OjgwMTBcIiBcdTIxOTIgXCJodHRwOi8vMTkyLjE2OC4xLjU6ODAxMC8qXCIuXG4vLyBSZXR1cm5zIG51bGwgd2hlbiB0aGUgVVJMIGlzbid0IHBhcnNlYWJsZSBzbyB0aGUgY2FsbGVyIGNhbiBzaG9ydC1jaXJjdWl0LlxuZnVuY3Rpb24gX29yaWdpblBhdHRlcm5Gb3IodXJsKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgdSA9IG5ldyBVUkwodXJsKTtcbiAgICByZXR1cm4gYCR7dS5wcm90b2NvbH0vLyR7dS5ob3N0fS8qYDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLy8gQmFja2VuZC1tb2RlIHByZS1mbGlnaHQ6IGVuc3VyZSB0aGUgZXh0ZW5zaW9uIGhhcyBob3N0IHBlcm1pc3Npb24gZm9yXG4vLyB0aGUgdXNlci1jb25maWd1cmVkIGJhY2tlbmQgVVJMLiBMb2NhbGhvc3QgLyAxMjcuMC4wLjEgYXJlIGNvdmVyZWQgYnlcbi8vIHRoZSBkZWZhdWx0IG1hbmlmZXN0IGhvc3RfcGVybWlzc2lvbnM7IHJlbW90ZSAvIExBTiAvIHByb2R1Y3Rpb24gVVJMc1xuLy8gbmVlZCBhIG9uZS10aW1lIHVzZXIgZ3JhbnQuIE11c3QgcnVuIGZyb20gYSB1c2VyIGdlc3R1cmUgKGJ1dHRvbiBjbGljaykuXG5hc3luYyBmdW5jdGlvbiBlbnN1cmVCYWNrZW5kUGVybWlzc2lvbihiYWNrZW5kVXJsKSB7XG4gIGNvbnN0IHBhdHRlcm4gPSBfb3JpZ2luUGF0dGVybkZvcihiYWNrZW5kVXJsKTtcbiAgaWYgKCFwYXR0ZXJuKSByZXR1cm4geyBvazogZmFsc2UsIHJlYXNvbjogYEJhY2tlbmQgVVJMIFx1NzEyMVx1NkNENVx1ODlFM1x1Njc5MDogJHtiYWNrZW5kVXJsfWAgfTtcbiAgY29uc3QgYWxyZWFkeSA9IGF3YWl0IGNocm9tZS5wZXJtaXNzaW9ucy5jb250YWlucyh7IG9yaWdpbnM6IFtwYXR0ZXJuXSB9KTtcbiAgaWYgKGFscmVhZHkpIHJldHVybiB7IG9rOiB0cnVlIH07XG4gIGxldCBncmFudGVkO1xuICB0cnkge1xuICAgIGdyYW50ZWQgPSBhd2FpdCBjaHJvbWUucGVybWlzc2lvbnMucmVxdWVzdCh7IG9yaWdpbnM6IFtwYXR0ZXJuXSB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB7IG9rOiBmYWxzZSwgcmVhc29uOiBgXHU2QjBBXHU5NjUwXHU4QUNCXHU2QzQyXHU1OTMxXHU2NTU3OiAke2UubWVzc2FnZX1gIH07XG4gIH1cbiAgcmV0dXJuIGdyYW50ZWRcbiAgICA/IHsgb2s6IHRydWUgfVxuICAgIDogeyBvazogZmFsc2UsIHJlYXNvbjogYFx1NjcyQVx1NjM4OFx1NkIwQVx1OTAyM1x1N0REQVx1NTIzMCAke3BhdHRlcm59IFx1MjAxNCBcdTU0MENcdTZCNjVcdTUzRDZcdTZEODhgIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGFwaVN5bmNOaGkoKSB7XG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGlmICghb3YpIHtcbiAgICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU4QUNCXHU1MTQ4XHU1ODZCXHU1QkVCXHU0RTBBXHU2NUI5XHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5XHVGRjA4XHU4RUFCXHU1MjA2XHU4QjQ5XHU1QjU3XHU4NjVGXHVGRjA5XCIsIFwiZXJyb3JcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gUHJlLWZsaWdodDogY2hlY2sgd2UncmUgb24gYW4gTkhJIHRhYiBzbyBjb29raWVzIGFyZSB1c2FibGUgZnJvbSBTVy5cbiAgY29uc3QgdGFiID0gYXdhaXQgZ2V0QWN0aXZlVGFiKCk7XG4gIGxldCB1cmw7XG4gIHRyeSB7IHVybCA9IG5ldyBVUkwodGFiLnVybCk7IH0gY2F0Y2ggeyBzZXRTdGF0dXMoXCJhY3RpdmUgdGFiIGhhcyBubyBVUkxcIiwgXCJlcnJvclwiKTsgcmV0dXJuOyB9XG4gIGNvbnN0IG9uTG9naW4gPSBhd2FpdCBpc09uTmhpTG9naW5QYWdlKHRhYi5pZCwgdXJsKTtcbiAgaWYgKG9uTG9naW4pIHtcbiAgICBzZXRTdGF0dXMoXCJcdUQ4M0RcdUREMTIgXHU1QzFBXHU2NzJBXHU3NjdCXHU1MTY1XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBIFx1MjAxNCBcdThBQ0JcdTUxNDhcdTRFRTVcdTUwNjVcdTRGRERcdTUzNjFcdTc2N0JcdTUxNjVcdTVGOENcdTUxOERcdThBNjZcIiwgXCJlcnJvclwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBCYWNrZW5kIG1vZGU6IHJlLXZlcmlmeSBjb25uZWN0aXZpdHkgcmlnaHQgaGVyZSBldmVuIGlmIHRoZSBiYW5uZXJcbiAgLy8gbGFzdCBzYWlkIG9rLiBCZXR3ZWVuIHRoZSBwcmV2aW91cyBjaGVjayBhbmQgdGhpcyBjbGljayB0aGUgdXNlclxuICAvLyBtYXkgaGF2ZSBzdG9wcGVkIGRvY2tlcjsgd2l0aG91dCBhIGZyZXNoIHByb2JlIHdlJ2Qgc3RhcnQgYW4gdXBsb2FkXG4gIC8vIHRoYXQgZmFpbHMgbWlkLWZsaWdodCBhZnRlciBwYXJ0aWFsIGRhdGEgaGFzIGhpdCAob3IgZmFpbGVkIHRvIGhpdClcbiAgLy8gdGhlIGJhY2tlbmQuIENoZWFwIChcdTIyNjQ1cykgYW5kIHNhdmVzIGEgbG90IG9mIGNvbmZ1c2lvbi5cbiAgaWYgKGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiKSB7XG4gICAgY29uc3Qgb2sgPSBhd2FpdCB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKTtcbiAgICBpZiAoIW9rKSB7XG4gICAgICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU1RjhDXHU3QUVGXHU5MDIzXHU3RERBXHU1OTMxXHU2NTU3IFx1MjAxNCBcdThBQ0JcdTc3MEJcdTk4MDJcdTkwRTggYmFubmVyIFx1NzY4NFx1OEFBQVx1NjYwRVwiLCBcImVycm9yXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIGVscy5zeW5jQXBpQnRuLmRpc2FibGVkID0gdHJ1ZTtcblxuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgIHN5bmNTdGF0dXM6IHtcbiAgICAgIHJ1bm5pbmc6IHRydWUsXG4gICAgICBwcm9ncmVzczogXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1OUNCXHU1NDBDXHU2QjY1XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XHUyMDI2XCIsXG4gICAgICBwaGFzZTogXCJzdGFydGluZ1wiLCBzdGFydGVkOiBEYXRlLm5vdygpLCB0czogRGF0ZS5ub3coKSxcbiAgICB9LFxuICB9KTtcbiAgc2V0U3RhdHVzKFwiXHVEODNEXHVERTgwIFx1OTU4Qlx1NTlDQlx1NTQwQ1x1NkI2NVx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVx1MjAyNlwiLCBcImluZm9cIik7XG5cbiAgLy8gQ29tcHV0ZSBkYXRlIHJhbmdlIGZyb20gdGhlIGRyb3Bkb3duLiBcIjFcIiA9IE5ISSdzIGRlZmF1bHQgd2luZG93O1xuICAvLyBhbnl0aGluZyBlbHNlIGlzIFwidG9kYXkgYmFjayBOIHllYXJzXCIuIEhlbHBlciBpbnNpZGUgYmFja2dyb3VuZC5qc1xuICAvLyBjb252ZXJ0cyB0byBcdTZDMTFcdTU3MEIgZm9yIE5ISSdzIEFQSS5cbiAgY29uc3QgcmFuZ2VTZWwgPSBlbHMuYXBpU3luY1JhbmdlPy52YWx1ZSB8fCBcIjNcIjtcbiAgbGV0IGRhdGVSYW5nZSA9IG51bGw7XG4gIGNvbnN0IFJBTkdFX0xBQkVMUyA9IHtcbiAgICBcIjFcIjogICBcIlx1NjcwMFx1OEZEMSAxIFx1NUU3NFwiLFxuICAgIFwiM1wiOiAgIFwiXHU2NzAwXHU4RkQxIDMgXHU1RTc0XCIsXG4gICAgXCI1XCI6ICAgXCJcdTY3MDBcdThGRDEgNSBcdTVFNzRcIixcbiAgICBcIjEwXCI6ICBcIlx1NjcwMFx1OEZEMSAxMCBcdTVFNzRcIixcbiAgICBcImFsbFwiOiBcIlx1NTE2OFx1OTBFOFx1NkI3N1x1NTNGMlx1N0QwMFx1OTMwNFwiLFxuICB9O1xuICBjb25zdCBkYXRlUmFuZ2VMYWJlbCA9IFJBTkdFX0xBQkVMU1tyYW5nZVNlbF0gfHwgYFx1NjcwMFx1OEZEMSAke3JhbmdlU2VsfSBcdTVFNzRgO1xuICBpZiAocmFuZ2VTZWwgIT09IFwiMVwiKSB7XG4gICAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGVuZCA9IHRvZGF5LnRvSVNPU3RyaW5nKCkuc2xpY2UoMCwgMTApO1xuICAgIGxldCBzdGFydDtcbiAgICBpZiAocmFuZ2VTZWwgPT09IFwiYWxsXCIpIHtcbiAgICAgIHN0YXJ0ID0gXCIyMDAxLTAxLTAxXCI7ICAvLyBcdTZDMTFcdTU3MEIgOTAgXHUyMDE0IGZhciBlbm91Z2ggYmFjayBmb3IgYW55IGNsaW5pY2FsIGNhc2VcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgeWVhcnMgPSBwYXJzZUludChyYW5nZVNlbCwgMTApO1xuICAgICAgY29uc3QgcyA9IG5ldyBEYXRlKHRvZGF5KTtcbiAgICAgIHMuc2V0RnVsbFllYXIocy5nZXRGdWxsWWVhcigpIC0geWVhcnMpO1xuICAgICAgc3RhcnQgPSBzLnRvSVNPU3RyaW5nKCkuc2xpY2UoMCwgMTApO1xuICAgIH1cbiAgICBkYXRlUmFuZ2UgPSB7IHN0YXJ0LCBlbmQgfTtcbiAgfVxuXG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICB0eXBlOiBcInN0YXJ0TmhpQXBpU3luY1wiLFxuICAgIHBheWxvYWQ6IHtcbiAgICAgIHRhYklkOiB0YWIuaWQsXG4gICAgICBtb2RlOiBjdXJyZW50TW9kZSgpLFxuICAgICAgYmFja2VuZDogZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpLFxuICAgICAgc3luY0FwaUtleTogZWxzLnN5bmNBcGlLZXkudmFsdWUudHJpbSgpLFxuICAgICAgbmhpQmFzZTogXCJodHRwczovL215aGVhbHRoYmFuay5uaGkuZ292LnR3XCIsXG4gICAgICBwYXRpZW50T3ZlcnJpZGU6IG92LFxuICAgICAgZGF0ZVJhbmdlLFxuICAgICAgZGF0ZVJhbmdlTGFiZWwsXG4gICAgfSxcbiAgfSkuY2F0Y2goKCkgPT4ge30pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBsYXVuY2goKSB7XG4gIGNvbnN0IGJhY2tlbmQgPSBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCk7XG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGNvbnN0IHBhdGllbnRJZCA9IG92Py5pZF9ubztcbiAgY29uc3Qgc21hcnRBcHBMYXVuY2ggPSBlbHMuc21hcnRBcHBVcmwudmFsdWUudHJpbSgpIHx8IERFRkFVTFRfU01BUlRfQVBQX0xBVU5DSDtcbiAgaWYgKCFwYXRpZW50SWQpIHtcbiAgICBzZXRTdGF0dXMoXCJcdTZDOTJcdTY3MDlcdTc1QzVcdTRFQkFcdThFQUJcdTUyMDZcdThCNDlcdTVCNTdcdTg2NUZcdTUzRUZcdTRFRTUgbGF1bmNoIFx1MjAxNCBcdThBQ0JcdTUxNDhcdTU4NkJcdTVCRUJcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTlcIiwgXCJlcnJvclwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gUmUtdGVzdCBjb25uZWN0aW9uIGV2ZW4gaWYgYmFubmVyIHNob3dzIG9rIFx1MjAxNCBiYWNrZW5kIG1heSBoYXZlIGdvbmVcbiAgLy8gZG93biBzaW5jZSB0aGUgbGFzdCBwcm9iZS5cbiAgY29uc3Qgb2sgPSBhd2FpdCB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKTtcbiAgaWYgKCFvaykge1xuICAgIHNldFN0YXR1cyhcIlx1MjZENCBcdTVGOENcdTdBRUZcdTkwMjNcdTdEREFcdTU5MzFcdTY1NTcgXHUyMDE0IFx1OEFDQlx1NzcwQlx1OTgwMlx1OTBFOCBiYW5uZXIgXHU3Njg0XHU4QUFBXHU2NjBFXCIsIFwiZXJyb3JcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIHNldFN0YXR1cyhcIlx1NUVGQVx1N0FDQiBsYXVuY2ggY29udGV4dFx1MjAyNlwiLCBcImluZm9cIik7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYCR7YmFja2VuZH0vc21hcnQvbGF1bmNoLWNvbnRleHRgLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBwYXRpZW50X2lkOiBwYXRpZW50SWQgfSksXG4gICAgfSk7XG4gICAgaWYgKCFyZXMub2spIHRocm93IG5ldyBFcnJvcihgJHtyZXMuc3RhdHVzfTogJHthd2FpdCByZXMudGV4dCgpfWApO1xuICAgIGNvbnN0IHsgbGF1bmNoIH0gPSBhd2FpdCByZXMuanNvbigpO1xuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoeyBpc3M6IGAke2JhY2tlbmR9L2ZoaXJgLCBsYXVuY2ggfSk7XG4gICAgLy8gQXBwZW5kIGlzcyArIGxhdW5jaCBwYXJhbXMsIHJlc3BlY3RpbmcgYW55IGV4aXN0aW5nIHF1ZXJ5IHN0cmluZy5cbiAgICBjb25zdCBzZXAgPSBzbWFydEFwcExhdW5jaC5pbmNsdWRlcyhcIj9cIikgPyBcIiZcIiA6IFwiP1wiO1xuICAgIGNocm9tZS50YWJzLmNyZWF0ZSh7IHVybDogYCR7c21hcnRBcHBMYXVuY2h9JHtzZXB9JHtwYXJhbXN9YCB9KTtcbiAgICB3aW5kb3cuY2xvc2UoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHNldFN0YXR1cyhgXHUyNzRDIExhdW5jaCBcdTU5MzFcdTY1NTdcdUZGMUEke2UubWVzc2FnZX1gLCBcImVycm9yXCIpO1xuICB9XG59XG5cbmVscy5zeW5jQXBpQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhcGlTeW5jTmhpKTtcbmVscy5zdG9wQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdG9wU3luYyk7XG5lbHMub3ZTYXZlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzYXZlUGF0aWVudE92ZXJyaWRlKTtcbmVscy5vdkNsZWFyQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGVhclBhdGllbnRPdmVycmlkZSk7XG5bZWxzLm92SWRObywgZWxzLm92TmFtZSwgZWxzLm92QmlydGhEYXRlLCBlbHMub3ZHZW5kZXJdLmZvckVhY2goKGVsKSA9PlxuICBlbC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgcmVmcmVzaE92ZXJyaWRlU3VtbWFyeSlcbik7XG5lbHMubGF1bmNoQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsYXVuY2gpO1xuaW5pdCgpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7QUFTQSxNQUFNLGtCQUFrQjtBQUl4QixNQUFNLDJCQUEyQjtBQUdqQyxXQUFTLFNBQVMsS0FBSztBQUNyQixRQUFJLENBQUMsSUFBSyxRQUFPO0FBQ2pCLFFBQUk7QUFDRixZQUFNLElBQUksT0FBTyxRQUFRLFdBQVcsSUFBSSxJQUFJLEdBQUcsSUFBSTtBQUNuRCxhQUFPLDZCQUE2QixLQUFLLEVBQUUsUUFBUTtBQUFBLElBQ3JELFFBQVE7QUFDTixhQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0Y7QUFFQSxNQUFNLGVBQWU7QUFFckIsTUFBTSxNQUFNO0FBQUEsSUFDVixZQUFZLE1BQU0sU0FBUyxpQkFBaUIseUJBQXlCO0FBQUEsSUFDckUsWUFBWSxTQUFTLGVBQWUsYUFBYTtBQUFBLElBQ2pELFlBQVksU0FBUyxlQUFlLGNBQWM7QUFBQSxJQUNsRCxhQUFhLFNBQVMsZUFBZSxlQUFlO0FBQUEsSUFDcEQsWUFBWSxTQUFTLGVBQWUsY0FBYztBQUFBLElBQ2xELGNBQWMsU0FBUyxlQUFlLGdCQUFnQjtBQUFBLElBQ3RELFNBQVMsU0FBUyxlQUFlLFVBQVU7QUFBQSxJQUMzQyxRQUFRLFNBQVMsZUFBZSxVQUFVO0FBQUEsSUFDMUMsUUFBUSxTQUFTLGVBQWUsU0FBUztBQUFBLElBQ3pDLGFBQWEsU0FBUyxlQUFlLGVBQWU7QUFBQSxJQUNwRCxVQUFVLFNBQVMsZUFBZSxXQUFXO0FBQUEsSUFDN0MsV0FBVyxTQUFTLGVB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
