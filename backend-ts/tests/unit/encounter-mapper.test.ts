import { describe, expect, test } from "vitest";

import { mapEncounter } from "@nhi-fhir-bridge/mapper";

const PID = "P001";

describe("mapEncounter", () => {
  test("minimum shape", () => {
    const r = mapEncounter({ date: "2024-05-01", class: "AMB" }, PID);
    expect(r.resourceType).toBe("Encounter");
    expect(r.status).toBe("finished");
    expect(r.subject.reference).toBe(`Patient/${PID}`);
    expect(r.class.code).toBe("AMB");
    expect(r.class.display).toBe("ambulatory");
    expect(r.period.start).toBe("2024-05-01T00:00:00+08:00");
  });

  test("inpatient class", () => {
    const r = mapEncounter({ date: "2024-05-01", class: "IMP" }, PID);
    expect(r.class.code).toBe("IMP");
    expect(r.class.display).toBe("inpatient encounter");
  });

  test("emergency class", () => {
    const r = mapEncounter({ class: "EMER" }, PID);
    expect(r.class.code).toBe("EMER");
  });

  test("unknown class falls back to AMB", () => {
    const r = mapEncounter({ class: "weird" }, PID);
    expect(r.class.code).toBe("AMB");
  });

  test("class is uppercased", () => {
    const r = mapEncounter({ class: "imp" }, PID);
    expect(r.class.code).toBe("IMP");
  });

  test("end_date adds a period.end", () => {
    const r = mapEncounter(
      { class: "IMP", date: "2024-05-01", end_date: "2024-05-05" },
      PID,
    );
    expect(r.period.start).toBe("2024-05-01T00:00:00+08:00");
    expect(r.period.end).toBe("2024-05-05T00:00:00+08:00");
  });

  test("type_display becomes type[].text (NOT SNOMED)", () => {
    const r = mapEncounter({ type_display: "IC卡資料" }, PID);
    expect(r.type).toEqual([{ text: "IC卡資料" }]);
  });

  test("department populates serviceType.text", () => {
    const r = mapEncounter({ department: "內科" }, PID);
    expect(r.serviceType.text).toBe("內科");
  });

  test("provider becomes participant.individual.display", () => {
    const r = mapEncounter({ provider: "Dr. Lin" }, PID);
    expect(r.participant[0].individual.display).toBe("Dr. Lin");
  });

  test("hospital populates serviceProvider.display", () => {
    const r = mapEncounter({ hospital: "VGH" }, PID);
    expect(r.serviceProvider.display).toBe("VGH");
  });

  test("reason becomes reasonCode[].text", () => {
    const r = mapEncounter({ reason: "fever workup" }, PID);
    expect(r.reasonCode[0].text).toBe("fever workup");
  });

  test("discharge_disposition becomes hospitalization.dischargeDisposition.text", () => {
    const r = mapEncounter({ discharge_disposition: "home" }, PID);
    expect(r.hospitalization.dischargeDisposition.text).toBe("home");
  });

  test("clinical_note becomes note[].text", () => {
    const r = mapEncounter({ clinical_note: "no acute findings" }, PID);
    expect(r.note[0].text).toBe("no acute findings");
  });

  // Stable-id includes hospital so two same-day visits to different
  // hospitals don't collapse — the linker depends on this invariant.
  test("hospital is part of stable id", () => {
    const a = mapEncounter({ date: "2024-05-01", class: "AMB", hospital: "VGH" }, PID);
    const b = mapEncounter({ date: "2024-05-01", class: "AMB", hospital: "NTUH" }, PID);
    expect(a.id).not.toBe(b.id);
  });

  test("same-input idempotency", () => {
    const a = mapEncounter({ date: "2024-05-01", class: "IMP", hospital: "VGH" }, PID);
    const b = mapEncounter({ date: "2024-05-01", class: "IMP", hospital: "VGH" }, PID);
    expect(a.id).toBe(b.id);
  });
});
