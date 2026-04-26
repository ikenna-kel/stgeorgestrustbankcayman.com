import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Grant, Account } from "@/lib/models";
import { withProtected } from "@/lib/api-middleware";

const CreateSchema = z.object({
  accountId: z.string(),
  amount: z.number().positive(),
  type: z.string().min(1),
  description: z.string().optional(),
  currency: z.string().length(3).optional(),
});

export const GET = withProtected(async (req, ctx) => {
  try {
    const grants = await Grant.find({ userId: ctx.userId }).populate("accountId", "accountNumber accountType").lean();
    return NextResponse.json(grants);
  } catch (e) {
    console.error("List grants error:", e);
    return NextResponse.json({ error: "Failed to list grants" }, { status: 500 });
  }
});

export const POST = withProtected(async (req, ctx) => {
  try {
    const body = await req.json();
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const account = await Account.findOne({ _id: parsed.data.accountId, userId: ctx.userId });
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    const created = await Grant.create({
      userId: ctx.userId,
      accountId: account._id,
      amount: parsed.data.amount,
      type: parsed.data.type,
      description: parsed.data.description,
      currency: parsed.data.currency ?? "USD",
      status: "pending",
    });

    const populated = await Grant.findById(created._id)
      .populate("accountId", "accountNumber accountType")
      .lean();
    return NextResponse.json(populated);
  } catch (e) {
    console.error("Create grant error:", e);
    return NextResponse.json({ error: "Failed to create grant" }, { status: 500 });
  }
});
