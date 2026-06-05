import { describe, expect, test } from "vitest";

import { dedupImagingItems } from "@nhi-fhir-bridge/mapper";

// Shared group key (code, date, hospital) — same NHI study across the
// channel variants we want collapsed.
const base = {
  code: "33072B",
  display: "電腦斷層造影  －  有造影劑",
  category: "RAD",
  date: "2025-02-08",
  hospital: "長庚嘉義",
};

describe("dedupImagingItems — channel-variant narrative collapse (v0.17.2)", () => {
  test("identity / single item: unchanged", () => {
    const items = [{ ...base, conclusion: "Some abdomen CT narrative." }];
    expect(dedupImagingItems(items)).toHaveLength(1);
  });

  // Relation (a): EXACT-equality after normalization — pure formatting.
  test("whitespace/case-only narrative variants collapse to 1", () => {
    const a = { ...base, conclusion: "CT Abdomen Show:Impression:1.No ascites 2.Fatty liver." };
    const b = {
      ...base,
      conclusion: "CT Abdomen Show:\nImpression: 1. No ascites 2. Fatty liver.",
    };
    const out = dedupImagingItems([a, b]);
    expect(out).toHaveLength(1);
    // Winner keeps verbatim text (faithful transport) — the longer raw
    // on equal-normalized tie.
    expect(out[0]!.conclusion).toBe(b.conclusion);
  });

  // NFKC fold: fullwidth/halfwidth-only narrative variants collapse.
  test("fullwidth/halfwidth-only narrative variants collapse to 1", () => {
    const a = { ...base, conclusion: "S／P op. Liver：no focal lesion. Ａ＆Ｅ clear." };
    const b = { ...base, conclusion: "S/P op. Liver:no focal lesion. A&E clear." };
    expect(dedupImagingItems([a, b])).toHaveLength(1);
  });

  // Relation (b): STRICT-PREFIX — a TRUNCATED channel upload. The real
  // 2025-02-08 abdomen CT bug: channel A's dictation was cut off mid-
  // word ("…ground glass patc"), missing finding #15 that channel B
  // carries. The truncated copy's normalized text is an exact prefix of
  // the complete copy's → collapse, keeping the COMPLETE one.
  test("truncated narrative (strict prefix) collapses, complete copy wins", () => {
    const complete = {
      ...base,
      conclusion:
        "CT of the abdomen shows: 1. Fatty liver. 2. No focal lesion. " +
        "13. Ground glass patches in bil. lower lungs. " +
        "15. Patch consolidation in RLL.",
    };
    const truncated = {
      ...base,
      conclusion:
        "CT of the abdomen shows: 1. Fatty liver. 2. No focal lesion. 13. Ground glass patc",
    };
    const out = dedupImagingItems([truncated, complete]);
    expect(out).toHaveLength(1);
    // The surviving item must be the COMPLETE report (superset), verbatim.
    expect(out[0]!.conclusion).toBe(complete.conclusion);
  });

  test("prefix collapse is order-independent (complete first)", () => {
    const complete = {
      ...base,
      conclusion: "Findings: 1. Aaa. 2. Bbb. 3. Ccc — full report end.",
    };
    const truncated = { ...base, conclusion: "Findings: 1. Aaa. 2. Bbb. 3. Ccc — full rep" };
    const out = dedupImagingItems([complete, truncated]);
    expect(out).toHaveLength(1);
    expect(out[0]!.conclusion).toBe(complete.conclusion);
  });

  // Over-merge guard: two GENUINELY different exams under the same
  // (code, date, hospital) are neither equal nor prefix-related →
  // both kept. (Head/neck CT vs chest CT, the v0.16.2 lesson.)
  test("distinct exams at same (code, date, hospital) are NOT collapsed", () => {
    const headNeck = {
      ...base,
      conclusion:
        "CT of head and neck without enhancement shows: skull base to upper chest, normal.",
    };
    const chest = {
      ...base,
      conclusion: "CT of chest without enhancement shows: 1. Diffuse patchy infiltration, RLL.",
    };
    const out = dedupImagingItems([headNeck, chest]);
    expect(out).toHaveLength(2);
  });

  // Empty/whitespace-only conclusion must NOT prefix-match everything.
  test("whitespace-only narrative does not swallow a real narrative", () => {
    const blank = { ...base, conclusion: "   " };
    const real = { ...base, conclusion: "Real abdomen CT narrative here." };
    const out = dedupImagingItems([blank, real]);
    // blank normalizes to "" → never prefix-merges; both survive the
    // narrative-collapse pass (the blank one is harmless narrative noise,
    // not collapsed into the real report).
    expect(out.length).toBeGreaterThanOrEqual(1);
    expect(out.some((it) => it.conclusion === "Real abdomen CT narrative here.")).toBe(true);
  });
});
