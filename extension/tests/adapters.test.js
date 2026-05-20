// Unit tests for the NHI JSON → normalized shape adapters.
//
// Reason this file exists: v0.6.1 shipped a "wrong date field" bug
// (inpatient labs all collapsed onto admission day) because adapter
// functions had ZERO coverage — they sat inside background.js next to
// chrome.* / SW globals and couldn't be loaded under a test runner.
// The fix in 0.6.2 extracts them into a pure module, and these tests
// pin down the field-priority decisions so a future regression flips
// red in CI before reaching users.
//
// Test priorities (covered in order below):
//   1. Date field choice — most clinically dangerous bug class
//   2. Required-field validation (null inputs, missing keys)
//   3. Bilingual / casing variants in NHI's JSON keys
//   4. End-to-end fixture snapshots so structural drift is caught

import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import {
  adaptAdultPreventive,
  adaptAllergy,
  adaptCatastrophicIllness,
  adaptEncounterFromMedExpense,
  adaptImagingReportFromDetail,
  adaptInpatientEncounter,
  adaptLabItem,
  adaptMedication,
  adaptMedicationFromDetail,
  adaptProcedureFromDetail,
  adaptProcedureListStub,
  isoToROC,
  pickEnglish,
  rocToISO,
} from "../src/nhi-adapters.js";

const FIX = resolve(dirname(fileURLToPath(import.meta.url)), "fixtures");
const readFixture = (name) => JSON.parse(readFileSync(resolve(FIX, name), "utf8"));

// ── Date / string helpers ───────────────────────────────────────────────

describe("rocToISO", () => {
  test("converts 民國 YYY/MM/DD to ISO YYYY-MM-DD", () => {
    expect(rocToISO("114/05/22")).toBe("2025-05-22");
    expect(rocToISO("115/01/14")).toBe("2026-01-14");
  });
  test("accepts dashes and dots as separators", () => {
    expect(rocToISO("114-05-22")).toBe("2025-05-22");
    expect(rocToISO("114.05.22")).toBe("2025-05-22");
  });
  test("matches the leading ROC segment when input is bilingual ROC||西元", () => {
    // NHI returns some date fields as "115/05/05||2026/05/05" — we
    // anchor on the ROC half so we don't double-apply the year offset.
    expect(rocToISO("115/05/05||2026/05/05")).toBe("2026-05-05");
  });
  test("pads single-digit month/day", () => {
    expect(rocToISO("114/5/2")).toBe("2025-05-02");
  });
  test("returns empty string for null / empty / non-date inputs", () => {
    expect(rocToISO(null)).toBe("");
    expect(rocToISO(undefined)).toBe("");
    expect(rocToISO("")).toBe("");
    expect(rocToISO("not a date")).toBe("");
    expect(rocToISO("2025-05-22")).toBe(""); // already ISO — not our format
  });
});

describe("isoToROC", () => {
  test("converts ISO to 民國 with zero padding", () => {
    expect(isoToROC("2025-05-22")).toBe("114/05/22");
    expect(isoToROC("2025-1-2")).toBe("114/01/02");
  });
  test("returns empty for pre-民國 dates (year < 1912)", () => {
    expect(isoToROC("1911-12-31")).toBe("");
    expect(isoToROC("1900-01-01")).toBe("");
  });
  test("returns empty for falsy / unparseable inputs", () => {
    expect(isoToROC(null)).toBe("");
    expect(isoToROC("")).toBe("");
    expect(isoToROC("garbage")).toBe("");
  });
});

describe("pickEnglish", () => {
  test("returns English half when bilingual 中文||English", () => {
    expect(pickEnglish("良性攝護腺肥大||Benign prostatic hyperplasia"))
      .toBe("Benign prostatic hyperplasia");
  });
  test("falls back to Chinese half when English half is empty", () => {
    expect(pickEnglish("某中文||")).toBe("某中文");
    expect(pickEnglish("某中文||   ")).toBe("某中文");
  });
  test("returns the whole string trimmed when no || separator", () => {
    expect(pickEnglish("  plain string  ")).toBe("plain string");
    expect(pickEnglish("純中文")).toBe("純中文");
  });
  test("handles null / undefined / non-string", () => {
    expect(pickEnglish(null)).toBe("");
    expect(pickEnglish(undefined)).toBe("");
    expect(pickEnglish(123)).toBe("123"); // stringified, no separator
  });
});

// ── adaptLabItem — IHKE3409 / IHKE3404 ──────────────────────────────────

describe("adaptLabItem", () => {
  // The v0.6.1 regression — pin this hard.
  test("date prefers reaL_INSPECT_DATE over funC_DATE (inpatient case)", () => {
    const item = {
      funC_DATE: "114/05/18",        // admission
      reaL_INSPECT_DATE: "114/05/22", // actual sample draw, 4 days into stay
      assaY_VALUE: "191",
      assaY_ITEM_NAME: "FINGER SUGAR",
    };
    expect(adaptLabItem(item).date).toBe("2025-05-22");
  });

  test("date falls back to funC_DATE when reaL_INSPECT_DATE is missing", () => {
    const item = {
      funC_DATE: "114/05/18",
      assaY_VALUE: "191",
      assaY_ITEM_NAME: "FINGER SUGAR",
    };
    expect(adaptLabItem(item).date).toBe("2025-05-18");
  });

  test("date falls back to funC_DATE when reaL_INSPECT_DATE is null (NHI sometimes nulls it)", () => {
    const item = {
      funC_DATE: "114/05/18",
      reaL_INSPECT_DATE: null,
      assaY_VALUE: "191",
      assaY_ITEM_NAME: "FINGER SUGAR",
    };
    expect(adaptLabItem(item).date).toBe("2025-05-18");
  });

  test("date falls back to funC_DATE when reaL_INSPECT_DATE is empty string", () => {
    const item = {
      funC_DATE: "114/05/18",
      reaL_INSPECT_DATE: "",
      assaY_VALUE: "191",
      assaY_ITEM_NAME: "FINGER SUGAR",
    };
    expect(adaptLabItem(item).date).toBe("2025-05-18");
  });

  test("returns null when no date at all", () => {
    expect(adaptLabItem({ assaY_VALUE: "191", assaY_ITEM_NAME: "X" })).toBeNull();
  });

  test("returns null when no assaY_VALUE (zero would be a real reading and is kept)", () => {
    expect(adaptLabItem({ funC_DATE: "114/05/18", assaY_ITEM_NAME: "X" })).toBeNull();
    expect(adaptLabItem({ funC_DATE: "114/05/18", assaY_VALUE: "", assaY_ITEM_NAME: "X" })).toBeNull();
    expect(adaptLabItem({ funC_DATE: "114/05/18", assaY_VALUE: null, assaY_ITEM_NAME: "X" })).toBeNull();
    // Zero is a real (low) result — keep it
    expect(adaptLabItem({ funC_DATE: "114/05/18", assaY_VALUE: 0, assaY_ITEM_NAME: "X" }))
      .toMatchObject({ value: "0" });
  });

  test("prefers full assaY_ITEM_NAME over UI-truncated order_shortname", () => {
    const item = {
      funC_DATE: "114/05/18",
      assaY_VALUE: "191",
      assaY_ITEM_NAME: "PC Sugar 飯後兩小時血糖",
      order_shortname: "PC Sugar 飯後 ...",
    };
    const r = adaptLabItem(item);
    expect(r.code).toBe("PC Sugar 飯後兩小時血糖");
    expect(r.display).toBe("PC Sugar 飯後兩小時血糖");
  });

  test("falls back to order_shortname when assaY_ITEM_NAME absent", () => {
    const item = {
      funC_DATE: "114/05/18",
      assaY_VALUE: "191",
      order_shortname: "FINGER SUGAR",
    };
    expect(adaptLabItem(item).code).toBe("FINGER SUGAR");
  });

  test("returns null on null / non-object input", () => {
    expect(adaptLabItem(null)).toBeNull();
    expect(adaptLabItem(undefined)).toBeNull();
    expect(adaptLabItem("string")).toBeNull();
  });

  test("end-to-end fixture: live IHKE3409 row produces expected shape", () => {
    const fixture = readFixture("ihke3409-lab-inpatient.json");
    expect(adaptLabItem(fixture)).toEqual({
      date: "2025-05-22",
      order_code: "09140C",
      order_name: "血液及體液葡萄糖-餐後",
      // code is the NHI 醫令碼 (stable across hospitals), display is
      // the cleaned hospital free-text label.
      code: "09140C",
      display: "FINGER SUGAR",
      value: "191",
      unit: "mg/dL",
      reference_range: "[70][140]",
      hospital: "長庚嘉義",
    });
  });

  // Round 1 of the "Crea vs Crea," fix — feed the NHI 醫令碼 as the
  // observation code so SMART apps group the same physical test across
  // hospitals, regardless of free-text label differences.
  test("prefers NHI ordeR_CODE for code, free-text for display", () => {
    const r = adaptLabItem({
      funC_DATE: "114/05/18",
      ordeR_CODE: "09027C",
      ordeR_NAME: "肌酸酐、血",
      assaY_ITEM_NAME: "Crea",
      assaY_VALUE: "1.1",
    });
    expect(r.code).toBe("09027C");      // stable across hospitals
    expect(r.display).toBe("Crea");     // cleaned hospital label
  });

  test("strips trailing comma / whitespace from free-text display", () => {
    expect(adaptLabItem({
      funC_DATE: "114/05/18",
      ordeR_CODE: "09027C",
      assaY_ITEM_NAME: "Crea,",
      assaY_VALUE: "1.2",
    }).display).toBe("Crea");

    expect(adaptLabItem({
      funC_DATE: "114/05/18",
      ordeR_CODE: "09027C",
      assaY_ITEM_NAME: "Crea， ",   // 中文逗號 + trailing space
      assaY_VALUE: "1.2",
    }).display).toBe("Crea");

    expect(adaptLabItem({
      funC_DATE: "114/05/18",
      ordeR_CODE: "09027C",
      assaY_ITEM_NAME: "  ALT/GPT ;  ",   // semicolons + whitespace
      assaY_VALUE: "30",
    }).display).toBe("ALT/GPT");
  });

  test("two hospitals reporting same ordeR_CODE → same code (the SMART-app grouping fix)", () => {
    const fixture = readFixture("ihke3409-creatinine-two-hospitals.json");
    const [a, b] = fixture.rows.map(adaptLabItem);

    // The whole point: same NHI 醫令碼 → same FHIR code → SMART app
    // sees them as the same physical test even though hospital labels
    // differ ("Crea" vs "Crea,").
    expect(a.code).toBe("09027C");
    expect(b.code).toBe("09027C");
    expect(a.code).toBe(b.code);

    // Display is per-hospital but normalized — trailing comma removed.
    expect(a.display).toBe("Crea");
    expect(b.display).toBe("Crea");

    // Original NHI 醫令碼 name preserved separately.
    expect(a.order_name).toBe("肌酸酐、血");
    expect(b.order_name).toBe("肌酸酐、血");

    // But dates and values are independent — they're distinct
    // measurements taken at different times.
    expect(a.date).not.toBe(b.date);
    expect(a.value).not.toBe(b.value);
  });

  test("falls back to free-text when ordeR_CODE is missing", () => {
    // Some older rows / edge endpoints may not carry ordeR_CODE. The
    // adapter should degrade gracefully — code falls back to the
    // cleaned display, downstream mapper routes it under
    // HIS_LOCAL_LAB_CODE instead of NHI_MEDICAL_ORDER_CODE.
    const r = adaptLabItem({
      funC_DATE: "114/05/18",
      assaY_ITEM_NAME: "Some Unmapped Test",
      assaY_VALUE: "42",
    });
    expect(r.code).toBe("Some Unmapped Test");
    expect(r.display).toBe("Some Unmapped Test");
  });
});

// ── adaptImagingReportFromDetail — IHKE3408S02 ─────────────────────────

describe("adaptImagingReportFromDetail", () => {
  test("date prefers real_INSPECT_DATE when present", () => {
    const item = {
      func_DATE: "115/01/14",
      real_INSPECT_DATE: "115/01/16",
      assay_UPLOAD_DATE: "115/02/24 12:03",
      order_NAME: "CT",
      desc: "report body",
    };
    expect(adaptImagingReportFromDetail(item).date).toBe("2026-01-16");
  });

  test("date falls back to func_DATE when real_INSPECT_DATE is null", () => {
    const item = {
      func_DATE: "115/01/14",
      real_INSPECT_DATE: null,
      assay_UPLOAD_DATE: "115/02/24 12:03",
      order_NAME: "CT",
      desc: "report body",
    };
    expect(adaptImagingReportFromDetail(item).date).toBe("2026-01-14");
  });

  test("date never uses assay_UPLOAD_DATE (would be weeks after the real exam)", () => {
    const item = {
      func_DATE: "115/01/14",
      real_INSPECT_DATE: null,
      assay_UPLOAD_DATE: "115/02/24 12:03",
      order_NAME: "CT",
      desc: "report body",
    };
    // The output date must match func_DATE, NOT the upload date.
    expect(adaptImagingReportFromDetail(item).date).toBe("2026-01-14");
    expect(adaptImagingReportFromDetail(item).date).not.toBe("2026-02-24");
  });

  test("date prefers main_tit over func_DATE when real_INSPECT_DATE is null", () => {
    // OPD case: order written 1/31, exam actually done + signed off 2/29.
    // func_DATE is the order day (wrong as exam date), main_tit is the
    // sign-off / exam day (correct).
    const item = {
      main_tit: "113/02/29",
      func_DATE: "113/01/31",
      real_INSPECT_DATE: null,
      assay_UPLOAD_DATE: "113/03/12 03:01",
      order_NAME: "ECG",
      desc: "SINUS RHYTHM",
    };
    expect(adaptImagingReportFromDetail(item).date).toBe("2024-02-29");
    expect(adaptImagingReportFromDetail(item).date).not.toBe("2024-01-31");
  });

  test("date still falls back to func_DATE when main_tit also missing", () => {
    // Defensive: a malformed row without main_tit and without
    // real_INSPECT_DATE shouldn't be dropped — func_DATE keeps the
    // resource alive even if the date may be the order day.
    const item = {
      func_DATE: "115/01/14",
      real_INSPECT_DATE: null,
      main_tit: null,
      assay_UPLOAD_DATE: "115/02/24 12:03",
      order_NAME: "CT",
      desc: "report body",
    };
    expect(adaptImagingReportFromDetail(item).date).toBe("2026-01-14");
  });

  test("issued field parses assay_UPLOAD_DATE date portion (drops time)", () => {
    const item = {
      func_DATE: "115/01/14",
      assay_UPLOAD_DATE: "115/02/24 12:03",
      order_NAME: "CT",
      desc: "report body",
    };
    expect(adaptImagingReportFromDetail(item).issued).toBe("2026-02-24");
  });

  test("returns null when desc (report body) is missing — no narrative = no DR", () => {
    expect(adaptImagingReportFromDetail({
      func_DATE: "115/01/14",
      order_NAME: "CT",
    })).toBeNull();
  });

  test("returns null when order_NAME is missing", () => {
    expect(adaptImagingReportFromDetail({
      func_DATE: "115/01/14",
      desc: "body",
    })).toBeNull();
  });

  test("end-to-end fixture: live IHKE3408S02 row produces expected date / category / issued", () => {
    const fixture = readFixture("ihke3408-imaging-detail.json");
    const r = adaptImagingReportFromDetail(fixture);
    expect(r.date).toBe("2026-01-14");
    expect(r.issued).toBe("2026-02-24");
    expect(r.category).toBe("RAD");
    expect(r.display).toContain("電腦斷層造影");
    expect(r.code).toBe("33070B");
    expect(r.hospital).toBe("長庚嘉義");
  });

  test("end-to-end fixture: delayed-signoff ECG uses main_tit as exam date", () => {
    // Anonymized capture: OPD ECG, real_INSPECT_DATE null, main_tit
    // and func_DATE differ by ~1 month. Regression for the case where
    // SMART apps saw the exam dated to the order day instead of the
    // sign-off / actual exam day.
    const fixture = readFixture("ihke3408-ecg-delayed-signoff.json");
    const r = adaptImagingReportFromDetail(fixture);
    expect(r.date).toBe("2024-02-29");
    expect(r.issued).toBe("2024-03-12");
    expect(r.category).toBe("RAD");
    expect(r.code).toBe("18001C");
    expect(r.hospital).toBe("臺北榮總");
  });
});

// ── adaptProcedureListStub — IHKE3301S05 ─────────────────────────────

describe("adaptProcedureListStub", () => {
  test("always returns null; the list endpoint only provides row_ids that drive the IHKE3308S02 fan-out", () => {
    expect(adaptProcedureListStub()).toBeNull();
    expect(adaptProcedureListStub({ func_date: "105/09/23", op_code_cname: "X" })).toBeNull();
  });
});

// ── adaptProcedureFromDetail — IHKE3308S02 ───────────────────────────

describe("adaptProcedureFromDetail", () => {
  test("date prefers sub-list exe_S_DATE over func_DATE (inpatient mid-stay procedure case)", () => {
    // Simulated inpatient case where the procedure was performed
    // mid-stay (admit 9/23, surgery 9/25). Anchoring on func_DATE
    // would land the procedure on the admission day; exe_S_DATE
    // gives the truth.
    const item = {
      func_DATE: "115/09/23",
      op_CODE: "08B53ZZ",
      op_CODE_CNAME: "08B53ZZ/X||08B53ZZ/X",
      sp_IHKE3308S04_data_list: [
        { exe_S_DATE: "115/09/25||2026/09/25", order_CODE: "86412B", order_CODE_NAME: "Y||Y" },
      ],
    };
    expect(adaptProcedureFromDetail(item).date).toBe("2026-09-25");
  });

  test("date falls back to func_DATE when sub-list is empty", () => {
    const item = {
      func_DATE: "105/09/23",
      op_CODE: "08B53ZZ",
      op_CODE_CNAME: "08B53ZZ/X||08B53ZZ/X",
      sp_IHKE3308S04_data_list: [],
    };
    expect(adaptProcedureFromDetail(item).date).toBe("2016-09-23");
  });

  test("display strips leading <CODE>/ prefix from English op_CODE_CNAME", () => {
    const item = {
      func_DATE: "105/09/23",
      op_CODE: "08B53ZZ",
      op_CODE_CNAME: "08B53ZZ/經皮左側玻璃體部分切除術||08B53ZZ/Excision of Left Vitreous, Percutaneous Approach",
      sp_IHKE3308S04_data_list: [
        { exe_S_DATE: "105/09/23", order_CODE_NAME: "Y||Y" },
      ],
    };
    expect(adaptProcedureFromDetail(item).display).toBe(
      "Excision of Left Vitreous, Percutaneous Approach",
    );
  });

  test("emits op_CODE as code + icd-10-pcs system hint", () => {
    const item = {
      func_DATE: "105/09/23",
      op_CODE: "08B53ZZ",
      op_CODE_CNAME: "08B53ZZ/X||08B53ZZ/X",
      sp_IHKE3308S04_data_list: [
        { exe_S_DATE: "105/09/23", order_CODE_NAME: "Y||Y" },
      ],
    };
    const r = adaptProcedureFromDetail(item);
    expect(r.code).toBe("08B53ZZ");
    expect(r.system).toBe("icd-10-pcs");
  });

  test("note carries reason + each sub-list NHI 醫令碼 (so mapper's note-or-body_site filter keeps it)", () => {
    const item = {
      func_DATE: "105/09/23",
      op_CODE: "08B53ZZ",
      op_CODE_CNAME: "08B53ZZ/X||08B53ZZ/X",
      icd9cm_CODE: "H35372",
      icd9cm_CODE_CNAME: "H35372/左側眼黃斑部皺褶||H35372/Puckering of macula, left eye",
      sp_IHKE3308S04_data_list: [
        {
          exe_S_DATE: "105/09/23",
          order_CODE: "86412B",
          order_CODE_NAME: "微創玻璃體黃斑部手術||Microincision vitreomacular surgery",
        },
      ],
    };
    const r = adaptProcedureFromDetail(item);
    expect(r.note).toContain("Reason: H35372 Puckering of macula, left eye");
    expect(r.note).toContain("施作: Microincision vitreomacular surgery (NHI 86412B)");
  });

  test("returns null when display can't be derived", () => {
    expect(adaptProcedureFromDetail({
      func_DATE: "105/09/23",
      sp_IHKE3308S04_data_list: [{ exe_S_DATE: "105/09/23" }],
    })).toBeNull();
  });

  test("returns null when no date can be derived", () => {
    expect(adaptProcedureFromDetail({
      op_CODE: "X",
      op_CODE_CNAME: "X/Y||X/Y",
    })).toBeNull();
  });

  test("end-to-end fixture: inpatient IHKE3308S02 row", () => {
    const r = adaptProcedureFromDetail(readFixture("ihke3308-procedure-inpatient.json"));
    expect(r.date).toBe("2016-09-23");
    expect(r.code).toBe("08B53ZZ");
    expect(r.display).toBe("Excision of Left Vitreous, Percutaneous Approach");
    expect(r.system).toBe("icd-10-pcs");
    expect(r.hospital).toBe("臺北榮總");
    expect(r.note).toContain("Reason: H35372 Puckering of macula, left eye");
    expect(r.note).toContain("施作: Microincision vitreomacular surgery (NHI 86412B)");
  });

  test("end-to-end fixture: outpatient IHKE3308S02 row (null icd9cm_CODE_CNAME tolerated)", () => {
    const r = adaptProcedureFromDetail(readFixture("ihke3308-procedure-outpatient.json"));
    expect(r.date).toBe("2016-01-14");
    expect(r.code).toBe("3E0C3GC");
    expect(r.display).toBe("Introduction of Other Therapeutic Substance into Eye, Percutaneous Approach");
    expect(r.hospital).toBe("嘉基醫院");
    // icd9cm_CODE_CNAME is null in this fixture — note should still have
    // the sub-list item but no Reason: line.
    expect(r.note).not.toContain("Reason:");
    expect(r.note).toContain("施作: Intravitreous injection (NHI 86201C)");
  });
});

// ── adaptMedicationFromDetail — IHKE3306S02 ───────────────────────────

describe("adaptMedicationFromDetail", () => {
  test("uses visit.func_DATE as authoredOn anchor", () => {
    const drug = { drug_name: "Aspirin", order_drug_day: 3 };
    const visit = { func_DATE: "114/05/18", hosp_ABBR: "長庚嘉義" };
    expect(adaptMedicationFromDetail(drug, visit).date).toBe("2025-05-18");
  });

  test("handles bilingual func_DATE ROC||西元 in visit", () => {
    const drug = { drug_name: "Aspirin", order_drug_day: 3 };
    const visit = { func_DATE: "115/05/05||2026/05/05", hosp_ABBR: "X" };
    expect(adaptMedicationFromDetail(drug, visit).date).toBe("2026-05-05");
  });

  test("returns null when drug_name absent", () => {
    expect(adaptMedicationFromDetail({}, { func_DATE: "114/05/18" })).toBeNull();
  });

  test("returns null when visit has no date", () => {
    expect(adaptMedicationFromDetail({ drug_name: "X" }, {})).toBeNull();
    expect(adaptMedicationFromDetail({ drug_name: "X" }, null)).toBeNull();
  });

  test("duration_days defaults to 0 for non-numeric order_drug_day", () => {
    const drug = { drug_name: "X", order_drug_day: "abc" };
    const visit = { func_DATE: "114/05/18" };
    expect(adaptMedicationFromDetail(drug, visit).duration_days).toBe(0);
  });

  test("inpatient: emits end_date when cure_E_DATE differs from func_DATE", () => {
    // NHI bundles every drug used during a 5-day admission into one
    // visit row dated to admission day. cure_E_DATE marks discharge.
    // Adapter must surface the discharge date so the mapper can attach
    // a dispenseRequest.validityPeriod covering the actual usage window.
    const drug = { drug_name: "PPI", order_drug_day: "－", order_qty: "10" };
    const visit = {
      func_DATE: "114/05/18||2025/05/18",
      cure_E_DATE: "114/05/22||2025/05/22",
      hosp_ABBR: "長庚嘉義",
    };
    const r = adaptMedicationFromDetail(drug, visit);
    expect(r.date).toBe("2025-05-18");
    expect(r.end_date).toBe("2025-05-22");
  });

  test("OPD: suppresses end_date when cure_E_DATE is empty (||)", () => {
    const drug = { drug_name: "Fluorometholone", order_drug_day: "28" };
    const visit = {
      func_DATE: "115/02/13||2026/02/13",
      cure_E_DATE: "||",
      hosp_ABBR: "臺北榮總",
    };
    expect(adaptMedicationFromDetail(drug, visit).end_date).toBe("");
  });

  test("藥局: suppresses end_date when cure_E_DATE is omitted", () => {
    const drug = { drug_name: "Tamsulosin", order_drug_day: "30" };
    const visit = { func_DATE: "115/05/13||2026/05/13", hosp_ABBR: "安心大藥局" };
    expect(adaptMedicationFromDetail(drug, visit).end_date).toBe("");
  });

  test("suppresses end_date when cure_E_DATE equals func_DATE (degenerate single-day stay)", () => {
    const drug = { drug_name: "X" };
    const visit = {
      func_DATE: "114/05/18",
      cure_E_DATE: "114/05/18",
    };
    expect(adaptMedicationFromDetail(drug, visit).end_date).toBe("");
  });

  test("end-to-end fixture: inpatient admission produces expected end_date on every drug row", () => {
    const fixture = readFixture("ihke3306s02-inpatient-admission.json");
    const adapted = fixture.drugs.map((d) =>
      adaptMedicationFromDetail(d, fixture.main_data_visit),
    );
    expect(adapted).toHaveLength(3);
    for (const r of adapted) {
      expect(r.date).toBe("2025-05-18");
      expect(r.end_date).toBe("2025-05-22");
      expect(r.hospital).toBe("長庚嘉義");
      expect(r.indication).toBe("R042/Hemoptysis");
      // Inpatient "－" sentinel → duration_days: 0 (the mapper treats
      // 0 as falsy and omits expectedSupplyDuration entirely).
      expect(r.duration_days).toBe(0);
    }
    expect(adapted[0].drug_name).toContain("TAKEPRON");
  });

  test("plain stub adaptMedication always returns null (list lacks drug data)", () => {
    expect(adaptMedication()).toBeNull();
    expect(adaptMedication({ anything: "ignored" })).toBeNull();
  });
});

describe("adaptImagingListStub", () => {
  test("always returns null — imaging list rows carry no narrative", async () => {
    const { adaptImagingListStub } = await import("../src/nhi-adapters.js");
    expect(adaptImagingListStub()).toBeNull();
    expect(adaptImagingListStub({ anything: "ignored" })).toBeNull();
  });
});

// ── adaptCatastrophicIllness — IHKE3209S01 (重大傷病) ──────────────────

describe("adaptCatastrophicIllness", () => {
  test("maps a prostate-cancer row to a problem-list Condition shape", () => {
    expect(
      adaptCatastrophicIllness({
        icD10CM_CNAME: "攝護腺惡性腫瘤",
        valiD_S_DATE: "111/11/16",
        valiD_E_DATE: "116/11/15",
        hosP_ABBR: "臺北榮總",
      }),
    ).toEqual({
      display: "攝護腺惡性腫瘤",
      code: "",
      system: "",
      onset_date: "2022-11-16",
      recorded_date: "2022-11-16",
      category: "problem-list-item",
      severity: "Severe (重大傷病)",
      hospital: "臺北榮總",
      clinical_status: "active",
    });
  });

  test("hard-codes category=problem-list-item (the whole point of this endpoint)", () => {
    const r = adaptCatastrophicIllness({
      icD10CM_CNAME: "白血病",
      valiD_S_DATE: "112/01/01",
    });
    expect(r.category).toBe("problem-list-item");
  });

  test("does NOT map valid_e_date to abatement (card expiry ≠ disease resolution)", () => {
    // The "validity end" date is when NHI's catastrophic-illness card
    // expires (renewed every ~5 years), not when the patient stopped
    // having the condition. We deliberately omit it from the adapter
    // output so mapCondition can't accidentally surface it as
    // abatementDateTime.
    const r = adaptCatastrophicIllness({
      icD10CM_CNAME: "攝護腺惡性腫瘤",
      valiD_S_DATE: "111/11/16",
      valiD_E_DATE: "116/11/15",
    });
    expect(Object.keys(r)).not.toContain("abatement_date");
    expect(Object.keys(r)).not.toContain("abatementDateTime");
  });

  test("returns null when icD10CM_CNAME is missing (no name = useless row)", () => {
    expect(adaptCatastrophicIllness({ valiD_S_DATE: "111/11/16" })).toBeNull();
  });

  test("returns null on null / non-object input", () => {
    expect(adaptCatastrophicIllness(null)).toBeNull();
    expect(adaptCatastrophicIllness("not an object")).toBeNull();
  });

  test("clinical_status hard-coded to 'active' (NHI only returns valid certs)", () => {
    expect(adaptCatastrophicIllness({
      icD10CM_CNAME: "x",
      valiD_S_DATE: "111/01/01",
    }).clinical_status).toBe("active");
  });

  test("handles bilingual icD10CM_CNAME (中文||English) by preferring English", () => {
    const r = adaptCatastrophicIllness({
      icD10CM_CNAME: "攝護腺惡性腫瘤||Malignant neoplasm of prostate",
      valiD_S_DATE: "111/11/16",
    });
    expect(r.display).toBe("Malignant neoplasm of prostate");
  });
});

// ── adaptInpatientEncounter — IHKE3309 / IHKE3308 ──────────────────────

describe("adaptInpatientEncounter", () => {
  test("maps admission/discharge span", () => {
    const r = adaptInpatientEncounter({
      in_DATE: "114/05/18",
      out_DATE: "114/05/22",
      hosp_ABBR: "長庚嘉義",
      icd9cm_CODE: "I10",
      icd9cm_CODE_CNAME: "Hypertension",
    });
    expect(r).toMatchObject({
      date: "2025-05-18",
      end_date: "2025-05-22",
      class: "IMP",
      hospital: "長庚嘉義",
    });
    expect(r.reason).toContain("I10");
  });

  test("falls back to func_DATE when in_DATE absent (legacy IHKE3308 rows)", () => {
    const r = adaptInpatientEncounter({
      func_DATE: "112/01/03",
      out_DATE: "112/01/07",
    });
    expect(r.date).toBe("2023-01-03");
  });

  test("returns null without a start date", () => {
    expect(adaptInpatientEncounter({ out_DATE: "114/05/22" })).toBeNull();
  });
});

// ── adaptEncounterFromMedExpense — IHKE3303 ─────────────────────────────

describe("adaptEncounterFromMedExpense", () => {
  test("uses funC_DATE for Encounter.period.start (visit date is correct)", () => {
    const r = adaptEncounterFromMedExpense({
      funC_DATE: "114/05/18",
      hosP_ABBR: "長庚嘉義",
    });
    expect(r.date).toBe("2025-05-18");
    expect(r.class).toBe("AMB"); // default
  });

  test("classHint override (e.g. detail fan-out says 住院 → IMP)", () => {
    const r = adaptEncounterFromMedExpense({ funC_DATE: "114/05/18" }, "IMP");
    expect(r.class).toBe("IMP");
  });

  test("returns null without a date", () => {
    expect(adaptEncounterFromMedExpense({ hosP_ABBR: "x" })).toBeNull();
  });
});

// ── adaptAllergy ────────────────────────────────────────────────────────

describe("adaptAllergy", () => {
  test("maps allergen_name and reaction", () => {
    const r = adaptAllergy({
      allergen_name: "Aspirin",
      reactioN: "rash",
      funC_DATE: "114/05/18",
    });
    expect(r).toMatchObject({
      display: "Aspirin",
      reaction: "rash",
      recorded_date: "2025-05-18",
      category: "medication",
    });
  });

  test("returns null when no allergen identifiable", () => {
    expect(adaptAllergy({ funC_DATE: "114/05/18" })).toBeNull();
  });

  test("accepts alternate allergen key names NHI uses interchangeably", () => {
    expect(adaptAllergy({ druG_NAME: "Penicillin" }).display).toBe("Penicillin");
    expect(adaptAllergy({ medname: "Sulfa" }).display).toBe("Sulfa");
  });
});

// ── adaptAdultPreventive — IHKE3402 ─────────────────────────────────────

describe("adaptAdultPreventive", () => {
  test("returns an array of Observations (one per measurement)", () => {
    const r = adaptAdultPreventive({
      firsT_DIAG_DATE: "114/05/18",
      hosP_ABBR: "X",
      height: 170,
      weight: 70,
      bmi: 24.2,
    });
    expect(Array.isArray(r)).toBe(true);
    expect(r.length).toBeGreaterThanOrEqual(3);
    expect(r.find((o) => o.display === "BMI")).toMatchObject({
      value: "24.2",
      unit: "kg/m2",
      category: "vital-signs",
    });
  });

  test("skips fields with empty / dash placeholder values", () => {
    const r = adaptAdultPreventive({
      firsT_DIAG_DATE: "114/05/18",
      height: 170,
      weight: "—",
      bmi: "",
      bmI_DUMMY: "ignored",
    });
    const displays = r.map((o) => o.display);
    expect(displays).toContain("Body Height");
    expect(displays).not.toContain("Body Weight");
    expect(displays).not.toContain("BMI");
  });

  test("returns null when no firsT_DIAG_DATE", () => {
    expect(adaptAdultPreventive({ height: 170 })).toBeNull();
  });

  test("returns null on null / non-object input", () => {
    expect(adaptAdultPreventive(null)).toBeNull();
    expect(adaptAdultPreventive("not an object")).toBeNull();
  });

  // ── NHI 醫令碼 pinning (v0.6.8) ───────────────────────────────────
  // IHKE3402's flat payload doesn't carry per-field NHI 醫令碼, so we
  // pin them in the adapter. This makes findLoinc take the NHI_TO_
  // LOINC direct-lookup path and bypass the keyword search — defends
  // against the same prefix-collision class of bug that bit HBsAg.

  test("all chemistry / liver / renal / hepatitis fields carry their NHI 醫令碼", () => {
    const row = {
      firsT_DIAG_DATE: "111/11/07",
      cho: "199",     // 09001C
      bloD_TG: "93",  // 09004C
      hdl: "42",      // 09043C
      ldl: "138",     // 09044C
      sgot: "23",     // 09025C
      sgpt: "23",     // 09026C
      s_09005C: "92", // 09005C (already pinned pre-v0.6.8)
      urinE_BUN: "12",      // 09002C
      bloD_CREAT: "1",      // 09015C
      uriC_ACID: "5.5",     // 09013C
      hbsaG_TEXT: "陰性",   // 14032C (pinned v0.6.6)
      antI_HCV_TEXT: "陰性", // 14051C (pinned v0.6.6)
    };
    const out = adaptAdultPreventive(row);
    const byDisplay = Object.fromEntries(out.map((o) => [o.display, o.order_code]));
    expect(byDisplay).toMatchObject({
      Cholesterol: "09001C",
      Triglyceride: "09004C",
      HDL: "09043C",
      LDL: "09044C",
      "SGOT (AST)": "09025C",
      "SGPT (ALT)": "09026C",
      "Glu-AC": "09005C",
      BUN: "09002C",
      Creatinine: "09015C",
      "Uric Acid": "09013C",
      HBsAg: "14032C",
      "Anti-HCV": "14051C",
    });
  });

  test("every emitted observation carries source_program=adult-preventive", () => {
    const out = adaptAdultPreventive(readFixture("ihke3402-adult-preventive.json"));
    expect(out.length).toBeGreaterThan(0);
    for (const o of out) {
      expect(o.source_program).toBe("adult-preventive");
    }
  });

  test("Urine UA (phantom NHI field) is NOT emitted", () => {
    // urinE_UA / urinE_UA_DIAG_RESULT_TEXT have no corresponding entry
    // in NHI's actual 健康存摺 adult preventive screening UI — they're
    // a defunct schema field that always returns empty or "-". Emitting
    // a "Urine UA" Observation from it was fabricating data.
    const out = adaptAdultPreventive({
      firsT_DIAG_DATE: "111/11/07",
      urinE_UA: "-",
      urinE_UA_DIAG_RESULT_TEXT: "-",
      urinE_UA_DIAG_ACID: "5.5",
    });
    expect(out.find((o) => o.display === "Urine UA")).toBeUndefined();
    expect(out.find((o) => o.display?.toLowerCase().includes("urine ua"))).toBeUndefined();
  });

  // ── HBV/HCV qualitative-result regression tests ──────────────────────
  // These pin the "use _TEXT, not the status code" decision in stone.
  // The bug regressed once in v0.6.3 (adapter-extraction refactor copied
  // a stale background.js); these tests would have failed loudly.

  test("HBsAg observation value uses hbsaG_TEXT, not the numeric status code", () => {
    // Payload says hbsag=1 (status code: "tested negative") and
    // hbsaG_TEXT="陰性". User-reported v0.6.x bug was observation
    // value = "1" (gets parsed as quantity 1) instead of "陰性".
    const row = {
      firsT_DIAG_DATE: "111/11/07",
      hbsag: "1",
      hbsaG_TEXT: "陰性",
      hbV_RESULT_TEXT: "陰性",
    };
    const out = adaptAdultPreventive(row);
    const hbsag = out.find((o) => o.display === "HBsAg");
    expect(hbsag).toBeDefined();
    expect(hbsag.value).toBe("陰性");
    expect(hbsag.value).not.toBe("1");
    expect(hbsag.reference_range).toBe("陰性"); // hbV_RESULT_TEXT
  });

  test("HBsAg observation skipped when test wasn't performed (empty _TEXT)", () => {
    // If NHI didn't run the test, hbsag might be "3" with hbsaG_TEXT=""
    // — pushing "" as value triggers the early-return inside the push()
    // helper, so no Observation gets emitted. (Compare: pushing the "3"
    // status code would have emitted a false-positive observation
    // claiming "HBsAg = 3", which is the bug we're avoiding.)
    const row = {
      firsT_DIAG_DATE: "111/11/07",
      hbsag: "3",
      hbsaG_TEXT: "",
    };
    const out = adaptAdultPreventive(row);
    expect(out.find((o) => o.display === "HBsAg")).toBeUndefined();
  });

  test("Anti-HCV observation value uses antI_HCV_TEXT, not the numeric status code", () => {
    const row = {
      firsT_DIAG_DATE: "111/11/07",
      antI_HCV: "1",
      antI_HCV_TEXT: "陰性",
      hcV_RESULT_TEXT: "陰性",
    };
    const out = adaptAdultPreventive(row);
    const antiHcv = out.find((o) => o.display === "Anti-HCV");
    expect(antiHcv).toBeDefined();
    expect(antiHcv.value).toBe("陰性");
    expect(antiHcv.reference_range).toBe("陰性");
  });

  test("Urine Protein observation value uses urinE_PROTEIN_TEXT (dipstick is qualitative, not numeric)", () => {
    // urinE_PROTEIN = "0" is a status code for "no protein detected",
    // not a 0 mg/dL measurement. The _TEXT field carries the clinical
    // convention ("-" / "±" / "1+" / "2+" / "3+"). Same family of bug.
    const row = {
      firsT_DIAG_DATE: "111/11/07",
      urinE_PROTEIN: "0",
      urinE_PROTEIN_TEXT: "-",
    };
    const out = adaptAdultPreventive(row);
    const up = out.find((o) => o.display === "Urine Protein");
    expect(up).toBeDefined();
    expect(up.value).toBe("-");
    expect(up.value).not.toBe("0");
  });
});
