import { NextRequest, NextResponse } from "next/server";
import { Account, Transaction } from "@/lib/models";
import { withProtected } from "@/lib/api-middleware";

export const GET = withProtected(async (req, ctx) => {
  try {
    const accounts = await Account.find({ userId: ctx.userId }).select("accountNumber currency").lean();
    const accountNumbers = accounts.map((a) => a.accountNumber);
    const currency = accounts[0]?.currency ?? "USD";

    if (accountNumbers.length === 0) {
      return NextResponse.json({ totalIn: 0, totalOut: 0, net: 0, currency });
    }

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [inAgg] = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: start, $lt: end },
          status: "completed",
          currency,
          toAccount: { $in: accountNumbers },
          fromAccount: { $nin: accountNumbers },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const [outAgg] = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: start, $lt: end },
          status: "completed",
          currency,
          fromAccount: { $in: accountNumbers },
          toAccount: { $nin: accountNumbers },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalIn = typeof inAgg?.total === "number" ? inAgg.total : 0;
    const totalOut = typeof outAgg?.total === "number" ? outAgg.total : 0;
    const net = totalIn - totalOut;

    return NextResponse.json({ totalIn, totalOut, net, currency });
  } catch (e) {
    console.error("Transaction summary error:", e);
    return NextResponse.json({ error: "Failed to compute summary" }, { status: 500 });
  }
});
