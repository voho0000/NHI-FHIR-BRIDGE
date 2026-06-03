/**
 * `@nhi-fhir-bridge/mapper` — pure NHI → FHIR R4 mapping logic.
 *
 * Used by both the Node backend (`backend-ts`) and the Chrome extension's
 * local-only mode. Zero runtime deps beyond `js-sha1` for stable IDs.
 *
 * Naming: snake_case keys come straight off the extension adapters
 * (NHI JSON shape); the FHIR output is camelCase per the spec.
 */

export * from "./allergy";
export * from "./careplan";
export * from "./condition";
export * from "./diagnostic-report";
export * from "./dispatch";
export * from "./encounter";
export * from "./helpers";
// v0.12.0: export LOINC tables so CI invariant tests can walk them.
export {
  NHI_TO_LOINC,
  PANEL_LOINC_MAP,
  LOINC_MAP,
  LOINC_DISPLAY,
  LOINC_SHORT_TEXT,
  NHI_CODE_PANEL_NAME,
  DISPLAY_FIRST_CODES,
} from "./loinc-tables";
export * from "./immunization";
export * from "./link";
export * from "./medication";
export * from "./observation";
export * from "./parsers";
export * from "./patient";
export * from "./procedure";
export * from "./systems";
export * as systems from "./systems";
