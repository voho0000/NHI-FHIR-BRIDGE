/**
 * CarePlan mapper unit tests.
 *
 * NHI's 我參與的照護計畫 endpoint (IHKE3213S01) lists case-management /
 * 衛教 programme enrolments. mapCarePlan must produce a FHIR R4-valid
 * CarePlan with the required fields (status, intent, subject) populated
 * from NHI's adapted shape, derive status from 結案日 presence, and add
 * period / category / author when source data carries them.
 */

import { describe, expect, test } from "vitest";

import { mapCarePlan } from "@nhi-fhir-bridge/mapper";

const PID = "A123456789";

const PRE_ESRD = {
  title: "末期腎臟病前期（Pre-ESRD）之病人照護與衛教計畫",
  description: "對慢性腎臟病之高危險群進行個案管理，以期早期發現，積極治療與介入。",
  period_start: "2024-06-13",
  period_end: "",
  status: "active",
  hospital: "中國北港醫",
  hospital_id: "1339060017",
  program_code: "",
};

describe("mapCarePlan", () => {
  test("minimum required FHIR fields populated (active enrolment)", () => {
    const r = mapCarePlan(PRE_ESRD, PID);
    expect(r).not.toBeNull();
    expect(r!.resourceType).toBe("CarePlan");
    expect(r!.status).toBe("active");
    expect(r!.intent).toBe("plan");
    expect(r!.title).toBe(PRE_ESRD.title);
    expect(r!.subject.reference).toBe(`Patient/${PID}`);
  });

  test("description passed through verbatim", () => {
    const r = mapCarePlan(PRE_ESRD, PID);
    expect(r!.description).toBe(PRE_ESRD.description);
  });

  test("period.start = 收案日; period.end omitted while active", () => {
    const r = mapCarePlan(PRE_ESRD, PID);
    expect(r!.period).toEqual({ start: "2024-06-13T00:00:00+08:00" });
  });

  test("close_date present → status completed + period.end set", () => {
    const r = mapCarePlan({ ...PRE_ESRD, status: "completed", period_end: "2025-12-31" }, PID);
    expect(r!.status).toBe("completed");
    expect(r!.period).toEqual({
      start: "2024-06-13T00:00:00+08:00",
      end: "2025-12-31T00:00:00+08:00",
    });
  });

  test("hospital → author.display (display-only Reference)", () => {
    const r = mapCarePlan(PRE_ESRD, PID);
    expect(r!.author).toEqual({ display: "中國北港醫" });
  });

  test("category always present with NHI label; no coding when no program_code", () => {
    const r = mapCarePlan(PRE_ESRD, PID);
    expect(r!.category).toEqual([{ text: "NHI 照護計畫" }]);
  });

  test("program_code → category coding under bridge CodeSystem", () => {
    const r = mapCarePlan({ ...PRE_ESRD, program_code: "IHKE3505S01" }, PID);
    expect(r!.category).toEqual([
      {
        text: "NHI 照護計畫",
        coding: [
          {
            system: "https://nhi-fhir-bridge.github.io/CodeSystem/nhi-care-plan-program",
            code: "IHKE3505S01",
          },
        ],
      },
    ]);
  });

  test("status defaults to active for any non-completed input", () => {
    expect(mapCarePlan({ title: "X", status: "" }, PID)!.status).toBe("active");
    expect(mapCarePlan({ title: "X", status: "active" }, PID)!.status).toBe("active");
    expect(mapCarePlan({ title: "X", status: "completed" }, PID)!.status).toBe("completed");
  });

  test("returns null when title missing", () => {
    expect(mapCarePlan({ description: "x", period_start: "2024-06-13" }, PID)).toBeNull();
    expect(mapCarePlan({ title: "" }, PID)).toBeNull();
  });

  test("description / period / author omitted when source fields empty", () => {
    const r = mapCarePlan({ title: "計畫", status: "active" }, PID);
    expect(r!.description).toBeUndefined();
    expect(r!.period).toBeUndefined();
    expect(r!.author).toBeUndefined();
  });

  test("same input → same stable id (idempotent re-sync)", () => {
    const a = mapCarePlan(PRE_ESRD, PID);
    const b = mapCarePlan(PRE_ESRD, PID);
    expect(a!.id).toBe(b!.id);
  });

  test("re-enrolment on a different 收案日 → distinct stable id", () => {
    const a = mapCarePlan(PRE_ESRD, PID);
    const b = mapCarePlan({ ...PRE_ESRD, period_start: "2025-06-13" }, PID);
    expect(a!.id).not.toBe(b!.id);
  });
});
