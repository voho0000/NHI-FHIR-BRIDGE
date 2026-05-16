/**
 * Shared auth dependencies used by multiple routers.
 *
 * Port of `backend/app/core/security.py`. The Hono equivalent of a
 * FastAPI Depends is just middleware applied to selected routes.
 */

import type { MiddlewareHandler } from "hono";

import { settings } from "@/core/config";

/**
 * Reject requests when SYNC_API_KEY is configured but the header is
 * missing or wrong. When SYNC_API_KEY is empty (POC/dev mode) the
 * middleware is a no-op so first-time users can `docker compose up`
 * and try things out.
 */
export const requireSyncApiKey: MiddlewareHandler = async (c, next) => {
  if (!settings.SYNC_API_KEY) {
    // auth disabled — POC / dev mode
    return next();
  }
  const got = c.req.header("X-Sync-API-Key");
  if (got !== settings.SYNC_API_KEY) {
    return c.json({ detail: "Invalid or missing X-Sync-API-Key header" }, 401);
  }
  return next();
};
