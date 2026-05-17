/**
 * Patient mapper unit tests. Port of backend/tests/unit/test_patient_mapper.py.
 */

import { describe, expect, test } from "vitest";

import * as systems from "@nhi-fhir-bridge/mapper";
import { looksLikeTwNationalId, mapPatient, maskId, maskName } from "@nhi-fhir-bridge/mapper";

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
    // mapPatient transcribes the name as-given — the caller decides
    // whether to pre-mask before calling.
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

  test("CJK name splits to family/given (raw, no internal masking)", () => {
    const r = mapPatient({ identifier: PATIENT_ID, name: "陳大文" });
    expect(r.name[0].text).toBe("陳大文");
    expect(r.name[0].family).toBe("陳");
    expect(r.name[0].given).toEqual(["大文"]);
  });

  test("Western name splits to family/given (raw)", () => {
    const r = mapPatient({ identifier: "P001", name: "John Doe" });
    expect(r.name[0].text).toBe("John Doe");
    expect(r.name[0].family).toBe("Doe");
    expect(r.name[0].given).toEqual(["John"]);
  });

  test("caller can pre-mask the name (mapper transcribes verbatim)", () => {
    const r = mapPatient({ identifier: PATIENT_ID, name: "陳O文" });
    expect(r.name[0].text).toBe("陳O文");
    expect(r.name[0].family).toBe("陳");
    expect(r.name[0].given).toEqual(["O文"]);
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

describe("maskId", () => {
  test("Taiwan national ID (1+9): first 6 visible, last 4 masked", () => {
    expect(maskId("P120740866")).toBe("P12074****");
    expect(maskId("A123456789")).toBe("A12345****");
    expect(maskId("B223456789")).toBe("B22345****");
  });
  test("custom mask char (X for filenames)", () => {
    expect(maskId("P120740866", "X")).toBe("P12074XXXX");
  });
  test("auto-XXXXXXXX placeholders pass through unchanged", () => {
    expect(maskId("auto-c7bdf544")).toBe("auto-c7bdf544");
  });
  test("non-TWID identifiers (mid-length): keep first 2 + last 2", () => {
    expect(maskId("ABC1234567")).toBe("AB******67");
  });
  test("very short identifiers pass through", () => {
    expect(maskId("A1")).toBe("A1");
    expect(maskId("ABC")).toBe("ABC");
  });
  test("empty / null / undefined pass through", () => {
    expect(maskId("")).toBe("");
    expect(maskId(null)).toBe("");
    expect(maskId(undefined)).toBe("");
  });
  test("trims whitespace first", () => {
    expect(maskId("  P120740866  ")).toBe("P12074****");
  });
});
