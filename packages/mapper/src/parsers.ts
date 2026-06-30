/**
 * Pure parsing helpers — reference range, quantity, UCUM unit normalisation.
 *
 * Port of `backend/app/mapper/_parsers.py`. Self-contained: no dependencies
 * on other observation module pieces.
 *
 * Public API:
 *   toUcum(unit)                  → canonical UCUM unit string (or null)
 *   parseRangeMulti(raw, unit)    → list of FHIR referenceRange entries
 *                                   (one per sex when sex-stratified)
 *   parseRange(raw, unit)         → single referenceRange entry
 *   tryParseQuantity(raw, unit)   → FHIR Quantity dict or null
 */

const UCUM_SYSTEM = "http://unitsofmeasure.org";

// FHIR R4 Quantity.comparator allowed values. Normalise full-width CJK
// ＞ ＜ ≧ ≦ + ASCII variants so "＞ 40.0" still parses as a real number
// instead of falling through to valueString (which loses the unit).
const FULLWIDTH_OPS: ReadonlyArray<[string, string]> = [
  ["＞", ">"],
  ["＜", "<"],
  ["≧", ">="],
  ["≦", "<="],
  ["≥", ">="],
  ["≤", "<="],
];

function translateFullwidth(s: string): string {
  let out = s;
  for (const [from, to] of FULLWIDTH_OPS) {
    if (out.includes(from)) {
      out = out.split(from).join(to);
    }
  }
  return out;
}

// P3 (display precision, 2026-06-08): NHI sometimes HTML-escapes the
// comparator operators in the reference-range field — e.g. "[&lt;200][]"
// for "[<200][]", "[&gt;90.00][]" for "[>90.00][]". Without decoding, both
// the free-form .text shows literal "&lt;" gibberish AND the comparator
// parser (RR_COMPARATOR needs a literal "<"/">") can't extract the
// structured bound — so the same value that parses fine when shipped as
// full-width "＜200" silently loses its referenceRange.high when shipped
// HTML-escaped. Decoding is NOT fabrication per faithful-transport rule #6:
// it un-escapes a transport-layer encoding back to the exact character NHI
// meant (same class of normalization as translateFullwidth's full-width →
// half-width). Single-pass over the entities NHI actually emits; we do not
// attempt to resolve hypothetical double-escaping ("&amp;lt;") that NHI has
// never been observed to produce.
const HTML_ENTITIES: ReadonlyArray<[string, string]> = [
  ["&lt;", "<"],
  ["&gt;", ">"],
  ["&le;", "<="],
  ["&ge;", ">="],
  ["&#60;", "<"],
  ["&#62;", ">"],
  ["&amp;", "&"],
];

function decodeHtmlEntities(s: string): string {
  if (!s.includes("&")) return s;
  let out = s;
  for (const [from, to] of HTML_ENTITIES) {
    if (out.includes(from)) {
      out = out.split(from).join(to);
    }
  }
  return out;
}

const COMPARATOR_RE = /^\s*(<=|>=|<|>)\s*(.+)$/;

// Reference-range parsing. NHI ships the range as plain text like
// "[3.89][26.8]", "[40][]", "[Negative]" or "AM 8:00 6.2-19.4".
const RR_LOWHIGH_BRACKETS = /^\s*\[\s*([^\]]*)\s*\]\s*\[\s*([^\]]*)\s*\]\s*$/;
const RR_DASH_RANGE = /(-?\d+(?:\.\d+)?)\s*[-~–]\s*(-?\d+(?:\.\d+)?)/;
const RR_COMPARATOR = /^\s*(<=|>=|<|>)\s*(-?\d+(?:\.\d+)?)\s*$/;
// Sex-stratified bracketed range, e.g. "男:13.7 女:11.1" — used by some
// hospitals for haematology (Hb, RBC, Hct). Pulls out (sex, value) pairs.
// Tolerates optional comparator (≧/≦/>/<) before the number.
const RR_SEX_NUM_G = /(男性|女性|男|女|M|F)\s*[:：]?\s*(?:[<>≧≦]=?)?\s*(-?\d+(?:\.\d+)?)/g;
const RR_SINGLE_BRACKET = /^\s*\[\s*(.+?)\s*\]\s*$/;
const RR_QUALITATIVE_PAREN =
  /^\s*(Normal|正常|Nonreactive|Non-reactive)\s*\(\s*(-?\d+(?:\.\d+)?)\s*\)\s*$/i;
// Age-stratified reference range — some hospitals (台大癌醫 et al.) ship CBC
// ranges as a table of per-age-group brackets:
//   "[[0-14d]144-450 [15-30d]248-586 … [≧18y]150-378][…doubled…]".
// An age bracket is "[<comparator?><num>(-<num>)?<age-unit>]" where the unit is
// d/y/wk/mo/yr or a CJK 歲/天/日/週/月. A plain value bracket ("[41]", "[3.89]",
// "[0.92 ~ 1.68]", "[<115 IU/mL]") has NO age unit immediately after its number,
// so it never matches. Detecting even one age bracket means the string is a
// multi-segment age table the bridge must NOT reduce to a single low/high.
const RR_AGE_STRATIFIED =
  /\[\s*(?:[<>≧≦]=?)?\s*\d[\d.]*\s*(?:[-~–]\s*\d[\d.]*\s*)?(?:d|y|wk|mo|yr|歲|天|日|週|月)\s*\]/i;

const SEX_TO_FHIR: Record<string, [string, string]> = {
  男性: ["male", "Male"],
  男: ["male", "Male"],
  M: ["male", "Male"],
  女性: ["female", "Female"],
  女: ["female", "Female"],
  F: ["female", "Female"],
};

// Public types — FHIR Quantity / referenceRange shapes used downstream.
export interface Quantity {
  value: number;
  unit?: string;
  system?: string;
  code?: string;
  comparator?: string;
}

export interface RangeEntry {
  text: string;
  low?: Quantity;
  high?: Quantity;
  appliesTo?: Array<{
    coding?: Array<{ system: string; code: string; display: string }>;
    text: string;
  }>;
  /**
   * Set when the raw "range" string is actually a result interpretation
   * (e.g. "正常" / "異常，建議：請洽詢醫師") rather than a numeric range.
   * Caller (observation mapper) should route this to
   * Observation.interpretation / Observation.note instead of populating
   * Observation.referenceRange. When this is set the RangeEntry should
   * NOT be emitted as a referenceRange.
   * Added v0.9.8 per bug report 2026-05-27 Part 3 C4.
   */
  interpretationText?: string;
}

// ── UCUM normalisation ────────────────────────────────────────────────

/**
 * NHI labs report units in a mix of UCUM-clean strings ('mg/dL'),
 * Taiwan-style equivalents ('mEq/L' vs UCUM 'meq/L'), full-width punctuation
 * ('％' vs '%'), and placeholder text ('無'). The TWNHIFHIR validator
 * rejects everything except canonical UCUM in Quantity.code, so we
 * normalise. `null` means "omit Quantity.code entirely".
 */
const UCUM_OVERRIDES: Record<string, string | null> = {
  // Fullwidth → ASCII
  "％": "%",
  // Case-sensitive UCUM (Eq is 'eq', not 'Eq')
  "mEq/L": "meq/L",
  "meq/l": "meq/L",
  // BP profile fixed-value: mm[Hg] not mmHg
  mmHg: "mm[Hg]",
  MMHG: "mm[Hg]",
  // Common Chinese 'no unit' placeholders → drop UCUM code
  無: null,
  "": null,
  "—": null,
  "-": null,
};

export function toUcum(unit: string | null | undefined): string | null {
  if (!unit) return null;
  if (Object.prototype.hasOwnProperty.call(UCUM_OVERRIDES, unit)) {
    return UCUM_OVERRIDES[unit] ?? null;
  }
  // Pass through only plausibly-UCUM ASCII strings ("mg/dL", "mmol/L",
  // "10*3/uL" are valid UCUM verbatim). A unit with CJK or other non-printable-
  // ASCII characters cannot be valid UCUM — return null so the Quantity builder
  // doesn't mislabel it under the UCUM system (a UCUM-aware validator would
  // reject it). The raw label still rides on Quantity.unit.
  if (/[^\x20-\x7E]/.test(unit)) return null;
  return unit;
}

// ── Quantity builder ──────────────────────────────────────────────────

function makeQuantity(value: number, unit: string): Quantity {
  const q: Quantity = { value };
  if (unit) {
    q.unit = unit;
    q.system = UCUM_SYSTEM;
    q.code = unit;
  }
  return q;
}

function tryParseFloat(s: string): number | null {
  if (s === "" || s == null) return null;
  // Mirror Python's float() — allow leading/trailing whitespace,
  // optional sign, decimal. Reject if NaN OR if any non-numeric residual
  // (Number("12abc") returns NaN, OK; "12  abc" also NaN, OK).
  const trimmed = s.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  if (Number.isNaN(n)) return null;
  return n;
}

// ── parseRangeMulti / parseRange ──────────────────────────────────────

/**
 * List variant of parseRange: emits one entry per sex when the range is
 * sex-stratified ("[男:13.7 女:11.1][男:17.0 女:15.0]"), otherwise a
 * single-element list. Each entry tagged with appliesTo so downstream
 * code can pick the right one for the patient's sex.
 */
export function parseRangeMulti(rawRange: string, unit: string): RangeEntry[] {
  // P3 (2026-06-08): same HTML-entity decode as parseRange so the sex-
  // stratified path doesn't drift (faithful-transport rule #7 — shared
  // normalization). `decoded` feeds .text; `s` drives structured matching.
  const decoded = decodeHtmlEntities((rawRange || "").trim());
  const s = translateFullwidth(decoded);
  if (!s) return [];

  const lowBySex: Record<string, string> = {};
  const highBySex: Record<string, string> = {};
  let usedMulti = false;

  const m = s.match(RR_LOWHIGH_BRACKETS);
  if (m) {
    const lowBlob = m[1] ?? "";
    const highBlob = m[2] ?? "";
    for (const sm of lowBlob.matchAll(RR_SEX_NUM_G)) {
      if (sm[1] && sm[2]) lowBySex[sm[1]] = sm[2];
    }
    for (const sm of highBlob.matchAll(RR_SEX_NUM_G)) {
      if (sm[1] && sm[2]) highBySex[sm[1]] = sm[2];
    }
    usedMulti = Object.keys(lowBySex).length > 0 || Object.keys(highBySex).length > 0;
  } else {
    // Single-bracket: each per-sex value's comparator decides low vs high.
    const single = s.match(RR_SINGLE_BRACKET);
    if (single) {
      const inner = single[1] ?? "";
      for (const sm of inner.matchAll(RR_SEX_NUM_G)) {
        const sexKey = sm[1] ?? "";
        const valStr = sm[2] ?? "";
        // Find the comparator immediately preceding this number.
        // Mirror the Python: rebuild a per-sex-key search.
        const pat = new RegExp(`${escapeRegex(sexKey)}\\s*[:：]?\\s*([<>≧≦]=?)?\\s*-?\\d`);
        const cm = inner.match(pat);
        const op = cm?.[1] ?? "";
        if (op === ">" || op === ">=") {
          lowBySex[sexKey] = valStr;
        } else if (op === "<" || op === "<=") {
          highBySex[sexKey] = valStr;
        } else {
          lowBySex[sexKey] = valStr;
        }
      }
      usedMulti = Object.keys(lowBySex).length > 0 || Object.keys(highBySex).length > 0;
    }
  }

  if (usedMulti) {
    const entries: RangeEntry[] = [];
    // Iterate over the union of keys actually seen — preserve insertion order.
    const allSexKeys: string[] = [];
    for (const k of [...Object.keys(lowBySex), ...Object.keys(highBySex)]) {
      if (!allSexKeys.includes(k)) allSexKeys.push(k);
    }
    for (const sexKey of allSexKeys) {
      const mapping = SEX_TO_FHIR[sexKey];
      if (!mapping) continue;
      const [fhirCode, fhirDisplay] = mapping;
      const entry: RangeEntry = {
        text: decoded,
        appliesTo: [
          {
            coding: [
              {
                system: "http://hl7.org/fhir/administrative-gender",
                code: fhirCode,
                display: fhirDisplay,
              },
            ],
            text: fhirDisplay,
          },
        ],
      };
      if (sexKey in lowBySex) {
        const v = tryParseFloat(lowBySex[sexKey]!);
        if (v !== null) entry.low = makeQuantity(v, unit);
      }
      if (sexKey in highBySex) {
        const v = tryParseFloat(highBySex[sexKey]!);
        if (v !== null) entry.high = makeQuantity(v, unit);
      }
      entries.push(entry);
    }
    if (entries.length > 0) {
      // De-dup by FHIR sex code in case input has both 男 and 男性.
      const seen = new Set<string>();
      const out: RangeEntry[] = [];
      for (const e of entries) {
        const c = e.appliesTo?.[0]?.coding?.[0]?.code;
        if (!c || seen.has(c)) continue;
        seen.add(c);
        out.push(e);
      }
      return out;
    }
  }

  const one = parseRange(rawRange, unit);
  return one ? [one] : [];
}

/**
 * Convert a reference-range text into a FHIR referenceRange entry.
 *
 * Strategy in order:
 *   1. "[low][high]" bracketed format — NHI's canonical shape.
 *   2. "3.89-26.8" / "3.89~26.8" dash range.
 *   3. "> 40" / "< 0.5" single-sided.
 *   4. Qualitative ("Negative", "AM 8:00 6.2-19.4") — text-only.
 *
 * Sex-stratified shapes go through parseRangeMulti. Returns null only
 * for empty input.
 */
export function parseRange(rawRange: string, unit: string): RangeEntry | null {
  // P3 (2026-06-08): decode HTML-escaped comparators ("[&lt;200][]") before
  // parsing. `decoded` keeps full-width chars intact (only entities un-escaped)
  // and is what we surface on .text — so the entity gibberish disappears from
  // display WITHOUT changing how existing full-width comparator ranges render.
  // `s` additionally normalizes full-width → ASCII for the structured parser.
  const decoded = decodeHtmlEntities((rawRange || "").trim());
  const s = translateFullwidth(decoded);
  if (!s) return null;

  // C4 (bug report 2026-05-27 Part 3): result-interpretation strings
  // packed into the reference-range field — "正常" / "異常，建議：請洽詢
  // 醫師" / etc. These aren't ranges and shouldn't end up in
  // Observation.referenceRange. Caller routes them to .interpretation.
  if (_looksLikeInterpretationText(s)) {
    return { text: decoded, interpretationText: s };
  }

  // Age-stratified range (per-age-group brackets like "[[0-14d]144-450 …
  // [≧18y]150-378]") — the bridge canNOT faithfully pick one age group's
  // low/high without guessing, and the format varies by hospital, so keep the
  // full original string on .text ONLY and emit NO numeric low/high. (Before
  // this guard the dash-range fallback greedily matched the FIRST "0-14" — the
  // "0-14 days" age bracket — and shipped low=0/high=14, mislabelling every
  // adult CBC as out-of-range; a single v1.0.16 bundle carried 504 such obs.)
  // Abnormal/normal for these rows then comes solely from NHI's own assaY_MARK
  // flag (applyNhiAbnormalFlag); with no flag they stay uninterpreted rather
  // than guessed. User decision 2026-06-30.
  if (RR_AGE_STRATIFIED.test(s)) {
    return { text: decoded };
  }

  const entry: RangeEntry = { text: decoded };

  const m = s.match(RR_LOWHIGH_BRACKETS);
  if (m) {
    const lo = (m[1] ?? "").trim();
    const hi = (m[2] ?? "").trim();

    // P2-a (display precision, 2026-06-08): NHI sometimes echoes the SAME
    // value into BOTH the low-bound and high-bound bracket — e.g.
    // "[(-)][(-)]", "[0.92 ~ 1.68][0.92 ~ 1.68]", "[＜115 IU/mL][＜115 IU/mL]".
    // The doubling is a pure encoding artifact (one reference value copied
    // into both slots), not a genuine low≠high pair. Collapse the .text to
    // the single inner value so SMART apps render a clean "(-)" /
    // "0.92 ~ 1.68" instead of the bracketed VGH-internal syntax. This only
    // touches the free-form .text label (allowed per faithful-transport
    // rule #6 — free-form referenceRange text may be normalized); the
    // structured low/high extraction below still runs against lo & hi
    // exactly as before, so no numeric data is lost.
    if (lo && lo === hi) {
      entry.text = lo;
    }

    // C5 (bug report Part 3): specimen + threshold packed into one
    // bracket side, e.g. "[][Random Urine＜ 1.9]" or "[][plasma ≦0.04]".
    // Try this FIRST so the comparator inside doesn't trigger the
    // "looks numeric → fall to regular parsing" branch below (which
    // would catch the threshold but lose the specimen). Returns
    // appliesTo (specimen) + structured low/high.
    const isHiEmpty = !hi || hi === "無" || hi === "空白";
    const isLoEmpty = !lo || lo === "無" || lo === "空白";
    if (hi && isLoEmpty) {
      const spec = _tryExtractSpecimenThreshold(hi, unit);
      if (spec) return { text: decoded, ...spec };
    }
    if (lo && isHiEmpty) {
      const spec = _tryExtractSpecimenThreshold(lo, unit);
      if (spec) return { text: decoded, ...spec };
    }

    // C3 (bug report Part 3): qualitative bracket convention like
    // "[Negative][]", "[Yellow][]", "[Nonreactive][]". The value is the
    // expected NORMAL result (categorical), not a numeric range. Strip
    // brackets and surface the cleaned qualitative term as range.text
    // so downstream consumers don't have to parse VGH-internal syntax.
    // Only applies when one side is non-numeric qualitative AND the
    // other side is empty / placeholder.
    if (lo && !_looksNumericLike(lo) && isHiEmpty) {
      return { text: lo };
    }
    if (hi && !_looksNumericLike(hi) && isLoEmpty) {
      return { text: hi };
    }

    for (const [side, sideVal] of [
      ["low", lo],
      ["high", hi],
    ] as const) {
      if (!sideVal || sideVal === "無" || sideVal === "空白") continue;

      // 1. Plain float
      const asFloat = tryParseFloat(sideVal);
      if (asFloat !== null) {
        entry[side] = makeQuantity(asFloat, unit);
        continue;
      }

      // 2. Dash range — meaningful only for `low` slot; splits into low+high.
      const dm = sideVal.match(RR_DASH_RANGE);
      if (dm && side === "low" && entry.high === undefined) {
        const v1 = tryParseFloat(dm[1]!);
        const v2 = tryParseFloat(dm[2]!);
        if (v1 !== null && v2 !== null) {
          entry.low = makeQuantity(v1, unit);
          entry.high = makeQuantity(v2, unit);
          continue;
        }
      }

      // 3. Comparator (≧60, <=0.04 etc.)
      const cm = sideVal.match(RR_COMPARATOR);
      if (cm) {
        const v = tryParseFloat(cm[2]!);
        if (v !== null) {
          const op = cm[1];
          if (op === ">" || op === ">=") {
            entry.low = makeQuantity(v, unit);
          } else {
            entry.high = makeQuantity(v, unit);
          }
          continue;
        }
      }

      // 4. "Normal ( X )" / "Nonreactive ( X )" — X is the cutoff (high bound).
      const qm = sideVal.match(RR_QUALITATIVE_PAREN);
      if (qm) {
        const v = tryParseFloat(qm[2]!);
        if (v !== null) {
          entry.high = makeQuantity(v, unit);
        }
      }
    }
    return entry;
  }

  const dashMatch = s.match(RR_DASH_RANGE);
  if (dashMatch) {
    const v1 = tryParseFloat(dashMatch[1]!);
    const v2 = tryParseFloat(dashMatch[2]!);
    if (v1 !== null && v2 !== null) {
      entry.low = makeQuantity(v1, unit);
      entry.high = makeQuantity(v2, unit);
    }
    return entry;
  }

  const cmpMatch = s.match(RR_COMPARATOR);
  if (cmpMatch) {
    const v = tryParseFloat(cmpMatch[2]!);
    if (v !== null) {
      const op = cmpMatch[1];
      if (op === ">" || op === ">=") {
        entry.low = makeQuantity(v, unit);
      } else {
        entry.high = makeQuantity(v, unit);
      }
    }
    return entry;
  }

  // Fall through: qualitative or complex — text-only is FHIR-correct.
  return entry;
}

// ── tryParseQuantity ──────────────────────────────────────────────────

/**
 * Parse "> 40.0" / "<0.010" / "1,234.5" → FHIR Quantity with comparator.
 *
 * v0.9.7+ also handles "packed-value" patterns common in Taiwan LIS where
 * the raw NHI field carries a number + parenthetical qualifier:
 *   "33 (stage3:30-59)"  → eGFR with CKD-stage annotation
 *   "2.3(  36.1%)"       → Albumin absolute + fraction
 *   "1+ (80)"            → dipstick grade + quantitative mg/dL
 *   "4+ (2000)"          → same
 * Strategy: try the leading token (before any "(") first, then fall back
 * to the value inside parens. So "33 (stage3:30-59)" → 33; "4+ (2000)" →
 * 2000. Original raw text is preserved by the caller via valueString /
 * note as appropriate. Returns null only when neither leading nor
 * parenthetical content yields a numeric.
 *
 * Returns null when the residual after stripping a comparator still
 * isn't numeric — caller falls back to valueString.
 */
export function tryParseQuantity(
  rawValue: string | number | null | undefined,
  unit: string,
): Quantity | null {
  if (rawValue === null || rawValue === undefined) return null;
  let s = translateFullwidth(String(rawValue).trim());
  let comparator: string | null = null;
  const cm = s.match(COMPARATOR_RE);
  if (cm) {
    comparator = cm[1] ?? null;
    s = (cm[2] ?? "").trim();
  }
  let v = tryParseFloat(s.replace(/,/g, ""));
  if (v === null) {
    // Try LEADING token before first "(" — handles "33 (stage3:30-59)"
    // and "2.3(36.1%)".
    const parenIdx = s.indexOf("(");
    if (parenIdx > 0) {
      const leading = s.slice(0, parenIdx).trim().replace(/,/g, "");
      v = tryParseFloat(leading);
      // v0.11.7 fix: when leading is a dipstick semi-quantitative
      // grade ("4+", "Trace", "Positive", etc.), the grade itself is
      // the clinically meaningful data — the parenthesised number is
      // just a lab-supplied equivalence estimate. Returning null here
      // lets the caller emit the raw string as valueString so
      // downstream SMART apps display "4+ (2000)" intact instead of
      // showing just "2000 mg/dL" (which loses the grade).
      //
      // Original v0.9.7 design chose to extract the parens number;
      // bug report 2026-05-28 ("MediPrisma shows 2000 mg/dL but
      // health bank shows 4+(2000)") confirmed that trade-off was
      // wrong: grade > equivalence estimate in clinical priority.
      if (v === null && /^(?:[\d.]+\+|trace|positive|negative)/i.test(leading)) {
        return null;
      }
    }
    // If leading didn't parse AND it's not a dipstick pattern (e.g.
    // some unusual format we haven't seen), try content INSIDE parens
    // as a last resort.
    if (v === null) {
      const m = s.match(/\(\s*([+\-\d.,]+)\s*\)/);
      if (m && m[1]) {
        v = tryParseFloat(m[1].replace(/,/g, ""));
      }
    }
  }
  if (v === null) return null;

  const ucumCode = toUcum(unit);
  const qty: Quantity = { value: v };
  // Quantity.unit (human-readable) keeps the original NHI label so users
  // still see '％' or 'mEq/L' raw. Drop unit display when empty so we don't
  // emit "unit": "".
  if (unit) {
    qty.unit = unit;
  }
  // Only assert the UCUM system when we actually have a UCUM machine code —
  // otherwise a non-UCUM unit (e.g. a CJK label) would be falsely declared
  // UCUM with no code, which a terminology-aware consumer would flag.
  if (ucumCode !== null) {
    qty.system = UCUM_SYSTEM;
    qty.code = ucumCode;
  }
  if (comparator) {
    qty.comparator = comparator;
  }
  return qty;
}

// ── helpers ──────────────────────────────────────────────────────────

/**
 * True when the raw string is a result-interpretation phrase rather than
 * a reference range. Used in parseRange to flag interpretation text that
 * shouldn't be emitted as Observation.referenceRange (caller routes it
 * to .interpretation or .note instead). Bug report 2026-05-27 Part 3 C4.
 */
function _looksLikeInterpretationText(s: string): boolean {
  const t = s.trim();
  if (!t) return false;
  // Exact whole-string matches for the most common patient-result phrases
  if (t === "正常" || t === "異常" || t === "陽性" || t === "陰性") return true;
  // Free-text interpretive phrases — checked via substring (no brackets).
  // Skip if the string looks structurally like a bracket range, dash
  // range, or comparator (handled elsewhere).
  if (t.startsWith("[")) return false;
  if (t.includes("-") || t.includes("~") || /[<>≦≧≤≥]/.test(t)) return false;
  return t.includes("建議") || t.includes("請洽詢") || t.includes("請聯絡") || t.includes("見備註");
}

/**
 * Cheap test: is this side likely to carry numeric content (so the
 * existing bracket-range branches should try to parse it) versus a
 * categorical / qualitative term (e.g. "Negative" / "Yellow" / "Clear")?
 * Used in parseRange C3 path to decide whether to keep parsing or to
 * unwrap as plain text. Numbers, comparators, dash-ranges, percentages
 * all count as "numeric-like".
 */
function _looksNumericLike(s: string): boolean {
  return /\d/.test(s) || /[<>≦≧≤≥]/.test(s);
}

/**
 * Try to extract specimen + comparator threshold from a single bracket
 * side like "Random Urine＜ 1.9" or "plasma ≦0.04". Returns appliesTo +
 * structured low/high when successful. Bug report 2026-05-27 Part 3 C5.
 *
 * Only matches "<specimen> <comparator> <number>" — anything more complex
 * falls back to plain text.
 */
function _tryExtractSpecimenThreshold(
  s: string,
  unit: string,
): { appliesTo: Array<{ text: string }>; low?: Quantity; high?: Quantity } | null {
  // Comparator chars: ASCII < > <= >= and fullwidth ＜ ＞ ≦ ≧ ≤ ≥
  const m = s.match(/^([^<>≦≧≤≥]+?)\s*([<>≦≧≤≥]=?)\s*([\d.]+)$/);
  if (!m) return null;
  const specimen = (m[1] ?? "").trim();
  const op = (m[2] ?? "").trim();
  const v = tryParseFloat(m[3] ?? "");
  if (!specimen || v === null) return null;
  const result: { appliesTo: Array<{ text: string }>; low?: Quantity; high?: Quantity } = {
    appliesTo: [{ text: specimen }],
  };
  if (op === ">" || op === "≧" || op === "≥" || op === ">=") {
    result.low = makeQuantity(v, unit);
  } else {
    result.high = makeQuantity(v, unit);
  }
  return result;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
