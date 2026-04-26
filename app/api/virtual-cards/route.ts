import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Account, VirtualCardRequest } from "@/lib/models";
import { withProtected } from "@/lib/api-middleware";

const CreateSchema = z.object({
  accountId: z.string(),
  type: z.enum(["debit", "credit", "prepaid"]),
  description: z.string().optional(),
  currency: z.string().length(3).optional(),
});

export const GET = withProtected(async (req, ctx) => {
  try {
    const requests = await VirtualCardRequest.find({ userId: ctx.userId })
      .populate("accountId", "accountNumber accountType")
      .lean();
    return NextResponse.json(requests);
  } catch (e) {
    console.error("List virtual card requests error:", e);
    return NextResponse.json({ error: "Failed to list virtual card requests" }, { status: 500 });
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
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });

    const created = await VirtualCardRequest.create({
      userId: ctx.userId,
      accountId: account._id,
      type: parsed.data.type,
      description: parsed.data.description,
      currency: parsed.data.currency ?? account.currency ?? "USD",
      status: "pending",
    });

    const populated = await VirtualCardRequest.findById(created._id)
      .populate("accountId", "accountNumber accountType")
      .lean();

    return NextResponse.json(populated);
  } catch (e) {
    console.error("Create virtual card request error:", e);
    return NextResponse.json({ error: "Failed to create virtual card request" }, { status: 500 });
  }
});
