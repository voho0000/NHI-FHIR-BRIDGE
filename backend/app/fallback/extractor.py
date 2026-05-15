"""LLM-driven HTML → FHIR extraction (fallback path only).

Invoked only by POST /sync/upload-html when the primary JSON-API path
can't be used. The dispatch tables (`LIST_HANDLERS`, `GROUP_HANDLERS`)
live in `app.mapper.dispatch` — both this module AND the primary path
pull from there so both produce identical FHIR shapes.
"""

import logging

from app.fallback.llm.base import LLMProvider
from app.mapper.dispatch import GROUP_HANDLERS, LIST_HANDLERS
from app.mapper.patient import map_patient

logger = logging.getLogger(__name__)


# Page type → JSON schema to feed the LLM.
# Keys are the canonical page_type strings used by both the agent and the
# /sync/upload-html endpoint.
SCHEMAS: dict[str, dict] = {
    "patient_info": {
        "id": "patient internal ID or chart number",
        "identifier": "patient chart/MRN number",
        "name": "full name",
        "birthDate": "YYYY-MM-DD",
        "gender": "male | female | other | unknown",
        "phone": "contact phone (optional)",
        "address": "address (optional)",
    },
    "observations": {
        "_instructions": (
            "Extract LABORATORY test results only — anything with a numeric "
            "or categorical lab value (CBC, biochem, tumor markers, "
            "endocrinology, microbiology, urinalysis, etc.). "
            "SKIP imaging studies (ultrasound, CT, MRI, X-ray, mammography, "
            "sonogram, ECG/EKG, endoscopy) — those are diagnostic_reports, "
            "not observations. SKIP rows that only show test names and "
            "dates with no actual result value (these are list-view rows). "
            "\n\nPANEL GROUPING: NHI 健康存摺 pages organize lab results into "
            "panels — one medical order (e.g. '尿生化檢查', 'CBC with diff', "
            "'肝功能套組') produces many sub-items (子項目). When the page "
            "shows columns like 醫令代碼 / 醫囑名稱 / order_code / panel "
            "name, populate order_code and order_name EXACTLY as displayed "
            "for every row, using the SAME values for items belonging to "
            "the SAME panel — this lets us group them into one "
            "DiagnosticReport downstream. When the page is flat (no panel "
            "columns), leave order_code/order_name empty and we'll group "
            "per-item by display+date instead. "
            "Also capture hospital (醫事機構) when shown, so panels from "
            "different hospitals on the same date stay separate. "
            "\n\nDEDUPLICATION (重要): NHI 健康存摺 often shows the SAME "
            "lab result multiple times because each value is reported by "
            "different data sources (資料來源 A vs B) under different "
            "language formats — e.g. '醣化血紅素 5.9%' AND 'HbA1c 5.9%' "
            "AND 'A1C (HbA1C) 5.9%' are ONE measurement, not three. "
            "When you see the same date + same value + same unit appearing "
            "with different display names, output it ONCE only. **Prefer "
            "the English abbreviation** (e.g. 'HbA1c' over '醣化血紅素', "
            "'ALT' over '血清麩胺酸丙酮酸轉氨基脢', 'WBC' over '白血球計數') "
            "because clinicians read labs in English. Same rule for urine "
            "panel items where Chinese (尿蛋白) and English (Protein) of "
            "the same item appear: only one row, English display preferred. "
            "\n\nDo not echo the _instructions field in your output."
        ),
        "observations": [
            {
                "date": "YYYY-MM-DD result date",
                "order_code": "panel/order code if shown (e.g. '06013C'); leave empty if absent",
                "order_name": "panel/order name if shown (e.g. '尿生化檢查'); leave empty if absent",
                "code": "individual item code (e.g. GLU, HGB)",
                "display": "individual item name (e.g. 尿蛋白, 白血球計數)",
                "value": "numeric or string result — REQUIRED, omit row if missing",
                "unit": "unit of measure",
                "reference_range": "e.g. 70-100",
                "interpretation": "normal | high | low | critical",
                "hospital": "issuing hospital if shown",
            }
        ],
    },
    "medications": {
        "_instructions": (
            "Extract ONLY actual dispensed medications from the 藥品醫囑資料 "
            "(drug order) section. Each item MUST have a medication name "
            "(醫囑名稱 / drug_name). "
            "SKIP: visit-level headers (date, hospital, disease classification), "
            "非藥品醫囑資料 (non-drug service orders), procedure items, and "
            "any row that does not represent an individual drug dispensed. "
            "For frequency and route: populate ONLY if explicitly stated in "
            "the page — do NOT guess or infer (e.g. NHI 健康存摺 does not "
            "include route or frequency per drug; leave both empty). "
            "\n\nDEDUPLICATION (重要): NHI 健康存摺 frequently lists the "
            "SAME prescription 2-3 times because each drug is reported "
            "in multiple language formats — e.g. you may see 'TIMOPTOL XE "
            "0.5% OPHTHALMIC SOLUTION', 'TIMOPTOL XE 0.5% OPHTHALMIC "
            "SOLUTION (青眼露長效型...)' and '青眼露長效型... (TIMOPTOL XE "
            "0.5%...)' all on the same date. These are ONE prescription, "
            "not three. Output it ONCE only. **Prefer the English brand "
            "name** (e.g. 'TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION' over "
            "'青眼露長效型...') because clinicians scan medication lists "
            "by English brand name. If only the Chinese name is present, "
            "use that. "
            "\nDo not echo the _instructions field in your output."
        ),
        "medications": [
            {
                "date": "YYYY-MM-DD prescription date",
                "drug_name": "REQUIRED — medication name and strength. Omit entire row if absent.",
                "dose": "dose amount if shown",
                "unit": "mg / ml / tab — only if explicitly stated",
                "frequency": "QD / BID / TID / PRN — only if explicitly stated, else omit",
                "route": "oral / IV / ophthalmic — only if explicitly stated, else omit",
                "duration_days": "number of days as integer if shown",
                "indication": "reason / diagnosis (optional)",
            }
        ],
    },
    "conditions": {
        "conditions": [
            {
                "onset_date": "YYYY-MM-DD onset or diagnosis date",
                "code": "ICD-10 or SNOMED-CT code",
                "system": "coding system (SNOMED-CT / ICD-10)",
                "display": "diagnosis name",
                "clinical_status": "active | resolved | inactive | remission",
                "severity": "mild | moderate | severe",
            }
        ]
    },
    "allergies": {
        "_instructions": (
            "Extract ONLY substances the patient is documented to be "
            "allergic to or to have an adverse reaction to. HIS pages "
            "often mix allergy entries with unrelated clinical reminders "
            "(screening due, weight change alerts, drug-drug interaction "
            "warnings) — IGNORE those. Look for headers like '藥物過敏', "
            "'過敏原', 'allergy', '不良反應', '藥物不良反應', then "
            "enumerate items listed under that header only. Do not echo "
            "the _instructions field in your output."
        ),
        "allergies": [
            {
                "recorded_date": "YYYY-MM-DD date recorded (omit if unknown)",
                "code": "allergen code (often unavailable in HIS, omit)",
                "system": "coding system (often unavailable, omit)",
                "display": "specific allergen name (e.g. Penicillin, DEXTROMETHORPHAN, peanut)",
                "category": "medication | food | environment | biologic",
                "criticality": "high | low | unable-to-assess",
                "reaction": "reaction description if mentioned, else omit",
            }
        ],
    },
    "diagnostic_reports": {
        "_instructions": (
            "Extract reports that have actual report content / conclusion / "
            "impression / findings — radiology reads, pathology results, "
            "endoscopy summaries, ECG interpretations. SKIP rows that only "
            "show a report name and date with no narrative conclusion text "
            "(those are list-view rows; the detail-view capture for that "
            "specific report will fill in the conclusion later). "
            "If the conclusion field would be empty, OMIT the entire row. "
            "Do not echo the _instructions field in your output."
        ),
        "diagnostic_reports": [
            {
                "date": "YYYY-MM-DD report date",
                "code": "LOINC or local code",
                "system": "LOINC or local system",
                "display": "report name",
                "category": "LAB | RAD | CAR | PATH",
                "status": "final | preliminary | amended",
                "conclusion": "REQUIRED narrative report content (Impression / Findings / Comment / 結論 / 報告內容). Omit row if no conclusion exists.",
            }
        ],
    },
    "procedures": {
        "_instructions": (
            "Extract ACTUAL therapeutic / surgical procedures with descriptive "
            "content — drainage procedures, biopsies, endoscopies, surgeries, "
            "catheter insertions, paracentesis, etc. Each row must include a "
            "narrative `note` (procedure description / findings) OR a "
            "`body_site` (anatomical location). "
            "SKIP pure laboratory tests (CBC, tumor markers, microbiology "
            "culture orders) and pure imaging (CT, MRI, ultrasound, X-ray) — "
            "those go in observations / diagnostic_reports respectively. "
            "SKIP list-view rows that show only a request name + date with "
            "no procedural content. "
            "Do not echo the _instructions field in your output."
        ),
        "procedures": [
            {
                "date": "YYYY-MM-DD procedure date",
                "code": "SNOMED-CT or ICD procedure code",
                "system": "coding system",
                "display": "procedure name",
                "status": "completed | in-progress | not-done",
                "body_site": "anatomical site — populate when known",
                "note": "REQUIRED narrative description of what was done / found. Omit row if neither note nor body_site is available.",
            }
        ],
    },
    "encounters": {
        "_instructions": (
            "Extract one Encounter per visit. If the page contains a SOAP "
            "or visit-detail block for a SPECIFIC date (e.g. legend like "
            "'[2025-11-17_SOAP]', '門診紀錄', '住院摘要', '出院摘要'), emit "
            "ONLY that visit with its clinical_note fully populated — do "
            "NOT also echo the other visits from the surrounding list. "
            "Stable IDs will merge that detail with the list-row Encounter "
            "captured separately. "
            "If the page is purely a list view (no SOAP/detail block), "
            "emit every visit row with its metadata and leave clinical_note "
            "empty. Do not echo the _instructions field."
        ),
        "encounters": [
            {
                "date": "YYYY-MM-DD start date",
                "end_date": "YYYY-MM-DD end date (optional)",
                "class": "AMB (outpatient) | IMP (inpatient) | EMER (emergency)",
                "type_code": "encounter type code",
                "type_display": "encounter type name",
                "department": "department or specialty name",
                "provider": "attending physician name",
                "reason": "chief complaint / dx codes for this visit",
                "discharge_disposition": "discharge disposition (optional)",
                "clinical_note": (
                    "SOAP / visit narrative when extracting a detail page: "
                    "concatenate Subjective, Objective, Assessment, Plan "
                    "sections with section headers preserved. Empty string "
                    "for list-only rows."
                ),
            }
        ],
    },
}


def supported_page_types() -> list[str]:
    return list(SCHEMAS.keys())


async def extract_and_map(
    html: str,
    page_type: str,
    patient_id: str | None,
    llm: LLMProvider,
    host: str | None = None,
) -> list[dict]:
    """Extract structured data from HTML and return mapped FHIR R4 resources.

    - page_type='patient_info' → returns [Patient resource] (1 item).
      patient_id is ignored here because the Patient resource carries the ID.
    - Any other page_type → returns the list of mapped resources tied to
      patient_id. patient_id MUST be supplied.
    - host (optional) enables HTML preprocessing per host_configs/<host>.yaml.
      Without host, the full HTML is sent to the LLM as before.

    Special "report fan-out" behavior:
      When the page_type is one of (observations, diagnostic_reports,
      procedures), this function ALSO runs the other two report-like
      schemas against the same cleaned HTML and returns the union of all
      mapped resources. This is because most HIS UIs lump labs / imaging
      / procedures into the same medical-orders detail page, so the user
      can't always tag a capture correctly at capture time. Mapper filters
      (require value / require conclusion / require
      note) keep each resource type honest, so a CT report becomes only
      a DiagnosticReport, a CBC becomes only Observations, etc.
    """
    if page_type not in SCHEMAS:
        raise ValueError(f"Unknown page_type: {page_type}. Supported: {supported_page_types()}")

    if host:
        from app.fallback.preprocessor import preprocess

        html = preprocess(html, host, page_type)

    REPORT_LIKE = ("observations", "diagnostic_reports", "procedures")
    if page_type in REPORT_LIKE:
        if not patient_id:
            raise ValueError(f"page_type={page_type} requires patient_id")
        # Fan out: run all three report-like extractions, combine results.
        all_resources: list[dict] = []
        for sub in REPORT_LIKE:
            try:
                all_resources.extend(await _extract_one(html, sub, patient_id, llm, host))
            except Exception as exc:
                logger.warning("fan-out %s failed: %s", sub, exc)
        return all_resources

    return await _extract_one(html, page_type, patient_id, llm, host)


async def _extract_one(
    html: str,
    page_type: str,
    patient_id: str | None,
    llm: LLMProvider,
    host: str | None = None,
) -> list[dict]:
    schema = SCHEMAS[page_type]
    result = await llm.extract_structured_data(html, schema)
    # Keep at DEBUG so it doesn't leak PHI in production logs but is still
    # available locally with LOG_LEVEL=DEBUG when something looks off.
    logger.debug(
        "_extract_one: page_type=%s html_size=%d llm_raw=%r",
        page_type,
        len(html),
        result,
    )

    if page_type == "patient_info":
        # LLM may return a list if it scraped a list-style page
        if isinstance(result, list):
            result = result[0] if result else {}
        if not isinstance(result, dict) or not result:
            return []
        return [map_patient(result)]

    if not patient_id:
        raise ValueError(f"page_type={page_type} requires patient_id")

    mapper, list_key = LIST_HANDLERS[page_type]
    raw_items = result.get(list_key, []) if isinstance(result, dict) else []
    if not isinstance(raw_items, list):
        return []

    # Group-aware mappers (e.g. lab panel grouping) take the full list
    # and do their own grouping.
    if page_type in GROUP_HANDLERS:
        return GROUP_HANDLERS[page_type](raw_items, patient_id)

    # Per-item mappers may return None to signal "this row isn't a real
    # resource" (e.g. imaging that belongs in DiagnosticReport). Filter.
    mapped = [mapper(item, patient_id) for item in raw_items if isinstance(item, dict)]
    return [r for r in mapped if r is not None]
