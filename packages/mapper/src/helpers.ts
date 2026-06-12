/**
 * Cross-mapper helpers shared by several FHIR resource mappers.
 */

import { sha1 } from "js-sha1";

/**
 * Deterministic 32-char hex ID derived from the patient ID + arbitrary
 * key parts. Same SHA-1 + truncate-32 algorithm used in both backend
 * and extension so the two produce identical IDs for the same input —
 * this is what makes "extension local bundle → backend /fhir/import"
 * work without producing duplicate Patient rows.
 *
 * Note: deterministic + no salt means an attacker who obtains ONLY a
 * hashed Patient.id (e.g. via an HTTP access log) can brute-force the
 * ~30M Taiwanese national ID space and recover the raw ID. We accept
 * this because Patient.identifier[].value already carries the raw
 * national ID in any leaked Bundle — the realistic Bundle-leak
 * scenarios disclose both fields together, so a salt would not move
 * the needle there. The remaining single-field leak vector is HTTP
 * access logs; deployments should scrub `/fhir/Patient/[^/]+` paths
 * and `?patient=` query strings at the reverse-proxy layer (see
 * ARCHITECTURE.md §"Patient.id 反推風險與緩解").
 *
 * Uses `js-sha1` (pure JS) instead of `node:crypto` so the same mapper
 * code runs unmodified in the Chrome extension's local-only mode.
 */
export function stableId(patientId: string, ...parts: string[]): string {
  return sha1([patientId, ...parts].join("|")).slice(0, 32);
}

/**
 * Map a raw national ID (or any patient identifier) to its 32-char hex
 * FHIR `Patient.id`. The raw value is kept in `Patient.identifier[].value`
 * — only the FHIR logical id is hashed so it doesn't leak into URLs,
 * subject.reference fields, audit logs, or SMART token payloads.
 *
 * FHIR R4 §2.20 says "logical id … SHOULD NOT contain identifying
 * information" — this is the function that enforces it.
 */
export function derivePatientId(nationalId: string): string {
  return sha1(["patient", nationalId].join("|")).slice(0, 32);
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
 * 4 hidden): `P123450866` → `P12345****`.
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

/**
 * De-identify a birth date by keeping only the year and normalizing the
 * month/day to January 1st: `1962-04-15` → `1962-01-01`.
 *
 * Why Jan-1 instead of year-only (`1962`)? FHIR `Patient.birthDate` (type
 * `date`) permits a bare `YYYY`, but many SMART apps parse birthDate with
 * `new Date()` or assume `YYYY-MM-DD` precision and break on a year-only
 * value. A full `YYYY-01-01` date parses everywhere while leaking the same
 * information as year-only (the precise month/day — the identifying part —
 * is gone). Age math is off by at most ~1 year, which is clinically fine
 * for age-banded reference ranges / adult-vs-pediatric logic.
 *
 * HIPAA Safe Harbor allows the birth YEAR to remain (only date elements
 * more specific than year must be removed). The >89-age aggregation rule
 * is NOT applied here — this is a limited-dataset-level redaction (the
 * bundle still carries hospital names + exact visit dates), not full
 * anonymization. Callers gate this behind the de-identify toggle.
 *
 * Inputs already coarser than a full date (`1962`, `1962-04`) still
 * normalize to `1962-01-01`. Empty / unparseable input passes through.
 */
export function deidBirthDate(iso: string | null | undefined): string {
  const s = (iso ?? "").trim();
  if (!s) return s;
  const m = /^(\d{4})\b/.exec(s);
  return m ? `${m[1]}-01-01` : s;
}

/**
 * Normalize a narrative report body for content-equality comparison.
 *
 * NHI's PACS/RIS ships the SAME radiology narrative through different
 * upload channels (ori_TYPE A=不定期上傳 / B=定期上傳) with cosmetically
 * different whitespace: the numbered impression list renders as "ICH2."
 * in one channel and "ICH 2." in another; line breaks land in different
 * spots; ":" may or may not carry a trailing space. These are byte-
 * different but describe ONE exam.
 *
 * Three folding steps, applied in order:
 *
 *   1. NFKC (Unicode compatibility composition). NHI's PACS/RIS emits
 *      the SAME glyph as full-width or half-width depending on channel:
 *      "S／P" (U+FF0F fullwidth slash) vs "S/P" (U+002F), "Ａ＆Ｅ" vs
 *      "A&E", "Chest：Mild" (U+FF1A) vs "Chest:Mild". NFKC folds the
 *      fullwidth/compatibility forms to their canonical ASCII so these
 *      channel-variant byte differences compare equal. NFKC is an
 *      exact-equality fold — it CANNOT merge two genuinely different
 *      exams (their real alphanumeric content still differs after the
 *      fold). Verified against a real bundle (P10109XXXX, 2026-06-06):
 *      adding NFKC dropped residual whitespace/case-only narrative
 *      clusters 20→10 while chest CT vs head/neck CT (both 33070B) stay
 *      apart.
 *   2. Strip ALL whitespace. Collapses the numbered-impression-list
 *      formatting noise — "ICH2." in one channel vs "ICH 2." in another,
 *      line breaks in different spots, ":" with/without a trailing space.
 *   3. Lowercase. Folds case-only channel differences.
 *
 * NOTE: this only normalizes the *comparison key*. The emitted
 * `DiagnosticReport.conclusion` keeps NHI's verbatim text — faithful
 * transport (CLAUDE.md #6). Used by BOTH the stableId fingerprint and
 * the imaging-item narrative collapse so the two never drift
 * (CLAUDE.md #7 — single source of truth for cross-reference logic).
 *
 * `\s` in a JS RegExp matches CR/LF/TAB plus Unicode space (incl. the
 * ideographic space U+3000 and NBSP U+00A0 that CJK reports can carry).
 * NFKC also folds U+3000 → a regular space, so step 2 catches it either
 * way.
 */
export function normalizeNarrativeForDedup(s: string | null | undefined): string {
  return (s ?? "").normalize("NFKC").replace(/\s+/g, "").toLowerCase();
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
