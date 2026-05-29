/**
 * Observation mapper — single-row and panel-grouped variants.
 *
 * Port of `backend/app/mapper/observation.py` (1212 lines). Includes:
 *   - mapObservation(raw, patientId) → single Observation
 *   - mapObservationsGrouped(items, patientId) → DiagnosticReport + Observations
 *   - canonicalLabKey(display) — cross-page dedup key
 *   - findLoinc, buildCodings, mapInterpretation, deriveInterpretation
 *   - dedupeCrossFormat, combineBpItems, groupByOrderCode
 *   - inferSpecimen
 *
 * Functional parity with the Python implementation is the goal. Field
 * order in the emitted resources may differ (JS object literal order)
 * but content is identical.
 */

import * as systems from "./systems";
import { stableId } from "./helpers";
import {
  DISPLAY_FIRST_CODES,
  LOINC_DISPLAY,
  CBC_CANONICAL_TEXT_LOINCS,
  LOINC_MAP,
  LOINC_SHORT_TEXT,
  NHI_CODE_PANEL_NAME,
  NHI_TO_LOINC,
  PANEL_LOINC_MAP,
} from "./loinc-tables";
import {
  type Quantity,
  type RangeEntry,
  parseRange,
  parseRangeMulti,
  toUcum,
  tryParseQuantity,
} from "./parsers";

// ── Imaging detection — REMOVED in v0.11.6 ──────────────────────────
//
// Previously this section defined IMAGING_KEYWORDS + looksLikeImaging()
// to filter out imaging / ECG rows from the Observation pipeline. The
// concern was that mixed-content endpoints might feed Observation
// mapper with imaging rows that belong in DiagnosticReport.
//
// Audit 2026-05-28 confirmed this concern is structurally moot: all
// three endpoints that produce `page_type: "observations"` (see
// extension/src/nhi-endpoints.js) only ever emit lab / vital-sign
// rows. Imaging has its own page_type "diagnostic_reports" going
// through mapDiagnosticReport via adaptImagingReportFromDetail.
//
// Worse, the filter introduced an actual patient-safety bug from v0
// onwards: haystack = `${display} ${code}` plus substring keyword
// "ct " (trailing space sentinel for "CT scan") collided with bare
// "HCT" displays — the space separator between display + code turned
// "hct" into "hct " which contains "ct ". 嘉義長庚 CBC reports with
// bare display "HCT" silently lost the HCT row for years; SMART app
// found the gap on 2026-05-28. Same false-positive class for any
// bare display ending in "ct" (e.g. bare "Direct" for bilirubin).
//
// Defensive code that prevents nothing real and breaks real data is
// worse than no code. Removed. If a future endpoint genuinely starts
// mixing imaging + lab rows under one page_type, the right fix is to
// re-route in the adapter (positive validation on the imaging side),
// not negative substring filter on the lab side.

// QC / lab-internal-control row detection.
//
// Bug report 2026-05-27 v0.11.1: 長庚嘉義 coagulation report shipped
// a row with display="Nor.plasma mean", value=29, unit=sec. This is
// the lab's normal-plasma control reading used as denominator for the
// APTT ratio — internal QC data, NOT a patient measurement. Without
// filtering, the row was emitted as a patient Observation with LOINC
// 14979-9 (APTT), so SMART app's APTT trend column showed 29 sec
// alongside the patient's actual APTT readings.
//
// QC controls have no place in a patient bundle — drop them. The
// patterns below cover Taiwan LIS conventions for control rows:
//   - Nor.plasma / Normal plasma — normal-control plasma (coag QC)
//   - Abn.plasma / Abnormal plasma — abnormal-control plasma
//   - Control mean / QC mean — generic QC summary rows
//   - 對照血漿 / 控制血漿 — Chinese variants
// English-only word-boundary check avoids matching patient analytes
// that happen to contain "control" in another context (none observed).
const QC_CONTROL_PATTERNS: RegExp[] = [
  /\bnor\.?\s*plasma\b/i, // Nor.plasma / Nor plasma / Norplasma
  /\bnormal\s+plasma\b/i,
  /\babn\.?\s*plasma\b/i, // Abn.plasma
  /\babnormal\s+plasma\b/i,
  /\bcontrol\s+(mean|plasma)\b/i, // "Control mean" / "Control plasma"
  /\bqc\s+(mean|control|plasma)\b/i,
  /對照血漿/,
  /控制血漿/,
  // v0.11.9 (SMART app dev report 2026-05-29): broaden from /正常血漿平均/
  // → /正常血漿.*平均/ so we catch '正常血漿APTT平均值' / '正常血漿PT平均值'
  // variants where the analyte name is wedged between '正常血漿' prefix
  // and '平均' suffix. Original literal pattern only matched bare
  // '正常血漿平均' (no analyte token in the middle).
  /正常血漿.*平均/,
];

function looksLikeQcControl(display: string): boolean {
  if (!display) return false;
  return QC_CONTROL_PATTERNS.some((re) => re.test(display));
}

// v0.11.11 (SMART app dev bug 1 + 3b 2026-05-29): drop specimen
// quality flags and report narrative rows that piggyback on real
// analyte billing codes.
//
// Quality flags (溶血/脂血/icterus) describe the specimen condition,
// NOT the patient's analyte value. Bridge previously emitted them as
// Observations carrying valueQuantity={value:0, unit:"NIL"} AND
// borrowing the host code's LOINC (e.g. 溶血 row under 09002C BUN
// inherited LOINC 3094-0 BUN). SMART app reading per-LOINC trend
// charts then saw spurious "BUN=0" data points.
//
// Narrative rows are sub-rows whose display is just a separator
// (`:`, `;`) or a comment marker ("PEP-Comment", "Note:", "備註").
// They have no analyte value and shouldn't become Observations.
// If preserved at all they belong in DiagnosticReport.conclusion;
// for now we drop (the underlying billing code's other rows carry
// the real measurements).
//
// Patterns calibrated to v0.11.9 bundle audit. Add new variants here
// when more LIS quirks surface — keep this conservative so we don't
// accidentally drop real analytes that happen to contain these words.
const QUALITY_FLAG_PATTERNS: RegExp[] = [
  /^溶血\s*$/, // 溶血 (hemolysis)
  /^脂血\s*$/, // 脂血 (lipemia)
  /^黃疸\s*$/, // 黃疸 (icterus)
  /^hemoly[sz]is\s*$/i,
  /^lipemia\s*$/i,
  /^icteric?\s*$/i,
  /^icterus\s*$/i,
];

const NARRATIVE_ROW_PATTERNS: RegExp[] = [
  /^[\s:：;；,，.。\-—－]+$/, // pure punctuation (incl. fullwidth)
  /comment\b/i,
  /\bnote\b/i,
  /^備註/, // 備註 (note)
  /^註\s*[:：]/,
];

function looksLikeQualityFlag(display: string): boolean {
  if (!display) return false;
  return QUALITY_FLAG_PATTERNS.some((re) => re.test(display));
}

function looksLikeNarrativeRow(display: string): boolean {
  if (!display) return false;
  return NARRATIVE_ROW_PATTERNS.some((re) => re.test(display));
}

// ── Fullwidth → halfwidth normalization ─────────────────────────────
// v0.11.10 (SMART app dev report 2026-05-29 Category B): NHI catalog
// 「心肌旋轉蛋白Ｉ」(09099C) uses a FULLWIDTH letter Ｉ (U+FF29) where
// labs and downstream consumers use halfwidth I. Fullwidth ASCII chars
// (U+FF01..U+FF5E) map 1:1 to halfwidth (U+0021..U+007E) via the
// 0xFEE0 offset. Cleaning these in code.text and DR title only —
// raw display is preserved verbatim in coding[nhi].display
// (faithful-transport principle: NHI's choice of fullwidth is theirs;
// our bridge-side label is ours to make consistent).
//
// Same class as v0.11.4 ㎡ → m2 cleanup (UCUM-side); this is the
// display-text equivalent.
function normalizeFullwidth(s: string | undefined | null): string {
  if (!s) return "";
  return String(s).replace(/[！-～]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0),
  );
}

// ── LOINC lookup ─────────────────────────────────────────────────────

const NHI_LAB_CODE_RE = /^\d{4,6}[A-Z]$/;

function isAsciiOnly(s: string): boolean {
  for (let i = 0; i < s.length; i++) {
    if (s.charCodeAt(i) > 127) return false;
  }
  return true;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Check whether a single LOINC_MAP key matches the lab's combined
// (code + display) string. Two rules:
//
// 1. ASCII keys: `\b<key>\b` — word boundaries on BOTH sides. The
//    no-trailing-boundary semantic of the older `\b<key>` matcher
//    caused short keys like "hb" (Hemoglobin) to incorrectly match
//    longer terms like "hbsag" (HBsAg) and "phosphate" (matched by
//    "ph"). Requiring an end boundary means "hb" only matches when
//    it stands as its own word.
//
// 2. CJK / non-ASCII keys: plain substring includes(). \b doesn't
//    semantically work for CJK (no word-character class concept).
function _keywordMatches(key: string, combined: string): boolean {
  const k = key.toLowerCase();
  if (isAsciiOnly(key)) {
    return new RegExp(`\\b${escapeRegex(k)}\\b`).test(combined);
  }
  return combined.includes(k);
}

// Pick the LONGEST matching key from the table, not the first. Avoids
// the same bug family from a second angle: hyphenated keys like
// "ldl-cholesterol" share a `\b...\b` boundary at the hyphen, so "ldl"
// (3 chars) also matches a "ldl-cholesterol" string. Longest-match
// makes the more specific key win regardless of insertion order, so
// the brittle "long must appear before short" comments scattered
// through LOINC_MAP become unnecessary.
function _findLongestMatch(
  combined: string,
  table: Record<string, string>,
): string | null {
  let bestLoinc: string | null = null;
  let bestKeyLen = 0;
  for (const [key, loinc] of Object.entries(table)) {
    if (key.length > bestKeyLen && _keywordMatches(key, combined)) {
      bestLoinc = loinc;
      bestKeyLen = key.length;
    }
  }
  return bestLoinc;
}

/**
 * Return primary LOINC for this lab. Panel-aware lookup:
 *   A. Single-test NHI code → use NHI_TO_LOINC directly.
 *   B. Panel code OR unknown code → walk LOINC_MAP by display keyword
 *      (longest-key match wins, both-side word boundaries enforced).
 *   C. Fallback: panel-level LOINC from NHI_TO_LOINC if available.
 */
export function findLoinc(code: string, display: string): string | null {
  return findLoincDetailed(code, display).loinc;
}

/**
 * Same as findLoinc, but also reports HOW the match was found via the
 * `cleanMatch` flag. v0.13 — needed by mapObservation / buildObservation
 * to decide whether to canonicalize obs.code.text for CBC LOINCs (only
 * when matched via an explicit path A/B1/B alias, never the path-C
 * panel-default fallback that v0.11.9 Bug 6 exposed).
 *
 * cleanMatch semantics:
 *   - true  = matched via path A (NHI_TO_LOINC, code is single-analyte),
 *             B1 (PANEL_LOINC_MAP explicit display alias hit), or B
 *             (global LOINC_MAP display alias hit). The mapping is
 *             unambiguous; canonicalizing obs.code.text is safe.
 *   - false = matched via path C (panel-default fallback) OR no LOINC
 *             at all. Path C fires when row display didn't match any
 *             registered alias, so the panel code's umbrella LOINC was
 *             used as a guess. Keep raw display in obs.code.text so a
 *             mis-tag is visible as a label/code mismatch.
 *
 * Path A always returns cleanMatch=true regardless of display content
 * because for single-analyte NHI codes (e.g. 09006C HbA1c, 09112C TSH)
 * the code IS the analyte identifier — display is irrelevant.
 */
export function findLoincDetailed(
  code: string,
  display: string,
): { loinc: string | null; cleanMatch: boolean } {
  // A. Single-test NHI code wins outright. Clean by definition — the
  // NHI billing code uniquely identifies the analyte for these codes.
  if (code && code in NHI_TO_LOINC && !DISPLAY_FIRST_CODES.has(code)) {
    return { loinc: NHI_TO_LOINC[code] ?? null, cleanMatch: true };
  }

  const combined = `${code} ${display}`.toLowerCase();

  // B1. Panel-specific keyword map runs BEFORE the global one. Hit here
  // means the row's display explicitly matched a panel sub-analyte
  // alias — clean match.
  if (code in PANEL_LOINC_MAP) {
    const hit = _findLongestMatch(combined, PANEL_LOINC_MAP[code]!);
    if (hit) return { loinc: hit, cleanMatch: true };
  }

  // B. Global display-keyword search. Hit means display matched a
  // cross-panel canonical alias — clean match.
  const hit = _findLongestMatch(combined, LOINC_MAP);
  if (hit) return { loinc: hit, cleanMatch: true };

  // C. Panel code with no recognised item display → fall back to panel
  // default LOINC. NOT clean — display was unrecognised, the panel
  // default is a best-effort guess. The v0.11.9 Bug 6 case (帶狀嗜中性
  // 白血球 silently routed to 770-8 panel default for 08011C) lives
  // here. Callers that canonicalize text MUST gate on cleanMatch=true
  // so a mis-tag canary remains.
  if (code && code in NHI_TO_LOINC) {
    return { loinc: NHI_TO_LOINC[code] ?? null, cleanMatch: false };
  }
  return { loinc: null, cleanMatch: false };
}

/**
 * Build the Observation.code.coding[] list.
 * Priority: LOINC → NHI 醫令代碼 → local fallback.
 *
 * `nhiPanelName` (v0.11.9, SMART app dev report 2026-05-29 Category A):
 * the NHI catalog name for this billing code (e.g. "ABO血型測定檢驗"
 * for 11001C), typically sourced from raw.order_name. When provided
 * it overrides the row-level LIS `display` for `coding[nhi].display`
 * — the NHI medical order code system's `display` should be the NHI
 * catalog name (panel-level), not a per-row LIS label like the
 * generic "血型鑑定" that gets shipped under multiple distinct codes.
 * Falls back to `display` when no panel name is available.
 */
export function buildCodings(
  code: string | null | undefined,
  display: string,
  loinc: string | null,
  nhiPanelName?: string,
): Record<string, string>[] {
  const codings: Record<string, string>[] = [];
  if (loinc) {
    codings.push({
      system: "http://loinc.org",
      code: loinc,
      display: LOINC_DISPLAY[loinc] ?? display,
    });
  }
  const codeStr = (code ?? "").trim();
  if (codeStr && NHI_LAB_CODE_RE.test(codeStr)) {
    codings.push({
      system: systems.NHI_MEDICAL_ORDER_CODE,
      code: codeStr,
      display: nhiPanelName || display,
    });
  } else {
    codings.push({
      system: systems.HIS_LOCAL_LAB_CODE,
      code: codeStr || display,
      display,
    });
  }
  return codings;
}

// ── Interpretation ───────────────────────────────────────────────────

const INTERP_SYS = "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation";

function interpCoding(code: string, display: string): Record<string, string> {
  return { system: INTERP_SYS, code, display };
}

const INTERP_TABLE: Record<string, [string, string]> = {
  high: ["H", "High"],
  low: ["L", "Low"],
  normal: ["N", "Normal"],
  critical: ["AA", "Critical abnormal"],
  abnormal: ["A", "Abnormal"],
  positive: ["POS", "Positive"],
  negative: ["NEG", "Negative"],
};

export function mapInterpretation(
  interp: string | null | undefined,
): Record<string, string> | null {
  const key = (interp ?? "").toLowerCase();
  const entry = INTERP_TABLE[key];
  if (!entry) return null;
  return interpCoding(entry[0], entry[1]);
}

// Positive markers — "this is detected / abnormal".
const POS_MARKERS =
  /^\s*(?:positive|pos|reactive|detected|abnormal|present|trace|[1-4]?\s*\+(?:\s*[\+\-])*)\s*(?:\(.*\))?\s*$/i;

// Negative markers — explicitly normal/absent.
const NEG_MARKERS =
  /^\s*(?:negative|neg|nonreactive|non[-\s]?reactive|not[-\s]?detected|nd|absent|none|normal|0|[-—–]+)\s*(?:\(.*\))?\s*$/i;

function classifyQualitative(text: unknown): "pos" | "neg" | null {
  if (text === null || text === undefined) return null;
  let s = String(text).trim();
  if (s.startsWith("[") && s.endsWith("]")) {
    s = s.slice(1, -1).trim();
  }
  if (!s) return null;
  if (NEG_MARKERS.test(s)) return "neg";
  if (POS_MARKERS.test(s)) return "pos";
  return null;
}

export function deriveInterpretation(
  valueRaw: string,
  qty: Quantity | undefined,
  rr: RangeEntry | undefined,
): Record<string, string> | null {
  // 1. Numeric path.
  if (qty && typeof qty.value === "number" && rr) {
    const v = qty.value;
    const lo = rr.low?.value;
    const hi = rr.high?.value;
    if (typeof hi === "number" && v > hi) return interpCoding("H", "High");
    if (typeof lo === "number" && v < lo) return interpCoding("L", "Low");
    if (typeof lo === "number" || typeof hi === "number") return interpCoding("N", "Normal");
    return null;
  }

  // 2. Qualitative path.
  const valKind = classifyQualitative(valueRaw);
  const refText = rr?.text ?? "";
  const refKind = classifyQualitative(refText);
  if (valKind === null) return null;
  if (refKind === "neg") {
    if (valKind === "pos") return interpCoding("A", "Abnormal");
    if (valKind === "neg") return interpCoding("N", "Normal");
  }
  return valKind === "pos" ? interpCoding("POS", "Positive") : interpCoding("NEG", "Negative");
}

// ── Canonical lab key ─────────────────────────────────────────────────

const LAB_SYNONYMS: Record<string, string> = {
  // Diabetes
  醣化血紅素: "HBA1C",
  糖化血色素: "HBA1C",
  糖化血紅素: "HBA1C",
  "GLYCATED HEMOGLOBIN": "HBA1C",
  HBA1C: "HBA1C",
  A1C: "HBA1C",
  空腹血糖: "GLUCOSE_FASTING",
  "FASTING GLUCOSE": "GLUCOSE_FASTING",
  葡萄糖: "GLUCOSE",
  血糖: "GLUCOSE",
  GLUCOSE: "GLUCOSE",
  // CBC
  白血球計數: "WBC",
  白血球: "WBC",
  WBC: "WBC",
  紅血球計數: "RBC",
  紅血球: "RBC",
  RBC: "RBC",
  血紅素: "HEMOGLOBIN",
  血色素: "HEMOGLOBIN",
  HEMOGLOBIN: "HEMOGLOBIN",
  HGB: "HEMOGLOBIN",
  // v0.11.7 pre-existing gap (defensive): "Hb" was missing from
  // LAB_SYNONYMS so Hb display canonical → "hb" (fallback), not
  // HEMOGLOBIN → cross-language merge with "血紅素" never happened.
  HB: "HEMOGLOBIN",
  血容積比: "HEMATOCRIT",
  HEMATOCRIT: "HEMATOCRIT",
  HCT: "HEMATOCRIT",
  血小板: "PLATELET",
  PLATELET: "PLATELET",
  PLT: "PLATELET",
  // CBC indices (10-char and 7-char CJK forms beat bare 紅血球)
  平均紅血球血色素濃度: "MCHC",
  平均紅血球血色素: "MCH",
  平均紅血球濃度: "MCHC",
  平均紅血球體積: "MCV",
  紅血球分布寬度: "RDW",
  MCV: "MCV",
  MCH: "MCH",
  MCHC: "MCHC",
  RDW: "RDW",
  // CBC differential
  嗜中性白血球: "NEUTROPHIL",
  嗜伊紅性白血球: "EOSINOPHIL",
  嗜酸性白血球: "EOSINOPHIL",
  嗜鹼性白血球: "BASOPHIL",
  淋巴球: "LYMPHOCYTE",
  單核球: "MONOCYTE",
  EOSINOPHILS: "EOSINOPHIL",
  EOSINOPHIL: "EOSINOPHIL",
  NEUTROPHILS: "NEUTROPHIL",
  NEUTROPHIL: "NEUTROPHIL",
  BASOPHILS: "BASOPHIL",
  BASOPHIL: "BASOPHIL",
  LYMPHOCYTES: "LYMPHOCYTE",
  LYMPHOCYTE: "LYMPHOCYTE",
  MONOCYTES: "MONOCYTE",
  MONOCYTE: "MONOCYTE",
  // Lipid — LDL/HDL must precede bare CHOLESTEROL.
  "LDL CHOLESTEROL": "LDL_C",
  "LDL-CHOLESTEROL": "LDL_C",
  "HDL CHOLESTEROL": "HDL_C",
  "HDL-CHOLESTEROL": "HDL_C",
  低密度膽固醇: "LDL_C",
  高密度膽固醇: "HDL_C",
  低密度脂蛋白膽固醇: "LDL_C",
  高密度脂蛋白膽固醇: "HDL_C",
  血清總膽固醇: "TOTAL_CHOLESTEROL",
  總膽固醇: "TOTAL_CHOLESTEROL",
  "T-CHOLESTEROL": "TOTAL_CHOLESTEROL",
  "T-CHOL": "TOTAL_CHOLESTEROL",
  "TOTAL CHOLESTEROL": "TOTAL_CHOLESTEROL",
  CHOLESTEROL: "TOTAL_CHOLESTEROL",
  CHOL: "TOTAL_CHOLESTEROL",
  三酸甘油酯: "TRIGLYCERIDE",
  TRIGLYCERIDE: "TRIGLYCERIDE",
  "HDL-C": "HDL_C",
  HDL: "HDL_C",
  高密度脂蛋白: "HDL_C",
  "LDL-C(DIRECT)": "LDL_C",
  "LDL-C": "LDL_C",
  LDL: "LDL_C",
  低密度脂蛋白: "LDL_C",
  // Renal — urine creatinine variants before serum.
  // v0.11.7 fix (bug 2026-05-28): added longer-keyed entries for
  // 肌酸酐(尿液) / 微白蛋白/肌酐酸比值 so urinalysis half-quantitative
  // rows don't collide with serum creatinine via shorter "肌酸酐" key.
  // Original short keys (肌酸酐 / 肌酐酸 → CREATININE) preserved for
  // serum rows; longer urinalysis-specific keys take priority via
  // longest-match in canonicalLabKey.
  "微白蛋白/肌酐酸比值": "UACR",
  UACR: "UACR",
  "MALB/CRE": "UACR",
  "ALB/CRE": "UACR",
  "肌酸酐(尿液)": "URINE_CREATININE",
  尿液肌酸酐: "URINE_CREATININE",
  "URINE CREATININE": "URINE_CREATININE",
  "CREATININE(U)": "URINE_CREATININE",
  "CREATININE-U": "URINE_CREATININE",
  "CREA(U)": "URINE_CREATININE",
  "CREA-U": "URINE_CREATININE",
  "U-CRE": "URINE_CREATININE",
  "U-CREA": "URINE_CREATININE",
  肌酸酐: "CREATININE",
  肌酐酸: "CREATININE",
  "CREATININE(B)": "CREATININE",
  CREATININE: "CREATININE",
  CREA: "CREATININE",
  CRTN: "CREATININE",
  EGFR: "EGFR",
  尿素氮: "BUN",
  BUN: "BUN",
  尿酸鹼度: "URINE_PH",
  尿液酸鹼度: "URINE_PH",
  酸鹼度: "PH",
  尿酸: "URIC_ACID",
  "URIC ACID": "URIC_ACID",
  URIC_ACID: "URIC_ACID",
  // Liver
  AST: "AST",
  ALT: "ALT",
  GOT: "AST",
  GPT: "ALT",
  膽紅素: "BILIRUBIN",
  BILIRUBIN: "BILIRUBIN",
  // v0.11.7 (bug 2026-05-28): longer keys for urinalysis to prevent
  // collision with serum analytes — 微白蛋白(尿) wasn't 白蛋白; 白血
  // 球酯脢 wasn't blood 白血球. Longer keys take priority via
  // longest-match sorting.
  "微白蛋白(尿)": "URINE_MICROALBUMIN",
  "微白蛋白": "URINE_MICROALBUMIN",
  "MALB(U)": "URINE_MICROALBUMIN",
  MICROALBUMIN: "URINE_MICROALBUMIN",
  白蛋白: "ALBUMIN",
  ALBUMIN: "ALBUMIN",
  白血球酯脢: "URINE_LEU_ESTERASE",
  白血球酯酶: "URINE_LEU_ESTERASE",
  "WBC ESTERASE": "URINE_LEU_ESTERASE",
  "LEUKOCYTE ESTERASE": "URINE_LEU_ESTERASE",
  // Cardiac
  心肌旋轉蛋白: "TROPONIN",
  TROPONIN: "TROPONIN",
  BNP: "BNP",
  心臟: "TROPONIN",
  // Thyroid
  甲狀腺刺激素: "TSH",
  TSH: "TSH",
  游離甲狀腺素: "FREE_T4",
  "FREE T4": "FREE_T4",
  FT4: "FREE_T4",
  // Misc
  C反應性蛋白: "CRP",
  "C-REACTIVE PROTEIN": "CRP",
  CRP: "CRP",
  "HS-CRP": "HS_CRP",
  攝護腺特異抗原: "PSA",
  PSA: "PSA",
  鐵蛋白: "FERRITIN",
  FERRITIN: "FERRITIN",
  葉酸: "FOLATE",
  FOLATE: "FOLATE",
  維生素B12: "VITAMIN_B12",
  "VIT B12": "VITAMIN_B12",
  "VITAMIN B12": "VITAMIN_B12",
  皮質素: "CORTISOL",
  CORTISOL: "CORTISOL",
  梅毒: "RPR",
  RPR: "RPR",
  隱球菌抗原: "CRYPTOCOCCAL_AG",
  CRYPAG: "CRYPTOCOCCAL_AG",
  血氨: "AMMONIA",
  AMMONIA: "AMMONIA",
  凝血酶原時間: "PT",
  APTT: "APTT",
  INR: "INR",
};

// Pre-sort keys longest-first so longer/more-specific matches win.
const LAB_SYNONYM_KEYS_SORTED = Object.keys(LAB_SYNONYMS).sort((a, b) => b.length - a.length);

// v0.11.7: code-scoped synonym tables. The SAME display word can mean
// different analytes in different NHI panel codes — e.g. "Glucose" in
// 06013C (urinalysis dipstick) is urine glucose, but in 09005C/09140C
// is serum glucose. Without code context, plain "Glucose" canonical=
// GLUCOSE in global table, which causes cross-language pairs like
// "Glucose"+"尿糖" to live as two separate rows under the same
// urinalysis panel. Code-scoped table is checked FIRST when a code
// hint is supplied, then falls through to global.
const URINALYSIS_PANEL_SYNONYMS: Record<string, string> = {
  // English / abbreviation variants
  GLUCOSE: "URINE_GLUCOSE",
  "U-SUGAR": "URINE_GLUCOSE",
  SUGAR: "URINE_GLUCOSE",
  "U-GLUCOSE": "URINE_GLUCOSE",
  COLOR: "URINE_COLOR",
  COLOUR: "URINE_COLOR",
  BLOOD: "URINE_OCCULT_BLOOD",
  "U-BLOOD": "URINE_OCCULT_BLOOD",
  OB: "URINE_OCCULT_BLOOD",
  "OCCULT BLOOD": "URINE_OCCULT_BLOOD",
  PROTEIN: "URINE_PROTEIN",
  "U-PRO": "URINE_PROTEIN",
  "U-PROTEIN": "URINE_PROTEIN",
  KETONE: "URINE_KETONES",
  KETONES: "URINE_KETONES",
  KET: "URINE_KETONES",
  NITRITE: "URINE_NITRITE",
  NIT: "URINE_NITRITE",
  TURBIDITY: "URINE_TURBIDITY",
  "SP.GRAVITY": "URINE_SG",
  SG: "URINE_SG",
  "S.G.": "URINE_SG",
  "S.G": "URINE_SG",
  "SPECIFIC GRAVITY": "URINE_SG",
  UROBILINOGEN: "URINE_UROBILINOGEN",
  UBG: "URINE_UROBILINOGEN",
  URO: "URINE_UROBILINOGEN",
  // pH variants — v0.11.7 missing in initial commit; user reported
  // pH (英) + 酸鹼值 (中) still as 2 rows in 06013C bundle.
  PH: "URINE_PH",
  "P.H.": "URINE_PH",
  "P.H": "URINE_PH",
  "U-PH": "URINE_PH",
  // Bilirubin variants — separate from serum BILIRUBIN so urine
  // bilirubin (06013C) doesn't cross-panel-collide with serum
  // total bilirubin (09029C). Within scope, English "Bilirubin" and
  // CJK 膽紅素 both → URINE_BILIRUBIN → merge as 1 row.
  BILIRUBIN: "URINE_BILIRUBIN",
  BILI: "URINE_BILIRUBIN",
  "U-BILI": "URINE_BILIRUBIN",
  // CJK variants — paired with English above so cross-language dedup works
  尿糖: "URINE_GLUCOSE",
  顏色: "URINE_COLOR",
  尿潛血: "URINE_OCCULT_BLOOD",
  尿蛋白: "URINE_PROTEIN",
  酮體: "URINE_KETONES",
  亞硝酸鹽: "URINE_NITRITE",
  濁度: "URINE_TURBIDITY",
  比重: "URINE_SG",
  尿膽素原: "URINE_UROBILINOGEN",
  酸鹼值: "URINE_PH",
  酸鹼度: "URINE_PH",
  膽紅素: "URINE_BILIRUBIN",
};

const CODE_SCOPED_SYNONYMS: Record<string, Record<string, string>> = {
  "06013C": URINALYSIS_PANEL_SYNONYMS,
};
// Pre-sort CJK keys longest-first per scope (for substring matching).
const CODE_SCOPED_CJK_KEYS_SORTED: Record<string, string[]> = Object.fromEntries(
  Object.entries(CODE_SCOPED_SYNONYMS).map(([code, table]) => [
    code,
    Object.keys(table)
      .filter((k) => !isAsciiOnly(k))
      .sort((a, b) => b.length - a.length),
  ]),
);

export function canonicalLabKey(
  display: string | null | undefined,
  code?: string | null,
): string {
  if (!display) return "";
  const s = display.trim();
  if (!s) return "";
  const sUpper = s.toUpperCase();

  // v0.11.7: code-scoped lookup first. Disambiguates polysemic words
  // like "Glucose"/"Blood"/"Color" that have different analyte meaning
  // inside vs outside the urinalysis panel.
  if (code) {
    const codeUpper = code.toUpperCase();
    const scoped = CODE_SCOPED_SYNONYMS[codeUpper];
    if (scoped) {
      if (scoped[sUpper]) return scoped[sUpper]!;
      if (scoped[s]) return scoped[s]!; // CJK case-sensitive
      for (const key of CODE_SCOPED_CJK_KEYS_SORTED[codeUpper] ?? []) {
        if (s.includes(key)) return scoped[key]!;
      }
    }
  }

  for (const key of LAB_SYNONYM_KEYS_SORTED) {
    const ku = key.toUpperCase();
    if (isAsciiOnly(ku)) {
      // Leading word-boundary only — "AST" inside "DIASTOLIC" should not match.
      if (new RegExp(`\\b${escapeRegex(ku)}`).test(sUpper)) {
        return LAB_SYNONYMS[key]!;
      }
    } else if (sUpper.includes(ku)) {
      return LAB_SYNONYMS[key]!;
    }
  }
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

// ── Panel grouping helpers ────────────────────────────────────────────

function cjkChars(s: string): number {
  if (!s) return 0;
  let n = 0;
  for (const ch of s) {
    const cp = ch.codePointAt(0) ?? 0;
    if (cp >= 0x4e00 && cp <= 0x9fff) n++;
  }
  return n;
}

function isEnglishDominant(s: string): boolean {
  let latin = 0;
  for (const ch of s) {
    const cp = ch.charCodeAt(0);
    if (cp < 128 && /[A-Za-z]/.test(ch)) latin++;
  }
  return latin >= 2 && cjkChars(s) === 0;
}

function normalizeValueForDedup(v: unknown): string {
  if (v === null || v === undefined) return "";
  let s = String(v).trim().toLowerCase();
  s = s.replace(/\([^)]*\)/g, "").trim();
  s = s.replace(/\s+/g, " ");
  return s;
}

function isMeaningfulValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  const s = String(value).trim();
  return s !== "" && s !== "—" && s !== "-" && s !== "N/A" && s !== "null";
}

// Replace bogus / non-UCUM units with canonical UCUM symbols. Two
// classes of fixup:
//   1. Bogus units (empty / "N" placeholder) → fill in canonical
//      based on analyte. Bug report Part 3 C2 (eGFR).
//   2. Non-UCUM symbols in otherwise-valid units → normalize to UCUM.
//      Bug report Part 6 N5/N6: full-width ㎡ (U+33A1) used by some
//      Taiwan LIS instead of "m2", and "gm/dl" instead of UCUM
//      canonical "g/dL". Downstream unit-aware tools (UCUM converters,
//      trend chart axis labelling, abnormal-flag computation) fail on
//      non-canonical symbols.
// Whitelist approach keeps changes scoped — only known patterns get
// rewritten, everything else passes through.
// v0.11.13 (SMART app dev bug 9b 2026-05-29): placeholder strings
// emitted by Taiwan LIS as the unit field — not UCUM, not real units,
// just LIS's way of encoding "no unit". Patterns observed in user's
// v0.11.10 bundle for INR rows (LOINC 6301-6 is dimensionless):
//   "空白空白" / "空白"    LIS literal for "blank blank"
//   "-" / "—" / "–"        ASCII / em-dash / en-dash dashes
//   "N/A" / "n/a"          not-applicable text
//   "nil" / "NIL" / "Nil"  Latin nil
//   "無"                   Chinese "no"
// All of these get coerced to empty so the downstream Quantity has
// no `unit` field (FHIR R4 Quantity.unit is 0..1 — optional and the
// preferred form for genuinely dimensionless values like INR).
//
// Also enables dedup collapse: two INR rows with placeholder unit
// "空白空白" and "-" but same value collide after cleaning since
// dedupeCrossFormat key includes unit.
const PLACEHOLDER_UNIT_RE =
  /^(?:空白空白|空白|n\/a|n\.a\.?|nil|無|null|none|未|—|–|-{1,3})$/i;

function _canonicalizeUnit(display: string, _code: string, rawUnit: string): string {
  let u = (rawUnit ?? "").trim();

  // v0.11.13: collapse placeholder strings to empty BEFORE bogus check
  // so they get the analyte-aware auto-fill path (e.g. eGFR units).
  if (PLACEHOLDER_UNIT_RE.test(u)) {
    u = "";
  }

  // Class 1: bogus unit fixup (analyte-aware fill-in).
  const isBogus = u === "" || u === "N" || u === "n";
  if (isBogus) {
    // eGFR — Taiwan LIS quirk. LOINC 33914-3 canonical unit is mL/min/1.73m2.
    if (/egfr|estimated\s*gfr|estimated\s*glomerular|腎絲球過濾率/i.test(display)) {
      return "mL/min/1.73m2";
    }
    return u; // return cleaned empty string, not the raw placeholder
  }

  // Class 2: valid-but-non-UCUM normalization. Applies to all
  // analytes (no display-keyword gate) since the substitutions are
  // unambiguous: ㎡ is always meant as m2, "gm" is never a valid mass
  // unit (UCUM uses "g"), uppercase "L" for liter.
  let normalized = u;
  // U+33A1 SQUARE M (full-width ㎡) → UCUM "m2". Other CJK-typography
  // unit glyphs we've seen in NHI raw: U+339D SQUARE M (cm), U+33A0
  // SQUARE MM (mm), U+33A2 SQUARE KM (km). Only ㎡ shows up in lab
  // values (eGFR area-normalized), but normalize the family for safety.
  normalized = normalized
    .replace(/㎡/g, "m2") // ㎡
    .replace(/㎝/g, "cm") // ㎝
    .replace(/㎠/g, "mm") // ㎜
    .replace(/㎢/g, "km"); // ㎞
  // "gm" → "g" (mass) — bounded to mass-context only via the trailing
  // "/". Patterns observed: "gm/dl", "gm/dL", "gm/L", "gm/100mL".
  // Don't touch unrelated tokens (e.g. wouldn't change "stigma").
  normalized = normalized.replace(/\bgm(\s*\/)/gi, "g$1");
  // "/dl" / "/dl." / "/dL" → "/dL" (case fix only; UCUM is case-
  // sensitive and "L" must be uppercase). Mass-volume concentrations.
  normalized = normalized.replace(/\/d[lL]\.?/g, "/dL");
  // Lowercase "l" elsewhere in concentration suffixes ("mg/l" etc.)
  normalized = normalized.replace(/\/(\d*)l\b/g, "/$1L");
  // v0.11.1: Chinese 倍數 ("ratio multiplier") seen in coag panel
  // (APTT ratio). Not UCUM. Map to UCUM annotation {ratio} per
  // unitsofmeasure.org convention (curly-brace annotation is valid
  // UCUM and renders as "ratio" in unit-aware tools).
  if (normalized === "倍數" || normalized === "倍") {
    return "{ratio}";
  }

  return normalized;
}

const MEANINGFUL_INTERPS = new Set([
  "normal",
  "abnormal",
  "high",
  "low",
  "critical",
  "positive",
  "negative",
]);

function dedupePanelItems(items: Record<string, any>[]): Record<string, any>[] {
  // v0.11.7 fix: dedup key now includes display string. Original
  // (value-only) key was meant to merge same-analyte cross-language
  // variants (e.g. "Hb"+"血紅素" both 14 g/dL → keep English). BUT
  // it falsely merged DIFFERENT analytes with same value within a
  // panel (e.g. 06013C urinalysis: Bilirubin, 亞硝酸鹽, 酮體, 膽紅素
  // are all "Negative" mg/dL — all collided into one group; CJK+EN
  // mix branch then kept only enItems[0]=Bilirubin, silently dropping
  // 3+ distinct analytes per panel per day). Bug 2026-05-28: user's
  // 20-row 06013C urinalysis panel → 11 in bundle (9 silent drops).
  //
  // Adding display to the key prevents the false merge. Cost: same-
  // analyte cross-language duplicates (Hb+血紅素) no longer auto-
  // merge — but in real Taiwan LIS data this is rare (hospitals pick
  // one display convention). Future enhancement: use canonicalLabKey
  // for known synonyms so Hb/血紅素 still merge while preserving
  // distinct analyte separation.
  const byKey = new Map<string, Record<string, any>[]>();
  for (const it of items) {
    const k = `${normalizeValueForDedup(it.value)}|${String(it.display ?? "")
      .toLowerCase()
      .trim()}`;
    const group = byKey.get(k);
    if (group) group.push(it);
    else byKey.set(k, [it]);
  }
  const out: Record<string, any>[] = [];
  for (const group of byKey.values()) {
    if (group.length === 1) {
      out.push(group[0]!);
      continue;
    }
    // Group with multiple items = exact display + value match → these
    // are true duplicates from NHI re-uploading. Apply the original
    // EN-preferred merge logic.
    const cjkItems = group.filter((g) => cjkChars(String(g.display ?? "")) >= 2);
    const enItems = group.filter((g) => isEnglishDominant(String(g.display ?? "")));
    if (cjkItems.length > 0 && enItems.length > 0) {
      out.push(enItems[0]!);
    } else {
      out.push(...group);
    }
  }
  return out;
}

function filterLabRows(rawItems: any[]): Record<string, any>[] {
  const out: Record<string, any>[] = [];
  for (const raw of rawItems) {
    if (!raw || typeof raw !== "object") continue;
    const display = raw.display || raw.code || "";
    // v0.11.1: drop QC control rows (Nor.plasma mean etc.) — these
    // are lab-internal denominators for ratio calculations, NOT
    // patient measurements. See looksLikeQcControl() for patterns.
    if (looksLikeQcControl(String(display))) continue;
    // v0.11.11: drop specimen quality flags (溶血/脂血/icterus) — they
    // are NOT patient analyte values and previously borrowed the host
    // billing code's LOINC, polluting SMART app trend charts with
    // "BUN=0" / "Cholesterol=0" spurious data points.
    if (looksLikeQualityFlag(String(display))) continue;
    // v0.11.11: drop narrative / comment rows (`:`, `PEP-Comment`,
    // `備註`) — they're report-text fragments piggybacking on an
    // analyte billing code, not Observations. Underlying real analyte
    // rows under the same billing code carry the patient measurement.
    if (looksLikeNarrativeRow(String(display))) continue;
    const value = raw.value;
    const interp = (raw.interpretation ?? "").toString().toLowerCase();
    const hasValue = isMeaningfulValue(value);
    const hasMeaningfulInterp = MEANINGFUL_INTERPS.has(interp);
    if (!hasValue && !hasMeaningfulInterp) continue;
    out.push(raw);
  }
  return out;
}

// ── NHI multi-channel structural-duplicate dedup (v0.12.4) ──────────
// NHI 健保存摺 ships the same measurement under two upload channels —
// A (特約醫事機構不定期上傳) and B (定期上傳). For chemistry rows like
// 鈉/K/Ca/Mg, NHI's source EHR uploads the row via channel A early
// (English display, numeric refRange) AND again via channel B later
// (Chinese display, text-only refRange like "[無][無]"). The two API
// rows represent THE SAME logical measurement — there's only one
// blood draw, one analyte, one value — they're NHI's structural
// duplicate from dual-channel upload, not separate measurements.
//
// User principle (v0.12.4 2026-05-29 clarification):
// > "你要考量到這份 fhir json 可能給其他非我開發的 smart app 使用，如果把
// > dedup 的責任都放在 app 端，會有大問題。你有忠實搬運，但不能明明 UI
// > 顯示只有一筆你抓了兩筆。"
//
// Bridge must dedup A+B structural pairs so any downstream SMART app
// sees one Observation per logical measurement. This is NOT bridge-
// side clinical judgement; it's removing the structural artifact of
// NHI's multi-channel upload design.
//
// Dedup criteria (must ALL match):
//   - same NHI order code (ordeR_CODE)
//   - same date (reaL_INSPECT_DATE / funC_DATE — already on raw.date)
//   - same hospital
//   - same value
//   - same unit
//   - one row has orI_TYPE=A AND another has orI_TYPE=B (different channels)
//
// When all match → keep A (numeric refRange, more clinically useful);
// drop B.
//
// What's PRESERVED (not deduped — those are real distinct readings):
//   - same-source double-upload (A+A or B+B): treated as true NHI upload
//     duplicate per faithful-transport rule, both kept
//   - different values: legitimate multi-reading (e.g. ICU same-day draws)
//   - different code OR date OR hospital OR unit: different measurements
//
// Per CLAUDE.md memory rule (revised v0.12.4): "bridge does not judge
// data validity with its own clinical reasoning, but must mirror NHI
// 健康存摺 UI's per-measurement semantics — A+B same-measurement pairs
// are NHI's structural duplicate and must be deduped at the bridge."
function dedupNhiCrossChannelPairs(
  items: Record<string, any>[],
): Record<string, any>[] {
  // v0.12.5 (NHI raw audit 2026-05-29): refine v0.12.4 logic which
  // only fired for exactly 1A+1B. NHI raw also has higher-multiplicity
  // mixed cases — 2A+2B (hospital uploaded same analyte twice via each
  // channel) and 3A+3B (urinalysis Negative-valued rows across 3
  // distinct sub-analytes). Need:
  //   1. Wider trigger: ANY A AND ANY B in same group → cross-channel
  //      pair detected, keep A's drop B's.
  //   2. Canonical-aware grouping for multi-analyte panels: under
  //      06013C three different sub-analytes (Bilirubin/Ketone/Nitrite)
  //      all carry value="Negative" — without canonical-split they'd
  //      collapse into one group and the B Chinese sub-analytes might
  //      drop against the wrong A English sub-analyte. Use
  //      canonicalLabKey() (which has code-scoped synonyms) to ensure
  //      Bilirubin/膽紅素 group separately from Nitrite/亞硝酸鹽.
  //
  // For single-analyte codes (NOT in DISPLAY_FIRST_CODES), the canonical
  // is intentionally NOT used in the grouping key — under 09021C every
  // row IS sodium regardless of whether display is "Na" or "鈉", and we
  // want them to collapse in one group.
  const groups = new Map<string, Record<string, any>[]>();
  const order: string[] = [];
  for (const item of items) {
    const code = String(item.code ?? item.order_code ?? "").trim();
    const date = String(item.date ?? "").trim();
    const hospital = String(item.hospital ?? "").trim();
    const value = String(item.value ?? "").trim();
    const unit = String(item.unit ?? "").trim();
    // Multi-analyte panels carry per-row sub-analyte identity — use
    // canonical to split. Single-analyte codes don't need it (the panel
    // billing code itself identifies the analyte).
    const display = String(item.display ?? "").trim();
    const isPanel = DISPLAY_FIRST_CODES.has(code);
    const canonical = isPanel ? canonicalLabKey(display, code) || display.toLowerCase() : "";
    const key = `${code}|${date}|${hospital}|${value}|${unit}|${canonical}`;
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key)!.push(item);
  }

  const out: Record<string, any>[] = [];
  for (const key of order) {
    const group = groups.get(key)!;
    if (group.length < 2) {
      out.push(...group);
      continue;
    }
    const aRows = group.filter(
      (r) => String(r.nhi_source_channel ?? "").toUpperCase() === "A",
    );
    const bRows = group.filter(
      (r) => String(r.nhi_source_channel ?? "").toUpperCase() === "B",
    );
    // Cross-channel detected (any A AND any B): keep all A rows
    // (numeric refRange more clinically useful), drop all B rows.
    // This handles 1A+1B / 2A+2B / 3A+3B / 2A+1B / 1A+2B uniformly.
    if (aRows.length > 0 && bRows.length > 0) {
      out.push(...aRows);
    } else {
      // Pure A or pure B (no cross-channel) → preserve all rows. Same-
      // source double-uploads are real NHI signal per multi-reading rule.
      out.push(...group);
    }
  }
  return out;
}

function dedupeCrossFormat(items: Record<string, any>[]): Record<string, any>[] {
  const orderCode = (it: Record<string, any>): string =>
    ((it.order_code as string) ?? "").trim().toUpperCase();

  const byKey = new Map<string, Record<string, any>>();
  let idxCounter = 0;
  for (const item of items) {
    const v = String(item.value ?? "").trim();
    // v0.12.1 (Bug 9' / strict no-dedup principle): use the raw unit
    // string in the dedup key. v0.11.13 normalised placeholder units
    // ("空白空白" / "-") to empty BEFORE key construction, which had
    // the side-effect of collapsing two LIS-uploaded rows that only
    // differed in placeholder encoding. Per the bridge's faithful-
    // transport principle (codified in CLAUDE.md), we don't dedup
    // based on bridge-side judgement of "two placeholder units = same
    // intent" — LIS uploaded N rows, the bundle emits N obs, full
    // stop. `_canonicalizeUnit` still clears placeholders so the
    // emitted Quantity.unit is FHIR-R4-valid (or absent), but that
    // cleanup happens later in buildObservation and doesn't affect
    // dedup keys here.
    const rawUnit = ((item.unit as string) ?? "").trim();
    const unit = rawUnit;
    if (!v) {
      byKey.set(`__no_dedup__|${idxCounter++}`, item);
      continue;
    }
    // v0.11.7 fix: include display in key (same fix as dedupePanelItems
    // — see that function's docstring for full rationale). Bug 2026-05-28:
    // 06013C urinalysis panel collisions on "Negative" mg/dL across
    // different analytes.
    const key = [
      (item.date as string) ?? "",
      v.toLowerCase(),
      unit.toLowerCase(),
      orderCode(item),
      String(item.display ?? "")
        .toLowerCase()
        .trim(),
    ].join("|");
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, item);
      continue;
    }
    // Prefer the row with FEWER CJK characters (English clinical reads).
    let primary: Record<string, any>;
    let secondary: Record<string, any>;
    if (cjkChars(item.display ?? "") < cjkChars(existing.display ?? "")) {
      primary = item;
      secondary = existing;
    } else {
      primary = existing;
      secondary = item;
    }
    const merged: Record<string, any> = { ...primary };
    for (const f of ["order_code", "order_name", "hospital", "code"]) {
      if (!merged[f] && secondary[f]) merged[f] = secondary[f];
    }
    byKey.set(key, merged);
  }
  return Array.from(byKey.values());
}

interface BpComponent {
  loinc: string;
  display: string;
  value: number;
  unit: string;
  interpretation_text: string;
}

function combineBpItems(items: Record<string, any>[]): Record<string, any>[] {
  const byKey = new Map<
    string,
    { systolic?: Record<string, any>; diastolic?: Record<string, any> }
  >();
  const passThrough: Record<string, any>[] = [];
  for (const it of items) {
    const disp = String(it.display ?? "").toLowerCase();
    const key = `${it.date ?? ""}|${it.hospital ?? ""}`;
    if (disp.includes("systolic blood pressure")) {
      const v = byKey.get(key) ?? {};
      v.systolic = it;
      byKey.set(key, v);
    } else if (disp.includes("diastolic blood pressure")) {
      const v = byKey.get(key) ?? {};
      v.diastolic = it;
      byKey.set(key, v);
    } else {
      passThrough.push(it);
    }
  }

  for (const parts of byKey.values()) {
    const s = parts.systolic;
    const d = parts.diastolic;
    const primary = s ?? d;
    if (!primary) continue;
    const components: BpComponent[] = [];
    const tryAdd = (src: Record<string, any> | undefined, loinc: string, display: string) => {
      if (!src) return;
      const val = src.value;
      if (val === null || val === undefined || val === "" || val === "-" || val === "—") return;
      const num = Number.parseFloat(String(val).replace(/,/g, ""));
      if (!Number.isFinite(num)) return;
      components.push({
        loinc,
        display,
        value: num,
        unit: src.unit || "mmHg",
        interpretation_text: src.reference_range || "",
      });
    };
    tryAdd(s, "8480-6", "Systolic blood pressure");
    tryAdd(d, "8462-4", "Diastolic blood pressure");
    if (components.length === 0) continue;
    const combined: Record<string, any> = { ...primary };
    combined.display = "Blood Pressure";
    combined.code = "";
    combined.order_code = "";
    combined.order_name = "Blood Pressure";
    combined.category = "vital-signs";
    combined.bp_components = components;
    combined.bp_panel_loinc = "85354-9";
    combined.value = undefined;
    combined.unit = undefined;
    passThrough.push(combined);
  }

  return passThrough;
}

// ── Specimen inference ────────────────────────────────────────────────
//
// v0.13.0 (SMART app dev follow-up bug report 2026-05-29 + user
// architectural correction 2026-05-30): the pre-v0.13 rule list led
// with `/尿|urine|urinaly/` which substring-matched bare 尿 inside
// BLOOD analyte names: 尿酸 (UA blood, NHI 09013C), 尿素氮 (BUN blood,
// NHI 09002C). The bridge was emitting `specimen.display='Urine'` on
// 35+ blood-analyte Observations across the user's bundle, making the
// obs route to the urinalysis tab in clinicians' SMART app and silently
// disappear from the serum chemistry tab. App dev called this the
// highest-priority bug because the disappearance is invisible.
//
// User correction (the right architecture): **NHI 醫令碼 is the
// authoritative signal for specimen**, same way it's authoritative for
// LOINC routing (NHI_TO_LOINC + PANEL_LOINC_MAP). The NHI catalog
// organises codes by prefix series:
//   06xxxC = urinalysis (urine)
//   08xxxC = CBC / hematology (blood)
//   09xxxC = chemistry (mostly blood; specific urine subcodes like
//            09016C 肌酐、尿 are exceptions)
//   11xxxC = blood typing (blood)
//   12xxxC = immunology / serology / tumor markers (blood)
//   13/14/24/27xxxC = specialty serum (blood)
// So inferSpecimen consults NHI_CODE_PREFIX_SPECIMEN + override map
// BEFORE falling back to display/order_name regex. The display can
// still override when it explicitly says urine — handles the 09015C
// blood-default code with a urine sub-row (NHI catalog default is
// 肌酸酐、血 but some hospitals mis-bill urine creatinine under it).
//
// Priority order:
//   1. Display URINE marker (specific terms only, no bare 尿) — LIS-
//      shipped display knows actual measured specimen, overrides NHI
//      code default. Handles 09015C 肌酸酐(尿液) row case.
//   2. Other-specimen rules (Stool / Sputum / CSF / Pleural / etc.) —
//      run BEFORE the BLOOD code rule so "occult blood" stool test
//      doesn't pick up BLOOD. These specimens have no dedicated NHI
//      prefix series so display/order_name is the only signal.
//   3. NHI 醫令碼 default — authoritative for known codes.
//   4. Regex fallback on display + order_name — for unknown codes only.
//
// FHIR R4 / faithful-transport check: `Specimen.display` is free-form
// text on a `Reference` element (we don't emit a separate Specimen
// resource), labelling our own output. Patient values / NHI codes /
// LOINC mappings untouched. Labelling correction, not value mutation.

// URINE — explicit Chinese markers (no bare 尿), English specifics.
// Used as DISPLAY URINE detector (highest precedence) — must be quite
// specific so 尿酸 / 尿素 (blood analytes whose names contain 尿) don't
// trigger.
const URINE_MARKERS_RE =
  /尿液|尿道|尿沉渣|尿沈渣|尿生化|尿常規|尿液檢查|尿糖|尿蛋白|尿細胞|尿酮體?|尿膽紅素|尿膽素原|尿微量白蛋白|尿白蛋白|尿微白蛋白|小便|\(尿(?:液)?\)|urinaly|urinal|\burine\b|u-malb|u-acr|u-cre|u-mab|u-pcr/i;

// Specimen markers that aren't URINE/BLOOD. Checked BEFORE the NHI
// code default so e.g. a synovial-fluid test (16008C panel) labelled
// with "synovial" / "關節液" gets the more specific specimen rather
// than the prefix-default Blood.
const OTHER_SPECIMEN_RULES: ReadonlyArray<[RegExp, string]> = [
  [/糞|便潛血|stool|fecal|faecal|occult\s*blood/i, "Stool"],
  [/痰|sputum/i, "Sputum"],
  [/腦脊液|csf|cerebrospinal/i, "Cerebrospinal fluid"],
  [/胸水|pleural/i, "Pleural fluid"],
  [/腹水|ascites|peritoneal/i, "Peritoneal fluid"],
  [/陰道|抹片|cervical|pap\s*smear|vaginal/i, "Cervical/Vaginal"],
  [/關節液|synovial|joint\s*fluid/i, "Synovial fluid"],
  [/羊水|amniotic/i, "Amniotic fluid"],
  [/骨髓|bone\s*marrow/i, "Bone marrow"],
];

// NHI 醫令碼 prefix → default specimen. Per NHI catalog structure.
// Two-character prefix lookup; subcodes can override via the explicit
// NHI_CODE_SPECIMEN_OVERRIDE map below.
const NHI_CODE_PREFIX_SPECIMEN: Readonly<Record<string, string>> = {
  "06": "Urine", // 06013C 尿生化檢查 / 06014C 尿沉渣 / urinalysis family
  "08": "Blood", // 08003C 血色素 / 08004C HCT / 08011C CBC / 08013C diff
  "09": "Blood", // Chemistry — vast majority blood/serum (exceptions in override)
  "11": "Blood", // 11001C ABO / 11003C RH / 11004C antibody — blood typing
  "12": "Blood", // 12007C AFP / 12021C CEA / 12025B Ig-G / 12053C ANA …
  "13": "Blood", // Specialty serum (less common)
  "14": "Blood", // Specialty serum (e.g. coagulation panels)
  "24": "Blood", // e.g. 24007B 血漿游離鈣
  "27": "Blood", // Specialty serum / RIA hormones (e.g. 27021B testosterone free)
};

// Specific overrides for codes where the prefix-default is wrong.
// Add entries as NHI catalog audit / SMART app dev reports reveal them.
const NHI_CODE_SPECIMEN_OVERRIDE: Readonly<Record<string, string>> = {
  "09016C": "Urine", // 肌酐、尿 — Urine creatinine (the official urine-crea code)
};

function nhiCodeSpecimen(code: string | null | undefined): string | null {
  const c = String(code ?? "").trim().toUpperCase();
  if (!c) return null;
  if (c in NHI_CODE_SPECIMEN_OVERRIDE) return NHI_CODE_SPECIMEN_OVERRIDE[c] ?? null;
  const prefix = c.slice(0, 2);
  return NHI_CODE_PREFIX_SPECIMEN[prefix] ?? null;
}

function inferSpecimen(
  orderName: string | null | undefined,
  display: string | null | undefined,
  code: string | null | undefined,
): string | null {
  const displayStr = String(display ?? "");
  const orderStr = String(orderName ?? "");

  // 1. Display URINE marker — highest precedence. The LIS-shipped
  //    display tells us what was ACTUALLY measured, overriding any
  //    NHI catalog default. Handles 09015C blood-default code where
  //    the row's display is "肌酸酐(尿液)" (urine creatinine mis-billed
  //    under blood code by some hospital LIS).
  if (URINE_MARKERS_RE.test(displayStr)) return "Urine";

  // 2. Other specimens (Stool / Sputum / CSF / Pleural / Bone marrow /
  //    Synovial / Amniotic / Cervical). These don't have dedicated NHI
  //    prefix series; display/order_name is the only signal. Stool
  //    rule runs before any BLOOD detection so "occult blood" stool
  //    test isn't mis-tagged.
  const blob = `${orderStr} ${displayStr}`.toLowerCase();
  for (const [pattern, label] of OTHER_SPECIMEN_RULES) {
    if (pattern.test(blob)) return label;
  }

  // 3. NHI 醫令碼 default — authoritative for known codes (see
  //    NHI_CODE_PREFIX_SPECIMEN + NHI_CODE_SPECIMEN_OVERRIDE). This is
  //    the structural fix that eliminates the bare-尿 substring bug:
  //    09013C 尿酸 → prefix 09 → Blood; 09002C 血中尿素氮 → prefix 09 →
  //    Blood; 06013C urinalysis sub-rows → prefix 06 → Urine (even when
  //    the row's display is something ambiguous like "Color").
  const codeDefault = nhiCodeSpecimen(code);
  if (codeDefault) return codeDefault;

  // 4. Unknown NHI code — fall back to order_name URINE marker check.
  //    No bare-BLOOD regex on display/order_name here: in the absence
  //    of a recognised NHI code AND no explicit URINE marker, returning
  //    null is safer than guessing Blood from a stray 血 substring.
  if (URINE_MARKERS_RE.test(orderStr)) return "Urine";

  return null;
}

// ── Structural LOINC vs unit consistency fix (v0.11.13) ──────────────
// SMART app dev bug 9a 2026-05-29: some Taiwan LIS rows shipped INR
// (dimensionless RelTime LOINC 6301-6) with a seconds unit — that
// combination is structurally impossible. Reroute the LOINC to the
// time-domain sibling so the obs is internally consistent and the
// downstream SMART app's LOINC-pivoted trend chart doesn't show "INR
// = 11.9" (which reads as a fatal anticoagulation overdose).
//
// Faithful transport: LOINC corrections are allowed per user rule.
// Patient value / date / hospital / unit untouched. Raw NHI display
// stays in coding[nhi].display via buildCodings.
//
// FHIR R4 compliance: this only modifies Coding.code (LOINC code is
// still a valid LOINC after reroute); display/text resolution after
// reroute uses LOINC_DISPLAY[new-loinc] + LOINC_SHORT_TEXT[new-loinc].
const RATIO_TO_TIME_LOINC: Record<string, string> = {
  "6301-6": "5902-2", // INR → PT (Prothrombin time, sec)
  "63561-5": "14979-9", // APTT actual/normal ratio → APTT time (sec)
  "5894-1": "5902-2", // PT actual/Normal ratio → PT time (sec)
};
const TIME_UNIT_RE = /^(?:sec|s|seconds?|秒)$/i;

function structuralLoincFix(
  loinc: string | null,
  rawUnit: unknown,
): string | null {
  if (!loinc) return loinc;
  const sibling = RATIO_TO_TIME_LOINC[loinc];
  if (!sibling) return loinc;
  const u = String(rawUnit ?? "").trim();
  if (TIME_UNIT_RE.test(u)) {
    return sibling;
  }
  return loinc;
}

// ── Urine protein scale routing (v0.12.2) ────────────────────────────
// SMART app dev v0.12.1 audit 2026-05-29: LOINC 20454-5 is dipstick
// presence (Property=PrThr, Scale=Ord — Negative/Trace/+/2+) but bridge
// was routing quantitative mg/dL values to it too, producing
// structurally-mismatched Observations (Qn data on an Ord LOINC).
//
// Three real-world value patterns per loinc.org verification:
//   - Pure qualitative (e.g. "Negative" / "Trace" / "1+") → 20454-5 (Ord)
//   - Pure quantitative (e.g. "48" with unit "mg/dL") → 2888-6 (Qn) —
//     verified at loinc.org/2888-6/ as Protein MCnc Urine
//   - Combined dipstick+number (e.g. "4+ (2000)" / "Trace (15)") →
//     20454-5 with valueString preserving the full hybrid form. The
//     leading dipstick grade is the primary clinical reading; the
//     parenthetical is the strip's approximate mg/dL conversion.
//     valueString keeps both pieces; promoting to 2888-6 + extracting
//     just the number would lose the grade context.
//
// Same structural-fix pattern as v0.11.13 9a structuralLoincFix (for
// INR-sec mistag → PT reroute). Patient value/unit untouched; only
// LOINC and downstream display labels swap. Per CLAUDE.md rule, LOINC
// corrections are allowed.
const URINE_PROTEIN_QUALITATIVE_LOINC = "20454-5";
const URINE_PROTEIN_QUANTITATIVE_LOINC = "2888-6";
const URINE_PROTEIN_COMBINED_RE =
  /^(?:[\d.]+\+|trace|positive|negative|\+|-)\s*[(（]/i;
const URINE_PROTEIN_NUMERIC_RE = /^[\d.]+$/;
const URINE_PROTEIN_MASS_UNIT_RE = /^mg\s*\/\s*d\s*l$/i;

// ── NHI source channel meta.tag (v0.12.3) ────────────────────────────
// NHI 健保存摺 ships the same measurement under two upload channels —
// A (特約醫事機構不定期上傳, real-time-ish) and B (定期上傳, batch
// sync). Verified directly against /api/ihke3000/ihke3409s01/page_load
// 2026-05-29: of 113 dup pairs in the user's v0.12.1 bundle, 92 were
// NHI-side A+B pairs for the same draw, not bridge transformer
// artifacts. NHI's own UI dedupes some pairs visually (urinalysis
// shows both; chem panel often collapses to the most recently
// uploaded row), but the underlying API returns all raw rows.
//
// Per the strict-no-dedup rule (CLAUDE.md), bridge preserves all raw
// rows as distinct Observations. Surfacing the channel via meta.tag
// lets SMART apps dedup-by-source as a clinician UI choice without
// requiring the bridge to encode that judgement.
//
// Tag system URL is bridge-namespaced (not an official NHI URL) since
// NHI doesn't publish a coded ValueSet for this; the codes "A" / "B"
// match the upstream orI_TYPE values verbatim for trivial round-trip.
const NHI_SOURCE_CHANNEL_SYSTEM = "http://nhi-fhir-bridge/nhi-source-channel";

function appendNhiSourceChannelTag(
  resource: Record<string, any>,
  raw: Record<string, any>,
): void {
  const code = String(raw.nhi_source_channel ?? "").trim().toUpperCase();
  if (!code) return;
  const displayName = String(raw.nhi_source_channel_name ?? "").trim();
  const tag: Record<string, string> = {
    system: NHI_SOURCE_CHANNEL_SYSTEM,
    code,
  };
  if (displayName) tag.display = displayName;
  if (!resource.meta) resource.meta = { versionId: "1", source: "nhi-fhir-bridge/scraper" };
  if (!Array.isArray(resource.meta.tag)) resource.meta.tag = [];
  resource.meta.tag.push(tag);
}

// v0.13 — NHI 就醫日期 (funC_DATE) surfaced via meta.tag.
//
// NHI lab rows carry two date-ish fields: funC_DATE (visit registration /
// admission date) and reaL_INSPECT_DATE (actual sample-collection date).
// Bridge uses reaL_INSPECT_DATE as Observation.effectiveDateTime per the
// v0.6.1 fix — that's the FHIR "physiologically relevant time" for a lab.
// But funC_DATE carries independently-useful provenance: it lets a
// downstream SMART app spot anomalies where a lab inspect date is months
// after the visit date (suggesting late hospital reporting, or roving
// outpatient lab orders that were finally drawn weeks later — verified
// real-world case 2026-05-30: 長庚嘉義 09006C HbA1c shows
// reaL_INSPECT_DATE=2025-12-09 but funC_DATE=2025-09-16, ~3 months gap).
//
// Per CLAUDE.md faithful-transport principle, bridge does NOT pick which
// date is "correct" — both are NHI-supplied facts. effectiveDateTime
// stays on inspect date (clinically the right anchor for trending);
// visit date rides along in meta.tag so apps that want to detect /
// display the discrepancy can.
//
// Format: meta.tag code is the funC_DATE in ISO 8601 (YYYY-MM-DD), same
// shape as raw.nhi_visit_date pushed by the extension adapter.
//
// Apps that don't know this tag system URI ignore it per the FHIR R4
// Meta.tag spec — non-breaking by design (same precedent as v0.12.3
// nhi-source-channel tag).
const NHI_VISIT_DATE_SYSTEM = "http://nhi-fhir-bridge/nhi-visit-date";

function appendNhiVisitDateTag(
  resource: Record<string, any>,
  raw: Record<string, any>,
): void {
  const visitDate = String(raw.nhi_visit_date ?? "").trim();
  if (!visitDate) return;
  if (!resource.meta) resource.meta = { versionId: "1", source: "nhi-fhir-bridge/scraper" };
  if (!Array.isArray(resource.meta.tag)) resource.meta.tag = [];
  resource.meta.tag.push({
    system: NHI_VISIT_DATE_SYSTEM,
    code: visitDate,
  });
}

/**
 * v0.13 — Resolve obs.code.text using clean-match guard.
 *
 * Existing behaviour (v0.11.9 → v0.12.6): when row resolves to a LOINC
 * with a LOINC_SHORT_TEXT entry, use the short text as `code.text`. This
 * was added for single-analyte panels (TSH, HbA1c, etc.) where path A
 * in findLoinc is the only routing → match is always clean → no canary
 * needed.
 *
 * v0.13 extends LOINC_SHORT_TEXT to 12 CBC LOINCs whose NHI codes live
 * in multi-analyte panels (08011C / 08013C). For those, canonicalizing
 * text on a path-C fallback would hide mis-tags (v0.11.9 Bug 6 lesson).
 * So when the LOINC is in CBC_CANONICAL_TEXT_LOINCS, only use the short
 * text override when cleanMatch === true. Otherwise raw display wins so
 * a mis-tag is visible as a label/code mismatch.
 *
 * Other LOINCs (non-CBC) keep the v0.11.10 "always use SHORT_TEXT when
 * present" behaviour — no change.
 */
function resolveObsCodeText(
  loinc: string | null,
  code: string,
  display: string,
  cleanMatch: boolean,
): string {
  const shortTextAllowed =
    !!loinc &&
    !!LOINC_SHORT_TEXT[loinc] &&
    (!CBC_CANONICAL_TEXT_LOINCS.has(loinc) || cleanMatch);
  const shortText = shortTextAllowed && loinc ? LOINC_SHORT_TEXT[loinc] : undefined;
  return normalizeFullwidth(
    shortText || NHI_CODE_PANEL_NAME[code] || display || "Unknown Lab",
  );
}

function urineProteinLoincFix(
  loinc: string | null,
  rawValue: unknown,
  rawUnit: unknown,
): string | null {
  if (loinc !== URINE_PROTEIN_QUALITATIVE_LOINC) return loinc;
  const v = String(rawValue ?? "").trim();
  const u = String(rawUnit ?? "").trim();
  // Combined "4+ (2000)" / "Trace (15)" → keep qualitative LOINC; the
  // valueString already preserves both the grade and the parenthetical.
  if (URINE_PROTEIN_COMBINED_RE.test(v)) {
    return URINE_PROTEIN_QUALITATIVE_LOINC;
  }
  // Pure numeric + mass-conc unit → quantitative LOINC.
  if (URINE_PROTEIN_NUMERIC_RE.test(v) && URINE_PROTEIN_MASS_UNIT_RE.test(u)) {
    return URINE_PROTEIN_QUANTITATIVE_LOINC;
  }
  // Everything else (Negative / Trace / 1+ / etc) stays qualitative.
  return URINE_PROTEIN_QUALITATIVE_LOINC;
}

// ── Map single Observation (non-grouped path) ────────────────────────

export function mapObservation(
  raw: Record<string, any>,
  patientId: string,
): Record<string, any> | null {
  const display = raw.display || raw.code || "";
  const code = raw.code || "";
  // v0.11.1: skip QC control rows in single-row path too.
  if (looksLikeQcControl(String(display))) return null;

  const value = raw.value;
  const interp = (raw.interpretation ?? "").toString().toLowerCase();
  const hasValue = isMeaningfulValue(value);
  const hasMeaningfulInterp = MEANINGFUL_INTERPS.has(interp);
  if (!hasValue && !hasMeaningfulInterp) return null;

  const obsId = stableId(patientId, code, raw.date ?? "");
  // v0.13: switch to detailed lookup so we can gate code.text canonical-
  // ization on cleanMatch (CBC LOINCs route through path B1/C — without
  // the gate, panel-default fallbacks would silently get canonical text
  // and hide mis-tags). For non-CBC LOINCs the gate is a no-op (see
  // resolveObsCodeText). structuralLoincFix / urineProteinLoincFix may
  // reroute the LOINC after this point; reroutes preserve the cleanMatch
  // signal because the reroute itself is a structural cleanup, not a
  // display-keyword guess.
  const lookup = findLoincDetailed(code, display);
  let loinc = lookup.loinc;
  // v0.11.13 bug 9a: structural reroute if LOINC vs unit mismatch
  loinc = structuralLoincFix(loinc, raw.unit);
  // v0.12.2: urine protein scale routing — see urineProteinLoincFix() docstring
  loinc = urineProteinLoincFix(loinc, value, raw.unit);

  const resource: Record<string, any> = {
    resourceType: "Observation",
    id: obsId,
    meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
    status: "final",
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/observation-category",
            code: "laboratory",
            display: "Laboratory",
          },
        ],
      },
    ],
    code: {
      coding: buildCodings(
        code,
        display,
        loinc,
        String(raw.order_name ?? "") || NHI_CODE_PANEL_NAME[code] || undefined,
      ),
      // v0.11.9 / v0.11.10 / v0.13: see resolveObsCodeText() — CBC LOINCs
      // gate on cleanMatch, others keep "always SHORT_TEXT" behaviour.
      text: resolveObsCodeText(loinc, code, display, lookup.cleanMatch),
    },
    subject: { reference: `Patient/${patientId}` },
  };

  // Source-programme tag — set when the adapter pulled this observation
  // out of a specific NHI screening programme (e.g. adaptAdultPreventive
  // sets source_program="adult-preventive"). Surfaced via Observation.
  // meta.tag so downstream SMART apps can filter by _tag without needing
  // to know about our internal field names.
  if (raw.source_program) {
    resource.meta.tag = [
      {
        system: "http://nhi-fhir-bridge/source-program",
        code: String(raw.source_program),
      },
    ];
  }
  // v0.12.3: NHI source channel (A=不定期 / B=定期).
  appendNhiSourceChannelTag(resource, raw);
  // v0.13: NHI 就醫日期 (funC_DATE) carried separately from
  // effectiveDateTime so SMART apps can detect inspect-vs-visit gaps.
  appendNhiVisitDateTag(resource, raw);

  if (raw.date) {
    resource.effectiveDateTime = `${raw.date}T00:00:00+08:00`;
  }

  if (hasValue) {
    const unit = _canonicalizeUnit(display, code, raw.unit ?? "");
    const qty = tryParseQuantity(String(value), unit);
    if (qty) resource.valueQuantity = qty;
    else resource.valueString = String(value);
  }

  // C4 (bug report 2026-05-27 Part 3): parseRange may flag the raw
  // reference_range as actually being result-interpretation text
  // ("正常" / "異常..."). Route to interpretation (below) instead of
  // emitting it as a referenceRange.
  let _interpFromRange: string | null = null;
  if (raw.reference_range) {
    const rr = parseRange(String(raw.reference_range), raw.unit ?? "");
    if (rr) {
      if (rr.interpretationText) {
        _interpFromRange = rr.interpretationText;
      } else {
        resource.referenceRange = [rr];
      }
    }
  }

  const interpCodingResult =
    mapInterpretation(interp) ||
    deriveInterpretation(
      value !== null && value !== undefined ? String(value) : "",
      resource.valueQuantity as Quantity | undefined,
      (resource.referenceRange as RangeEntry[] | undefined)?.[0],
    );
  if (interpCodingResult) {
    resource.interpretation = [{ coding: [interpCodingResult] }];
  } else if (_interpFromRange) {
    // Lower priority than explicit interp / value-vs-range derivation:
    // when neither is available but the (mis-used) reference_range
    // field carried interpretation text, surface it via .interpretation.
    const coded = mapInterpretation(_interpFromRange.toLowerCase());
    resource.interpretation = coded
      ? [{ coding: [coded], text: _interpFromRange }]
      : [{ text: _interpFromRange }];
  }

  return resource;
}

// ── Build observation within a panel (with canonical lab key id) ─────

function buildObservation(
  raw: Record<string, any>,
  patientId: string,
  panelCode: string,
): Record<string, any> | null {
  // BP panel: prebuilt by combineBpItems.
  if (raw.bp_components) {
    const date = raw.date ?? "";
    const hospital = raw.hospital ?? "";
    const obsId = stableId(patientId, "obs", "BP_PANEL", date, hospital);
    const componentResources: any[] = [];
    for (const c of raw.bp_components as BpComponent[]) {
      const qty: Quantity = {
        value: c.value,
        unit: c.unit || "mmHg",
        system: "http://unitsofmeasure.org",
        code: toUcum(c.unit) ?? "mm[Hg]",
      };
      componentResources.push({
        code: {
          coding: [{ system: "http://loinc.org", code: c.loinc, display: c.display }],
          text: c.display,
        },
        valueQuantity: qty,
      });
    }
    const bpObs: Record<string, any> = {
      resourceType: "Observation",
      id: obsId,
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "vital-signs",
              display: "Vital Signs",
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: raw.bp_panel_loinc ?? "85354-9",
            display: "Blood pressure panel",
          },
        ],
        text: "Blood Pressure",
      },
      subject: { reference: `Patient/${patientId}` },
      component: componentResources,
    };
    if (date) bpObs.effectiveDateTime = `${date}T00:00:00+08:00`;
    if (hospital) bpObs.performer = [{ display: hospital }];
    return bpObs;
  }

  const display = raw.display || raw.code || "";
  const code = (panelCode ? String(panelCode) : "") || raw.order_code || raw.code || "";
  const value = raw.value;
  const interp = (raw.interpretation ?? "").toString().toLowerCase();

  // v0.11.7: pass code to canonicalLabKey for panel-scoped synonym
  // disambiguation (urinalysis "Glucose" → URINE_GLUCOSE so it dedups
  // with "尿糖" within the panel, while serum "Glucose" stays GLUCOSE).
  const canonical = canonicalLabKey(display, code) || display;
  // v0.11.8: include NHI code in stableId. Bug 2026-05-28 (blood type):
  // 11001C "ABO 血型測定" and 11003C "RH(D) 型檢驗" both ship display
  // "血型鑑定" — same canonical → same ID → bundle-assembler dedup
  // (by id) collapsed them to one row, dropping the other. Adding code
  // to the hash disambiguates different NHI billing codes that share a
  // common panel display ("血型鑑定", "Sugar", etc.). Same-code cross-
  // language merges (Bilirubin/膽紅素 under 06013C) still work because
  // they all share the same code in the hash.
  //
  // v0.11.9: ALSO include the row's value in stableId. SMART app dev
  // 2026-05-29: 健保存摺 ships TWO distinct readings per ABO panel and
  // per RH panel on 2025-05-18 (ABO has both "B" and "+", RH has both
  // "+" and "B" — forward/reverse typing arms or dual-antisera reactions).
  // Both readings share NHI code + display + canonical → same v0.11.8
  // stableId → bundle keeps only ONE per panel, silently losing the
  // second reading.
  //
  // Real duplicates (same value + same display) are still dropped at
  // dedupeCrossFormat (step 1, value in key) and dedupePanelItems
  // (step 3, value in key) BEFORE reaching stableId, so adding value
  // here doesn't reintroduce true duplicates — it only preserves
  // distinct readings within the same panel.
  //
  // Trade-off (same as v0.11.8): if a value is later corrected (typo
  // fix in NHI source), the Observation resource ID changes. Acceptable
  // for the data-integrity gain.
  //
  // v0.12.1 (SMART app dev bug 9' 2026-05-29 — faithful transport):
  // ALSO include the row's raw unit string in stableId. Two LIS-
  // uploaded rows that differ only in placeholder unit encoding
  // ("空白空白" vs "-") would otherwise collide here and collapse to
  // one Observation — bridge-side dedup judgement that contradicts the
  // user's explicit rule (CLAUDE.md: bridge does NOT dedup based on
  // judgement; LIS uploads N rows, bridge emits N obs). Using the raw
  // unit keeps them distinct without affecting cleanup of
  // `Quantity.unit` which happens later in `_canonicalizeUnit`.
  //
  // v0.12.3: ALSO include the NHI source channel (A=不定期 / B=定期).
  // NHI ships the same measurement under both channels for ~25% of
  // rows (92 of 365 in user's 2026-05-29 audit). Without source in
  // the hash, A and B rows for the same draw collapse to one obs at
  // the seenObsIds step — bridge-side dedup that contradicts the
  // strict-no-dedup rule. Including source preserves both per design.
  const obsId = stableId(
    patientId,
    "obs",
    canonical,
    raw.date ?? "",
    raw.hospital ?? "",
    code,
    String(raw.value ?? ""),
    String(raw.unit ?? ""),
    String(raw.nhi_source_channel ?? ""),
  );
  // v0.13: detailed lookup so we can gate code.text canonicalization on
  // cleanMatch. See findLoincDetailed() docstring + resolveObsCodeText().
  const lookup = findLoincDetailed(code, display);
  let loinc = lookup.loinc;
  // v0.11.13 (SMART app dev bug 9a 2026-05-29): structural LOINC vs
  // unit consistency check — see structuralLoincFix() docstring.
  loinc = structuralLoincFix(loinc, raw.unit);
  // v0.12.2 (SMART app dev v0.12.1 audit 2026-05-29): urine protein
  // scale routing — quantitative mg/dL values get 2888-6 (Qn LOINC),
  // qualitative / combined values stay on 20454-5 (Ord LOINC).
  loinc = urineProteinLoincFix(loinc, value, raw.unit);

  const catCode = raw.category || "laboratory";
  const CAT_DISPLAY: Record<string, string> = {
    laboratory: "Laboratory",
    "vital-signs": "Vital Signs",
    imaging: "Imaging",
    procedure: "Procedure",
    "social-history": "Social History",
    survey: "Survey",
    exam: "Exam",
    therapy: "Therapy",
    activity: "Activity",
  };
  const catDisplay =
    CAT_DISPLAY[catCode] ?? catCode.charAt(0).toUpperCase() + catCode.slice(1).toLowerCase();

  const resource: Record<string, any> = {
    resourceType: "Observation",
    id: obsId,
    meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
    status: "final",
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/observation-category",
            code: catCode,
            display: catDisplay,
          },
        ],
      },
    ],
    code: {
      // v0.11.9 (Category A): pass the panel-level NHI catalog name to
      // buildCodings so coding[nhi].display becomes the panel name (e.g.
      // "ABO血型測定檢驗") instead of the row-level LIS display ("血型
      // 鑑定"). Order: raw.order_name (scraper-provided NHI catalog
      // value) → NHI_CODE_PANEL_NAME override → fall back to display
      // via buildCodings.
      coding: buildCodings(
        code,
        display,
        loinc,
        String(raw.order_name ?? "") || NHI_CODE_PANEL_NAME[code] || undefined,
      ),
      // v0.11.9 / v0.11.10 / v0.13: precedence (high → low):
      //   1. LOINC_SHORT_TEXT override — gated on cleanMatch for CBC
      //      LOINCs (CBC_CANONICAL_TEXT_LOINCS), always-on otherwise.
      //      See resolveObsCodeText() + findLoincDetailed() docstrings.
      //   2. NHI_CODE_PANEL_NAME override (when LIS ships a generic
      //      display under an NHI code that has a canonical specific
      //      name in the NHI catalog, e.g. 11001C "血型鑑定" →
      //      "ABO 血型測定" so SMART app can distinguish ABO/Rh/Antibody)
      //   3. Raw display (LIS-supplied analyte name) — also the
      //      fallback that preserves the v0.11.9 Bug 6 mis-tag canary
      //      when CBC LOINC is reached via path-C panel default.
      //   4. "Unknown Lab" sentinel
      // v0.11.10: normalizeFullwidth() applied so fullwidth ASCII chars
      // (e.g. 09099C 「心肌旋轉蛋白Ｉ」) become halfwidth in our label.
      text: resolveObsCodeText(loinc, code, display, lookup.cleanMatch),
    },
    subject: { reference: `Patient/${patientId}` },
  };

  if (raw.date) resource.effectiveDateTime = `${raw.date}T00:00:00+08:00`;
  if (raw.hospital) resource.performer = [{ display: raw.hospital }];
  const specimen = inferSpecimen(raw.order_name, raw.display, raw.code);
  if (specimen) resource.specimen = { display: specimen };
  // v0.12.3: surface NHI source channel (A=不定期 / B=定期) for SMART
  // app dedup-by-source UI choice. See appendNhiSourceChannelTag().
  appendNhiSourceChannelTag(resource, raw);
  // v0.13: surface NHI 就醫日期 (funC_DATE) for visit-vs-inspect-gap
  // detection. See appendNhiVisitDateTag() docstring.
  appendNhiVisitDateTag(resource, raw);

  const hasValue = isMeaningfulValue(value);
  if (hasValue) {
    const unit = _canonicalizeUnit(display, code, raw.unit ?? "");
    const qty = tryParseQuantity(String(value), unit);
    if (qty) resource.valueQuantity = qty;
    else resource.valueString = String(value);
  }

  // C4 (bug report 2026-05-27 Part 3): keep entries flagged as
  // interpretationText out of referenceRange (parseRangeMulti returns
  // the same RangeEntry shape, including the .interpretationText
  // marker). Surface them via .interpretation below.
  let _interpFromRange: string | null = null;
  if (raw.reference_range) {
    const rrs = parseRangeMulti(String(raw.reference_range), raw.unit ?? "");
    const realRanges = rrs.filter((r) => !r.interpretationText);
    if (realRanges.length > 0) resource.referenceRange = realRanges;
    const flagged = rrs.find((r) => r.interpretationText);
    if (flagged?.interpretationText) _interpFromRange = flagged.interpretationText;
  }

  const interpCodingResult =
    mapInterpretation(interp) ||
    deriveInterpretation(
      value !== null && value !== undefined ? String(value) : "",
      resource.valueQuantity as Quantity | undefined,
      (resource.referenceRange as RangeEntry[] | undefined)?.[0],
    );
  if (interpCodingResult) {
    resource.interpretation = [{ coding: [interpCodingResult] }];
  } else if (_interpFromRange) {
    const coded = mapInterpretation(_interpFromRange.toLowerCase());
    resource.interpretation = coded
      ? [{ coding: [coded], text: _interpFromRange }]
      : [{ text: _interpFromRange }];
  }

  return resource;
}

// ── Group by (order_code, date, hospital) → DR + Observations ────────

function groupByOrderCode(
  cleaned: Record<string, any>[],
  patientId: string,
): Record<string, any>[] {
  let working = dedupeCrossFormat(cleaned);
  working = combineBpItems(working);

  const groups = new Map<string, Record<string, any>[]>();
  const keyMeta = new Map<string, { groupKeyCode: string; date: string; hospital: string }>();
  for (const raw of working) {
    const groupKeyCode = raw.order_code || raw.code || raw.display || "";
    const date = raw.date ?? "";
    const hospital = raw.hospital ?? "";
    const key = `${groupKeyCode}|${date}|${hospital}`;
    const arr = groups.get(key);
    if (arr) arr.push(raw);
    else {
      groups.set(key, [raw]);
      keyMeta.set(key, { groupKeyCode: String(groupKeyCode), date, hospital });
    }
  }

  const out: Record<string, any>[] = [];
  for (const [key, items] of groups.entries()) {
    const meta = keyMeta.get(key)!;
    const deduped = dedupePanelItems(items);

    const obsResources: Record<string, any>[] = [];
    const seenObsIds = new Set<string>();
    for (const it of deduped) {
      const obs = buildObservation(it, patientId, meta.groupKeyCode);
      if (!obs) continue;
      if (seenObsIds.has(obs.id)) continue;
      seenObsIds.add(obs.id);
      obsResources.push(obs);
    }
    if (obsResources.length === 0) continue;

    // BP panel: emit Observation directly (no DR wrapper).
    const isBpPanel = deduped.every((it) => it.bp_components || it.display === "Blood Pressure");
    if (isBpPanel) {
      out.push(...obsResources);
      continue;
    }

    const orderName = deduped.find((it) => it.order_name)?.order_name ?? null;
    const memberKeys = Array.from(
      new Set(
        deduped
          .filter((it) => it.display)
          // v0.11.8: pass code so urinalysis polysemic displays
          // (Glucose/Color/Blood) get URINE_X canonical, matching
          // the per-Obs canonical and producing a consistent
          // panelSignature across reruns.
          .map((it) => canonicalLabKey(it.display, String(meta.groupKeyCode))),
      ),
    ).sort();
    const panelSignature = memberKeys.join(",") || String(meta.groupKeyCode);
    // v0.11.8 bug fix: include groupKeyCode (NHI code) in DR stableId
    // — same reason as the Observation stableId fix in this release.
    // Without code, 11001C ABO and 11003C Rh both produce a DR with
    // panelSignature="血型鑑定" → identical DR id → bundle-assembler
    // dedup collapsed them → one DR survived with a broken Obs link
    // (the other Obs became an orphan). Adding code makes each NHI
    // billing produce its own DR, so the DR↔Obs reference graph stays
    // intact.
    const drId = stableId(
      patientId,
      "DR",
      panelSignature,
      meta.date,
      meta.hospital,
      String(meta.groupKeyCode),
    );

    // v0.11.9 (SMART app dev report 2026-05-29 Category A): for single-
    // obs DRs where the LIS row display is the generic panel umbrella
    // ("血型鑑定" under both 11001C ABO and 11003C RH), prefer the NHI
    // catalog panel name (orderName) or the curated NHI_CODE_PANEL_NAME
    // override over the generic display — otherwise the DR title stays
    // generic and downstream consumers can't tell ABO from RH visually
    // without joining via NHI code. Same reasoning as the obs.code.text
    // override above (single source of truth for panel-name selection).
    //
    // v0.11.10 (SMART app dev report 2026-05-29 Category B + C):
    // adds LOINC_SHORT_TEXT at the TOP of precedence — when the panel's
    // NHI code maps to a LOINC with a clean clinical short name (e.g.
    // 09112C → 3016-3 → "TSH"), DR title uses it instead of order_name
    // (which carries NHI-catalog method suffix like 「免疫分析」). This
    // unifies DR.code.text with obs.code.text for single-analyte panels,
    // resolving the dupKey false-positive flag downstream.
    const groupCodeStr = String(meta.groupKeyCode);
    // v0.12.1 (SMART app dev bug 8' 2026-05-29): when the NHI panel code
    // has no mapping in NHI_TO_LOINC but ALL observations in the panel
    // resolved to the same LOINC, use that LOINC for the panel-title
    // LOINC_SHORT_TEXT lookup. This fixes the 09040C urine-protein case:
    // NHI_TO_LOINC has no 09040C entry (panel-level ambiguous between
    // serum and urine), but the obs ended up routed to 20454-5 via
    // display "Urine Protein" → LOINC_MAP global. DR title should
    // reflect the actually-resolved analyte ("Urine Protein") instead
    // of the ambiguous orderName "全蛋白".
    let panelLoinc: string | undefined = NHI_TO_LOINC[groupCodeStr];
    if (!panelLoinc && obsResources.length > 0) {
      const obsLoincs = new Set<string>();
      for (const obs of obsResources) {
        const loinc = (obs.code?.coding as any[] | undefined)?.find(
          (c) => c?.system === "http://loinc.org",
        )?.code;
        if (loinc) obsLoincs.add(loinc);
      }
      if (obsLoincs.size === 1) {
        panelLoinc = [...obsLoincs][0];
      }
    }
    const loincShortText = panelLoinc ? LOINC_SHORT_TEXT[panelLoinc] : undefined;
    let panelTitle: string;
    if (deduped.length === 1) {
      const singleDisplay = deduped[0]!.display ?? "";
      panelTitle =
        loincShortText ||
        NHI_CODE_PANEL_NAME[groupCodeStr] ||
        orderName ||
        singleDisplay ||
        groupCodeStr;
    } else {
      // Multi-row panel: only let LOINC_SHORT_TEXT win when the panel
      // is in DISPLAY_FIRST_CODES (= panel with multiple SAME-LOINC
      // sub-rows, like CBC sub-items). For mixed-LOINC panels (08036C
      // APTT time + ratio under one billing code), the umbrella label
      // would be misleading — fall back to orderName so the DR
      // identifies the billing code, individual analyte LOINCs live on
      // each Observation.
      const allSameAnalyte = !DISPLAY_FIRST_CODES.has(groupCodeStr);
      panelTitle =
        (allSameAnalyte && loincShortText) ||
        orderName ||
        NHI_CODE_PANEL_NAME[groupCodeStr] ||
        groupCodeStr;
    }

    const drCodeSystem = NHI_LAB_CODE_RE.test(String(meta.groupKeyCode) ?? "")
      ? systems.NHI_MEDICAL_ORDER_CODE
      : systems.HIS_LOCAL_LAB_CODE;

    // v0.11.10: separate DR.code.coding[0].display (Coding.display) from
    // DR.code.text (free-form CodeableConcept.text).
    //
    // FHIR R4 compliance check: per the spec, `Coding.display` must
    // "follow the rules of the system" — for the NHI medical order code
    // system, that's the NHI-catalog-supplied name verbatim (orderName).
    // We therefore do NOT apply normalizeFullwidth() to drCodingDisplay
    // — if the NHI catalog uses a fullwidth Ｉ in "心肌旋轉蛋白Ｉ", that
    // IS the canonical NHI display and the bridge must preserve it.
    // Faithful-transport principle aligns with FHIR's "follow the rules
    // of the system" wording.
    //
    // `CodeableConcept.text` is free-form ("the representation of the
    // concept as entered or chosen by the user") so normalising for
    // halfwidth + clean LOINC short text there is fine — that's where
    // SMART apps surface the human label.
    const drCodingDisplay =
      orderName || NHI_CODE_PANEL_NAME[groupCodeStr] || panelTitle;
    const drText = normalizeFullwidth(panelTitle);

    const dr: Record<string, any> = {
      resourceType: "DiagnosticReport",
      id: drId,
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0074",
              code: "LAB",
              display: "Laboratory",
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: drCodeSystem,
            code: String(meta.groupKeyCode) || "UNKNOWN",
            display: drCodingDisplay,
          },
        ],
        text: drText,
      },
      subject: { reference: `Patient/${patientId}` },
      result: obsResources.map((o) => ({ reference: `Observation/${o.id}` })),
    };
    if (meta.date) dr.effectiveDateTime = `${meta.date}T00:00:00+08:00`;
    if (meta.hospital) dr.performer = [{ display: meta.hospital }];

    // v0.11.11 (SMART app dev bug 8 2026-05-29): for single-obs DRs,
    // propagate `DR.code.text` → `obs.code.text` so the two never
    // disagree. Cumulative-report consumers that fall back to obs.text
    // when only one obs exists used to see DR title "鉀" while the obs
    // said "K" (NHI Chinese name vs LIS lab shorthand). 237 records
    // across 83 patterns in user's v0.11.9 bundle had this disagreement.
    //
    // GUARD: only propagate when the obs's LOINC matches the panel's
    // default LOINC (NHI_TO_LOINC[code]). When they differ, the obs has
    // more specific routing (e.g. 08036C "APTT data/mean" row → 63561-5
    // APTT ratio while the panel default 14979-9 is APTT time);
    // overwriting obs.text with DR's panel-default label would lose
    // the analyte distinction. In that case both DR and obs keep
    // their independent labels (DR=panel-level, obs=specific analyte).
    //
    // FHIR R4 compliance: only mutates CodeableConcept.text (free-form);
    // coding[*].display stays catalog-faithful. Multi-row panels (CBC,
    // urinalysis sub-rows etc.) are intentionally NOT touched — each
    // analyte under those panels keeps its own display.
    if (obsResources.length === 1 && obsResources[0]?.code) {
      const obs = obsResources[0];
      const obsLoinc = (obs.code.coding as any[] | undefined)?.find(
        (c) => c?.system === "http://loinc.org",
      )?.code;
      const panelLoinc = NHI_TO_LOINC[groupCodeStr];
      // Propagate only when obs has no LOINC or shares the panel default
      if (!obsLoinc || obsLoinc === panelLoinc) {
        obs.code.text = drText;
      }
    }

    out.push(dr);
    out.push(...obsResources);
  }

  return out;
}

export function mapObservationsGrouped(rawItems: any[], patientId: string): Record<string, any>[] {
  const cleaned = filterLabRows(rawItems);
  // v0.12.4: collapse NHI multi-channel A+B structural duplicates
  // BEFORE grouping/building observations. Bridge ships one obs per
  // logical measurement so every downstream SMART app sees a clean
  // bundle without having to implement source-channel dedup itself.
  // See dedupNhiCrossChannelPairs() docstring for the principle and
  // criteria.
  const dedupedChannel = dedupNhiCrossChannelPairs(cleaned);
  return groupByOrderCode(dedupedChannel, patientId);
}
