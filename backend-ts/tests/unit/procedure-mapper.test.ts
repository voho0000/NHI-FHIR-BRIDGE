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

  test("v0.8.0 bilingual: code.text=繁中, coding[0].display=English", () => {
    const r = mapProcedure(
      {
        display: "Excision of Left Vitreous, Percutaneous Approach",
        display_zh: "經皮左側玻璃體部分切除術",
        code: "08B53ZZ",
        system: "icd-10-pcs",
        note: "x",
      },
      PID,
    );
    expect(r!.code.text).toBe("經皮左側玻璃體部分切除術");
    expect(r!.code.coding[0].display).toBe("Excision of Left Vitreous, Percutaneous Approach");
  });

  test("v0.8.0 fallback: no display_zh → text falls back to English display", () => {
    const r = mapProcedure(
      { display: "Some English Only Procedure", code: "X000", note: "x" },
      PID,
    );
    expect(r!.code.text).toBe("Some English Only Procedure");
  });

  test("system hint maps to ICD-10-PCS", () => {
    const r = mapProcedure({ display: "?", code: "0DTJ4ZZ", system: "ICD-10-PCS", note: "x" }, PID);
    expect(r!.code.coding[0].system).toContain("icd-10");
  });

  test("system hint maps to NHI 醫令碼", () => {
    const r = mapProcedure(
      { display: "Microincision vitreomacular surgery", code: "86412B", system: "nhi", note: "x" },
      PID,
    );
    expect(r!.code.coding[0].system).toContain("nhi-medical-order");
  });

  // Relaxed guard (v0.18.14): a row with a real billed code is a genuine
  // procedure even with no reason note / body site — only no-code stubs drop.
  test("kept when a real code is present even without note or body_site", () => {
    const r = mapProcedure(
      { display: "Intravitreous injection", code: "86201C", system: "nhi", date: "2014-01-14" },
      PID,
    );
    expect(r).not.toBeNull();
    expect(r!.code.coding[0].code).toBe("86201C");
    // the "Vaginal ultrasound" stub (no code) still drops
    expect(mapProcedure({ display: "Vaginal ultrasound" }, PID)).toBeNull();
  });

  // Option B: NHI 醫令 order code primary + ICD-10-PCS op_CODE secondary.
  test("secondary coding (code2) appends a second code.coding entry", () => {
    const r = mapProcedure(
      {
        display: "Microincision vitreomacular surgery",
        display_zh: "微創玻璃體黃斑部手術",
        code: "86412B",
        system: "nhi",
        code2: "08B53ZZ",
        system2: "icd-10-pcs",
        display2: "Excision of Left Vitreous, Percutaneous Approach",
        note: "x",
      },
      PID,
    );
    expect(r!.code.coding).toHaveLength(2);
    expect(r!.code.coding[0]).toMatchObject({ code: "86412B", display: "Microincision vitreomacular surgery" });
    expect(r!.code.coding[0].system).toContain("nhi-medical-order");
    expect(r!.code.coding[1]).toMatchObject({ code: "08B53ZZ", display: "Excision of Left Vitreous, Percutaneous Approach" });
    expect(r!.code.coding[1].system).toContain("icd-10");
    expect(r!.code.text).toBe("微創玻璃體黃斑部手術");
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
    const a = mapProcedure({ display: "Appendectomy", date: "2024-03-01", note: "x" }, PID);
    const b = mapProcedure({ display: "Appendectomy", date: "2024-03-01", note: "x" }, PID);
    expect(a!.id).toBe(b!.id);
  });

  test("hospital maps to performer[].actor.display for link.ts encounter matching", () => {
    const r = mapProcedure(
      { display: "Appendectomy", date: "2024-03-01", note: "x", hospital: "臺北榮總" },
      PID,
    );
    expect(r!.performer).toEqual([{ actor: { display: "臺北榮總" } }]);
  });

  test("performer omitted when hospital is empty / whitespace", () => {
    const a = mapProcedure({ display: "?", note: "x", hospital: "" }, PID);
    const b = mapProcedure({ display: "?", note: "x", hospital: "   " }, PID);
    const c = mapProcedure({ display: "?", note: "x" }, PID);
    expect(a!.performer).toBeUndefined();
    expect(b!.performer).toBeUndefined();
    expect(c!.performer).toBeUndefined();
  });
});
