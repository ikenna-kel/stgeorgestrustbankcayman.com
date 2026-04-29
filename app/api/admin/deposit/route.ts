import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Transaction, Account, User } from "@/lib/models";
import { withAdmin } from "@/lib/api-middleware";
import { sendTransactionConfirmationEmail } from "@/lib/email";

const DepositSchema = z.object({
  targetUserId: z.string().min(1),
  targetAccountId: z.string().min(1),
  amount: z.number().positive(),
  operation: z.enum(["add", "replace"]),
});

export const POST = withAdmin(async (req, ctx) => {
  try {
    const body = await req.json();
    const parsed = DepositSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;

    // Fetch user
    const user = await User.findById(data.targetUserId).select(
      "firstname lastname email"
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch account
    const account = await Account.findById(data.targetAccountId);
    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    // Verify account belongs to user
    if (account.userId.toString() !== data.targetUserId) {
      return NextResponse.json(
        { error: "Account does not belong to this user" },
        { status: 403 }
      );
    }

    // Calculate new balance
    const newBalance =
      data.operation === "add"
        ? account.accountBalance + data.amount
        : data.amount;

    // Create transaction record
    const tx = await Transaction.create({
      date: new Date(),
      fromAccount: "DEPOSIT", // System deposit marker
      toAccount: account.accountNumber,
      amount: data.amount,
      currency: account.currency,
      type: "deposit",
      status: "completed",
      description: `Deposit by admin (${data.operation === "add" ? "Added to" : "Set to"} balance)`,
      metadata: {
        adminDepositType: data.operation,
        oldBalance: account.accountBalance,
        newBalance: newBalance,
      },
    });

    // Update account balance and link transaction
    await Account.findByIdAndUpdate(account._id, {
      accountBalance: newBalance,
      $push: { transactions: tx._id },
    });

    // Send confirmation email
    const userName = `${user.firstname} ${user.lastname}`;
    const amountFormatted = data.amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    await sendTransactionConfirmationEmail(user.email, userName, {
      transactionType: "deposit",
      status: "completed",
      amount: amountFormatted,
      currency: account.currency,
      fromAccount: "ADMIN_SYSTEM",
      toAccount: account.accountNumber,
      transactionId: tx._id.toString(),
      date: new Date().toISOString(),
      description: `Deposit ${
        data.operation === "add" ? "added to" : "set to"
      } account`,
    }).catch((err) =>
      console.error("Failed to send deposit confirmation email:", err)
    );

    return NextResponse.json({
      message: "Deposit created successfully",
      transaction: tx,
      newBalance,
    });
  } catch (e) {
    console.error("Admin deposit error:", e);
    return NextResponse.json({ error: "Deposit failed" }, { status: 500 });
  }
});
