/**
 * Server-side proxy to the backend that injects X-Sync-API-Key.
 *
 * The dashboard previously shipped SYNC_API_KEY to the browser via
 * NEXT_PUBLIC_SYNC_API_KEY, so anyone with DevTools open could read
 * the key out of the JS bundle. Now the dashboard's client code calls
 * /api/backend/<path> on its own origin; this route handler forwards
 * to the actual backend with the key attached server-side.
 *
 * The SMART on FHIR flow (browser → /smart/authorize → SMART app
 * → /smart/token → /fhir/* with Bearer) goes directly to the public
 * backend URL, not through this proxy. SMART OAuth2 doesn't use the
 * sync API key.
 */

import { NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL ?? "http://backend:8010";
const SYNC_API_KEY = process.env.SYNC_API_KEY ?? "";

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "transfer-encoding",
  "upgrade",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "host",
  "content-length",
]);

// Origins that may invoke this proxy. The dashboard is served from
// these two URLs (Docker bind = 127.0.0.1:3010, but Next.js default
// dev / preview also responds to localhost:3010). Anything else —
// including a random web page the user has open — is rejected, even
// for credentialed simple requests that CORS can't help with (e.g.
// <form method="POST">). Pre-empts CSRF on /api/backend/*.
const SAME_SITE_ORIGINS = new Set([
  "http://localhost:3010",
  "http://127.0.0.1:3010",
]);

// 2026-06-12 (audit P1-3): DNS-rebinding protection. A malicious page can
// rebind its hostname to 127.0.0.1:3010; its requests then look
// same-origin to the browser (no Origin header), pass the Origin check
// below, and get the API key stamped on by this proxy. The Host header is
// the one thing rebinding cannot forge — accept loopback hosts (any port,
// to cover `next dev` on :3000) plus DASHBOARD_ALLOWED_HOSTS extras.
const LOOPBACK_HOST_RE = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;
const EXTRA_ALLOWED_HOSTS = new Set(
  (process.env.DASHBOARD_ALLOWED_HOSTS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
);

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const host = req.headers.get("host")?.toLowerCase() ?? "";
  if (!LOOPBACK_HOST_RE.test(host) && !EXTRA_ALLOWED_HOSTS.has(host)) {
    return new Response("forbidden: unrecognized Host (DNS-rebinding protection)", {
      status: 403,
    });
  }

  // Browser fetch/XHR includes Origin on all cross-origin calls and on
  // POST/PUT/DELETE/PATCH calls (even same-origin). Same-origin GET/HEAD
  // doesn't always set Origin — allow when missing (matches normal
  // dashboard usage) but reject any explicit non-allowlisted origin.
  const origin = req.headers.get("origin");
  if (origin && !SAME_SITE_ORIGINS.has(origin)) {
    return new Response("forbidden: cross-origin request", { status: 403 });
  }

  const { path } = await ctx.params;
  const search = req.nextUrl.search ?? "";
  const target = `${BACKEND_URL}/${path.join("/")}${search}`;

  const headers = new Headers();
  req.headers.forEach((v, k) => {
    if (!HOP_BY_HOP.has(k.toLowerCase())) headers.set(k, v);
  });
  if (SYNC_API_KEY) headers.set("x-sync-api-key", SYNC_API_KEY);

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: "manual",
  };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
  }

  const upstream = await fetch(target, init);
  const respHeaders = new Headers();
  upstream.headers.forEach((v, k) => {
    if (!HOP_BY_HOP.has(k.toLowerCase())) respHeaders.set(k, v);
  });
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: respHeaders,
  });
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as DELETE, proxy as PATCH };
