/**
 * NHI-FHIR-Bridge backend entry point.
 *
 * Port of `backend/app/main.py`. Wires the Hono app: runs Drizzle
 * migrations + zombie-log reap on startup, seeds demo SMART clients,
 * mounts /fhir /smart /sync, applies the two-layer CORS strategy
 * (strict allow-list for PHI + wildcard for SMART discovery).
 */

import { randomBytes } from "node:crypto";

import { serve } from "@hono/node-server";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { setStableIdSalt } from "@nhi-fhir-bridge/mapper";

import { fhirApi } from "@/api/fhir";
import { smartApi } from "@/api/smart";
import { syncApi } from "@/api/sync";
import { settings } from "@/core/config";
import { db } from "@/core/database";
import { runMigrations } from "@/core/migrate";
import { appSettings, syncLogs } from "@/models/schema";
import { smartAuth } from "@/smart/oauth2";

const STABLE_ID_SALT_KEY = "stable_id_salt";

function loadOrCreateStableIdSalt(): string {
  const existing = db
    .select()
    .from(appSettings)
    .where(eq(appSettings.key, STABLE_ID_SALT_KEY))
    .get();
  if (existing) return existing.value;
  const salt = randomBytes(32).toString("hex");
  db.insert(appSettings).values({ key: STABLE_ID_SALT_KEY, value: salt }).run();
  return salt;
}

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

// Pin to specific extension IDs rather than accepting every
// chrome-extension://* origin. Without this, any malicious extension
// the user installs could make credentialed calls to the backend's
// PHI endpoints. IDs come from ALLOWED_EXTENSION_IDS env (comma-sep).
// When the env is empty (e.g. unpacked dev install), fall back to the
// permissive regex so first-run UX still works; deployments meant to
// share with anyone else MUST set ALLOWED_EXTENSION_IDS.
const ALLOWED_EXTENSION_IDS = (process.env.ALLOWED_EXTENSION_IDS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const ALLOWED_EXTENSION_ORIGINS = new Set(
  ALLOWED_EXTENSION_IDS.map((id) => `chrome-extension://${id}`),
);
const CHROME_EXTENSION_RE = /^chrome-extension:\/\/[a-p]{32}$/;

function corsOriginCheck(origin: string): string | null {
  if (CORS_ALLOWED_ORIGINS.has(origin)) return origin;
  if (ALLOWED_EXTENSION_ORIGINS.has(origin)) return origin;
  if (ALLOWED_EXTENSION_IDS.length === 0 && CHROME_EXTENSION_RE.test(origin)) {
    return origin;
  }
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
  // Salt has to be loaded AFTER migrations (the app_settings table is
  // created by 0001) but BEFORE anything touches the mapper module —
  // every stableId() call from here on mixes this in.
  setStableIdSalt(loadOrCreateStableIdSalt());
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
  // Bind loopback by default — exposing PHI on every interface (the Node
  // default 0.0.0.0) is rarely what anyone running this locally wants.
  // Set BIND_HOST=0.0.0.0 (or any host) explicitly to override.
  const hostname = process.env.BIND_HOST ?? "127.0.0.1";
  serve({ fetch: app.fetch, port: settings.PORT, hostname }, ({ port }) => {
    console.log(`[NHI-FHIR-Bridge] listening on http://${hostname}:${port}`);
    if (!settings.SYNC_API_KEY) {
      console.warn(
        "[NHI-FHIR-Bridge] WARNING: SYNC_API_KEY is empty — all auth is disabled. " +
          "Set SYNC_API_KEY in .env before exposing this beyond localhost.",
      );
    }
  });
}
