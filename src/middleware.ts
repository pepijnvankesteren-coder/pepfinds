import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE, isValidSessionToken } from "@/lib/session";

/**
 * Gate the entire /admin area behind a valid session cookie. The login page
 * is the single exception (and bounces already-authenticated admins back to
 * the dashboard). Server actions re-verify via requireAdmin() — this is the
 * navigation-level gate, not the only line of defense.
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const authenticated = await isValidSessionToken(token);
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (isLoginPage) {
    return authenticated
      ? NextResponse.redirect(new URL("/admin", request.url))
      : NextResponse.next();
  }

  return authenticated
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};
