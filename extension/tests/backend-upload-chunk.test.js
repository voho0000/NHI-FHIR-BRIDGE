// Chunking gate for backend-mode uploads (v0.20.9).
//
// Silent-bug class (project rule #8): the "抓影像" opt-in inlines base64
// JPGs (~2-3 MB each) into imaging items. In backend mode every item of a
// page_type is POSTed in ONE body; a heavy-imaging patient's single
// `page_type="imaging"` POST can exceed the backend's 32 MB body cap → 413,
// and that page_type silently never lands on the backend. chunkItemsBySize
// packs items into sub-batches under a budget below the cap so each POST
// fits. These tests pin the packing invariants: nothing dropped, order
// preserved, multi-item batches stay under budget, and a single oversized
// item is isolated (it can't be split — one item is one FHIR resource).

import { describe, expect, test } from "vitest";
import { MAX_UPLOAD_BYTES, chunkItemsBySize } from "../src/background/backend-upload.ts";

const item = (n) => ({ data: "x".repeat(n) });
const packedBytes = (batch) => batch.reduce((s, it) => s + JSON.stringify(it).length, 0);

describe("chunkItemsBySize", () => {
  test("empty input → no batches", () => {
    expect(chunkItemsBySize([], 1000)).toEqual([]);
  });

  test("items under budget stay in one batch (unchanged single-POST behavior)", () => {
    const batches = chunkItemsBySize([item(50), item(50), item(50)], 10_000);
    expect(batches).toHaveLength(1);
    expect(batches[0]).toHaveLength(3);
  });

  test("items summing over budget split into multiple batches under budget", () => {
    const items = Array.from({ length: 10 }, () => item(300)); // ~311 bytes each
    const batches = chunkItemsBySize(items, 1000); // ~3 items/batch
    expect(batches.length).toBeGreaterThan(1);
    for (const b of batches) {
      // multi-item batches must respect the budget; a lone item may exceed it
      if (b.length > 1) expect(packedBytes(b)).toBeLessThanOrEqual(1000);
    }
  });

  test("no item dropped and order preserved across batches", () => {
    const items = Array.from({ length: 7 }, (_, i) => ({ i, data: "y".repeat(200) }));
    const flat = chunkItemsBySize(items, 500).flat();
    expect(flat).toHaveLength(7);
    expect(flat.map((x) => x.i)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  test("a single oversized item is isolated in its own batch (can't be split)", () => {
    const batches = chunkItemsBySize([item(50), item(5000), item(50)], 1000);
    const lone = batches.find((b) => b.length === 1 && JSON.stringify(b[0]).length > 1000);
    expect(lone).toBeTruthy();
    expect(batches.flat()).toHaveLength(3); // nothing dropped
  });

  test("default budget sits below the backend's 32 MB hard cap", () => {
    expect(MAX_UPLOAD_BYTES).toBe(24 * 1024 * 1024);
    expect(MAX_UPLOAD_BYTES).toBeLessThan(32 * 1024 * 1024);
  });
});
