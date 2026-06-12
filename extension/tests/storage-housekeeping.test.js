/**
 * Storage-housekeeping regressions (audit P0-4 + P1-6, 2026-06-12).
 *
 * P0-4: sweepStaleLocalKeys used to delete the key "pendingFhirBundle"
 * as pre-v0.8.7 dead weight — but v0.14 recycled that exact name as the
 * CURRENT bundle-metadata slot. Every extension update therefore wiped
 * the metadata and orphaned pendingFhirBundleJson (the 80+ MB PHI blob)
 * forever: the TTL sweep early-returned without metadata and the popup
 * hid its download/clear buttons. These tests pin the fix.
 *
 * P1-6: the NHI bearer-token snapshot was rejected after its 30-min TTL
 * but never deleted from disk. Pin the self-cleaning + sweep behavior.
 */
import { afterEach, describe, expect, test } from "vitest";

import {
  NHI_BEARER_TOKEN_KEY,
  NHI_BEARER_TOKEN_TTL_MS,
  PENDING_BUNDLE_JSON_KEY,
  PENDING_BUNDLE_KEY,
  PENDING_BUNDLE_TTL_MS,
} from "../src/background/constants.ts";
import {
  purgeBearerToken,
  sweepPendingBundleIfStale,
  sweepStaleBearerToken,
  sweepStaleLocalKeys,
} from "../src/background/storage-migration.ts";

function installChromeStub(initial = {}) {
  const store = new Map(Object.entries(initial));
  const toKeys = (k) => (Array.isArray(k) ? k : [k]);
  globalThis.chrome = {
    storage: {
      local: {
        async get(keys) {
          if (keys === null) return Object.fromEntries(store);
          const out = {};
          for (const k of toKeys(keys)) if (store.has(k)) out[k] = store.get(k);
          return out;
        },
        async set(obj) {
          for (const [k, v] of Object.entries(obj)) store.set(k, v);
        },
        async remove(keys) {
          for (const k of toKeys(keys)) store.delete(k);
        },
        async getBytesInUse(key) {
          return store.has(key) ? JSON.stringify(store.get(key)).length : 0;
        },
      },
      sync: {
        async get() {
          return {};
        },
        async set() {},
        async remove() {},
      },
    },
  };
  return store;
}

afterEach(() => {
  delete globalThis.chrome;
});

describe("sweepStaleLocalKeys — P0-4 regression", () => {
  test("does NOT delete the live pending-bundle metadata or JSON on update", async () => {
    const store = installChromeStub({
      [PENDING_BUNDLE_KEY]: { filename: "x.json", generatedAt: Date.now(), hasJson: true },
      [PENDING_BUNDLE_JSON_KEY]: '{"resourceType":"Bundle"}',
    });
    await sweepStaleLocalKeys();
    expect(store.has(PENDING_BUNDLE_KEY)).toBe(true);
    expect(store.has(PENDING_BUNDLE_JSON_KEY)).toBe(true);
  });

  test("still sweeps __sampleBody_* debug PHI keys", async () => {
    const store = installChromeStub({
      __sampleBody_medications: '{"raw":"phi"}',
      __sampleBody_labs: '{"raw":"phi"}',
      somethingElse: 1,
    });
    await sweepStaleLocalKeys();
    expect(store.has("__sampleBody_medications")).toBe(false);
    expect(store.has("__sampleBody_labs")).toBe(false);
    expect(store.has("somethingElse")).toBe(true);
  });
});

describe("sweepPendingBundleIfStale — P0-4 orphan recovery + TTL", () => {
  test("removes an orphaned JSON blob when metadata is missing", async () => {
    const store = installChromeStub({
      [PENDING_BUNDLE_JSON_KEY]: '{"resourceType":"Bundle","entry":[]}',
    });
    await sweepPendingBundleIfStale();
    expect(store.has(PENDING_BUNDLE_JSON_KEY)).toBe(false);
  });

  test("keeps a fresh bundle (metadata + JSON)", async () => {
    const store = installChromeStub({
      [PENDING_BUNDLE_KEY]: { generatedAt: Date.now() },
      [PENDING_BUNDLE_JSON_KEY]: "{}",
    });
    await sweepPendingBundleIfStale();
    expect(store.has(PENDING_BUNDLE_KEY)).toBe(true);
    expect(store.has(PENDING_BUNDLE_JSON_KEY)).toBe(true);
  });

  test("drops both keys once past the TTL", async () => {
    const store = installChromeStub({
      [PENDING_BUNDLE_KEY]: { generatedAt: Date.now() - PENDING_BUNDLE_TTL_MS - 1000 },
      [PENDING_BUNDLE_JSON_KEY]: "{}",
    });
    await sweepPendingBundleIfStale();
    expect(store.has(PENDING_BUNDLE_KEY)).toBe(false);
    expect(store.has(PENDING_BUNDLE_JSON_KEY)).toBe(false);
  });

  test("legacy <=v0.8.7 full-JSON value (no generatedAt) is treated as stale", async () => {
    const store = installChromeStub({
      [PENDING_BUNDLE_KEY]: { resourceType: "Bundle", entry: [] }, // old shape, no generatedAt
    });
    await sweepPendingBundleIfStale();
    expect(store.has(PENDING_BUNDLE_KEY)).toBe(false);
  });
});

describe("bearer-token housekeeping — P1-6", () => {
  test("sweepStaleBearerToken removes an expired token", async () => {
    const store = installChromeStub({
      [NHI_BEARER_TOKEN_KEY]: {
        token: "tok",
        patientId: "F223456789",
        savedAt: Date.now() - NHI_BEARER_TOKEN_TTL_MS - 1000,
      },
    });
    await sweepStaleBearerToken();
    expect(store.has(NHI_BEARER_TOKEN_KEY)).toBe(false);
  });

  test("sweepStaleBearerToken keeps a fresh token", async () => {
    const store = installChromeStub({
      [NHI_BEARER_TOKEN_KEY]: { token: "tok", patientId: "F223456789", savedAt: Date.now() },
    });
    await sweepStaleBearerToken();
    expect(store.has(NHI_BEARER_TOKEN_KEY)).toBe(true);
  });

  test("purgeBearerToken removes unconditionally", async () => {
    const store = installChromeStub({
      [NHI_BEARER_TOKEN_KEY]: { token: "tok", patientId: "F223456789", savedAt: Date.now() },
    });
    await purgeBearerToken();
    expect(store.has(NHI_BEARER_TOKEN_KEY)).toBe(false);
  });
});
