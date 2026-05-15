"""Observation mapper unit tests.

Covers:
- NHI medical-order-code → LOINC mapping (used by canonical coding)
- Panel grouping: items sharing the same 醫令代碼 + date become one
  DiagnosticReport + N child Observations
- Bilingual deduplication within a panel
"""

from app.mapper.observation import map_observation, map_observations_grouped


class TestMapObservation:
    def test_basic_shape(self, patient_id: str):
        raw = {
            "code": "09005C",
            "display": "Fasting Glucose",
            "value": 95,
            "unit": "mg/dL",
            "date": "2024-01-15",
        }
        result = map_observation(raw, patient_id)
        assert result["resourceType"] == "Observation"
        assert result["subject"]["reference"] == f"Patient/{patient_id}"

    def test_nhi_code_maps_to_loinc(self, patient_id: str):
        # 09005C (空腹血糖) should produce a LOINC coding alongside the NHI one.
        raw = {
            "code": "09005C",
            "display": "Fasting Glucose",
            "value": 95,
            "unit": "mg/dL",
            "date": "2024-01-15",
        }
        result = map_observation(raw, patient_id)
        coding_systems = [c.get("system", "") for c in result["code"]["coding"]]
        assert any("loinc.org" in s for s in coding_systems)


class TestPanelGrouping:
    def test_cbc_panel_collapses_to_one_diagnostic_report(self, patient_id: str):
        # Three CBC sub-items sharing 08013C + date should become one
        # DiagnosticReport with the items as child Observations.
        items = [
            {
                "code": "08013C",
                "order_name": "WBC w/ Diff",
                "display": "WBC",
                "value": 6.5,
                "unit": "10^3/uL",
                "date": "2024-01-15",
                "hospital": "台大醫院",
            },
            {
                "code": "08013C",
                "order_name": "WBC w/ Diff",
                "display": "Hemoglobin",
                "value": 14.0,
                "unit": "g/dL",
                "date": "2024-01-15",
                "hospital": "台大醫院",
            },
            {
                "code": "08013C",
                "order_name": "WBC w/ Diff",
                "display": "Platelet",
                "value": 250,
                "unit": "10^3/uL",
                "date": "2024-01-15",
                "hospital": "台大醫院",
            },
        ]
        resources = map_observations_grouped(items, patient_id)

        reports = [r for r in resources if r["resourceType"] == "DiagnosticReport"]
        observations = [r for r in resources if r["resourceType"] == "Observation"]
        assert len(reports) == 1
        # Three items → three child observations.
        assert len(observations) == 3

    def test_different_dates_make_separate_reports(self, patient_id: str):
        items = [
            {
                "code": "08013C",
                "order_name": "CBC",
                "display": "WBC",
                "value": 6.5,
                "unit": "10^3/uL",
                "date": "2024-01-15",
                "hospital": "台大醫院",
            },
            {
                "code": "08013C",
                "order_name": "CBC",
                "display": "WBC",
                "value": 7.0,
                "unit": "10^3/uL",
                "date": "2024-02-15",
                "hospital": "台大醫院",
            },
        ]
        resources = map_observations_grouped(items, patient_id)
        reports = [r for r in resources if r["resourceType"] == "DiagnosticReport"]
        assert len(reports) == 2

    def test_value_less_rows_dropped(self, patient_id: str):
        items = [
            {
                "code": "08013C",
                "order_name": "CBC",
                "display": "Image",
                "date": "2024-01-15",
                "hospital": "台大醫院",
            },  # no value/unit
        ]
        resources = map_observations_grouped(items, patient_id)
        # Imaging / value-less rows should be filtered by _filter_lab_rows.
        observations = [r for r in resources if r["resourceType"] == "Observation"]
        assert observations == []
