// NHI JSON → normalized shape adapters.
//
// Extracted from background.js so each adapter can be unit-tested in
// isolation. background.js imports everything below; the live SW glues
// these onto fetched payloads via the endpoint registry.
//
// Why extract: the v0.6.1 lab+imaging date-field bugs (commits b37885f /
// 8c19901) shipped because these functions had ZERO test coverage —
// background.js can't be loaded in a test environment (chrome.* APIs,
// SW globals), so the adapt* logic rode along untested. Pulling them
// into a pure-function module lets vitest verify field-priority
// decisions row-by-row.

// Convert NHI's 民國 date "115/05/05" → ISO "2026-05-05".
// Some NHI fields embed both ROC and Gregorian: "115/05/05||2026/05/05" — we
// just match the first segment.
export function rocToISO(rocDate) {
  if (!rocDate) return "";
  const m = String(rocDate).match(/^(\d{2,3})[/.-](\d{1,2})[/.-](\d{1,2})/);
  if (!m) return "";
  const y = parseInt(m[1], 10) + 1911;
  return `${y}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
}

// Inverse: ISO "2023-05-05" → ROC "112/05/05". Used to build NHI date-range
// query strings (their forms expect 民國 format).
export function isoToROC(isoDate) {
  if (!isoDate) return "";
  const m = String(isoDate).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (!m) return "";
  const y = parseInt(m[1], 10) - 1911;
  if (y < 1) return ""; // pre-民國 dates make no sense to NHI
  return `${y}/${m[2].padStart(2, "0")}/${m[3].padStart(2, "0")}`;
}

// NHI bilingual fields use "中文||English" — clinicians scan English faster,
// so prefer that side. If there's no `||` we just return the input trimmed.
export function pickEnglish(s) {
  if (s === null || s === undefined) return "";
  const str = String(s);
  const idx = str.indexOf("||");
  if (idx === -1) return str.trim();
  const en = str.slice(idx + 2).trim();
  return en || str.slice(0, idx).trim();
}

// Strip trailing punctuation / whitespace junk that some hospitals leave
// on their free-text lab labels (e.g. NHI returns "Crea," from one site
// and "Crea" from another for the same physical test). Pre-normalizing
// here means the Observation.code.text downstream reads cleanly even
// when downstream UIs still happen to render `code.text` instead of
// pulling display from the LOINC / NHI 醫令碼 coding.
function _cleanLabName(s) {
  if (s === null || s === undefined) return "";
  return String(s)
    .trim()
    .replace(/[,，;；]+\s*$/, "")  // trailing 半形 / 全形 punctuation
    .trim();
}

// Adapter for NHI lab/observation JSON shape (confirmed for IHKE3409S01;
// other lab endpoints likely use the same fields).
//
// Date field choice — IHKE3409 returns three date-ish fields per row:
//   - funC_DATE          就診日 / 入院日 (visit registration / admission)
//   - reaL_INSPECT_DATE  實際採檢日 (actual sample-collection date)
//   - assaY_UPLOAD_DATE  上傳日 (when the result hit NHI's server)
// For an inpatient, funC_DATE is the admission day and every lab drawn
// during the stay carries the same funC_DATE — using it as Observation.
// effectiveDateTime made all 住院期間 labs look like they were drawn
// on day 1. FHIR's "physiologically relevant time" for a lab Observation
// is the sample-collection date, so prefer reaL_INSPECT_DATE when NHI
// returns it; fall back to funC_DATE only when the inspect field is
// missing (older rows / endpoints that don't carry it).
export function adaptLabItem(item) {
  if (!item || typeof item !== "object") return null;
  const date = rocToISO(
    item.reaL_INSPECT_DATE || item.real_inspect_date || item.funC_DATE,
  );
  const value = item.assaY_VALUE;
  if (!date || value === undefined || value === null || value === "") return null;
  // Display name fallback chain (all normalized for trailing punctuation):
  //   1. assaY_ITEM_NAME — hospital's full free-text label
  //   2. order_shortname — NHI's UI-truncated label (often ends "...")
  //   3. ordeR_NAME      — NHI's canonical 醫令碼 dictionary name
  // assaY_ITEM_NAME wins by default because order_shortname can be cut
  // off mid-word ("PC Sugar 飯後 ..."), which is worse than a trailing-
  // comma cosmetic issue. ordeR_NAME is the last-resort Chinese formal
  // label.
  const fullName = _cleanLabName(item.assaY_ITEM_NAME)
                || _cleanLabName(item.order_shortname)
                || _cleanLabName(item.ordeR_NAME);
  const orderCode = String(item.ordeR_CODE || "").trim();
  return {
    date,
    order_code: orderCode,
    order_name: item.ordeR_NAME || "",
    // Prefer the NHI 醫令碼 ("09140C") as the FHIR coding code so the
    // downstream observation mapper routes it under NHI_MEDICAL_ORDER_
    // CODE system. SMART apps group lab tests by coding code; using
    // free-text here is what causes "Crea" and "Crea," to be split
    // into two distinct tests. Fallback to the cleaned display when
    // NHI doesn't supply an order code (older / edge-case rows).
    code: orderCode || fullName,
    display: fullName,
    value: String(value),
    unit: item.uniT_DATA || "",
    reference_range: item.consulT_VALUE || item.short_CONSULT_VALUE || "",
    hospital: item.hosP_ABBR || "",
  };
}

// IHKE3306S01 returns visit-level rows ONLY (no drug names). The actual drug
// list lives at IHKE3306S02/page_load?crid=<row_ID>&ctype=2, in
// `ihke3306S02_main_data[*].sp_IHKE3306S03_data_list`. We do that 2-step
// fetch separately; this function adapts a single drug entry given its
// parent visit context.
export function adaptMedicationFromDetail(drug, visit) {
  if (!drug || typeof drug !== "object") return null;
  // visit.func_DATE is "115/05/05||2026/05/05" — rocToISO matches the ROC
  // prefix correctly.
  const date = rocToISO(visit?.func_DATE || visit?.func_date || "");
  const drug_name = pickEnglish(drug.drug_name || drug.druG_NAME || "");
  if (!date || !drug_name) return null;
  const days = Number(drug.order_drug_day || drug.order_DRUG_DAY || 0);
  return {
    date,
    drug_name,
    code: drug.order_code || drug.ordeR_CODE || "",
    // List endpoint doesn't expose dose/frequency/route — only days + qty.
    dose: "",
    frequency: "",
    route: "",
    quantity: drug.order_qty || drug.order_QTY || "",
    duration_days: Number.isFinite(days) ? days : 0,
    // pickEnglish on icd_name turns 良性攝護腺...||Benign prostatic... into the EN side.
    indication: pickEnglish(visit?.icd9cm_CODE_CNAME || visit?.icd9cm_name || ""),
    indication_code: visit?.icd9cm_CODE || visit?.icd9cm_code || "",
    drug_class: pickEnglish(drug.act || ""),
    hospital: visit?.hosp_ABBR || visit?.hosp_abbr || "",
  };
}

// Stub kept for the endpoint registry — IHKE3306S01 list never has drugs,
// so we always return null and rely on the 2-step detail fetch above.
export function adaptMedication() { return null; }

// Same shape as adaptMedication: IHKE3408S01 (imaging list) only carries
// order-level data; the actual report narrative comes from the IHKE3408S02
// detail fan-out (see adaptImagingReportFromDetail). Returning null from
// the list adapter ensures no half-formed DiagnosticReports leak through.
export function adaptImagingListStub() { return null; }

// IHKE3209S01 (重大傷病) — NHI's officially-vetted catastrophic-illness
// registry. Each row is a serious chronic condition (cancer, autoimmune,
// transplant follow-up, dialysis, etc.) the patient is currently
// registered for. This is the closest thing 健康存摺 exposes to a
// curated problem list — far stronger signal than reverse-engineering
// chronic conditions from encounter ICDs.
//
// Maps to FHIR Condition with category=problem-list-item so downstream
// SMART apps / IPS profiles surface it in their problem-list view.
//
// Payload shape (live capture):
//   sP_IHKE3209S01: [
//     { hosP_ID, hosP_ABBR, hosP_URL,
//       icD10CM_CNAME: "攝護腺惡性腫瘤",  ← Chinese narrative only
//       valiD_S_DATE:  "111/11/16",       ← certification valid-from (ROC)
//       valiD_E_DATE:  "116/11/15" }      ← certification valid-until (ROC, ~5y)
//   ]
//
// Caveats deliberately encoded:
//   - NHI doesn't return the ICD-10-CM code in this endpoint, only the
//     Chinese label. We leave `code` empty; mapCondition falls back to
//     display-as-id for stableId (mirroring diagnostic-report.ts).
//   - valiD_E_DATE is when the CARD expires (renewed every ~5y), NOT
//     when the disease resolved. We deliberately do NOT map it to
//     abatementDateTime — that would falsely imply the condition stopped.
//   - All rows here are currently active by definition; NHI only returns
//     valid certifications. clinical_status hard-coded to "active".
//   - severity stored as text ("Severe (重大傷病)") because the formal
//     severity code mapping (SNOMED 24484000 etc.) needs more thought.
export function adaptCatastrophicIllness(item) {
  if (!item || typeof item !== "object") return null;
  const display = pickEnglish(item.icD10CM_CNAME || item.icd10cm_cname || "");
  if (!display) return null;
  return {
    display,
    code: "",
    system: "",
    onset_date: rocToISO(item.valiD_S_DATE || item.valid_s_date || ""),
    recorded_date: rocToISO(item.valiD_S_DATE || item.valid_s_date || ""),
    category: "problem-list-item",
    severity: "Severe (重大傷病)",
    hospital: item.hosP_ABBR || item.hosp_abbr || "",
    clinical_status: "active",
  };
}

// IHKE3402S01 (成人預防保健結果) — one row per screening event, flat
// schema. NHI runs the panel itself and returns vitals + a fixed
// battery of lab values pre-computed (BMI / waist / BP / lipids / LFT
// / RFT / fasting glucose / HBsAg / Anti-HCV / uric acid …).
// We unfold one row into ~15 Observations: vitals go to category
// vital-signs (so SMART apps' vitals views pick them up), labs go to
// category laboratory. Returns an ARRAY — caller must flat-map.
export function adaptAdultPreventive(row) {
  if (!row || typeof row !== "object") return null;
  const date = rocToISO(row.firsT_DIAG_DATE || "");
  if (!date) return null;
  const hospital = row.hosP_ABBR || row.hosp_ABBR || "";
  const out = [];
  // (display, value, unit, refRange, category, NHI code)
  // (display, value, unit, refRange, category, code)
  // Every observation emitted from this adapter carries source_program=
  // "adult-preventive" so downstream FHIR consumers can identify the
  // origin programme via Observation.meta.tag (separate from the
  // sync-page-type / sync-run-id sync-tracking tags).
  function push(display, value, unit, refRange, category, code) {
    if (value === undefined || value === null) return;
    const v = String(value).trim();
    // Em-dash "—" (U+2014) is NHI's sentinel "no data" marker — drop.
    // Plain hyphen "-" is NOT a no-data marker per-field — it's the
    // clinical dipstick convention for "negative" (Urine Protein).
    // NHI's no-data flag for an entire row is signalled by
    // firsT_DIAG_DATE = "-" which the row-level date guard at the top
    // of adaptAdultPreventive already rejects, so "-" reaching push()
    // always means "the clinician wrote it down as a negative result".
    if (v === "" || v === "—") return;
    out.push({
      date,
      hospital,
      category: category || "laboratory",
      order_code: code || "",
      order_name: display,
      code: code || display,
      display,
      value: v,
      unit: unit || "",
      reference_range: refRange || "",
      // Source-programme tag — added to Observation.meta.tag by the
      // mapper; lets SMART apps filter / categorize "this came from
      // 成人預防保健 screening".
      source_program: "adult-preventive",
    });
  }
  // Vital signs (no NHI 醫令碼 — these are screening measurements, not
  // lab orders; they have canonical LOINCs which findLoinc's keyword
  // search resolves cleanly via unique terms like "body height" / "bmi"
  // — no prefix-collision risk with other LOINC_MAP keys).
  push("Body Height", row.height, "cm", "", "vital-signs");
  push("Body Weight", row.weight, "kg", "", "vital-signs");
  push("BMI", row.bmi, "kg/m2", "", "vital-signs");
  push("Waist Circumference", row.waistline, "cm", "", "vital-signs");
  push("Systolic Blood Pressure", row.basE_SBP, "mmHg",
       row.bloD_PRESS_RESULT_TEXT || "", "vital-signs");
  push("Diastolic Blood Pressure", row.basE_EBP, "mmHg",
       row.bloD_PRESS_RESULT_TEXT || "", "vital-signs");
  // All chemistry / hep panel rows pin the NHI 醫令碼 so findLoinc takes
  // the NHI_TO_LOINC direct-lookup path — bypasses the keyword search
  // entirely. Mapping cross-verified against three sources: the NHI UI
  // section labels (健康存摺 成人預防保健), the IHKE3402 JSON field
  // names, and the existing NHI_TO_LOINC table comments.
  //
  // Lipid panel
  push("Cholesterol",   row.cho,     "mg/dL", "", "laboratory", "09001C");  // → LOINC 2093-3
  push("Triglyceride",  row.bloD_TG, "mg/dL", "", "laboratory", "09004C");  // → LOINC 2571-8
  push("HDL",           row.hdl,     "mg/dL", "", "laboratory", "09043C");  // → LOINC 2085-9
  push("LDL",           row.ldl,     "mg/dL", "", "laboratory", "09044C");  // → LOINC 13457-7 (calc)
  // Liver function
  push("SGOT (AST)",    row.sgot,    "U/L", row.lF_DIAG_RESULT_TEXT || "", "laboratory", "09025C");  // → LOINC 1920-8
  push("SGPT (ALT)",    row.sgpt,    "U/L", row.lF_DIAG_RESULT_TEXT || "", "laboratory", "09026C");  // → LOINC 1742-6
  // Fasting glucose
  push("Glu-AC",        row.s_09005C, "mg/dL",
       row.s_09005C_DIAG_RESULT_TEXT || "", "laboratory", "09005C");        // → LOINC 1558-6
  // Renal function — `urinE_BUN` is NHI's misleading field name; the
  // value IS serum BUN (Blood Urea Nitrogen), not a urine test.
  push("BUN",           row.urinE_BUN,   "mg/dL", "", "laboratory", "09002C");  // → LOINC 3094-0
  push("Creatinine",    row.bloD_CREAT,  "mg/dL", "", "laboratory", "09015C");  // → LOINC 2160-0
  // eGFR — derived from Creatinine, no own NHI 醫令碼. Display keyword
  // "egfr" resolves to LOINC 33914-3 via findLoinc.
  push("eGFR",          row.egfr,        "mL/min/1.73m2",
       row.rF_DIAG_RESULT_TEXT || "");
  // Urine Protein dipstick — qualitative ("-" / "±" / "1+" ...).
  // urinE_PROTEIN is the status code, urinE_PROTEIN_TEXT is the
  // displayable result (passed as value). The specific NHI 醫令碼 for
  // preventive-screening urine protein isn't in our NHI_TO_LOINC table
  // yet; the keyword "urine protein" resolves to LOINC 20454-5 via
  // findLoinc (after the v0.6.7 longest-match fix).
  push("Urine Protein", row.urinE_PROTEIN_TEXT || "", "", "");
  // Hepatitis B/C screening — status code vs _TEXT trap documented at
  // length below. NHI 醫令碼 pinned so findLoinc takes the NHI_TO_LOINC
  // path (otherwise the keyword "hb" prefix-collides with the more
  // specific "hbsag" — the bug originally reported in v0.6.5).
  //   14032C → LOINC 5196-1  (HBsAg, Mass/vol)
  //   14051C → LOINC 13955-0 (HCV antibody, Serum or Plasma)
  // History: regressed in v0.6.3, fix lost until v0.6.5; NHI 醫令碼
  // pinning added v0.6.6 + v0.6.8.
  push("HBsAg",    row.hbsaG_TEXT   || "", "", row.hbV_RESULT_TEXT || "", "laboratory", "14032C");
  push("Anti-HCV", row.antI_HCV_TEXT || "", "", row.hcV_RESULT_TEXT || "", "laboratory", "14051C");
  // Uric acid (blood) — `uriC_ACID` field. NHI 醫令碼 09013C → LOINC
  // 3084-1 (Urate Mass/vol S/P).
  //
  // NHI's IHKE3402 schema ALSO carries two related-looking-but-distinct
  // fields we deliberately skip:
  //   - urinE_UA_DIAG_ACID — empirically duplicates serum uric acid;
  //     emitting it would create a duplicate Observation.
  //   - urinE_UA / urinE_UA_DIAG_RESULT_TEXT — claim to be a urine UA
  //     dipstick but DON'T appear anywhere in NHI's 健康存摺 UI for
  //     adult preventive screening (the 尿液檢查 section only shows
  //     尿液蛋白質). Always empty / "-" in observed payloads. Legacy
  //     schema field with no clinical reality — do NOT emit.
  push("Uric Acid",     row.uriC_ACID,   "mg/dL", "", "laboratory", "09013C");
  // Metabolic syndrome screening — value is an interpretation string
  // ('正常' / '異常，建議：請洽詢醫師'), not a number. The mapper's
  // _try_parse_quantity will return None and it falls through to
  // valueString. No mapped LOINC keyword (yet) so this lands as an
  // Observation with code.text only; downstream consumers can still
  // surface it under the patient's screening section by code.text.
  push("代謝症候群篩檢 (Metabolic Syndrome Screening)",
       row.metA_SYNDR_RESULT_TEXT, "", "");
  return out;
}

// IHKE3309S01 (住院 inpatient list) — gives proper admission/discharge.
// Shape: {hosp_ID, hosp_ABBR, hosp_url, in_DATE, out_DATE,
//         icd9cm_CODE, icd9cm_CODE_CNAME, ori_TYPE("3"), row_ID, ...}
// IHKE3308S01 has the same shape for a small set of older 住院 records;
// `func_DATE` instead of `in_DATE` in some rows — adapter accepts both.
export function adaptInpatientEncounter(item) {
  if (!item || typeof item !== "object") return null;
  const start = rocToISO(item.in_DATE || item.func_DATE || "");
  const end = rocToISO(item.out_DATE || "");
  if (!start) return null;
  // icd9cm name on 住院 list is just Chinese (no || English split observed).
  const icdCode = item.icd9cm_CODE || item.icd9cm_code || "";
  const icdName = pickEnglish(item.icd9cm_CODE_CNAME || item.icd9cm_name || "");
  return {
    date: start,
    end_date: end,
    class: "IMP",
    type_display: "住院",
    department: "",
    provider: "",
    reason: icdName ? (icdCode ? `${icdCode} ${icdName}` : icdName) : "",
    hospital: item.hosp_ABBR || item.hosp_abbr || "",
    row_id: item.row_ID || item.row_id || "",
  };
}

// IHKE3303S01 (醫療費用申報) item shape — far more complete than the older
// IHKE3301S02 visit list (51 visits vs 6 for the test patient). NHI's
// canonical source of truth for "every billed encounter".
//   hosP_ID, hosP_ABBR, hosp_url
//   funC_DATE              (民國 YYY/MM/DD)
//   icD9CM_CODE / icD9CM_CODE_CNAME
//   orI_TYPE / ori_type_name   ("IC卡資料" / "申報資料") — origin, NOT 門/急/住
//   part_AMT, appl_DOT, …   (billing — discarded)
//   roW_ID                  detail key for IHKE3303S02 fan-out (Phase B)
// We don't have visit class (門/急/住) at the list level; the S02 detail
// has hosp_DATA_TYPE_NAME ("西醫"/"中醫"/"牙醫"). For now default AMB.
export function adaptEncounterFromMedExpense(item, classHint) {
  if (!item || typeof item !== "object") return null;
  const date = rocToISO(item.funC_DATE || item.func_DATE || item.func_date || "");
  if (!date) return null;
  const icdCode = item.icD9CM_CODE || item.icd9cm_CODE || item.icd9cm_code || "";
  const icdName = pickEnglish(
    item.icD9CM_CODE_CNAME || item.icd9cm_CODE_CNAME || item.icd9cm_name || ""
  );
  // class defaults to AMB; IHKE3303S02 detail fan-out may override to
  // EMER / IMP based on hosp_DATA_TYPE_NAME (急診 / 住院).
  return {
    date,
    end_date: "",
    class: classHint || "AMB",
    // Origin marker isn't a clinical class, but stash it as type_display
    // so downstream sees the NHI label without us inventing one.
    type_display: item.ori_type_name || item.orI_TYPE_NAME || "",
    department: "",
    provider: "",
    reason: icdName ? (icdCode ? `${icdCode} ${icdName}` : icdName) : "",
    hospital: item.hosP_ABBR || item.hosp_ABBR || item.hosp_abbr || "",
    // Pass through for the eventual IHKE3303S02 detail fetch (Phase B).
    row_id: item.roW_ID || item.row_id || "",
  };
}

export function adaptAllergy(item) {
  if (!item || typeof item !== "object") return null;
  const allergen =
    item.allergen_name || item.alleR_NAME || item.medname ||
    item.druG_NAME || item.allergen || "";
  if (!allergen) return null;
  return {
    recorded_date: rocToISO(item.funC_DATE || item.recorD_DATE || ""),
    display: allergen,
    category: "medication",
    criticality: "unable-to-assess",
    reaction: item.reactioN || item.symptom || "",
  };
}

// IHKE3301S05 (處置/手術 list) shape:
//   {hosp_id, hosp_abbr, hosp_url, ori_type_name, ori_type, func_date,
//    out_date, icd9cm_code, icd9cm_code_cname, op_code_cname, row_id}
// Note: no procedure CODE in list — op_code_cname is the only label.
// Date note: NHI doesn't expose a separate "actual procedure date" here,
// so for inpatient procedures (where func_date = admission, out_date =
// discharge) we deliberately use func_date as the anchor. The procedure
// "happened somewhere in this admission" — anchoring to the start day
// is a small loss of accuracy vs. inventing a performedPeriod that would
// suggest the procedure spanned the whole stay.
export function adaptProcedure(item) {
  if (!item || typeof item !== "object") return null;
  const date = rocToISO(item.func_date || item.funC_DATE);
  const display = pickEnglish(
    item.op_code_cname || item.proC_NAME || item.ordeR_NAME || ""
  );
  if (!date || !display) return null;
  // Diagnosis (icd9cm_code_cname) is the *reason* for the procedure, not
  // the procedure code itself. Stash it in `note` so it shows up in the
  // FHIR resource without polluting the code field.
  const reasonCode = item.icd9cm_code || item.icd9cm_CODE || "";
  const reasonName = pickEnglish(item.icd9cm_code_cname || item.icd9cm_CODE_CNAME || "");
  const note = reasonName
    ? (reasonCode ? `Reason: ${reasonCode} ${reasonName}` : `Reason: ${reasonName}`)
    : "";
  return {
    date,
    code: "",
    display,
    note,
    body_site: "",
    hospital: item.hosp_abbr || item.hosP_ABBR || "",
  };
}

// IHKE3408S01 (影像檢查 list) shape:
//   {hosp_ID, hosp_ABBR, hosp_url, real_INSPECT_DATE, order_CODE,
//    order_CODE_2Word, order_NAME, ori_TYPE, row_ID, jpG_STATUS, ...}
// No findings/conclusion — list is order-level only. We map to Procedure
// (an exam was performed) rather than DiagnosticReport (which needs a
// narrative). If/when we fetch the actual report this becomes a DR.
// IHKE3408S02 detail provides the full radiology / endoscopy report in
// `desc`. Combined with order_NAME + the exam date this is a proper FHIR
// DiagnosticReport. List-only entries (where the detail fetch returned
// no `desc`) get dropped — without a narrative the report mapper would
// reject them anyway.
//
// Date field choice — IHKE3408S02 detail payload exposes:
//   - real_INSPECT_DATE  實際採檢/做影像日 (most accurate when present)
//   - func_DATE          就診/入院日 (visit anchor)
//   - assay_UPLOAD_DATE  報告上傳時間 (often weeks after the exam —
//                        belongs to DiagnosticReport.issued, NOT
//                        effectiveDateTime)
// In practice real_INSPECT_DATE is often null on the S02 detail
// (confirmed against live NHI payloads); we then fall back to
// func_DATE rather than the upload time. Falling back to the
// upload date would land the exam in a date that's even further
// from reality (e.g. CT done 2026/01/14, upload 2026/02/24 → using
// upload date would say "had a CT on 2026/02/24" which is wrong).
// func_DATE at worst means "exam happened during this admission".
export function adaptImagingReportFromDetail(item) {
  if (!item || typeof item !== "object") return null;
  const date = rocToISO(
    item.real_INSPECT_DATE || item.real_inspect_date ||
    item.func_DATE || item.func_date || "",
  );
  const display = pickEnglish(item.order_NAME || item.order_name || "");
  const conclusion = (item.desc || "").trim();
  if (!date || !display || !conclusion) return null;
  return {
    date,
    code: item.order_CODE || item.order_code || "",
    system: "",
    display,
    category: "RAD",
    conclusion,
    hospital: item.hosp_ABBR || item.hosp_abbr || "",
    // NHI separates the exam date (func_DATE) from the report-upload
    // timestamp (assay_UPLOAD_DATE). The latter is when the report
    // was finalised in NHI's system — maps to DiagnosticReport.issued.
    // Falls back to None if NHI didn't ship one.
    issued: rocToISO((item.assay_UPLOAD_DATE || "").split(/\s+/)[0]),
  };
}
