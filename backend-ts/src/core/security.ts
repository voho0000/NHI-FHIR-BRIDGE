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
 *
 * Both middlewares are no-ops when SYNC_API_KEY is empty (single-user
 * loopback dev mode); main.ts prints a loud startup warning in that case.
 */

import type { MiddlewareHandler } from "hono";

import { settings } from "@/core/config";
import { smartAuth } from "@/smart/oauth2";

export const requireSyncApiKey: MiddlewareHandler = async (c, next) => {
  if (!settings.SYNC_API_KEY) return next();
  const got = c.req.header("X-Sync-API-Key");
  if (got !== settings.SYNC_API_KEY) {
    return c.json({ detail: "Invalid or missing X-Sync-API-Key header" }, 401);
  }
  return next();
};

export const requireFhirAuth: MiddlewareHandler = async (c, next) => {
  if (!settings.SYNC_API_KEY) return next();

  const apiKey = c.req.header("X-Sync-API-Key");
  if (apiKey && apiKey === settings.SYNC_API_KEY) return next();

  const authz = c.req.header("Authorization");
  if (authz?.toLowerCase().startsWith("bearer ")) {
    const token = authz.slice(7).trim();
    if (smartAuth.validateToken(token)) return next();
  }

  return c.json(
    { detail: "Authentication required: present X-Sync-API-Key or a SMART bearer token" },
    401,
  );
};
