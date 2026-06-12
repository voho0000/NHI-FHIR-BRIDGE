/**
 * /smart/authorize hardening regressions (audit 2026-06-12).
 *
 * P2-3: the dev "auto-pick the first patient" fallback ran whenever
 *       SYNC_API_KEY was empty — any client hitting /smart/authorize
 *       got a code for someone's PHI. Now requires the explicit env
 *       opt-in SMART_DEV_AUTOSELECT_PATIENT=1.
 * P3:   PKCE 'plain' accepted while discovery advertises S256-only;
 *       aud optional; response_type never validated; launch tokens
 *       replayable for their full 10-min TTL; discovery document
 *       advertising unimplemented capabilities/scopes.
 */

import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { settings } from "@/core/config";
import { db } from "@/core/database";
import { runMigrations } from "@/core/migrate";
import { fhirServer } from "@/fhir/server";
import { createApp } from "@/main";
import { fhirResources } from "@/models/schema";
import { smartAuth } from "@/smart/oauth2";

const PATIENT_ID = "test-patient-authz";
const REDIRECT_URI = "http://localhost:3001/callback";

runMigrations();
const app = createApp();

/** Build /smart/authorize query — pass `null` to omit a param. */
function authorizeUrl(overrides: Record<string, string | null> = {}): string {
  const defaults: Record<string, string | null> = {
    response_type: "code",
    client_id: "demo-smart-app",
    redirect_uri: REDIRECT_URI,
    scope: "launch/patient patient/*.read",
    state: "xyz",
    aud: settings.FHIR_BASE_URL,
    code_challenge: "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
    code_challenge_method: "S256",
    launch: null,
  };
  const merged = { ...defaults, ...overrides };
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) {
    if (v !== null) params.set(k, v);
  }
  return `/smart/authorize?${params.toString()}`;
}

describe("/smart/authorize hardening", () => {
  beforeEach(() => {
    db.delete(fhirResources).run();
    smartAuth.seedDemoClients();
    fhirServer.upsert({
      resourceType: "Patient",
      id: PATIENT_ID,
      name: [{ text: "Authorize Test Patient" }],
    });
    settings.SYNC_API_KEY = "";
    // NOT `delete` (biome noDelete) and NOT `= undefined` (process.env
    // coerces undefined to the string "undefined"); "" fails the === "1"
    // opt-in check just the same.
    process.env.SMART_DEV_AUTOSELECT_PATIENT = "";
  });
  afterEach(() => {
    db.delete(fhirResources).run();
    settings.SYNC_API_KEY = "";
    // NOT `delete` (biome noDelete) and NOT `= undefined` (process.env
    // coerces undefined to the string "undefined"); "" fails the === "1"
    // opt-in check just the same.
    process.env.SMART_DEV_AUTOSELECT_PATIENT = "";
  });

  test("happy path: valid launch token → 302 redirect with code + state", async () => {
    const launch = smartAuth.createLaunchContext(PATIENT_ID);
    const res = await app.request(authorizeUrl({ launch }));
    expect(res.status).toBe(302);
    const loc = new URL(res.headers.get("location") ?? "");
    expect(`${loc.origin}${loc.pathname}`).toBe(REDIRECT_URI);
    expect(loc.searchParams.get("code")).toBeTruthy();
    expect(loc.searchParams.get("state")).toBe("xyz");
  });

  test("launch token is single-use: replay of the same token → 400", async () => {
    const launch = smartAuth.createLaunchContext(PATIENT_ID);
    const first = await app.request(authorizeUrl({ launch }));
    expect(first.status).toBe(302);
    const second = await app.request(authorizeUrl({ launch }));
    expect(second.status).toBe(400);
    const body = (await second.json()) as { detail: string };
    expect(body.detail).toContain("launch context");
  });

  test("resolveLaunchContext consumes the token on first resolve", () => {
    const token = smartAuth.createLaunchContext(PATIENT_ID);
    expect(smartAuth.resolveLaunchContext(token)).toBe(PATIENT_ID);
    expect(smartAuth.resolveLaunchContext(token)).toBeNull();
  });

  test("missing aud → 400 invalid_request", async () => {
    const launch = smartAuth.createLaunchContext(PATIENT_ID);
    const res = await app.request(authorizeUrl({ launch, aud: null }));
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string; detail: string };
    expect(body.error).toBe("invalid_request");
    expect(body.detail).toContain("aud is required");
  });

  test("wrong aud → 400", async () => {
    const launch = smartAuth.createLaunchContext(PATIENT_ID);
    const res = await app.request(authorizeUrl({ launch, aud: "https://evil.example/fhir" }));
    expect(res.status).toBe(400);
  });

  test("code_challenge_method=plain → 400 invalid_request (S256 only)", async () => {
    const launch = smartAuth.createLaunchContext(PATIENT_ID);
    const res = await app.request(
      authorizeUrl({
        launch,
        code_challenge: "plain-verifier-value",
        code_challenge_method: "plain",
      }),
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string; detail: string };
    expect(body.error).toBe("invalid_request");
    expect(body.detail).toContain("S256");
  });

  test("missing code_challenge_method → 400 (RFC default 'plain' is rejected too)", async () => {
    const launch = smartAuth.createLaunchContext(PATIENT_ID);
    const res = await app.request(authorizeUrl({ launch, code_challenge_method: null }));
    expect(res.status).toBe(400);
  });

  test("response_type=token → error redirect with unsupported_response_type", async () => {
    const launch = smartAuth.createLaunchContext(PATIENT_ID);
    const res = await app.request(authorizeUrl({ launch, response_type: "token" }));
    expect(res.status).toBe(302);
    const loc = new URL(res.headers.get("location") ?? "");
    expect(`${loc.origin}${loc.pathname}`).toBe(REDIRECT_URI);
    expect(loc.searchParams.get("error")).toBe("unsupported_response_type");
    expect(loc.searchParams.get("state")).toBe("xyz");
    expect(loc.searchParams.get("code")).toBeNull();
  });

  test("missing response_type → error redirect (response_type is REQUIRED)", async () => {
    const launch = smartAuth.createLaunchContext(PATIENT_ID);
    const res = await app.request(authorizeUrl({ launch, response_type: null }));
    expect(res.status).toBe(302);
    const loc = new URL(res.headers.get("location") ?? "");
    expect(loc.searchParams.get("error")).toBe("unsupported_response_type");
  });

  test("bad response_type + unregistered redirect_uri → direct 400, never a redirect", async () => {
    const res = await app.request(
      authorizeUrl({ response_type: "token", redirect_uri: "https://evil.example/cb" }),
    );
    expect(res.status).toBe(400);
  });

  test("P2-3: keyless + no launch + no opt-in → 400, no patient auto-picked", async () => {
    const res = await app.request(authorizeUrl());
    expect(res.status).toBe(400);
    const body = (await res.json()) as { detail: string };
    expect(body.detail).toContain("Standalone launch is disabled");
  });

  test("P2-3: keyless + SMART_DEV_AUTOSELECT_PATIENT=1 → dev fallback issues a code", async () => {
    process.env.SMART_DEV_AUTOSELECT_PATIENT = "1";
    const res = await app.request(authorizeUrl());
    expect(res.status).toBe(302);
    const loc = new URL(res.headers.get("location") ?? "");
    expect(loc.searchParams.get("code")).toBeTruthy();
  });

  test("P2-3: keyed mode ignores SMART_DEV_AUTOSELECT_PATIENT", async () => {
    settings.SYNC_API_KEY = "some-key";
    process.env.SMART_DEV_AUTOSELECT_PATIENT = "1";
    const res = await app.request(authorizeUrl());
    expect(res.status).toBe(400);
  });
});

describe("discovery document trimmed to implemented features (P3)", () => {
  const PATHS = ["/smart/.well-known/smart-configuration", "/fhir/.well-known/smart-configuration"];

  test("no sso-openid-connect capability, no openid/refresh scopes — on BOTH paths", async () => {
    for (const path of PATHS) {
      const res = await app.request(path);
      expect(res.status, path).toBe(200);
      const doc = (await res.json()) as {
        capabilities: string[];
        scopes_supported: string[];
        response_types_supported: string[];
        code_challenge_methods_supported: string[];
      };
      expect(doc.capabilities, path).not.toContain("sso-openid-connect");
      for (const scope of ["openid", "fhirUser", "online_access", "offline_access"]) {
        expect(doc.scopes_supported, `${path} scope=${scope}`).not.toContain(scope);
      }
      expect(doc.scopes_supported, path).toEqual(["launch", "launch/patient", "patient/*.read"]);
      expect(doc.response_types_supported, path).toEqual(["code"]);
      expect(doc.code_challenge_methods_supported, path).toEqual(["S256"]);
    }
  });

  test("both paths serve byte-identical JSON", async () => {
    const [a, b] = await Promise.all(PATHS.map((p) => app.request(p)));
    expect(await a!.text()).toBe(await b!.text());
  });
});
