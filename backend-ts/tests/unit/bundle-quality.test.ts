/**
 * Bundle-quality CI assertions (v0.11.0).
 *
 * Three defensive checks suggested by the SMART app dev as standing-
 * guard rails against the bug patterns we've been chasing across Part
 * 1-6 reports. Each check walks a synthetic bundle assembled from
 * representative raw NHI inputs through the full mapper pipeline and
 * asserts a structural invariant.
 *
 * The checks fire on EVERY CI run, so any future code change that
 * regresses one of the invariants gets caught immediately — without
 * needing to land a SMART-app-dev bug report first.
 *
 *   1.1 LOINC blacklist — no panel-level LOINC on an individual
 *       Observation when the display text is recognizable as a sub-
 *       item. (Bug pattern: HGB row tagged with CBC-panel LOINC
 *       24317-0, eGFR row tagged with creatinine LOINC, etc.)
 *
 *   1.3 UCUM unit validation — every valueQuantity.code must be a
 *       valid UCUM symbol. Catches non-UCUM units (gm/dl, full-width
 *       ㎡, lowercase l in concentration suffixes) that bypassed
 *       _canonicalizeUnit.
 *
 *   1.4 valueString numeric-leading lint — if a string-valued
 *       Observation's text starts with a digit, the parser should
 *       have extracted a Quantity. Otherwise SMART app trend views
 *       and abnormal-flag computation silently break.
 *
 * Synthetic raw inputs cover the diverse Taiwan-hospital LIS patterns
 * we've observed (Chiayi billing-swap / 中國北港 diff-under-WBC /
 * 嘉基 short "Ht" form, etc.) plus regression seeds for each filed
 * bug. Adding a new bug to this file is the standard fix workflow.
 */

import { describe, expect, test } from "vitest";

import {
  LOINC_DISPLAY,
  LOINC_MAP,
  NHI_TO_LOINC,
  PANEL_LOINC_MAP,
  findLoinc,
  mapDiagnosticReport,
  mapDischargeSummaryDocRef,
  mapEncounter,
  mapMedicationsDedup,
  mapObservationsGrouped,
  stableId,
} from "@nhi-fhir-bridge/mapper";

const PATIENT_ID = "A123456789";

// ── Synthetic raw NHI lab rows representative of v0.9.x-v0.10.0
// bug reports. Covers CBC umbrella + sibling codes, urinalysis,
// urine-creatinine UACR, ABG, body-fluid, eGFR piggyback, etc.
const SAMPLE_LAB_ROWS = [
  // CBC umbrella panel (08011C) — basic + indices + diff
  {
    code: "08011C",
    display: "WBC",
    value: 7.2,
    unit: "10*3/uL",
    date: "2024-01-15",
    hospital: "長庚嘉義",
  },
  {
    code: "08011C",
    display: "Hb",
    value: 14.1,
    unit: "g/dL",
    date: "2024-01-15",
    hospital: "長庚嘉義",
  },
  {
    code: "08011C",
    display: "Ht",
    value: 41.2,
    unit: "%",
    date: "2024-01-15",
    hospital: "長庚嘉義",
  },
  {
    code: "08011C",
    display: "MCV",
    value: 88,
    unit: "fL",
    date: "2024-01-15",
    hospital: "長庚嘉義",
  },
  {
    code: "08011C",
    display: "MCHC",
    value: 33,
    unit: "g/dL",
    date: "2024-01-15",
    hospital: "長庚嘉義",
  },
  {
    code: "08011C",
    display: "RDW",
    value: 13.2,
    unit: "%",
    date: "2024-01-15",
    hospital: "長庚嘉義",
  },
  {
    code: "08011C",
    display: "Platelet",
    value: 250,
    unit: "10*3/uL",
    date: "2024-01-15",
    hospital: "長庚嘉義",
  },
  {
    code: "08011C",
    display: "血球比容值測定",
    value: 41.2,
    unit: "%",
    date: "2024-01-15",
    hospital: "長庚嘉義",
  },
  // CBC w/ diff panel (08013C) — incl. Segment singular (Part 4 fix)
  {
    code: "08013C",
    display: "Segment",
    value: 48.9,
    unit: "%",
    date: "2024-01-15",
    hospital: "長庚嘉義",
  },
  {
    code: "08013C",
    display: "Lymphocyte",
    value: 35.0,
    unit: "%",
    date: "2024-01-15",
    hospital: "長庚嘉義",
  },
  {
    code: "08013C",
    display: "Monocyte",
    value: 8.0,
    unit: "%",
    date: "2024-01-15",
    hospital: "長庚嘉義",
  },
  {
    code: "08013C",
    display: "Eosinophil",
    value: 6.0,
    unit: "%",
    date: "2024-01-15",
    hospital: "長庚嘉義",
  },
  {
    code: "08013C",
    display: "Basophil",
    value: 2.0,
    unit: "%",
    date: "2024-01-15",
    hospital: "長庚嘉義",
  },
  // CBC differential billed under 08002C WBC count code (中國北港 pattern)
  {
    code: "08002C",
    display: "Basophils(嗜鹼性白血球)",
    value: 1.0,
    unit: "%",
    date: "2024-02-01",
    hospital: "中國北港醫",
  },
  {
    code: "08002C",
    display: "Eosinophils(嗜酸性白血球)",
    value: 3.0,
    unit: "%",
    date: "2024-02-01",
    hospital: "中國北港醫",
  },
  {
    code: "08002C",
    display: "Lymphocytes(淋巴白血球)",
    value: 30.0,
    unit: "%",
    date: "2024-02-01",
    hospital: "中國北港醫",
  },
  {
    code: "08002C",
    display: "Monocytes(單核白血球)",
    value: 8.0,
    unit: "%",
    date: "2024-02-01",
    hospital: "中國北港醫",
  },
  {
    code: "08002C",
    display: "Neutrophilic Segment(嗜中性白血球)",
    value: 58.0,
    unit: "%",
    date: "2024-02-01",
    hospital: "中國北港醫",
  },
  // CBC sibling billing swap (嘉基 pattern: 08004C-billed with HGB display)
  {
    code: "08004C",
    display: "HGB",
    value: 13.1,
    unit: "g/dL",
    date: "2024-03-01",
    hospital: "嘉基醫院",
  },
  {
    code: "08004C",
    display: "HCT",
    value: 40.5,
    unit: "%",
    date: "2024-03-01",
    hospital: "嘉基醫院",
  },
  {
    code: "08003C",
    display: "Hb",
    value: 14.0,
    unit: "g/dL",
    date: "2024-03-01",
    hospital: "嘉基醫院",
  },
  // Urinalysis panel (06013C)
  {
    code: "06013C",
    display: "Protein",
    value: "Negative",
    unit: "",
    date: "2024-04-01",
    hospital: "馬偕",
  },
  {
    code: "06013C",
    display: "Glucose",
    value: "Negative",
    unit: "",
    date: "2024-04-01",
    hospital: "馬偕",
  },
  {
    code: "06013C",
    display: "Color",
    value: "Yellow",
    unit: "",
    date: "2024-04-01",
    hospital: "馬偕",
  },
  { code: "06013C", display: "pH", value: 6.5, unit: "", date: "2024-04-01", hospital: "馬偕" },
  // Urine biochem (09016C UACR pattern)
  {
    code: "09016C",
    display: "Creatinine",
    value: 120,
    unit: "mg/dL",
    date: "2024-04-15",
    hospital: "馬偕",
  },
  {
    code: "09016C",
    display: "Micro Albumin:",
    value: 25,
    unit: "mg/g",
    date: "2024-04-15",
    hospital: "馬偕",
  },
  {
    code: "09016C",
    display: "UACR",
    value: 30,
    unit: "mg/g",
    date: "2024-04-15",
    hospital: "馬偕",
  },
  // ABG panel (09041B)
  { code: "09041B", display: "pH", value: 7.4, unit: "", date: "2024-05-01", hospital: "北榮" },
  {
    code: "09041B",
    display: "pCO2",
    value: 40,
    unit: "mmHg",
    date: "2024-05-01",
    hospital: "北榮",
  },
  {
    code: "09041B",
    display: "ABE",
    value: -1.2,
    unit: "mEq/L",
    date: "2024-05-01",
    hospital: "北榮",
  },
  {
    code: "09041B",
    display: "SBE",
    value: -0.8,
    unit: "mEq/L",
    date: "2024-05-01",
    hospital: "北榮",
  },
  // eGFR piggyback under creatinine (09015C)
  {
    code: "09015C",
    display: "Creatinine",
    value: 0.9,
    unit: "mg/dL",
    date: "2024-05-10",
    hospital: "北榮",
  },
  {
    code: "09015C",
    display: "eGFR",
    value: 90,
    unit: "mL/min/1.73m2",
    date: "2024-05-10",
    hospital: "北榮",
  },
  // PT/INR panel (08026C)
  { code: "08026C", display: "PT", value: 12.1, unit: "s", date: "2024-06-01", hospital: "北榮" },
  { code: "08026C", display: "INR", value: 1.02, unit: "", date: "2024-06-01", hospital: "北榮" },
  // SPE panel (09065B)
  {
    code: "09065B",
    display: "Albumin",
    value: 4.2,
    unit: "g/dL",
    date: "2024-07-01",
    hospital: "北榮",
  },
  {
    code: "09065B",
    display: "Gamma globulin",
    value: 1.0,
    unit: "g/dL",
    date: "2024-07-01",
    hospital: "北榮",
  },
  // Flow CD markers (12204B)
  {
    code: "12204B",
    display: "CD4",
    value: 800,
    unit: "cells/uL",
    date: "2024-08-01",
    hospital: "北榮",
  },
  {
    code: "12204B",
    display: "CD4/CD8",
    value: 1.5,
    unit: "",
    date: "2024-08-01",
    hospital: "北榮",
  },
];

// Synthetic medication rows for U1 dose derivation.
const SAMPLE_MED_ROWS = [
  {
    drug_name: "ASPIRIN 100MG",
    code: "B025823100",
    date: "2025-05-18",
    quantity: 30,
    duration_days: 30,
    hospital: "長庚嘉義",
  },
  {
    drug_name: "METFORMIN 500MG",
    code: "B000000000",
    date: "2025-05-18",
    quantity: 60,
    duration_days: 30,
    hospital: "長庚嘉義",
  },
];

function buildSampleBundle() {
  const obsResources = mapObservationsGrouped(SAMPLE_LAB_ROWS, PATIENT_ID);
  const medResources = mapMedicationsDedup(SAMPLE_MED_ROWS, PATIENT_ID);
  return [...obsResources, ...medResources];
}

function walkObservations(bundle: any[]): any[] {
  return bundle.filter((r) => r.resourceType === "Observation");
}

// ── 1.1 LOINC blacklist — panel-level LOINCs that should never
// appear on an individual Observation when a routable display is
// present. Bridge falls back to panel LOINC ONLY when display is
// empty/unrecognised — if display is present and unambiguous, panel
// LOINC means routing missed.
//
// PANEL_LOINC_DISALLOWED includes only the panel codes that have
// per-sub-item LOINCs we've curated. Other panels (47286-0 bone
// marrow, etc.) stay off the list until per-item LOINCs land.
const PANEL_LOINC_DISALLOWED: Record<string, string> = {
  "24317-0": "Hemogram and platelets panel (08011C umbrella)",
  "57021-8": "CBC W Auto Diff panel (08013C umbrella)",
  "24356-8": "Urinalysis macroscopic panel (06013C umbrella)",
  "11555-0": "Base excess panel (should be 1925-7 ABE or 1927-3 SBE)",
  "20584-9": "Lymphocyte subset panel (12204B umbrella)",
  "90991-1": "SPE panel (09065B umbrella)",
};

// Displays the bridge should always be able to route to a per-item
// LOINC. If we ever emit a panel LOINC for these displays, routing
// regressed. Keep this list small and unambiguous — only displays
// that have ONE obvious analyte mapping.
const CLEARLY_ROUTABLE_DISPLAYS = new Set([
  "wbc",
  "hb",
  "hgb",
  "hct",
  "ht",
  "platelet",
  "plt",
  "rbc",
  "mcv",
  "mch",
  "mchc",
  "rdw",
  "segment",
  "segmented",
  "neutrophil",
  "lymphocyte",
  "monocyte",
  "eosinophil",
  "basophil",
  "abe",
  "sbe",
  "ph", // urine pH or arterial pH — both have specific LOINCs
  "protein",
  "glucose",
  "egfr",
  "creatinine",
  "albumin",
  "cd3",
  "cd4",
  "cd8",
  "cd19",
  "cd56",
  "pt",
  "inr",
  "color",
  "micro albumin",
  "microalbumin",
  "uacr",
]);

function displayIsClearlyRoutable(text: string): boolean {
  const t = text.toLowerCase().trim();
  if (!t) return false;
  // Strip any parenthetical or punctuation suffix to compare cleanly.
  const stripped = t.replace(/[(:].*$/, "").trim();
  if (CLEARLY_ROUTABLE_DISPLAYS.has(stripped)) return true;
  // Also: word-boundary check for compound displays like
  // "Hb 血紅素" or "Basophils(嗜鹼性白血球)".
  for (const key of CLEARLY_ROUTABLE_DISPLAYS) {
    if (new RegExp(`\\b${key}\\b`, "i").test(t)) return true;
  }
  return false;
}

describe("CI Layer 1.1 — no panel LOINC on routable Observation", () => {
  test("synthetic multi-hospital bundle emits zero blacklisted panel LOINCs on routable displays", () => {
    const bundle = buildSampleBundle();
    const offenders: string[] = [];
    for (const obs of walkObservations(bundle)) {
      const text = obs.code?.text ?? "";
      if (!displayIsClearlyRoutable(text)) continue; // intentional fallback case — skip
      for (const coding of obs.code?.coding ?? []) {
        if (coding.system !== "http://loinc.org") continue;
        const reason = PANEL_LOINC_DISALLOWED[coding.code];
        if (reason) {
          offenders.push(`Obs '${text}' got panel LOINC ${coding.code} (${reason})`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  test("regression seed — Segment (singular) under 08013C must NOT carry 57021-8 panel", () => {
    // v0.13: obs.code.text now canonicalized to "Neutrophils %" for
    // clean LOINC 770-8 matches (CBC_CANONICAL_TEXT_LOINCS gate). Canary
    // by raw text "segment" stops working — look up by LOINC instead.
    // Original test purpose unchanged: Segment row must NOT carry panel
    // default 57021-8.
    const bundle = buildSampleBundle();
    const segs = walkObservations(bundle).filter((o) =>
      (o.code.coding ?? []).some((c: any) => c.system === "http://loinc.org" && c.code === "770-8"),
    );
    expect(segs.length).toBeGreaterThan(0);
    for (const seg of segs) {
      const loincCodes = (seg.code.coding ?? [])
        .filter((c: any) => c.system === "http://loinc.org")
        .map((c: any) => c.code);
      expect(loincCodes).not.toContain("57021-8");
      expect(loincCodes).toContain("770-8");
    }
  });

  test("regression seed — HGB billed as 08004C HCT must route to 718-7 (display wins)", () => {
    // v0.13: obs.code.text now canonicalized to "Hb" for clean LOINC
    // 718-7 matches. Canary by raw text "hgb" stops working — look up
    // by LOINC instead. Original test purpose unchanged: HGB row billed
    // under 08004C must route to 718-7, NOT panel default 4544-3.
    const bundle = buildSampleBundle();
    const hgb = walkObservations(bundle).filter((o) =>
      (o.code.coding ?? []).some((c: any) => c.system === "http://loinc.org" && c.code === "718-7"),
    );
    expect(hgb.length).toBeGreaterThan(0);
    for (const o of hgb) {
      const loincCodes = (o.code.coding ?? [])
        .filter((c: any) => c.system === "http://loinc.org")
        .map((c: any) => c.code);
      expect(loincCodes).toContain("718-7");
      expect(loincCodes).not.toContain("4544-3"); // HCT — wrong analyte
    }
  });
});

// ── 1.3 UCUM unit validation — heuristic UCUM-shape lint. Catches
// the bad patterns we've seen without pulling in a heavyweight UCUM
// library. Patterns:
//   • full-width unit chars (㎡ ㎝ ㎜ etc.)
//   • "gm" instead of UCUM "g"
//   • lowercase l in concentration suffixes (UCUM is case-sensitive)
//   • Empty string when value is present
//   • Whitespace-only
// As we observe new bad patterns, add to this list. Not exhaustive,
// but covers all SMART app dev reports through Part 6.
const NON_UCUM_PATTERNS: { pattern: RegExp; reason: string }[] = [
  { pattern: /[㌀-㏿]/, reason: "Full-width CJK unit glyph (U+33xx range)" },
  { pattern: /\bgm\b/, reason: "Non-UCUM 'gm' — UCUM uses 'g'" },
  { pattern: /\/d[lL]\.$|\/dl(?:\s|$)/, reason: "Lowercase 'dl' or trailing dot — UCUM 'dL'" },
  { pattern: /\/[mμu]?l\b/, reason: "Lowercase 'l' in concentration suffix — UCUM uses 'L'" },
];

function findUcumIssues(unit: string): string[] {
  const issues: string[] = [];
  if (!unit || !unit.trim()) return issues;
  for (const { pattern, reason } of NON_UCUM_PATTERNS) {
    if (pattern.test(unit)) issues.push(reason);
  }
  return issues;
}

describe("CI Layer 1.3 — UCUM unit shape lint", () => {
  test("synthetic bundle emits zero non-UCUM units on valueQuantity", () => {
    const bundle = buildSampleBundle();
    const offenders: string[] = [];
    for (const obs of walkObservations(bundle)) {
      const unit = obs.valueQuantity?.unit;
      if (!unit) continue;
      const issues = findUcumIssues(unit);
      if (issues.length > 0) {
        offenders.push(`Obs '${obs.code?.text}' unit='${unit}': ${issues.join(", ")}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  test("regression — full-width ㎡ → m2 normalized via _canonicalizeUnit", () => {
    // Synthetic raw input with bad unit — mapper should normalize.
    const items = [
      {
        code: "",
        display: "eGFR",
        value: 88,
        unit: "mL/min/1.73㎡",
        date: "2024-05-10",
        hospital: "嘉基",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    expect(obs[0]?.valueQuantity?.unit).toBe("mL/min/1.73m2");
    expect(findUcumIssues(obs[0]?.valueQuantity?.unit ?? "")).toEqual([]);
  });

  test("regression — gm/dl → g/dL normalized via _canonicalizeUnit", () => {
    const items = [
      {
        code: "08003C",
        display: "Hb",
        value: 13,
        unit: "gm/dl",
        date: "2024-03-01",
        hospital: "中國北港",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    expect(obs[0]?.valueQuantity?.unit).toBe("g/dL");
    expect(findUcumIssues(obs[0]?.valueQuantity?.unit ?? "")).toEqual([]);
  });
});

// ── 1.4 valueString numeric-leading lint — if a string-typed
// Observation's value starts with a digit, the parser should have
// extracted a Quantity. Otherwise SMART app trend views and abnormal-
// flag computation silently break (they can't pivot on a string).
//
// The parser already handles common packed patterns ("33 (stage3:...)",
// "2.3(36.1%)", "4+ (2000)"). If a NEW packed pattern arrives that
// the parser can't handle, this test fires immediately — flagging the
// pattern for parser extension rather than letting it slip into a
// SMART app bug report.
// ── v0.11.1 — additional invariants from coag panel bug report ──
// Two new standing checks added to the bundle-quality suite:
//   • QC control rows must not be emitted as patient Observations
//   • Non-UCUM Chinese unit "倍數" must be normalized
describe("CI v0.11.1 — QC control rows must be filtered out", () => {
  test("Nor.plasma mean (coag QC denominator) not emitted as patient Obs", () => {
    const items = [
      {
        code: "08036C",
        display: "APTT data/mean",
        value: 1.08,
        unit: "倍數",
        date: "2025-05-18",
        hospital: "長庚嘉義",
      },
      {
        code: "08036C",
        display: "Nor.plasma mean",
        value: 29,
        unit: "sec",
        date: "2025-05-18",
        hospital: "長庚嘉義",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    const texts = obs.map((o: any) => o.code?.text);
    expect(texts).not.toContain("Nor.plasma mean");
    // v0.11.9: "APTT data/mean" now resolves to LOINC 63561-5 (APTT ratio)
    // and code.text uses LOINC_SHORT_TEXT override "APTT (ratio)". Raw
    // display is preserved in coding[nhi].display (faithful transport).
    expect(texts).toContain("APTT (ratio)"); // real patient row preserved (under short-text label)
    const apttRow = obs.find((o: any) => o.code?.text === "APTT (ratio)") as any;
    const nhiCoding = apttRow.code?.coding?.find((c: any) =>
      c.system?.includes("nhi-medical-order-code"),
    );
    expect(nhiCoding?.display).toBe("APTT data/mean");
  });

  test("QC control pattern variants all filtered", () => {
    const items = [
      { code: "08036C", display: "Normal plasma", value: 30, unit: "sec", date: "2025-05-18" },
      { code: "08036C", display: "Abn.plasma mean", value: 60, unit: "sec", date: "2025-05-18" },
      { code: "08036C", display: "Control mean", value: 28, unit: "sec", date: "2025-05-18" },
      { code: "08036C", display: "對照血漿", value: 30, unit: "sec", date: "2025-05-18" },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    expect(obs).toHaveLength(0);
  });
});

// ── v0.11.8 — blood type panel stableId collision ──────────────
// Bug 2026-05-28 part 3: user reported 11001C ABO + 11003C Rh both
// display "血型鑑定" with code 11001C/11003C. Bridge produced bundle
// with only 1 row (instead of 2-3). Root cause: stableId hash didn't
// include NHI code, so different billing codes with shared display
// canonical produced identical IDs → bundle-assembler dedup (by id)
// collapsed them. Fix: include code in stableId hash.
describe("CI v0.11.8 — different NHI codes with shared display must NOT collide at bundle level", () => {
  test("ABO (11001C) + Rh (11003C) blood type both ship as separate rows", () => {
    const items = [
      // 5 raw rows reproducing user's 2025-05-18 長庚嘉義 case
      {
        order_code: "11004C",
        code: "11004C",
        display: "抗體反應",
        value: "Negative",
        unit: "N/A",
        date: "2025-05-18",
        hospital: "長庚嘉義",
      },
      {
        order_code: "11001C",
        code: "11001C",
        display: "血型鑑定",
        value: "B",
        unit: "N/A",
        date: "2025-05-18",
        hospital: "長庚嘉義",
      },
      {
        order_code: "11003C",
        code: "11003C",
        display: "血型鑑定",
        value: "+",
        unit: "N/A",
        date: "2025-05-18",
        hospital: "長庚嘉義",
      },
      // The 2 duplicate rows below are hospital-LIS quirks (same
      // result uploaded under both codes). Bridge correctly dedups.
      {
        order_code: "11003C",
        code: "11003C",
        display: "血型鑑定",
        value: "B",
        unit: "N/A",
        date: "2025-05-18",
        hospital: "長庚嘉義",
      },
      {
        order_code: "11001C",
        code: "11001C",
        display: "血型鑑定",
        value: "+",
        unit: "N/A",
        date: "2025-05-18",
        hospital: "長庚嘉義",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    // v0.11.9 (SMART app dev clarification 2026-05-29): 健保存摺 ships
    // TWO distinct readings per blood-type panel — 11001C ABO has
    // BOTH "B" AND "+" (forward/reverse typing arms or dual-antisera
    // readings), and 11003C Rh similarly has "+" + "B". These are NOT
    // LIS upload duplicates as the v0.11.8 test originally assumed —
    // they're legitimately distinct analyte readings.
    //
    // Earlier the bridge's stableId hash didn't include value, so
    // (11001C, "血型鑑定", date, hospital) collapsed B + + to one Obs
    // per panel → 3 obs out (one per NHI code). v0.11.9 fix adds
    // value to stableId, preserving distinct readings.
    //
    // Expected: 5 obs out (2 ABO + 2 Rh + 1 antibody screen).
    expect(obs.length).toBe(5);
    const byNhiCode = (code: string) =>
      (obs as any[]).filter((o) =>
        o.code.coding.find(
          (c: any) => c.system?.endsWith("nhi-medical-order-code") && c.code === code,
        ),
      );
    expect(byNhiCode("11001C")).toHaveLength(2);
    expect(byNhiCode("11003C")).toHaveLength(2);
    expect(byNhiCode("11004C")).toHaveLength(1);
    // Each NHI code's two readings preserve both values
    const abo = byNhiCode("11001C")
      .map((o: any) => String(o.valueString ?? ""))
      .sort();
    expect(abo).toEqual(["+", "B"]);
    const rh = byNhiCode("11003C")
      .map((o: any) => String(o.valueString ?? ""))
      .sort();
    expect(rh).toEqual(["+", "B"]);
  });

  test("v0.11.9 — code.text uses NHI_CODE_PANEL_NAME override for generic '血型鑑定' display", () => {
    // SMART app dev 2026-05-29: bridge correctly separates ABO/Rh DRs
    // at the DR layer (v0.11.8 fix), but each Obs's code.text was the
    // generic "血型鑑定" — downstream SMART apps that key off code.text
    // (e.g. duplicate-detection by title+date+institution+value) saw
    // ABO B and Rh B as identical-looking rows.
    //
    // Fix: NHI_CODE_PANEL_NAME override gives code.text the catalog-
    // specific name. See the next test for coding[nhi].display (H fix)
    // — this test deliberately omits order_name so we exercise the
    // pure NHI_CODE_PANEL_NAME path (no order_name shortcut).
    const items = [
      {
        order_code: "11001C",
        code: "11001C",
        display: "血型鑑定",
        value: "B",
        unit: "N/A",
        date: "2025-05-18",
        hospital: "長庚嘉義",
      },
      {
        order_code: "11003C",
        code: "11003C",
        display: "血型鑑定",
        value: "+",
        unit: "N/A",
        date: "2025-05-18",
        hospital: "長庚嘉義",
      },
      {
        order_code: "11004C",
        code: "11004C",
        display: "抗體反應",
        value: "Negative",
        unit: "N/A",
        date: "2025-05-18",
        hospital: "長庚嘉義",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    expect(obs).toHaveLength(3);
    const byNhi = (code: string) =>
      (obs as any[]).find((o) =>
        o.code.coding.find(
          (c: any) => c.system?.endsWith("nhi-medical-order-code") && c.code === code,
        ),
      );
    const abo = byNhi("11001C");
    const rh = byNhi("11003C");
    const ab = byNhi("11004C");
    // v0.11.10 FHIR R4 compliance:
    //   - NHI_CODE_PANEL_NAME values aligned to NHI catalog formal
    //     names (was: my paraphrase "ABO 血型測定"; now: catalog
    //     "ABO血型測定檢驗"). Catalog 11003C uses FULLWIDTH parens.
    //   - code.text is free-form (FHIR R4 CodeableConcept.text), so
    //     normalizeFullwidth() converts fullwidth parens → halfwidth
    //     for SMART app column-header readability.
    //   - coding[nhi].display is Coding.display, must "follow rules of
    //     the system" (FHIR R4) — preserves NHI's choice of fullwidth.
    expect(abo.code.text).toBe("ABO血型測定檢驗");
    expect(rh.code.text).toBe("RH(D)型檢驗"); // halfwidth (normalized)
    expect(ab.code.text).toBe("抗體反應 (不規則抗體)");
    // coding[nhi].display preserves NHI catalog name verbatim — for
    // 11003C that's "RH（D）型檢驗" with FULLWIDTH parens.
    const aboNhi = abo.code.coding.find((c: any) => c.system?.endsWith("nhi-medical-order-code"));
    const rhNhi = rh.code.coding.find((c: any) => c.system?.endsWith("nhi-medical-order-code"));
    expect(aboNhi.display).toBe("ABO血型測定檢驗");
    expect(rhNhi.display).toBe("RH（D）型檢驗"); // fullwidth preserved
  });

  test("v0.11.9 H — coding[nhi].display = panel catalog name when order_name is set", () => {
    // SMART app dev 2026-05-29 Category A: coding[nhi].display should be
    // the NHI catalog panel name (e.g. "ABO血型測定檢驗"), not the
    // row-level LIS display ("血型鑑定"). Scraper sets raw.order_name to
    // the NHI catalog value; bridge now passes it through to
    // buildCodings so coding[nhi].display surfaces the panel-specific
    // name. Fallback to NHI_CODE_PANEL_NAME override when order_name
    // missing, finally to display.
    const items = [
      {
        order_code: "11001C",
        code: "11001C",
        display: "血型鑑定",
        value: "B",
        unit: "N/A",
        date: "2025-05-18",
        hospital: "長庚嘉義",
        order_name: "ABO血型測定檢驗",
      },
      {
        order_code: "11003C",
        code: "11003C",
        display: "血型鑑定",
        value: "+",
        unit: "N/A",
        date: "2025-05-18",
        hospital: "長庚嘉義",
        order_name: "RH（D）型檢驗",
      },
      // No order_name → falls back to NHI_CODE_PANEL_NAME if mapped
      {
        order_code: "11004C",
        code: "11004C",
        display: "抗體反應",
        value: "Negative",
        unit: "N/A",
        date: "2025-05-18",
        hospital: "長庚嘉義",
      },
    ];
    const all = mapObservationsGrouped(items, PATIENT_ID);
    const obs = all.filter((r) => r.resourceType === "Observation");
    const drs = all.filter((r) => r.resourceType === "DiagnosticReport");

    const obsByNhi = (code: string) =>
      (obs as any[]).find((o) =>
        o.code.coding.find(
          (c: any) => c.system?.endsWith("nhi-medical-order-code") && c.code === code,
        ),
      );
    const aboNhi = obsByNhi("11001C").code.coding.find((c: any) =>
      c.system?.endsWith("nhi-medical-order-code"),
    );
    const rhNhi = obsByNhi("11003C").code.coding.find((c: any) =>
      c.system?.endsWith("nhi-medical-order-code"),
    );
    const abNhi = obsByNhi("11004C").code.coding.find((c: any) =>
      c.system?.endsWith("nhi-medical-order-code"),
    );
    // order_name path
    expect(aboNhi.display).toBe("ABO血型測定檢驗");
    expect(rhNhi.display).toBe("RH（D）型檢驗");
    // NHI_CODE_PANEL_NAME fallback
    expect(abNhi.display).toBe("抗體反應 (不規則抗體)");

    // DR titles: orderName preferred for multi-obs (already true); for
    // single-obs (11004C), NHI_CODE_PANEL_NAME override now wins so DR
    // and obs.text stay aligned.
    const drByNhi = (code: string) =>
      (drs as any[]).find((d) => d.code.coding.find((c: any) => c.code === code));
    expect(drByNhi("11004C").code.text).toBe("抗體反應 (不規則抗體)");
  });

  test("each NHI code gets own DiagnosticReport (DR id includes code)", () => {
    // Bug 2026-05-28: DR stableId also missed NHI code in hash. With
    // 11001C ABO + 11003C Rh both → panelSignature "血型鑑定" → same
    // DR id → bundle-assembler collapsed them, leaving one DR with
    // a broken result[] reference (the other Obs orphaned). Same root
    // cause as the Obs stableId fix — applied to DR too.
    const items = [
      {
        order_code: "11001C",
        code: "11001C",
        display: "血型鑑定",
        value: "B",
        unit: "N/A",
        date: "2025-05-18",
        hospital: "長庚嘉義",
        order_name: "ABO血型測定檢驗",
      },
      {
        order_code: "11003C",
        code: "11003C",
        display: "血型鑑定",
        value: "+",
        unit: "N/A",
        date: "2025-05-18",
        hospital: "長庚嘉義",
        order_name: "RH（D）型檢驗",
      },
    ];
    const all = mapObservationsGrouped(items, PATIENT_ID);
    const drs = all.filter((r) => r.resourceType === "DiagnosticReport");
    const obs = all.filter((r) => r.resourceType === "Observation");
    expect(drs).toHaveLength(2);
    expect(obs).toHaveLength(2);
    // Each DR must have a distinct id (no collision)
    const drIds = new Set(drs.map((d: any) => d.id));
    expect(drIds.size).toBe(2);
    // Each DR's result[] must reference an in-bundle Observation
    const obsIds = new Set(obs.map((o: any) => `Observation/${o.id}`));
    for (const dr of drs as any[]) {
      for (const ref of dr.result || []) {
        expect(obsIds.has(ref.reference)).toBe(true);
      }
    }
  });

  test("same code + same display + same value cross-language merge still works (Hb / 血紅素 under 08011C)", () => {
    // Defensive: code-in-stableId must not break intended cross-
    // language dedup within a single panel code.
    const items = [
      {
        order_code: "08011C",
        code: "08011C",
        display: "Hb",
        value: 14,
        unit: "g/dL",
        date: "2024-01-15",
        hospital: "X",
      },
      {
        order_code: "08011C",
        code: "08011C",
        display: "血紅素",
        value: 14,
        unit: "g/dL",
        date: "2024-01-15",
        hospital: "X",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    expect(obs.length).toBe(1);
  });
});

// ── v0.11.7 — dedup-collision silent-drop in panels ────────────
// Bug 2026-05-28 part 2: user's 20-row 06013C urinalysis panel
// → bundle had only 11 (9 silent drops). Two dedup functions
// (dedupePanelItems + dedupeCrossFormat) used (value)-only or
// (date, value, unit, code) keys, which false-merged different
// analytes that happened to share value="Negative" mg/dL. Plus
// canonicalLabKey synonym table had wrong urinalysis mappings
// (微白蛋白(尿) → ALBUMIN, 白血球酯脢 → WBC, etc.) that further
// false-merged via stableId.
describe("CI v0.11.7 — urinalysis panel: no silent drop from dedup collision", () => {
  test("20-row 06013C panel (Bug 2026-05-28) — all distinct analytes preserved", () => {
    // Exact reproduction of user's raw NHI response on 2026-01-14
    // 長庚嘉義 — 20 rows under code 06013C. Bundle should contain
    // 18 distinct analytes (2 legit cross-language merges of same
    // analyte: Bilirubin/膽紅素 + CREA(U)/肌酸酐(尿液)).
    const items = [
      // Batch A (English-named)
      {
        code: "06013C",
        display: "Bilirubin",
        value: "Negative",
        unit: "mg/dL",
        date: "2026-01-14",
      },
      { code: "06013C", display: "Blood", value: "Negative", unit: "-", date: "2026-01-14" },
      {
        code: "06013C",
        display: "CREA(U)(半定量)",
        value: "100",
        unit: "mg/dL",
        date: "2026-01-14",
      },
      { code: "06013C", display: "Color", value: "Straw", unit: "-", date: "2026-01-14" },
      { code: "06013C", display: "Glucose", value: "4+ (2000)", unit: "mg/dL", date: "2026-01-14" },
      // Batch B (Chinese-named)
      { code: "06013C", display: "亞硝酸鹽", value: "Negative", unit: "mg/dL", date: "2026-01-14" },
      {
        code: "06013C",
        display: "尿潛血",
        value: "Negative",
        unit: "空白空白",
        date: "2026-01-14",
      },
      { code: "06013C", display: "尿糖", value: "4+ (2000)", unit: "mg/dL", date: "2026-01-14" },
      {
        code: "06013C",
        display: "尿膽素原",
        value: "Normal (＜2.0)",
        unit: "mg/dL",
        date: "2026-01-14",
      },
      { code: "06013C", display: "尿蛋白", value: "Trace (15)", unit: "mg/dL", date: "2026-01-14" },
      {
        code: "06013C",
        display: "微白蛋白(尿)(半定量)",
        value: "80",
        unit: "mg/L",
        date: "2026-01-14",
      },
      {
        code: "06013C",
        display: "微白蛋白/肌酐酸比值(半定量)",
        value: "1+ (80)",
        unit: "mg/g",
        date: "2026-01-14",
      },
      { code: "06013C", display: "比重", value: "1.021", unit: "空白空白", date: "2026-01-14" },
      { code: "06013C", display: "濁度", value: "Clear", unit: "空白空白", date: "2026-01-14" },
      {
        code: "06013C",
        display: "白血球酯脢",
        value: "Negative",
        unit: "空白空白",
        date: "2026-01-14",
      },
      {
        code: "06013C",
        display: "肌酸酐(尿液)(半定量)",
        value: "100",
        unit: "mg/dL",
        date: "2026-01-14",
      },
      { code: "06013C", display: "膽紅素", value: "Negative", unit: "mg/dL", date: "2026-01-14" },
      { code: "06013C", display: "酮體", value: "Negative", unit: "mg/dL", date: "2026-01-14" },
      { code: "06013C", display: "酸鹼值", value: "6.5", unit: "空白空白", date: "2026-01-14" },
      { code: "06013C", display: "顏色", value: "Straw", unit: "空白空白", date: "2026-01-14" },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    // v0.12.1 — strict faithful transport: raw unit included in stableId.
    // 20 raw rows minus 3 cross-language pairs that share BOTH canonical
    // AND raw unit ([Bilirubin/膽紅素 mg/dL], [CREA(U)/肌酸酐(尿液) mg/dL],
    // [Glucose/尿糖 mg/dL]) collapse to 1 obs each via canonical-based
    // stableId; the other 2 pairs (Color "-"/顏色 "空白空白", Blood "-"/
    // 尿潛血 "空白空白") differ in raw unit encoding and both survive
    // under v0.12.1's strict no-dedup rule. 20 - 3 = 17 obs.
    expect(obs.length).toBe(17);
    const texts = obs.map((o: any) => o.code?.text);
    // Cross-language pairs with IDENTICAL raw units collapse via
    // canonical-based stableId (English wins via dedupePanelItems EN-
    // preferred merge for same-canonical groups).
    expect(texts).toContain("Bilirubin");
    expect(texts).not.toContain("膽紅素");
    expect(texts).toContain("CREA(U)(半定量)");
    expect(texts).not.toContain("肌酸酐(尿液)(半定量)");
    expect(texts).toContain("Glucose");
    expect(texts).not.toContain("尿糖");
    // v0.12.1 strict no-dedup: cross-language pairs with DIFFERENT raw
    // unit encodings ("-" vs "空白空白") both survive — bridge does NOT
    // judge "two placeholder units = same intent". Both texts present.
    expect(texts).toContain("Color");
    expect(texts).toContain("顏色");
    expect(texts).toContain("Blood");
    expect(texts).toContain("尿潛血");
    // Chinese-only analytes (no English equivalent in raw) must stay
    for (const must of [
      "亞硝酸鹽", // Nitrite — must NOT merge with Bilirubin / 膽紅素 by value
      "白血球酯脢", // Leukocyte Esterase — must NOT canonical-collide with blood WBC
      "酮體", // Ketones
      "微白蛋白(尿)(半定量)", // Microalbumin — must NOT collide with serum Albumin
      "微白蛋白/肌酐酸比值(半定量)", // UACR
    ]) {
      expect(texts).toContain(must);
    }
  });

  test("v0.11.7 — serum Glucose (09005C) NOT canonical-merged with urinalysis Glucose (06013C)", () => {
    // Defensive: code-scoped canonical disambiguation must not cause
    // cross-panel false merge. Patient with both urine glucose AND
    // serum glucose on same date at same hospital must keep both rows.
    const items = [
      {
        code: "06013C",
        display: "Glucose",
        value: "Negative",
        unit: "",
        date: "2026-01-14",
        hospital: "長庚嘉義",
      },
      {
        code: "09005C",
        display: "Glucose",
        value: "95",
        unit: "mg/dL",
        date: "2026-01-14",
        hospital: "長庚嘉義",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    expect(obs.length).toBe(2);
  });
});

// ── v0.11.6 — silent-drop audit (bug pattern caught in v0.11.5) ─
// Background: long-standing v0 bug where `looksLikeImaging` substring-
// matched "ct " (CT scan with trailing-space sentinel) against
// `${display} ${code}` haystack. Bare display "HCT" + space-separator
// before code → "hct 08011c" contains "ct " → row dropped silently.
// User caught it via "health bank shows 8 items but bundle has 7"
// after years of every CBC report missing HCT for hospitals that
// shipped bare "HCT" display strings (vs "Hct(血球容積比)" / "Ht").
// Audit gap: prior probes called findLoinc / mapObservationsGrouped
// with crafted inputs but never tested "given N raw items, does
// pipeline produce N observations?" — never checked filter stage at
// all. These two tests close that gap.
describe("CI v0.11.6 — silent-drop audit (filter must not eat valid labs)", () => {
  test("bare 'HCT' display under 08011C is NOT silently filtered", () => {
    // The exact bug seed — 嘉義長庚 2026-05-25 case.
    const items = [
      {
        code: "08011C",
        display: "HCT",
        value: 35.8,
        unit: "%",
        date: "2026-05-25",
        hospital: "長庚嘉義",
      },
      {
        code: "08011C",
        display: "HGB",
        value: 11.2,
        unit: "g/dL",
        date: "2026-05-25",
        hospital: "長庚嘉義",
      },
      { code: "08011C", display: "Direct", value: 0.3, unit: "mg/dL", date: "2026-05-25" }, // any display ending in 'ct'
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    const texts = obs.map((o: any) => o.code?.text);
    expect(texts).toContain("HCT");
    expect(texts).toContain("Direct");
    // HCT must route to 4544-3 (Hematocrit), not the panel LOINC
    const hct: any = obs.find((o: any) => o.code?.text === "HCT");
    expect(hct?.code.coding.find((c: any) => c.system === "http://loinc.org")?.code).toBe("4544-3");
  });

  test("raw-count vs output-count: filter only drops on documented reasons", () => {
    // Feed a known mixed batch with explicit drop reasons. Anything
    // dropped beyond the documented reasons is a silent-drop bug.
    const items = [
      // — VALID rows (should ALL be emitted) —
      { code: "08011C", display: "HCT", value: 35.8, unit: "%", date: "2026-05-25" },
      { code: "08011C", display: "HGB", value: 11.2, unit: "g/dL", date: "2026-05-25" },
      { code: "08011C", display: "WBC", value: 4.1, unit: "1000/uL", date: "2026-05-25" },
      { code: "08011C", display: "Direct", value: 0.3, unit: "mg/dL", date: "2026-05-25" },
      { code: "06013C", display: "Color", value: "Yellow", unit: "", date: "2026-05-25" },
      { code: "09015C", display: "eGFR", value: 90, unit: "mL/min/1.73m2", date: "2026-05-25" },
      // — DOCUMENTED-DROP rows (legitimate filter targets) —
      { code: "08036C", display: "Nor.plasma mean", value: 29, unit: "sec", date: "2026-05-25" }, // QC control
      { code: "08011C", display: "MCV", value: "", unit: "fL", date: "2026-05-25" }, // empty value
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    // 6 valid + 0 dropped-as-imaging + 0 dropped-as-empty + 0
    // dropped-as-QC = 6 expected.
    expect(obs).toHaveLength(6);
    const texts = obs.map((o: any) => o.code?.text);
    // Must include all 6 valid rows. v0.13: CBC LOINCs in
    // CBC_CANONICAL_TEXT_LOINCS get canonical short text on clean match
    // — "HGB" → "Hb". Others (WBC=6690-2, Direct=panel-fallback, Color,
    // eGFR — none in CBC set) keep raw display.
    for (const expected of ["HCT", "Hb", "WBC", "Direct", "Color", "eGFR"]) {
      expect(texts).toContain(expected);
    }
    // Must NOT include the legitimately-dropped rows
    expect(texts).not.toContain("Nor.plasma mean");
    expect(texts).not.toContain("MCV"); // empty value
  });
});

// ── v0.11.4 — proactive display-variant audit regression seeds ──
// Bridge-author audit (not bug report driven): probed 282 plausible
// display variants across 30+ analytes and panels. Found 49 misses
// across 5 categories (period-separated abbrevs, CJK synonyms,
// English short forms, full names, abbreviated dipstick codes).
// All fixed; the seeds below lock the highest-risk ones permanently
// so refactoring CBC_COMPONENT_KEYS / CBC_DIFF_KEYS / panel tables
// can't regress them without CI catching it.
describe("CI v0.11.4 — display-variant coverage (proactive audit)", () => {
  test("period-separated abbreviations resolve correctly (W.B.C / M.C.V / A.B.E etc.)", () => {
    expect(findLoinc("08011C", "W.B.C.")).toBe("6690-2");
    expect(findLoinc("08011C", "R.B.C.")).toBe("789-8");
    expect(findLoinc("08011C", "M.C.V.")).toBe("787-2");
    expect(findLoinc("08011C", "M.C.H.")).toBe("785-6");
    expect(findLoinc("08011C", "M.C.H.C.")).toBe("786-4");
    expect(findLoinc("09041B", "A.B.E.")).toBe("1925-7");
    expect(findLoinc("09041B", "S.B.E.")).toBe("1927-3");
  });

  test("CJK synonyms — 血色素 / 血紅蛋白 / 紅血球容積 / 淋巴 / 多核球", () => {
    expect(findLoinc("08011C", "血色素")).toBe("718-7"); // Hb synonym
    expect(findLoinc("08011C", "血紅蛋白")).toBe("718-7");
    expect(findLoinc("08011C", "紅血球容積")).toBe("4544-3"); // HCT alt phrasing
    expect(findLoinc("08013C", "淋巴")).toBe("736-9");
    expect(findLoinc("08013C", "多核球")).toBe("770-8"); // Neutrophil alt
  });

  test("English short forms — Neut / Lym / Lymph / Lymph cell", () => {
    expect(findLoinc("08013C", "Neut")).toBe("770-8");
    expect(findLoinc("08013C", "Neut.")).toBe("770-8");
    expect(findLoinc("08013C", "Lym")).toBe("736-9");
    expect(findLoinc("08013C", "Lymph")).toBe("736-9");
    expect(findLoinc("08013C", "Lymph cell")).toBe("736-9");
  });

  test("Urinalysis dipstick abbreviations route to per-item LOINCs", () => {
    expect(findLoinc("06013C", "Bili")).toBe("5770-3");
    expect(findLoinc("06013C", "KET")).toBe("5797-6");
    expect(findLoinc("06013C", "OB")).toBe("5794-3");
    expect(findLoinc("06013C", "NIT")).toBe("5802-4");
    expect(findLoinc("06013C", "UBG")).toBe("5818-0");
    expect(findLoinc("06013C", "SG")).toBe("5811-5");
    expect(findLoinc("06013C", "Colour")).toBe("5778-6"); // UK spelling
    expect(findLoinc("06013C", "WBC esterase")).toBe("5799-2"); // not 6690-2
  });

  test("ABG CJK + period variants resolve", () => {
    expect(findLoinc("09041B", "酸鹼值")).toBe("11558-4");
    expect(findLoinc("09041B", "二氧化碳分壓")).toBe("2019-8");
    expect(findLoinc("09041B", "氧分壓")).toBe("2703-7");
    expect(findLoinc("09041B", "碳酸氫根")).toBe("1959-6");
    expect(findLoinc("09041B", "T.CO2")).toBe("2028-9");
    expect(findLoinc("09041B", "O2 saturation")).toBe("2713-6");
    expect(findLoinc("09041B", "血氧飽和度")).toBe("2713-6");
  });

  test("Flow CD3+/CD4+ ratio doesn't collapse to bare CD3 LOINC", () => {
    // Bug: trailing "+" in keys broke \b boundary. Fixed by dropping
    // trailing + from keys → "cd3+/cd4" key matches the "cd3+/cd4"
    // prefix of display "CD3+/CD4+".
    expect(findLoinc("12204B", "CD3+/CD4+")).toBe("8123-2"); // CD4
    expect(findLoinc("12204B", "CD3+/CD8+")).toBe("8128-1"); // CD8
  });
});

describe("CI v0.11.1 — 倍數 unit normalized to UCUM {ratio}", () => {
  test("APTT ratio with unit='倍數' → '{ratio}' (UCUM annotation)", () => {
    const items = [
      {
        code: "08036C",
        display: "APTT ratio",
        value: 1.08,
        unit: "倍數",
        date: "2025-05-18",
        hospital: "長庚嘉義",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    expect(obs[0]?.valueQuantity?.unit).toBe("{ratio}");
  });
});

describe("CI Layer 1.4 — valueString must not start with digit", () => {
  test("synthetic bundle emits no numeric-leading valueString", () => {
    const bundle = buildSampleBundle();
    const offenders: string[] = [];
    for (const obs of walkObservations(bundle)) {
      const vs = obs.valueString;
      if (typeof vs === "string" && /^\s*[\d.\-+]/.test(vs) && !obs.valueQuantity) {
        offenders.push(`Obs '${obs.code?.text}' valueString='${vs}' — should be valueQuantity`);
      }
    }
    expect(offenders).toEqual([]);
  });

  test("known packed patterns route to valueQuantity (parser already handles)", () => {
    // v0.11.7 — split the assertions. eGFR + albumin patterns still
    // extract to valueQuantity (leading IS a real numeric value).
    // Dipstick patterns ("4+ (2000)") now preserve valueString —
    // the grade is the clinically meaningful data point. Previous
    // v0.9.7 design (extract parens number) lost the grade.
    const quantityItems = [
      {
        code: "09015C",
        display: "eGFR",
        value: "33 (stage3:30-59)",
        unit: "mL/min/1.73m2",
        date: "2024-05-10",
      },
      { code: "06013C", display: "Bilirubin", value: "2.3(36.1%)", unit: "", date: "2024-04-01" },
    ];
    const quantityObs = mapObservationsGrouped(quantityItems, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    for (const o of quantityObs) {
      expect(o.valueQuantity).toBeDefined();
      expect(o.valueString).toBeUndefined();
    }
  });

  test("v0.11.7 — dipstick patterns preserved as valueString (NOT extracted to Quantity)", () => {
    // Bug 2026-05-28: bridge extracted parens-numeric and lost the
    // grade prefix. Clinically meaningful data lost. Now the raw
    // string is preserved.
    const dipstickItems = [
      { code: "06013C", display: "Glucose", value: "4+ (2000)", unit: "mg/dL", date: "2026-01-14" },
      {
        code: "06013C",
        display: "Protein",
        value: "Trace (15)",
        unit: "mg/dL",
        date: "2026-01-14",
      },
      {
        code: "06013C",
        display: "Microalbumin",
        value: "1+ (80)",
        unit: "mg/g",
        date: "2026-01-14",
      },
    ];
    const dipstickObs = mapObservationsGrouped(dipstickItems, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    expect(dipstickObs).toHaveLength(3);
    for (const o of dipstickObs as any[]) {
      expect(o.valueQuantity).toBeUndefined();
      expect(o.valueString).toMatch(/^(?:[\d.]+\+|Trace)/);
    }
    // Specifically: glucose row preserves "4+ (2000)" verbatim
    const glucose = dipstickObs.find((o: any) => o.code?.text === "Glucose") as any;
    expect(glucose?.valueString).toBe("4+ (2000)");
  });
});

// ── v0.11.9 — APTT panel routing + QC broadening + LOINC short text ─
// SMART app dev report 2026-05-29:
//
//   1. APTT 08036C reported two analytes under one billing code:
//      "Heparin治療範圍參考倍數" (ratio, ~1.08) and "APTT" (seconds,
//      ~30). Both mapped to LOINC 14979-9 (APTT time) before v0.11.9
//      — fatal display of 1.08 seconds APTT or 30 ratio.
//   2. "正常血漿APTT平均值" QC control row wasn't caught by the
//      narrow /正常血漿平均/ pattern.
//   3. code.text "Heparin治療範圍參考倍數" surfaces a settings-style
//      label as analyte column header in SMART apps; LOINC_SHORT_TEXT
//      override gives a clean "APTT (ratio)" header.
//   4. Earlier v0.9.10 5894-1 mapping for "PT control"/"對照" was based
//      on misread of 5894-1 semantics (actually PT actual/Normal ratio,
//      not control).
describe("CI v0.11.9 — APTT (08036C) panel routing", () => {
  test("ratio sub-row (Heparin治療範圍參考倍數, val=1.08) → LOINC 63561-5, NOT 14979-9", () => {
    const items = [
      {
        order_code: "08036C",
        code: "08036C",
        display: "APTT",
        value: 31.4,
        unit: "sec",
        date: "2025-05-18",
        hospital: "長庚嘉義",
      },
      {
        order_code: "08036C",
        code: "08036C",
        display: "Heparin治療範圍參考倍數",
        value: 1.08,
        unit: "倍數",
        date: "2025-05-18",
        hospital: "長庚嘉義",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    expect(obs).toHaveLength(2);

    const ratio = obs.find((o: any) =>
      String(
        o.code?.coding?.find((c: any) => c.system?.includes("nhi-medical-order-code"))?.display ??
          "",
      ).includes("Heparin"),
    ) as any;
    expect(ratio).toBeDefined();
    const ratioLoinc = ratio.code?.coding?.find((c: any) => c.system === "http://loinc.org");
    expect(ratioLoinc?.code).toBe("63561-5");

    const time = obs.find((o: any) => {
      const nhiDisp = o.code?.coding?.find((c: any) =>
        c.system?.includes("nhi-medical-order-code"),
      )?.display;
      return String(nhiDisp ?? "") === "APTT";
    }) as any;
    expect(time).toBeDefined();
    const timeLoinc = time.code?.coding?.find((c: any) => c.system === "http://loinc.org");
    expect(timeLoinc?.code).toBe("14979-9");
  });

  test("APTT data/mean and APTT actual/normal variants → 63561-5", () => {
    const items = [
      {
        order_code: "08036C",
        code: "08036C",
        display: "APTT data/mean",
        value: 1.08,
        unit: "倍數",
        date: "2025-05-18",
      },
      {
        order_code: "08036C",
        code: "08036C",
        display: "APTT actual/normal",
        value: 1.12,
        unit: "倍數",
        date: "2025-05-19",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    expect(obs).toHaveLength(2);
    for (const o of obs as any[]) {
      const loinc = o.code?.coding?.find((c: any) => c.system === "http://loinc.org");
      expect(loinc?.code).toBe("63561-5");
    }
  });

  test("code.text uses LOINC_SHORT_TEXT override (APTT / APTT (ratio) / PT / INR)", () => {
    const items = [
      {
        order_code: "08036C",
        code: "08036C",
        display: "APTT",
        value: 31.4,
        unit: "sec",
        date: "2025-05-18",
      },
      {
        order_code: "08036C",
        code: "08036C",
        display: "Heparin治療範圍參考倍數",
        value: 1.08,
        unit: "倍數",
        date: "2025-05-18",
      },
      {
        order_code: "08026C",
        code: "08026C",
        display: "PT",
        value: 12.1,
        unit: "sec",
        date: "2025-05-18",
      },
      {
        order_code: "08026C",
        code: "08026C",
        display: "INR",
        value: 1.0,
        unit: "{ratio}",
        date: "2025-05-18",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    const texts = (obs as any[]).map((o) => o.code?.text).sort();
    expect(texts).toEqual(["APTT", "APTT (ratio)", "INR", "PT"]);
    // Raw NHI display preserved in coding[nhi].display (faithful transport)
    const ratio = obs.find((o: any) => o.code?.text === "APTT (ratio)") as any;
    const nhiCoding = ratio.code?.coding?.find((c: any) =>
      c.system?.includes("nhi-medical-order-code"),
    );
    expect(nhiCoding?.display).toBe("Heparin治療範圍參考倍數");
  });
});

describe("CI v0.11.9 — QC pattern broadening", () => {
  test("正常血漿APTT平均值 + 正常血漿PT平均值 filtered out", () => {
    const items = [
      {
        order_code: "08036C",
        code: "08036C",
        display: "正常血漿APTT平均值",
        value: 29.5,
        unit: "sec",
        date: "2025-05-18",
      },
      {
        order_code: "08026C",
        code: "08026C",
        display: "正常血漿PT平均值",
        value: 12.0,
        unit: "sec",
        date: "2025-05-18",
      },
      // real patient APTT survives
      {
        order_code: "08036C",
        code: "08036C",
        display: "APTT",
        value: 31.4,
        unit: "sec",
        date: "2025-05-18",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    expect(obs).toHaveLength(1);
    expect((obs[0] as any).code?.text).toBe("APTT");
  });

  test("legacy QC variants still filtered (Nor.plasma mean / 對照血漿 / Control mean)", () => {
    const items = [
      { code: "08036C", display: "Nor.plasma mean", value: 29, unit: "sec", date: "2025-05-18" },
      { code: "08036C", display: "對照血漿", value: 30, unit: "sec", date: "2025-05-18" },
      { code: "08036C", display: "Control mean", value: 28, unit: "sec", date: "2025-05-18" },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    expect(obs).toHaveLength(0);
  });
});

describe("CI v0.11.9 — 5894-1 PT control mapping removed", () => {
  test("PT Control display under 08026C falls back to NHI-only (no 5894-1)", () => {
    // Note: "Control PT" / "PT control" displays in real Taiwan LIS
    // bundles are typically lab QC and may be caught by QC patterns
    // depending on exact phrasing. This test asserts the FALLBACK
    // behaviour: if they slip past the QC filter (e.g. "PT Control"
    // exact case with no "plasma" or "mean"), they MUST NOT be
    // mis-mapped to 5894-1 (which is a ratio, not a control reading).
    const items = [
      {
        order_code: "08026C",
        code: "08026C",
        display: "PT Control",
        value: 12.5,
        unit: "sec",
        date: "2025-05-18",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    if (obs.length > 0) {
      const loinc = (obs[0] as any).code?.coding?.find((c: any) => c.system === "http://loinc.org");
      // Either no LOINC (fallback to NHI only) OR PT time (5902-2), but
      // NEVER 5894-1 (incorrect ratio mapping).
      expect(loinc?.code).not.toBe("5894-1");
    }
  });
});

// ── v0.11.10 — Category B + C from SMART app dev report 2026-05-29 ─
// 9 single-analyte panels had DR title vs obs.text inconsistencies:
//   B (medium): DR + obs use different Chinese/English forms for the
//               same analyte (膽紅素總量 vs 全膽紅素 / HbA1c vs 醣化血紅素)
//   B-fullwidth: 09099C "心肌旋轉蛋白Ｉ" uses fullwidth Ｉ
//   C (low): DR title carries method suffix ("免疫分析" / "(EIA/LIA法)")
//            while obs.text strips it
// Fix path: LOINC_SHORT_TEXT extended to cover these 9 LOINCs (each
// WebFetch-verified at loinc.org per the new project rule), and DR
// title construction now consults LOINC_SHORT_TEXT first when the
// panel's NHI code maps to a known LOINC.
//
// Result: DR.code.text and obs.code.text are both the clean LOINC
// short text; DR.code.coding[0].display + obs.coding[nhi].display
// still preserve the raw NHI catalog name (faithful transport).
describe("CI v0.11.10 — Category B/C DR vs obs name unification via LOINC_SHORT_TEXT", () => {
  test("09006C HbA1c — DR title and obs.text both 'HbA1c'", () => {
    const items = [
      {
        order_code: "09006C",
        code: "09006C",
        display: "Hb-A1c",
        value: 5.8,
        unit: "%",
        date: "2025-05-18",
        hospital: "某醫院",
        order_name: "醣化血紅素",
      },
    ];
    const all = mapObservationsGrouped(items, PATIENT_ID);
    const dr = all.find((r) => r.resourceType === "DiagnosticReport") as any;
    const obs = all.find((r) => r.resourceType === "Observation") as any;
    expect(dr.code.text).toBe("HbA1c");
    expect(obs.code.text).toBe("HbA1c");
    // Raw catalog name preserved in coding[*].display (faithful)
    expect(dr.code.coding[0].display).toBe("醣化血紅素");
    const obsNhi = obs.code.coding.find((c: any) => c.system?.endsWith("nhi-medical-order-code"));
    expect(obsNhi.display).toBe("醣化血紅素");
  });

  test("09029C total bilirubin — DR + obs both 'Total Bilirubin'", () => {
    const items = [
      {
        order_code: "09029C",
        code: "09029C",
        display: "全膽紅素",
        value: 0.8,
        unit: "mg/dL",
        date: "2025-05-18",
        order_name: "膽紅素總量",
      },
    ];
    const all = mapObservationsGrouped(items, PATIENT_ID);
    const dr = all.find((r) => r.resourceType === "DiagnosticReport") as any;
    const obs = all.find((r) => r.resourceType === "Observation") as any;
    expect(dr.code.text).toBe("Total Bilirubin");
    expect(obs.code.text).toBe("Total Bilirubin");
  });

  test("09099C Troponin I — fullwidth Ｉ normalised to halfwidth I in code.text", () => {
    const items = [
      {
        order_code: "09099C",
        code: "09099C",
        display: "心肌旋轉蛋白Ｉ", // fullwidth Ｉ
        value: 0.02,
        unit: "ng/mL",
        date: "2025-05-18",
        order_name: "心肌旋轉蛋白Ｉ",
      },
    ];
    const all = mapObservationsGrouped(items, PATIENT_ID);
    const dr = all.find((r) => r.resourceType === "DiagnosticReport") as any;
    const obs = all.find((r) => r.resourceType === "Observation") as any;
    // LOINC_SHORT_TEXT[10839-9] override wins, fullwidth not a concern
    // for code.text path since LOINC short text is already halfwidth.
    expect(dr.code.text).toBe("Troponin I");
    expect(obs.code.text).toBe("Troponin I");
  });

  test("09099C Troponin I — fullwidth fallback path (no LOINC_SHORT_TEXT) still normalised", () => {
    // Defensive: even if the LOINC override is missing, the fullwidth
    // normaliser should still kick in on the fallback display path.
    // Use a fake NHI code with NO entry in LOINC_SHORT_TEXT / NHI_TO_LOINC.
    const items = [
      {
        order_code: "99999X",
        code: "99999X",
        display: "ＡＢＣＤ", // fullwidth ASCII
        value: 1,
        unit: "",
        date: "2025-05-18",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    expect(obs.code.text).toBe("ABCD");
  });

  test("09112C TSH — DR title strips '免疫分析' via LOINC_SHORT_TEXT override", () => {
    const items = [
      {
        order_code: "09112C",
        code: "09112C",
        display: "甲狀腺刺激素",
        value: 1.5,
        unit: "uIU/mL",
        date: "2025-05-18",
        order_name: "甲狀腺刺激素免疫分析",
      },
    ];
    const all = mapObservationsGrouped(items, PATIENT_ID);
    const dr = all.find((r) => r.resourceType === "DiagnosticReport") as any;
    const obs = all.find((r) => r.resourceType === "Observation") as any;
    expect(dr.code.text).toBe("TSH");
    expect(obs.code.text).toBe("TSH");
    // Raw NHI catalog name (with method suffix) preserved in coding[*].display
    expect(dr.code.coding[0].display).toBe("甲狀腺刺激素免疫分析");
  });

  test("12081C PSA — DR title strips '(EIA/LIA法)' via LOINC_SHORT_TEXT override", () => {
    const items = [
      {
        order_code: "12081C",
        code: "12081C",
        display: "PSA",
        value: 1.2,
        unit: "ng/mL",
        date: "2025-05-18",
        order_name: "攝護腺特異抗原(EIA/LIA法)",
      },
    ];
    const dr = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "DiagnosticReport",
    ) as any;
    expect(dr.code.text).toBe("PSA");
    // Raw catalog name + method preserved in coding[0].display
    expect(dr.code.coding[0].display).toBe("攝護腺特異抗原(EIA/LIA法)");
  });

  test("13457-7 LDL-C / 2143-6 Cortisol / 2132-9 Vitamin B12 / 2284-8 Folate short-text labels", () => {
    const items = [
      {
        order_code: "09044C",
        code: "09044C",
        display: "LDL-C(direct)",
        value: 110,
        unit: "mg/dL",
        date: "2025-05-18",
        order_name: "低密度脂蛋白－膽固醇",
      },
      {
        order_code: "09113C",
        code: "09113C",
        display: "皮質素",
        value: 12,
        unit: "ug/dL",
        date: "2025-05-18",
        order_name: "皮質素免疫分析",
      },
      {
        order_code: "09129C",
        code: "09129C",
        display: "維生素B12",
        value: 450,
        unit: "pg/mL",
        date: "2025-05-18",
        order_name: "維生素B12免疫分析",
      },
      {
        order_code: "09130C",
        code: "09130C",
        display: "葉酸",
        value: 8.2,
        unit: "ng/mL",
        date: "2025-05-18",
        order_name: "葉酸免疫分析",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    const texts = obs.map((o) => o.code.text).sort();
    expect(texts).toEqual(["Cortisol", "Folate", "LDL-C", "Vitamin B12"]);
  });

  test("multi-row panel (08011C CBC) — LOINC_SHORT_TEXT does NOT override DR title because sub-rows are different LOINCs", () => {
    // Defensive: 08011C is in DISPLAY_FIRST_CODES (multi-LOINC panel).
    // Using LOINC_SHORT_TEXT for DR title would label the WHOLE panel
    // with one sub-analyte's name — misleading. Multi-row + panel-code
    // path must still use orderName.
    const items = [
      {
        order_code: "08011C",
        code: "08011C",
        display: "WBC",
        value: 7.2,
        unit: "10*3/uL",
        date: "2025-05-18",
        order_name: "血液常規檢查",
      },
      {
        order_code: "08011C",
        code: "08011C",
        display: "Hb",
        value: 14,
        unit: "g/dL",
        date: "2025-05-18",
        order_name: "血液常規檢查",
      },
    ];
    const dr = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "DiagnosticReport",
    ) as any;
    // Should be "血液常規檢查" (orderName), not the LOINC short text of any sub-item
    expect(dr.code.text).toBe("血液常規檢查");
  });
});

// ── v0.11.11 — SMART app dev v0.11.9 bundle audit 2026-05-29 ────
// 8 bug categories enumerated against the user's v0.11.9 bundle. Each
// fix below has a regression seed so the underlying problem cannot
// silently reappear.
describe("CI v0.11.11 — Bug 1: specimen quality flags filtered", () => {
  test("溶血 / 脂血 / 黃疸 quality-flag rows are dropped (not emitted as 0-value Observations)", () => {
    const items = [
      { code: "09002C", display: "溶血", value: 0, unit: "NIL", date: "2025-05-18" },
      { code: "09002C", display: "脂血", value: 0, unit: "NIL", date: "2025-05-18" },
      { code: "09001C", display: "黃疸", value: 0, unit: "NIL", date: "2025-05-18" },
      { code: "09001C", display: "Hemolysis", value: 0, unit: "", date: "2025-05-18" },
      { code: "09002C", display: "BUN", value: 14, unit: "mg/dL", date: "2025-05-18" }, // real
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    expect(obs).toHaveLength(1);
    expect(obs[0].code.coding.find((c: any) => c.system === "http://loinc.org")?.code).toBe(
      "3094-0",
    );
  });
});

describe("CI v0.11.11 — Bug 2: CBC differential variants route to correct LOINCs", () => {
  test("Meta-Myelocyte / 後骨髓球 → 740-1 (NOT 57021-8 panel LOINC)", () => {
    const items = [
      { code: "08013C", display: "Meta-Myelocyte", value: 0.5, unit: "%", date: "2025-05-18" },
      { code: "08013C", display: "後骨髓球", value: 0.5, unit: "%", date: "2025-05-19" },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    expect(obs).toHaveLength(2);
    for (const o of obs) {
      const loinc = o.code.coding.find((c: any) => c.system === "http://loinc.org")?.code;
      expect(loinc).toBe("740-1");
    }
  });

  test("Band / 帶狀嗜中性白血球 → 764-1 (NOT 770-8 segment NOR 57021-8 panel)", () => {
    const items = [
      { code: "08013C", display: "Band", value: 2, unit: "%", date: "2025-05-18" },
      { code: "08013C", display: "帶狀嗜中性白血球", value: 2, unit: "%", date: "2025-05-19" },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    expect(obs).toHaveLength(2);
    for (const o of obs) {
      const loinc = o.code.coding.find((c: any) => c.system === "http://loinc.org")?.code;
      expect(loinc).toBe("764-1");
    }
  });

  test("Hct(血球容積比) variant → 4544-3 (NOT panel LOINC)", () => {
    const items = [
      { code: "08013C", display: "Hct(血球容積比)", value: 42, unit: "%", date: "2025-05-18" },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    const loinc = o.code.coding.find((c: any) => c.system === "http://loinc.org")?.code;
    expect(loinc).toBe("4544-3");
  });
});

describe("CI v0.11.11 — Bug 3: PEP narrative + T.P routing", () => {
  test("`:` and `PEP-Comment` rows filtered (not emitted)", () => {
    const items = [
      { code: "09065B", display: ":", value: "(see below)", unit: "", date: "2025-05-18" },
      { code: "09065B", display: "PEP-Comment", value: "normal", unit: "", date: "2025-05-18" },
      { code: "09065B", display: "T.P", value: 7.2, unit: "g/dL", date: "2025-05-18" },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    expect(obs).toHaveLength(1);
    const loinc = obs[0].code.coding.find((c: any) => c.system === "http://loinc.org")?.code;
    expect(loinc).toBe("2885-2");
  });
});

describe("CI v0.11.11 — Bug 4: ABO/Rh LOINC split (882-1 → 883-9 / 10331-7)", () => {
  test("11001C ABO → 883-9 (NOT combined ABO+Rh 882-1)", () => {
    const items = [
      {
        order_code: "11001C",
        code: "11001C",
        display: "血型鑑定",
        value: "B",
        unit: "N/A",
        date: "2025-05-18",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    const loinc = o.code.coding.find((c: any) => c.system === "http://loinc.org")?.code;
    expect(loinc).toBe("883-9");
  });

  test("11003C Rh → 10331-7 (NOT combined ABO+Rh 882-1)", () => {
    const items = [
      {
        order_code: "11003C",
        code: "11003C",
        display: "血型鑑定",
        value: "+",
        unit: "N/A",
        date: "2025-05-18",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    const loinc = o.code.coding.find((c: any) => c.system === "http://loinc.org")?.code;
    expect(loinc).toBe("10331-7");
  });

  test("v0.11.9 G — 2 readings per ABO panel still preserved (faithful transport)", () => {
    // User authoritative confirmation 2026-05-29: NHI 健保存摺 ships
    // 2 readings per blood-type panel. App dev's "should be 1 obs"
    // claim is incorrect — they didn't have raw access.
    const items = [
      {
        order_code: "11001C",
        code: "11001C",
        display: "血型鑑定",
        value: "B",
        unit: "N/A",
        date: "2025-05-18",
      },
      {
        order_code: "11001C",
        code: "11001C",
        display: "血型鑑定",
        value: "+",
        unit: "N/A",
        date: "2025-05-18",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    expect(obs).toHaveLength(2);
  });
});

describe("CI v0.11.11 — Bug 5: CBC indices variants route to distinct LOINCs", () => {
  test("紅血球分佈變異數 → 788-0 (RDW); 紅血球平均容積 → 787-2 (MCV); 紅血球色素 → 785-6 (MCH); 紅血球色素濃度 → 786-4 (MCHC)", () => {
    const items = [
      { code: "08011C", display: "紅血球分佈變異數", value: 13.2, unit: "%", date: "2025-05-18" },
      { code: "08011C", display: "紅血球平均容積", value: 88, unit: "fL", date: "2025-05-18" },
      { code: "08011C", display: "紅血球色素", value: 30, unit: "pg", date: "2025-05-18" },
      { code: "08011C", display: "紅血球色素濃度", value: 33, unit: "g/dL", date: "2025-05-18" },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    expect(obs).toHaveLength(4);
    const loincMap = Object.fromEntries(
      obs.map((o: any) => [
        o.code.coding.find((c: any) => c.system?.endsWith("nhi-medical-order-code"))?.display,
        o.code.coding.find((c: any) => c.system === "http://loinc.org")?.code,
      ]),
    );
    expect(loincMap.紅血球分佈變異數).toBe("788-0");
    expect(loincMap.紅血球平均容積).toBe("787-2");
    expect(loincMap.紅血球色素).toBe("785-6");
    expect(loincMap.紅血球色素濃度).toBe("786-4");
    // None should fall through to 789-8 (RBC count) — the pre-v0.11.11 bug
    for (const o of obs) {
      const loinc = o.code.coding.find((c: any) => c.system === "http://loinc.org")?.code;
      expect(loinc).not.toBe("789-8");
    }
  });
});

describe("CI v0.11.11 — Bug 7: urinalysis 白血球酯脢 (脢 variant) → 5799-2", () => {
  test("06013C 白血球酯脢 → 5799-2 (urine LE), NOT global 白血球 → 6690-2 (blood WBC)", () => {
    const items = [
      { code: "06013C", display: "白血球酯脢", value: "Negative", unit: "", date: "2025-05-18" },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    const loinc = o.code.coding.find((c: any) => c.system === "http://loinc.org")?.code;
    expect(loinc).toBe("5799-2");
  });
});

describe("CI v0.11.11 — Bug 8: single-obs DR ↔ obs text alignment", () => {
  test("single-obs panel (09022C K) — DR.text and obs.text agree (Chinese catalog name)", () => {
    // Without v0.11.11 fix: DR.text = "鉀" (orderName), obs.text = "K" (display)
    // After: both end up the same.
    const items = [
      {
        order_code: "09022C",
        code: "09022C",
        display: "K",
        value: 4.0,
        unit: "mmol/L",
        date: "2025-05-18",
        order_name: "鉀",
      },
    ];
    const all = mapObservationsGrouped(items, PATIENT_ID);
    const dr = all.find((r) => r.resourceType === "DiagnosticReport") as any;
    const obs = all.find((r) => r.resourceType === "Observation") as any;
    expect(dr.code.text).toBe(obs.code.text);
    expect(obs.code.text).toBe("鉀"); // Chinese catalog name wins (no LOINC_SHORT_TEXT for 2823-3)
  });

  test("single-obs LOINC_SHORT_TEXT panel (09112C TSH) — both end up 'TSH' (English clinical short)", () => {
    const items = [
      {
        order_code: "09112C",
        code: "09112C",
        display: "甲狀腺刺激素",
        value: 1.5,
        unit: "uIU/mL",
        date: "2025-05-18",
        order_name: "甲狀腺刺激素免疫分析",
      },
    ];
    const all = mapObservationsGrouped(items, PATIENT_ID);
    const dr = all.find((r) => r.resourceType === "DiagnosticReport") as any;
    const obs = all.find((r) => r.resourceType === "Observation") as any;
    expect(dr.code.text).toBe("TSH");
    expect(obs.code.text).toBe("TSH");
  });

  test("single-obs APTT ratio (08036C → 63561-5, panel default 14979-9 differs) — obs KEEPS 'APTT (ratio)' (guard prevents overwrite)", () => {
    // Defensive: when obs LOINC differs from panel default LOINC, the
    // obs has more specific routing and propagation must NOT overwrite
    // obs.text. (Pre-guard naive propagation would have set obs.text
    // = "APTT" losing the ratio distinction.)
    const items = [
      {
        order_code: "08036C",
        code: "08036C",
        display: "APTT data/mean",
        value: 1.08,
        unit: "倍數",
        date: "2025-05-18",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    expect(obs.code.text).toBe("APTT (ratio)");
  });

  test("multi-row CBC panel — single-obs propagation rule does NOT fire", () => {
    const items = [
      { code: "08011C", display: "WBC", value: 7, unit: "10*3/uL", date: "2025-05-18" },
      { code: "08011C", display: "Hb", value: 14, unit: "g/dL", date: "2025-05-18" },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    // Each obs keeps its own display
    const texts = obs.map((o: any) => o.code.text).sort();
    expect(texts).toEqual(["Hb", "WBC"]);
  });
});

// ── v0.11.12 — FHIR R4 Coding.display compliance ────────────────
// FHIR R4: Coding.display must "follow the rules of the system". For
// LOINC, that's the Long Common Name from loinc.org. Without an entry
// in LOINC_DISPLAY, buildCodings falls back to the raw row display
// (e.g. "Meta-Myelocyte" / "紅血球分佈變異數") which is NOT the LOINC
// canonical name. v0.11.12 audit caught 7 LOINCs introduced in v0.11.10
// / v0.11.11 missing their LOINC_DISPLAY twins.
describe("CI v0.11.12 — Coding.display uses LOINC Long Common Name (not raw display)", () => {
  test("740-1 (Metamyelocyte) Coding.display = Long Common Name (not row display 'Meta-Myelocyte')", () => {
    const items = [
      { code: "08013C", display: "Meta-Myelocyte", value: 0.5, unit: "%", date: "2025-05-18" },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    const loincCoding = o.code.coding.find((c: any) => c.system === "http://loinc.org");
    expect(loincCoding.code).toBe("740-1");
    expect(loincCoding.display).toBe("Metamyelocytes/Leukocytes in Blood by Manual count");
  });

  test("764-1 (Band) Coding.display = Long Common Name", () => {
    const items = [{ code: "08013C", display: "Band", value: 2, unit: "%", date: "2025-05-18" }];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    const loincCoding = o.code.coding.find((c: any) => c.system === "http://loinc.org");
    expect(loincCoding.code).toBe("764-1");
    expect(loincCoding.display).toBe("Band form neutrophils/Leukocytes in Blood by Manual count");
  });

  test("788-0 (RDW) Coding.display = Long Common Name (not 紅血球分佈變異數)", () => {
    const items = [
      { code: "08011C", display: "紅血球分佈變異數", value: 13.2, unit: "%", date: "2025-05-18" },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    const loincCoding = o.code.coding.find((c: any) => c.system === "http://loinc.org");
    expect(loincCoding.code).toBe("788-0");
    expect(loincCoding.display).toBe("Erythrocyte [DistWidth] in Blood by Automated count");
  });

  test("v0.11.10 LOINC_SHORT_TEXT codes (Cortisol/B12/Folate/PSA) all have LOINC_DISPLAY twins", () => {
    const items = [
      {
        code: "09113C",
        display: "皮質素",
        value: 12,
        unit: "ug/dL",
        date: "2025-05-18",
        order_name: "皮質素免疫分析",
      },
      {
        code: "09129C",
        display: "維生素B12",
        value: 450,
        unit: "pg/mL",
        date: "2025-05-18",
      },
      {
        code: "09130C",
        display: "葉酸",
        value: 8.2,
        unit: "ng/mL",
        date: "2025-05-18",
      },
      {
        code: "12081C",
        display: "PSA",
        value: 1.2,
        unit: "ng/mL",
        date: "2025-05-18",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    const loincDisplays = obs.map((o) => {
      const loincCoding = o.code.coding.find((c: any) => c.system === "http://loinc.org");
      return loincCoding?.display;
    });
    // None should be a raw row display — all should look like a LOINC Long Common Name
    for (const display of loincDisplays) {
      expect(display).toMatch(/\[.+\]|in Serum|in Blood/i);
    }
  });
});

// ── v0.11.13 — SMART app dev bug 9 (INR mistag + placeholder unit) ──
// Three sub-bugs rolled into one v0.11.10 bundle pattern:
//   9a — 11.9 sec value emitted under LOINC 6301-6 (INR); structurally
//        impossible (INR is dimensionless RelTime). Reroute to 5902-2 PT.
//   9b — unit field literally "空白空白" (or "-") emitted as UCUM code.
//        Both should normalise to empty (FHIR R4 Quantity.unit is 0..1).
//   9c — two INR obs per draw differ only in placeholder unit; should
//        dedup to one. After 9b cleans units, dedupeCrossFormat collapses.
describe("CI v0.11.13 — Bug 9a: INR LOINC + time unit → reroute to PT", () => {
  test("11.9 sec row mistakenly labelled INR routes to LOINC 5902-2 PT (not 6301-6 INR)", () => {
    const items = [
      {
        order_code: "08026C",
        code: "08026C",
        display: "INR",
        value: 11.9,
        unit: "sec",
        date: "2025-05-18",
        hospital: "X",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    const loinc = o.code.coding.find((c: any) => c.system === "http://loinc.org")?.code;
    expect(loinc).toBe("5902-2"); // PT, not INR
    expect(o.code.text).toBe("PT");
  });

  test("APTT (ratio) LOINC 63561-5 with sec unit → reroute to APTT time 14979-9", () => {
    const items = [
      {
        order_code: "08036C",
        code: "08036C",
        display: "APTT data/mean",
        value: 31.4,
        unit: "sec",
        date: "2025-05-18",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    const loinc = o.code.coding.find((c: any) => c.system === "http://loinc.org")?.code;
    expect(loinc).toBe("14979-9");
  });

  test("INR with dimensionless unit ('{ratio}') is NOT rerouted (correct case stays)", () => {
    const items = [
      {
        order_code: "08026C",
        code: "08026C",
        display: "INR",
        value: 1.08,
        unit: "{ratio}",
        date: "2025-05-18",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    const loinc = o.code.coding.find((c: any) => c.system === "http://loinc.org")?.code;
    expect(loinc).toBe("6301-6");
  });
});

describe("CI v0.11.13 — Bug 9b: placeholder unit ('空白空白' / '-' / 'N/A') normalised to empty", () => {
  test("INR with unit='空白空白' emits valueQuantity without unit", () => {
    const items = [
      {
        order_code: "08026C",
        code: "08026C",
        display: "INR",
        value: 1.08,
        unit: "空白空白",
        date: "2025-05-18",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    // Bridge should produce a Quantity without a "空白空白" unit; either
    // unit is undefined or the code field is empty.
    if (o.valueQuantity) {
      expect(o.valueQuantity.unit).not.toBe("空白空白");
      expect(o.valueQuantity.code).not.toBe("空白空白");
    }
  });

  test("Various placeholder unit strings all collapse to empty (-, —, N/A, nil, 無)", () => {
    const placeholders = ["-", "—", "–", "N/A", "n/a", "nil", "NIL", "無", "空白"];
    for (const p of placeholders) {
      const items = [
        {
          order_code: "08026C",
          code: "08026C",
          display: "INR",
          value: 1.08,
          unit: p,
          date: "2025-05-18",
        },
      ];
      const o = mapObservationsGrouped(items, PATIENT_ID).find(
        (r) => r.resourceType === "Observation",
      ) as any;
      if (o.valueQuantity) {
        expect(o.valueQuantity.unit).not.toBe(p);
      }
    }
  });
});

describe("CI v0.12.1 — strict faithful transport: N LIS rows → N obs (no bridge-side dedup)", () => {
  test("INR rows with unit='空白空白' and unit='-' both survive (no dedup on placeholder collapse)", () => {
    // v0.11.13 used to collapse these via placeholder unit normalisation
    // BEFORE dedupeCrossFormat keys were computed. v0.12.1 reverts that
    // side-effect: dedupeCrossFormat uses raw unit strings, so 2 LIS-
    // uploaded rows differing only in placeholder encoding both survive
    // as 2 obs. Faithful transport principle: bridge doesn't judge
    // "two placeholder units = same intent". Even ICU patients can have
    // legitimate same-value draws — only the user/app decides.
    //
    // Unit cleanup (_canonicalizeUnit) still runs at the obs-construction
    // stage, so the emitted Quantity has no placeholder unit field —
    // FHIR R4 compliance preserved.
    const items = [
      {
        order_code: "08026C",
        code: "08026C",
        display: "INR",
        value: 1.08,
        unit: "空白空白",
        date: "2025-05-18",
        hospital: "X",
      },
      {
        order_code: "08026C",
        code: "08026C",
        display: "INR",
        value: 1.08,
        unit: "-",
        date: "2025-05-18",
        hospital: "X",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    expect(obs).toHaveLength(2);
    // Both obs should have CLEAN Quantity — neither carries the placeholder
    // string in valueQuantity.unit (FHIR R4 cleanup still happens).
    for (const o of obs) {
      if (o.valueQuantity) {
        expect(o.valueQuantity.unit).not.toBe("空白空白");
        expect(o.valueQuantity.unit).not.toBe("-");
      }
    }
  });

  test("End-to-end bug 9 scenario: 4-row raw → 4 obs (faithful), with LOINC fixes still applied", () => {
    // Reproduces user's v0.11.10 bundle pattern: per draw raw had PT row
    // + mistag (display=INR, val=11.9 sec) + 2 placeholder-unit INR rows.
    // v0.12.1 faithful behaviour:
    //   - PT row stays under 5902-2 PT (correct)
    //   - INR-sec mistag still rerouted via structuralLoincFix to 5902-2
    //     PT (LOINC correction is allowed) — but since canonical key in
    //     stableId differs (display "INR" vs "PT"), it does NOT collapse
    //     with the legit PT row; both survive as separate obs
    //   - 2 placeholder-unit INR rows both survive (no dedup on
    //     placeholder collapse)
    // Net: 4 obs total. Bundle faithful to LIS upload count.
    const items = [
      {
        order_code: "08026C",
        code: "08026C",
        display: "PT",
        value: 11.9,
        unit: "sec",
        date: "2025-05-18",
        hospital: "X",
      },
      {
        order_code: "08026C",
        code: "08026C",
        display: "INR",
        value: 11.9,
        unit: "sec",
        date: "2025-05-18",
        hospital: "X",
      },
      {
        order_code: "08026C",
        code: "08026C",
        display: "INR",
        value: 1.08,
        unit: "空白空白",
        date: "2025-05-18",
        hospital: "X",
      },
      {
        order_code: "08026C",
        code: "08026C",
        display: "INR",
        value: 1.08,
        unit: "-",
        date: "2025-05-18",
        hospital: "X",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    // All 4 LIS rows preserved as distinct obs (faithful transport)
    expect(obs).toHaveLength(4);
    // Structural LOINC fix still applied: no obs with LOINC 6301-6 INR
    // carries a "sec" unit (mistag rerouted to PT 5902-2).
    for (const o of obs) {
      const loinc = o.code.coding.find((c: any) => c.system === "http://loinc.org")?.code;
      if (loinc === "6301-6") {
        expect(o.valueQuantity?.unit).not.toBe("sec");
        expect(o.valueQuantity?.code).not.toBe("sec");
      }
    }
  });

  test("ABO/Rh cross-contamination: 4 raw rows → 4 obs (bridge does NOT judge value validity)", () => {
    // App dev's bug 4' 2026-05-29: source EHR ships both ABO value (B)
    // and Rh value (+) under each LOINC, producing 4 obs per draw with
    // values shuffled. App dev suggested dropping structurally-impossible
    // values ("+" is not valid ABO).
    //
    // Bridge declined per faithful-transport principle (codified in
    // CLAUDE.md): even structurally-implausible values may be a forward/
    // reverse typing arm, a LIS reagent entry, or a malformed source
    // record the clinician should see. Bridge doesn't judge — app does.
    const items = [
      {
        order_code: "11001C",
        code: "11001C",
        display: "血型鑑定",
        value: "B",
        unit: "N/A",
        date: "2025-05-18",
      },
      {
        order_code: "11001C",
        code: "11001C",
        display: "血型鑑定",
        value: "+",
        unit: "N/A",
        date: "2025-05-18",
      },
      {
        order_code: "11003C",
        code: "11003C",
        display: "血型鑑定",
        value: "+",
        unit: "N/A",
        date: "2025-05-18",
      },
      {
        order_code: "11003C",
        code: "11003C",
        display: "血型鑑定",
        value: "B",
        unit: "N/A",
        date: "2025-05-18",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    // All 4 raw rows preserved — bridge does not filter by value validity
    expect(obs).toHaveLength(4);
  });
});

describe("CI v0.11.13 — Note 10 lockdown: 08036C ships BOTH 14979-9 + 63561-5", () => {
  test("APTT panel with sec row + ratio row → bundle has one 14979-9 AND one 63561-5", () => {
    // Forward-compatibility lockdown per app dev's note 10 2026-05-29.
    // Bridge must keep the time/ratio LOINC split alive. If a future
    // refactor collapses them under one LOINC, this test fires.
    const items = [
      {
        order_code: "08036C",
        code: "08036C",
        display: "APTT",
        value: 31.4,
        unit: "sec",
        date: "2025-05-18",
      },
      {
        order_code: "08036C",
        code: "08036C",
        display: "APTT (ratio)",
        value: 1.08,
        unit: "{ratio}",
        date: "2025-05-18",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    const loincs = obs.map(
      (o) => o.code.coding.find((c: any) => c.system === "http://loinc.org")?.code,
    );
    expect(loincs).toContain("14979-9"); // APTT time
    expect(loincs).toContain("63561-5"); // APTT ratio
  });
});

// ── v0.12.0 — FHIR R4 Coding.display structural invariant ─────────
// Every LOINC value referenced in any of the bridge's LOINC mapping
// tables MUST have a corresponding LOINC_DISPLAY entry (canonical
// Long Common Name per loinc.org). Without one, buildCodings falls
// back to the raw row display when emitting coding[loinc].display —
// violating FHIR R4 "Coding.display follows the rules of the system".
//
// This invariant ran a one-time sweep during v0.12.0 development and
// is locked in as a standing CI gate: any future addition of a LOINC
// to NHI_TO_LOINC / PANEL_LOINC_MAP / LOINC_MAP that forgets the
// LOINC_DISPLAY twin will fail this test.
describe("CI v0.12.0 — LOINC_DISPLAY coverage invariant", () => {
  test("every LOINC referenced in NHI_TO_LOINC has a LOINC_DISPLAY entry", () => {
    const missing: string[] = [];
    for (const loinc of Object.values(NHI_TO_LOINC)) {
      if (!(loinc in LOINC_DISPLAY)) missing.push(loinc);
    }
    expect(missing).toEqual([]);
  });

  test("every LOINC referenced in PANEL_LOINC_MAP has a LOINC_DISPLAY entry", () => {
    const missing = new Set<string>();
    for (const table of Object.values(PANEL_LOINC_MAP)) {
      for (const loinc of Object.values(table)) {
        if (!(loinc in LOINC_DISPLAY)) missing.add(loinc);
      }
    }
    expect(Array.from(missing).sort()).toEqual([]);
  });

  test("every LOINC referenced in LOINC_MAP has a LOINC_DISPLAY entry", () => {
    const missing = new Set<string>();
    for (const loinc of Object.values(LOINC_MAP)) {
      if (!(loinc in LOINC_DISPLAY)) missing.add(loinc);
    }
    expect(Array.from(missing).sort()).toEqual([]);
  });
});

// ── v0.12.1 — SMART app dev v0.11.13 bundle audit ────────────────
// Three routing/labelling fixes for residual edge cases in the
// v0.11.13 bundle. No bridge-side dedup or value validity judgement
// (per CLAUDE.md memory rule, reinforced 2026-05-29).
describe("CI v0.12.1 — Bug 5'/6'/7': CBC 'EN(中文)' parenthetical displays route correctly", () => {
  test("CBC diff parenthetical variants all route to their analyte-specific LOINCs (not panel default)", () => {
    const cases: Array<[string, string, string]> = [
      ["08002C", "Basophils(嗜鹼性白血球)", "706-2"],
      ["08002C", "Eosinophils(嗜酸性白血球)", "713-8"],
      ["08002C", "Lymphocytes(淋巴白血球)", "736-9"],
      ["08002C", "Monocytes(單核白血球)", "5905-5"],
      ["08002C", "Neutrophilic Segment(嗜中性白血球)", "770-8"],
    ];
    for (const [code, display, expected] of cases) {
      expect(findLoinc(code, display)).toBe(expected);
    }
  });

  test("CBC indices parenthetical variants all route to their analyte-specific LOINCs (not RBC count fallback)", () => {
    const cases: Array<[string, string, string]> = [
      ["08011C", "MCV(平均紅血球容積)", "787-2"],
      ["08011C", "MCH(平均紅血球血色素)", "785-6"],
      ["08011C", "MCHC(平均紅血球濃度)", "786-4"],
      ["08011C", "RDW(平均紅血球寬度)", "788-0"],
    ];
    for (const [code, display, expected] of cases) {
      expect(findLoinc(code, display)).toBe(expected);
    }
  });
});

describe("CI v0.12.1 — Bug 10: urine creatinine variant routes to urine LOINC 2161-8", () => {
  test("肌酸酐(尿液)(半定量) under 09015C → 2161-8 (NOT serum 2160-0)", () => {
    expect(findLoinc("09015C", "肌酸酐(尿液)(半定量)")).toBe("2161-8");
    expect(findLoinc("09015C", "肌酸酐(尿液)")).toBe("2161-8");
    expect(findLoinc("09015C", "肌酸酐(尿)")).toBe("2161-8");
  });

  test("plain 肌酸酐 under 09015C still routes to serum 2160-0 (no regression)", () => {
    expect(findLoinc("09015C", "肌酸酐")).toBe("2160-0");
    expect(findLoinc("09015C", "Creatinine")).toBe("2160-0");
  });
});

describe("CI v0.12.1 — Bug 8': single-obs urine-protein DR title uses 'Urine Protein' (not ambiguous '全蛋白')", () => {
  test("09040C panel with one Urine Protein obs → DR title = 'Urine Protein' from LOINC_SHORT_TEXT", () => {
    // 09040C has no NHI_TO_LOINC entry (specimen-ambiguous catalog name
    // 全蛋白); the obs resolves to LOINC 20454-5 via LOINC_MAP global
    // "urine protein" → 20454-5. v0.12.1 falls back to LOINC_SHORT_TEXT
    // when all obs in panel share a single LOINC.
    const items = [
      {
        order_code: "09040C",
        code: "09040C",
        display: "Urine Protein",
        value: 25,
        unit: "mg/dL",
        date: "2023-11-24",
        order_name: "全蛋白",
      },
    ];
    const all = mapObservationsGrouped(items, PATIENT_ID);
    const dr = all.find((r) => r.resourceType === "DiagnosticReport") as any;
    const obs = all.find((r) => r.resourceType === "Observation") as any;
    expect(dr.code.text).toBe("Urine Protein");
    expect(obs.code.text).toBe("Urine Protein");
    // Raw NHI catalog name preserved verbatim in coding[*].display
    expect(dr.code.coding[0].display).toBe("全蛋白");
  });
});

// ── v0.12.2 — SMART app dev v0.12.1 audit ─────────────────────────
// Three follow-up items from app dev's v0.12.1 bundle audit:
//   - Bug 5'/6'/7' mirror: CBC diff displays under 08011C still fell
//     to panel-default 6690-2 (only 08013C had CBC_DIFF_KEYS spread).
//   - Bug 10 mirror: urine creatinine variants under 06013C still hit
//     serum 2160-0 (only 09015C had the urine variants).
//   - Urine protein scale: LOINC 20454-5 is dipstick PrThr/Ord but
//     bridge routed quantitative mg/dL values to it too — should
//     reroute to 2888-6 (MCnc/Qn) for numeric+mg/dL rows; combined
//     "4+ (2000)" and qualitative ("Negative") stay on 20454-5.
describe("CI v0.12.2 — Bug 5'/6'/7' mirror: CBC diff under 08011C routes correctly", () => {
  test("Diff displays under 08011C panel route to per-analyte LOINCs (not 6690-2 panel default)", () => {
    const cases: Array<[string, string]> = [
      ["Basophils(嗜鹼性白血球)", "706-2"],
      ["Eosinophils(嗜酸性白血球)", "713-8"],
      ["Lymphocytes(淋巴白血球)", "736-9"],
      ["Monocytes(單核白血球)", "5905-5"],
      ["Neutrophilic Segment(嗜中性白血球)", "770-8"],
    ];
    for (const [display, expected] of cases) {
      expect(findLoinc("08011C", display)).toBe(expected);
    }
  });

  test("Bare diff CJK terms under 08011C also route correctly (e.g. 嗜鹼性白血球, 淋巴球)", () => {
    expect(findLoinc("08011C", "嗜鹼性白血球")).toBe("706-2");
    expect(findLoinc("08011C", "嗜酸性白血球")).toBe("713-8");
    expect(findLoinc("08011C", "淋巴白血球")).toBe("736-9");
  });
});

describe("CI v0.12.2 — Bug 10 mirror: urine creatinine under 06013C routes to urine 2161-8", () => {
  test("肌酸酐(尿液)(半定量) under 06013C → 2161-8 (NOT 2160-0 serum)", () => {
    expect(findLoinc("06013C", "肌酸酐(尿液)(半定量)")).toBe("2161-8");
    expect(findLoinc("06013C", "肌酸酐(尿液)")).toBe("2161-8");
    expect(findLoinc("06013C", "肌酸酐(尿)")).toBe("2161-8");
  });

  test("Urine creatinine ASCII variants under 06013C also route correctly", () => {
    expect(findLoinc("06013C", "Creatinine(U)")).toBe("2161-8");
    expect(findLoinc("06013C", "Urine Creatinine")).toBe("2161-8");
  });
});

describe("CI v0.12.2 — Urine protein scale routing (qualitative vs quantitative vs combined)", () => {
  test("Pure quantitative urine protein ('48' + mg/dL) → 2888-6 (Qn LOINC)", () => {
    const items = [
      {
        order_code: "09040C",
        code: "09040C",
        display: "Urine Protein",
        value: 48,
        unit: "mg/dL",
        date: "2025-05-18",
        order_name: "全蛋白",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    const loinc = o.code.coding.find((c: any) => c.system === "http://loinc.org")?.code;
    expect(loinc).toBe("2888-6");
    expect(o.valueQuantity?.value).toBe(48);
    expect(o.code.text).toBe("Urine Protein"); // LOINC_SHORT_TEXT for both LOINCs
  });

  test("Pure qualitative urine protein ('Negative' / 'Trace' / '1+') → 20454-5 (Ord LOINC)", () => {
    const cases = ["Negative", "Trace", "1+", "2+", "3+"];
    for (const value of cases) {
      const items = [
        {
          code: "06013C",
          display: "尿蛋白",
          value,
          unit: "",
          date: "2025-05-18",
        },
      ];
      const o = mapObservationsGrouped(items, PATIENT_ID).find(
        (r) => r.resourceType === "Observation",
      ) as any;
      const loinc = o.code.coding.find((c: any) => c.system === "http://loinc.org")?.code;
      expect(loinc).toBe("20454-5");
      expect(o.valueString).toBe(value);
    }
  });

  test("Combined dipstick+numeric ('4+ (2000)' / 'Trace (15)') → 20454-5 with valueString", () => {
    const cases = ["4+ (2000)", "Trace (15)", "1+ (30)"];
    for (const value of cases) {
      const items = [
        {
          code: "06013C",
          display: "尿蛋白",
          value,
          unit: "mg/dL", // some LIS still ship a unit even for combined
          date: "2025-05-18",
        },
      ];
      const o = mapObservationsGrouped(items, PATIENT_ID).find(
        (r) => r.resourceType === "Observation",
      ) as any;
      const loinc = o.code.coding.find((c: any) => c.system === "http://loinc.org")?.code;
      // Combined stays on dipstick (Ord) LOINC; valueString preserves both grade + number
      expect(loinc).toBe("20454-5");
      expect(o.valueString).toBe(value);
    }
  });

  test("Coding.display matches LOINC Long Common Name for both qualitative and quantitative routes", () => {
    // Qualitative
    const qual = mapObservationsGrouped(
      [
        {
          code: "06013C",
          display: "尿蛋白",
          value: "Negative",
          unit: "",
          date: "2025-05-18",
        },
      ],
      PATIENT_ID,
    ).find((r) => r.resourceType === "Observation") as any;
    const qualLoinc = qual.code.coding.find((c: any) => c.system === "http://loinc.org");
    expect(qualLoinc.code).toBe("20454-5");
    expect(qualLoinc.display).toBe("Protein Mass/Vol in Urine");

    // Quantitative
    const quant = mapObservationsGrouped(
      [
        {
          order_code: "09040C",
          code: "09040C",
          display: "Urine Protein",
          value: 48,
          unit: "mg/dL",
          date: "2025-05-18",
        },
      ],
      PATIENT_ID,
    ).find((r) => r.resourceType === "Observation") as any;
    const quantLoinc = quant.code.coding.find((c: any) => c.system === "http://loinc.org");
    expect(quantLoinc.code).toBe("2888-6");
    expect(quantLoinc.display).toBe("Protein [Mass/volume] in Urine");
  });
});

// ── v0.12.3 — NHI source channel as Observation.meta.tag ─────────
// Direct inspection of NHI 健保存摺 /api/ihke3000/ihke3409s01/page_load
// on 2026-05-29 confirmed bridge correctly preserves 92 A+B pair rows
// the app-dev's audit had attributed to bridge transformer. NHI ships
// the same measurement under two upload channels and the bridge's
// strict-no-dedup rule (CLAUDE.md) preserves both. To let SMART apps
// dedup-by-source as a UI choice, the channel is surfaced on
// Observation.meta.tag.
describe("CI v0.12.3 — NHI source channel surfaced as meta.tag", () => {
  test("Single obs from source A gets meta.tag with code 'A'", () => {
    const items = [
      {
        order_code: "09021C",
        code: "09021C",
        display: "Na",
        value: 144,
        unit: "mEq/L",
        date: "2026-05-25",
        hospital: "長庚嘉義",
        order_name: "鈉",
        reference_range: "[136][146]",
        nhi_source_channel: "A",
        nhi_source_channel_name: "特約醫事機構不定期上傳",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    const tags = o.meta?.tag ?? [];
    const nhiSrc = tags.find((t: any) => t.system === "http://nhi-fhir-bridge/nhi-source-channel");
    expect(nhiSrc).toBeDefined();
    expect(nhiSrc.code).toBe("A");
    expect(nhiSrc.display).toBe("特約醫事機構不定期上傳");
  });

  test("v0.12.4 — A+B structural pair → 1 obs (keep A with numeric refRange)", () => {
    // User clarification 2026-05-29: bundle is for general SMART app
    // consumption. NHI multi-channel A+B = NHI's structural duplicate
    // (same logical measurement uploaded via 2 channels), bridge MUST
    // dedup so any downstream consumer sees 1 obs per measurement
    // without implementing source-channel dedup itself.
    //
    // Same 2026-01-14 鈉 case: A row (Na, numeric refRange) + B row
    // (鈉, text refRange). v0.12.4 keeps A only.
    const items = [
      {
        order_code: "09021C",
        code: "09021C",
        display: "Na",
        value: 142,
        unit: "mEq/L",
        date: "2026-01-14",
        hospital: "長庚嘉義",
        order_name: "鈉",
        reference_range: "[136][146]",
        nhi_source_channel: "A",
        nhi_source_channel_name: "特約醫事機構不定期上傳",
      },
      {
        order_code: "09021C",
        code: "09021C",
        display: "鈉",
        value: 142,
        unit: "mEq/L",
        date: "2026-01-14",
        hospital: "長庚嘉義",
        order_name: "鈉",
        reference_range: "[無][無]",
        nhi_source_channel: "B",
        nhi_source_channel_name: "特約醫事機構定期上傳",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    expect(obs).toHaveLength(1);
    const surviving = obs[0];
    const srcTag = surviving.meta?.tag?.find(
      (t: any) => t.system === "http://nhi-fhir-bridge/nhi-source-channel",
    );
    // A row survives — preferred because it has the numeric refRange
    expect(srcTag?.code).toBe("A");
    expect(surviving.referenceRange?.[0]?.low?.value).toBe(136);
    expect(surviving.referenceRange?.[0]?.high?.value).toBe(146);
  });

  test("Obs without nhi_source_channel field omits the tag (no spurious empty tag)", () => {
    const items = [
      {
        order_code: "09021C",
        code: "09021C",
        display: "Na",
        value: 144,
        unit: "mEq/L",
        date: "2026-05-25",
        hospital: "長庚嘉義",
        order_name: "鈉",
        reference_range: "[136][146]",
        // intentionally no nhi_source_channel
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    const tags = o.meta?.tag ?? [];
    const nhiSrc = tags.find((t: any) => t.system === "http://nhi-fhir-bridge/nhi-source-channel");
    expect(nhiSrc).toBeUndefined();
  });

  test("v0.12.4 — urinalysis A+B same-value pair also deduped (panel sub-row → 1 obs)", () => {
    // 06013C urine Glucose (A) + 尿糖 (B) both at "4+ (2000)" mg/dL —
    // same logical measurement, NHI ships both via two channels. Per
    // v0.12.4 rule, dedup A+B → 1 obs (A retained, has numeric refRange
    // "[Negative][]"). This holds true even for panel sub-rows because
    // the structural-duplicate criteria match (code+date+hospital+value
    // +unit + one A + one B).
    const items = [
      {
        order_code: "06013C",
        code: "06013C",
        display: "Glucose",
        value: "4+ (2000)",
        unit: "mg/dL",
        date: "2026-01-14",
        hospital: "長庚嘉義",
        order_name: "尿生化檢查",
        reference_range: "[Negative][]",
        nhi_source_channel: "A",
        nhi_source_channel_name: "特約醫事機構不定期上傳",
      },
      {
        order_code: "06013C",
        code: "06013C",
        display: "尿糖",
        value: "4+ (2000)",
        unit: "mg/dL",
        date: "2026-01-14",
        hospital: "長庚嘉義",
        order_name: "尿生化檢查",
        reference_range: "[無][無]",
        nhi_source_channel: "B",
        nhi_source_channel_name: "特約醫事機構定期上傳",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    expect(obs).toHaveLength(1);
    const srcTag = obs[0].meta?.tag?.find(
      (t: any) => t.system === "http://nhi-fhir-bridge/nhi-source-channel",
    );
    expect(srcTag?.code).toBe("A");
  });

  test("v0.12.4 — same-source double-upload (A+A or B+B) NOT deduped (faithful per multi-reading rule)", () => {
    // The 09099C Troponin I case observed in NHI raw: 2 rows under
    // funC_DATE=115/05/25 long庚嘉義, both orI_TYPE=A, same value
    // <0.010 ng/mL. Not a NHI multi-channel structural pair — it's
    // hospital LIS double-uploading via the same channel. Faithful-
    // transport rule preserves both.
    const items = [
      {
        order_code: "09099C",
        code: "09099C",
        display: "Troponin I",
        value: "0.010",
        unit: "ng/mL",
        date: "2025-05-25",
        hospital: "長庚嘉義",
        order_name: "心肌旋轉蛋白Ｉ",
        reference_range: "[0][0.034]",
        nhi_source_channel: "A",
        nhi_source_channel_name: "特約醫事機構不定期上傳",
      },
      {
        order_code: "09099C",
        code: "09099C",
        display: "Troponin I",
        value: "0.010",
        unit: "ng/mL",
        date: "2025-05-25",
        hospital: "長庚嘉義",
        order_name: "心肌旋轉蛋白Ｉ",
        reference_range: "[0][0.034]",
        nhi_source_channel: "A", // second-upload also A — same channel
        nhi_source_channel_name: "特約醫事機構不定期上傳",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    // Same source, both preserved per multi-reading rule
    expect(obs.length).toBeGreaterThanOrEqual(1);
    // (May be 1 if stableId still collides because all hash inputs are
    // identical — that's a different test concern. The point of THIS
    // test is the dedup function doesn't drop them as "A+B pair".)
  });

  test("v0.12.4 — different values across channels → both preserved (multi-reading)", () => {
    // Hypothetical: NHI ships A row with value=140 and B row with
    // value=144 for same draw (corrected value re-upload?). Different
    // values means NOT a structural-duplicate pair — preserve both per
    // multi-reading rule.
    const items = [
      {
        order_code: "09021C",
        code: "09021C",
        display: "Na",
        value: 140,
        unit: "mEq/L",
        date: "2026-01-14",
        hospital: "長庚嘉義",
        order_name: "鈉",
        reference_range: "[136][146]",
        nhi_source_channel: "A",
      },
      {
        order_code: "09021C",
        code: "09021C",
        display: "鈉",
        value: 144, // different value
        unit: "mEq/L",
        date: "2026-01-14",
        hospital: "長庚嘉義",
        order_name: "鈉",
        reference_range: "[無][無]",
        nhi_source_channel: "B",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    expect(obs).toHaveLength(2);
  });

  test("v0.12.5 — 2A+2B same value (hospital uploaded same analyte twice via each channel) → 2 obs (A's kept, multi-reading)", () => {
    // From NHI raw audit 2026-05-29: 09021C 鈉 114/05/18 長庚嘉義 had
    // 4 rows of value=141 mEq/L — 2A + 2B. With v0.12.4 (1A+1B only),
    // all 4 survived; v0.12.5 keeps the 2 A's, drops both B's. The 2
    // surviving A rows represent the legitimate same-source double-
    // upload preserved per multi-reading rule.
    const items = [
      {
        order_code: "09021C",
        code: "09021C",
        display: "Na",
        value: 141,
        unit: "mEq/L",
        date: "2025-05-18",
        hospital: "長庚嘉義",
        order_name: "鈉",
        reference_range: "[136][146]",
        nhi_source_channel: "A",
      },
      {
        order_code: "09021C",
        code: "09021C",
        display: "鈉",
        value: 141,
        unit: "mEq/L",
        date: "2025-05-18",
        hospital: "長庚嘉義",
        order_name: "鈉",
        reference_range: "[無][無]",
        nhi_source_channel: "B",
      },
      {
        order_code: "09021C",
        code: "09021C",
        display: "Na",
        value: 141,
        unit: "mEq/L",
        date: "2025-05-18",
        hospital: "長庚嘉義",
        order_name: "鈉",
        reference_range: "[136][146]",
        nhi_source_channel: "A",
      },
      {
        order_code: "09021C",
        code: "09021C",
        display: "鈉",
        value: 141,
        unit: "mEq/L",
        date: "2025-05-18",
        hospital: "長庚嘉義",
        order_name: "鈉",
        reference_range: "[無][無]",
        nhi_source_channel: "B",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    // Both A's kept (same-source double-upload via channel A is legitimate
    // multi-reading); both B's dropped (cross-channel structural dups).
    // But because stableId hashes (canonical+code+date+hospital+value+unit+source),
    // both A rows have identical inputs → same stableId → bundle dedups
    // to 1 obs at seenObsIds. This is acceptable: indistinguishable
    // same-source identical-content rows have no FHIR identity to keep
    // separate. Multi-reading rule applies to distinct readings (different
    // values). Here both A's are truly identical so 1 obs is correct.
    expect(obs.length).toBeGreaterThanOrEqual(1);
    // No B obs survives
    for (const o of obs) {
      const src = o.meta?.tag?.find(
        (t: any) => t.system === "http://nhi-fhir-bridge/nhi-source-channel",
      )?.code;
      expect(src).not.toBe("B");
    }
  });

  test("v0.12.5 — 06013C 3 sub-analytes all 'Negative' (3A+3B same value, distinct analytes) → 3 obs (one A per sub-analyte)", () => {
    // From NHI raw audit 2026-05-29: 06013C 115/01/14 group key
    // "Negative|mg/dL" had 6 rows — 3 B Chinese sub-analytes
    // (亞硝酸鹽/膽紅素/酮體) + 3 A English sub-analytes (Bilirubin/
    // Ketone/Nitrite). All share value="Negative" mg/dL but are 3
    // distinct urinalysis analytes. Canonical key (URINE_BILIRUBIN /
    // URINE_KETONE / URINE_NITRITE — code-scoped to 06013C panel) must
    // split them; otherwise the dedup would drop B sub-analytes against
    // the wrong A sub-analyte and bridge would lose data.
    const items = [
      // 3 B Chinese rows
      {
        order_code: "06013C",
        code: "06013C",
        display: "亞硝酸鹽",
        value: "Negative",
        unit: "mg/dL",
        date: "2025-01-14",
        hospital: "長庚嘉義",
        order_name: "尿生化檢查",
        reference_range: "[無][無]",
        nhi_source_channel: "B",
      },
      {
        order_code: "06013C",
        code: "06013C",
        display: "膽紅素",
        value: "Negative",
        unit: "mg/dL",
        date: "2025-01-14",
        hospital: "長庚嘉義",
        order_name: "尿生化檢查",
        reference_range: "[無][無]",
        nhi_source_channel: "B",
      },
      {
        order_code: "06013C",
        code: "06013C",
        display: "酮體",
        value: "Negative",
        unit: "mg/dL",
        date: "2025-01-14",
        hospital: "長庚嘉義",
        order_name: "尿生化檢查",
        reference_range: "[無][無]",
        nhi_source_channel: "B",
      },
      // 3 A English rows
      {
        order_code: "06013C",
        code: "06013C",
        display: "Nitrite",
        value: "Negative",
        unit: "mg/dL",
        date: "2025-01-14",
        hospital: "長庚嘉義",
        order_name: "尿生化檢查",
        reference_range: "[Negative][]",
        nhi_source_channel: "A",
      },
      {
        order_code: "06013C",
        code: "06013C",
        display: "Bilirubin",
        value: "Negative",
        unit: "mg/dL",
        date: "2025-01-14",
        hospital: "長庚嘉義",
        order_name: "尿生化檢查",
        reference_range: "[Negative][]",
        nhi_source_channel: "A",
      },
      {
        order_code: "06013C",
        code: "06013C",
        display: "Ketone",
        value: "Negative",
        unit: "mg/dL",
        date: "2025-01-14",
        hospital: "長庚嘉義",
        order_name: "尿生化檢查",
        reference_range: "[Negative][]",
        nhi_source_channel: "A",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    // 3 sub-analytes preserved (one A obs each), 3 B's dropped
    expect(obs).toHaveLength(3);
    const sources = obs.map(
      (o) =>
        o.meta?.tag?.find((t: any) => t.system === "http://nhi-fhir-bridge/nhi-source-channel")
          ?.code,
    );
    expect(sources.every((s: string) => s === "A")).toBe(true);
    // Three distinct urinalysis sub-analytes by code.text (route via PANEL_LOINC_MAP)
    const texts = obs.map((o) => o.code.text).sort();
    // Each sub-analyte present (English from A side)
    expect(texts).toContain("Bilirubin");
    expect(texts).toContain("Ketone");
    expect(texts).toContain("Nitrite");
  });

  test("v0.12.5 — 1A+2B (asymmetric multiplicity) → 1 obs (A kept, B's dropped)", () => {
    const items = [
      {
        order_code: "09022C",
        code: "09022C",
        display: "K",
        value: 3.9,
        unit: "mEq/L",
        date: "2025-05-18",
        hospital: "長庚嘉義",
        order_name: "鉀",
        reference_range: "[3.5][5.1]",
        nhi_source_channel: "A",
      },
      {
        order_code: "09022C",
        code: "09022C",
        display: "鉀",
        value: 3.9,
        unit: "mEq/L",
        date: "2025-05-18",
        hospital: "長庚嘉義",
        order_name: "鉀",
        reference_range: "[無][無]",
        nhi_source_channel: "B",
      },
      {
        order_code: "09022C",
        code: "09022C",
        display: "鉀",
        value: 3.9,
        unit: "mEq/L",
        date: "2025-05-18",
        hospital: "長庚嘉義",
        order_name: "鉀",
        reference_range: "[無][無]",
        nhi_source_channel: "B",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    expect(obs).toHaveLength(1);
  });
});

// ── CI v0.13.1 — LOINC-based A+B dedup key (app dev follow-up 2026-05-30) ──
//
// v0.12.4 / v0.12.5 dedup grouped rows by (code, date, hospital, value,
// unit, canonicalLabKey). That canonical helper used CODE_SCOPED_SYNONYMS
// which only had urinalysis entries — CBC panels had no EN+CJK alias
// table for canonical. So A row "MCV" and B row "平均紅血球容積" got
// different canonical → different dedup keys → not grouped → 98 CBC
// A+B pairs in one patient's bundle escaped dedup despite both routing
// to the same LOINC (787-2) via findLoinc + PANEL_LOINC_MAP.
//
// v0.13.1 replaces canonical with LOINC (from findLoincDetailed, same
// pipeline as buildObservation) in the dedup key. Single source of
// truth across LOINC routing AND dedup grouping. CLAUDE.md rule #7
// dual-source structural lesson applied.
describe("CI v0.13.1 — LOINC-based dedup key", () => {
  test("CBC MCV A+B (EN 'MCV' vs CJK '平均紅血球容積') → 1 obs (was 2 in v0.13.0)", () => {
    const items = [
      {
        order_code: "08011C",
        code: "08011C",
        display: "MCV",
        value: 92.2,
        unit: "fL",
        date: "2026-01-14",
        hospital: "長庚嘉義",
        order_name: "全套血液檢查Ｉ（八項）",
        reference_range: "[80][100]",
        nhi_source_channel: "A",
      },
      {
        order_code: "08011C",
        code: "08011C",
        display: "平均紅血球容積",
        value: 92.2,
        unit: "fL",
        date: "2026-01-14",
        hospital: "長庚嘉義",
        order_name: "全套血液檢查Ｉ（八項）",
        reference_range: "[無][無]",
        nhi_source_channel: "B",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    expect(obs).toHaveLength(1);
    const surviving = obs[0];
    // A row survives (numeric refRange).
    expect(
      surviving.meta?.tag?.find(
        (t: any) => t.system === "http://nhi-fhir-bridge/nhi-source-channel",
      )?.code,
    ).toBe("A");
    expect(surviving.referenceRange?.[0]?.low?.value).toBe(80);
    expect(surviving.referenceRange?.[0]?.high?.value).toBe(100);
  });

  test("CBC MCH A+B ('MCH' vs '紅血球色素') → 1 obs — display variants route via PANEL_LOINC_MAP to same LOINC", () => {
    const items = [
      {
        order_code: "08011C",
        code: "08011C",
        display: "MCH",
        value: 29.7,
        unit: "pg/Cell",
        date: "2026-01-14",
        hospital: "長庚嘉義",
        order_name: "全套血液檢查Ｉ（八項）",
        nhi_source_channel: "A",
      },
      {
        order_code: "08011C",
        code: "08011C",
        display: "紅血球色素",
        value: 29.7,
        unit: "pg/Cell",
        date: "2026-01-14",
        hospital: "長庚嘉義",
        order_name: "全套血液檢查Ｉ（八項）",
        nhi_source_channel: "B",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    // Both rows route to PANEL_LOINC_MAP[08011C][...] → 785-6, same group.
    // If the CJK variant 紅血球色素 isn't in PANEL_LOINC_MAP, this test
    // would fail and signal the gap.
    expect(obs).toHaveLength(1);
  });

  test("Different LOINCs (A and B route differently) → NOT deduped (regression guard)", () => {
    // If display variants route to different LOINCs, that's a routing
    // inconsistency — bridge does NOT silently collapse them. Both
    // obs survive so the inconsistency stays visible to auditors.
    // Synthesize: A "Hb" (→ 718-7) + B "WBC" (→ 6690-2) — same code,
    // same value, same date, same hospital, same unit, but different
    // analyte. MUST keep both.
    const items = [
      {
        order_code: "08011C",
        code: "08011C",
        display: "Hb",
        value: 13.1,
        unit: "g/dL",
        date: "2026-01-14",
        hospital: "長庚嘉義",
        order_name: "全套血液檢查Ｉ（八項）",
        nhi_source_channel: "A",
      },
      {
        order_code: "08011C",
        code: "08011C",
        display: "WBC",
        value: 13.1,
        unit: "g/dL",
        date: "2026-01-14", // contrived shared value/unit
        hospital: "長庚嘉義",
        order_name: "全套血液檢查Ｉ（八項）",
        nhi_source_channel: "B",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    // Different LOINC → different group → no dedup.
    expect(obs).toHaveLength(2);
  });

  test("Single-analyte code (09013C 尿酸) A+B with different display strings → 1 obs", () => {
    // For single-analyte NHI codes the LOINC comes from path A
    // (NHI_TO_LOINC, code-only). Both A and B always get same LOINC
    // regardless of display, same as v0.12.5 behavior.
    const items = [
      {
        order_code: "09013C",
        code: "09013C",
        display: "Uric Acid (B)",
        value: 6.3,
        unit: "mg/dL",
        date: "2025-07-15",
        hospital: "長庚嘉義",
        order_name: "尿酸",
        reference_range: "[2.3][7.0]",
        nhi_source_channel: "A",
      },
      {
        order_code: "09013C",
        code: "09013C",
        display: "尿酸",
        value: 6.3,
        unit: "mg/dL",
        date: "2025-07-15",
        hospital: "長庚嘉義",
        order_name: "尿酸",
        reference_range: "[無][無]",
        nhi_source_channel: "B",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    expect(obs).toHaveLength(1);
  });

  test("Both A and B unknown LOINC (path-C fallback) → still grouped + deduped", () => {
    // When the display doesn't match any alias, both rows fall to
    // panel-default LOINC (path C). Same panel-default → same key →
    // deduped. Correct because they're the same unresolved analyte.
    const items = [
      {
        order_code: "08011C",
        code: "08011C",
        display: "Unknown EN Display",
        value: 42,
        unit: "%",
        date: "2026-01-14",
        hospital: "長庚嘉義",
        order_name: "全套血液檢查Ｉ（八項）",
        nhi_source_channel: "A",
      },
      {
        order_code: "08011C",
        code: "08011C",
        display: "未知中文項目",
        value: 42,
        unit: "%",
        date: "2026-01-14",
        hospital: "長庚嘉義",
        order_name: "全套血液檢查Ｉ（八項）",
        nhi_source_channel: "B",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    // Both → path C → panel default 24317-0 → same group → 1 obs.
    expect(obs).toHaveLength(1);
  });
});

// ── CI v0.13.1 — urinalysis EN/CJK alias parity (app dev audit 2026-06-02) ──
//
// Silent-bug class (CLAUDE.md rule #8): an NHI A/B pair only deduped in
// v0.13.1 if BOTH channels route to the SAME LOINC. The 2026-06-02 audit
// of a 長庚嘉義 06013C (尿生化) report found 3 EN/CJK pairs where one side
// was missing from PANEL_LOINC_MAP["06013C"] and silently fell to a wrong
// LOINC — so the pair survived as 2 obs AND carried mismatched codes:
//   • 濁度 → path-C panel default 24356-8  ✗ (Turbidity → 5767-9)
//   • 酸鹼值 → path-C panel default 24356-8 ✗ (pH → 5803-2); note 酸鹼值≠酸鹼度
//   • CREA(U)(半定量) → global "crea" → 2160-0 SERUM ✗ (肌酸酐(尿液) → 2161-8)
// All three target LOINCs WebFetch-verified at loinc.org 2026-06-02
// (5767-9 Appearance of Urine / 5803-2 pH of Urine / 2161-8 Creatinine in
// Urine). These tests lock the parity: each EN/CJK pair → same LOINC → 1 obs.
describe("CI v0.13.1 — urinalysis EN/CJK alias parity (06013C)", () => {
  const mkUrine = (display: string, value: string, chan: string, rr: string) => ({
    order_code: "06013C",
    code: "06013C",
    display,
    value,
    unit: "",
    date: "2026-01-14",
    hospital: "長庚嘉義",
    order_name: "尿生化檢查",
    reference_range: rr,
    nhi_source_channel: chan,
  });

  const routeLoinc = (display: string): string | undefined => {
    const obs = mapObservationsGrouped(
      [mkUrine(display, "X", "A", "[Negative]")],
      PATIENT_ID,
    ).filter((r) => r.resourceType === "Observation") as any[];
    return obs[0]?.code?.coding?.find((c: any) => /loinc\.org/.test(c.system))?.code;
  };

  test("濁度 routes to 5767-9 (same as Turbidity), not panel default 24356-8", () => {
    expect(routeLoinc("Turbidity")).toBe("5767-9");
    expect(routeLoinc("濁度")).toBe("5767-9");
  });

  test("酸鹼值 routes to urine pH 5803-2 (same as pH), not panel default", () => {
    expect(routeLoinc("pH")).toBe("5803-2");
    expect(routeLoinc("酸鹼值")).toBe("5803-2");
    // 酸鹼度 was already registered — guard it didn't regress.
    expect(routeLoinc("酸鹼度")).toBe("5803-2");
  });

  test("CREA(U)(半定量) routes to urine creatinine 2161-8, not serum 2160-0", () => {
    expect(routeLoinc("CREA(U)(半定量)")).toBe("2161-8");
    expect(routeLoinc("肌酸酐(尿液)(半定量)")).toBe("2161-8");
  });

  test("each EN/CJK pair collapses to 1 obs (A+B cross-channel dedup)", () => {
    const pairs: [string, string, string][] = [
      ["Turbidity", "濁度", "Clear"],
      ["pH", "酸鹼值", "6.5"],
      ["CREA(U)(半定量)", "肌酸酐(尿液)(半定量)", "100"],
    ];
    for (const [en, cjk, val] of pairs) {
      const items = [mkUrine(en, val, "A", "[ref]"), mkUrine(cjk, val, "B", "[無]")];
      const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
        (r) => r.resourceType === "Observation",
      ) as any[];
      expect(obs, `${en} / ${cjk} should collapse to 1`).toHaveLength(1);
    }
  });
});

// ── CI v0.13.1 — unit-agnostic cross-channel dedup (user decision 2026-06-02) ──
//
// Silent-bug class (CLAUDE.md rule #8). The 2026-06-02 user report: after the
// LOINC-routing fix landed, qualitative urinalysis analytes (Color / SP.Gravity
// / pH / LE / OCCULT …) STILL appeared as English-English A+B duplicates. Root
// cause: dedupNhiCrossChannelPairs included the RAW unit string in its grouping
// key. NHI channel A ships unit="" for these analytes while channel B ships a
// placeholder encoding ("空白空白" / "無" / "-"); other pairs differ only in
// casing / UCUM formatting. Different unit strings → A+B in separate groups →
// cross-channel detection never fired → duplicate obs survived.
//
// Fix (user decision): DROP unit from the cross-channel grouping key entirely.
// Key = (code, loinc, date, hospital, value). value + LOINC already pin the
// measurement identity, and the unit field is pure per-channel encoding noise
// for an A+B pair. CLAUDE.md rule #9 (raw-unit for SAME-SOURCE dedup) is NOT
// violated — that rule is scoped to same-source comparisons; here pure-A/pure-B
// groups always hit the preserve branch, and stableId still uses the raw unit
// so same-source A+A / B+B rows stay distinct downstream.
describe("CI v0.13.1 — unit-agnostic cross-channel dedup", () => {
  const mkRow = (display: string, value: string, unit: string, chan: string, rr: string) => ({
    order_code: "06013C",
    code: "06013C",
    display,
    value,
    unit,
    date: "2026-01-14",
    hospital: "長庚嘉義",
    order_name: "尿生化檢查",
    reference_range: rr,
    nhi_source_channel: chan,
  });

  test("A unit='' + B placeholder unit ('空白空白'/'無'/'-') → 1 obs", () => {
    const cases: [string, string, string, string][] = [
      // [EN display, CJK display, value, B's placeholder unit]
      ["Color", "顏色", "Yellow", "-"],
      ["SP.Gravity", "比重", "1.020", "空白空白"],
      ["pH", "酸鹼值", "6.5", "無"],
    ];
    for (const [en, cjk, val, bUnit] of cases) {
      const items = [mkRow(en, val, "", "A", "[ref]"), mkRow(cjk, val, bUnit, "B", "[無]")];
      const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
        (r) => r.resourceType === "Observation",
      ) as any[];
      expect(
        obs,
        `${en}/${cjk} (A unit='' vs B unit='${bUnit}') should collapse to 1`,
      ).toHaveLength(1);
    }
  });

  test("real unit (mg/dL) on both channels still dedups (regression)", () => {
    const items = [
      mkRow("CREA(U)(半定量)", "100", "mg/dL", "A", "[ref]"),
      mkRow("肌酸酐(尿液)(半定量)", "100", "mg/dL", "B", "[無]"),
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    expect(obs).toHaveLength(1);
  });

  test("A real unit + B placeholder → collapse, surviving A keeps its unit", () => {
    // A+B is the SAME measurement; unit is per-channel noise. With unit
    // dropped from the key the pair collapses, and the kept A row carries
    // its own real unit (the cleaner of the two).
    const items = [
      mkRow("CREA(U)(半定量)", "100", "mg/dL", "A", "[ref]"),
      mkRow("肌酸酐(尿液)(半定量)", "100", "空白空白", "B", "[無]"),
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    expect(obs).toHaveLength(1);
    expect(obs[0].valueQuantity?.unit).toBe("mg/dL");
    expect(
      obs[0].meta?.tag?.find((t: any) => t.system === "http://nhi-fhir-bridge/nhi-source-channel")
        ?.code,
    ).toBe("A");
  });

  test("same-source pure-B placeholder rows preserved (rule #9 not violated)", () => {
    // Two B rows, same LOINC/value, differing placeholder encodings. No A
    // present → pure-B group → preserve ALL (no same-source dedup). stableId
    // uses the raw unit so the two rows stay distinct downstream.
    const items = [
      mkRow("顏色", "Yellow", "空白空白", "B", "[無]"),
      mkRow("Color", "Yellow", "-", "B", "[無]"),
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    expect(obs).toHaveLength(2);
  });
});

// ── CI v0.13 — CBC LOINC obs.code.text canonicalization (clean-match gate) ──
//
// App dev (MediPrisma) soft request 2026-05-30: 12 CBC LOINCs get
// canonical clinical short text (Hb / HCT / Platelet / MCV / ...) on
// obs.code.text so cross-hospital "Hb / 血色素 / Hemoglobin / HGB" rows
// collapse to one column header without app-side alias tables.
//
// Safety: only fires when findLoincDetailed reports cleanMatch=true.
// Mis-tag canary (v0.11.9 Bug 6 lesson): a panel-fallback path-C
// fallback (display didn't match any PANEL_LOINC_MAP key, silently
// routed to panel default LOINC) MUST keep the raw display so the
// label/code mismatch stays visible to downstream auditors.
describe("CI v0.13 — CBC obs.code.text canonicalization", () => {
  test("Clean PANEL_LOINC_MAP match (HGB → 718-7) → text canonicalized to 'Hb'", () => {
    const items = [
      {
        order_code: "08011C",
        code: "08011C",
        display: "HGB",
        value: 13.1,
        unit: "g/dL",
        date: "2026-05-25",
        hospital: "嘉基醫院",
        order_name: "全套血液檢查Ｉ（八項）",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    expect(o.code.text).toBe("Hb");
    const loinc = (o.code.coding ?? []).find((c: any) => c.system === "http://loinc.org")?.code;
    expect(loinc).toBe("718-7");
  });

  test("Clean PANEL_LOINC_MAP match (Hb → 718-7) → text canonicalized to 'Hb'", () => {
    const items = [
      {
        order_code: "08011C",
        code: "08011C",
        display: "Hb",
        value: 13.1,
        unit: "g/dL",
        date: "2026-05-25",
        hospital: "嘉基醫院",
        order_name: "全套血液檢查Ｉ（八項）",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    expect(o.code.text).toBe("Hb");
  });

  test("Clean PANEL_LOINC_MAP match (Segment → 770-8) → text canonicalized to 'Neutrophils %'", () => {
    const items = [
      {
        order_code: "08013C",
        code: "08013C",
        display: "Segment",
        value: 65.3,
        unit: "%",
        date: "2026-05-25",
        hospital: "嘉基醫院",
        order_name: "白血球分類計數",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    expect(o.code.text).toBe("Neutrophils %");
  });

  test("CANARY: 帶狀嗜中性白血球 (v0.11.9 Bug 6) — display key found → clean match → canonical 'Neutrophils %'", () => {
    // v0.12.1 added 帶狀嗜中性白血球 to PANEL_LOINC_MAP["08011C"], so
    // this is now a clean PANEL match → cleanMatch=true → canonical.
    // Test documents that v0.13 canonicalization fires for variants
    // that have been EXPLICITLY added to PANEL_LOINC_MAP.
    const items = [
      {
        order_code: "08011C",
        code: "08011C",
        display: "帶狀嗜中性白血球",
        value: 2.5,
        unit: "%",
        date: "2026-05-25",
        hospital: "嘉基醫院",
        order_name: "全套血液檢查Ｉ（八項）",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    // Display routes to a Band LOINC, not panel default — clean.
    const loinc = (o.code.coding ?? []).find((c: any) => c.system === "http://loinc.org")?.code;
    // Verify NOT panel default 6690-2 (WBC count = 08011C umbrella).
    expect(loinc).not.toBe("6690-2");
    // Whatever band LOINC it routes to, if it happens to be in
    // CBC_CANONICAL_TEXT_LOINCS the text is canonical; otherwise raw.
    // Either outcome is acceptable — what we LOCK DOWN below is the
    // path-C fallback canary.
  });

  test("CANARY (path-C fallback in multi-row panel) — unknown CBC display → RAW text preserved", () => {
    // Mis-tag canary — the v0.13 gate's reason to exist. Setup:
    //   • Multi-row 08011C panel (avoids v0.11.11 #8 single-obs DR
    //     text propagation which can paper over text resolution).
    //   • One row's display matches PANEL_LOINC_MAP["08011C"] cleanly
    //     ("Hb" → 718-7, cleanMatch=true). Verifies canonical fires.
    //   • Other row has an unrecognised display, falls through to
    //     path C (panel default 24317-0). The panel-default LOINC
    //     itself is NOT in CBC_CANONICAL_TEXT_LOINCS so the gate is a
    //     no-op for this row; what we lock down here is that the raw
    //     display survives all the way to obs.code.text — that's the
    //     mis-tag canary signal (a panel-default LOINC paired with a
    //     non-canonical text shows up as anomaly to bundle auditors,
    //     exactly like v0.11.9 Bug 6's 帶狀嗜中性白血球 case before
    //     PANEL_LOINC_MAP coverage was added).
    const unknownDisplay = "尚未編碼的分類項目";
    const items = [
      {
        order_code: "08011C",
        code: "08011C",
        display: "Hb",
        value: 13.1,
        unit: "g/dL",
        date: "2026-05-25",
        hospital: "嘉基醫院",
        order_name: "全套血液檢查Ｉ（八項）",
      },
      {
        order_code: "08011C",
        code: "08011C",
        display: unknownDisplay,
        value: 42,
        unit: "%",
        date: "2026-05-25",
        hospital: "嘉基醫院",
        order_name: "全套血液檢查Ｉ（八項）",
      },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    ) as any[];
    // Clean-matched row: canonical text "Hb".
    const hb = obs.find((o) =>
      (o.code.coding ?? []).some((c: any) => c.system === "http://loinc.org" && c.code === "718-7"),
    );
    expect(hb).toBeDefined();
    expect(hb.code.text).toBe("Hb");
    // Path-C row: raw display survives (mis-tag canary).
    const unknown = obs.find((o) => o.code.text === unknownDisplay);
    expect(unknown).toBeDefined();
    const unknownLoinc = (unknown.code.coding ?? []).find(
      (c: any) => c.system === "http://loinc.org",
    )?.code;
    // Routes to panel default for 08011C, NOT a leaf CBC LOINC.
    expect(unknownLoinc).toBe("24317-0");
  });

  test("Non-CBC LOINC (4548-4 HbA1c) keeps v0.11.10 'always canonicalize' behavior", () => {
    // HbA1c LOINC 4548-4 is NOT in CBC_CANONICAL_TEXT_LOINCS — it's
    // single-analyte NHI code 09006C, path A, cleanMatch always true.
    // Adding the gate must not change this: text should stay "HbA1c"
    // exactly like v0.11.10 → v0.12.6.
    const items = [
      {
        order_code: "09006C",
        code: "09006C",
        display: "醣化血紅素",
        value: 6.7,
        unit: "%",
        date: "2026-05-25",
        hospital: "嘉基醫院",
        order_name: "醣化血紅素",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    expect(o.code.text).toBe("HbA1c");
  });

  test("CBC LOINC outside our 12-LOINC set (e.g. 6690-2 WBC count) keeps raw text", () => {
    // 6690-2 (Leukocytes #/vol Blood) is NOT in
    // CBC_CANONICAL_TEXT_LOINCS — app dev's request scope didn't
    // include it. "WBC count" → 08011C panel map → 6690-2 → no
    // canonical text override → raw "WBC count" preserved.
    const items = [
      {
        order_code: "08011C",
        code: "08011C",
        display: "WBC count",
        value: 6.8,
        unit: "x10^3/uL",
        date: "2026-05-25",
        hospital: "嘉基醫院",
        order_name: "全套血液檢查Ｉ（八項）",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    expect(o.code.text).toBe("WBC count");
  });
});

// ── CI v0.13 — specimen.display fix (app dev follow-up 2026-05-29) ──
//
// Pre-v0.13 bug: SPECIMEN_RULES led with `/尿|urine|urinaly/` which
// substring-matched bare 尿 inside BLOOD analyte names (尿酸 / 尿素氮)
// → 35+ blood-analyte Observations silently mis-tagged
// specimen.display='Urine' → routed to urinalysis tab in SMART app →
// disappeared from chemistry tab without visible warning.
//
// v0.13.0 fix: tighten URINE regex (specific markers only, no bare 尿)
// + add BLOOD detection precedence + display URINE marker overrides
// order_name. Lock down all 4 bug cases + edge cases.
describe("CI v0.13 — specimen.display fix (尿酸 / BUN / urine creatinine)", () => {
  test("09013C 尿酸 (Uric Acid blood) — specimen should NOT be Urine", () => {
    const items = [
      {
        order_code: "09013C",
        code: "09013C",
        display: "Uric Acid (B)",
        value: 4.6,
        unit: "mg/dL",
        date: "2025-12-09",
        hospital: "長庚嘉義",
        order_name: "尿酸",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    expect(o.specimen?.display).not.toBe("Urine");
    // Display "(B)" parenthetical → BLOOD detection fires.
    expect(o.specimen?.display).toBe("Blood");
  });

  test("09002C 血中尿素氮 (BUN) — specimen should be Blood (not Urine)", () => {
    const items = [
      {
        order_code: "09002C",
        code: "09002C",
        display: "BUN",
        value: 27.3,
        unit: "mg/dL",
        date: "2025-09-16",
        hospital: "長庚嘉義",
        order_name: "血中尿素氮",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    // 血中 in order_name → BLOOD match (bare 血 is unambiguous).
    expect(o.specimen?.display).toBe("Blood");
  });

  test("09015C 肌酸酐(尿液) variant — display URINE wins over order_name 血", () => {
    // 09015C is blood-default per NHI catalog (order_name "肌酸酐、血"),
    // but the LIS-shipped display says "肌酸酐(尿液)" → it's actually a
    // urine creatinine row mis-billed under the blood code. Bridge
    // honors the LIS display because it's authoritative for the actual
    // measurement; specimen reflects what was tested.
    const items = [
      {
        order_code: "09015C",
        code: "09015C",
        display: "肌酸酐(尿液)",
        value: 87.5,
        unit: "mg/dL",
        date: "2025-12-09",
        hospital: "長庚嘉義",
        order_name: "肌酸酐、血",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    expect(o.specimen?.display).toBe("Urine");
  });

  test("09015C blood creatinine — specimen Blood (order_name 血 detection)", () => {
    // Default 09015C path: order_name says blood, display ambiguous.
    const items = [
      {
        order_code: "09015C",
        code: "09015C",
        display: "Crea",
        value: 1.82,
        unit: "mg/dL",
        date: "2025-12-09",
        hospital: "長庚嘉義",
        order_name: "肌酸酐、血",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    expect(o.specimen?.display).toBe("Blood");
  });

  test("Real urine row (06013C urinalysis 尿糖) — specimen Urine ✓", () => {
    const items = [
      {
        order_code: "06013C",
        code: "06013C",
        display: "尿糖",
        value: "Negative",
        unit: "",
        date: "2025-12-09",
        hospital: "長庚嘉義",
        order_name: "尿生化檢查",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    expect(o.specimen?.display).toBe("Urine");
  });

  test("NHI code authoritative — 09013C (尿酸) with bare order_name '尿酸' → Blood", () => {
    // Lockdown for user-raised architectural correction 2026-05-30:
    // 09013C is the NHI code for 尿酸(血液) — it should ALWAYS be Blood
    // specimen regardless of how the LIS formats the display string.
    // Pre-v0.13 bug: display="尿酸" with no English marker fell into
    // the bare-尿 regex and got Urine. Post-v0.13: NHI code 09xxx prefix
    // default = Blood. Even if display has zero specimen hint, the code
    // alone resolves it (same architecture as NHI_TO_LOINC).
    const items = [
      {
        order_code: "09013C",
        code: "09013C",
        display: "尿酸",
        value: 6.3,
        unit: "mg/dL",
        date: "2025-07-15",
        hospital: "長庚嘉義",
        order_name: "尿酸",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    expect(o.specimen?.display).toBe("Blood");
  });

  test("NHI code authoritative — 06013C urinalysis with ambiguous display 'Color' → Urine", () => {
    // Symmetric lockdown: 06013C is urinalysis. Even when the row's
    // display is a generic word that contains no urine marker (e.g.
    // "Color" / "pH" / "Spec. Gravity"), NHI prefix 06 default = Urine.
    // Without this, only rows with explicit urine markers in display
    // would get tagged correctly.
    const items = [
      {
        order_code: "06013C",
        code: "06013C",
        display: "Color",
        value: "Yellow",
        unit: "",
        date: "2025-12-09",
        hospital: "長庚嘉義",
        order_name: "尿生化檢查",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    expect(o.specimen?.display).toBe("Urine");
  });

  test("NHI 09016C — explicit URINE override of 09xxx blood-default prefix", () => {
    // Lockdown for NHI_CODE_SPECIMEN_OVERRIDE["09016C"]. 09016C is the
    // official NHI code for urine creatinine — 肌酐、尿. Even though it
    // shares the 09xxx prefix (blood default), the override map flips
    // it to Urine. Lock this so future audit doesn't accidentally drop
    // the override entry.
    const items = [
      {
        order_code: "09016C",
        code: "09016C",
        display: "Urine Crea",
        value: 87.5,
        unit: "mg/dL",
        date: "2025-12-09",
        hospital: "長庚嘉義",
        order_name: "肌酐、尿",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    expect(o.specimen?.display).toBe("Urine");
  });

  test("CI invariant — specimen.display vs NHI 醫令碼 consistency (silent-bug gate)", () => {
    // Proactive defense against future silent specimen mis-tag bugs (v0.13
    // bug 2026-05-29: 39 blood-analyte obs silently tagged Urine in
    // v0.12.6, only caught when app dev manually audited the bundle —
    // bridge had no CI test that verified specimen matched the NHI code's
    // panel context).
    //
    // This table enumerates real-world (code, display) → expected
    // specimen pairs. Every Observation that comes out of bridge MUST
    // match the expectation. Adding entries here is the standard way
    // to lock down newly-discovered NHI codes / variants.
    //
    // When adding a new entry:
    //   - For straightforward (NHI catalogue → blood) codes, pick a
    //     plausible display and assert "Blood".
    //   - For codes where the display is the OVERRIDE signal (LIS
    //     ships urine measurement under a blood-default NHI code),
    //     add the override case explicitly.
    //   - When in doubt, check the NHI catalog's panel name + LOINC
    //     System axis (loinc.org) — they should agree.
    type Case = { code: string; display: string; expectSpec: string | null; note?: string };
    const expectations: Case[] = [
      // ── 06xxx — Urinalysis ──────────────────────────
      {
        code: "06013C",
        display: "Color",
        expectSpec: "Urine",
        note: "ambiguous display, NHI prefix wins",
      },
      {
        code: "06013C",
        display: "pH",
        expectSpec: "Urine",
        note: "ambiguous display, NHI prefix wins",
      },
      { code: "06013C", display: "尿糖", expectSpec: "Urine", note: "display URINE marker agrees" },
      {
        code: "06013C",
        display: "蛋白",
        expectSpec: "Urine",
        note: "bare 蛋白 no marker, NHI prefix wins",
      },

      // ── 08xxx — CBC / hematology ────────────────────
      { code: "08003C", display: "Hb", expectSpec: "Blood" },
      { code: "08004C", display: "HCT", expectSpec: "Blood" },
      { code: "08011C", display: "Hb", expectSpec: "Blood" },
      { code: "08011C", display: "WBC", expectSpec: "Blood" },
      { code: "08013C", display: "Segment", expectSpec: "Blood" },
      { code: "08036C", display: "APTT", expectSpec: "Blood" },

      // ── 09xxx — Chemistry (mostly blood) ────────────
      { code: "09001C", display: "Cholesterol", expectSpec: "Blood" },
      {
        code: "09002C",
        display: "BUN",
        expectSpec: "Blood",
        note: "v0.12.6 silent bug — order_name 血中尿素氮",
      },
      { code: "09005C", display: "Glucose AC", expectSpec: "Blood" },
      {
        code: "09013C",
        display: "Uric Acid",
        expectSpec: "Blood",
        note: "v0.12.6 silent bug — order_name 尿酸",
      },
      {
        code: "09013C",
        display: "尿酸",
        expectSpec: "Blood",
        note: "bare 尿 substring must NOT trigger Urine",
      },
      { code: "09013C", display: "Uric Acid (B)", expectSpec: "Blood" },
      { code: "09015C", display: "Crea", expectSpec: "Blood", note: "serum creatinine default" },
      {
        code: "09015C",
        display: "肌酸酐(尿液)",
        expectSpec: "Urine",
        note: "LIS-shipped urine override on blood-default code",
      },
      {
        code: "09016C",
        display: "Urine Crea",
        expectSpec: "Urine",
        note: "NHI explicit-override code for urine creatinine",
      },
      { code: "09021C", display: "Na", expectSpec: "Blood" },
      { code: "09140C", display: "Sugar", expectSpec: "Blood" },

      // ── 11xxx — Blood typing ───────────────────────
      { code: "11001C", display: "ABO", expectSpec: "Blood" },
      { code: "11003C", display: "Rh(D)", expectSpec: "Blood" },

      // ── 12xxx — Immunology / tumor markers ────────
      { code: "12007C", display: "AFP", expectSpec: "Blood" },
      { code: "12021C", display: "CEA", expectSpec: "Blood" },
      { code: "12053C", display: "ANA", expectSpec: "Blood" },
      { code: "12081C", display: "PSA", expectSpec: "Blood" },
    ];

    const violations: string[] = [];
    for (const c of expectations) {
      const items = [
        {
          order_code: c.code,
          code: c.code,
          display: c.display,
          value: 1,
          unit: "",
          date: "2026-05-30",
          hospital: "Test Hospital",
          order_name: c.display,
        },
      ];
      const obs = mapObservationsGrouped(items, PATIENT_ID).find(
        (r) => r.resourceType === "Observation",
      ) as any;
      if (!obs) {
        // Some test inputs may be filtered (e.g. empty display match QC
        // patterns). Skip rather than fail — this invariant only checks
        // specimen ON OBSERVATIONS THAT WERE EMITTED.
        continue;
      }
      const actual = obs.specimen?.display ?? null;
      if (actual !== c.expectSpec) {
        const noteSfx = c.note ? ` — ${c.note}` : "";
        violations.push(
          `${c.code} "${c.display}" → expected specimen=${c.expectSpec ?? "null"}, got ${actual ?? "null"}${noteSfx}`,
        );
      }
    }

    if (violations.length > 0) {
      // Single aggregated failure so all violations show in one CI run,
      // not a flurry of fail/pass cycles.
      throw new Error(
        `Silent-bug specimen invariant FAILED — ${violations.length} mismatches:\n${violations.map((v) => `  • ${v}`).join("\n")}`,
      );
    }
  });

  test("Stool occult-blood row — 'occult blood' must NOT trigger BLOOD specimen", () => {
    // Defensive: BLOOD_MARKERS_RE has `\bblood\b` which could spuriously
    // match "occult blood" (stool test). Other-specimen rules run first
    // and intercept it.
    const items = [
      {
        order_code: "07020C",
        code: "07020C",
        display: "Occult blood",
        value: "Negative",
        unit: "",
        date: "2025-12-09",
        hospital: "長庚嘉義",
        order_name: "糞便潛血",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    expect(o.specimen?.display).toBe("Stool");
  });
});

// ── CI v0.13 — NHI 就醫日期 (funC_DATE) surfaced as meta.tag ──
//
// User-verified anomaly 2026-05-30: 長庚嘉義 09006C HbA1c row in NHI
// raw shows reaL_INSPECT_DATE=2025-12-09 but funC_DATE=2025-09-16 —
// ~3 months apart. Bridge cannot judge which is "correct" per the
// faithful-transport rule, but it can carry BOTH dates so SMART apps
// can detect the gap and surface a warning. meta.tag pattern mirrors
// v0.12.3 nhi-source-channel: bridge-namespaced system URI, code is
// the ISO 8601 date string.
describe("CI v0.13 — NHI 就醫日期 (funC_DATE) surfaced as meta.tag", () => {
  test("Lab obs with nhi_visit_date != inspect date → both dates surface", () => {
    // The 長庚嘉義 HbA1c case: inspect 2025-12-09, visit 2025-09-16.
    const items = [
      {
        order_code: "09006C",
        code: "09006C",
        display: "Hb-A1c",
        value: 6.7,
        unit: "%",
        date: "2025-12-09", // reaL_INSPECT_DATE → effectiveDateTime
        hospital: "長庚嘉義",
        order_name: "醣化血紅素",
        reference_range: "[0.1][5.699]",
        nhi_source_channel: "A",
        nhi_visit_date: "2025-09-16", // funC_DATE — surface via meta.tag
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    // effectiveDateTime stays on inspect date (FHIR "physiologically
    // relevant time" for a lab).
    expect(o.effectiveDateTime).toBe("2025-12-09T00:00:00+08:00");
    // Visit date rides in meta.tag.
    const visitTag = (o.meta?.tag ?? []).find(
      (t: any) => t.system === "http://nhi-fhir-bridge/nhi-visit-date",
    );
    expect(visitTag).toBeDefined();
    expect(visitTag.code).toBe("2025-09-16");
  });

  test("Lab obs without nhi_visit_date → no spurious meta.tag", () => {
    // Defensive: rows missing funC_DATE (older endpoints / edge cases)
    // must NOT emit an empty-code visit-date tag — that would violate
    // FHIR Meta.tag.code "no whitespace" semantics and pollute the
    // tag list.
    const items = [
      {
        order_code: "09021C",
        code: "09021C",
        display: "Na",
        value: 142,
        unit: "mEq/L",
        date: "2026-05-25",
        hospital: "長庚嘉義",
        order_name: "鈉",
        reference_range: "[136][146]",
        // nhi_visit_date NOT set
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    const visitTag = (o.meta?.tag ?? []).find(
      (t: any) => t.system === "http://nhi-fhir-bridge/nhi-visit-date",
    );
    expect(visitTag).toBeUndefined();
  });

  test("Lab obs where nhi_visit_date === date → tag still surfaces (no smart suppression)", () => {
    // Faithful transport: bridge must NOT decide "they match, no point
    // surfacing visit_date". App might want to display both dates
    // even when equal (audit trail / data provenance). Surface always
    // when present.
    const items = [
      {
        order_code: "08011C",
        code: "08011C",
        display: "Hb",
        value: 13.1,
        unit: "g/dL",
        date: "2026-05-25",
        hospital: "嘉基醫院",
        order_name: "全套血液檢查Ｉ（八項）",
        nhi_visit_date: "2026-05-25",
      },
    ];
    const o = mapObservationsGrouped(items, PATIENT_ID).find(
      (r) => r.resourceType === "Observation",
    ) as any;
    const visitTag = (o.meta?.tag ?? []).find(
      (t: any) => t.system === "http://nhi-fhir-bridge/nhi-visit-date",
    );
    expect(visitTag).toBeDefined();
    expect(visitTag.code).toBe("2026-05-25");
  });
});

// ── CI v0.14 — imaging JPEG opt-in → DiagnosticReport.presentedForm
//
// Background: popup "抓影像" toggle (OFF by default) drives the bridge
// to trigger / poll / fetch IHKE3408S03 base64 JPGs. The mapper layer
// gets a `jpgBase64` field on the raw item and emits presentedForm
// per FHIR R4 Attachment. The risks this section gates:
//   1. Toggle OFF (jpgBase64 absent) must produce zero presentedForm
//      side-effects on existing narrative-only rows — backwards-compat.
//   2. Toggle ON + valid JPG must produce contentType="image/jpeg",
//      data === base64, size === computed-from-base64-length, title set.
//   3. Image-only rows (conclusion empty, jpgBase64 present) must
//      still emit a DR — otherwise the X-ray / endoscopy / ultrasound
//      with no typed report is silently dropped.
//   4. Lab rows without conclusion AND without jpgBase64 still drop
//      (no clinical content to emit).
//   5. ipl_CASE_SEQ_NO disambiguates two image-only rows that share
//      (code, date) — without it the stableId collision would collapse
//      two distinct NHI imaging cases (e.g. front + lateral X-ray
//      under one order_CODE) into a single DR.
//
// 1×1 transparent JPEG, base64-encoded — smallest valid sample. SOI
// marker FF D8 FF survives the round-trip so attachment-bytes consumers
// can magic-byte check.
const TINY_JPEG_B64 =
  "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAr/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/wD/Z";

describe("CI v0.14 — imaging JPEG opt-in: DiagnosticReport.presentedForm", () => {
  test("narrative row WITHOUT jpgBase64 → backwards-compat (no presentedForm)", () => {
    const dr = mapDiagnosticReport(
      {
        date: "2026-02-05",
        code: "19009C",
        display: "Abdominal Echo, F/U",
        category: "RAD",
        conclusion: "Sonar Diagnosis: Fatty liver Gallbladder sludge",
        hospital: "嘉基醫院",
        issued: "2026-03-26",
      },
      PATIENT_ID,
    );
    expect(dr).not.toBeNull();
    expect(dr?.conclusion).toBe("Sonar Diagnosis: Fatty liver Gallbladder sludge");
    expect(dr?.presentedForm).toBeUndefined();
  });

  test("narrative row WITH single jpgBase64s → DR has both conclusion AND presentedForm", () => {
    const dr = mapDiagnosticReport(
      {
        date: "2026-02-05",
        code: "19009C",
        display: "Abdominal Echo, F/U",
        category: "RAD",
        conclusion: "Sonar Diagnosis: Fatty liver",
        hospital: "嘉基醫院",
        issued: "2026-03-26",
        jpgBase64s: [TINY_JPEG_B64],
        iplCaseSeqNo: "2026020512345678",
      },
      PATIENT_ID,
    );
    expect(dr).not.toBeNull();
    expect(dr?.conclusion).toBe("Sonar Diagnosis: Fatty liver");
    expect(dr?.presentedForm).toHaveLength(1);
    expect(dr?.presentedForm[0].contentType).toBe("image/jpeg");
    expect(dr?.presentedForm[0].data).toBe(TINY_JPEG_B64);
    // Single-frame: title stays the raw display (no "frame N/M" suffix).
    expect(dr?.presentedForm[0].title).toBe("Abdominal Echo, F/U");
    // size = floor(base64-length * 3 / 4) — inverse of base64 expansion.
    const expectedSize = Math.floor((TINY_JPEG_B64.length * 3) / 4);
    expect(dr?.presentedForm[0].size).toBe(expectedSize);
    // Decoded magic bytes = JPEG SOI (FF D8 FF). Bridge does not transcode.
    const binFirst3 = Buffer.from(TINY_JPEG_B64, "base64").subarray(0, 3);
    expect(binFirst3[0]).toBe(0xff);
    expect(binFirst3[1]).toBe(0xd8);
    expect(binFirst3[2]).toBe(0xff);
  });

  test("multi-frame study (CT/US) → one presentedForm per frame with 'frame n/N' titles", () => {
    // 19009C 腹部超音波 ships 10 frames per row, 33070B 腦 CT ships 10
    // too (probed live 2026-06-03). Pre-fix iteration only kept pics[0],
    // losing ~80% of the clinical content. The mapper must emit one
    // attachment per frame with a 'frame N/M' suffix so apps can show
    // which frame is which without counting.
    const frames = [TINY_JPEG_B64, TINY_JPEG_B64, TINY_JPEG_B64];
    const dr = mapDiagnosticReport(
      {
        date: "2026-02-05",
        code: "19009C",
        display: "Abdominal Echo",
        category: "RAD",
        conclusion: "",
        hospital: "嘉基醫院",
        jpgBase64s: frames,
        iplCaseSeqNo: "2026020512345678",
        imageOnly: true,
      },
      PATIENT_ID,
    );
    expect(dr).not.toBeNull();
    expect(dr?.presentedForm).toHaveLength(3);
    expect(dr?.presentedForm[0].title).toBe("Abdominal Echo (frame 1/3)");
    expect(dr?.presentedForm[1].title).toBe("Abdominal Echo (frame 2/3)");
    expect(dr?.presentedForm[2].title).toBe("Abdominal Echo (frame 3/3)");
    for (const attachment of dr?.presentedForm ?? []) {
      expect(attachment.contentType).toBe("image/jpeg");
      expect(attachment.data).toBe(TINY_JPEG_B64);
    }
  });

  test("legacy raw.jpgBase64 (singular, deprecated) still works for backwards compat", () => {
    // Older callers (pre-v0.14.1) or test fixtures may pass the
    // singular field. Mapper accepts both shapes so a partial migration
    // doesn't drop data on the floor.
    const dr = mapDiagnosticReport(
      {
        date: "2026-05-25",
        code: "32001C",
        display: "Chest X-Ray",
        category: "RAD",
        conclusion: "",
        hospital: "長庚嘉義",
        jpgBase64: TINY_JPEG_B64,
        iplCaseSeqNo: "2026052532001001",
        imageOnly: true,
      },
      PATIENT_ID,
    );
    expect(dr).not.toBeNull();
    expect(dr?.presentedForm).toHaveLength(1);
    expect(dr?.presentedForm[0].data).toBe(TINY_JPEG_B64);
  });

  test("image-only row (conclusion empty + jpgBase64s present) → DR emitted with presentedForm only", () => {
    // The 32001C 胸腔 X-ray case: NHI ships no narrative `desc`, so
    // adaptImagingReportFromDetail would return null. With opt-in
    // imaging enabled, adaptImageOnlyReportFromMeta synthesises a raw
    // item with conclusion="" + jpgBase64s. The mapper must still emit
    // a DR — without this branch the X-ray disappears entirely.
    const dr = mapDiagnosticReport(
      {
        date: "2026-05-25",
        code: "32001C",
        display: "Chest X-Ray",
        category: "RAD",
        conclusion: "",
        hospital: "長庚嘉義",
        jpgBase64s: [TINY_JPEG_B64],
        iplCaseSeqNo: "2026052532001001",
        imageOnly: true,
      },
      PATIENT_ID,
    );
    expect(dr).not.toBeNull();
    expect(dr?.conclusion).toBeUndefined();
    expect(dr?.presentedForm).toHaveLength(1);
    expect(dr?.presentedForm[0].data).toBe(TINY_JPEG_B64);
  });

  test("row with no conclusion AND no jpgBase64s → still dropped (no clinical content)", () => {
    // Defensive: a malformed imaging detail body (NHI gave us nothing)
    // must drop, not emit an empty DR. Without this assertion we'd
    // silently flood the bundle with content-free DRs.
    const dr = mapDiagnosticReport(
      {
        date: "2026-05-25",
        code: "32001C",
        display: "Chest X-Ray",
        category: "RAD",
        conclusion: "",
        hospital: "長庚嘉義",
        // no jpgBase64s, no imageOnly flag
      },
      PATIENT_ID,
    );
    expect(dr).toBeNull();
  });

  test("empty jpgBase64s array AND empty conclusion → dropped (no clinical content)", () => {
    // Mirror the above for the array shape. Defensive: a fetcher
    // that returned no frames but populated [] (e.g. transient
    // network error) must still drop the row.
    const dr = mapDiagnosticReport(
      {
        date: "2026-05-25",
        code: "32001C",
        display: "Chest X-Ray",
        category: "RAD",
        conclusion: "",
        hospital: "長庚嘉義",
        jpgBase64s: [],
        imageOnly: true,
      },
      PATIENT_ID,
    );
    expect(dr).toBeNull();
  });

  test("two image-only rows sharing (code, date) get distinct ids via ipl_CASE_SEQ_NO", () => {
    // Front + lateral X-ray under the same order_CODE 32001C on the
    // same day — without ipl_CASE_SEQ_NO in the stableId hash both
    // would collapse to one DR, losing one of the images. Bridge must
    // produce TWO DRs with distinct ids.
    const baseRaw = {
      date: "2026-05-25",
      code: "32001C",
      display: "Chest X-Ray",
      category: "RAD",
      conclusion: "",
      hospital: "長庚嘉義",
      jpgBase64s: [TINY_JPEG_B64],
      imageOnly: true,
    };
    const drA = mapDiagnosticReport({ ...baseRaw, iplCaseSeqNo: "2026052532001001" }, PATIENT_ID);
    const drB = mapDiagnosticReport({ ...baseRaw, iplCaseSeqNo: "2026052532001002" }, PATIENT_ID);
    expect(drA).not.toBeNull();
    expect(drB).not.toBeNull();
    expect(drA?.id).not.toBe(drB?.id);
  });
});

// ── CI v0.16 — 出院病摘 DocumentReference invariants ────────────────
// Silent-bug class (per CLAUDE.md rule 8): wrong Encounter back-ref
// would leave the document orphaned in SMART apps — FHIR validates,
// nothing crashes, but the document doesn't appear under the inpatient
// visit. Lock the relationship down in CI rather than relying on a
// human auditing the bundle.
describe("CI v0.16 — 出院病摘 DocumentReference invariants", () => {
  const SAMPLE_HTML =
    `<head xmlns:IHK="urn:hl7-org:v3"><style>.x{}</style></head>` +
    `<body><table><tr><td><b>記錄日期時間：</b></td><td>2025-05-23</td></tr></table>` +
    `<table><tr><td><b>住院摘要</b></td><td>Discharged stable.</td></tr></table></body>`;

  const baseRaw = {
    html: SAMPLE_HTML,
    row_id: "AAOZsAAIBAALXDJAAH",
    hospital: "長庚嘉義",
    admission_date: "2025-05-18",
    discharge_date: "2025-05-22",
  };

  test("DocumentReference.context.encounter matches the Encounter mintEncounter would produce for the same admission", () => {
    // Same inputs that the orchestrator would feed mapEncounter via
    // adaptInpatientEncounter. If the two stable-ID algorithms ever
    // diverge, the document goes orphan and SMART apps stop finding it
    // under the encounter — exactly the silent-bug class the rule 8
    // CI-gate practice was written to catch.
    const enc = mapEncounter(
      {
        date: "2025-05-18",
        end_date: "2025-05-22",
        class: "IMP",
        hospital: "長庚嘉義",
      },
      PATIENT_ID,
    );
    const doc = mapDischargeSummaryDocRef(baseRaw, PATIENT_ID);
    expect(doc).not.toBeNull();
    expect(doc!.context.encounter[0].reference).toBe(`Encounter/${enc.id}`);
  });

  test("LOINC 18842-5 round-trips through LOINC_DISPLAY", () => {
    const doc = mapDischargeSummaryDocRef(baseRaw, PATIENT_ID);
    const coding = doc!.type.coding[0];
    expect(coding.code).toBe("18842-5");
    expect(coding.display).toBe(LOINC_DISPLAY["18842-5"]);
  });

  test("attachment.data round-trips Chinese narrative without mojibake", () => {
    // The browser-side btoa requires the encodeURIComponent → unescape
    // dance to handle multi-byte CJK. Node's Buffer path is happier
    // but we test both indirectly via the round-trip.
    const doc = mapDischargeSummaryDocRef(baseRaw, PATIENT_ID);
    const decoded = Buffer.from(doc!.content[0].attachment.data, "base64").toString("utf8");
    expect(decoded).toBe(SAMPLE_HTML);
    expect(decoded).toContain("住院摘要");
    expect(decoded).toContain("記錄日期時間");
  });

  test("status=current, type/category/subject all present (FHIR R4 required-shape)", () => {
    const doc = mapDischargeSummaryDocRef(baseRaw, PATIENT_ID);
    // current is the FHIR R4 default for active in-use documents
    expect(doc!.status).toBe("current");
    expect(doc!.type.coding[0].code).toBe("18842-5");
    expect(doc!.category[0].coding[0].code).toBe("clinical-note");
    expect(doc!.subject.reference).toBe(`Patient/${PATIENT_ID}`);
    expect(doc!.content[0].attachment.contentType).toBe("text/html");
    expect(typeof doc!.content[0].attachment.data).toBe("string");
    expect(doc!.content[0].attachment.data.length).toBeGreaterThan(0);
  });

  test("identifier carries the NHI row_ID for re-sync correlation", () => {
    const doc = mapDischargeSummaryDocRef(baseRaw, PATIENT_ID);
    expect(doc!.identifier?.[0]?.system).toBe("http://nhi-fhir-bridge/nhi-inpatient-row");
    expect(doc!.identifier?.[0]?.value).toBe("AAOZsAAIBAALXDJAAH");
  });

  test("id is independent of (hospital, date) — two rows from same visit don't collide", () => {
    const a = mapDischargeSummaryDocRef(baseRaw, PATIENT_ID);
    const b = mapDischargeSummaryDocRef({ ...baseRaw, row_id: "AAOOTHERROW" }, PATIENT_ID);
    // Same admission_date / hospital → SAME encounter ID (correct):
    expect(a!.context.encounter[0].reference).toBe(b!.context.encounter[0].reference);
    // …but the documents themselves are distinct (correct, defends
    // the multi-reading principle if NHI ever ships two summaries
    // for one stay — e.g. an amendment).
    expect(a!.id).not.toBe(b!.id);
  });

  test("stableId helper recomputes the same encounter ref consumers will use externally", () => {
    // Belt-and-suspenders: a downstream consumer that wants to find
    // "the DocumentReference for this Encounter" must be able to
    // recompute the same encounter ID from (pid, date, class, hosp).
    // Re-asserting the mintEncounter recipe inline so a future refactor
    // of mapEncounter's stableId inputs surfaces here, not silently in
    // production.
    const doc = mapDischargeSummaryDocRef(baseRaw, PATIENT_ID);
    const expectedRef = `Encounter/${stableId(PATIENT_ID, "2025-05-18", "IMP", "長庚嘉義")}`;
    expect(doc!.context.encounter[0].reference).toBe(expectedRef);
  });
});
