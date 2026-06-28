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
import { bodyLimit } from "hono/body-limit";
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

// Loopback origins (any port) are always trusted — that's the user's
// own machine talking to its own bridge.
const LOOPBACK_ORIGIN_RE = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;

// Third-party origins shipped as defaults. 2026-06-12 (audit P1-2):
// these are only honored when SYNC_API_KEY is set — in keyless mode the
// key middlewares are no-ops, so reflecting a third-party origin with
// credentials would hand the whole PHI store to any page on that origin
// (github.io is shared by every repo of the account). The NHI origin
// (myhealthbank.nhi.gov.tw) was dropped entirely: nothing of ours runs
// on NHI pages (no content scripts), and an XSS there must not be able
// to read the local bridge.
const DEFAULT_THIRD_PARTY_ORIGINS = new Set([
  // MediPrisma SMART app's own dedicated domain (not shared like github.io).
  "https://mediprisma.tw",
  "https://voho0000.github.io",
]);

// Origins the operator explicitly configured — deliberate opt-in,
// honored regardless of key mode.
const EXTRA_CORS_ORIGINS = new Set(
  (settings.ALLOW_CORS_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
);

// Pin to specific extension IDs rather than accepting every
// chrome-extension://* origin. IDs come from ALLOWED_EXTENSION_IDS env
// (comma-sep). Note the extension itself does NOT need CORS approval —
// its service-worker fetches use manifest host_permissions, which are
// CORS-exempt. The permissive fallback regex below only exists for
// unpacked dev installs and is now gated behind keyed mode (audit
// P1-2): keyless + any-extension reflection meant every extension the
// user has installed could read the PHI store.
const ALLOWED_EXTENSION_IDS = (process.env.ALLOWED_EXTENSION_IDS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const ALLOWED_EXTENSION_ORIGINS = new Set(
  ALLOWED_EXTENSION_IDS.map((id) => `chrome-extension://${id}`),
);
const CHROME_EXTENSION_RE = /^chrome-extension:\/\/[a-p]{32}$/;

function corsOriginCheck(origin: string): string | null {
  if (LOOPBACK_ORIGIN_RE.test(origin)) return origin;
  if (EXTRA_CORS_ORIGINS.has(origin)) return origin;
  if (ALLOWED_EXTENSION_ORIGINS.has(origin)) return origin;
  // Keyless mode = single-user loopback POC. Nothing beyond the user's
  // own loopback origins (and explicit env opt-ins above) gets CORS.
  if (!settings.SYNC_API_KEY) return null;
  if (DEFAULT_THIRD_PARTY_ORIGINS.has(origin)) return origin;
  if (ALLOWED_EXTENSION_IDS.length === 0 && CHROME_EXTENSION_RE.test(origin)) {
    return origin;
  }
  return null;
}

// ── Host-header validation (DNS-rebinding protection) ───────────────
//
// 2026-06-12 (audit P1-3): a malicious page can DNS-rebind its hostname
// to 127.0.0.1 and issue requests that the browser treats as
// same-origin — no Origin header, no CORS involved — defeating both the
// CORS layer and (via the dashboard proxy) SYNC_API_KEY. The one thing
// the attacker cannot forge is the Host header, so reject any request
// whose Host isn't loopback / an explicitly allowed host.
// ALLOWED_HOSTS (comma-sep) covers reverse proxies and the
// docker-compose internal hostname (backend:8010).
const LOOPBACK_HOST_RE = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;
const EXTRA_ALLOWED_HOSTS = new Set(
  (process.env.ALLOWED_HOSTS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
);

export function hostAllowed(host: string | null | undefined): boolean {
  if (!host) return false;
  const h = host.toLowerCase();
  return LOOPBACK_HOST_RE.test(h) || EXTRA_ALLOWED_HOSTS.has(h);
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

  // OUTERMOST: Host validation (audit P1-3, DNS-rebinding protection).
  // When the header is absent (Hono's app.request() test helper, some
  // non-browser clients) fall back to the request URL's host — with a
  // real HTTP server that URL is reconstructed from the Host header
  // anyway, so the two never disagree.
  app.use("*", async (c, next) => {
    const host = c.req.header("host") ?? new URL(c.req.url).host;
    if (!hostAllowed(host)) {
      return c.json(
        {
          detail:
            "Forbidden: unrecognized Host header (DNS-rebinding protection). " +
            "Set ALLOWED_HOSTS=<host:port>[,…] to allow additional hostnames.",
        },
        403,
      );
    }
    return next();
  });

  // Public discovery wildcard CORS. Must run before the strict
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

  // 32 MB cap on any request body. A typical NHI sync POSTs ~1 MB
  // structured JSON; the LLM HTML fallback can hit ~5 MB. 32 MB leaves
  // generous headroom while preventing a 10 GB body from OOMing the
  // process. Applies to every route (Hono handles GETs harmlessly).
  app.use(
    "*",
    bodyLimit({
      maxSize: 32 * 1024 * 1024,
      onError: (c) => c.json({ detail: "Request body exceeds 32 MB limit" }, 413),
    }),
  );

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
  // Bind loopback by default — exposing PHI on every interface (the Node
  // default 0.0.0.0) is rarely what anyone running this locally wants.
  // Set BIND_HOST=0.0.0.0 (or any host) explicitly to override.
  const hostname = process.env.BIND_HOST ?? "127.0.0.1";
  serve({ fetch: app.fetch, port: settings.PORT, hostname }, ({ port }) => {
    console.log(`[NHI-FHIR-Bridge] listening on http://${hostname}:${port}`);
    if (!settings.SYNC_API_KEY) {
      console.warn(
        "[NHI-FHIR-Bridge] WARNING: SYNC_API_KEY is empty — all auth is disabled. " +
          "CORS is locked to loopback origins in this mode (external SMART apps " +
          "like the GitHub-Pages demo need a key). Set SYNC_API_KEY in .env " +
          "before exposing this beyond localhost.",
      );
    }
  });
}
