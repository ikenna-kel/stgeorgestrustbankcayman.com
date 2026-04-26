import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { Account, Transaction, User } from "@/lib/models";
import { withProtected } from "@/lib/api-middleware";

const DepositSchema = z.object({
  accountNumber: z.string(),
  amount: z.number().positive(),
  currency: z.string().length(3).optional(),
  cryptoReference: z.string().optional(),
  description: z.string().optional(),
});

export const POST = withProtected(async (req, ctx) => {
  try {
    const body = await req.json();
    const parsed = DepositSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const user = await User.findById(ctx.userId).select("isBlocked").lean();
    if (user?.isBlocked) return NextResponse.json({ error: "Account is blocked" }, { status: 403 });
    const account = await Account.findOne({
      accountNumber: parsed.data.accountNumber,
      userId: ctx.userId,
    });
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const tx = await Transaction.create(
        [
          {
            date: new Date(),
            fromAccount: "CRYPTO_EXTERNAL",
            toAccount: account.accountNumber,
            amount: parsed.data.amount,
            currency: parsed.data.currency ?? account.currency,
            type: "deposit",
            status: "completed",
            description: parsed.data.description ?? (parsed.data.cryptoReference ? "Crypto deposit" : "Deposit"),
            metadata: parsed.data.cryptoReference ? { cryptoReference: parsed.data.cryptoReference } : undefined,
          },
        ],
        { session }
      );
      const t = tx[0];
      await Account.findByIdAndUpdate(
        account._id,
        {
          $inc: { accountBalance: parsed.data.amount },
          $push: { transactions: t._id },
        },
        { session }
      );
      await session.commitTransaction();
      return NextResponse.json(t);
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  } catch (e) {
    console.error("Deposit error:", e);
    return NextResponse.json({ error: "Deposit failed" }, { status: 500 });
  }
});
