// NHI-FHIR Bridge — collapsible right-side panel injected into HIS pages.
//
// Goals of this PoC:
// 1. Prove we can render an iframe of the medical-note SMART app inside
//    the NHI 健保存摺 page without CSP / X-Frame-Options issues.
// 2. Keep the sidebar isolated from the host page's CSS via Shadow DOM
//    so HIS-specific styles can't bleed in and break layout.
// 3. Give a single toggle button (prism mark — same as medical-note's
//    app icon) at the right edge that slides the panel in/out. State
//    persists across navigations on the same origin
//    via chrome.storage.local.
//
// Not in scope here:
// - postMessage bridge from the iframe to the SW (date-range tool calls).
//   That comes once we confirm the basic embed renders.
// - Per-HIS auth handoff (FHIR launch token, etc.).

(() => {
  // Re-injection (e.g. background.js calling chrome.scripting.executeScript
  // after an extension update) means the script runs again on a page that
  // already has a host element from the previous instance. Clean up the
  // stale host so the toggle button doesn't appear twice.
  // Leftover chrome.storage.onChanged listeners from the old script
  // instance can't be unregistered, but they reference detached DOM
  // nodes so their callbacks are visual no-ops.
  const previousHost = document.getElementById("nhi-fhir-sidebar-host");
  if (previousHost) previousHost.remove();

  const SIDEBAR_DEFAULT_WIDTH = 420;
  const SIDEBAR_MIN_WIDTH = 280;
  const SIDEBAR_MAX_WIDTH = 1200;
  const STORAGE_KEY = "sidebar_open";
  const WIDTH_KEY = "sidebar_width";
  // The SMART launch entry that fhirclient expects to handle the iss+launch
  // params and run FHIR.oauth2.authorize().
  const APP_LAUNCH_PATH = "/smart/launch";
  // Chrome's Private Network Access blocks fetches from public origins
  // (github.io) into loopback (localhost) even when the server returns
  // Access-Control-Allow-Private-Network: true — apparently this is being
  // tightened to "always block" in newer Chromes. Easiest fix is to point
  // the iframe at the local dev server of medical-note (localhost:3001),
  // same scheme as backend, so no PNA crossing happens at all. Falls back
  // to the deployed github.io app when the local one isn't running.
  // Local Next.js dev server: runs at root (no /medical-note-smart-on-fhir
  // prefix — the launch page detects window.location.pathname and sets
  // prefix = "" when not on the github.io repo subpath).
  const APP_BASE_LOCAL = "http://localhost:3001";
  const APP_BASE_DEPLOYED = "https://voho0000.github.io/medical-note-smart-on-fhir";
  const DEFAULT_BACKEND = "http://localhost:8010";

  // Host element + Shadow root so the host page's CSS never touches us.
  const host = document.createElement("div");
  host.id = "nhi-fhir-sidebar-host";
  // Pin to the page, above almost everything. NHI uses some z-index
  // values but nothing above 9999.
  host.style.cssText = `
    all: initial;
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    z-index: 2147483646;
    pointer-events: none;
  `;
  document.documentElement.appendChild(host);

  // The sidebar's assistant button + iframe panel are only useful in
  // "上傳後端" mode — the iframe is a SMART app that talks to the local
  // FHIR backend. In "下載到電腦" mode there's no backend to talk to,
  // so hide the whole thing.
  //
  // Plus an explicit `sidebarEnabled` opt-out: users who only want the
  // raw FHIR Bundle and never plan to embed SMART apps on the NHI page
  // can turn the panel off entirely via the popup's 「⚙️ 進階設定」.
  // All settings (syncMode, sidebarEnabled) live in chrome.storage.local
  // since v0.5.0 — sidebar.js was missed in that migration and kept
  // reading from .sync, which only ever held undefined values after
  // the migration cleared the keys. Result: the assistant pill never
  // appeared even when the user had ticked "顯示助理面板" in popup.
  async function _applyModeVisibility() {
    try {
      const { syncMode, sidebarEnabled } = await chrome.storage.local.get([
        "syncMode", "sidebarEnabled",
      ]);
      const visible = sidebarEnabled !== false && syncMode === "backend";
      host.style.display = visible ? "" : "none";
    } catch {
      host.style.display = "none";
    }
  }
  _applyModeVisibility();
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if ("syncMode" in changes || "sidebarEnabled" in changes) {
      _applyModeVisibility();
    }
  });

  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `
    <style>
      :host, * { box-sizing: border-box; }
      .toggle {
        position: fixed;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        width: 28px;
        height: 72px;
        /* Deep navy (#1e3a8a) — kept distinct from popup's primary
           blue on purpose: this pill lives on the host NHI page, not
           in the extension UI, so a slightly heavier color helps it
           hold its own against the page background. */
        background: #1e3a8a;
        color: white;
        border: none;
        border-radius: 8px 0 0 8px;
        cursor: pointer;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        box-shadow: -1px 2px 6px rgba(0,0,0,0.12);
        pointer-events: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: right 0.2s ease, background 0.2s ease, transform 0.2s ease;
        /* Subtle 3-cycle pulse on first paint so a brand-new user sees
           "oh that's a button". 3 cycles then stops — never gets in
           the way after. */
        animation: nfb-toggle-pulse 1.6s ease-out 3 forwards;
      }
      .toggle svg { display: block; width: 20px; height: 20px; }
      .toggle:hover {
        background: #1e40af;
        transform: translateY(-50%) translateX(-2px);
      }
      .toggle:focus-visible {
        outline: 2px solid #60a5fa;
        outline-offset: 2px;
      }
      @keyframes nfb-toggle-pulse {
        0%, 100% { box-shadow: -1px 2px 6px rgba(0,0,0,0.12); }
        50% { box-shadow: -1px 2px 6px rgba(0,0,0,0.12),
                          0 0 0 5px rgba(59, 130, 246, 0.35); }
      }
      @media (prefers-reduced-motion: reduce) {
        .toggle { animation: none; }
      }
      .panel {
        position: fixed;
        top: 0;
        right: -${SIDEBAR_DEFAULT_WIDTH + 30}px;
        height: 100vh;
        width: ${SIDEBAR_DEFAULT_WIDTH}px;
        background: white;
        box-shadow: -4px 0 12px rgba(0,0,0,0.1);
        /* No transition while user is dragging — set inline. */
        transition: right 0.25s ease;
        display: flex;
        flex-direction: column;
        pointer-events: auto;
        border-left: 1px solid #e5e7eb;
      }
      .panel.open { right: 0; }
      /* Drag handle on the LEFT edge of the open panel. Wide enough
         (6px) to be easy to grab but invisible until hovered. While
         dragging the toggle/transition is disabled so resizing feels
         crisp. */
      .resizer {
        position: absolute;
        top: 0; left: -3px;
        width: 6px; height: 100%;
        cursor: ew-resize;
        z-index: 1;
        background: transparent;
      }
      .resizer:hover, .panel.resizing .resizer {
        background: linear-gradient(to right, transparent, #2563eb33, transparent);
      }
      .panel.resizing { transition: none !important; user-select: none; }
      .panel.resizing iframe { pointer-events: none; } /* swallow drag inside iframe */
      .header {
        padding: 10px 14px;
        background: #f9fafb;
        border-bottom: 1px solid #e5e7eb;
        font: 600 13px -apple-system, BlinkMacSystemFont, sans-serif;
        color: #1e3a8a;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .header-title {
        display: inline-flex;
        align-items: center;
        gap: 7px;
      }
      .header-mark { width: 16px; height: 16px; flex: 0 0 16px; }
      .header .close {
        background: none;
        border: none;
        font-size: 18px;
        color: #6b7280;
        cursor: pointer;
        padding: 0 4px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 26px;
        height: 26px;
      }
      .header .close:hover { color: #1f2937; }
      .header .close svg { width: 16px; height: 16px; }
      iframe {
        flex: 1;
        border: 0;
        width: 100%;
        background: white;
      }
      .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        color: #9ca3af;
        font: 13px -apple-system, BlinkMacSystemFont, sans-serif;
        gap: 12px;
        padding: 20px;
        text-align: center;
      }
      .empty button {
        padding: 8px 16px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
      }
    </style>

    <button class="toggle" id="toggle"
            title="點此開啟 NHI-FHIR Bridge 助理面板"
            aria-label="開啟 NHI-FHIR Bridge 助理面板">
      <!-- Prism mark — same shape as medical-note's app icon, so the
           trigger visually matches the app it opens. currentColor
           lets the white stroke inherit from .toggle's color: white. -->
      <svg viewBox="0 0 256 256" fill="none" stroke="currentColor"
           stroke-width="14" stroke-linejoin="round" stroke-linecap="round"
           aria-hidden="true">
        <path d="M 80 80 L 176 80"/>
        <path d="M 80 80 L 48 176"/>
        <path d="M 176 80 L 208 176"/>
        <path d="M 48 176 L 208 176"/>
        <path d="M 48 176 L 128 224 L 208 176"/>
        <path d="M 80 80 L 128 176"/>
        <path d="M 176 80 L 128 176"/>
        <path d="M 128 176 L 128 224"/>
      </svg>
    </button>
    <div class="panel" id="panel">
      <div class="resizer" id="resizer" title="拖曳調整寬度"></div>
      <div class="header">
        <span class="header-title">
          <svg viewBox="0 0 256 256" fill="none" stroke="currentColor"
               stroke-width="16" stroke-linejoin="round" stroke-linecap="round"
               aria-hidden="true" class="header-mark">
            <path d="M 80 80 L 176 80"/>
            <path d="M 80 80 L 48 176"/>
            <path d="M 176 80 L 208 176"/>
            <path d="M 48 176 L 208 176"/>
            <path d="M 48 176 L 128 224 L 208 176"/>
            <path d="M 80 80 L 128 176"/>
            <path d="M 176 80 L 128 176"/>
            <path d="M 128 176 L 128 224"/>
          </svg>
          NHI-FHIR Bridge 助理
        </span>
        <span style="display:flex;gap:4px">
          <button class="close" id="popout" title="移到獨立視窗 (pop-out)" aria-label="pop out">
            <!-- "external link / open in new window" icon. Inline SVG so
                 it renders the same on every OS without relying on emoji
                 font coverage. -->
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 4h6v6"/>
              <path d="M20 4 12 12"/>
              <path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6"/>
            </svg>
          </button>
          <button class="close" id="reload" title="強制重新載入助理 (繞 cache)"
                  aria-label="強制重新載入助理">
            <!-- lucide RotateCw. Replaces unicode 🔄 which renders very
                 differently across OSes / emoji fonts (especially Win). -->
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
            </svg>
          </button>
          <button class="close" id="close" title="收起" aria-label="收起">
            <!-- lucide X — matches the rest of the SVG icon family in
                 this header so the whole row reads as one toolbar. -->
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </span>
      </div>
      <div class="empty" id="empty">
        <div>第一次使用 — 點下方載入 medical-note 助理</div>
        <button id="load">載入助理 (~3s)</button>
        <div style="font-size:11px;color:#9ca3af;margin-top:8px">
          載入後可保持開啟；切到其他病人時用左上的 patient picker 切換
        </div>
      </div>
    </div>
  `;

  const panel = root.getElementById("panel");
  const toggleBtn = root.getElementById("toggle");
  const closeBtn = root.getElementById("close");
  const loadBtn = root.getElementById("load");
  const emptyBox = root.getElementById("empty");
  const resizer = root.getElementById("resizer");
  const popoutBtn = root.getElementById("popout");

  // ── Width persistence + drag-to-resize ──────────────────────────────
  // The panel's width is restored from storage and the CSS rule that
  // hides the panel off-screen ("right: -<width+30>px") is rewritten in
  // sync. We can't touch the original <style> rule, so we override via
  // an inline `right` style when the panel is closed.
  let currentWidth = SIDEBAR_DEFAULT_WIDTH;
  function applyWidth(px) {
    currentWidth = Math.max(SIDEBAR_MIN_WIDTH, Math.min(SIDEBAR_MAX_WIDTH, Math.round(px)));
    panel.style.width = `${currentWidth}px`;
    // Keep the off-screen offset in sync (slightly more than width so
    // the box-shadow is hidden too).
    if (!panel.classList.contains("open")) {
      panel.style.right = `-${currentWidth + 30}px`;
    } else {
      panel.style.right = "0";
    }
    // Move the toggle handle to sit flush with the open panel's left edge.
    toggleBtn.style.right = panel.classList.contains("open") ? `${currentWidth}px` : "0";
  }
  // Initial: restore last-used width.
  if (isContextAlive()) {
    chrome.storage.local.get(WIDTH_KEY).then((d) => {
      if (typeof d[WIDTH_KEY] === "number") applyWidth(d[WIDTH_KEY]);
    }).catch(() => {});
  }
  // Drag: track delta vs. starting mouseX, recompute width on each move.
  let dragStartX = 0, dragStartW = 0;
  function onDragMove(e) {
    // Resizer is on the LEFT edge — dragging left grows the panel.
    const delta = dragStartX - e.clientX;
    applyWidth(dragStartW + delta);
  }
  function onDragEnd() {
    panel.classList.remove("resizing");
    document.removeEventListener("pointermove", onDragMove);
    document.removeEventListener("pointerup", onDragEnd);
    if (isContextAlive()) {
      chrome.storage.local.set({ [WIDTH_KEY]: currentWidth }).catch(() => {});
    }
  }
  resizer.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    dragStartX = e.clientX;
    dragStartW = currentWidth;
    panel.classList.add("resizing");
    document.addEventListener("pointermove", onDragMove);
    document.addEventListener("pointerup", onDragEnd);
  });

  // ── Pop-out to standalone window ────────────────────────────────────
  // Opens the same iframe URL in a fresh window so the user can move it
  // to a second monitor / resize freely. Sidebar auto-collapses after,
  // since both showing it side-by-side would be confusing.
  let popoutWin = null;
  async function popOut() {
    let url;
    try { url = await buildIframeUrl(); }
    catch (err) { console.warn("[nhi-fhir sidebar] popOut:", err.message); return; }
    // If we already have an open popup, reuse it (raises the existing
    // window). The 2nd window.open call with the same name reloads it.
    popoutWin = window.open(url, "nhi-fhir-bridge-assistant",
      `width=${currentWidth},height=900,resizable=yes,scrollbars=yes`);
    if (popoutWin) {
      popoutWin.focus();
      // Collapse the sidebar so the user isn't staring at the same app
      // in two places.
      setOpen(false);
    }
  }

  // Build the iframe URL. When we have a patient_id + a working backend
  // we hand the app a SMART EHR-Launch context so it auto-loads OUR
  // local FHIR store. Otherwise just open the app home (it'll show its
  // default landing / a public test server).
  // Detect orphaned content script: after the user reloads the extension
  // from chrome://extensions, this script's chrome.runtime.id link goes
  // null and any chrome.* call throws "Extension context invalidated".
  // The fix is always a page refresh — we just surface a clearer error.
  function isContextAlive() {
    try { return !!chrome.runtime?.id; } catch { return false; }
  }

  // Always prefer the local Next.js dev server (PNA-free path). The
  // content script can't probe localhost from the NHI origin (PNA again),
  // so we just trust the user to have `npm run dev` running and let the
  // iframe surface a "connection refused" if they don't. A future setting
  // can let users flip to the deployed URL.
  async function pickAppBase() {
    const { sidebarAppBase } = await chrome.storage.local.get("sidebarAppBase").catch(() => ({}));
    return sidebarAppBase || APP_BASE_LOCAL;
  }

  async function buildIframeUrl() {
    const cacheBust = `_=${Date.now()}`;
    if (!isContextAlive()) {
      // Chrome invalidates a content script's chrome.* APIs the moment
      // the extension itself is updated / reloaded. The script keeps
      // running on the page but can no longer talk to storage / SW —
      // user has to F5 the NHI tab so a fresh copy of sidebar.js gets
      // injected. Phrase this without jargon.
      throw new Error(
        "擴充功能剛更新過，請按 F5 重新整理這個頁面就能恢復助理面板。\n" +
        "(Extension was just updated — press F5 on this page to reload the sidebar.)",
      );
    }
    const { patientOverride, backendUrl } = await chrome.storage.local.get([
      "patientOverride", "backendUrl",
    ]).catch(() => ({}));
    const backend = (backendUrl || DEFAULT_BACKEND).replace(/\/$/, "");
    const patientId = patientOverride?.id_no;
    const appBase = await pickAppBase();
    const appHome = `${appBase}/`;
    if (!patientId) {
      // No patient context yet — load the app bare; user can fill the
      // popup's 🪪 area and click 🔄 to relaunch with context.
      return `${appHome}?${cacheBust}`;
    }
    try {
      const r = await fetch(`${backend}/smart/launch-context`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patientId }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const { launch } = await r.json();
      const iss = `${backend}/fhir`;
      const params = new URLSearchParams({ iss, launch });
      return `${appBase}${APP_LAUNCH_PATH}?${params.toString()}&${cacheBust}`;
    } catch (err) {
      console.warn("[nhi-fhir sidebar] launch-context failed, falling back to bare app:", err);
      return `${appHome}?${cacheBust}`;
    }
  }

  let iframeEl = null;
  async function loadIframe() {
    if (iframeEl) return;
    let src;
    try { src = await buildIframeUrl(); }
    catch (err) {
      // Use textContent + white-space:pre-line so multi-line bilingual
      // messages from buildIframeUrl render with their line breaks
      // intact (and we don't have to worry about HTML escaping).
      emptyBox.textContent = "";
      const div = document.createElement("div");
      div.style.cssText = "color:#b91c1c; white-space:pre-line; line-height:1.6";
      div.textContent = `⚠ ${err.message}`;
      emptyBox.appendChild(div);
      return;
    }
    iframeEl = document.createElement("iframe");
    iframeEl.title = "Medical Note SMART on FHIR";
    iframeEl.allow = "clipboard-read; clipboard-write";
    emptyBox.remove();
    panel.appendChild(iframeEl);
    iframeEl.src = src;
  }

  async function reloadIframe() {
    if (!iframeEl) { await loadIframe(); return; }
    try { iframeEl.src = await buildIframeUrl(); }
    catch (err) { console.warn("[nhi-fhir sidebar]", err.message); }
  }

  function setOpen(open) {
    panel.classList.toggle("open", open);
    // Sync inline right/toggle position with the open state, using the
    // *current* width (which may have been user-resized).
    applyWidth(currentWidth);
    if (open) loadIframe().catch(() => {});
    if (isContextAlive()) {
      chrome.storage.local.set({ [STORAGE_KEY]: open }).catch(() => {});
    }
  }

  const reloadBtn = root.getElementById("reload");
  toggleBtn.addEventListener("click", () => {
    setOpen(!panel.classList.contains("open"));
  });
  closeBtn.addEventListener("click", () => setOpen(false));
  loadBtn.addEventListener("click", () => loadIframe());
  reloadBtn.addEventListener("click", () => reloadIframe());
  popoutBtn.addEventListener("click", () => popOut());

  // Restore previous open/closed state on this origin.
  chrome.storage.local.get(STORAGE_KEY).then((d) => {
    if (d[STORAGE_KEY]) setOpen(true);
  }).catch(() => {});

  // ── Sync-running iframe pause ──────────────────────────────────────
  // While the extension's runNhiApiSync is in flight, the medical-note
  // iframe competes with our NHI fan-out fetches for the tab's network
  // + JS thread (we saw NHI fan-out time roughly triple when this iframe
  // was active). Stash the iframe's src into about:blank during sync so
  // its OAuth + FHIR calls stop hammering the network. Resume by
  // re-loading from the saved src when sync finishes.
  let _pausedSrc = null;
  function pauseIframe() {
    if (!iframeEl || _pausedSrc !== null) return;
    _pausedSrc = iframeEl.src;
    iframeEl.src = "about:blank";
  }
  function resumeIframe() {
    if (!iframeEl || _pausedSrc === null) return;
    iframeEl.src = _pausedSrc;
    _pausedSrc = null;
  }
  chrome.storage.local.get("syncRunning").then((d) => {
    if (d.syncRunning) pauseIframe();
  }).catch(() => {});
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !("syncRunning" in changes)) return;
    if (changes.syncRunning.newValue) pauseIframe();
    else resumeIframe();
  });
})();
