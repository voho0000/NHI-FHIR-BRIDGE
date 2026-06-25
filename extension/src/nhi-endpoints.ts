// NHI API endpoint registry — what we fetch, where each row goes,
// which adapter to call on it.
//
// Extracted from background.js so we can:
//   1. Unit-test "every endpoint name has a Chinese label" — historically
//      it was easy to add a new endpoint and forget to update
//      ENDPOINT_LABEL_ZH, leaving the popup's 查看明細 row labelled with
//      the dev-flavoured raw key ("other_labs" instead of "檢驗").
//   2. Keep background.js focused on flow control + tab/IO logic.
//
// Adapter references live in ./nhi-adapters.js. See that module for the
// per-adapter field-priority decisions (date selection, name fallbacks,
// bilingual splitting, etc.).

import {
  adaptAdultPreventive,
  adaptAllergy,
  adaptCancerScreening,
  adaptCarePlan,
  adaptCatastrophicIllness,
  adaptChronicListStub,
  adaptEncounterFromMedExpense,
  adaptImagingListStub,
  adaptImmunization,
  adaptInpatientEncounter,
  adaptLabItem,
  adaptMedication,
  adaptProcedureListStub,
} from "./nhi-adapters.js";

// 癌症篩檢 sub-endpoints (IHKE3404S02–S08). NOT a single endpoint: each
// cancer type has its own sub-endpoint with a NON-uniform URL suffix
// (SP_… vs page_load — verified live 2026-06-13; see adaptCancerScreening).
// IHKE3404S01 (the old registry target) is just the category menu and
// returns no data — which is why cancer screening captured ZERO before.
// `label` is bound into each entry's adapter so one Observation per record
// carries the screening name. No date-range param (NHI returns all-time).
const CANCER_SCREENING_ENDPOINTS = [
  {
    name: "cancer_colorectal",
    label: "大腸癌篩檢",
    path: "/api/ihke3000/ihke3404s02/SP_IHKE3404S02",
  },
  { name: "cancer_oral", label: "口腔癌篩檢", path: "/api/ihke3000/ihke3404s03/SP_IHKE3404S03" },
  { name: "cancer_breast", label: "乳癌篩檢", path: "/api/ihke3000/ihke3404s04/page_load" },
  {
    name: "cancer_cervical",
    label: "子宮頸癌篩檢",
    path: "/api/ihke3000/ihke3404s05/SP_IHKE3404S05",
  },
  { name: "cancer_lung", label: "肺癌篩檢", path: "/api/ihke3000/ihke3404s06/page_load" },
  { name: "cancer_hpv", label: "婦女HPV檢測", path: "/api/ihke3000/ihke3404s07/page_load" },
  { name: "cancer_hpsa", label: "胃幽門桿菌篩檢", path: "/api/ihke3000/ihke3404s08/page_load" },
].map((c) => ({
  name: c.name,
  path: c.path,
  // Dedicated page_type → mapCancerScreening (bilingual qualitative result),
  // NOT the lab observation pipeline.
  page_type: "cancer_screening",
  // No date-range param — NHI returns all-time screening history.
  supportsDateRange: false,
  adapt: (item: any) => adaptCancerScreening(item, c.label),
}));

// User-facing label for each endpoint name. The breakdown collapsible
// in the popup ("查看明細") reads from this so users see "就醫 12 筆"
// instead of the dev-flavoured "encounters=12/12". Unknown names fall
// through to the raw key, which keeps it obvious during development
// when we add a new endpoint and haven't labelled it yet.
export const ENDPOINT_LABEL_ZH = {
  encounters: "就醫",
  inpatient: "住院",
  procedures: "手術 / 處置",
  medications: "處方藥品",
  chronic_prescriptions: "慢性處方箋",
  allergies: "藥物過敏",
  allergies_b: "藥物過敏（B）",
  adult_preventive: "成人健檢",
  cancer_colorectal: "大腸癌篩檢",
  cancer_oral: "口腔癌篩檢",
  cancer_breast: "乳癌篩檢",
  cancer_cervical: "子宮頸癌篩檢",
  cancer_lung: "肺癌篩檢",
  cancer_hpv: "婦女HPV檢測",
  cancer_hpsa: "胃幽門桿菌篩檢",
  imaging: "影像檢查",
  other_labs: "檢驗",
  catastrophic_illness: "重大傷病",
  immunizations: "疫苗",
  care_plans: "照護計畫",
};

// page_type → backend page_type string used by mappers.
// path is relative to nhiBase. method default "GET".
// `supportsDateRange: true` = endpoint accepts s_date / e_date in 民國 format.
// Confirmed via URLs observed in NHI's SPA. Other endpoints either don't
// accept range params, or NHI rejects unknown params — we leave them alone
// (they fall back to their default window, typically 1-2 years).
export const NHI_API_ENDPOINTS = [
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
  {
    name: "encounters",
    path: "/api/ihke3000/ihke3303s01/search?s_date=&e_date=",
    page_type: "encounters",
    adapt: adaptEncounterFromMedExpense,
    supportsDateRange: true,
  },
  // Inpatient (住院) — IHKE3309S01 is the SOLE authoritative 住院 list (it is what
  // 健康存摺's 住院 page renders; user rule 2026-06-23: 住院 = ONLY what IHKE3309S01
  // shows, nothing else). The old IHKE3308S01 ("住院舊") feed was REMOVED: IHKE3308
  // is the 處置/手術 domain (its sibling IHKE3308S02 is the surgery/處置 detail), so
  // its rows include 門診手術 — feeding them here minted PHANTOM admissions (real
  // case: P22074 2025-08-04 C50.912, a 門診手術 with no 出院日 + no 住院明細, which the
  // patient's 住院 page does NOT show). Surgeries are unaffected — they come from
  // the procedures path (IHKE3301S05 → IHKE3308S02 detail), independent of this.
  {
    name: "inpatient",
    path: "/api/ihke3000/ihke3309s01/page_load",
    page_type: "encounters",
    adapt: adaptInpatientEncounter,
  },
  // Procedures (IHKE3301S05) list only has order-level metadata —
  // no ICD-10-PCS code and no actual performed-date. The full
  // record lives at IHKE3308S02 (sub-list carries exe_S_DATE +
  // NHI 醫令碼 per execution). Same 2-step fan-out pattern as
  // imaging; see _fetchProcedureDetailsInTab.
  {
    name: "procedures",
    path: "/api/ihke3000/ihke3301s05/page_load",
    page_type: "procedures",
    adapt: adaptProcedureListStub,
  },
  // medications: page_load only accepts empty dates (HTTP 400 otherwise).
  // The /search endpoint is what the SPA hits when user picks a custom
  // date range and accepts ISO 西元 dates with dashes (2023-01-01).
  // Confirmed via DevTools observation of the 篩選 panel submit.
  {
    name: "medications",
    path: "/api/ihke3000/ihke3306s01/search?s_date=&e_date=&s_sort=A1&s_type=A",
    page_type: "medications",
    adapt: adaptMedication,
    supportsDateRange: true,
  },
  // 慢性處方箋 (refill="Y") — separate list endpoint from medications.
  // ~52 of 126 entries overlap with IHKE3306S01; the rest are
  // chronic-only and would be missed if we relied on regular list alone.
  // The chronic detail fan-out runs BEFORE the medication fan-out and
  // its row_IDs are passed to the medication fan-out as skip-set so
  // each row is fetched once. See _fetchChronicMedicationDetailsInTab
  // in background.js. Detail endpoint is the same IHKE3306S02 as
  // regular meds; ctype must equal the list row's ori_TYPE (1=門診,
  // 2=IC卡, 8=藥局), not hardcoded to 8.
  {
    name: "chronic_prescriptions",
    path: "/api/ihke3000/IHKE3307S01/page_load",
    page_type: "medications",
    adapt: adaptChronicListStub,
  },
  {
    name: "allergies",
    path: "/api/ihke3000/ihke3202s01/SP_IHKE3202S01",
    page_type: "allergies",
    adapt: adaptAllergy,
  },
  {
    name: "allergies_b",
    path: "/api/ihke3000/ihke3202s01/SP_IHKE3202S04",
    page_type: "allergies",
    adapt: adaptAllergy,
  },
  // 成人預防保健結果 (IHKE3402S01): one row per screening, contains
  // BMI / vitals / lipid panel / LFT / RFT / Hep B/C / uric acid all
  // pre-computed by NHI's screening programme. adaptAdultPreventive
  // returns an array (one Observation per measurement) so the
  // adapter-call loop flattens it.
  {
    name: "adult_preventive",
    path: "/api/ihke3000/ihke3402s01/SP_IHKE3402S01",
    page_type: "observations",
    adapt: adaptAdultPreventive,
  },
  // 癌症篩檢 (IHKE3404S02–S08) — 7 per-cancer-type sub-endpoints, spread
  // in from CANCER_SCREENING_ENDPOINTS above. The pre-2026-06-13 single
  // entry pointed at IHKE3404S01 (the category MENU, no data) and used
  // adaptLabItem (which needs assaY_VALUE the qualitative rows don't have)
  // — so cancer screening captured ZERO. Now each type fetches its real
  // sub-endpoint and maps via adaptCancerScreening.
  ...CANCER_SCREENING_ENDPOINTS,
  // glucose (IHKE3406S01) + lipid (IHKE3407S01) are subsets of
  // other_labs (IHKE3409S01) per NHI's data model — fetching them
  // separately just creates dup observations, so we skip them.
  // Imaging list (IHKE3408S01) only carries order-level data; full
  // narrative report lives at IHKE3408S02. We do a 2-step fetch (see
  // _fetchImagingDetailsInTab) to grab the report, then map to a real
  // DiagnosticReport. The list adapter is a no-op stub like medications.
  // imaging: search endpoint accepts ISO date range like medications.
  {
    name: "imaging",
    path: "/api/ihke3000/ihke3408s01/search?s_type=&s_date=&e_date=&s_sort=A1",
    page_type: "diagnostic_reports",
    adapt: adaptImagingListStub,
    supportsDateRange: true,
  },
  // other_labs already uses /search; same ISO-dash date format works.
  {
    name: "other_labs",
    path: "/api/ihke3000/ihke3409s01/search?s_type=&s_date=&e_date=&s_sort=A1",
    page_type: "observations",
    adapt: adaptLabItem,
    supportsDateRange: true,
  },
  // IHKE3209S01 (重大傷病) — NHI-vetted catastrophic-illness registry.
  // Each row → a FHIR Condition with category=problem-list-item, the
  // closest 健康存摺 equivalent to a curated problem list. Endpoint
  // doesn't accept date params (NHI returns currently-valid certs only).
  {
    name: "catastrophic_illness",
    path: "/api/ihke3000/ihke3209s01/SP_IHKE3209S01",
    page_type: "conditions",
    adapt: adaptCatastrophicIllness,
  },
  // IHKE3203S01 (預防接種紀錄 / 疫苗) — Taiwan CDC sourced. Each row
  // → FHIR Immunization. NHI ships Chinese-only vaccine names with
  // batch number inlined as "(批號XXX)"; adapter splits the lot.
  // No date range parameter (NHI returns all historical vaccinations).
  {
    name: "immunizations",
    path: "/api/ihke3000/ihke3203s01/SP_IHKE3203S01",
    page_type: "immunizations",
    adapt: adaptImmunization,
  },
  // IHKE3213S01 (我參與的照護計畫) — NHI case-management / 衛教 programme
  // enrolments. Each myplan[] row → a FHIR CarePlan. The page_load
  // response also carries physiology / bloodsugar / bloodlipid widget
  // arrays; adaptCarePlan keys off mhbt_name so only the care-plan rows
  // produce resources (extractList merges all data arrays). No date-range
  // param — NHI returns the patient's full enrolment history.
  {
    name: "care_plans",
    path: "/api/ihke3000/IHKE3213S01/page_load",
    page_type: "care_plans",
    adapt: adaptCarePlan,
  },
];
