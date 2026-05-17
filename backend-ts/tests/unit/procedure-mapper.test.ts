import { describe, expect, test } from "vitest";

import { mapProcedure } from "@nhi-fhir-bridge/mapper";

const PID = "P001";

describe("mapProcedure", () => {
  // The most important test in this file: a procedure row with neither
  // a note nor a body site is suspect (NHI emits dozens of list-page
  // "procedures" that are actually order rows with no clinical content)
  // and we drop those rather than pollute the SMART app with bogus rows.
  test("returns null when both note and body_site are empty", () => {
    expect(mapProcedure({ display: "Vaginal ultrasound" }, PID)).toBeNull();
  });

  test("returns null when both fields are whitespace-only", () => {
    expect(mapProcedure({ display: "?", note: "   ", body_site: "\t" }, PID)).toBeNull();
  });

  test("kept when note is non-empty", () => {
    const r = mapProcedure(
      { display: "Appendectomy", date: "2024-03-01", note: "穿孔性闌尾炎手術" },
      PID,
    );
    expect(r).not.toBeNull();
    expect(r!.resourceType).toBe("Procedure");
    expect(r!.note[0].text).toBe("穿孔性闌尾炎手術");
    expect(r!.performedDateTime).toBe("2024-03-01T00:00:00+08:00");
  });

  test("kept when body_site is non-empty", () => {
    const r = mapProcedure({ display: "?", body_site: "右下腹" }, PID);
    expect(r).not.toBeNull();
    expect(r!.bodySite[0].text).toBe("右下腹");
  });

  test("subject reference uses patient id", () => {
    const r = mapProcedure({ display: "?", note: "x" }, PID);
    expect(r!.subject.reference).toBe(`Patient/${PID}`);
  });

  test("system hint maps to SNOMED CT", () => {
    const r = mapProcedure(
      { display: "Appendectomy", code: "80146002", system: "snomed", note: "x" },
      PID,
    );
    expect(r!.code.coding[0].system).toBe("http://snomed.info/sct");
  });

  test("system hint maps to ICD-10-PCS", () => {
    const r = mapProcedure(
      { display: "?", code: "0DTJ4ZZ", system: "ICD-10-PCS", note: "x" },
      PID,
    );
    expect(r!.code.coding[0].system).toContain("icd-10");
  });

  test("status defaults to 'completed'", () => {
    const r = mapProcedure({ display: "?", note: "x" }, PID);
    expect(r!.status).toBe("completed");
  });

  test("explicit status overrides default", () => {
    const r = mapProcedure({ display: "?", note: "x", status: "in-progress" }, PID);
    expect(r!.status).toBe("in-progress");
  });

  test("same input → same stable id", () => {
    const a = mapProcedure(
      { display: "Appendectomy", date: "2024-03-01", note: "x" },
      PID,
    );
    const b = mapProcedure(
      { display: "Appendectomy", date: "2024-03-01", note: "x" },
      PID,
    );
    expect(a!.id).toBe(b!.id);
  });
});
