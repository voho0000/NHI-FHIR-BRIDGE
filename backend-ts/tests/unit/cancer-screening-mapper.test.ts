/**
 * 癌症篩檢 mapper (IHKE3404) — bilingual qualitative Observation.
 *
 * Decided with the project owner 2026-06-13: screening NAME bilingual,
 * common RESULT vocabulary bilingual + interpretation flag, free-text
 * DETAIL verbatim (no machine translation — PHI must not leave the machine).
 */

import { describe, expect, test } from "vitest";

import { mapCancerScreening } from "@nhi-fhir-bridge/mapper";

const colorectal = {
  date: "2023-04-20",
  screening_label: "大腸癌篩檢",
  result_text: "無異常",
  detail: "",
  hospital: "新北市聯醫",
};

describe("mapCancerScreening", () => {
  test("bilingual name (EN display + ZH text) and source-program tag", () => {
    const o = mapCancerScreening(colorectal, "patient-x");
    expect(o).not.toBeNull();
    expect(o?.resourceType).toBe("Observation");
    expect(o?.code?.coding?.[0]?.display).toBe("Colorectal Cancer Screening (FOBT)"); // EN
    expect(o?.code?.text).toBe("大腸癌篩檢"); // ZH
    expect(o?.effectiveDateTime).toBe("2023-04-20T00:00:00+08:00");
    expect(o?.performer?.[0]?.display).toBe("新北市聯醫");
    expect(o?.meta?.tag).toContainEqual({
      system: "http://nhi-fhir-bridge/source-program",
      code: "cancer-screening",
    });
  });

  test("known result → bilingual valueCodeableConcept + interpretation (N)", () => {
    const o = mapCancerScreening(colorectal, "patient-x");
    expect(o?.valueCodeableConcept?.coding?.[0]?.display).toBe("No abnormality detected"); // EN
    expect(o?.valueCodeableConcept?.text).toBe("無異常"); // ZH
    expect(o?.valueString).toBeUndefined();
    expect(o?.interpretation?.[0]?.coding?.[0]?.code).toBe("N");
  });

  test("異常 → interpretation A", () => {
    const o = mapCancerScreening({ ...colorectal, result_text: "異常" }, "patient-x");
    expect(o?.interpretation?.[0]?.coding?.[0]?.code).toBe("A");
    expect(o?.valueCodeableConcept?.coding?.[0]?.display).toBe("Abnormal");
  });

  test("陽性/陰性 → POS/NEG", () => {
    expect(
      mapCancerScreening({ ...colorectal, result_text: "陽性" }, "p")?.interpretation?.[0]
        ?.coding?.[0]?.code,
    ).toBe("POS");
    expect(
      mapCancerScreening({ ...colorectal, result_text: "陰性" }, "p")?.interpretation?.[0]
        ?.coding?.[0]?.code,
    ).toBe("NEG");
  });

  test("UNKNOWN result → raw Chinese valueString, no guessed translation, no interpretation", () => {
    const o = mapCancerScreening(
      { ...colorectal, result_text: "需轉介專科進一步檢查" },
      "patient-x",
    );
    expect(o?.valueString).toBe("需轉介專科進一步檢查");
    expect(o?.valueCodeableConcept).toBeUndefined();
    expect(o?.interpretation).toBeUndefined();
  });

  test("free-text detail → Observation.note verbatim (not translated)", () => {
    const o = mapCancerScreening(
      {
        date: "2023-03-13",
        screening_label: "乳癌篩檢",
        result_text: "無異常",
        detail: "良性發現；有發現影像變化，但為良性，建議每年定期檢查即可。",
        hospital: "明新診所",
      },
      "patient-x",
    );
    expect(o?.code?.coding?.[0]?.display).toBe("Breast Cancer Screening (Mammography)");
    expect(o?.note?.[0]?.text).toBe("良性發現；有發現影像變化，但為良性，建議每年定期檢查即可。");
    // headline still bilingual coded
    expect(o?.valueCodeableConcept?.text).toBe("無異常");
  });

  test("unmapped screening label → English display falls back to the Chinese label", () => {
    const o = mapCancerScreening({ ...colorectal, screening_label: "某新型癌篩" }, "patient-x");
    expect(o?.code?.coding?.[0]?.display).toBe("某新型癌篩");
    expect(o?.code?.text).toBe("某新型癌篩");
  });

  test("drops rows missing date / label / result", () => {
    expect(
      mapCancerScreening({ screening_label: "大腸癌篩檢", result_text: "無異常" }, "p"),
    ).toBeNull();
    expect(mapCancerScreening({ date: "2023-04-20", result_text: "無異常" }, "p")).toBeNull();
    expect(
      mapCancerScreening({ date: "2023-04-20", screening_label: "大腸癌篩檢" }, "p"),
    ).toBeNull();
  });
});
