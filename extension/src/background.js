// Service worker for NHI-FHIR Bridge — owns the long-running
// "Sync This Patient" workflow so the popup can close mid-sync without
// aborting it.
//
// Lifecycle:
//   - popup posts {type: "startNhiApiSync", payload}  → NHI JSON-API sync
//   - background runs the full sync sequence, updating chrome.storage.local
//   - popup reads chrome.storage.local on reopen to show progress
//
// Modes:
//   - "local"   → after NHI fetch, run mappers in-extension, download a
//                 FHIR Bundle to the user's machine. No backend required.
//   - "backend" → POST per-page_type items to /sync/upload-structured
//                 (existing behaviour); dashboard + SMART app use the
//                 backend's FHIR store.

import {
  GROUP_HANDLERS,
  LIST_HANDLERS,
  dedupAdmissionDayAmb,
  derivePatientId,
  linkEncountersInResources,
  mapPatient,
  maskId,
  maskName,
  resolveSexStratifiedRanges,
} from "@nhi-fhir-bridge/mapper";

const STORAGE_KEY = "syncStatus";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Cancellation flag set by popup's stop button. Checked at strategic points
// in runNhiApiSync (between phases, before each detail page) so the
// in-progress sync exits promptly when the user hits Stop. Cleared at the
// start of each new sync run.
let _cancelled = false;
// Context for the in-flight sync so the stopSync handler can wipe partial
// data without the popup needing to pass it back. Set at the top of
// runNhiApiSync; cleared on completion (success/failure/cancel).
let _activeSyncCtx = null;
const CANCEL_ERROR = "__SYNC_CANCELLED__";
// Thrown when NHI detects the session has expired (login page rendered, or
// tab redirected to auth namespace). Aborts sync immediately so the user can
// re-login and retry instead of timing out on every remaining page.
const SESSION_EXPIRED_ERROR = "__SESSION_EXPIRED__";
// Errors that should abort the entire sync instead of being swallowed
// per-phase.
const ABORT_ERRORS = new Set([CANCEL_ERROR, SESSION_EXPIRED_ERROR]);
function checkCancel() {
  if (_cancelled) throw new Error(CANCEL_ERROR);
}

async function setStatus(partial) {
  // After cancellation, the popup has already written the definitive
  // "stopped" status — silence any further progress writes from the
  // in-flight sync code so the UI doesn't bounce while it unwinds.
  if (_cancelled) return;
  const prev = (await chrome.storage.local.get(STORAGE_KEY))[STORAGE_KEY] || {};
  const next = { ...prev, ...partial, ts: Date.now() };
  await chrome.storage.local.set({ [STORAGE_KEY]: next });
  // Broadcast to any open popup. If no listener (popup closed),
  // sendMessage rejects — swallow.
  chrome.runtime.sendMessage({ type: "syncProgress", status: next }).catch(() => {});
}

// ── NHI API-direct sync (parallel, no LLM) ─────────────────────────────────
//
// Instead of navigating the user's tab to each NHI page, waiting for Vue to
// render, capturing HTML, then sending it through LLM extraction, we call
// NHI's underlying JSON API endpoints directly. The 健保署 SPA fronts a set
// of REST endpoints under /api/ihke3000/<page>/* that return well-formed
// JSON; calling them in parallel cuts a 5-10 minute sync to ~10 seconds and
// removes the LLM cost entirely.

const NHI_HOST = "myhealthbank.nhi.gov.tw";

// Convert NHI's 民國 date "115/05/05" → ISO "2026-05-05".
// Some NHI fields embed both ROC and Gregorian: "115/05/05||2026/05/05" — we
// just match the first segment.
function rocToISO(rocDate) {
  if (!rocDate) return "";
  const m = String(rocDate).match(/^(\d{2,3})[/.-](\d{1,2})[/.-](\d{1,2})/);
  if (!m) return "";
  const y = parseInt(m[1], 10) + 1911;
  return `${y}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
}

// Inverse: ISO "2023-05-05" → ROC "112/05/05". Used to build NHI date-range
// query strings (their forms expect 民國 format).
function isoToROC(isoDate) {
  if (!isoDate) return "";
  const m = String(isoDate).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (!m) return "";
  const y = parseInt(m[1], 10) - 1911;
  if (y < 1) return ""; // pre-民國 dates make no sense to NHI
  return `${y}/${m[2].padStart(2, "0")}/${m[3].padStart(2, "0")}`;
}

// NHI bilingual fields use "中文||English" — clinicians scan English faster,
// so prefer that side. If there's no `||` we just return the input trimmed.
function pickEnglish(s) {
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
function adaptLabItem(item) {
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
function adaptMedicationFromDetail(drug, visit) {
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
function adaptMedication() { return null; }

// IHKE3402S01 (成人預防保健結果) — one row per screening event, flat
// schema. NHI runs the panel itself and returns vitals + a fixed
// battery of lab values pre-computed (BMI / waist / BP / lipids / LFT
// / RFT / fasting glucose / HBsAg / Anti-HCV / uric acid …).
// We unfold one row into ~15 Observations: vitals go to category
// vital-signs (so SMART apps' vitals views pick them up), labs go to
// category laboratory. Returns an ARRAY — caller must flat-map.
function adaptAdultPreventive(row) {
  if (!row || typeof row !== "object") return null;
  const date = rocToISO(row.firsT_DIAG_DATE || "");
  if (!date) return null;
  const hospital = row.hosP_ABBR || row.hosp_ABBR || "";
  const out = [];
  // (display, value, unit, refRange, category, NHI code)
  function push(display, value, unit, refRange, category, code) {
    if (value === undefined || value === null) return;
    const v = String(value).trim();
    if (v === "" || v === "-" || v === "—") return;
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
  push("Urine Protein", row.urinE_PROTEIN, "",
       row.urinE_PROTEIN_TEXT || "");
  // Hepatitis B/C screening
  push("HBsAg",         row.hbsag,       "", row.hbsaG_TEXT || "");
  push("Anti-HCV",      row.antI_HCV,    "", row.antI_HCV_TEXT || "");
  // Uric acid — note: NHI's IHKE3402 schema also has a field called
  // `urinE_UA_DIAG_ACID` that LOOKS like urine UA but the values are
  // identical to `uriC_ACID` (serum, mg/dL). It's a misnamed duplicate
  // we deliberately skip — using both would create two FHIR
  // Observations with the same value but contradictory specimens.
  push("Uric Acid",     row.uriC_ACID,   "mg/dL");
  // Urine UA (qualitative urine dipstick test — distinct from the
  // mislabeled urinE_UA_DIAG_ACID above; this `urinE_UA` is the real
  // urine UA result, usually a +/- string or empty when not run).
  push("Urine UA",      row.urinE_UA,    "",
       row.urinE_UA_DIAG_RESULT_TEXT || "");
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
function adaptInpatientEncounter(item) {
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
function adaptEncounterFromMedExpense(item, classHint) {
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

function adaptAllergy(item) {
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
function adaptProcedure(item) {
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
// `desc`. Combined with order_NAME + func_DATE this is a proper FHIR
// DiagnosticReport. List-only entries (where the detail fetch returned
// no `desc`) get dropped — without a narrative the report mapper would
// reject them anyway.
function adaptImagingReportFromDetail(item) {
  if (!item || typeof item !== "object") return null;
  const date = rocToISO(item.func_DATE || item.func_date || "");
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

function adaptDiagReport(item) {
  if (!item || typeof item !== "object") return null;
  const date = rocToISO(item.funC_DATE);
  const display = item.ordeR_NAME || item.assaY_ITEM_NAME || item.examName || "";
  if (!date || !display) return null;
  const conclusion =
    item.report || item.findingS || item.imP_DATA || item.consulT_VALUE || "";
  if (!conclusion) return null;
  return {
    date,
    code: item.ordeR_CODE || "",
    system: "",
    display,
    category: "RAD",
    conclusion,
  };
}

// page_type → backend page_type string used by mappers.
// path is relative to nhiBase. method default "GET".
// `supportsDateRange: true` = endpoint accepts s_date / e_date in 民國 format.
// Confirmed via URLs observed in NHI's SPA. Other endpoints either don't
// accept range params, or NHI rejects unknown params — we leave them alone
// (they fall back to their default window, typically 1-2 years).
// User-facing label for each endpoint name. The breakdown collapsible
// in the popup ("查看明細") reads from this so users see "就醫 12 筆"
// instead of the dev-flavoured "encounters=12/12". Unknown names fall
// through to the raw key, which keeps it obvious during development
// when we add a new endpoint and haven't labelled it yet.
const ENDPOINT_LABEL_ZH = {
  encounters: "就醫",
  inpatient: "住院",
  inpatient_legacy: "住院（舊）",
  procedures: "手術 / 處置",
  medications: "處方藥品",
  allergies: "藥物過敏",
  allergies_b: "藥物過敏（B）",
  adult_preventive: "成人健檢",
  cancer_screening: "癌症篩檢",
  imaging: "影像檢查",
  other_labs: "檢驗",
};

const NHI_API_ENDPOINTS = [
  // encounters / procedures don't have a /search variant (404). page_load
  // silently ignores s_date / e_date — verified the array length is
  // identical with or without dates. Date filter is effectively unsupported
  // for these endpoints; they return all data in NHI's lifetime window.
  // Encounter source: IHKE3303S01 (醫療費用申報). The /page_load variant
  // is window-limited to ~1 year (returned 51 visits ending 114/05);
  // /search accepts s_date / e_date and goes back further (162 visits
  // to 112/05 for the same patient). Since labs/meds extend to 3y via
  // their own /search endpoints, encounter MUST also use /search or
  // the (hospital, date) linker has nothing to match against for older
  // lab dates.
  { name: "encounters",          path: "/api/ihke3000/ihke3303s01/search?s_date=&e_date=",
    page_type: "encounters",        adapt: adaptEncounterFromMedExpense, supportsDateRange: true },
  // Inpatient (住院) — IHKE3309S01 is the primary list with in_DATE/out_DATE
  // span. IHKE3308S01 carries a small set of older 住院 records with the
  // same fields (func_DATE in some rows instead of in_DATE; adapter
  // handles both). Both feed the same encounter mapper.
  { name: "inpatient",           path: "/api/ihke3000/ihke3309s01/page_load",
    page_type: "encounters",        adapt: adaptInpatientEncounter },
  { name: "inpatient_legacy",    path: "/api/ihke3000/ihke3308s01/page_load",
    page_type: "encounters",        adapt: adaptInpatientEncounter },
  { name: "procedures",          path: "/api/ihke3000/ihke3301s05/page_load",
    page_type: "procedures",        adapt: adaptProcedure },
  // medications: page_load only accepts empty dates (HTTP 400 otherwise).
  // The /search endpoint is what the SPA hits when user picks a custom
  // date range and accepts ISO 西元 dates with dashes (2023-01-01).
  // Confirmed via DevTools observation of the 篩選 panel submit.
  { name: "medications",         path: "/api/ihke3000/ihke3306s01/search?s_date=&e_date=&s_sort=A1&s_type=A",
    page_type: "medications",       adapt: adaptMedication, supportsDateRange: true },
  { name: "allergies",           path: "/api/ihke3000/ihke3202s01/SP_IHKE3202S01",
    page_type: "allergies",         adapt: adaptAllergy },
  { name: "allergies_b",         path: "/api/ihke3000/ihke3202s01/SP_IHKE3202S04",
    page_type: "allergies",         adapt: adaptAllergy },
  // 成人預防保健結果 (IHKE3402S01): one row per screening, contains
  // BMI / vitals / lipid panel / LFT / RFT / Hep B/C / uric acid all
  // pre-computed by NHI's screening programme. adaptAdultPreventive
  // returns an array (one Observation per measurement) so the
  // adapter-call loop flattens it.
  { name: "adult_preventive",    path: "/api/ihke3000/ihke3402s01/SP_IHKE3402S01",
    page_type: "observations",      adapt: adaptAdultPreventive },
  { name: "cancer_screening",    path: "/api/ihke3000/ihke3404s01/SP_IHKE3404S01",
    page_type: "observations",      adapt: adaptLabItem },
  // glucose (IHKE3406S01) + lipid (IHKE3407S01) are subsets of
  // other_labs (IHKE3409S01) per NHI's data model — fetching them
  // separately just creates dup observations, so we skip them.
  // Imaging list (IHKE3408S01) only carries order-level data; full
  // narrative report lives at IHKE3408S02. We do a 2-step fetch (see
  // _fetchImagingDetailsInTab) to grab the report, then map to a real
  // DiagnosticReport. The list adapter is a no-op stub like medications.
  // imaging: search endpoint accepts ISO date range like medications.
  { name: "imaging",             path: "/api/ihke3000/ihke3408s01/search?s_type=&s_date=&e_date=&s_sort=A1",
    page_type: "diagnostic_reports", adapt: () => null, supportsDateRange: true },
  // other_labs already uses /search; same ISO-dash date format works.
  { name: "other_labs",          path: "/api/ihke3000/ihke3409s01/search?s_type=&s_date=&e_date=&s_sort=A1",
    page_type: "observations",      adapt: adaptLabItem, supportsDateRange: true },
];

// Apply a {start, end} ISO date range to an endpoint path:
//   - If path already has s_date= placeholders, fill them in.
//   - Otherwise append s_date=...&e_date=... to the query string.
// Endpoints without `supportsDateRange` pass through unchanged.
function applyDateRangeToPath(path, dateRange) {
  if (!dateRange || (!dateRange.start && !dateRange.end)) return path;
  // NHI expects 西元 ISO dates with dashes: 2023-01-01 (not 民國, not
  // slashes). Confirmed by observing the SPA's request when user picks
  // a custom date range. URL-encoding the dashes is unnecessary.
  const s = (dateRange.start || "").slice(0, 10);
  const e = (dateRange.end || "").slice(0, 10);
  let p = path;
  if (/[?&]s_date=/.test(p)) {
    p = p.replace(/([?&]s_date=)[^&]*/, `$1${s}`);
  } else {
    p += (p.includes("?") ? "&" : "?") + `s_date=${s}`;
  }
  if (/[?&]e_date=/.test(p)) {
    p = p.replace(/([?&]e_date=)[^&]*/, `$1${e}`);
  } else {
    p += `&e_date=${e}`;
  }
  return p;
}

// Fan out IHKE3306S02 detail fetches inside the NHI tab so cookies + JWT
// auth flow naturally. We pass the visit list (just row_IDs + their parent
// fields needed for adaptation) into the tab; the tab returns parallel
// fetched bodies; we adapt back in the SW.
async function _fetchMedicationDetailsInTab({ tabId, baseUrl, visits }) {
  const reqs = visits
    .map((v) => ({
      row_ID: v.row_ID || v.rowid || v.rowID || "",
      // Keep parent fields needed by adaptMedicationFromDetail.
      parent: {
        func_DATE: v.func_DATE || v.func_date || "",
        icd9cm_CODE: v.icd9cm_CODE || v.icd9cm_code || "",
        icd9cm_CODE_CNAME: v.icd9cm_CODE_CNAME || v.icd9cm_name || "",
        hosp_ABBR: v.hosp_ABBR || v.hosp_abbr || "",
      },
    }))
    .filter((r) => r.row_ID);
  if (reqs.length === 0) return [];

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: async (base, items) => {
      const token = sessionStorage.getItem("token");
      if (!token) return { error: "SESSION_EXPIRED" };
      if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
        return { error: "SESSION_EXPIRED" };
      }
      const auth = `Bearer ${token}`;
      async function fetchOne(rowId, ctype) {
        const url = `${base}/api/ihke3000/IHKE3306S02/page_load?crid=${encodeURIComponent(rowId)}&ctype=${ctype}`;
        const ac = new AbortController();
        const t = setTimeout(() => ac.abort(), 30000);
        try {
          const r = await fetch(url, {
            method: "GET", credentials: "same-origin", signal: ac.signal,
            headers: { "Accept": "application/json", "Authorization": auth },
          });
          clearTimeout(t);
          if (r.status === 401 || r.status === 403) return { error: "SESSION_EXPIRED" };
          if (!r.ok) return { error: `HTTP ${r.status}` };
          return { body: await r.json() };
        } catch (e) {
          clearTimeout(t);
          return { error: e.name === "AbortError" ? "timeout 30s" : String(e?.message || e) };
        }
      }
      // NHI uses different ctype values for 西醫/中醫/牙醫/處方箋. We don't
      // have the public mapping, so try ctype 1..4 in order and stop as
      // soon as one returns drugs. ctype=2 covered IC卡 門診 in our sample.
      async function one(rowId) {
        for (const ct of [2, 1, 3, 4]) {
          const r = await fetchOne(rowId, ct);
          if (r.error === "SESSION_EXPIRED") return r;
          if (r.error) continue;
          const main = Array.isArray(r.body?.ihke3306S02_main_data) ? r.body.ihke3306S02_main_data : [];
          const hasDrugs = main.some((v) =>
            Array.isArray(v?.sp_IHKE3306S03_data_list) && v.sp_IHKE3306S03_data_list.length > 0
          );
          if (hasDrugs) return r;
        }
        // No ctype yielded drugs — return last successful body anyway so
        // diagnostics can still see the visit metadata.
        return await fetchOne(rowId, 2);
      }
      const out = new Array(items.length);
      let next = 0;
      const CONC = 3;
      async function worker() {
        while (next < items.length) {
          const i = next++;
          await new Promise((r) => setTimeout(r, Math.random() * 150));
          out[i] = await one(items[i].row_ID);
        }
      }
      const ws = [];
      for (let w = 0; w < CONC && w < items.length; w++) ws.push(worker());
      await Promise.all(ws);
      return { results: out };
    },
    args: [baseUrl, reqs],
  });

  if (result?.error === "SESSION_EXPIRED") throw new Error(SESSION_EXPIRED_ERROR);
  const drugs = [];
  const results = result?.results || [];
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (!r || r.error || !r.body) continue;
    const main = Array.isArray(r.body.ihke3306S02_main_data) ? r.body.ihke3306S02_main_data : [];
    for (const visit of main) {
      const drugList = Array.isArray(visit.sp_IHKE3306S03_data_list) ? visit.sp_IHKE3306S03_data_list : [];
      for (const d of drugList) {
        const adapted = adaptMedicationFromDetail(d, visit);
        if (adapted) drugs.push(adapted);
      }
    }
  }
  return drugs;
}

// Fan out IHKE3408S02 detail fetches for imaging — same pattern as the
// medication 2-step. ctype mirrors the visit's ori_TYPE (A / E / …).
async function _fetchImagingDetailsInTab({ tabId, baseUrl, visits }) {
  const reqs = visits
    .map((v) => ({
      row_ID: v.row_ID || v.rowid || v.rowID || "",
      ctype: v.ori_TYPE || v.ori_type || "A",
    }))
    .filter((r) => r.row_ID);
  if (reqs.length === 0) return [];

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: async (base, items) => {
      const token = sessionStorage.getItem("token");
      if (!token) return { error: "SESSION_EXPIRED" };
      if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
        return { error: "SESSION_EXPIRED" };
      }
      const auth = `Bearer ${token}`;
      async function one(rowId, ctype) {
        const url = `${base}/api/ihke3000/IHKE3408S02/page_load?crid=${encodeURIComponent(rowId)}&ctype=${encodeURIComponent(ctype)}`;
        const ac = new AbortController();
        const t = setTimeout(() => ac.abort(), 30000);
        try {
          const r = await fetch(url, {
            method: "GET", credentials: "same-origin", signal: ac.signal,
            headers: { "Accept": "application/json", "Authorization": auth },
          });
          clearTimeout(t);
          if (r.status === 401 || r.status === 403) return { error: "SESSION_EXPIRED" };
          if (!r.ok) return { error: `HTTP ${r.status}` };
          return { body: await r.json() };
        } catch (e) {
          clearTimeout(t);
          return { error: e.name === "AbortError" ? "timeout 30s" : String(e?.message || e) };
        }
      }
      const out = new Array(items.length);
      let next = 0;
      const CONC = 3;
      async function worker() {
        while (next < items.length) {
          const i = next++;
          await new Promise((r) => setTimeout(r, Math.random() * 150));
          out[i] = await one(items[i].row_ID, items[i].ctype);
        }
      }
      const ws = [];
      for (let w = 0; w < CONC && w < items.length; w++) ws.push(worker());
      await Promise.all(ws);
      return { results: out };
    },
    args: [baseUrl, reqs],
  });

  if (result?.error === "SESSION_EXPIRED") throw new Error(SESSION_EXPIRED_ERROR);
  const reports = [];
  const results = result?.results || [];
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (!r || r.error || !r.body) continue;
    const main = Array.isArray(r.body.ihke3408S02_main_data) ? r.body.ihke3408S02_main_data : [];
    for (const visit of main) {
      const adapted = adaptImagingReportFromDetail(visit);
      if (adapted) reports.push(adapted);
    }
  }
  return reports;
}

// Fan out IHKE3303S02 detail to classify each IHKE3303S01 visit as
// AMB / EMER / IMP based on hosp_DATA_TYPE_NAME. Uses ?rid=<row_ID>&t=N
// where N is the visit type bucket; we don't know the mapping a priori,
// so for each visit we try t=1..5 until one returns non-empty main_data.
async function _fetchEncounterDetailsInTab({ tabId, baseUrl, visits }) {
  const reqs = visits
    .map((v, idx) => ({ idx, row_ID: v.roW_ID || v.row_ID || "" }))
    .filter((r) => r.row_ID);
  if (reqs.length === 0) return [];

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: async (base, items) => {
      const token = sessionStorage.getItem("token");
      if (!token) return { error: "SESSION_EXPIRED" };
      if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
        return { error: "SESSION_EXPIRED" };
      }
      const auth = `Bearer ${token}`;
      async function fetchOne(rowId, t) {
        const url = `${base}/api/ihke3000/ihke3303s02/page_load?rid=${encodeURIComponent(rowId)}&t=${t}`;
        const ac = new AbortController();
        const tm = setTimeout(() => ac.abort(), 30000);
        try {
          const r = await fetch(url, {
            method: "GET", credentials: "same-origin", signal: ac.signal,
            headers: { "Accept": "application/json", "Authorization": auth },
          });
          clearTimeout(tm);
          if (r.status === 401 || r.status === 403) return { error: "SESSION_EXPIRED" };
          if (!r.ok) return { error: `HTTP ${r.status}` };
          return { body: await r.json() };
        } catch (e) {
          clearTimeout(tm);
          return { error: e.name === "AbortError" ? "timeout 30s" : String(e?.message || e) };
        }
      }
      // For each visit, find the `t` that returns non-empty data. NHI
      // uses t=1 for outpatient 西醫, t=2 maybe 急診/中醫, t=3 住院,
      // t=4 牙醫… don't have an authoritative mapping so we probe.
      async function one(rowId) {
        for (const t of [1, 2, 3, 4, 5]) {
          const r = await fetchOne(rowId, t);
          if (r.error === "SESSION_EXPIRED") return r;
          if (r.error) continue;
          const main = (r.body?.ihke3303S02_main_data) || [];
          if (main.length > 0) return { body: r.body, t };
        }
        return { body: null };
      }
      const out = new Array(items.length);
      let next = 0;
      const CONC = 3;
      async function worker() {
        while (next < items.length) {
          const i = next++;
          await new Promise((r) => setTimeout(r, Math.random() * 150));
          out[i] = await one(items[i].row_ID);
        }
      }
      const ws = [];
      for (let w = 0; w < CONC && w < items.length; w++) ws.push(worker());
      await Promise.all(ws);
      return { results: out };
    },
    args: [baseUrl, reqs],
  });

  if (result?.error === "SESSION_EXPIRED") throw new Error(SESSION_EXPIRED_ERROR);
  // Pair each detail body back to its visit position.
  const byIdx = new Map();
  const results = result?.results || [];
  for (let i = 0; i < reqs.length; i++) {
    byIdx.set(reqs[i].idx, results[i]?.body || null);
  }
  return byIdx;
}

function _classFromS02Detail(body) {
  if (!body) return null;
  const main = (body.ihke3303S02_main_data) || [];
  if (main.length === 0) return null;
  const tn = String(main[0].hosp_DATA_TYPE_NAME || "");
  if (tn.includes("急")) return "EMER";  // 急診
  if (tn.includes("住院")) return "IMP";
  // 西醫 / 中醫 / 牙醫 / 藥局 all default to AMB
  return "AMB";
}

async function _postStructured(backend, page_type, items, syncApiKey, patientOverride) {
  const r = await fetch(`${backend}/sync/upload-structured`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(syncApiKey ? { "X-Sync-API-Key": syncApiKey } : {}),
    },
    body: JSON.stringify({
      page_type,
      host: NHI_HOST,
      items,
      patient_override: patientOverride || null,
    }),
  });
  if (!r.ok) throw new Error(`POST upload-structured ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return await r.json();
}

// ── Local mode ─────────────────────────────────────────────────────────
//
// Runs the same mappers the backend runs, then triggers a download of the
// resulting FHIR Bundle. Nothing leaves the user's machine; no backend
// required. Mirrors backend/upload-structured order: encounters first so
// that linkEncountersInResources can attach references to downstream
// observations/medications/etc.

const _LOCAL_PAGE_TYPE_ORDER = [
  "encounters",
  "observations",
  "medications",
  "conditions",
  "allergies",
  "diagnostic_reports",
  "procedures",
];

// Cheap pre-flight: does this NHI tab have an authenticated session?
// Uses the same sessionStorage.token + lightweight API call pattern as
// _maybeFetchPatientIdFromNhi. Doesn't return anything PII — just a
// boolean for the popup to decide whether to surface a "log in first"
// banner. Returns null when we can't tell (script-injection blocked,
// timeout, etc.) so the popup can fall back to "enabled" rather than
// scaring the user with a false negative.
async function _checkNhiLoginState(tabId) {
  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: async () => {
        const t = sessionStorage.getItem("token");
        if (!t) return false;
        try {
          // Same endpoint as the cid auto-fetch — known to need an
          // authenticated session and to be cheap.
          const r = await fetch("/api/ihke3000/ihke3410s01/page_load", {
            credentials: "same-origin",
            headers: { Accept: "application/json", Authorization: `Bearer ${t}` },
          });
          // 401/403 → session token rejected. 200 → logged in.
          return r.ok;
        } catch {
          return false;
        }
      },
    });
    return typeof result === "boolean" ? result : null;
  } catch {
    return null;
  }
}

// NHI 健康存摺 endpoint IHKE3410S01 (我接種紀錄 / COVID 篩檢紀錄) happens
// to carry the logged-in user's real citizen ID in the response (`cid`
// field, e.g. "P123450866"). Use it to fill the patient_override's
// id_no when the user left it blank — that way they don't have to type
// their own 身分證字號 just to seed FHIR's Patient.id.
//
// Auto-replace policy: only fill when the override id_no is missing or
// is still an "auto-XXXXXXXX" placeholder generated by an earlier save.
// Anything else (e.g. user manually typed a fake ID for screen-share
// or grouping) is respected as-is.
async function _maybeFetchPatientIdFromNhi(tabId, patientOverride) {
  const current = patientOverride.id_no || "";
  const isPlaceholder = !current || current.startsWith("auto-");
  if (!isPlaceholder) return patientOverride;

  let cid = null;
  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: async () => {
        const t = sessionStorage.getItem("token");
        if (!t) return null;
        try {
          const r = await fetch("/api/ihke3000/ihke3410s01/page_load", {
            credentials: "same-origin",
            headers: { Accept: "application/json", Authorization: `Bearer ${t}` },
          });
          if (!r.ok) return null;
          const body = await r.json();
          return body?.cid || null;
        } catch {
          return null;
        }
      },
    });
    // Validate it looks like a Taiwan national ID (1 letter + 9 digits)
    // before trusting it. Avoids accidentally promoting garbage to the
    // Patient resource's unique key.
    if (result && /^[A-Z][12]\d{8}$/.test(result)) cid = result;
  } catch (e) {
    console.warn("[NHI sync] IHKE3410 cid fetch failed:", e?.message ?? e);
  }

  if (cid && cid !== current) {
    patientOverride = { ...patientOverride, id_no: cid };
    chrome.storage.local.set({ patientOverride }).catch(() => {});
  }
  return patientOverride;
}

// Read the mask-name preference fresh from storage. We don't cache —
// runNhiApiSync is invoked at most a few times per session and the SW
// can be torn down + restarted any time, so a single get() per sync is
// cheaper than syncing state across SW lifecycles.
async function _isMaskEnabled() {
  try {
    const { maskNameEnabled } = await chrome.storage.local.get("maskNameEnabled");
    return maskNameEnabled === true;
  } catch {
    return false;
  }
}

function _buildOverridePatient(ov, maskEnabled) {
  const displayName = maskEnabled ? maskName(ov.name || "") : ov.name || "";
  const raw = {
    id: ov.id_no,
    identifier: ov.id_no,
    name: displayName || ov.id_no,
  };
  if (ov.birth_date) raw.birthDate = ov.birth_date;
  if (ov.gender) raw.gender = ov.gender;
  return mapPatient(raw);
}

// Walk a JSON-like value and replace every string token equal to or
// containing `needle` with `replacement`. Used to scrub the real
// patient name out of NHI narrative fields (clinical_note, conclusion,
// note, etc.) before the items reach the mapper. Only triggered when
// the user has opted into masking AND supplied a name — and the
// substitution is exact-token-replace, not fuzzy, so it can't surprise
// the user by clobbering unrelated content.
function _replaceNameDeep(value, needle, replacement) {
  if (!needle || needle === replacement) return value;
  if (typeof value === "string") return value.split(needle).join(replacement);
  if (Array.isArray(value)) return value.map((v) => _replaceNameDeep(v, needle, replacement));
  if (value && typeof value === "object") {
    const out = {};
    for (const k in value) out[k] = _replaceNameDeep(value[k], needle, replacement);
    return out;
  }
  return value;
}

function _assembleLocalBundle(byType, patientOverride, maskEnabled) {
  const patient = _buildOverridePatient(patientOverride, maskEnabled);
  const pid = patient.id;
  const all = [patient];

  for (const pt of _LOCAL_PAGE_TYPE_ORDER) {
    const items = byType[pt];
    if (!items || items.length === 0) continue;
    let mapped;
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
    if (pt === "encounters") mapped = dedupAdmissionDayAmb(mapped);
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

  // Linker + sex-stratified resolver run once over the full assembled
  // list (same pipeline backend's /sync/upload-structured runs, just
  // against an in-memory candidate array instead of a SQLite query).
  linkEncountersInResources(unique, unique);
  resolveSexStratifiedRanges(patient, unique);

  return {
    resourceType: "Bundle",
    type: "collection",
    timestamp: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
    entry: unique.map((r) => ({
      fullUrl: `${r.resourceType}/${r.id}`,
      resource: r,
    })),
  };
}

// Local mode stashes the assembled Bundle in chrome.storage.local under
// a single "pendingFhirBundle" slot. The popup shows a download button
// when this slot is non-empty; the actual chrome.downloads.download call
// happens from the popup (in response to a user click) so the file
// doesn't appear in the Downloads bar uninvited.
//
// Single slot means a new sync overwrites the previous pending bundle.
// chrome.storage.local default quota is 10 MB; a typical NHI sync is
// well under 2 MB.
const PENDING_BUNDLE_KEY = "pendingFhirBundle";

async function _stashFhirBundle(bundle, patientId, dateRange) {
  // Filename: nhi-{pid}-{startYYYYMMDD}-{endYYYYMMDD}.json
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
  let s, e;
  if (dateRange && (dateRange.start || dateRange.end)) {
    s = compact(dateRange.start) || fmt(now);
    e = compact(dateRange.end) || fmt(now);
  } else {
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    s = fmt(oneYearAgo);
    e = fmt(now);
  }
  const filename = `nhi-${safePid}-${s}-${e}.json`;
  const json = JSON.stringify(bundle, null, 2);
  await chrome.storage.local.set({
    [PENDING_BUNDLE_KEY]: {
      filename,
      json,
      bytes: json.length,
      generatedAt: Date.now(),
      patientId: patientId || null,
    },
  });
  return { filename, bytes: json.length };
}

async function runNhiApiSync({ tabId, mode, backend, syncApiKey, nhiBase, patientOverride, dateRange, dateRangeLabel }) {
  _cancelled = false;
  const BASE = nhiBase || `https://${NHI_HOST}`;

  if (!patientOverride) {
    await chrome.storage.local.set({
      syncStatus: {
        running: false,
        progress: "⛔ 請先在 popup 填寫病人資料後再試",
        phase: "error", ts: Date.now(), completed: Date.now(),
      },
    });
    return;
  }
  if (!tabId) {
    throw new Error("API sync requires NHI tab id (cookies are first-party)");
  }

  // First chance to upgrade the patient ID: if the popup gave us an
  // "auto-XXXXXXXX" placeholder (user didn't manually type one),
  // fetch the real one from NHI's IHKE3410S01 endpoint (response.cid
  // is the citizen ID). Persist back to storage so subsequent syncs
  // are stable. Manually-typed IDs are respected as-is.
  patientOverride = await _maybeFetchPatientIdFromNhi(tabId, patientOverride);

  // Stash context so the stopSync message handler can wipe partial
  // data (DELETE /sync/patient/{id_no}) without us having to send it
  // back through chrome.runtime.sendMessage.
  _activeSyncCtx = { backend, syncApiKey, patientId: patientOverride.id_no };

  // Wall-clock start time — used to compute elapsed seconds for the
  // final status line ("總耗時 12.3 秒"). Stash on a local so we can
  // reach it from the completion message at the very end.
  const _t0 = Date.now();
  // Per-phase timings, surfaced into the popup's "查看明細" so the user
  // can see exactly where time is going. Each entry: { name, ms }.
  const _phases = [];
  let _phaseStart = _t0;
  const _markPhase = (name) => {
    const now = Date.now();
    _phases.push({ name, ms: now - _phaseStart });
    _phaseStart = now;
  };
  await setStatus({
    running: true, progress: "🚀 開始取得健保存摺資料…", phase: "init",
    started: _t0, totalResources: 0, host: NHI_HOST, errors: [],
  });

  // Step 1: fetch all endpoints in PARALLEL inside the NHI tab. Running in
  // tab context means same-origin cookies are sent automatically — fetch
  // from the SW would be cross-origin and SameSite blocks the session
  // cookie, hence we got "session expired" even when logged in.
  // Pass only serialisable data (paths, method, name); adapters stay in SW.
  // Inject ISO-date range into each endpoint that supports it (converts
  // to 民國 format via isoToROC). Skipped endpoints keep their default
  // NHI-side window (1-2 years depending on the page).
  const fetchSpec = NHI_API_ENDPOINTS.map((ep) => {
    const path = ep.supportsDateRange ? applyDateRangeToPath(ep.path, dateRange) : ep.path;
    return { name: ep.name, url: BASE + path, method: "GET" };
  });
  if (dateRange && (dateRange.start || dateRange.end)) {
    console.log("[NHI API sync] date range:",
      `${dateRange.start || "(unbounded)"} → ${dateRange.end || "(unbounded)"}`);
  }

  let settledRaw;
  try {
    [{ result: settledRaw }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: async (specs) => {
        // NHI auth: cookies + JWT in sessionStorage. The SPA's axios sets
        // `Authorization: Bearer <token>` on every API call. Session
        // cookies alone return 401.
        const token = sessionStorage.getItem("token");
        if (!token) return [{ error: "SESSION_EXPIRED" }];
        const auth = `Bearer ${token}`;

        // Detect IDLE/timeout page already redirected on this tab.
        if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
          return [{ error: "SESSION_EXPIRED" }];
        }

        // 60-second timeout per fetch — some NHI endpoints (encounters,
        // meds) take 20+ seconds.
        async function fetchOne(s, ms) {
          const ac = new AbortController();
          const timer = setTimeout(() => ac.abort(), ms);
          try {
            const r = await fetch(s.url, {
              method: s.method,
              credentials: "same-origin",
              signal: ac.signal,
              headers: { "Accept": "application/json", "Authorization": auth },
            });
            clearTimeout(timer);
            const ct = r.headers.get("content-type") || "";
            if (r.status === 401 || r.status === 403) {
              return { name: s.name, error: "SESSION_EXPIRED" };
            }
            if (!r.ok) return { name: s.name, error: `HTTP ${r.status}` };
            if (!ct.includes("application/json")) {
              return { name: s.name, error: `non-JSON (ct=${ct})` };
            }
            let body;
            try { body = await r.json(); }
            catch (e) { return { name: s.name, error: "JSON parse: " + e.message }; }
            return { name: s.name, body };
          } catch (e) {
            clearTimeout(timer);
            if (e.name === "AbortError") return { name: s.name, error: "timeout 60s" };
            return { name: s.name, error: String(e?.message || e) };
          }
        }

        // Concurrency-limited execution: max 3 in flight at once. NHI's
        // abuse detection blocks bursts; with 11 parallel fetches it
        // throttled the session and redirected to IHKE3001S99_IDLE.
        // 3 at a time + 200ms jitter is gentle enough for 1-shot sync.
        const CONCURRENCY = 3;
        const JITTER_MS = 200;
        const results = new Array(specs.length);
        let nextIdx = 0;
        async function worker() {
          while (nextIdx < specs.length) {
            const i = nextIdx++;
            await new Promise(r => setTimeout(r, Math.random() * JITTER_MS));
            results[i] = await fetchOne(specs[i], 60000);
          }
        }
        const workers = [];
        for (let w = 0; w < CONCURRENCY && w < specs.length; w++) {
          workers.push(worker());
        }
        await Promise.all(workers);
        return results;
      },
      args: [fetchSpec],
    });
  } catch (e) {
    throw new Error(`executeScript failed: ${e.message}`);
  }

  // Detect session expired across results.
  if (settledRaw.some((r) => r.error === "SESSION_EXPIRED")) {
    throw new Error(SESSION_EXPIRED_ERROR);
  }

  const errors = [];

  // Generic list extraction: handles all observed NHI shapes.
  //   - Plain array (IHKE3409 lab)
  //   - {sp_IHKE<X>_data: [...]}  (medications, allergies)
  //   - {western_data, chinese_data, dentist_data: [...]} (encounter list,
  //     split by 西醫/中醫/牙醫 — we want all three)
  // For multi-array shapes we merge all arrays and tag each item with
  // `__section` (the source key) so adapters can disambiguate.
  function extractList(body) {
    if (Array.isArray(body)) return body;
    if (!body || typeof body !== "object") return [];
    let arrayKeys = Object.entries(body).filter(([_, v]) => Array.isArray(v));
    if (arrayKeys.length === 0) return [];
    if (arrayKeys.length === 1) return arrayKeys[0][1];
    // Multiple arrays — drop UI-helper arrays (dropdown options, sort
    // selectors, lookup tables). NHI mixes them into the same response
    // (e.g. imaging returns sp_IHKE3408S01_data + icd9cm_select).
    const HELPER_RE = /select|option|dropdown|filter|sort|lookup/i;
    const dataKeys = arrayKeys.filter(([k]) => !HELPER_RE.test(k));
    if (dataKeys.length === 1) return dataKeys[0][1];
    if (dataKeys.length === 0) return arrayKeys[0][1]; // fallback
    arrayKeys = dataKeys;
    // Multiple data arrays (e.g. western_data/chinese_data/dentist_data)
    // — merge with __section tag so adapters can disambiguate.
    const merged = [];
    for (const [k, v] of arrayKeys) {
      for (const item of v) {
        if (item && typeof item === "object") {
          merged.push({ ...item, __section: k });
        } else {
          merged.push(item);
        }
      }
    }
    return merged;
  }

  // Apply SW-side adapters to each endpoint's body.
  const settled = settledRaw.map((r, i) => {
    const ep = NHI_API_ENDPOINTS[i];
    if (r.error) {
      return { status: "rejected", reason: { message: `${ep.name}: ${r.error}` } };
    }
    const list = extractList(r.body);
    // Adapters return either:
    //   - one item   (most adapters — labs, meds, encounters, imaging)
    //   - null/undefined (skip)
    //   - array of items (adaptAdultPreventive — unfolds one screening
    //     row into ~15 Observation entries)
    // Flat-handle both shapes so each adapter can pick whatever's clearest.
    const items = [];
    for (const it of list) {
      const r = ep.adapt(it);
      if (r === null || r === undefined) continue;
      if (Array.isArray(r)) {
        for (const x of r) if (x) items.push(x);
      } else {
        items.push(r);
      }
    }
    // Snapshot a body sample for shapes where adapter rejected everything
    // — used by the diagnostic breakdown in step 2.
    let bodySample = null;
    if (list.length > 0 && items.length === 0) {
      // Include the FIRST ITEM (full keys+values) so we can build the
      // correct adapter without another round-trip. NHI items may include
      // PII; the user inspects this locally via service-worker devtools.
      bodySample = JSON.stringify({
        topLevelKeys: Array.isArray(r.body) ? null : Object.keys(r.body || {}).slice(0, 10),
        wasArray: Array.isArray(r.body),
        firstItem: list[0] ?? null,
        secondItem: list[1] ?? null,
      }).slice(0, 4000);
    }
    return { status: "fulfilled", value: { ep, items, raw_count: list.length, bodySample, rawList: list } };
  });

  _markPhase("nhi-parallel");

  // Step 1a: encounter detail fan-out (IHKE3303S02) → classify each
  // IHKE3303S01 visit as AMB / EMER / IMP via hosp_DATA_TYPE_NAME.
  // List endpoint doesn't expose 急診 distinction; detail does. We re-
  // adapt each encounter item with the discovered class before the
  // backend upload step.
  const encIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "encounters");
  if (encIdx >= 0 && settled[encIdx].status === "fulfilled") {
    const visits = settled[encIdx].value.rawList || [];
    if (visits.length > 0) {
      await setStatus({
        progress: `📥 取得 ${visits.length} 筆就醫紀錄詳情…`,
      });
      try {
        const detailMap = await _fetchEncounterDetailsInTab({
          tabId, baseUrl: BASE, visits,
        });
        // Re-adapt with classHint from detail; fall back to AMB.
        const reAdapted = [];
        for (let i = 0; i < visits.length; i++) {
          const detail = detailMap?.get(i) || null;
          const cls = _classFromS02Detail(detail) || "AMB";
          const it = adaptEncounterFromMedExpense(visits[i], cls);
          if (it) reAdapted.push(it);
        }
        settled[encIdx].value.items = reAdapted;
        settled[encIdx].value.raw_count = reAdapted.length;
      } catch (e) {
        errors.push(`encounter detail: ${e.message}`);
      }
    }
  }
  _markPhase("encounter-detail");

  // Step 1b: medications need a 2-step fetch — IHKE3306S01 only returns
  // visit metadata (date, ICD, hospital), no drug names. Drugs live at
  // IHKE3306S02/page_load?crid=<row_ID>&ctype=2 under
  // ihke3306S02_main_data[*].sp_IHKE3306S03_data_list. Fan out detail
  // fetches inside the same tab context (cookies + JWT), keeping
  // concurrency limited so NHI doesn't IDLE-redirect us.
  // Step 1c: imaging needs IHKE3408S02 for the actual report narrative.
  // List endpoint only has order metadata; ctype param mirrors the
  // visit's ori_TYPE (A / E / …).
  const imgIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "imaging");
  if (imgIdx >= 0 && settled[imgIdx].status === "fulfilled") {
    const visits = settled[imgIdx].value.rawList || [];
    if (visits.length > 0) {
      await setStatus({
        progress: `📥 取得 ${visits.length} 筆影像檢查報告…`,
      });
      try {
        const reports = await _fetchImagingDetailsInTab({
          tabId, baseUrl: BASE, visits,
        });
        settled[imgIdx].value.items = reports;
        settled[imgIdx].value.raw_count = reports.length;
        settled[imgIdx].value.visitCount = visits.length;
      } catch (e) {
        errors.push(`imaging detail: ${e.message}`);
      }
    }
  }
  _markPhase("imaging-detail");

  const medIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "medications");
  if (medIdx >= 0 && settled[medIdx].status === "fulfilled") {
    const visits = settled[medIdx].value.rawList || [];
    if (visits.length > 0) {
      await setStatus({
        progress: `📥 取得 ${visits.length} 筆用藥明細…`,
      });
      try {
        const drugItems = await _fetchMedicationDetailsInTab({
          tabId, baseUrl: BASE, visits,
        });
        settled[medIdx].value.items = drugItems;
        // raw_count now reflects the *drug-level* count for the breakdown
        // (visits → drugs). Keep the visit count in a side field for debug.
        settled[medIdx].value.visitCount = visits.length;
        settled[medIdx].value.raw_count = drugItems.length;
      } catch (e) {
        errors.push(`medications detail: ${e.message}`);
      }
    }
  }
  _markPhase("medication-detail");

  // Step 2: aggregate items by page_type, POST to backend.
  const byType = {};
  let raw_total = 0;
  let adapted_total = 0;
  // Per-endpoint breakdown so the final status can tell user exactly
  // which endpoints came back empty / mis-shaped — much more useful than
  // a single aggregated number.
  // Breakdown shown to the user under "查看明細". Use the Chinese label
  // when known; only fall back to the raw endpoint name for unmapped
  // (newly added) endpoints. Empty-result endpoints are omitted from
  // the success summary entirely — they add noise. Errors always show
  // so the user knows something didn't come through.
  const breakdown = [];
  for (let i = 0; i < settled.length; i++) {
    const ep = NHI_API_ENDPOINTS[i];
    const s = settled[i];
    const label = ENDPOINT_LABEL_ZH[ep.name] ?? ep.name;
    if (s.status === "rejected") {
      errors.push(`${ep.name}: ${s.reason.message}`);
      breakdown.push(`❌ ${label}：取得失敗`);
      continue;
    }
    const { items, raw_count } = s.value;
    raw_total += raw_count;
    adapted_total += items.length;
    if (raw_count === 0) continue; // nothing to show
    if (items.length > raw_count && raw_count > 0) {
      // 1-to-many adapter (e.g. adult_preventive: one screening row →
      // ~18 Observations). Show both numbers so the user understands
      // why one record produced many.
      breakdown.push(`${label}：${raw_count} 筆 → ${items.length} 項`);
    } else {
      breakdown.push(`${label}：${items.length} 筆`);
    }
    // Save body sample for first endpoint with raw>0 but adapted=0 (adapter
    // mismatch) so we can iterate. Stored under chrome.storage.local for
    // inspection via service worker DevTools.
    if (raw_count > 0 && items.length === 0) {
      try {
        await chrome.storage.local.set({
          [`__sampleBody_${ep.name}`]: s.value.bodySample || "n/a",
        });
      } catch {}
    }
    if (items.length === 0) continue;
    (byType[ep.page_type] = byType[ep.page_type] || []).push(...items);
  }

  // Mask gate is read fresh per sync — defaults OFF per the discussion
  // (citizen-self-download doesn't need anonymization). When ON, also
  // scrub the user's real name out of any NHI narrative field before
  // it flows into the mapper.
  const maskEnabled = await _isMaskEnabled();
  if (maskEnabled && patientOverride.name) {
    const replacement = maskName(patientOverride.name);
    for (const key of Object.keys(byType)) {
      byType[key] = _replaceNameDeep(byType[key], patientOverride.name, replacement);
    }
  }

  let total = 0;
  let _localFilename = null;
  if (mode === "local") {
    if (_cancelled) throw new Error(CANCEL_ERROR);
    await setStatus({ progress: "🧬 轉換為健康紀錄檔…", totalResources: 0 });
    let bundle;
    try {
      bundle = _assembleLocalBundle(byType, patientOverride, maskEnabled);
    } catch (e) {
      errors.push(`local mapping: ${e.message}`);
      bundle = null;
    }
    if (bundle) {
      total = bundle.entry.length;
      await setStatus({ progress: `💾 準備 ${total} 筆 FHIR 資源…`, totalResources: total });
      try {
        const dl = await _stashFhirBundle(bundle, patientOverride.id_no, dateRange);
        _localFilename = dl.filename;
      } catch (e) {
        errors.push(`stash bundle: ${e.message}`);
      }
    }
  } else {
    // Build the override we send to backend with the maybe-masked name
    // so backend's auto-created Patient + the per-item subject.display
    // see the same value the user opted into. Items themselves were
    // already scrubbed above (byType pass), so this just covers the
    // override-derived Patient.
    const uploadOverride = maskEnabled && patientOverride.name
      ? { ...patientOverride, name: maskName(patientOverride.name) }
      : patientOverride;
    for (const [page_type, items] of Object.entries(byType)) {
      if (_cancelled) throw new Error(CANCEL_ERROR);
      await setStatus({
        progress: `⬆️ 上傳 ${page_type}（${items.length} 筆）…`,
        totalResources: total,
      });
      try {
        const data = await _postStructured(backend, page_type, items, syncApiKey, uploadOverride);
        total += data.count || 0;
      } catch (e) {
        errors.push(`upload ${page_type}: ${e.message}`);
      }
    }

    // After backend upload, also fetch a snapshot of the patient's full
    // cumulative FHIR Bundle and stash it for the popup's "📥 下載" button.
    // This is what `/fhir/export` returns — the backend's complete view
    // of this patient (this sync + any prior syncs), as opposed to local
    // mode's "just this sync" bundle.
    //
    // Skip stashing entirely when the upload pass produced no resources
    // — exporting 0 entries then stashing them creates a misleading
    // "本地 ✓ 0 筆" indicator and a useless 📤 上傳 button.
    if (patientOverride.id_no && total > 0) {
      try {
        await setStatus({ progress: "📦 取得後端完整資料…", totalResources: total });
        // Backend stores Patient under derivePatientId(rawId), so the
        // export filter must use the hashed form — querying with the
        // raw national ID matches zero rows even when data is there.
        const fhirPid = derivePatientId(patientOverride.id_no);
        const expUrl = `${backend}/fhir/export?patient=${encodeURIComponent(fhirPid)}`;
        const r = await fetch(expUrl, {
          headers: syncApiKey ? { "X-Sync-API-Key": syncApiKey } : {},
        });
        if (r.ok) {
          const bundle = await r.json();
          // Pass the same dateRange the user picked through so the
          // downloaded filename reflects "最近 3 年" → 2023-2026 instead
          // of always synthesizing today-1y → today.
          const dl = await _stashFhirBundle(bundle, patientOverride.id_no, dateRange);
          _localFilename = dl.filename;
          // Align reported count with local mode: bundle.entry.length
          // includes the Patient resource (which the per-page-type POST
          // counts had previously omitted because Patient is auto-created
          // silently from patient_override). Same data → same number.
          //
          // Defensive: only OVERWRITE total when export actually returned
          // something. If export returns 0 entries despite a successful
          // upload (could happen with a stale-DB hash mismatch we haven't
          // fixed yet), don't clobber the truthful upload count — that's
          // exactly the bug that made "已更新 81 筆" silently become
          // "已更新 0 筆".
          if (Array.isArray(bundle.entry) && bundle.entry.length > 0) {
            total = bundle.entry.length;
          }
        } else {
          errors.push(`export bundle: HTTP ${r.status}`);
        }
      } catch (e) {
        errors.push(`export bundle: ${e.message}`);
      }
    }
  }
  _markPhase(mode === "local" ? "assemble+stash" : "backend-upload");

  // Format elapsed wall-clock time: seconds (1 dp) for short syncs,
  // "mm:ss" once we cross the minute mark so the popup status stays readable.
  const _elapsedMs = Date.now() - _t0;
  const _elapsedStr = _elapsedMs < 60_000
    ? `${(_elapsedMs / 1000).toFixed(1)}s`
    : `${Math.floor(_elapsedMs / 60_000)}m${Math.round((_elapsedMs % 60_000) / 1000)}s`;
  // No more "檔案已備妥…" tail — the 📥 download button sits right
  // below the status, so saying "點下方按鈕" is just noise.
  const _localTail = "";
  const _successVerb = mode === "local" ? "已產生" : "已更新";
  // Phase timings (`nhi-parallel=8s`, `backend-upload=0.8s`) are dev
  // info — useful when investigating a slow sync but noise for an end
  // user. Keep them, but tag with the "⏱" prefix the popup uses to
  // tuck them into a deeper "技術細節" sub-toggle.
  const _phaseLines = _phases.map((p) => `⏱ ${p.name}=${(p.ms / 1000).toFixed(1)}s`);
  const _fullBreakdown = [...breakdown, ..._phaseLines];

  // Pick the right summary line. Zero-result is the trickiest case:
  // we don't want a green ✅ saying "0 筆" because that reads as
  // "succeeded with zero data". That's almost always one of:
  //   - NHI session expired between the login probe and the sync
  //     (the IHKE3410 probe can still succeed while data endpoints
  //     respond with empty arrays);
  //   - the user truly has no records in the selected date range.
  // Either way the actionable next step is "重新登入 NHI 再試一次".
  let _summaryLine;
  if (errors.length) {
    _summaryLine = `⚠️ 取得完成 · ${_successVerb} ${total} 筆健康紀錄，${errors.length} 項失敗（${_elapsedStr}）${_localTail}`;
  } else if (total === 0) {
    _summaryLine =
      `⚠️ 取得完成但沒抓到任何資料（${_elapsedStr}）— ` +
      `健保存摺 session 可能過期，請回該分頁重新登入；或拉長「日期範圍」再試。`;
  } else {
    _summaryLine = `✅ 取得完成 · ${_successVerb} ${total} 筆健康紀錄（${_elapsedStr}）${_localTail}`;
  }

  await setStatus({
    running: false,
    progress: _summaryLine,
    phase: "done",
    totalResources: total,
    completed: Date.now(),
    elapsedMs: _elapsedMs,
    // Per-endpoint breakdown for the popup's '查看明細' collapsible.
    // Keep as a plain array so popup.js can render with DOM API (no
    // innerHTML / no escaping concerns). Items look like
    // 'encounters=12/12' or 'adult_preventive=2 rows → 36 obs'.
    breakdown: _fullBreakdown,
    errors,
    histno: patientOverride.id_no,
    mode,
    localFilename: _localFilename,
  });

  // Best-effort: write a Sync History row to the backend so the dashboard
  // can show when/who/how-long/what/range. Skipped in local mode (there
  // is no backend). Wrapped + swallowed so a logging failure never
  // propagates back to the user-facing sync status.
  if (mode !== "local") try {
    await fetch(`${backend}/sync/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(syncApiKey ? { "X-Sync-API-Key": syncApiKey } : {}),
      },
      body: JSON.stringify({
        status: errors.length ? "partial" : "success",
        patient_id: patientOverride.id_no || "",
        // /sync/log lands in the dashboard's sync-history row. Only
        // mask when the user has opted in — otherwise dashboard sees
        // the raw name they typed (consistent with "民眾自用" default).
        patient_name: maskEnabled
          ? maskName(patientOverride.name || "")
          : patientOverride.name || "",
        total,
        breakdown,
        date_range: dateRangeLabel || "",
        elapsed_ms: _elapsedMs,
        started_at: new Date(_t0).toISOString(),
        errors,
      }),
    });
  } catch (e) {
    console.warn("[NHI sync] failed to write history log:", e);
  }
  _activeSyncCtx = null;
}

// One-time migration from chrome.storage.sync → chrome.storage.local.
// Previous versions stored syncApiKey + patientOverride (containing the
// national ID) under .sync, which Chrome replicates to the user's Google
// account and pushes to every device they sign into. Move everything
// settings-related to .local; clear the sync copy.
const SYNC_KEYS_TO_MIGRATE = [
  "backendUrl",
  "syncApiKey",
  "smartAppLaunchUrl",
  "patientOverride",
  "syncMode",
  "maskNameEnabled",
];

async function migrateSyncToLocal() {
  try {
    const synced = await chrome.storage.sync.get(SYNC_KEYS_TO_MIGRATE);
    const present = Object.fromEntries(
      Object.entries(synced).filter(([, v]) => v !== undefined),
    );
    if (Object.keys(present).length === 0) return;
    const local = await chrome.storage.local.get(Object.keys(present));
    // Don't overwrite anything the user already set on this machine.
    const toWrite = Object.fromEntries(
      Object.entries(present).filter(([k]) => local[k] === undefined),
    );
    if (Object.keys(toWrite).length > 0) {
      await chrome.storage.local.set(toWrite);
    }
    await chrome.storage.sync.remove(Object.keys(present));
  } catch {
    // Migration is best-effort. The next run gets to try again.
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  await migrateSyncToLocal();
});

// Also run migration on service-worker wake-up (covers reload/restart
// paths where onInstalled doesn't fire).
chrome.runtime.onStartup?.addListener?.(() => {
  migrateSyncToLocal();
});
migrateSyncToLocal();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "startNhiApiSync") {
    runNhiApiSync(msg.payload).then(
      () => { try { sendResponse({ ok: true }); } catch {} },
      async (e) => {
        if (e?.message === CANCEL_ERROR) {
          try { sendResponse({ ok: true, cancelled: true }); } catch {}
          return;
        }
        if (e?.message === SESSION_EXPIRED_ERROR) {
          await chrome.storage.local.set({
            syncStatus: {
              running: false,
              progress: "🔒 NHI session 已登出 — 請在 NHI tab 重新登入後再點 Sync",
              phase: "session_expired",
              ts: Date.now(), completed: Date.now(),
            },
          });
          try { sendResponse({ ok: false, expired: true }); } catch {}
          return;
        }
        console.error("runNhiApiSync failed", e);
        await setStatus({ running: false, progress: `❌ ${e.message}`, phase: "error" });
        try { sendResponse({ ok: false, error: e.message }); } catch {}
      },
    );
    return true;
  }
  if (msg?.type === "stopSync") {
    // Set the cancellation flag; the in-flight sync will throw
    // CANCEL_ERROR at its next checkCancel() call.  Storage is already
    // updated by the popup, so we don't touch it here.
    _cancelled = true;
    // Discard any partial data uploaded so far. The user's stated
    // contract is 'stop = abort, I'll resync from scratch later' — we
    // don't want to leave a half-loaded patient in the FHIR store that
    // looks complete to downstream SMART apps.
    const ctx = _activeSyncCtx;
    if (ctx?.patientId && ctx.backend) {
      (async () => {
        try {
          await fetch(
            `${ctx.backend}/sync/patient/${encodeURIComponent(ctx.patientId)}`,
            {
              method: "DELETE",
              headers: ctx.syncApiKey ? { "X-Sync-API-Key": ctx.syncApiKey } : {},
            },
          );
          // Surface the wipe in the status so user sees it actually happened.
          const prev = (await chrome.storage.local.get(STORAGE_KEY))[STORAGE_KEY] || {};
          await chrome.storage.local.set({
            [STORAGE_KEY]: {
              ...prev,
              running: false,
              progress: "⛔ 已停止並清除部分資料 — 請重新取得",
              phase: "cancelled",
              ts: Date.now(),
              completed: Date.now(),
            },
          });
        } catch (e) {
          console.warn("[NHI sync] cancel wipe failed:", e);
        }
      })();
    }
    _activeSyncCtx = null;
    try { sendResponse({ ok: true }); } catch {}
    return true;
  }
  if (msg?.type === "getSyncStatus") {
    chrome.storage.local.get(STORAGE_KEY).then((data) => sendResponse(data[STORAGE_KEY] || null));
    return true;  // async response
  }
  if (msg?.type === "clearSyncStatus") {
    chrome.storage.local.remove(STORAGE_KEY).then(() => sendResponse({ ok: true }));
    return true;
  }
  if (msg?.type === "checkNhiLogin") {
    _checkNhiLoginState(msg.tabId).then(
      (state) => { try { sendResponse({ loggedIn: state }); } catch {} },
      () => { try { sendResponse({ loggedIn: null }); } catch {} },
    );
    return true;
  }
});

// Belt-and-suspenders SW keepalive: an alarm every 20 s wakes the SW if
// idle. Combined with the return-true pattern above, this prevents the
// 30 s idle shutdown from ending an in-progress sync.
chrome.alarms.create("sw-keepalive", { periodInMinutes: 0.34 });
chrome.alarms.onAlarm.addListener(() => { /* no-op; presence is the point */ });
