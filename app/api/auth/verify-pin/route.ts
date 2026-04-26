import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { User } from "@/lib/models";
import { withProtected } from "@/lib/api-middleware";

const VerifyPinSchema = z.object({
  pin: z.string().length(4).regex(/^\d{4}$/),
  type: z.enum(["login", "transaction"]),
});

export const POST = withProtected(async (req, ctx) => {
  try {
    const body = await req.json();
    const parsed = VerifyPinSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { pin, type } = parsed.data;

    const user = await User.findById(ctx.userId).select("+loginPin +transactionPin").lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const storedPin = type === "login" ? (user as any).loginPin : (user as any).transactionPin;

    if (!storedPin) {
      // User has no PIN set (legacy account) — skip verification
      return NextResponse.json({ verified: true });
    }

    const valid = pin === storedPin;
    if (!valid) {
      return NextResponse.json(
        { error: type === "login" ? "Invalid login PIN" : "Invalid transaction PIN" },
        { status: 403 }
      );
    }

    return NextResponse.json({ verified: true });
  } catch (e) {
    console.error("Verify PIN error:", e);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
});
