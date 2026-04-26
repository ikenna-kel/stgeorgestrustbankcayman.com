import { NextRequest, NextResponse } from "next/server";
import { withProtected } from "@/lib/api-middleware";

export const GET = withProtected(async (req, ctx) => {
  return NextResponse.json({ valid: true, userId: ctx.userId });
});
