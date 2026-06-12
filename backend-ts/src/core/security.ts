/**
 * Shared auth dependencies used by multiple routers.
 *
 * Two middlewares:
 * - `requireSyncApiKey`  : header-only check for X-Sync-API-Key.
 *                          Used by sync write/admin routes called by
 *                          the extension and the dashboard's proxied
 *                          server actions.
 * - `requireFhirAuth`    : accepts EITHER a valid X-Sync-API-Key
 *                          OR a valid SMART bearer token. Used on
 *                          /fhir/* PHI paths so SMART apps still work
 *                          while non-SMART callers (dashboard via
 *                          server-side proxy) must present the key.
 *                          Stashes the validated token row on
 *                          `c.var.smartToken` (null when the caller
 *                          authenticated via the API key instead) so
 *                          `requireFhirScope` can enforce scopes.
 * - `requireFhirScope`   : factory; runs after `requireFhirAuth` and
 *                          rejects a bearer token that lacks
 *                          `patient/*.read` or `patient/<rt>.read` for
 *                          the resource type being served. API-key
 *                          callers (dashboard) bypass scope checks.
 *
 * The first two middlewares are no-ops when SYNC_API_KEY is empty
 * (single-user loopback dev mode); main.ts prints a loud startup
 * warning in that case. `requireFhirScope` still enforces scopes for
 * any bearer-authenticated request so SMART app dev/POC respects the
 * scope contract.
 */

import { createHash, timingSafeEqual } from "node:crypto";

import type { MiddlewareHandler } from "hono";

import { settings } from "@/core/config";
import { type OAuthToken } from "@/models/schema";
import { smartAuth } from "@/smart/oauth2";

export type SmartAuthVariables = {
  smartToken: OAuthToken | null;
};

/**
 * Constant-time string comparison (audit 2026-06-12): `===` short-
 * circuits per character, leaking key-prefix length through timing.
 * Hashing both sides first equalizes lengths so timingSafeEqual applies.
 */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export const requireSyncApiKey: MiddlewareHandler = async (c, next) => {
  if (!settings.SYNC_API_KEY) return next();
  const got = c.req.header("X-Sync-API-Key");
  if (!got || !safeEqual(got, settings.SYNC_API_KEY)) {
    return c.json({ detail: "Invalid or missing X-Sync-API-Key header" }, 401);
  }
  return next();
};

export const requireFhirAuth: MiddlewareHandler = async (c, next) => {
  if (!settings.SYNC_API_KEY) {
    // Dev/POC mode: try to capture a bearer token if present so scope
    // enforcement still applies to SMART app testing, but don't reject
    // unauthenticated callers.
    const authz = c.req.header("Authorization");
    let token: OAuthToken | null = null;
    if (authz?.toLowerCase().startsWith("bearer ")) {
      token = smartAuth.validateToken(authz.slice(7).trim());
    }
    c.set("smartToken", token);
    return next();
  }

  const apiKey = c.req.header("X-Sync-API-Key");
  if (apiKey && safeEqual(apiKey, settings.SYNC_API_KEY)) {
    c.set("smartToken", null);
    return next();
  }

  const authz = c.req.header("Authorization");
  if (authz?.toLowerCase().startsWith("bearer ")) {
    const token = smartAuth.validateToken(authz.slice(7).trim());
    if (token) {
      c.set("smartToken", token);
      return next();
    }
  }

  return c.json(
    { detail: "Authentication required: present X-Sync-API-Key or a SMART bearer token" },
    401,
  );
};

/**
 * Check whether a SMART token's scopes grant read on the given
 * resourceType. Recognized read scopes (per scopes_supported in
 * /.well-known/smart-configuration): `patient/*.read` and
 * `patient/<ResourceType>.read`. `user/` and `system/` scopes aren't
 * advertised by this server so they aren't granted here either.
 */
export function tokenAllowsRead(token: OAuthToken, resourceType: string): boolean {
  const scopes = Array.isArray(token.scopes) ? token.scopes : [];
  if (scopes.includes("patient/*.read")) return true;
  if (scopes.includes(`patient/${resourceType}.read`)) return true;
  return false;
}

export function requireFhirScope(resourceType: string): MiddlewareHandler {
  return async (c, next) => {
    const token = c.get("smartToken") as OAuthToken | null | undefined;
    // API-key auth path (dashboard proxy) or SYNC_API_KEY-empty dev
    // mode with no bearer present: skip scope check.
    if (!token) return next();
    if (tokenAllowsRead(token, resourceType)) return next();
    // OAuth2 §5.2 — 403 with WWW-Authenticate is the canonical
    // insufficient_scope response. SMART apps surface this to the user.
    c.header(
      "WWW-Authenticate",
      `Bearer error="insufficient_scope", scope="patient/${resourceType}.read"`,
    );
    return c.json(
      {
        detail: `Token scopes do not include patient/${resourceType}.read or patient/*.read`,
      },
      403,
    );
  };
}
