// Local-mode bundle assembly + stash. Runs the same mappers the backend
// runs over the per-page_type items, dedups + links the resulting
// resources, wraps them in a FHIR collection Bundle, and stashes it in
// chrome.storage.local for the popup's download button.

import {
  GROUP_HANDLERS,
  LIST_HANDLERS,
  dedupProcedures,
  linkEncountersInResources,
  maskId,
  repairDocumentReferenceEncounters,
  resolveSexStratifiedRanges,
} from "@nhi-fhir-bridge/mapper";
import { LOCAL_PAGE_TYPE_ORDER, PENDING_BUNDLE_JSON_KEY, PENDING_BUNDLE_KEY } from "./constants.js";
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

  // Drop an inpatient-detail surgery (PCS-only Procedure) when the richer 手術-
  // list row already covers the same (PCS, hospital, date). Runs before linking
  // so the dropped resource isn't linked.
  const resources = dedupProcedures(unique);

  // Linker + sex-stratified resolver run once over the full assembled
  // list (same pipeline backend's /sync/upload-structured runs, just
  // against an in-memory candidate array instead of a SQLite query).
  linkEncountersInResources(resources, resources);
  repairDocumentReferenceEncounters(resources, resources);
  resolveSexStratifiedRanges(patient, resources);

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
    entry: resources.map((r) => ({
      fullUrl: `${r.resourceType}/${r.id}`,
      resource: r,
    })),
  };
}

// Local mode stashes the assembled Bundle in chrome.storage.local
// under a single "pendingFhirBundle" slot. The popup shows a download
// button when this slot is non-empty; the actual chrome.downloads.download
// call happens from the popup (in response to a user click) so:
//   - The file doesn't appear in the Downloads bar uninvited.
//   - The popup click satisfies Chrome's user-gesture requirement
//     for saveAs:true dialogs (background SW calls don't qualify;
//     v0.14 tried offscreen workarounds but they fail silently for
//     >10 MB bundles via chrome.runtime.sendMessage size limits).
//
// Why local (was session pre-v0.14) — chrome.storage.session has a
// hard 10 MB quota that MV3 does NOT allow extensions to raise. v0.14
// "抓影像" opt-in inlines base64 JPGs into the bundle (each ~2-3 MB);
// even modest imaging sets blow past 10 MB and the stash silently
// fails with "Session storage quota bytes exceeded". chrome.storage
// .local + "unlimitedStorage" permission removes the ceiling entirely.
//
// Security trade-off (was audit #5: session = wipe-on-close): bundles
// now survive browser restarts, EXACTLY THE SAME WAY the downloaded
// .json file on the user's disk does. The bundle is also wiped when:
//   - The user clicks the download button (downloadPendingBundle).
//   - The user clicks the clear button (clearPendingBundle).
//   - The TTL sweep fires (chrome.alarms / PENDING_BUNDLE_TTL_MS) —
//     usually within ~1 hour of an unconsumed sync.
//   - A new sync overwrites the previous slot.
// Net PHI window is bounded by whichever comes first; the disk-vs-
// session distinction matters less when the user is downloading the
// file to disk anyway.
export async function stashFhirBundle(
  bundle,
  patientId,
  dateRange,
  // v0.15.1+: opt-in suffix so the file's name signals whether the
  // bundle includes JPG attachments. The two filename shapes diverge
  // dramatically in size (with-img: 30-70 MB, without: <5 MB), and
  // a SMART app dev or IRB reviewer can't tell from filename alone
  // whether `presentedForm` arrays should be expected. Caller (orches-
  // trator) passes through `fetchImagingEnabled` from the popup toggle.
  fetchImagingEnabled = false,
) {
  // Filename: nhi-{pid}-{startYYYYMMDD}-{endYYYYMMDD}-v{version}[-img].json
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
  // "-img" suffix when the user opted into JPG fetching. Without
  // the toggle, the bundle has only narrative DRs (no presentedForm
  // attachments). Helpful for the user differentiating successive
  // downloads on disk, and for app devs / IRB reviewers to spot at
  // a glance whether the file will be ~50× heavier than usual.
  const imgSuffix = fetchImagingEnabled ? "-img" : "";
  const filename = `nhi-${safePid}-${s}-${e}-v${version}${imgSuffix}.json`;
  const json = JSON.stringify(bundle, null, 2);
  const bytes = json.length;

  // Stash JSON + metadata to chrome.storage.local. unlimitedStorage
  // manifest permission lifts the per-extension quota so imaging
  // bundles (80+ MB) fit comfortably. The popup's "下載健康紀錄檔"
  // button reads PENDING_BUNDLE_JSON_KEY, creates a Blob URL, and
  // triggers chrome.downloads.download with saveAs:true — the popup
  // click is the user gesture Chrome requires for the Save As dialog.
  // The SW does NOT auto-download (the offscreen workaround we tried
  // in an earlier v0.14 iteration was unreliable for >10 MB bundles).
  //
  // v0.16.1: split into TWO storage records to keep popup boot fast:
  //   PENDING_BUNDLE_KEY      — metadata only (~200 B), read on every
  //                             popup open + chrome.storage.onChanged
  //   PENDING_BUNDLE_JSON_KEY — the 80+ MB JSON string, read ONLY
  //                             when user clicks download
  // Before the split, refreshPendingBundle pulled the full record
  // every popup open, blocking the wizard's data-active-step
  // assignment by 2-3 sec on big bundles and visually overlapping
  // step 2 + step 3 (user-reported FOUC). hasJson: true lets the
  // metadata-only path know to surface the download button.
  // entryCount lets the data-state card render "✓ N 筆 · 5 分鐘前產生"
  // without re-parsing the 80+ MB JSON every popup-open (v0.16.1).
  const entryCount = Array.isArray(bundle?.entry) ? bundle.entry.length : 0;
  await chrome.storage.local.set({
    [PENDING_BUNDLE_KEY]: {
      filename,
      bytes,
      generatedAt: Date.now(),
      patientId: patientId || null,
      hasJson: true,
      entryCount,
    },
    [PENDING_BUNDLE_JSON_KEY]: { json },
  });
  return { filename, bytes };
}

// Note: hotPatchPendingBundle removed v0.15 (post-bg-poll architecture).
// The chrome.alarms-driven background polling that auto-patched the
// stashed bundle was removed — replaced by a user-driven "press sync
// again in 5–10 min" prompt. The nhi-imaging-row meta.tag is still
// emitted by the mapper (in case we re-introduce auto-patch later)
// but nothing in the bridge currently consumes it.
