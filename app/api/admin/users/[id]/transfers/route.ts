import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { User } from "@/lib/models";
import { withAdmin } from "@/lib/api-middleware";

const BodySchema = z.object({ disabled: z.boolean() });

export const POST = withAdmin(async (req, ctx, routeCtx) => {
  const { id } = await routeCtx.params;
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = BodySchema.safeParse(body);
    const disabled = parsed.success ? parsed.data.disabled : true;
    const user = await User.findByIdAndUpdate(id, { transfersDisabled: disabled }, { new: true })
      .select("transfersDisabled")
      .lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ message: disabled ? "Transfers disabled" : "Transfers enabled", transfersDisabled: user.transfersDisabled });
  } catch (e) {
    console.error("Admin transfers toggle error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
});
