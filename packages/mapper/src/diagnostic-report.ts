/**
 * DiagnosticReport mapper.
 *
 * Port of `backend/app/mapper/diagnostic_report.py`. Returns null for
 * list-page rows lacking a conclusion, and for lab-value-only "reports"
 * that would duplicate a proper Observation.
 */

import { normalizeNarrativeForDedup, stableId } from "./helpers";
import * as systems from "./systems";

const V2_0074 = "http://terminology.hl7.org/CodeSystem/v2-0074";

const CATEGORY_MAP: Record<string, [string, string, string]> = {
  LAB: [V2_0074, "LAB", "Laboratory"],
  RAD: [V2_0074, "RAD", "Radiology"],
  CAR: [V2_0074, "CAR", "Cardiology"],
  PATH: [V2_0074, "PAT", "Pathology"],
};

// Lab-result patterns that look like single-value lab readings rather
// than a narrative report.
const LAB_UNIT_RE =
  /\d+(?:\.\d+)?\s*(?:%|mg\/dL|g\/dL|mmol\/L|U\/L|IU\/L|mIU\/L|ng\/mL|μg\/dL|ug\/dL|pg\/mL|fL|\/uL|10\^?\d+\/uL|x10\^?\d+\/uL|sec|秒|copies\/mL)/;

function looksLikeLabValueOnly(conclusion: string): boolean {
  if (!conclusion) return true;
  const text = conclusion.trim();
  // Real narrative reports almost always contain multiple sentences.
  if (text.length > 100) return false;
  // Single value pattern + parenthetical reference range = lab line.
  if (LAB_UNIT_RE.test(text)) return true;
  return false;
}

// Cheap deterministic fingerprint over the FIRST 16 KB of a narrative
// conclusion. Used in mapDiagnosticReport's stableId discriminator for
// narrative-only rows: two reports whose conclusions are equal AFTER
// whitespace/case normalization share a fingerprint (so true cross-
// channel A+B duplicates still dedup on the bundle's id-collision
// pass), but distinct conclusions — e.g. head/neck CT vs chest CT at
// the same hospital under the same NHI code on the same day — diverge.
//
// v0.17.2: fingerprint runs over `normalizeNarrativeForDedup(s)`, not
// the raw bytes. That normalizer NFKC-folds fullwidth/halfwidth glyphs
// (NHI ships "S／P" U+FF0F in one channel, "S/P" U+002F in another),
// strips all whitespace (numbered list rendered "ICH2." vs "ICH 2.",
// line breaks in different spots), and lowercases. Pre-v0.17.2 the
// raw-byte hash gave those channel-variants DISTINCT ids → both
// survived → downstream apps saw a phantom "multi-part CT" group
// (MediPrisma bug report 2026-06-06, a real brain-CT bundle).
// Normalizing the hash input collapses pure formatting variants to one
// id while keeping genuinely distinct exams apart (they differ in real
// alphanumeric content, not just spacing/fullwidth). Length suffix is
// computed on the normalized string so byte-variant pairs match there
// too.
//
// Scope note: this fingerprint catches EXACT-equality formatting
// variants only. TRUNCATED channel uploads (one channel's dictation
// cut off mid-report → its text is a strict PREFIX of the complete
// channel's) get DISTINCT fingerprints here and are instead collapsed
// upstream in imaging-dedup.ts's prefix-merge (which drops the
// truncated item before it ever reaches this mapper). Keeping the two
// concerns split is deliberate: the stableId hash must stay a pure
// equality key, while prefix-superset reasoning needs to compare whole
// items (and decide which to drop), which only the dedup pass can do.
//
// djb2 over JS char codes + normalized-length suffix. False positives
// are statistically negligible for narrative-length strings; we don't
// need cryptographic strength because the worst-case wrong dedup is
// a single dropped DR that re-emits on next sync.
function _conclusionFingerprint(s: string): string {
  const norm = normalizeNarrativeForDedup(s);
  let h = 5381;
  const cap = Math.min(norm.length, 16384);
  for (let i = 0; i < cap; i++) {
    h = ((h << 5) + h + norm.charCodeAt(i)) | 0;
  }
  return `${h >>> 0}:${norm.length}`;
}

export function mapDiagnosticReport(
  raw: Record<string, any>,
  patientId: string,
): Record<string, any> | null {
  const conclusion = ((raw.conclusion ?? "") as string).trim();
  // raw.jpgBase64s is the canonical multi-frame field (v0.14.x+):
  // CT / ultrasound studies ship many frames per row; X-ray / single-
  // shot exams ship one. Accept raw.jpgBase64 (singular, deprecated)
  // as a backwards-compat shim so existing callers / tests don't break.
  const rawJpgs: string[] = Array.isArray(raw.jpgBase64s)
    ? (raw.jpgBase64s as string[]).filter((s) => typeof s === "string" && s.length > 0)
    : typeof raw.jpgBase64 === "string" && raw.jpgBase64.length > 0
      ? [raw.jpgBase64]
      : [];

  // Image-only rows (popup "抓影像" opt-in) have no narrative but
  // still represent a clinical event — the attachments ARE the report.
  // Without this branch the v0.13 imaging adapter would drop the row
  // because conclusion is empty. Lab rows without conclusion AND
  // without images still drop as before (no clinical content).
  if (!conclusion && rawJpgs.length === 0) return null;

  const catKeyRaw = String(raw.category ?? "").toUpperCase();
  if (catKeyRaw === "LAB" && conclusion && looksLikeLabValueOnly(conclusion)) {
    return null;
  }

  const display = raw.display ?? "Unknown Report";
  const code = raw.code;
  const systemHint = typeof raw.system === "string" ? raw.system.toUpperCase() : "";
  // Imaging reports carry a real NHI 醫令碼 → NHI_MEDICAL_ORDER_CODE (was being
  // mis-filed under the local placeholder). LOINC stays LOINC; everything else
  // (no code system known) keeps the local report system.
  const system =
    systemHint === "LOINC"
      ? systems.LOINC
      : systemHint === "NHI" && code
        ? systems.NHI_MEDICAL_ORDER_CODE
        : systems.HIS_LOCAL_REPORT_CODE;

  // stableId hash includes a discriminator beyond (code, date):
  //
  //   Image rows (iplCaseSeqNo present): use the NHI case seq —
  //   uniquely identifies the imaging case so front + lateral X-ray
  //   under the same order_CODE 32001C don't collapse.
  //
  //   Narrative-only rows (no iplCaseSeqNo): use a short content
  //   fingerprint of the conclusion text (v0.16.2). Without this,
  //   two narratives that share (code, date, hospital) but describe
  //   different exams — e.g. a head/neck CT report (33070B, A
  //   channel) and a chest CT report (33070B, B channel) the
  //   hospital uploads under the same NHI code on the same day —
  //   produce identical stableIds and the second one is silently
  //   dropped by the bundle's id-collision dedup. Same-content
  //   narratives (true cross-channel A+B duplicates of the same
  //   report) still collide on the conclusion hash and dedup as
  //   before; only distinct-content cases gain new ids.
  //
  //   Fallback to bare code+date when neither field is present (legacy
  //   adapter outputs from before imaging support).
  let idDiscriminator: string;
  if (raw.iplCaseSeqNo) {
    idDiscriminator = `${code || display}|${raw.iplCaseSeqNo}`;
  } else if (conclusion) {
    idDiscriminator = `${code || display}|${_conclusionFingerprint(conclusion)}`;
  } else {
    idDiscriminator = code || display;
  }

  const resource: Record<string, any> = {
    resourceType: "DiagnosticReport",
    id: stableId(patientId, idDiscriminator, raw.date ?? ""),
    meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
    status: raw.status ?? "final",
    subject: { reference: `Patient/${patientId}` },
    code: {
      coding: [{ system, code: code || display, display }],
      text: display,
    },
  };
  if (conclusion) resource.conclusion = conclusion;

  const catEntry = CATEGORY_MAP[catKeyRaw];
  if (catEntry) {
    const [catSys, catCode, catDisplay] = catEntry;
    resource.category = [{ coding: [{ system: catSys, code: catCode, display: catDisplay }] }];
  }

  if (raw.date) {
    resource.effectiveDateTime = `${raw.date}T00:00:00+08:00`;
  }
  if (raw.issued) {
    resource.issued = `${raw.issued}T00:00:00+08:00`;
  } else if (raw.date) {
    resource.issued = `${raw.date}T00:00:00+08:00`;
  }

  const hospital = ((raw.hospital ?? "") as string).trim();
  if (hospital) {
    resource.performer = [{ display: hospital }];
  }

  // NHI imaging row tag (v0.15+): bridge-internal routing identifier
  // that lets the SW background poll find this exact DR later via
  // bundle.entry walk → meta.tag matching, without having to recompute
  // stableId from the raw item. Only emitted when raw provides both
  // rid (crid of the IHKE3408 row) and ctype (ori_TYPE; A/B/C/...) —
  // these are bridge-side identifiers, not patient PHI.
  //
  // Per FHIR R4 spec, apps not aware of the tag system MUST ignore the
  // tag (Meta.tag is informational). Downstream SMART apps that don't
  // implement bridge-specific hot-patch behavior pass through unchanged.
  if (raw.rid && raw.ctype) {
    resource.meta.tag = [
      {
        system: "http://nhi-fhir-bridge/nhi-imaging-row",
        code: `${raw.rid}|${raw.ctype}`,
      },
    ];
  }

  // presentedForm: per FHIR R4 spec, an Attachment array that
  // "represents the clinical content of the report". For NHI imaging
  // JPGs this is the patient-visible rendering of the X-ray / CT /
  // ultrasound the 健康存摺 UI shows. CT and ultrasound studies ship
  // many frames per row (probed 19009C=10, 33070B=10); X-rays ship 1.
  // Bytes come straight from the IHKE3408S03 base64 payload — bridge
  // does not transcode. Size derives from base64 overhead inverse
  // (every 4 base64 chars ≈ 3 binary bytes).
  if (rawJpgs.length > 0) {
    resource.presentedForm = rawJpgs.map((b64, i) => {
      const size = Math.floor((b64.length * 3) / 4);
      // Multi-frame studies get "<display> (frame n/N)" titles so a
      // SMART app rendering the list has something useful to display
      // for each attachment without having to count. Single-frame
      // studies keep the raw display untouched.
      const title = rawJpgs.length > 1 ? `${display} (frame ${i + 1}/${rawJpgs.length})` : display;
      return {
        contentType: "image/jpeg",
        data: b64,
        size,
        title,
      };
    });
  }

  return resource;
}
