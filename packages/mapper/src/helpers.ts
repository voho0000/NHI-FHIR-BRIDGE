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
 * FHIR `Patient.id` for a popup-supplied identity, respecting the
 * de-identify toggle (audit P1-1, 2026-06-12).
 *
 * Why this exists: the TWID keyspace is tiny (~3×10⁸ checksum-valid
 * values), so the unsalted SHA-1 in `derivePatientId` is offline-
 * brute-forceable in seconds. Hashing the FULL national ID into a
 * "de-identified" bundle therefore undoes the masking — anyone holding
 * the bundle can recover the full ID from `Patient.id` alone. With the
 * toggle on we hash the HALF-MASKED form instead: brute-forcing that
 * hash reveals nothing beyond what `identifier[].value` already shows.
 *
 * Single source of truth for "which Patient.id does this identity map
 * to under this mask mode" — used by local bundle assembly, the popup's
 * backend-patient checks, and SMART launches. The backend-upload path
 * arrives at the same value implicitly because `deidentifyOverride`
 * masks `id_no` before upload and the backend hashes what it receives.
 */
export function effectiveFhirPatientId(idNo: string, deidentify: boolean): string {
  return derivePatientId(deidentify ? maskId(idNo, "X") : idNo);
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
 * Label-anchored redaction of demographic fields embedded in NHI free-text
 * narratives and pre-rendered HTML (出院病摘 discharge summaries, 病理報告
 * headers). Unlike the name/id token-replace scrub — which matches the value
 * the user typed into the override form and silently misses when that value
 * is wrong — this keys off the FIELD LABEL, so it redacts the REAL value
 * regardless of what was entered into the form:
 *
 *   出生日期 / 生日    → keep the Gregorian birth YEAR + separators, mask
 *                        month + day as XX ("1960/06/10" → "1960/XX/XX").
 *                        Narrative text is display-only (not parsed for age
 *                        math, unlike the structured Patient.birthDate which
 *                        stays YYYY-01-01), so we don't fabricate a 01-01 —
 *                        the mask makes it obvious month/day were removed.
 *                        Birth YEAR is retained per HIPAA Safe Harbor;
 *                        民國/ROC-form dates are redacted whole.
 *   病歷號碼 (chart no) → fully redacted.
 *   地址 / 住址 / 戶籍·通訊·聯絡地址 (home address) → fully redacted. The value is
 *                        free-form Taiwan address text, so it is captured up to
 *                        the first tag / newline boundary and replaced wholesale.
 *   病患姓名 / 病人姓名 / 患者姓名 label → the labelled value is MASKED (孫翠霞 →
 *                        孫O霞) independent of the user-entered name, so a typo'd
 *                        override no longer leaks NHI's real name. Pairs with the
 *                        病患資訊 rule so 出院病摘 and 病理報告 are covered separately
 *                        (a patient with no 出院病摘 is still covered via the report).
 *   病患資訊 report-header NAME + 病歷號 → these have no usable label, but they sit
 *                        between the 病患資訊 label and the 「性別 + 年齡」 marker
 *                        ("病患資訊：門診 孫翠霞 5020518-0 女性 54歲"). The value-based
 *                        name scrub misses the name when the user-entered name ≠
 *                        NHI's real one (typo / 眷屬), so the name+chart-no span is
 *                        redacted STRUCTURALLY. A bare "<chart-no> 性別 N歲" without a
 *                        病患資訊 label still has its digit-bearing chart-no redacted.
 *
 * Visit / admission / collection dates carry DIFFERENT labels (採檢日期 /
 * 住院日期 / 出院日期 …) and are deliberately preserved — the de-identified
 * bundle is a limited dataset, not anonymized (it still carries hospital
 * names + visit dates). Best-effort by design: NHI templates vary, so
 * unusual layouts may slip through.
 *
 * Handles both plain text ("出生日期:1932／06／10", fullwidth slashes) and the
 * 出院病摘 cell template ("出生日期：</b>1932-06-10</td>", value in a sibling
 * tag). Applied at the extension's byType stage while the 出院病摘 HTML is
 * still plaintext (document-reference.ts base64-encodes it at map time).
 */
export function redactDemographicsInText(text: string): string {
  if (!text || typeof text !== "string") return text;
  return (
    text
      // 出生日期 + Gregorian date → keep year + separators, mask month/day as
      // XX ("1960／06／10" → "1960／XX／XX"). Display-only narrative, so no
      // fabricated 01-01; the XX makes the redaction self-evident.
      .replace(
        /((?:出生日期|出生年月日|生日)\s*[:：]\s*(?:<\/b>\s*)?)(\d{4})(\s*[/.\-／]\s*)\d{1,2}(\s*[/.\-／]\s*)\d{1,2}/g,
        (_m, label, year, sep1, sep2) => `${label}${year}${sep1}XX${sep2}XX`,
      )
      // 出生日期 + 民國/ROC-form date → redact whole (can't keep year inline).
      .replace(
        /((?:出生日期|出生年月日|生日)\s*[:：]\s*(?:<\/b>\s*)?)(?:民國\s*)?\d{1,3}\s*[年/.\-／]\s*\d{1,2}\s*[月/.\-／]\s*\d{1,2}\s*日?/g,
        (_m, label) => `${label}[已去識別]`,
      )
      // 病歷號碼 / chart number → fully redacted.
      .replace(
        /((?:病歷號碼|病歷號數|病歷號|病歷編號)\s*[:：]\s*(?:<\/b>\s*)?)[A-Za-z0-9\-]+/g,
        (_m, label) => `${label}[已去識別]`,
      )
      // 地址 (home / 戶籍 / 通訊 / 聯絡 address) → fully redacted. The value is
      // free-form Taiwan address text, so anchor on the LABEL and capture up to
      // the first tag / newline (a value never spans a cell or line boundary in
      // NHI 出院病摘 templates). Layout (a) — label + colon, value in the same or
      // the sibling <td> ("<b>地址：</b>雲林縣…號</td>", or
      // "<b>地址：</b></td><td>雲林縣…</td>"). Over-redaction is the safe failure
      // here (privacy); the label anchor keeps it off clinical prose that merely
      // contains the word 地址 (e.g. "返家後地址變更" — no following colon → no match).
      .replace(
        /((?:戶籍地址|通訊地址|聯絡地址|現住地址|住址|地址)\s*[:：]\s*(?:<\/b>\s*)?(?:<\/td>\s*<td[^>]*>\s*(?:<b>\s*<\/b>\s*)?)?)([^<\n\r]+)/g,
        (_m, label) => `${label}[已去識別]`,
      )
      // Layout (b) — bare label cell + value cell, NO colon
      // ("<td>地址</td><td>雲林縣…號</td>"). Anchored on the table structure (the
      // label sits ALONE in its own <td>), so it can't fire on narrative text.
      .replace(
        /(<td[^>]*>\s*(?:<b>\s*)?(?:戶籍地址|通訊地址|聯絡地址|現住地址|住址|地址)\s*(?:<\/b>\s*)?<\/td>\s*<td[^>]*>\s*)([^<\n\r]+)/g,
        (_m, label) => `${label}[已去識別]`,
      )
      // 病患姓名 / 病人姓名 / 患者姓名 label → MASK the value in place (孫翠霞 →
      // 孫O霞), INDEPENDENT of the user-entered override name. The value-based name
      // scrub keys off what the user typed and silently misses NHI's real name on a
      // typo / 眷屬 mix-up (孫俠霞 entered vs 孫翠霞 in the data, 2026-06-23); masking
      // the LABELLED value is robust and stays consistent with the structured
      // Patient.name mask. Same/sibling-<td> layouts both handled. CJK names only
      // (2–6 漢字); an already-masked value (孫O霞 — not a pure CJK run) won't match.
      // This + the 病患資訊 rule below cover the two report families INDEPENDENTLY,
      // so a patient with NO 出院病摘 is still covered via their 病理報告 header.
      .replace(
        /((?:病患姓名|病人姓名|患者姓名)\s*[:：]\s*(?:<\/b>\s*)?(?:<\/td>\s*<td[^>]*>\s*)?)([一-鿿]{2,6})/g,
        (_m, label, name) => `${label}${maskName(name)}`,
      )
      // 病患資訊 report header — the patient NAME (and the chart no beside it) sit
      // between the 病患資訊 label (+ optional 門診/急診/住院 visit-type) and the
      // 「性別 + 年齡」 marker: "病患資訊：門 診 孫翠霞 5020518-0 女性 54歲 OPD". The
      // value-based name scrub (replaceNameDeep) MISSES the name here whenever the
      // user-entered name differs from NHI's real name (a typo, or 眷屬 entered the
      // wrong person) — it can only replace the exact string the user typed. So
      // redact the whole name+chartno span STRUCTURALLY, keeping the non-identifying
      // visit-type + 性別/年齡. Both the 病患資訊 label AND the 性別+N歲 marker bound
      // it, so it cannot run into clinical text.
      .replace(
        /(病患資訊\s*[:：]\s*(?:[門急住]\s*[診院])?\s*)([^<\n\r]+?)(\s*(?:男性|女性|男|女)\s*\d{1,3}\s*歲)/g,
        (_m, label, _mid, marker) => `${label}[已去識別]${marker}`,
      )
      // 病歷號 (chart no) embedded UNLABELLED in a report's patient-info header —
      // there is no "病歷號" word to anchor on. In NHI/hospital report headers the
      // chart number sits between the (already name-masked) name and the
      // 「性別 + 年齡」 marker, e.g. "病患資訊：門診 孫O霞 5020518-0 女性 54歲 OPD".
      // The 性別+N歲 marker is the reliable anchor: redact the alphanumeric token
      // immediately before it, REQUIRING the token to contain a digit so the
      // name-mask 'O' / pure-letter tokens (e.g. visit-type "OPD") are spared.
      // Won't touch Chinese names (not [0-9A-Za-z]), the age digits (inside the
      // marker), 工作號/申請序號 (not before a 性別+歲 marker), or clinical prose
      // lacking the "<token> 性別 N歲" shape. Best-effort — header layouts vary.
      .replace(
        /(?<![0-9A-Za-z\-])(?=[0-9A-Za-z\-]*\d)[0-9A-Za-z][0-9A-Za-z\-]*(\s*(?:男性|女性|男|女)\s*\d{1,3}\s*歲)/g,
        (_m, marker) => `[已去識別]${marker}`,
      )
  );
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
 *      fold). Verified against a real bundle (2026-06-06):
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

/** FHIR R4 core "translation" extension — carries an alternate-language
 *  rendering of a primitive string element (here a `Coding.display`) on its
 *  `_display` sibling. The standards-based way to ship a bilingual display
 *  INLINE in a self-contained bundle (no terminology server / CodeSystem
 *  designations needed). https://hl7.org/fhir/R4/extension-translation.html */
export const TRANSLATION_EXT = "http://hl7.org/fhir/StructureDefinition/translation";

/**
 * Build a `Coding` whose `display` is the code system's NATIVE-language name,
 * plus an optional `_display.translation` extension carrying the same concept
 * in another language.
 *
 * Convention (CLAUDE.md rule #1 "display follows the system" + i18n):
 *   - en-native systems (LOINC / ICD-10-CM / ICD-10-PCS / SNOMED) → display
 *     English, translation 中文 (lang "zh-TW").
 *   - zh-native systems (NHI 醫令碼 / 藥品碼, NHI catalog 中文) → display 中文,
 *     translation English (lang "en").
 *
 * `nativeDisplay` is the display in the system's own language; `other` is the
 * alternate {lang, content}. The translation is omitted when its content is
 * empty or identical to the native display (no new information).
 */
export function bilingualCoding(
  system: string,
  code: string,
  nativeDisplay: string | null | undefined,
  other?: { lang: string; content: string | null | undefined } | null,
): Record<string, any> {
  const coding: Record<string, any> = { system, code };
  const nd = (nativeDisplay ?? "").trim();
  if (nd) coding.display = nd;
  const oc = (other?.content ?? "").trim();
  if (oc && oc !== nd) {
    coding._display = {
      extension: [
        {
          url: TRANSLATION_EXT,
          extension: [
            { url: "lang", valueCode: other!.lang },
            { url: "content", valueString: oc },
          ],
        },
      ],
    };
  }
  return coding;
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
