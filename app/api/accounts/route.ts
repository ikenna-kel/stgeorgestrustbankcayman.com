import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Account, User } from "@/lib/models";
import { generateAccountNumber } from "@/lib/accountNumber";
import { withProtected } from "@/lib/api-middleware";

const CreateSchema = z.object({
  accountType: z.enum(["savings", "current", "fixed", "domiciliary"]),
  currency: z.string().length(3).optional(),
  accountIcon: z.string().optional(),
});

export const GET = withProtected(async (req, ctx) => {
  try {
    const accounts = await Account.find({ userId: ctx.userId }).populate("transactions", "date amount type status").lean();
    return NextResponse.json(accounts);
  } catch (e) {
    console.error("List accounts error:", e);
    return NextResponse.json({ error: "Failed to list accounts" }, { status: 500 });
  }
});

export const POST = withProtected(async (req, ctx) => {
  try {
    const body = await req.json();
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    let accountNumber = await generateAccountNumber();
    let exists = await Account.findOne({ accountNumber });
    while (exists) {
      accountNumber = await generateAccountNumber();
      exists = await Account.findOne({ accountNumber });
    }

    const account = await Account.create({
      accountNumber,
      accountType: parsed.data.accountType,
      currency: parsed.data.currency ?? "USD",
      accountIcon: parsed.data.accountIcon ?? "wallet",
      userId: ctx.userId,
    });
    await User.findByIdAndUpdate(ctx.userId, { $addToSet: { accounts: account._id } });

    return NextResponse.json(account);
  } catch (e) {
    console.error("Create account error:", e);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
});
