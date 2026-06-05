/**
 * DocumentReference mapper — NHI 出院病摘 (discharge summary).
 *
 * NHI ships discharge summaries as pre-rendered HTML via
 * `/api/ihke3000/IHKE3309S02/getxml?crid=<rowid>&ctype=3`, wrapped in
 * `{ "file_name": "<html string>" }`. The HTML is patient-presentation
 * markup the 健康存摺 "查看檔案" modal displays verbatim — single <head>
 * with a <style> block, then 5 <table>s (demographics / admin metadata /
 * 住院摘要 free-text narrative). The `xmlns:IHK="urn:hl7-org:v3"` on the
 * root is residual from NHI's CDA-derived rendering pipeline; the
 * payload is HTML, not CDA.
 *
 * Faithful-transport choice (per CLAUDE.md rule 6): bridge stores the
 * HTML verbatim as a base64 attachment on a FHIR R4 DocumentReference.
 * No section parsing — bridge does not interpret 住院摘要 narrative.
 * Future Composition/sectioned-extraction is opt-in for downstream apps
 * that want structured views; the verbatim HTML stays the source of
 * truth.
 *
 * Encounter link: bridge already mints an inpatient Encounter for the
 * same NHI row via `mapEncounter` with `stableId(pid, date, "IMP",
 * hospital)`. We recompute the same ID here so the DocumentReference's
 * `context.encounter[0].reference` lands on the correct Encounter
 * without depending on the (hospital, date) post-mapping linker — which
 * is also keyed on `resourceHospital()` / `resourceDate()` and would
 * skip DocumentReference anyway (linker's ENCOUNTER_LINKABLE set is
 * fixed; we deliberately don't extend it to keep the linker focused on
 * date-resolvable resources).
 */

import { sha1 } from "js-sha1";

import { stableId } from "./helpers";

const LOINC = "http://loinc.org";

// LOINC 18842-5 "Discharge summary" — verified at loinc.org/18842-5/
// 2026-06-05: Component=Discharge summary note, Class=DOC.ONTOLOGY,
// Status=Active. Canonical document-type code across all care settings,
// independent of role/specialty. Matches the FHIR R4 US Core /
// IPS recommendation for discharge summary DocumentReference.type.
const LOINC_DISCHARGE_SUMMARY = "18842-5";
const LOINC_DISCHARGE_SUMMARY_DISPLAY = "Discharge summary";

// US Core / FHIR R4 DocumentReference.category convention. "clinical-note"
// is the closest standard categorization for a discharge summary; it's
// the same value Apple Health and Epic SMART-on-FHIR endpoints use.
const DOC_CATEGORY_SYSTEM = "http://hl7.org/fhir/us/core/CodeSystem/us-core-documentreference-category";

// Bridge runs in two environments — Chrome extension SW (browser-side
// btoa, no Node Buffer) and Node ≥ 16 (vitest, backend-ts). The mapper
// package's tsconfig is browser-only to keep it portable, so we reach
// Node's Buffer via globalThis with a runtime-only typecheck rather
// than depending on @types/node here.
function getNodeBuffer():
  | { from: (s: string, enc: string) => { toString: (e: string) => string }; byteLength: (s: string, e: string) => number }
  | null {
  const g = globalThis as any;
  if (g && g.Buffer && typeof g.Buffer.from === "function") return g.Buffer;
  return null;
}

// Base64-encode a UTF-8 string. Feature-detect Node's Buffer first
// (vitest path), then fall back to encodeURIComponent → unescape → btoa
// — the standard hack to round-trip multi-byte UTF-8 through Latin-1-
// only btoa. See MDN: Base64#The_Unicode_Problem.
function utf8ToBase64(s: string): string {
  const NodeBuffer = getNodeBuffer();
  if (NodeBuffer) {
    return NodeBuffer.from(s, "utf8").toString("base64");
  }
  return btoa(unescape(encodeURIComponent(s)));
}

// SHA-1 hex of the raw HTML bytes — populates Attachment.hash per
// FHIR R4 spec (Attachment.hash is the binary-content SHA-1, not a
// base64-of-SHA-1 wrapper).
function sha1OfHtml(html: string): string {
  return sha1(html);
}

// Extract 記錄日期時間 from the HTML when present (e.g. "2025-05-23").
// Best-effort, ungreedy. If we can't find one, the mapper falls back to
// the discharge date (out_DATE). This is a presentation field only —
// effectiveDateTime / context.period.end carries the canonical clinical
// date.
function extractRecordDateIso(html: string): string | null {
  // NHI's template renders the field as "<b>記錄日期時間：</b>YYYY-MM-DD"
  // (possibly with time suffix); other date fields in the same document
  // use slashes (e.g. "出院日期：2025/05/22"). Match either separator and
  // normalize to YYYY-MM-DD.
  const m = html.match(/記錄日期時間[：:][^0-9]*(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (!m) return null;
  const yyyy = m[1];
  const mm = String(m[2]).padStart(2, "0");
  const dd = String(m[3]).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Build a base64 data string from the raw HTML, plus FHIR R4 Attachment
// .size / .hash. Single function so the test can assert all three
// derived values from one HTML input.
function buildAttachment(html: string, title: string): Record<string, any> {
  const data = utf8ToBase64(html);
  return {
    contentType: "text/html",
    language: "zh-TW",
    data,
    title,
    // FHIR R4 Attachment.size: "Number of bytes of content (if url
    // provided)" — the binary length, NOT the base64-string length.
    // For UTF-8 HTML this is the encoded byte count.
    size: (() => {
      const NodeBuffer = getNodeBuffer();
      return NodeBuffer ? NodeBuffer.byteLength(html, "utf8") : new Blob([html]).size;
    })(),
    hash: sha1OfHtml(html),
  };
}

/**
 * Adapter-style input (snake_case, mirrors other adapters):
 *   html             — full NHI HTML payload (required)
 *   row_id           — IHKE3309S01 row_ID (used for stable ID + meta.tag)
 *   admission_date   — ISO "YYYY-MM-DD" (used for Encounter back-ref)
 *   discharge_date   — ISO "YYYY-MM-DD" (used for context.period.end)
 *   hospital         — hospital short name (matches Encounter.serviceProvider)
 *   hospital_id      — NHI 醫療機構代碼 (10-digit, optional)
 *   record_date      — ISO "YYYY-MM-DD" record timestamp (optional;
 *                      auto-extracted from HTML when absent)
 *
 * Returns null only when html is missing or the admission date is
 * missing (without those we can't anchor the document to an Encounter).
 */
export function mapDischargeSummaryDocRef(
  raw: Record<string, any>,
  patientId: string,
): Record<string, any> | null {
  const html = String(raw?.html ?? "");
  if (!html || html.length < 10) return null;

  const admissionDate = String(raw?.admission_date ?? "");
  const dischargeDate = String(raw?.discharge_date ?? "");
  if (!admissionDate) return null;

  const hospital = String(raw?.hospital ?? "").trim();
  const rowId = String(raw?.row_id ?? "").trim();
  const recordDate =
    String(raw?.record_date ?? "").trim() || extractRecordDateIso(html) || dischargeDate || admissionDate;

  // Encounter back-reference: recompute the inpatient Encounter ID
  // using the SAME stableId inputs as mapEncounter (date, class, hosp).
  // Keeps DocumentReference→Encounter linking robust against future
  // changes to the post-mapping linker (which currently skips this
  // resource type anyway).
  const encounterId = stableId(patientId, admissionDate, "IMP", hospital);

  const id = stableId(
    patientId,
    "discharge-summary",
    rowId || `${hospital}|${admissionDate}|${dischargeDate}`,
  );

  const periodLabel =
    admissionDate && dischargeDate ? `${admissionDate}~${dischargeDate}` : admissionDate;
  const title = hospital
    ? `出院病摘 — ${hospital} ${periodLabel}`
    : `出院病摘 ${periodLabel}`;

  const resource: Record<string, any> = {
    resourceType: "DocumentReference",
    id,
    meta: {
      versionId: "1",
      source: "nhi-fhir-bridge/scraper",
      // bridge-namespaced tag mirrors v0.12.3 nhi-source-channel and
      // v0.15 nhi-imaging-row patterns. Informational; FHIR R4 spec
      // says applications not aware of the tag system MUST ignore it.
      tag: [
        {
          system: "http://nhi-fhir-bridge/nhi-source",
          code: "ihke3309-getxml",
        },
      ],
    },
    status: "current",
    type: {
      coding: [
        {
          system: LOINC,
          code: LOINC_DISCHARGE_SUMMARY,
          display: LOINC_DISCHARGE_SUMMARY_DISPLAY,
        },
      ],
      text: "出院病摘",
    },
    category: [
      {
        coding: [
          {
            system: DOC_CATEGORY_SYSTEM,
            code: "clinical-note",
            display: "Clinical Note",
          },
        ],
      },
    ],
    subject: { reference: `Patient/${patientId}` },
    date: `${recordDate}T00:00:00+08:00`,
    content: [
      {
        attachment: buildAttachment(html, title),
      },
    ],
    context: {
      encounter: [{ reference: `Encounter/${encounterId}` }],
      period: {
        start: `${admissionDate}T00:00:00+08:00`,
        ...(dischargeDate ? { end: `${dischargeDate}T23:59:59+08:00` } : {}),
      },
    },
  };

  if (hospital) {
    resource.custodian = { display: hospital };
  }

  // Row-level identifier so downstream apps / re-syncs can match the
  // exact NHI row this document originated from. Bridge-namespaced
  // identifier system follows the same naming convention as the meta
  // tag above.
  if (rowId) {
    resource.identifier = [
      { system: "http://nhi-fhir-bridge/nhi-inpatient-row", value: rowId },
    ];
  }

  return resource;
}
