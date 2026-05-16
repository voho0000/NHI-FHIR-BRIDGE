/**
 * Patient mapper.
 *
 * Port of `backend/app/mapper/patient.py`. Same public API:
 *   - looksLikeTwNationalId(value) — exposed for tests
 *   - mapPatient(raw) — main entry
 */

import * as systems from "@/fhir/systems";

// Taiwan national ID: 1 letter + 9 digits (A123456789). Used to decide
// whether the popup-supplied patient_id should be coded under the
// canonical national-id system or as a local hospital MRN.
const TW_NATIONAL_ID_RE = /^[A-Z][12]\d{8}$/;

export function looksLikeTwNationalId(value: string | null | undefined): boolean {
  if (!value) return false;
  return TW_NATIONAL_ID_RE.test(value.trim().toUpperCase());
}

export function mapPatient(raw: Record<string, any>): Record<string, any> {
  const patientId = String(raw.identifier ?? raw.id ?? "unknown");

  // Use `??` (not just default arg) so explicit null from the LLM also
  // falls back. Local models sometimes emit null instead of omitting.
  const nameText = (raw.name ?? null) || "Unknown";
  const phone = (raw.phone ?? null) || "";
  const address = (raw.address ?? null) || "";

  const [family, given] = splitName(nameText);
  const nameEntry: Record<string, any> = { use: "official", text: nameText };
  if (family) nameEntry.family = family;
  if (given.length > 0) nameEntry.given = given;

  const resource: Record<string, any> = {
    resourceType: "Patient",
    id: patientId,
    meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
    identifier: [
      {
        use: "official",
        system: looksLikeTwNationalId(patientId)
          ? systems.TW_NATIONAL_ID
          : systems.HIS_LOCAL_PATIENT_MRN,
        value: patientId,
      },
    ],
    name: [nameEntry],
    gender: mapGender(raw.gender),
  };

  const birthDate = raw.birthDate;
  if (birthDate) resource.birthDate = birthDate;

  if (phone) {
    resource.telecom = [{ system: "phone", use: "home", value: phone }];
  }

  if (address) {
    resource.address = [{ use: "home", text: address }];
  }

  return resource;
}

/**
 * Split a full name into [family, [given]] for FHIR Patient.name.
 *
 * Heuristics:
 *   - Contains whitespace → Western: last token = family, rest = given.
 *   - CJK / single-token → first char = family, remainder = given.
 *   - "Unknown" or empty → ["", []]
 *
 * Two-char CJK family names (歐陽, 司馬, …) are NOT auto-detected.
 */
function splitName(fullName: string): [string, string[]] {
  const name = (fullName ?? "").trim();
  if (!name || name === "Unknown") return ["", []];
  if (/\s/.test(name)) {
    const parts = name.split(/\s+/);
    return [parts[parts.length - 1]!, parts.slice(0, -1)];
  }
  // CJK fallback — iterate codepoints, not UTF-16 code units, so
  // surrogate-pair characters (rare in Chinese names but possible)
  // don't get split mid-character.
  const codepoints = Array.from(name);
  return codepoints.length > 1
    ? [codepoints[0]!, [codepoints.slice(1).join("")]]
    : [name, []];
}

function mapGender(gender: unknown): string {
  const g = typeof gender === "string" ? gender.toLowerCase() : "";
  if (["male", "m", "男", "男性"].includes(g)) return "male";
  if (["female", "f", "女", "女性"].includes(g)) return "female";
  return "unknown";
}
