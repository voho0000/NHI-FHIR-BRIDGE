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
    expect(toUcum("10*3/uL")).toBe("10*3/uL");
  });

  // hardening: a non-override CJK unit can't be valid UCUM → null, and the
  // Quantity builder then declares NO UCUM system on it (was mislabeling).
  test("non-ASCII / CJK unit → null + no false UCUM on Quantity", () => {
    expect(toUcum("個")).toBeNull();
    expect(toUcum("陰性")).toBeNull();
    expect(tryParseQuantity("5", "個")).toEqual({ value: 5, unit: "個" });
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

// v1.1.0 — UCUM normalisation expanded. Every target code below is web-verified
// against NLM example-UCUM-Codes v1.4 + HL7 terminology ucum-common (2026-06-30).
describe("toUcum — v1.1.0 web-verified mappings", () => {
  test("cell counts → 10*N/uL (thousand / ten-thousand / million)", () => {
    expect(toUcum("K/μL")).toBe("10*3/uL"); // μ = U+03BC (Greek mu)
    expect(toUcum("K/µL")).toBe("10*3/uL"); // µ = U+00B5 (micro sign)
    expect(toUcum("k/μL")).toBe("10*3/uL");
    expect(toUcum("*1000/uL")).toBe("10*3/uL");
    expect(toUcum("1000/uL")).toBe("10*3/uL");
    expect(toUcum("x10^3 /uL")).toBe("10*3/uL");
    expect(toUcum("x10^4 /uL")).toBe("10*4/uL");
    expect(toUcum("M/μL")).toBe("10*6/uL");
    expect(toUcum("*10^6/uL")).toBe("10*6/uL");
    expect(toUcum("million/uL")).toBe("10*6/uL");
  });

  test("micro-sign normalised → bare /μL becomes valid /uL with no override", () => {
    expect(toUcum("/μL")).toBe("/uL");
    expect(toUcum("ng/µL")).toBe("ng/uL");
  });

  test("Pg (petagram) → pg (picogram); MCH/MCHC descriptive suffixes", () => {
    expect(toUcum("Pg")).toBe("pg");
    expect(toUcum("pg/Cell")).toBe("pg");
    expect(toUcum("gHb/dL")).toBe("g/dL");
  });

  test("°C → Cel; mmHG mixed case → mm[Hg]", () => {
    expect(toUcum("°C")).toBe("Cel");
    expect(toUcum("mmHG")).toBe("mm[Hg]");
  });

  test("eGFR variants → mL/min/1.73.m2 (dot before m2)", () => {
    expect(toUcum("mL/min/1.73m2")).toBe("mL/min/1.73.m2");
    expect(toUcum("ml/min/1.73m2")).toBe("mL/min/1.73.m2");
    expect(toUcum("mL/min/1.73M2")).toBe("mL/min/1.73.m2");
    expect(toUcum("mL/min/1.73 m^2")).toBe("mL/min/1.73.m2");
  });

  test("arbitrary indices / placeholders we can't faithfully map → null", () => {
    expect(toUcum(".")).toBeNull();
    expect(toUcum("OPF")).toBeNull();
    expect(toUcum("COI")).toBeNull();
    expect(toUcum("E.U/dL")).toBeNull();
  });

  test("valid-but-odd UCUM left untouched (mm/L for HCO3 — units never modified)", () => {
    expect(toUcum("mm/L")).toBe("mm/L");
  });

  test("reference-range bound carries the same validated UCUM code as the value", () => {
    // makeQuantity now routes through toUcum → a K/μL bound gets code 10*3/uL.
    expect(tryParseQuantity("7.5", "K/μL")).toEqual({
      value: 7.5,
      unit: "K/μL",
      system: "http://unitsofmeasure.org",
      code: "10*3/uL",
    });
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

  // v0.11.7 — FLIPPED from v0.9.7 behavior. Dipstick grade patterns
  // ("4+", "1+", "Trace", etc.) now return null so caller emits
  // valueString preserving the raw "4+ (2000)" string. The grade is
  // the clinically meaningful data; the parenthesised number is just
  // a lab-supplied equivalence estimate. Bug 2026-05-28: MediPrisma
  // showed "Glucose 2000 mg/dL [Negative]" — clinically alarming
  // false-positive because the actual reading was "4+ (2000)".

  test("v0.11.7 — dipstick '4+ (2000)' returns null (preserves valueString)", () => {
    // Urine glucose dipstick semi-quantitative. Caller will emit raw
    // string as valueString so SMART app shows "4+ (2000)" intact
    // instead of just "2000 mg/dL".
    const q = tryParseQuantity("4+ (2000)", "mg/dL");
    expect(q).toBeNull();
  });

  test("v0.11.7 — dipstick '1+ (80)' returns null (preserves valueString)", () => {
    const q = tryParseQuantity("1+ (80)", "mg/g");
    expect(q).toBeNull();
  });

  test("v0.11.7 — dipstick 'Trace (15)' returns null (preserves valueString)", () => {
    const q = tryParseQuantity("Trace (15)", "mg/dL");
    expect(q).toBeNull();
  });

  test("v0.11.7 — eGFR '33 (stage3:30-59)' still extracts 33 (NOT a dipstick)", () => {
    // Regression guard: the v0.11.7 dipstick check must not break the
    // v0.9.7 eGFR pattern where leading IS a real numeric value and
    // parens is just an interpretation annotation.
    const q = tryParseQuantity("33 (stage3:30-59)", "mL/min/1.73m2");
    expect(q?.value).toBe(33);
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

  // v1.0.17 — age-stratified ranges keep the full original text but emit NO
  // numeric low/high (the old dash-range fallback grabbed the "0-14" age bracket
  // as a bogus 0-14 range). See parsers.ts RR_AGE_STRATIFIED.
  test("age-stratified range → text-only, no numeric low/high", () => {
    const r = parseRange(
      "[[0-14d]144-450 [15-30d]248-586 [≧18y]150-378][[0-14d]144-450 [≧18y]150-378]",
      "K/μL",
    );
    expect(r?.low).toBeUndefined();
    expect(r?.high).toBeUndefined();
    expect(r?.text).toContain("≧18y");
  });

  test("≧18y-only age bracket → text-only (Band case [[≧18y]0-5][...])", () => {
    const r = parseRange("[[≧18y]0-5][[≧18y]0-5]", "%");
    expect(r?.low).toBeUndefined();
    expect(r?.high).toBeUndefined();
  });

  test("plain numeric brackets do NOT false-trigger the age-strat guard", () => {
    const r = parseRange("[41][53]", "%");
    expect(r?.low?.value).toBe(41);
    expect(r?.high?.value).toBe(53);
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

describe("parseRange — P2-a doubled-bracket .text collapse (display precision)", () => {
  // CLAUDE.md rule #8 silent-bug gate: NHI echoes the same value into both
  // the low- and high-bound bracket. The doubling is an encoding artifact;
  // .text should surface the single inner value (cleaner display) while the
  // structured low/high extraction stays unchanged. Add a row here every
  // time a new doubled-bracket shape is seen in a real bundle.
  test.each([
    // [rawRange, unit, expectedText]
    ["[(-)][(-)]", "", "(-)"],
    ["[0.92 ~ 1.68][0.92 ~ 1.68]", "", "0.92 ~ 1.68"],
    ["[0.270~4.20][0.270~4.20]", "", "0.270~4.20"],
    ["[Negative][Negative]", "", "Negative"],
  ] as const)("'%s' → text '%s'", (raw, unit, expectedText) => {
    const r = parseRange(raw, unit);
    expect(r?.text).toBe(expectedText);
  });

  test("doubled numeric dash range still extracts structured low/high", () => {
    // The collapse only touches .text — structured bounds must survive so
    // SMART apps that read low/high (not text) are unaffected.
    const r = parseRange("[0.92 ~ 1.68][0.92 ~ 1.68]", "");
    expect(r?.text).toBe("0.92 ~ 1.68");
    expect(r?.low?.value).toBe(0.92);
    expect(r?.high?.value).toBe(1.68);
  });

  test("qualitative doubled bracket '[(-)][(-)]' is text-only", () => {
    const r = parseRange("[(-)][(-)]", "");
    expect(r?.text).toBe("(-)");
    expect(r?.low).toBeUndefined();
    expect(r?.high).toBeUndefined();
  });

  test("genuine low≠high pair is NOT collapsed (only identical sides)", () => {
    const r = parseRange("[70][100]", "mg/dL");
    expect(r?.text).toBe("[70][100]");
    expect(r?.low?.value).toBe(70);
    expect(r?.high?.value).toBe(100);
  });
});

describe("parseRange — P3 HTML-escaped comparator decode (display + structured)", () => {
  // CLAUDE.md rule #8 silent-bug gate: NHI sometimes HTML-escapes the
  // comparator in the reference-range field ("[&lt;200][]" instead of
  // "[<200][]"). Pre-fix this silently (a) printed "&lt;" gibberish on
  // referenceRange.text AND (b) dropped the structured referenceRange.high/low
  // — the very same value parses fine when shipped as full-width "＜200".
  // Decoding restores both (faithful-transport rule #6: un-escaping a transport
  // encoding is not fabrication). Add a row here every time a new escaped shape
  // appears in a real bundle.
  test.each([
    // [rawRange, unit, expectedText, expectedLow, expectedHigh]
    ["[&lt;200][]", "mg/dL", "[<200][]", undefined, 200],
    ["[&lt;150][]", "mg/dL", "[<150][]", undefined, 150],
    ["[&lt;130][]", "mg/dL", "[<130][]", undefined, 130],
    ["[&gt;90.00][]", "mL/min/1.73m2", "[>90.00][]", 90, undefined],
    ["[&le;5][]", "", "[<=5][]", undefined, 5],
    ["[&ge;5][]", "", "[>=5][]", 5, undefined],
    ["[&#60;200][]", "", "[<200][]", undefined, 200],
  ] as const)(
    "'%s' → text '%s' (low=%s high=%s)",
    (raw, unit, expectedText, expectedLow, expectedHigh) => {
      const r = parseRange(raw, unit);
      expect(r?.text).toBe(expectedText);
      expect(r?.low?.value).toBe(expectedLow);
      expect(r?.high?.value).toBe(expectedHigh);
    },
  );

  test("literal '<' (no entity) still parses — confirms no regression", () => {
    const r = parseRange("[<200][]", "mg/dL");
    expect(r?.text).toBe("[<200][]");
    expect(r?.high?.value).toBe(200);
    expect(r?.low).toBeUndefined();
  });

  test("full-width '≧' display is untouched by entity decode", () => {
    // Entity decode must NOT alter full-width comparator rendering: text stays
    // bracketed "[≧60][]" (only the structured low is extracted), so this
    // surgical fix introduces zero display drift for non-escaped ranges.
    const r = parseRange("[≧60][]", "mL/min/1.73m2");
    expect(r?.text).toBe("[≧60][]");
    expect(r?.low?.value).toBe(60);
  });

  test("plain numeric range without any entity is unchanged", () => {
    const r = parseRange("[3.89][26.8]", "mg/dL");
    expect(r?.text).toBe("[3.89][26.8]");
    expect(r?.low?.value).toBe(3.89);
    expect(r?.high?.value).toBe(26.8);
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
