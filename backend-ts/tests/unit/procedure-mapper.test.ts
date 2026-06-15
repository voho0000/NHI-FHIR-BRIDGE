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
    expect(r!.code.coding[0]).toMatchObject({
      code: "86412B",
      display: "Microincision vitreomacular surgery",
    });
    expect(r!.code.coding[0].system).toContain("nhi-medical-order");
    expect(r!.code.coding[1]).toMatchObject({
      code: "08B53ZZ",
      display: "Excision of Left Vitreous, Percutaneous Approach",
    });
    expect(r!.code.coding[1].system).toContain("icd-10");
    expect(r!.code.text).toBe("微創玻璃體黃斑部手術");
  });

  // PCS coding carries an ADDITIVE zh-TW translation extension (display stays
  // English → third-party-safe); the NHI coding + code.text are untouched.
  test("ICD-10-PCS coding gets an additive _display zh-TW translation; NHI coding unchanged", () => {
    const r = mapProcedure(
      {
        display: "Microincision vitreomacular surgery",
        display_zh: "微創玻璃體黃斑部手術",
        code: "86412B",
        system: "nhi",
        code2: "08B53ZZ",
        system2: "icd-10-pcs",
        display2: "Excision of Left Vitreous, Percutaneous Approach",
        display2_zh: "經皮左側玻璃體部分切除術",
      },
      PID,
    );
    // NHI coding[0]: English display, NO translation extension (中文 is in code.text)
    expect(r!.code.coding[0].display).toBe("Microincision vitreomacular surgery");
    expect(r!.code.coding[0]._display).toBeUndefined();
    expect(r!.code.text).toBe("微創玻璃體黃斑部手術");
    // PCS coding[1]: English display unchanged + zh-TW translation extension
    const pcs = r!.code.coding[1];
    expect(pcs.display).toBe("Excision of Left Vitreous, Percutaneous Approach");
    expect(pcs._display.extension[0].url).toBe(
      "http://hl7.org/fhir/StructureDefinition/translation",
    );
    expect(pcs._display.extension[0].extension).toEqual([
      { url: "lang", valueCode: "zh-TW" },
      { url: "content", valueString: "經皮左側玻璃體部分切除術" },
    ]);
  });

  // Diagnosis reason → structured + bilingual reasonCode (same convention as
  // Encounter.reasonCode), replacing the old English-only "Reason: …" note.
  test("reason fields → bilingual reasonCode (ICD-10-CM dotted, en display, 繁中 text)", () => {
    const r = mapProcedure(
      {
        display: "Microincision vitreomacular surgery",
        code: "86412B",
        system: "nhi",
        reason: "Puckering of macula, left eye",
        reason_zh: "左側眼黃斑部皺褶",
        reason_code: "H35372",
      },
      PID,
    );
    expect(r!.reasonCode).toHaveLength(1);
    expect(r!.reasonCode[0].coding[0]).toMatchObject({
      system: "http://hl7.org/fhir/sid/icd-10-cm",
      code: "H35.372",
      display: "Puckering of macula, left eye",
    });
    expect(r!.reasonCode[0].text).toBe("左側眼黃斑部皺褶");
  });

  test("reason code but no name → reasonCode coding only (no empty display / text)", () => {
    const r = mapProcedure(
      { display: "Intravitreous injection", code: "86201C", system: "nhi", reason_code: "H4011X0" },
      PID,
    );
    expect(r!.reasonCode[0].coding[0]).toEqual({
      system: "http://hl7.org/fhir/sid/icd-10-cm",
      code: "H40.11X0",
    });
    expect(r!.reasonCode[0].text).toBeUndefined();
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
