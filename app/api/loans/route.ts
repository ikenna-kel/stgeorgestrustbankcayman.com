import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Loan, Account } from "@/lib/models";
import { withProtected } from "@/lib/api-middleware";

const CreateSchema = z.object({
  accountId: z.string(),
  amount: z.number().positive(),
  interestRate: z.number().min(0),
  termMonths: z.number().int().min(1),
  currency: z.string().length(3).optional(),
});

export const GET = withProtected(async (req, ctx) => {
  try {
    const loans = await Loan.find({ userId: ctx.userId }).populate("accountId", "accountNumber accountType").lean();
    return NextResponse.json(loans);
  } catch (e) {
    console.error("List loans error:", e);
    return NextResponse.json({ error: "Failed to list loans" }, { status: 500 });
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
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + parsed.data.termMonths);
    const created = await Loan.create({
      userId: ctx.userId,
      accountId: account._id,
      amount: parsed.data.amount,
      interestRate: parsed.data.interestRate,
      termMonths: parsed.data.termMonths,
      status: "pending",
      remainingBalance: 0,
      currency: parsed.data.currency ?? "USD",
      dueDate,
    });

    const populated = await Loan.findById(created._id)
      .populate("accountId", "accountNumber accountType")
      .lean();
    return NextResponse.json(populated);
  } catch (e) {
    console.error("Create loan error:", e);
    return NextResponse.json({ error: "Failed to create loan" }, { status: 500 });
  }
});
