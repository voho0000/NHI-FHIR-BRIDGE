/**
 * Tombstone semantics — sync N+1 of the same page_type for the same
 * patient should drop resources from sync N that didn't reappear.
 */

import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { db } from "@/core/database";
import { runMigrations } from "@/core/migrate";
import {
  FHIRServer,
  SYNC_PAGE_TYPE_TAG_SYSTEM,
  SYNC_RUN_TAG_SYSTEM,
  tagSyncMetadata,
} from "@/fhir/server";
import { fhirResources } from "@/models/schema";

const PID = "test-patient-abcdef";

function makeObservation(id: string): Record<string, any> {
  return {
    resourceType: "Observation",
    id,
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1234-5" }] },
    subject: { reference: `Patient/${PID}` },
    effectiveDateTime: "2026-01-01",
  };
}

describe("tagSyncMetadata", () => {
  test("adds both page_type + run tags", () => {
    const r = makeObservation("a");
    tagSyncMetadata([r], "labs", "run-1");
    expect(r.meta.tag).toContainEqual({
      system: SYNC_PAGE_TYPE_TAG_SYSTEM,
      code: "labs",
    });
    expect(r.meta.tag).toContainEqual({
      system: SYNC_RUN_TAG_SYSTEM,
      code: "run-1",
    });
  });

  test("replaces prior sync tags on re-tag (no accumulation)", () => {
    const r = makeObservation("a");
    tagSyncMetadata([r], "labs", "run-1");
    tagSyncMetadata([r], "labs", "run-2");
    const runTags = r.meta.tag.filter((t: any) => t.system === SYNC_RUN_TAG_SYSTEM);
    expect(runTags).toHaveLength(1);
    expect(runTags[0].code).toBe("run-2");
  });

  test("preserves unrelated existing tags", () => {
    const r = makeObservation("a");
    r.meta = { tag: [{ system: "http://example.com/other", code: "x" }] };
    tagSyncMetadata([r], "labs", "run-1");
    expect(r.meta.tag).toContainEqual({
      system: "http://example.com/other",
      code: "x",
    });
  });
});

describe("tombstoneStale", () => {
  let server: FHIRServer;

  beforeEach(() => {
    runMigrations();
    db.delete(fhirResources).run();
    server = new FHIRServer();
  });

  afterEach(() => {
    db.delete(fhirResources).run();
  });

  test("deletes resources from old runs of the same page_type", () => {
    const oldObs = [makeObservation("old-1"), makeObservation("old-2")];
    tagSyncMetadata(oldObs, "labs", "run-old");
    for (const r of oldObs) server.upsert(r);

    const newObs = [makeObservation("new-1")];
    tagSyncMetadata(newObs, "labs", "run-new");
    for (const r of newObs) server.upsert(r);

    const deleted = server.tombstoneStale({
      patientId: PID,
      pageType: "labs",
      currentRunId: "run-new",
      resourceTypes: ["Observation"],
    });

    expect(deleted).toBe(2);
    expect(server.read("Observation", "old-1")).toBeNull();
    expect(server.read("Observation", "old-2")).toBeNull();
    expect(server.read("Observation", "new-1")).not.toBeNull();
  });

  test("does NOT touch resources from a different page_type", () => {
    const labsObs = [makeObservation("labs-1")];
    tagSyncMetadata(labsObs, "labs", "run-A");
    for (const r of labsObs) server.upsert(r);

    const screeningObs = [makeObservation("scr-1")];
    tagSyncMetadata(screeningObs, "screening_adult", "run-B");
    for (const r of screeningObs) server.upsert(r);

    // Tombstoning labs run-A against a new labs run-C must NOT delete
    // the screening resource even though it's the same resourceType.
    const newLabs = [makeObservation("labs-2")];
    tagSyncMetadata(newLabs, "labs", "run-C");
    for (const r of newLabs) server.upsert(r);

    server.tombstoneStale({
      patientId: PID,
      pageType: "labs",
      currentRunId: "run-C",
      resourceTypes: ["Observation"],
    });

    expect(server.read("Observation", "scr-1")).not.toBeNull();
    expect(server.read("Observation", "labs-1")).toBeNull();
    expect(server.read("Observation", "labs-2")).not.toBeNull();
  });

  test("does NOT touch other patients", () => {
    const other = makeObservation("other-1");
    other.subject = { reference: "Patient/different-patient-id" };
    tagSyncMetadata([other], "labs", "run-X");
    server.upsert(other);

    const mine = makeObservation("mine");
    tagSyncMetadata([mine], "labs", "run-Y");
    server.upsert(mine);

    server.tombstoneStale({
      patientId: PID,
      pageType: "labs",
      currentRunId: "run-Y",
      resourceTypes: ["Observation"],
    });

    expect(server.read("Observation", "other-1")).not.toBeNull();
    expect(server.read("Observation", "mine")).not.toBeNull();
  });

  test("returns 0 and deletes nothing when there's no prior data", () => {
    const deleted = server.tombstoneStale({
      patientId: PID,
      pageType: "labs",
      currentRunId: "run-only",
      resourceTypes: ["Observation"],
    });
    expect(deleted).toBe(0);
  });
});
