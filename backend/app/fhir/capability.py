from app.core.config import settings


def build_capability_statement() -> dict:
    base = settings.FHIR_BASE_URL.replace("/fhir", "")
    return {
        "resourceType": "CapabilityStatement",
        "id": "nhi-fhir-bridge",
        "status": "active",
        "date": "2024-01-01",
        "kind": "instance",
        "fhirVersion": "4.0.1",
        "format": ["application/fhir+json", "json"],
        "rest": [
            {
                "mode": "server",
                "security": {
                    "cors": True,
                    "service": [
                        {
                            "coding": [
                                {
                                    "system": "http://terminology.hl7.org/CodeSystem/restful-security-service",
                                    "code": "SMART-on-FHIR",
                                }
                            ]
                        }
                    ],
                    "extension": [
                        {
                            "url": "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris",
                            "extension": [
                                {"url": "token", "valueUri": f"{base}/smart/token"},
                                {"url": "authorize", "valueUri": f"{base}/smart/authorize"},
                            ],
                        }
                    ],
                },
                "resource": [
                    _res("Patient", ["read", "search-type"], []),
                    _res("Observation", ["read", "search-type"], ["patient"]),
                    _res("MedicationRequest", ["read", "search-type"], ["patient"]),
                ],
            }
        ],
    }


def _res(rtype: str, interactions: list[str], search_params: list[str]) -> dict:
    return {
        "type": rtype,
        "interaction": [{"code": c} for c in interactions],
        "searchParam": [{"name": p, "type": "reference"} for p in search_params],
    }
