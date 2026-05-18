/**
 * Condition mapper unit tests.
 * Port of backend/tests/unit/test_condition_mapper.py.
 */

import { describe, expect, test } from "vitest";

import * as systems from "@nhi-fhir-bridge/mapper";
import { mapCondition, normalizeIcd10Cm } from "@nhi-fhir-bridge/mapper";

const PATIENT_ID = "A123456789";

describe("normalizeIcd10Cm", () => {
  test.each([
    ["E1122", "E11.22"],
    ["M47892", "M47.892"],
    ["S0993XA", "S09.93XA"],
    ["M19271", "M19.271"],
  ])("inserts dot: %s → %s", (input, expected) => {
    expect(normalizeIcd10Cm(input)).toBe(expected);
  });

  test("passes through 3-char category", () => {
    expect(normalizeIcd10Cm("E11")).toBe("E11");
  });
  test("passes through already dotted", () => {
    expect(normalizeIcd10Cm("E11.22")).toBe("E11.22");
  });
  test("lowercase normalised", () => {
    expect(normalizeIcd10Cm("e1122")).toBe("E11.22");
  });
  test("empty input", () => {
    expect(normalizeIcd10Cm("")).toBe("");
  });
  test("invalid category passes through", () => {
    expect(normalizeIcd10Cm("12322")).toBe("12322");
  });
});

describe("mapCondition", () => {
  test("basic shape", () => {
    const r = mapCondition(
      {
        code: "E11.9",
        display: "Type 2 diabetes mellitus",
        system: "icd-10-cm",
        onset_date: "2020-01-01",
      },
      PATIENT_ID,
    );
    expect(r.resourceType).toBe("Condition");
    expect(r.subject.reference).toBe(`Patient/${PATIENT_ID}`);
  });

  test("ICD-10-CM code is normalised", () => {
    const r = mapCondition(
      { code: "E1122", display: "DM2 w/ neph", system: "icd-10-cm" },
      PATIENT_ID,
    );
    const coding = r.code.coding[0];
    expect(coding.code).toBe("E11.22");
    expect(coding.system).toBe(systems.ICD_10_CM);
  });

  test("default clinical status 'active'", () => {
    const r = mapCondition({ code: "E11.9", display: "DM2" }, PATIENT_ID);
    expect(r.clinicalStatus.coding[0].code).toBe("active");
  });

  test("explicit 'resolved' status", () => {
    const r = mapCondition(
      { code: "E11.9", display: "DM2", clinical_status: "resolved" },
      PATIENT_ID,
    );
    expect(r.clinicalStatus.coding[0].code).toBe("resolved");
  });

  test("onset date ISO with TW timezone", () => {
    const r = mapCondition({ code: "E11.9", display: "DM2", onset_date: "2020-01-15" }, PATIENT_ID);
    expect(r.onsetDateTime).toBe("2020-01-15T00:00:00+08:00");
  });

  test("category=problem-list-item lands in Condition.category[].coding (for SMART/IPS problem list)", () => {
    const r = mapCondition(
      {
        display: "攝護腺惡性腫瘤",
        category: "problem-list-item",
        onset_date: "2022-11-16",
      },
      PATIENT_ID,
    );
    expect(r.category).toHaveLength(1);
    expect(r.category[0].coding[0]).toEqual({
      system: "http://terminology.hl7.org/CodeSystem/condition-category",
      code: "problem-list-item",
    });
  });

  test("no category key when raw.category absent", () => {
    const r = mapCondition({ code: "E11.9", display: "DM2" }, PATIENT_ID);
    expect(r.category).toBeUndefined();
  });

  test("recordedDate maps with TW timezone when present", () => {
    const r = mapCondition({ display: "x", recorded_date: "2022-11-16" }, PATIENT_ID);
    expect(r.recordedDate).toBe("2022-11-16T00:00:00+08:00");
  });

  test("stableId falls back to display when no code (two same-day code-less rows must not collide)", () => {
    // Catastrophic-illness rows carry only a Chinese narrative, no ICD code.
    // Two such rows with different display + same date must hash differently.
    const a = mapCondition({ display: "Cancer A", onset_date: "2022-01-01" }, PATIENT_ID);
    const b = mapCondition({ display: "Cancer B", onset_date: "2022-01-01" }, PATIENT_ID);
    expect(a.id).not.toBe(b.id);
  });
});
