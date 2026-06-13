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
import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { NHI_API_ENDPOINTS, ENDPOINT_LABEL_ZH } from "../src/nhi-endpoints.ts";

// After the v0.13.x background.js split, SW logic lives across
// src/background.js + src/background/*.js. The text-scanning tests below
// (detail-URL param style, LOCAL_PAGE_TYPE_ORDER coverage) must glob all
// of them — the constants / fetch URLs they assert on moved into modules.
const SRC_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../src");
const BG_DIR = resolve(SRC_DIR, "background");
const SW_FILES = [
  resolve(SRC_DIR, "background.ts"),
  ...readdirSync(BG_DIR)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => resolve(BG_DIR, f)),
];
const SW_SOURCE = SW_FILES.map((p) => readFileSync(p, "utf8")).join("\n");

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
  "immunizations",
  "care_plans",
  "cancer_screening",
]);

// Local-bundle assembler iterates this whitelist. Forgetting to add a
// new page_type here = sync completes, popup shows "N 筆", but the
// downloaded Bundle silently drops those resources (root cause of the
// "popup says 2 vaccines but bundle has 0" bug in v0.8.1).
const LOCAL_BUNDLE_PAGE_TYPES = (() => {
  // LOCAL_PAGE_TYPE_ORDER moved to src/background/constants.js in the
  // v0.13.x split (and lost its `_` prefix). Scan the combined SW source
  // so the test follows the constant wherever it lives.
  const m = SW_SOURCE.match(/const\s+LOCAL_PAGE_TYPE_ORDER\s*=\s*\[([\s\S]*?)\]/);
  if (!m) return new Set();
  return new Set(
    [...m[1].matchAll(/"([^"]+)"/g)].map((mm) => mm[1]),
  );
})();

describe("NHI endpoint registry", () => {
  test("is non-empty", () => {
    expect(NHI_API_ENDPOINTS.length).toBeGreaterThan(0);
  });

  test("every detail-endpoint URL uses crid=&ctype= (NHI API param convention)", () => {
    // Regression for the v0.8.4 bug: IHKE3303S02 detail used ?rid=&t=
    // (NHI's UI route querystring) instead of ?crid=&ctype= (the real
    // API endpoint). The API returned HTTP 200 with an empty
    // {ihke3303S02_main_data:[]} array for every call, silently breaking
    // 3 features (classHint since v0.6.x, secondary diagnoses v0.8.1,
    // primary ICD bilingual v0.8.3) without tripping any error handler.
    //
    // All `/api/ihke3000/IHKE<N>S02/page_load?...` URLs must use crid +
    // ctype params. Same for any `/page_load?` URL that needs a row
    // identifier — never `rid` (UI-route param, not API).
    // (The detail-fetch URLs moved into src/background/nhi-detail-fetchers.js
    // in the v0.13.x split; scan the whole SW source so we still catch them.)
    // Path segment is `[^/]+` (not `[A-Za-z0-9]+`) so it also matches the
    // templatized `${cfg.path}` interpolation in nhi-detail-fetchers.js,
    // not just a hardcoded endpoint name.
    const detailUrls = [
      ...SW_SOURCE.matchAll(/\/api\/ihke3000\/[^/]+\/page_load\?[^`'"\s]+/g),
    ].map((m) => m[0]);
    expect(detailUrls.length).toBeGreaterThan(0);
    const offenders = detailUrls.filter(
      (u) => /[?&]rid=/.test(u) || /[?&]t=\$/.test(u) || /[?&]t=[1-9]/.test(u),
    );
    expect(
      offenders,
      `detail URLs using NHI UI param style (?rid=&t=) instead of API style (?crid=&ctype=) — this is exactly the v0.8.4 silent-failure bug: ${offenders.join(", ")}`,
    ).toEqual([]);
    // Exceptions to the crid+ctype convention — list these by path
    // pattern. Each entry is a real NHI endpoint with a different
    // param shape:
    //   IHKE3408S03   — IPL_CASE_SEQ_NO (imaging JPEG bytes; per
    //                   NHI-side seq, not row crid)
    //   ihke3408s01   — s_type+s_sort (the imaging LIST endpoint,
    //                   re-called from the polling loop to refresh
    //                   ipL_CASE_SEQ_NO for triggered rows)
    const detailUrlsCridCtype = detailUrls.filter(
      (u) =>
        !/\/IHKE3408S03\/page_load/.test(u) &&
        !/\/ihke3408s01\/page_load/.test(u),
    );
    // Positive assertion: every page_load detail URL DOES use crid+ctype.
    const missing = detailUrlsCridCtype.filter(
      (u) => !/[?&]crid=/.test(u) || !/[?&]ctype=/.test(u),
    );
    expect(
      missing,
      `detail URLs missing crid or ctype params: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  test("every page_type used by an endpoint is in background.js _LOCAL_PAGE_TYPE_ORDER", () => {
    // Regression: v0.8.0 added the immunizations endpoint + LIST_HANDLER
    // + KNOWN_PAGE_TYPES entry, but missed wiring it into the local-mode
    // bundle assembler's iteration order. Sync ran, items were adapted,
    // popup counted them — but the downloaded .json had zero. Reading
    // the constant out of background.js source keeps this test honest
    // even when someone updates one side and forgets the other.
    const pageTypes = new Set(NHI_API_ENDPOINTS.map((e) => e.page_type));
    const missing = [...pageTypes].filter(
      (pt) => !LOCAL_BUNDLE_PAGE_TYPES.has(pt),
    );
    expect(
      missing,
      `page_types missing from _LOCAL_PAGE_TYPE_ORDER (local bundle will silently drop these): ${missing.join(", ") || "(none)"}`,
    ).toEqual([]);
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
