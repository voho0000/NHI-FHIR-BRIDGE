/**
 * Cross-mapper helpers shared by several FHIR resource mappers.
 */

import { sha1 } from "js-sha1";

/**
 * Deterministic 32-char hex ID derived from the patient ID + arbitrary
 * key parts. Same SHA-1 + truncate-32 algorithm as the Python mappers
 * so re-syncs upsert the same resource instead of creating duplicates.
 *
 * Uses `js-sha1` (pure JS) instead of `node:crypto` so the same mapper
 * code runs unmodified in the Chrome extension's local-only mode.
 */
export function stableId(patientId: string, ...parts: string[]): string {
  const key = [patientId, ...parts].join("|");
  return sha1(key).slice(0, 32);
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
