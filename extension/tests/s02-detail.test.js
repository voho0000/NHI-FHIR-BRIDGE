import { describe, expect, test } from "vitest";

import { classFromS02Detail } from "../src/background/s02-detail.ts";

// Wrap a main row the way NHI's IHKE3303S02 endpoint does.
function body(main) {
  return { ihke3303S02_main_data: [main] };
}

describe("classFromS02Detail", () => {
  test("hosp_DATA_TYPE_NAME 含『急』→ EMER", () => {
    expect(classFromS02Detail(body({ hosp_DATA_TYPE_NAME: "急診" }))).toBe("EMER");
  });

  test("hosp_DATA_TYPE_NAME 含『住院』→ IMP", () => {
    expect(classFromS02Detail(body({ hosp_DATA_TYPE_NAME: "住院" }))).toBe("IMP");
  });

  test("西醫 + 無處置 → AMB", () => {
    expect(classFromS02Detail(body({ hosp_DATA_TYPE_NAME: "西醫" }))).toBe("AMB");
  });

  // v0.20.0: the real 長庚嘉義 5/18 K92.0 吐血 ER visit shipped
  // hosp_DATA_TYPE_NAME="西醫" (NOT 急診) but its 處置 list carried
  // 急診檢傷分類 診察費/護理費 — must classify EMER, not AMB.
  test("西醫 type-name but 急診檢傷分類 處置 → EMER (real 5/18 repro)", () => {
    const main = {
      hosp_DATA_TYPE_NAME: "西醫",
      sp_IHKE3302S05: [
        { order_code: "00203B", cure_CNAME: "急診(按檢傷分類)檢傷分類第三級－診察費" },
        { order_code: "00250B", cure_CNAME: "急診(按檢傷分類)檢傷分類第三級－護理費" },
        { order_code: "05201A", cure_CNAME: "門診藥事服務費－一般處方給藥（七天以內）" },
      ],
    };
    expect(classFromS02Detail(body(main))).toBe("EMER");
  });

  test("西醫 + 處置但無『急診』字樣 → AMB (no false upgrade)", () => {
    const main = {
      hosp_DATA_TYPE_NAME: "西醫",
      sp_IHKE3302S05: [{ order_code: "00131", cure_CNAME: "門診診察費" }],
    };
    expect(classFromS02Detail(body(main))).toBe("AMB");
  });

  test("null / empty body → null", () => {
    expect(classFromS02Detail(null)).toBeNull();
    expect(classFromS02Detail({})).toBeNull();
  });
});
