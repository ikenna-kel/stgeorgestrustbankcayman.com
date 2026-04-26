import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, getBearerToken } from "./lib/auth-edge";

const publicPaths = [
  "/api/auth/signup",
  "/api/auth/login",
  "/api/auth/admin-login",
  "/api/auth/request-otp",
  "/api/auth/verify-otp",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/verify-email",
  "/api/uploadthing",
  "/api/settings",        // public deposit/contact settings
];

function isPublicPath(pathname: string): boolean {
  return publicPaths.some((p) => pathname.startsWith(p));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = getBearerToken(request.headers.get("authorization"));
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  const res = NextResponse.next();
  res.headers.set("x-user-id", payload.userId);
  res.headers.set("x-session-id", payload.sessionId);
  res.headers.set("x-token", token);
  return res;
}

export const config = {
  matcher: ["/api/:path*"],
};
