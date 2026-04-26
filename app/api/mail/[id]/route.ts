import { NextRequest, NextResponse } from "next/server";
import { Mail } from "@/lib/models";
import { withProtected } from "@/lib/api-middleware";

export const GET = withProtected(async (req, ctx, routeCtx) => {
  const { id } = await routeCtx.params;
  try {
    const mail = await Mail.findOneAndUpdate(
      { _id: id, userId: ctx.userId },
      { $set: { read: true } },
      { new: true }
    ).lean();
    if (!mail) return NextResponse.json({ error: "Mail not found" }, { status: 404 });
    return NextResponse.json(mail);
  } catch (e) {
    console.error("Get mail error:", e);
    return NextResponse.json({ error: "Failed to get mail" }, { status: 500 });
  }
});
