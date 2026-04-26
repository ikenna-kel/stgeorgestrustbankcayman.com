import { NextRequest, NextResponse } from "next/server";
import { User } from "@/lib/models";
import { withProtected } from "@/lib/api-middleware";

export const GET = withProtected(async (req, ctx) => {
  try {
    const user = await User.findById(ctx.userId)
      .select("-password -emailVerificationToken")
      .populate("accounts", "accountNumber accountType accountBalance currency accountIcon")
      .populate("cards", "type balance lastFourDigits")
      .lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (e) {
    console.error("Me error:", e);
    return NextResponse.json({ error: "Failed to get profile" }, { status: 500 });
  }
});

export const PATCH = withProtected(async (req, ctx) => {
  try {
    const body = await req.json();
    const allowed = ["firstname", "lastname", "address", "currency", "securityQuestions"];
    const update: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key];
    }
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }
    const user = await User.findByIdAndUpdate(ctx.userId, { $set: update }, { new: true })
      .select("-password -emailVerificationToken")
      .lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (e) {
    console.error("Update me error:", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
});
