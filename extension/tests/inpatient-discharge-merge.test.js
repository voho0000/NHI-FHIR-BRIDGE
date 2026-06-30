import { describe, expect, test } from "vitest";

import { mergeInpatientDischargeDates } from "../src/background/build-bundle.ts";
import { adaptInpatientEncounter } from "../src/nhi-adapters.ts";

// IC卡資料 住院: admit & discharge are separate swipe events. IHKE3309S01 ships
// only the admit half (out_DATE "--"); the discharge half (in_date "--",
// out_date set) comes from IHKE3301S06. mergeInpatientDischargeDates pairs them
// by (hosp_id, icd) so the Encounter gets a discharge date. Live-probed
// 2026-06-30 (林口長庚 J189 6/16→6/22, 敏盛綜合 C3490 5/26→6/03).
describe("mergeInpatientDischargeDates — IC卡 住院出院日補齊 (IHKE3301S06)", () => {
  const admit = (h, icd, inD) => ({
    hosp_ID: h,
    icd9cm_CODE: icd,
    in_DATE: inD,
    out_DATE: "--",
    ori_TYPE: "2",
  });
  // S06 rows are lower-cased keys
  const discharge = (h, icd, outD) => ({
    hosp_id: h,
    icd9cm_code: icd,
    in_date: "--",
    out_date: outD,
    ori_type: "2",
  });

  test("admit 半 + 對應 discharge 半 → out_DATE 補上 (real 林口 J189)", () => {
    const visits = [admit("1132070011", "J189", "115/06/16")];
    // S06 carries the discharge half AND an admit half (must be ignored)
    const s06 = [discharge("1132070011", "J189", "115/06/22"), admit("1132070011", "J189", "115/06/16")];
    const out = mergeInpatientDischargeDates(visits, s06);
    expect(out[0].out_DATE).toBe("115/06/22");
    expect(out[0].__dischargeFromS06).toBe(true);
  });

  test("無對應 discharge(不同院/不同ICD)→ out_DATE 維持 --", () => {
    const visits = [admit("AAA", "J189", "115/06/16")];
    const out = mergeInpatientDischargeDates(visits, [
      discharge("BBB", "J189", "115/06/22"),
      discharge("AAA", "C349", "115/06/22"),
    ]);
    expect(out[0].out_DATE).toBe("--");
  });

  test("申報資料(已有 out)完全不被動到", () => {
    const visits = [
      { hosp_ID: "Z", icd9cm_CODE: "C3411", in_DATE: "112/05/03", out_DATE: "112/05/08", ori_TYPE: "3" },
    ];
    const out = mergeInpatientDischargeDates(visits, [discharge("Z", "C3411", "112/06/01")]);
    expect(out[0].out_DATE).toBe("112/05/08");
    expect(out[0].__dischargeFromS06).toBeUndefined();
  });

  test("同院同ICD多次住院 → 依時序貪婪配對(各取就近出院)", () => {
    const visits = [admit("H", "J18", "115/01/05"), admit("H", "J18", "115/03/10")];
    const s06 = [discharge("H", "J18", "115/03/20"), discharge("H", "J18", "115/01/12")];
    const out = mergeInpatientDischargeDates(visits, s06);
    expect(out.find((v) => v.in_DATE === "115/01/05").out_DATE).toBe("115/01/12");
    expect(out.find((v) => v.in_DATE === "115/03/10").out_DATE).toBe("115/03/20");
  });

  test("discharge 早於 admit → 不配(時序守門)", () => {
    const out = mergeInpatientDischargeDates(
      [admit("H", "J18", "115/06/16")],
      [discharge("H", "J18", "115/05/01")],
    );
    expect(out[0].out_DATE).toBe("--");
  });

  test("不可變動 input(回傳新陣列)", () => {
    const visits = [admit("1132070011", "J189", "115/06/16")];
    const snapshot = JSON.stringify(visits);
    mergeInpatientDischargeDates(visits, [discharge("1132070011", "J189", "115/06/22")]);
    expect(JSON.stringify(visits)).toBe(snapshot);
  });

  test("end-to-end: merge → adaptInpatientEncounter → end_date set (→ mapper status finished)", () => {
    const visits = mergeInpatientDischargeDates(
      [admit("1132070011", "J189", "115/06/16")],
      [discharge("1132070011", "J189", "115/06/22")],
    );
    const enc = adaptInpatientEncounter(visits[0], {});
    expect(enc.date).toBe("2026-06-16");
    expect(enc.end_date).toBe("2026-06-22"); // rocToISO(115/06/22) → mapper sets status "finished"
  });
});
