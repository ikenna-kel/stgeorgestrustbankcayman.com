import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Transaction, Account } from "@/lib/models";
import { withAdmin } from "@/lib/api-middleware";

const UpdateSchema = z.object({
  status: z.enum(["pending", "completed", "failed", "reversed"]).optional(),
});

export const GET = withAdmin(async (req, ctx, routeCtx) => {
  const { id } = await routeCtx.params;
  try {
    const tx = await Transaction.findById(id).lean();
    if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    return NextResponse.json(tx);
  } catch (e) {
    console.error("Admin get transaction error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
});

export const PATCH = withAdmin(async (req, ctx, routeCtx) => {
  const { id } = await routeCtx.params;
  try {
    const body = await req.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const existingTx = await Transaction.findById(id);
    if (!existingTx) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

    // If approving a pending wire transfer, deduct the balance
    if (
      parsed.data.status === "completed" &&
      existingTx.status === "pending" &&
      existingTx.type === "wire"
    ) {
      const fromAccount = await Account.findOne({ accountNumber: existingTx.fromAccount });
      if (!fromAccount) {
        return NextResponse.json({ error: "From account not found" }, { status: 404 });
      }
      if (fromAccount.accountBalance < existingTx.amount) {
        return NextResponse.json({ error: "Insufficient balance in sender account" }, { status: 400 });
      }
      // Deduct balance and push transaction
      await Account.findByIdAndUpdate(fromAccount._id, {
        $inc: { accountBalance: -existingTx.amount },
        $push: { transactions: existingTx._id },
      });
    }

    const tx = await Transaction.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
    return NextResponse.json(tx);
  } catch (e) {
    console.error("Admin update transaction error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
});
