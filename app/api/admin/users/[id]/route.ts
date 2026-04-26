import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { User, Account, Card, Loan, Grant } from "@/lib/models";
import { deleteAllSessionsForUser } from "@/lib/auth-node";
import { withAdmin } from "@/lib/api-middleware";

const UpdateUserSchema = z.object({
  firstname: z.string().min(1).optional(),
  lastname: z.string().min(1).optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  currency: z.string().length(3).optional(),
  role: z.enum(["user", "admin"]).optional(),
  isEmailVerified: z.boolean().optional(),
  isBlocked: z.boolean().optional(),
  transfersDisabled: z.boolean().optional(),
  securityQuestions: z.array(z.object({ question: z.string(), answer: z.string() })).max(5).optional(),
});

export const GET = withAdmin(async (req, ctx, routeCtx) => {
  const { id } = await routeCtx.params;
  try {
    const user = await User.findById(id)
      .select("-password -emailVerificationToken")
      .populate("accounts", "accountNumber accountType accountBalance currency")
      .populate("cards", "type balance lastFourDigits")
      .lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (e) {
    console.error("Admin get user error:", e);
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
  }
});

export const PATCH = withAdmin(async (req, ctx, routeCtx) => {
  const { id } = await routeCtx.params;
  try {
    const body = await req.json();
    const parsed = UpdateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const data = { ...parsed.data };
    if (data.email) data.email = data.email.toLowerCase();
    if (data.isEmailVerified === true) {
      const user = await User.findByIdAndUpdate(
        id,
        { $set: data, $unset: { emailVerificationToken: 1 } },
        { new: true }
      )
        .select("-password -emailVerificationToken")
        .lean();
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      return NextResponse.json(user);
    }
    const user = await User.findByIdAndUpdate(id, { $set: data }, { new: true })
      .select("-password -emailVerificationToken")
      .lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (e) {
    console.error("Admin update user error:", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
});

export const DELETE = withAdmin(async (req, ctx, routeCtx) => {
  const { id } = await routeCtx.params;
  try {
    const user = await User.findById(id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return NextResponse.json({ error: "Cannot delete the last admin" }, { status: 400 });
      }
    }
    await deleteAllSessionsForUser(user._id);
    await Account.deleteMany({ userId: id });
    await Card.deleteMany({ userId: id });
    await Loan.deleteMany({ userId: id });
    await Grant.deleteMany({ userId: id });
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "User deleted" });
  } catch (e) {
    console.error("Admin delete user error:", e);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
});
