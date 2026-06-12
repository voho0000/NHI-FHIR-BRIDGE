/**
 * /fhir/import validation (audit 2026-06-12 P3).
 *
 * The importer used to upsert ANY JSON object carrying resourceType+id:
 * unknown resource types became write-only rows no route serves, and
 * spec-violating ids broke /<type>/<id> reads + fullUrl construction.
 * Now: id must match FHIR R4 Resource.id ([A-Za-z0-9\-\.]{1,64}) and
 * resourceType must be one this server actually serves — violations are
 * a 400 naming the offending entry index, with NOTHING imported.
 */

import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { db } from "@/core/database";
import { runMigrations } from "@/core/migrate";
import { fhirServer } from "@/fhir/server";
import { createApp } from "@/main";
import { fhirResources } from "@/models/schema";

runMigrations();
const app = createApp();

async function importRequest(body: unknown): Promise<Response> {
  return app.request("/fhir/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function bundleOf(...resources: Record<string, unknown>[]): Record<string, unknown> {
  return {
    resourceType: "Bundle",
    type: "collection",
    entry: resources.map((r) => ({ resource: r })),
  };
}

const VALID_PATIENT = { resourceType: "Patient", id: "import-test-p1" };
const VALID_OBS = {
  resourceType: "Observation",
  id: "import-test-obs.1-A",
  status: "final",
  code: { text: "Test obs" },
  subject: { reference: "Patient/import-test-p1" },
};

describe("/fhir/import validation", () => {
  beforeEach(() => {
    db.delete(fhirResources).run();
  });
  afterEach(() => {
    db.delete(fhirResources).run();
  });

  test("valid bundle imports (ids with '-' and '.' are spec-legal)", async () => {
    const res = await importRequest(bundleOf(VALID_PATIENT, VALID_OBS));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { imported: number; skipped: number; total: number };
    expect(body).toEqual({ imported: 2, skipped: 0, total: 2 });
    expect(fhirServer.read("Patient", "import-test-p1")).not.toBeNull();
    expect(fhirServer.read("Observation", "import-test-obs.1-A")).not.toBeNull();
  });

  test("id with illegal characters → 400 naming the entry index, nothing imported", async () => {
    const res = await importRequest(
      bundleOf(VALID_PATIENT, { ...VALID_OBS, id: "bad id/with#chars" }),
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as { detail: string };
    expect(body.detail).toContain("Entry 1");
    expect(body.detail).toContain("Resource.id");
    // Pre-validation means the valid entry 0 was NOT partially imported.
    expect(fhirServer.read("Patient", "import-test-p1")).toBeNull();
  });

  test("id longer than 64 chars → 400", async () => {
    const res = await importRequest(bundleOf({ resourceType: "Patient", id: "a".repeat(65) }));
    expect(res.status).toBe(400);
    const body = (await res.json()) as { detail: string };
    expect(body.detail).toContain("Entry 0");
  });

  test("non-string id → 400", async () => {
    const res = await importRequest(bundleOf({ resourceType: "Patient", id: 12345 }));
    expect(res.status).toBe(400);
    const body = (await res.json()) as { detail: string };
    expect(body.detail).toContain("Entry 0");
  });

  test("unknown resourceType → 400 naming the type and entry index", async () => {
    const res = await importRequest(
      bundleOf(VALID_PATIENT, { resourceType: "EvilType", id: "x1" }),
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as { detail: string };
    expect(body.detail).toContain("Entry 1");
    expect(body.detail).toContain("EvilType");
    expect(fhirServer.read("Patient", "import-test-p1")).toBeNull();
  });

  test("every served resource type is importable", async () => {
    const types = [
      "Patient",
      "Observation",
      "MedicationRequest",
      "Condition",
      "AllergyIntolerance",
      "DiagnosticReport",
      "Procedure",
      "Encounter",
      "DocumentReference",
      "Immunization",
      "CarePlan",
      "Goal",
      "FamilyMemberHistory",
      "Composition",
      "ServiceRequest",
      "ImagingStudy",
    ];
    const res = await importRequest(
      bundleOf(...types.map((t, i) => ({ resourceType: t, id: `import-type-check-${i}` }))),
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { imported: number };
    expect(body.imported).toBe(types.length);
  });

  test("entries missing resourceType/id keep the historical 'skipped' semantics", async () => {
    const res = await importRequest(bundleOf(VALID_PATIENT, { resourceType: "Observation" }));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { imported: number; skipped: number };
    expect(body.imported).toBe(1);
    expect(body.skipped).toBe(1);
  });

  test("raw array body is validated the same way", async () => {
    const res = await importRequest([VALID_PATIENT, { resourceType: "Basic", id: "b1" }]);
    expect(res.status).toBe(400);
    const body = (await res.json()) as { detail: string };
    expect(body.detail).toContain("Entry 1");
    expect(body.detail).toContain("Basic");
  });
});
