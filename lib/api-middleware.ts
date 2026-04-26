import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "./db";
import { User } from "./models";
import { updateSessionActivity, isSessionIdle, deleteSession } from "./auth-node";

/** Context passed to protected route handlers */
export interface ProtectedContext {
  userId: string;
  sessionId: string;
  token: string;
}

/** Params context for dynamic routes */
export interface RouteContext {
  params: Promise<Record<string, string>>;
}

/**
 * Wrapper function for protected API routes
 * - Verifies the request has valid authentication headers from middleware
 * - Checks session idle status and updates activity
 * - Executes the handler if all checks pass
 *
 * Usage (standard route):
 *   export const GET = withProtected(async (req, ctx) => { ... });
 *
 * Usage (dynamic route):
 *   export const GET = withProtected(async (req, ctx, routeCtx) => {
 *     const { id } = await routeCtx.params;
 *     ...
 *   });
 */
export function withProtected(
  handler: (
    req: NextRequest,
    ctx: ProtectedContext,
    routeCtx: RouteContext,
  ) => Promise<NextResponse>
) {
  return async (
    req: NextRequest,
    routeCtx?: RouteContext,
  ): Promise<NextResponse> => {
    try {
      // Extract user context from middleware headers
      const userId = req.headers.get("x-user-id");
      const sessionId = req.headers.get("x-session-id");
      const token = req.headers.get("x-token");

      if (!userId || !sessionId || !token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Connect to database
      await connectDB();

      // Check if session is idle
      const idle = await isSessionIdle(token);
      if (idle) {
        await deleteSession(token);
        return NextResponse.json(
          { error: "Session expired (idle logout)" },
          { status: 401 }
        );
      }

      // Update session activity
      const sessionUpdated = await updateSessionActivity(token);
      if (!sessionUpdated) {
        return NextResponse.json({ error: "Invalid session" }, { status: 401 });
      }

      const ctx: ProtectedContext = { userId, sessionId, token };

      return await handler(req, ctx, routeCtx as RouteContext);
    } catch (error) {
      console.error("Protected route error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

/**
 * Wrapper function for admin-only API routes
 * - Verifies the request has valid authentication headers from middleware
 * - Checks session idle status and updates activity
 * - Verifies the user has admin role
 * - Executes the handler if all checks pass
 */
export function withAdmin(
  handler: (
    req: NextRequest,
    ctx: ProtectedContext,
    routeCtx: RouteContext,
  ) => Promise<NextResponse>
) {
  return async (
    req: NextRequest,
    routeCtx?: RouteContext,
  ): Promise<NextResponse> => {
    try {
      // Extract user context from middleware headers
      const userId = req.headers.get("x-user-id");
      const sessionId = req.headers.get("x-session-id");
      const token = req.headers.get("x-token");

      if (!userId || !sessionId || !token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Connect to database
      await connectDB();

      // Check if session is idle
      const idle = await isSessionIdle(token);
      if (idle) {
        await deleteSession(token);
        return NextResponse.json(
          { error: "Session expired (idle logout)" },
          { status: 401 }
        );
      }

      // Update session activity
      const sessionUpdated = await updateSessionActivity(token);
      if (!sessionUpdated) {
        return NextResponse.json({ error: "Invalid session" }, { status: 401 });
      }

      // Check if user is admin
      const user = await User.findById(userId).select("role").lean();
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if (user.role !== "admin") {
        return NextResponse.json(
          { error: "Forbidden: admin access required" },
          { status: 403 }
        );
      }

      const ctx: ProtectedContext = { userId, sessionId, token };

      return await handler(req, ctx, routeCtx as RouteContext);
    } catch (error) {
      console.error("Admin route error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
