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
});
