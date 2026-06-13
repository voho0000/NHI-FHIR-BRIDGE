/**
 * 癌症篩檢 (IHKE3404) → FHIR Observation mapper.
 *
 * Dedicated mapper (NOT the lab observation pipeline) because cancer
 * screening is a screening EXAM with a qualitative coded result, not a
 * lab measurement — none of the lab pipeline's LOINC routing / specimen
 * inference / panel grouping / unit canonicalization applies.
 *
 * Bilingual strategy (decided with the project owner 2026-06-13; NHI ships
 * Chinese only, and machine translation is off the table because PHI must
 * never leave the machine):
 *   - Screening NAME  → bilingual: English `coding.display` + Chinese
 *     `code.text`, from CANCER_SCREENING_NAMES (7 fixed types).
 *   - Result HEADLINE → bilingual when the term is in CANCER_RESULT_VOCAB:
 *     valueCodeableConcept { coding[display=EN], text=ZH } + an
 *     interpretation code (N/A/POS/NEG) for language-independent flagging.
 *     UNKNOWN terms fall back to valueString (raw Chinese) — never guess a
 *     translation.
 *   - Free-text DETAIL (乳攝 BI-RADS narrative, 抹片碼…) → Observation.note
 *     VERBATIM, no translation (medical narrative mistranslation is a real
 *     risk). Some NHI detail is already English (e.g. "Within normal limit").
 *
 * Normalized input shape (from adaptCancerScreening):
 *   { date, screening_label (中文), result_text (中文 headline),
 *     detail (cleaned free text, may be empty), hospital }
 */

import { stableId } from "./helpers";
import { CANCER_SCREENING_CODE, CANCER_SCREENING_RESULT } from "./systems";

const INTERP_SYS = "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation";
const OBS_CATEGORY_SYS = "http://terminology.hl7.org/CodeSystem/observation-category";

// Table 1 — 7 fixed screening types: Chinese label → English display.
// Owner-approved 2026-06-13 (draft). Chinese label stays in code.text.
export const CANCER_SCREENING_NAMES: Record<string, string> = {
  大腸癌篩檢: "Colorectal Cancer Screening (FOBT)",
  口腔癌篩檢: "Oral Cancer Screening",
  乳癌篩檢: "Breast Cancer Screening (Mammography)",
  子宮頸癌篩檢: "Cervical Cancer Screening (Pap Smear)",
  肺癌篩檢: "Lung Cancer Screening (LDCT)",
  婦女HPV檢測: "Cervical HPV Test",
  胃幽門桿菌篩檢: "H. pylori Stool Antigen Test (HPSA)",
};

// Table 2 — common result vocabulary: Chinese → { English display,
// interpretation code }. Owner-approved 2026-06-13 (draft). Terms NOT in
// this table are emitted verbatim as valueString (no guessed translation).
// `interp` null = no normal/abnormal flag (e.g. "follow-up recommended").
export const CANCER_RESULT_VOCAB: Record<string, { en: string; interp: string | null }> = {
  無異常: { en: "No abnormality detected", interp: "N" },
  正常: { en: "Normal", interp: "N" },
  異常: { en: "Abnormal", interp: "A" },
  疑似異常: { en: "Suspected abnormality", interp: "A" },
  陽性: { en: "Positive", interp: "POS" },
  陰性: { en: "Negative", interp: "NEG" },
  良性發現: { en: "Benign finding", interp: "N" },
  建議追蹤: { en: "Follow-up recommended", interp: null },
  建議複檢: { en: "Follow-up recommended", interp: null },
};

const INTERP_DISPLAY: Record<string, string> = {
  N: "Normal",
  A: "Abnormal",
  POS: "Positive",
  NEG: "Negative",
};

export function mapCancerScreening(
  raw: Record<string, any>,
  patientId: string,
): Record<string, any> | null {
  const date = String(raw.date ?? "").trim();
  const label = String(raw.screening_label ?? "").trim(); // 中文 name
  const resultText = String(raw.result_text ?? "").trim(); // 中文 headline
  if (!date || !label || !resultText) return null;

  const hospital = String(raw.hospital ?? "").trim();
  const nameEn = CANCER_SCREENING_NAMES[label]; // English display or undefined
  const vocab = CANCER_RESULT_VOCAB[resultText]; // bilingual result or undefined

  const resource: Record<string, any> = {
    resourceType: "Observation",
    id: stableId(patientId, "cancer-screen", label, date, hospital, resultText),
    meta: {
      versionId: "1",
      source: "nhi-fhir-bridge/scraper",
      // Programme tag so SMART apps can isolate the 癌症篩檢 section.
      tag: [{ system: "http://nhi-fhir-bridge/source-program", code: "cancer-screening" }],
    },
    status: "final",
    category: [
      { coding: [{ system: OBS_CATEGORY_SYS, code: "laboratory", display: "Laboratory" }] },
    ],
    code: {
      // Chinese label as the code; English display from the bilingual
      // table (falls back to the Chinese label when unmapped). code.text
      // always carries the Chinese name (patient-facing).
      coding: [{ system: CANCER_SCREENING_CODE, code: label, display: nameEn || label }],
      text: label,
    },
    subject: { reference: `Patient/${patientId}` },
    effectiveDateTime: `${date}T00:00:00+08:00`,
  };

  // Result: bilingual coded value when the headline is known, else the raw
  // Chinese string verbatim (never a guessed translation).
  if (vocab) {
    resource.valueCodeableConcept = {
      coding: [{ system: CANCER_SCREENING_RESULT, code: resultText, display: vocab.en }],
      text: resultText,
    };
    if (vocab.interp) {
      resource.interpretation = [
        {
          coding: [
            { system: INTERP_SYS, code: vocab.interp, display: INTERP_DISPLAY[vocab.interp] },
          ],
        },
      ];
    }
  } else {
    resource.valueString = resultText;
  }

  if (hospital) resource.performer = [{ display: hospital }];

  // Free-text detail (BI-RADS narrative, cytopathology text…) — verbatim,
  // no translation. Marked zh-TW so consumers can label it as the original
  // Chinese report (some NHI detail is already English; we don't relabel).
  const detail = String(raw.detail ?? "").trim();
  if (detail) {
    resource.note = [{ text: detail }];
  }

  return resource;
}
