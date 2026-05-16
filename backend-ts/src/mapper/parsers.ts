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
    coding: Array<{ system: string; code: string; display: string }>;
    text: string;
  }>;
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
  "無": null,
  "": null,
  "—": null,
  "-": null,
};

export function toUcum(unit: string | null | undefined): string | null {
  if (!unit) return null;
  if (Object.prototype.hasOwnProperty.call(UCUM_OVERRIDES, unit)) {
    return UCUM_OVERRIDES[unit] ?? null;
  }
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
  const s = translateFullwidth((rawRange || "").trim());
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
    usedMulti =
      Object.keys(lowBySex).length > 0 || Object.keys(highBySex).length > 0;
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
        const pat = new RegExp(
          `${escapeRegex(sexKey)}\\s*[:：]?\\s*([<>≧≦]=?)?\\s*-?\\d`,
        );
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
      usedMulti =
        Object.keys(lowBySex).length > 0 || Object.keys(highBySex).length > 0;
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
        text: rawRange,
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
        const c = e.appliesTo?.[0]?.coding[0]?.code;
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
  const s = translateFullwidth((rawRange || "").trim());
  if (!s) return null;
  const entry: RangeEntry = { text: rawRange };

  const m = s.match(RR_LOWHIGH_BRACKETS);
  if (m) {
    const lo = (m[1] ?? "").trim();
    const hi = (m[2] ?? "").trim();
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
          continue;
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
  const v = tryParseFloat(s.replace(/,/g, ""));
  if (v === null) return null;

  const ucumCode = toUcum(unit);
  const qty: Quantity = {
    value: v,
    system: UCUM_SYSTEM,
  };
  // Quantity.unit (human-readable) keeps the original NHI label so users
  // still see '％' or 'mEq/L' raw. Quantity.code is strict UCUM machine
  // code. Drop unit display when empty so we don't emit "unit": "".
  if (unit) {
    qty.unit = unit;
  }
  if (ucumCode !== null) {
    qty.code = ucumCode;
  }
  if (comparator) {
    qty.comparator = comparator;
  }
  return qty;
}

// ── helpers ──────────────────────────────────────────────────────────

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
