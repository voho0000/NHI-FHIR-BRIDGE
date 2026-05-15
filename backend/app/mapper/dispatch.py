"""page_type → mapper dispatch tables.

Used by BOTH paths:
- Primary: `/sync/upload-structured` reaches in to pick the right mapper for
  each page_type the extension uploads. No LLM, no HTML.
- Fallback: `app.fallback.extractor.extract_and_map` (LLM path) uses the
  same tables after parsing the LLM output, so both paths produce
  identically-shaped FHIR resources.

Living in `app.mapper.*` (not `app.fallback.*`) so the primary path
doesn't appear to "import from fallback".
"""

from __future__ import annotations

from collections.abc import Callable

from app.mapper.allergy import map_allergy_intolerance
from app.mapper.condition import map_condition
from app.mapper.diagnostic_report import map_diagnostic_report
from app.mapper.encounter import map_encounter
from app.mapper.medication import map_medication_request, map_medications_dedup
from app.mapper.observation import map_observation, map_observations_grouped
from app.mapper.procedure import map_procedure

# page_type → (per-row mapper, JSON list key inside LLM response)
LIST_HANDLERS: dict[str, tuple[Callable[[dict, str], dict], str]] = {
    "observations": (map_observation, "observations"),
    "medications": (map_medication_request, "medications"),
    "conditions": (map_condition, "conditions"),
    "allergies": (map_allergy_intolerance, "allergies"),
    "diagnostic_reports": (map_diagnostic_report, "diagnostic_reports"),
    "procedures": (map_procedure, "procedures"),
    "encounters": (map_encounter, "encounters"),
}

# page_type → mapper that takes the FULL list at once (returns list[dict]).
# Use this when grouping across rows is required (e.g. NHI lab panels —
# many items per 醫令代碼 share an order_code and become one DR + N Obs).
# Signature: (raw_items, patient_id) -> list[dict]
GROUP_HANDLERS: dict[str, Callable[[list, str], list]] = {
    "observations": map_observations_grouped,
    # Same drug appears 3x in NHI (English-only, Eng+中, 中+Eng). Dedup
    # by canonical English fragment per (date, drug).
    "medications": map_medications_dedup,
}
