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
  // IMPORTANT: `order_shortname` is NHI's UI-truncated label (~15 chars
  // + " ..."), suitable for their long-table display but NOT for FHIR
  // Observation.code.text — downstream SMART apps end up showing half
  // names like "PC Sugar 飯後 ..." with no field to recover the full
  // name from. Always prefer `assaY_ITEM_NAME` (the full item name,
  // typically bilingual like "PC Sugar 飯後兩小時血糖") and only fall
  // back to the shortname when the full name is genuinely absent.
  // Same priority applied to `code` and `display` so both
  // Observation.code.text and coding[].display carry the full label.
  const fullName = item.assaY_ITEM_NAME || item.order_shortname || "";
  return {
    date,
    order_code: item.ordeR_CODE || "",
    order_name: item.ordeR_NAME || "",
    code: fullName,
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
  function push(display, value, unit, refRange, category, code) {
    if (value === undefined || value === null) return;
    const v = String(value).trim();
    // Em-dash "—" (U+2014) is NHI's sentinel "no data" marker — drop.
    // Plain hyphen "-" is NOT a no-data marker per-field — it's the
    // clinical dipstick convention for "negative" (Urine Protein,
    // Urine UA dipstick). NHI's no-data flag for an entire row is
    // signalled by firsT_DIAG_DATE = "-" which the row-level date
    // guard at the top of adaptAdultPreventive already rejects, so
    // "-" reaching push() always means "the clinician wrote it down
    // as a negative result". Keep.
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
    });
  }
  // Vital signs
  push("Body Height", row.height, "cm", "", "vital-signs");
  push("Body Weight", row.weight, "kg", "", "vital-signs");
  push("BMI", row.bmi, "kg/m2", "", "vital-signs");
  push("Waist Circumference", row.waistline, "cm", "", "vital-signs");
  push("Systolic Blood Pressure", row.basE_SBP, "mmHg",
       row.bloD_PRESS_RESULT_TEXT || "", "vital-signs");
  push("Diastolic Blood Pressure", row.basE_EBP, "mmHg",
       row.bloD_PRESS_RESULT_TEXT || "", "vital-signs");
  // Lipid panel
  push("Cholesterol",   row.cho,     "mg/dL");
  push("Triglyceride",  row.bloD_TG, "mg/dL");
  push("HDL",           row.hdl,     "mg/dL");
  push("LDL",           row.ldl,     "mg/dL");
  // Liver function
  push("SGOT (AST)",    row.sgot,    "U/L", row.lF_DIAG_RESULT_TEXT || "");
  push("SGPT (ALT)",    row.sgpt,    "U/L", row.lF_DIAG_RESULT_TEXT || "");
  // Fasting glucose — NHI 醫令碼 09005C
  push("Glu-AC",        row.s_09005C, "mg/dL",
       row.s_09005C_DIAG_RESULT_TEXT || "", "laboratory", "09005C");
  // Renal function
  push("BUN",           row.urinE_BUN,   "mg/dL");
  push("Creatinine",    row.bloD_CREAT,  "mg/dL");
  push("eGFR",          row.egfr,        "mL/min/1.73m2",
       row.rF_DIAG_RESULT_TEXT || "");
  // Urine Protein dipstick is qualitative ("-" / "±" / "1+" / "2+" / "3+"
  // / "4+"). NHI returns the status code in `urinE_PROTEIN` ("0" / "1" /
  // "2" ...) and the text in `urinE_PROTEIN_TEXT` ("-" / "±" / "1+" ...).
  // Same code-vs-text trap as the HBV/HCV pair above — passing the code
  // as the observation value lands as valueQuantity = 0, looks like
  // "0 mg/dL protein" (wrong category of answer). Use the text.
  push("Urine Protein", row.urinE_PROTEIN_TEXT || "", "", "");
  // Hepatitis B/C screening.
  //
  // CRITICAL — read before "simplifying" the field choice:
  // NHI's IHKE3402 returns qualitative results as a status-code/text pair:
  //   - `hbsag` / `antI_HCV` are STATUS CODES ("1"=陰, "2"=陽, "3"=未檢驗)
  //   - `hbsaG_TEXT` / `antI_HCV_TEXT` are the human-readable result
  // Passing the status code as the observation value gets parsed as a
  // numeric quantity downstream → Observation.valueQuantity = 1, which a
  // SMART app surfaces as "HBsAg = 1" (looks like a real lab number).
  // Always use the _TEXT side as the value. When the test wasn't performed
  // _TEXT is empty and push() returns early, no observation emitted.
  //
  // For the referenceRange we pass the OVERALL panel interpretation
  // (hbV_RESULT_TEXT / hcV_RESULT_TEXT) — that's NHI's clinician-side
  // summary for the whole HBV/HCV panel.
  //
  // History: regressed in v0.6.3 (the adapter-extraction refactor copied
  // an older version of the function — the fix from 8f92f8d was lost
  // until v0.6.5 added the snapshot test + restored this code path).
  push("HBsAg",    row.hbsaG_TEXT   || "", "", row.hbV_RESULT_TEXT || "");
  push("Anti-HCV", row.antI_HCV_TEXT || "", "", row.hcV_RESULT_TEXT || "");
  // Uric acid — note: NHI's IHKE3402 schema also has a field called
  // `urinE_UA_DIAG_ACID` that LOOKS like urine UA but the values are
  // identical to `uriC_ACID` (serum, mg/dL). It's a misnamed duplicate
  // we deliberately skip — using both would create two FHIR
  // Observations with the same value but contradictory specimens.
  push("Uric Acid",     row.uriC_ACID,   "mg/dL");
  // Urine UA (qualitative urine dipstick test — distinct from the
  // mislabeled urinE_UA_DIAG_ACID above; this `urinE_UA` is the real
  // urine UA result, usually a +/- string or empty when not run).
  // Same code-vs-text pattern as urinE_PROTEIN — use the _TEXT field.
  push("Urine UA",      row.urinE_UA_DIAG_RESULT_TEXT || "", "", "");
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
