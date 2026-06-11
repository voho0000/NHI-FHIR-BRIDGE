// Patient-override helpers: date-range URL shaping, mask gate, the
// override→FHIR-Patient builder, and the deep name-scrub. Kept together
// because they all operate on the popup-supplied `patientOverride` object
// (id_no / name / birth_date / gender) and the mask-name preference.

import { deidBirthDate, mapPatient, maskId, maskName } from "@nhi-fhir-bridge/mapper";

// Apply a {start, end} ISO date range to an endpoint path:
//   - If path already has s_date= placeholders, fill them in.
//   - Otherwise append s_date=...&e_date=... to the query string.
// Endpoints without `supportsDateRange` pass through unchanged.
export function applyDateRangeToPath(path, dateRange) {
  if (!dateRange || (!dateRange.start && !dateRange.end)) return path;
  // NHI expects 西元 ISO dates with dashes: 2023-01-01 (not 民國, not
  // slashes). Confirmed by observing the SPA's request when user picks
  // a custom date range. URL-encoding the dashes is unnecessary.
  const s = (dateRange.start || "").slice(0, 10);
  const e = (dateRange.end || "").slice(0, 10);
  let p = path;
  if (/[?&]s_date=/.test(p)) {
    p = p.replace(/([?&]s_date=)[^&]*/, `$1${s}`);
  } else {
    p += `${p.includes("?") ? "&" : "?"}s_date=${s}`;
  }
  if (/[?&]e_date=/.test(p)) {
    p = p.replace(/([?&]e_date=)[^&]*/, `$1${e}`);
  } else {
    p += `&e_date=${e}`;
  }
  return p;
}

// Read the mask-name preference fresh from storage. We don't cache —
// runNhiApiSync is invoked at most a few times per session and the SW
// can be torn down + restarted any time, so a single get() per sync is
// cheaper than syncing state across SW lifecycles.
export async function isMaskEnabled() {
  try {
    const { maskNameEnabled } = await chrome.storage.local.get("maskNameEnabled");
    return maskNameEnabled === true;
  } catch {
    return false;
  }
}

export function buildOverridePatient(ov, maskEnabled) {
  const displayName = maskEnabled ? maskName(ov.name || "") : ov.name || "";
  // Phase-1 migration: birthDate/gender added below.
  const raw: any = {
    id: ov.id_no,
    identifier: ov.id_no,
    name: displayName || ov.id_no,
  };
  if (ov.birth_date) raw.birthDate = ov.birth_date;
  if (ov.gender) raw.gender = ov.gender;
  const patient = mapPatient(raw);

  // De-identify the two remaining cleartext PII fields when the toggle is
  // on. We post-process the assembled resource (rather than masking the
  // raw input) deliberately:
  //   • Patient.id is a salted hash of the REAL id (derivePatientId) — it
  //     is non-reversible and already de-identified by design, and every
  //     subject.reference points at it. Leaving it untouched keeps all
  //     intra-bundle references consistent and stable whether the toggle
  //     is on or off.
  //   • Only identifier[].value (the real 身分證) and birthDate carry
  //     cleartext PII, so those are the only fields we redact here.
  // Name is already masked upstream via `displayName`. Default OFF: the
  // 民眾自用 workflow needs the real id_no so SMART apps can match the
  // patient — masking only matters when the bundle will be shared/demoed.
  if (maskEnabled) {
    const idVal = patient.identifier?.[0]?.value;
    if (idVal) patient.identifier[0].value = maskId(idVal, "X");
    if (patient.birthDate) patient.birthDate = deidBirthDate(patient.birthDate);
  }
  return patient;
}

// Walk a JSON-like value and replace every string token equal to or
// containing `needle` with `replacement`. Used to scrub the real
// patient name out of NHI narrative fields (clinical_note, conclusion,
// note, etc.) before the items reach the mapper. Only triggered when
// the user has opted into masking AND supplied a name — and the
// substitution is exact-token-replace, not fuzzy, so it can't surprise
// the user by clobbering unrelated content.
export function replaceNameDeep(value, needle, replacement) {
  if (!needle || needle === replacement) return value;
  if (typeof value === "string") return value.split(needle).join(replacement);
  if (Array.isArray(value)) return value.map((v) => replaceNameDeep(v, needle, replacement));
  if (value && typeof value === "object") {
    const out = {};
    for (const k in value) out[k] = replaceNameDeep(value[k], needle, replacement);
    return out;
  }
  return value;
}
