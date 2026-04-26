import { NextRequest, NextResponse } from "next/server";
import { Card } from "@/lib/models";
import { withProtected } from "@/lib/api-middleware";

export const GET = withProtected(async (req, ctx, routeCtx) => {
  const { id } = await routeCtx.params;
  try {
    const card = await Card.findOne({ _id: id, userId: ctx.userId }).populate("accountId").populate("transactions").lean();
    if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });
    return NextResponse.json(card);
  } catch (e) {
    console.error("Get card error:", e);
    return NextResponse.json({ error: "Failed to get card" }, { status: 500 });
  }
});

export const DELETE = withProtected(async (req, ctx, routeCtx) => {
  const { id } = await routeCtx.params;
  try {
    const card = await Card.findOne({ _id: id, userId: ctx.userId });
    if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });
    await Card.findByIdAndDelete(id);
    return NextResponse.json({ message: "Card deleted" });
  } catch (e) {
    console.error("Delete card error:", e);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
});
