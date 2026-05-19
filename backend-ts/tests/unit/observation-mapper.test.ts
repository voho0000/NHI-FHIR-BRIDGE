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

  test("findLoinc(\"14032C\", \"HBsAg\") routes through NHI_TO_LOINC and returns correct HBsAg LOINC", () => {
    expect(findLoinc("14032C", "HBsAg")).toBe("5196-1");
  });

  test("findLoinc(\"14051C\", \"Anti-HCV\") routes through NHI_TO_LOINC and returns correct HCV Ab LOINC", () => {
    expect(findLoinc("14051C", "Anti-HCV")).toBe("13955-0");
  });

  test("longest-key match: 'ldl-cholesterol' display picks the LDL-C key over the bare 'ldl' key", () => {
    // Both "ldl" (3) and "ldl-cholesterol" (15) match (hyphen creates
    // a word boundary). Longest-match picks the more specific.
    expect(findLoinc("", "LDL Cholesterol")).toBe("13457-7");
  });
});
