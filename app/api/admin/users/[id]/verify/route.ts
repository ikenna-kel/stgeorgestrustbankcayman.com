import { NextRequest, NextResponse } from "next/server";
import { User } from "@/lib/models";
import { withAdmin } from "@/lib/api-middleware";

export const POST = withAdmin(async (req, ctx, routeCtx) => {
  const { id } = await routeCtx.params;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { isEmailVerified: true }, $unset: { emailVerificationToken: 1 } },
      { new: true }
    )
      .select("-password -emailVerificationToken")
      .lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (e) {
    console.error("Admin verify user error:", e);
    return NextResponse.json({ error: "Verify failed" }, { status: 500 });
  }
});
