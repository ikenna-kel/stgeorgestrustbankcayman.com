import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Account, User } from "@/lib/models";
import { generateAccountNumber } from "@/lib/accountNumber";
import { withAdmin } from "@/lib/api-middleware";

const CreateSchema = z.object({
  userId: z.string(),
  accountType: z.enum(["savings", "current", "fixed", "domiciliary"]),
  currency: z.string().length(3).optional(),
  accountIcon: z.string().optional(),
  initialBalance: z.number().min(0).optional(),
});

export const GET = withAdmin(async (req, ctx) => {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const filter = userId ? { userId } : {};
    const accounts = await Account.find(filter).populate("userId", "email firstname lastname").sort({ createdAt: -1 }).lean();
    return NextResponse.json(accounts);
  } catch (e) {
    console.error("Admin list accounts error:", e);
    return NextResponse.json({ error: "Failed to list" }, { status: 500 });
  }
});

export const POST = withAdmin(async (req, ctx) => {
  try {
    const body = await req.json();
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const user = await User.findById(parsed.data.userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
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
      userId: user._id,
      accountBalance: parsed.data.initialBalance ?? 0,
    });
    await User.findByIdAndUpdate(user._id, { $addToSet: { accounts: account._id } });
    return NextResponse.json(account);
  } catch (e) {
    console.error("Admin create account error:", e);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
});
