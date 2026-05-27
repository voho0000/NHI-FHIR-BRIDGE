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

  test("type_display becomes type[].text (NOT SNOMED) — legacy fallback", () => {
    const r = mapEncounter({ type_display: "IC卡資料" }, PID);
    expect(r.type).toEqual([{ text: "IC卡資料" }]);
  });

  test("v0.9.2 — kind + channel each get their own coding.system", () => {
    // Bug fix: Encounter.type used to conflate kind (門診/住院/急診/藥局)
    // and data channel (IC卡資料/申報資料) into a single text field. Now
    // each dimension gets its own CodeableConcept tagged with a stable
    // bridge-defined system URI, so consumers can locate either by
    //   type.find(t => t.coding[0].system === ENCOUNTER_KIND_SYSTEM)
    // without depending on array order (FHIR doesn't define position on
    // Encounter.type).
    const r = mapEncounter(
      { date: "2026-05-13", class: "AMB", kind: "藥局", channel: "IC卡資料" },
      PID,
    );
    expect(r.type).toEqual([
      {
        text: "藥局",
        coding: [
          {
            system: "https://nhi-fhir-bridge.github.io/CodeSystem/encounter-kind",
            code: "pharmacy",
            display: "藥局",
          },
        ],
      },
      {
        text: "IC卡資料",
        coding: [
          {
            system: "https://nhi-fhir-bridge.github.io/CodeSystem/encounter-channel",
            code: "ic-card",
            display: "IC卡資料",
          },
        ],
      },
    ]);
  });

  test("v0.9.2 — kind alone produces single-entry type[] with kind system", () => {
    const r = mapEncounter({ kind: "住院" }, PID);
    expect(r.type).toEqual([
      {
        text: "住院",
        coding: [
          {
            system: "https://nhi-fhir-bridge.github.io/CodeSystem/encounter-kind",
            code: "inpatient",
            display: "住院",
          },
        ],
      },
    ]);
  });

  test("v0.9.2 — channel alone produces single-entry type[] with channel system", () => {
    const r = mapEncounter({ channel: "申報資料" }, PID);
    expect(r.type).toEqual([
      {
        text: "申報資料",
        coding: [
          {
            system: "https://nhi-fhir-bridge.github.io/CodeSystem/encounter-channel",
            code: "claims",
            display: "申報資料",
          },
        ],
      },
    ]);
  });

  test("v0.9.2 — unknown kind value ships coding without code (system+display only)", () => {
    // Future-proofing: if NHI adds a new kind like "夜診" that's not in
    // the bridge's KIND_CODE_MAP, the mapper still emits a coding entry
    // tagged with ENCOUNTER_KIND_SYSTEM so SMART apps can find it.
    // `coding.code` is omitted; `display` carries the raw string.
    const r = mapEncounter({ kind: "夜診" }, PID);
    expect(r.type).toEqual([
      {
        text: "夜診",
        coding: [
          {
            system: "https://nhi-fhir-bridge.github.io/CodeSystem/encounter-kind",
            display: "夜診",
          },
        ],
      },
    ]);
  });

  test("v0.9.2 — kind + channel takes precedence over legacy type_display", () => {
    // If a caller somehow sends all three, the new fields win and
    // type_display is ignored (otherwise we'd emit three entries).
    const r = mapEncounter({ kind: "門診", channel: "IC卡資料", type_display: "申報資料" }, PID);
    expect(r.type).toHaveLength(2);
    expect(r.type[0].coding[0].system).toBe(
      "https://nhi-fhir-bridge.github.io/CodeSystem/encounter-kind",
    );
    expect(r.type[1].coding[0].system).toBe(
      "https://nhi-fhir-bridge.github.io/CodeSystem/encounter-channel",
    );
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

  test("v0.9.0 secondary diagnoses (次診斷) append after primary in reasonCode[]", () => {
    // Real shape from IHKE3303S02 (eye clinic, 1 primary + 4 secondaries).
    // Order is contract: primary first, then 次診斷 1..N in the
    // order NHI returns them — SMART apps can render reasonCode[0]
    // as 主診斷 and the rest as 次診斷 chips.
    const r = mapEncounter(
      {
        reason: "Primary open-angle glaucoma, right eye, stage unspecified",
        reason_zh: "H401110 右側原發性隅角開放性青光眼，未明示期別",
        reason_code: "H401110",
        secondary_diagnoses: [
          {
            code: "H35379",
            name_en: "Puckering of macula, unspecified eye",
            name_zh: "未明示側性黃斑部皺褶",
          },
          { code: "H3581", name_en: "Retinal edema", name_zh: "視網膜水腫" },
        ],
      },
      PID,
    );
    expect(r.reasonCode).toHaveLength(3);
    // Primary stays as the first entry, unchanged from v0.8.0.
    expect(r.reasonCode[0].coding[0].code).toBe("H401110");
    // Secondaries follow, each with their own ICD-10-CM coding + 繁中 text.
    expect(r.reasonCode[1].coding[0]).toEqual({
      system: "http://hl7.org/fhir/sid/icd-10-cm",
      code: "H35379",
      display: "Puckering of macula, unspecified eye",
    });
    expect(r.reasonCode[1].text).toBe("H35379 未明示側性黃斑部皺褶");
    expect(r.reasonCode[2].coding[0].code).toBe("H3581");
    expect(r.reasonCode[2].text).toBe("H3581 視網膜水腫");
  });

  test("v0.9.0 no secondary_diagnoses → only primary reasonCode emitted", () => {
    const r = mapEncounter({ reason: "Essential hypertension", reason_code: "I10" }, PID);
    expect(r.reasonCode).toHaveLength(1);
  });

  test("v0.9.0 secondary_diagnoses without primary → only secondaries emitted", () => {
    // Defensive: if NHI ever returns an encounter with no primary ICD
    // but secondaries (unlikely but possible), we still surface them.
    const r = mapEncounter(
      {
        secondary_diagnoses: [
          { code: "I10", name_en: "Essential hypertension", name_zh: "原發性高血壓" },
        ],
      },
      PID,
    );
    expect(r.reasonCode).toHaveLength(1);
    expect(r.reasonCode[0].text).toBe("I10 原發性高血壓");
  });

  test("v0.9.0 secondary entries with only Chinese (no English) still emit", () => {
    const r = mapEncounter(
      {
        reason_code: "I10",
        reason_zh: "I10 原發性高血壓",
        secondary_diagnoses: [{ code: "E1121", name_zh: "第二型糖尿病" }],
      },
      PID,
    );
    expect(r.reasonCode[1].text).toBe("E1121 第二型糖尿病");
    expect(r.reasonCode[1].coding[0].display).toBe("第二型糖尿病");
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
