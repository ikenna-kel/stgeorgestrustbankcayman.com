import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { Account, Transaction, User } from "@/lib/models";
import { withProtected } from "@/lib/api-middleware";
import { sendTransactionConfirmationEmail } from "@/lib/email";

const LocalTransferSchema = z.object({
  fromAccountNumber: z.string(),
  toAccountNumber: z.string(),
  amount: z.number().positive(),
  description: z.string().optional(),
  kind: z.enum(["internal", "external"]).optional(),
});

const InternationalTransferSchema = z.object({
  fromAccountNumber: z.string(),
  toAccountNumber: z.string(),
  toAccountCurrency: z.string().length(3),
  amount: z.number().positive(),
  description: z.string().optional(),
  kind: z.enum(["internal", "external"]).optional(),
});

const WireTransferSchema = z.object({
  fromAccountNumber: z.string(),
  amount: z.number().positive(),
  accountName: z.string().min(1),
  accountNumber: z.string().min(1),
  bankName: z.string().min(1),
  bankAddress: z.string().optional(),
  accountType: z.string().optional(),
  country: z.string().optional(),
  swiftCode: z.string().optional(),
  ibanNumber: z.string().optional(),
  note: z.string().optional(),
});

export const POST = withProtected(async (req, ctx) => {
  try {
    const body = await req.json();
    const type = body.type as "local" | "international" | "wire" | undefined;
    const kind = body.kind as "internal" | "external" | undefined;

    const user = await User.findById(ctx.userId).select("firstname lastname email isBlocked transfersDisabled").lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.isBlocked) return NextResponse.json({ error: "Account is blocked" }, { status: 403 });
    if (user.transfersDisabled) return NextResponse.json({ error: "Transfers are disabled for your account" }, { status: 403 });

    // ─── Wire Transfer ───
    if (type === "wire") {
      const parsed = WireTransferSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const data = parsed.data;

      const fromAccount = await Account.findOne({
        accountNumber: data.fromAccountNumber,
        userId: ctx.userId,
      });
      if (!fromAccount) {
        return NextResponse.json({ error: "From account not found" }, { status: 404 });
      }
      if (fromAccount.accountBalance < data.amount) {
        return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
      }

      // Create pending transaction — no balance deduction yet
      const tx = await Transaction.create([
        {
          date: new Date(),
          fromAccount: fromAccount.accountNumber,
          toAccount: data.accountNumber,
          amount: data.amount,
          currency: fromAccount.currency,
          type: "wire",
          status: "pending",
          description: data.note || "Wire Transfer",
          metadata: {
            accountName: data.accountName,
            bankName: data.bankName,
            bankAddress: data.bankAddress,
            accountType: data.accountType,
            country: data.country,
            swiftCode: data.swiftCode,
            ibanNumber: data.ibanNumber,
          },
        },
      ]);

      // Send transaction confirmation email
      const userName = `${user.firstname} ${user.lastname}`;
      const amountFormatted = data.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      await sendTransactionConfirmationEmail(user.email, userName, {
        transactionType: "transfer",
        status: "pending",
        amount: amountFormatted,
        currency: fromAccount.currency,
        fromAccount: fromAccount.accountNumber,
        toAccount: data.accountNumber,
        transactionId: tx[0]._id.toString(),
        date: new Date().toISOString(),
        description: data.note,
        reference: data.accountName,
      }).catch((err) => console.error("Failed to send transaction email:", err));

      return NextResponse.json(tx[0]);
    }

    // ─── Local / International Transfer ───
    const schema = type === "international" ? InternationalTransferSchema : LocalTransferSchema;
    const parsed = schema.safeParse(
      type === "international"
        ? {
          fromAccountNumber: body.fromAccountNumber,
          toAccountNumber: body.toAccountNumber,
          toAccountCurrency: body.toAccountCurrency,
          amount: body.amount,
          description: body.description,
          kind
        }
        : {
          fromAccountNumber: body.fromAccountNumber,
          toAccountNumber: body.toAccountNumber,
          amount: body.amount,
          description: body.description,
          kind
        }
    );
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    const transferKind: "internal" | "external" =
      data.kind ?? (type === "international" ? "external" : "internal");

    const fromAccount = await Account.findOne({
      accountNumber: data.fromAccountNumber,
      userId: ctx.userId,
    });


    if (!fromAccount) {
      return NextResponse.json({ error: "From account not found" }, { status: 404 });
    }
    if (fromAccount.accountBalance < data.amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }
    let toAccount: any
    if (transferKind === "internal") {
      toAccount = await Account.findOne({ accountNumber: data.toAccountNumber });
      if (!toAccount) {
        return NextResponse.json({ error: "To account not found" }, { status: 404 });
      }
    }

    try {
      const tx = await Transaction.create(
        [
          {
            date: new Date(),
            fromAccount: fromAccount.accountNumber,
            toAccount: transferKind === "internal" ? toAccount.accountNumber : data.toAccountNumber,
            amount: data.amount,
            currency: fromAccount.currency,
            type: type === "international" ? "international" : "local",
            status: "completed",
            description: data.description,
          },
        ],
      );
      const t = tx[0];
      await Account.findByIdAndUpdate(
        fromAccount._id,
        {
          $inc: { accountBalance: -data.amount },
          $push: { transactions: t._id },
        },
      );
      if (transferKind === "internal")
        await Account.findByIdAndUpdate(
          toAccount._id,
          {
            $inc: { accountBalance: data.amount },
            $push: { transactions: t._id },
          },
        );

      // Send transaction confirmation email
      const userName = `${user.firstname} ${user.lastname}`;
      const amountFormatted = data.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      await sendTransactionConfirmationEmail(user.email, userName, {
        transactionType: "transfer",
        status: "completed",
        amount: amountFormatted,
        currency: fromAccount.currency,
        fromAccount: fromAccount.accountNumber,
        toAccount: transferKind === "internal" ? toAccount.accountNumber : data.toAccountNumber,
        transactionId: t._id.toString(),
        date: new Date().toISOString(),
        description: data.description,
      }).catch((err) => console.error("Failed to send transaction email:", err));

      return NextResponse.json(t);
    } catch (e) {
      throw e;
    }
  } catch (e) {
    console.error("Transfer error:", e);
    return NextResponse.json({ error: "Transfer failed" }, { status: 500 });
  }
});


export const GET = withProtected(async (req, ctx) => {
  return NextResponse.json({
    Here: 'for real'
  });
});