import { describe, expect, test } from "vitest";

import { dedupProcedures, mapProcedure } from "@nhi-fhir-bridge/mapper";

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

describe("dedupProcedures", () => {
  const PCS = "http://hl7.org/fhir/sid/icd-10-pcs";
  const NHI = "https://twcore.mohw.gov.tw/CodeSystem/nhi-medical-order-code";
  const proc = (id: string, codings: any[], hosp: string, date: string) => ({
    resourceType: "Procedure",
    id,
    performedDateTime: `${date}T00:00:00+08:00`,
    performer: [{ actor: { display: hosp } }],
    code: { coding: codings },
  });

  test("drops the PCS-only 住院 surgery when a richer 手術-list row covers it", () => {
    const rich = proc(
      "rich",
      [
        { system: NHI, code: "86412B" },
        { system: PCS, code: "08B53ZZ" },
      ],
      "臺北榮總",
      "2016-09-23",
    );
    const inpatient = proc("inp", [{ system: PCS, code: "08B53ZZ" }], "臺北榮總", "2016-09-23");
    expect(dedupProcedures([rich, inpatient]).map((p) => p.id)).toEqual(["rich"]);
  });

  test("keeps a 住院 surgery the 手術 list never had (the common case)", () => {
    const inpatient = proc("inp", [{ system: PCS, code: "0DBK8ZZ" }], "長庚嘉義", "2025-02-11");
    expect(dedupProcedures([inpatient]).map((p) => p.id)).toEqual(["inp"]);
  });

  test("does NOT dedup across a different hospital or date", () => {
    const rich = proc(
      "rich",
      [
        { system: NHI, code: "86412B" },
        { system: PCS, code: "08B53ZZ" },
      ],
      "臺北榮總",
      "2016-09-23",
    );
    const elsewhere = proc("inp", [{ system: PCS, code: "08B53ZZ" }], "長庚嘉義", "2025-02-11");
    expect(dedupProcedures([rich, elsewhere])).toHaveLength(2);
  });

  test("non-Procedure resources pass through untouched", () => {
    const obs = { resourceType: "Observation", id: "o1" };
    expect(dedupProcedures([obs]).map((r) => r.id)).toEqual(["o1"]);
  });
});

describe("Procedure partOf (主/次處置 grouping)", () => {
  const PCS = "http://hl7.org/fhir/sid/icd-10-pcs";
  const NHI = "https://twcore.mohw.gov.tw/CodeSystem/nhi-medical-order-code";
  const proc = (id: string, codings: any[], hosp: string, date: string, extra: any = {}) => ({
    resourceType: "Procedure",
    id,
    performedDateTime: `${date}T00:00:00+08:00`,
    performer: [{ actor: { display: hosp } }],
    code: { coding: codings },
    ...extra,
  });

  test("part_of_code → partOf referencing the primary's content-derived id", () => {
    const secondary = mapProcedure(
      {
        display: "Transverse colectomy",
        code: "0DBL8ZZ",
        system: "icd-10-pcs",
        date: "2025-02-11",
        part_of_code: "0DBK8ZZ",
      },
      PID,
    );
    const primary = mapProcedure(
      { display: "Ascending colectomy", code: "0DBK8ZZ", system: "icd-10-pcs", date: "2025-02-11" },
      PID,
    );
    expect(secondary!.partOf).toEqual([{ reference: `Procedure/${primary!.id}` }]);
  });

  test("dedupProcedures re-points a 次處置 partOf when its primary merges into the richer row", () => {
    // Vitrectomy (08B53ZZ) is in BOTH the 手術 list (rich) and 住院 detail
    // (PCS-only). Its 次處置 (08QF3ZZ retinal repair) partOf'd the inpatient
    // primary — after dedup drops it, partOf must re-point to the surviving row.
    const rich = proc(
      "rich",
      [
        { system: NHI, code: "86412B" },
        { system: PCS, code: "08B53ZZ" },
      ],
      "臺北榮總",
      "2016-09-23",
    );
    const inpPrimary = proc("inpP", [{ system: PCS, code: "08B53ZZ" }], "臺北榮總", "2016-09-23");
    const inpSecondary = proc(
      "inpS",
      [{ system: PCS, code: "08QF3ZZ" }],
      "臺北榮總",
      "2016-09-23",
      {
        partOf: [{ reference: "Procedure/inpP" }],
      },
    );
    const out = dedupProcedures([rich, inpPrimary, inpSecondary]);
    expect(out.map((p) => p.id).sort()).toEqual(["inpS", "rich"]); // inpP dropped
    expect(out.find((p) => p.id === "inpS")!.partOf).toEqual([{ reference: "Procedure/rich" }]);
  });
});

// Hospital + primary 診斷 join the Procedure id (2026-06-23) — two procedures
// under the same NHI code on the same day belong to different visits when the
// hospital OR the診斷 differs (same class of bug as the old Encounter merge).
describe("Procedure id — hospital + 診斷 in the key", () => {
  const mk = (over: Record<string, any>) =>
    mapProcedure(
      {
        display: "Aerosol therapy",
        code: "57021C",
        date: "2026-06-02",
        hospital: "長庚嘉義",
        ...over,
      },
      PID,
    );

  test("same code+date at DIFFERENT hospitals → distinct ids", () => {
    expect(mk({ hospital: "長庚嘉義" })!.id).not.toBe(mk({ hospital: "臺北榮總" })!.id);
  });

  test("same code+date+hospital under DIFFERENT 診斷 → distinct ids", () => {
    expect(mk({ reason_code: "R053" })!.id).not.toBe(mk({ reason_code: "J45" })!.id);
  });

  test("identical (code+date+hospital+診斷) → same id (still dedups)", () => {
    expect(mk({ reason_code: "R053" })!.id).toBe(mk({ reason_code: "R053" })!.id);
  });

  test("partOf recomputes the primary's id with the same extra key parts", () => {
    const primary = mapProcedure(
      {
        display: "Primary",
        code: "PRIMARY",
        date: "2026-06-02",
        hospital: "長庚嘉義",
        reason_code: "N1832",
      },
      PID,
    );
    const secondary = mapProcedure(
      {
        display: "Sub",
        code: "SUB",
        date: "2026-06-02",
        hospital: "長庚嘉義",
        reason_code: "N1832",
        part_of_code: "PRIMARY",
      },
      PID,
    );
    expect(secondary!.partOf[0].reference).toBe(`Procedure/${primary!.id}`);
  });
});
