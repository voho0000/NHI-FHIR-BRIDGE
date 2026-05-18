import { describe, expect, test } from "vitest";

import { mapAllergyIntolerance } from "@nhi-fhir-bridge/mapper";

const PID = "P001";

describe("mapAllergyIntolerance", () => {
  test("minimum shape", () => {
    const r = mapAllergyIntolerance({ display: "Penicillin" }, PID);
    expect(r.resourceType).toBe("AllergyIntolerance");
    expect(r.patient.reference).toBe(`Patient/${PID}`);
    expect(r.code.text).toBe("Penicillin");
    // Both status fields are always stamped — most allergy lists from
    // NHI have no explicit status, and SMART apps reject AllergyIntolerance
    // resources missing them.
    expect(r.clinicalStatus.coding[0].code).toBe("active");
    expect(r.verificationStatus.coding[0].code).toBe("confirmed");
  });

  test("system hint maps to SNOMED CT", () => {
    const r = mapAllergyIntolerance(
      { display: "Penicillin", code: "294505008", system: "snomed" },
      PID,
    );
    expect(r.code.coding[0].system).toBe("http://snomed.info/sct");
    expect(r.code.coding[0].code).toBe("294505008");
  });

  test("system hint maps to RxNorm", () => {
    const r = mapAllergyIntolerance({ display: "Aspirin", code: "1191", system: "RxNorm" }, PID);
    expect(r.code.coding[0].system).toBe("http://www.nlm.nih.gov/research/umls/rxnorm");
  });

  test("unknown system falls back to local allergen code", () => {
    const r = mapAllergyIntolerance({ display: "Latex" }, PID);
    expect(r.code.coding[0].system).toContain("allergen");
  });

  test("missing display falls back to 'Unknown Allergen'", () => {
    const r = mapAllergyIntolerance({}, PID);
    expect(r.code.text).toBe("Unknown Allergen");
  });

  test("allowed category list is enforced", () => {
    const ok = mapAllergyIntolerance({ display: "Peanut", category: "food" }, PID);
    expect(ok.category).toEqual(["food"]);
    const reject = mapAllergyIntolerance({ display: "?", category: "garbage" }, PID);
    expect(reject.category).toBeUndefined();
  });

  test("allowed criticality list is enforced", () => {
    const ok = mapAllergyIntolerance({ display: "?", criticality: "high" }, PID);
    expect(ok.criticality).toBe("high");
    const reject = mapAllergyIntolerance({ display: "?", criticality: "extreme" }, PID);
    expect(reject.criticality).toBeUndefined();
  });

  test("recorded_date is normalized to ISO + TW timezone", () => {
    const r = mapAllergyIntolerance({ display: "?", recorded_date: "2024-05-17" }, PID);
    expect(r.recordedDate).toBe("2024-05-17T00:00:00+08:00");
  });

  test("reaction note becomes a single reaction entry", () => {
    const r = mapAllergyIntolerance({ display: "?", reaction: "rash and dyspnea" }, PID);
    expect(r.reaction).toHaveLength(1);
    expect(r.reaction[0].description).toBe("rash and dyspnea");
  });

  test("same input → same stable id (idempotent re-sync)", () => {
    const a = mapAllergyIntolerance({ display: "Penicillin", recorded_date: "2024-01-01" }, PID);
    const b = mapAllergyIntolerance({ display: "Penicillin", recorded_date: "2024-01-01" }, PID);
    expect(a.id).toBe(b.id);
  });

  test("different patient → different stable id", () => {
    const a = mapAllergyIntolerance({ display: "Penicillin" }, "P001");
    const b = mapAllergyIntolerance({ display: "Penicillin" }, "P002");
    expect(a.id).not.toBe(b.id);
  });
});
