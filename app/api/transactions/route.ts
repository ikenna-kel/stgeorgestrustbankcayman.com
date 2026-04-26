import { NextRequest, NextResponse } from "next/server";
import { Transaction, Account } from "@/lib/models";
import { withProtected } from "@/lib/api-middleware";

export const GET = withProtected(async (req, ctx) => {
  const accountNumber = req.nextUrl.searchParams.get("accountNumber");
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit")) || 50, 100);
  try {
    const userAccountNumbers = (await Account.find({ userId: ctx.userId }).select("accountNumber").lean()).map(
      (a) => a.accountNumber
    );
    type OrFilter = { fromAccount: string } | { toAccount: string } | { fromAccount: { $in: string[] } } | { toAccount: { $in: string[] } };
    const filter: { $or?: OrFilter[] } = {
      $or: [
        { fromAccount: { $in: userAccountNumbers } },
        { toAccount: { $in: userAccountNumbers } },
      ],
    };
    if (accountNumber) {
      if (!userAccountNumbers.includes(accountNumber)) {
        return NextResponse.json({ error: "Account not found" }, { status: 404 });
      }
      filter.$or = [{ fromAccount: accountNumber }, { toAccount: accountNumber }];
    }
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .limit(limit)
      .lean();
    return NextResponse.json(transactions);
  } catch (e) {
    console.error("List transactions error:", e);
    return NextResponse.json({ error: "Failed to list transactions" }, { status: 500 });
  }
});
