/**
 * FHIR R4 CapabilityStatement builder.
 *
 * Port of `backend/app/fhir/capability.py`. The output is what
 * `GET /fhir/metadata` returns — SMART apps discover the OAuth2
 * endpoint locations + supported resources from this document.
 */

import { settings } from "@/core/config";

function makeResource(
  rtype: string,
  interactions: string[],
  searchParams: string[],
): Record<string, any> {
  return {
    type: rtype,
    interaction: interactions.map((c) => ({ code: c })),
    searchParam: searchParams.map((p) => ({ name: p, type: "reference" })),
  };
}

export function buildCapabilityStatement(): Record<string, any> {
  const base = settings.FHIR_BASE_URL.replace("/fhir", "");
  return {
    resourceType: "CapabilityStatement",
    id: "nhi-fhir-bridge",
    status: "active",
    date: "2024-01-01",
    kind: "instance",
    fhirVersion: "4.0.1",
    format: ["application/fhir+json", "json"],
    rest: [
      {
        mode: "server",
        security: {
          cors: true,
          service: [
            {
              coding: [
                {
                  system:
                    "http://terminology.hl7.org/CodeSystem/restful-security-service",
                  code: "SMART-on-FHIR",
                },
              ],
            },
          ],
          extension: [
            {
              url: "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris",
              extension: [
                { url: "token", valueUri: `${base}/smart/token` },
                { url: "authorize", valueUri: `${base}/smart/authorize` },
              ],
            },
          ],
        },
        resource: [
          makeResource("Patient", ["read", "search-type"], []),
          makeResource("Observation", ["read", "search-type"], ["patient"]),
          makeResource("MedicationRequest", ["read", "search-type"], ["patient"]),
        ],
      },
    ],
  };
}
