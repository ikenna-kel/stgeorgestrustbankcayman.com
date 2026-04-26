import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { Transaction, Account } from "@/lib/models";
import { withAdmin } from "@/lib/api-middleware";

const CreateTxSchema = z.object({
  fromAccount: z.string(),
  toAccount: z.string(),
  amount: z.number().positive(),
  currency: z.string().length(3).optional(),
  type: z.enum(["local", "international", "wire", "deposit", "withdrawal", "card", "loan", "grant"]).optional(),
  description: z.string().optional(),
  updateBalances: z.boolean().optional(),
});

export const GET = withAdmin(async (req, ctx) => {
  try {
    const limit = Math.min(100, Math.max(1, Number(req.nextUrl.searchParams.get("limit")) || 50));
    const status = req.nextUrl.searchParams.get("status") ?? "";
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    const transactions = await Transaction.find(filter).sort({ date: -1 }).limit(limit).lean();
    return NextResponse.json(transactions);
  } catch (e) {
    console.error("Admin list transactions error:", e);
    return NextResponse.json({ error: "Failed to list" }, { status: 500 });
  }
});

export const POST = withAdmin(async (req, ctx) => {
  try {
    const body = await req.json();
    const parsed = CreateTxSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const updateBalances = parsed.data.updateBalances !== false;
    const fromAccount = await Account.findOne({ accountNumber: parsed.data.fromAccount });
    const toAccount = await Account.findOne({ accountNumber: parsed.data.toAccount });
    if (!fromAccount) return NextResponse.json({ error: "From account not found" }, { status: 404 });
    if (!toAccount) return NextResponse.json({ error: "To account not found" }, { status: 404 });
    if (updateBalances && fromAccount.accountBalance < parsed.data.amount) {
      return NextResponse.json({ error: "Insufficient balance in from account" }, { status: 400 });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const tx = await Transaction.create(
        [
          {
            date: new Date(),
            fromAccount: parsed.data.fromAccount,
            toAccount: parsed.data.toAccount,
            amount: parsed.data.amount,
            currency: parsed.data.currency ?? fromAccount.currency,
            type: parsed.data.type ?? "local",
            status: "completed",
            description: parsed.data.description,
          },
        ],
        { session }
      );
      const t = tx[0];
      if (updateBalances) {
        await Account.findByIdAndUpdate(fromAccount._id, {
          $inc: { accountBalance: -parsed.data.amount },
          $push: { transactions: t._id },
        }, { session });
        await Account.findByIdAndUpdate(toAccount._id, {
          $inc: { accountBalance: parsed.data.amount },
          $push: { transactions: t._id },
        }, { session });
      }
      await session.commitTransaction();
      return NextResponse.json(t);
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  } catch (e) {
    console.error("Admin create transaction error:", e);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
});
