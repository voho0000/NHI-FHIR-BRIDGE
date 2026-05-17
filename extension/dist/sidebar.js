(() => {
  // src/sidebar.js
  (() => {
    const previousHost = document.getElementById("nhi-fhir-sidebar-host");
    if (previousHost) previousHost.remove();
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
        const { syncMode, sidebarEnabled } = await chrome.storage.sync.get([
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
      if (area !== "sync") return;
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
        height: 80px;
        background: #1e3a8a;
        color: white;
        border: none;
        border-radius: 8px 0 0 8px;
        cursor: pointer;
        font-size: 18px;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        box-shadow: -2px 2px 8px rgba(0,0,0,0.15);
        pointer-events: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        writing-mode: vertical-rl;
        text-orientation: mixed;
        transition: right 0.2s ease;
      }
      .toggle:hover { background: #1e40af; }
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

    <button class="toggle" id="toggle" title="NHI-FHIR Bridge \u52A9\u7406\u9762\u677F">\u{1F4CB} \u52A9\u7406</button>
    <div class="panel" id="panel">
      <div class="resizer" id="resizer" title="\u62D6\u66F3\u8ABF\u6574\u5BEC\u5EA6"></div>
      <div class="header">
        <span>\u{1F3E5} NHI-FHIR Bridge \u52A9\u7406</span>
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
          <button class="close" id="reload" title="\u5F37\u5236\u91CD\u65B0\u8F09\u5165\u52A9\u7406 (\u7E5E cache)">\u{1F504}</button>
          <button class="close" id="close" title="\u6536\u8D77">\u2715</button>
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
        if (typeof d[WIDTH_KEY] === "number") applyWidth(d[WIDTH_KEY]);
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
      const { sidebarAppBase } = await chrome.storage.sync.get("sidebarAppBase").catch(() => ({}));
      return sidebarAppBase || APP_BASE_LOCAL;
    }
    async function buildIframeUrl() {
      const cacheBust = `_=${Date.now()}`;
      if (!isContextAlive()) {
        throw new Error(
          "\u64F4\u5145\u529F\u80FD\u525B\u66F4\u65B0\u904E\uFF0C\u8ACB\u6309 F5 \u91CD\u65B0\u6574\u7406\u9019\u500B\u9801\u9762\u5C31\u80FD\u6062\u5FA9\u52A9\u7406\u9762\u677F\u3002\n(Extension was just updated \u2014 press F5 on this page to reload the sidebar.)"
        );
      }
      const { patientOverride, backendUrl } = await chrome.storage.sync.get([
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
      if (open) loadIframe().catch(() => {
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
      if (d[STORAGE_KEY]) setOpen(true);
    }).catch(() => {
    });
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
    }).catch(() => {
    });
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "local" || !("syncRunning" in changes)) return;
      if (changes.syncRunning.newValue) pauseIframe();
      else resumeIframe();
    });
  })();
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3NpZGViYXIuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIE5ISS1GSElSIEJyaWRnZSBcdTIwMTQgY29sbGFwc2libGUgcmlnaHQtc2lkZSBwYW5lbCBpbmplY3RlZCBpbnRvIEhJUyBwYWdlcy5cbi8vXG4vLyBHb2FscyBvZiB0aGlzIFBvQzpcbi8vIDEuIFByb3ZlIHdlIGNhbiByZW5kZXIgYW4gaWZyYW1lIG9mIHRoZSBtZWRpY2FsLW5vdGUgU01BUlQgYXBwIGluc2lkZVxuLy8gICAgdGhlIE5ISSBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0EgcGFnZSB3aXRob3V0IENTUCAvIFgtRnJhbWUtT3B0aW9ucyBpc3N1ZXMuXG4vLyAyLiBLZWVwIHRoZSBzaWRlYmFyIGlzb2xhdGVkIGZyb20gdGhlIGhvc3QgcGFnZSdzIENTUyB2aWEgU2hhZG93IERPTVxuLy8gICAgc28gSElTLXNwZWNpZmljIHN0eWxlcyBjYW4ndCBibGVlZCBpbiBhbmQgYnJlYWsgbGF5b3V0LlxuLy8gMy4gR2l2ZSBhIHNpbmdsZSB0b2dnbGUgYnV0dG9uIChcdUQ4M0RcdURDQ0IpIGF0IHRoZSByaWdodCBlZGdlIHRoYXQgc2xpZGVzIHRoZVxuLy8gICAgcGFuZWwgaW4vb3V0LiBTdGF0ZSBwZXJzaXN0cyBhY3Jvc3MgbmF2aWdhdGlvbnMgb24gdGhlIHNhbWUgb3JpZ2luXG4vLyAgICB2aWEgY2hyb21lLnN0b3JhZ2UubG9jYWwuXG4vL1xuLy8gTm90IGluIHNjb3BlIGhlcmU6XG4vLyAtIHBvc3RNZXNzYWdlIGJyaWRnZSBmcm9tIHRoZSBpZnJhbWUgdG8gdGhlIFNXIChkYXRlLXJhbmdlIHRvb2wgY2FsbHMpLlxuLy8gICBUaGF0IGNvbWVzIG9uY2Ugd2UgY29uZmlybSB0aGUgYmFzaWMgZW1iZWQgcmVuZGVycy5cbi8vIC0gUGVyLUhJUyBhdXRoIGhhbmRvZmYgKEZISVIgbGF1bmNoIHRva2VuLCBldGMuKS5cblxuKCgpID0+IHtcbiAgLy8gUmUtaW5qZWN0aW9uIChlLmcuIGJhY2tncm91bmQuanMgY2FsbGluZyBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHRcbiAgLy8gYWZ0ZXIgYW4gZXh0ZW5zaW9uIHVwZGF0ZSkgbWVhbnMgdGhlIHNjcmlwdCBydW5zIGFnYWluIG9uIGEgcGFnZSB0aGF0XG4gIC8vIGFscmVhZHkgaGFzIGEgaG9zdCBlbGVtZW50IGZyb20gdGhlIHByZXZpb3VzIGluc3RhbmNlLiBDbGVhbiB1cCB0aGVcbiAgLy8gc3RhbGUgaG9zdCBzbyB0aGUgdG9nZ2xlIGJ1dHRvbiBkb2Vzbid0IGFwcGVhciB0d2ljZS5cbiAgLy8gTGVmdG92ZXIgY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkIGxpc3RlbmVycyBmcm9tIHRoZSBvbGQgc2NyaXB0XG4gIC8vIGluc3RhbmNlIGNhbid0IGJlIHVucmVnaXN0ZXJlZCwgYnV0IHRoZXkgcmVmZXJlbmNlIGRldGFjaGVkIERPTVxuICAvLyBub2RlcyBzbyB0aGVpciBjYWxsYmFja3MgYXJlIHZpc3VhbCBuby1vcHMuXG4gIGNvbnN0IHByZXZpb3VzSG9zdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmhpLWZoaXItc2lkZWJhci1ob3N0XCIpO1xuICBpZiAocHJldmlvdXNIb3N0KSBwcmV2aW91c0hvc3QucmVtb3ZlKCk7XG5cbiAgY29uc3QgU0lERUJBUl9ERUZBVUxUX1dJRFRIID0gNDIwO1xuICBjb25zdCBTSURFQkFSX01JTl9XSURUSCA9IDI4MDtcbiAgY29uc3QgU0lERUJBUl9NQVhfV0lEVEggPSAxMjAwO1xuICBjb25zdCBTVE9SQUdFX0tFWSA9IFwic2lkZWJhcl9vcGVuXCI7XG4gIGNvbnN0IFdJRFRIX0tFWSA9IFwic2lkZWJhcl93aWR0aFwiO1xuICAvLyBUaGUgU01BUlQgbGF1bmNoIGVudHJ5IHRoYXQgZmhpcmNsaWVudCBleHBlY3RzIHRvIGhhbmRsZSB0aGUgaXNzK2xhdW5jaFxuICAvLyBwYXJhbXMgYW5kIHJ1biBGSElSLm9hdXRoMi5hdXRob3JpemUoKS5cbiAgY29uc3QgQVBQX0xBVU5DSF9QQVRIID0gXCIvc21hcnQvbGF1bmNoXCI7XG4gIC8vIENocm9tZSdzIFByaXZhdGUgTmV0d29yayBBY2Nlc3MgYmxvY2tzIGZldGNoZXMgZnJvbSBwdWJsaWMgb3JpZ2luc1xuICAvLyAoZ2l0aHViLmlvKSBpbnRvIGxvb3BiYWNrIChsb2NhbGhvc3QpIGV2ZW4gd2hlbiB0aGUgc2VydmVyIHJldHVybnNcbiAgLy8gQWNjZXNzLUNvbnRyb2wtQWxsb3ctUHJpdmF0ZS1OZXR3b3JrOiB0cnVlIFx1MjAxNCBhcHBhcmVudGx5IHRoaXMgaXMgYmVpbmdcbiAgLy8gdGlnaHRlbmVkIHRvIFwiYWx3YXlzIGJsb2NrXCIgaW4gbmV3ZXIgQ2hyb21lcy4gRWFzaWVzdCBmaXggaXMgdG8gcG9pbnRcbiAgLy8gdGhlIGlmcmFtZSBhdCB0aGUgbG9jYWwgZGV2IHNlcnZlciBvZiBtZWRpY2FsLW5vdGUgKGxvY2FsaG9zdDozMDAxKSxcbiAgLy8gc2FtZSBzY2hlbWUgYXMgYmFja2VuZCwgc28gbm8gUE5BIGNyb3NzaW5nIGhhcHBlbnMgYXQgYWxsLiBGYWxscyBiYWNrXG4gIC8vIHRvIHRoZSBkZXBsb3llZCBnaXRodWIuaW8gYXBwIHdoZW4gdGhlIGxvY2FsIG9uZSBpc24ndCBydW5uaW5nLlxuICAvLyBMb2NhbCBOZXh0LmpzIGRldiBzZXJ2ZXI6IHJ1bnMgYXQgcm9vdCAobm8gL21lZGljYWwtbm90ZS1zbWFydC1vbi1maGlyXG4gIC8vIHByZWZpeCBcdTIwMTQgdGhlIGxhdW5jaCBwYWdlIGRldGVjdHMgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lIGFuZCBzZXRzXG4gIC8vIHByZWZpeCA9IFwiXCIgd2hlbiBub3Qgb24gdGhlIGdpdGh1Yi5pbyByZXBvIHN1YnBhdGgpLlxuICBjb25zdCBBUFBfQkFTRV9MT0NBTCA9IFwiaHR0cDovL2xvY2FsaG9zdDozMDAxXCI7XG4gIGNvbnN0IEFQUF9CQVNFX0RFUExPWUVEID0gXCJodHRwczovL3ZvaG8wMDAwLmdpdGh1Yi5pby9tZWRpY2FsLW5vdGUtc21hcnQtb24tZmhpclwiO1xuICBjb25zdCBERUZBVUxUX0JBQ0tFTkQgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODAxMFwiO1xuXG4gIC8vIEhvc3QgZWxlbWVudCArIFNoYWRvdyByb290IHNvIHRoZSBob3N0IHBhZ2UncyBDU1MgbmV2ZXIgdG91Y2hlcyB1cy5cbiAgY29uc3QgaG9zdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGhvc3QuaWQgPSBcIm5oaS1maGlyLXNpZGViYXItaG9zdFwiO1xuICAvLyBQaW4gdG8gdGhlIHBhZ2UsIGFib3ZlIGFsbW9zdCBldmVyeXRoaW5nLiBOSEkgdXNlcyBzb21lIHotaW5kZXhcbiAgLy8gdmFsdWVzIGJ1dCBub3RoaW5nIGFib3ZlIDk5OTkuXG4gIGhvc3Quc3R5bGUuY3NzVGV4dCA9IGBcbiAgICBhbGw6IGluaXRpYWw7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIHRvcDogMDtcbiAgICByaWdodDogMDtcbiAgICBoZWlnaHQ6IDEwMHZoO1xuICAgIHotaW5kZXg6IDIxNDc0ODM2NDY7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIGA7XG4gIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZChob3N0KTtcblxuICAvLyBUaGUgc2lkZWJhcidzIGFzc2lzdGFudCBidXR0b24gKyBpZnJhbWUgcGFuZWwgYXJlIG9ubHkgdXNlZnVsIGluXG4gIC8vIFwiXHU0RTBBXHU1MEIzXHU1RjhDXHU3QUVGXCIgbW9kZSBcdTIwMTQgdGhlIGlmcmFtZSBpcyBhIFNNQVJUIGFwcCB0aGF0IHRhbGtzIHRvIHRoZSBsb2NhbFxuICAvLyBGSElSIGJhY2tlbmQuIEluIFwiXHU0RTBCXHU4RjA5XHU1MjMwXHU5NkZCXHU4MTY2XCIgbW9kZSB0aGVyZSdzIG5vIGJhY2tlbmQgdG8gdGFsayB0byxcbiAgLy8gc28gaGlkZSB0aGUgd2hvbGUgdGhpbmcuXG4gIC8vXG4gIC8vIFBsdXMgYW4gZXhwbGljaXQgYHNpZGViYXJFbmFibGVkYCBvcHQtb3V0OiB1c2VycyB3aG8gb25seSB3YW50IHRoZVxuICAvLyByYXcgRkhJUiBCdW5kbGUgYW5kIG5ldmVyIHBsYW4gdG8gZW1iZWQgU01BUlQgYXBwcyBvbiB0aGUgTkhJIHBhZ2VcbiAgLy8gY2FuIHR1cm4gdGhlIHBhbmVsIG9mZiBlbnRpcmVseSB2aWEgdGhlIHBvcHVwJ3MgXHUzMDBDXHUyNjk5XHVGRTBGIFx1OTAzMlx1OTY4RVx1OEEyRFx1NUI5QVx1MzAwRC5cbiAgYXN5bmMgZnVuY3Rpb24gX2FwcGx5TW9kZVZpc2liaWxpdHkoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHsgc3luY01vZGUsIHNpZGViYXJFbmFibGVkIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChbXG4gICAgICAgIFwic3luY01vZGVcIiwgXCJzaWRlYmFyRW5hYmxlZFwiLFxuICAgICAgXSk7XG4gICAgICBjb25zdCB2aXNpYmxlID0gc2lkZWJhckVuYWJsZWQgIT09IGZhbHNlICYmIHN5bmNNb2RlID09PSBcImJhY2tlbmRcIjtcbiAgICAgIGhvc3Quc3R5bGUuZGlzcGxheSA9IHZpc2libGUgPyBcIlwiIDogXCJub25lXCI7XG4gICAgfSBjYXRjaCB7XG4gICAgICBob3N0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG4gIH1cbiAgX2FwcGx5TW9kZVZpc2liaWxpdHkoKTtcbiAgY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBhcmVhKSA9PiB7XG4gICAgaWYgKGFyZWEgIT09IFwic3luY1wiKSByZXR1cm47XG4gICAgaWYgKFwic3luY01vZGVcIiBpbiBjaGFuZ2VzIHx8IFwic2lkZWJhckVuYWJsZWRcIiBpbiBjaGFuZ2VzKSB7XG4gICAgICBfYXBwbHlNb2RlVmlzaWJpbGl0eSgpO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3Qgcm9vdCA9IGhvc3QuYXR0YWNoU2hhZG93KHsgbW9kZTogXCJvcGVuXCIgfSk7XG4gIHJvb3QuaW5uZXJIVE1MID0gYFxuICAgIDxzdHlsZT5cbiAgICAgIDpob3N0LCAqIHsgYm94LXNpemluZzogYm9yZGVyLWJveDsgfVxuICAgICAgLnRvZ2dsZSB7XG4gICAgICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICAgICAgdG9wOiA1MCU7XG4gICAgICAgIHJpZ2h0OiAwO1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7XG4gICAgICAgIHdpZHRoOiAyOHB4O1xuICAgICAgICBoZWlnaHQ6IDgwcHg7XG4gICAgICAgIGJhY2tncm91bmQ6ICMxZTNhOGE7XG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA4cHggMCAwIDhweDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICAgIGZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIHNhbnMtc2VyaWY7XG4gICAgICAgIGJveC1zaGFkb3c6IC0ycHggMnB4IDhweCByZ2JhKDAsMCwwLDAuMTUpO1xuICAgICAgICBwb2ludGVyLWV2ZW50czogYXV0bztcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIHdyaXRpbmctbW9kZTogdmVydGljYWwtcmw7XG4gICAgICAgIHRleHQtb3JpZW50YXRpb246IG1peGVkO1xuICAgICAgICB0cmFuc2l0aW9uOiByaWdodCAwLjJzIGVhc2U7XG4gICAgICB9XG4gICAgICAudG9nZ2xlOmhvdmVyIHsgYmFja2dyb3VuZDogIzFlNDBhZjsgfVxuICAgICAgLnBhbmVsIHtcbiAgICAgICAgcG9zaXRpb246IGZpeGVkO1xuICAgICAgICB0b3A6IDA7XG4gICAgICAgIHJpZ2h0OiAtJHtTSURFQkFSX0RFRkFVTFRfV0lEVEggKyAzMH1weDtcbiAgICAgICAgaGVpZ2h0OiAxMDB2aDtcbiAgICAgICAgd2lkdGg6ICR7U0lERUJBUl9ERUZBVUxUX1dJRFRIfXB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgICAgICAgYm94LXNoYWRvdzogLTRweCAwIDEycHggcmdiYSgwLDAsMCwwLjEpO1xuICAgICAgICAvKiBObyB0cmFuc2l0aW9uIHdoaWxlIHVzZXIgaXMgZHJhZ2dpbmcgXHUyMDE0IHNldCBpbmxpbmUuICovXG4gICAgICAgIHRyYW5zaXRpb246IHJpZ2h0IDAuMjVzIGVhc2U7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIHBvaW50ZXItZXZlbnRzOiBhdXRvO1xuICAgICAgICBib3JkZXItbGVmdDogMXB4IHNvbGlkICNlNWU3ZWI7XG4gICAgICB9XG4gICAgICAucGFuZWwub3BlbiB7IHJpZ2h0OiAwOyB9XG4gICAgICAvKiBEcmFnIGhhbmRsZSBvbiB0aGUgTEVGVCBlZGdlIG9mIHRoZSBvcGVuIHBhbmVsLiBXaWRlIGVub3VnaFxuICAgICAgICAgKDZweCkgdG8gYmUgZWFzeSB0byBncmFiIGJ1dCBpbnZpc2libGUgdW50aWwgaG92ZXJlZC4gV2hpbGVcbiAgICAgICAgIGRyYWdnaW5nIHRoZSB0b2dnbGUvdHJhbnNpdGlvbiBpcyBkaXNhYmxlZCBzbyByZXNpemluZyBmZWVsc1xuICAgICAgICAgY3Jpc3AuICovXG4gICAgICAucmVzaXplciB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgdG9wOiAwOyBsZWZ0OiAtM3B4O1xuICAgICAgICB3aWR0aDogNnB4OyBoZWlnaHQ6IDEwMCU7XG4gICAgICAgIGN1cnNvcjogZXctcmVzaXplO1xuICAgICAgICB6LWluZGV4OiAxO1xuICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICAgIH1cbiAgICAgIC5yZXNpemVyOmhvdmVyLCAucGFuZWwucmVzaXppbmcgLnJlc2l6ZXIge1xuICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsIHRyYW5zcGFyZW50LCAjMjU2M2ViMzMsIHRyYW5zcGFyZW50KTtcbiAgICAgIH1cbiAgICAgIC5wYW5lbC5yZXNpemluZyB7IHRyYW5zaXRpb246IG5vbmUgIWltcG9ydGFudDsgdXNlci1zZWxlY3Q6IG5vbmU7IH1cbiAgICAgIC5wYW5lbC5yZXNpemluZyBpZnJhbWUgeyBwb2ludGVyLWV2ZW50czogbm9uZTsgfSAvKiBzd2FsbG93IGRyYWcgaW5zaWRlIGlmcmFtZSAqL1xuICAgICAgLmhlYWRlciB7XG4gICAgICAgIHBhZGRpbmc6IDEwcHggMTRweDtcbiAgICAgICAgYmFja2dyb3VuZDogI2Y5ZmFmYjtcbiAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlNWU3ZWI7XG4gICAgICAgIGZvbnQ6IDYwMCAxM3B4IC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgc2Fucy1zZXJpZjtcbiAgICAgICAgY29sb3I6ICMxZTNhOGE7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgIH1cbiAgICAgIC5oZWFkZXIgLmNsb3NlIHtcbiAgICAgICAgYmFja2dyb3VuZDogbm9uZTtcbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICAgIGNvbG9yOiAjNmI3MjgwO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIHBhZGRpbmc6IDAgNHB4O1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIG1pbi13aWR0aDogMjZweDtcbiAgICAgICAgaGVpZ2h0OiAyNnB4O1xuICAgICAgfVxuICAgICAgLmhlYWRlciAuY2xvc2U6aG92ZXIgeyBjb2xvcjogIzFmMjkzNzsgfVxuICAgICAgLmhlYWRlciAuY2xvc2Ugc3ZnIHsgd2lkdGg6IDE2cHg7IGhlaWdodDogMTZweDsgfVxuICAgICAgaWZyYW1lIHtcbiAgICAgICAgZmxleDogMTtcbiAgICAgICAgYm9yZGVyOiAwO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgYmFja2dyb3VuZDogd2hpdGU7XG4gICAgICB9XG4gICAgICAuZW1wdHkge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgZmxleDogMTtcbiAgICAgICAgY29sb3I6ICM5Y2EzYWY7XG4gICAgICAgIGZvbnQ6IDEzcHggLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBzYW5zLXNlcmlmO1xuICAgICAgICBnYXA6IDEycHg7XG4gICAgICAgIHBhZGRpbmc6IDIwcHg7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgIH1cbiAgICAgIC5lbXB0eSBidXR0b24ge1xuICAgICAgICBwYWRkaW5nOiA4cHggMTZweDtcbiAgICAgICAgYmFja2dyb3VuZDogIzI1NjNlYjtcbiAgICAgICAgY29sb3I6IHdoaXRlO1xuICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICBmb250LXNpemU6IDEzcHg7XG4gICAgICB9XG4gICAgPC9zdHlsZT5cblxuICAgIDxidXR0b24gY2xhc3M9XCJ0b2dnbGVcIiBpZD1cInRvZ2dsZVwiIHRpdGxlPVwiTkhJLUZISVIgQnJpZGdlIFx1NTJBOVx1NzQwNlx1OTc2Mlx1Njc3RlwiPlx1RDgzRFx1RENDQiBcdTUyQTlcdTc0MDY8L2J1dHRvbj5cbiAgICA8ZGl2IGNsYXNzPVwicGFuZWxcIiBpZD1cInBhbmVsXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwicmVzaXplclwiIGlkPVwicmVzaXplclwiIHRpdGxlPVwiXHU2MkQ2XHU2NkYzXHU4QUJGXHU2NTc0XHU1QkVDXHU1RUE2XCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+XG4gICAgICAgIDxzcGFuPlx1RDgzQ1x1REZFNSBOSEktRkhJUiBCcmlkZ2UgXHU1MkE5XHU3NDA2PC9zcGFuPlxuICAgICAgICA8c3BhbiBzdHlsZT1cImRpc3BsYXk6ZmxleDtnYXA6NHB4XCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNsb3NlXCIgaWQ9XCJwb3BvdXRcIiB0aXRsZT1cIlx1NzlGQlx1NTIzMFx1NzM2OFx1N0FDQlx1ODk5Nlx1N0E5NyAocG9wLW91dClcIiBhcmlhLWxhYmVsPVwicG9wIG91dFwiPlxuICAgICAgICAgICAgPCEtLSBcImV4dGVybmFsIGxpbmsgLyBvcGVuIGluIG5ldyB3aW5kb3dcIiBpY29uLiBJbmxpbmUgU1ZHIHNvXG4gICAgICAgICAgICAgICAgIGl0IHJlbmRlcnMgdGhlIHNhbWUgb24gZXZlcnkgT1Mgd2l0aG91dCByZWx5aW5nIG9uIGVtb2ppXG4gICAgICAgICAgICAgICAgIGZvbnQgY292ZXJhZ2UuIC0tPlxuICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgICBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTQgNGg2djZcIi8+XG4gICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjAgNCAxMiAxMlwiLz5cbiAgICAgICAgICAgICAgPHBhdGggZD1cIk0xOSAxM3Y2YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0yVjdhMiAyIDAgMCAxIDItMmg2XCIvPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNsb3NlXCIgaWQ9XCJyZWxvYWRcIiB0aXRsZT1cIlx1NUYzN1x1NTIzNlx1OTFDRFx1NjVCMFx1OEYwOVx1NTE2NVx1NTJBOVx1NzQwNiAoXHU3RTVFIGNhY2hlKVwiPlx1RDgzRFx1REQwNDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJjbG9zZVwiIGlkPVwiY2xvc2VcIiB0aXRsZT1cIlx1NjUzNlx1OEQ3N1wiPlx1MjcxNTwvYnV0dG9uPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJlbXB0eVwiIGlkPVwiZW1wdHlcIj5cbiAgICAgICAgPGRpdj5cdTdCMkNcdTRFMDBcdTZCMjFcdTRGN0ZcdTc1MjggXHUyMDE0IFx1OUVERVx1NEUwQlx1NjVCOVx1OEYwOVx1NTE2NSBtZWRpY2FsLW5vdGUgXHU1MkE5XHU3NDA2PC9kaXY+XG4gICAgICAgIDxidXR0b24gaWQ9XCJsb2FkXCI+XHU4RjA5XHU1MTY1XHU1MkE5XHU3NDA2ICh+M3MpPC9idXR0b24+XG4gICAgICAgIDxkaXYgc3R5bGU9XCJmb250LXNpemU6MTFweDtjb2xvcjojOWNhM2FmO21hcmdpbi10b3A6OHB4XCI+XG4gICAgICAgICAgXHU4RjA5XHU1MTY1XHU1RjhDXHU1M0VGXHU0RkREXHU2MzAxXHU5NThCXHU1NTVGXHVGRjFCXHU1MjA3XHU1MjMwXHU1MTc2XHU0RUQ2XHU3NUM1XHU0RUJBXHU2NjQyXHU3NTI4XHU1REU2XHU0RTBBXHU3Njg0IHBhdGllbnQgcGlja2VyIFx1NTIwN1x1NjNEQlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgO1xuXG4gIGNvbnN0IHBhbmVsID0gcm9vdC5nZXRFbGVtZW50QnlJZChcInBhbmVsXCIpO1xuICBjb25zdCB0b2dnbGVCdG4gPSByb290LmdldEVsZW1lbnRCeUlkKFwidG9nZ2xlXCIpO1xuICBjb25zdCBjbG9zZUJ0biA9IHJvb3QuZ2V0RWxlbWVudEJ5SWQoXCJjbG9zZVwiKTtcbiAgY29uc3QgbG9hZEJ0biA9IHJvb3QuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkXCIpO1xuICBjb25zdCBlbXB0eUJveCA9IHJvb3QuZ2V0RWxlbWVudEJ5SWQoXCJlbXB0eVwiKTtcbiAgY29uc3QgcmVzaXplciA9IHJvb3QuZ2V0RWxlbWVudEJ5SWQoXCJyZXNpemVyXCIpO1xuICBjb25zdCBwb3BvdXRCdG4gPSByb290LmdldEVsZW1lbnRCeUlkKFwicG9wb3V0XCIpO1xuXG4gIC8vIFx1MjUwMFx1MjUwMCBXaWR0aCBwZXJzaXN0ZW5jZSArIGRyYWctdG8tcmVzaXplIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBUaGUgcGFuZWwncyB3aWR0aCBpcyByZXN0b3JlZCBmcm9tIHN0b3JhZ2UgYW5kIHRoZSBDU1MgcnVsZSB0aGF0XG4gIC8vIGhpZGVzIHRoZSBwYW5lbCBvZmYtc2NyZWVuIChcInJpZ2h0OiAtPHdpZHRoKzMwPnB4XCIpIGlzIHJld3JpdHRlbiBpblxuICAvLyBzeW5jLiBXZSBjYW4ndCB0b3VjaCB0aGUgb3JpZ2luYWwgPHN0eWxlPiBydWxlLCBzbyB3ZSBvdmVycmlkZSB2aWFcbiAgLy8gYW4gaW5saW5lIGByaWdodGAgc3R5bGUgd2hlbiB0aGUgcGFuZWwgaXMgY2xvc2VkLlxuICBsZXQgY3VycmVudFdpZHRoID0gU0lERUJBUl9ERUZBVUxUX1dJRFRIO1xuICBmdW5jdGlvbiBhcHBseVdpZHRoKHB4KSB7XG4gICAgY3VycmVudFdpZHRoID0gTWF0aC5tYXgoU0lERUJBUl9NSU5fV0lEVEgsIE1hdGgubWluKFNJREVCQVJfTUFYX1dJRFRILCBNYXRoLnJvdW5kKHB4KSkpO1xuICAgIHBhbmVsLnN0eWxlLndpZHRoID0gYCR7Y3VycmVudFdpZHRofXB4YDtcbiAgICAvLyBLZWVwIHRoZSBvZmYtc2NyZWVuIG9mZnNldCBpbiBzeW5jIChzbGlnaHRseSBtb3JlIHRoYW4gd2lkdGggc29cbiAgICAvLyB0aGUgYm94LXNoYWRvdyBpcyBoaWRkZW4gdG9vKS5cbiAgICBpZiAoIXBhbmVsLmNsYXNzTGlzdC5jb250YWlucyhcIm9wZW5cIikpIHtcbiAgICAgIHBhbmVsLnN0eWxlLnJpZ2h0ID0gYC0ke2N1cnJlbnRXaWR0aCArIDMwfXB4YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFuZWwuc3R5bGUucmlnaHQgPSBcIjBcIjtcbiAgICB9XG4gICAgLy8gTW92ZSB0aGUgdG9nZ2xlIGhhbmRsZSB0byBzaXQgZmx1c2ggd2l0aCB0aGUgb3BlbiBwYW5lbCdzIGxlZnQgZWRnZS5cbiAgICB0b2dnbGVCdG4uc3R5bGUucmlnaHQgPSBwYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoXCJvcGVuXCIpID8gYCR7Y3VycmVudFdpZHRofXB4YCA6IFwiMFwiO1xuICB9XG4gIC8vIEluaXRpYWw6IHJlc3RvcmUgbGFzdC11c2VkIHdpZHRoLlxuICBpZiAoaXNDb250ZXh0QWxpdmUoKSkge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChXSURUSF9LRVkpLnRoZW4oKGQpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgZFtXSURUSF9LRVldID09PSBcIm51bWJlclwiKSBhcHBseVdpZHRoKGRbV0lEVEhfS0VZXSk7XG4gICAgfSkuY2F0Y2goKCkgPT4ge30pO1xuICB9XG4gIC8vIERyYWc6IHRyYWNrIGRlbHRhIHZzLiBzdGFydGluZyBtb3VzZVgsIHJlY29tcHV0ZSB3aWR0aCBvbiBlYWNoIG1vdmUuXG4gIGxldCBkcmFnU3RhcnRYID0gMCwgZHJhZ1N0YXJ0VyA9IDA7XG4gIGZ1bmN0aW9uIG9uRHJhZ01vdmUoZSkge1xuICAgIC8vIFJlc2l6ZXIgaXMgb24gdGhlIExFRlQgZWRnZSBcdTIwMTQgZHJhZ2dpbmcgbGVmdCBncm93cyB0aGUgcGFuZWwuXG4gICAgY29uc3QgZGVsdGEgPSBkcmFnU3RhcnRYIC0gZS5jbGllbnRYO1xuICAgIGFwcGx5V2lkdGgoZHJhZ1N0YXJ0VyArIGRlbHRhKTtcbiAgfVxuICBmdW5jdGlvbiBvbkRyYWdFbmQoKSB7XG4gICAgcGFuZWwuY2xhc3NMaXN0LnJlbW92ZShcInJlc2l6aW5nXCIpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb2ludGVybW92ZVwiLCBvbkRyYWdNb3ZlKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIG9uRHJhZ0VuZCk7XG4gICAgaWYgKGlzQ29udGV4dEFsaXZlKCkpIHtcbiAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IFtXSURUSF9LRVldOiBjdXJyZW50V2lkdGggfSkuY2F0Y2goKCkgPT4ge30pO1xuICAgIH1cbiAgfVxuICByZXNpemVyLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyZG93blwiLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBkcmFnU3RhcnRYID0gZS5jbGllbnRYO1xuICAgIGRyYWdTdGFydFcgPSBjdXJyZW50V2lkdGg7XG4gICAgcGFuZWwuY2xhc3NMaXN0LmFkZChcInJlc2l6aW5nXCIpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVybW92ZVwiLCBvbkRyYWdNb3ZlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIG9uRHJhZ0VuZCk7XG4gIH0pO1xuXG4gIC8vIFx1MjUwMFx1MjUwMCBQb3Atb3V0IHRvIHN0YW5kYWxvbmUgd2luZG93IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBPcGVucyB0aGUgc2FtZSBpZnJhbWUgVVJMIGluIGEgZnJlc2ggd2luZG93IHNvIHRoZSB1c2VyIGNhbiBtb3ZlIGl0XG4gIC8vIHRvIGEgc2Vjb25kIG1vbml0b3IgLyByZXNpemUgZnJlZWx5LiBTaWRlYmFyIGF1dG8tY29sbGFwc2VzIGFmdGVyLFxuICAvLyBzaW5jZSBib3RoIHNob3dpbmcgaXQgc2lkZS1ieS1zaWRlIHdvdWxkIGJlIGNvbmZ1c2luZy5cbiAgbGV0IHBvcG91dFdpbiA9IG51bGw7XG4gIGFzeW5jIGZ1bmN0aW9uIHBvcE91dCgpIHtcbiAgICBsZXQgdXJsO1xuICAgIHRyeSB7IHVybCA9IGF3YWl0IGJ1aWxkSWZyYW1lVXJsKCk7IH1cbiAgICBjYXRjaCAoZXJyKSB7IGNvbnNvbGUud2FybihcIltuaGktZmhpciBzaWRlYmFyXSBwb3BPdXQ6XCIsIGVyci5tZXNzYWdlKTsgcmV0dXJuOyB9XG4gICAgLy8gSWYgd2UgYWxyZWFkeSBoYXZlIGFuIG9wZW4gcG9wdXAsIHJldXNlIGl0IChyYWlzZXMgdGhlIGV4aXN0aW5nXG4gICAgLy8gd2luZG93KS4gVGhlIDJuZCB3aW5kb3cub3BlbiBjYWxsIHdpdGggdGhlIHNhbWUgbmFtZSByZWxvYWRzIGl0LlxuICAgIHBvcG91dFdpbiA9IHdpbmRvdy5vcGVuKHVybCwgXCJuaGktZmhpci1icmlkZ2UtYXNzaXN0YW50XCIsXG4gICAgICBgd2lkdGg9JHtjdXJyZW50V2lkdGh9LGhlaWdodD05MDAscmVzaXphYmxlPXllcyxzY3JvbGxiYXJzPXllc2ApO1xuICAgIGlmIChwb3BvdXRXaW4pIHtcbiAgICAgIHBvcG91dFdpbi5mb2N1cygpO1xuICAgICAgLy8gQ29sbGFwc2UgdGhlIHNpZGViYXIgc28gdGhlIHVzZXIgaXNuJ3Qgc3RhcmluZyBhdCB0aGUgc2FtZSBhcHBcbiAgICAgIC8vIGluIHR3byBwbGFjZXMuXG4gICAgICBzZXRPcGVuKGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICAvLyBCdWlsZCB0aGUgaWZyYW1lIFVSTC4gV2hlbiB3ZSBoYXZlIGEgcGF0aWVudF9pZCArIGEgd29ya2luZyBiYWNrZW5kXG4gIC8vIHdlIGhhbmQgdGhlIGFwcCBhIFNNQVJUIEVIUi1MYXVuY2ggY29udGV4dCBzbyBpdCBhdXRvLWxvYWRzIE9VUlxuICAvLyBsb2NhbCBGSElSIHN0b3JlLiBPdGhlcndpc2UganVzdCBvcGVuIHRoZSBhcHAgaG9tZSAoaXQnbGwgc2hvdyBpdHNcbiAgLy8gZGVmYXVsdCBsYW5kaW5nIC8gYSBwdWJsaWMgdGVzdCBzZXJ2ZXIpLlxuICAvLyBEZXRlY3Qgb3JwaGFuZWQgY29udGVudCBzY3JpcHQ6IGFmdGVyIHRoZSB1c2VyIHJlbG9hZHMgdGhlIGV4dGVuc2lvblxuICAvLyBmcm9tIGNocm9tZTovL2V4dGVuc2lvbnMsIHRoaXMgc2NyaXB0J3MgY2hyb21lLnJ1bnRpbWUuaWQgbGluayBnb2VzXG4gIC8vIG51bGwgYW5kIGFueSBjaHJvbWUuKiBjYWxsIHRocm93cyBcIkV4dGVuc2lvbiBjb250ZXh0IGludmFsaWRhdGVkXCIuXG4gIC8vIFRoZSBmaXggaXMgYWx3YXlzIGEgcGFnZSByZWZyZXNoIFx1MjAxNCB3ZSBqdXN0IHN1cmZhY2UgYSBjbGVhcmVyIGVycm9yLlxuICBmdW5jdGlvbiBpc0NvbnRleHRBbGl2ZSgpIHtcbiAgICB0cnkgeyByZXR1cm4gISFjaHJvbWUucnVudGltZT8uaWQ7IH0gY2F0Y2ggeyByZXR1cm4gZmFsc2U7IH1cbiAgfVxuXG4gIC8vIEFsd2F5cyBwcmVmZXIgdGhlIGxvY2FsIE5leHQuanMgZGV2IHNlcnZlciAoUE5BLWZyZWUgcGF0aCkuIFRoZVxuICAvLyBjb250ZW50IHNjcmlwdCBjYW4ndCBwcm9iZSBsb2NhbGhvc3QgZnJvbSB0aGUgTkhJIG9yaWdpbiAoUE5BIGFnYWluKSxcbiAgLy8gc28gd2UganVzdCB0cnVzdCB0aGUgdXNlciB0byBoYXZlIGBucG0gcnVuIGRldmAgcnVubmluZyBhbmQgbGV0IHRoZVxuICAvLyBpZnJhbWUgc3VyZmFjZSBhIFwiY29ubmVjdGlvbiByZWZ1c2VkXCIgaWYgdGhleSBkb24ndC4gQSBmdXR1cmUgc2V0dGluZ1xuICAvLyBjYW4gbGV0IHVzZXJzIGZsaXAgdG8gdGhlIGRlcGxveWVkIFVSTC5cbiAgYXN5bmMgZnVuY3Rpb24gcGlja0FwcEJhc2UoKSB7XG4gICAgY29uc3QgeyBzaWRlYmFyQXBwQmFzZSB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoXCJzaWRlYmFyQXBwQmFzZVwiKS5jYXRjaCgoKSA9PiAoe30pKTtcbiAgICByZXR1cm4gc2lkZWJhckFwcEJhc2UgfHwgQVBQX0JBU0VfTE9DQUw7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBidWlsZElmcmFtZVVybCgpIHtcbiAgICBjb25zdCBjYWNoZUJ1c3QgPSBgXz0ke0RhdGUubm93KCl9YDtcbiAgICBpZiAoIWlzQ29udGV4dEFsaXZlKCkpIHtcbiAgICAgIC8vIENocm9tZSBpbnZhbGlkYXRlcyBhIGNvbnRlbnQgc2NyaXB0J3MgY2hyb21lLiogQVBJcyB0aGUgbW9tZW50XG4gICAgICAvLyB0aGUgZXh0ZW5zaW9uIGl0c2VsZiBpcyB1cGRhdGVkIC8gcmVsb2FkZWQuIFRoZSBzY3JpcHQga2VlcHNcbiAgICAgIC8vIHJ1bm5pbmcgb24gdGhlIHBhZ2UgYnV0IGNhbiBubyBsb25nZXIgdGFsayB0byBzdG9yYWdlIC8gU1cgXHUyMDE0XG4gICAgICAvLyB1c2VyIGhhcyB0byBGNSB0aGUgTkhJIHRhYiBzbyBhIGZyZXNoIGNvcHkgb2Ygc2lkZWJhci5qcyBnZXRzXG4gICAgICAvLyBpbmplY3RlZC4gUGhyYXNlIHRoaXMgd2l0aG91dCBqYXJnb24uXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiXHU2NEY0XHU1MTQ1XHU1MjlGXHU4MEZEXHU1MjVCXHU2NkY0XHU2NUIwXHU5MDRFXHVGRjBDXHU4QUNCXHU2MzA5IEY1IFx1OTFDRFx1NjVCMFx1NjU3NFx1NzQwNlx1OTAxOVx1NTAwQlx1OTgwMVx1OTc2Mlx1NUMzMVx1ODBGRFx1NjA2Mlx1NUZBOVx1NTJBOVx1NzQwNlx1OTc2Mlx1Njc3Rlx1MzAwMlxcblwiICtcbiAgICAgICAgXCIoRXh0ZW5zaW9uIHdhcyBqdXN0IHVwZGF0ZWQgXHUyMDE0IHByZXNzIEY1IG9uIHRoaXMgcGFnZSB0byByZWxvYWQgdGhlIHNpZGViYXIuKVwiLFxuICAgICAgKTtcbiAgICB9XG4gICAgY29uc3QgeyBwYXRpZW50T3ZlcnJpZGUsIGJhY2tlbmRVcmwgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFtcbiAgICAgIFwicGF0aWVudE92ZXJyaWRlXCIsIFwiYmFja2VuZFVybFwiLFxuICAgIF0pLmNhdGNoKCgpID0+ICh7fSkpO1xuICAgIGNvbnN0IGJhY2tlbmQgPSAoYmFja2VuZFVybCB8fCBERUZBVUxUX0JBQ0tFTkQpLnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcbiAgICBjb25zdCBwYXRpZW50SWQgPSBwYXRpZW50T3ZlcnJpZGU/LmlkX25vO1xuICAgIGNvbnN0IGFwcEJhc2UgPSBhd2FpdCBwaWNrQXBwQmFzZSgpO1xuICAgIGNvbnN0IGFwcEhvbWUgPSBgJHthcHBCYXNlfS9gO1xuICAgIGlmICghcGF0aWVudElkKSB7XG4gICAgICAvLyBObyBwYXRpZW50IGNvbnRleHQgeWV0IFx1MjAxNCBsb2FkIHRoZSBhcHAgYmFyZTsgdXNlciBjYW4gZmlsbCB0aGVcbiAgICAgIC8vIHBvcHVwJ3MgXHVEODNFXHVERUFBIGFyZWEgYW5kIGNsaWNrIFx1RDgzRFx1REQwNCB0byByZWxhdW5jaCB3aXRoIGNvbnRleHQuXG4gICAgICByZXR1cm4gYCR7YXBwSG9tZX0/JHtjYWNoZUJ1c3R9YDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChgJHtiYWNrZW5kfS9zbWFydC9sYXVuY2gtY29udGV4dGAsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHBhdGllbnRfaWQ6IHBhdGllbnRJZCB9KSxcbiAgICAgIH0pO1xuICAgICAgaWYgKCFyLm9rKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyLnN0YXR1c31gKTtcbiAgICAgIGNvbnN0IHsgbGF1bmNoIH0gPSBhd2FpdCByLmpzb24oKTtcbiAgICAgIGNvbnN0IGlzcyA9IGAke2JhY2tlbmR9L2ZoaXJgO1xuICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh7IGlzcywgbGF1bmNoIH0pO1xuICAgICAgcmV0dXJuIGAke2FwcEJhc2V9JHtBUFBfTEFVTkNIX1BBVEh9PyR7cGFyYW1zLnRvU3RyaW5nKCl9JiR7Y2FjaGVCdXN0fWA7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJbbmhpLWZoaXIgc2lkZWJhcl0gbGF1bmNoLWNvbnRleHQgZmFpbGVkLCBmYWxsaW5nIGJhY2sgdG8gYmFyZSBhcHA6XCIsIGVycik7XG4gICAgICByZXR1cm4gYCR7YXBwSG9tZX0/JHtjYWNoZUJ1c3R9YDtcbiAgICB9XG4gIH1cblxuICBsZXQgaWZyYW1lRWwgPSBudWxsO1xuICBhc3luYyBmdW5jdGlvbiBsb2FkSWZyYW1lKCkge1xuICAgIGlmIChpZnJhbWVFbCkgcmV0dXJuO1xuICAgIGxldCBzcmM7XG4gICAgdHJ5IHsgc3JjID0gYXdhaXQgYnVpbGRJZnJhbWVVcmwoKTsgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgIC8vIFVzZSB0ZXh0Q29udGVudCArIHdoaXRlLXNwYWNlOnByZS1saW5lIHNvIG11bHRpLWxpbmUgYmlsaW5ndWFsXG4gICAgICAvLyBtZXNzYWdlcyBmcm9tIGJ1aWxkSWZyYW1lVXJsIHJlbmRlciB3aXRoIHRoZWlyIGxpbmUgYnJlYWtzXG4gICAgICAvLyBpbnRhY3QgKGFuZCB3ZSBkb24ndCBoYXZlIHRvIHdvcnJ5IGFib3V0IEhUTUwgZXNjYXBpbmcpLlxuICAgICAgZW1wdHlCb3gudGV4dENvbnRlbnQgPSBcIlwiO1xuICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGRpdi5zdHlsZS5jc3NUZXh0ID0gXCJjb2xvcjojYjkxYzFjOyB3aGl0ZS1zcGFjZTpwcmUtbGluZTsgbGluZS1oZWlnaHQ6MS42XCI7XG4gICAgICBkaXYudGV4dENvbnRlbnQgPSBgXHUyNkEwICR7ZXJyLm1lc3NhZ2V9YDtcbiAgICAgIGVtcHR5Qm94LmFwcGVuZENoaWxkKGRpdik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmcmFtZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKTtcbiAgICBpZnJhbWVFbC50aXRsZSA9IFwiTWVkaWNhbCBOb3RlIFNNQVJUIG9uIEZISVJcIjtcbiAgICBpZnJhbWVFbC5hbGxvdyA9IFwiY2xpcGJvYXJkLXJlYWQ7IGNsaXBib2FyZC13cml0ZVwiO1xuICAgIGVtcHR5Qm94LnJlbW92ZSgpO1xuICAgIHBhbmVsLmFwcGVuZENoaWxkKGlmcmFtZUVsKTtcbiAgICBpZnJhbWVFbC5zcmMgPSBzcmM7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiByZWxvYWRJZnJhbWUoKSB7XG4gICAgaWYgKCFpZnJhbWVFbCkgeyBhd2FpdCBsb2FkSWZyYW1lKCk7IHJldHVybjsgfVxuICAgIHRyeSB7IGlmcmFtZUVsLnNyYyA9IGF3YWl0IGJ1aWxkSWZyYW1lVXJsKCk7IH1cbiAgICBjYXRjaCAoZXJyKSB7IGNvbnNvbGUud2FybihcIltuaGktZmhpciBzaWRlYmFyXVwiLCBlcnIubWVzc2FnZSk7IH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldE9wZW4ob3Blbikge1xuICAgIHBhbmVsLmNsYXNzTGlzdC50b2dnbGUoXCJvcGVuXCIsIG9wZW4pO1xuICAgIC8vIFN5bmMgaW5saW5lIHJpZ2h0L3RvZ2dsZSBwb3NpdGlvbiB3aXRoIHRoZSBvcGVuIHN0YXRlLCB1c2luZyB0aGVcbiAgICAvLyAqY3VycmVudCogd2lkdGggKHdoaWNoIG1heSBoYXZlIGJlZW4gdXNlci1yZXNpemVkKS5cbiAgICBhcHBseVdpZHRoKGN1cnJlbnRXaWR0aCk7XG4gICAgaWYgKG9wZW4pIGxvYWRJZnJhbWUoKS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgaWYgKGlzQ29udGV4dEFsaXZlKCkpIHtcbiAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IFtTVE9SQUdFX0tFWV06IG9wZW4gfSkuY2F0Y2goKCkgPT4ge30pO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbG9hZEJ0biA9IHJvb3QuZ2V0RWxlbWVudEJ5SWQoXCJyZWxvYWRcIik7XG4gIHRvZ2dsZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIHNldE9wZW4oIXBhbmVsLmNsYXNzTGlzdC5jb250YWlucyhcIm9wZW5cIikpO1xuICB9KTtcbiAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHNldE9wZW4oZmFsc2UpKTtcbiAgbG9hZEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gbG9hZElmcmFtZSgpKTtcbiAgcmVsb2FkQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiByZWxvYWRJZnJhbWUoKSk7XG4gIHBvcG91dEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gcG9wT3V0KCkpO1xuXG4gIC8vIFJlc3RvcmUgcHJldmlvdXMgb3Blbi9jbG9zZWQgc3RhdGUgb24gdGhpcyBvcmlnaW4uXG4gIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChTVE9SQUdFX0tFWSkudGhlbigoZCkgPT4ge1xuICAgIGlmIChkW1NUT1JBR0VfS0VZXSkgc2V0T3Blbih0cnVlKTtcbiAgfSkuY2F0Y2goKCkgPT4ge30pO1xuXG4gIC8vIFx1MjUwMFx1MjUwMCBTeW5jLXJ1bm5pbmcgaWZyYW1lIHBhdXNlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBXaGlsZSB0aGUgZXh0ZW5zaW9uJ3MgcnVuTmhpQXBpU3luYyBpcyBpbiBmbGlnaHQsIHRoZSBtZWRpY2FsLW5vdGVcbiAgLy8gaWZyYW1lIGNvbXBldGVzIHdpdGggb3VyIE5ISSBmYW4tb3V0IGZldGNoZXMgZm9yIHRoZSB0YWIncyBuZXR3b3JrXG4gIC8vICsgSlMgdGhyZWFkICh3ZSBzYXcgTkhJIGZhbi1vdXQgdGltZSByb3VnaGx5IHRyaXBsZSB3aGVuIHRoaXMgaWZyYW1lXG4gIC8vIHdhcyBhY3RpdmUpLiBTdGFzaCB0aGUgaWZyYW1lJ3Mgc3JjIGludG8gYWJvdXQ6YmxhbmsgZHVyaW5nIHN5bmMgc29cbiAgLy8gaXRzIE9BdXRoICsgRkhJUiBjYWxscyBzdG9wIGhhbW1lcmluZyB0aGUgbmV0d29yay4gUmVzdW1lIGJ5XG4gIC8vIHJlLWxvYWRpbmcgZnJvbSB0aGUgc2F2ZWQgc3JjIHdoZW4gc3luYyBmaW5pc2hlcy5cbiAgbGV0IF9wYXVzZWRTcmMgPSBudWxsO1xuICBmdW5jdGlvbiBwYXVzZUlmcmFtZSgpIHtcbiAgICBpZiAoIWlmcmFtZUVsIHx8IF9wYXVzZWRTcmMgIT09IG51bGwpIHJldHVybjtcbiAgICBfcGF1c2VkU3JjID0gaWZyYW1lRWwuc3JjO1xuICAgIGlmcmFtZUVsLnNyYyA9IFwiYWJvdXQ6YmxhbmtcIjtcbiAgfVxuICBmdW5jdGlvbiByZXN1bWVJZnJhbWUoKSB7XG4gICAgaWYgKCFpZnJhbWVFbCB8fCBfcGF1c2VkU3JjID09PSBudWxsKSByZXR1cm47XG4gICAgaWZyYW1lRWwuc3JjID0gX3BhdXNlZFNyYztcbiAgICBfcGF1c2VkU3JjID0gbnVsbDtcbiAgfVxuICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJzeW5jUnVubmluZ1wiKS50aGVuKChkKSA9PiB7XG4gICAgaWYgKGQuc3luY1J1bm5pbmcpIHBhdXNlSWZyYW1lKCk7XG4gIH0pLmNhdGNoKCgpID0+IHt9KTtcbiAgY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBhcmVhKSA9PiB7XG4gICAgaWYgKGFyZWEgIT09IFwibG9jYWxcIiB8fCAhKFwic3luY1J1bm5pbmdcIiBpbiBjaGFuZ2VzKSkgcmV0dXJuO1xuICAgIGlmIChjaGFuZ2VzLnN5bmNSdW5uaW5nLm5ld1ZhbHVlKSBwYXVzZUlmcmFtZSgpO1xuICAgIGVsc2UgcmVzdW1lSWZyYW1lKCk7XG4gIH0pO1xufSkoKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7O0FBZ0JBLEdBQUMsTUFBTTtBQVFMLFVBQU0sZUFBZSxTQUFTLGVBQWUsdUJBQXVCO0FBQ3BFLFFBQUksYUFBYyxjQUFhLE9BQU87QUFFdEMsVUFBTSx3QkFBd0I7QUFDOUIsVUFBTSxvQkFBb0I7QUFDMUIsVUFBTSxvQkFBb0I7QUFDMUIsVUFBTSxjQUFjO0FBQ3BCLFVBQU0sWUFBWTtBQUdsQixVQUFNLGtCQUFrQjtBQVd4QixVQUFNLGlCQUFpQjtBQUN2QixVQUFNLG9CQUFvQjtBQUMxQixVQUFNLGtCQUFrQjtBQUd4QixVQUFNLE9BQU8s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
