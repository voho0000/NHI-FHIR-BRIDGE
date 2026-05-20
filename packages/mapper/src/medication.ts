/**
 * MedicationRequest mapper + bilingual deduplication.
 *
 * Port of `backend/app/mapper/medication.py`. NHI 健康存摺 reports the
 * SAME prescription multiple times (English-only / Eng+中 / 中+Eng).
 * `mapMedicationsDedup` collapses these to one MedicationRequest per
 * (date, canonical-drug-key), preferring the form with more CJK chars
 * (clinicians read 商品名 first).
 */

import * as systems from "./systems";
import { normalizeIcd10Cm } from "./condition";
import { stableId } from "./helpers";

function isCjk(ch: string): boolean {
  // 一 (U+4E00) to 鿿 (U+9FFF) covers CJK Unified Ideographs.
  const cp = ch.codePointAt(0) ?? 0;
  return cp >= 0x4e00 && cp <= 0x9fff;
}

function cjkChars(s: string | null | undefined): number {
  if (!s) return 0;
  let n = 0;
  for (const ch of s) if (isCjk(ch)) n++;
  return n;
}

/**
 * Match a "long" English chunk (≥4 chars of A-Z/0-9/punctuation common
 * to drug names). Avoid matching short tokens like "D" or "PO" that
 * appear inside Chinese names.
 */
const EN_CHUNK_G = /[A-Z][A-Z0-9.%/\-"'\s]{3,}/g;

/**
 * Reduce a drug-name string to a stable canonical key. Extract the
 * longest English fragment, then truncate at common separators so a
 * name with extra trailing modifiers still collapses to brand+strength.
 *
 * Examples (all map to "timoptol xe 0.5% ophthalmic solution"):
 *   "TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION"
 *   "TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION (青眼露…)"
 *   "青眼露… (TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION)"
 */
export function canonicalDrugKey(name: string | null | undefined): string {
  const s = (name ?? "").toUpperCase();
  const chunks = [...s.matchAll(EN_CHUNK_G)].map((m) => m[0]);
  if (chunks.length === 0) {
    return (name ?? "").trim().toLowerCase();
  }
  let longest = chunks.reduce((a, b) => (b.length > a.length ? b : a)).trim();
  for (const sep of [" - ", " – ", " / "]) {
    if (longest.includes(sep)) {
      longest = longest.split(sep)[0]!;
    }
  }
  return longest.replace(/\s+/g, " ").trim().toLowerCase();
}

/**
 * Best-effort active vs completed decision for a MedicationRequest.
 * Active while (authored_date + duration > today); otherwise completed.
 * Missing duration → assume 90-day refill window (NHI's typical cadence).
 */
export function medStatus(
  authoredIso: string | null | undefined,
  durationDays: any,
): "active" | "completed" {
  if (!authoredIso) return "completed";
  const datePart = String(authoredIso).slice(0, 10);
  const parsed = new Date(`${datePart}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return "completed";

  let days: number | null;
  if (durationDays === null || durationDays === undefined || durationDays === "") {
    days = null;
  } else {
    const n = Number.parseInt(String(durationDays), 10);
    days = Number.isFinite(n) ? n : null;
  }
  if (days === null) days = 90;

  const end = new Date(parsed.getTime());
  end.setUTCDate(end.getUTCDate() + days);
  // Compare date-only (today in UTC since we authoredIso is date-only).
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return end >= today ? "active" : "completed";
}

/**
 * Convert one scraped prescription dict → FHIR R4 MedicationRequest.
 * Returns null when raw has no `drug_name` (caller filters out).
 */
export function mapMedicationRequest(
  raw: Record<string, any>,
  patientId: string,
): Record<string, any> | null {
  const drugName = ((raw.drug_name ?? "") as string).trim();
  if (!drugName) return null;

  // Canonical key (not raw drug_name) for stable id so the three NHI
  // 中英 variants of the same drug collapse to one FHIR resource.
  const medId = stableId(patientId, canonicalDrugKey(drugName), raw.date ?? "");

  const drugCode = ((raw.code ?? "") as string).trim();
  const coding: Record<string, string> = {
    system: drugCode ? systems.NHI_DRUG_CODE : systems.HIS_LOCAL_MEDICATION_CODE,
    code: drugCode || drugName,
    display: drugName,
  };

  const resource: Record<string, any> = {
    resourceType: "MedicationRequest",
    id: medId,
    meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
    status: medStatus(raw.date ?? "", raw.duration_days),
    intent: "order",
    medicationCodeableConcept: {
      coding: [coding],
      text: drugName,
    },
    subject: { reference: `Patient/${patientId}` },
  };

  if (raw.date) {
    resource.authoredOn = `${raw.date}T00:00:00+08:00`;
  }

  // Chronic prescriptions (from NHI's IHKE3307S01 慢性處方箋 list) get
  // the standard FHIR continuous-therapy marker. SMART apps recognise
  // this code and can surface "long-term medication" badges or filter
  // problem-list views. Acute prescriptions leave the field unset.
  const courseOfTherapy = ((raw.course_of_therapy ?? "") as string).trim();
  if (courseOfTherapy === "continuous") {
    resource.courseOfTherapyType = {
      coding: [
        {
          system:
            "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
          code: "continuous",
          display: "Continuous long term therapy",
        },
      ],
      text: "Continuous long term therapy",
    };
  }

  const drugClass = ((raw.drug_class ?? "") as string).trim();
  if (drugClass) {
    resource.category = [{ text: drugClass }];
  }

  const hospital = ((raw.hospital ?? "") as string).trim();
  if (hospital) {
    resource.requester = { display: hospital };
  }

  // Dosage — only when source actually has it. NHI's medication-list
  // endpoint provides none of these; other HIS adapters get a
  // structured dosage out.
  const dosage: Record<string, any> = {};
  const parts: string[] = [];
  for (const k of ["dose", "unit", "frequency"] as const) {
    if (raw[k]) parts.push(String(raw[k]));
  }
  if (parts.length > 0) {
    dosage.text = parts.join(" ");
  }
  if (raw.route) {
    dosage.route = {
      coding: [{ system: "http://snomed.info/sct", display: raw.route }],
    };
  }
  if (Object.keys(dosage).length > 0) {
    resource.dosageInstruction = [dosage];
  }

  // dispenseRequest with quantity + supply duration when present.
  const dr: Record<string, any> = {};
  const qtyRaw = raw.quantity;
  if (qtyRaw !== null && qtyRaw !== undefined && qtyRaw !== "") {
    const qtyNum = Number.parseFloat(String(qtyRaw).replace(/,/g, ""));
    if (Number.isFinite(qtyNum)) {
      dr.quantity = { value: qtyNum };
    }
  }
  if (raw.duration_days) {
    const days = Number.parseInt(String(raw.duration_days), 10);
    if (Number.isFinite(days)) {
      dr.expectedSupplyDuration = {
        value: days,
        unit: "days",
        system: "http://unitsofmeasure.org",
        code: "d",
      };
    }
  }
  // Inpatient drugs: NHI bundles every drug used during an admission into
  // one row dated to the admission day. authoredOn carries that anchor;
  // validityPeriod expresses the actual usage window [admit, discharge]
  // so SMART apps display "used during stay 5/18-5/22" instead of
  // "all 14 drugs prescribed on 5/18". OPD / 藥局 rows leave end_date
  // empty so this block doesn't fire — single-day prescriptions remain
  // unchanged. The MedicationRequest.dispenseRequest.validityPeriod field
  // is a semantic stretch (its strict definition is the prescription's
  // stale-dating window) but is the closest existing field; we don't
  // emit MedicationAdministration resources.
  const endDate = ((raw.end_date ?? "") as string).trim();
  if (raw.date && endDate && endDate !== raw.date) {
    dr.validityPeriod = {
      start: `${raw.date}T00:00:00+08:00`,
      end: `${endDate}T23:59:59+08:00`,
    };
  }
  if (Object.keys(dr).length > 0) {
    resource.dispenseRequest = dr;
  }

  const indication = ((raw.indication ?? "") as string).trim();
  const indicationCode = ((raw.indication_code ?? "") as string).trim();
  if (indication || indicationCode) {
    const rc: Record<string, any> = {};
    if (indicationCode) {
      rc.coding = [
        {
          system: systems.ICD_10_CM,
          code: normalizeIcd10Cm(indicationCode),
          display: indication || indicationCode,
        },
      ];
    }
    if (indication) {
      rc.text = indicationCode ? `${indicationCode} ${indication}`.trim() : indication;
    }
    resource.reasonCode = [rc];
  }

  return resource;
}

/**
 * Group-aware medication mapper that dedupes 中英 雙語 duplicates.
 *
 * Strategy:
 *   1. Compute canonical key per drug name (longest English chunk).
 *   2. Group by (date, canonical_key). Keep ONE entry per group,
 *      preferring the form with FEWER CJK characters (English brand
 *      name — clinicians scan English first).
 *   3. Map each kept entry through mapMedicationRequest.
 *
 * Note: Python comment says "more CJK" but the code uses `<` (fewer);
 * we preserve the actual code behaviour to keep parity.
 */
export function mapMedicationsDedup(rawItems: any[], patientId: string): Record<string, any>[] {
  const byKey = new Map<string, Record<string, any>>();
  for (const item of rawItems) {
    if (!item || typeof item !== "object") continue;
    const drugName = ((item.drug_name ?? "") as string).trim();
    if (!drugName) continue;
    const datePart = ((item.date ?? "") as string).slice(0, 10);
    const key = `${datePart}|${canonicalDrugKey(drugName)}`;
    const existing = byKey.get(key);
    if (existing === undefined) {
      byKey.set(key, item);
    } else {
      // Prefer the form with FEWER CJK characters (English brand name).
      if (cjkChars(drugName) < cjkChars(existing.drug_name ?? "")) {
        byKey.set(key, item);
      }
    }
  }

  const out: Record<string, any>[] = [];
  for (const item of byKey.values()) {
    const m = mapMedicationRequest(item, patientId);
    if (m !== null) out.push(m);
  }
  return out;
}
