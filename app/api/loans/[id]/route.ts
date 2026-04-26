import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Loan } from "@/lib/models";
import { withProtected } from "@/lib/api-middleware";

export const GET = withProtected(async (req, ctx, routeCtx) => {
  const { id } = await routeCtx.params;
  try {
    const loan = await Loan.findOne({ _id: id, userId: ctx.userId }).populate("accountId").lean();
    if (!loan) return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    return NextResponse.json(loan);
  } catch (e) {
    console.error("Get loan error:", e);
    return NextResponse.json({ error: "Failed to get loan" }, { status: 500 });
  }
});

const UpdateSchema = z.object({
  status: z.enum(["pending", "approved", "disbursed", "active", "repaid", "rejected", "defaulted"]).optional(),
});

export const PATCH = withProtected(async (req, ctx, routeCtx) => {
  const { id } = await routeCtx.params;
  try {
    const body = await req.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const loan = await Loan.findOneAndUpdate(
      { _id: id, userId: ctx.userId },
      { $set: parsed.data },
      { new: true }
    ).lean();
    if (!loan) return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    return NextResponse.json(loan);
  } catch (e) {
    console.error("Update loan error:", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
});
