/**
 * Cross-mapper helpers shared by several FHIR resource mappers.
 */

import { createHash } from "node:crypto";

/**
 * Deterministic 32-char hex ID derived from the patient ID + arbitrary
 * key parts. Same SHA-1 + truncate-32 algorithm as the Python mappers
 * so re-syncs upsert the same resource instead of creating duplicates.
 */
export function stableId(patientId: string, ...parts: string[]): string {
  const key = [patientId, ...parts].join("|");
  return createHash("sha1").update(key).digest("hex").slice(0, 32);
}
