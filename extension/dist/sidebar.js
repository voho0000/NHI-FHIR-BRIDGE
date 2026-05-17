(() => {
  // src/sidebar.js
  (() => {
    const previousHost = document.getElementById("nhi-fhir-sidebar-host");
    if (previousHost)
      previousHost.remove();
    const SIDEBAR_DEFAULT_WIDTH = 420;
    const SIDEBAR_MIN_WIDTH = 280;
    const SIDEBAR_MAX_WIDTH = 1200;
    const STORAGE_KEY = "sidebar_open";
    const WIDTH_KEY = "sidebar_width";
    const APP_LAUNCH_PATH = "/smart/launch";
    const APP_BASE_LOCAL = "http://localhost:3001";
    const APP_BASE_DEPLOYED = "https://voho0000.github.io/medical-note-smart-on-fhir";
    const DEFAULT_BACKEND = "http://localhost:8010";
    const host = document.createElement("div");
    host.id = "nhi-fhir-sidebar-host";
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
    async function _applyModeVisibility() {
      try {
        const { syncMode, sidebarEnabled } = await chrome.storage.local.get([
          "syncMode",
          "sidebarEnabled"
        ]);
        const visible = sidebarEnabled !== false && syncMode === "backend";
        host.style.display = visible ? "" : "none";
      } catch {
        host.style.display = "none";
      }
    }
    _applyModeVisibility();
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "local")
        return;
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
        background: #2563eb;
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
           "oh that's a button". 3 cycles then stops \u2014 never gets in
           the way after. */
        animation: nfb-toggle-pulse 1.6s ease-out 3 forwards;
      }
      .toggle svg { display: block; width: 20px; height: 20px; }
      .toggle:hover {
        background: #1d4ed8;
        transform: translateY(-50%) translateX(-2px);
      }
      .toggle:focus-visible {
        outline: 2px solid #93c5fd;
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
        /* No transition while user is dragging \u2014 set inline. */
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
            title="\u9EDE\u6B64\u958B\u555F NHI-FHIR Bridge \u52A9\u7406\u9762\u677F"
            aria-label="\u958B\u555F NHI-FHIR Bridge \u52A9\u7406\u9762\u677F">
      <!-- Prism mark \u2014 same shape as medical-note's app icon, so the
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
      <div class="resizer" id="resizer" title="\u62D6\u66F3\u8ABF\u6574\u5BEC\u5EA6"></div>
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
          NHI-FHIR Bridge \u52A9\u7406
        </span>
        <span style="display:flex;gap:4px">
          <button class="close" id="popout" title="\u79FB\u5230\u7368\u7ACB\u8996\u7A97 (pop-out)" aria-label="pop out">
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
          <button class="close" id="reload" title="\u5F37\u5236\u91CD\u65B0\u8F09\u5165\u52A9\u7406 (\u7E5E cache)"
                  aria-label="\u5F37\u5236\u91CD\u65B0\u8F09\u5165\u52A9\u7406">
            <!-- lucide RotateCw. Replaces unicode \u{1F504} which renders very
                 differently across OSes / emoji fonts (especially Win). -->
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
            </svg>
          </button>
          <button class="close" id="close" title="\u6536\u8D77" aria-label="\u6536\u8D77">
            <!-- lucide X \u2014 matches the rest of the SVG icon family in
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
        <div>\u7B2C\u4E00\u6B21\u4F7F\u7528 \u2014 \u9EDE\u4E0B\u65B9\u8F09\u5165 medical-note \u52A9\u7406</div>
        <button id="load">\u8F09\u5165\u52A9\u7406 (~3s)</button>
        <div style="font-size:11px;color:#9ca3af;margin-top:8px">
          \u8F09\u5165\u5F8C\u53EF\u4FDD\u6301\u958B\u555F\uFF1B\u5207\u5230\u5176\u4ED6\u75C5\u4EBA\u6642\u7528\u5DE6\u4E0A\u7684 patient picker \u5207\u63DB
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
    let currentWidth = SIDEBAR_DEFAULT_WIDTH;
    function applyWidth(px) {
      currentWidth = Math.max(SIDEBAR_MIN_WIDTH, Math.min(SIDEBAR_MAX_WIDTH, Math.round(px)));
      panel.style.width = `${currentWidth}px`;
      if (!panel.classList.contains("open")) {
        panel.style.right = `-${currentWidth + 30}px`;
      } else {
        panel.style.right = "0";
      }
      toggleBtn.style.right = panel.classList.contains("open") ? `${currentWidth}px` : "0";
    }
    if (isContextAlive()) {
      chrome.storage.local.get(WIDTH_KEY).then((d) => {
        if (typeof d[WIDTH_KEY] === "number")
          applyWidth(d[WIDTH_KEY]);
      }).catch(() => {
      });
    }
    let dragStartX = 0, dragStartW = 0;
    function onDragMove(e) {
      const delta = dragStartX - e.clientX;
      applyWidth(dragStartW + delta);
    }
    function onDragEnd() {
      panel.classList.remove("resizing");
      document.removeEventListener("pointermove", onDragMove);
      document.removeEventListener("pointerup", onDragEnd);
      if (isContextAlive()) {
        chrome.storage.local.set({ [WIDTH_KEY]: currentWidth }).catch(() => {
        });
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
    let popoutWin = null;
    async function popOut() {
      let url;
      try {
        url = await buildIframeUrl();
      } catch (err) {
        console.warn("[nhi-fhir sidebar] popOut:", err.message);
        return;
      }
      popoutWin = window.open(
        url,
        "nhi-fhir-bridge-assistant",
        `width=${currentWidth},height=900,resizable=yes,scrollbars=yes`
      );
      if (popoutWin) {
        popoutWin.focus();
        setOpen(false);
      }
    }
    function isContextAlive() {
      try {
        return !!chrome.runtime?.id;
      } catch {
        return false;
      }
    }
    async function pickAppBase() {
      const { sidebarAppBase } = await chrome.storage.local.get("sidebarAppBase").catch(() => ({}));
      return sidebarAppBase || APP_BASE_LOCAL;
    }
    async function buildIframeUrl() {
      const cacheBust = `_=${Date.now()}`;
      if (!isContextAlive()) {
        throw new Error(
          "\u64F4\u5145\u529F\u80FD\u525B\u66F4\u65B0\u904E\uFF0C\u8ACB\u6309 F5 \u91CD\u65B0\u6574\u7406\u9019\u500B\u9801\u9762\u5C31\u80FD\u6062\u5FA9\u52A9\u7406\u9762\u677F\u3002\n(Extension was just updated \u2014 press F5 on this page to reload the sidebar.)"
        );
      }
      const { patientOverride, backendUrl } = await chrome.storage.local.get([
        "patientOverride",
        "backendUrl"
      ]).catch(() => ({}));
      const backend = (backendUrl || DEFAULT_BACKEND).replace(/\/$/, "");
      const patientId = patientOverride?.id_no;
      const appBase = await pickAppBase();
      const appHome = `${appBase}/`;
      if (!patientId) {
        return `${appHome}?${cacheBust}`;
      }
      try {
        const r = await fetch(`${backend}/smart/launch-context`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patient_id: patientId })
        });
        if (!r.ok)
          throw new Error(`HTTP ${r.status}`);
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
      if (iframeEl)
        return;
      let src;
      try {
        src = await buildIframeUrl();
      } catch (err) {
        emptyBox.textContent = "";
        const div = document.createElement("div");
        div.style.cssText = "color:#b91c1c; white-space:pre-line; line-height:1.6";
        div.textContent = `\u26A0 ${err.message}`;
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
      if (!iframeEl) {
        await loadIframe();
        return;
      }
      try {
        iframeEl.src = await buildIframeUrl();
      } catch (err) {
        console.warn("[nhi-fhir sidebar]", err.message);
      }
    }
    function setOpen(open) {
      panel.classList.toggle("open", open);
      applyWidth(currentWidth);
      if (open)
        loadIframe().catch(() => {
        });
      if (isContextAlive()) {
        chrome.storage.local.set({ [STORAGE_KEY]: open }).catch(() => {
        });
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
    chrome.storage.local.get(STORAGE_KEY).then((d) => {
      if (d[STORAGE_KEY])
        setOpen(true);
    }).catch(() => {
    });
    let _pausedSrc = null;
    function pauseIframe() {
      if (!iframeEl || _pausedSrc !== null)
        return;
      _pausedSrc = iframeEl.src;
      iframeEl.src = "about:blank";
    }
    function resumeIframe() {
      if (!iframeEl || _pausedSrc === null)
        return;
      iframeEl.src = _pausedSrc;
      _pausedSrc = null;
    }
    chrome.storage.local.get("syncRunning").then((d) => {
      if (d.syncRunning)
        pauseIframe();
    }).catch(() => {
    });
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "local" || !("syncRunning" in changes))
        return;
      if (changes.syncRunning.newValue)
        pauseIframe();
      else
        resumeIframe();
    });
  })();
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3NpZGViYXIuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIE5ISS1GSElSIEJyaWRnZSBcdTIwMTQgY29sbGFwc2libGUgcmlnaHQtc2lkZSBwYW5lbCBpbmplY3RlZCBpbnRvIEhJUyBwYWdlcy5cbi8vXG4vLyBHb2FscyBvZiB0aGlzIFBvQzpcbi8vIDEuIFByb3ZlIHdlIGNhbiByZW5kZXIgYW4gaWZyYW1lIG9mIHRoZSBtZWRpY2FsLW5vdGUgU01BUlQgYXBwIGluc2lkZVxuLy8gICAgdGhlIE5ISSBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0EgcGFnZSB3aXRob3V0IENTUCAvIFgtRnJhbWUtT3B0aW9ucyBpc3N1ZXMuXG4vLyAyLiBLZWVwIHRoZSBzaWRlYmFyIGlzb2xhdGVkIGZyb20gdGhlIGhvc3QgcGFnZSdzIENTUyB2aWEgU2hhZG93IERPTVxuLy8gICAgc28gSElTLXNwZWNpZmljIHN0eWxlcyBjYW4ndCBibGVlZCBpbiBhbmQgYnJlYWsgbGF5b3V0LlxuLy8gMy4gR2l2ZSBhIHNpbmdsZSB0b2dnbGUgYnV0dG9uIChwcmlzbSBtYXJrIFx1MjAxNCBzYW1lIGFzIG1lZGljYWwtbm90ZSdzXG4vLyAgICBhcHAgaWNvbikgYXQgdGhlIHJpZ2h0IGVkZ2UgdGhhdCBzbGlkZXMgdGhlIHBhbmVsIGluL291dC4gU3RhdGVcbi8vICAgIHBlcnNpc3RzIGFjcm9zcyBuYXZpZ2F0aW9ucyBvbiB0aGUgc2FtZSBvcmlnaW5cbi8vICAgIHZpYSBjaHJvbWUuc3RvcmFnZS5sb2NhbC5cbi8vXG4vLyBOb3QgaW4gc2NvcGUgaGVyZTpcbi8vIC0gcG9zdE1lc3NhZ2UgYnJpZGdlIGZyb20gdGhlIGlmcmFtZSB0byB0aGUgU1cgKGRhdGUtcmFuZ2UgdG9vbCBjYWxscykuXG4vLyAgIFRoYXQgY29tZXMgb25jZSB3ZSBjb25maXJtIHRoZSBiYXNpYyBlbWJlZCByZW5kZXJzLlxuLy8gLSBQZXItSElTIGF1dGggaGFuZG9mZiAoRkhJUiBsYXVuY2ggdG9rZW4sIGV0Yy4pLlxuXG4oKCkgPT4ge1xuICAvLyBSZS1pbmplY3Rpb24gKGUuZy4gYmFja2dyb3VuZC5qcyBjYWxsaW5nIGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdFxuICAvLyBhZnRlciBhbiBleHRlbnNpb24gdXBkYXRlKSBtZWFucyB0aGUgc2NyaXB0IHJ1bnMgYWdhaW4gb24gYSBwYWdlIHRoYXRcbiAgLy8gYWxyZWFkeSBoYXMgYSBob3N0IGVsZW1lbnQgZnJvbSB0aGUgcHJldmlvdXMgaW5zdGFuY2UuIENsZWFuIHVwIHRoZVxuICAvLyBzdGFsZSBob3N0IHNvIHRoZSB0b2dnbGUgYnV0dG9uIGRvZXNuJ3QgYXBwZWFyIHR3aWNlLlxuICAvLyBMZWZ0b3ZlciBjaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQgbGlzdGVuZXJzIGZyb20gdGhlIG9sZCBzY3JpcHRcbiAgLy8gaW5zdGFuY2UgY2FuJ3QgYmUgdW5yZWdpc3RlcmVkLCBidXQgdGhleSByZWZlcmVuY2UgZGV0YWNoZWQgRE9NXG4gIC8vIG5vZGVzIHNvIHRoZWlyIGNhbGxiYWNrcyBhcmUgdmlzdWFsIG5vLW9wcy5cbiAgY29uc3QgcHJldmlvdXNIb3N0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuaGktZmhpci1zaWRlYmFyLWhvc3RcIik7XG4gIGlmIChwcmV2aW91c0hvc3QpIHByZXZpb3VzSG9zdC5yZW1vdmUoKTtcblxuICBjb25zdCBTSURFQkFSX0RFRkFVTFRfV0lEVEggPSA0MjA7XG4gIGNvbnN0IFNJREVCQVJfTUlOX1dJRFRIID0gMjgwO1xuICBjb25zdCBTSURFQkFSX01BWF9XSURUSCA9IDEyMDA7XG4gIGNvbnN0IFNUT1JBR0VfS0VZID0gXCJzaWRlYmFyX29wZW5cIjtcbiAgY29uc3QgV0lEVEhfS0VZID0gXCJzaWRlYmFyX3dpZHRoXCI7XG4gIC8vIFRoZSBTTUFSVCBsYXVuY2ggZW50cnkgdGhhdCBmaGlyY2xpZW50IGV4cGVjdHMgdG8gaGFuZGxlIHRoZSBpc3MrbGF1bmNoXG4gIC8vIHBhcmFtcyBhbmQgcnVuIEZISVIub2F1dGgyLmF1dGhvcml6ZSgpLlxuICBjb25zdCBBUFBfTEFVTkNIX1BBVEggPSBcIi9zbWFydC9sYXVuY2hcIjtcbiAgLy8gQ2hyb21lJ3MgUHJpdmF0ZSBOZXR3b3JrIEFjY2VzcyBibG9ja3MgZmV0Y2hlcyBmcm9tIHB1YmxpYyBvcmlnaW5zXG4gIC8vIChnaXRodWIuaW8pIGludG8gbG9vcGJhY2sgKGxvY2FsaG9zdCkgZXZlbiB3aGVuIHRoZSBzZXJ2ZXIgcmV0dXJuc1xuICAvLyBBY2Nlc3MtQ29udHJvbC1BbGxvdy1Qcml2YXRlLU5ldHdvcms6IHRydWUgXHUyMDE0IGFwcGFyZW50bHkgdGhpcyBpcyBiZWluZ1xuICAvLyB0aWdodGVuZWQgdG8gXCJhbHdheXMgYmxvY2tcIiBpbiBuZXdlciBDaHJvbWVzLiBFYXNpZXN0IGZpeCBpcyB0byBwb2ludFxuICAvLyB0aGUgaWZyYW1lIGF0IHRoZSBsb2NhbCBkZXYgc2VydmVyIG9mIG1lZGljYWwtbm90ZSAobG9jYWxob3N0OjMwMDEpLFxuICAvLyBzYW1lIHNjaGVtZSBhcyBiYWNrZW5kLCBzbyBubyBQTkEgY3Jvc3NpbmcgaGFwcGVucyBhdCBhbGwuIEZhbGxzIGJhY2tcbiAgLy8gdG8gdGhlIGRlcGxveWVkIGdpdGh1Yi5pbyBhcHAgd2hlbiB0aGUgbG9jYWwgb25lIGlzbid0IHJ1bm5pbmcuXG4gIC8vIExvY2FsIE5leHQuanMgZGV2IHNlcnZlcjogcnVucyBhdCByb290IChubyAvbWVkaWNhbC1ub3RlLXNtYXJ0LW9uLWZoaXJcbiAgLy8gcHJlZml4IFx1MjAxNCB0aGUgbGF1bmNoIHBhZ2UgZGV0ZWN0cyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgYW5kIHNldHNcbiAgLy8gcHJlZml4ID0gXCJcIiB3aGVuIG5vdCBvbiB0aGUgZ2l0aHViLmlvIHJlcG8gc3VicGF0aCkuXG4gIGNvbnN0IEFQUF9CQVNFX0xPQ0FMID0gXCJodHRwOi8vbG9jYWxob3N0OjMwMDFcIjtcbiAgY29uc3QgQVBQX0JBU0VfREVQTE9ZRUQgPSBcImh0dHBzOi8vdm9obzAwMDAuZ2l0aHViLmlvL21lZGljYWwtbm90ZS1zbWFydC1vbi1maGlyXCI7XG4gIGNvbnN0IERFRkFVTFRfQkFDS0VORCA9IFwiaHR0cDovL2xvY2FsaG9zdDo4MDEwXCI7XG5cbiAgLy8gSG9zdCBlbGVtZW50ICsgU2hhZG93IHJvb3Qgc28gdGhlIGhvc3QgcGFnZSdzIENTUyBuZXZlciB0b3VjaGVzIHVzLlxuICBjb25zdCBob3N0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgaG9zdC5pZCA9IFwibmhpLWZoaXItc2lkZWJhci1ob3N0XCI7XG4gIC8vIFBpbiB0byB0aGUgcGFnZSwgYWJvdmUgYWxtb3N0IGV2ZXJ5dGhpbmcuIE5ISSB1c2VzIHNvbWUgei1pbmRleFxuICAvLyB2YWx1ZXMgYnV0IG5vdGhpbmcgYWJvdmUgOTk5OS5cbiAgaG9zdC5zdHlsZS5jc3NUZXh0ID0gYFxuICAgIGFsbDogaW5pdGlhbDtcbiAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgdG9wOiAwO1xuICAgIHJpZ2h0OiAwO1xuICAgIGhlaWdodDogMTAwdmg7XG4gICAgei1pbmRleDogMjE0NzQ4MzY0NjtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgYDtcbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKGhvc3QpO1xuXG4gIC8vIFRoZSBzaWRlYmFyJ3MgYXNzaXN0YW50IGJ1dHRvbiArIGlmcmFtZSBwYW5lbCBhcmUgb25seSB1c2VmdWwgaW5cbiAgLy8gXCJcdTRFMEFcdTUwQjNcdTVGOENcdTdBRUZcIiBtb2RlIFx1MjAxNCB0aGUgaWZyYW1lIGlzIGEgU01BUlQgYXBwIHRoYXQgdGFsa3MgdG8gdGhlIGxvY2FsXG4gIC8vIEZISVIgYmFja2VuZC4gSW4gXCJcdTRFMEJcdThGMDlcdTUyMzBcdTk2RkJcdTgxNjZcIiBtb2RlIHRoZXJlJ3Mgbm8gYmFja2VuZCB0byB0YWxrIHRvLFxuICAvLyBzbyBoaWRlIHRoZSB3aG9sZSB0aGluZy5cbiAgLy9cbiAgLy8gUGx1cyBhbiBleHBsaWNpdCBgc2lkZWJhckVuYWJsZWRgIG9wdC1vdXQ6IHVzZXJzIHdobyBvbmx5IHdhbnQgdGhlXG4gIC8vIHJhdyBGSElSIEJ1bmRsZSBhbmQgbmV2ZXIgcGxhbiB0byBlbWJlZCBTTUFSVCBhcHBzIG9uIHRoZSBOSEkgcGFnZVxuICAvLyBjYW4gdHVybiB0aGUgcGFuZWwgb2ZmIGVudGlyZWx5IHZpYSB0aGUgcG9wdXAncyBcdTMwMENcdTI2OTlcdUZFMEYgXHU5MDMyXHU5NjhFXHU4QTJEXHU1QjlBXHUzMDBELlxuICAvLyBBbGwgc2V0dGluZ3MgKHN5bmNNb2RlLCBzaWRlYmFyRW5hYmxlZCkgbGl2ZSBpbiBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuICAvLyBzaW5jZSB2MC41LjAgXHUyMDE0IHNpZGViYXIuanMgd2FzIG1pc3NlZCBpbiB0aGF0IG1pZ3JhdGlvbiBhbmQga2VwdFxuICAvLyByZWFkaW5nIGZyb20gLnN5bmMsIHdoaWNoIG9ubHkgZXZlciBoZWxkIHVuZGVmaW5lZCB2YWx1ZXMgYWZ0ZXJcbiAgLy8gdGhlIG1pZ3JhdGlvbiBjbGVhcmVkIHRoZSBrZXlzLiBSZXN1bHQ6IHRoZSBhc3Npc3RhbnQgcGlsbCBuZXZlclxuICAvLyBhcHBlYXJlZCBldmVuIHdoZW4gdGhlIHVzZXIgaGFkIHRpY2tlZCBcIlx1OTg2Rlx1NzkzQVx1NTJBOVx1NzQwNlx1OTc2Mlx1Njc3RlwiIGluIHBvcHVwLlxuICBhc3luYyBmdW5jdGlvbiBfYXBwbHlNb2RlVmlzaWJpbGl0eSgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBzeW5jTW9kZSwgc2lkZWJhckVuYWJsZWQgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXG4gICAgICAgIFwic3luY01vZGVcIiwgXCJzaWRlYmFyRW5hYmxlZFwiLFxuICAgICAgXSk7XG4gICAgICBjb25zdCB2aXNpYmxlID0gc2lkZWJhckVuYWJsZWQgIT09IGZhbHNlICYmIHN5bmNNb2RlID09PSBcImJhY2tlbmRcIjtcbiAgICAgIGhvc3Quc3R5bGUuZGlzcGxheSA9IHZpc2libGUgPyBcIlwiIDogXCJub25lXCI7XG4gICAgfSBjYXRjaCB7XG4gICAgICBob3N0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG4gIH1cbiAgX2FwcGx5TW9kZVZpc2liaWxpdHkoKTtcbiAgY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBhcmVhKSA9PiB7XG4gICAgaWYgKGFyZWEgIT09IFwibG9jYWxcIikgcmV0dXJuO1xuICAgIGlmIChcInN5bmNNb2RlXCIgaW4gY2hhbmdlcyB8fCBcInNpZGViYXJFbmFibGVkXCIgaW4gY2hhbmdlcykge1xuICAgICAgX2FwcGx5TW9kZVZpc2liaWxpdHkoKTtcbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IHJvb3QgPSBob3N0LmF0dGFjaFNoYWRvdyh7IG1vZGU6IFwib3BlblwiIH0pO1xuICByb290LmlubmVySFRNTCA9IGBcbiAgICA8c3R5bGU+XG4gICAgICA6aG9zdCwgKiB7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7IH1cbiAgICAgIC50b2dnbGUge1xuICAgICAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgICAgIHRvcDogNTAlO1xuICAgICAgICByaWdodDogMDtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xuICAgICAgICB3aWR0aDogMjhweDtcbiAgICAgICAgaGVpZ2h0OiA3MnB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiAjMjU2M2ViO1xuICAgICAgICBjb2xvcjogd2hpdGU7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4IDAgMCA4cHg7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgZm9udC1mYW1pbHk6IC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgc2Fucy1zZXJpZjtcbiAgICAgICAgYm94LXNoYWRvdzogLTFweCAycHggNnB4IHJnYmEoMCwwLDAsMC4xMik7XG4gICAgICAgIHBvaW50ZXItZXZlbnRzOiBhdXRvO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgdHJhbnNpdGlvbjogcmlnaHQgMC4ycyBlYXNlLCBiYWNrZ3JvdW5kIDAuMnMgZWFzZSwgdHJhbnNmb3JtIDAuMnMgZWFzZTtcbiAgICAgICAgLyogU3VidGxlIDMtY3ljbGUgcHVsc2Ugb24gZmlyc3QgcGFpbnQgc28gYSBicmFuZC1uZXcgdXNlciBzZWVzXG4gICAgICAgICAgIFwib2ggdGhhdCdzIGEgYnV0dG9uXCIuIDMgY3ljbGVzIHRoZW4gc3RvcHMgXHUyMDE0IG5ldmVyIGdldHMgaW5cbiAgICAgICAgICAgdGhlIHdheSBhZnRlci4gKi9cbiAgICAgICAgYW5pbWF0aW9uOiBuZmItdG9nZ2xlLXB1bHNlIDEuNnMgZWFzZS1vdXQgMyBmb3J3YXJkcztcbiAgICAgIH1cbiAgICAgIC50b2dnbGUgc3ZnIHsgZGlzcGxheTogYmxvY2s7IHdpZHRoOiAyMHB4OyBoZWlnaHQ6IDIwcHg7IH1cbiAgICAgIC50b2dnbGU6aG92ZXIge1xuICAgICAgICBiYWNrZ3JvdW5kOiAjMWQ0ZWQ4O1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSkgdHJhbnNsYXRlWCgtMnB4KTtcbiAgICAgIH1cbiAgICAgIC50b2dnbGU6Zm9jdXMtdmlzaWJsZSB7XG4gICAgICAgIG91dGxpbmU6IDJweCBzb2xpZCAjOTNjNWZkO1xuICAgICAgICBvdXRsaW5lLW9mZnNldDogMnB4O1xuICAgICAgfVxuICAgICAgQGtleWZyYW1lcyBuZmItdG9nZ2xlLXB1bHNlIHtcbiAgICAgICAgMCUsIDEwMCUgeyBib3gtc2hhZG93OiAtMXB4IDJweCA2cHggcmdiYSgwLDAsMCwwLjEyKTsgfVxuICAgICAgICA1MCUgeyBib3gtc2hhZG93OiAtMXB4IDJweCA2cHggcmdiYSgwLDAsMCwwLjEyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgMCAwIDAgNXB4IHJnYmEoNTksIDEzMCwgMjQ2LCAwLjM1KTsgfVxuICAgICAgfVxuICAgICAgQG1lZGlhIChwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpIHtcbiAgICAgICAgLnRvZ2dsZSB7IGFuaW1hdGlvbjogbm9uZTsgfVxuICAgICAgfVxuICAgICAgLnBhbmVsIHtcbiAgICAgICAgcG9zaXRpb246IGZpeGVkO1xuICAgICAgICB0b3A6IDA7XG4gICAgICAgIHJpZ2h0OiAtJHtTSURFQkFSX0RFRkFVTFRfV0lEVEggKyAzMH1weDtcbiAgICAgICAgaGVpZ2h0OiAxMDB2aDtcbiAgICAgICAgd2lkdGg6ICR7U0lERUJBUl9ERUZBVUxUX1dJRFRIfXB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgICAgICAgYm94LXNoYWRvdzogLTRweCAwIDEycHggcmdiYSgwLDAsMCwwLjEpO1xuICAgICAgICAvKiBObyB0cmFuc2l0aW9uIHdoaWxlIHVzZXIgaXMgZHJhZ2dpbmcgXHUyMDE0IHNldCBpbmxpbmUuICovXG4gICAgICAgIHRyYW5zaXRpb246IHJpZ2h0IDAuMjVzIGVhc2U7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIHBvaW50ZXItZXZlbnRzOiBhdXRvO1xuICAgICAgICBib3JkZXItbGVmdDogMXB4IHNvbGlkICNlNWU3ZWI7XG4gICAgICB9XG4gICAgICAucGFuZWwub3BlbiB7IHJpZ2h0OiAwOyB9XG4gICAgICAvKiBEcmFnIGhhbmRsZSBvbiB0aGUgTEVGVCBlZGdlIG9mIHRoZSBvcGVuIHBhbmVsLiBXaWRlIGVub3VnaFxuICAgICAgICAgKDZweCkgdG8gYmUgZWFzeSB0byBncmFiIGJ1dCBpbnZpc2libGUgdW50aWwgaG92ZXJlZC4gV2hpbGVcbiAgICAgICAgIGRyYWdnaW5nIHRoZSB0b2dnbGUvdHJhbnNpdGlvbiBpcyBkaXNhYmxlZCBzbyByZXNpemluZyBmZWVsc1xuICAgICAgICAgY3Jpc3AuICovXG4gICAgICAucmVzaXplciB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgdG9wOiAwOyBsZWZ0OiAtM3B4O1xuICAgICAgICB3aWR0aDogNnB4OyBoZWlnaHQ6IDEwMCU7XG4gICAgICAgIGN1cnNvcjogZXctcmVzaXplO1xuICAgICAgICB6LWluZGV4OiAxO1xuICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICAgIH1cbiAgICAgIC5yZXNpemVyOmhvdmVyLCAucGFuZWwucmVzaXppbmcgLnJlc2l6ZXIge1xuICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsIHRyYW5zcGFyZW50LCAjMjU2M2ViMzMsIHRyYW5zcGFyZW50KTtcbiAgICAgIH1cbiAgICAgIC5wYW5lbC5yZXNpemluZyB7IHRyYW5zaXRpb246IG5vbmUgIWltcG9ydGFudDsgdXNlci1zZWxlY3Q6IG5vbmU7IH1cbiAgICAgIC5wYW5lbC5yZXNpemluZyBpZnJhbWUgeyBwb2ludGVyLWV2ZW50czogbm9uZTsgfSAvKiBzd2FsbG93IGRyYWcgaW5zaWRlIGlmcmFtZSAqL1xuICAgICAgLmhlYWRlciB7XG4gICAgICAgIHBhZGRpbmc6IDEwcHggMTRweDtcbiAgICAgICAgYmFja2dyb3VuZDogI2Y5ZmFmYjtcbiAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlNWU3ZWI7XG4gICAgICAgIGZvbnQ6IDYwMCAxM3B4IC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgc2Fucy1zZXJpZjtcbiAgICAgICAgY29sb3I6ICMxZTNhOGE7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgIH1cbiAgICAgIC5oZWFkZXItdGl0bGUge1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiA3cHg7XG4gICAgICB9XG4gICAgICAuaGVhZGVyLW1hcmsgeyB3aWR0aDogMTZweDsgaGVpZ2h0OiAxNnB4OyBmbGV4OiAwIDAgMTZweDsgfVxuICAgICAgLmhlYWRlciAuY2xvc2Uge1xuICAgICAgICBiYWNrZ3JvdW5kOiBub25lO1xuICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICAgICAgY29sb3I6ICM2YjcyODA7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgcGFkZGluZzogMCA0cHg7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgbWluLXdpZHRoOiAyNnB4O1xuICAgICAgICBoZWlnaHQ6IDI2cHg7XG4gICAgICB9XG4gICAgICAuaGVhZGVyIC5jbG9zZTpob3ZlciB7IGNvbG9yOiAjMWYyOTM3OyB9XG4gICAgICAuaGVhZGVyIC5jbG9zZSBzdmcgeyB3aWR0aDogMTZweDsgaGVpZ2h0OiAxNnB4OyB9XG4gICAgICBpZnJhbWUge1xuICAgICAgICBmbGV4OiAxO1xuICAgICAgICBib3JkZXI6IDA7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgICAgIH1cbiAgICAgIC5lbXB0eSB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBmbGV4OiAxO1xuICAgICAgICBjb2xvcjogIzljYTNhZjtcbiAgICAgICAgZm9udDogMTNweCAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIHNhbnMtc2VyaWY7XG4gICAgICAgIGdhcDogMTJweDtcbiAgICAgICAgcGFkZGluZzogMjBweDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgfVxuICAgICAgLmVtcHR5IGJ1dHRvbiB7XG4gICAgICAgIHBhZGRpbmc6IDhweCAxNnB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiAjMjU2M2ViO1xuICAgICAgICBjb2xvcjogd2hpdGU7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNnB4O1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgICAgIH1cbiAgICA8L3N0eWxlPlxuXG4gICAgPGJ1dHRvbiBjbGFzcz1cInRvZ2dsZVwiIGlkPVwidG9nZ2xlXCJcbiAgICAgICAgICAgIHRpdGxlPVwiXHU5RURFXHU2QjY0XHU5NThCXHU1NTVGIE5ISS1GSElSIEJyaWRnZSBcdTUyQTlcdTc0MDZcdTk3NjJcdTY3N0ZcIlxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIlx1OTU4Qlx1NTU1RiBOSEktRkhJUiBCcmlkZ2UgXHU1MkE5XHU3NDA2XHU5NzYyXHU2NzdGXCI+XG4gICAgICA8IS0tIFByaXNtIG1hcmsgXHUyMDE0IHNhbWUgc2hhcGUgYXMgbWVkaWNhbC1ub3RlJ3MgYXBwIGljb24sIHNvIHRoZVxuICAgICAgICAgICB0cmlnZ2VyIHZpc3VhbGx5IG1hdGNoZXMgdGhlIGFwcCBpdCBvcGVucy4gY3VycmVudENvbG9yXG4gICAgICAgICAgIGxldHMgdGhlIHdoaXRlIHN0cm9rZSBpbmhlcml0IGZyb20gLnRvZ2dsZSdzIGNvbG9yOiB3aGl0ZS4gLS0+XG4gICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjU2IDI1NlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgc3Ryb2tlLXdpZHRoPVwiMTRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAgPHBhdGggZD1cIk0gODAgODAgTCAxNzYgODBcIi8+XG4gICAgICAgIDxwYXRoIGQ9XCJNIDgwIDgwIEwgNDggMTc2XCIvPlxuICAgICAgICA8cGF0aCBkPVwiTSAxNzYgODAgTCAyMDggMTc2XCIvPlxuICAgICAgICA8cGF0aCBkPVwiTSA0OCAxNzYgTCAyMDggMTc2XCIvPlxuICAgICAgICA8cGF0aCBkPVwiTSA0OCAxNzYgTCAxMjggMjI0IEwgMjA4IDE3NlwiLz5cbiAgICAgICAgPHBhdGggZD1cIk0gODAgODAgTCAxMjggMTc2XCIvPlxuICAgICAgICA8cGF0aCBkPVwiTSAxNzYgODAgTCAxMjggMTc2XCIvPlxuICAgICAgICA8cGF0aCBkPVwiTSAxMjggMTc2IEwgMTI4IDIyNFwiLz5cbiAgICAgIDwvc3ZnPlxuICAgIDwvYnV0dG9uPlxuICAgIDxkaXYgY2xhc3M9XCJwYW5lbFwiIGlkPVwicGFuZWxcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJyZXNpemVyXCIgaWQ9XCJyZXNpemVyXCIgdGl0bGU9XCJcdTYyRDZcdTY2RjNcdThBQkZcdTY1NzRcdTVCRUNcdTVFQTZcIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJoZWFkZXItdGl0bGVcIj5cbiAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjU2IDI1NlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgIHN0cm9rZS13aWR0aD1cIjE2XCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGNsYXNzPVwiaGVhZGVyLW1hcmtcIj5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNIDgwIDgwIEwgMTc2IDgwXCIvPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0gODAgODAgTCA0OCAxNzZcIi8+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTSAxNzYgODAgTCAyMDggMTc2XCIvPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0gNDggMTc2IEwgMjA4IDE3NlwiLz5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNIDQ4IDE3NiBMIDEyOCAyMjQgTCAyMDggMTc2XCIvPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0gODAgODAgTCAxMjggMTc2XCIvPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0gMTc2IDgwIEwgMTI4IDE3NlwiLz5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNIDEyOCAxNzYgTCAxMjggMjI0XCIvPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgIE5ISS1GSElSIEJyaWRnZSBcdTUyQTlcdTc0MDZcbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8c3BhbiBzdHlsZT1cImRpc3BsYXk6ZmxleDtnYXA6NHB4XCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNsb3NlXCIgaWQ9XCJwb3BvdXRcIiB0aXRsZT1cIlx1NzlGQlx1NTIzMFx1NzM2OFx1N0FDQlx1ODk5Nlx1N0E5NyAocG9wLW91dClcIiBhcmlhLWxhYmVsPVwicG9wIG91dFwiPlxuICAgICAgICAgICAgPCEtLSBcImV4dGVybmFsIGxpbmsgLyBvcGVuIGluIG5ldyB3aW5kb3dcIiBpY29uLiBJbmxpbmUgU1ZHIHNvXG4gICAgICAgICAgICAgICAgIGl0IHJlbmRlcnMgdGhlIHNhbWUgb24gZXZlcnkgT1Mgd2l0aG91dCByZWx5aW5nIG9uIGVtb2ppXG4gICAgICAgICAgICAgICAgIGZvbnQgY292ZXJhZ2UuIC0tPlxuICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgICBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTQgNGg2djZcIi8+XG4gICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjAgNCAxMiAxMlwiLz5cbiAgICAgICAgICAgICAgPHBhdGggZD1cIk0xOSAxM3Y2YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0yVjdhMiAyIDAgMCAxIDItMmg2XCIvPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNsb3NlXCIgaWQ9XCJyZWxvYWRcIiB0aXRsZT1cIlx1NUYzN1x1NTIzNlx1OTFDRFx1NjVCMFx1OEYwOVx1NTE2NVx1NTJBOVx1NzQwNiAoXHU3RTVFIGNhY2hlKVwiXG4gICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiXHU1RjM3XHU1MjM2XHU5MUNEXHU2NUIwXHU4RjA5XHU1MTY1XHU1MkE5XHU3NDA2XCI+XG4gICAgICAgICAgICA8IS0tIGx1Y2lkZSBSb3RhdGVDdy4gUmVwbGFjZXMgdW5pY29kZSBcdUQ4M0RcdUREMDQgd2hpY2ggcmVuZGVycyB2ZXJ5XG4gICAgICAgICAgICAgICAgIGRpZmZlcmVudGx5IGFjcm9zcyBPU2VzIC8gZW1vamkgZm9udHMgKGVzcGVjaWFsbHkgV2luKS4gLS0+XG4gICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj5cbiAgICAgICAgICAgICAgPHBhdGggZD1cIk0yMSAxMmE5IDkgMCAxIDEtOS05YzIuNTIgMCA0LjkzIDEgNi43NCAyLjc0TDIxIDhcIi8+XG4gICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjEgM3Y1aC01XCIvPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNsb3NlXCIgaWQ9XCJjbG9zZVwiIHRpdGxlPVwiXHU2NTM2XHU4RDc3XCIgYXJpYS1sYWJlbD1cIlx1NjUzNlx1OEQ3N1wiPlxuICAgICAgICAgICAgPCEtLSBsdWNpZGUgWCBcdTIwMTQgbWF0Y2hlcyB0aGUgcmVzdCBvZiB0aGUgU1ZHIGljb24gZmFtaWx5IGluXG4gICAgICAgICAgICAgICAgIHRoaXMgaGVhZGVyIHNvIHRoZSB3aG9sZSByb3cgcmVhZHMgYXMgb25lIHRvb2xiYXIuIC0tPlxuICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgICBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgICAgICAgIDxsaW5lIHgxPVwiMThcIiB5MT1cIjZcIiB4Mj1cIjZcIiB5Mj1cIjE4XCIvPlxuICAgICAgICAgICAgICA8bGluZSB4MT1cIjZcIiB5MT1cIjZcIiB4Mj1cIjE4XCIgeTI9XCIxOFwiLz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJlbXB0eVwiIGlkPVwiZW1wdHlcIj5cbiAgICAgICAgPGRpdj5cdTdCMkNcdTRFMDBcdTZCMjFcdTRGN0ZcdTc1MjggXHUyMDE0IFx1OUVERVx1NEUwQlx1NjVCOVx1OEYwOVx1NTE2NSBtZWRpY2FsLW5vdGUgXHU1MkE5XHU3NDA2PC9kaXY+XG4gICAgICAgIDxidXR0b24gaWQ9XCJsb2FkXCI+XHU4RjA5XHU1MTY1XHU1MkE5XHU3NDA2ICh+M3MpPC9idXR0b24+XG4gICAgICAgIDxkaXYgc3R5bGU9XCJmb250LXNpemU6MTFweDtjb2xvcjojOWNhM2FmO21hcmdpbi10b3A6OHB4XCI+XG4gICAgICAgICAgXHU4RjA5XHU1MTY1XHU1RjhDXHU1M0VGXHU0RkREXHU2MzAxXHU5NThCXHU1NTVGXHVGRjFCXHU1MjA3XHU1MjMwXHU1MTc2XHU0RUQ2XHU3NUM1XHU0RUJBXHU2NjQyXHU3NTI4XHU1REU2XHU0RTBBXHU3Njg0IHBhdGllbnQgcGlja2VyIFx1NTIwN1x1NjNEQlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgO1xuXG4gIGNvbnN0IHBhbmVsID0gcm9vdC5nZXRFbGVtZW50QnlJZChcInBhbmVsXCIpO1xuICBjb25zdCB0b2dnbGVCdG4gPSByb290LmdldEVsZW1lbnRCeUlkKFwidG9nZ2xlXCIpO1xuICBjb25zdCBjbG9zZUJ0biA9IHJvb3QuZ2V0RWxlbWVudEJ5SWQoXCJjbG9zZVwiKTtcbiAgY29uc3QgbG9hZEJ0biA9IHJvb3QuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkXCIpO1xuICBjb25zdCBlbXB0eUJveCA9IHJvb3QuZ2V0RWxlbWVudEJ5SWQoXCJlbXB0eVwiKTtcbiAgY29uc3QgcmVzaXplciA9IHJvb3QuZ2V0RWxlbWVudEJ5SWQoXCJyZXNpemVyXCIpO1xuICBjb25zdCBwb3BvdXRCdG4gPSByb290LmdldEVsZW1lbnRCeUlkKFwicG9wb3V0XCIpO1xuXG4gIC8vIFx1MjUwMFx1MjUwMCBXaWR0aCBwZXJzaXN0ZW5jZSArIGRyYWctdG8tcmVzaXplIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBUaGUgcGFuZWwncyB3aWR0aCBpcyByZXN0b3JlZCBmcm9tIHN0b3JhZ2UgYW5kIHRoZSBDU1MgcnVsZSB0aGF0XG4gIC8vIGhpZGVzIHRoZSBwYW5lbCBvZmYtc2NyZWVuIChcInJpZ2h0OiAtPHdpZHRoKzMwPnB4XCIpIGlzIHJld3JpdHRlbiBpblxuICAvLyBzeW5jLiBXZSBjYW4ndCB0b3VjaCB0aGUgb3JpZ2luYWwgPHN0eWxlPiBydWxlLCBzbyB3ZSBvdmVycmlkZSB2aWFcbiAgLy8gYW4gaW5saW5lIGByaWdodGAgc3R5bGUgd2hlbiB0aGUgcGFuZWwgaXMgY2xvc2VkLlxuICBsZXQgY3VycmVudFdpZHRoID0gU0lERUJBUl9ERUZBVUxUX1dJRFRIO1xuICBmdW5jdGlvbiBhcHBseVdpZHRoKHB4KSB7XG4gICAgY3VycmVudFdpZHRoID0gTWF0aC5tYXgoU0lERUJBUl9NSU5fV0lEVEgsIE1hdGgubWluKFNJREVCQVJfTUFYX1dJRFRILCBNYXRoLnJvdW5kKHB4KSkpO1xuICAgIHBhbmVsLnN0eWxlLndpZHRoID0gYCR7Y3VycmVudFdpZHRofXB4YDtcbiAgICAvLyBLZWVwIHRoZSBvZmYtc2NyZWVuIG9mZnNldCBpbiBzeW5jIChzbGlnaHRseSBtb3JlIHRoYW4gd2lkdGggc29cbiAgICAvLyB0aGUgYm94LXNoYWRvdyBpcyBoaWRkZW4gdG9vKS5cbiAgICBpZiAoIXBhbmVsLmNsYXNzTGlzdC5jb250YWlucyhcIm9wZW5cIikpIHtcbiAgICAgIHBhbmVsLnN0eWxlLnJpZ2h0ID0gYC0ke2N1cnJlbnRXaWR0aCArIDMwfXB4YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFuZWwuc3R5bGUucmlnaHQgPSBcIjBcIjtcbiAgICB9XG4gICAgLy8gTW92ZSB0aGUgdG9nZ2xlIGhhbmRsZSB0byBzaXQgZmx1c2ggd2l0aCB0aGUgb3BlbiBwYW5lbCdzIGxlZnQgZWRnZS5cbiAgICB0b2dnbGVCdG4uc3R5bGUucmlnaHQgPSBwYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoXCJvcGVuXCIpID8gYCR7Y3VycmVudFdpZHRofXB4YCA6IFwiMFwiO1xuICB9XG4gIC8vIEluaXRpYWw6IHJlc3RvcmUgbGFzdC11c2VkIHdpZHRoLlxuICBpZiAoaXNDb250ZXh0QWxpdmUoKSkge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChXSURUSF9LRVkpLnRoZW4oKGQpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgZFtXSURUSF9LRVldID09PSBcIm51bWJlclwiKSBhcHBseVdpZHRoKGRbV0lEVEhfS0VZXSk7XG4gICAgfSkuY2F0Y2goKCkgPT4ge30pO1xuICB9XG4gIC8vIERyYWc6IHRyYWNrIGRlbHRhIHZzLiBzdGFydGluZyBtb3VzZVgsIHJlY29tcHV0ZSB3aWR0aCBvbiBlYWNoIG1vdmUuXG4gIGxldCBkcmFnU3RhcnRYID0gMCwgZHJhZ1N0YXJ0VyA9IDA7XG4gIGZ1bmN0aW9uIG9uRHJhZ01vdmUoZSkge1xuICAgIC8vIFJlc2l6ZXIgaXMgb24gdGhlIExFRlQgZWRnZSBcdTIwMTQgZHJhZ2dpbmcgbGVmdCBncm93cyB0aGUgcGFuZWwuXG4gICAgY29uc3QgZGVsdGEgPSBkcmFnU3RhcnRYIC0gZS5jbGllbnRYO1xuICAgIGFwcGx5V2lkdGgoZHJhZ1N0YXJ0VyArIGRlbHRhKTtcbiAgfVxuICBmdW5jdGlvbiBvbkRyYWdFbmQoKSB7XG4gICAgcGFuZWwuY2xhc3NMaXN0LnJlbW92ZShcInJlc2l6aW5nXCIpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb2ludGVybW92ZVwiLCBvbkRyYWdNb3ZlKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIG9uRHJhZ0VuZCk7XG4gICAgaWYgKGlzQ29udGV4dEFsaXZlKCkpIHtcbiAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IFtXSURUSF9LRVldOiBjdXJyZW50V2lkdGggfSkuY2F0Y2goKCkgPT4ge30pO1xuICAgIH1cbiAgfVxuICByZXNpemVyLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyZG93blwiLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBkcmFnU3RhcnRYID0gZS5jbGllbnRYO1xuICAgIGRyYWdTdGFydFcgPSBjdXJyZW50V2lkdGg7XG4gICAgcGFuZWwuY2xhc3NMaXN0LmFkZChcInJlc2l6aW5nXCIpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVybW92ZVwiLCBvbkRyYWdNb3ZlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIG9uRHJhZ0VuZCk7XG4gIH0pO1xuXG4gIC8vIFx1MjUwMFx1MjUwMCBQb3Atb3V0IHRvIHN0YW5kYWxvbmUgd2luZG93IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBPcGVucyB0aGUgc2FtZSBpZnJhbWUgVVJMIGluIGEgZnJlc2ggd2luZG93IHNvIHRoZSB1c2VyIGNhbiBtb3ZlIGl0XG4gIC8vIHRvIGEgc2Vjb25kIG1vbml0b3IgLyByZXNpemUgZnJlZWx5LiBTaWRlYmFyIGF1dG8tY29sbGFwc2VzIGFmdGVyLFxuICAvLyBzaW5jZSBib3RoIHNob3dpbmcgaXQgc2lkZS1ieS1zaWRlIHdvdWxkIGJlIGNvbmZ1c2luZy5cbiAgbGV0IHBvcG91dFdpbiA9IG51bGw7XG4gIGFzeW5jIGZ1bmN0aW9uIHBvcE91dCgpIHtcbiAgICBsZXQgdXJsO1xuICAgIHRyeSB7IHVybCA9IGF3YWl0IGJ1aWxkSWZyYW1lVXJsKCk7IH1cbiAgICBjYXRjaCAoZXJyKSB7IGNvbnNvbGUud2FybihcIltuaGktZmhpciBzaWRlYmFyXSBwb3BPdXQ6XCIsIGVyci5tZXNzYWdlKTsgcmV0dXJuOyB9XG4gICAgLy8gSWYgd2UgYWxyZWFkeSBoYXZlIGFuIG9wZW4gcG9wdXAsIHJldXNlIGl0IChyYWlzZXMgdGhlIGV4aXN0aW5nXG4gICAgLy8gd2luZG93KS4gVGhlIDJuZCB3aW5kb3cub3BlbiBjYWxsIHdpdGggdGhlIHNhbWUgbmFtZSByZWxvYWRzIGl0LlxuICAgIHBvcG91dFdpbiA9IHdpbmRvdy5vcGVuKHVybCwgXCJuaGktZmhpci1icmlkZ2UtYXNzaXN0YW50XCIsXG4gICAgICBgd2lkdGg9JHtjdXJyZW50V2lkdGh9LGhlaWdodD05MDAscmVzaXphYmxlPXllcyxzY3JvbGxiYXJzPXllc2ApO1xuICAgIGlmIChwb3BvdXRXaW4pIHtcbiAgICAgIHBvcG91dFdpbi5mb2N1cygpO1xuICAgICAgLy8gQ29sbGFwc2UgdGhlIHNpZGViYXIgc28gdGhlIHVzZXIgaXNuJ3Qgc3RhcmluZyBhdCB0aGUgc2FtZSBhcHBcbiAgICAgIC8vIGluIHR3byBwbGFjZXMuXG4gICAgICBzZXRPcGVuKGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICAvLyBCdWlsZCB0aGUgaWZyYW1lIFVSTC4gV2hlbiB3ZSBoYXZlIGEgcGF0aWVudF9pZCArIGEgd29ya2luZyBiYWNrZW5kXG4gIC8vIHdlIGhhbmQgdGhlIGFwcCBhIFNNQVJUIEVIUi1MYXVuY2ggY29udGV4dCBzbyBpdCBhdXRvLWxvYWRzIE9VUlxuICAvLyBsb2NhbCBGSElSIHN0b3JlLiBPdGhlcndpc2UganVzdCBvcGVuIHRoZSBhcHAgaG9tZSAoaXQnbGwgc2hvdyBpdHNcbiAgLy8gZGVmYXVsdCBsYW5kaW5nIC8gYSBwdWJsaWMgdGVzdCBzZXJ2ZXIpLlxuICAvLyBEZXRlY3Qgb3JwaGFuZWQgY29udGVudCBzY3JpcHQ6IGFmdGVyIHRoZSB1c2VyIHJlbG9hZHMgdGhlIGV4dGVuc2lvblxuICAvLyBmcm9tIGNocm9tZTovL2V4dGVuc2lvbnMsIHRoaXMgc2NyaXB0J3MgY2hyb21lLnJ1bnRpbWUuaWQgbGluayBnb2VzXG4gIC8vIG51bGwgYW5kIGFueSBjaHJvbWUuKiBjYWxsIHRocm93cyBcIkV4dGVuc2lvbiBjb250ZXh0IGludmFsaWRhdGVkXCIuXG4gIC8vIFRoZSBmaXggaXMgYWx3YXlzIGEgcGFnZSByZWZyZXNoIFx1MjAxNCB3ZSBqdXN0IHN1cmZhY2UgYSBjbGVhcmVyIGVycm9yLlxuICBmdW5jdGlvbiBpc0NvbnRleHRBbGl2ZSgpIHtcbiAgICB0cnkgeyByZXR1cm4gISFjaHJvbWUucnVudGltZT8uaWQ7IH0gY2F0Y2ggeyByZXR1cm4gZmFsc2U7IH1cbiAgfVxuXG4gIC8vIEFsd2F5cyBwcmVmZXIgdGhlIGxvY2FsIE5leHQuanMgZGV2IHNlcnZlciAoUE5BLWZyZWUgcGF0aCkuIFRoZVxuICAvLyBjb250ZW50IHNjcmlwdCBjYW4ndCBwcm9iZSBsb2NhbGhvc3QgZnJvbSB0aGUgTkhJIG9yaWdpbiAoUE5BIGFnYWluKSxcbiAgLy8gc28gd2UganVzdCB0cnVzdCB0aGUgdXNlciB0byBoYXZlIGBucG0gcnVuIGRldmAgcnVubmluZyBhbmQgbGV0IHRoZVxuICAvLyBpZnJhbWUgc3VyZmFjZSBhIFwiY29ubmVjdGlvbiByZWZ1c2VkXCIgaWYgdGhleSBkb24ndC4gQSBmdXR1cmUgc2V0dGluZ1xuICAvLyBjYW4gbGV0IHVzZXJzIGZsaXAgdG8gdGhlIGRlcGxveWVkIFVSTC5cbiAgYXN5bmMgZnVuY3Rpb24gcGlja0FwcEJhc2UoKSB7XG4gICAgY29uc3QgeyBzaWRlYmFyQXBwQmFzZSB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwic2lkZWJhckFwcEJhc2VcIikuY2F0Y2goKCkgPT4gKHt9KSk7XG4gICAgcmV0dXJuIHNpZGViYXJBcHBCYXNlIHx8IEFQUF9CQVNFX0xPQ0FMO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gYnVpbGRJZnJhbWVVcmwoKSB7XG4gICAgY29uc3QgY2FjaGVCdXN0ID0gYF89JHtEYXRlLm5vdygpfWA7XG4gICAgaWYgKCFpc0NvbnRleHRBbGl2ZSgpKSB7XG4gICAgICAvLyBDaHJvbWUgaW52YWxpZGF0ZXMgYSBjb250ZW50IHNjcmlwdCdzIGNocm9tZS4qIEFQSXMgdGhlIG1vbWVudFxuICAgICAgLy8gdGhlIGV4dGVuc2lvbiBpdHNlbGYgaXMgdXBkYXRlZCAvIHJlbG9hZGVkLiBUaGUgc2NyaXB0IGtlZXBzXG4gICAgICAvLyBydW5uaW5nIG9uIHRoZSBwYWdlIGJ1dCBjYW4gbm8gbG9uZ2VyIHRhbGsgdG8gc3RvcmFnZSAvIFNXIFx1MjAxNFxuICAgICAgLy8gdXNlciBoYXMgdG8gRjUgdGhlIE5ISSB0YWIgc28gYSBmcmVzaCBjb3B5IG9mIHNpZGViYXIuanMgZ2V0c1xuICAgICAgLy8gaW5qZWN0ZWQuIFBocmFzZSB0aGlzIHdpdGhvdXQgamFyZ29uLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBcIlx1NjRGNFx1NTE0NVx1NTI5Rlx1ODBGRFx1NTI1Qlx1NjZGNFx1NjVCMFx1OTA0RVx1RkYwQ1x1OEFDQlx1NjMwOSBGNSBcdTkxQ0RcdTY1QjBcdTY1NzRcdTc0MDZcdTkwMTlcdTUwMEJcdTk4MDFcdTk3NjJcdTVDMzFcdTgwRkRcdTYwNjJcdTVGQTlcdTUyQTlcdTc0MDZcdTk3NjJcdTY3N0ZcdTMwMDJcXG5cIiArXG4gICAgICAgIFwiKEV4dGVuc2lvbiB3YXMganVzdCB1cGRhdGVkIFx1MjAxNCBwcmVzcyBGNSBvbiB0aGlzIHBhZ2UgdG8gcmVsb2FkIHRoZSBzaWRlYmFyLilcIixcbiAgICAgICk7XG4gICAgfVxuICAgIGNvbnN0IHsgcGF0aWVudE92ZXJyaWRlLCBiYWNrZW5kVXJsIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1xuICAgICAgXCJwYXRpZW50T3ZlcnJpZGVcIiwgXCJiYWNrZW5kVXJsXCIsXG4gICAgXSkuY2F0Y2goKCkgPT4gKHt9KSk7XG4gICAgY29uc3QgYmFja2VuZCA9IChiYWNrZW5kVXJsIHx8IERFRkFVTFRfQkFDS0VORCkucmVwbGFjZSgvXFwvJC8sIFwiXCIpO1xuICAgIGNvbnN0IHBhdGllbnRJZCA9IHBhdGllbnRPdmVycmlkZT8uaWRfbm87XG4gICAgY29uc3QgYXBwQmFzZSA9IGF3YWl0IHBpY2tBcHBCYXNlKCk7XG4gICAgY29uc3QgYXBwSG9tZSA9IGAke2FwcEJhc2V9L2A7XG4gICAgaWYgKCFwYXRpZW50SWQpIHtcbiAgICAgIC8vIE5vIHBhdGllbnQgY29udGV4dCB5ZXQgXHUyMDE0IGxvYWQgdGhlIGFwcCBiYXJlOyB1c2VyIGNhbiBmaWxsIHRoZVxuICAgICAgLy8gcG9wdXAncyBcdUQ4M0VcdURFQUEgYXJlYSBhbmQgY2xpY2sgXHVEODNEXHVERDA0IHRvIHJlbGF1bmNoIHdpdGggY29udGV4dC5cbiAgICAgIHJldHVybiBgJHthcHBIb21lfT8ke2NhY2hlQnVzdH1gO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKGAke2JhY2tlbmR9L3NtYXJ0L2xhdW5jaC1jb250ZXh0YCwge1xuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcGF0aWVudF9pZDogcGF0aWVudElkIH0pLFxuICAgICAgfSk7XG4gICAgICBpZiAoIXIub2spIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Iuc3RhdHVzfWApO1xuICAgICAgY29uc3QgeyBsYXVuY2ggfSA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgY29uc3QgaXNzID0gYCR7YmFja2VuZH0vZmhpcmA7XG4gICAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHsgaXNzLCBsYXVuY2ggfSk7XG4gICAgICByZXR1cm4gYCR7YXBwQmFzZX0ke0FQUF9MQVVOQ0hfUEFUSH0/JHtwYXJhbXMudG9TdHJpbmcoKX0mJHtjYWNoZUJ1c3R9YDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIltuaGktZmhpciBzaWRlYmFyXSBsYXVuY2gtY29udGV4dCBmYWlsZWQsIGZhbGxpbmcgYmFjayB0byBiYXJlIGFwcDpcIiwgZXJyKTtcbiAgICAgIHJldHVybiBgJHthcHBIb21lfT8ke2NhY2hlQnVzdH1gO1xuICAgIH1cbiAgfVxuXG4gIGxldCBpZnJhbWVFbCA9IG51bGw7XG4gIGFzeW5jIGZ1bmN0aW9uIGxvYWRJZnJhbWUoKSB7XG4gICAgaWYgKGlmcmFtZUVsKSByZXR1cm47XG4gICAgbGV0IHNyYztcbiAgICB0cnkgeyBzcmMgPSBhd2FpdCBidWlsZElmcmFtZVVybCgpOyB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgLy8gVXNlIHRleHRDb250ZW50ICsgd2hpdGUtc3BhY2U6cHJlLWxpbmUgc28gbXVsdGktbGluZSBiaWxpbmd1YWxcbiAgICAgIC8vIG1lc3NhZ2VzIGZyb20gYnVpbGRJZnJhbWVVcmwgcmVuZGVyIHdpdGggdGhlaXIgbGluZSBicmVha3NcbiAgICAgIC8vIGludGFjdCAoYW5kIHdlIGRvbid0IGhhdmUgdG8gd29ycnkgYWJvdXQgSFRNTCBlc2NhcGluZykuXG4gICAgICBlbXB0eUJveC50ZXh0Q29udGVudCA9IFwiXCI7XG4gICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgZGl2LnN0eWxlLmNzc1RleHQgPSBcImNvbG9yOiNiOTFjMWM7IHdoaXRlLXNwYWNlOnByZS1saW5lOyBsaW5lLWhlaWdodDoxLjZcIjtcbiAgICAgIGRpdi50ZXh0Q29udGVudCA9IGBcdTI2QTAgJHtlcnIubWVzc2FnZX1gO1xuICAgICAgZW1wdHlCb3guYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWZyYW1lRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaWZyYW1lXCIpO1xuICAgIGlmcmFtZUVsLnRpdGxlID0gXCJNZWRpY2FsIE5vdGUgU01BUlQgb24gRkhJUlwiO1xuICAgIGlmcmFtZUVsLmFsbG93ID0gXCJjbGlwYm9hcmQtcmVhZDsgY2xpcGJvYXJkLXdyaXRlXCI7XG4gICAgZW1wdHlCb3gucmVtb3ZlKCk7XG4gICAgcGFuZWwuYXBwZW5kQ2hpbGQoaWZyYW1lRWwpO1xuICAgIGlmcmFtZUVsLnNyYyA9IHNyYztcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIHJlbG9hZElmcmFtZSgpIHtcbiAgICBpZiAoIWlmcmFtZUVsKSB7IGF3YWl0IGxvYWRJZnJhbWUoKTsgcmV0dXJuOyB9XG4gICAgdHJ5IHsgaWZyYW1lRWwuc3JjID0gYXdhaXQgYnVpbGRJZnJhbWVVcmwoKTsgfVxuICAgIGNhdGNoIChlcnIpIHsgY29uc29sZS53YXJuKFwiW25oaS1maGlyIHNpZGViYXJdXCIsIGVyci5tZXNzYWdlKTsgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0T3BlbihvcGVuKSB7XG4gICAgcGFuZWwuY2xhc3NMaXN0LnRvZ2dsZShcIm9wZW5cIiwgb3Blbik7XG4gICAgLy8gU3luYyBpbmxpbmUgcmlnaHQvdG9nZ2xlIHBvc2l0aW9uIHdpdGggdGhlIG9wZW4gc3RhdGUsIHVzaW5nIHRoZVxuICAgIC8vICpjdXJyZW50KiB3aWR0aCAod2hpY2ggbWF5IGhhdmUgYmVlbiB1c2VyLXJlc2l6ZWQpLlxuICAgIGFwcGx5V2lkdGgoY3VycmVudFdpZHRoKTtcbiAgICBpZiAob3BlbikgbG9hZElmcmFtZSgpLmNhdGNoKCgpID0+IHt9KTtcbiAgICBpZiAoaXNDb250ZXh0QWxpdmUoKSkge1xuICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgW1NUT1JBR0VfS0VZXTogb3BlbiB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmVsb2FkQnRuID0gcm9vdC5nZXRFbGVtZW50QnlJZChcInJlbG9hZFwiKTtcbiAgdG9nZ2xlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgc2V0T3BlbighcGFuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwib3BlblwiKSk7XG4gIH0pO1xuICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gc2V0T3BlbihmYWxzZSkpO1xuICBsb2FkQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBsb2FkSWZyYW1lKCkpO1xuICByZWxvYWRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHJlbG9hZElmcmFtZSgpKTtcbiAgcG9wb3V0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBwb3BPdXQoKSk7XG5cbiAgLy8gUmVzdG9yZSBwcmV2aW91cyBvcGVuL2Nsb3NlZCBzdGF0ZSBvbiB0aGlzIG9yaWdpbi5cbiAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFNUT1JBR0VfS0VZKS50aGVuKChkKSA9PiB7XG4gICAgaWYgKGRbU1RPUkFHRV9LRVldKSBzZXRPcGVuKHRydWUpO1xuICB9KS5jYXRjaCgoKSA9PiB7fSk7XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFN5bmMtcnVubmluZyBpZnJhbWUgcGF1c2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIFdoaWxlIHRoZSBleHRlbnNpb24ncyBydW5OaGlBcGlTeW5jIGlzIGluIGZsaWdodCwgdGhlIG1lZGljYWwtbm90ZVxuICAvLyBpZnJhbWUgY29tcGV0ZXMgd2l0aCBvdXIgTkhJIGZhbi1vdXQgZmV0Y2hlcyBmb3IgdGhlIHRhYidzIG5ldHdvcmtcbiAgLy8gKyBKUyB0aHJlYWQgKHdlIHNhdyBOSEkgZmFuLW91dCB0aW1lIHJvdWdobHkgdHJpcGxlIHdoZW4gdGhpcyBpZnJhbWVcbiAgLy8gd2FzIGFjdGl2ZSkuIFN0YXNoIHRoZSBpZnJhbWUncyBzcmMgaW50byBhYm91dDpibGFuayBkdXJpbmcgc3luYyBzb1xuICAvLyBpdHMgT0F1dGggKyBGSElSIGNhbGxzIHN0b3AgaGFtbWVyaW5nIHRoZSBuZXR3b3JrLiBSZXN1bWUgYnlcbiAgLy8gcmUtbG9hZGluZyBmcm9tIHRoZSBzYXZlZCBzcmMgd2hlbiBzeW5jIGZpbmlzaGVzLlxuICBsZXQgX3BhdXNlZFNyYyA9IG51bGw7XG4gIGZ1bmN0aW9uIHBhdXNlSWZyYW1lKCkge1xuICAgIGlmICghaWZyYW1lRWwgfHwgX3BhdXNlZFNyYyAhPT0gbnVsbCkgcmV0dXJuO1xuICAgIF9wYXVzZWRTcmMgPSBpZnJhbWVFbC5zcmM7XG4gICAgaWZyYW1lRWwuc3JjID0gXCJhYm91dDpibGFua1wiO1xuICB9XG4gIGZ1bmN0aW9uIHJlc3VtZUlmcmFtZSgpIHtcbiAgICBpZiAoIWlmcmFtZUVsIHx8IF9wYXVzZWRTcmMgPT09IG51bGwpIHJldHVybjtcbiAgICBpZnJhbWVFbC5zcmMgPSBfcGF1c2VkU3JjO1xuICAgIF9wYXVzZWRTcmMgPSBudWxsO1xuICB9XG4gIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcInN5bmNSdW5uaW5nXCIpLnRoZW4oKGQpID0+IHtcbiAgICBpZiAoZC5zeW5jUnVubmluZykgcGF1c2VJZnJhbWUoKTtcbiAgfSkuY2F0Y2goKCkgPT4ge30pO1xuICBjaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIGFyZWEpID0+IHtcbiAgICBpZiAoYXJlYSAhPT0gXCJsb2NhbFwiIHx8ICEoXCJzeW5jUnVubmluZ1wiIGluIGNoYW5nZXMpKSByZXR1cm47XG4gICAgaWYgKGNoYW5nZXMuc3luY1J1bm5pbmcubmV3VmFsdWUpIHBhdXNlSWZyYW1lKCk7XG4gICAgZWxzZSByZXN1bWVJZnJhbWUoKTtcbiAgfSk7XG59KSgpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7QUFpQkEsR0FBQyxNQUFNO0FBUUwsVUFBTSxlQUFlLFNBQVMsZUFBZSx1QkFBdUI7QUFDcEUsUUFBSTtBQUFjLG1CQUFhLE9BQU87QUFFdEMsVUFBTSx3QkFBd0I7QUFDOUIsVUFBTSxvQkFBb0I7QUFDMUIsVUFBTSxvQkFBb0I7QUFDMUIsVUFBTSxjQUFjO0FBQ3BCLFVBQU0sWUFBWTtBQUdsQixVQUFNLGtCQUFrQjtBQVd4QixVQUFNLGlCQUFpQjtBQUN2QixVQUFNLG9CQUFvQjtBQUMxQixVQUFNLGtCQUFrQjtBQUd4QixVQUFNLE9BQU8sU0FBUyxjQUFjLEtBQUs7QUFDekMsU0FBSyxLQUFLO0FBR1YsU0FBSyxNQUFNLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBU3JCLGFBQVMsZ0JBQWdCLFlBQVksSUFBSTtBQWV6QyxtQkFBZSx1QkFBdUI7QUFDcEMsVUFBSTtBQUNGLGNBQU0sRUFBRSxVQUFVLGVBQWUsSUFBSSxNQUFNLE9BQU8sUUFBUSxNQUFNLElBQUk7QUFBQSxVQUNsRTtBQUFBLFVBQVk7QUFBQSxRQUNkLENBQUM7QUFDRCxjQUFNLFVBQVUsbUJBQW1CLFNBQVMsYUFBYTtBQUN6RCxhQUFLLE1BQU0sVUFBVSxVQUFVLEtBQUs7QUFBQSxNQUN0QyxRQUFRO0FBQ04sYUFBSyxNQUFNLFVBQVU7QUFBQSxNQUN2QjtBQUFBLElBQ0Y7QUFDQSx5QkFBcUI7QUFDckIsV0FBTyxRQUFRLFVBQVUsWUFBWSxDQUFDLFNBQVMsU0FBUztBQUN0RCxVQUFJLFNBQVM7QUFBUztBQUN0QixVQUFJLGNBQWMsV0FBVyxvQkFBb0IsU0FBUztBQUN4RCw2QkFBcUI7QUFBQSxNQUN2QjtBQUFBLElBQ0YsQ0FBQztBQUVELFVBQU0sT0FBTyxLQUFLLGFBQWEsRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUMvQyxTQUFLLFlBQVk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGtCQStDRCx3QkFBd0IsRUFBRTtBQUFBO0FBQUEsaUJBRTNCLHFCQUFxQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtB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
