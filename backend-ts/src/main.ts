/**
 * NHI-FHIR-Bridge backend entry point.
 *
 * Port of `backend/app/main.py`. Wires the Hono app: runs Drizzle
 * migrations + zombie-log reap on startup, seeds demo SMART clients,
 * mounts /fhir /smart /sync, applies the two-layer CORS strategy
 * (strict allow-list for PHI + wildcard for SMART discovery).
 */

import { serve } from "@hono/node-server";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { fhirApi } from "@/api/fhir";
import { smartApi } from "@/api/smart";
import { syncApi } from "@/api/sync";
import { settings } from "@/core/config";
import { db } from "@/core/database";
import { runMigrations } from "@/core/migrate";
import { syncLogs } from "@/models/schema";
import { smartAuth } from "@/smart/oauth2";

// ── CORS allow-list ──────────────────────────────────────────────────

const DEFAULT_CORS_ORIGINS = [
  "http://localhost:3010",
  "http://127.0.0.1:3010",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://myhealthbank.nhi.gov.tw",
  "https://voho0000.github.io",
];

const EXTRA_CORS_ORIGINS = (settings.ALLOW_CORS_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const CORS_ALLOWED_ORIGINS = new Set([...DEFAULT_CORS_ORIGINS, ...EXTRA_CORS_ORIGINS]);
const CHROME_EXTENSION_RE = /^chrome-extension:\/\/[a-z0-9]+$/;

function corsOriginCheck(origin: string): string | null {
  if (CORS_ALLOWED_ORIGINS.has(origin)) return origin;
  if (CHROME_EXTENSION_RE.test(origin)) return origin;
  return null;
}

// Endpoints that return discovery JSON with no PHI — must allow *.
const PUBLIC_DISCOVERY_PATHS = new Set([
  "/fhir/metadata",
  "/smart/.well-known/smart-configuration",
  "/fhir/.well-known/smart-configuration",
]);

// ── App ──────────────────────────────────────────────────────────────

export function createApp(): Hono {
  const app = new Hono();

  // OUTERMOST: public discovery wildcard CORS. Must run before the strict
  // layer below, because once strict CORS rejects a preflight we never get
  // the chance to override.
  app.use("*", async (c, next) => {
    if (!PUBLIC_DISCOVERY_PATHS.has(c.req.path)) return next();

    if (c.req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Max-Age": "600",
          Vary: "Origin",
        },
      });
    }
    await next();
    c.res.headers.set("Access-Control-Allow-Origin", "*");
    c.res.headers.delete("Access-Control-Allow-Credentials");
    c.res.headers.set("Vary", "Origin");
  });

  // Strict CORS for everything else (PHI paths, auth endpoints, /sync/*).
  app.use(
    "*",
    cors({
      origin: (origin) => corsOriginCheck(origin) ?? "",
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization", "X-Sync-API-Key"],
      credentials: true,
      maxAge: 600,
    }),
  );

  app.route("/fhir", fhirApi);
  app.route("/smart", smartApi);
  app.route("/sync", syncApi);

  app.get("/", (c) =>
    c.json({
      name: "NHI-FHIR-Bridge",
      version: "0.1.0",
      fhir: "/fhir/metadata",
      smart_config: "/smart/.well-known/smart-configuration",
    }),
  );

  return app;
}

// ── Lifespan ─────────────────────────────────────────────────────────

export function runStartup(): void {
  runMigrations();
  smartAuth.seedDemoClients();

  // Reap zombie sync logs from a previous interrupted run. If the process
  // was killed mid-flight, a row stays at status='running' forever.
  const reaped = db
    .update(syncLogs)
    .set({
      status: "failed",
      message: "Backend restarted before this sync finished",
      completedAt: new Date(),
    })
    .where(eq(syncLogs.status, "running"))
    .run();
  if (reaped.changes > 0) {
    console.log(`[startup] Reaped ${reaped.changes} zombie sync log(s)`);
  }
}

// ── Direct-run entry point ───────────────────────────────────────────

const isDirectRun = process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop()!);

if (isDirectRun) {
  runStartup();
  const app = createApp();
  serve({ fetch: app.fetch, port: settings.PORT }, ({ port }) => {
    console.log(`[NHI-FHIR-Bridge] listening on http://0.0.0.0:${port}`);
  });
}
