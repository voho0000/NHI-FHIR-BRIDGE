/**
 * Minimal FHIR R4 CRUD layer backed by SQLite.
 *
 * Port of `backend/app/fhir/server.py`. Same API surface (upsert / read /
 * search / listAll) so callers translate one-to-one. Uses Drizzle for
 * persistence; query filtering is done in-process the same way Python did
 * (sufficient for SQLite-scale data, parity with the Python implementation).
 */

import { and, eq } from "drizzle-orm";

import { type DB, db as defaultDb } from "@/core/database";
import { fhirResources } from "@/models/schema";

type FhirJson = Record<string, any>;

/**
 * EXACT match Patient/<id> in resource.subject.reference OR
 * resource.patient.reference. Substring matching would let "A12345678"
 * match "Patient/A123456789" (Taiwan national IDs have no separator).
 */
function patientRefMatches(resource: FhirJson, patientId: string): boolean {
  const expected = `Patient/${patientId}`;
  for (const field of ["subject", "patient"] as const) {
    const ref = resource[field];
    if (
      ref &&
      typeof ref === "object" &&
      typeof ref.reference === "string" &&
      ref.reference === expected
    ) {
      return true;
    }
  }
  return false;
}

function resourceDate(r: FhirJson): string {
  for (const k of [
    "effectiveDateTime",
    "authoredOn",
    "performedDateTime",
    "recordedDate",
    "issued",
  ]) {
    const v = r[k];
    if (v) return String(v).slice(0, 10);
  }
  const period = r.effectivePeriod ?? r.performedPeriod ?? r.period;
  if (period && typeof period === "object" && period.start) {
    return String(period.start).slice(0, 10);
  }
  return "";
}

function dateCompare(rd: string, op: string, val: string): boolean {
  const v = val.slice(0, 10);
  if (!rd) return false;
  switch (op) {
    case "eq":
      return rd === v;
    case "ge":
      return rd >= v;
    case "le":
      return rd <= v;
    case "gt":
      return rd > v;
    case "lt":
      return rd < v;
    default:
      return true;
  }
}

function codesOf(r: FhirJson): Set<string> {
  const coding = r.code?.coding;
  if (!Array.isArray(coding)) return new Set();
  return new Set(coding.map((c: any) => c?.code).filter((c: any) => typeof c === "string"));
}

export interface FhirSearchParams {
  patient?: string;
  encounter?: string;
  date?: string;
  code?: string;
  [key: string]: string | undefined;
}

export class FHIRServer {
  /**
   * Upsert by (resourceType, fhir_id). Increments version_id on
   * existing rows and stamps the new version onto resource.meta.versionId.
   */
  upsert(resource: FhirJson, dbi: DB = defaultDb): FhirJson {
    const rtype: string = resource.resourceType;
    const fid: string = resource.id;
    const now = new Date();
    // Stamp meta.lastUpdated alongside versionId so clients (extension's
    // backend-state card, SMART apps, conditional reads) can tell when
    // a resource was last touched without reading our internal columns.
    // ISO 8601 with millisecond precision per FHIR R4 §2.21.0.4.
    const isoNow = now.toISOString();

    const existing = dbi
      .select()
      .from(fhirResources)
      .where(and(eq(fhirResources.resourceType, rtype), eq(fhirResources.fhirId, fid)))
      .get();

    if (existing) {
      const newVersion = String(Number.parseInt(existing.versionId, 10) + 1);
      resource.meta = resource.meta ?? {};
      resource.meta.versionId = newVersion;
      resource.meta.lastUpdated = isoNow;
      dbi
        .update(fhirResources)
        .set({
          versionId: newVersion,
          resource,
          updatedAt: now,
        })
        .where(eq(fhirResources.id, existing.id))
        .run();
    } else {
      resource.meta = resource.meta ?? {};
      resource.meta.versionId = "1";
      resource.meta.lastUpdated = isoNow;
      dbi
        .insert(fhirResources)
        .values({
          resourceType: rtype,
          fhirId: fid,
          versionId: "1",
          resource,
        })
        .run();
    }
    return resource;
  }

  read(resourceType: string, fhirId: string, dbi: DB = defaultDb): FhirJson | null {
    const row = dbi
      .select()
      .from(fhirResources)
      .where(and(eq(fhirResources.resourceType, resourceType), eq(fhirResources.fhirId, fhirId)))
      .get();
    return row ? row.resource : null;
  }

  search(resourceType: string, params: FhirSearchParams, dbi: DB = defaultDb): FhirJson[] {
    const rows = dbi
      .select()
      .from(fhirResources)
      .where(eq(fhirResources.resourceType, resourceType))
      .all();
    let resources: FhirJson[] = rows.map((r) => r.resource);

    if (params.patient) {
      const pid = params.patient.replace("Patient/", "");
      resources = resources.filter((r) => patientRefMatches(r, pid));
    }

    if (params.encounter) {
      const eidFull = params.encounter;
      const eidBare = eidFull.replace("Encounter/", "");
      const wanted = new Set([`Encounter/${eidBare}`, eidBare]);
      resources = resources.filter((r) => {
        const ref1 = r.encounter?.reference;
        const ref2 = r.context?.reference;
        return wanted.has(ref1 ?? "") || wanted.has(ref2 ?? "");
      });
    }

    if (params.date) {
      const raw = params.date;
      let op: string;
      let val: string;
      const prefixes = ["ge", "le", "gt", "lt", "eq"] as const;
      const found = prefixes.find((p) => raw.startsWith(p));
      if (found) {
        op = found;
        val = raw.slice(2);
      } else {
        op = "eq";
        val = raw;
      }
      resources = resources.filter((r) => dateCompare(resourceDate(r), op, val));
    }

    if (params.code) {
      const tok = params.code;
      const want = tok.includes("|") ? tok.split("|", 2)[1]! : tok;
      resources = resources.filter((r) => codesOf(r).has(want));
    }

    return resources;
  }

  listAll(resourceType: string, dbi: DB = defaultDb): FhirJson[] {
    const rows = dbi
      .select()
      .from(fhirResources)
      .where(eq(fhirResources.resourceType, resourceType))
      .all();
    return rows.map((r) => r.resource);
  }
}

export const fhirServer = new FHIRServer();

// Re-export the helper so tests can verify exact-match semantics.
export const _patientRefMatches = patientRefMatches;
