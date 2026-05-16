/**
 * Condition mapper unit tests.
 * Port of backend/tests/unit/test_condition_mapper.py.
 */

import { describe, expect, test } from "vitest";

import * as systems from "@/fhir/systems";
import { mapCondition, normalizeIcd10Cm } from "@/mapper/condition";

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
    const r = mapCondition(
      { code: "E11.9", display: "DM2", onset_date: "2020-01-15" },
      PATIENT_ID,
    );
    expect(r.onsetDateTime).toBe("2020-01-15T00:00:00+08:00");
  });
});
