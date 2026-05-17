/**
 * SMART on FHIR OAuth2 endpoints.
 *
 * Port of `backend/app/api/smart.py`. Mounted at `/smart` from main.ts.
 */

import { Hono } from "hono";

import { settings } from "@/core/config";
import { requireSyncApiKey } from "@/core/security";
import { fhirServer } from "@/fhir/server";
import { smartAuth } from "@/smart/oauth2";

export const smartApi = new Hono();

smartApi.get("/.well-known/smart-configuration", (c) => {
  const base = settings.FHIR_BASE_URL.replace("/fhir", "");
  return c.json({
    issuer: base,
    authorization_endpoint: `${base}/smart/authorize`,
    token_endpoint: `${base}/smart/token`,
    capabilities: [
      "launch-standalone",
      "launch-ehr",
      "client-public",
      "context-standalone-patient",
      "permission-patient",
      "sso-openid-connect",
    ],
    scopes_supported: [
      "openid",
      "fhirUser",
      "launch",
      "launch/patient",
      "patient/*.read",
      "offline_access",
    ],
    response_types_supported: ["code"],
    code_challenge_methods_supported: ["S256"],
  });
});

smartApi.get("/authorize", async (c) => {
  const clientId = c.req.query("client_id") ?? "";
  const redirectUri = c.req.query("redirect_uri") ?? "";
  const scope = c.req.query("scope") ?? "";
  const state = c.req.query("state") ?? null;
  const codeChallenge = c.req.query("code_challenge") ?? null;
  const codeChallengeMethod = c.req.query("code_challenge_method") ?? null;
  const launch = c.req.query("launch") ?? null;
  // response_type / aud accepted but not validated (POC — same as Python).

  const client = smartAuth.getClient(clientId);
  if (!client) {
    return c.json({ detail: "Unknown client_id" }, 400);
  }
  const allowedUris = client.redirectUris ?? [];
  if (!allowedUris.includes(redirectUri)) {
    return c.json({ detail: "Invalid redirect_uri" }, 400);
  }

  // PKCE mandatory for public clients (SMART App Launch IG §1.0.2).
  if (!client.isConfidential) {
    if (!codeChallenge) {
      return c.json(
        {
          detail:
            "code_challenge is required for public clients (PKCE). See SMART App Launch IG §1.0.2.",
        },
        400,
      );
    }
    if (codeChallengeMethod !== "S256" && codeChallengeMethod !== "plain") {
      return c.json(
        { detail: "code_challenge_method must be 'S256' (recommended) or 'plain'." },
        400,
      );
    }
  }

  // Auto-approve. Patient context: launch token first, then first patient in store.
  let patientId = smartAuth.resolveLaunchContext(launch);
  if (!patientId) {
    const patients = fhirServer.listAll("Patient");
    patientId = patients.length > 0 ? (patients[0]!.id as string) : null;
  }

  const requestedScopes = scope.split(/\s+/).filter(Boolean);
  const allowed = new Set(client.allowedScopes ?? []);
  const scopes = requestedScopes.filter((s) => allowed.has(s));

  const code = smartAuth.createAuthCode({
    clientId,
    redirectUri,
    scopes,
    patientId,
    codeChallenge,
    codeChallengeMethod,
  });

  const params = new URLSearchParams({ code });
  if (state) params.set("state", state);
  return c.redirect(`${redirectUri}?${params.toString()}`, 302);
});

smartApi.post("/launch-context", requireSyncApiKey, async (c) => {
  let payload: any;
  try {
    payload = await c.req.json();
  } catch {
    return c.json({ detail: "Request body must be JSON" }, 400);
  }
  const patientId = payload?.patient_id;
  if (!patientId) {
    return c.json({ detail: "patient_id is required" }, 400);
  }
  if (!fhirServer.read("Patient", patientId)) {
    return c.json({ detail: `Patient/${patientId} not found` }, 404);
  }
  const token = smartAuth.createLaunchContext(patientId);
  return c.json({ launch: token, patient_id: patientId });
});

smartApi.post("/token", async (c) => {
  // Form-encoded body per OAuth2 spec.
  const form = await c.req.parseBody();
  const grantType = String(form.grant_type ?? "");
  const code = String(form.code ?? "");
  const redirectUri = String(form.redirect_uri ?? "");
  const clientId = String(form.client_id ?? "");
  const codeVerifier = form.code_verifier ? String(form.code_verifier) : null;

  if (grantType !== "authorization_code") {
    return c.json({ detail: "Unsupported grant_type" }, 400);
  }

  const result = smartAuth.exchangeCode({
    code,
    clientId,
    redirectUri,
    codeVerifier,
  });
  if (!result) {
    return c.json({ detail: "Invalid or expired authorization code" }, 400);
  }
  return c.json(result);
});
