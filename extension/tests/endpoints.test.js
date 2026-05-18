// Registry consistency tests for NHI_API_ENDPOINTS / ENDPOINT_LABEL_ZH.
//
// These pin down the contract that the registry is supposed to keep:
//   - Every endpoint has a 中文 label (so the popup's 查看明細 row
//     reads "就醫 12 筆" not "encounters=12/12").
//   - Every endpoint references an adapter that's actually a function.
//   - page_type values are limited to the set the mapper recognises
//     (catches a typo turning resources into orphaned strings).
//   - Names are unique.

import { describe, expect, test } from "vitest";
import { NHI_API_ENDPOINTS, ENDPOINT_LABEL_ZH } from "../src/nhi-endpoints.js";

// Page types currently understood by the mapper / sync pipeline. If
// the mapper grows new groups, extend this set. Keeping it narrow
// catches typos (e.g. "encounter" without the trailing s).
const KNOWN_PAGE_TYPES = new Set([
  "encounters",
  "procedures",
  "medications",
  "allergies",
  "observations",
  "diagnostic_reports",
  "conditions",
]);

describe("NHI endpoint registry", () => {
  test("is non-empty", () => {
    expect(NHI_API_ENDPOINTS.length).toBeGreaterThan(0);
  });

  test("every endpoint has a unique name", () => {
    const seen = new Map();
    for (const ep of NHI_API_ENDPOINTS) {
      expect(seen.has(ep.name), `duplicate endpoint name: ${ep.name}`).toBe(false);
      seen.set(ep.name, true);
    }
  });

  test("every endpoint name has a Chinese label", () => {
    const missing = [];
    for (const ep of NHI_API_ENDPOINTS) {
      if (!ENDPOINT_LABEL_ZH[ep.name]) missing.push(ep.name);
    }
    expect(
      missing,
      `endpoints missing ENDPOINT_LABEL_ZH entries: ${missing.join(", ") || "(none)"}`,
    ).toEqual([]);
  });

  test("no orphan labels — every ENDPOINT_LABEL_ZH key matches a real endpoint", () => {
    const endpointNames = new Set(NHI_API_ENDPOINTS.map((e) => e.name));
    const orphans = Object.keys(ENDPOINT_LABEL_ZH).filter((k) => !endpointNames.has(k));
    expect(
      orphans,
      `ENDPOINT_LABEL_ZH has stale entries for removed endpoints: ${orphans.join(", ")}`,
    ).toEqual([]);
  });

  test("every endpoint .adapt is callable", () => {
    for (const ep of NHI_API_ENDPOINTS) {
      expect(typeof ep.adapt, `endpoint ${ep.name}: adapt is ${typeof ep.adapt}`).toBe("function");
    }
  });

  test("every endpoint page_type is in the known set", () => {
    for (const ep of NHI_API_ENDPOINTS) {
      expect(
        KNOWN_PAGE_TYPES.has(ep.page_type),
        `endpoint ${ep.name} has unknown page_type "${ep.page_type}"`,
      ).toBe(true);
    }
  });

  test("every endpoint path starts with /api/ihke3000/", () => {
    for (const ep of NHI_API_ENDPOINTS) {
      expect(ep.path.startsWith("/api/ihke3000/"), `${ep.name}: ${ep.path}`).toBe(true);
    }
  });

  test("supportsDateRange endpoints accept either explicit s_date= placeholder or appended params", () => {
    // If supportsDateRange is set, applyDateRangeToPath in background.js
    // either fills in existing s_date= placeholders or appends them.
    // Both shapes are fine; this test just ensures the flag is boolean.
    for (const ep of NHI_API_ENDPOINTS) {
      if ("supportsDateRange" in ep) {
        expect(typeof ep.supportsDateRange).toBe("boolean");
      }
    }
  });
});
