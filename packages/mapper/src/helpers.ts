/**
 * Cross-mapper helpers shared by several FHIR resource mappers.
 */

import { sha1 } from "js-sha1";

/**
 * Per-install salt mixed into every stableId() and derivePatientId() call.
 *
 * The salt protects against bundle-leak de-anonymization: without it,
 * `sha1(nationalId|...)` is reversible for any of the ~30M Taiwanese
 * national IDs by brute force. Backend generates one at first startup
 * and persists it in the settings table; extension generates one in
 * chrome.storage.local at SW init.
 *
 * Default empty so legacy callers and pure unit tests (which want
 * reproducible IDs without persistence) keep working.
 */
let _salt = "";

export function setStableIdSalt(salt: string): void {
  _salt = salt ?? "";
}

export function getStableIdSalt(): string {
  return _salt;
}

/**
 * Deterministic 32-char hex ID derived from the patient ID + arbitrary
 * key parts. Salted with the install-local secret so the output can't
 * be reversed even when bundles leak.
 *
 * Uses `js-sha1` (pure JS) instead of `node:crypto` so the same mapper
 * code runs unmodified in the Chrome extension's local-only mode.
 */
export function stableId(patientId: string, ...parts: string[]): string {
  const key = [_salt, patientId, ...parts].join("|");
  return sha1(key).slice(0, 32);
}

/**
 * Map a raw national ID (or any patient identifier) to its 32-char hex
 * FHIR `Patient.id`. The raw value is kept in `Patient.identifier[].value`
 * — only the FHIR logical id is hashed. Same install-local salt as
 * stableId() so all references stay consistent.
 *
 * FHIR R4 §2.20 says "logical id … SHOULD NOT contain identifying
 * information" — this is the function that enforces it.
 */
export function derivePatientId(nationalId: string): string {
  return sha1([_salt, "patient", nationalId].join("|")).slice(0, 32);
}

/**
 * Partially-anonymize a patient name. Applied in mapPatient so every
 * FHIR resource that flows out of this codebase (downloaded Bundle,
 * backend FHIR store, dashboard, SMART app launches) sees the masked
 * form. The user's raw input is still kept in chrome.storage so they
 * can review what was entered, but it never leaves Patient context.
 *
 * Rules (Taiwan / CJK convention):
 *   - 1 char     → keep as-is (nothing to mask)
 *   - 2 chars    → keep first, replace second with O    王明 → 王O
 *   - 3+ chars   → keep first + last, middle all O      郭一新 → 郭O新
 *                                                       林郭一新 → 林OO新
 *                                                       中島健次郎 → 中OOO郎
 *
 * Western names (contain whitespace): split on space, keep first +
 * last tokens, partial-mask the last and middle:
 *   John Smith → John S***
 *   John Q Smith → John *** Smith
 */
/**
 * Half-mask a Taiwan national ID for shoulder-surfing-safe display.
 * Matches NHI 健康存摺's own `hid` convention (first 6 visible, last
 * 4 hidden): `P123456789` → `P12345****`.
 *
 * `char` defaults to `*` for popup/toast display. Use `X` for filenames
 * since `*` is invalid in Windows paths. The auto-generated
 * `auto-XXXXXXXX` placeholders flow through unchanged (already
 * non-identifying).
 */
export function maskId(id: string | null | undefined, char = "*"): string {
  const s = (id ?? "").trim();
  if (!s) return s;
  if (/^[A-Z][12]\d{8}$/.test(s)) return s.slice(0, 6) + char.repeat(4);
  if (s.startsWith("auto-")) return s;
  if (s.length > 6) return s.slice(0, 2) + char.repeat(s.length - 4) + s.slice(-2);
  return s;
}

export function maskName(name: string | null | undefined): string {
  const trimmed = (name ?? "").trim();
  if (!trimmed || trimmed === "Unknown") return trimmed;

  if (/\s/.test(trimmed)) {
    const parts = trimmed.split(/\s+/);
    if (parts.length === 1) return parts[0]!;
    const first = parts[0]!;
    const last = parts[parts.length - 1]!;
    if (parts.length === 2) {
      // Fixed 3 stars regardless of original length — don't leak how
      // long the surname was via mask length.
      const lastMasked = last.length <= 1 ? last : `${last[0]}***`;
      return `${first} ${lastMasked}`;
    }
    const middles = parts.slice(1, -1).map(() => "***");
    return [first, ...middles, last].join(" ");
  }

  // CJK / single-token path. Iterate codepoints (not UTF-16 units) so
  // surrogate-pair characters can't get split mid-character.
  const chars = Array.from(trimmed);
  if (chars.length <= 1) return trimmed;
  if (chars.length === 2) return `${chars[0]}O`;
  return chars[0] + "O".repeat(chars.length - 2) + chars[chars.length - 1];
}
