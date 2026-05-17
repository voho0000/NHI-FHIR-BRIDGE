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
        /* Deep navy (#1e3a8a) \u2014 kept distinct from popup's primary
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
           "oh that's a button". 3 cycles then stops \u2014 never gets in
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3NpZGViYXIuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIE5ISS1GSElSIEJyaWRnZSBcdTIwMTQgY29sbGFwc2libGUgcmlnaHQtc2lkZSBwYW5lbCBpbmplY3RlZCBpbnRvIEhJUyBwYWdlcy5cbi8vXG4vLyBHb2FscyBvZiB0aGlzIFBvQzpcbi8vIDEuIFByb3ZlIHdlIGNhbiByZW5kZXIgYW4gaWZyYW1lIG9mIHRoZSBtZWRpY2FsLW5vdGUgU01BUlQgYXBwIGluc2lkZVxuLy8gICAgdGhlIE5ISSBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0EgcGFnZSB3aXRob3V0IENTUCAvIFgtRnJhbWUtT3B0aW9ucyBpc3N1ZXMuXG4vLyAyLiBLZWVwIHRoZSBzaWRlYmFyIGlzb2xhdGVkIGZyb20gdGhlIGhvc3QgcGFnZSdzIENTUyB2aWEgU2hhZG93IERPTVxuLy8gICAgc28gSElTLXNwZWNpZmljIHN0eWxlcyBjYW4ndCBibGVlZCBpbiBhbmQgYnJlYWsgbGF5b3V0LlxuLy8gMy4gR2l2ZSBhIHNpbmdsZSB0b2dnbGUgYnV0dG9uIChwcmlzbSBtYXJrIFx1MjAxNCBzYW1lIGFzIG1lZGljYWwtbm90ZSdzXG4vLyAgICBhcHAgaWNvbikgYXQgdGhlIHJpZ2h0IGVkZ2UgdGhhdCBzbGlkZXMgdGhlIHBhbmVsIGluL291dC4gU3RhdGVcbi8vICAgIHBlcnNpc3RzIGFjcm9zcyBuYXZpZ2F0aW9ucyBvbiB0aGUgc2FtZSBvcmlnaW5cbi8vICAgIHZpYSBjaHJvbWUuc3RvcmFnZS5sb2NhbC5cbi8vXG4vLyBOb3QgaW4gc2NvcGUgaGVyZTpcbi8vIC0gcG9zdE1lc3NhZ2UgYnJpZGdlIGZyb20gdGhlIGlmcmFtZSB0byB0aGUgU1cgKGRhdGUtcmFuZ2UgdG9vbCBjYWxscykuXG4vLyAgIFRoYXQgY29tZXMgb25jZSB3ZSBjb25maXJtIHRoZSBiYXNpYyBlbWJlZCByZW5kZXJzLlxuLy8gLSBQZXItSElTIGF1dGggaGFuZG9mZiAoRkhJUiBsYXVuY2ggdG9rZW4sIGV0Yy4pLlxuXG4oKCkgPT4ge1xuICAvLyBSZS1pbmplY3Rpb24gKGUuZy4gYmFja2dyb3VuZC5qcyBjYWxsaW5nIGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdFxuICAvLyBhZnRlciBhbiBleHRlbnNpb24gdXBkYXRlKSBtZWFucyB0aGUgc2NyaXB0IHJ1bnMgYWdhaW4gb24gYSBwYWdlIHRoYXRcbiAgLy8gYWxyZWFkeSBoYXMgYSBob3N0IGVsZW1lbnQgZnJvbSB0aGUgcHJldmlvdXMgaW5zdGFuY2UuIENsZWFuIHVwIHRoZVxuICAvLyBzdGFsZSBob3N0IHNvIHRoZSB0b2dnbGUgYnV0dG9uIGRvZXNuJ3QgYXBwZWFyIHR3aWNlLlxuICAvLyBMZWZ0b3ZlciBjaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQgbGlzdGVuZXJzIGZyb20gdGhlIG9sZCBzY3JpcHRcbiAgLy8gaW5zdGFuY2UgY2FuJ3QgYmUgdW5yZWdpc3RlcmVkLCBidXQgdGhleSByZWZlcmVuY2UgZGV0YWNoZWQgRE9NXG4gIC8vIG5vZGVzIHNvIHRoZWlyIGNhbGxiYWNrcyBhcmUgdmlzdWFsIG5vLW9wcy5cbiAgY29uc3QgcHJldmlvdXNIb3N0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuaGktZmhpci1zaWRlYmFyLWhvc3RcIik7XG4gIGlmIChwcmV2aW91c0hvc3QpIHByZXZpb3VzSG9zdC5yZW1vdmUoKTtcblxuICBjb25zdCBTSURFQkFSX0RFRkFVTFRfV0lEVEggPSA0MjA7XG4gIGNvbnN0IFNJREVCQVJfTUlOX1dJRFRIID0gMjgwO1xuICBjb25zdCBTSURFQkFSX01BWF9XSURUSCA9IDEyMDA7XG4gIGNvbnN0IFNUT1JBR0VfS0VZID0gXCJzaWRlYmFyX29wZW5cIjtcbiAgY29uc3QgV0lEVEhfS0VZID0gXCJzaWRlYmFyX3dpZHRoXCI7XG4gIC8vIFRoZSBTTUFSVCBsYXVuY2ggZW50cnkgdGhhdCBmaGlyY2xpZW50IGV4cGVjdHMgdG8gaGFuZGxlIHRoZSBpc3MrbGF1bmNoXG4gIC8vIHBhcmFtcyBhbmQgcnVuIEZISVIub2F1dGgyLmF1dGhvcml6ZSgpLlxuICBjb25zdCBBUFBfTEFVTkNIX1BBVEggPSBcIi9zbWFydC9sYXVuY2hcIjtcbiAgLy8gQ2hyb21lJ3MgUHJpdmF0ZSBOZXR3b3JrIEFjY2VzcyBibG9ja3MgZmV0Y2hlcyBmcm9tIHB1YmxpYyBvcmlnaW5zXG4gIC8vIChnaXRodWIuaW8pIGludG8gbG9vcGJhY2sgKGxvY2FsaG9zdCkgZXZlbiB3aGVuIHRoZSBzZXJ2ZXIgcmV0dXJuc1xuICAvLyBBY2Nlc3MtQ29udHJvbC1BbGxvdy1Qcml2YXRlLU5ldHdvcms6IHRydWUgXHUyMDE0IGFwcGFyZW50bHkgdGhpcyBpcyBiZWluZ1xuICAvLyB0aWdodGVuZWQgdG8gXCJhbHdheXMgYmxvY2tcIiBpbiBuZXdlciBDaHJvbWVzLiBFYXNpZXN0IGZpeCBpcyB0byBwb2ludFxuICAvLyB0aGUgaWZyYW1lIGF0IHRoZSBsb2NhbCBkZXYgc2VydmVyIG9mIG1lZGljYWwtbm90ZSAobG9jYWxob3N0OjMwMDEpLFxuICAvLyBzYW1lIHNjaGVtZSBhcyBiYWNrZW5kLCBzbyBubyBQTkEgY3Jvc3NpbmcgaGFwcGVucyBhdCBhbGwuIEZhbGxzIGJhY2tcbiAgLy8gdG8gdGhlIGRlcGxveWVkIGdpdGh1Yi5pbyBhcHAgd2hlbiB0aGUgbG9jYWwgb25lIGlzbid0IHJ1bm5pbmcuXG4gIC8vIExvY2FsIE5leHQuanMgZGV2IHNlcnZlcjogcnVucyBhdCByb290IChubyAvbWVkaWNhbC1ub3RlLXNtYXJ0LW9uLWZoaXJcbiAgLy8gcHJlZml4IFx1MjAxNCB0aGUgbGF1bmNoIHBhZ2UgZGV0ZWN0cyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgYW5kIHNldHNcbiAgLy8gcHJlZml4ID0gXCJcIiB3aGVuIG5vdCBvbiB0aGUgZ2l0aHViLmlvIHJlcG8gc3VicGF0aCkuXG4gIGNvbnN0IEFQUF9CQVNFX0xPQ0FMID0gXCJodHRwOi8vbG9jYWxob3N0OjMwMDFcIjtcbiAgY29uc3QgQVBQX0JBU0VfREVQTE9ZRUQgPSBcImh0dHBzOi8vdm9obzAwMDAuZ2l0aHViLmlvL21lZGljYWwtbm90ZS1zbWFydC1vbi1maGlyXCI7XG4gIGNvbnN0IERFRkFVTFRfQkFDS0VORCA9IFwiaHR0cDovL2xvY2FsaG9zdDo4MDEwXCI7XG5cbiAgLy8gSG9zdCBlbGVtZW50ICsgU2hhZG93IHJvb3Qgc28gdGhlIGhvc3QgcGFnZSdzIENTUyBuZXZlciB0b3VjaGVzIHVzLlxuICBjb25zdCBob3N0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgaG9zdC5pZCA9IFwibmhpLWZoaXItc2lkZWJhci1ob3N0XCI7XG4gIC8vIFBpbiB0byB0aGUgcGFnZSwgYWJvdmUgYWxtb3N0IGV2ZXJ5dGhpbmcuIE5ISSB1c2VzIHNvbWUgei1pbmRleFxuICAvLyB2YWx1ZXMgYnV0IG5vdGhpbmcgYWJvdmUgOTk5OS5cbiAgaG9zdC5zdHlsZS5jc3NUZXh0ID0gYFxuICAgIGFsbDogaW5pdGlhbDtcbiAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgdG9wOiAwO1xuICAgIHJpZ2h0OiAwO1xuICAgIGhlaWdodDogMTAwdmg7XG4gICAgei1pbmRleDogMjE0NzQ4MzY0NjtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgYDtcbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKGhvc3QpO1xuXG4gIC8vIFRoZSBzaWRlYmFyJ3MgYXNzaXN0YW50IGJ1dHRvbiArIGlmcmFtZSBwYW5lbCBhcmUgb25seSB1c2VmdWwgaW5cbiAgLy8gXCJcdTRFMEFcdTUwQjNcdTVGOENcdTdBRUZcIiBtb2RlIFx1MjAxNCB0aGUgaWZyYW1lIGlzIGEgU01BUlQgYXBwIHRoYXQgdGFsa3MgdG8gdGhlIGxvY2FsXG4gIC8vIEZISVIgYmFja2VuZC4gSW4gXCJcdTRFMEJcdThGMDlcdTUyMzBcdTk2RkJcdTgxNjZcIiBtb2RlIHRoZXJlJ3Mgbm8gYmFja2VuZCB0byB0YWxrIHRvLFxuICAvLyBzbyBoaWRlIHRoZSB3aG9sZSB0aGluZy5cbiAgLy9cbiAgLy8gUGx1cyBhbiBleHBsaWNpdCBgc2lkZWJhckVuYWJsZWRgIG9wdC1vdXQ6IHVzZXJzIHdobyBvbmx5IHdhbnQgdGhlXG4gIC8vIHJhdyBGSElSIEJ1bmRsZSBhbmQgbmV2ZXIgcGxhbiB0byBlbWJlZCBTTUFSVCBhcHBzIG9uIHRoZSBOSEkgcGFnZVxuICAvLyBjYW4gdHVybiB0aGUgcGFuZWwgb2ZmIGVudGlyZWx5IHZpYSB0aGUgcG9wdXAncyBcdTMwMENcdTI2OTlcdUZFMEYgXHU5MDMyXHU5NjhFXHU4QTJEXHU1QjlBXHUzMDBELlxuICAvLyBBbGwgc2V0dGluZ3MgKHN5bmNNb2RlLCBzaWRlYmFyRW5hYmxlZCkgbGl2ZSBpbiBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuICAvLyBzaW5jZSB2MC41LjAgXHUyMDE0IHNpZGViYXIuanMgd2FzIG1pc3NlZCBpbiB0aGF0IG1pZ3JhdGlvbiBhbmQga2VwdFxuICAvLyByZWFkaW5nIGZyb20gLnN5bmMsIHdoaWNoIG9ubHkgZXZlciBoZWxkIHVuZGVmaW5lZCB2YWx1ZXMgYWZ0ZXJcbiAgLy8gdGhlIG1pZ3JhdGlvbiBjbGVhcmVkIHRoZSBrZXlzLiBSZXN1bHQ6IHRoZSBhc3Npc3RhbnQgcGlsbCBuZXZlclxuICAvLyBhcHBlYXJlZCBldmVuIHdoZW4gdGhlIHVzZXIgaGFkIHRpY2tlZCBcIlx1OTg2Rlx1NzkzQVx1NTJBOVx1NzQwNlx1OTc2Mlx1Njc3RlwiIGluIHBvcHVwLlxuICBhc3luYyBmdW5jdGlvbiBfYXBwbHlNb2RlVmlzaWJpbGl0eSgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBzeW5jTW9kZSwgc2lkZWJhckVuYWJsZWQgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXG4gICAgICAgIFwic3luY01vZGVcIiwgXCJzaWRlYmFyRW5hYmxlZFwiLFxuICAgICAgXSk7XG4gICAgICBjb25zdCB2aXNpYmxlID0gc2lkZWJhckVuYWJsZWQgIT09IGZhbHNlICYmIHN5bmNNb2RlID09PSBcImJhY2tlbmRcIjtcbiAgICAgIGhvc3Quc3R5bGUuZGlzcGxheSA9IHZpc2libGUgPyBcIlwiIDogXCJub25lXCI7XG4gICAgfSBjYXRjaCB7XG4gICAgICBob3N0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG4gIH1cbiAgX2FwcGx5TW9kZVZpc2liaWxpdHkoKTtcbiAgY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBhcmVhKSA9PiB7XG4gICAgaWYgKGFyZWEgIT09IFwibG9jYWxcIikgcmV0dXJuO1xuICAgIGlmIChcInN5bmNNb2RlXCIgaW4gY2hhbmdlcyB8fCBcInNpZGViYXJFbmFibGVkXCIgaW4gY2hhbmdlcykge1xuICAgICAgX2FwcGx5TW9kZVZpc2liaWxpdHkoKTtcbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IHJvb3QgPSBob3N0LmF0dGFjaFNoYWRvdyh7IG1vZGU6IFwib3BlblwiIH0pO1xuICByb290LmlubmVySFRNTCA9IGBcbiAgICA8c3R5bGU+XG4gICAgICA6aG9zdCwgKiB7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7IH1cbiAgICAgIC50b2dnbGUge1xuICAgICAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgICAgIHRvcDogNTAlO1xuICAgICAgICByaWdodDogMDtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xuICAgICAgICB3aWR0aDogMjhweDtcbiAgICAgICAgaGVpZ2h0OiA3MnB4O1xuICAgICAgICAvKiBEZWVwIG5hdnkgKCMxZTNhOGEpIFx1MjAxNCBrZXB0IGRpc3RpbmN0IGZyb20gcG9wdXAncyBwcmltYXJ5XG4gICAgICAgICAgIGJsdWUgb24gcHVycG9zZTogdGhpcyBwaWxsIGxpdmVzIG9uIHRoZSBob3N0IE5ISSBwYWdlLCBub3RcbiAgICAgICAgICAgaW4gdGhlIGV4dGVuc2lvbiBVSSwgc28gYSBzbGlnaHRseSBoZWF2aWVyIGNvbG9yIGhlbHBzIGl0XG4gICAgICAgICAgIGhvbGQgaXRzIG93biBhZ2FpbnN0IHRoZSBwYWdlIGJhY2tncm91bmQuICovXG4gICAgICAgIGJhY2tncm91bmQ6ICMxZTNhOGE7XG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA4cHggMCAwIDhweDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICBmb250LWZhbWlseTogLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBzYW5zLXNlcmlmO1xuICAgICAgICBib3gtc2hhZG93OiAtMXB4IDJweCA2cHggcmdiYSgwLDAsMCwwLjEyKTtcbiAgICAgICAgcG9pbnRlci1ldmVudHM6IGF1dG87XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICB0cmFuc2l0aW9uOiByaWdodCAwLjJzIGVhc2UsIGJhY2tncm91bmQgMC4ycyBlYXNlLCB0cmFuc2Zvcm0gMC4ycyBlYXNlO1xuICAgICAgICAvKiBTdWJ0bGUgMy1jeWNsZSBwdWxzZSBvbiBmaXJzdCBwYWludCBzbyBhIGJyYW5kLW5ldyB1c2VyIHNlZXNcbiAgICAgICAgICAgXCJvaCB0aGF0J3MgYSBidXR0b25cIi4gMyBjeWNsZXMgdGhlbiBzdG9wcyBcdTIwMTQgbmV2ZXIgZ2V0cyBpblxuICAgICAgICAgICB0aGUgd2F5IGFmdGVyLiAqL1xuICAgICAgICBhbmltYXRpb246IG5mYi10b2dnbGUtcHVsc2UgMS42cyBlYXNlLW91dCAzIGZvcndhcmRzO1xuICAgICAgfVxuICAgICAgLnRvZ2dsZSBzdmcgeyBkaXNwbGF5OiBibG9jazsgd2lkdGg6IDIwcHg7IGhlaWdodDogMjBweDsgfVxuICAgICAgLnRvZ2dsZTpob3ZlciB7XG4gICAgICAgIGJhY2tncm91bmQ6ICMxZTQwYWY7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKSB0cmFuc2xhdGVYKC0ycHgpO1xuICAgICAgfVxuICAgICAgLnRvZ2dsZTpmb2N1cy12aXNpYmxlIHtcbiAgICAgICAgb3V0bGluZTogMnB4IHNvbGlkICM2MGE1ZmE7XG4gICAgICAgIG91dGxpbmUtb2Zmc2V0OiAycHg7XG4gICAgICB9XG4gICAgICBAa2V5ZnJhbWVzIG5mYi10b2dnbGUtcHVsc2Uge1xuICAgICAgICAwJSwgMTAwJSB7IGJveC1zaGFkb3c6IC0xcHggMnB4IDZweCByZ2JhKDAsMCwwLDAuMTIpOyB9XG4gICAgICAgIDUwJSB7IGJveC1zaGFkb3c6IC0xcHggMnB4IDZweCByZ2JhKDAsMCwwLDAuMTIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAwIDAgMCA1cHggcmdiYSg1OSwgMTMwLCAyNDYsIDAuMzUpOyB9XG4gICAgICB9XG4gICAgICBAbWVkaWEgKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSkge1xuICAgICAgICAudG9nZ2xlIHsgYW5pbWF0aW9uOiBub25lOyB9XG4gICAgICB9XG4gICAgICAucGFuZWwge1xuICAgICAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgICAgIHRvcDogMDtcbiAgICAgICAgcmlnaHQ6IC0ke1NJREVCQVJfREVGQVVMVF9XSURUSCArIDMwfXB4O1xuICAgICAgICBoZWlnaHQ6IDEwMHZoO1xuICAgICAgICB3aWR0aDogJHtTSURFQkFSX0RFRkFVTFRfV0lEVEh9cHg7XG4gICAgICAgIGJhY2tncm91bmQ6IHdoaXRlO1xuICAgICAgICBib3gtc2hhZG93OiAtNHB4IDAgMTJweCByZ2JhKDAsMCwwLDAuMSk7XG4gICAgICAgIC8qIE5vIHRyYW5zaXRpb24gd2hpbGUgdXNlciBpcyBkcmFnZ2luZyBcdTIwMTQgc2V0IGlubGluZS4gKi9cbiAgICAgICAgdHJhbnNpdGlvbjogcmlnaHQgMC4yNXMgZWFzZTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgcG9pbnRlci1ldmVudHM6IGF1dG87XG4gICAgICAgIGJvcmRlci1sZWZ0OiAxcHggc29saWQgI2U1ZTdlYjtcbiAgICAgIH1cbiAgICAgIC5wYW5lbC5vcGVuIHsgcmlnaHQ6IDA7IH1cbiAgICAgIC8qIERyYWcgaGFuZGxlIG9uIHRoZSBMRUZUIGVkZ2Ugb2YgdGhlIG9wZW4gcGFuZWwuIFdpZGUgZW5vdWdoXG4gICAgICAgICAoNnB4KSB0byBiZSBlYXN5IHRvIGdyYWIgYnV0IGludmlzaWJsZSB1bnRpbCBob3ZlcmVkLiBXaGlsZVxuICAgICAgICAgZHJhZ2dpbmcgdGhlIHRvZ2dsZS90cmFuc2l0aW9uIGlzIGRpc2FibGVkIHNvIHJlc2l6aW5nIGZlZWxzXG4gICAgICAgICBjcmlzcC4gKi9cbiAgICAgIC5yZXNpemVyIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICB0b3A6IDA7IGxlZnQ6IC0zcHg7XG4gICAgICAgIHdpZHRoOiA2cHg7IGhlaWdodDogMTAwJTtcbiAgICAgICAgY3Vyc29yOiBldy1yZXNpemU7XG4gICAgICAgIHotaW5kZXg6IDE7XG4gICAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgICAgfVxuICAgICAgLnJlc2l6ZXI6aG92ZXIsIC5wYW5lbC5yZXNpemluZyAucmVzaXplciB7XG4gICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byByaWdodCwgdHJhbnNwYXJlbnQsICMyNTYzZWIzMywgdHJhbnNwYXJlbnQpO1xuICAgICAgfVxuICAgICAgLnBhbmVsLnJlc2l6aW5nIHsgdHJhbnNpdGlvbjogbm9uZSAhaW1wb3J0YW50OyB1c2VyLXNlbGVjdDogbm9uZTsgfVxuICAgICAgLnBhbmVsLnJlc2l6aW5nIGlmcmFtZSB7IHBvaW50ZXItZXZlbnRzOiBub25lOyB9IC8qIHN3YWxsb3cgZHJhZyBpbnNpZGUgaWZyYW1lICovXG4gICAgICAuaGVhZGVyIHtcbiAgICAgICAgcGFkZGluZzogMTBweCAxNHB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiAjZjlmYWZiO1xuICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2U1ZTdlYjtcbiAgICAgICAgZm9udDogNjAwIDEzcHggLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBzYW5zLXNlcmlmO1xuICAgICAgICBjb2xvcjogIzFlM2E4YTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgfVxuICAgICAgLmhlYWRlci10aXRsZSB7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IDdweDtcbiAgICAgIH1cbiAgICAgIC5oZWFkZXItbWFyayB7IHdpZHRoOiAxNnB4OyBoZWlnaHQ6IDE2cHg7IGZsZXg6IDAgMCAxNnB4OyB9XG4gICAgICAuaGVhZGVyIC5jbG9zZSB7XG4gICAgICAgIGJhY2tncm91bmQ6IG5vbmU7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgICBjb2xvcjogIzZiNzI4MDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICBwYWRkaW5nOiAwIDRweDtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBtaW4td2lkdGg6IDI2cHg7XG4gICAgICAgIGhlaWdodDogMjZweDtcbiAgICAgIH1cbiAgICAgIC5oZWFkZXIgLmNsb3NlOmhvdmVyIHsgY29sb3I6ICMxZjI5Mzc7IH1cbiAgICAgIC5oZWFkZXIgLmNsb3NlIHN2ZyB7IHdpZHRoOiAxNnB4OyBoZWlnaHQ6IDE2cHg7IH1cbiAgICAgIGlmcmFtZSB7XG4gICAgICAgIGZsZXg6IDE7XG4gICAgICAgIGJvcmRlcjogMDtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGJhY2tncm91bmQ6IHdoaXRlO1xuICAgICAgfVxuICAgICAgLmVtcHR5IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGZsZXg6IDE7XG4gICAgICAgIGNvbG9yOiAjOWNhM2FmO1xuICAgICAgICBmb250OiAxM3B4IC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgc2Fucy1zZXJpZjtcbiAgICAgICAgZ2FwOiAxMnB4O1xuICAgICAgICBwYWRkaW5nOiAyMHB4O1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICB9XG4gICAgICAuZW1wdHkgYnV0dG9uIHtcbiAgICAgICAgcGFkZGluZzogOHB4IDE2cHg7XG4gICAgICAgIGJhY2tncm91bmQ6ICMyNTYzZWI7XG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA2cHg7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgZm9udC1zaXplOiAxM3B4O1xuICAgICAgfVxuICAgIDwvc3R5bGU+XG5cbiAgICA8YnV0dG9uIGNsYXNzPVwidG9nZ2xlXCIgaWQ9XCJ0b2dnbGVcIlxuICAgICAgICAgICAgdGl0bGU9XCJcdTlFREVcdTZCNjRcdTk1OEJcdTU1NUYgTkhJLUZISVIgQnJpZGdlIFx1NTJBOVx1NzQwNlx1OTc2Mlx1Njc3RlwiXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiXHU5NThCXHU1NTVGIE5ISS1GSElSIEJyaWRnZSBcdTUyQTlcdTc0MDZcdTk3NjJcdTY3N0ZcIj5cbiAgICAgIDwhLS0gUHJpc20gbWFyayBcdTIwMTQgc2FtZSBzaGFwZSBhcyBtZWRpY2FsLW5vdGUncyBhcHAgaWNvbiwgc28gdGhlXG4gICAgICAgICAgIHRyaWdnZXIgdmlzdWFsbHkgbWF0Y2hlcyB0aGUgYXBwIGl0IG9wZW5zLiBjdXJyZW50Q29sb3JcbiAgICAgICAgICAgbGV0cyB0aGUgd2hpdGUgc3Ryb2tlIGluaGVyaXQgZnJvbSAudG9nZ2xlJ3MgY29sb3I6IHdoaXRlLiAtLT5cbiAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNTYgMjU2XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICBzdHJva2Utd2lkdGg9XCIxNFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICA8cGF0aCBkPVwiTSA4MCA4MCBMIDE3NiA4MFwiLz5cbiAgICAgICAgPHBhdGggZD1cIk0gODAgODAgTCA0OCAxNzZcIi8+XG4gICAgICAgIDxwYXRoIGQ9XCJNIDE3NiA4MCBMIDIwOCAxNzZcIi8+XG4gICAgICAgIDxwYXRoIGQ9XCJNIDQ4IDE3NiBMIDIwOCAxNzZcIi8+XG4gICAgICAgIDxwYXRoIGQ9XCJNIDQ4IDE3NiBMIDEyOCAyMjQgTCAyMDggMTc2XCIvPlxuICAgICAgICA8cGF0aCBkPVwiTSA4MCA4MCBMIDEyOCAxNzZcIi8+XG4gICAgICAgIDxwYXRoIGQ9XCJNIDE3NiA4MCBMIDEyOCAxNzZcIi8+XG4gICAgICAgIDxwYXRoIGQ9XCJNIDEyOCAxNzYgTCAxMjggMjI0XCIvPlxuICAgICAgPC9zdmc+XG4gICAgPC9idXR0b24+XG4gICAgPGRpdiBjbGFzcz1cInBhbmVsXCIgaWQ9XCJwYW5lbFwiPlxuICAgICAgPGRpdiBjbGFzcz1cInJlc2l6ZXJcIiBpZD1cInJlc2l6ZXJcIiB0aXRsZT1cIlx1NjJENlx1NjZGM1x1OEFCRlx1NjU3NFx1NUJFQ1x1NUVBNlwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImhlYWRlclwiPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImhlYWRlci10aXRsZVwiPlxuICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNTYgMjU2XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgc3Ryb2tlLXdpZHRoPVwiMTZcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCIgY2xhc3M9XCJoZWFkZXItbWFya1wiPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0gODAgODAgTCAxNzYgODBcIi8+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTSA4MCA4MCBMIDQ4IDE3NlwiLz5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNIDE3NiA4MCBMIDIwOCAxNzZcIi8+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTSA0OCAxNzYgTCAyMDggMTc2XCIvPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0gNDggMTc2IEwgMTI4IDIyNCBMIDIwOCAxNzZcIi8+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTSA4MCA4MCBMIDEyOCAxNzZcIi8+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTSAxNzYgODAgTCAxMjggMTc2XCIvPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0gMTI4IDE3NiBMIDEyOCAyMjRcIi8+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgTkhJLUZISVIgQnJpZGdlIFx1NTJBOVx1NzQwNlxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxzcGFuIHN0eWxlPVwiZGlzcGxheTpmbGV4O2dhcDo0cHhcIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiY2xvc2VcIiBpZD1cInBvcG91dFwiIHRpdGxlPVwiXHU3OUZCXHU1MjMwXHU3MzY4XHU3QUNCXHU4OTk2XHU3QTk3IChwb3Atb3V0KVwiIGFyaWEtbGFiZWw9XCJwb3Agb3V0XCI+XG4gICAgICAgICAgICA8IS0tIFwiZXh0ZXJuYWwgbGluayAvIG9wZW4gaW4gbmV3IHdpbmRvd1wiIGljb24uIElubGluZSBTVkcgc29cbiAgICAgICAgICAgICAgICAgaXQgcmVuZGVycyB0aGUgc2FtZSBvbiBldmVyeSBPUyB3aXRob3V0IHJlbHlpbmcgb24gZW1vamlcbiAgICAgICAgICAgICAgICAgZm9udCBjb3ZlcmFnZS4gLS0+XG4gICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj5cbiAgICAgICAgICAgICAgPHBhdGggZD1cIk0xNCA0aDZ2NlwiLz5cbiAgICAgICAgICAgICAgPHBhdGggZD1cIk0yMCA0IDEyIDEyXCIvPlxuICAgICAgICAgICAgICA8cGF0aCBkPVwiTTE5IDEzdjZhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWN2EyIDIgMCAwIDEgMi0yaDZcIi8+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiY2xvc2VcIiBpZD1cInJlbG9hZFwiIHRpdGxlPVwiXHU1RjM3XHU1MjM2XHU5MUNEXHU2NUIwXHU4RjA5XHU1MTY1XHU1MkE5XHU3NDA2IChcdTdFNUUgY2FjaGUpXCJcbiAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJcdTVGMzdcdTUyMzZcdTkxQ0RcdTY1QjBcdThGMDlcdTUxNjVcdTUyQTlcdTc0MDZcIj5cbiAgICAgICAgICAgIDwhLS0gbHVjaWRlIFJvdGF0ZUN3LiBSZXBsYWNlcyB1bmljb2RlIFx1RDgzRFx1REQwNCB3aGljaCByZW5kZXJzIHZlcnlcbiAgICAgICAgICAgICAgICAgZGlmZmVyZW50bHkgYWNyb3NzIE9TZXMgLyBlbW9qaSBmb250cyAoZXNwZWNpYWxseSBXaW4pLiAtLT5cbiAgICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICAgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPlxuICAgICAgICAgICAgICA8cGF0aCBkPVwiTTIxIDEyYTkgOSAwIDEgMS05LTljMi41MiAwIDQuOTMgMSA2Ljc0IDIuNzRMMjEgOFwiLz5cbiAgICAgICAgICAgICAgPHBhdGggZD1cIk0yMSAzdjVoLTVcIi8+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiY2xvc2VcIiBpZD1cImNsb3NlXCIgdGl0bGU9XCJcdTY1MzZcdThENzdcIiBhcmlhLWxhYmVsPVwiXHU2NTM2XHU4RDc3XCI+XG4gICAgICAgICAgICA8IS0tIGx1Y2lkZSBYIFx1MjAxNCBtYXRjaGVzIHRoZSByZXN0IG9mIHRoZSBTVkcgaWNvbiBmYW1pbHkgaW5cbiAgICAgICAgICAgICAgICAgdGhpcyBoZWFkZXIgc28gdGhlIHdob2xlIHJvdyByZWFkcyBhcyBvbmUgdG9vbGJhci4gLS0+XG4gICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj5cbiAgICAgICAgICAgICAgPGxpbmUgeDE9XCIxOFwiIHkxPVwiNlwiIHgyPVwiNlwiIHkyPVwiMThcIi8+XG4gICAgICAgICAgICAgIDxsaW5lIHgxPVwiNlwiIHkxPVwiNlwiIHgyPVwiMThcIiB5Mj1cIjE4XCIvPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImVtcHR5XCIgaWQ9XCJlbXB0eVwiPlxuICAgICAgICA8ZGl2Plx1N0IyQ1x1NEUwMFx1NkIyMVx1NEY3Rlx1NzUyOCBcdTIwMTQgXHU5RURFXHU0RTBCXHU2NUI5XHU4RjA5XHU1MTY1IG1lZGljYWwtbm90ZSBcdTUyQTlcdTc0MDY8L2Rpdj5cbiAgICAgICAgPGJ1dHRvbiBpZD1cImxvYWRcIj5cdThGMDlcdTUxNjVcdTUyQTlcdTc0MDYgKH4zcyk8L2J1dHRvbj5cbiAgICAgICAgPGRpdiBzdHlsZT1cImZvbnQtc2l6ZToxMXB4O2NvbG9yOiM5Y2EzYWY7bWFyZ2luLXRvcDo4cHhcIj5cbiAgICAgICAgICBcdThGMDlcdTUxNjVcdTVGOENcdTUzRUZcdTRGRERcdTYzMDFcdTk1OEJcdTU1NUZcdUZGMUJcdTUyMDdcdTUyMzBcdTUxNzZcdTRFRDZcdTc1QzVcdTRFQkFcdTY2NDJcdTc1MjhcdTVERTZcdTRFMEFcdTc2ODQgcGF0aWVudCBwaWNrZXIgXHU1MjA3XHU2M0RCXG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGA7XG5cbiAgY29uc3QgcGFuZWwgPSByb290LmdldEVsZW1lbnRCeUlkKFwicGFuZWxcIik7XG4gIGNvbnN0IHRvZ2dsZUJ0biA9IHJvb3QuZ2V0RWxlbWVudEJ5SWQoXCJ0b2dnbGVcIik7XG4gIGNvbnN0IGNsb3NlQnRuID0gcm9vdC5nZXRFbGVtZW50QnlJZChcImNsb3NlXCIpO1xuICBjb25zdCBsb2FkQnRuID0gcm9vdC5nZXRFbGVtZW50QnlJZChcImxvYWRcIik7XG4gIGNvbnN0IGVtcHR5Qm94ID0gcm9vdC5nZXRFbGVtZW50QnlJZChcImVtcHR5XCIpO1xuICBjb25zdCByZXNpemVyID0gcm9vdC5nZXRFbGVtZW50QnlJZChcInJlc2l6ZXJcIik7XG4gIGNvbnN0IHBvcG91dEJ0biA9IHJvb3QuZ2V0RWxlbWVudEJ5SWQoXCJwb3BvdXRcIik7XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFdpZHRoIHBlcnNpc3RlbmNlICsgZHJhZy10by1yZXNpemUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIFRoZSBwYW5lbCdzIHdpZHRoIGlzIHJlc3RvcmVkIGZyb20gc3RvcmFnZSBhbmQgdGhlIENTUyBydWxlIHRoYXRcbiAgLy8gaGlkZXMgdGhlIHBhbmVsIG9mZi1zY3JlZW4gKFwicmlnaHQ6IC08d2lkdGgrMzA+cHhcIikgaXMgcmV3cml0dGVuIGluXG4gIC8vIHN5bmMuIFdlIGNhbid0IHRvdWNoIHRoZSBvcmlnaW5hbCA8c3R5bGU+IHJ1bGUsIHNvIHdlIG92ZXJyaWRlIHZpYVxuICAvLyBhbiBpbmxpbmUgYHJpZ2h0YCBzdHlsZSB3aGVuIHRoZSBwYW5lbCBpcyBjbG9zZWQuXG4gIGxldCBjdXJyZW50V2lkdGggPSBTSURFQkFSX0RFRkFVTFRfV0lEVEg7XG4gIGZ1bmN0aW9uIGFwcGx5V2lkdGgocHgpIHtcbiAgICBjdXJyZW50V2lkdGggPSBNYXRoLm1heChTSURFQkFSX01JTl9XSURUSCwgTWF0aC5taW4oU0lERUJBUl9NQVhfV0lEVEgsIE1hdGgucm91bmQocHgpKSk7XG4gICAgcGFuZWwuc3R5bGUud2lkdGggPSBgJHtjdXJyZW50V2lkdGh9cHhgO1xuICAgIC8vIEtlZXAgdGhlIG9mZi1zY3JlZW4gb2Zmc2V0IGluIHN5bmMgKHNsaWdodGx5IG1vcmUgdGhhbiB3aWR0aCBzb1xuICAgIC8vIHRoZSBib3gtc2hhZG93IGlzIGhpZGRlbiB0b28pLlxuICAgIGlmICghcGFuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwib3BlblwiKSkge1xuICAgICAgcGFuZWwuc3R5bGUucmlnaHQgPSBgLSR7Y3VycmVudFdpZHRoICsgMzB9cHhgO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYW5lbC5zdHlsZS5yaWdodCA9IFwiMFwiO1xuICAgIH1cbiAgICAvLyBNb3ZlIHRoZSB0b2dnbGUgaGFuZGxlIHRvIHNpdCBmbHVzaCB3aXRoIHRoZSBvcGVuIHBhbmVsJ3MgbGVmdCBlZGdlLlxuICAgIHRvZ2dsZUJ0bi5zdHlsZS5yaWdodCA9IHBhbmVsLmNsYXNzTGlzdC5jb250YWlucyhcIm9wZW5cIikgPyBgJHtjdXJyZW50V2lkdGh9cHhgIDogXCIwXCI7XG4gIH1cbiAgLy8gSW5pdGlhbDogcmVzdG9yZSBsYXN0LXVzZWQgd2lkdGguXG4gIGlmIChpc0NvbnRleHRBbGl2ZSgpKSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFdJRFRIX0tFWSkudGhlbigoZCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBkW1dJRFRIX0tFWV0gPT09IFwibnVtYmVyXCIpIGFwcGx5V2lkdGgoZFtXSURUSF9LRVldKTtcbiAgICB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gIH1cbiAgLy8gRHJhZzogdHJhY2sgZGVsdGEgdnMuIHN0YXJ0aW5nIG1vdXNlWCwgcmVjb21wdXRlIHdpZHRoIG9uIGVhY2ggbW92ZS5cbiAgbGV0IGRyYWdTdGFydFggPSAwLCBkcmFnU3RhcnRXID0gMDtcbiAgZnVuY3Rpb24gb25EcmFnTW92ZShlKSB7XG4gICAgLy8gUmVzaXplciBpcyBvbiB0aGUgTEVGVCBlZGdlIFx1MjAxNCBkcmFnZ2luZyBsZWZ0IGdyb3dzIHRoZSBwYW5lbC5cbiAgICBjb25zdCBkZWx0YSA9IGRyYWdTdGFydFggLSBlLmNsaWVudFg7XG4gICAgYXBwbHlXaWR0aChkcmFnU3RhcnRXICsgZGVsdGEpO1xuICB9XG4gIGZ1bmN0aW9uIG9uRHJhZ0VuZCgpIHtcbiAgICBwYW5lbC5jbGFzc0xpc3QucmVtb3ZlKFwicmVzaXppbmdcIik7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJtb3ZlXCIsIG9uRHJhZ01vdmUpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb2ludGVydXBcIiwgb25EcmFnRW5kKTtcbiAgICBpZiAoaXNDb250ZXh0QWxpdmUoKSkge1xuICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgW1dJRFRIX0tFWV06IGN1cnJlbnRXaWR0aCB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgfVxuICB9XG4gIHJlc2l6ZXIuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJkb3duXCIsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGRyYWdTdGFydFggPSBlLmNsaWVudFg7XG4gICAgZHJhZ1N0YXJ0VyA9IGN1cnJlbnRXaWR0aDtcbiAgICBwYW5lbC5jbGFzc0xpc3QuYWRkKFwicmVzaXppbmdcIik7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJtb3ZlXCIsIG9uRHJhZ01vdmUpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVydXBcIiwgb25EcmFnRW5kKTtcbiAgfSk7XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFBvcC1vdXQgdG8gc3RhbmRhbG9uZSB3aW5kb3cgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIE9wZW5zIHRoZSBzYW1lIGlmcmFtZSBVUkwgaW4gYSBmcmVzaCB3aW5kb3cgc28gdGhlIHVzZXIgY2FuIG1vdmUgaXRcbiAgLy8gdG8gYSBzZWNvbmQgbW9uaXRvciAvIHJlc2l6ZSBmcmVlbHkuIFNpZGViYXIgYXV0by1jb2xsYXBzZXMgYWZ0ZXIsXG4gIC8vIHNpbmNlIGJvdGggc2hvd2luZyBpdCBzaWRlLWJ5LXNpZGUgd291bGQgYmUgY29uZnVzaW5nLlxuICBsZXQgcG9wb3V0V2luID0gbnVsbDtcbiAgYXN5bmMgZnVuY3Rpb24gcG9wT3V0KCkge1xuICAgIGxldCB1cmw7XG4gICAgdHJ5IHsgdXJsID0gYXdhaXQgYnVpbGRJZnJhbWVVcmwoKTsgfVxuICAgIGNhdGNoIChlcnIpIHsgY29uc29sZS53YXJuKFwiW25oaS1maGlyIHNpZGViYXJdIHBvcE91dDpcIiwgZXJyLm1lc3NhZ2UpOyByZXR1cm47IH1cbiAgICAvLyBJZiB3ZSBhbHJlYWR5IGhhdmUgYW4gb3BlbiBwb3B1cCwgcmV1c2UgaXQgKHJhaXNlcyB0aGUgZXhpc3RpbmdcbiAgICAvLyB3aW5kb3cpLiBUaGUgMm5kIHdpbmRvdy5vcGVuIGNhbGwgd2l0aCB0aGUgc2FtZSBuYW1lIHJlbG9hZHMgaXQuXG4gICAgcG9wb3V0V2luID0gd2luZG93Lm9wZW4odXJsLCBcIm5oaS1maGlyLWJyaWRnZS1hc3Npc3RhbnRcIixcbiAgICAgIGB3aWR0aD0ke2N1cnJlbnRXaWR0aH0saGVpZ2h0PTkwMCxyZXNpemFibGU9eWVzLHNjcm9sbGJhcnM9eWVzYCk7XG4gICAgaWYgKHBvcG91dFdpbikge1xuICAgICAgcG9wb3V0V2luLmZvY3VzKCk7XG4gICAgICAvLyBDb2xsYXBzZSB0aGUgc2lkZWJhciBzbyB0aGUgdXNlciBpc24ndCBzdGFyaW5nIGF0IHRoZSBzYW1lIGFwcFxuICAgICAgLy8gaW4gdHdvIHBsYWNlcy5cbiAgICAgIHNldE9wZW4oZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEJ1aWxkIHRoZSBpZnJhbWUgVVJMLiBXaGVuIHdlIGhhdmUgYSBwYXRpZW50X2lkICsgYSB3b3JraW5nIGJhY2tlbmRcbiAgLy8gd2UgaGFuZCB0aGUgYXBwIGEgU01BUlQgRUhSLUxhdW5jaCBjb250ZXh0IHNvIGl0IGF1dG8tbG9hZHMgT1VSXG4gIC8vIGxvY2FsIEZISVIgc3RvcmUuIE90aGVyd2lzZSBqdXN0IG9wZW4gdGhlIGFwcCBob21lIChpdCdsbCBzaG93IGl0c1xuICAvLyBkZWZhdWx0IGxhbmRpbmcgLyBhIHB1YmxpYyB0ZXN0IHNlcnZlcikuXG4gIC8vIERldGVjdCBvcnBoYW5lZCBjb250ZW50IHNjcmlwdDogYWZ0ZXIgdGhlIHVzZXIgcmVsb2FkcyB0aGUgZXh0ZW5zaW9uXG4gIC8vIGZyb20gY2hyb21lOi8vZXh0ZW5zaW9ucywgdGhpcyBzY3JpcHQncyBjaHJvbWUucnVudGltZS5pZCBsaW5rIGdvZXNcbiAgLy8gbnVsbCBhbmQgYW55IGNocm9tZS4qIGNhbGwgdGhyb3dzIFwiRXh0ZW5zaW9uIGNvbnRleHQgaW52YWxpZGF0ZWRcIi5cbiAgLy8gVGhlIGZpeCBpcyBhbHdheXMgYSBwYWdlIHJlZnJlc2ggXHUyMDE0IHdlIGp1c3Qgc3VyZmFjZSBhIGNsZWFyZXIgZXJyb3IuXG4gIGZ1bmN0aW9uIGlzQ29udGV4dEFsaXZlKCkge1xuICAgIHRyeSB7IHJldHVybiAhIWNocm9tZS5ydW50aW1lPy5pZDsgfSBjYXRjaCB7IHJldHVybiBmYWxzZTsgfVxuICB9XG5cbiAgLy8gQWx3YXlzIHByZWZlciB0aGUgbG9jYWwgTmV4dC5qcyBkZXYgc2VydmVyIChQTkEtZnJlZSBwYXRoKS4gVGhlXG4gIC8vIGNvbnRlbnQgc2NyaXB0IGNhbid0IHByb2JlIGxvY2FsaG9zdCBmcm9tIHRoZSBOSEkgb3JpZ2luIChQTkEgYWdhaW4pLFxuICAvLyBzbyB3ZSBqdXN0IHRydXN0IHRoZSB1c2VyIHRvIGhhdmUgYG5wbSBydW4gZGV2YCBydW5uaW5nIGFuZCBsZXQgdGhlXG4gIC8vIGlmcmFtZSBzdXJmYWNlIGEgXCJjb25uZWN0aW9uIHJlZnVzZWRcIiBpZiB0aGV5IGRvbid0LiBBIGZ1dHVyZSBzZXR0aW5nXG4gIC8vIGNhbiBsZXQgdXNlcnMgZmxpcCB0byB0aGUgZGVwbG95ZWQgVVJMLlxuICBhc3luYyBmdW5jdGlvbiBwaWNrQXBwQmFzZSgpIHtcbiAgICBjb25zdCB7IHNpZGViYXJBcHBCYXNlIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJzaWRlYmFyQXBwQmFzZVwiKS5jYXRjaCgoKSA9PiAoe30pKTtcbiAgICByZXR1cm4gc2lkZWJhckFwcEJhc2UgfHwgQVBQX0JBU0VfTE9DQUw7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBidWlsZElmcmFtZVVybCgpIHtcbiAgICBjb25zdCBjYWNoZUJ1c3QgPSBgXz0ke0RhdGUubm93KCl9YDtcbiAgICBpZiAoIWlzQ29udGV4dEFsaXZlKCkpIHtcbiAgICAgIC8vIENocm9tZSBpbnZhbGlkYXRlcyBhIGNvbnRlbnQgc2NyaXB0J3MgY2hyb21lLiogQVBJcyB0aGUgbW9tZW50XG4gICAgICAvLyB0aGUgZXh0ZW5zaW9uIGl0c2VsZiBpcyB1cGRhdGVkIC8gcmVsb2FkZWQuIFRoZSBzY3JpcHQga2VlcHNcbiAgICAgIC8vIHJ1bm5pbmcgb24gdGhlIHBhZ2UgYnV0IGNhbiBubyBsb25nZXIgdGFsayB0byBzdG9yYWdlIC8gU1cgXHUyMDE0XG4gICAgICAvLyB1c2VyIGhhcyB0byBGNSB0aGUgTkhJIHRhYiBzbyBhIGZyZXNoIGNvcHkgb2Ygc2lkZWJhci5qcyBnZXRzXG4gICAgICAvLyBpbmplY3RlZC4gUGhyYXNlIHRoaXMgd2l0aG91dCBqYXJnb24uXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiXHU2NEY0XHU1MTQ1XHU1MjlGXHU4MEZEXHU1MjVCXHU2NkY0XHU2NUIwXHU5MDRFXHVGRjBDXHU4QUNCXHU2MzA5IEY1IFx1OTFDRFx1NjVCMFx1NjU3NFx1NzQwNlx1OTAxOVx1NTAwQlx1OTgwMVx1OTc2Mlx1NUMzMVx1ODBGRFx1NjA2Mlx1NUZBOVx1NTJBOVx1NzQwNlx1OTc2Mlx1Njc3Rlx1MzAwMlxcblwiICtcbiAgICAgICAgXCIoRXh0ZW5zaW9uIHdhcyBqdXN0IHVwZGF0ZWQgXHUyMDE0IHByZXNzIEY1IG9uIHRoaXMgcGFnZSB0byByZWxvYWQgdGhlIHNpZGViYXIuKVwiLFxuICAgICAgKTtcbiAgICB9XG4gICAgY29uc3QgeyBwYXRpZW50T3ZlcnJpZGUsIGJhY2tlbmRVcmwgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXG4gICAgICBcInBhdGllbnRPdmVycmlkZVwiLCBcImJhY2tlbmRVcmxcIixcbiAgICBdKS5jYXRjaCgoKSA9PiAoe30pKTtcbiAgICBjb25zdCBiYWNrZW5kID0gKGJhY2tlbmRVcmwgfHwgREVGQVVMVF9CQUNLRU5EKS5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG4gICAgY29uc3QgcGF0aWVudElkID0gcGF0aWVudE92ZXJyaWRlPy5pZF9ubztcbiAgICBjb25zdCBhcHBCYXNlID0gYXdhaXQgcGlja0FwcEJhc2UoKTtcbiAgICBjb25zdCBhcHBIb21lID0gYCR7YXBwQmFzZX0vYDtcbiAgICBpZiAoIXBhdGllbnRJZCkge1xuICAgICAgLy8gTm8gcGF0aWVudCBjb250ZXh0IHlldCBcdTIwMTQgbG9hZCB0aGUgYXBwIGJhcmU7IHVzZXIgY2FuIGZpbGwgdGhlXG4gICAgICAvLyBwb3B1cCdzIFx1RDgzRVx1REVBQSBhcmVhIGFuZCBjbGljayBcdUQ4M0RcdUREMDQgdG8gcmVsYXVuY2ggd2l0aCBjb250ZXh0LlxuICAgICAgcmV0dXJuIGAke2FwcEhvbWV9PyR7Y2FjaGVCdXN0fWA7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goYCR7YmFja2VuZH0vc21hcnQvbGF1bmNoLWNvbnRleHRgLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBwYXRpZW50X2lkOiBwYXRpZW50SWQgfSksXG4gICAgICB9KTtcbiAgICAgIGlmICghci5vaykgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7ci5zdGF0dXN9YCk7XG4gICAgICBjb25zdCB7IGxhdW5jaCB9ID0gYXdhaXQgci5qc29uKCk7XG4gICAgICBjb25zdCBpc3MgPSBgJHtiYWNrZW5kfS9maGlyYDtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoeyBpc3MsIGxhdW5jaCB9KTtcbiAgICAgIHJldHVybiBgJHthcHBCYXNlfSR7QVBQX0xBVU5DSF9QQVRIfT8ke3BhcmFtcy50b1N0cmluZygpfSYke2NhY2hlQnVzdH1gO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS53YXJuKFwiW25oaS1maGlyIHNpZGViYXJdIGxhdW5jaC1jb250ZXh0IGZhaWxlZCwgZmFsbGluZyBiYWNrIHRvIGJhcmUgYXBwOlwiLCBlcnIpO1xuICAgICAgcmV0dXJuIGAke2FwcEhvbWV9PyR7Y2FjaGVCdXN0fWA7XG4gICAgfVxuICB9XG5cbiAgbGV0IGlmcmFtZUVsID0gbnVsbDtcbiAgYXN5bmMgZnVuY3Rpb24gbG9hZElmcmFtZSgpIHtcbiAgICBpZiAoaWZyYW1lRWwpIHJldHVybjtcbiAgICBsZXQgc3JjO1xuICAgIHRyeSB7IHNyYyA9IGF3YWl0IGJ1aWxkSWZyYW1lVXJsKCk7IH1cbiAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBVc2UgdGV4dENvbnRlbnQgKyB3aGl0ZS1zcGFjZTpwcmUtbGluZSBzbyBtdWx0aS1saW5lIGJpbGluZ3VhbFxuICAgICAgLy8gbWVzc2FnZXMgZnJvbSBidWlsZElmcmFtZVVybCByZW5kZXIgd2l0aCB0aGVpciBsaW5lIGJyZWFrc1xuICAgICAgLy8gaW50YWN0IChhbmQgd2UgZG9uJ3QgaGF2ZSB0byB3b3JyeSBhYm91dCBIVE1MIGVzY2FwaW5nKS5cbiAgICAgIGVtcHR5Qm94LnRleHRDb250ZW50ID0gXCJcIjtcbiAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBkaXYuc3R5bGUuY3NzVGV4dCA9IFwiY29sb3I6I2I5MWMxYzsgd2hpdGUtc3BhY2U6cHJlLWxpbmU7IGxpbmUtaGVpZ2h0OjEuNlwiO1xuICAgICAgZGl2LnRleHRDb250ZW50ID0gYFx1MjZBMCAke2Vyci5tZXNzYWdlfWA7XG4gICAgICBlbXB0eUJveC5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZnJhbWVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7XG4gICAgaWZyYW1lRWwudGl0bGUgPSBcIk1lZGljYWwgTm90ZSBTTUFSVCBvbiBGSElSXCI7XG4gICAgaWZyYW1lRWwuYWxsb3cgPSBcImNsaXBib2FyZC1yZWFkOyBjbGlwYm9hcmQtd3JpdGVcIjtcbiAgICBlbXB0eUJveC5yZW1vdmUoKTtcbiAgICBwYW5lbC5hcHBlbmRDaGlsZChpZnJhbWVFbCk7XG4gICAgaWZyYW1lRWwuc3JjID0gc3JjO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gcmVsb2FkSWZyYW1lKCkge1xuICAgIGlmICghaWZyYW1lRWwpIHsgYXdhaXQgbG9hZElmcmFtZSgpOyByZXR1cm47IH1cbiAgICB0cnkgeyBpZnJhbWVFbC5zcmMgPSBhd2FpdCBidWlsZElmcmFtZVVybCgpOyB9XG4gICAgY2F0Y2ggKGVycikgeyBjb25zb2xlLndhcm4oXCJbbmhpLWZoaXIgc2lkZWJhcl1cIiwgZXJyLm1lc3NhZ2UpOyB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRPcGVuKG9wZW4pIHtcbiAgICBwYW5lbC5jbGFzc0xpc3QudG9nZ2xlKFwib3BlblwiLCBvcGVuKTtcbiAgICAvLyBTeW5jIGlubGluZSByaWdodC90b2dnbGUgcG9zaXRpb24gd2l0aCB0aGUgb3BlbiBzdGF0ZSwgdXNpbmcgdGhlXG4gICAgLy8gKmN1cnJlbnQqIHdpZHRoICh3aGljaCBtYXkgaGF2ZSBiZWVuIHVzZXItcmVzaXplZCkuXG4gICAgYXBwbHlXaWR0aChjdXJyZW50V2lkdGgpO1xuICAgIGlmIChvcGVuKSBsb2FkSWZyYW1lKCkuY2F0Y2goKCkgPT4ge30pO1xuICAgIGlmIChpc0NvbnRleHRBbGl2ZSgpKSB7XG4gICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBbU1RPUkFHRV9LRVldOiBvcGVuIH0pLmNhdGNoKCgpID0+IHt9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCByZWxvYWRCdG4gPSByb290LmdldEVsZW1lbnRCeUlkKFwicmVsb2FkXCIpO1xuICB0b2dnbGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBzZXRPcGVuKCFwYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoXCJvcGVuXCIpKTtcbiAgfSk7XG4gIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBzZXRPcGVuKGZhbHNlKSk7XG4gIGxvYWRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGxvYWRJZnJhbWUoKSk7XG4gIHJlbG9hZEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gcmVsb2FkSWZyYW1lKCkpO1xuICBwb3BvdXRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHBvcE91dCgpKTtcblxuICAvLyBSZXN0b3JlIHByZXZpb3VzIG9wZW4vY2xvc2VkIHN0YXRlIG9uIHRoaXMgb3JpZ2luLlxuICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoU1RPUkFHRV9LRVkpLnRoZW4oKGQpID0+IHtcbiAgICBpZiAoZFtTVE9SQUdFX0tFWV0pIHNldE9wZW4odHJ1ZSk7XG4gIH0pLmNhdGNoKCgpID0+IHt9KTtcblxuICAvLyBcdTI1MDBcdTI1MDAgU3luYy1ydW5uaW5nIGlmcmFtZSBwYXVzZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gV2hpbGUgdGhlIGV4dGVuc2lvbidzIHJ1bk5oaUFwaVN5bmMgaXMgaW4gZmxpZ2h0LCB0aGUgbWVkaWNhbC1ub3RlXG4gIC8vIGlmcmFtZSBjb21wZXRlcyB3aXRoIG91ciBOSEkgZmFuLW91dCBmZXRjaGVzIGZvciB0aGUgdGFiJ3MgbmV0d29ya1xuICAvLyArIEpTIHRocmVhZCAod2Ugc2F3IE5ISSBmYW4tb3V0IHRpbWUgcm91Z2hseSB0cmlwbGUgd2hlbiB0aGlzIGlmcmFtZVxuICAvLyB3YXMgYWN0aXZlKS4gU3Rhc2ggdGhlIGlmcmFtZSdzIHNyYyBpbnRvIGFib3V0OmJsYW5rIGR1cmluZyBzeW5jIHNvXG4gIC8vIGl0cyBPQXV0aCArIEZISVIgY2FsbHMgc3RvcCBoYW1tZXJpbmcgdGhlIG5ldHdvcmsuIFJlc3VtZSBieVxuICAvLyByZS1sb2FkaW5nIGZyb20gdGhlIHNhdmVkIHNyYyB3aGVuIHN5bmMgZmluaXNoZXMuXG4gIGxldCBfcGF1c2VkU3JjID0gbnVsbDtcbiAgZnVuY3Rpb24gcGF1c2VJZnJhbWUoKSB7XG4gICAgaWYgKCFpZnJhbWVFbCB8fCBfcGF1c2VkU3JjICE9PSBudWxsKSByZXR1cm47XG4gICAgX3BhdXNlZFNyYyA9IGlmcmFtZUVsLnNyYztcbiAgICBpZnJhbWVFbC5zcmMgPSBcImFib3V0OmJsYW5rXCI7XG4gIH1cbiAgZnVuY3Rpb24gcmVzdW1lSWZyYW1lKCkge1xuICAgIGlmICghaWZyYW1lRWwgfHwgX3BhdXNlZFNyYyA9PT0gbnVsbCkgcmV0dXJuO1xuICAgIGlmcmFtZUVsLnNyYyA9IF9wYXVzZWRTcmM7XG4gICAgX3BhdXNlZFNyYyA9IG51bGw7XG4gIH1cbiAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwic3luY1J1bm5pbmdcIikudGhlbigoZCkgPT4ge1xuICAgIGlmIChkLnN5bmNSdW5uaW5nKSBwYXVzZUlmcmFtZSgpO1xuICB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gIGNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlcywgYXJlYSkgPT4ge1xuICAgIGlmIChhcmVhICE9PSBcImxvY2FsXCIgfHwgIShcInN5bmNSdW5uaW5nXCIgaW4gY2hhbmdlcykpIHJldHVybjtcbiAgICBpZiAoY2hhbmdlcy5zeW5jUnVubmluZy5uZXdWYWx1ZSkgcGF1c2VJZnJhbWUoKTtcbiAgICBlbHNlIHJlc3VtZUlmcmFtZSgpO1xuICB9KTtcbn0pKCk7XG4iXSwKICAibWFwcGluZ3MiOiAiOztBQWlCQSxHQUFDLE1BQU07QUFRTCxVQUFNLGVBQWUsU0FBUyxlQUFlLHVCQUF1QjtBQUNwRSxRQUFJO0FBQWMsbUJBQWEsT0FBTztBQUV0QyxVQUFNLHdCQUF3QjtBQUM5QixVQUFNLG9CQUFvQjtBQUMxQixVQUFNLG9CQUFvQjtBQUMxQixVQUFNLGNBQWM7QUFDcEIsVUFBTSxZQUFZO0FBR2xCLFVBQU0sa0JBQWtCO0FBV3hCLFVBQU0saUJBQWlCO0FBQ3ZCLFVBQU0sb0JBQW9CO0FBQzFCLFVBQU0sa0JBQWtCO0FBR3hCLFVBQU0sT0FBTyxTQUFTLGNBQWMsS0FBSztBQUN6QyxTQUFLLEtBQUs7QUFHVixTQUFLLE1BQU0sVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFTckIsYUFBUyxnQkFBZ0IsWUFBWSxJQUFJO0FBZXpDLG1CQUFlLHVCQUF1QjtBQUNwQyxVQUFJO0FBQ0YsY0FBTSxFQUFFLFVBQVUsZUFBZSxJQUFJLE1BQU0sT0FBTyxRQUFRLE1BQU0sSUFBSTtBQUFBLFVBQ2xFO0FBQUEsVUFBWTtBQUFBLFFBQ2QsQ0FBQztBQUNELGNBQU0sVUFBVSxtQkFBbUIsU0FBUyxhQUFhO0FBQ3pELGFBQUssTUFBTSxV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
