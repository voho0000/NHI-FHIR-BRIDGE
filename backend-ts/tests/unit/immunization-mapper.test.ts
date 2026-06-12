/**
 * Immunization mapper unit tests.
 *
 * NHI's vaccine endpoint (IHKE3203S01) ships Chinese-only names, no
 * standard code. mapImmunization must produce a FHIR R4-valid
 * Immunization resource with the minimum required fields (status,
 * vaccineCode, patient, occurrence) populated from NHI's shape, plus
 * lotNumber / performer / note when source data carries them.
 */

import { describe, expect, test } from "vitest";

import { mapImmunization } from "@nhi-fhir-bridge/mapper";

const PID = "A123456789";

describe("mapImmunization", () => {
  test("minimum required FHIR fields populated", () => {
    const r = mapImmunization(
      {
        date: "2023-12-27",
        vaccine_name: "流感疫苗",
        hospital: "臺北榮民總醫院",
      },
      PID,
    );
    expect(r).not.toBeNull();
    expect(r!.resourceType).toBe("Immunization");
    expect(r!.status).toBe("completed");
    expect(r!.vaccineCode).toEqual({ text: "流感疫苗" });
    expect(r!.patient.reference).toBe(`Patient/${PID}`);
    expect(r!.occurrenceDateTime).toBe("2023-12-27T00:00:00+08:00");
  });

  test("lot_number → lotNumber when present", () => {
    const r = mapImmunization(
      {
        date: "2022-01-07",
        vaccine_name: "輝瑞/BNT COVID-19疫苗",
        lot_number: "2J081B",
      },
      PID,
    );
    expect(r!.lotNumber).toBe("2J081B");
  });

  test("lotNumber omitted when batch absent (flu)", () => {
    const r = mapImmunization(
      { date: "2023-12-27", vaccine_name: "流感疫苗", lot_number: "" },
      PID,
    );
    expect(r!.lotNumber).toBeUndefined();
  });

  test("hospital → performer[].actor.display", () => {
    const r = mapImmunization(
      {
        date: "2022-01-07",
        vaccine_name: "X",
        hospital: "臺北榮民總醫院",
      },
      PID,
    );
    expect(r!.performer).toEqual([{ actor: { display: "臺北榮民總醫院" } }]);
  });

  test("source → note (provenance)", () => {
    const r = mapImmunization(
      {
        date: "2022-01-07",
        vaccine_name: "X",
        source: "疾病管制署",
      },
      PID,
    );
    expect(r!.note).toEqual([{ text: "來源: 疾病管制署" }]);
  });

  test("returns null when vaccine_name missing", () => {
    expect(mapImmunization({ date: "2022-01-07" }, PID)).toBeNull();
  });

  test("returns null when date missing", () => {
    expect(mapImmunization({ vaccine_name: "X" }, PID)).toBeNull();
  });

  test("same input → same stable id (idempotent)", () => {
    const a = mapImmunization({ date: "2022-01-07", vaccine_name: "X", lot_number: "L1" }, PID);
    const b = mapImmunization({ date: "2022-01-07", vaccine_name: "X", lot_number: "L1" }, PID);
    expect(a!.id).toBe(b!.id);
  });

  test("different lot numbers → different stable ids (same-day re-vaccination edge case)", () => {
    const a = mapImmunization({ date: "2022-01-07", vaccine_name: "X", lot_number: "L1" }, PID);
    const b = mapImmunization({ date: "2022-01-07", vaccine_name: "X", lot_number: "L2" }, PID);
    expect(a!.id).not.toBe(b!.id);
  });
});
