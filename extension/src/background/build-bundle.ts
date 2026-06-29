// Pure "raw NHI data → FHIR byType / Bundle" transform.
//
// This is the orchestration glue that used to live inline inside
// sync-orchestrator.ts, lifted out so it has ZERO impure dependencies:
// no chrome.*, no network, no chrome.storage, no setStatus. Everything
// here is a deterministic function of its inputs.
//
// Why it exists: the Service Worker (sync-orchestrator) does the impure
// work — fetch lists, fan-out detail calls, trigger/poll imaging JPEGs,
// read the mask toggle from storage. It then hands the COLLECTED raw
// inputs to the functions below. The fixture-based regression harness
// (fixtures/local) feeds the SAME functions captured raw data instead of
// live fetches. Both paths share this one source of truth, so a snapshot
// diff in the harness catches any drift in the shipped transform.
//
// assembleLocalBundle (bundle.ts) is the only transitive chrome touch —
// it reads chrome.runtime.getManifest() for the bridgeVersion stamp. The
// Node harness stubs a minimal globalThis.chrome for that one call.

import {
  dedupImagingItems,
  maskId,
  maskName,
  stripJpegMetadataBase64,
} from "@nhi-fhir-bridge/mapper";
import {
  adaptEncounterFromMedExpense,
  adaptImageOnlyReportFromMeta,
  adaptInpatientEncounter,
  adaptInpatientProcedures,
  rocToISO,
} from "../nhi-adapters.js";
import { NHI_API_ENDPOINTS } from "../nhi-endpoints.js";
import { assembleLocalBundle } from "./bundle.js";
import { redactDemographicsDeep, replaceNameDeep } from "./patient-override.js";
import {
  classFromS02Detail,
  funcSeqNoFromS02Detail,
  labOrderCodesFromS02Detail,
  pickS02MainRow,
  primaryIcdFromS02Detail,
  rxOrderCodesFromS02Detail,
  secondaryIcdsFromS02Detail,
} from "./s02-detail.js";

function epIndex(name: string): number {
  return NHI_API_ENDPOINTS.findIndex((e: any) => e.name === name);
}

// Row_IDs the medication / chronic list endpoints flagged as ori_TYPE_NAME
// "藥局". IHKE3303 itself lacks the visit-type field, so this is how the
// encounter re-adapt classifies pharmacy-pickup events without resorting to
// hospital-name string matching.
export function computePharmacyRowIds(settled: any[]): Set<string> {
  const pharmacyRowIds = new Set<string>();
  for (const name of ["medications", "chronic_prescriptions"]) {
    const idx = epIndex(name);
    if (idx < 0 || settled[idx]?.status !== "fulfilled") continue;
    for (const v of settled[idx].value.rawList || []) {
      const id = v.row_ID || v.rowid || v.rowID;
      const oriTypeName = v.ori_TYPE_NAME || v.ori_type_name || "";
      if (id && oriTypeName.includes("藥局")) {
        pharmacyRowIds.add(id);
      }
    }
  }
  return pharmacyRowIds;
}

// IHKE3303 OPD encounters re-adapted with classHint + secondary diagnoses +
// bilingual primary ICD + rx/lab order codes + 就醫序號, all sourced from the
// S02 detail body. `detailMap` is Map<visitIdx, detailBody|null>.
export function reAdaptEncounters({
  visits,
  detailMap,
  pharmacyRowIds,
}: {
  visits: any[];
  detailMap: Map<number, any> | null;
  pharmacyRowIds: Set<string>;
}): any[] {
  const reAdapted: any[] = [];
  for (let i = 0; i < visits.length; i++) {
    const detail = detailMap?.get(i) || null;
    const cls = classFromS02Detail(detail) || "AMB";
    const secondaryDiagnoses = secondaryIcdsFromS02Detail(detail);
    const primaryDiagnosis = primaryIcdFromS02Detail(detail);
    const rxOrderCodes = rxOrderCodesFromS02Detail(detail);
    const labOrderCodes = labOrderCodesFromS02Detail(detail);
    const funcSeqNo = funcSeqNoFromS02Detail(detail);
    const visit = visits[i];
    const rowId = visit.roW_ID || visit.row_id || visit.row_ID;
    const isPharmacy = rowId ? pharmacyRowIds.has(rowId) : false;
    const it = adaptEncounterFromMedExpense(visit, cls, {
      pharmacy: isPharmacy,
      primary_diagnosis: primaryDiagnosis,
      secondary_diagnoses: secondaryDiagnoses,
      rx_order_codes: rxOrderCodes,
      lab_order_codes: labOrderCodes,
      func_seq_no: funcSeqNo,
    });
    if (it) reAdapted.push(it);
  }
  return reAdapted;
}

// IHKE3309 inpatient encounters re-adapted from the S02 detail body, plus the
// two side-products the same per-visit walk produces:
//   - inpatientProcedures: surgeries (op_CODE / opcode_data) merged into the
//     procedures bucket later (the 手術 list misses most of these).
//   - dischargeCandidates: rows with has_XML="Y" → eligible for a 出院病摘
//     /getxml fetch (impure; done by the caller, then fed back via
//     buildDischargeSummaryItems).
export function reAdaptInpatient({
  visits,
  detailMap,
}: {
  visits: any[];
  detailMap: Map<number, any> | null;
}): {
  items: any[];
  inpatientProcedures: any[];
  dischargeCandidates: Array<{
    rowId: string;
    ctype: string;
    hospital: string;
    admissionDate: string;
    dischargeDate: string;
  }>;
} {
  const reAdapted: any[] = [];
  const inpatientProcedures: any[] = [];
  const dischargeCandidates: Array<{
    rowId: string;
    ctype: string;
    hospital: string;
    admissionDate: string;
    dischargeDate: string;
  }> = [];
  for (let i = 0; i < visits.length; i++) {
    const detail = detailMap?.get(i) || null;
    const primaryDiagnosis = primaryIcdFromS02Detail(detail);
    const secondaryDiagnoses = secondaryIcdsFromS02Detail(detail);
    const rxOrderCodes = rxOrderCodesFromS02Detail(detail);
    const labOrderCodes = labOrderCodesFromS02Detail(detail);
    const it = adaptInpatientEncounter(visits[i], {
      primary_diagnosis: primaryDiagnosis,
      secondary_diagnoses: secondaryDiagnoses,
      rx_order_codes: rxOrderCodes,
      lab_order_codes: labOrderCodes,
    });
    if (it) reAdapted.push(it);
    const mainRow = pickS02MainRow(detail);
    if (mainRow) inpatientProcedures.push(...adaptInpatientProcedures(mainRow));
    const hasXml = String(mainRow?.has_XML || mainRow?.has_xml || "").toUpperCase() === "Y";
    if (!hasXml) continue;
    const v = visits[i];
    const rowId = String(v?.row_ID || v?.row_id || v?.roW_ID || "");
    if (!rowId) continue;
    dischargeCandidates.push({
      rowId,
      // ctype=3 (住院) — same value the detail page_load uses.
      ctype: "3",
      hospital: String(v?.hosp_ABBR || v?.hosp_abbr || ""),
      admissionDate: rocToISO(v?.in_DATE || v?.func_DATE || "") || "",
      dischargeDate: rocToISO(v?.out_DATE || "") || "",
    });
  }
  return { items: reAdapted, inpatientProcedures, dischargeCandidates };
}

// Turn fetched discharge-summary HTML (keyed by rowId) + the candidate list
// into document_references items. `htmlByRowId` may be a Map or a plain
// object. Rows with no HTML are skipped (the caller counts the misses for the
// breakdown line).
export function buildDischargeSummaryItems(
  dischargeCandidates: Array<{
    rowId: string;
    ctype: string;
    hospital: string;
    admissionDate: string;
    dischargeDate: string;
  }>,
  htmlByRowId: Map<string, string> | Record<string, string>,
): any[] {
  const get = (k: string): string | undefined =>
    htmlByRowId instanceof Map ? htmlByRowId.get(k) : (htmlByRowId as any)?.[k];
  const items: any[] = [];
  for (const cand of dischargeCandidates) {
    const html = get(cand.rowId);
    if (!html) continue;
    items.push({
      html,
      row_id: cand.rowId,
      hospital: cand.hospital,
      admission_date: cand.admissionDate,
      discharge_date: cand.dischargeDate,
    });
  }
  return items;
}

// Inject fetched JPEG frames into the imaging narrative items, and synthesize
// image-only DRs for jpeg-ready rows whose narrative path returned null.
// Mutates `items` in place (pass 1) and appends synth items (pass 2). Returns
// the (same) items array plus the set of (rid|ctype) keys that got bytes — the
// caller uses matchedKeys to clear the pending stash.
export function injectImagingJpegs({
  items,
  candidates,
  jpegResults,
}: {
  items: any[];
  candidates: any[];
  jpegResults: any[];
}): { items: any[]; matchedKeys: Set<string> } {
  // Re-key results by (rid|ctype) — multiple rows share order_CODE so this is
  // the only safe identity. Only rows that actually carry frames count.
  const resultByKey = new Map<string, any>();
  for (const r of jpegResults || []) {
    if (!Array.isArray(r?.jpgBase64s) || r.jpgBase64s.length === 0) continue;
    resultByKey.set(`${r.rid}|${r.ctype}`, r);
  }

  const out = items || [];
  const matchedKeys = new Set<string>();

  // Pass 1: inject jpgBase64s into existing narrative reports.
  for (const item of out) {
    if (!item) continue;
    const key = `${item.rid || ""}|${item.ctype || ""}`;
    const match = resultByKey.get(key);
    if (match) {
      item.jpgBase64s = match.jpgBase64s;
      item.iplCaseSeqNo = match.iplCaseSeqNo || null;
      matchedKeys.add(key);
    }
  }

  // Pass 2: jpeg-ready candidates whose narrative path returned null
  // (image-only rows) → synthesize a DR from mainMeta + jpgBase64s.
  for (const cand of candidates || []) {
    if (cand.hasNarrativeReport) continue;
    const key = `${cand.rid}|${cand.ctype}`;
    const match = resultByKey.get(key);
    if (!match || !Array.isArray(match.jpgBase64s) || match.jpgBase64s.length === 0) {
      continue;
    }
    const synth: any = adaptImageOnlyReportFromMeta(cand.mainMeta, {
      rid: cand.rid,
      ctype: cand.ctype,
    });
    if (!synth) continue;
    synth.jpgBase64s = match.jpgBase64s;
    synth.iplCaseSeqNo = match.iplCaseSeqNo || null;
    out.push(synth);
    matchedKeys.add(key);
  }

  return { items: out, matchedKeys };
}

// Aggregate every settled endpoint's adapted items into the page_type buckets,
// push the discharge summaries, collapse multi-channel imaging duplicates, and
// apply the de-identification masking. Returns the finalized byType.
//
// This is the assembly tail that used to be inline at the end of
// runNhiApiSync; the breakdown UI strings stay in the orchestrator (they read
// the same `settled` separately). `dischargeSummaryItems` is built by the
// caller from buildDischargeSummaryItems.
export function finalizeByType(
  settled: any[],
  dischargeSummaryItems: any[],
  {
    maskEnabled,
    patientName,
    patientId,
  }: { maskEnabled: boolean; patientName?: string; patientId?: string },
): Record<string, any[]> {
  const byType: Record<string, any[]> = {};
  for (let i = 0; i < settled.length; i++) {
    const ep: any = NHI_API_ENDPOINTS[i];
    const s = settled[i];
    if (!s || s.status !== "fulfilled") continue;
    const items = s.value.items || [];
    if (items.length === 0) continue;
    byType[ep.page_type] = byType[ep.page_type] || [];
    byType[ep.page_type].push(...items);
  }

  // 出院病摘 — separate page_type fed by the inpatient detail step.
  if (dischargeSummaryItems.length > 0) {
    byType.document_references = byType.document_references || [];
    byType.document_references.push(...dischargeSummaryItems);
  }

  // Collapse multi-channel NHI duplicates of the same imaging study.
  const drBucket = byType.diagnostic_reports;
  if (Array.isArray(drBucket) && drBucket.length > 0) {
    const before = drBucket.length;
    byType.diagnostic_reports = dedupImagingItems(drBucket);
    const after = byType.diagnostic_reports.length;
    if (after < before) {
      console.info(
        `[imaging-dedup] ${before} → ${after} items (collapsed ${before - after} multi-channel duplicates)`,
      );
    }
  }

  // Mask gate (defaults ON, privacy-first). Scrub the patient's real name +
  // 身分證 out of any NHI narrative field before it flows into the mapper.
  if (maskEnabled && patientName) {
    const replacement = maskName(patientName);
    for (const key of Object.keys(byType)) {
      byType[key] = replaceNameDeep(byType[key], patientName, replacement);
    }
  }
  if (maskEnabled && patientId) {
    const idReplacement = maskId(patientId, "X");
    for (const key of Object.keys(byType)) {
      byType[key] = replaceNameDeep(byType[key], patientId, idReplacement);
    }
  }
  // Label-anchored DOB + 病歷號碼 scrub (出院病摘 HTML / 病理報告 narratives).
  if (maskEnabled) {
    for (const key of Object.keys(byType)) {
      byType[key] = redactDemographicsDeep(byType[key]);
    }
  }
  // Strip EXIF/COM metadata segments from JPEG frames (pixels untouched).
  const drItems = byType.diagnostic_reports;
  if (maskEnabled && Array.isArray(drItems)) {
    for (const item of drItems as any[]) {
      if (Array.isArray(item?.jpgBase64s)) {
        item.jpgBase64s = item.jpgBase64s.map((b64: string) => stripJpegMetadataBase64(b64));
      }
      if (typeof item?.jpgBase64 === "string") {
        item.jpgBase64 = stripJpegMetadataBase64(item.jpgBase64);
      }
    }
  }

  return byType;
}

// One-shot composition used by the fixture regression harness: take the fully
// collected raw inputs (the same shapes the SW gathers from live fetches) and
// produce the finalized byType + the local FHIR Bundle. The shipped
// sync-orchestrator calls the individual functions above inline (so it can
// interleave the impure fetches / telemetry / storage between them); this
// composer guarantees the harness routes through the IDENTICAL logic.
export function buildBundleFromRaw(
  raw: {
    settled: any[];
    encounterDetailMap?: Map<number, any> | null;
    inpatientDetailMap?: Map<number, any> | null;
    dischargeHtmlByRowId?: Map<string, string> | Record<string, string>;
    imagingReports?: any[];
    imagingJpegCandidates?: any[];
    imagingJpegResults?: any[];
    procedureItems?: any[];
    chronicItems?: any[];
    medicationItems?: any[];
  },
  { patientOverride, maskEnabled }: { patientOverride: any; maskEnabled: boolean },
): { byType: Record<string, any[]>; bundle: any } {
  const { settled } = raw;
  const pharmacyRowIds = computePharmacyRowIds(settled);

  // Encounters.
  const encIdx = epIndex("encounters");
  if (encIdx >= 0 && settled[encIdx]?.status === "fulfilled") {
    const visits = settled[encIdx].value.rawList || [];
    const items = reAdaptEncounters({
      visits,
      detailMap: raw.encounterDetailMap || null,
      pharmacyRowIds,
    });
    settled[encIdx].value.items = items;
    settled[encIdx].value.raw_count = items.length;
  }

  // Inpatient (+ inpatient procedures + discharge candidates).
  let inpatientProcedures: any[] = [];
  let dischargeSummaryItems: any[] = [];
  const inpIdx = epIndex("inpatient");
  if (inpIdx >= 0 && settled[inpIdx]?.status === "fulfilled") {
    const visits = settled[inpIdx].value.rawList || [];
    const {
      items,
      inpatientProcedures: inpProcs,
      dischargeCandidates,
    } = reAdaptInpatient({
      visits,
      detailMap: raw.inpatientDetailMap || null,
    });
    settled[inpIdx].value.items = items;
    settled[inpIdx].value.raw_count = items.length;
    inpatientProcedures = inpProcs;
    dischargeSummaryItems = buildDischargeSummaryItems(
      dischargeCandidates,
      raw.dischargeHtmlByRowId || {},
    );
  }

  // Imaging: detail reports → inject fetched JPEG frames + synth image-only DRs.
  const imgIdx = epIndex("imaging");
  if (imgIdx >= 0 && settled[imgIdx]?.status === "fulfilled") {
    const { items } = injectImagingJpegs({
      items: raw.imagingReports || [],
      candidates: raw.imagingJpegCandidates || [],
      jpegResults: raw.imagingJpegResults || [],
    });
    settled[imgIdx].value.items = items;
    settled[imgIdx].value.raw_count = items.length;
  }

  // Procedures = list-detail procedures + 住院-detail surgeries.
  const procIdx = epIndex("procedures");
  if (procIdx >= 0 && settled[procIdx]?.status === "fulfilled") {
    const items = [...(raw.procedureItems || []), ...inpatientProcedures];
    settled[procIdx].value.items = items;
    settled[procIdx].value.raw_count = items.length;
  }

  // Chronic prescriptions.
  const chronicIdx = epIndex("chronic_prescriptions");
  if (chronicIdx >= 0 && settled[chronicIdx]?.status === "fulfilled") {
    settled[chronicIdx].value.items = raw.chronicItems || [];
    settled[chronicIdx].value.raw_count = (raw.chronicItems || []).length;
  }

  // Regular medications.
  const medIdx = epIndex("medications");
  if (medIdx >= 0 && settled[medIdx]?.status === "fulfilled") {
    settled[medIdx].value.items = raw.medicationItems || [];
    settled[medIdx].value.raw_count = (raw.medicationItems || []).length;
  }

  const byType = finalizeByType(settled, dischargeSummaryItems, {
    maskEnabled,
    patientName: patientOverride?.name,
    patientId: patientOverride?.id_no,
  });

  const bundle = assembleLocalBundle(byType, patientOverride, maskEnabled);
  return { byType, bundle };
}
