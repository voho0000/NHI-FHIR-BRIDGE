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
    const APP_BASE_DEPLOYED = "https://voho0000.github.io/medical-note-smart-on-fhir";
    const APP_BASE_LOCAL = "http://localhost:3001";
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
      return sidebarAppBase || APP_BASE_DEPLOYED;
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3NpZGViYXIuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIE5ISS1GSElSIEJyaWRnZSBcdTIwMTQgY29sbGFwc2libGUgcmlnaHQtc2lkZSBwYW5lbCBpbmplY3RlZCBpbnRvIEhJUyBwYWdlcy5cbi8vXG4vLyBHb2FscyBvZiB0aGlzIFBvQzpcbi8vIDEuIFByb3ZlIHdlIGNhbiByZW5kZXIgYW4gaWZyYW1lIG9mIHRoZSBtZWRpY2FsLW5vdGUgU01BUlQgYXBwIGluc2lkZVxuLy8gICAgdGhlIE5ISSBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0EgcGFnZSB3aXRob3V0IENTUCAvIFgtRnJhbWUtT3B0aW9ucyBpc3N1ZXMuXG4vLyAyLiBLZWVwIHRoZSBzaWRlYmFyIGlzb2xhdGVkIGZyb20gdGhlIGhvc3QgcGFnZSdzIENTUyB2aWEgU2hhZG93IERPTVxuLy8gICAgc28gSElTLXNwZWNpZmljIHN0eWxlcyBjYW4ndCBibGVlZCBpbiBhbmQgYnJlYWsgbGF5b3V0LlxuLy8gMy4gR2l2ZSBhIHNpbmdsZSB0b2dnbGUgYnV0dG9uIChwcmlzbSBtYXJrIFx1MjAxNCBzYW1lIGFzIG1lZGljYWwtbm90ZSdzXG4vLyAgICBhcHAgaWNvbikgYXQgdGhlIHJpZ2h0IGVkZ2UgdGhhdCBzbGlkZXMgdGhlIHBhbmVsIGluL291dC4gU3RhdGVcbi8vICAgIHBlcnNpc3RzIGFjcm9zcyBuYXZpZ2F0aW9ucyBvbiB0aGUgc2FtZSBvcmlnaW5cbi8vICAgIHZpYSBjaHJvbWUuc3RvcmFnZS5sb2NhbC5cbi8vXG4vLyBOb3QgaW4gc2NvcGUgaGVyZTpcbi8vIC0gcG9zdE1lc3NhZ2UgYnJpZGdlIGZyb20gdGhlIGlmcmFtZSB0byB0aGUgU1cgKGRhdGUtcmFuZ2UgdG9vbCBjYWxscykuXG4vLyAgIFRoYXQgY29tZXMgb25jZSB3ZSBjb25maXJtIHRoZSBiYXNpYyBlbWJlZCByZW5kZXJzLlxuLy8gLSBQZXItSElTIGF1dGggaGFuZG9mZiAoRkhJUiBsYXVuY2ggdG9rZW4sIGV0Yy4pLlxuXG4oKCkgPT4ge1xuICAvLyBSZS1pbmplY3Rpb24gKGUuZy4gYmFja2dyb3VuZC5qcyBjYWxsaW5nIGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdFxuICAvLyBhZnRlciBhbiBleHRlbnNpb24gdXBkYXRlKSBtZWFucyB0aGUgc2NyaXB0IHJ1bnMgYWdhaW4gb24gYSBwYWdlIHRoYXRcbiAgLy8gYWxyZWFkeSBoYXMgYSBob3N0IGVsZW1lbnQgZnJvbSB0aGUgcHJldmlvdXMgaW5zdGFuY2UuIENsZWFuIHVwIHRoZVxuICAvLyBzdGFsZSBob3N0IHNvIHRoZSB0b2dnbGUgYnV0dG9uIGRvZXNuJ3QgYXBwZWFyIHR3aWNlLlxuICAvLyBMZWZ0b3ZlciBjaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQgbGlzdGVuZXJzIGZyb20gdGhlIG9sZCBzY3JpcHRcbiAgLy8gaW5zdGFuY2UgY2FuJ3QgYmUgdW5yZWdpc3RlcmVkLCBidXQgdGhleSByZWZlcmVuY2UgZGV0YWNoZWQgRE9NXG4gIC8vIG5vZGVzIHNvIHRoZWlyIGNhbGxiYWNrcyBhcmUgdmlzdWFsIG5vLW9wcy5cbiAgY29uc3QgcHJldmlvdXNIb3N0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuaGktZmhpci1zaWRlYmFyLWhvc3RcIik7XG4gIGlmIChwcmV2aW91c0hvc3QpIHByZXZpb3VzSG9zdC5yZW1vdmUoKTtcblxuICBjb25zdCBTSURFQkFSX0RFRkFVTFRfV0lEVEggPSA0MjA7XG4gIGNvbnN0IFNJREVCQVJfTUlOX1dJRFRIID0gMjgwO1xuICBjb25zdCBTSURFQkFSX01BWF9XSURUSCA9IDEyMDA7XG4gIGNvbnN0IFNUT1JBR0VfS0VZID0gXCJzaWRlYmFyX29wZW5cIjtcbiAgY29uc3QgV0lEVEhfS0VZID0gXCJzaWRlYmFyX3dpZHRoXCI7XG4gIC8vIFRoZSBTTUFSVCBsYXVuY2ggZW50cnkgdGhhdCBmaGlyY2xpZW50IGV4cGVjdHMgdG8gaGFuZGxlIHRoZSBpc3MrbGF1bmNoXG4gIC8vIHBhcmFtcyBhbmQgcnVuIEZISVIub2F1dGgyLmF1dGhvcml6ZSgpLlxuICBjb25zdCBBUFBfTEFVTkNIX1BBVEggPSBcIi9zbWFydC9sYXVuY2hcIjtcbiAgLy8gRGVmYXVsdCB0byB0aGUgZGVwbG95ZWQgZ2l0aHViLmlvIGJ1aWxkIHNvIHVzZXJzIGRvbid0IG5lZWQgYVxuICAvLyBsb2NhbCBOZXh0LmpzIGRldiBzZXJ2ZXIgcnVubmluZyBqdXN0IHRvIG9wZW4gdGhlIGhlbHBlci5cbiAgLy9cbiAgLy8gVHJhZGUtb2ZmOiB0aGUgaWZyYW1lIHNpdHMgb24gYSBwdWJsaWMgb3JpZ2luIChnaXRodWIuaW8pIHdoaWxlXG4gIC8vIHRoZSBiYWNrZW5kIGl0IHRhbGtzIHRvIGxpdmVzIG9uIGxvb3BiYWNrIChsb2NhbGhvc3QpLiBDaHJvbWUnc1xuICAvLyBQcml2YXRlIE5ldHdvcmsgQWNjZXNzIGNhbiBibG9jayB0aG9zZSBjcm9zcy1vcmlnaW4gZmV0Y2hlcyBldmVuXG4gIC8vIHdoZW4gdGhlIHNlcnZlciByZXR1cm5zIEFjY2Vzcy1Db250cm9sLUFsbG93LVByaXZhdGUtTmV0d29yazogdHJ1ZSxcbiAgLy8gYW5kIG5ld2VyIENocm9tZXMgYXJlIHRpZ2h0ZW5pbmcgdGhpcyB0byBcImFsd2F5cyBibG9ja1wiLiBJZiBhIHVzZXJcbiAgLy8gaGl0cyB0aGF0IHdhbGwsIHRoZXkgY2FuIGZsaXAgYmFjayB0byB0aGUgbG9jYWwgZGV2IHNlcnZlciBieVxuICAvLyBzZXR0aW5nIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNpZGViYXJBcHBCYXNlID0gXCJodHRwOi8vbG9jYWxob3N0OjMwMDFcIlxuICAvLyAoTmV4dC5qcyBkZXYgc2VydmVyIHJ1bnMgYXQgcm9vdCwgbm8gL21lZGljYWwtbm90ZS1zbWFydC1vbi1maGlyXG4gIC8vIHByZWZpeCBcdTIwMTQgdGhlIGxhdW5jaCBwYWdlIGRldGVjdHMgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lIGFuZFxuICAvLyBzZXRzIHByZWZpeCA9IFwiXCIgd2hlbiBub3Qgb24gdGhlIGdpdGh1Yi5pbyByZXBvIHN1YnBhdGgpLlxuICBjb25zdCBBUFBfQkFTRV9ERVBMT1lFRCA9IFwiaHR0cHM6Ly92b2hvMDAwMC5naXRodWIuaW8vbWVkaWNhbC1ub3RlLXNtYXJ0LW9uLWZoaXJcIjtcbiAgY29uc3QgQVBQX0JBU0VfTE9DQUwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMVwiO1xuICBjb25zdCBERUZBVUxUX0JBQ0tFTkQgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODAxMFwiO1xuXG4gIC8vIEhvc3QgZWxlbWVudCArIFNoYWRvdyByb290IHNvIHRoZSBob3N0IHBhZ2UncyBDU1MgbmV2ZXIgdG91Y2hlcyB1cy5cbiAgY29uc3QgaG9zdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGhvc3QuaWQgPSBcIm5oaS1maGlyLXNpZGViYXItaG9zdFwiO1xuICAvLyBQaW4gdG8gdGhlIHBhZ2UsIGFib3ZlIGFsbW9zdCBldmVyeXRoaW5nLiBOSEkgdXNlcyBzb21lIHotaW5kZXhcbiAgLy8gdmFsdWVzIGJ1dCBub3RoaW5nIGFib3ZlIDk5OTkuXG4gIGhvc3Quc3R5bGUuY3NzVGV4dCA9IGBcbiAgICBhbGw6IGluaXRpYWw7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIHRvcDogMDtcbiAgICByaWdodDogMDtcbiAgICBoZWlnaHQ6IDEwMHZoO1xuICAgIHotaW5kZXg6IDIxNDc0ODM2NDY7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIGA7XG4gIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZChob3N0KTtcblxuICAvLyBUaGUgc2lkZWJhcidzIGFzc2lzdGFudCBidXR0b24gKyBpZnJhbWUgcGFuZWwgYXJlIG9ubHkgdXNlZnVsIGluXG4gIC8vIFwiXHU0RTBBXHU1MEIzXHU1RjhDXHU3QUVGXCIgbW9kZSBcdTIwMTQgdGhlIGlmcmFtZSBpcyBhIFNNQVJUIGFwcCB0aGF0IHRhbGtzIHRvIHRoZSBsb2NhbFxuICAvLyBGSElSIGJhY2tlbmQuIEluIFwiXHU0RTBCXHU4RjA5XHU1MjMwXHU5NkZCXHU4MTY2XCIgbW9kZSB0aGVyZSdzIG5vIGJhY2tlbmQgdG8gdGFsayB0byxcbiAgLy8gc28gaGlkZSB0aGUgd2hvbGUgdGhpbmcuXG4gIC8vXG4gIC8vIFBsdXMgYW4gZXhwbGljaXQgYHNpZGViYXJFbmFibGVkYCBvcHQtb3V0OiB1c2VycyB3aG8gb25seSB3YW50IHRoZVxuICAvLyByYXcgRkhJUiBCdW5kbGUgYW5kIG5ldmVyIHBsYW4gdG8gZW1iZWQgU01BUlQgYXBwcyBvbiB0aGUgTkhJIHBhZ2VcbiAgLy8gY2FuIHR1cm4gdGhlIHBhbmVsIG9mZiBlbnRpcmVseSB2aWEgdGhlIHBvcHVwJ3MgXHUzMDBDXHUyNjk5XHVGRTBGIFx1OTAzMlx1OTY4RVx1OEEyRFx1NUI5QVx1MzAwRC5cbiAgLy8gQWxsIHNldHRpbmdzIChzeW5jTW9kZSwgc2lkZWJhckVuYWJsZWQpIGxpdmUgaW4gY2hyb21lLnN0b3JhZ2UubG9jYWxcbiAgLy8gc2luY2UgdjAuNS4wIFx1MjAxNCBzaWRlYmFyLmpzIHdhcyBtaXNzZWQgaW4gdGhhdCBtaWdyYXRpb24gYW5kIGtlcHRcbiAgLy8gcmVhZGluZyBmcm9tIC5zeW5jLCB3aGljaCBvbmx5IGV2ZXIgaGVsZCB1bmRlZmluZWQgdmFsdWVzIGFmdGVyXG4gIC8vIHRoZSBtaWdyYXRpb24gY2xlYXJlZCB0aGUga2V5cy4gUmVzdWx0OiB0aGUgYXNzaXN0YW50IHBpbGwgbmV2ZXJcbiAgLy8gYXBwZWFyZWQgZXZlbiB3aGVuIHRoZSB1c2VyIGhhZCB0aWNrZWQgXCJcdTk4NkZcdTc5M0FcdTUyQTlcdTc0MDZcdTk3NjJcdTY3N0ZcIiBpbiBwb3B1cC5cbiAgYXN5bmMgZnVuY3Rpb24gX2FwcGx5TW9kZVZpc2liaWxpdHkoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHsgc3luY01vZGUsIHNpZGViYXJFbmFibGVkIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1xuICAgICAgICBcInN5bmNNb2RlXCIsIFwic2lkZWJhckVuYWJsZWRcIixcbiAgICAgIF0pO1xuICAgICAgY29uc3QgdmlzaWJsZSA9IHNpZGViYXJFbmFibGVkICE9PSBmYWxzZSAmJiBzeW5jTW9kZSA9PT0gXCJiYWNrZW5kXCI7XG4gICAgICBob3N0LnN0eWxlLmRpc3BsYXkgPSB2aXNpYmxlID8gXCJcIiA6IFwibm9uZVwiO1xuICAgIH0gY2F0Y2gge1xuICAgICAgaG9zdC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuICB9XG4gIF9hcHBseU1vZGVWaXNpYmlsaXR5KCk7XG4gIGNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlcywgYXJlYSkgPT4ge1xuICAgIGlmIChhcmVhICE9PSBcImxvY2FsXCIpIHJldHVybjtcbiAgICBpZiAoXCJzeW5jTW9kZVwiIGluIGNoYW5nZXMgfHwgXCJzaWRlYmFyRW5hYmxlZFwiIGluIGNoYW5nZXMpIHtcbiAgICAgIF9hcHBseU1vZGVWaXNpYmlsaXR5KCk7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCByb290ID0gaG9zdC5hdHRhY2hTaGFkb3coeyBtb2RlOiBcIm9wZW5cIiB9KTtcbiAgcm9vdC5pbm5lckhUTUwgPSBgXG4gICAgPHN0eWxlPlxuICAgICAgOmhvc3QsICogeyBib3gtc2l6aW5nOiBib3JkZXItYm94OyB9XG4gICAgICAudG9nZ2xlIHtcbiAgICAgICAgcG9zaXRpb246IGZpeGVkO1xuICAgICAgICB0b3A6IDUwJTtcbiAgICAgICAgcmlnaHQ6IDA7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcbiAgICAgICAgd2lkdGg6IDI4cHg7XG4gICAgICAgIGhlaWdodDogNzJweDtcbiAgICAgICAgLyogRGVlcCBuYXZ5ICgjMWUzYThhKSBcdTIwMTQga2VwdCBkaXN0aW5jdCBmcm9tIHBvcHVwJ3MgcHJpbWFyeVxuICAgICAgICAgICBibHVlIG9uIHB1cnBvc2U6IHRoaXMgcGlsbCBsaXZlcyBvbiB0aGUgaG9zdCBOSEkgcGFnZSwgbm90XG4gICAgICAgICAgIGluIHRoZSBleHRlbnNpb24gVUksIHNvIGEgc2xpZ2h0bHkgaGVhdmllciBjb2xvciBoZWxwcyBpdFxuICAgICAgICAgICBob2xkIGl0cyBvd24gYWdhaW5zdCB0aGUgcGFnZSBiYWNrZ3JvdW5kLiAqL1xuICAgICAgICBiYWNrZ3JvdW5kOiAjMWUzYThhO1xuICAgICAgICBjb2xvcjogd2hpdGU7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4IDAgMCA4cHg7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgZm9udC1mYW1pbHk6IC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgc2Fucy1zZXJpZjtcbiAgICAgICAgYm94LXNoYWRvdzogLTFweCAycHggNnB4IHJnYmEoMCwwLDAsMC4xMik7XG4gICAgICAgIHBvaW50ZXItZXZlbnRzOiBhdXRvO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgdHJhbnNpdGlvbjogcmlnaHQgMC4ycyBlYXNlLCBiYWNrZ3JvdW5kIDAuMnMgZWFzZSwgdHJhbnNmb3JtIDAuMnMgZWFzZTtcbiAgICAgICAgLyogU3VidGxlIDMtY3ljbGUgcHVsc2Ugb24gZmlyc3QgcGFpbnQgc28gYSBicmFuZC1uZXcgdXNlciBzZWVzXG4gICAgICAgICAgIFwib2ggdGhhdCdzIGEgYnV0dG9uXCIuIDMgY3ljbGVzIHRoZW4gc3RvcHMgXHUyMDE0IG5ldmVyIGdldHMgaW5cbiAgICAgICAgICAgdGhlIHdheSBhZnRlci4gKi9cbiAgICAgICAgYW5pbWF0aW9uOiBuZmItdG9nZ2xlLXB1bHNlIDEuNnMgZWFzZS1vdXQgMyBmb3J3YXJkcztcbiAgICAgIH1cbiAgICAgIC50b2dnbGUgc3ZnIHsgZGlzcGxheTogYmxvY2s7IHdpZHRoOiAyMHB4OyBoZWlnaHQ6IDIwcHg7IH1cbiAgICAgIC50b2dnbGU6aG92ZXIge1xuICAgICAgICBiYWNrZ3JvdW5kOiAjMWU0MGFmO1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSkgdHJhbnNsYXRlWCgtMnB4KTtcbiAgICAgIH1cbiAgICAgIC50b2dnbGU6Zm9jdXMtdmlzaWJsZSB7XG4gICAgICAgIG91dGxpbmU6IDJweCBzb2xpZCAjNjBhNWZhO1xuICAgICAgICBvdXRsaW5lLW9mZnNldDogMnB4O1xuICAgICAgfVxuICAgICAgQGtleWZyYW1lcyBuZmItdG9nZ2xlLXB1bHNlIHtcbiAgICAgICAgMCUsIDEwMCUgeyBib3gtc2hhZG93OiAtMXB4IDJweCA2cHggcmdiYSgwLDAsMCwwLjEyKTsgfVxuICAgICAgICA1MCUgeyBib3gtc2hhZG93OiAtMXB4IDJweCA2cHggcmdiYSgwLDAsMCwwLjEyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgMCAwIDAgNXB4IHJnYmEoNTksIDEzMCwgMjQ2LCAwLjM1KTsgfVxuICAgICAgfVxuICAgICAgQG1lZGlhIChwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpIHtcbiAgICAgICAgLnRvZ2dsZSB7IGFuaW1hdGlvbjogbm9uZTsgfVxuICAgICAgfVxuICAgICAgLnBhbmVsIHtcbiAgICAgICAgcG9zaXRpb246IGZpeGVkO1xuICAgICAgICB0b3A6IDA7XG4gICAgICAgIHJpZ2h0OiAtJHtTSURFQkFSX0RFRkFVTFRfV0lEVEggKyAzMH1weDtcbiAgICAgICAgaGVpZ2h0OiAxMDB2aDtcbiAgICAgICAgd2lkdGg6ICR7U0lERUJBUl9ERUZBVUxUX1dJRFRIfXB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgICAgICAgYm94LXNoYWRvdzogLTRweCAwIDEycHggcmdiYSgwLDAsMCwwLjEpO1xuICAgICAgICAvKiBObyB0cmFuc2l0aW9uIHdoaWxlIHVzZXIgaXMgZHJhZ2dpbmcgXHUyMDE0IHNldCBpbmxpbmUuICovXG4gICAgICAgIHRyYW5zaXRpb246IHJpZ2h0IDAuMjVzIGVhc2U7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIHBvaW50ZXItZXZlbnRzOiBhdXRvO1xuICAgICAgICBib3JkZXItbGVmdDogMXB4IHNvbGlkICNlNWU3ZWI7XG4gICAgICB9XG4gICAgICAucGFuZWwub3BlbiB7IHJpZ2h0OiAwOyB9XG4gICAgICAvKiBEcmFnIGhhbmRsZSBvbiB0aGUgTEVGVCBlZGdlIG9mIHRoZSBvcGVuIHBhbmVsLiBXaWRlIGVub3VnaFxuICAgICAgICAgKDZweCkgdG8gYmUgZWFzeSB0byBncmFiIGJ1dCBpbnZpc2libGUgdW50aWwgaG92ZXJlZC4gV2hpbGVcbiAgICAgICAgIGRyYWdnaW5nIHRoZSB0b2dnbGUvdHJhbnNpdGlvbiBpcyBkaXNhYmxlZCBzbyByZXNpemluZyBmZWVsc1xuICAgICAgICAgY3Jpc3AuICovXG4gICAgICAucmVzaXplciB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgdG9wOiAwOyBsZWZ0OiAtM3B4O1xuICAgICAgICB3aWR0aDogNnB4OyBoZWlnaHQ6IDEwMCU7XG4gICAgICAgIGN1cnNvcjogZXctcmVzaXplO1xuICAgICAgICB6LWluZGV4OiAxO1xuICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICAgIH1cbiAgICAgIC5yZXNpemVyOmhvdmVyLCAucGFuZWwucmVzaXppbmcgLnJlc2l6ZXIge1xuICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsIHRyYW5zcGFyZW50LCAjMjU2M2ViMzMsIHRyYW5zcGFyZW50KTtcbiAgICAgIH1cbiAgICAgIC5wYW5lbC5yZXNpemluZyB7IHRyYW5zaXRpb246IG5vbmUgIWltcG9ydGFudDsgdXNlci1zZWxlY3Q6IG5vbmU7IH1cbiAgICAgIC5wYW5lbC5yZXNpemluZyBpZnJhbWUgeyBwb2ludGVyLWV2ZW50czogbm9uZTsgfSAvKiBzd2FsbG93IGRyYWcgaW5zaWRlIGlmcmFtZSAqL1xuICAgICAgLmhlYWRlciB7XG4gICAgICAgIHBhZGRpbmc6IDEwcHggMTRweDtcbiAgICAgICAgYmFja2dyb3VuZDogI2Y5ZmFmYjtcbiAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlNWU3ZWI7XG4gICAgICAgIGZvbnQ6IDYwMCAxM3B4IC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgc2Fucy1zZXJpZjtcbiAgICAgICAgY29sb3I6ICMxZTNhOGE7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgIH1cbiAgICAgIC5oZWFkZXItdGl0bGUge1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiA3cHg7XG4gICAgICB9XG4gICAgICAuaGVhZGVyLW1hcmsgeyB3aWR0aDogMTZweDsgaGVpZ2h0OiAxNnB4OyBmbGV4OiAwIDAgMTZweDsgfVxuICAgICAgLmhlYWRlciAuY2xvc2Uge1xuICAgICAgICBiYWNrZ3JvdW5kOiBub25lO1xuICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICAgICAgY29sb3I6ICM2YjcyODA7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgcGFkZGluZzogMCA0cHg7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgbWluLXdpZHRoOiAyNnB4O1xuICAgICAgICBoZWlnaHQ6IDI2cHg7XG4gICAgICB9XG4gICAgICAuaGVhZGVyIC5jbG9zZTpob3ZlciB7IGNvbG9yOiAjMWYyOTM3OyB9XG4gICAgICAuaGVhZGVyIC5jbG9zZSBzdmcgeyB3aWR0aDogMTZweDsgaGVpZ2h0OiAxNnB4OyB9XG4gICAgICBpZnJhbWUge1xuICAgICAgICBmbGV4OiAxO1xuICAgICAgICBib3JkZXI6IDA7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgICAgIH1cbiAgICAgIC5lbXB0eSB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBmbGV4OiAxO1xuICAgICAgICBjb2xvcjogIzljYTNhZjtcbiAgICAgICAgZm9udDogMTNweCAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIHNhbnMtc2VyaWY7XG4gICAgICAgIGdhcDogMTJweDtcbiAgICAgICAgcGFkZGluZzogMjBweDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgfVxuICAgICAgLmVtcHR5IGJ1dHRvbiB7XG4gICAgICAgIHBhZGRpbmc6IDhweCAxNnB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiAjMjU2M2ViO1xuICAgICAgICBjb2xvcjogd2hpdGU7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNnB4O1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgICAgIH1cbiAgICA8L3N0eWxlPlxuXG4gICAgPGJ1dHRvbiBjbGFzcz1cInRvZ2dsZVwiIGlkPVwidG9nZ2xlXCJcbiAgICAgICAgICAgIHRpdGxlPVwiXHU5RURFXHU2QjY0XHU5NThCXHU1NTVGIE5ISS1GSElSIEJyaWRnZSBcdTUyQTlcdTc0MDZcdTk3NjJcdTY3N0ZcIlxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIlx1OTU4Qlx1NTU1RiBOSEktRkhJUiBCcmlkZ2UgXHU1MkE5XHU3NDA2XHU5NzYyXHU2NzdGXCI+XG4gICAgICA8IS0tIFByaXNtIG1hcmsgXHUyMDE0IHNhbWUgc2hhcGUgYXMgbWVkaWNhbC1ub3RlJ3MgYXBwIGljb24sIHNvIHRoZVxuICAgICAgICAgICB0cmlnZ2VyIHZpc3VhbGx5IG1hdGNoZXMgdGhlIGFwcCBpdCBvcGVucy4gY3VycmVudENvbG9yXG4gICAgICAgICAgIGxldHMgdGhlIHdoaXRlIHN0cm9rZSBpbmhlcml0IGZyb20gLnRvZ2dsZSdzIGNvbG9yOiB3aGl0ZS4gLS0+XG4gICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjU2IDI1NlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgc3Ryb2tlLXdpZHRoPVwiMTRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAgPHBhdGggZD1cIk0gODAgODAgTCAxNzYgODBcIi8+XG4gICAgICAgIDxwYXRoIGQ9XCJNIDgwIDgwIEwgNDggMTc2XCIvPlxuICAgICAgICA8cGF0aCBkPVwiTSAxNzYgODAgTCAyMDggMTc2XCIvPlxuICAgICAgICA8cGF0aCBkPVwiTSA0OCAxNzYgTCAyMDggMTc2XCIvPlxuICAgICAgICA8cGF0aCBkPVwiTSA0OCAxNzYgTCAxMjggMjI0IEwgMjA4IDE3NlwiLz5cbiAgICAgICAgPHBhdGggZD1cIk0gODAgODAgTCAxMjggMTc2XCIvPlxuICAgICAgICA8cGF0aCBkPVwiTSAxNzYgODAgTCAxMjggMTc2XCIvPlxuICAgICAgICA8cGF0aCBkPVwiTSAxMjggMTc2IEwgMTI4IDIyNFwiLz5cbiAgICAgIDwvc3ZnPlxuICAgIDwvYnV0dG9uPlxuICAgIDxkaXYgY2xhc3M9XCJwYW5lbFwiIGlkPVwicGFuZWxcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJyZXNpemVyXCIgaWQ9XCJyZXNpemVyXCIgdGl0bGU9XCJcdTYyRDZcdTY2RjNcdThBQkZcdTY1NzRcdTVCRUNcdTVFQTZcIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJoZWFkZXItdGl0bGVcIj5cbiAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjU2IDI1NlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgIHN0cm9rZS13aWR0aD1cIjE2XCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGNsYXNzPVwiaGVhZGVyLW1hcmtcIj5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNIDgwIDgwIEwgMTc2IDgwXCIvPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0gODAgODAgTCA0OCAxNzZcIi8+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTSAxNzYgODAgTCAyMDggMTc2XCIvPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0gNDggMTc2IEwgMjA4IDE3NlwiLz5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNIDQ4IDE3NiBMIDEyOCAyMjQgTCAyMDggMTc2XCIvPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0gODAgODAgTCAxMjggMTc2XCIvPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0gMTc2IDgwIEwgMTI4IDE3NlwiLz5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNIDEyOCAxNzYgTCAxMjggMjI0XCIvPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgIE5ISS1GSElSIEJyaWRnZSBcdTUyQTlcdTc0MDZcbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8c3BhbiBzdHlsZT1cImRpc3BsYXk6ZmxleDtnYXA6NHB4XCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNsb3NlXCIgaWQ9XCJwb3BvdXRcIiB0aXRsZT1cIlx1NzlGQlx1NTIzMFx1NzM2OFx1N0FDQlx1ODk5Nlx1N0E5NyAocG9wLW91dClcIiBhcmlhLWxhYmVsPVwicG9wIG91dFwiPlxuICAgICAgICAgICAgPCEtLSBcImV4dGVybmFsIGxpbmsgLyBvcGVuIGluIG5ldyB3aW5kb3dcIiBpY29uLiBJbmxpbmUgU1ZHIHNvXG4gICAgICAgICAgICAgICAgIGl0IHJlbmRlcnMgdGhlIHNhbWUgb24gZXZlcnkgT1Mgd2l0aG91dCByZWx5aW5nIG9uIGVtb2ppXG4gICAgICAgICAgICAgICAgIGZvbnQgY292ZXJhZ2UuIC0tPlxuICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgICBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTQgNGg2djZcIi8+XG4gICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjAgNCAxMiAxMlwiLz5cbiAgICAgICAgICAgICAgPHBhdGggZD1cIk0xOSAxM3Y2YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0yVjdhMiAyIDAgMCAxIDItMmg2XCIvPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNsb3NlXCIgaWQ9XCJyZWxvYWRcIiB0aXRsZT1cIlx1NUYzN1x1NTIzNlx1OTFDRFx1NjVCMFx1OEYwOVx1NTE2NVx1NTJBOVx1NzQwNiAoXHU3RTVFIGNhY2hlKVwiXG4gICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiXHU1RjM3XHU1MjM2XHU5MUNEXHU2NUIwXHU4RjA5XHU1MTY1XHU1MkE5XHU3NDA2XCI+XG4gICAgICAgICAgICA8IS0tIGx1Y2lkZSBSb3RhdGVDdy4gUmVwbGFjZXMgdW5pY29kZSBcdUQ4M0RcdUREMDQgd2hpY2ggcmVuZGVycyB2ZXJ5XG4gICAgICAgICAgICAgICAgIGRpZmZlcmVudGx5IGFjcm9zcyBPU2VzIC8gZW1vamkgZm9udHMgKGVzcGVjaWFsbHkgV2luKS4gLS0+XG4gICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj5cbiAgICAgICAgICAgICAgPHBhdGggZD1cIk0yMSAxMmE5IDkgMCAxIDEtOS05YzIuNTIgMCA0LjkzIDEgNi43NCAyLjc0TDIxIDhcIi8+XG4gICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjEgM3Y1aC01XCIvPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNsb3NlXCIgaWQ9XCJjbG9zZVwiIHRpdGxlPVwiXHU2NTM2XHU4RDc3XCIgYXJpYS1sYWJlbD1cIlx1NjUzNlx1OEQ3N1wiPlxuICAgICAgICAgICAgPCEtLSBsdWNpZGUgWCBcdTIwMTQgbWF0Y2hlcyB0aGUgcmVzdCBvZiB0aGUgU1ZHIGljb24gZmFtaWx5IGluXG4gICAgICAgICAgICAgICAgIHRoaXMgaGVhZGVyIHNvIHRoZSB3aG9sZSByb3cgcmVhZHMgYXMgb25lIHRvb2xiYXIuIC0tPlxuICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgICBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgICAgICAgIDxsaW5lIHgxPVwiMThcIiB5MT1cIjZcIiB4Mj1cIjZcIiB5Mj1cIjE4XCIvPlxuICAgICAgICAgICAgICA8bGluZSB4MT1cIjZcIiB5MT1cIjZcIiB4Mj1cIjE4XCIgeTI9XCIxOFwiLz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJlbXB0eVwiIGlkPVwiZW1wdHlcIj5cbiAgICAgICAgPGRpdj5cdTdCMkNcdTRFMDBcdTZCMjFcdTRGN0ZcdTc1MjggXHUyMDE0IFx1OUVERVx1NEUwQlx1NjVCOVx1OEYwOVx1NTE2NSBtZWRpY2FsLW5vdGUgXHU1MkE5XHU3NDA2PC9kaXY+XG4gICAgICAgIDxidXR0b24gaWQ9XCJsb2FkXCI+XHU4RjA5XHU1MTY1XHU1MkE5XHU3NDA2ICh+M3MpPC9idXR0b24+XG4gICAgICAgIDxkaXYgc3R5bGU9XCJmb250LXNpemU6MTFweDtjb2xvcjojOWNhM2FmO21hcmdpbi10b3A6OHB4XCI+XG4gICAgICAgICAgXHU4RjA5XHU1MTY1XHU1RjhDXHU1M0VGXHU0RkREXHU2MzAxXHU5NThCXHU1NTVGXHVGRjFCXHU1MjA3XHU1MjMwXHU1MTc2XHU0RUQ2XHU3NUM1XHU0RUJBXHU2NjQyXHU3NTI4XHU1REU2XHU0RTBBXHU3Njg0IHBhdGllbnQgcGlja2VyIFx1NTIwN1x1NjNEQlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgO1xuXG4gIGNvbnN0IHBhbmVsID0gcm9vdC5nZXRFbGVtZW50QnlJZChcInBhbmVsXCIpO1xuICBjb25zdCB0b2dnbGVCdG4gPSByb290LmdldEVsZW1lbnRCeUlkKFwidG9nZ2xlXCIpO1xuICBjb25zdCBjbG9zZUJ0biA9IHJvb3QuZ2V0RWxlbWVudEJ5SWQoXCJjbG9zZVwiKTtcbiAgY29uc3QgbG9hZEJ0biA9IHJvb3QuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkXCIpO1xuICBjb25zdCBlbXB0eUJveCA9IHJvb3QuZ2V0RWxlbWVudEJ5SWQoXCJlbXB0eVwiKTtcbiAgY29uc3QgcmVzaXplciA9IHJvb3QuZ2V0RWxlbWVudEJ5SWQoXCJyZXNpemVyXCIpO1xuICBjb25zdCBwb3BvdXRCdG4gPSByb290LmdldEVsZW1lbnRCeUlkKFwicG9wb3V0XCIpO1xuXG4gIC8vIFx1MjUwMFx1MjUwMCBXaWR0aCBwZXJzaXN0ZW5jZSArIGRyYWctdG8tcmVzaXplIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBUaGUgcGFuZWwncyB3aWR0aCBpcyByZXN0b3JlZCBmcm9tIHN0b3JhZ2UgYW5kIHRoZSBDU1MgcnVsZSB0aGF0XG4gIC8vIGhpZGVzIHRoZSBwYW5lbCBvZmYtc2NyZWVuIChcInJpZ2h0OiAtPHdpZHRoKzMwPnB4XCIpIGlzIHJld3JpdHRlbiBpblxuICAvLyBzeW5jLiBXZSBjYW4ndCB0b3VjaCB0aGUgb3JpZ2luYWwgPHN0eWxlPiBydWxlLCBzbyB3ZSBvdmVycmlkZSB2aWFcbiAgLy8gYW4gaW5saW5lIGByaWdodGAgc3R5bGUgd2hlbiB0aGUgcGFuZWwgaXMgY2xvc2VkLlxuICBsZXQgY3VycmVudFdpZHRoID0gU0lERUJBUl9ERUZBVUxUX1dJRFRIO1xuICBmdW5jdGlvbiBhcHBseVdpZHRoKHB4KSB7XG4gICAgY3VycmVudFdpZHRoID0gTWF0aC5tYXgoU0lERUJBUl9NSU5fV0lEVEgsIE1hdGgubWluKFNJREVCQVJfTUFYX1dJRFRILCBNYXRoLnJvdW5kKHB4KSkpO1xuICAgIHBhbmVsLnN0eWxlLndpZHRoID0gYCR7Y3VycmVudFdpZHRofXB4YDtcbiAgICAvLyBLZWVwIHRoZSBvZmYtc2NyZWVuIG9mZnNldCBpbiBzeW5jIChzbGlnaHRseSBtb3JlIHRoYW4gd2lkdGggc29cbiAgICAvLyB0aGUgYm94LXNoYWRvdyBpcyBoaWRkZW4gdG9vKS5cbiAgICBpZiAoIXBhbmVsLmNsYXNzTGlzdC5jb250YWlucyhcIm9wZW5cIikpIHtcbiAgICAgIHBhbmVsLnN0eWxlLnJpZ2h0ID0gYC0ke2N1cnJlbnRXaWR0aCArIDMwfXB4YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFuZWwuc3R5bGUucmlnaHQgPSBcIjBcIjtcbiAgICB9XG4gICAgLy8gTW92ZSB0aGUgdG9nZ2xlIGhhbmRsZSB0byBzaXQgZmx1c2ggd2l0aCB0aGUgb3BlbiBwYW5lbCdzIGxlZnQgZWRnZS5cbiAgICB0b2dnbGVCdG4uc3R5bGUucmlnaHQgPSBwYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoXCJvcGVuXCIpID8gYCR7Y3VycmVudFdpZHRofXB4YCA6IFwiMFwiO1xuICB9XG4gIC8vIEluaXRpYWw6IHJlc3RvcmUgbGFzdC11c2VkIHdpZHRoLlxuICBpZiAoaXNDb250ZXh0QWxpdmUoKSkge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChXSURUSF9LRVkpLnRoZW4oKGQpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgZFtXSURUSF9LRVldID09PSBcIm51bWJlclwiKSBhcHBseVdpZHRoKGRbV0lEVEhfS0VZXSk7XG4gICAgfSkuY2F0Y2goKCkgPT4ge30pO1xuICB9XG4gIC8vIERyYWc6IHRyYWNrIGRlbHRhIHZzLiBzdGFydGluZyBtb3VzZVgsIHJlY29tcHV0ZSB3aWR0aCBvbiBlYWNoIG1vdmUuXG4gIGxldCBkcmFnU3RhcnRYID0gMCwgZHJhZ1N0YXJ0VyA9IDA7XG4gIGZ1bmN0aW9uIG9uRHJhZ01vdmUoZSkge1xuICAgIC8vIFJlc2l6ZXIgaXMgb24gdGhlIExFRlQgZWRnZSBcdTIwMTQgZHJhZ2dpbmcgbGVmdCBncm93cyB0aGUgcGFuZWwuXG4gICAgY29uc3QgZGVsdGEgPSBkcmFnU3RhcnRYIC0gZS5jbGllbnRYO1xuICAgIGFwcGx5V2lkdGgoZHJhZ1N0YXJ0VyArIGRlbHRhKTtcbiAgfVxuICBmdW5jdGlvbiBvbkRyYWdFbmQoKSB7XG4gICAgcGFuZWwuY2xhc3NMaXN0LnJlbW92ZShcInJlc2l6aW5nXCIpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb2ludGVybW92ZVwiLCBvbkRyYWdNb3ZlKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIG9uRHJhZ0VuZCk7XG4gICAgaWYgKGlzQ29udGV4dEFsaXZlKCkpIHtcbiAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IFtXSURUSF9LRVldOiBjdXJyZW50V2lkdGggfSkuY2F0Y2goKCkgPT4ge30pO1xuICAgIH1cbiAgfVxuICByZXNpemVyLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyZG93blwiLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBkcmFnU3RhcnRYID0gZS5jbGllbnRYO1xuICAgIGRyYWdTdGFydFcgPSBjdXJyZW50V2lkdGg7XG4gICAgcGFuZWwuY2xhc3NMaXN0LmFkZChcInJlc2l6aW5nXCIpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVybW92ZVwiLCBvbkRyYWdNb3ZlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIG9uRHJhZ0VuZCk7XG4gIH0pO1xuXG4gIC8vIFx1MjUwMFx1MjUwMCBQb3Atb3V0IHRvIHN0YW5kYWxvbmUgd2luZG93IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBPcGVucyB0aGUgc2FtZSBpZnJhbWUgVVJMIGluIGEgZnJlc2ggd2luZG93IHNvIHRoZSB1c2VyIGNhbiBtb3ZlIGl0XG4gIC8vIHRvIGEgc2Vjb25kIG1vbml0b3IgLyByZXNpemUgZnJlZWx5LiBTaWRlYmFyIGF1dG8tY29sbGFwc2VzIGFmdGVyLFxuICAvLyBzaW5jZSBib3RoIHNob3dpbmcgaXQgc2lkZS1ieS1zaWRlIHdvdWxkIGJlIGNvbmZ1c2luZy5cbiAgbGV0IHBvcG91dFdpbiA9IG51bGw7XG4gIGFzeW5jIGZ1bmN0aW9uIHBvcE91dCgpIHtcbiAgICBsZXQgdXJsO1xuICAgIHRyeSB7IHVybCA9IGF3YWl0IGJ1aWxkSWZyYW1lVXJsKCk7IH1cbiAgICBjYXRjaCAoZXJyKSB7IGNvbnNvbGUud2FybihcIltuaGktZmhpciBzaWRlYmFyXSBwb3BPdXQ6XCIsIGVyci5tZXNzYWdlKTsgcmV0dXJuOyB9XG4gICAgLy8gSWYgd2UgYWxyZWFkeSBoYXZlIGFuIG9wZW4gcG9wdXAsIHJldXNlIGl0IChyYWlzZXMgdGhlIGV4aXN0aW5nXG4gICAgLy8gd2luZG93KS4gVGhlIDJuZCB3aW5kb3cub3BlbiBjYWxsIHdpdGggdGhlIHNhbWUgbmFtZSByZWxvYWRzIGl0LlxuICAgIHBvcG91dFdpbiA9IHdpbmRvdy5vcGVuKHVybCwgXCJuaGktZmhpci1icmlkZ2UtYXNzaXN0YW50XCIsXG4gICAgICBgd2lkdGg9JHtjdXJyZW50V2lkdGh9LGhlaWdodD05MDAscmVzaXphYmxlPXllcyxzY3JvbGxiYXJzPXllc2ApO1xuICAgIGlmIChwb3BvdXRXaW4pIHtcbiAgICAgIHBvcG91dFdpbi5mb2N1cygpO1xuICAgICAgLy8gQ29sbGFwc2UgdGhlIHNpZGViYXIgc28gdGhlIHVzZXIgaXNuJ3Qgc3RhcmluZyBhdCB0aGUgc2FtZSBhcHBcbiAgICAgIC8vIGluIHR3byBwbGFjZXMuXG4gICAgICBzZXRPcGVuKGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICAvLyBCdWlsZCB0aGUgaWZyYW1lIFVSTC4gV2hlbiB3ZSBoYXZlIGEgcGF0aWVudF9pZCArIGEgd29ya2luZyBiYWNrZW5kXG4gIC8vIHdlIGhhbmQgdGhlIGFwcCBhIFNNQVJUIEVIUi1MYXVuY2ggY29udGV4dCBzbyBpdCBhdXRvLWxvYWRzIE9VUlxuICAvLyBsb2NhbCBGSElSIHN0b3JlLiBPdGhlcndpc2UganVzdCBvcGVuIHRoZSBhcHAgaG9tZSAoaXQnbGwgc2hvdyBpdHNcbiAgLy8gZGVmYXVsdCBsYW5kaW5nIC8gYSBwdWJsaWMgdGVzdCBzZXJ2ZXIpLlxuICAvLyBEZXRlY3Qgb3JwaGFuZWQgY29udGVudCBzY3JpcHQ6IGFmdGVyIHRoZSB1c2VyIHJlbG9hZHMgdGhlIGV4dGVuc2lvblxuICAvLyBmcm9tIGNocm9tZTovL2V4dGVuc2lvbnMsIHRoaXMgc2NyaXB0J3MgY2hyb21lLnJ1bnRpbWUuaWQgbGluayBnb2VzXG4gIC8vIG51bGwgYW5kIGFueSBjaHJvbWUuKiBjYWxsIHRocm93cyBcIkV4dGVuc2lvbiBjb250ZXh0IGludmFsaWRhdGVkXCIuXG4gIC8vIFRoZSBmaXggaXMgYWx3YXlzIGEgcGFnZSByZWZyZXNoIFx1MjAxNCB3ZSBqdXN0IHN1cmZhY2UgYSBjbGVhcmVyIGVycm9yLlxuICBmdW5jdGlvbiBpc0NvbnRleHRBbGl2ZSgpIHtcbiAgICB0cnkgeyByZXR1cm4gISFjaHJvbWUucnVudGltZT8uaWQ7IH0gY2F0Y2ggeyByZXR1cm4gZmFsc2U7IH1cbiAgfVxuXG4gIC8vIERlZmF1bHQgdG8gdGhlIGRlcGxveWVkIGdpdGh1Yi5pbyBidWlsZCBcdTIwMTQgc2VlIEFQUF9CQVNFX0RFUExPWUVEXG4gIC8vIGNvbW1lbnQgYWJvdmUgZm9yIHRoZSBQTkEgdHJhZGUtb2ZmLiBVc2VycyB3aG8gbmVlZCBQTkEtZnJlZVxuICAvLyBjYWxscyBpbnRvIGEgbG9jYWwgYmFja2VuZCBjYW4gc3Rhc2ggc2lkZWJhckFwcEJhc2UgPSBBUFBfQkFTRV9MT0NBTFxuICAvLyB2aWEgRGV2VG9vbHMgdG8gZmxpcDsgdGhlIGNvbnRlbnQgc2NyaXB0IGNhbid0IHByb2JlIGxvY2FsaG9zdFxuICAvLyBmcm9tIHRoZSBOSEkgb3JpZ2luIChQTkEgYWdhaW4pIHNvIHdlIGRvbid0IGF1dG8tZGV0ZWN0LlxuICBhc3luYyBmdW5jdGlvbiBwaWNrQXBwQmFzZSgpIHtcbiAgICBjb25zdCB7IHNpZGViYXJBcHBCYXNlIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJzaWRlYmFyQXBwQmFzZVwiKS5jYXRjaCgoKSA9PiAoe30pKTtcbiAgICByZXR1cm4gc2lkZWJhckFwcEJhc2UgfHwgQVBQX0JBU0VfREVQTE9ZRUQ7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBidWlsZElmcmFtZVVybCgpIHtcbiAgICBjb25zdCBjYWNoZUJ1c3QgPSBgXz0ke0RhdGUubm93KCl9YDtcbiAgICBpZiAoIWlzQ29udGV4dEFsaXZlKCkpIHtcbiAgICAgIC8vIENocm9tZSBpbnZhbGlkYXRlcyBhIGNvbnRlbnQgc2NyaXB0J3MgY2hyb21lLiogQVBJcyB0aGUgbW9tZW50XG4gICAgICAvLyB0aGUgZXh0ZW5zaW9uIGl0c2VsZiBpcyB1cGRhdGVkIC8gcmVsb2FkZWQuIFRoZSBzY3JpcHQga2VlcHNcbiAgICAgIC8vIHJ1bm5pbmcgb24gdGhlIHBhZ2UgYnV0IGNhbiBubyBsb25nZXIgdGFsayB0byBzdG9yYWdlIC8gU1cgXHUyMDE0XG4gICAgICAvLyB1c2VyIGhhcyB0byBGNSB0aGUgTkhJIHRhYiBzbyBhIGZyZXNoIGNvcHkgb2Ygc2lkZWJhci5qcyBnZXRzXG4gICAgICAvLyBpbmplY3RlZC4gUGhyYXNlIHRoaXMgd2l0aG91dCBqYXJnb24uXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiXHU2NEY0XHU1MTQ1XHU1MjlGXHU4MEZEXHU1MjVCXHU2NkY0XHU2NUIwXHU5MDRFXHVGRjBDXHU4QUNCXHU2MzA5IEY1IFx1OTFDRFx1NjVCMFx1NjU3NFx1NzQwNlx1OTAxOVx1NTAwQlx1OTgwMVx1OTc2Mlx1NUMzMVx1ODBGRFx1NjA2Mlx1NUZBOVx1NTJBOVx1NzQwNlx1OTc2Mlx1Njc3Rlx1MzAwMlxcblwiICtcbiAgICAgICAgXCIoRXh0ZW5zaW9uIHdhcyBqdXN0IHVwZGF0ZWQgXHUyMDE0IHByZXNzIEY1IG9uIHRoaXMgcGFnZSB0byByZWxvYWQgdGhlIHNpZGViYXIuKVwiLFxuICAgICAgKTtcbiAgICB9XG4gICAgY29uc3QgeyBwYXRpZW50T3ZlcnJpZGUsIGJhY2tlbmRVcmwgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXG4gICAgICBcInBhdGllbnRPdmVycmlkZVwiLCBcImJhY2tlbmRVcmxcIixcbiAgICBdKS5jYXRjaCgoKSA9PiAoe30pKTtcbiAgICBjb25zdCBiYWNrZW5kID0gKGJhY2tlbmRVcmwgfHwgREVGQVVMVF9CQUNLRU5EKS5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG4gICAgY29uc3QgcGF0aWVudElkID0gcGF0aWVudE92ZXJyaWRlPy5pZF9ubztcbiAgICBjb25zdCBhcHBCYXNlID0gYXdhaXQgcGlja0FwcEJhc2UoKTtcbiAgICBjb25zdCBhcHBIb21lID0gYCR7YXBwQmFzZX0vYDtcbiAgICBpZiAoIXBhdGllbnRJZCkge1xuICAgICAgLy8gTm8gcGF0aWVudCBjb250ZXh0IHlldCBcdTIwMTQgbG9hZCB0aGUgYXBwIGJhcmU7IHVzZXIgY2FuIGZpbGwgdGhlXG4gICAgICAvLyBwb3B1cCdzIFx1RDgzRVx1REVBQSBhcmVhIGFuZCBjbGljayBcdUQ4M0RcdUREMDQgdG8gcmVsYXVuY2ggd2l0aCBjb250ZXh0LlxuICAgICAgcmV0dXJuIGAke2FwcEhvbWV9PyR7Y2FjaGVCdXN0fWA7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goYCR7YmFja2VuZH0vc21hcnQvbGF1bmNoLWNvbnRleHRgLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBwYXRpZW50X2lkOiBwYXRpZW50SWQgfSksXG4gICAgICB9KTtcbiAgICAgIGlmICghci5vaykgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7ci5zdGF0dXN9YCk7XG4gICAgICBjb25zdCB7IGxhdW5jaCB9ID0gYXdhaXQgci5qc29uKCk7XG4gICAgICBjb25zdCBpc3MgPSBgJHtiYWNrZW5kfS9maGlyYDtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoeyBpc3MsIGxhdW5jaCB9KTtcbiAgICAgIHJldHVybiBgJHthcHBCYXNlfSR7QVBQX0xBVU5DSF9QQVRIfT8ke3BhcmFtcy50b1N0cmluZygpfSYke2NhY2hlQnVzdH1gO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS53YXJuKFwiW25oaS1maGlyIHNpZGViYXJdIGxhdW5jaC1jb250ZXh0IGZhaWxlZCwgZmFsbGluZyBiYWNrIHRvIGJhcmUgYXBwOlwiLCBlcnIpO1xuICAgICAgcmV0dXJuIGAke2FwcEhvbWV9PyR7Y2FjaGVCdXN0fWA7XG4gICAgfVxuICB9XG5cbiAgbGV0IGlmcmFtZUVsID0gbnVsbDtcbiAgYXN5bmMgZnVuY3Rpb24gbG9hZElmcmFtZSgpIHtcbiAgICBpZiAoaWZyYW1lRWwpIHJldHVybjtcbiAgICBsZXQgc3JjO1xuICAgIHRyeSB7IHNyYyA9IGF3YWl0IGJ1aWxkSWZyYW1lVXJsKCk7IH1cbiAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBVc2UgdGV4dENvbnRlbnQgKyB3aGl0ZS1zcGFjZTpwcmUtbGluZSBzbyBtdWx0aS1saW5lIGJpbGluZ3VhbFxuICAgICAgLy8gbWVzc2FnZXMgZnJvbSBidWlsZElmcmFtZVVybCByZW5kZXIgd2l0aCB0aGVpciBsaW5lIGJyZWFrc1xuICAgICAgLy8gaW50YWN0IChhbmQgd2UgZG9uJ3QgaGF2ZSB0byB3b3JyeSBhYm91dCBIVE1MIGVzY2FwaW5nKS5cbiAgICAgIGVtcHR5Qm94LnRleHRDb250ZW50ID0gXCJcIjtcbiAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBkaXYuc3R5bGUuY3NzVGV4dCA9IFwiY29sb3I6I2I5MWMxYzsgd2hpdGUtc3BhY2U6cHJlLWxpbmU7IGxpbmUtaGVpZ2h0OjEuNlwiO1xuICAgICAgZGl2LnRleHRDb250ZW50ID0gYFx1MjZBMCAke2Vyci5tZXNzYWdlfWA7XG4gICAgICBlbXB0eUJveC5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZnJhbWVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7XG4gICAgaWZyYW1lRWwudGl0bGUgPSBcIk1lZGljYWwgTm90ZSBTTUFSVCBvbiBGSElSXCI7XG4gICAgaWZyYW1lRWwuYWxsb3cgPSBcImNsaXBib2FyZC1yZWFkOyBjbGlwYm9hcmQtd3JpdGVcIjtcbiAgICBlbXB0eUJveC5yZW1vdmUoKTtcbiAgICBwYW5lbC5hcHBlbmRDaGlsZChpZnJhbWVFbCk7XG4gICAgaWZyYW1lRWwuc3JjID0gc3JjO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gcmVsb2FkSWZyYW1lKCkge1xuICAgIGlmICghaWZyYW1lRWwpIHsgYXdhaXQgbG9hZElmcmFtZSgpOyByZXR1cm47IH1cbiAgICB0cnkgeyBpZnJhbWVFbC5zcmMgPSBhd2FpdCBidWlsZElmcmFtZVVybCgpOyB9XG4gICAgY2F0Y2ggKGVycikgeyBjb25zb2xlLndhcm4oXCJbbmhpLWZoaXIgc2lkZWJhcl1cIiwgZXJyLm1lc3NhZ2UpOyB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRPcGVuKG9wZW4pIHtcbiAgICBwYW5lbC5jbGFzc0xpc3QudG9nZ2xlKFwib3BlblwiLCBvcGVuKTtcbiAgICAvLyBTeW5jIGlubGluZSByaWdodC90b2dnbGUgcG9zaXRpb24gd2l0aCB0aGUgb3BlbiBzdGF0ZSwgdXNpbmcgdGhlXG4gICAgLy8gKmN1cnJlbnQqIHdpZHRoICh3aGljaCBtYXkgaGF2ZSBiZWVuIHVzZXItcmVzaXplZCkuXG4gICAgYXBwbHlXaWR0aChjdXJyZW50V2lkdGgpO1xuICAgIGlmIChvcGVuKSBsb2FkSWZyYW1lKCkuY2F0Y2goKCkgPT4ge30pO1xuICAgIGlmIChpc0NvbnRleHRBbGl2ZSgpKSB7XG4gICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBbU1RPUkFHRV9LRVldOiBvcGVuIH0pLmNhdGNoKCgpID0+IHt9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCByZWxvYWRCdG4gPSByb290LmdldEVsZW1lbnRCeUlkKFwicmVsb2FkXCIpO1xuICB0b2dnbGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBzZXRPcGVuKCFwYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoXCJvcGVuXCIpKTtcbiAgfSk7XG4gIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBzZXRPcGVuKGZhbHNlKSk7XG4gIGxvYWRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGxvYWRJZnJhbWUoKSk7XG4gIHJlbG9hZEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gcmVsb2FkSWZyYW1lKCkpO1xuICBwb3BvdXRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHBvcE91dCgpKTtcblxuICAvLyBSZXN0b3JlIHByZXZpb3VzIG9wZW4vY2xvc2VkIHN0YXRlIG9uIHRoaXMgb3JpZ2luLlxuICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoU1RPUkFHRV9LRVkpLnRoZW4oKGQpID0+IHtcbiAgICBpZiAoZFtTVE9SQUdFX0tFWV0pIHNldE9wZW4odHJ1ZSk7XG4gIH0pLmNhdGNoKCgpID0+IHt9KTtcblxuICAvLyBcdTI1MDBcdTI1MDAgU3luYy1ydW5uaW5nIGlmcmFtZSBwYXVzZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gV2hpbGUgdGhlIGV4dGVuc2lvbidzIHJ1bk5oaUFwaVN5bmMgaXMgaW4gZmxpZ2h0LCB0aGUgbWVkaWNhbC1ub3RlXG4gIC8vIGlmcmFtZSBjb21wZXRlcyB3aXRoIG91ciBOSEkgZmFuLW91dCBmZXRjaGVzIGZvciB0aGUgdGFiJ3MgbmV0d29ya1xuICAvLyArIEpTIHRocmVhZCAod2Ugc2F3IE5ISSBmYW4tb3V0IHRpbWUgcm91Z2hseSB0cmlwbGUgd2hlbiB0aGlzIGlmcmFtZVxuICAvLyB3YXMgYWN0aXZlKS4gU3Rhc2ggdGhlIGlmcmFtZSdzIHNyYyBpbnRvIGFib3V0OmJsYW5rIGR1cmluZyBzeW5jIHNvXG4gIC8vIGl0cyBPQXV0aCArIEZISVIgY2FsbHMgc3RvcCBoYW1tZXJpbmcgdGhlIG5ldHdvcmsuIFJlc3VtZSBieVxuICAvLyByZS1sb2FkaW5nIGZyb20gdGhlIHNhdmVkIHNyYyB3aGVuIHN5bmMgZmluaXNoZXMuXG4gIGxldCBfcGF1c2VkU3JjID0gbnVsbDtcbiAgZnVuY3Rpb24gcGF1c2VJZnJhbWUoKSB7XG4gICAgaWYgKCFpZnJhbWVFbCB8fCBfcGF1c2VkU3JjICE9PSBudWxsKSByZXR1cm47XG4gICAgX3BhdXNlZFNyYyA9IGlmcmFtZUVsLnNyYztcbiAgICBpZnJhbWVFbC5zcmMgPSBcImFib3V0OmJsYW5rXCI7XG4gIH1cbiAgZnVuY3Rpb24gcmVzdW1lSWZyYW1lKCkge1xuICAgIGlmICghaWZyYW1lRWwgfHwgX3BhdXNlZFNyYyA9PT0gbnVsbCkgcmV0dXJuO1xuICAgIGlmcmFtZUVsLnNyYyA9IF9wYXVzZWRTcmM7XG4gICAgX3BhdXNlZFNyYyA9IG51bGw7XG4gIH1cbiAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwic3luY1J1bm5pbmdcIikudGhlbigoZCkgPT4ge1xuICAgIGlmIChkLnN5bmNSdW5uaW5nKSBwYXVzZUlmcmFtZSgpO1xuICB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gIGNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlcywgYXJlYSkgPT4ge1xuICAgIGlmIChhcmVhICE9PSBcImxvY2FsXCIgfHwgIShcInN5bmNSdW5uaW5nXCIgaW4gY2hhbmdlcykpIHJldHVybjtcbiAgICBpZiAoY2hhbmdlcy5zeW5jUnVubmluZy5uZXdWYWx1ZSkgcGF1c2VJZnJhbWUoKTtcbiAgICBlbHNlIHJlc3VtZUlmcmFtZSgpO1xuICB9KTtcbn0pKCk7XG4iXSwKICAibWFwcGluZ3MiOiAiOztBQWlCQSxHQUFDLE1BQU07QUFRTCxVQUFNLGVBQWUsU0FBUyxlQUFlLHVCQUF1QjtBQUNwRSxRQUFJO0FBQWMsbUJBQWEsT0FBTztBQUV0QyxVQUFNLHdCQUF3QjtBQUM5QixVQUFNLG9CQUFvQjtBQUMxQixVQUFNLG9CQUFvQjtBQUMxQixVQUFNLGNBQWM7QUFDcEIsVUFBTSxZQUFZO0FBR2xCLFVBQU0sa0JBQWtCO0FBY3hCLFVBQU0sb0JBQW9CO0FBQzFCLFVBQU0saUJBQWlCO0FBQ3ZCLFVBQU0sa0JBQWtCO0FBR3hCLFVBQU0sT0FBTyxTQUFTLGNBQWMsS0FBSztBQUN6QyxTQUFLLEtBQUs7QUFHVixTQUFLLE1BQU0sVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFTckIsYUFBUyxnQkFBZ0IsWUFBWSxJQUFJO0FBZXpDLG1CQUFlLHVCQUF1QjtBQUNwQyxVQUFJO0FBQ0YsY0FBTSxFQUFFLFVBQVUsZUFBZSxJQUFJLE1BQU0sT0FBTyxRQUFRLE1BQU0sSUFBSTtBQUFBLFVBQ2xFO0FBQUEsVUFBWTtBQUFBLFFBQ2QsQ0FBQztBQUNELGNBQU0sVUFBVSxtQkFBbUIsU0FBUyxhQUFhO0FBQ3pELGFBQUssTUFBTSxVQUFVLFVBQVUsS0FBSztBQUFBLE1BQ3RDLFFBQVE7QUFDTixhQUFLLE1BQU0sVUFBVTtBQUFBLE1BQ3ZCO0FBQUEsSUFDRjtBQUNBLHlCQUFxQjtBQUNyQixXQUFPLFFBQVEsVUFBVSxZQUFZLENBQUMsU0FBUyxTQUFTO0FBQ3RELFVBQUksU0FBUztBQUFTO0FBQ3RCLFVBQUksY0FBYyxXQUFXLG9CQUFvQixTQUFTO0FBQ3hELDZCQUFxQjtBQUFBLE1BQ3ZCO0FBQUEsSUFDRixDQUFDO0FBRUQsVUFBTSxPQUFPLEtBQUssYUFBYSxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQy9DLFNBQUssWUFBWTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxrQkFtREQsd0JBQXdCLEVBQUU7QUFBQTtBQUFBLGlCQUUzQixxQkFBcUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXdLcEMsVUFBTSxRQUFRLEtBQUssZUFBZSxPQUFPO0FBQ3pDLFVBQU0sWUFBWSxLQUFLLGVBQWUsUUFBUTtBQUM5QyxVQUFNLFdBQVcsS0FBSyxlQUFlLE9BQU87QUFDNUMsVUFBTSxVQUFVLEtBQUssZUFBZSxNQUFNO0FBQzFDLFVBQU0sV0FBVyxLQUFLLGVBQWUsT0FBTztBQUM1QyxVQUFNLFVBQVUsS0FBSyxlQUFlLFNBQVM7QUFDN0MsVUFBTSxZQUFZLEtBQUssZUFBZSxRQUFRO0FBTzlDLFFBQUksZUFBZTtBQUNuQixhQUFTLFdBQVcsSUFBSTtBQUN0QixxQkFBZSxLQUFLLElB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
