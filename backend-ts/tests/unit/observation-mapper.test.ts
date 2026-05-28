/**
 * Observation mapper unit tests.
 * Port of backend/tests/unit/test_observation_mapper.py + extra parity
 * tests for canonicalLabKey / findLoinc edge cases.
 */

import { describe, expect, test } from "vitest";

import {
  canonicalLabKey,
  findLoinc,
  mapObservation,
  mapObservationsGrouped,
} from "@nhi-fhir-bridge/mapper";

const PATIENT_ID = "A123456789";

describe("mapObservation — unit canonicalization (bug report Part 3 C2)", () => {
  test("eGFR with NHI unit 'N' → canonical 'mL/min/1.73m2'", () => {
    // Taiwan LIS quirk: eGFR rows ship with unit "N" (placeholder, not
    // UCUM). Without canonicalization downstream FHIR consumers see
    // {value: 36.3, unit: "N", code: "N"} which can't be displayed or
    // compared. Mapper overrides to the LOINC 33914-3 canonical unit.
    const r = mapObservation(
      {
        code: "09015C",
        display: "eGFR",
        value: 36.3,
        unit: "N",
        date: "2026-05-01",
      },
      PATIENT_ID,
    );
    expect(r?.valueQuantity?.value).toBe(36.3);
    expect(r?.valueQuantity?.unit).toBe("mL/min/1.73m2");
  });

  test("eGFR with empty unit also normalised", () => {
    const r = mapObservation(
      {
        code: "09015C",
        display: "Estimated GFR",
        value: 90,
        unit: "",
        date: "2026-05-01",
      },
      PATIENT_ID,
    );
    expect(r?.valueQuantity?.unit).toBe("mL/min/1.73m2");
  });

  test("eGFR with proper unit untouched (mL/min/1.73m2)", () => {
    // Defensive: confirm we DON'T override an already-valid unit.
    const r = mapObservation(
      {
        code: "09015C",
        display: "eGFR",
        value: 45.4,
        unit: "mL/min/1.73m2",
        date: "2026-05-01",
      },
      PATIENT_ID,
    );
    expect(r?.valueQuantity?.unit).toBe("mL/min/1.73m2");
  });

  test("non-eGFR rows with unit 'N' pass through unchanged", () => {
    // The canonicalization is whitelisted by analyte — only eGFR has a
    // known fix-up. Other rows with bogus unit "N" stay as-is so the
    // canonicalization doesn't silently rewrite unrelated data.
    const r = mapObservation(
      {
        code: "09005C",
        display: "Glucose",
        value: 100,
        unit: "N",
        date: "2026-05-01",
      },
      PATIENT_ID,
    );
    expect(r?.valueQuantity?.unit).toBe("N");
  });
});

describe("mapObservation (single row)", () => {
  test("basic shape", () => {
    const r = mapObservation(
      {
        code: "09005C",
        display: "Fasting Glucose",
        value: 95,
        unit: "mg/dL",
        date: "2024-01-15",
      },
      PATIENT_ID,
    );
    expect(r).not.toBeNull();
    expect(r!.resourceType).toBe("Observation");
    expect(r!.subject.reference).toBe(`Patient/${PATIENT_ID}`);
  });

  test("NHI code maps to LOINC", () => {
    const r = mapObservation(
      {
        code: "09005C",
        display: "Fasting Glucose",
        value: 95,
        unit: "mg/dL",
        date: "2024-01-15",
      },
      PATIENT_ID,
    );
    const codingSystems = r!.code.coding.map((c: any) => c.system as string);
    expect(codingSystems.some((s: string) => s.includes("loinc.org"))).toBe(true);
  });

  test("imaging keyword returns null", () => {
    const r = mapObservation({ display: "Chest X-Ray", code: "" }, PATIENT_ID);
    expect(r).toBeNull();
  });

  test("missing value AND missing interp returns null", () => {
    const r = mapObservation({ code: "09005C", display: "Foo" }, PATIENT_ID);
    expect(r).toBeNull();
  });
});

describe("mapObservationsGrouped (panel grouping)", () => {
  test("CBC panel collapses to one DiagnosticReport", () => {
    const items = [
      {
        code: "08013C",
        order_name: "WBC w/ Diff",
        display: "WBC",
        value: 6.5,
        unit: "10^3/uL",
        date: "2024-01-15",
        hospital: "台大醫院",
      },
      {
        code: "08013C",
        order_name: "WBC w/ Diff",
        display: "Hemoglobin",
        value: 14.0,
        unit: "g/dL",
        date: "2024-01-15",
        hospital: "台大醫院",
      },
      {
        code: "08013C",
        order_name: "WBC w/ Diff",
        display: "Platelet",
        value: 250,
        unit: "10^3/uL",
        date: "2024-01-15",
        hospital: "台大醫院",
      },
    ];
    const resources = mapObservationsGrouped(items, PATIENT_ID);
    const reports = resources.filter((r) => r.resourceType === "DiagnosticReport");
    const observations = resources.filter((r) => r.resourceType === "Observation");
    expect(reports).toHaveLength(1);
    expect(observations).toHaveLength(3);
  });

  test("different dates make separate reports", () => {
    const items = [
      {
        code: "08013C",
        order_name: "CBC",
        display: "WBC",
        value: 6.5,
        unit: "10^3/uL",
        date: "2024-01-15",
        hospital: "台大醫院",
      },
      {
        code: "08013C",
        order_name: "CBC",
        display: "WBC",
        value: 7.0,
        unit: "10^3/uL",
        date: "2024-02-15",
        hospital: "台大醫院",
      },
    ];
    const reports = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "DiagnosticReport",
    );
    expect(reports).toHaveLength(2);
  });

  test("value-less rows dropped by filter", () => {
    const items = [
      {
        code: "08013C",
        order_name: "CBC",
        display: "Image",
        date: "2024-01-15",
        hospital: "台大醫院",
      }, // no value/unit
    ];
    const observations = mapObservationsGrouped(items, PATIENT_ID).filter(
      (r) => r.resourceType === "Observation",
    );
    expect(observations).toEqual([]);
  });
});

describe("canonicalLabKey", () => {
  test("HbA1c synonyms collapse to HBA1C", () => {
    expect(canonicalLabKey("醣化血紅素")).toBe("HBA1C");
    expect(canonicalLabKey("HbA1c")).toBe("HBA1C");
    expect(canonicalLabKey("A1C")).toBe("HBA1C");
    expect(canonicalLabKey("Glycated Hemoglobin")).toBe("HBA1C");
  });

  test("MCH/MCHC long-form CJK wins over RBC", () => {
    expect(canonicalLabKey("平均紅血球血色素濃度")).toBe("MCHC");
    expect(canonicalLabKey("平均紅血球血色素")).toBe("MCH");
    // Bare RBC name still maps to RBC.
    expect(canonicalLabKey("紅血球計數")).toBe("RBC");
  });

  test("LDL/HDL beats bare CHOLESTEROL", () => {
    expect(canonicalLabKey("LDL CHOLESTEROL")).toBe("LDL_C");
    expect(canonicalLabKey("HDL CHOLESTEROL")).toBe("HDL_C");
    expect(canonicalLabKey("低密度膽固醇")).toBe("LDL_C");
    expect(canonicalLabKey("Total Cholesterol")).toBe("TOTAL_CHOLESTEROL");
  });

  test("AST doesn't match inside DIASTOLIC (word-boundary)", () => {
    // "DIASTOLIC" contains "AST" as a substring but should not collapse.
    expect(canonicalLabKey("DIASTOLIC Blood Pressure")).not.toBe("AST");
  });

  test("Urine pH not collapsed to uric acid", () => {
    // CJK substring match: 尿酸鹼度 must win over 尿酸.
    expect(canonicalLabKey("尿酸鹼度")).toBe("URINE_PH");
  });

  test("Unknown display falls back to lowercased trimmed", () => {
    expect(canonicalLabKey("Some Obscure Test")).toBe("some obscure test");
  });
});

describe("findLoinc", () => {
  test("single-test NHI code → direct LOINC", () => {
    expect(findLoinc("09005C", "Fasting Glucose")).toBe("1558-6");
  });

  test("panel code uses display-keyword lookup", () => {
    // 08013C is a CBC differential panel; WBC display under it should
    // resolve to the WBC LOINC (6690-2), not the panel LOINC (57021-8).
    const loinc = findLoinc("08013C", "WBC");
    expect(loinc).toBe("6690-2");
  });

  test("unknown code with recognised display still finds a LOINC", () => {
    const loinc = findLoinc("", "HbA1c");
    expect(loinc).not.toBeNull();
  });

  // ── Regression tests for short-key prefix collisions ─────────────
  // Bug family fixed in v0.6.7: findLoinc's keyword loop used `\b<key>`
  // (no trailing boundary) AND first-match semantics. Short keys like
  // "hb" (Hemoglobin), "ph" (pH), "mch" (MCH) silently shadowed more
  // specific longer keys like "hbsag", "phosphate", "mchc". Fix: both-
  // side word boundary `\b<key>\b` + longest-key-wins.

  test("HBsAg keyword does NOT collide with 'hb' generic Hemoglobin key", () => {
    // Pre-v0.6.7 this returned "718-7" (Hemoglobin) because \bhb
    // matched the "hb" prefix of "hbsag". Now \bhb\b requires a
    // trailing boundary which "hbsag" doesn't satisfy.
    expect(findLoinc("HBsAg", "HBsAg")).toBe("5196-1");
  });

  test("Anti-HBc keyword does NOT collide with 'hb' generic Hemoglobin key", () => {
    // We don't have a LOINC mapping for Anti-HBc yet; the test only
    // proves the collision is gone (null instead of 718-7 Hemoglobin).
    // If a mapping is added later this expectation should update.
    expect(findLoinc("Anti-HBc", "Anti-HBc")).not.toBe("718-7");
  });

  test("Phosphate display does NOT collide with 'ph' (urine / arterial pH) key", () => {
    // Pre-fix: "phosphate" combined string matched \bph at start →
    // returned pH LOINC. Now end boundary required, "ph" doesn't
    // match "phosphate".
    expect(findLoinc("", "Phosphate")).not.toBe("11558-4");
    expect(findLoinc("", "Phosphate")).not.toBe("5803-2");
  });

  test("MCHC display does NOT collide with 'mch' (MCH-only) key", () => {
    // \bmch\b requires boundary after "mch". "mchc" has trailing "c"
    // (word char) → no boundary → no false match.
    expect(findLoinc("", "MCHC")).not.toBe("785-6");
  });

  // ── CBC panel-scoped LOINC mappings (bug report 2026-05-27) ──────
  // Before v0.9.6, NHI 08011C (CBC basic) and 08013C (CBC w/ diff)
  // were in DISPLAY_FIRST_CODES but had no PANEL_LOINC_MAP entries.
  // So MCV / MCHC / RDW were either shadowed by the global "紅血球"
  // key (→ wrong, RBC LOINC) or fell back to the panel LOINC 24317-0.
  // Differential cell types under 08013C fell to "白血球" → WBC 6690-2.
  // Each expected LOINC below is verified at loinc.org.

  test("v0.9.6 — MCV under 08011C panel → 787-2 (NOT RBC 789-8)", () => {
    expect(findLoinc("08011C", "MCV 平均紅血球容積")).toBe("787-2");
    expect(findLoinc("08011C", "MCV")).toBe("787-2");
  });

  test("v0.9.6 — MCH under 08011C panel → 785-6", () => {
    expect(findLoinc("08011C", "MCH 平均紅血球血色素")).toBe("785-6");
    expect(findLoinc("08011C", "MCH")).toBe("785-6");
  });

  test("v0.9.6 — MCHC under 08011C panel → 786-4 (NOT MCH 785-6, NOT panel 24317-0)", () => {
    expect(findLoinc("08011C", "MCHC 平均紅血球血色素濃度")).toBe("786-4");
    expect(findLoinc("08011C", "MCHC")).toBe("786-4");
  });

  test("v0.9.6 — RDW under 08011C panel → 788-0 (NOT panel fallback)", () => {
    expect(findLoinc("08011C", "RDW")).toBe("788-0");
    expect(findLoinc("08011C", "RDW 紅血球分布寬度")).toBe("788-0");
  });

  test("v0.9.6 — HCT under 08011C panel → 4544-3", () => {
    expect(findLoinc("08011C", "HCT 血球容積比")).toBe("4544-3");
  });

  test("v0.9.6 — HGB under 08011C panel → 718-7", () => {
    expect(findLoinc("08011C", "HGB 血紅素")).toBe("718-7");
  });

  test("v0.9.6 — RBC under 08011C panel → 789-8 (preserved by panel-scoped entry)", () => {
    expect(findLoinc("08011C", "RBC 紅血球")).toBe("789-8");
  });

  test("v0.9.6 — Basophils% under 08013C → 706-2 (NOT WBC 6690-2)", () => {
    expect(findLoinc("08013C", "Basophil 嗜鹼性白血球")).toBe("706-2");
    expect(findLoinc("08013C", "Basophils")).toBe("706-2");
  });

  test("v0.9.6 — Lymphocytes% under 08013C → 736-9 (NOT WBC 6690-2)", () => {
    expect(findLoinc("08013C", "Lymphocyte 淋巴球")).toBe("736-9");
  });

  test("v0.9.6 — Monocytes% under 08013C → 5905-5 (NOT WBC 6690-2)", () => {
    expect(findLoinc("08013C", "Monocyte 單核球")).toBe("5905-5");
  });

  test("v0.9.6 — Neutrophils% / Segmented under 08013C → 770-8 (NOT WBC 6690-2)", () => {
    expect(findLoinc("08013C", "Neutrophil 中性球")).toBe("770-8");
    expect(findLoinc("08013C", "Neutrophilic Segment")).toBe("770-8");
    expect(findLoinc("08013C", "Segmented")).toBe("770-8");
  });

  // ── v0.9.10 — CBC sibling display-vs-billing-code swap (Part 5) ──
  // 嘉基 bundle had a row billed under 08004C (HCT) with display "HGB"
  // and value 13 g/dL — clearly a hemoglobin measurement that the LIS
  // mis-billed or mis-labelled. Before v0.9.10, NHI code won outright
  // → row got LOINC 4544-3 (HCT), SMART app HCT trend column showed
  // 13 (impossible — HCT normal 30-50%, 13 looks like critical anemia
  // / lab error). Promoting CBC sibling codes (08002C/08003C/08004C/
  // 08006C) to DISPLAY_FIRST_CODES lets unambiguous display text
  // ("HGB" / "HCT" / "Hb" / "Ht") override the billing-code swap.
  // Also adds the "Ht" / "H.t." key family which was missing.

  test("v0.9.10 — Ht under 08011C panel → 4544-3 (was 24317-0 fallback)", () => {
    expect(findLoinc("08011C", "Ht")).toBe("4544-3");
    expect(findLoinc("08011C", "H.t.")).toBe("4544-3");
  });

  test("v0.9.10 — HGB billed as 08004C (HCT) → display wins → 718-7", () => {
    // The bug-of-the-day case: hospital LIS labelling swap. Display
    // "HGB" is unambiguous hemoglobin → 718-7 even though NHI billing
    // code 08004C nominally means HCT.
    expect(findLoinc("08004C", "HGB")).toBe("718-7");
    expect(findLoinc("08004C", "Hb")).toBe("718-7");
  });

  test("v0.9.10 — HCT correctly billed (08004C + display 'HCT') still routes to 4544-3", () => {
    expect(findLoinc("08004C", "HCT")).toBe("4544-3");
    expect(findLoinc("08004C", "Ht")).toBe("4544-3");
  });

  test("v0.9.10 — 08004C with empty display still falls back to 4544-3 (NHI_TO_LOINC)", () => {
    // Path C fallback: panel match misses → global misses → NHI_TO_LOINC
    // returns 4544-3 (HCT, the code's nominal meaning).
    expect(findLoinc("08004C", "")).toBe("4544-3");
  });

  test("v0.9.10 — 08003C / 08006C / 08002C also display-first", () => {
    expect(findLoinc("08003C", "HCT")).toBe("4544-3"); // display fixes swap
    expect(findLoinc("08003C", "HGB")).toBe("718-7");
    expect(findLoinc("08003C", "")).toBe("718-7"); // fallback = code's meaning
    expect(findLoinc("08006C", "PLT")).toBe("777-3");
    expect(findLoinc("08002C", "WBC")).toBe("6690-2");
  });

  test("v0.9.10 — 08011C MCV / WBC still resolve correctly (no regression from spread)", () => {
    // Defensive: the CBC_COMPONENT_KEYS spread merge into 08011C
    // panel table must not shadow the indices-specific keys (MCV/
    // MCH/MCHC/RDW) that 08011C has on top of the basic counts.
    expect(findLoinc("08011C", "MCV")).toBe("787-2");
    expect(findLoinc("08011C", "MCHC")).toBe("786-4");
    expect(findLoinc("08011C", "WBC")).toBe("6690-2");
    expect(findLoinc("08011C", "RBC 紅血球")).toBe("789-8");
  });

  // ── v0.11.1 — Coagulation LOINC + QC control bug report ────────
  // SMART app dev report 2026-05-27 #3: 長庚嘉義 coag panel had 3
  // distinct issues, all patient-safety-adjacent.

  test("v0.11.1 — P.T (period-separated) under 08026C → 5902-2 (NOT 6301-6 INR)", () => {
    // Bug: _keywordMatches uses \b...\b regex; the period in "P.T"
    // breaks the implicit word boundary that the existing `pt` key
    // relied on. Without period-separated variants, P.T fell to path
    // C and got 6301-6 (INR) — SMART app would plot 11.9 sec as
    // INR=11.9 (fatal-looking emergency reading).
    expect(findLoinc("08026C", "P.T")).toBe("5902-2");
    expect(findLoinc("08026C", "P.T.")).toBe("5902-2");
    expect(findLoinc("08026C", "p.t")).toBe("5902-2");
  });

  test("v0.11.1 — bare PT and INR still work (regression guard for period-key add)", () => {
    expect(findLoinc("08026C", "PT")).toBe("5902-2");
    expect(findLoinc("08026C", "INR")).toBe("6301-6");
  });

  // ── v0.10.0 — completed deferred panel tables ───────────────────
  // The v0.9.10 audit left 4 panels with TODO(panel) comments
  // (08128B / 09065B / 12204B / 17009B). v0.10.0 activates 3 of them
  // (08128B bone marrow LOINCs uncertain — left as TODO). Same
  // (NHI code, display) → LOINC pattern as Part 6.

  test("v0.10.0 — SPE 09065B fractions resolve to per-fraction LOINCs", () => {
    expect(findLoinc("09065B", "Albumin")).toBe("2865-7");
    expect(findLoinc("09065B", "Alpha-1 globulin")).toBe("2867-3");
    expect(findLoinc("09065B", "Alpha-2 globulin")).toBe("2868-1");
    expect(findLoinc("09065B", "Beta globulin")).toBe("2869-9");
    expect(findLoinc("09065B", "Gamma globulin")).toBe("2871-5");
    expect(findLoinc("09065B", "A/G ratio")).toBe("1759-0");
    expect(findLoinc("09065B", "")).toBe("90991-1"); // fallback to panel LOINC
  });

  test("v0.10.0 — Flow cytometry 12204B CD markers route to per-CD LOINCs", () => {
    expect(findLoinc("12204B", "CD3")).toBe("8124-0");
    expect(findLoinc("12204B", "CD4")).toBe("8123-2");
    expect(findLoinc("12204B", "CD8")).toBe("8128-1");
    expect(findLoinc("12204B", "CD19")).toBe("8118-2");
    expect(findLoinc("12204B", "CD56")).toBe("8125-7");
    expect(findLoinc("12204B", "CD4/CD8")).toBe("54218-3");
    expect(findLoinc("12204B", "")).toBe("20584-9"); // fallback
  });

  test("v0.10.0 — DLCO 17009B sub-items route to per-item LOINCs", () => {
    expect(findLoinc("17009B", "DLCO")).toBe("24341-0");
    expect(findLoinc("17009B", "VA")).toBe("19850-7");
    expect(findLoinc("17009B", "DLCO/VA")).toBe("19911-7");
    expect(findLoinc("17009B", "")).toBe("24341-0"); // fallback (same as DLCO)
  });

  // ── v0.9.10 Part 6 — multi-hospital LOINC audit ─────────────────
  // Single bug report covering N1-partial / N2 / N3 / N7. The architecture
  // is (NHI code, display) → LOINC lookup (already the model for panels,
  // now extended to CBC sibling and urine creatinine codes).

  // N1 partial: 長庚嘉義 sent "血球比容值測定" (7-char form). Existing
  // CBC_COMPONENT_KEYS only had 血球容積比 (容 before 比) and 血比容
  // (no 球); neither matches "血球比容值測定" as CJK substring. Added
  // 血球比容 (4-char) to bridge the gap.
  test("v0.9.10 Part 6 N1 — 血球比容值測定 under 08011C → 4544-3", () => {
    expect(findLoinc("08011C", "血球比容值測定")).toBe("4544-3");
  });

  // N3: 中國北港醫 billed CBC differential under 08002C (WBC count code).
  // Without CBC_DIFF_KEYS spread into 08002C's panel table, every diff
  // row fell to "白血球" → 6690-2 (WBC). Now diff keys are extracted
  // and spread into all CBC sibling panels.
  test("v0.9.10 Part 6 N3 — CBC differential cells under 08002C resolve to /100 leukocytes LOINCs", () => {
    expect(findLoinc("08002C", "Basophils(嗜鹼性白血球)")).toBe("706-2");
    expect(findLoinc("08002C", "Eosinophils(嗜酸性白血球)")).toBe("713-8");
    expect(findLoinc("08002C", "Lymphocytes(淋巴白血球)")).toBe("736-9");
    expect(findLoinc("08002C", "Monocytes(單核白血球)")).toBe("5905-5");
    expect(findLoinc("08002C", "Neutrophilic Segment(嗜中性白血球)")).toBe("770-8");
  });

  test("v0.9.10 Part 6 N3 — defensive: 08013C diff still routes via shared CBC_DIFF_KEYS", () => {
    // After extracting CBC_DIFF_KEYS into a shared const + spreading,
    // 08013C should behave identically to before (regression guard).
    expect(findLoinc("08013C", "Basophil")).toBe("706-2");
    expect(findLoinc("08013C", "Lymphocyte 淋巴球")).toBe("736-9");
    expect(findLoinc("08013C", "Monocyte 單核球")).toBe("5905-5");
    expect(findLoinc("08013C", "Eosinophil")).toBe("713-8");
    expect(findLoinc("08013C", "Neutrophil 中性球")).toBe("770-8");
    expect(findLoinc("08013C", "WBC")).toBe("6690-2");
  });

  // N2: hospital bills both legs of UACR (Microalbumin + Urine Creatinine)
  // under one creatinine code (09016C / 12111C). Without panel routing,
  // Microalbumin rows returned 2161-8 (urine creatinine). Promoted both
  // codes to DISPLAY_FIRST_CODES + added URINE_BIOCHEM_KEYS panel table.
  test("v0.9.10 Part 6 N2 — Micro Albumin under 09016C → 14957-5 (NOT 2161-8 creatinine)", () => {
    expect(findLoinc("09016C", "Micro Albumin:")).toBe("14957-5");
    expect(findLoinc("09016C", "Microalbumin")).toBe("14957-5");
    expect(findLoinc("09016C", "MALB")).toBe("14957-5");
  });

  test("v0.9.10 Part 6 N2 — Creatinine display under 09016C still → 2161-8 (preserves correct case)", () => {
    expect(findLoinc("09016C", "Creatinine")).toBe("2161-8");
    expect(findLoinc("09016C", "尿液肌酸酐")).toBe("2161-8");
  });

  test("v0.9.10 Part 6 N2 — 09016C empty display falls back to 2161-8 (NHI_TO_LOINC)", () => {
    expect(findLoinc("09016C", "")).toBe("2161-8");
  });

  test("v0.9.10 Part 6 N2 — UACR under 09016C → 14959-1 (Microalbumin/Creatinine ratio)", () => {
    expect(findLoinc("09016C", "UACR")).toBe("14959-1");
  });

  // N7: 長庚嘉義 sent display="Neutrophil" with EMPTY coding array — no
  // NHI code for panel routing. Global LOINC_MAP had eosinophil but
  // not neutrophil/monocyte/lymphocyte/basophil. Now added with /100
  // leukocytes form (dominant diff context in Taiwan LIS).
  test("v0.9.10 Part 6 N7 — Neutrophil with no NHI code → 770-8 (NOT null)", () => {
    expect(findLoinc("", "Neutrophil")).toBe("770-8");
    expect(findLoinc("", "Basophil")).toBe("706-2");
    expect(findLoinc("", "Lymphocyte")).toBe("736-9");
    expect(findLoinc("", "Monocyte")).toBe("5905-5");
  });

  test("v0.9.10 Part 6 N7 — global Micro Albumin (no NHI code) → 14957-5", () => {
    expect(findLoinc("", "Micro Albumin")).toBe("14957-5");
    expect(findLoinc("", "Microalbumin")).toBe("14957-5");
  });

  // ── v0.9.10 Part 6 N5/N6 — UCUM unit normalization ──────────────
  // Two non-UCUM unit patterns observed:
  //   N5: full-width ㎡ (U+33A1) — CJK typography character used by
  //       some Taiwan LIS in eGFR area-normalized unit
  //   N6: "gm/dl" / "gm/dL" — non-UCUM "gm" (UCUM uses "g") + lowercase
  //       "l" (UCUM is case-sensitive, must be uppercase "L")
  // _canonicalizeUnit now normalizes these to UCUM-compliant forms.

  test("v0.9.10 Part 6 N5 — eGFR unit 'mL/min/1.73㎡' → 'mL/min/1.73m2'", () => {
    const r = mapObservation(
      { code: "", display: "eGFR", value: 90, unit: "mL/min/1.73㎡", date: "2026-05-27" },
      PATIENT_ID,
    );
    expect(r?.valueQuantity?.unit).toBe("mL/min/1.73m2");
  });

  test("v0.9.10 Part 6 N6 — Hb unit 'gm/dl' → 'g/dL' (UCUM canonical)", () => {
    const r = mapObservation(
      { code: "08003C", display: "Hb", value: 13, unit: "gm/dl", date: "2026-05-27" },
      PATIENT_ID,
    );
    expect(r?.valueQuantity?.unit).toBe("g/dL");
  });

  test("v0.9.10 Part 6 N6 — 'mg/dl' → 'mg/dL' (case-only fix)", () => {
    const r = mapObservation(
      { code: "09015C", display: "Crea", value: 1, unit: "mg/dl", date: "2026-05-27" },
      PATIENT_ID,
    );
    expect(r?.valueQuantity?.unit).toBe("mg/dL");
  });

  test("v0.9.10 Part 6 N6 — already-canonical units pass through unchanged", () => {
    const r = mapObservation(
      { code: "", display: "TG", value: 100, unit: "mg/dL", date: "2026-05-27" },
      PATIENT_ID,
    );
    expect(r?.valueQuantity?.unit).toBe("mg/dL");
  });

  // ── v0.9.10 — Segment (no -ed suffix) variant (bug report Part 4) ─
  // Same root cause as Part 1's Basophil/Eosinophil/Lymphocyte: some
  // hospitals' CBC diff printouts show "Segment" (Taiwan LIS shorthand
  // for segmented neutrophil) which didn't match any panel key and
  // fell back to 57021-8 (panel LOINC). SMART app reported v0.9.9
  // bundles still contained {"text":"Segment", coding=57021-8}.
  test("v0.9.10 — Segment (singular) under 08013C → 770-8 (NOT panel 57021-8)", () => {
    expect(findLoinc("08013C", "Segment")).toBe("770-8");
    expect(findLoinc("08013C", "Segments")).toBe("770-8");
    expect(findLoinc("08013C", "Seg")).toBe("770-8");
    expect(findLoinc("08013C", "Neut. Seg")).toBe("770-8");
  });

  test("v0.9.6 — Eosinophils under 08013C panel → 713-8 (% — diff panel context, NOT count 711-2)", () => {
    // Same display text under different NHI codes resolves differently:
    //   08010C (Eosinophil count, standalone billing) → 711-2 (#/vol)
    //   08013C (CBC w/ diff)                          → 713-8 (%)
    // Verifies panel-scoped table beats both global LOINC_MAP "嗜酸性
    // 白血球":711-2 and global "eosinophil":711-2.
    expect(findLoinc("08013C", "Eosinophil 嗜酸性白血球")).toBe("713-8");
    expect(findLoinc("08013C", "Eosinophils")).toBe("713-8");
    // 08010C standalone still works (NHI direct map, no display lookup).
    expect(findLoinc("08010C", "Eosinophil count")).toBe("711-2");
  });

  test("v0.9.6 — WBC under 08013C panel still routes to 6690-2 (basic count slot in diff printout)", () => {
    expect(findLoinc("08013C", "WBC 白血球")).toBe("6690-2");
  });

  // ── eGFR / Creatinine panel disambiguation (bug report Part 2) ───
  // NHI 09015C bills creatinine; Taiwan labs piggyback eGFR onto the
  // same code as a sub-row distinguished by display text. Without
  // panel-scoped handling, eGFR rows inherited 2160-0 (creatinine LOINC)
  // — patient-safety bug. Each LOINC verified at loinc.org.

  test("v0.9.7 — Creatinine display under 09015C → 2160-0", () => {
    expect(findLoinc("09015C", "Creatinine")).toBe("2160-0");
    expect(findLoinc("09015C", "Crea 肌酸酐")).toBe("2160-0");
    expect(findLoinc("09015C", "Cre")).toBe("2160-0"); // global LOINC_MAP fallback (no panel hit)
  });

  test("v0.9.7 — eGFR display under 09015C → 33914-3 (NOT 2160-0 creatinine)", () => {
    // Bug: SMART app saw CREA=33 mg/dL because eGFR rows were tagged
    // with serum-creatinine LOINC. After panel promotion of 09015C
    // + eGFR keywords in PANEL_LOINC_MAP, every display variant resolves
    // to the eGFR LOINC.
    expect(findLoinc("09015C", "eGFR")).toBe("33914-3");
    expect(findLoinc("09015C", "Estimated GFR")).toBe("33914-3");
    expect(findLoinc("09015C", "Estimated Glomerular Filtration Rate")).toBe("33914-3");
    expect(findLoinc("09015C", "腎絲球過濾率")).toBe("33914-3");
    expect(findLoinc("09015C", "估算腎絲球過濾率")).toBe("33914-3");
  });

  test("v0.9.7 — eGFR keyword still works WITHOUT NHI code (global LOINC_MAP path)", () => {
    // Adult-preventive (IHKE3402) pushes eGFR with code="", falls
    // through to global LOINC_MAP which has "egfr": "33914-3" since
    // the original adaptAdultPreventive implementation.
    expect(findLoinc("", "eGFR")).toBe("33914-3");
  });

  // ── ABG ABE / SBE split (bug report Part 3 C1) ────────────────
  // Previously both were mapped to 11555-0 (generic "Base excess in
  // Arterial blood by calculation"), so SMART apps collapsed them
  // into one column. Now they get distinct LOINCs per loinc.org.

  test("v0.9.8 — ABE under 09041B (ABG panel) → 1925-7 (NOT 11555-0)", () => {
    expect(findLoinc("09041B", "ABE")).toBe("1925-7");
  });

  test("v0.9.8 — SBE under 09041B (ABG panel) → 1927-3 (NOT 11555-0)", () => {
    expect(findLoinc("09041B", "SBE")).toBe("1927-3");
  });

  test("v0.9.8 — ABE and SBE no longer collapse to the same LOINC", () => {
    // Defensive regression — splitting them into different LOINCs is
    // the whole point of the fix. If anyone re-merges them in the
    // future this test will fire.
    expect(findLoinc("09041B", "ABE")).not.toBe(findLoinc("09041B", "SBE"));
  });

  // ── PT/INR panel split (08026C; v0.9.10) ────────────────────────
  // 08026C bills BOTH PT seconds and INR under one code. Before v0.9.10
  // every row inherited LOINC 6301-6 (INR) — warfarin trend views
  // plotted PT seconds and INR on the same series (12 sec vs INR=2.5),
  // creating either gibberish trends or critical-overdose-looking alarms.

  test("v0.9.10 — INR under 08026C → 6301-6 (INR LOINC)", () => {
    expect(findLoinc("08026C", "INR")).toBe("6301-6");
    expect(findLoinc("08026C", "International Normalized Ratio")).toBe("6301-6");
  });

  test("v0.9.10 — PT under 08026C → 5902-2 (NOT 6301-6 INR)", () => {
    expect(findLoinc("08026C", "PT")).toBe("5902-2");
    expect(findLoinc("08026C", "Prothrombin Time")).toBe("5902-2");
    expect(findLoinc("08026C", "凝血酶原時間")).toBe("5902-2");
  });

  test("v0.11.9 — PT Control under 08026C must NOT map to 5894-1 (audit fix)", () => {
    // v0.9.10 originally mapped "PT Control" / "對照" → 5894-1 on the
    // premise that 5894-1 was "Prothrombin time (PT) Control". loinc.org
    // audit (2026-05-29) found 5894-1 is actually "Prothrombin time (PT)
    // actual/Normal" — Property=RelTime, a RATIO, not a control reading.
    // Removed the wrong mapping in v0.11.9; PT Control displays now fall
    // back to the panel's path-B match (bare "PT" → 5902-2) or fall
    // through to NHI-coding-only when no display synonym matches.
    // What matters for patient safety: 5894-1 (ratio LOINC) must NOT
    // be emitted for a reading that's actually QC/control in seconds.
    expect(findLoinc("08026C", "PT Control")).not.toBe("5894-1");
    expect(findLoinc("08026C", "Prothrombin Time Control")).not.toBe("5894-1");
    // Real Taiwan LIS "Control PT" rows are typically caught by the QC
    // filter (looksLikeQcControl); this test asserts the fallback path
    // for the edge cases that slip past.
  });

  test("v0.9.10 — PT and INR no longer collapse to the same LOINC under 08026C", () => {
    expect(findLoinc("08026C", "PT")).not.toBe(findLoinc("08026C", "INR"));
  });

  test("v0.9.10 — empty display under 08026C still falls back to 6301-6 (INR is safer default)", () => {
    // Path C fallback: panel + global table both miss → return
    // NHI_TO_LOINC entry. INR is the more clinically actionable default.
    expect(findLoinc("08026C", "")).toBe("6301-6");
  });

  // ── Body-fluid panel (16008C; v0.9.10) ──────────────────────────
  // 16008C was in DISPLAY_FIRST_CODES but had no PANEL_LOINC_MAP entry,
  // so per-item routing relied on global LOINC_MAP — shorter generic
  // keys (e.g. "wbc" → 6690-2 BLOOD WBC) could shadow body-fluid LOINCs.

  test("v0.9.10 — SF.WBC under 16008C → 26466-3 (Body fluid WBC, NOT 6690-2 Blood WBC)", () => {
    expect(findLoinc("16008C", "SF.WBC")).toBe("26466-3");
    expect(findLoinc("16008C", "WBC")).toBe("26466-3");
  });

  test("v0.9.10 — SF.Neutrophil under 16008C → 10328-6 (Body fluid)", () => {
    expect(findLoinc("16008C", "SF.Neutrophil")).toBe("10328-6");
    expect(findLoinc("16008C", "Neutrophil")).toBe("10328-6");
  });

  test("v0.9.10 — SF.Lympho under 16008C → 13046-8 (Body fluid)", () => {
    expect(findLoinc("16008C", "SF.Lympho")).toBe("13046-8");
    expect(findLoinc("16008C", "Lymphocyte")).toBe("13046-8");
  });

  test("v0.9.10 — SF.Color under 16008C → 5778-6", () => {
    expect(findLoinc("16008C", "SF.Color")).toBe("5778-6");
  });

  test('findLoinc("14032C", "HBsAg") routes through NHI_TO_LOINC and returns correct HBsAg LOINC', () => {
    expect(findLoinc("14032C", "HBsAg")).toBe("5196-1");
  });

  test('findLoinc("14051C", "Anti-HCV") routes through NHI_TO_LOINC and returns correct HCV Ab LOINC', () => {
    expect(findLoinc("14051C", "Anti-HCV")).toBe("13955-0");
  });

  test("Free T4 (NHI 09106C) maps to LOINC 3024-7 (Mass conc — matches Taiwan ng/dL)", () => {
    // Both 3024-7 and 14920-3 are Free T4 (Component=Thyroxine.free on
    // each loinc.org page); they differ only in unit-system:
    //   3024-7  Property MCnc — Mass concentration (ng/dL)
    //   14920-3 Property SCnc — Substance/molar concentration (pmol/L)
    // Taiwan labs report Free T4 in ng/dL (mass), so 3024-7 is the
    // unit-aligned mapping. Commit 9da5e5b had previously switched to
    // 14920-3 on the wrong premise that 3024-7 was Total T4 — see
    // docs/LOINC_AUDIT_2026_05_19.md section F for full evidence.
    expect(findLoinc("09106C", "T4 Free")).toBe("3024-7");
  });

  test("TSH (NHI 09112C) maps to LOINC 3016-3 (Thyrotropin)", () => {
    expect(findLoinc("09112C", "TSH")).toBe("3016-3");
  });

  test("longest-key match: 'ldl-cholesterol' display picks the LDL-C key over the bare 'ldl' key", () => {
    // Both "ldl" (3) and "ldl-cholesterol" (15) match (hyphen creates
    // a word boundary). Longest-match picks the more specific.
    expect(findLoinc("", "LDL Cholesterol")).toBe("13457-7");
  });

  // ── LOINC audit 2026-05-19 — wrong-analyte regressions ────────────
  // Seven NHI codes were silently mapped to LOINCs that mean entirely
  // different analytes (same copy-paste-wrong-LOINC pattern as the
  // FSH/Estradiol and Free T4 bugs). Each bad LOINC verified against
  // loinc.org. These tests assert that re-introducing any of the wrong
  // LOINCs (or restoring the original buggy NHI_TO_LOINC entries) fails
  // CI. See docs/LOINC_AUDIT_2026_05_19.md for full evidence.

  test("CMV IgG (NHI 14004B) does NOT map to 7849-3 (Taenia solium larva IgM Ab)", () => {
    expect(findLoinc("14004B", "CMV IgG")).not.toBe("7849-3");
  });

  test("CMV IgM (NHI 14048B) maps to 7853-5 (Cytomegalovirus IgM Ab in S/P)", () => {
    // Was previously 7850-1 (Taenia solium larva Ab — wrong organism). After
    // the 2026-05-19 audit, 14048B was first removed and then restored to the
    // verified-canonical CMV IgM LOINC 7853-5 (Component=Cytomegalovirus
    // Ab.IgM per loinc.org/7853-5/).
    expect(findLoinc("14048B", "CMV IgM")).toBe("7853-5");
    expect(findLoinc("14048B", "CMV IgM")).not.toBe("7850-1");
  });

  test("TB Culture (NHI 13013C) does NOT map to 31952-5 (Rinderpest virus Ag)", () => {
    expect(findLoinc("13013C", "TB Culture")).not.toBe("31952-5");
  });

  test("Ammonia (NHI 09037C) does NOT map to 1827-5 (Alpha 1 antitrypsin)", () => {
    expect(findLoinc("09037C", "Ammonia")).not.toBe("1827-5");
  });

  test("IgM 單向免疫擴散 (NHI 12028B) does NOT map to 14002-0 (IgM in Cord blood)", () => {
    expect(findLoinc("12028B", "IgM")).not.toBe("14002-0");
  });

  test("IgM 免疫比濁法 (NHI 12029B) does NOT map to 14002-0 (IgM in Cord blood)", () => {
    expect(findLoinc("12029B", "IgM")).not.toBe("14002-0");
  });

  test("Cryptococcus Ag (NHI 12069B) does NOT map to 5132-6 (DNA single strand Ab)", () => {
    expect(findLoinc("12069B", "Cryptococcus Ag")).not.toBe("5132-6");
  });

  test("β2-microglobulin (NHI 12052B) maps to 1952-1 (Beta-2-Microglobulin in S/P)", () => {
    // Was previously 10873-8 which is 'Beta-2-Microglobulin [Mass/time] in
    // 24 hour Urine' (timed urine collection — wrong specimen for a typical
    // Taiwan serum B2M order). After the 2026-05-19 audit, remapped to
    // verified 1952-1 (Component=Beta-2-Microglobulin, Property=MCnc, Serum
    // or Plasma) per loinc.org/1952-1/.
    expect(findLoinc("12052B", "β2-microglobulin")).toBe("1952-1");
    expect(findLoinc("12052B", "β2-microglobulin")).not.toBe("10873-8");
  });
});

describe("mapObservation — source_program → meta.tag", () => {
  // Adapters (e.g. adaptAdultPreventive) set source_program on their
  // intermediate output to mark "this observation came from an NHI
  // screening programme". The mapper surfaces it via Observation.meta.
  // tag so SMART apps can filter / categorize by programme without
  // knowing our internal field names.
  test("emits meta.tag with source-program system when raw.source_program is set", () => {
    const obs = mapObservation(
      {
        code: "09001C",
        display: "Cholesterol",
        value: "199",
        unit: "mg/dL",
        date: "2025-05-18",
        source_program: "adult-preventive",
      },
      "patient-123",
    );
    expect(obs?.meta.tag).toEqual([
      {
        system: "http://nhi-fhir-bridge/source-program",
        code: "adult-preventive",
      },
    ]);
  });

  test("no meta.tag entry when raw.source_program is absent (regular IHKE3409 labs)", () => {
    const obs = mapObservation(
      {
        code: "09027C",
        display: "Crea",
        value: "1.1",
        unit: "mg/dL",
        date: "2025-05-18",
      },
      "patient-123",
    );
    expect(obs?.meta.tag).toBeUndefined();
  });
});
