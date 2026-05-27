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

import { mapMedicationsDedup, mapObservationsGrouped } from "@nhi-fhir-bridge/mapper";

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
    expect(texts).toContain("APTT data/mean"); // real patient row preserved
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
    const items = [
      {
        code: "09015C",
        display: "eGFR",
        value: "33 (stage3:30-59)",
        unit: "mL/min/1.73m2",
        date: "2024-05-10",
      },
      { code: "06013C", display: "Bilirubin", value: "2.3(36.1%)", unit: "", date: "2024-04-01" },
      { code: "06013C", display: "Protein", value: "4+ (2000)", unit: "mg/dL", date: "2024-04-01" },
    ];
    const obs = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    for (const o of obs) {
      expect(o.valueQuantity).toBeDefined();
      expect(o.valueString).toBeUndefined();
    }
  });
});
