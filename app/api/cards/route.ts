import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Card, Account, User } from "@/lib/models";
import { generateLastFourDigits } from "@/lib/accountNumber";
import { withProtected } from "@/lib/api-middleware";

const CreateSchema = z.object({
  type: z.enum(["debit", "credit", "prepaid"]),
  accountId: z.string(),
});

export const GET = withProtected(async (req, ctx) => {
  try {
    const cards = await Card.find({ userId: ctx.userId }).populate("accountId", "accountNumber accountType").lean();
    return NextResponse.json(cards);
  } catch (e) {
    console.error("List cards error:", e);
    return NextResponse.json({ error: "Failed to list cards" }, { status: 500 });
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
    const lastFourDigits = generateLastFourDigits();
    const card = await Card.create({
      type: parsed.data.type,
      accountId: account._id,
      userId: ctx.userId,
      lastFourDigits,
      balance: parsed.data.type === "credit" ? 0 : account.accountBalance,
    });
    await User.findByIdAndUpdate(ctx.userId, { $addToSet: { cards: card._id } });
    return NextResponse.json(card);
  } catch (e) {
    console.error("Create card error:", e);
    return NextResponse.json({ error: "Failed to create card" }, { status: 500 });
  }
});
