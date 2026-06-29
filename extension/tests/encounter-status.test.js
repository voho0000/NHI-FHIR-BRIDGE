// Encounter.status for admissions without a discharge date.
//
// NHI IC卡資料 住院 rows often carry an admission date but no out_DATE — the
// IC card simply hasn't had the discharge written back. That does NOT mean the
// patient is still admitted (in-progress) nor that we can assert it ended
// (finished). The honest FHIR value is "unknown". 申報 住院 / 門診 / 急診 keep
// "finished" (a same-day OPD visit legitimately has no period.end).

import { describe, expect, test } from "vitest";

import { mapEncounter } from "@nhi-fhir-bridge/mapper";

describe("Encounter.status — IMP without discharge date → unknown", () => {
  test("IMP admission with no end_date (IC卡, out_DATE='--') → unknown", () => {
    const e = mapEncounter({ class: "IMP", date: "2026-06-16", channel: "IC卡資料" }, "p");
    expect(e.status).toBe("unknown");
    expect(e.period.start).toBe("2026-06-16T00:00:00+08:00");
    expect(e.period.end).toBeUndefined(); // no fabricated discharge
  });

  test("IMP admission WITH end_date (申報) → finished", () => {
    const e = mapEncounter(
      { class: "IMP", date: "2023-06-07", end_date: "2023-06-09", channel: "申報資料" },
      "p",
    );
    expect(e.status).toBe("finished");
    expect(e.period.end).toBe("2023-06-09T00:00:00+08:00");
  });

  test("AMB single-day visit (no end_date) stays finished", () => {
    const e = mapEncounter({ class: "AMB", date: "2026-01-02" }, "p");
    expect(e.status).toBe("finished");
  });

  test("EMER visit (no end_date) stays finished", () => {
    const e = mapEncounter({ class: "EMER", date: "2026-01-03" }, "p");
    expect(e.status).toBe("finished");
  });
});
