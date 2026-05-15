"""Patient mapper unit tests.

Covers the TW national-ID detection and the basic Patient resource shape.
"""

from app.fhir import systems
from app.mapper.patient import _looks_like_tw_national_id, map_patient


class TestTwNationalId:
    def test_valid_male_id(self):
        assert _looks_like_tw_national_id("A123456789") is True

    def test_valid_female_id(self):
        assert _looks_like_tw_national_id("B223456789") is True

    def test_lowercase_input_accepted(self):
        # The check uppercases before matching.
        assert _looks_like_tw_national_id("a123456789") is True

    def test_too_short(self):
        assert _looks_like_tw_national_id("A12345678") is False

    def test_missing_letter(self):
        assert _looks_like_tw_national_id("1234567890") is False

    def test_invalid_second_char(self):
        # Second char must be 1 or 2 (gender marker).
        assert _looks_like_tw_national_id("A523456789") is False

    def test_empty_string(self):
        assert _looks_like_tw_national_id("") is False

    def test_none(self):
        assert _looks_like_tw_national_id(None) is False  # type: ignore[arg-type]


class TestMapPatient:
    def test_minimum_shape(self, patient_id: str):
        raw = {"identifier": patient_id, "name": "陳大文"}
        result = map_patient(raw)
        assert result["resourceType"] == "Patient"
        assert result["id"] == patient_id
        assert any(n.get("text") == "陳大文" for n in result["name"])

    def test_tw_national_id_uses_canonical_system(self, patient_id: str):
        result = map_patient({"identifier": patient_id, "name": "陳大文"})
        identifiers = result["identifier"]
        assert any(i["system"] == systems.TW_NATIONAL_ID for i in identifiers)

    def test_non_tw_id_uses_local_mrn_system(self):
        result = map_patient({"identifier": "P001", "name": "Foo"})
        identifiers = result["identifier"]
        assert any(i["system"] == systems.HIS_LOCAL_PATIENT_MRN for i in identifiers)

    def test_birth_date_passes_through(self, patient_id: str):
        result = map_patient(
            {
                "identifier": patient_id,
                "name": "陳大文",
                "birthDate": "1980-05-15",
            }
        )
        assert result.get("birthDate") == "1980-05-15"

    def test_missing_id_falls_back_to_unknown(self):
        result = map_patient({"name": "Foo"})
        assert result["id"] == "unknown"
