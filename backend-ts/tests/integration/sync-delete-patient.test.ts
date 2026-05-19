/**
 * DELETE /sync/patient/:patientId — verifies stop-sync cleanup wipes
 * both Patient and related per-patient resources regardless of whether
 * the caller passes the raw national ID or the hashed Patient.id.
 *
 * Regression for the bug where extension sent raw ID but backend only
 * matched on the hashed form, leaving partial data in the store after
 * a "Stop sync" click.
 */

import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { derivePatientId } from "@nhi-fhir-bridge/mapper";

import { db } from "@/core/database";
import { runMigrations } from "@/core/migrate";
import { fhirServer } from "@/fhir/server";
import { createApp } from "@/main";
import { fhirResources } from "@/models/schema";

const RAW_ID = "A123456789";
const HASHED_ID = derivePatientId(RAW_ID);

function seedPatientGraph(): void {
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
  fhirServer.upsert({
    resourceType: "Condition",
    id: `cond-${HASHED_ID}-1`,
    subject: { reference: `Patient/${HASHED_ID}` },
    code: { text: "Test cond" },
  });
}

function countAllForPatient(): number {
  return db
    .select()
    .from(fhirResources)
    .all()
    .filter((r) => {
      if (r.resourceType === "Patient" && r.fhirId === HASHED_ID) return true;
      const blob = JSON.stringify(r.resource);
      return blob.includes(`Patient/${HASHED_ID}`);
    }).length;
}

describe("DELETE /sync/patient/:patientId", () => {
  beforeEach(() => {
    runMigrations();
    db.delete(fhirResources).run();
  });
  afterEach(() => {
    db.delete(fhirResources).run();
  });

  test("accepts raw national ID and wipes Patient + per-patient resources", async () => {
    seedPatientGraph();
    expect(countAllForPatient()).toBe(3);

    const app = createApp();
    const res = await app.request(`/sync/patient/${encodeURIComponent(RAW_ID)}`, {
      method: "DELETE",
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { patient_id: string; deleted: number };
    expect(body.patient_id).toBe(RAW_ID);
    expect(body.deleted).toBe(3);
    expect(countAllForPatient()).toBe(0);
  });

  test("accepts hashed Patient.id and wipes the same graph", async () => {
    seedPatientGraph();
    expect(countAllForPatient()).toBe(3);

    const app = createApp();
    const res = await app.request(`/sync/patient/${encodeURIComponent(HASHED_ID)}`, {
      method: "DELETE",
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { deleted: number };
    expect(body.deleted).toBe(3);
    expect(countAllForPatient()).toBe(0);
  });

  test("does not touch resources for a different patient", async () => {
    seedPatientGraph();
    const otherHashed = derivePatientId("B223456789");
    fhirServer.upsert({
      resourceType: "Patient",
      id: otherHashed,
      identifier: [{ system: "urn:oid:2.16.886.101.20003.20012", value: "B223456789" }],
    });

    const app = createApp();
    const res = await app.request(`/sync/patient/${encodeURIComponent(RAW_ID)}`, {
      method: "DELETE",
    });
    expect(res.status).toBe(200);

    expect(fhirServer.read("Patient", otherHashed)).not.toBeNull();
    expect(countAllForPatient()).toBe(0);
  });
});
