/**
 * Security-hardening regressions (audit P1-2 + P1-3, 2026-06-12).
 *
 * P1-3: DNS-rebinding protection — a malicious page rebinds its hostname
 * to 127.0.0.1 and issues what the browser considers same-origin requests
 * (no Origin header, no CORS). The Host header is the only thing the
 * attacker cannot forge, so the app rejects unrecognized Hosts.
 *
 * P1-2: in keyless mode (SYNC_API_KEY empty) the auth middlewares are
 * no-ops, so CORS is the only thing standing between a third-party web
 * origin / arbitrary chrome-extension origin and the full PHI store.
 * Keyless mode therefore only reflects loopback (+ explicit env opt-in)
 * origins; the shipped third-party defaults and the any-extension
 * fallback require a key.
 */

import { afterEach, describe, expect, test } from "vitest";

import { settings } from "@/core/config";
import { runMigrations } from "@/core/migrate";
import { createApp } from "@/main";

runMigrations();
const app = createApp();

afterEach(() => {
  settings.SYNC_API_KEY = "";
});

describe("Host-header validation (P1-3 DNS-rebinding protection)", () => {
  test("rejects a forged Host", async () => {
    const res = await app.request("/fhir/metadata", {
      headers: { host: "evil.example.com:8010" },
    });
    expect(res.status).toBe(403);
    const body = (await res.json()) as { detail: string };
    expect(body.detail).toContain("DNS-rebinding");
  });

  test("accepts loopback Hosts on any port", async () => {
    for (const host of ["localhost:8010", "127.0.0.1:8010", "localhost:9999", "localhost"]) {
      const res = await app.request("/fhir/metadata", { headers: { host } });
      expect(res.status, `host=${host}`).toBe(200);
    }
  });

  test("rejects an IP-literal non-loopback Host (rebind to LAN IP)", async () => {
    const res = await app.request("/", { headers: { host: "192.168.1.50:8010" } });
    expect(res.status).toBe(403);
  });
});

describe("keyless CORS lockdown (P1-2)", () => {
  test("loopback origin is reflected", async () => {
    const res = await app.request("/", {
      headers: { host: "localhost:8010", origin: "http://localhost:3010" },
    });
    expect(res.headers.get("access-control-allow-origin")).toBe("http://localhost:3010");
  });

  test("default third-party origin (github.io) is NOT reflected without a key", async () => {
    const res = await app.request("/", {
      headers: { host: "localhost:8010", origin: "https://voho0000.github.io" },
    });
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
  });

  test("arbitrary chrome-extension origin is NOT reflected without a key", async () => {
    const res = await app.request("/", {
      headers: {
        host: "localhost:8010",
        origin: "chrome-extension://abcdefghijklmnopabcdefghijklmnop",
      },
    });
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
  });

  test("with a key set, github.io and the extension fallback are reflected again", async () => {
    settings.SYNC_API_KEY = "test-key-for-cors";
    const ghRes = await app.request("/", {
      headers: { host: "localhost:8010", origin: "https://voho0000.github.io" },
    });
    expect(ghRes.headers.get("access-control-allow-origin")).toBe("https://voho0000.github.io");
    const extRes = await app.request("/", {
      headers: {
        host: "localhost:8010",
        origin: "chrome-extension://abcdefghijklmnopabcdefghijklmnop",
      },
    });
    expect(extRes.headers.get("access-control-allow-origin")).toBe(
      "chrome-extension://abcdefghijklmnopabcdefghijklmnop",
    );
  });

  test("NHI portal origin is never reflected (dropped from defaults)", async () => {
    settings.SYNC_API_KEY = "test-key-for-cors";
    const res = await app.request("/", {
      headers: { host: "localhost:8010", origin: "https://myhealthbank.nhi.gov.tw" },
    });
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
  });

  test("public discovery endpoints keep the wildcard (no credentials)", async () => {
    const res = await app.request("/fhir/metadata", {
      headers: { host: "localhost:8010", origin: "https://anything.example" },
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
    expect(res.headers.get("access-control-allow-credentials")).toBeNull();
  });
});
