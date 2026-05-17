/**
 * FHIR R4 CapabilityStatement builder.
 *
 * Port of `backend/app/fhir/capability.py`. The output is what
 * `GET /fhir/metadata` returns — SMART apps discover the OAuth2
 * endpoint locations + supported resources from this document.
 */

import { settings } from "@/core/config";

type SearchParamSpec = { name: string; type: string };

function makeResource(
  rtype: string,
  interactions: string[],
  searchParams: SearchParamSpec[],
): Record<string, any> {
  return {
    type: rtype,
    interaction: interactions.map((c) => ({ code: c })),
    searchParam: searchParams.map((p) => ({ name: p.name, type: p.type })),
  };
}

// Reused across every per-patient resource.
const PT = { name: "patient", type: "reference" };
const DATE = { name: "date", type: "date" };
const CODE = { name: "code", type: "token" };
const ENC = { name: "encounter", type: "reference" };

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
                  system: "http://terminology.hl7.org/CodeSystem/restful-security-service",
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
        // The 8 types the mapper actually produces, plus search params
        // the server.search() implementation honors (patient/date/code/
        // encounter). SMART apps refuse to query types not declared here.
        resource: [
          makeResource("Patient", ["read", "search-type"], []),
          makeResource("Observation", ["read", "search-type"], [PT, DATE, CODE, ENC]),
          makeResource("MedicationRequest", ["read", "search-type"], [PT, DATE, ENC]),
          makeResource("Condition", ["read", "search-type"], [PT, DATE, CODE, ENC]),
          makeResource("AllergyIntolerance", ["read", "search-type"], [PT, DATE, CODE]),
          makeResource("DiagnosticReport", ["read", "search-type"], [PT, DATE, CODE, ENC]),
          makeResource("Procedure", ["read", "search-type"], [PT, DATE, CODE, ENC]),
          makeResource("Encounter", ["read", "search-type"], [PT, DATE]),
        ],
      },
    ],
  };
}
