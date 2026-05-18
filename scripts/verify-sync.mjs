#!/usr/bin/env node
// verify-sync — static QA for FHIR Bundles produced by NHI-FHIR-Bridge.
//
// Why this exists: the v0.6.1 lab-date bug shipped because outpatient
// data has same-day everything, hiding the systemic issue. This script
// runs heuristic checks that would have flagged the bug from the output
// JSON alone, without round-tripping to NHI:
//
//   - Date clustering: how many resources of the same kind share a
//     single effectiveDateTime / performedDateTime? Hospital labs
//     legitimately cluster on a single draw — but 50 different lab
//     codes all on the same calendar day across multiple hospitals is
//     a smell.
//   - Date range health: span of effectiveDateTime per page_type vs.
//     the filename's date range. If the file is supposed to cover 3y
//     of data but Observations all sit in a 1-day cluster, something's
//     wrong upstream.
//   - sync-page-type tag presence: every resource we generate carries
//     two meta tags (`sync-page-type`, `sync-run-id`). Missing tags
//     mean a mapper / adapter skipped its tagging step.
//
// This is intentionally a "smell detector", not a ground-truth diff.
// For ground-truth verification you re-fetch the same NHI endpoints
// with the user's session and compare row-by-row — see TODO_FOLLOWUP.md
// for the live-verifier sketch.
//
// Usage:
//   node scripts/verify-sync.mjs <path-to-fhir.json>
//
// Exit codes:
//   0 — no smells detected
//   1 — at least one warning printed
//   2 — couldn't load / parse the file
//
// (Run with `--quiet` to suppress the per-resource summaries and only
// surface warnings.)

import { readFileSync, existsSync } from "node:fs";
import { basename } from "node:path";

const args = process.argv.slice(2);
const quiet = args.includes("--quiet");
const positional = args.filter((a) => !a.startsWith("--"));
const fhirPath = positional[0];

if (!fhirPath) {
  console.error("usage: node scripts/verify-sync.mjs <fhir.json> [--quiet]");
  process.exit(2);
}
if (!existsSync(fhirPath)) {
  console.error(`error: file not found: ${fhirPath}`);
  process.exit(2);
}

let bundle;
try {
  bundle = JSON.parse(readFileSync(fhirPath, "utf8"));
} catch (err) {
  console.error(`error: failed to parse JSON: ${err.message}`);
  process.exit(2);
}

if (!Array.isArray(bundle?.entry)) {
  console.error("error: file isn't a FHIR Bundle (no .entry array)");
  process.exit(2);
}

// ── Helpers ─────────────────────────────────────────────────────────────

const PAGE_TYPE_SYSTEM = "http://nhi-fhir-bridge/sync-page-type";

function extractPageType(resource) {
  const tags = resource?.meta?.tag ?? [];
  return tags.find((t) => t.system === PAGE_TYPE_SYSTEM)?.code ?? null;
}

function extractEffectiveDate(resource) {
  // FHIR resources put their primary clinical time in a few different
  // places depending on type. We only need the date prefix for clustering.
  const raw =
    resource.effectiveDateTime ??
    resource.effectivePeriod?.start ??
    resource.performedDateTime ??
    resource.performedPeriod?.start ??
    resource.period?.start ??
    resource.onsetDateTime ??
    resource.recordedDate ??
    resource.authoredOn ??               // MedicationRequest
    resource.dispenseRequest?.validityPeriod?.start ??
    null;
  if (!raw || typeof raw !== "string") return null;
  return raw.slice(0, 10);
}

function fmt(n) {
  return n.toLocaleString();
}

// ── Pass 1: group resources ────────────────────────────────────────────

const byType = new Map();        // resourceType → array of {date, pageType}
const byPageType = new Map();    // page_type tag → array of {resourceType, date}
let resourcesWithoutPageTag = 0;
let resourcesWithoutDate = 0;

for (const entry of bundle.entry) {
  const r = entry.resource;
  if (!r) continue;
  const rt = r.resourceType;
  if (!rt || rt === "Patient") continue;

  const pageType = extractPageType(r);
  const date = extractEffectiveDate(r);

  if (!pageType) resourcesWithoutPageTag += 1;
  if (!date) resourcesWithoutDate += 1;

  if (!byType.has(rt)) byType.set(rt, []);
  byType.get(rt).push({ date, pageType });

  if (pageType) {
    if (!byPageType.has(pageType)) byPageType.set(pageType, []);
    byPageType.get(pageType).push({ resourceType: rt, date });
  }
}

// ── Report ──────────────────────────────────────────────────────────────

const warnings = [];

console.log(`\n📄 ${basename(fhirPath)}`);
console.log(`   ${fmt(bundle.entry.length)} entries total\n`);

if (!quiet) {
  console.log("── Resources by type ────────────────────────────────────");
  for (const [type, rows] of [...byType.entries()].sort()) {
    const dates = rows.map((r) => r.date).filter(Boolean);
    const span = dateSpan(dates);
    console.log(
      `  ${type.padEnd(22)} ${fmt(rows.length).padStart(5)} ` +
      (span ? `(${span.min} → ${span.max}, ${span.uniqueDays} unique days)` : "(no dates)"),
    );
  }
  console.log("");
}

// Smell 1: date clustering per page_type
console.log("── Date clustering per page_type ────────────────────────");
for (const [pt, rows] of [...byPageType.entries()].sort()) {
  const dates = rows.map((r) => r.date).filter(Boolean);
  if (dates.length === 0) continue;

  const counts = new Map();
  for (const d of dates) counts.set(d, (counts.get(d) ?? 0) + 1);
  const sortedByCount = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const [topDate, topCount] = sortedByCount[0];
  const pctTop = ((topCount / dates.length) * 100).toFixed(1);

  console.log(
    `  ${pt.padEnd(22)} ${fmt(dates.length).padStart(5)} resources, ` +
    `top date ${topDate} = ${fmt(topCount)} (${pctTop}%)`,
  );

  // Heuristic: if >40% of resources for a single page_type sit on one
  // calendar day AND there are 20+ resources, that's likely a
  // date-collapse bug rather than legitimate single-visit clustering.
  if (dates.length >= 20 && pctTop > 40) {
    warnings.push(
      `${pt}: ${pctTop}% of ${dates.length} resources share date ${topDate} — ` +
      `possible date-field selection bug (cf. v0.6.1 lab-date fix).`,
    );
  }
}
console.log("");

// Smell 2: meta tag completeness
if (resourcesWithoutPageTag > 0) {
  warnings.push(
    `${resourcesWithoutPageTag} resources have no sync-page-type meta tag — ` +
    `they won't be traceable back to a source NHI endpoint.`,
  );
}
if (resourcesWithoutDate > 0) {
  console.log(`ℹ️  ${resourcesWithoutDate} resources have no effective/performed/onset date (may be normal for some types like MedicationStatement)`);
}

// Smell 3: filename date range vs actual data span
const filenameRange = parseFilenameRange(basename(fhirPath));
if (filenameRange) {
  const allDates = [...byType.values()].flat().map((r) => r.date).filter(Boolean);
  const actual = dateSpan(allDates);
  if (actual) {
    const fileSpan = daysBetween(filenameRange.start, filenameRange.end);
    const dataSpan = daysBetween(actual.min, actual.max);
    if (fileSpan >= 365 && dataSpan < fileSpan * 0.1) {
      warnings.push(
        `Filename indicates ${fileSpan} day range but data only spans ${dataSpan} days ` +
        `(${actual.min} → ${actual.max}). Check whether sync got truncated.`,
      );
    }
    console.log(
      `── Date span ────────────────────────────────────────────\n` +
      `   filename window: ${filenameRange.start} → ${filenameRange.end} (${fmt(fileSpan)} days)\n` +
      `   actual data:     ${actual.min} → ${actual.max} (${fmt(dataSpan)} days)\n`,
    );
  }
}

// ── Final ──────────────────────────────────────────────────────────────

if (warnings.length === 0) {
  console.log("✅ no smells detected");
  process.exit(0);
} else {
  console.log("⚠️  warnings:");
  for (const w of warnings) console.log(`   • ${w}`);
  console.log("");
  process.exit(1);
}

// ── small helpers ──────────────────────────────────────────────────────

function dateSpan(dates) {
  if (dates.length === 0) return null;
  let min = dates[0];
  let max = dates[0];
  const unique = new Set();
  for (const d of dates) {
    if (d < min) min = d;
    if (d > max) max = d;
    unique.add(d);
  }
  return { min, max, uniqueDays: unique.size };
}

function daysBetween(d1, d2) {
  return Math.round((new Date(d2) - new Date(d1)) / 86400000) + 1;
}

function parseFilenameRange(name) {
  // nhi-P12345XXXX-YYYYMMDD-YYYYMMDD.json
  const m = name.match(/(\d{8})-(\d{8})/);
  if (!m) return null;
  const fmt = (s) => `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  return { start: fmt(m[1]), end: fmt(m[2]) };
}
