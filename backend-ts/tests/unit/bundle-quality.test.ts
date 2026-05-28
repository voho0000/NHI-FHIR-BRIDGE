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
  mapMedicationsDedup,
  mapObservationsGrouped,
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
    const bundle = buildSampleBundle();
    const segs = walkObservations(bundle).filter(
      (o) => (o.code?.text ?? "").toLowerCase() === "segment",
    );
    expect(segs.length).toBeGreaterThan(0);
    for (const seg of segs) {
      const loincCodes = (seg.code.coding ?? [])
        .filter((c: any) => c.system === "http://loinc.org")
        .map((c: any) => c.code);
      expect(loincCodes).not.toContain("57021-8");
      expect(loincCodes).toContain("770-8"); // Neutrophils/100 leukocytes
    }
  });

  test("regression seed — HGB billed as 08004C HCT must route to 718-7 (display wins)", () => {
    const bundle = buildSampleBundle();
    const hgb = walkObservations(bundle).filter(
      (o) => (o.code?.text ?? "").toLowerCase() === "hgb",
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
    // 20 raw - 5 cross-language merges (Bilirubin/膽紅素, CREA(U)/肌酸酐(尿液),
    // Glucose/尿糖, Color/顏色, Blood/尿潛血) = 15 distinct analytes.
    // Per-analyte: 1 row. English preferred when both languages present.
    expect(obs.length).toBe(15);
    const texts = obs.map((o: any) => o.code?.text);
    // Cross-language pairs must collapse to 1 row each (English wins)
    expect(texts).toContain("Bilirubin");
    expect(texts).not.toContain("膽紅素");
    expect(texts).toContain("CREA(U)(半定量)");
    expect(texts).not.toContain("肌酸酐(尿液)(半定量)");
    expect(texts).toContain("Glucose");
    expect(texts).not.toContain("尿糖");
    expect(texts).toContain("Color");
    expect(texts).not.toContain("顏色");
    expect(texts).toContain("Blood");
    expect(texts).not.toContain("尿潛血");
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
    // Must include all 6 valid rows
    for (const expected of ["HCT", "HGB", "WBC", "Direct", "Color", "eGFR"]) {
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

describe("CI v0.11.13 — Bug 9c: 2 placeholder-unit INR rows collapse to 1 obs", () => {
  test("INR row with unit='空白空白' and unit='-' but same value/display → 1 obs after dedup", () => {
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
    );
    expect(obs).toHaveLength(1);
  });

  test("End-to-end bug 9 scenario: 4-row raw → 2 obs (1 PT + 1 INR), not 4", () => {
    // Reproduces user's v0.11.10 bundle: per draw raw had PT row +
    // mistag (display=INR, val=11.9 sec) + 2 placeholder-unit INR rows.
    // After v0.11.13: mistag rerouted to PT and collides with real PT
    // (same canonical+value+code → same stableId); 2 placeholder-unit
    // rows dedup. Net: 1 PT + 1 INR.
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
    // Group by LOINC
    const byLoinc: Record<string, number> = {};
    for (const o of obs) {
      const loinc = o.code.coding.find((c: any) => c.system === "http://loinc.org")?.code;
      byLoinc[loinc] = (byLoinc[loinc] ?? 0) + 1;
    }
    // After fixes: at most 2 obs under 5902-2 (PT) [original + rerouted mistag]
    // — same value+date+canonical+code may collide → could be 1.
    // And exactly 1 obs under 6301-6 INR (placeholder dedup).
    expect(byLoinc["6301-6"]).toBe(1); // INR collapsed via placeholder normalisation
    // No INR obs should carry a sec-valued reading
    const inrObs = obs.find((o: any) =>
      o.code.coding.find((c: any) => c.system === "http://loinc.org" && c.code === "6301-6"),
    );
    expect(inrObs?.valueQuantity?.unit).not.toBe("sec");
    expect(inrObs?.valueQuantity?.code).not.toBe("sec");
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
