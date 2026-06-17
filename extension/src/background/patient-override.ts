// Patient-override helpers: date-range URL shaping, mask gate, the
// override→FHIR-Patient builder, and the deep name-scrub. Kept together
// because they all operate on the popup-supplied `patientOverride` object
// (id_no / name / birth_date / gender) and the mask-name preference.

import {
  deidBirthDate,
  mapPatient,
  maskId,
  maskName,
  redactDemographicsInText,
} from "@nhi-fhir-bridge/mapper";

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
    // De-identify defaults ON (privacy-first). An ABSENT key means the user
    // hasn't chosen → treat as ON; only an explicit `false` (user toggled it
    // off to keep a complete personal backup) disables it.
    return maskNameEnabled !== false;
  } catch {
    // Storage read failed — fail safe toward privacy (masked).
    return true;
  }
}

// De-identify the popup-supplied override object (id_no / name / birth_date)
// for the BACKEND-upload path. v0.18.3: the backend's own buildOverridePatient
// derives Patient.id (hash) + identifier.value + the subject-reference key all
// from id_no, so masking id_no here de-identifies the backend-created Patient
// while keeping its references internally consistent — same three fields as the
// local-bundle path. Caller gates on the mask toggle; this is a pure transform.
export function deidentifyOverride(ov) {
  return {
    ...ov,
    name: ov?.name ? maskName(ov.name) : ov?.name,
    id_no: ov?.id_no ? maskId(ov.id_no, "X") : ov?.id_no,
    birth_date: ov?.birth_date ? deidBirthDate(ov.birth_date) : ov?.birth_date,
  };
}

export function buildOverridePatient(ov, maskEnabled) {
  const displayName = maskEnabled ? maskName(ov.name || "") : ov.name || "";
  // De-identify at the INPUT, not by post-masking the resource (audit
  // P1-1, 2026-06-12). The previous version hashed the FULL national ID
  // into Patient.id even with the toggle on, reasoning the hash was
  // "non-reversible" — but derivePatientId is an UNSALTED SHA-1 over a
  // ~3×10⁸-value keyspace, brute-forceable in seconds, so the hash
  // quietly undid the identifier masking. Feeding the half-masked id in
  // here means Patient.id, identifier[].value AND every
  // subject.reference (assembleLocalBundle propagates patient.id to all
  // mappers) derive from the masked form: consistent within the bundle,
  // and recovering the hash input reveals nothing the bundle doesn't
  // already display. Trade-off: resource ids differ between toggle
  // states — that's the point; id stability across modes was the leak.
  // Same derivation as the backend path (deidentifyOverride masks id_no
  // pre-upload) and effectiveFhirPatientId in the mapper.
  const effectiveId = maskEnabled && ov.id_no ? maskId(ov.id_no, "X") : ov.id_no;
  const raw: any = {
    id: effectiveId,
    identifier: effectiveId,
    name: displayName || effectiveId,
  };
  if (ov.birth_date) raw.birthDate = ov.birth_date;
  if (ov.gender) raw.gender = ov.gender;
  const patient = mapPatient(raw);

  // birthDate is the one remaining cleartext PII field after the input
  // masking above (mapPatient keeps the masked-TWID identifier.system
  // as national-id so the field's TYPE stays self-describing). Name is
  // masked upstream via `displayName`. De-identify defaults ON now
  // (privacy-first, v0.20.16) — a user who wants a complete personal backup
  // with the real id_no (e.g. so a SMART app matches them by national ID)
  // toggles it off.
  if (maskEnabled && patient.birthDate) {
    patient.birthDate = deidBirthDate(patient.birthDate);
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

// Deep-walk a JSON-like value applying label-anchored demographic redaction
// (birth date → year-only, 病歷號碼 → redacted) to every string token. Runs
// alongside replaceNameDeep when de-identifying: that scrub matches the
// user-entered name / 身分證, this one keys off the FIELD LABEL so it still
// catches the REAL birth date + chart number baked into 出院病摘 HTML and
// 病理報告 narratives even when the override form's birth date was mistyped.
export function redactDemographicsDeep(value) {
  if (typeof value === "string") return redactDemographicsInText(value);
  if (Array.isArray(value)) return value.map((v) => redactDemographicsDeep(v));
  if (value && typeof value === "object") {
    const out = {};
    for (const k in value) out[k] = redactDemographicsDeep(value[k]);
    return out;
  }
  return value;
}
