/**
 * Tests for src/mapper/parsers.ts.
 *
 * Each case is a sample seen in real NHI lab data. The Python suite tests
 * these indirectly via observation mapper tests; here we pin them down
 * directly so regex-port drift surfaces early.
 */

import { describe, expect, test } from "vitest";

import { parseRange, parseRangeMulti, toUcum, tryParseQuantity } from "@nhi-fhir-bridge/mapper";

describe("toUcum", () => {
  test("pass-through canonical UCUM", () => {
    expect(toUcum("mg/dL")).toBe("mg/dL");
    expect(toUcum("%")).toBe("%");
    expect(toUcum("U/L")).toBe("U/L");
  });

  test("fullwidth ％ → %", () => {
    expect(toUcum("％")).toBe("%");
  });

  test("Eq → eq case folding", () => {
    expect(toUcum("mEq/L")).toBe("meq/L");
    expect(toUcum("meq/l")).toBe("meq/L");
  });

  test("mmHg → mm[Hg]", () => {
    expect(toUcum("mmHg")).toBe("mm[Hg]");
    expect(toUcum("MMHG")).toBe("mm[Hg]");
  });

  test("placeholder 無/empty/dash → null (omit Quantity.code)", () => {
    expect(toUcum("無")).toBeNull();
    expect(toUcum("")).toBeNull();
    expect(toUcum("—")).toBeNull();
    expect(toUcum("-")).toBeNull();
  });

  test("null/undefined input", () => {
    expect(toUcum(null)).toBeNull();
    expect(toUcum(undefined)).toBeNull();
  });
});

describe("tryParseQuantity", () => {
  test("plain numeric", () => {
    const q = tryParseQuantity("12.5", "mg/dL");
    expect(q).toEqual({
      value: 12.5,
      system: "http://unitsofmeasure.org",
      unit: "mg/dL",
      code: "mg/dL",
    });
  });

  test("comparator > stripped to comparator field", () => {
    const q = tryParseQuantity("> 40.0", "U/L");
    expect(q?.value).toBe(40);
    expect(q?.comparator).toBe(">");
  });

  test("comma-thousands stripped", () => {
    const q = tryParseQuantity("1,234.5", "ng/mL");
    expect(q?.value).toBe(1234.5);
  });

  test("fullwidth ＞ normalised", () => {
    const q = tryParseQuantity("＞ 40", "U/L");
    expect(q?.comparator).toBe(">");
    expect(q?.value).toBe(40);
  });

  test("non-numeric returns null", () => {
    expect(tryParseQuantity("Negative", "")).toBeNull();
    expect(tryParseQuantity("見備註", "")).toBeNull();
  });

  test("empty unit omits unit and code", () => {
    const q = tryParseQuantity("42", "");
    expect(q?.unit).toBeUndefined();
    expect(q?.code).toBeUndefined();
    expect(q?.value).toBe(42);
  });

  test("unit '無' keeps human label but drops UCUM code", () => {
    const q = tryParseQuantity("42", "無");
    expect(q?.unit).toBe("無");
    expect(q?.code).toBeUndefined();
  });

  // ── Packed-value patterns (bug report 2026-05-27 Part 2) ────────
  // Taiwan LIS sometimes packs a number + parenthetical annotation
  // into one field. Without this support these collapsed to valueString
  // and lost numeric semantics — trend charts / abnormal-flag deriva-
  // tion / AI tool reasoning all silently broke.

  test("v0.9.7 — leading-numeric + parens: '33 (stage3:30-59)' → 33", () => {
    // eGFR + CKD-stage annotation pattern.
    const q = tryParseQuantity("33 (stage3:30-59)", "mL/min/1.73m2");
    expect(q?.value).toBe(33);
    expect(q?.unit).toBe("mL/min/1.73m2");
  });

  test("v0.9.7 — leading-numeric directly adjacent to parens: '2.3(36.1%)' → 2.3", () => {
    // Albumin absolute g/dL + albumin fraction % pattern. No space
    // before paren; tests indexOf-based slicing not whitespace-bound.
    const q = tryParseQuantity("2.3(36.1%)", "g/dL");
    expect(q?.value).toBe(2.3);
  });

  test("v0.9.7 — non-numeric leading + parens: '4+ (2000)' → 2000 (fallback to parens)", () => {
    // Urine glucose dipstick grade + quantitative mg/dL. Leading "4+"
    // fails numeric parse, fallback extracts "2000" from parens.
    const q = tryParseQuantity("4+ (2000)", "mg/dL");
    expect(q?.value).toBe(2000);
    expect(q?.unit).toBe("mg/dL");
  });

  test("v0.9.7 — dipstick + UACR: '1+ (80)' → 80 (fallback to parens)", () => {
    const q = tryParseQuantity("1+ (80)", "mg/g");
    expect(q?.value).toBe(80);
  });

  test("v0.9.7 — comparator + parens: '> 33 (stage3)' still parses 33", () => {
    // Verifies comparator-strip runs BEFORE parens-handling.
    const q = tryParseQuantity("> 33 (stage3)", "mL/min/1.73m2");
    expect(q?.value).toBe(33);
    expect(q?.comparator).toBe(">");
  });

  test("v0.9.7 — fully non-numeric still returns null: '1:20(-)'", () => {
    // Titer pattern (1:20 is a ratio not a single number); neither
    // leading nor parens content parses → caller falls back to
    // valueString as before. NOT a regression — keeps existing
    // qualitative-handling intact.
    expect(tryParseQuantity("1:20(-)", "")).toBeNull();
  });

  test("v0.9.7 — plain numeric unaffected by new logic", () => {
    // Belt-and-suspenders: confirm the regular happy path didn't
    // regress while adding the paren-stripping branch.
    expect(tryParseQuantity("1.94", "mg/dL")?.value).toBe(1.94);
    expect(tryParseQuantity("100", "%")?.value).toBe(100);
  });
});

describe("parseRange — bracketed [low][high]", () => {
  test("two numeric brackets", () => {
    const r = parseRange("[3.89][26.8]", "mg/dL");
    expect(r?.low?.value).toBe(3.89);
    expect(r?.high?.value).toBe(26.8);
    expect(r?.text).toBe("[3.89][26.8]");
  });

  test("empty high bracket → only low", () => {
    const r = parseRange("[40][]", "U/L");
    expect(r?.low?.value).toBe(40);
    expect(r?.high).toBeUndefined();
  });

  test("dash inside low bracket splits into low+high", () => {
    const r = parseRange("[6.4 - 8.3][]", "g/dL");
    expect(r?.low?.value).toBe(6.4);
    expect(r?.high?.value).toBe(8.3);
  });

  test("comparator inside bracket", () => {
    const r = parseRange("[≧60][]", "mL/min/1.73m2");
    expect(r?.low?.value).toBe(60);
  });

  test("'Normal (X)' qualitative implies cutoff as high bound", () => {
    const r = parseRange("[Normal (1.10)][]", "");
    expect(r?.high?.value).toBe(1.1);
  });

  test("'Negative' (qualitative) → text-only entry, brackets stripped (v0.9.8)", () => {
    // Bug report 2026-05-27 Part 3 C3: VGH bracket convention
    // "[Negative][]" was leaking the brackets into referenceRange.text.
    // Now the qualitative value gets unwrapped — SMART apps consume
    // "Negative" directly instead of having to parse VGH-internal
    // bracket syntax.
    const r = parseRange("[Negative][]", "");
    expect(r?.text).toBe("Negative");
    expect(r?.low).toBeUndefined();
    expect(r?.high).toBeUndefined();
  });

  test("v0.9.8 — '[Yellow][]' qualitative → 'Yellow'", () => {
    const r = parseRange("[Yellow][]", "");
    expect(r?.text).toBe("Yellow");
  });

  test("v0.9.8 — '[Nonreactive][]' qualitative → 'Nonreactive'", () => {
    const r = parseRange("[Nonreactive][]", "");
    expect(r?.text).toBe("Nonreactive");
  });

  test("v0.9.8 — '[][Random Urine＜ 1.9]' → appliesTo + high", () => {
    // Bug report Part 3 C5: specimen + threshold packed into a bracket
    // side. Should split into structured appliesTo (specimen) + high
    // (numeric threshold from comparator).
    const r = parseRange("[][Random Urine＜ 1.9]", "mg/g");
    expect(r?.appliesTo).toEqual([{ text: "Random Urine" }]);
    expect(r?.high?.value).toBe(1.9);
  });

  test("v0.9.8 — '[][plasma ≦0.04]' → appliesTo + high", () => {
    const r = parseRange("[][plasma ≦0.04]", "mg/dL");
    expect(r?.appliesTo).toEqual([{ text: "plasma" }]);
    expect(r?.high?.value).toBe(0.04);
  });

  test("v0.9.8 — '正常' is an interpretation, not a range", () => {
    // Bug report Part 3 C4: free-text result phrase smuggled into the
    // reference_range field. parseRange flags it with interpretationText
    // so observation mapper routes it to .interpretation instead.
    const r = parseRange("正常", "");
    expect(r?.interpretationText).toBe("正常");
    expect(r?.low).toBeUndefined();
    expect(r?.high).toBeUndefined();
  });

  test("v0.9.8 — '異常，建議：請洽詢醫師' is an interpretation", () => {
    const r = parseRange("異常，建議：請洽詢醫師", "");
    expect(r?.interpretationText).toBe("異常，建議：請洽詢醫師");
  });
});

describe("parseRange — dash range without brackets", () => {
  test("'70-100' → low+high", () => {
    const r = parseRange("70-100", "mg/dL");
    expect(r?.low?.value).toBe(70);
    expect(r?.high?.value).toBe(100);
  });

  test("'70~100' tilde", () => {
    const r = parseRange("70~100", "mg/dL");
    expect(r?.low?.value).toBe(70);
    expect(r?.high?.value).toBe(100);
  });
});

describe("parseRange — single-sided comparator", () => {
  test("'> 40'", () => {
    const r = parseRange("> 40", "U/L");
    expect(r?.low?.value).toBe(40);
    expect(r?.high).toBeUndefined();
  });

  test("'< 0.5'", () => {
    const r = parseRange("< 0.5", "mg/dL");
    expect(r?.high?.value).toBe(0.5);
    expect(r?.low).toBeUndefined();
  });

  test("fullwidth '≧60'", () => {
    const r = parseRange("≧60", "mL/min");
    expect(r?.low?.value).toBe(60);
  });
});

describe("parseRange — qualitative / complex", () => {
  test("plain 'Negative' returns text-only", () => {
    const r = parseRange("Negative", "");
    expect(r?.text).toBe("Negative");
    expect(r?.low).toBeUndefined();
    expect(r?.high).toBeUndefined();
  });

  test("empty input → null", () => {
    expect(parseRange("", "")).toBeNull();
    expect(parseRange("   ", "")).toBeNull();
  });
});

describe("parseRangeMulti — sex-stratified", () => {
  test("'[男:13.7 女:11.1][男:17.0 女:15.0]'", () => {
    const rs = parseRangeMulti("[男:13.7 女:11.1][男:17.0 女:15.0]", "g/dL");
    expect(rs).toHaveLength(2);
    const male = rs.find((r) => r.appliesTo?.[0]?.coding?.[0]?.code === "male");
    const female = rs.find((r) => r.appliesTo?.[0]?.coding?.[0]?.code === "female");
    expect(male?.low?.value).toBe(13.7);
    expect(male?.high?.value).toBe(17);
    expect(female?.low?.value).toBe(11.1);
    expect(female?.high?.value).toBe(15);
  });

  test("non-sex-stratified falls back to single entry", () => {
    const rs = parseRangeMulti("[3.89][26.8]", "mg/dL");
    expect(rs).toHaveLength(1);
    expect(rs[0]?.low?.value).toBe(3.89);
    expect(rs[0]?.high?.value).toBe(26.8);
  });

  test("dedup when 男 and 男性 both appear", () => {
    // Should emit only one "male" entry — later one with same FHIR code wins.
    const rs = parseRangeMulti("[男:13.7 男性:14.0][]", "g/dL");
    const maleEntries = rs.filter((r) => r.appliesTo?.[0]?.coding?.[0]?.code === "male");
    expect(maleEntries).toHaveLength(1);
  });

  test("empty input → []", () => {
    expect(parseRangeMulti("", "")).toEqual([]);
  });
});
