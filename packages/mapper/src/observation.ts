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

// ── Imaging detection ────────────────────────────────────────────────

const IMAGING_KEYWORDS: ReadonlyArray<string> = [
  "ultrasound",
  "sonogram",
  "sonography",
  "echo",
  "ct ",
  "ct/",
  "ct-",
  "computed tomography",
  "mri",
  "magnetic resonance",
  "x-ray",
  "xray",
  "x ray",
  "mammography",
  "mammo",
  "ekg",
  "ecg",
  "electrocardiogram",
  "endoscop",
  "colonoscop",
  "gastroscop",
  "bronchoscop",
  "pet/ct",
  "pet ",
  "spect",
  "影像",
  "超音波",
  "電腦斷層",
  "核磁共振",
  "心電圖",
  "內視鏡",
  "乳房攝影",
];

function looksLikeImaging(display: string, code: string): boolean {
  const haystack = `${display} ${code}`.toLowerCase();
  return IMAGING_KEYWORDS.some((kw) => haystack.includes(kw));
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
 */
export function buildCodings(
  code: string | null | undefined,
  display: string,
  loinc: string | null,
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
      display,
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
  HEMOGLOBIN: "HEMOGLOBIN",
  HGB: "HEMOGLOBIN",
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
  白蛋白: "ALBUMIN",
  ALBUMIN: "ALBUMIN",
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

export function canonicalLabKey(display: string | null | undefined): string {
  if (!display) return "";
  const s = display.trim();
  if (!s) return "";
  const sUpper = s.toUpperCase();
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
  const byValue = new Map<string, Record<string, any>[]>();
  for (const it of items) {
    const k = normalizeValueForDedup(it.value);
    const group = byValue.get(k);
    if (group) group.push(it);
    else byValue.set(k, [it]);
  }
  const out: Record<string, any>[] = [];
  for (const group of byValue.values()) {
    if (group.length === 1) {
      out.push(group[0]!);
      continue;
    }
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
    if (looksLikeImaging(display, raw.code || "")) continue;
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
    const key = [
      (item.date as string) ?? "",
      v.toLowerCase(),
      unit.toLowerCase(),
      orderCode(item),
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
  if (looksLikeImaging(display, code)) return null;

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
      coding: buildCodings(code, display, loinc),
      text: display || "Unknown Lab",
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
    const qty = tryParseQuantity(String(value), raw.unit ?? "");
    if (qty) resource.valueQuantity = qty;
    else resource.valueString = String(value);
  }

  if (raw.reference_range) {
    const rr = parseRange(String(raw.reference_range), raw.unit ?? "");
    if (rr) resource.referenceRange = [rr];
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

  const canonical = canonicalLabKey(display) || display;
  const obsId = stableId(patientId, "obs", canonical, raw.date ?? "", raw.hospital ?? "");
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
      coding: buildCodings(code, display, loinc),
      text: display || "Unknown Lab",
    },
    subject: { reference: `Patient/${patientId}` },
  };

  if (raw.date) resource.effectiveDateTime = `${raw.date}T00:00:00+08:00`;
  if (raw.hospital) resource.performer = [{ display: raw.hospital }];
  const specimen = inferSpecimen(raw.order_name, raw.display, raw.code);
  if (specimen) resource.specimen = { display: specimen };

  const hasValue = isMeaningfulValue(value);
  if (hasValue) {
    const qty = tryParseQuantity(String(value), raw.unit ?? "");
    if (qty) resource.valueQuantity = qty;
    else resource.valueString = String(value);
  }

  if (raw.reference_range) {
    const rrs = parseRangeMulti(String(raw.reference_range), raw.unit ?? "");
    if (rrs.length > 0) resource.referenceRange = rrs;
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
      new Set(deduped.filter((it) => it.display).map((it) => canonicalLabKey(it.display))),
    ).sort();
    const panelSignature = memberKeys.join(",") || String(meta.groupKeyCode);
    const drId = stableId(patientId, "DR", panelSignature, meta.date, meta.hospital);

    let panelTitle: string;
    if (deduped.length === 1) {
      const singleDisplay = deduped[0]!.display ?? "";
      panelTitle = singleDisplay || orderName || String(meta.groupKeyCode);
    } else {
      panelTitle = orderName || String(meta.groupKeyCode);
    }

    const drCodeSystem = NHI_LAB_CODE_RE.test(String(meta.groupKeyCode) ?? "")
      ? systems.NHI_MEDICAL_ORDER_CODE
      : systems.HIS_LOCAL_LAB_CODE;

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
            display: panelTitle,
          },
        ],
        text: panelTitle,
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
