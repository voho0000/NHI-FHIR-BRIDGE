/**
 * Patient mapper unit tests. Port of backend/tests/unit/test_patient_mapper.py.
 */

import { describe, expect, test } from "vitest";

import * as systems from "@nhi-fhir-bridge/mapper";
import { looksLikeTwNationalId, mapPatient, maskName } from "@nhi-fhir-bridge/mapper";

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
    // Patient.name.text is the masked form (privacy by default).
    expect(r.name.some((n: any) => n.text === "陳O文")).toBe(true);
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

  test("CJK name is partial-masked then split to family/given", () => {
    const r = mapPatient({ identifier: PATIENT_ID, name: "陳大文" });
    // text is masked, family preserves the original surname (= masked[0]),
    // given is the masked tail.
    expect(r.name[0].text).toBe("陳O文");
    expect(r.name[0].family).toBe("陳");
    expect(r.name[0].given).toEqual(["O文"]);
  });

  test("Western name is partial-masked then split to family/given", () => {
    const r = mapPatient({ identifier: "P001", name: "John Doe" });
    // "John Doe" → mask 2-token Western to "John D***"
    expect(r.name[0].text).toBe("John D***");
    expect(r.name[0].family).toBe("D***");
    expect(r.name[0].given).toEqual(["John"]);
  });
});

describe("maskName", () => {
  test("CJK 3-char keeps first + last, middle O", () => {
    expect(maskName("郭一新")).toBe("郭O新");
    expect(maskName("陳大文")).toBe("陳O文");
  });
  test("CJK 4-char produces two O's in the middle", () => {
    expect(maskName("林郭一新")).toBe("林OO新");
  });
  test("CJK 5-char produces three O's", () => {
    expect(maskName("中島健次郎")).toBe("中OOO郎");
  });
  test("CJK 2-char keeps first, replaces second with O", () => {
    expect(maskName("王明")).toBe("王O");
  });
  test("CJK 1-char passes through (nothing to mask)", () => {
    expect(maskName("王")).toBe("王");
  });
  test("Western 2-token name partial-masks the last", () => {
    expect(maskName("John Smith")).toBe("John S***");
  });
  test("Western 3+-token replaces middles with ***", () => {
    expect(maskName("John Q Smith")).toBe("John *** Smith");
    expect(maskName("Mary Anne Bell Jones")).toBe("Mary *** *** Jones");
  });
  test("empty / Unknown / null pass through", () => {
    expect(maskName("")).toBe("");
    expect(maskName("Unknown")).toBe("Unknown");
    expect(maskName(null)).toBe("");
    expect(maskName(undefined)).toBe("");
  });
  test("trims whitespace first", () => {
    expect(maskName("  郭一新  ")).toBe("郭O新");
  });
});
