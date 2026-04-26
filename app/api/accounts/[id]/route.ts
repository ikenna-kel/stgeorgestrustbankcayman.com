import { NextRequest, NextResponse } from "next/server";
import { Account, User } from "@/lib/models";
import { withProtected } from "@/lib/api-middleware";

export const GET = withProtected(async (req, ctx, routeCtx) => {
  const { id } = await routeCtx.params;
  try {
    const account = await Account.findOne({ _id: id, userId: ctx.userId })
      .populate("transactions")
      .populate('users', "lastname fristname")
      .lean();
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });
    return NextResponse.json(account);
  } catch (e) {
    console.error("Get account error:", e);
    return NextResponse.json({ error: "Failed to get account" }, { status: 500 });
  }
});

export const PATCH = withProtected(async (req, ctx, routeCtx) => {
  const { id } = await routeCtx.params;
  try {
    const body = await req.json();
    const allowed = ["accountIcon", "currency"];
    const update: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key];
    }
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }
    const account = await Account.findOneAndUpdate(
      { _id: id, userId: ctx.userId },
      { $set: update },
      { returnDocument: 'after' }
    ).lean();
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });
    return NextResponse.json(account);
  } catch (e) {
    console.error("Update account error:", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
});

export const DELETE = withProtected(async (req, ctx, routeCtx) => {
  const { id } = await routeCtx.params;
  try {
    const account = await Account.findOne({ _id: id, userId: ctx.userId });
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });
    if (account.accountBalance !== 0) {
      return NextResponse.json({ error: "Cannot delete account with non-zero balance" }, { status: 400 });
    }
    await Account.findByIdAndDelete(id);
    await User.findByIdAndUpdate(ctx.userId, { $pull: { accounts: id } });
    return NextResponse.json({ message: "Account deleted" });
  } catch (e) {
    console.error("Delete account error:", e);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
});
