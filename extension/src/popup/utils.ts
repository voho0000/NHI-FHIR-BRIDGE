// Pure-ish popup helpers: tab/URL checks, mode read, formatting, id
// minting, URL safety. No module-scope mutable state lives here — these
// are leaf functions other popup modules import freely.

import { maskId } from "@nhi-fhir-bridge/mapper";
import { DEFAULT_MODE } from "./constants.js";
import { els } from "./els.js";

// True if the active tab is an NHI 健康存摺 page (real site).
export function isNhiTab(url) {
  if (!url) return false;
  try {
    const u = typeof url === "string" ? new URL(url) : url;
    return /myhealthbank\.nhi\.gov\.tw/.test(u.hostname);
  } catch {
    return false;
  }
}

export async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

export function currentMode() {
  for (const r of els.modeRadios()) if (r.checked) return r.value;
  return DEFAULT_MODE;
}

export function _fmtTimeShort(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function _fmtRelative(ms) {
  const diff = Date.now() - ms;
  if (diff < 60_000) return `${Math.max(1, Math.round(diff / 1000))} 秒前`;
  if (diff < 3600_000) return `${Math.round(diff / 60_000)} 分鐘前`;
  if (diff < 86_400_000) return `${Math.round(diff / 3600_000)} 小時前`;
  return _fmtTimeShort(new Date(ms).toISOString());
}

export function _fmtBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function _fmtElapsed(ms) {
  if (ms < 60_000) return `${Math.floor(ms / 1000)}s`;
  return `${Math.floor(ms / 60_000)}m${Math.round((ms % 60_000) / 1000)}s`;
}

// Step number rendered as a circled digit glyph — matches the
// "回 ① 登入" copy elsewhere in the popup and the wizard stepper labels.
export function _stepNumGlyph(n) {
  return n === 1 ? "①" : n === 2 ? "②" : n === 3 ? "③" : "④";
}

// Random "auto-XXXXXXXX" — 8 hex chars from crypto.getRandomValues so
// every fresh popup install gets a different ID and re-syncs are stable.
export function _generateAutoPatientId() {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `auto-${hex}`;
}

// Format id_no for display. Real NHI cids (P123450866 → P12345****)
// get shown half-masked so the user has visual confirmation we
// captured their real identity. The internal auto-XXXXXXXX placeholder
// is hidden — it's a system-generated string that means nothing to
// the user and just creates "what's that gibberish?" friction until
// the real cid arrives via background's NHI fetch on first sync.
export function _displayId(idNo) {
  if (!idNo || idNo.startsWith("auto-")) return "";
  return maskId(idNo);
}

// Convert a backend URL → the origin-pattern Chrome wants for permission
// requests. "http://192.168.1.5:8010" → "http://192.168.1.5:8010/*".
// Returns null when the URL isn't parseable so the caller can short-circuit.
export function _originPatternFor(url) {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}/*`;
  } catch {
    return null;
  }
}

// Reject SMART App Launch URLs that aren't https:// or localhost
// loopback. Otherwise a typo or paste from a chat message could send
// the (short-lived but real) iss + launch token to an attacker-
// controlled origin, who can then walk the OAuth flow and obtain a
// patient-scoped Bearer token. Validated on change AND again at launch
// time — two gates because a malicious extension peer could otherwise
// write directly to chrome.storage.local.
export function _isSafeSmartAppUrl(s) {
  try {
    const u = new URL(s);
    if (u.protocol === "https:") return true;
    if (u.protocol === "http:" && (u.hostname === "localhost" || u.hostname === "127.0.0.1")) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
