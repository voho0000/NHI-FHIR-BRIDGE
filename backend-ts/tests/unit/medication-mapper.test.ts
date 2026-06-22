/**
 * Medication mapper unit tests.
 * Port of backend/tests/unit/test_medication_mapper.py.
 */

import { describe, expect, test } from "vitest";

import { canonicalDrugKey, mapMedicationsDedup } from "@nhi-fhir-bridge/mapper";

const PATIENT_ID = "A123456789";

describe("canonicalDrugKey", () => {
  test("English only", () => {
    expect(canonicalDrugKey("TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION")).toBe(
      "timoptol xe 0.5% ophthalmic solution",
    );
  });

  test("Eng then 中 collapses to same key", () => {
    expect(canonicalDrugKey("TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION (青眼露)")).toBe(
      "timoptol xe 0.5% ophthalmic solution",
    );
  });

  test("中 then Eng collapses to same key", () => {
    expect(canonicalDrugKey("青眼露 (TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION)")).toBe(
      "timoptol xe 0.5% ophthalmic solution",
    );
  });

  test("trailing dash modifier stripped", () => {
    expect(canonicalDrugKey("FLUCASON OPHTHALMIC SUSPENSION 0.02% - FLUOROMETHOLONE")).toBe(
      "flucason ophthalmic suspension 0.02%",
    );
  });

  test("Chinese-only falls back", () => {
    expect(canonicalDrugKey("護康視懸濁點眼液")).toBe("護康視懸濁點眼液");
  });
});

describe("mapMedicationsDedup", () => {
  test("three-format duplicates collapse to one", () => {
    const items = [
      {
        drug_name: "TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION",
        date: "2024-01-15",
        dose: "1",
        unit: "drop",
        frequency: "BID",
        route: "topical",
      },
      {
        drug_name: "TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION (青眼露)",
        date: "2024-01-15",
        dose: "1",
        unit: "drop",
        frequency: "BID",
        route: "topical",
      },
      {
        drug_name: "青眼露 (TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION)",
        date: "2024-01-15",
        dose: "1",
        unit: "drop",
        frequency: "BID",
        route: "topical",
      },
    ];
    const resources = mapMedicationsDedup(items, PATIENT_ID);
    expect(resources).toHaveLength(1);
    expect(resources[0]!.resourceType).toBe("MedicationRequest");
  });

  test("different dates kept separate", () => {
    const items = [
      { drug_name: "Aspirin 100mg", date: "2024-01-15", dose: "100", unit: "mg" },
      { drug_name: "Aspirin 100mg", date: "2024-02-15", dose: "100", unit: "mg" },
    ];
    expect(mapMedicationsDedup(items, PATIENT_ID)).toHaveLength(2);
  });

  test("different drugs kept separate", () => {
    const items = [
      { drug_name: "Aspirin 100mg", date: "2024-01-15", dose: "100", unit: "mg" },
      { drug_name: "Metformin 500mg", date: "2024-01-15", dose: "500", unit: "mg" },
    ];
    expect(mapMedicationsDedup(items, PATIENT_ID)).toHaveLength(2);
  });

  test("same drug+date kept separate when quantity OR diagnosis differs (cross-claim, 2026-06-15 repro)", () => {
    // Real 長庚嘉義 5/18 admission: 泰克胃通靜脈注射劑 appeared in TWO claim
    // rows — qty=2 under dx R042 (咳血) AND qty=1 under dx K92.0 (吐血). The
    // old (drug,date)-only key collapsed them and the qty=2 order silently
    // vanished. They are distinct orders (different quantity AND indication)
    // so both must survive with distinct, collision-free ids.
    const items = [
      {
        drug_name: "Takepron Intravenous 30mg",
        code: "BC25246243",
        date: "2025-05-18",
        quantity: "2",
        indication: "Hemoptysis",
        indication_zh: "咳血",
        indication_code: "R042",
        hospital: "長庚嘉義",
      },
      {
        drug_name: "Takepron Intravenous 30mg",
        code: "BC25246243",
        date: "2025-05-18",
        quantity: "1",
        indication: "Hematemesis",
        indication_zh: "吐血",
        indication_code: "K920",
        hospital: "長庚嘉義",
      },
    ];
    const resources = mapMedicationsDedup(items, PATIENT_ID);
    expect(resources).toHaveLength(2);
    expect(resources[0]!.id).not.toBe(resources[1]!.id);
    const qtys = resources.map((r) => r.dispenseRequest.quantity.value).sort();
    expect(qtys).toEqual([1, 2]);
    // reasonCode text stays clean ("<code> <繁中>") for both indications.
    const texts = resources.map((r) => r.reasonCode[0].text).sort();
    expect(texts).toEqual(["K920 吐血", "R042 咳血"]);
  });

  test("language variants with identical qty + dx still collapse (no over-split)", () => {
    // Guard the OTHER direction: adding qty + dx to the dedup key must NOT
    // split a genuine 中英 language-variant pair that shares quantity AND
    // indication — that is exactly the duplicate the dedup exists to remove.
    const items = [
      {
        drug_name: "TAKEPRON OD 30MG TABLETS",
        date: "2025-05-18",
        quantity: "10",
        indication_code: "R042",
      },
      {
        drug_name: "泰克胃通 口溶錠30毫克 (TAKEPRON OD 30MG TABLETS)",
        date: "2025-05-18",
        quantity: "10",
        indication_code: "R042",
      },
    ];
    expect(mapMedicationsDedup(items, PATIENT_ID)).toHaveLength(1);
  });

  test("inpatient end_date emits dispenseRequest.validityPeriod covering the stay", () => {
    // Adapter emits end_date for inpatient summary rows (cure_E_DATE
    // differs from func_DATE). Mapper should attach a validityPeriod
    // so SMART apps render "used during admission 5/18-5/22" rather
    // than "prescribed on 5/18 day".
    const resources = mapMedicationsDedup(
      [
        {
          drug_name: "TAKEPRON OD 30MG TABLETS",
          code: "BC24273100",
          date: "2025-05-18",
          end_date: "2025-05-22",
          quantity: "10",
          drug_class: "PROTON-PUMP INHIBITOR",
          hospital: "長庚嘉義",
        },
      ],
      PATIENT_ID,
    );
    expect(resources).toHaveLength(1);
    const dr = resources[0]!.dispenseRequest;
    expect(dr).toBeDefined();
    expect(dr.validityPeriod).toEqual({
      start: "2025-05-18T00:00:00+08:00",
      end: "2025-05-22T23:59:59+08:00",
    });
    // authoredOn stays as the admission anchor — best-effort start.
    expect(resources[0]!.authoredOn).toBe("2025-05-18T00:00:00+08:00");
  });

  test("OPD drug (no end_date) emits no validityPeriod", () => {
    const resources = mapMedicationsDedup(
      [
        {
          drug_name: "FLUCASON OPHTHALMIC SUSPENSION",
          date: "2026-02-13",
          quantity: "1",
          duration_days: 28,
        },
      ],
      PATIENT_ID,
    );
    expect(resources).toHaveLength(1);
    const dr = resources[0]!.dispenseRequest;
    expect(dr).toBeDefined();
    expect(dr.validityPeriod).toBeUndefined();
    // expectedSupplyDuration still produced from duration_days.
    expect(dr.expectedSupplyDuration.value).toBe(28);
  });

  test("course_of_therapy=continuous emits courseOfTherapyType", () => {
    // Chronic prescription path: adapter saw is_chronic=true on a row
    // from the IHKE3307S01 list, mapper should attach the standard
    // FHIR continuous-therapy CodeableConcept.
    const resources = mapMedicationsDedup(
      [
        {
          drug_name: "DETRUSITOL SR PROLONGED-RELEASE CAPSULES 4MG",
          code: "BC23568100",
          date: "2026-05-13",
          quantity: "30",
          duration_days: 30,
          course_of_therapy: "continuous",
        },
      ],
      PATIENT_ID,
    );
    expect(resources).toHaveLength(1);
    expect(resources[0]!.courseOfTherapyType).toEqual({
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
          code: "continuous",
          display: "Continuous long term therapy",
        },
      ],
      text: "Continuous long term therapy",
    });
  });

  test("acute drug (no course_of_therapy) leaves field unset", () => {
    const resources = mapMedicationsDedup(
      [
        {
          drug_name: "TAKEPRON OD 30MG TABLETS",
          date: "2026-02-13",
          quantity: "10",
        },
      ],
      PATIENT_ID,
    );
    expect(resources).toHaveLength(1);
    expect(resources[0]!.courseOfTherapyType).toBeUndefined();
  });

  test("empty course_of_therapy string is treated as acute (no field)", () => {
    // Defensive: adapter emits course_of_therapy: "" for non-chronic
    // rows. Mapper should not attach an empty CodeableConcept.
    const resources = mapMedicationsDedup(
      [
        {
          drug_name: "X",
          date: "2026-02-13",
          quantity: "1",
          course_of_therapy: "",
        },
      ],
      PATIENT_ID,
    );
    expect(resources[0]!.courseOfTherapyType).toBeUndefined();
  });

  test("v0.8.0 bilingual: text=繁中, coding[0].display=English on all three fields", () => {
    // Patient-facing CodeableConcept.text gets Chinese, while the
    // clinical/technical coding[].display stays English. Covers:
    //   medicationCodeableConcept, category, reasonCode
    const resources = mapMedicationsDedup(
      [
        {
          drug_name: "DIOVAN FILM-COATED TABLETS 160MG",
          drug_name_zh: "得安穩膜衣錠160毫克",
          code: "BC23374100",
          date: "2026-03-31",
          quantity: "28",
          duration_days: 28,
          drug_class: "HYPOTENSIVE AGENTS",
          drug_class_zh: "降血壓藥",
          indication: "Nonrheumatic aortic valve disorder, unspecified",
          indication_zh: "非風濕性未明示主動脈瓣疾患",
          indication_code: "I359",
        },
      ],
      PATIENT_ID,
    );
    expect(resources).toHaveLength(1);
    const r = resources[0]!;
    // medicationCodeableConcept
    expect(r.medicationCodeableConcept.text).toBe("得安穩膜衣錠160毫克");
    expect(r.medicationCodeableConcept.coding[0].display).toBe("DIOVAN FILM-COATED TABLETS 160MG");
    // category
    expect(r.category[0].text).toBe("降血壓藥");
    expect(r.category[0].coding[0].display).toBe("HYPOTENSIVE AGENTS");
    // reasonCode — patient text in 繁中 with raw NHI code prefix,
    // clinical coding with canonical ICD-10-CM format ("I35.9" with
    // decimal — normalizeIcd10Cm inserts it).
    expect(r.reasonCode[0].text).toBe("I359 非風濕性未明示主動脈瓣疾患");
    expect(r.reasonCode[0].coding[0]).toEqual({
      system: "http://hl7.org/fhir/sid/icd-10-cm",
      code: "I35.9",
      display: "Nonrheumatic aortic valve disorder, unspecified",
    });
  });

  test("v0.8.0 fallback: no _zh field → English used for both text and display", () => {
    // Defensive — when NHI ships English-only for a rare drug, we don't
    // want a blank `text`. Mapper falls back to the English drug_name.
    const resources = mapMedicationsDedup(
      [
        {
          drug_name: "RARE DRUG WITH NO CHINESE",
          code: "X000000",
          date: "2026-03-31",
          quantity: "1",
        },
      ],
      PATIENT_ID,
    );
    const r = resources[0]!;
    expect(r.medicationCodeableConcept.text).toBe("RARE DRUG WITH NO CHINESE");
    expect(r.medicationCodeableConcept.coding[0].display).toBe("RARE DRUG WITH NO CHINESE");
  });

  // ── v0.10.0 — derived dosageInstruction.text from qty + days ────
  // SMART app dev bug report U1: 758/758 MedicationRequests shipped
  // without dosageInstruction. NHI 健保存摺 IHKE3306S02 doesn't expose
  // 用法 as a discrete field, BUT it does ship 給藥日數 + 給藥總量.
  // The ratio is the only daily-frequency signal we get from NHI raw,
  // so we derive a transport-only text. Faithful transport preserved —
  // value comes entirely from NHI raw, we just compute the ratio and
  // label it.

  test("v0.10.0 — qty + days derive dosageInstruction.text", () => {
    const resources = mapMedicationsDedup(
      [
        {
          drug_name: "ASPIRIN 100MG",
          code: "B025823100",
          date: "2025-05-18",
          quantity: 30,
          duration_days: 30,
        },
      ],
      PATIENT_ID,
    );
    const r = resources[0]!;
    expect(r.dosageInstruction).toBeDefined();
    // P2-b (2026-06-08): NHI's own field labels 給藥總量 / 給藥日數 verbatim
    // — no fabricated "dose" unit (NHI ships a bare count). zh-TW matches
    // the bundle's patient-facing .text convention.
    expect(r.dosageInstruction[0].text).toBe("給藥總量 30，給藥日數 30 天（平均每日 1）");
  });

  test("v0.10.0 — BID-pattern qty (60 over 30 days) → 平均每日 2", () => {
    const resources = mapMedicationsDedup(
      [
        {
          drug_name: "METFORMIN 500MG",
          code: "B000000",
          date: "2025-05-18",
          quantity: 60,
          duration_days: 30,
        },
      ],
      PATIENT_ID,
    );
    expect(resources[0]!.dosageInstruction[0].text).toBe(
      "給藥總量 60，給藥日數 30 天（平均每日 2）",
    );
  });

  test("v0.10.0 — non-integer rate rounds to 2 decimals", () => {
    const resources = mapMedicationsDedup(
      [
        {
          drug_name: "TEST",
          code: "B000001",
          date: "2025-05-18",
          quantity: 45,
          duration_days: 30,
        },
      ],
      PATIENT_ID,
    );
    expect(resources[0]!.dosageInstruction[0].text).toBe(
      "給藥總量 45，給藥日數 30 天（平均每日 1.5）",
    );
  });

  test("P2-b — dispenseRequest.quantity carries value but NO fabricated unit", () => {
    // CLAUDE.md rule #8 silent-bug gate + faithful-transport rule: NHI
    // IHKE3306S02 ships 給藥總量 with no dispensing-unit field. The bridge
    // must NOT invent one (錠 / mL / 支 vary by dosage form). A bare
    // SimpleQuantity.value is FHIR R4 valid.
    const resources = mapMedicationsDedup(
      [
        {
          drug_name: "ASPIRIN 100MG",
          code: "B025823100",
          date: "2025-05-18",
          quantity: 30,
          duration_days: 30,
        },
      ],
      PATIENT_ID,
    );
    const dr = resources[0]!.dispenseRequest;
    expect(dr.quantity.value).toBe(30);
    expect(dr.quantity.unit).toBeUndefined();
    expect(dr.quantity.code).toBeUndefined();
    expect(dr.quantity.system).toBeUndefined();
  });

  test("v0.10.0 — explicit dosage_text still wins over derived (priority preserved)", () => {
    const resources = mapMedicationsDedup(
      [
        {
          drug_name: "ASPIRIN",
          code: "B025823100",
          date: "2025-05-18",
          quantity: 30,
          duration_days: 30,
          dosage_text: "QD AC",
        },
      ],
      PATIENT_ID,
    );
    // dosage_text branch fires first — derived qty/days branch never reached.
    expect(resources[0]!.dosageInstruction[0].text).toBe("QD AC");
  });

  test("v0.10.0 — qty or days missing → no derived dosageInstruction emitted", () => {
    const resources = mapMedicationsDedup(
      [{ drug_name: "TEST", code: "B000002", date: "2025-05-18", quantity: 30 }],
      PATIENT_ID,
    );
    // days missing → no derived text → no dosageInstruction at all.
    expect(resources[0]!.dosageInstruction).toBeUndefined();
  });
});

// Hospital joins the medication fingerprint (2026-06-23) — same class of bug as
// the old Encounter (date,class,hospital) over-merge: the same drug/qty/dx the
// same day at two hospitals are two distinct orders, not one.
describe("medication id — hospital in the fingerprint", () => {
  const mk = (hospital: string) => ({
    drug_name: "Forxiga 10mg",
    code: "BC26476100",
    date: "2026-06-02",
    quantity: "28",
    indication_code: "N1832",
    hospital,
  });

  test("identical order at TWO hospitals stays distinct (was silently merged)", () => {
    const resources = mapMedicationsDedup([mk("長庚嘉義"), mk("臺北榮總")], PATIENT_ID);
    expect(resources).toHaveLength(2);
    expect(resources[0]!.id).not.toBe(resources[1]!.id);
  });

  test("same order at the SAME hospital still collapses to one (no over-split)", () => {
    expect(mapMedicationsDedup([mk("長庚嘉義"), mk("長庚嘉義")], PATIENT_ID)).toHaveLength(1);
  });
});
