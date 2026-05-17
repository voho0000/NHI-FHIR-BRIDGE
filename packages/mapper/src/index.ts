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
export * from "./condition";
export * from "./diagnostic-report";
export * from "./dispatch";
export * from "./encounter";
export * from "./helpers";
export * from "./link";
export * from "./medication";
export * from "./observation";
export * from "./parsers";
export * from "./patient";
export * from "./procedure";
export * from "./systems";
export * as systems from "./systems";
