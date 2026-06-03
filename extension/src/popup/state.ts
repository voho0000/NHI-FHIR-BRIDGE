// Shared mutable popup state.
//
// ESM exports are read-only bindings, but the OBJECT they point at is
// mutable: every module that imports `state` reads/writes the same
// instance after esbuild bundles the popup into one IIFE. That's how
// the storage listeners, the stop button, the wizard, and the sync flow
// all observe one source of truth. Splitting any of these across two
// modules that each declared their own `let` would silently break —
// e.g. the connection banner and the CTA enable-state would diverge.
//
// (Mirrors the single-owner pattern of background/sync-state.js.)
//
// Fields:
//   connState        "unknown" | "checking" | "ok" | "fail"
//   connFailReason   { kind, detail? } | null
//   backendPatient   { state, count, lastUpdated }
//   localBundle      { exists, count, generatedAt, patientId }
//   activeStep       1..4 wizard step currently shown
//   wizardInitialized  true once _initWizard has run
//   step2Confirmed   user clicked ✓ 確定 with a valid override
//   latestStatus     last syncStatus snapshot (drives the live ticker)
//   nhiTabId         id of the active NHI tab, captured in init()
export const state = {
  connState: "unknown",
  connFailReason: null,
  backendPatient: { state: "unknown", count: 0, lastUpdated: null },
  localBundle: { exists: false, count: 0, generatedAt: 0, patientId: null },
  activeStep: 1,
  wizardInitialized: false,
  step2Confirmed: false,
  latestStatus: null,
  nhiTabId: null,
};
