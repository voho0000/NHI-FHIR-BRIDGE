/**
 * LLM-driven HTML → FHIR extraction (fallback path only).
 *
 * Port of `backend/app/fallback/extractor.py`. Invoked only by
 * /sync/upload-html when the primary JSON-API path can't be used.
 * Both this module and the primary path consume the same dispatch
 * tables in `mapper/dispatch.ts`, so output is identical.
 */

import type { LLMProvider } from "@/fallback/llm/base";
import { GROUP_HANDLERS, LIST_HANDLERS } from "@nhi-fhir-bridge/mapper";
import { mapPatient } from "@nhi-fhir-bridge/mapper";

// Page type → JSON schema fed to the LLM.
export const SCHEMAS: Record<string, Record<string, any>> = {
  patient_info: {
    id: "patient internal ID or chart number",
    identifier: "patient chart/MRN number",
    name: "full name",
    birthDate: "YYYY-MM-DD",
    gender: "male | female | other | unknown",
    phone: "contact phone (optional)",
    address: "address (optional)",
  },
  observations: {
    _instructions:
      "Extract LABORATORY test results only — anything with a numeric or categorical lab value (CBC, biochem, tumor markers, endocrinology, microbiology, urinalysis, etc.). " +
      "SKIP imaging studies (ultrasound, CT, MRI, X-ray, mammography, sonogram, ECG/EKG, endoscopy) — those are diagnostic_reports, not observations. SKIP rows that only show test names and dates with no actual result value (these are list-view rows). " +
      "\n\nPANEL GROUPING: NHI 健康存摺 pages organize lab results into panels — one medical order (e.g. '尿生化檢查', 'CBC with diff', '肝功能套組') produces many sub-items (子項目). When the page shows columns like 醫令代碼 / 醫囑名稱 / order_code / panel name, populate order_code and order_name EXACTLY as displayed for every row, using the SAME values for items belonging to the SAME panel — this lets us group them into one DiagnosticReport downstream. When the page is flat (no panel columns), leave order_code/order_name empty and we'll group per-item by display+date instead. " +
      "Also capture hospital (醫事機構) when shown, so panels from different hospitals on the same date stay separate. " +
      "\n\nDEDUPLICATION (重要): NHI 健康存摺 often shows the SAME lab result multiple times because each value is reported by different data sources (資料來源 A vs B) under different language formats — e.g. '醣化血紅素 5.9%' AND 'HbA1c 5.9%' AND 'A1C (HbA1C) 5.9%' are ONE measurement, not three. When you see the same date + same value + same unit appearing with different display names, output it ONCE only. **Prefer the English abbreviation** (e.g. 'HbA1c' over '醣化血紅素', 'ALT' over '血清麩胺酸丙酮酸轉氨基脢', 'WBC' over '白血球計數') because clinicians read labs in English. Same rule for urine panel items where Chinese (尿蛋白) and English (Protein) of the same item appear: only one row, English display preferred. " +
      "\n\nDo not echo the _instructions field in your output.",
    observations: [
      {
        date: "YYYY-MM-DD result date",
        order_code: "panel/order code if shown (e.g. '06013C'); leave empty if absent",
        order_name: "panel/order name if shown (e.g. '尿生化檢查'); leave empty if absent",
        code: "individual item code (e.g. GLU, HGB)",
        display: "individual item name (e.g. 尿蛋白, 白血球計數)",
        value: "numeric or string result — REQUIRED, omit row if missing",
        unit: "unit of measure",
        reference_range: "e.g. 70-100",
        interpretation: "normal | high | low | critical",
        hospital: "issuing hospital if shown",
      },
    ],
  },
  medications: {
    _instructions:
      "Extract ONLY actual dispensed medications from the 藥品醫囑資料 (drug order) section. Each item MUST have a medication name (醫囑名稱 / drug_name). " +
      "SKIP: visit-level headers (date, hospital, disease classification), 非藥品醫囑資料 (non-drug service orders), procedure items, and any row that does not represent an individual drug dispensed. " +
      "For frequency and route: populate ONLY if explicitly stated in the page — do NOT guess or infer (e.g. NHI 健康存摺 does not include route or frequency per drug; leave both empty). " +
      "\n\nDEDUPLICATION (重要): NHI 健康存摺 frequently lists the SAME prescription 2-3 times because each drug is reported in multiple language formats — e.g. you may see 'TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION', 'TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION (青眼露長效型...)' and '青眼露長效型... (TIMOPTOL XE 0.5%...)' all on the same date. These are ONE prescription, not three. Output it ONCE only. **Prefer the English brand name** (e.g. 'TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION' over '青眼露長效型...') because clinicians scan medication lists by English brand name. If only the Chinese name is present, use that. " +
      "\nDo not echo the _instructions field in your output.",
    medications: [
      {
        date: "YYYY-MM-DD prescription date",
        drug_name: "REQUIRED — medication name and strength. Omit entire row if absent.",
        dose: "dose amount if shown",
        unit: "mg / ml / tab — only if explicitly stated",
        frequency: "QD / BID / TID / PRN — only if explicitly stated, else omit",
        route: "oral / IV / ophthalmic — only if explicitly stated, else omit",
        duration_days: "number of days as integer if shown",
        indication: "reason / diagnosis (optional)",
      },
    ],
  },
  conditions: {
    conditions: [
      {
        onset_date: "YYYY-MM-DD onset or diagnosis date",
        code: "ICD-10 or SNOMED-CT code",
        system: "coding system (SNOMED-CT / ICD-10)",
        display: "diagnosis name",
        clinical_status: "active | resolved | inactive | remission",
        severity: "mild | moderate | severe",
      },
    ],
  },
  allergies: {
    _instructions:
      "Extract ONLY substances the patient is documented to be allergic to or to have an adverse reaction to. HIS pages often mix allergy entries with unrelated clinical reminders (screening due, weight change alerts, drug-drug interaction warnings) — IGNORE those. Look for headers like '藥物過敏', '過敏原', 'allergy', '不良反應', '藥物不良反應', then enumerate items listed under that header only. Do not echo the _instructions field in your output.",
    allergies: [
      {
        recorded_date: "YYYY-MM-DD date recorded (omit if unknown)",
        code: "allergen code (often unavailable in HIS, omit)",
        system: "coding system (often unavailable, omit)",
        display: "specific allergen name (e.g. Penicillin, DEXTROMETHORPHAN, peanut)",
        category: "medication | food | environment | biologic",
        criticality: "high | low | unable-to-assess",
        reaction: "reaction description if mentioned, else omit",
      },
    ],
  },
  diagnostic_reports: {
    _instructions:
      "Extract reports that have actual report content / conclusion / impression / findings — radiology reads, pathology results, endoscopy summaries, ECG interpretations. SKIP rows that only show a report name and date with no narrative conclusion text (those are list-view rows; the detail-view capture for that specific report will fill in the conclusion later). " +
      "If the conclusion field would be empty, OMIT the entire row. " +
      "Do not echo the _instructions field in your output.",
    diagnostic_reports: [
      {
        date: "YYYY-MM-DD report date",
        code: "LOINC or local code",
        system: "LOINC or local system",
        display: "report name",
        category: "LAB | RAD | CAR | PATH",
        status: "final | preliminary | amended",
        conclusion:
          "REQUIRED narrative report content (Impression / Findings / Comment / 結論 / 報告內容). Omit row if no conclusion exists.",
      },
    ],
  },
  procedures: {
    _instructions:
      "Extract ACTUAL therapeutic / surgical procedures with descriptive content — drainage procedures, biopsies, endoscopies, surgeries, catheter insertions, paracentesis, etc. Each row must include a narrative `note` (procedure description / findings) OR a `body_site` (anatomical location). " +
      "SKIP pure laboratory tests (CBC, tumor markers, microbiology culture orders) and pure imaging (CT, MRI, ultrasound, X-ray) — those go in observations / diagnostic_reports respectively. " +
      "SKIP list-view rows that show only a request name + date with no procedural content. " +
      "Do not echo the _instructions field in your output.",
    procedures: [
      {
        date: "YYYY-MM-DD procedure date",
        code: "SNOMED-CT or ICD procedure code",
        system: "coding system",
        display: "procedure name",
        status: "completed | in-progress | not-done",
        body_site: "anatomical site — populate when known",
        note: "REQUIRED narrative description of what was done / found. Omit row if neither note nor body_site is available.",
      },
    ],
  },
  encounters: {
    _instructions:
      "Extract one Encounter per visit. If the page contains a SOAP or visit-detail block for a SPECIFIC date (e.g. legend like '[2025-11-17_SOAP]', '門診紀錄', '住院摘要', '出院摘要'), emit ONLY that visit with its clinical_note fully populated — do NOT also echo the other visits from the surrounding list. Stable IDs will merge that detail with the list-row Encounter captured separately. " +
      "If the page is purely a list view (no SOAP/detail block), emit every visit row with its metadata and leave clinical_note empty. Do not echo the _instructions field.",
    encounters: [
      {
        date: "YYYY-MM-DD start date",
        end_date: "YYYY-MM-DD end date (optional)",
        class: "AMB (outpatient) | IMP (inpatient) | EMER (emergency)",
        type_code: "encounter type code",
        type_display: "encounter type name",
        department: "department or specialty name",
        provider: "attending physician name",
        reason: "chief complaint / dx codes for this visit",
        discharge_disposition: "discharge disposition (optional)",
        clinical_note:
          "SOAP / visit narrative when extracting a detail page: concatenate Subjective, Objective, Assessment, Plan sections with section headers preserved. Empty string for list-only rows.",
      },
    ],
  },
};

export function supportedPageTypes(): string[] {
  return Object.keys(SCHEMAS);
}

const REPORT_LIKE = ["observations", "diagnostic_reports", "procedures"] as const;

export async function extractAndMap(
  html: string,
  pageType: string,
  patientId: string | null,
  llmOrOpts: LLMProvider | { host?: string | null } = {},
  hostMaybe?: string | null,
): Promise<Record<string, any>[]> {
  // Polymorphic: ({host} only) used by api/sync.ts internal call, or
  // (provider, host) used directly by tests.
  let provider: LLMProvider;
  let host: string | null;
  if (isProvider(llmOrOpts)) {
    provider = llmOrOpts;
    host = hostMaybe ?? null;
  } else {
    provider = await defaultProvider();
    host = llmOrOpts.host ?? null;
  }

  if (!(pageType in SCHEMAS)) {
    throw new Error(
      `Unknown page_type: ${pageType}. Supported: ${supportedPageTypes().join(", ")}`,
    );
  }

  let cleaned = html;
  if (host) {
    const { preprocess } = await import("@/fallback/preprocessor");
    cleaned = preprocess(html, host, pageType);
  }

  if ((REPORT_LIKE as readonly string[]).includes(pageType)) {
    if (!patientId) throw new Error(`page_type=${pageType} requires patient_id`);
    const out: Record<string, any>[] = [];
    for (const sub of REPORT_LIKE) {
      try {
        const sub_resources = await extractOne(cleaned, sub, patientId, provider);
        out.push(...sub_resources);
      } catch (e: any) {
        // Best-effort fan-out; one schema failing doesn't kill the others.
        console.warn(`[extractor] fan-out ${sub} failed: ${e?.message ?? e}`);
      }
    }
    return out;
  }

  return extractOne(cleaned, pageType, patientId, provider);
}

function isProvider(x: any): x is LLMProvider {
  return x && typeof x === "object" && typeof x.extractStructuredData === "function";
}

async function defaultProvider(): Promise<LLMProvider> {
  const { settings } = await import("@/core/config");
  if (settings.LLM_PROVIDER === "ollama") {
    const { OllamaProvider } = await import("@/fallback/llm/ollama");
    return new OllamaProvider(settings.OLLAMA_BASE_URL, settings.OLLAMA_MODEL);
  }
  if (settings.LLM_PROVIDER === "claude") {
    const { ClaudeProvider } = await import("@/fallback/llm/claude");
    return new ClaudeProvider(settings.ANTHROPIC_API_KEY);
  }
  throw new Error(
    "LLM fallback path is disabled. Set LLM_PROVIDER=claude or LLM_PROVIDER=ollama in .env to enable /sync/upload-html.",
  );
}

async function extractOne(
  html: string,
  pageType: string,
  patientId: string | null,
  llm: LLMProvider,
): Promise<Record<string, any>[]> {
  const schema = SCHEMAS[pageType]!;
  const result = await llm.extractStructuredData(html, schema);

  if (pageType === "patient_info") {
    let one: any = result;
    if (Array.isArray(result)) one = result.length > 0 ? result[0] : {};
    if (!one || typeof one !== "object" || Object.keys(one).length === 0) return [];
    return [mapPatient(one)];
  }

  if (!patientId) throw new Error(`page_type=${pageType} requires patient_id`);

  const handler = LIST_HANDLERS[pageType];
  if (!handler) return [];
  const [mapper, listKey] = handler;
  const rawItems =
    result && typeof result === "object" && !Array.isArray(result) ? (result[listKey] ?? []) : [];
  if (!Array.isArray(rawItems)) return [];

  if (pageType in GROUP_HANDLERS) {
    return GROUP_HANDLERS[pageType]!(rawItems, patientId);
  }
  const mapped = rawItems
    .filter((it: any) => it && typeof it === "object")
    .map((it: any) => mapper(it, patientId));
  return mapped.filter((r): r is Record<string, any> => r !== null);
}
