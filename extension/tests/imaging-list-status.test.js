import { describe, expect, it } from "vitest";
import {
  countImagingConfirming,
  imagingListNeedsResolve,
  imagingRowHasUsableImage,
  imagingRowIsConfirming,
} from "../src/background/imaging-list-status.ts";

// Silent-bug gate (CLAUDE.md rule #8). The imaging-list "still preparing"
// decision is code-agnostic: a list is RESOLVED the moment any row exposes
// a usable image (jpG_STATUS "A" needs-trigger / "1" bytes-ready); every
// other state — including transient "資料確認中" / "資料準備中" snapshots
// whose codes we can't reliably enumerate — keeps the caller polling.
//
// The v0.17.5 regression these tests lock down: a 臺北榮總 19012C 超音波
// individual's FIRST sync returned a single "資料準備中" row (no "-"), and
// the real E-channel jpG_STATUS "A" candidate only appeared as a SECOND
// row after a refresh. v0.17.5 only watched for "-", so it never refetched
// → bridge reported "沒有可下載的圖片" despite a real image existing.

describe("imagingRowHasUsableImage — single-row predicate", () => {
  it.each([
    ["A", true], // needs trigger — image exists
    ["1", true], // bytes cached, ready
    ["0", false], // preparing
    ["2", false], // 無影像檔
    ["-", false], // 資料確認中 (lazy confirm not run)
    ["", false], // missing
  ])("jpG_STATUS %s → usable=%s", (status, expected) => {
    expect(imagingRowHasUsableImage({ jpG_STATUS: status })).toBe(expected);
  });

  it("tolerates alternate casings jpg_STATUS / JPG_STATUS", () => {
    expect(imagingRowHasUsableImage({ jpg_STATUS: "A" })).toBe(true);
    expect(imagingRowHasUsableImage({ JPG_STATUS: "1" })).toBe(true);
    expect(imagingRowHasUsableImage({})).toBe(false);
    expect(imagingRowHasUsableImage(null)).toBe(false);
  });
});

describe("imagingListNeedsResolve — list gate", () => {
  // The exact raw rows the user pasted after manually refreshing the
  // 臺北榮總 19012C list: one E row needs trigger (A), one A row has no
  // image (2). Because an A/1 row is present, the list is RESOLVED.
  const RESOLVED_REAL_LIST = [
    {
      order_CODE: "19012C",
      hosp_ABBR: "臺北榮總",
      ori_TYPE: "E",
      row_ID: "AAYLzQABIAALxvsAAE",
      jpG_STATUS: "A",
    },
    {
      order_CODE: "19012C",
      hosp_ABBR: "臺北榮總",
      ori_TYPE: "A",
      row_ID: "AANecJAGsAADdBhAAP",
      jpG_STATUS: "2",
    },
  ];

  it("real resolved 2-row list (E=A + A=2) → does NOT need resolve", () => {
    expect(imagingListNeedsResolve(RESOLVED_REAL_LIST)).toBe(false);
  });

  it("first-access 資料準備中 snapshot (single non-A/1 row) → needs resolve", () => {
    // The transient pre-refresh shape that v0.17.5 missed: 1 row, no A/1,
    // no "-". Must be treated as still-preparing.
    expect(imagingListNeedsResolve([{ order_CODE: "19012C", jpG_STATUS: "2" }])).toBe(true);
    expect(imagingListNeedsResolve([{ order_CODE: "19012C", jpG_STATUS: "0" }])).toBe(true);
  });

  it("資料確認中 snapshot (all rows '-') → needs resolve", () => {
    expect(
      imagingListNeedsResolve([{ jpG_STATUS: "-" }, { jpG_STATUS: "-" }, { jpG_STATUS: "-" }]),
    ).toBe(true);
  });

  it("genuinely no-image list (all rows '2') → still needs resolve (re-check per user rule)", () => {
    // Deliberate: we poll until the budget is spent rather than trust the
    // first all-"2" snapshot, because a "資料準備中" row can also read "2"
    // before NHI finishes confirming.
    expect(imagingListNeedsResolve([{ jpG_STATUS: "2" }, { jpG_STATUS: "2" }])).toBe(true);
  });

  it("any single A or 1 row resolves the whole list", () => {
    expect(imagingListNeedsResolve([{ jpG_STATUS: "2" }, { jpG_STATUS: "A" }])).toBe(false);
    expect(imagingListNeedsResolve([{ jpG_STATUS: "0" }, { jpG_STATUS: "1" }])).toBe(false);
  });

  it("empty list → needs resolve (nothing usable yet; caller bounds attempts)", () => {
    expect(imagingListNeedsResolve([])).toBe(true);
  });
});

// v0.20.13 fix: "資料確認中" ("-") is a TRANSIENT state that settles into a
// real verdict (A/1/2) — live-verified 2026-06-17 (a whole list of "-"
// resolved to "A"/"2" minutes later). Pre-fix it was silently treated as
// no-image, dropping real X-ray/CT images. imagingRowIsConfirming flags
// these (by EXCLUSION — any non-final, non-empty code) so the orchestrator
// can message them honestly + drive the cross-sync prep-poll re-check.
describe("imagingRowIsConfirming — still-confirming predicate", () => {
  it.each([
    ["-", true], // 資料確認中 — the observed code
    ["X", true], // unknown transient — by-exclusion still confirming
    ["3", true], // unknown numeric — likewise
    ["1", false], // ready
    ["A", false], // triggerable
    ["2", false], // 無影像檔 — a FINAL verdict, not confirming
    ["0", false], // already preparing (trigger in flight)
    ["", false], // missing — defensive skip, not confirming
  ])("jpG_STATUS %s → confirming=%s", (status, expected) => {
    expect(imagingRowIsConfirming({ jpG_STATUS: status })).toBe(expected);
  });

  it("tolerates alternate casings + null", () => {
    expect(imagingRowIsConfirming({ jpg_STATUS: "-" })).toBe(true);
    expect(imagingRowIsConfirming({ JPG_STATUS: "-" })).toBe(true);
    expect(imagingRowIsConfirming(null)).toBe(false);
  });

  it("a final-but-no-image list (all '2') has ZERO confirming — even though imagingListNeedsResolve re-checks it", () => {
    const allNoImage = [{ jpG_STATUS: "2" }, { jpG_STATUS: "2" }];
    expect(countImagingConfirming(allNoImage)).toBe(0);
    // the in-sync gate still re-checks (defensive), but at sync-end these
    // are 無影像檔, NOT 資料確認中 — so no misleading "re-sync" prompt.
    expect(imagingListNeedsResolve(allNoImage)).toBe(true);
  });

  it("counts only the confirming rows in a mixed list (the user's 2026-06-17 shape)", () => {
    const mixed = [
      { jpG_STATUS: "-" }, // 資料確認中
      { jpG_STATUS: "-" }, // 資料確認中
      { jpG_STATUS: "2" }, // 無影像檔
      { jpG_STATUS: "A" }, // triggerable (already settled)
    ];
    expect(countImagingConfirming(mixed)).toBe(2);
  });
});
