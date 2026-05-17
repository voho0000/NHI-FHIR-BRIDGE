/**
 * Medication mapper unit tests.
 * Port of backend/tests/unit/test_medication_mapper.py.
 */

import { describe, expect, test } from "vitest";

import { canonicalDrugKey, mapMedicationsDedup } from "@nhi-fhir-bridge/mapper";

const PATIENT_ID = "A123456789";

describe("canonicalDrugKey", () => {
  test("English only", () => {
    expect(canonicalDrugKey("TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION")).toBe(
      "timoptol xe 0.5% ophthalmic solution",
    );
  });

  test("Eng then 中 collapses to same key", () => {
    expect(canonicalDrugKey("TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION (青眼露)")).toBe(
      "timoptol xe 0.5% ophthalmic solution",
    );
  });

  test("中 then Eng collapses to same key", () => {
    expect(canonicalDrugKey("青眼露 (TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION)")).toBe(
      "timoptol xe 0.5% ophthalmic solution",
    );
  });

  test("trailing dash modifier stripped", () => {
    expect(canonicalDrugKey("FLUCASON OPHTHALMIC SUSPENSION 0.02% - FLUOROMETHOLONE")).toBe(
      "flucason ophthalmic suspension 0.02%",
    );
  });

  test("Chinese-only falls back", () => {
    expect(canonicalDrugKey("護康視懸濁點眼液")).toBe("護康視懸濁點眼液");
  });
});

describe("mapMedicationsDedup", () => {
  test("three-format duplicates collapse to one", () => {
    const items = [
      {
        drug_name: "TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION",
        date: "2024-01-15",
        dose: "1",
        unit: "drop",
        frequency: "BID",
        route: "topical",
      },
      {
        drug_name: "TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION (青眼露)",
        date: "2024-01-15",
        dose: "1",
        unit: "drop",
        frequency: "BID",
        route: "topical",
      },
      {
        drug_name: "青眼露 (TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION)",
        date: "2024-01-15",
        dose: "1",
        unit: "drop",
        frequency: "BID",
        route: "topical",
      },
    ];
    const resources = mapMedicationsDedup(items, PATIENT_ID);
    expect(resources).toHaveLength(1);
    expect(resources[0]!.resourceType).toBe("MedicationRequest");
  });

  test("different dates kept separate", () => {
    const items = [
      { drug_name: "Aspirin 100mg", date: "2024-01-15", dose: "100", unit: "mg" },
      { drug_name: "Aspirin 100mg", date: "2024-02-15", dose: "100", unit: "mg" },
    ];
    expect(mapMedicationsDedup(items, PATIENT_ID)).toHaveLength(2);
  });

  test("different drugs kept separate", () => {
    const items = [
      { drug_name: "Aspirin 100mg", date: "2024-01-15", dose: "100", unit: "mg" },
      { drug_name: "Metformin 500mg", date: "2024-01-15", dose: "500", unit: "mg" },
    ];
    expect(mapMedicationsDedup(items, PATIENT_ID)).toHaveLength(2);
  });
});
