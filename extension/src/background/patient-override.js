// Patient-override helpers: date-range URL shaping, mask gate, the
// override→FHIR-Patient builder, and the deep name-scrub. Kept together
// because they all operate on the popup-supplied `patientOverride` object
// (id_no / name / birth_date / gender) and the mask-name preference.

import { mapPatient, maskName } from "@nhi-fhir-bridge/mapper";

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
    p += (p.includes("?") ? "&" : "?") + `s_date=${s}`;
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
  const raw = {
    id: ov.id_no,
    identifier: ov.id_no,
    name: displayName || ov.id_no,
  };
  if (ov.birth_date) raw.birthDate = ov.birth_date;
  if (ov.gender) raw.gender = ov.gender;
  return mapPatient(raw);
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
