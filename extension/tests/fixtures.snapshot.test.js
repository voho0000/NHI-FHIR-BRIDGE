// End-to-end fixture snapshot tests.
//
// Each captured NHI payload is run through its adapter and the output
// pinned via inline snapshots. This complements adapters.test.js (which
// asserts on specific field choices in unit cases) by catching whole-
// shape drift: if an adapter starts emitting a new field, dropping one,
// or reordering, the diff against the inline snapshot makes the change
// visible in PR review.
//
// To regenerate after a deliberate output-shape change:
//   npx vitest run --update tests/fixtures.snapshot.test.js
//
// Fixtures live in ./fixtures/. Each is documented with a `_source`
// + `_note` describing what it represents (live capture vs synthetic).

import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  adaptAdultPreventive,
  adaptAllergy,
  adaptEncounterFromMedExpense,
  adaptImagingReportFromDetail,
  adaptLabItem,
  adaptMedicationFromDetail,
  adaptProcedure,
} from "../src/nhi-adapters.js";

const FIX = resolve(dirname(fileURLToPath(import.meta.url)), "fixtures");
const load = (name) => JSON.parse(readFileSync(resolve(FIX, name), "utf8"));

describe("adapter fixture snapshots", () => {
  test("IHKE3409 lab (inpatient — real_INSPECT_DATE wins)", () => {
    expect(adaptLabItem(load("ihke3409-lab-inpatient.json"))).toMatchInlineSnapshot(`
      {
        "code": "FINGER SUGAR",
        "date": "2025-05-22",
        "display": "FINGER SUGAR",
        "hospital": "長庚嘉義",
        "order_code": "09140C",
        "order_name": "血液及體液葡萄糖-餐後",
        "reference_range": "[70][140]",
        "unit": "mg/dL",
        "value": "191",
      }
    `);
  });

  test("IHKE3408S02 imaging (real_INSPECT_DATE null → falls back to func_DATE)", () => {
    expect(adaptImagingReportFromDetail(load("ihke3408-imaging-detail.json"))).toMatchInlineSnapshot(`
      {
        "category": "RAD",
        "code": "33070B",
        "conclusion": "Computed Tomography of Brain Without Enhancement Show:

      Method:
      Axial noncontrast 5 mm sections from the skull base to the vertex were obtained.

      Impression:
      1. No apparent ICH
      2. Senile cortical atrophy and cerebral small vessel disease.
      3. Pan-paranasal sinusitis.",
        "date": "2026-01-14",
        "display": "電腦斷層造影  －  無造影劑",
        "hospital": "長庚嘉義",
        "issued": "2026-02-24",
        "system": "",
      }
    `);
  });

  test("IHKE3301S05 procedures (inpatient + outpatient rows)", () => {
    const both = load("ihke3301s05-procedures.json").main_data.map(adaptProcedure);
    expect(both).toMatchInlineSnapshot(`
      [
        {
          "body_site": "",
          "code": "",
          "date": "2016-09-23",
          "display": "經皮左側玻璃體部分切除術",
          "hospital": "臺北榮總",
          "note": "Reason: H35372 左側眼黃斑部皺褶",
        },
        {
          "body_site": "",
          "code": "",
          "date": "2016-01-14",
          "display": "經皮眼睛其他治療物質輸入",
          "hospital": "嘉基醫院",
          "note": "Reason: H4011X0 原發性隅角開放性青光眼，未明示期別",
        },
      ]
    `);
  });

  test("IHKE3303 encounter (outpatient defaulting to AMB)", () => {
    expect(adaptEncounterFromMedExpense(load("ihke3303-encounter.json"))).toMatchInlineSnapshot(`
      {
        "class": "AMB",
        "date": "2025-05-18",
        "department": "",
        "end_date": "",
        "hospital": "長庚嘉義",
        "provider": "",
        "reason": "I10 Essential hypertension",
        "row_id": "AAFxzWAAIAAIATTAAY",
        "type_display": "IC卡資料",
      }
    `);
  });

  test("IHKE3306S02 medication detail (bilingual fields + visit context)", () => {
    const { drug, visit } = load("ihke3306s02-medication.json");
    expect(adaptMedicationFromDetail(drug, visit)).toMatchInlineSnapshot(`
      {
        "code": "B025823100",
        "date": "2025-05-18",
        "dose": "",
        "drug_class": "抗血小板藥",
        "drug_name": "Aspirin 100mg",
        "duration_days": 30,
        "frequency": "",
        "hospital": "長庚嘉義",
        "indication": "Essential hypertension",
        "indication_code": "I10",
        "quantity": 30,
        "route": "",
      }
    `);
  });

  test("IHKE3202 allergy (single allergen + reaction)", () => {
    expect(adaptAllergy(load("ihke3202-allergy.json"))).toMatchInlineSnapshot(`
      {
        "category": "medication",
        "criticality": "unable-to-assess",
        "display": "Penicillin",
        "reaction": "rash, dyspnea",
        "recorded_date": "2023-03-15",
      }
    `);
  });

  test("IHKE3402 adult preventive (one row → ~12 Observations)", () => {
    const out = adaptAdultPreventive(load("ihke3402-adult-preventive.json"));
    // Snapshot the shape but compress to just (display, value, category)
    // tuples — the full structure is repetitive and the per-Observation
    // shape is already pinned by adapters.test.js.
    const summary = out.map((o) => ({ display: o.display, value: o.value, category: o.category }));
    expect(summary).toMatchInlineSnapshot(`
      [
        {
          "category": "vital-signs",
          "display": "Body Height",
          "value": "170",
        },
        {
          "category": "vital-signs",
          "display": "Body Weight",
          "value": "68",
        },
        {
          "category": "vital-signs",
          "display": "BMI",
          "value": "23.5",
        },
        {
          "category": "vital-signs",
          "display": "Waist Circumference",
          "value": "82",
        },
        {
          "category": "vital-signs",
          "display": "Systolic Blood Pressure",
          "value": "128",
        },
        {
          "category": "vital-signs",
          "display": "Diastolic Blood Pressure",
          "value": "78",
        },
        {
          "category": "laboratory",
          "display": "Cholesterol",
          "value": "192",
        },
        {
          "category": "laboratory",
          "display": "Triglyceride",
          "value": "120",
        },
        {
          "category": "laboratory",
          "display": "HDL",
          "value": "52",
        },
        {
          "category": "laboratory",
          "display": "LDL",
          "value": "110",
        },
        {
          "category": "laboratory",
          "display": "SGOT (AST)",
          "value": "23",
        },
        {
          "category": "laboratory",
          "display": "SGPT (ALT)",
          "value": "28",
        },
        {
          "category": "laboratory",
          "display": "Glu-AC",
          "value": "96",
        },
        {
          "category": "laboratory",
          "display": "BUN",
          "value": "14",
        },
        {
          "category": "laboratory",
          "display": "Creatinine",
          "value": "0.9",
        },
        {
          "category": "laboratory",
          "display": "eGFR",
          "value": "95",
        },
        {
          "category": "laboratory",
          "display": "Uric Acid",
          "value": "5.2",
        },
        {
          "category": "laboratory",
          "display": "代謝症候群篩檢 (Metabolic Syndrome Screening)",
          "value": "正常",
        },
      ]
    `);
  });
});
