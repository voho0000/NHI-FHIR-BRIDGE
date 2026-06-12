/**
 * De-identification invariants for buildOverridePatient.
 *
 * Reported gap (2026-06-09): the popup mask toggle masked the patient NAME
 * (and the download FILENAME masked the 身分證 to F22345XXXX), but the bundle
 * CONTENTS still shipped the full national ID in Patient.identifier[].value
 * and the full birthDate — an inconsistent de-identification that is a real
 * privacy risk for shared / demo / test bundles. These tests pin the fix:
 * when the toggle is on, identifier.value is half-masked (matching the
 * filename) and birthDate is year-only (Jan-1 normalized), while Patient.id
 * (a salted hash) stays stable so intra-bundle references don't shift.
 */
import { describe, expect, test } from "vitest";
import * as systems from "@nhi-fhir-bridge/mapper";

const OV = {
  id_no: "F223456789",
  name: "王測試",
  birth_date: "1958-06-15",
  gender: "female",
};

describe("buildOverridePatient — de-identify toggle OFF (faithful transport)", () => {
  test("real ID, full birthDate, real name pass through verbatim", async () => {
    const { buildOverridePatient } = await import("../src/background/patient-override.ts");
    const p = buildOverridePatient(OV, false);
    expect(p.identifier[0].value).toBe("F223456789");
    expect(p.identifier[0].system).toBe(systems.TW_NATIONAL_ID);
    expect(p.birthDate).toBe("1958-06-15");
    expect(p.name[0].text).toBe("王測試");
  });
});

describe("buildOverridePatient — de-identify toggle ON", () => {
  test("身分證 half-masked, matching the filename convention", async () => {
    const { buildOverridePatient } = await import("../src/background/patient-override.ts");
    const p = buildOverridePatient(OV, true);
    expect(p.identifier[0].value).toBe("F22345XXXX");
    // System stays national-id so the field's TYPE is still self-describing.
    expect(p.identifier[0].system).toBe(systems.TW_NATIONAL_ID);
  });

  test("birthDate keeps year, normalizes to Jan 1 (SMART-app-parseable)", async () => {
    const { buildOverridePatient } = await import("../src/background/patient-override.ts");
    const p = buildOverridePatient(OV, true);
    expect(p.birthDate).toBe("1958-01-01");
    expect(/^\d{4}-\d{2}-\d{2}$/.test(p.birthDate)).toBe(true);
  });

  test("name is masked", async () => {
    const { buildOverridePatient } = await import("../src/background/patient-override.ts");
    const p = buildOverridePatient(OV, true);
    expect(p.name[0].text).toBe("王O試");
  });

  test("Patient.id (salted hash) is identical masked vs unmasked — references stay stable", async () => {
    const { buildOverridePatient } = await import("../src/background/patient-override.ts");
    const masked = buildOverridePatient(OV, true);
    const plain = buildOverridePatient(OV, false);
    expect(masked.id).toBe(plain.id);
    // And the hash never equals the cleartext ID either way.
    expect(masked.id).not.toBe("F223456789");
  });

  test("no birth_date supplied → no birthDate field, no crash", async () => {
    const { buildOverridePatient } = await import("../src/background/patient-override.ts");
    const p = buildOverridePatient({ id_no: "F223456789", name: "王測試" }, true);
    expect(p.birthDate).toBeUndefined();
    expect(p.identifier[0].value).toBe("F22345XXXX");
  });
});

describe("deidentifyOverride — backend-upload path (v0.18.3)", () => {
  test("masks id_no, birth_date and name; leaves other fields", async () => {
    const { deidentifyOverride } = await import("../src/background/patient-override.ts");
    const out = deidentifyOverride({ ...OV, gender: "female" });
    expect(out.id_no).toBe("F22345XXXX");
    expect(out.birth_date).toBe("1958-01-01");
    expect(out.name).toBe("王O試");
    expect(out.gender).toBe("female"); // untouched
  });

  test("tolerates missing fields without crashing", async () => {
    const { deidentifyOverride } = await import("../src/background/patient-override.ts");
    const out = deidentifyOverride({ id_no: "F223456789" });
    expect(out.id_no).toBe("F22345XXXX");
    expect(out.name).toBeUndefined();
    expect(out.birth_date).toBeUndefined();
  });
});
