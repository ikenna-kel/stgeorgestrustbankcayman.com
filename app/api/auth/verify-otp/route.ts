import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User, Otp } from "@/lib/models";
import { signToken, createSession } from "@/lib/auth-node";
import mongoose from "mongoose";

const BodySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  purpose: z.enum(["login", "forgot_password"]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { email, code, purpose } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    await connectDB();

    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      purpose: purpose === "forgot_password" ? "forgot_password" : "login",
      used: false,
    });
    if (!otpRecord || otpRecord.code !== code) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }
    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    otpRecord.used = true;
    await otpRecord.save();

    const user = await User.findOne({ email: normalizedEmail }).select("_id email role");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (purpose === "forgot_password") {
      return NextResponse.json({
        message: "OTP verified. Use /api/auth/reset-password with email and newPassword to set password.",
        verified: true,
      });
    }

    const sessionId = new mongoose.Types.ObjectId().toString();
    const token = await signToken(user._id.toString(), user.email, sessionId);
    await createSession(user._id, token, request.headers.get("user-agent") ?? undefined);

    return NextResponse.json({
      token,
      userId: user._id.toString(),
      role: user.role,
      expiresIn: "7d",
    });
  } catch (e) {
    console.error("Verify OTP error:", e);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
