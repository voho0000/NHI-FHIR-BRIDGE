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
  adaptCatastrophicIllness,
  adaptEncounterFromMedExpense,
  adaptImagingReportFromDetail,
  adaptLabItem,
  adaptMedicationFromDetail,
  adaptProcedureFromDetail,
  adaptProcedureListStub,
} from "../src/nhi-adapters.ts";

const FIX = resolve(dirname(fileURLToPath(import.meta.url)), "fixtures");
const load = (name) => JSON.parse(readFileSync(resolve(FIX, name), "utf8"));

describe("adapter fixture snapshots", () => {
  test("IHKE3409 lab (inpatient — real_INSPECT_DATE wins, ordeR_CODE → code)", () => {
    expect(adaptLabItem(load("ihke3409-lab-inpatient.json"))).toMatchInlineSnapshot(`
      {
        "code": "09140C",
        "date": "2022-05-22",
        "display": "FINGER SUGAR",
        "hospital": "長庚嘉義",
        "item_name": "FINGER SUGAR",
        "nhi_source_channel": "A",
        "nhi_source_channel_name": "特約醫事機構不定期上傳",
        "nhi_visit_date": "2022-05-18",
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
        "ctype": "",
        "date": "2024-01-14",
        "display": "電腦斷層造影  －  無造影劑",
        "hospital": "長庚嘉義",
        "issued": "2024-02-24",
        "rid": "",
        "system": "",
      }
    `);
  });

  test("IHKE3301S05 procedures list — stub returns null (real data comes from IHKE3308S02 fan-out)", () => {
    const both = load("ihke3301s05-procedures.json").main_data.map(adaptProcedureListStub);
    expect(both).toEqual([null, null]);
  });

  test("IHKE3308S02 procedure detail (inpatient — exe_S_DATE > func_DATE; op_CODE → code)", () => {
    expect(adaptProcedureFromDetail(load("ihke3308-procedure-inpatient.json"))).toMatchInlineSnapshot(`
      [
        {
          "body_site": "",
          "code": "86412B",
          "code2": "08B53ZZ",
          "date": "2014-09-23",
          "display": "Microincision vitreomacular surgery",
          "display2": "Excision of Left Vitreous, Percutaneous Approach",
          "display_zh": "微創玻璃體黃斑部手術",
          "hospital": "臺北榮總",
          "reason": "Puckering of macula, left eye",
          "reason_code": "H35372",
          "reason_zh": "左側眼黃斑部皺褶",
          "system": "nhi",
          "system2": "icd-10-pcs",
        },
      ]
    `);
  });

  test("IHKE3308S02 procedure detail (outpatient — null icd9cm_CODE_CNAME tolerated)", () => {
    expect(adaptProcedureFromDetail(load("ihke3308-procedure-outpatient.json"))).toMatchInlineSnapshot(`
      [
        {
          "body_site": "",
          "code": "86201C",
          "code2": "3E0C3GC",
          "date": "2014-01-14",
          "display": "Intravitreous injection",
          "display2": "Introduction of Other Therapeutic Substance into Eye, Percutaneous Approach",
          "display_zh": "玻璃體內注射",
          "hospital": "嘉基醫院",
          "reason": "",
          "reason_code": "H4011X0",
          "reason_zh": "",
          "system": "nhi",
          "system2": "icd-10-pcs",
        },
      ]
    `);
  });

  test("IHKE3303 encounter (outpatient defaulting to AMB)", () => {
    expect(adaptEncounterFromMedExpense(load("ihke3303-encounter.json"))).toMatchInlineSnapshot(`
      {
        "channel": "IC卡資料",
        "class": "AMB",
        "date": "2025-05-18",
        "department": "",
        "end_date": "",
        "hospital": "長庚嘉義",
        "kind": "門診",
        "provider": "",
        "reason": "I10 Essential hypertension",
        "reason_code": "I10",
        "reason_zh": "I10 原發性高血壓",
        "row_id": "AAFxzWAAIAAIATTAAY",
        "secondary_diagnoses": [],
        "type_display": "IC卡資料",
      }
    `);
  });

  test("IHKE3306S02 medication detail (bilingual fields + visit context)", () => {
    const { drug, visit } = load("ihke3306s02-medication.json");
    expect(adaptMedicationFromDetail(drug, visit)).toMatchInlineSnapshot(`
      {
        "code": "B025823100",
        "course_of_therapy": "",
        "date": "2025-05-18",
        "dosage_text": "",
        "dose": "",
        "drug_class": "ANTIPLATELET AGENTS",
        "drug_class_zh": "抗血小板藥",
        "drug_name": "ASPIRIN 100MG",
        "drug_name_zh": "阿斯匹靈100毫克",
        "duration_days": 30,
        "end_date": "",
        "frequency": "",
        "hospital": "長庚嘉義",
        "indication": "Essential hypertension",
        "indication_code": "I10",
        "indication_zh": "原發性高血壓",
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

  test("IHKE3209 catastrophic illness (problem-list Condition)", () => {
    expect(adaptCatastrophicIllness(load("ihke3209-catastrophic-illness.json"))).toMatchInlineSnapshot(`
      {
        "category": "problem-list-item",
        "clinical_status": "active",
        "code": "",
        "display": "攝護腺惡性腫瘤",
        "hospital": "臺北榮總",
        "onset_date": "2020-11-16",
        "recorded_date": "2020-11-16",
        "severity": "Severe (重大傷病)",
        "system": "",
      }
    `);
  });

  test("IHKE3402 adult preventive (one row → ~14 Observations from live payload)", () => {
    // Live capture: HBsAg / Anti-HCV / Urine Protein come back as status
    // codes ("1" / "1" / "0") with paired _TEXT fields. The adapter must
    // emit the _TEXT side as the observation value so downstream apps
    // surface "陰性" / "-", not raw status codes. This snapshot pins
    // the whole projection so the bug regressed in v0.6.3 (and tracked
    // down here in v0.6.5) can never reappear silently.
    const out = adaptAdultPreventive(load("ihke3402-adult-preventive.json"));
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
          "value": "70",
        },
        {
          "category": "vital-signs",
          "display": "BMI",
          "value": "24",
        },
        {
          "category": "vital-signs",
          "display": "Waist Circumference",
          "value": "86",
        },
        {
          "category": "vital-signs",
          "display": "Systolic Blood Pressure",
          "value": "150",
        },
        {
          "category": "vital-signs",
          "display": "Diastolic Blood Pressure",
          "value": "100",
        },
        {
          "category": "laboratory",
          "display": "Cholesterol",
          "value": "199",
        },
        {
          "category": "laboratory",
          "display": "Triglyceride",
          "value": "93",
        },
        {
          "category": "laboratory",
          "display": "HDL",
          "value": "42",
        },
        {
          "category": "laboratory",
          "display": "LDL",
          "value": "138",
        },
        {
          "category": "laboratory",
          "display": "SGOT (AST)",
          "value": "23",
        },
        {
          "category": "laboratory",
          "display": "SGPT (ALT)",
          "value": "23",
        },
        {
          "category": "laboratory",
          "display": "Glu-AC",
          "value": "92",
        },
        {
          "category": "laboratory",
          "display": "Creatinine",
          "value": "1",
        },
        {
          "category": "laboratory",
          "display": "eGFR",
          "value": "91",
        },
        {
          "category": "laboratory",
          "display": "Urine Protein",
          "value": "-",
        },
        {
          "category": "laboratory",
          "display": "HBsAg",
          "value": "陰性",
        },
        {
          "category": "laboratory",
          "display": "Anti-HCV",
          "value": "陰性",
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
