import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Grant } from "@/lib/models";
import { withProtected } from "@/lib/api-middleware";

export const GET = withProtected(async (req, ctx, routeCtx) => {
  const { id } = await routeCtx.params;
  try {
    const grant = await Grant.findOne({ _id: id, userId: ctx.userId }).populate("accountId").lean();
    if (!grant) return NextResponse.json({ error: "Grant not found" }, { status: 404 });
    return NextResponse.json(grant);
  } catch (e) {
    console.error("Get grant error:", e);
    return NextResponse.json({ error: "Failed to get grant" }, { status: 500 });
  }
});

const UpdateSchema = z.object({
  status: z.enum(["pending", "approved", "disbursed", "rejected"]).optional(),
});

export const PATCH = withProtected(async (req, ctx, routeCtx) => {
  const { id } = await routeCtx.params;
  try {
    const body = await req.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const grant = await Grant.findOneAndUpdate(
      { _id: id, userId: ctx.userId },
      { $set: parsed.data },
      { new: true }
    ).lean();
    if (!grant) return NextResponse.json({ error: "Grant not found" }, { status: 404 });
    return NextResponse.json(grant);
  } catch (e) {
    console.error("Update grant error:", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
});
