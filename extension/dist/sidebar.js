(() => {
  // src/sidebar.js
  (() => {
    if (window.__ehrFhirSidebarMounted) return;
    window.__ehrFhirSidebarMounted = true;
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
        const { syncMode } = await chrome.storage.sync.get("syncMode");
        host.style.display = syncMode === "backend" ? "" : "none";
      } catch {
        host.style.display = "none";
      }
    }
    _applyModeVisibility();
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "sync" && "syncMode" in changes) _applyModeVisibility();
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3NpZGViYXIuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIE5ISS1GSElSIEJyaWRnZSBcdTIwMTQgY29sbGFwc2libGUgcmlnaHQtc2lkZSBwYW5lbCBpbmplY3RlZCBpbnRvIEhJUyBwYWdlcy5cbi8vXG4vLyBHb2FscyBvZiB0aGlzIFBvQzpcbi8vIDEuIFByb3ZlIHdlIGNhbiByZW5kZXIgYW4gaWZyYW1lIG9mIHRoZSBtZWRpY2FsLW5vdGUgU01BUlQgYXBwIGluc2lkZVxuLy8gICAgdGhlIE5ISSBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0EgcGFnZSB3aXRob3V0IENTUCAvIFgtRnJhbWUtT3B0aW9ucyBpc3N1ZXMuXG4vLyAyLiBLZWVwIHRoZSBzaWRlYmFyIGlzb2xhdGVkIGZyb20gdGhlIGhvc3QgcGFnZSdzIENTUyB2aWEgU2hhZG93IERPTVxuLy8gICAgc28gSElTLXNwZWNpZmljIHN0eWxlcyBjYW4ndCBibGVlZCBpbiBhbmQgYnJlYWsgbGF5b3V0LlxuLy8gMy4gR2l2ZSBhIHNpbmdsZSB0b2dnbGUgYnV0dG9uIChcdUQ4M0RcdURDQ0IpIGF0IHRoZSByaWdodCBlZGdlIHRoYXQgc2xpZGVzIHRoZVxuLy8gICAgcGFuZWwgaW4vb3V0LiBTdGF0ZSBwZXJzaXN0cyBhY3Jvc3MgbmF2aWdhdGlvbnMgb24gdGhlIHNhbWUgb3JpZ2luXG4vLyAgICB2aWEgY2hyb21lLnN0b3JhZ2UubG9jYWwuXG4vL1xuLy8gTm90IGluIHNjb3BlIGhlcmU6XG4vLyAtIHBvc3RNZXNzYWdlIGJyaWRnZSBmcm9tIHRoZSBpZnJhbWUgdG8gdGhlIFNXIChkYXRlLXJhbmdlIHRvb2wgY2FsbHMpLlxuLy8gICBUaGF0IGNvbWVzIG9uY2Ugd2UgY29uZmlybSB0aGUgYmFzaWMgZW1iZWQgcmVuZGVycy5cbi8vIC0gUGVyLUhJUyBhdXRoIGhhbmRvZmYgKEZISVIgbGF1bmNoIHRva2VuLCBldGMuKS5cblxuKCgpID0+IHtcbiAgLy8gRG9uJ3QgZG91YmxlLWluamVjdCBcdTIwMTQgdGhlIHNhbWUgc2NyaXB0IGNhbiByZS1ydW4gb24gU1BBIHJvdXRlXG4gIC8vIGNoYW5nZXMgdGhhdCBkb24ndCByZWxvYWQgdGhlIGRvY3VtZW50LlxuICBpZiAod2luZG93Ll9fZWhyRmhpclNpZGViYXJNb3VudGVkKSByZXR1cm47XG4gIHdpbmRvdy5fX2VockZoaXJTaWRlYmFyTW91bnRlZCA9IHRydWU7XG5cbiAgY29uc3QgU0lERUJBUl9ERUZBVUxUX1dJRFRIID0gNDIwO1xuICBjb25zdCBTSURFQkFSX01JTl9XSURUSCA9IDI4MDtcbiAgY29uc3QgU0lERUJBUl9NQVhfV0lEVEggPSAxMjAwO1xuICBjb25zdCBTVE9SQUdFX0tFWSA9IFwic2lkZWJhcl9vcGVuXCI7XG4gIGNvbnN0IFdJRFRIX0tFWSA9IFwic2lkZWJhcl93aWR0aFwiO1xuICAvLyBUaGUgU01BUlQgbGF1bmNoIGVudHJ5IHRoYXQgZmhpcmNsaWVudCBleHBlY3RzIHRvIGhhbmRsZSB0aGUgaXNzK2xhdW5jaFxuICAvLyBwYXJhbXMgYW5kIHJ1biBGSElSLm9hdXRoMi5hdXRob3JpemUoKS5cbiAgY29uc3QgQVBQX0xBVU5DSF9QQVRIID0gXCIvc21hcnQvbGF1bmNoXCI7XG4gIC8vIENocm9tZSdzIFByaXZhdGUgTmV0d29yayBBY2Nlc3MgYmxvY2tzIGZldGNoZXMgZnJvbSBwdWJsaWMgb3JpZ2luc1xuICAvLyAoZ2l0aHViLmlvKSBpbnRvIGxvb3BiYWNrIChsb2NhbGhvc3QpIGV2ZW4gd2hlbiB0aGUgc2VydmVyIHJldHVybnNcbiAgLy8gQWNjZXNzLUNvbnRyb2wtQWxsb3ctUHJpdmF0ZS1OZXR3b3JrOiB0cnVlIFx1MjAxNCBhcHBhcmVudGx5IHRoaXMgaXMgYmVpbmdcbiAgLy8gdGlnaHRlbmVkIHRvIFwiYWx3YXlzIGJsb2NrXCIgaW4gbmV3ZXIgQ2hyb21lcy4gRWFzaWVzdCBmaXggaXMgdG8gcG9pbnRcbiAgLy8gdGhlIGlmcmFtZSBhdCB0aGUgbG9jYWwgZGV2IHNlcnZlciBvZiBtZWRpY2FsLW5vdGUgKGxvY2FsaG9zdDozMDAxKSxcbiAgLy8gc2FtZSBzY2hlbWUgYXMgYmFja2VuZCwgc28gbm8gUE5BIGNyb3NzaW5nIGhhcHBlbnMgYXQgYWxsLiBGYWxscyBiYWNrXG4gIC8vIHRvIHRoZSBkZXBsb3llZCBnaXRodWIuaW8gYXBwIHdoZW4gdGhlIGxvY2FsIG9uZSBpc24ndCBydW5uaW5nLlxuICAvLyBMb2NhbCBOZXh0LmpzIGRldiBzZXJ2ZXI6IHJ1bnMgYXQgcm9vdCAobm8gL21lZGljYWwtbm90ZS1zbWFydC1vbi1maGlyXG4gIC8vIHByZWZpeCBcdTIwMTQgdGhlIGxhdW5jaCBwYWdlIGRldGVjdHMgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lIGFuZCBzZXRzXG4gIC8vIHByZWZpeCA9IFwiXCIgd2hlbiBub3Qgb24gdGhlIGdpdGh1Yi5pbyByZXBvIHN1YnBhdGgpLlxuICBjb25zdCBBUFBfQkFTRV9MT0NBTCA9IFwiaHR0cDovL2xvY2FsaG9zdDozMDAxXCI7XG4gIGNvbnN0IEFQUF9CQVNFX0RFUExPWUVEID0gXCJodHRwczovL3ZvaG8wMDAwLmdpdGh1Yi5pby9tZWRpY2FsLW5vdGUtc21hcnQtb24tZmhpclwiO1xuICBjb25zdCBERUZBVUxUX0JBQ0tFTkQgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODAxMFwiO1xuXG4gIC8vIEhvc3QgZWxlbWVudCArIFNoYWRvdyByb290IHNvIHRoZSBob3N0IHBhZ2UncyBDU1MgbmV2ZXIgdG91Y2hlcyB1cy5cbiAgY29uc3QgaG9zdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGhvc3QuaWQgPSBcIm5oaS1maGlyLXNpZGViYXItaG9zdFwiO1xuICAvLyBQaW4gdG8gdGhlIHBhZ2UsIGFib3ZlIGFsbW9zdCBldmVyeXRoaW5nLiBOSEkgdXNlcyBzb21lIHotaW5kZXhcbiAgLy8gdmFsdWVzIGJ1dCBub3RoaW5nIGFib3ZlIDk5OTkuXG4gIGhvc3Quc3R5bGUuY3NzVGV4dCA9IGBcbiAgICBhbGw6IGluaXRpYWw7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIHRvcDogMDtcbiAgICByaWdodDogMDtcbiAgICBoZWlnaHQ6IDEwMHZoO1xuICAgIHotaW5kZXg6IDIxNDc0ODM2NDY7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIGA7XG4gIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZChob3N0KTtcblxuICAvLyBUaGUgc2lkZWJhcidzIGFzc2lzdGFudCBidXR0b24gKyBpZnJhbWUgcGFuZWwgYXJlIG9ubHkgdXNlZnVsIGluXG4gIC8vIFwiXHU0RTBBXHU1MEIzXHU1RjhDXHU3QUVGXCIgbW9kZSBcdTIwMTQgdGhlIGlmcmFtZSBpcyBhIFNNQVJUIGFwcCB0aGF0IHRhbGtzIHRvIHRoZSBsb2NhbFxuICAvLyBGSElSIGJhY2tlbmQuIEluIFwiXHU0RTBCXHU4RjA5XHU1MjMwXHU5NkZCXHU4MTY2XCIgbW9kZSB0aGVyZSdzIG5vIGJhY2tlbmQgdG8gdGFsayB0byxcbiAgLy8gc28gaGlkZSB0aGUgd2hvbGUgdGhpbmcuIFRvZ2dsZSBsaXZlIHdoZW4gdGhlIHBvcHVwIHN3aXRjaGVzIG1vZGVzLlxuICBhc3luYyBmdW5jdGlvbiBfYXBwbHlNb2RlVmlzaWJpbGl0eSgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBzeW5jTW9kZSB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoXCJzeW5jTW9kZVwiKTtcbiAgICAgIGhvc3Quc3R5bGUuZGlzcGxheSA9IHN5bmNNb2RlID09PSBcImJhY2tlbmRcIiA/IFwiXCIgOiBcIm5vbmVcIjtcbiAgICB9IGNhdGNoIHtcbiAgICAgIGhvc3Quc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cbiAgfVxuICBfYXBwbHlNb2RlVmlzaWJpbGl0eSgpO1xuICBjaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIGFyZWEpID0+IHtcbiAgICBpZiAoYXJlYSA9PT0gXCJzeW5jXCIgJiYgXCJzeW5jTW9kZVwiIGluIGNoYW5nZXMpIF9hcHBseU1vZGVWaXNpYmlsaXR5KCk7XG4gIH0pO1xuXG4gIGNvbnN0IHJvb3QgPSBob3N0LmF0dGFjaFNoYWRvdyh7IG1vZGU6IFwib3BlblwiIH0pO1xuICByb290LmlubmVySFRNTCA9IGBcbiAgICA8c3R5bGU+XG4gICAgICA6aG9zdCwgKiB7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7IH1cbiAgICAgIC50b2dnbGUge1xuICAgICAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgICAgIHRvcDogNTAlO1xuICAgICAgICByaWdodDogMDtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xuICAgICAgICB3aWR0aDogMjhweDtcbiAgICAgICAgaGVpZ2h0OiA4MHB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiAjMWUzYThhO1xuICAgICAgICBjb2xvcjogd2hpdGU7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4IDAgMCA4cHg7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgICBmb250LWZhbWlseTogLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBzYW5zLXNlcmlmO1xuICAgICAgICBib3gtc2hhZG93OiAtMnB4IDJweCA4cHggcmdiYSgwLDAsMCwwLjE1KTtcbiAgICAgICAgcG9pbnRlci1ldmVudHM6IGF1dG87XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICB3cml0aW5nLW1vZGU6IHZlcnRpY2FsLXJsO1xuICAgICAgICB0ZXh0LW9yaWVudGF0aW9uOiBtaXhlZDtcbiAgICAgICAgdHJhbnNpdGlvbjogcmlnaHQgMC4ycyBlYXNlO1xuICAgICAgfVxuICAgICAgLnRvZ2dsZTpob3ZlciB7IGJhY2tncm91bmQ6ICMxZTQwYWY7IH1cbiAgICAgIC5wYW5lbCB7XG4gICAgICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICAgICAgdG9wOiAwO1xuICAgICAgICByaWdodDogLSR7U0lERUJBUl9ERUZBVUxUX1dJRFRIICsgMzB9cHg7XG4gICAgICAgIGhlaWdodDogMTAwdmg7XG4gICAgICAgIHdpZHRoOiAke1NJREVCQVJfREVGQVVMVF9XSURUSH1weDtcbiAgICAgICAgYmFja2dyb3VuZDogd2hpdGU7XG4gICAgICAgIGJveC1zaGFkb3c6IC00cHggMCAxMnB4IHJnYmEoMCwwLDAsMC4xKTtcbiAgICAgICAgLyogTm8gdHJhbnNpdGlvbiB3aGlsZSB1c2VyIGlzIGRyYWdnaW5nIFx1MjAxNCBzZXQgaW5saW5lLiAqL1xuICAgICAgICB0cmFuc2l0aW9uOiByaWdodCAwLjI1cyBlYXNlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBwb2ludGVyLWV2ZW50czogYXV0bztcbiAgICAgICAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCAjZTVlN2ViO1xuICAgICAgfVxuICAgICAgLnBhbmVsLm9wZW4geyByaWdodDogMDsgfVxuICAgICAgLyogRHJhZyBoYW5kbGUgb24gdGhlIExFRlQgZWRnZSBvZiB0aGUgb3BlbiBwYW5lbC4gV2lkZSBlbm91Z2hcbiAgICAgICAgICg2cHgpIHRvIGJlIGVhc3kgdG8gZ3JhYiBidXQgaW52aXNpYmxlIHVudGlsIGhvdmVyZWQuIFdoaWxlXG4gICAgICAgICBkcmFnZ2luZyB0aGUgdG9nZ2xlL3RyYW5zaXRpb24gaXMgZGlzYWJsZWQgc28gcmVzaXppbmcgZmVlbHNcbiAgICAgICAgIGNyaXNwLiAqL1xuICAgICAgLnJlc2l6ZXIge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIHRvcDogMDsgbGVmdDogLTNweDtcbiAgICAgICAgd2lkdGg6IDZweDsgaGVpZ2h0OiAxMDAlO1xuICAgICAgICBjdXJzb3I6IGV3LXJlc2l6ZTtcbiAgICAgICAgei1pbmRleDogMTtcbiAgICAgICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgICB9XG4gICAgICAucmVzaXplcjpob3ZlciwgLnBhbmVsLnJlc2l6aW5nIC5yZXNpemVyIHtcbiAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCB0cmFuc3BhcmVudCwgIzI1NjNlYjMzLCB0cmFuc3BhcmVudCk7XG4gICAgICB9XG4gICAgICAucGFuZWwucmVzaXppbmcgeyB0cmFuc2l0aW9uOiBub25lICFpbXBvcnRhbnQ7IHVzZXItc2VsZWN0OiBub25lOyB9XG4gICAgICAucGFuZWwucmVzaXppbmcgaWZyYW1lIHsgcG9pbnRlci1ldmVudHM6IG5vbmU7IH0gLyogc3dhbGxvdyBkcmFnIGluc2lkZSBpZnJhbWUgKi9cbiAgICAgIC5oZWFkZXIge1xuICAgICAgICBwYWRkaW5nOiAxMHB4IDE0cHg7XG4gICAgICAgIGJhY2tncm91bmQ6ICNmOWZhZmI7XG4gICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZTVlN2ViO1xuICAgICAgICBmb250OiA2MDAgMTNweCAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIHNhbnMtc2VyaWY7XG4gICAgICAgIGNvbG9yOiAjMWUzYThhO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICB9XG4gICAgICAuaGVhZGVyIC5jbG9zZSB7XG4gICAgICAgIGJhY2tncm91bmQ6IG5vbmU7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgICBjb2xvcjogIzZiNzI4MDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICBwYWRkaW5nOiAwIDRweDtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBtaW4td2lkdGg6IDI2cHg7XG4gICAgICAgIGhlaWdodDogMjZweDtcbiAgICAgIH1cbiAgICAgIC5oZWFkZXIgLmNsb3NlOmhvdmVyIHsgY29sb3I6ICMxZjI5Mzc7IH1cbiAgICAgIC5oZWFkZXIgLmNsb3NlIHN2ZyB7IHdpZHRoOiAxNnB4OyBoZWlnaHQ6IDE2cHg7IH1cbiAgICAgIGlmcmFtZSB7XG4gICAgICAgIGZsZXg6IDE7XG4gICAgICAgIGJvcmRlcjogMDtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGJhY2tncm91bmQ6IHdoaXRlO1xuICAgICAgfVxuICAgICAgLmVtcHR5IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGZsZXg6IDE7XG4gICAgICAgIGNvbG9yOiAjOWNhM2FmO1xuICAgICAgICBmb250OiAxM3B4IC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgc2Fucy1zZXJpZjtcbiAgICAgICAgZ2FwOiAxMnB4O1xuICAgICAgICBwYWRkaW5nOiAyMHB4O1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICB9XG4gICAgICAuZW1wdHkgYnV0dG9uIHtcbiAgICAgICAgcGFkZGluZzogOHB4IDE2cHg7XG4gICAgICAgIGJhY2tncm91bmQ6ICMyNTYzZWI7XG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA2cHg7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgZm9udC1zaXplOiAxM3B4O1xuICAgICAgfVxuICAgIDwvc3R5bGU+XG5cbiAgICA8YnV0dG9uIGNsYXNzPVwidG9nZ2xlXCIgaWQ9XCJ0b2dnbGVcIiB0aXRsZT1cIk5ISS1GSElSIEJyaWRnZSBcdTUyQTlcdTc0MDZcdTk3NjJcdTY3N0ZcIj5cdUQ4M0RcdURDQ0IgXHU1MkE5XHU3NDA2PC9idXR0b24+XG4gICAgPGRpdiBjbGFzcz1cInBhbmVsXCIgaWQ9XCJwYW5lbFwiPlxuICAgICAgPGRpdiBjbGFzcz1cInJlc2l6ZXJcIiBpZD1cInJlc2l6ZXJcIiB0aXRsZT1cIlx1NjJENlx1NjZGM1x1OEFCRlx1NjU3NFx1NUJFQ1x1NUVBNlwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImhlYWRlclwiPlxuICAgICAgICA8c3Bhbj5cdUQ4M0NcdURGRTUgTkhJLUZISVIgQnJpZGdlIFx1NTJBOVx1NzQwNjwvc3Bhbj5cbiAgICAgICAgPHNwYW4gc3R5bGU9XCJkaXNwbGF5OmZsZXg7Z2FwOjRweFwiPlxuICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJjbG9zZVwiIGlkPVwicG9wb3V0XCIgdGl0bGU9XCJcdTc5RkJcdTUyMzBcdTczNjhcdTdBQ0JcdTg5OTZcdTdBOTcgKHBvcC1vdXQpXCIgYXJpYS1sYWJlbD1cInBvcCBvdXRcIj5cbiAgICAgICAgICAgIDwhLS0gXCJleHRlcm5hbCBsaW5rIC8gb3BlbiBpbiBuZXcgd2luZG93XCIgaWNvbi4gSW5saW5lIFNWRyBzb1xuICAgICAgICAgICAgICAgICBpdCByZW5kZXJzIHRoZSBzYW1lIG9uIGV2ZXJ5IE9TIHdpdGhvdXQgcmVseWluZyBvbiBlbW9qaVxuICAgICAgICAgICAgICAgICBmb250IGNvdmVyYWdlLiAtLT5cbiAgICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICAgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPlxuICAgICAgICAgICAgICA8cGF0aCBkPVwiTTE0IDRoNnY2XCIvPlxuICAgICAgICAgICAgICA8cGF0aCBkPVwiTTIwIDQgMTIgMTJcIi8+XG4gICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTkgMTN2NmEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMlY3YTIgMiAwIDAgMSAyLTJoNlwiLz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJjbG9zZVwiIGlkPVwicmVsb2FkXCIgdGl0bGU9XCJcdTVGMzdcdTUyMzZcdTkxQ0RcdTY1QjBcdThGMDlcdTUxNjVcdTUyQTlcdTc0MDYgKFx1N0U1RSBjYWNoZSlcIj5cdUQ4M0RcdUREMDQ8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiY2xvc2VcIiBpZD1cImNsb3NlXCIgdGl0bGU9XCJcdTY1MzZcdThENzdcIj5cdTI3MTU8L2J1dHRvbj5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiZW1wdHlcIiBpZD1cImVtcHR5XCI+XG4gICAgICAgIDxkaXY+XHU3QjJDXHU0RTAwXHU2QjIxXHU0RjdGXHU3NTI4IFx1MjAxNCBcdTlFREVcdTRFMEJcdTY1QjlcdThGMDlcdTUxNjUgbWVkaWNhbC1ub3RlIFx1NTJBOVx1NzQwNjwvZGl2PlxuICAgICAgICA8YnV0dG9uIGlkPVwibG9hZFwiPlx1OEYwOVx1NTE2NVx1NTJBOVx1NzQwNiAofjNzKTwvYnV0dG9uPlxuICAgICAgICA8ZGl2IHN0eWxlPVwiZm9udC1zaXplOjExcHg7Y29sb3I6IzljYTNhZjttYXJnaW4tdG9wOjhweFwiPlxuICAgICAgICAgIFx1OEYwOVx1NTE2NVx1NUY4Q1x1NTNFRlx1NEZERFx1NjMwMVx1OTU4Qlx1NTU1Rlx1RkYxQlx1NTIwN1x1NTIzMFx1NTE3Nlx1NEVENlx1NzVDNVx1NEVCQVx1NjY0Mlx1NzUyOFx1NURFNlx1NEUwQVx1NzY4NCBwYXRpZW50IHBpY2tlciBcdTUyMDdcdTYzREJcbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYDtcblxuICBjb25zdCBwYW5lbCA9IHJvb3QuZ2V0RWxlbWVudEJ5SWQoXCJwYW5lbFwiKTtcbiAgY29uc3QgdG9nZ2xlQnRuID0gcm9vdC5nZXRFbGVtZW50QnlJZChcInRvZ2dsZVwiKTtcbiAgY29uc3QgY2xvc2VCdG4gPSByb290LmdldEVsZW1lbnRCeUlkKFwiY2xvc2VcIik7XG4gIGNvbnN0IGxvYWRCdG4gPSByb290LmdldEVsZW1lbnRCeUlkKFwibG9hZFwiKTtcbiAgY29uc3QgZW1wdHlCb3ggPSByb290LmdldEVsZW1lbnRCeUlkKFwiZW1wdHlcIik7XG4gIGNvbnN0IHJlc2l6ZXIgPSByb290LmdldEVsZW1lbnRCeUlkKFwicmVzaXplclwiKTtcbiAgY29uc3QgcG9wb3V0QnRuID0gcm9vdC5nZXRFbGVtZW50QnlJZChcInBvcG91dFwiKTtcblxuICAvLyBcdTI1MDBcdTI1MDAgV2lkdGggcGVyc2lzdGVuY2UgKyBkcmFnLXRvLXJlc2l6ZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gVGhlIHBhbmVsJ3Mgd2lkdGggaXMgcmVzdG9yZWQgZnJvbSBzdG9yYWdlIGFuZCB0aGUgQ1NTIHJ1bGUgdGhhdFxuICAvLyBoaWRlcyB0aGUgcGFuZWwgb2ZmLXNjcmVlbiAoXCJyaWdodDogLTx3aWR0aCszMD5weFwiKSBpcyByZXdyaXR0ZW4gaW5cbiAgLy8gc3luYy4gV2UgY2FuJ3QgdG91Y2ggdGhlIG9yaWdpbmFsIDxzdHlsZT4gcnVsZSwgc28gd2Ugb3ZlcnJpZGUgdmlhXG4gIC8vIGFuIGlubGluZSBgcmlnaHRgIHN0eWxlIHdoZW4gdGhlIHBhbmVsIGlzIGNsb3NlZC5cbiAgbGV0IGN1cnJlbnRXaWR0aCA9IFNJREVCQVJfREVGQVVMVF9XSURUSDtcbiAgZnVuY3Rpb24gYXBwbHlXaWR0aChweCkge1xuICAgIGN1cnJlbnRXaWR0aCA9IE1hdGgubWF4KFNJREVCQVJfTUlOX1dJRFRILCBNYXRoLm1pbihTSURFQkFSX01BWF9XSURUSCwgTWF0aC5yb3VuZChweCkpKTtcbiAgICBwYW5lbC5zdHlsZS53aWR0aCA9IGAke2N1cnJlbnRXaWR0aH1weGA7XG4gICAgLy8gS2VlcCB0aGUgb2ZmLXNjcmVlbiBvZmZzZXQgaW4gc3luYyAoc2xpZ2h0bHkgbW9yZSB0aGFuIHdpZHRoIHNvXG4gICAgLy8gdGhlIGJveC1zaGFkb3cgaXMgaGlkZGVuIHRvbykuXG4gICAgaWYgKCFwYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoXCJvcGVuXCIpKSB7XG4gICAgICBwYW5lbC5zdHlsZS5yaWdodCA9IGAtJHtjdXJyZW50V2lkdGggKyAzMH1weGA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhbmVsLnN0eWxlLnJpZ2h0ID0gXCIwXCI7XG4gICAgfVxuICAgIC8vIE1vdmUgdGhlIHRvZ2dsZSBoYW5kbGUgdG8gc2l0IGZsdXNoIHdpdGggdGhlIG9wZW4gcGFuZWwncyBsZWZ0IGVkZ2UuXG4gICAgdG9nZ2xlQnRuLnN0eWxlLnJpZ2h0ID0gcGFuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwib3BlblwiKSA/IGAke2N1cnJlbnRXaWR0aH1weGAgOiBcIjBcIjtcbiAgfVxuICAvLyBJbml0aWFsOiByZXN0b3JlIGxhc3QtdXNlZCB3aWR0aC5cbiAgaWYgKGlzQ29udGV4dEFsaXZlKCkpIHtcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoV0lEVEhfS0VZKS50aGVuKChkKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGRbV0lEVEhfS0VZXSA9PT0gXCJudW1iZXJcIikgYXBwbHlXaWR0aChkW1dJRFRIX0tFWV0pO1xuICAgIH0pLmNhdGNoKCgpID0+IHt9KTtcbiAgfVxuICAvLyBEcmFnOiB0cmFjayBkZWx0YSB2cy4gc3RhcnRpbmcgbW91c2VYLCByZWNvbXB1dGUgd2lkdGggb24gZWFjaCBtb3ZlLlxuICBsZXQgZHJhZ1N0YXJ0WCA9IDAsIGRyYWdTdGFydFcgPSAwO1xuICBmdW5jdGlvbiBvbkRyYWdNb3ZlKGUpIHtcbiAgICAvLyBSZXNpemVyIGlzIG9uIHRoZSBMRUZUIGVkZ2UgXHUyMDE0IGRyYWdnaW5nIGxlZnQgZ3Jvd3MgdGhlIHBhbmVsLlxuICAgIGNvbnN0IGRlbHRhID0gZHJhZ1N0YXJ0WCAtIGUuY2xpZW50WDtcbiAgICBhcHBseVdpZHRoKGRyYWdTdGFydFcgKyBkZWx0YSk7XG4gIH1cbiAgZnVuY3Rpb24gb25EcmFnRW5kKCkge1xuICAgIHBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoXCJyZXNpemluZ1wiKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgb25EcmFnTW92ZSk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJ1cFwiLCBvbkRyYWdFbmQpO1xuICAgIGlmIChpc0NvbnRleHRBbGl2ZSgpKSB7XG4gICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBbV0lEVEhfS0VZXTogY3VycmVudFdpZHRoIH0pLmNhdGNoKCgpID0+IHt9KTtcbiAgICB9XG4gIH1cbiAgcmVzaXplci5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcmRvd25cIiwgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZHJhZ1N0YXJ0WCA9IGUuY2xpZW50WDtcbiAgICBkcmFnU3RhcnRXID0gY3VycmVudFdpZHRoO1xuICAgIHBhbmVsLmNsYXNzTGlzdC5hZGQoXCJyZXNpemluZ1wiKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgb25EcmFnTW92ZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJ1cFwiLCBvbkRyYWdFbmQpO1xuICB9KTtcblxuICAvLyBcdTI1MDBcdTI1MDAgUG9wLW91dCB0byBzdGFuZGFsb25lIHdpbmRvdyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gT3BlbnMgdGhlIHNhbWUgaWZyYW1lIFVSTCBpbiBhIGZyZXNoIHdpbmRvdyBzbyB0aGUgdXNlciBjYW4gbW92ZSBpdFxuICAvLyB0byBhIHNlY29uZCBtb25pdG9yIC8gcmVzaXplIGZyZWVseS4gU2lkZWJhciBhdXRvLWNvbGxhcHNlcyBhZnRlcixcbiAgLy8gc2luY2UgYm90aCBzaG93aW5nIGl0IHNpZGUtYnktc2lkZSB3b3VsZCBiZSBjb25mdXNpbmcuXG4gIGxldCBwb3BvdXRXaW4gPSBudWxsO1xuICBhc3luYyBmdW5jdGlvbiBwb3BPdXQoKSB7XG4gICAgbGV0IHVybDtcbiAgICB0cnkgeyB1cmwgPSBhd2FpdCBidWlsZElmcmFtZVVybCgpOyB9XG4gICAgY2F0Y2ggKGVycikgeyBjb25zb2xlLndhcm4oXCJbbmhpLWZoaXIgc2lkZWJhcl0gcG9wT3V0OlwiLCBlcnIubWVzc2FnZSk7IHJldHVybjsgfVxuICAgIC8vIElmIHdlIGFscmVhZHkgaGF2ZSBhbiBvcGVuIHBvcHVwLCByZXVzZSBpdCAocmFpc2VzIHRoZSBleGlzdGluZ1xuICAgIC8vIHdpbmRvdykuIFRoZSAybmQgd2luZG93Lm9wZW4gY2FsbCB3aXRoIHRoZSBzYW1lIG5hbWUgcmVsb2FkcyBpdC5cbiAgICBwb3BvdXRXaW4gPSB3aW5kb3cub3Blbih1cmwsIFwibmhpLWZoaXItYnJpZGdlLWFzc2lzdGFudFwiLFxuICAgICAgYHdpZHRoPSR7Y3VycmVudFdpZHRofSxoZWlnaHQ9OTAwLHJlc2l6YWJsZT15ZXMsc2Nyb2xsYmFycz15ZXNgKTtcbiAgICBpZiAocG9wb3V0V2luKSB7XG4gICAgICBwb3BvdXRXaW4uZm9jdXMoKTtcbiAgICAgIC8vIENvbGxhcHNlIHRoZSBzaWRlYmFyIHNvIHRoZSB1c2VyIGlzbid0IHN0YXJpbmcgYXQgdGhlIHNhbWUgYXBwXG4gICAgICAvLyBpbiB0d28gcGxhY2VzLlxuICAgICAgc2V0T3BlbihmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQnVpbGQgdGhlIGlmcmFtZSBVUkwuIFdoZW4gd2UgaGF2ZSBhIHBhdGllbnRfaWQgKyBhIHdvcmtpbmcgYmFja2VuZFxuICAvLyB3ZSBoYW5kIHRoZSBhcHAgYSBTTUFSVCBFSFItTGF1bmNoIGNvbnRleHQgc28gaXQgYXV0by1sb2FkcyBPVVJcbiAgLy8gbG9jYWwgRkhJUiBzdG9yZS4gT3RoZXJ3aXNlIGp1c3Qgb3BlbiB0aGUgYXBwIGhvbWUgKGl0J2xsIHNob3cgaXRzXG4gIC8vIGRlZmF1bHQgbGFuZGluZyAvIGEgcHVibGljIHRlc3Qgc2VydmVyKS5cbiAgLy8gRGV0ZWN0IG9ycGhhbmVkIGNvbnRlbnQgc2NyaXB0OiBhZnRlciB0aGUgdXNlciByZWxvYWRzIHRoZSBleHRlbnNpb25cbiAgLy8gZnJvbSBjaHJvbWU6Ly9leHRlbnNpb25zLCB0aGlzIHNjcmlwdCdzIGNocm9tZS5ydW50aW1lLmlkIGxpbmsgZ29lc1xuICAvLyBudWxsIGFuZCBhbnkgY2hyb21lLiogY2FsbCB0aHJvd3MgXCJFeHRlbnNpb24gY29udGV4dCBpbnZhbGlkYXRlZFwiLlxuICAvLyBUaGUgZml4IGlzIGFsd2F5cyBhIHBhZ2UgcmVmcmVzaCBcdTIwMTQgd2UganVzdCBzdXJmYWNlIGEgY2xlYXJlciBlcnJvci5cbiAgZnVuY3Rpb24gaXNDb250ZXh0QWxpdmUoKSB7XG4gICAgdHJ5IHsgcmV0dXJuICEhY2hyb21lLnJ1bnRpbWU/LmlkOyB9IGNhdGNoIHsgcmV0dXJuIGZhbHNlOyB9XG4gIH1cblxuICAvLyBBbHdheXMgcHJlZmVyIHRoZSBsb2NhbCBOZXh0LmpzIGRldiBzZXJ2ZXIgKFBOQS1mcmVlIHBhdGgpLiBUaGVcbiAgLy8gY29udGVudCBzY3JpcHQgY2FuJ3QgcHJvYmUgbG9jYWxob3N0IGZyb20gdGhlIE5ISSBvcmlnaW4gKFBOQSBhZ2FpbiksXG4gIC8vIHNvIHdlIGp1c3QgdHJ1c3QgdGhlIHVzZXIgdG8gaGF2ZSBgbnBtIHJ1biBkZXZgIHJ1bm5pbmcgYW5kIGxldCB0aGVcbiAgLy8gaWZyYW1lIHN1cmZhY2UgYSBcImNvbm5lY3Rpb24gcmVmdXNlZFwiIGlmIHRoZXkgZG9uJ3QuIEEgZnV0dXJlIHNldHRpbmdcbiAgLy8gY2FuIGxldCB1c2VycyBmbGlwIHRvIHRoZSBkZXBsb3llZCBVUkwuXG4gIGFzeW5jIGZ1bmN0aW9uIHBpY2tBcHBCYXNlKCkge1xuICAgIGNvbnN0IHsgc2lkZWJhckFwcEJhc2UgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFwic2lkZWJhckFwcEJhc2VcIikuY2F0Y2goKCkgPT4gKHt9KSk7XG4gICAgcmV0dXJuIHNpZGViYXJBcHBCYXNlIHx8IEFQUF9CQVNFX0xPQ0FMO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gYnVpbGRJZnJhbWVVcmwoKSB7XG4gICAgY29uc3QgY2FjaGVCdXN0ID0gYF89JHtEYXRlLm5vdygpfWA7XG4gICAgaWYgKCFpc0NvbnRleHRBbGl2ZSgpKSB7XG4gICAgICAvLyBDaHJvbWUgaW52YWxpZGF0ZXMgYSBjb250ZW50IHNjcmlwdCdzIGNocm9tZS4qIEFQSXMgdGhlIG1vbWVudFxuICAgICAgLy8gdGhlIGV4dGVuc2lvbiBpdHNlbGYgaXMgdXBkYXRlZCAvIHJlbG9hZGVkLiBUaGUgc2NyaXB0IGtlZXBzXG4gICAgICAvLyBydW5uaW5nIG9uIHRoZSBwYWdlIGJ1dCBjYW4gbm8gbG9uZ2VyIHRhbGsgdG8gc3RvcmFnZSAvIFNXIFx1MjAxNFxuICAgICAgLy8gdXNlciBoYXMgdG8gRjUgdGhlIE5ISSB0YWIgc28gYSBmcmVzaCBjb3B5IG9mIHNpZGViYXIuanMgZ2V0c1xuICAgICAgLy8gaW5qZWN0ZWQuIFBocmFzZSB0aGlzIHdpdGhvdXQgamFyZ29uLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBcIlx1NjRGNFx1NTE0NVx1NTI5Rlx1ODBGRFx1NTI1Qlx1NjZGNFx1NjVCMFx1OTA0RVx1RkYwQ1x1OEFDQlx1NjMwOSBGNSBcdTkxQ0RcdTY1QjBcdTY1NzRcdTc0MDZcdTkwMTlcdTUwMEJcdTk4MDFcdTk3NjJcdTVDMzFcdTgwRkRcdTYwNjJcdTVGQTlcdTUyQTlcdTc0MDZcdTk3NjJcdTY3N0ZcdTMwMDJcXG5cIiArXG4gICAgICAgIFwiKEV4dGVuc2lvbiB3YXMganVzdCB1cGRhdGVkIFx1MjAxNCBwcmVzcyBGNSBvbiB0aGlzIHBhZ2UgdG8gcmVsb2FkIHRoZSBzaWRlYmFyLilcIixcbiAgICAgICk7XG4gICAgfVxuICAgIGNvbnN0IHsgcGF0aWVudE92ZXJyaWRlLCBiYWNrZW5kVXJsIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChbXG4gICAgICBcInBhdGllbnRPdmVycmlkZVwiLCBcImJhY2tlbmRVcmxcIixcbiAgICBdKS5jYXRjaCgoKSA9PiAoe30pKTtcbiAgICBjb25zdCBiYWNrZW5kID0gKGJhY2tlbmRVcmwgfHwgREVGQVVMVF9CQUNLRU5EKS5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG4gICAgY29uc3QgcGF0aWVudElkID0gcGF0aWVudE92ZXJyaWRlPy5pZF9ubztcbiAgICBjb25zdCBhcHBCYXNlID0gYXdhaXQgcGlja0FwcEJhc2UoKTtcbiAgICBjb25zdCBhcHBIb21lID0gYCR7YXBwQmFzZX0vYDtcbiAgICBpZiAoIXBhdGllbnRJZCkge1xuICAgICAgLy8gTm8gcGF0aWVudCBjb250ZXh0IHlldCBcdTIwMTQgbG9hZCB0aGUgYXBwIGJhcmU7IHVzZXIgY2FuIGZpbGwgdGhlXG4gICAgICAvLyBwb3B1cCdzIFx1RDgzRVx1REVBQSBhcmVhIGFuZCBjbGljayBcdUQ4M0RcdUREMDQgdG8gcmVsYXVuY2ggd2l0aCBjb250ZXh0LlxuICAgICAgcmV0dXJuIGAke2FwcEhvbWV9PyR7Y2FjaGVCdXN0fWA7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goYCR7YmFja2VuZH0vc21hcnQvbGF1bmNoLWNvbnRleHRgLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBwYXRpZW50X2lkOiBwYXRpZW50SWQgfSksXG4gICAgICB9KTtcbiAgICAgIGlmICghci5vaykgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7ci5zdGF0dXN9YCk7XG4gICAgICBjb25zdCB7IGxhdW5jaCB9ID0gYXdhaXQgci5qc29uKCk7XG4gICAgICBjb25zdCBpc3MgPSBgJHtiYWNrZW5kfS9maGlyYDtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoeyBpc3MsIGxhdW5jaCB9KTtcbiAgICAgIHJldHVybiBgJHthcHBCYXNlfSR7QVBQX0xBVU5DSF9QQVRIfT8ke3BhcmFtcy50b1N0cmluZygpfSYke2NhY2hlQnVzdH1gO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS53YXJuKFwiW25oaS1maGlyIHNpZGViYXJdIGxhdW5jaC1jb250ZXh0IGZhaWxlZCwgZmFsbGluZyBiYWNrIHRvIGJhcmUgYXBwOlwiLCBlcnIpO1xuICAgICAgcmV0dXJuIGAke2FwcEhvbWV9PyR7Y2FjaGVCdXN0fWA7XG4gICAgfVxuICB9XG5cbiAgbGV0IGlmcmFtZUVsID0gbnVsbDtcbiAgYXN5bmMgZnVuY3Rpb24gbG9hZElmcmFtZSgpIHtcbiAgICBpZiAoaWZyYW1lRWwpIHJldHVybjtcbiAgICBsZXQgc3JjO1xuICAgIHRyeSB7IHNyYyA9IGF3YWl0IGJ1aWxkSWZyYW1lVXJsKCk7IH1cbiAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBVc2UgdGV4dENvbnRlbnQgKyB3aGl0ZS1zcGFjZTpwcmUtbGluZSBzbyBtdWx0aS1saW5lIGJpbGluZ3VhbFxuICAgICAgLy8gbWVzc2FnZXMgZnJvbSBidWlsZElmcmFtZVVybCByZW5kZXIgd2l0aCB0aGVpciBsaW5lIGJyZWFrc1xuICAgICAgLy8gaW50YWN0IChhbmQgd2UgZG9uJ3QgaGF2ZSB0byB3b3JyeSBhYm91dCBIVE1MIGVzY2FwaW5nKS5cbiAgICAgIGVtcHR5Qm94LnRleHRDb250ZW50ID0gXCJcIjtcbiAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBkaXYuc3R5bGUuY3NzVGV4dCA9IFwiY29sb3I6I2I5MWMxYzsgd2hpdGUtc3BhY2U6cHJlLWxpbmU7IGxpbmUtaGVpZ2h0OjEuNlwiO1xuICAgICAgZGl2LnRleHRDb250ZW50ID0gYFx1MjZBMCAke2Vyci5tZXNzYWdlfWA7XG4gICAgICBlbXB0eUJveC5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZnJhbWVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7XG4gICAgaWZyYW1lRWwudGl0bGUgPSBcIk1lZGljYWwgTm90ZSBTTUFSVCBvbiBGSElSXCI7XG4gICAgaWZyYW1lRWwuYWxsb3cgPSBcImNsaXBib2FyZC1yZWFkOyBjbGlwYm9hcmQtd3JpdGVcIjtcbiAgICBlbXB0eUJveC5yZW1vdmUoKTtcbiAgICBwYW5lbC5hcHBlbmRDaGlsZChpZnJhbWVFbCk7XG4gICAgaWZyYW1lRWwuc3JjID0gc3JjO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gcmVsb2FkSWZyYW1lKCkge1xuICAgIGlmICghaWZyYW1lRWwpIHsgYXdhaXQgbG9hZElmcmFtZSgpOyByZXR1cm47IH1cbiAgICB0cnkgeyBpZnJhbWVFbC5zcmMgPSBhd2FpdCBidWlsZElmcmFtZVVybCgpOyB9XG4gICAgY2F0Y2ggKGVycikgeyBjb25zb2xlLndhcm4oXCJbbmhpLWZoaXIgc2lkZWJhcl1cIiwgZXJyLm1lc3NhZ2UpOyB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRPcGVuKG9wZW4pIHtcbiAgICBwYW5lbC5jbGFzc0xpc3QudG9nZ2xlKFwib3BlblwiLCBvcGVuKTtcbiAgICAvLyBTeW5jIGlubGluZSByaWdodC90b2dnbGUgcG9zaXRpb24gd2l0aCB0aGUgb3BlbiBzdGF0ZSwgdXNpbmcgdGhlXG4gICAgLy8gKmN1cnJlbnQqIHdpZHRoICh3aGljaCBtYXkgaGF2ZSBiZWVuIHVzZXItcmVzaXplZCkuXG4gICAgYXBwbHlXaWR0aChjdXJyZW50V2lkdGgpO1xuICAgIGlmIChvcGVuKSBsb2FkSWZyYW1lKCkuY2F0Y2goKCkgPT4ge30pO1xuICAgIGlmIChpc0NvbnRleHRBbGl2ZSgpKSB7XG4gICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBbU1RPUkFHRV9LRVldOiBvcGVuIH0pLmNhdGNoKCgpID0+IHt9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCByZWxvYWRCdG4gPSByb290LmdldEVsZW1lbnRCeUlkKFwicmVsb2FkXCIpO1xuICB0b2dnbGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBzZXRPcGVuKCFwYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoXCJvcGVuXCIpKTtcbiAgfSk7XG4gIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBzZXRPcGVuKGZhbHNlKSk7XG4gIGxvYWRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGxvYWRJZnJhbWUoKSk7XG4gIHJlbG9hZEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gcmVsb2FkSWZyYW1lKCkpO1xuICBwb3BvdXRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHBvcE91dCgpKTtcblxuICAvLyBSZXN0b3JlIHByZXZpb3VzIG9wZW4vY2xvc2VkIHN0YXRlIG9uIHRoaXMgb3JpZ2luLlxuICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoU1RPUkFHRV9LRVkpLnRoZW4oKGQpID0+IHtcbiAgICBpZiAoZFtTVE9SQUdFX0tFWV0pIHNldE9wZW4odHJ1ZSk7XG4gIH0pLmNhdGNoKCgpID0+IHt9KTtcblxuICAvLyBcdTI1MDBcdTI1MDAgU3luYy1ydW5uaW5nIGlmcmFtZSBwYXVzZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gV2hpbGUgdGhlIGV4dGVuc2lvbidzIHJ1bk5oaUFwaVN5bmMgaXMgaW4gZmxpZ2h0LCB0aGUgbWVkaWNhbC1ub3RlXG4gIC8vIGlmcmFtZSBjb21wZXRlcyB3aXRoIG91ciBOSEkgZmFuLW91dCBmZXRjaGVzIGZvciB0aGUgdGFiJ3MgbmV0d29ya1xuICAvLyArIEpTIHRocmVhZCAod2Ugc2F3IE5ISSBmYW4tb3V0IHRpbWUgcm91Z2hseSB0cmlwbGUgd2hlbiB0aGlzIGlmcmFtZVxuICAvLyB3YXMgYWN0aXZlKS4gU3Rhc2ggdGhlIGlmcmFtZSdzIHNyYyBpbnRvIGFib3V0OmJsYW5rIGR1cmluZyBzeW5jIHNvXG4gIC8vIGl0cyBPQXV0aCArIEZISVIgY2FsbHMgc3RvcCBoYW1tZXJpbmcgdGhlIG5ldHdvcmsuIFJlc3VtZSBieVxuICAvLyByZS1sb2FkaW5nIGZyb20gdGhlIHNhdmVkIHNyYyB3aGVuIHN5bmMgZmluaXNoZXMuXG4gIGxldCBfcGF1c2VkU3JjID0gbnVsbDtcbiAgZnVuY3Rpb24gcGF1c2VJZnJhbWUoKSB7XG4gICAgaWYgKCFpZnJhbWVFbCB8fCBfcGF1c2VkU3JjICE9PSBudWxsKSByZXR1cm47XG4gICAgX3BhdXNlZFNyYyA9IGlmcmFtZUVsLnNyYztcbiAgICBpZnJhbWVFbC5zcmMgPSBcImFib3V0OmJsYW5rXCI7XG4gIH1cbiAgZnVuY3Rpb24gcmVzdW1lSWZyYW1lKCkge1xuICAgIGlmICghaWZyYW1lRWwgfHwgX3BhdXNlZFNyYyA9PT0gbnVsbCkgcmV0dXJuO1xuICAgIGlmcmFtZUVsLnNyYyA9IF9wYXVzZWRTcmM7XG4gICAgX3BhdXNlZFNyYyA9IG51bGw7XG4gIH1cbiAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwic3luY1J1bm5pbmdcIikudGhlbigoZCkgPT4ge1xuICAgIGlmIChkLnN5bmNSdW5uaW5nKSBwYXVzZUlmcmFtZSgpO1xuICB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gIGNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlcywgYXJlYSkgPT4ge1xuICAgIGlmIChhcmVhICE9PSBcImxvY2FsXCIgfHwgIShcInN5bmNSdW5uaW5nXCIgaW4gY2hhbmdlcykpIHJldHVybjtcbiAgICBpZiAoY2hhbmdlcy5zeW5jUnVubmluZy5uZXdWYWx1ZSkgcGF1c2VJZnJhbWUoKTtcbiAgICBlbHNlIHJlc3VtZUlmcmFtZSgpO1xuICB9KTtcbn0pKCk7XG4iXSwKICAibWFwcGluZ3MiOiAiOztBQWdCQSxHQUFDLE1BQU07QUFHTCxRQUFJLE9BQU8sd0JBQXlCO0FBQ3BDLFdBQU8sMEJBQTBCO0FBRWpDLFVBQU0sd0JBQXdCO0FBQzlCLFVBQU0sb0JBQW9CO0FBQzFCLFVBQU0sb0JBQW9CO0FBQzFCLFVBQU0sY0FBYztBQUNwQixV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
