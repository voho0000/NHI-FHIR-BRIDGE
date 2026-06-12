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
  const y = Number.parseInt(m[1], 10) + 1911;
  return `${y}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
}

// Inverse: ISO "2023-05-05" → ROC "112/05/05". Used to build NHI date-range
// query strings (their forms expect 民國 format).
export function isoToROC(isoDate) {
  if (!isoDate) return "";
  const m = String(isoDate).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (!m) return "";
  const y = Number.parseInt(m[1], 10) - 1911;
  if (y < 1) return ""; // pre-民國 dates make no sense to NHI
  return `${y}/${m[2].padStart(2, "0")}/${m[3].padStart(2, "0")}`;
}

// NHI 我參與的照護計畫 (IHKE3213S01) ships its dates as 民國年月日 with
// Chinese delimiters — "113年6月13日" — instead of the slash/dot/dash form
// every other endpoint uses. rocToISO only understands the delimited form,
// so parse the 年/月/日 shape here. Falls back to rocToISO for any row that
// happens to ship the delimited form, and returns "" for empty / garbage.
export function rocChineseToISO(rocDate) {
  if (!rocDate) return "";
  const s = String(rocDate).trim();
  const m = s.match(/(\d{2,3})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日?/);
  if (!m) return rocToISO(s);
  const y = Number.parseInt(m[1], 10) + 1911;
  return `${y}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
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

// Mirror of pickEnglish — extract the 中文 half of a bilingual
// "中文||English" NHI field. Returns "" when input is empty. Falls back
// to the whole string when no separator exists (defensive: some NHI rows
// ship only one language). Used by the v0.8.0 bilingual mapping so
// FHIR `CodeableConcept.text` carries the patient-facing 繁中 form
// while `coding[].display` stays as the clinical/technical English.
export function pickChinese(s) {
  if (s === null || s === undefined) return "";
  const str = String(s);
  const idx = str.indexOf("||");
  if (idx === -1) return str.trim();
  const zh = str.slice(0, idx).trim();
  return zh || str.slice(idx + 2).trim();
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
    .replace(/[,，;；]+\s*$/, "") // trailing 半形 / 全形 punctuation
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
  const date = rocToISO(item.reaL_INSPECT_DATE || item.real_inspect_date || item.funC_DATE);
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
  const fullName =
    _cleanLabName(item.assaY_ITEM_NAME) ||
    _cleanLabName(item.order_shortname) ||
    _cleanLabName(item.ordeR_NAME);
  const orderCode = String(item.ordeR_CODE || "").trim();
  return {
    date,
    order_code: orderCode,
    order_name: item.ordeR_NAME || "",
    // v0.17 (2026-06-06): the 檢驗檢查項目名稱 (hospital test-item name),
    // surfaced SEPARATELY from `display` so it can drive the human label
    // (CodeableConcept.text) WITHOUT touching `display` — which is what
    // findLoinc / specimen / canonical routing key off. NHI ships this
    // Chinese item name on the B (定期上傳) channel for some panels where
    // the A (不定期上傳) channel carries an English shorthand. Real case
    // (patient report 2026-06-06): CMV serology 14004B has
    //   ordeR_NAME      = "巨大細胞病毒抗體  酵素免疫法"  (醫令名 / order name)
    //   assaY_ITEM_NAME = "巨細胞病毒IgG抗體"            (the test actually run)
    // The downstream label resolver prefers a Chinese 檢驗項目名稱 over the
    // broader 醫令名 so SMART apps show "巨細胞病毒IgG抗體", not the order
    // name. `display` keeps its existing fallback chain (assaY_ITEM_NAME →
    // order_shortname → ordeR_NAME) so LOINC routing is unchanged.
    item_name: _cleanLabName(item.assaY_ITEM_NAME) || "",
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
    // v0.12.3: NHI ships the same measurement under two upload
    // channels — orI_TYPE = "A" (特約醫事機構不定期上傳, real-time) or
    // "B" (定期上傳, batch sync). Verified 2026-05-29 via direct
    // /api/ihke3000/ihke3409s01/page_load inspection: 92 of 113 dup
    // pairs in the user's v0.12.1 bundle are NHI-side A+B pairs for
    // the same draw, not bridge transformer artifacts. Surfacing the
    // channel here lets the downstream mapper emit it as
    // Observation.meta.tag so SMART apps can dedupe-by-source as a UI
    // choice without violating the bridge's strict-no-dedup rule.
    nhi_source_channel: String(item.orI_TYPE || "").toUpperCase() || null,
    nhi_source_channel_name: String(item.orI_TYPE_NAME || "") || null,
    // v0.13: surface NHI 就醫日期 (funC_DATE) separately from `date`
    // (which prefers reaL_INSPECT_DATE per the v0.6.1 fix). Downstream
    // mapper emits via Observation.meta.tag so SMART apps can detect
    // visit-vs-inspect-date gaps — verified real-world case 2026-05-30:
    // 長庚嘉義 09006C HbA1c row has reaL_INSPECT_DATE=2025-12-09 but
    // funC_DATE=2025-09-16, ~3 months apart, likely hospital late report
    // or roving outpatient order. effectiveDateTime stays 12/9 per
    // FHIR "physiologically relevant time"; visit date rides in meta.tag.
    // Faithful-transport: bridge does NOT pick which is "correct".
    nhi_visit_date: rocToISO(item.funC_DATE || item.func_DATE) || null,
  };
}

// IHKE3306S01 returns visit-level rows ONLY (no drug names). The actual drug
// list lives at IHKE3306S02/page_load?crid=<row_ID>&ctype=2, in
// `ihke3306S02_main_data[*].sp_IHKE3306S03_data_list`. We do that 2-step
// fetch separately; this function adapts a single drug entry given its
// parent visit context.
//
// Date semantics (varies by visit type — visible via visit.ori_TYPE_NAME):
//   - OPD / 藥局: func_DATE is the only meaningful date. cure_E_DATE is
//     empty. authoredOn = func_DATE is accurate.
//   - 住院 (inpatient): NHI returns ONE row per admission summarising
//     every drug used during the stay. func_DATE = admission day,
//     cure_E_DATE = discharge day. NHI does not preserve the actual
//     authored date of each drug — a PPI started on stay-day 3 looks
//     identical to one prescribed on admission day.
//     We surface func_DATE → authoredOn as a best-effort anchor and
//     ADDITIONALLY emit end_date so the downstream mapper can attach
//     dispenseRequest.validityPeriod = {start: func_DATE, end: cure_E_DATE}.
//     Consumers then see "this drug was used during admission 5/18-5/22"
//     instead of "14 drugs all prescribed on 5/18".
//
// Drug-row order_drug_day note: inpatient rows ship "－" (em-dash sentinel
// for "no data") because NHI doesn't track per-drug day-supply for
// inpatients. Number("－") is NaN; the !isFinite branch sends it to 0,
// which the mapper treats as falsy and so omits expectedSupplyDuration —
// correct: better silent than fabricating a supply count.
export function adaptMedicationFromDetail(drug, visit, options) {
  if (!drug || typeof drug !== "object") return null;
  // visit.func_DATE is "115/05/05||2026/05/05" — rocToISO matches the ROC
  // prefix correctly.
  const date = rocToISO(visit?.func_DATE || visit?.func_date || "");
  const rawDrugName = drug.drug_name || drug.druG_NAME || "";
  const drug_name = pickEnglish(rawDrugName);
  if (!date || !drug_name) return null;
  // cure_E_DATE only populated for inpatient summary rows; ROC bilingual
  // with empty halves ("||") parses to "" which we want.
  const end_date = rocToISO(visit?.cure_E_DATE || visit?.cure_e_date || "");
  const days = Number(drug.order_drug_day || drug.order_DRUG_DAY || 0);
  // is_chronic flows from the chronic-prescription fan-out
  // (IHKE3307S01 list → IHKE3306S02 detail). When true, the mapper
  // attaches courseOfTherapyType=continuous. Defaults false so OPD /
  // inpatient / 藥局 acute prescriptions stay unchanged.
  const is_chronic = !!options?.is_chronic;
  // NHI 藥品基本資料庫 ships bilingual `中文||English` on three fields
  // we surface — drug_name, act (藥理分類), icd9cm_CODE_CNAME. v0.8.0
  // keeps both halves so the mapper can put 繁中 into CodeableConcept
  // .text (patient-facing) and English in coding[0].display (clinical
  // canonical). drug.drug_name2 / visit.icd9cm_CODE_CNAME2 are NHI's
  // own Chinese-only convenience fields — prefer them when present,
  // else fall back to the Chinese half of the bilingual field.
  const drug_name_zh = drug.drug_name2 || drug.druG_NAME2 || pickChinese(rawDrugName);
  const rawIndication = visit?.icd9cm_CODE_CNAME || visit?.icd9cm_name || "";
  // icd9cm_CODE_CNAME wraps each half as "<code>/<text>" — strip the
  // leading "<code>/" so downstream doesn't double-print the code when
  // it composes "<code> <text>" itself.
  const stripIcdPrefix = (s) => s.replace(/^[A-Z0-9.]+\/\s*/, "");
  const indication = stripIcdPrefix(pickEnglish(rawIndication));
  const indication_zh =
    visit?.icd9cm_CODE_CNAME2 ||
    visit?.icd9cm_code_cname2 ||
    stripIcdPrefix(pickChinese(rawIndication));
  // Bug report 2026-05-27 Part 3 C6: 758/758 MedicationRequests had no
  // dosageInstruction. Author comment previously noted "List endpoint
  // doesn't expose dose/frequency/route" but SMART app dev reported NHI
  // 健保存摺 does expose 用法. Probe several likely raw NHI field names;
  // if any contain a non-empty string we surface it via dosage_text →
  // mapper sets MedicationRequest.dosageInstruction[0].text. Empty →
  // no change (current behaviour preserved for fixtures that genuinely
  // lack the field). Safe scaffolding.
  //
  // Live raw-data audit 2026-06-13 (real IHKE3306S02 detail rows): the
  // drug-row fields NHI actually returns are ONLY
  //   order_code / drug_name / drug_name2 / order_drug_day / order_qty /
  //   act / code_url / push_ROWID / show_push
  // — none is a 用法/頻次/劑量 (frequency / sig / dosage) field. So this
  // probe never fires at IHKE3306S02 and dosage_text stays "" in practice;
  // 健保存摺 does NOT expose structured 用法 at this detail endpoint. The
  // probe is kept as harmless forward-compat scaffolding in case a future
  // endpoint ships one of these fields — do NOT claim dosage support on
  // the strength of it.
  const dosageText =
    drug.drug_freq ||
    drug.druG_FREQ ||
    drug.drug_FREQ ||
    drug.frequency ||
    drug.FREQUENCY ||
    drug.drug_use ||
    drug.druG_USE ||
    drug.drug_USE ||
    drug.usage ||
    drug.USAGE ||
    drug.sig ||
    drug.SIG ||
    drug.dosage ||
    drug.DOSAGE ||
    "";
  return {
    date,
    // Only emit when meaningfully populated AND different from start.
    // Suppressing the same-day case keeps OPD / 藥局 resources tight.
    end_date: end_date && end_date !== date ? end_date : "",
    drug_name,
    drug_name_zh,
    code: drug.order_code || drug.ordeR_CODE || "",
    // List endpoint doesn't expose dose/frequency/route — only days + qty.
    dose: "",
    frequency: "",
    route: "",
    // Raw NHI 用法 text — passes verbatim into the mapper so SMART apps
    // see at least the literal sig string even before any structured
    // BID/TID/PC parsing is added. Empty when NHI fixture didn't carry
    // any recognised 用法 field.
    dosage_text: String(dosageText).trim(),
    quantity: drug.order_qty || drug.order_QTY || "",
    duration_days: Number.isFinite(days) ? days : 0,
    indication,
    indication_zh,
    indication_code: visit?.icd9cm_CODE || visit?.icd9cm_code || "",
    drug_class: pickEnglish(drug.act || ""),
    drug_class_zh: pickChinese(drug.act || ""),
    hospital: visit?.hosp_ABBR || visit?.hosp_abbr || "",
    // Mapper reads this to set MedicationRequest.courseOfTherapyType.
    course_of_therapy: is_chronic ? "continuous" : "",
  };
}

// Stub kept for the endpoint registry — IHKE3306S01 list never has drugs,
// so we always return null and rely on the 2-step detail fetch above.
export function adaptMedication() {
  return null;
}

// Stub for the IHKE3307S01 慢性處方箋 list. The list rows have no drug
// payload; drugs come via the 2-step fan-out into IHKE3306S02 with
// ctype=row.ori_TYPE (see _fetchChronicMedicationDetailsInTab in
// background.js). Returning null here ensures the generic loop emits
// nothing from this endpoint — the fan-out is where the marked
// MedicationRequest resources are produced.
export function adaptChronicListStub() {
  return null;
}

// Same shape as adaptMedication: IHKE3408S01 (imaging list) only carries
// order-level data; the actual report narrative comes from the IHKE3408S02
// detail fan-out (see adaptImagingReportFromDetail). Returning null from
// the list adapter ensures no half-formed DiagnosticReports leak through.
export function adaptImagingListStub() {
  return null;
}

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
  function push(display, value, unit, refRange, category?, code?) {
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
  push(
    "Systolic Blood Pressure",
    row.basE_SBP,
    "mmHg",
    row.bloD_PRESS_RESULT_TEXT || "",
    "vital-signs",
  );
  push(
    "Diastolic Blood Pressure",
    row.basE_EBP,
    "mmHg",
    row.bloD_PRESS_RESULT_TEXT || "",
    "vital-signs",
  );
  // All chemistry / hep panel rows pin the NHI 醫令碼 so findLoinc takes
  // the NHI_TO_LOINC direct-lookup path — bypasses the keyword search
  // entirely. Mapping cross-verified against three sources: the NHI UI
  // section labels (健康存摺 成人預防保健), the IHKE3402 JSON field
  // names, and the existing NHI_TO_LOINC table comments.
  //
  // Lipid panel
  push("Cholesterol", row.cho, "mg/dL", "", "laboratory", "09001C"); // → LOINC 2093-3
  push("Triglyceride", row.bloD_TG, "mg/dL", "", "laboratory", "09004C"); // → LOINC 2571-8
  push("HDL", row.hdl, "mg/dL", "", "laboratory", "09043C"); // → LOINC 2085-9
  push("LDL", row.ldl, "mg/dL", "", "laboratory", "09044C"); // → LOINC 13457-7 (calc)
  // Liver function
  push("SGOT (AST)", row.sgot, "U/L", row.lF_DIAG_RESULT_TEXT || "", "laboratory", "09025C"); // → LOINC 1920-8
  push("SGPT (ALT)", row.sgpt, "U/L", row.lF_DIAG_RESULT_TEXT || "", "laboratory", "09026C"); // → LOINC 1742-6
  // Fasting glucose
  push(
    "Glu-AC",
    row.s_09005C,
    "mg/dL",
    row.s_09005C_DIAG_RESULT_TEXT || "",
    "laboratory",
    "09005C",
  ); // → LOINC 1558-6
  // Renal function — `urinE_BUN` is NHI's misleading field name; the
  // value IS serum BUN (Blood Urea Nitrogen), not a urine test.
  push("BUN", row.urinE_BUN, "mg/dL", "", "laboratory", "09002C"); // → LOINC 3094-0
  push("Creatinine", row.bloD_CREAT, "mg/dL", "", "laboratory", "09015C"); // → LOINC 2160-0
  // eGFR — derived from Creatinine, no own NHI 醫令碼. Display keyword
  // "egfr" resolves to LOINC 33914-3 via findLoinc.
  push("eGFR", row.egfr, "mL/min/1.73m2", row.rF_DIAG_RESULT_TEXT || "");
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
  push("HBsAg", row.hbsaG_TEXT || "", "", row.hbV_RESULT_TEXT || "", "laboratory", "14032C");
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
  push("Uric Acid", row.uriC_ACID, "mg/dL", "", "laboratory", "09013C");
  // Metabolic syndrome screening — value is an interpretation string
  // ('正常' / '異常，建議：請洽詢醫師'), not a number. The mapper's
  // _try_parse_quantity will return None and it falls through to
  // valueString. No mapped LOINC keyword (yet) so this lands as an
  // Observation with code.text only; downstream consumers can still
  // surface it under the patient's screening section by code.text.
  push("代謝症候群篩檢 (Metabolic Syndrome Screening)", row.metA_SYNDR_RESULT_TEXT, "", "");
  return out;
}

// IHKE3309S01 (住院 inpatient list) — gives proper admission/discharge.
// Shape: {hosp_ID, hosp_ABBR, hosp_url, in_DATE, out_DATE,
//         icd9cm_CODE, icd9cm_CODE_CNAME, ori_TYPE("3"), row_ID, ...}
// IHKE3308S01 has the same shape for a small set of older 住院 records;
// `func_DATE` instead of `in_DATE` in some rows — adapter accepts both.
export function adaptInpatientEncounter(item, options) {
  if (!item || typeof item !== "object") return null;
  const start = rocToISO(item.in_DATE || item.func_DATE || "");
  const end = rocToISO(item.out_DATE || "");
  if (!start) return null;
  // IHKE3309S01 list ships icd9cm_CODE_CNAME Chinese-only ("咳血") with
  // no bilingual `||` and no secondary diagnoses field — same problem
  // pattern as IHKE3303 OPD encounters before v0.8.4. Caller may
  // supply options.primary_diagnosis (bilingual {code, name_en, name_zh})
  // and options.secondary_diagnoses (array) from the IHKE3309S02
  // detail fan-out so the mapper produces English coding.display +
  // multiple reasonCode entries — same contract as adaptEncounterFromMedExpense.
  const stripIcdPrefix = (s) => String(s || "").replace(/^[A-Z0-9.]+\/\s*/, "");
  const s02Primary = options?.primary_diagnosis;
  const icdCode = s02Primary?.code || item.icd9cm_CODE || item.icd9cm_code || "";
  let icdName: string;
  let icdName_zh: string;
  if (s02Primary && (s02Primary.name_en || s02Primary.name_zh)) {
    icdName = s02Primary.name_en || s02Primary.name_zh;
    icdName_zh = s02Primary.name_zh || s02Primary.name_en;
  } else {
    const rawIcdName = item.icd9cm_CODE_CNAME || item.icd9cm_name || "";
    icdName = stripIcdPrefix(pickEnglish(rawIcdName));
    icdName_zh = stripIcdPrefix(pickChinese(rawIcdName));
  }
  // IHKE3309 is the formal inpatient (申報資料) endpoint by definition.
  // Channel could in theory come from item.ori_type_name if present,
  // else fall back to "申報資料" since that's what this endpoint
  // represents. See type_display contract in adaptEncounterFromMedExpense.
  const _channel = item.ori_type_name || item.orI_TYPE_NAME || "申報資料";
  return {
    date: start,
    end_date: end,
    class: "IMP",
    kind: "住院",
    channel: _channel,
    type_display: "住院",
    department: "",
    provider: "",
    reason: icdName ? (icdCode ? `${icdCode} ${icdName}` : icdName) : "",
    reason_zh: icdName_zh ? (icdCode ? `${icdCode} ${icdName_zh}` : icdName_zh) : "",
    reason_code: icdCode,
    secondary_diagnoses:
      options && Array.isArray(options.secondary_diagnoses) ? options.secondary_diagnoses : [],
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
//
// Pharmacy pickup detection — NHI mixes pharmacy dispense events into
// IHKE3303 alongside clinic visits, with NO field in this endpoint that
// distinguishes them (only the same "IC卡資料"/"申報資料" source label
// either type uses). Without intervention SMART apps see an Encounter
// shape identical to clinic visits and must guess from hospital name.
// Two signals available, both 100% concordant on observed data:
//   PRIMARY  options.pharmacy=true — caller pre-built a set of row_IDs
//            that appeared in IHKE3306 / IHKE3307 with ori_TYPE_NAME=
//            "藥局". Authoritative: uses NHI's own classification.
//   FALLBACK hosP_ABBR matches /藥局|藥房/ — covers cases where the
//            cross-ref wasn't built (medication fan-out unavailable /
//            standalone test) and the edge case of a pharmacy event
//            with no associated drug record. Reliable in practice
//            because Taiwan NHI pharmacy designations always include
//            藥局 or 藥房 in their official name.
// Encounter.type emits TWO independent dimensions (v0.9.2 — bug report
// from SMART app dev):
//   • kind    — 門診 / 急診 / 住院 / 藥局 (clinical visit classification)
//   • channel — IC卡資料 / 申報資料           (NHI data origin)
// Previously both got squashed into a single type_display string, so
// when a row arrived as 「藥局」the channel info was lost, and when it
// arrived as 「IC卡資料」the kind was lost. The mapper now emits
// type[0]={text:kind} + type[1]={text:channel} per FHIR's type 0..*.
// type_display is kept on the adapter output for backward compatibility
// with anything that still reads it directly (mapper now prefers the
// new fields when present and only falls back to type_display).
export function adaptEncounterFromMedExpense(item, classHint, options) {
  if (!item || typeof item !== "object") return null;
  const date = rocToISO(item.funC_DATE || item.func_DATE || item.func_date || "");
  if (!date) return null;
  // icd9cm_CODE_CNAME wraps each half as "<code>/<text>" — strip the
  // leading "<code>/" so downstream doesn't double-print the code when
  // it composes "<code> <text>" itself (cosmetic; SMART app side reads
  // .reasonCode[0].text and saw "I359 I359/Nonrheumatic..." before).
  const stripIcdPrefix = (s) => s.replace(/^[A-Z0-9.]+\/\s*/, "");
  // PRIMARY ICD source preference:
  //   1. options.primary_diagnosis (from IHKE3303S02 detail) — always
  //      bilingual. Caller looks this up via _primaryIcdFromS02Detail.
  //   2. S01 list row's icD9CM_CODE_CNAME — sometimes bilingual,
  //      sometimes Chinese-only depending on patient / encounter.
  // S02-sourced wins because IHKE3303S01 ships Chinese-only for some
  // patients, which used to leave Encounter.reasonCode[0].coding[0]
  // .display in 中文 (wrong audience — that field is the clinical
  // English per the v0.8.0 bilingual contract).
  const s02Primary = options?.primary_diagnosis;
  const icdCode =
    s02Primary?.code || item.icD9CM_CODE || item.icd9cm_CODE || item.icd9cm_code || "";
  let icdName: string;
  let icdName_zh: string;
  if (s02Primary && (s02Primary.name_en || s02Primary.name_zh)) {
    icdName = s02Primary.name_en || s02Primary.name_zh;
    icdName_zh = s02Primary.name_zh || s02Primary.name_en;
  } else {
    const rawIcdName = item.icD9CM_CODE_CNAME || item.icd9cm_CODE_CNAME || item.icd9cm_name || "";
    icdName = stripIcdPrefix(pickEnglish(rawIcdName));
    icdName_zh = stripIcdPrefix(pickChinese(rawIcdName));
  }
  const hospital = item.hosP_ABBR || item.hosp_ABBR || item.hosp_abbr || "";
  const isPharmacy = (options && options.pharmacy === true) || /藥局|藥房/.test(hospital);
  // class defaults to AMB; IHKE3303S02 detail fan-out may override to
  // EMER / IMP based on hosp_DATA_TYPE_NAME (急診 / 住院).
  // Derive (kind, channel) independently — see header comment.
  // kind is the visit classification (門診/急診/住院/藥局);
  // channel is the NHI data origin (IC卡資料/申報資料).
  const _channel = item.ori_type_name || item.orI_TYPE_NAME || "";
  const _kind = isPharmacy
    ? "藥局"
    : classHint === "EMER"
      ? "急診"
      : classHint === "IMP"
        ? "住院"
        : "門診";
  return {
    date,
    end_date: "",
    class: classHint || "AMB",
    kind: _kind,
    channel: _channel,
    // Legacy single-string field. The mapper now reads kind + channel
    // and ignores this when either is set; kept here so external
    // consumers that grep the adapter output don't suddenly break.
    type_display: isPharmacy ? "藥局" : _channel,
    department: "",
    provider: "",
    // English reason (clinical) and Chinese reason (patient-facing) are
    // sourced from the same bilingual NHI field; mapper places English
    // into reasonCode[0].coding[0].display and Chinese into .text.
    reason: icdName ? (icdCode ? `${icdCode} ${icdName}` : icdName) : "",
    reason_zh: icdName_zh ? (icdCode ? `${icdCode} ${icdName_zh}` : icdName_zh) : "",
    reason_code: icdCode,
    // Secondary diagnoses (次診斷) come from IHKE3303S02 detail fan-out
    // — list endpoint only exposes the primary ICD. The mapper appends
    // one Encounter.reasonCode[] entry per secondary, preserving order
    // (primary first, then 次診斷1, 2, 3, ... up to 4 observed in live
    // NHI data). Empty array when caller didn't fetch detail or NHI
    // returned no secondaries.
    secondary_diagnoses:
      options && Array.isArray(options.secondary_diagnoses) ? options.secondary_diagnoses : [],
    hospital,
    // Pass through for the eventual IHKE3303S02 detail fetch (Phase B).
    row_id: item.roW_ID || item.row_id || "",
  };
}

// IHKE3203S01 (疫苗 / 預防接種紀錄) — flat list endpoint, response shape:
//   sP_IHKE3203S01: [
//     { rownum, inoculatE_D: "112/12/27" (民國), codE_CNAME: 中文疫苗名,
//       hosP_ABBR: 接種院所, source: "疾病管制署" }
//   ]
//
// NHI ships Chinese-only on `codE_CNAME` (no bilingual `||` here). For
// COVID-19 vaccines NHI bundles the lot number into the name:
//   "輝瑞/BNT COVID-19疫苗(批號1I070A)"
//   "莫德納Spikevax雙價疫苗(O/O_BA.1)(批號035E22A)"
//   "COVID-19疫苗(AstraZeneca)(批號D006A)"
//
// Adapter splits "(批號XXXX)" into a separate lot_number field so the
// FHIR mapper can populate Immunization.lotNumber and the displayed
// vaccine name stays clean. Influenza ("流感疫苗") has no batch
// suffix — lot_number ends up empty, mapper omits the field.
//
// status: Immunization records on 健保存摺 are post-administration only
// (NHI doesn't show planned / not-given vaccines), so the mapper
// hardcodes Immunization.status = "completed".
export function adaptImmunization(item) {
  if (!item || typeof item !== "object") return null;
  const date = rocToISO(item.inoculatE_D || item.inoculate_d || "");
  const rawName = String(item.codE_CNAME || item.code_cname || "").trim();
  if (!date || !rawName) return null;
  // Extract the LAST (批號XXX) occurrence; some vaccines have multiple
  // parens like "(O/O_BA.1)(批號035E22A)" — only the 批號 one is the lot.
  const lotMatch = rawName.match(/[（(]\s*批號\s*([^)）]+?)\s*[)）]/);
  const lotNumber = lotMatch ? lotMatch[1].trim() : "";
  const cleanName = rawName.replace(/[（(]\s*批號\s*[^)）]+\s*[)）]/, "").trim();
  return {
    date,
    vaccine_name: cleanName || rawName,
    lot_number: lotNumber,
    hospital: item.hosP_ABBR || item.hosp_abbr || "",
    // NHI's source-of-record marker; preserved on the resource as
    // performer-org context (疾病管制署 = Taiwan CDC).
    source: item.source || "",
  };
}

// IHKE3213S01 (我參與的照護計畫) — NHI case-management / 衛教 programmes
// the patient is enrolled in (e.g. Pre-ESRD 病人照護與衛教計畫, 初期慢性
// 腎病追蹤). Each `myplan[]` row → a FHIR CarePlan. This is the closest
// 健康存摺 equivalent to a structured plan of care.
//
// IMPORTANT — list-extraction quirk: the IHKE3213S01 page_load response
// carries SEVERAL data arrays (physiology / bloodsugar / bloodlipid widget
// data alongside the `myplan` care-plan list). extractList() merges every
// data array and tags each item with __section. So this adapter is called
// on NON-care-plan rows too. We key off `mhbt_name` (the 計畫名稱, present
// only on myplan rows) and return null for everything else — robust
// regardless of __section ordering.
//
// Payload shape (live capture 2026-06-03):
//   myplan: [
//     { mhbt_name:  "末期腎臟病前期（Pre-ESRD）之病人照護與衛教計畫", ← 計畫名稱
//       mhbt_memo:  "對慢性腎臟病之高危險群進行個案管理…",            ← 計畫說明
//       hosp_id:    "1339060017",
//       hosp_abbr:  "中國北港醫",
//       case_date:  "113年6月13日",   ← 收案日 (民國年月日, 中文分隔)
//       close_date: "",               ← 結案日 (空 = 仍在進行)
//       prgcode:    null,             ← 計畫代碼 (有時為 NHI 程式代號)
//       hospurl:    "https://info.nhi.gov.tw/…" }
//   ]
//
// status: close_date 空 → "active"；有結案日 → "completed". NHI only lists
// real enrolments (no planned / cancelled), so those are the only states.
// Faithful-transport: bridge derives status from close_date presence only;
// title / memo / dates / hospital pass through verbatim.
export function adaptCarePlan(item) {
  if (!item || typeof item !== "object") return null;
  const title = String(item.mhbt_name || item.mhbT_NAME || "").trim();
  if (!title) return null; // not a myplan row (physiology / bloodsugar / …)
  const start = rocChineseToISO(item.case_date || item.casE_DATE || "");
  const end = rocChineseToISO(item.close_date || item.closE_DATE || "");
  return {
    title,
    description: String(item.mhbt_memo || item.mhbT_MEMO || "").trim(),
    period_start: start,
    period_end: end,
    // A 結案日 means the programme has ended.
    status: end ? "completed" : "active",
    hospital: String(item.hosp_abbr || item.hosP_ABBR || "").trim(),
    hospital_id: String(item.hosp_id || item.hosP_ID || "").trim(),
    // NHI programme code, when present (e.g. "IHKE3505S01"). `prgcode` is
    // often null — `|| ""` collapses null/undefined cleanly. Surfaced as a
    // CarePlan.category coding downstream.
    program_code: String(item.prgcode || item.prgCode || item.prgCODE || "").trim(),
  };
}

// IHKE3404 癌症篩檢結果 — confirmed by live raw-data audit 2026-06-13.
//
// IMPORTANT endpoint topology (this is why cancer screening was silently
// captured as ZERO before): IHKE3404S01/SP_IHKE3404S01 is only the
// CATEGORY MENU page (returns `{T_SEX}` — no data array). The real
// per-cancer-type results live at sibling sub-endpoints, with a
// NON-uniform URL suffix verified against the live API:
//   大腸癌  s02 → SP_IHKE3404S02      口腔癌   s03 → SP_IHKE3404S03
//   乳癌    s04 → page_load           子宮頸癌 s05 → SP_IHKE3404S05
//   肺癌    s06 → page_load           婦女HPV  s07 → page_load
//   胃HPSA  s08 → page_load
// (page_load 404s for the SP_ ones and vice-versa — paths are fixed per
// endpoint. No clicklink gate is needed; the earlier 404s were purely
// wrong-suffix.) Each response carries ONE array (`sP_…_Data` or
// `sp_…_Data` — casing differs by endpoint; extractList finds it).
//
// Row shape is QUALITATIVE (no assaY_VALUE / uniT_DATA), which is also
// why adaptLabItem dropped every row even when pointed at the right
// endpoint:
//   { hosP_ID, hosP_ABBR, id, funC_DATE, assaY_RESULT ("0"),
//     codE_CNAME ("無異常" / 異常 …), codE_ENAME,
//     diagnosis_CODE? (乳癌, BI-RADS-ish "●良性發現<BR>…"),
//     cytopathiC_CODE? (子宮頸, 抹片細胞病理碼) }
//
// We emit ONE Observation per screening record: code.text = the screening
// label (大腸癌篩檢 …), valueString = the result, with any per-type detail
// (乳攝 BI-RADS / 抹片碼) folded in cleanly. `screeningLabel` is bound per
// endpoint in the registry. source_program="cancer-screening" tags the
// Observation so SMART apps can filter the 癌症篩檢 programme.
export function adaptCancerScreening(item, screeningLabel) {
  if (!item || typeof item !== "object") return null;
  const date = rocToISO(item.funC_DATE || item.func_date || "");
  const resultText = String(item.codE_CNAME || item.code_cname || "").trim();
  if (!date || !resultText) return null;
  // Per-type free-text detail: 乳癌 diagnosis_CODE (findings, may carry
  // <BR> + ● bullets), 子宮頸 cytopathiC_CODE (cytopathology code/text).
  const detailRaw = String(
    item.diagnosis_CODE ||
      item.diagnosis_code ||
      item.cytopathiC_CODE ||
      item.cytopathic_code ||
      "",
  );
  const detail = detailRaw
    .replace(/<br\s*\/?>/gi, "；") // HTML line breaks → fullwidth semicolon
    .replace(/[●•·]\s*/g, "") // bullet glyphs
    .replace(/[；;]\s*[；;]+/g, "；") // collapse doubled separators
    .replace(/\s+/g, " ")
    .replace(/^[；;\s]+|[；;\s]+$/g, "")
    .trim();
  const value = detail ? `${resultText}（${detail}）` : resultText;
  return {
    date,
    // No NHI 醫令碼 on these rows — group/route by the screening label.
    code: "",
    order_name: screeningLabel,
    display: screeningLabel,
    value,
    unit: "",
    reference_range: "",
    category: "laboratory",
    hospital: item.hosP_ABBR || item.hosp_abbr || "",
    // Tagged so SMART apps can isolate the 癌症篩檢 programme (mirrors
    // adult-preventive's source_program tag).
    source_program: "cancer-screening",
  };
}

export function adaptAllergy(item) {
  if (!item || typeof item !== "object") return null;
  const allergen =
    item.allergen_name || item.alleR_NAME || item.medname || item.druG_NAME || item.allergen || "";
  if (!allergen) return null;
  return {
    recorded_date: rocToISO(item.funC_DATE || item.recorD_DATE || ""),
    display: allergen,
    category: "medication",
    criticality: "unable-to-assess",
    reaction: item.reactioN || item.symptom || "",
  };
}

// IHKE3301S05 (處置/手術 list) is metadata-only:
//   {hosp_id, hosp_abbr, hosp_url, ori_type_name, ori_type, func_date,
//    out_date, icd9cm_code, icd9cm_code_cname, op_code_cname, row_id}
// No procedure CODE (ICD-10-PCS) and no actual exam-date. The procedure
// CODE + exe_S_DATE only show up on the IHKE3308S02 detail endpoint
// (analogous to IHKE3408S01 imaging list → S02 detail). We do a 2-step
// fan-out from the list's row_ID; the list adapter therefore returns
// null and the real work happens in adaptProcedureFromDetail below.
export function adaptProcedureListStub() {
  return null;
}

// IHKE3308S02 (處置/手術 detail) shape (per row in ihke3308S02_main_data):
//   {rowid, main_tit ("105/09/23 ~ 105/09/26｜住院" or "105/01/14｜門診"),
//    hosp_ID, hosp_ABBR, hosp_url, ori_TYPE_NAME, ori_TYPE,
//    icd9cm_CODE, icd9cm_CODE_CNAME,         ← reason for procedure
//    op_CODE,    op_CODE_CNAME,              ← ICD-10-PCS + bilingual label
//    func_DATE, func_SEQ_NO, part_AMT, appl_DOT,
//    sp_IHKE3308S04_data_list: [{
//       exe_S_DATE ("YYY/MM/DD||YYYY/MM/DD"),  ← actual execution date
//       order_CODE_NAME (bilingual),           ← NHI billing-item name
//       order_CODE,                            ← NHI 醫令碼
//    }, ...]}
//
// Date field choice — IHKE3308S02 detail exposes:
//   - sp_IHKE3308S04_data_list[].exe_S_DATE — 執行起始日; this is the
//                      actual day the patient had the procedure. For
//                      inpatient procedures (admit M/01, surgery M/05,
//                      discharge M/10) exe_S_DATE = M/05 — correct.
//   - func_DATE       — order/visit anchor day (門診開單日 / 入院日);
//                      same wrong-anchor pattern as imaging — using it
//                      for inpatient procedures shifts the exam back
//                      to the admission day.
// Fallback chain: first sub-list entry's exe_S_DATE → func_DATE.
//
// FHIR coding strategy:
//   - Procedure.code coding uses op_CODE (ICD-10-PCS) as the primary
//     coded value with system=icd-10-pcs — was previously the empty
//     string because the list endpoint never carries it.
//   - icd9cm_CODE + CNAME map to a Reason: prefix in the note (same
//     pattern the old adapter used) so the mapper's "no note → drop"
//     filter keeps benign rows out while letting genuine procedures
//     pass.
//   - Sub-list entries' order_CODE_NAME + order_CODE go into the note
//     as 施作: lines so SMART apps can show the NHI billing breakdown.
export function adaptProcedureFromDetail(item) {
  if (!item || typeof item !== "object") return null;
  const subList = Array.isArray(item.sp_IHKE3308S04_data_list) ? item.sp_IHKE3308S04_data_list : [];
  // exe_S_DATE format is "115/09/23||2026/09/23"; rocToISO already
  // matches the first ROC segment, so feeding the whole string works.
  const exeDate = subList.length > 0 ? subList[0].exe_S_DATE || subList[0].exe_s_date || "" : "";
  const date = rocToISO(exeDate || item.func_DATE || item.func_date || "");
  // op_CODE_CNAME is "<CODE>/<中文>||<CODE>/<English>". Take the
  // English half, strip the leading "<CODE>/" so the display reads
  // like "Excision of Left Vitreous, Percutaneous Approach" rather
  // than "08B53ZZ/Excision of Left Vitreous…".
  const opCode = item.op_CODE || item.op_code || "";
  const rawOpName = item.op_CODE_CNAME || item.op_code_cname || "";
  const opName = pickEnglish(rawOpName);
  const opName_zh = pickChinese(rawOpName);
  const stripCode = (s) => (s || "").replace(/^[A-Z0-9]+\//, "").trim();
  const display = stripCode(opName) || opName.trim();
  const display_zh = stripCode(opName_zh);
  if (!date || !display) return null;

  const reasonCode = item.icd9cm_CODE || item.icd9cm_code || "";
  const reasonName = (pickEnglish(item.icd9cm_CODE_CNAME || item.icd9cm_code_cname || "") || "")
    .replace(/^[A-Z0-9]+\//, "")
    .trim();
  const noteParts = [];
  if (reasonName) {
    noteParts.push(reasonCode ? `Reason: ${reasonCode} ${reasonName}` : `Reason: ${reasonName}`);
  }
  for (const sub of subList) {
    const subName = pickEnglish(sub.order_CODE_NAME || sub.order_code_name || "").trim();
    const subCode = sub.order_CODE || sub.order_code || "";
    if (subName) {
      noteParts.push(subCode ? `施作: ${subName} (NHI ${subCode})` : `施作: ${subName}`);
    }
  }

  return {
    date,
    code: opCode,
    // Hint for mapProcedure.mapSystem — "icd-10-pcs" string contains
    // "icd", so the mapper assigns systems.ICD_10_PCS.
    system: opCode ? "icd-10-pcs" : "",
    display,
    display_zh,
    note: noteParts.join(" / "),
    body_site: "",
    hospital: item.hosp_ABBR || item.hosp_abbr || "",
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
// Date field choice — IHKE3408S02 detail payload exposes (in order
// of accuracy for "when did the patient actually have the exam"):
//   - real_INSPECT_DATE  實際採檢/做影像日 — most accurate but NHI
//                        commonly ships this as null on S02 detail
//   - main_tit           簽收日 — the card's prominent header date
//                        in NHI's own UI. Semantically this is when
//                        the exam was performed and signed off (NOT
//                        the order day). Closest proxy when
//                        real_INSPECT_DATE is null.
//   - func_DATE          門診開單日 (OPD) / 入院日 (inpatient) — the
//                        date the order was written, NOT the date
//                        the exam happened. For OPD imaging that is
//                        scheduled later (e.g. echo ordered 1/31,
//                        done 2/29) using func_DATE shifts the exam
//                        back to the order day — wrong.
//   - assay_UPLOAD_DATE  NHI 收檔時間 — internal data-pipeline
//                        timestamp; belongs to DiagnosticReport.issued.
// Fallback chain: real_INSPECT_DATE → main_tit → func_DATE. main_tit
// goes above func_DATE because main_tit IS what NHI itself displays
// to the patient as "this report's date" and reflects the sign-off /
// exam day. func_DATE remains as last resort so a malformed row
// without main_tit still produces some date instead of being dropped.
// `ctx` carries the (rid, ctype) the detail was fetched under, so a
// later imaging-JPEG fan-out can re-key its base64 results back onto
// the right report. Optional — callers without ctx (legacy tests) leave
// the fields as empty strings.
export function adaptImagingReportFromDetail(item, ctx?: { rid?: string; ctype?: string }) {
  if (!item || typeof item !== "object") return null;
  const date = rocToISO(
    item.real_INSPECT_DATE ||
      item.real_inspect_date ||
      item.main_tit ||
      item.main_TIT ||
      item.func_DATE ||
      item.func_date ||
      "",
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
    // Per-row routing keys for the imaging-JPEG opt-in flow. Always
    // emitted so a post-fetch step can match jpegResults back onto the
    // exact narrative this came from (multiple rows share order_CODE).
    rid: ctx?.rid || "",
    ctype: ctx?.ctype || "",
  };
}

// Counterpart to adaptImagingReportFromDetail for image-only rows
// (desc empty, image attachment present after the trigger/poll flow).
// Without this path, every image-only DR would silently disappear at
// the narrative gate above — losing X-ray / endoscopy results that
// never get a typed text report.
//
// `meta` is the raw IHKE3408S02 detail row metadata captured by
// fetchImagingDetails for every row, not just narrative-bearing ones.
// mapDiagnosticReport recognises raw.imageOnly + raw.jpgBase64 and
// emits status="final" without conclusion; presentedForm carries the
// clinical content the missing narrative would have described.
export function adaptImageOnlyReportFromMeta(
  meta: {
    date?: string;
    orderCode?: string;
    orderName?: string;
    hospital?: string;
    assayUploadDate?: string;
    funcDate?: string;
  },
  ctx?: { rid?: string; ctype?: string },
) {
  if (!meta) return null;
  const date = rocToISO(meta.date || meta.funcDate || "");
  const display = pickEnglish(meta.orderName || "");
  if (!date || !display) return null;
  return {
    date,
    code: meta.orderCode || "",
    system: "",
    display,
    category: "RAD",
    conclusion: "",
    hospital: meta.hospital || "",
    issued: rocToISO((meta.assayUploadDate || "").split(/\s+/)[0]),
    rid: ctx?.rid || "",
    ctype: ctx?.ctype || "",
    imageOnly: true,
  };
}
