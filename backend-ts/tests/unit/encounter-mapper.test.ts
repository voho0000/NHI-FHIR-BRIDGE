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
    const r = mapEncounter({ class: "IMP", date: "2024-05-01", end_date: "2024-05-05" }, PID);
    expect(r.period.start).toBe("2024-05-01T00:00:00+08:00");
    expect(r.period.end).toBe("2024-05-05T00:00:00+08:00");
  });

  test("type_display becomes type[].text (NOT SNOMED)", () => {
    const r = mapEncounter({ type_display: "IC卡資料" }, PID);
    expect(r.type).toEqual([{ text: "IC卡資料" }]);
  });

  test("pharmacy type_display=藥局 flows through unchanged (SMART app detection point)", () => {
    // SMART apps detect pharmacy events via type[].text.includes('藥局');
    // make sure the mapper does not normalize or strip the value.
    const r = mapEncounter(
      {
        date: "2026-05-13",
        class: "AMB",
        type_display: "藥局",
        hospital: "安心大藥局",
      },
      PID,
    );
    expect(r.type).toEqual([{ text: "藥局" }]);
    expect(r.serviceProvider.display).toBe("安心大藥局");
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

  test("v0.8.0 bilingual reasonCode: text=繁中, coding.display=English with ICD-10-CM system", () => {
    const r = mapEncounter(
      {
        reason: "I10 Essential hypertension",
        reason_zh: "I10 原發性高血壓",
        reason_code: "I10",
      },
      PID,
    );
    expect(r.reasonCode[0].text).toBe("I10 原發性高血壓");
    expect(r.reasonCode[0].coding[0]).toEqual({
      system: "http://hl7.org/fhir/sid/icd-10-cm",
      code: "I10",
      display: "Essential hypertension",
    });
  });

  test("v0.8.0 fallback: reason_zh missing → text falls back to English reason", () => {
    const r = mapEncounter({ reason: "Essential hypertension", reason_code: "I10" }, PID);
    expect(r.reasonCode[0].text).toBe("Essential hypertension");
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
