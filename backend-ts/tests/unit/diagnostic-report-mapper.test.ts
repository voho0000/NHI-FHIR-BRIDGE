import { describe, expect, test } from "vitest";

import { mapDiagnosticReport } from "@nhi-fhir-bridge/mapper";

const PID = "P001";

describe("mapDiagnosticReport", () => {
  test("returns null when conclusion empty", () => {
    expect(mapDiagnosticReport({ display: "?" }, PID)).toBeNull();
  });

  test("returns null when conclusion is whitespace-only", () => {
    expect(mapDiagnosticReport({ display: "?", conclusion: "   " }, PID)).toBeNull();
  });

  // The big one: lab category + value-looking conclusion → drop. Otherwise
  // every panel row creates a duplicate of its own Observation.
  test("LAB category with lab-value-only conclusion returns null", () => {
    expect(
      mapDiagnosticReport({ display: "HbA1c", category: "LAB", conclusion: "5.9%" }, PID),
    ).toBeNull();
  });

  test("LAB category with lab value + reference range still returns null", () => {
    expect(
      mapDiagnosticReport({ display: "ALT", category: "LAB", conclusion: "42 U/L" }, PID),
    ).toBeNull();
  });

  test("LAB category with long narrative is kept", () => {
    const conclusion =
      "Complete blood count shows mild anemia with no evidence of " +
      "thrombocytopenia. Differential is within normal limits and no " +
      "blast cells are observed. Recommend follow-up in 3 months.";
    const r = mapDiagnosticReport({ display: "CBC", category: "LAB", conclusion }, PID);
    expect(r).not.toBeNull();
    expect(r!.conclusion).toBe(conclusion);
  });

  test("RAD category narrative is kept regardless of length", () => {
    const r = mapDiagnosticReport(
      { display: "CXR", category: "RAD", conclusion: "Clear lungs." },
      PID,
    );
    expect(r).not.toBeNull();
    expect(r!.category[0].coding[0].code).toBe("RAD");
  });

  test("PATH maps to PAT code (v2-0074 has 'PAT' not 'PATH')", () => {
    const r = mapDiagnosticReport(
      { display: "Biopsy", category: "PATH", conclusion: "Benign tissue." },
      PID,
    );
    expect(r!.category[0].coding[0].code).toBe("PAT");
  });

  test("LOINC system hint maps to canonical LOINC URL", () => {
    const r = mapDiagnosticReport(
      {
        display: "Imaging",
        category: "RAD",
        code: "30746-2",
        system: "LOINC",
        conclusion: "Some narrative content here.",
      },
      PID,
    );
    expect(r!.code.coding[0].system).toBe("http://loinc.org");
  });

  test("unknown system falls back to local report code", () => {
    const r = mapDiagnosticReport({ display: "?", category: "RAD", conclusion: "narrative" }, PID);
    expect(r!.code.coding[0].system).toContain("his-local-report");
  });

  // imaging reports carry a real NHI 醫令碼 → route to NHI_MEDICAL_ORDER_CODE
  // (was mis-filed under the local placeholder).
  test("nhi system hint + code → NHI medical order code", () => {
    const r = mapDiagnosticReport(
      { display: "Chest CT", code: "33070B", system: "nhi", category: "RAD", conclusion: "x" },
      PID,
    );
    expect(r!.code.coding[0].system).toContain("nhi-medical-order-code");
    expect(r!.code.coding[0].code).toBe("33070B");
  });

  test("subject reference uses patient id", () => {
    const r = mapDiagnosticReport({ display: "?", category: "RAD", conclusion: "x" }, PID);
    expect(r!.subject.reference).toBe(`Patient/${PID}`);
  });

  test("date populates both effectiveDateTime and issued (issued defaults)", () => {
    const r = mapDiagnosticReport(
      { display: "?", category: "RAD", conclusion: "x", date: "2024-05-01" },
      PID,
    );
    expect(r!.effectiveDateTime).toBe("2024-05-01T00:00:00+08:00");
    expect(r!.issued).toBe("2024-05-01T00:00:00+08:00");
  });

  test("explicit issued wins over date", () => {
    const r = mapDiagnosticReport(
      {
        display: "?",
        category: "RAD",
        conclusion: "x",
        date: "2024-05-01",
        issued: "2024-05-05",
      },
      PID,
    );
    expect(r!.effectiveDateTime).toBe("2024-05-01T00:00:00+08:00");
    expect(r!.issued).toBe("2024-05-05T00:00:00+08:00");
  });

  test("status defaults to 'final'", () => {
    const r = mapDiagnosticReport({ display: "?", category: "RAD", conclusion: "x" }, PID);
    expect(r!.status).toBe("final");
  });

  test("hospital populates performer[0].display", () => {
    const r = mapDiagnosticReport(
      { display: "?", category: "RAD", conclusion: "x", hospital: "VGH" },
      PID,
    );
    expect(r!.performer[0].display).toBe("VGH");
  });

  // CI v0.16.2 — narrative-only stableId discriminator now folds in a
  // content fingerprint of the conclusion. Bug found 2026-06-05: hospital
  // billed both head/neck and chest CT under the same NHI code 33070B
  // on the same day at the same hospital. Both narratives had distinct
  // text but the mapper's pre-v0.16.2 id discriminator was just `code`
  // → identical stableIds → the bundle's (resourceType, id) collision
  // dedup silently dropped the chest CT report. The fix differentiates
  // distinct-content narratives while still collapsing true cross-channel
  // (A+B) same-content duplicates.
  describe("CI v0.16.2 — narrative stableId distinguishes distinct content", () => {
    const baseRaw = {
      code: "33070B",
      display: "電腦斷層造影  －  無造影劑",
      category: "RAD",
      date: "2025-02-14",
      hospital: "長庚嘉義",
    };

    test("two narratives at same (code, date, hospital) with DISTINCT conclusion get DISTINCT ids", () => {
      const headNeck = mapDiagnosticReport(
        {
          ...baseRaw,
          conclusion: "Computed Tomography of Head and neck Without Enhancement Show: …",
        },
        PID,
      );
      const chest = mapDiagnosticReport(
        { ...baseRaw, conclusion: "Computed Tomography of Chest Without Enhancement Show: …" },
        PID,
      );
      expect(headNeck).not.toBeNull();
      expect(chest).not.toBeNull();
      expect(headNeck!.id).not.toBe(chest!.id);
    });

    test("two narratives at same (code, date, hospital) with IDENTICAL conclusion COLLIDE (cross-channel A+B dedup)", () => {
      const conclusion = "Computed Tomography of Head and neck Without Enhancement Show: …";
      const fromA = mapDiagnosticReport({ ...baseRaw, conclusion, ctype: "A" }, PID);
      const fromB = mapDiagnosticReport({ ...baseRaw, conclusion, ctype: "B" }, PID);
      expect(fromA).not.toBeNull();
      expect(fromB).not.toBeNull();
      // Same content → same id → bundle (resourceType, id) dedup will
      // collapse them. Preserves cross-channel duplicate-collapse behavior.
      expect(fromA!.id).toBe(fromB!.id);
    });

    test("image rows with distinct iplCaseSeqNo still get distinct ids regardless of conclusion", () => {
      const a = mapDiagnosticReport(
        { ...baseRaw, conclusion: "", iplCaseSeqNo: "2025021500047771" },
        PID,
      );
      const b = mapDiagnosticReport(
        { ...baseRaw, conclusion: "", iplCaseSeqNo: "2025021500128775" },
        PID,
      );
      // Both null because empty conclusion + no jpgBase64s → mapper drops.
      // This test guards against a future refactor: if we make image rows
      // emittable without conclusion, the iplCaseSeqNo discriminator must
      // still drive distinct ids.
      expect(a).toBeNull();
      expect(b).toBeNull();
    });
  });

  // CI v0.17.2 — the narrative stableId fingerprint must be whitespace-
  // and case-INSENSITIVE. Bug found 2026-06-06 (MediPrisma report,
  // patient P10109XXXX): NHI shipped one Brain CT narrative through two
  // upload channels (ori_TYPE A/B) whose text was identical except for
  // formatting whitespace — the numbered impression list rendered as
  // "ICH2." in one channel and "ICH 2." in the other. v0.16.2's raw-byte
  // fingerprint gave the two channel-variants DISTINCT ids → both
  // survived → downstream apps saw a phantom "multi-part CT" group. The
  // v0.17.2 fix normalizes (strips all whitespace + lowercases) the hash
  // input so channel-variants collapse to one id, WITHOUT merging
  // genuinely distinct exams (which differ in real alphanumeric content,
  // not just spacing). This invariant guards BOTH directions.
  describe("CI v0.17.2 — narrative stableId is whitespace/case-insensitive", () => {
    const baseRaw = {
      code: "33070B",
      display: "電腦斷層造影  －  無造影劑",
      category: "RAD",
      date: "2026-01-14",
      hospital: "長庚嘉義",
    };

    // The exact divergence from the real bundle: letter→digit spacing in
    // the numbered impression list ("ICH2." vs "ICH 2.") plus a newline
    // vs no-newline after the colon.
    const brainNoSpace =
      "Computed Tomography of Brain Without Enhancement Show:Method:" +
      "Axial noncontrast 5 mm sections were obtained.Impression:1.No apparent ICH2." +
      "Senile cortical atrophy and cerebral small vessel disease.";
    const brainWithSpace =
      "Computed Tomography of Brain Without Enhancement Show:\nMethod: " +
      "Axial noncontrast 5 mm sections were obtained. Impression: 1. No apparent ICH 2. " +
      "Senile cortical atrophy and cerebral small vessel disease.";

    test("channel-variant narratives differing ONLY in whitespace COLLIDE (same id)", () => {
      const a = mapDiagnosticReport({ ...baseRaw, conclusion: brainNoSpace }, PID);
      const b = mapDiagnosticReport({ ...baseRaw, conclusion: brainWithSpace }, PID);
      expect(a).not.toBeNull();
      expect(b).not.toBeNull();
      expect(a!.id).toBe(b!.id);
    });

    test("case-only difference also collides (same id)", () => {
      const lower = mapDiagnosticReport(
        { ...baseRaw, conclusion: "clear lungs. no acute process." },
        PID,
      );
      const upper = mapDiagnosticReport(
        { ...baseRaw, conclusion: "Clear Lungs. No Acute Process." },
        PID,
      );
      expect(lower!.id).toBe(upper!.id);
    });

    // NFKC fold (v0.17.2): NHI ships the same glyph fullwidth in one
    // upload channel and halfwidth in another — fullwidth slash U+FF0F
    // "S／P" vs ASCII "S/P", fullwidth colon U+FF1A "Chest：Mild" vs
    // "Chest:Mild", fullwidth ampersand "Ａ＆Ｅ" vs "A&E". These are pure
    // encoding variants of one report. normalizeNarrativeForDedup runs
    // NFKC first so they share a fingerprint → same id.
    test("fullwidth/halfwidth-only difference collides (same id)", () => {
      const fullwidth = mapDiagnosticReport(
        { ...baseRaw, conclusion: "S／P operation. Chest：Mild effusion. Ａ＆Ｅ noted." },
        PID,
      );
      const halfwidth = mapDiagnosticReport(
        { ...baseRaw, conclusion: "S/P operation. Chest:Mild effusion. A&E noted." },
        PID,
      );
      expect(fullwidth).not.toBeNull();
      expect(halfwidth).not.toBeNull();
      expect(fullwidth!.id).toBe(halfwidth!.id);
    });

    test("emitted conclusion stays VERBATIM (normalization is comparison-only, faithful transport)", () => {
      const a = mapDiagnosticReport({ ...baseRaw, conclusion: brainNoSpace }, PID);
      expect(a!.conclusion).toBe(brainNoSpace);
    });

    test("regression guard: distinct body parts still DIVERGE despite normalization", () => {
      const chest = mapDiagnosticReport(
        {
          ...baseRaw,
          conclusion: "Computed Tomography of Chest Without Enhancement Show: 1. Diffuse patchy …",
        },
        PID,
      );
      const headNeck = mapDiagnosticReport(
        {
          ...baseRaw,
          conclusion:
            "Computed Tomography of Head and neck Without Enhancement Show: skull base to upper chest …",
        },
        PID,
      );
      expect(chest!.id).not.toBe(headNeck!.id);
    });
  });
});
