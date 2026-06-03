import { describe, expect, test } from "vitest";

import { GROUP_HANDLERS, LIST_HANDLERS } from "@nhi-fhir-bridge/mapper";

describe("LIST_HANDLERS dispatch table", () => {
  const expected = [
    "observations",
    "medications",
    "conditions",
    "allergies",
    "diagnostic_reports",
    "procedures",
    "encounters",
    "immunizations",
    "care_plans",
  ];

  test("covers every page_type the extension can produce", () => {
    for (const key of expected) expect(LIST_HANDLERS).toHaveProperty(key);
  });

  test.each(expected)("%s entry resolves to a function + a JSON key string", (key) => {
    const entry = LIST_HANDLERS[key];
    expect(entry).toBeDefined();
    const [fn, jsonKey] = entry!;
    expect(typeof fn).toBe("function");
    expect(typeof jsonKey).toBe("string");
    expect(jsonKey.length).toBeGreaterThan(0);
  });

  test("each per-row mapper accepts (raw, patientId)", () => {
    // Smoke test: every mapper should handle an empty-ish raw without
    // throwing — they all gate on optional fields and either return a
    // FHIR resource or null. None should crash on bare input.
    for (const key of expected) {
      const [fn] = LIST_HANDLERS[key]!;
      expect(() => fn({}, "P001")).not.toThrow();
    }
  });
});

describe("GROUP_HANDLERS dispatch table", () => {
  test("observations + medications have group mappers (panel grouping + 中英 dedup)", () => {
    expect(typeof GROUP_HANDLERS.observations).toBe("function");
    expect(typeof GROUP_HANDLERS.medications).toBe("function");
  });

  test("group mappers tolerate an empty items array", () => {
    expect(GROUP_HANDLERS.observations!([], "P001")).toEqual([]);
    expect(GROUP_HANDLERS.medications!([], "P001")).toEqual([]);
  });

  test("group mappers return an array (not null) on bad input", () => {
    // Whatever shape the items are, the contract is "return resources".
    // Returning null or undefined here would break the upsert loop.
    const out = GROUP_HANDLERS.observations!([{ display: "" }], "P001");
    expect(Array.isArray(out)).toBe(true);
  });
});
