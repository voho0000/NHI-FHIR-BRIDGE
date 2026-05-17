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

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
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
