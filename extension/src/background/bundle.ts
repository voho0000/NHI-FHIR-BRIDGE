// Local-mode bundle assembly + stash. Runs the same mappers the backend
// runs over the per-page_type items, dedups + links the resulting
// resources, wraps them in a FHIR collection Bundle, and stashes it in
// chrome.storage.session for the popup's download button.

import {
  GROUP_HANDLERS,
  LIST_HANDLERS,
  dedupAdmissionDayAmb,
  linkEncountersInResources,
  maskId,
  resolveSexStratifiedRanges,
} from "@nhi-fhir-bridge/mapper";
import { LOCAL_PAGE_TYPE_ORDER, PENDING_BUNDLE_KEY } from "./constants.js";
import { buildOverridePatient } from "./patient-override.js";

export function assembleLocalBundle(byType, patientOverride, maskEnabled) {
  const patient = buildOverridePatient(patientOverride, maskEnabled);
  const pid = patient.id;
  const all = [patient];

  for (const pt of LOCAL_PAGE_TYPE_ORDER) {
    const items = byType[pt];
    if (!items || items.length === 0) continue;
    let mapped: any;
    if (GROUP_HANDLERS[pt]) {
      mapped = GROUP_HANDLERS[pt](items, pid);
    } else if (LIST_HANDLERS[pt]) {
      const [fn] = LIST_HANDLERS[pt];
      mapped = items
        .filter((it) => it && typeof it === "object")
        .map((it) => fn(it, pid))
        .filter((r) => r !== null);
    } else {
      continue;
    }
    if (pt === "encounters") mapped = dedupAdmissionDayAmb(mapped);
    all.push(...mapped);
  }

  // Dedup by (resourceType, id) before assembling the Bundle. Multiple
  // NHI endpoints can feed the same page_type (e.g. encounters /
  // inpatient / inpatient_legacy all → page_type="encounters"), and the
  // mapper produces deterministic stable IDs — so two raw items that
  // describe the same medical event collapse to one resource. Backend
  // upsert handles this automatically (same stable ID = same DB row);
  // local mode has to do it explicitly. Without this dedup, the local
  // Bundle ends up inflated relative to what backend stores from the
  // identical NHI input.
  const seen = new Set();
  const unique = [];
  for (const r of all) {
    const key = `${r.resourceType}/${r.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(r);
  }

  // Linker + sex-stratified resolver run once over the full assembled
  // list (same pipeline backend's /sync/upload-structured runs, just
  // against an in-memory candidate array instead of a SQLite query).
  linkEncountersInResources(unique, unique);
  resolveSexStratifiedRanges(patient, unique);

  // Bundle.meta.tag carries bridge version + source identifier so SMART
  // app devs / IRB reviewers can identify the producing bridge even
  // after the file is renamed (the filename also has the version, but
  // file rename is common). Tag system uses a bridge-specific URI so it
  // can be queried without colliding with clinical tags.
  // Bug report 2026-05-27 Part 6 U4: bundle had no version marker → bug
  // reports couldn't pin down which bridge version produced the data.
  const bridgeVersion = chrome.runtime.getManifest()?.version || "unknown";
  return {
    resourceType: "Bundle",
    type: "collection",
    timestamp: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
    meta: {
      tag: [
        {
          system: "https://github.com/voho0000/NHI-FHIR-BRIDGE/bridge-version",
          code: bridgeVersion,
          display: `NHI-FHIR-Bridge v${bridgeVersion}`,
        },
      ],
    },
    entry: unique.map((r) => ({
      fullUrl: `${r.resourceType}/${r.id}`,
      resource: r,
    })),
  };
}

// Local mode stashes the assembled Bundle in chrome.storage.session
// under a single "pendingFhirBundle" slot. The popup shows a download
// button when this slot is non-empty; the actual chrome.downloads.download
// call happens from the popup (in response to a user click) so the file
// doesn't appear in the Downloads bar uninvited.
//
// Why session (not local) — security audit #5: PHI persisted in
// chrome.storage.local survives browser restarts indefinitely. The
// MV3-native chrome.storage.session is wiped automatically when the
// browser closes, drastically shrinking the disk-resident PHI window.
//
// Additionally:
//   - Single slot means a new sync overwrites the previous pending bundle.
//   - The popup's downloadPendingBundle wipes the slot the moment the
//     user-initiated download completes.
//   - A periodic chrome.alarms sweep (PENDING_BUNDLE_TTL_MS) wipes the
//     slot if the user leaves a sync sitting unconsumed for an hour.
// chrome.storage.session default quota is 10 MB; a typical NHI sync is
// well under 2 MB.
export async function stashFhirBundle(bundle, patientId, dateRange) {
  // Filename: nhi-{pid}-{startYYYYMMDD}-{endYYYYMMDD}.json
  // When no explicit dateRange (NHI default = 近 1 年), synthesize today-1y → today.
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const fmt = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  // Half-mask the ID in the filename so the user's Downloads folder
  // doesn't leak the full 身分證 (would be visible to anyone seeing
  // a file listing or download-bar preview). `X` because `*` is
  // invalid in Windows paths. Bundle CONTENTS still carry the real
  // ID under Patient.id — file owner knows whose data it is.
  const maskedPid = maskId(patientId || "unknown", "X");
  const safePid = maskedPid.replace(/[^A-Za-z0-9_-]/g, "_");
  const compact = (d) => (d || "").slice(0, 10).replace(/-/g, "");
  let s: string;
  let e: string;
  if (dateRange && (dateRange.start || dateRange.end)) {
    s = compact(dateRange.start) || fmt(now);
    e = compact(dateRange.end) || fmt(now);
  } else {
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    s = fmt(oneYearAgo);
    e = fmt(now);
  }
  // Bridge version embedded in the filename (v0.9.3+) so anyone
  // receiving the bundle file later — the user, a SMART app dev, an
  // IRB reviewer — can immediately see which bridge produced it.
  // Matters for contract evolution (e.g. v0.9.2 changed Encounter.type
  // shape) and bug triage. chrome.runtime.getManifest() reads from the
  // bundled manifest.json — guaranteed available in an MV3 SW.
  const version = chrome.runtime.getManifest()?.version || "unknown";
  const filename = `nhi-${safePid}-${s}-${e}-v${version}.json`;
  const json = JSON.stringify(bundle, null, 2);
  await chrome.storage.session.set({
    [PENDING_BUNDLE_KEY]: {
      filename,
      json,
      bytes: json.length,
      generatedAt: Date.now(),
      patientId: patientId || null,
    },
  });
  return { filename, bytes: json.length };
}
