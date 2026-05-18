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
  adaptEncounterFromMedExpense,
  adaptImagingReportFromDetail,
  adaptInpatientEncounter,
  adaptLabItem,
  adaptMedication,
  adaptMedicationFromDetail,
  adaptProcedure,
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
      code: "FINGER SUGAR",
      display: "FINGER SUGAR",
      value: "191",
      unit: "mg/dL",
      reference_range: "[70][140]",
      hospital: "長庚嘉義",
    });
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
});

// ── adaptProcedure — IHKE3301S05 ───────────────────────────────────────

describe("adaptProcedure", () => {
  test("uses func_date as procedure date (no separate procedure-performed field in NHI)", () => {
    // Documented limitation: NHI's IHKE3301S05 doesn't expose an actual
    // procedure-performed date. For inpatient rows (func_date = admission,
    // out_date = discharge), we anchor on func_date — small loss of
    // accuracy vs. inventing a performedPeriod that would imply the
    // procedure spanned the whole stay.
    const item = {
      func_date: "105/09/23",
      out_date: "105/09/26",
      op_code_cname: "經皮左側玻璃體部分切除術",
    };
    expect(adaptProcedure(item).date).toBe("2016-09-23");
  });

  test("includes reason (icd9cm) in note when present", () => {
    const item = {
      func_date: "105/09/23",
      op_code_cname: "Procedure",
      icd9cm_code: "H35372",
      icd9cm_code_cname: "左側眼黃斑部皺褶",
    };
    expect(adaptProcedure(item).note).toBe("Reason: H35372 左側眼黃斑部皺褶");
  });

  test("returns null without display name", () => {
    expect(adaptProcedure({ func_date: "105/09/23" })).toBeNull();
  });

  test("end-to-end fixture: live IHKE3301S05 inpatient + outpatient rows", () => {
    const fixture = readFixture("ihke3301s05-procedures.json");
    const [inpatient, outpatient] = fixture.main_data.map(adaptProcedure);

    expect(inpatient.date).toBe("2016-09-23");
    expect(inpatient.display).toBe("經皮左側玻璃體部分切除術");
    expect(inpatient.hospital).toBe("臺北榮總");

    expect(outpatient.date).toBe("2016-01-14");
    expect(outpatient.display).toBe("經皮眼睛其他治療物質輸入");
    expect(outpatient.hospital).toBe("嘉基醫院");
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
});
