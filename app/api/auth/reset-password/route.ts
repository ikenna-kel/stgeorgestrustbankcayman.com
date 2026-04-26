import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User, Otp } from "@/lib/models";

const BodySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  newPassword: z.string().min(6).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { email, code, newPassword } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    await connectDB();

    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      purpose: "forgot_password",
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

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (e) {
    console.error("Reset password error:", e);
    return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  }
}
