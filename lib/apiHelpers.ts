import { NextRequest } from "next/server";

export function getUserIdFromRequest(request: NextRequest): string | null {
  return request.headers.get("x-user-id");
}

export function getSessionIdFromRequest(request: NextRequest): string | null {
  return request.headers.get("x-session-id");
}
