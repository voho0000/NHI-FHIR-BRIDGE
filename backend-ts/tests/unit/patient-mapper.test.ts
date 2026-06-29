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
  test("plain-text header: 出生日期 keeps year (month/day → XX), 病歷號碼 redacted", () => {
    // Pathology conclusion template: halfwidth colon, fullwidth slashes.
    const src = "病歷號碼:1234567 性別:男 出生日期:1932／06／10 年齡:93歲";
    const out = redactDemographicsInText(src);
    expect(out).toContain("出生日期:1932／XX／XX");
    expect(out).not.toContain("1932／06／10");
    expect(out).toContain("病歷號碼:[已去識別]");
    expect(out).not.toContain("1234567");
    // age + gender are not demographics we strip here
    expect(out).toContain("年齡:93歲");
    expect(out).toContain("性別:男");
  });

  test("出院病摘 HTML cell: value in a sibling tag still scrubbed (year kept)", () => {
    const src = "<td><b>出生日期：</b>1932-06-10</td><td><b>病歷號碼：</b>1234567</td>";
    const out = redactDemographicsInText(src);
    expect(out).toContain("出生日期：</b>1932-XX-XX</td>");
    expect(out).not.toContain("1932-06-10");
    expect(out).toContain("病歷號碼：</b>[已去識別]</td>");
    expect(out).not.toContain("1234567");
  });

  test("visit / admission / collection dates are PRESERVED (different label)", () => {
    const src = "住院日期：</b>2025-01-15</td> 採檢日期:2025／05／22 出院日期：2025/05/30";
    const out = redactDemographicsInText(src);
    expect(out).toBe(src);
  });

  test("民國 / ROC-form birth date redacted whole", () => {
    expect(redactDemographicsInText("出生日期:民國79年6月10日")).toBe("出生日期:[已去識別]");
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

  // v1.0.6 — 地址 (home address) leaks in some hospitals' 出院病摘 templates.
  describe("地址 (home address) redaction", () => {
    test("same-cell + colon: <b>地址：</b>value</td> → value redacted, label kept", () => {
      const src = '<td class="content"><b>地址：</b>雲林縣北港鎮大同路20號</td>';
      const out = redactDemographicsInText(src);
      expect(out).toBe('<td class="content"><b>地址：</b>[已去識別]</td>');
      expect(out).not.toContain("雲林縣北港鎮大同路20號");
    });

    test("sibling-cell + colon: <b>地址：</b></td><td>value</td> → redacted", () => {
      const src = '<td><b>地址：</b></td><td class="content">雲林縣北港鎮大同路20號</td>';
      const out = redactDemographicsInText(src);
      expect(out).not.toContain("雲林縣北港鎮大同路20號");
      expect(out).toContain("[已去識別]");
    });

    test("bare label cell + value cell, NO colon: <td>地址</td><td>value</td> → redacted", () => {
      const src = '<td class="content">地址</td><td class="content">雲林縣北港鎮大同路20號</td>';
      const out = redactDemographicsInText(src);
      expect(out).not.toContain("雲林縣北港鎮大同路20號");
      expect(out).toContain("[已去識別]");
    });

    test("plain text + colon → value to EOL redacted, next field preserved", () => {
      const out = redactDemographicsInText("地址：雲林縣北港鎮大同路20號\n入院科別：GYN");
      expect(out).toBe("地址：[已去識別]\n入院科別：GYN");
    });

    test("variants 戶籍地址 / 通訊地址 also redacted", () => {
      expect(redactDemographicsInText("戶籍地址：台北市大安區和平東路1號")).toBe(
        "戶籍地址：[已去識別]",
      );
      expect(redactDemographicsInText("通訊地址:高雄市三民區建工路100號")).toBe(
        "通訊地址:[已去識別]",
      );
    });

    test("does NOT touch clinical prose that merely contains 地址 (no label colon / cell)", () => {
      const src = "病人主訴返家後地址變更，建議更新聯絡資料";
      expect(redactDemographicsInText(src)).toBe(src);
    });

    test("idempotent on already-redacted address", () => {
      const src = "<td><b>地址：</b>嘉義市西區致遠二路6號</td>";
      const once = redactDemographicsInText(src);
      expect(redactDemographicsInText(once)).toBe(once);
    });
  });

  // v1.0.6 — 病患姓名 label → MASK the value (王小明 → 王O明) regardless of the
  // user-entered override name. Robust to a typo / 眷屬 mix-up; works for patients
  // with a 出院病摘 even when the 病理報告(病患資訊) path doesn't apply, and vice versa.
  describe("病患姓名 label masking (robust to wrong-entered name)", () => {
    test("masks the real name in place even when the override input was wrong", () => {
      // User typed 王俠明 (so the value scrub missed it); the 出院病摘 carries the
      // real 王小明 — the label-anchored mask catches it regardless.
      expect(redactDemographicsInText("病患姓名：王小明")).toBe("病患姓名：王O明");
    });

    test("出院病摘 HTML cell (same cell) masked", () => {
      const src = '<td class="content"><b>病患姓名：</b>王小明</td>';
      expect(redactDemographicsInText(src)).toBe('<td class="content"><b>病患姓名：</b>王O明</td>');
    });

    test("sibling-cell layout masked (4-char name → two middle O's)", () => {
      const src = "<td><b>病患姓名：</b></td><td>歐陽淑芬</td>";
      const out = redactDemographicsInText(src);
      expect(out).not.toContain("歐陽淑芬");
      expect(out).toContain("歐OO芬");
    });

    test("病人姓名 / 患者姓名 variants masked", () => {
      expect(redactDemographicsInText("病人姓名：王大明")).toBe("病人姓名：王O明");
      expect(redactDemographicsInText("患者姓名：林小華")).toBe("患者姓名：林O華");
    });

    test("already-masked value (王O明) left untouched (idempotent)", () => {
      const src = "病患姓名：王O明";
      expect(redactDemographicsInText(src)).toBe(src);
      expect(redactDemographicsInText(redactDemographicsInText("病患姓名：王小明"))).toBe(
        "病患姓名：王O明",
      );
    });

    test("1-char / non-name value not touched", () => {
      expect(redactDemographicsInText("病患姓名：無")).toBe("病患姓名：無");
    });
  });

  // v1.0.6 — unlabelled NAME + 病歷號 in a report header (no "姓名"/"病歷號" word).
  // The 病患資訊 line redacts the name+chartno SPAN structurally (robust to a
  // wrong-entered name); a bare "<chartno> 性別 N歲" elsewhere still drops the chartno.
  describe("報告 header 去識別化 (病患資訊 + 性別+年齡 anchor)", () => {
    test("病患資訊 header: NAME + chart number redacted even when the entered name was wrong", () => {
      // User entered 王俠明 but NHI's report carries the REAL name 王小明, so the
      // value-based name scrub never masked it. The 病患資訊 + 性別+年齡 anchors
      // redact the name+病歷號 span regardless of the entered value.
      const src = "病患資訊： 門 診 王小明 1234567-0 女性 54歲 OPD";
      const out = redactDemographicsInText(src);
      expect(out).toBe("病患資訊： 門 診 [已去識別] 女性 54歲 OPD");
      expect(out).not.toContain("王小明");
      expect(out).not.toContain("1234567-0");
      expect(out).toContain("女性 54歲"); // demographic anchor preserved
      expect(out).toContain("OPD");
    });

    test("病患資訊 header redacts the name even with NO chart number present", () => {
      const src = "病患資訊： 門診 王小明 女性 54歲 OPD";
      expect(redactDemographicsInText(src)).toBe("病患資訊： 門診 [已去識別] 女性 54歲 OPD");
    });

    test("bare header (no 病患資訊 label): only the chart no is dropped, name left to the value scrub", () => {
      expect(redactDemographicsInText("王O明 12345678 男性 67歲")).toBe(
        "王O明 [已去識別] 男性 67歲",
      );
    });

    test("no 病患資訊 + no chart number: a CJK name before 性別 is NOT touched", () => {
      const src = "王O明 女性 54歲 OPD";
      expect(redactDemographicsInText(src)).toBe(src);
    });

    test("does NOT redact a pure-letter token before 性別 (name-mask 'O' / 'OPD' spared)", () => {
      // No digit in the token → not a chart number → untouched.
      expect(redactDemographicsInText("王O 女性 30歲")).toBe("王O 女性 30歲");
      expect(redactDemographicsInText("OPD 男性 40歲")).toBe("OPD 男性 40歲");
    });

    test("does NOT touch 工作號 / 申請序號 (not before a 性別+歲 marker)", () => {
      const src = "申請序號 / 工作號： K342F1A/S114-40902 開立時間： 2025/08/04";
      expect(redactDemographicsInText(src)).toBe(src);
    });

    test("does NOT touch the age digits themselves, nor a bare 性別 in prose", () => {
      expect(redactDemographicsInText("病人為女性，54歲，無特殊病史")).toBe(
        "病人為女性，54歲，無特殊病史",
      );
    });

    test("idempotent — 病患資訊 span + bare chart-no both stable on a second pass", () => {
      const a = redactDemographicsInText("病患資訊： 門 診 王小明 1234567-0 女性 54歲 OPD");
      expect(redactDemographicsInText(a)).toBe(a);
      const b = redactDemographicsInText("王O明 1234567-0 女性 54歲");
      expect(redactDemographicsInText(b)).toBe(b);
      expect(b).toBe("王O明 [已去識別] 女性 54歲");
    });
  });
});
