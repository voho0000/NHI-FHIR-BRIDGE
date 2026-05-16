/**
 * Patient mapper unit tests. Port of backend/tests/unit/test_patient_mapper.py.
 */

import { describe, expect, test } from "vitest";

import * as systems from "@/fhir/systems";
import { looksLikeTwNationalId, mapPatient } from "@/mapper/patient";

const PATIENT_ID = "A123456789";

describe("looksLikeTwNationalId", () => {
  test("valid male ID", () => {
    expect(looksLikeTwNationalId("A123456789")).toBe(true);
  });
  test("valid female ID", () => {
    expect(looksLikeTwNationalId("B223456789")).toBe(true);
  });
  test("lowercase input accepted", () => {
    expect(looksLikeTwNationalId("a123456789")).toBe(true);
  });
  test("too short", () => {
    expect(looksLikeTwNationalId("A12345678")).toBe(false);
  });
  test("missing letter", () => {
    expect(looksLikeTwNationalId("1234567890")).toBe(false);
  });
  test("invalid second char (must be 1 or 2)", () => {
    expect(looksLikeTwNationalId("A523456789")).toBe(false);
  });
  test("empty string", () => {
    expect(looksLikeTwNationalId("")).toBe(false);
  });
  test("null/undefined", () => {
    expect(looksLikeTwNationalId(null)).toBe(false);
    expect(looksLikeTwNationalId(undefined)).toBe(false);
  });
});

describe("mapPatient", () => {
  test("minimum shape", () => {
    const r = mapPatient({ identifier: PATIENT_ID, name: "陳大文" });
    expect(r.resourceType).toBe("Patient");
    expect(r.id).toBe(PATIENT_ID);
    expect(r.name.some((n: any) => n.text === "陳大文")).toBe(true);
  });

  test("TW national ID uses canonical system", () => {
    const r = mapPatient({ identifier: PATIENT_ID, name: "陳大文" });
    const ids = r.identifier;
    expect(ids.some((i: any) => i.system === systems.TW_NATIONAL_ID)).toBe(true);
  });

  test("non-TW ID uses local MRN system", () => {
    const r = mapPatient({ identifier: "P001", name: "Foo" });
    const ids = r.identifier;
    expect(ids.some((i: any) => i.system === systems.HIS_LOCAL_PATIENT_MRN)).toBe(true);
  });

  test("birth date passes through", () => {
    const r = mapPatient({
      identifier: PATIENT_ID,
      name: "陳大文",
      birthDate: "1980-05-15",
    });
    expect(r.birthDate).toBe("1980-05-15");
  });

  test("missing ID falls back to 'unknown'", () => {
    const r = mapPatient({ name: "Foo" });
    expect(r.id).toBe("unknown");
  });

  test("CJK name splits to family/given", () => {
    const r = mapPatient({ identifier: PATIENT_ID, name: "陳大文" });
    expect(r.name[0].family).toBe("陳");
    expect(r.name[0].given).toEqual(["大文"]);
  });

  test("Western name splits to family/given", () => {
    const r = mapPatient({ identifier: "P001", name: "John Doe" });
    expect(r.name[0].family).toBe("Doe");
    expect(r.name[0].given).toEqual(["John"]);
  });
});
