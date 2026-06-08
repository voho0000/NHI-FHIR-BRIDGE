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

  // v0.8.0 bilingual: prefer 繁中 in CodeableConcept.text (patient-facing
  // display) and keep English in coding[0].display (clinical canonical).
  // Falls back to English when NHI didn't ship a Chinese name for the drug.
  const drugNameZh = ((raw.drug_name_zh ?? "") as string).trim() || drugName;

  const resource: Record<string, any> = {
    resourceType: "MedicationRequest",
    id: medId,
    meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
    status: medStatus(raw.date ?? "", raw.duration_days),
    intent: "order",
    medicationCodeableConcept: {
      coding: [coding],
      text: drugNameZh,
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
  const drugClassZh = ((raw.drug_class_zh ?? "") as string).trim();
  if (drugClass || drugClassZh) {
    const cat: Record<string, any> = {};
    if (drugClass) cat.coding = [{ display: drugClass }];
    // Patient-facing: prefer 繁中 in .text, fall back to English.
    cat.text = drugClassZh || drugClass;
    resource.category = [cat];
  }

  const hospital = ((raw.hospital ?? "") as string).trim();
  if (hospital) {
    resource.requester = { display: hospital };
  }

  // Dosage — three-level fallback:
  //   1. structured dose/unit/frequency from adapter (preferred)
  //   2. raw NHI 用法 text via dosage_text (Part 3 C6 scaffold)
  //   3. derived "${qty}/${days} days" from quantity + duration_days
  //      (Part 6 U4 — NHI 健保存摺 IHKE3306S02 doesn't expose 用法 as a
  //      separate field but DOES expose 給藥日數 + 給藥總量. The ratio
  //      is the only daily-frequency signal we get from NHI raw, so
  //      emit it as a transport-only text so clinicians see SOMETHING
  //      rather than nothing. Format intentionally generic — we don't
  //      know units (tablet vs ml) or timing (QD vs BID with halves).
  //      SMART app can choose to display raw or parse further.)
  const dosage: Record<string, any> = {};
  const parts: string[] = [];
  for (const k of ["dose", "unit", "frequency"] as const) {
    if (raw[k]) parts.push(String(raw[k]));
  }
  if (parts.length > 0) {
    dosage.text = parts.join(" ");
  } else if (raw.dosage_text) {
    const t = String(raw.dosage_text).trim();
    if (t) dosage.text = t;
  } else {
    // Level 3: derive from qty + days. Only fires when both > 0 to
    // avoid emitting "0/0 days" or partial nonsense.
    const qtyRaw = raw.quantity;
    const qtyNum =
      qtyRaw !== null && qtyRaw !== undefined && qtyRaw !== ""
        ? Number.parseFloat(String(qtyRaw).replace(/,/g, ""))
        : Number.NaN;
    const daysNum = Number.parseInt(String(raw.duration_days ?? 0), 10);
    if (Number.isFinite(qtyNum) && qtyNum > 0 && Number.isFinite(daysNum) && daysNum > 0) {
      // Render qty without trailing zeros (3.0 → "3", 1.5 stays).
      const qtyStr = Number.isInteger(qtyNum) ? String(qtyNum) : String(qtyNum);
      const perDay = qtyNum / daysNum;
      // Round daily rate to 2 decimals to avoid 0.6666666666 noise.
      // parseFloat round-trip strips trailing zeros: 1.50 → "1.5", 0.67 → "0.67".
      const perDayStr = Number.isInteger(perDay)
        ? String(perDay)
        : Number.parseFloat(perDay.toFixed(2)).toString();
      // P2-b (display precision, 2026-06-08): use NHI's own field labels
      // 給藥總量 / 給藥日數 verbatim instead of the previous synthesized
      // English "N dose(s) over M day(s) (≈ R/day)". Two reasons:
      //   1. Faithfulness — the old "dose(s)" word ASSERTED a dispensing
      //      unit ("dose") that NHI never supplies (IHKE3306S02 ships only
      //      給藥總量 + 給藥日數, no unit field). 給藥總量 is NHI's neutral
      //      count label, so we transport it verbatim and assert no unit.
      //   2. Display — zh-TW patient / clinician context matches the
      //      bundle's patient-facing .text convention (drug_name_zh,
      //      drug_class_zh, reasonCode 繁中).
      // The per-day figure stays a clearly-labelled 平均 (average) derived
      // value; every number here is 100% NHI-sourced (給藥總量 ÷ 給藥日數).
      dosage.text = `給藥總量 ${qtyStr}，給藥日數 ${daysNum} 天（平均每日 ${perDayStr}）`;
    }
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
      // P2-b (2026-06-08): emit value WITHOUT a unit. NHI IHKE3306S02
      // ships 給藥總量 as a bare count with NO dispensing-unit field
      // (drug obj = drug_name / order_code / order_drug_day / order_qty /
      // act only). The real unit (錠 / mL / 支 / 包 …) depends on the
      // dosage form and cannot be derived reliably from the drug code, so
      // per the faithful-transport rule we do NOT fabricate one — a bare
      // SimpleQuantity.value is FHIR R4 valid. The dosageInstruction text
      // carries the 給藥總量 label so consumers still know the number is
      // a "total dispensed quantity".
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
  const indicationZh = ((raw.indication_zh ?? "") as string).trim();
  const indicationCode = ((raw.indication_code ?? "") as string).trim();
  if (indication || indicationZh || indicationCode) {
    const rc: Record<string, any> = {};
    if (indicationCode) {
      rc.coding = [
        {
          system: systems.ICD_10_CM,
          code: normalizeIcd10Cm(indicationCode),
          display: indication || indicationZh || indicationCode,
        },
      ];
    }
    // Patient-facing reasonCode text: prefer 繁中 ICD description, fall
    // back to English, then to just the code. Always prefixed with the
    // code so SMART app rendering keeps "<code> <name>" shape.
    const nameZh = indicationZh || indication;
    if (nameZh) {
      rc.text = indicationCode ? `${indicationCode} ${nameZh}`.trim() : nameZh;
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
