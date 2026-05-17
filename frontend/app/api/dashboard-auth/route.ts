/**
 * POST handler for the dashboard's shared-password gate.
 *
 * Receives {password} as JSON. If it matches DASHBOARD_PASSWORD, sets
 * a HttpOnly cookie whose value is sha256(DASHBOARD_PASSWORD) — same
 * hash the middleware computes and compares. Cookie lasts 30 days.
 */

import { NextResponse } from "next/server";

// Inline the cookie name to avoid Next.js route ↔ middleware import
// path issues. Source of truth still lives in middleware.ts; keep in
// sync if it ever changes.
const SESSION_COOKIE = "nfb_dashboard_session";

const COOKIE_MAX_AGE_S = 30 * 24 * 3600; // 30 days

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(req: Request) {
  const expected = process.env.DASHBOARD_PASSWORD ?? "";
  if (!expected) {
    return NextResponse.json(
      { detail: "Dashboard password not configured on this server" },
      { status: 503 },
    );
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ detail: "Body must be JSON" }, { status: 400 });
  }
  const got = String(payload?.password ?? "");
  if (got !== expected) {
    // Same response shape for short vs wrong so timing-curious callers
    // can't fingerprint password length from response shape. Real
    // timing-safe compare lives in the middleware.
    return NextResponse.json({ detail: "密碼錯誤" }, { status: 401 });
  }

  const cookieValue = await sha256Hex(expected);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, cookieValue, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_S,
    // Secure only when actually served over HTTPS — localhost dev runs
    // over http://, where Secure cookies wouldn't get set at all.
    secure: req.headers.get("x-forwarded-proto") === "https",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
