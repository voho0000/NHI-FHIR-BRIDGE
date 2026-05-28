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
  // A. Single-test NHI code wins outright.
  if (code && code in NHI_TO_LOINC && !DISPLAY_FIRST_CODES.has(code)) {
    return NHI_TO_LOINC[code] ?? null;
  }

  const combined = `${code} ${display}`.toLowerCase();

  // B1. Panel-specific keyword map runs BEFORE the global one.
  if (code in PANEL_LOINC_MAP) {
    const hit = _findLongestMatch(combined, PANEL_LOINC_MAP[code]!);
    if (hit) return hit;
  }

  // B. Display-keyword search.
  const hit = _findLongestMatch(combined, LOINC_MAP);
  if (hit) return hit;

  // C. Panel code with no recognised item display → fall back.
  if (code && code in NHI_TO_LOINC) {
    return NHI_TO_LOINC[code] ?? null;
  }
  return null;
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
function _canonicalizeUnit(display: string, _code: string, rawUnit: string): string {
  const u = (rawUnit ?? "").trim();

  // Class 1: bogus unit fixup (analyte-aware fill-in).
  const isBogus = u === "" || u === "N" || u === "n";
  if (isBogus) {
    // eGFR — Taiwan LIS quirk. LOINC 33914-3 canonical unit is mL/min/1.73m2.
    if (/egfr|estimated\s*gfr|estimated\s*glomerular|腎絲球過濾率/i.test(display)) {
      return "mL/min/1.73m2";
    }
    return rawUnit;
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
    const value = raw.value;
    const interp = (raw.interpretation ?? "").toString().toLowerCase();
    const hasValue = isMeaningfulValue(value);
    const hasMeaningfulInterp = MEANINGFUL_INTERPS.has(interp);
    if (!hasValue && !hasMeaningfulInterp) continue;
    out.push(raw);
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
    const unit = ((item.unit as string) ?? "").trim();
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

const SPECIMEN_RULES: ReadonlyArray<[RegExp, string]> = [
  [/尿|urine|urinaly/i, "Urine"],
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

function inferSpecimen(...hints: Array<string | null | undefined>): string | null {
  const blob = hints
    .filter((h): h is string => Boolean(h))
    .join(" ")
    .toLowerCase();
  if (!blob) return null;
  for (const [pattern, label] of SPECIMEN_RULES) {
    if (pattern.test(blob)) return label;
  }
  return null;
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
  const loinc = findLoinc(code, display);

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
      // v0.11.9: see panel-path buildObservation for full precedence.
      // v0.11.10: normalize fullwidth ASCII.
      text: normalizeFullwidth(
        (loinc && LOINC_SHORT_TEXT[loinc]) ||
          NHI_CODE_PANEL_NAME[code] ||
          display ||
          "Unknown Lab",
      ),
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
  const obsId = stableId(
    patientId,
    "obs",
    canonical,
    raw.date ?? "",
    raw.hospital ?? "",
    code,
    String(raw.value ?? ""),
  );
  const loinc = findLoinc(code, display);

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
      // v0.11.9: code.text precedence (high → low):
      //   1. LOINC_SHORT_TEXT override (clean clinical short name when
      //      we have a LOINC, e.g. APTT ratio → "APTT (ratio)")
      //   2. NHI_CODE_PANEL_NAME override (when LIS ships a generic
      //      display under an NHI code that has a canonical specific
      //      name in the NHI catalog, e.g. 11001C "血型鑑定" →
      //      "ABO 血型測定" so SMART app can distinguish ABO/Rh/Antibody)
      //   3. Raw display (LIS-supplied analyte name)
      //   4. "Unknown Lab" sentinel
      // v0.11.10: wrap in normalizeFullwidth so fullwidth ASCII chars
      // (e.g. 09099C 「心肌旋轉蛋白Ｉ」) become halfwidth in our label.
      text: normalizeFullwidth(
        (loinc && LOINC_SHORT_TEXT[loinc]) ||
          NHI_CODE_PANEL_NAME[code] ||
          display ||
          "Unknown Lab",
      ),
    },
    subject: { reference: `Patient/${patientId}` },
  };

  if (raw.date) resource.effectiveDateTime = `${raw.date}T00:00:00+08:00`;
  if (raw.hospital) resource.performer = [{ display: raw.hospital }];
  const specimen = inferSpecimen(raw.order_name, raw.display, raw.code);
  if (specimen) resource.specimen = { display: specimen };

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
    const panelLoinc = NHI_TO_LOINC[groupCodeStr];
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

    out.push(dr);
    out.push(...obsResources);
  }

  return out;
}

export function mapObservationsGrouped(rawItems: any[], patientId: string): Record<string, any>[] {
  const cleaned = filterLabRows(rawItems);
  return groupByOrderCode(cleaned, patientId);
}
