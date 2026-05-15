"""Medication mapper unit tests.

Focus on bilingual deduplication — NHI 健保署 reports the same prescription
multiple times (English-only / Eng+中 / 中+Eng) and we collapse them to one.
"""

from app.mapper.medication import _canonical_drug_key, map_medications_dedup


class TestCanonicalDrugKey:
    def test_english_only(self):
        key = _canonical_drug_key("TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION")
        assert key == "timoptol xe 0.5% ophthalmic solution"

    def test_eng_then_zh_collapses_same(self):
        key = _canonical_drug_key("TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION (青眼露)")
        assert key == "timoptol xe 0.5% ophthalmic solution"

    def test_zh_then_eng_collapses_same(self):
        key = _canonical_drug_key("青眼露 (TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION)")
        assert key == "timoptol xe 0.5% ophthalmic solution"

    def test_trailing_dash_modifier_stripped(self):
        key = _canonical_drug_key("FLUCASON OPHTHALMIC SUSPENSION 0.02% - FLUOROMETHOLONE")
        assert key == "flucason ophthalmic suspension 0.02%"

    def test_chinese_only_falls_back(self):
        # No English chunk → use the lowercase trimmed string.
        key = _canonical_drug_key("護康視懸濁點眼液")
        assert key == "護康視懸濁點眼液"


class TestMapMedicationsDedup:
    def test_three_format_duplicates_collapse_to_one(self, patient_id: str):
        # Same drug, same date, 3 NHI formats — should produce 1 resource.
        items = [
            {
                "drug_name": "TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION",
                "date": "2024-01-15",
                "dose": "1",
                "unit": "drop",
                "frequency": "BID",
                "route": "topical",
            },
            {
                "drug_name": "TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION (青眼露)",
                "date": "2024-01-15",
                "dose": "1",
                "unit": "drop",
                "frequency": "BID",
                "route": "topical",
            },
            {
                "drug_name": "青眼露 (TIMOPTOL XE 0.5% OPHTHALMIC SOLUTION)",
                "date": "2024-01-15",
                "dose": "1",
                "unit": "drop",
                "frequency": "BID",
                "route": "topical",
            },
        ]
        resources = map_medications_dedup(items, patient_id)
        assert len(resources) == 1
        assert resources[0]["resourceType"] == "MedicationRequest"

    def test_different_dates_kept_separate(self, patient_id: str):
        items = [
            {"drug_name": "Aspirin 100mg", "date": "2024-01-15", "dose": "100", "unit": "mg"},
            {"drug_name": "Aspirin 100mg", "date": "2024-02-15", "dose": "100", "unit": "mg"},
        ]
        resources = map_medications_dedup(items, patient_id)
        assert len(resources) == 2

    def test_different_drugs_kept_separate(self, patient_id: str):
        items = [
            {"drug_name": "Aspirin 100mg", "date": "2024-01-15", "dose": "100", "unit": "mg"},
            {"drug_name": "Metformin 500mg", "date": "2024-01-15", "dose": "500", "unit": "mg"},
        ]
        resources = map_medications_dedup(items, patient_id)
        assert len(resources) == 2
