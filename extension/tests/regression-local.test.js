// Real-data regression loop.
//
// Runs the captured NHI 健康存摺 fixtures (fixtures/local/, gitignored — they
// contain real PHI) through the SHIPPED transform path and snapshots a digest
// of the resulting FHIR Bundle. On every later run it diffs against the golden
// so any drift in the mapper / adapters / orchestration glue shows up here.
//
// No drift by construction: this harness imports the SAME pure functions the
// Service Worker (sync-orchestrator.ts) calls — adaptSettledLists, the
// per-category detail adapters, and build-bundle's buildBundleFromRaw. The
// only thing it fakes is the impure I/O (live fetches → captured fixtures).
//
// PHI safety: the fixtures AND the golden digest live under fixtures/local/,
// which .gitignore excludes. This test FILE has no PHI and is committed; on a
// clone without the fixtures it auto-skips. Long strings (base64 JPEG frames,
// base64-encoded 出院病摘 HTML) are replaced by a sha256 digest in the golden,
// so the golden is small + readable yet still catches content changes.
//
//   First run / after a deliberate output change:  REGEN_GOLDEN=1 npx vitest run tests/regression-local.test.js
//   Normal run (diff against golden):              npx vitest run tests/regression-local.test.js

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, test } from "vitest";

import { buildBundleFromRaw } from "../src/background/build-bundle.ts";
import {
  adaptChronicMedicationResults,
  adaptImagingDetailResults,
  adaptMedicationResults,
  adaptProcedureResults,
  buildImagingReqs,
} from "../src/background/nhi-detail-fetchers.ts";
import { adaptSettledLists } from "../src/background/nhi-list-fetch.ts";
import { NHI_API_ENDPOINTS } from "../src/nhi-endpoints.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const LOCAL = resolve(HERE, "../../fixtures/local"); // repo-root, gitignored
const PATIENTS = resolve(LOCAL, "patients");
const GOLDEN_DIR = resolve(LOCAL, "golden");

// Synthetic, fixed override — keeps the Patient resource + subject references
// stable and PHI-free. Mask defaults ON, so real names/IDs never reach the
// bundle anyway; this is what the de-identified Patient is built from.
const PATIENT_OVERRIDE = {
  name: "王小明",
  id_no: "A123456789",
  birth_date: "1950-01-01",
  sex: "M",
};

const ridOf = (v) => v.roW_ID || v.row_ID || v.row_id || v.rowid || v.rowID || "";

// Map<visitIdx, detailBody|null> keyed by each rawList row's position — mirrors
// fetchEncounterDetails / fetchInpatientDetails' byVisitIndex output, sourced
// from the fixture's row_ID-keyed detail map.
function detailMapByIndex(rawList, detailObj) {
  const m = new Map();
  for (let i = 0; i < rawList.length; i++) {
    const id = ridOf(rawList[i]);
    m.set(i, (id && detailObj?.[id]) || null);
  }
  return m;
}

// Wrap a row_ID-keyed detail body as the { body } | { error } result shape the
// pure adapters expect (parallel to the fetchers' fetchDetailsInTab output).
function resultsFor(rawList, detailObj) {
  return rawList.map((v) => {
    const body = detailObj?.[ridOf(v)];
    return body ? { body } : { error: "no detail body (fixture)" };
  });
}

function epIdx(name) {
  return NHI_API_ENDPOINTS.findIndex((e) => e.name === name);
}
function rawListOf(settled, name) {
  const i = epIdx(name);
  return i >= 0 && settled[i]?.status === "fulfilled" ? settled[i].value.rawList || [] : [];
}

// Assemble the buildBundleFromRaw inputs from a captured patient fixture,
// routing every category through the same pure adapters the live sync uses.
// `jpgsFile` is the (optional) separately-captured JPEG frame file.
function shapeRawInputs(patient, jpgsFile) {
  const E = patient.endpoints || {};
  const D = patient.details || {};

  // 1. Lists → settled (same extractList + per-endpoint adapter as production).
  const settledRaw = NHI_API_ENDPOINTS.map((ep) =>
    E[ep.name] !== undefined ? { name: ep.name, body: E[ep.name] } : { name: ep.name, body: null },
  );
  const settled = adaptSettledLists(settledRaw);

  // 2. Encounter + inpatient detail maps (re-adapt happens in buildBundleFromRaw).
  const encounterDetailMap = detailMapByIndex(rawListOf(settled, "encounters"), D.encounters);
  const inpatientDetailMap = detailMapByIndex(rawListOf(settled, "inpatient"), D.inpatient);

  // 3. Imaging narrative + jpeg candidates (pure half of fetchImagingDetails).
  const imagingRaw = rawListOf(settled, "imaging");
  const imagingReqs = buildImagingReqs(imagingRaw);
  const imagingResults = imagingReqs.map((r) => {
    const body = D.imaging?.[r.row_ID];
    return body ? { body } : { error: "no detail body (fixture)" };
  });
  const { reports: imagingReports, jpegCandidates: imagingJpegCandidates } =
    adaptImagingDetailResults({ results: imagingResults, reqs: imagingReqs, visits: imagingRaw });

  // 4. Procedures = list-detail procedures (inpatient surgeries get merged in
  //    buildBundleFromRaw from the inpatient detail map).
  const procedureItems = adaptProcedureResults(
    resultsFor(rawListOf(settled, "procedures"), D.procedures),
  );

  // 5. Chronic prescriptions, then regular meds skipping chronic-shared rows
  //    (mirrors the orchestrator's chronicRowIds skip).
  const chronicRaw = rawListOf(settled, "chronic_prescriptions");
  const chronicItems = adaptChronicMedicationResults(
    resultsFor(chronicRaw, D.chronic_prescriptions),
  );
  const chronicRowIds = new Set(chronicRaw.map(ridOf).filter(Boolean));
  const medRaw = rawListOf(settled, "medications").filter((v) => {
    const id = ridOf(v);
    return id && !chronicRowIds.has(id);
  });
  const medicationItems = adaptMedicationResults(resultsFor(medRaw, D.medications));

  // 6. Fetched JPEG frames (separate capture). ctype is taken from the matching
  //    imaging candidate so the (rid|ctype) injection key lines up exactly.
  const imagingJpegResults = loadJpegResults(imagingJpegCandidates, jpgsFile);

  return {
    settled,
    encounterDetailMap,
    inpatientDetailMap,
    dischargeHtmlByRowId: {}, // 出院病摘 HTML not captured for these fixtures
    imagingReports,
    imagingJpegCandidates,
    imagingJpegResults,
    procedureItems,
    chronicItems,
    medicationItems,
  };
}

// <patient>-jpgs.json: { byRid: { rid: { seq, frames, pics:[base64...] } } }.
// Returns the pollFetchImagingJpegs-shaped results the injection consumes.
// Returns [] when no JPEG capture exists (e.g. p1 — imaging locked by NHI).
function loadJpegResults(candidates, jpgsFile) {
  if (!jpgsFile) return [];
  const jpgsPath = resolve(LOCAL, jpgsFile);
  if (!existsSync(jpgsPath)) return [];
  const jpgs = JSON.parse(readFileSync(jpgsPath, "utf8"));
  const byRid = jpgs.byRid || {};
  const ctypeByRid = new Map();
  for (const c of candidates) if (!ctypeByRid.has(c.rid)) ctypeByRid.set(c.rid, c.ctype);
  const out = [];
  for (const [rid, o] of Object.entries(byRid)) {
    out.push({
      rid,
      ctype: String(ctypeByRid.get(rid) ?? ""),
      jpgBase64s: o.pics || [],
      iplCaseSeqNo: o.seq ?? null,
      outcome: "ready",
    });
  }
  return out;
}

// Wall-clock fields the assembler stamps fresh each run — normalized out of the
// digest so the regression compares clinical content, not when it ran.
const VOLATILE_KEYS = new Set(["timestamp", "lastUpdated"]);

// Stable, compact view of the bundle: long base64 blobs → sha256 digest so the
// golden stays small + readable while still pinning content; volatile
// timestamps → a constant.
function digest(value) {
  return JSON.parse(
    JSON.stringify(value, (k, v) => {
      if (VOLATILE_KEYS.has(k)) return "<normalized>";
      if (typeof v === "string" && v.length > 200) {
        return `b64:${createHash("sha256").update(v).digest("hex").slice(0, 16)}:len=${v.length}`;
      }
      return v;
    }),
  );
}

// Captured fixtures (real PHI lives in the gitignored fixtures/local/; labels
// here describe the fixture's CHARACTERISTICS only — never a real patient name).
//   p1: imaging JPGs locked by NHI → no jpgs file.
//   p2: 47 ready imaging rows captured into p2-jpgs.json.
//   p3: IC卡 住院 boundary case (admissions with no discharge date); imaging
//       text-only (no JPG capture).
const PATIENT_FIXTURES = [
  { name: "p1", label: "imaging locked (no JPGs)", jpgs: null },
  { name: "p2", label: "with imaging JPGs", jpgs: "p2-jpgs.json" },
  { name: "p3", label: "IC卡 inpatient w/o discharge date", jpgs: null },
];

beforeAll(() => {
  // assembleLocalBundle stamps the bundle with chrome.runtime.getManifest()
  // version — the only chrome touch in the transform. Stub it deterministically.
  if (typeof globalThis.chrome === "undefined") {
    globalThis.chrome = {};
  }
  globalThis.chrome.runtime = globalThis.chrome.runtime || {};
  globalThis.chrome.runtime.getManifest = () => ({ version: "regression-test" });
});

describe("real-data regression loop (fixtures/local)", () => {
  for (const fx of PATIENT_FIXTURES) {
    const patientPath = resolve(PATIENTS, `${fx.name}.json`);
    const present = existsSync(patientPath);
    const run = present ? test : test.skip;

    run(`${fx.name} (${fx.label}) → FHIR bundle digest matches golden`, () => {
      const patient = JSON.parse(readFileSync(patientPath, "utf8"));
      const raw = shapeRawInputs(patient, fx.jpgs);
      const { bundle, byType } = buildBundleFromRaw(raw, {
        patientOverride: PATIENT_OVERRIDE,
        maskEnabled: true,
      });

      // Always-on sanity invariants.
      expect(bundle.resourceType).toBe("Bundle");
      expect(Array.isArray(bundle.entry)).toBe(true);
      expect(bundle.entry.length).toBeGreaterThan(0);

      const d = digest(bundle);
      const goldenPath = resolve(GOLDEN_DIR, `${fx.name}.bundle.digest.json`);

      if (process.env.REGEN_GOLDEN || !existsSync(goldenPath)) {
        mkdirSync(GOLDEN_DIR, { recursive: true });
        writeFileSync(goldenPath, `${JSON.stringify(d, null, 2)}\n`);
        // Summary to eyeball on the first (golden-generating) run.
        const counts = {};
        for (const e of bundle.entry) {
          const t = e.resource?.resourceType || "?";
          counts[t] = (counts[t] || 0) + 1;
        }
        // eslint-disable-next-line no-console
        console.log(
          `[regression] ${fx.name}: wrote golden (${bundle.entry.length} entries):`,
          JSON.stringify(counts),
          "byType:",
          JSON.stringify(Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, v.length]))),
        );
        return;
      }

      const golden = JSON.parse(readFileSync(goldenPath, "utf8"));
      if (JSON.stringify(d) !== JSON.stringify(golden)) {
        // Drop the actual digest next to the golden for inspection on failure.
        writeFileSync(
          resolve(GOLDEN_DIR, `${fx.name}.bundle.digest.actual.json`),
          `${JSON.stringify(d, null, 2)}\n`,
        );
      }
      expect(d).toEqual(golden);
    });
  }
});
