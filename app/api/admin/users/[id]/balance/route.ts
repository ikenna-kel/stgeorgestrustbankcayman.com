import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Account } from "@/lib/models";
import { withAdmin } from "@/lib/api-middleware";

const BodySchema = z.object({
  accountId: z.string().optional(),
  accountNumber: z.string().optional(),
  newBalance: z.number().min(0),
}).refine((d) => d.accountId || d.accountNumber, { message: "Provide accountId or accountNumber" });

export const PATCH = withAdmin(async (req, ctx, routeCtx) => {
  const { id: userId } = await routeCtx.params;
  try {
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const filter: Record<string, unknown> = { userId };
    if (parsed.data.accountId) filter._id = parsed.data.accountId;
    else if (parsed.data.accountNumber) filter.accountNumber = parsed.data.accountNumber;
    const account = await Account.findOneAndUpdate(
      filter,
      { $set: { accountBalance: parsed.data.newBalance } },
      { new: true }
    ).lean();
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });
    return NextResponse.json(account);
  } catch (e) {
    console.error("Admin set balance error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
});
