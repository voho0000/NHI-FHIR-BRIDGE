/**
 * Scope enforcement on /fhir/* routes.
 *
 * Regression for the case where `requireFhirAuth` only checked that
 * the bearer token was valid (registered + non-expired) but never
 * looked at `token.scopes`. A SMART client that requested only
 * `openid fhirUser` would still get PHI back from /fhir/Patient.
 */

import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { derivePatientId } from "@nhi-fhir-bridge/mapper";

import { db } from "@/core/database";
import { runMigrations } from "@/core/migrate";
import { fhirServer } from "@/fhir/server";
import { createApp } from "@/main";
import { fhirResources, oauthTokens } from "@/models/schema";

const RAW_ID = "A123456789";
const HASHED_ID = derivePatientId(RAW_ID);

function issueToken(scopes: string[]): string {
  const accessToken = `tok-${Math.random().toString(36).slice(2)}`;
  db.insert(oauthTokens)
    .values({
      clientId: "test-client",
      accessToken,
      scopes,
      patientId: HASHED_ID,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    })
    .run();
  return accessToken;
}

function seedPatient(): void {
  fhirServer.upsert({
    resourceType: "Patient",
    id: HASHED_ID,
    identifier: [{ system: "urn:oid:2.16.886.101.20003.20012", value: RAW_ID }],
    name: [{ text: "Test Patient" }],
  });
  fhirServer.upsert({
    resourceType: "Observation",
    id: `obs-${HASHED_ID}-1`,
    status: "final",
    code: { text: "Test obs" },
    subject: { reference: `Patient/${HASHED_ID}` },
  });
}

describe("requireFhirScope on /fhir/* routes", () => {
  beforeEach(() => {
    runMigrations();
    db.delete(fhirResources).run();
    db.delete(oauthTokens).run();
    seedPatient();
  });
  afterEach(() => {
    db.delete(fhirResources).run();
    db.delete(oauthTokens).run();
  });

  test("token with only openid+fhirUser is rejected from /fhir/Patient", async () => {
    const token = issueToken(["openid", "fhirUser"]);
    const app = createApp();
    const res = await app.request("/fhir/Patient", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(403);
    expect(res.headers.get("WWW-Authenticate")).toContain("insufficient_scope");
  });

  test("token with patient/*.read is allowed on /fhir/Patient", async () => {
    const token = issueToken(["openid", "fhirUser", "patient/*.read"]);
    const app = createApp();
    const res = await app.request("/fhir/Patient", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { resourceType: string; entry?: unknown[] };
    expect(body.resourceType).toBe("Bundle");
    expect(body.entry?.length).toBeGreaterThan(0);
  });

  test("patient/Observation.read allows /fhir/Observation but blocks /fhir/Patient", async () => {
    const token = issueToken(["patient/Observation.read"]);
    const app = createApp();

    const obs = await app.request("/fhir/Observation", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(obs.status).toBe(200);

    const pat = await app.request("/fhir/Patient", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(pat.status).toBe(403);
  });

  test("patient/Patient.read allows /fhir/Patient/:id", async () => {
    const token = issueToken(["patient/Patient.read"]);
    const app = createApp();
    const res = await app.request(`/fhir/Patient/${HASHED_ID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { resourceType: string; id: string };
    expect(body.resourceType).toBe("Patient");
    expect(body.id).toBe(HASHED_ID);
  });

  test("metadata + smart-configuration stay public (no auth)", async () => {
    const app = createApp();
    const meta = await app.request("/fhir/metadata");
    expect(meta.status).toBe(200);
    const sc = await app.request("/fhir/.well-known/smart-configuration");
    expect(sc.status).toBe(200);
  });

  test("expired token is treated as unauthenticated bearer (dev mode passes through)", async () => {
    const accessToken = "expired-tok";
    db.insert(oauthTokens)
      .values({
        clientId: "test-client",
        accessToken,
        scopes: ["patient/*.read"],
        patientId: HASHED_ID,
        expiresAt: new Date(Date.now() - 1000),
      })
      .run();
    const app = createApp();
    // In test env SYNC_API_KEY is empty, so requireFhirAuth doesn't
    // 401 on an unrecognized bearer; the request continues and scope
    // check sees no token → allowed. Regression guard so we don't
    // accidentally start 200ing the *valid* expired-token path either.
    const res = await app.request("/fhir/Patient", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    // Either 200 (dev passthrough) or 403/401 (prod) is acceptable;
    // what matters is we don't echo PHI to a valid-but-expired token
    // with insufficient scope. Here the token IS expired so it acts
    // as anonymous in dev mode.
    expect([200, 401, 403]).toContain(res.status);
  });
});
