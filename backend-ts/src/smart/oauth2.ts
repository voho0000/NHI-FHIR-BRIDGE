/**
 * SMART on FHIR OAuth2 server.
 *
 * Port of `backend/app/smart/oauth2.py`. Supports:
 *   - Launch context: pre-bind a patient ID to a short-lived token so
 *     the EHR-Launch flow targets the right patient.
 *   - Client management: lookup + idempotent seed of demo clients.
 *   - Authorization code flow: create + exchange (with PKCE verification).
 *   - Bearer token validation.
 */

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

import { and, eq } from "drizzle-orm";

import { type DB, db as defaultDb } from "@/core/database";
import {
  type OAuthClient,
  type OAuthToken,
  authorizationCodes,
  oauthClients,
  oauthTokens,
} from "@/models/schema";

function tokenUrlsafe(bytes: number): string {
  // Mirror Python's secrets.token_urlsafe — base64url, no padding.
  return randomBytes(bytes).toString("base64url");
}

/**
 * Single source of truth for the SMART discovery document. Served
 * verbatim from both `/fhir/.well-known/smart-configuration` and
 * `/smart/.well-known/smart-configuration` — these two paths are
 * historical (SMART App Launch IG §3.1 puts it at the FHIR base;
 * some clients also probe the authorization base) and must return
 * identical JSON so SMART apps see the same capability set
 * regardless of which path they hit.
 *
 * Only advertise what is actually implemented (audit 2026-06-12 P3):
 * no id_token is ever issued (so no sso-openid-connect capability and
 * no openid/fhirUser scopes) and no refresh_token is ever issued (so
 * no online_access/offline_access scopes). Advertising them makes
 * conforming clients mis-negotiate.
 */
export function buildSmartConfiguration(baseUrl: string): Record<string, unknown> {
  return {
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/smart/authorize`,
    token_endpoint: `${baseUrl}/smart/token`,
    capabilities: [
      "launch-standalone",
      "launch-ehr",
      "client-public",
      "context-standalone-patient",
      "permission-patient",
    ],
    scopes_supported: ["launch", "launch/patient", "patient/*.read"],
    response_types_supported: ["code"],
    code_challenge_methods_supported: ["S256"],
  };
}

function nowPlusMinutes(min: number): Date {
  return new Date(Date.now() + min * 60_000);
}

function nowPlusHours(hr: number): Date {
  return new Date(Date.now() + hr * 60 * 60_000);
}

export class SMARTAuthServer {
  /** Launch contexts kept in memory (per Python parity — short TTL, no DB). */
  private launchContexts: Map<string, { patientId: string; expiresAt: Date }> = new Map();

  // ── Launch context ─────────────────────────────────────────────────

  createLaunchContext(patientId: string): string {
    const token = tokenUrlsafe(24);
    this.launchContexts.set(token, {
      patientId,
      expiresAt: nowPlusMinutes(10),
    });
    return token;
  }

  resolveLaunchContext(token: string | null | undefined): string | null {
    if (!token) return null;
    const ctx = this.launchContexts.get(token);
    if (!ctx) return null;
    // Single-use (audit 2026-06-12 P3): consume the token on first
    // resolve so a leaked launch token can't be replayed for the rest
    // of its 10-minute TTL.
    this.launchContexts.delete(token);
    if (ctx.expiresAt < new Date()) return null;
    return ctx.patientId;
  }

  // ── Client management ──────────────────────────────────────────────

  getClient(clientId: string, dbi: DB = defaultDb): OAuthClient | null {
    return dbi.select().from(oauthClients).where(eq(oauthClients.clientId, clientId)).get() ?? null;
  }

  /**
   * Ensure the built-in SMART clients exist and their redirect_uri
   * whitelists are up to date. Idempotent — re-running upserts the
   * canonical URI list.
   */
  seedDemoClients(dbi: DB = defaultDb): void {
    // Demo client (localhost dev frontend).
    // /launch entries pruned 2026-06-12 — they were redirect URIs
    // pointing at the (now removed) pre-PKCE frontend /launch page;
    // OAuth redirect_uris are callbacks, not launch entry points.
    const demoUris = ["http://localhost:3001/callback", "http://localhost:3000/callback"];
    const demoExisting = this.getClient("demo-smart-app", dbi);
    if (!demoExisting) {
      dbi
        .insert(oauthClients)
        .values({
          clientId: "demo-smart-app",
          clientName: "Demo SMART App",
          redirectUris: demoUris,
          allowedScopes: [
            "openid",
            "fhirUser",
            "launch/patient",
            "patient/*.read",
            "offline_access",
          ],
          isConfidential: false,
        })
        .run();
    } else {
      dbi
        .update(oauthClients)
        .set({ redirectUris: demoUris })
        .where(eq(oauthClients.clientId, "demo-smart-app"))
        .run();
    }

    // medical-note SMART app on GitHub Pages.
    const mnUris = [
      "https://voho0000.github.io/medical-note-smart-on-fhir/smart/callback",
      "http://localhost:3001/smart/callback",
      "http://localhost:3000/smart/callback",
    ];
    const mnExisting = this.getClient("my_web_app", dbi);
    if (!mnExisting) {
      dbi
        .insert(oauthClients)
        .values({
          clientId: "my_web_app",
          clientName: "Medical Note SMART App",
          redirectUris: mnUris,
          allowedScopes: [
            "launch",
            "openid",
            "fhirUser",
            "patient/*.read",
            "online_access",
            "offline_access",
          ],
          isConfidential: false,
        })
        .run();
    } else {
      dbi
        .update(oauthClients)
        .set({ redirectUris: mnUris })
        .where(eq(oauthClients.clientId, "my_web_app"))
        .run();
    }
  }

  // ── Authorization code ─────────────────────────────────────────────

  createAuthCode(
    {
      clientId,
      redirectUri,
      scopes,
      patientId,
      codeChallenge,
      codeChallengeMethod,
    }: {
      clientId: string;
      redirectUri: string;
      scopes: string[];
      patientId: string | null;
      codeChallenge: string | null;
      codeChallengeMethod: string | null;
    },
    dbi: DB = defaultDb,
  ): string {
    const code = tokenUrlsafe(32);
    dbi
      .insert(authorizationCodes)
      .values({
        code,
        clientId,
        redirectUri,
        scopes,
        patientId,
        codeChallenge,
        codeChallengeMethod,
        expiresAt: nowPlusMinutes(10),
        used: false,
      })
      .run();
    return code;
  }

  // ── Token exchange ─────────────────────────────────────────────────

  exchangeCode(
    {
      code,
      clientId,
      redirectUri,
      codeVerifier,
    }: {
      code: string;
      clientId: string;
      redirectUri: string;
      codeVerifier: string | null;
    },
    dbi: DB = defaultDb,
  ): Record<string, any> | null {
    const row = dbi
      .select()
      .from(authorizationCodes)
      .where(and(eq(authorizationCodes.code, code), eq(authorizationCodes.used, false)))
      .get();

    if (!row) return null;
    if (row.clientId !== clientId || row.redirectUri !== redirectUri) return null;
    if (row.expiresAt < new Date()) return null;

    // PKCE verification. timingSafeEqual over digests (audit 2026-06-12)
    // instead of `!==`, which leaks match-prefix length through timing.
    if (row.codeChallenge) {
      if (!codeVerifier) return null;
      let computed: string;
      if (row.codeChallengeMethod === "S256") {
        const digest = createHash("sha256").update(codeVerifier).digest();
        computed = digest.toString("base64url");
      } else {
        computed = codeVerifier;
      }
      const ca = createHash("sha256").update(computed).digest();
      const cb = createHash("sha256").update(row.codeChallenge).digest();
      if (!timingSafeEqual(ca, cb)) return null;
    }

    dbi
      .update(authorizationCodes)
      .set({ used: true })
      .where(eq(authorizationCodes.code, code))
      .run();

    const accessToken = tokenUrlsafe(32);
    dbi
      .insert(oauthTokens)
      .values({
        clientId,
        accessToken,
        scopes: row.scopes,
        patientId: row.patientId,
        expiresAt: nowPlusHours(1),
      })
      .run();

    const response: Record<string, any> = {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: 3600,
      scope: (row.scopes ?? []).join(" "),
    };
    if (row.patientId) response.patient = row.patientId;
    return response;
  }

  // ── Token validation ───────────────────────────────────────────────

  validateToken(token: string, dbi: DB = defaultDb): OAuthToken | null {
    const row = dbi.select().from(oauthTokens).where(eq(oauthTokens.accessToken, token)).get();
    if (row && row.expiresAt > new Date()) return row;
    return null;
  }
}

export const smartAuth = new SMARTAuthServer();
