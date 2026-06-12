/**
 * SMART on FHIR OAuth2 endpoints.
 *
 * Port of `backend/app/api/smart.py`. Mounted at `/smart` from main.ts.
 */

import { Hono } from "hono";

import { settings } from "@/core/config";
import { requireSyncApiKey } from "@/core/security";
import { fhirServer } from "@/fhir/server";
import { buildSmartConfiguration, smartAuth } from "@/smart/oauth2";

export const smartApi = new Hono();

smartApi.get("/.well-known/smart-configuration", (c) => {
  const base = settings.FHIR_BASE_URL.replace("/fhir", "");
  return c.json(buildSmartConfiguration(base));
});

smartApi.get("/authorize", async (c) => {
  const responseType = c.req.query("response_type") ?? "";
  const clientId = c.req.query("client_id") ?? "";
  const redirectUri = c.req.query("redirect_uri") ?? "";
  const scope = c.req.query("scope") ?? "";
  const state = c.req.query("state") ?? null;
  const codeChallenge = c.req.query("code_challenge") ?? null;
  const codeChallengeMethod = c.req.query("code_challenge_method") ?? null;
  const launch = c.req.query("launch") ?? null;
  const aud = c.req.query("aud") ?? null;

  // aud is REQUIRED — SMART App Launch obliges clients to send it, and
  // validating it prevents a malicious SMART app from luring the user
  // to authorize against a different server. (audit 2026-06-12 P3:
  // `if (aud)` made the check skippable by simply omitting the param.)
  if (!aud) {
    return c.json(
      {
        error: "invalid_request",
        detail: `aud is required and must equal ${settings.FHIR_BASE_URL}`,
      },
      400,
    );
  }
  const normalize = (u: string) => u.replace(/\/+$/, "");
  if (normalize(aud) !== normalize(settings.FHIR_BASE_URL)) {
    return c.json({ detail: `aud must equal ${settings.FHIR_BASE_URL}` }, 400);
  }

  const client = smartAuth.getClient(clientId);
  if (!client) {
    return c.json({ detail: "Unknown client_id" }, 400);
  }
  const allowedUris = client.redirectUris ?? [];
  if (!allowedUris.includes(redirectUri)) {
    return c.json({ detail: "Invalid redirect_uri" }, 400);
  }

  // Only the authorization-code flow is implemented. RFC 6749 §4.1.2.1:
  // once redirect_uri is validated, an unsupported response_type is
  // reported via error redirect (the client/redirect_uri checks above
  // already direct-400 when we have no trustworthy redirect target).
  if (responseType !== "code") {
    const errParams = new URLSearchParams({ error: "unsupported_response_type" });
    if (state) errParams.set("state", state);
    return c.redirect(`${redirectUri}?${errParams.toString()}`, 302);
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
    // S256 only — discovery advertises S256 only, and 'plain' defeats
    // PKCE's interception protection (audit 2026-06-12 P3).
    if (codeChallengeMethod !== "S256") {
      return c.json(
        { error: "invalid_request", detail: "code_challenge_method must be 'S256'." },
        400,
      );
    }
  }

  // Patient context comes from the EHR-launch handshake — the dashboard
  // mints a launch token via /sync/launch-context (API-key-gated), then
  // hands it to the SMART app, which echoes it back here. Without a
  // valid launch token we refuse rather than silently picking the first
  // patient in the store (that would be a PHI disclosure to any client
  // who can hit this endpoint).
  let patientId = smartAuth.resolveLaunchContext(launch);
  if (!patientId) {
    // Dev/POC escape hatch (audit 2026-06-12 P2-3): auto-picking the
    // first patient in the store is a PHI disclosure, so it requires
    // BOTH keyless mode AND the explicit env opt-in
    // SMART_DEV_AUTOSELECT_PATIENT=1 (read from process.env at request
    // time; intentionally NOT in settings so it stays a dev-only knob).
    const devAutoselect =
      !settings.SYNC_API_KEY && process.env.SMART_DEV_AUTOSELECT_PATIENT === "1";
    if (!devAutoselect) {
      return c.json(
        {
          detail:
            "Standalone launch is disabled. Launch from the dashboard so a launch context is created via /sync/launch-context.",
        },
        400,
      );
    }
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
