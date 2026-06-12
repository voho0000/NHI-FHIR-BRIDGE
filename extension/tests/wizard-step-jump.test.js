/**
 * _shouldJumpToResultStep — the rule that decides whether a sync-status
 * update force-jumps the wizard to step 3 (audit follow-up, bug 2026-06-13).
 *
 * The bug: while a sync ran, every ~1-2s progress write pulled the user
 * back to step 3, so tapping over to step 2 to review data bounced back
 * within a second. The fix withholds the jump for in-flight progress
 * updates (running → running) and the post-completion imaging-poll
 * trickle (done → done), while still jumping on start, completion, and
 * popup-reopen.
 */
import { describe, expect, test } from "vitest";

import { _shouldJumpToResultStep } from "../src/popup/step-logic.ts";

const running = (phase = "syncing") => ({ running: true, phase });
const doneStatus = { running: false, phase: "done" };
const errorStatus = { running: false, phase: "error" };

describe("_shouldJumpToResultStep", () => {
  test("sync just started (no prev) → jump", () => {
    expect(_shouldJumpToResultStep(null, running("starting"))).toBe(true);
  });

  test("sync just started (prev was a finished sync) → jump", () => {
    expect(_shouldJumpToResultStep(doneStatus, running("starting"))).toBe(true);
  });

  test("reopen popup mid-sync (prev null, now running) → jump", () => {
    expect(_shouldJumpToResultStep(null, running("uploading"))).toBe(true);
  });

  test("in-flight progress line (running → running) → NO jump (the bug)", () => {
    expect(_shouldJumpToResultStep(running("uploading 用藥"), running("uploading 檢驗"))).toBe(
      false,
    );
  });

  test("sync just finished (running → done) → jump to show ✅", () => {
    expect(_shouldJumpToResultStep(running("finishing"), doneStatus)).toBe(true);
  });

  test("sync just errored (running → error) → jump to show ❌", () => {
    expect(_shouldJumpToResultStep(running("uploading"), errorStatus)).toBe(true);
  });

  test("post-completion imaging-poll trickle (done → done) → NO jump", () => {
    expect(_shouldJumpToResultStep(doneStatus, { running: false, phase: "done" })).toBe(false);
  });

  test("reopen popup after a finished sync (prev null, now done) → jump (unchanged)", () => {
    expect(_shouldJumpToResultStep(null, doneStatus)).toBe(true);
  });
});
