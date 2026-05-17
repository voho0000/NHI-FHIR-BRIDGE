/**
 * Optional shared-password gate for the dashboard.
 *
 * When `DASHBOARD_PASSWORD` is unset (the default), this middleware is
 * a no-op — solo POC users on localhost don't need a password to look
 * at their own data. When it IS set, every page request and every
 * /api/backend/* proxy call must carry the session cookie set by
 * /api/dashboard-auth. Without it, page navigations redirect to /login
 * and API calls return 401 JSON.
 *
 * The cookie value is sha256(DASHBOARD_PASSWORD) — anyone with the
 * password can mint a session, and the middleware computes the same
 * hash to verify. Not a substitute for proper SSO, but adequate for
 * the "clinic workstation shared by a few staff" threat model the
 * project is sized for.
 */

import { NextResponse, type NextRequest } from "next/server";

export const SESSION_COOKIE = "nfb_dashboard_session";

async function expectedCookie(password: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

export async function middleware(req: NextRequest) {
  const password = process.env.DASHBOARD_PASSWORD ?? "";
  if (!password) return NextResponse.next();

  const path = req.nextUrl.pathname;

  // Always-allowed: the login UI + its POST handler. Everything else
  // (pages + /api/backend/*) needs a valid session cookie.
  if (path === "/login" || path === "/api/dashboard-auth") {
    return NextResponse.next();
  }

  const got = req.cookies.get(SESSION_COOKIE)?.value ?? "";
  const want = await expectedCookie(password);
  if (got && timingSafeEqual(got, want)) {
    return NextResponse.next();
  }

  // API calls get JSON 401 so clients can react; page navigations get
  // a redirect to /login with the original URL as `next=`.
  if (path.startsWith("/api/")) {
    return NextResponse.json({ detail: "Dashboard login required" }, { status: 401 });
  }
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", path + req.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Run on every route except Next's own internals and the static favicon.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
