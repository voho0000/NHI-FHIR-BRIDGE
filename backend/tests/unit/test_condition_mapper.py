"""Condition mapper unit tests.

Focus on the ICD-10-CM normalization (TWNHIFHIR Round 3 fix) and the
basic Condition resource shape.
"""

import pytest

from app.fhir import systems
from app.mapper.condition import _normalize_icd10_cm, map_condition


class TestNormalizeIcd10Cm:
    @pytest.mark.parametrize(
        "nodot,expected",
        [
            ("E1122", "E11.22"),
            ("M47892", "M47.892"),
            ("S0993XA", "S09.93XA"),
            ("M19271", "M19.271"),
        ],
    )
    def test_inserts_dot_into_undotted_codes(self, nodot, expected):
        assert _normalize_icd10_cm(nodot) == expected

    def test_passes_through_3char_category(self):
        # E11 is a valid 3-char category code; no dot needed.
        assert _normalize_icd10_cm("E11") == "E11"

    def test_passes_through_already_dotted(self):
        assert _normalize_icd10_cm("E11.22") == "E11.22"

    def test_lowercase_normalised_to_upper(self):
        assert _normalize_icd10_cm("e1122") == "E11.22"

    def test_empty_string(self):
        assert _normalize_icd10_cm("") == ""

    def test_invalid_category_returns_input(self):
        # First 3 chars must match [A-Z][0-9A-Z]{2}; "123" doesn't.
        assert _normalize_icd10_cm("12322") == "12322"


class TestMapCondition:
    def test_basic_shape(self, patient_id: str):
        raw = {
            "code": "E11.9",
            "display": "Type 2 diabetes mellitus",
            "system": "icd-10-cm",
            "onset_date": "2020-01-01",
        }
        result = map_condition(raw, patient_id)
        assert result["resourceType"] == "Condition"
        assert result["subject"]["reference"] == f"Patient/{patient_id}"

    def test_icd_10_cm_code_is_normalised(self, patient_id: str):
        raw = {"code": "E1122", "display": "DM2 w/ neph", "system": "icd-10-cm"}
        result = map_condition(raw, patient_id)
        coding = result["code"]["coding"][0]
        assert coding["code"] == "E11.22"
        assert coding["system"] == systems.ICD_10_CM

    def test_active_clinical_status_default(self, patient_id: str):
        raw = {"code": "E11.9", "display": "DM2"}
        result = map_condition(raw, patient_id)
        assert result["clinicalStatus"]["coding"][0]["code"] == "active"

    def test_explicit_resolved_status(self, patient_id: str):
        raw = {"code": "E11.9", "display": "DM2", "clinical_status": "resolved"}
        result = map_condition(raw, patient_id)
        assert result["clinicalStatus"]["coding"][0]["code"] == "resolved"

    def test_onset_date_iso_with_timezone(self, patient_id: str):
        raw = {"code": "E11.9", "display": "DM2", "onset_date": "2020-01-15"}
        result = map_condition(raw, patient_id)
        assert result["onsetDateTime"] == "2020-01-15T00:00:00+08:00"
