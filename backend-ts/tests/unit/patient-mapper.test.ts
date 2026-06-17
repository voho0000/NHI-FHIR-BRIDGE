/**
 * Patient mapper unit tests. Port of backend/tests/unit/test_patient_mapper.py.
 */

import { describe, expect, test } from "vitest";

import * as systems from "@nhi-fhir-bridge/mapper";
import {
  deidBirthDate,
  derivePatientId,
  effectiveFhirPatientId,
  looksLikeTwNationalId,
  mapPatient,
  maskId,
  maskName,
  redactDemographicsInText,
} from "@nhi-fhir-bridge/mapper";

const PATIENT_ID = "A123456789";

describe("looksLikeTwNationalId", () => {
  test("valid male ID", () => {
    expect(looksLikeTwNationalId("A123456789")).toBe(true);
  });
  test("valid female ID", () => {
    expect(looksLikeTwNationalId("B223456789")).toBe(true);
  });
  test("lowercase input accepted", () => {
    expect(looksLikeTwNationalId("a123456789")).toBe(true);
  });
  test("too short", () => {
    expect(looksLikeTwNationalId("A12345678")).toBe(false);
  });
  test("missing letter", () => {
    expect(looksLikeTwNationalId("1234567890")).toBe(false);
  });
  test("invalid second char (must be 1 or 2)", () => {
    expect(looksLikeTwNationalId("A523456789")).toBe(false);
  });
  test("empty string", () => {
    expect(looksLikeTwNationalId("")).toBe(false);
  });
  test("null/undefined", () => {
    expect(looksLikeTwNationalId(null)).toBe(false);
    expect(looksLikeTwNationalId(undefined)).toBe(false);
  });
});

describe("mapPatient", () => {
  test("minimum shape", () => {
    const r = mapPatient({ identifier: PATIENT_ID, name: "陳大文" });
    expect(r.resourceType).toBe("Patient");
    // Patient.id is the hashed/salted form (FHIR R4 §2.20 — no PHI in
    // logical id). The raw national ID lives in identifier[].value.
    expect(r.id).toBe(derivePatientId(PATIENT_ID));
    expect(r.id).not.toBe(PATIENT_ID);
    expect(r.identifier[0].value).toBe(PATIENT_ID);
    // mapPatient transcribes the name as-given — the caller decides
    // whether to pre-mask before calling.
    expect(r.name.some((n: any) => n.text === "陳大文")).toBe(true);
  });

  test("TW national ID uses canonical system", () => {
    const r = mapPatient({ identifier: PATIENT_ID, name: "陳大文" });
    const ids = r.identifier;
    expect(ids.some((i: any) => i.system === systems.TW_NATIONAL_ID)).toBe(true);
  });

  test("non-TW ID uses local MRN system", () => {
    const r = mapPatient({ identifier: "P001", name: "Foo" });
    const ids = r.identifier;
    expect(ids.some((i: any) => i.system === systems.HIS_LOCAL_PATIENT_MRN)).toBe(true);
  });

  test("half-masked TWID keeps the national-id system (audit P1-1)", () => {
    // De-identified syncs feed the masked form straight into mapPatient
    // (both X for filenames/bundle and * for display) — the identifier's
    // TYPE is still 身分證, so the system must stay self-describing.
    for (const masked of ["A12345XXXX", "A12345****"]) {
      const r = mapPatient({ identifier: masked, name: "陳O文" });
      expect(r.identifier[0].system).toBe(systems.TW_NATIONAL_ID);
      expect(r.identifier[0].value).toBe(masked);
      expect(r.id).toBe(derivePatientId(masked));
    }
  });

  test("birth date passes through", () => {
    const r = mapPatient({
      identifier: PATIENT_ID,
      name: "陳大文",
      birthDate: "1980-05-15",
    });
    expect(r.birthDate).toBe("1980-05-15");
  });

  test("missing ID falls back to hashed 'unknown'", () => {
    const r = mapPatient({ name: "Foo" });
    expect(r.id).toBe(derivePatientId("unknown"));
    expect(r.identifier[0].value).toBe("unknown");
  });

  test("CJK name splits to family/given (raw, no internal masking)", () => {
    const r = mapPatient({ identifier: PATIENT_ID, name: "陳大文" });
    expect(r.name[0].text).toBe("陳大文");
    expect(r.name[0].family).toBe("陳");
    expect(r.name[0].given).toEqual(["大文"]);
  });

  test("Western name splits to family/given (raw)", () => {
    const r = mapPatient({ identifier: "P001", name: "John Doe" });
    expect(r.name[0].text).toBe("John Doe");
    expect(r.name[0].family).toBe("Doe");
    expect(r.name[0].given).toEqual(["John"]);
  });

  test("caller can pre-mask the name (mapper transcribes verbatim)", () => {
    const r = mapPatient({ identifier: PATIENT_ID, name: "陳O文" });
    expect(r.name[0].text).toBe("陳O文");
    expect(r.name[0].family).toBe("陳");
    expect(r.name[0].given).toEqual(["O文"]);
  });
});

describe("maskName", () => {
  test("CJK 3-char keeps first + last, middle O", () => {
    expect(maskName("郭一新")).toBe("郭O新");
    expect(maskName("陳大文")).toBe("陳O文");
  });
  test("CJK 4-char produces two O's in the middle", () => {
    expect(maskName("林郭一新")).toBe("林OO新");
  });
  test("CJK 5-char produces three O's", () => {
    expect(maskName("中島健次郎")).toBe("中OOO郎");
  });
  test("CJK 2-char keeps first, replaces second with O", () => {
    expect(maskName("王明")).toBe("王O");
  });
  test("CJK 1-char passes through (nothing to mask)", () => {
    expect(maskName("王")).toBe("王");
  });
  test("Western 2-token name partial-masks the last", () => {
    expect(maskName("John Smith")).toBe("John S***");
  });
  test("Western 3+-token replaces middles with ***", () => {
    expect(maskName("John Q Smith")).toBe("John *** Smith");
    expect(maskName("Mary Anne Bell Jones")).toBe("Mary *** *** Jones");
  });
  test("empty / Unknown / null pass through", () => {
    expect(maskName("")).toBe("");
    expect(maskName("Unknown")).toBe("Unknown");
    expect(maskName(null)).toBe("");
    expect(maskName(undefined)).toBe("");
  });
  test("trims whitespace first", () => {
    expect(maskName("  郭一新  ")).toBe("郭O新");
  });
});

describe("maskId", () => {
  test("Taiwan national ID (1+9): first 6 visible, last 4 masked", () => {
    expect(maskId("P123456789")).toBe("P12345****");
    expect(maskId("A123456789")).toBe("A12345****");
    expect(maskId("B223456789")).toBe("B22345****");
  });
  test("custom mask char (X for filenames)", () => {
    expect(maskId("P123456789", "X")).toBe("P12345XXXX");
  });
  test("auto-XXXXXXXX placeholders pass through unchanged", () => {
    expect(maskId("auto-c7bdf544")).toBe("auto-c7bdf544");
  });
  test("non-TWID identifiers (mid-length): keep first 2 + last 2", () => {
    expect(maskId("ABC1234567")).toBe("AB******67");
  });
  test("very short identifiers pass through", () => {
    expect(maskId("A1")).toBe("A1");
    expect(maskId("ABC")).toBe("ABC");
  });
  test("empty / null / undefined pass through", () => {
    expect(maskId("")).toBe("");
    expect(maskId(null)).toBe("");
    expect(maskId(undefined)).toBe("");
  });
  test("trims whitespace first", () => {
    expect(maskId("  P123456789  ")).toBe("P12345****");
  });
});

describe("effectiveFhirPatientId (audit P1-1)", () => {
  test("deidentify=false hashes the full id (unchanged behavior)", () => {
    expect(effectiveFhirPatientId(PATIENT_ID, false)).toBe(derivePatientId(PATIENT_ID));
  });
  test("deidentify=true hashes the HALF-MASKED id, not the full one", () => {
    const masked = maskId(PATIENT_ID, "X"); // A12345XXXX
    expect(effectiveFhirPatientId(PATIENT_ID, true)).toBe(derivePatientId(masked));
    // The whole point: a de-identified Patient.id must not be the
    // brute-forceable hash of the full national ID.
    expect(effectiveFhirPatientId(PATIENT_ID, true)).not.toBe(derivePatientId(PATIENT_ID));
  });
  test("matches what the backend derives after deidentifyOverride pre-masks id_no", () => {
    // Backend path: extension masks id_no with X before upload, backend
    // hashes what it receives — both paths must land on the same id.
    expect(derivePatientId(maskId(PATIENT_ID, "X"))).toBe(effectiveFhirPatientId(PATIENT_ID, true));
  });
});

describe("deidBirthDate", () => {
  test("full date keeps year, normalizes month/day to Jan 1", () => {
    expect(deidBirthDate("1962-04-15")).toBe("1962-01-01");
    expect(deidBirthDate("2003-12-31")).toBe("2003-01-01");
  });
  test("already-Jan-1 stays Jan 1 (idempotent)", () => {
    expect(deidBirthDate("1962-01-01")).toBe("1962-01-01");
  });
  test("inputs coarser than full date still normalize to Jan 1", () => {
    expect(deidBirthDate("1962")).toBe("1962-01-01");
    expect(deidBirthDate("1962-04")).toBe("1962-01-01");
  });
  test("result is a full FHIR YYYY-MM-DD date (SMART-app parseable)", () => {
    const out = deidBirthDate("1962-04-15");
    expect(/^\d{4}-\d{2}-\d{2}$/.test(out)).toBe(true);
    expect(Number.isNaN(new Date(out).getTime())).toBe(false);
  });
  test("empty / null / undefined / unparseable pass through", () => {
    expect(deidBirthDate("")).toBe("");
    expect(deidBirthDate(null)).toBe("");
    expect(deidBirthDate(undefined)).toBe("");
    expect(deidBirthDate("不詳")).toBe("不詳");
  });
});

describe("redactDemographicsInText (出院病摘 / 病理報告 narrative de-id)", () => {
  test("plain-text header: 出生日期 keeps year, 病歷號碼 redacted", () => {
    // Pathology conclusion template: halfwidth colon, fullwidth slashes.
    const src = "病歷號碼:1234567 性別:男 出生日期:1932／06／10 年齡:93歲";
    const out = redactDemographicsInText(src);
    expect(out).toContain("出生日期:1932");
    expect(out).not.toContain("1932／06／10");
    expect(out).toContain("病歷號碼:[已去識別]");
    expect(out).not.toContain("1234567");
    // age + gender are not demographics we strip here
    expect(out).toContain("年齡:93歲");
    expect(out).toContain("性別:男");
  });

  test("出院病摘 HTML cell: value in a sibling tag still scrubbed", () => {
    const src =
      '<td><b>出生日期：</b>1932-06-10</td><td><b>病歷號碼：</b>1234567</td>';
    const out = redactDemographicsInText(src);
    expect(out).toContain("出生日期：</b>1932</td>");
    expect(out).not.toContain("1932-06-10");
    expect(out).toContain("病歷號碼：</b>[已去識別]</td>");
    expect(out).not.toContain("1234567");
  });

  test("visit / admission / collection dates are PRESERVED (different label)", () => {
    const src =
      '住院日期：</b>2025-01-15</td> 採檢日期:2025／05／22 出院日期：2025/05/30';
    const out = redactDemographicsInText(src);
    expect(out).toBe(src);
  });

  test("民國 / ROC-form birth date redacted whole", () => {
    expect(redactDemographicsInText("出生日期:民國79年6月10日")).toBe(
      "出生日期:[已去識別]",
    );
    expect(redactDemographicsInText("生日:79/6/10")).toBe("生日:[已去識別]");
  });

  test("idempotent + leaves unrelated text untouched", () => {
    const src = "出生日期:1932／06／10 病歷號碼:A12345";
    const once = redactDemographicsInText(src);
    expect(redactDemographicsInText(once)).toBe(once);
    expect(redactDemographicsInText("臨床診斷：肺炎，無特殊家族史")).toBe(
      "臨床診斷：肺炎，無特殊家族史",
    );
  });
});
