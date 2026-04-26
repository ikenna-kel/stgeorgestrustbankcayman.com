import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User, Otp, SiteSettings } from "@/lib/models";
import { generateOtp, getOtpExpiry } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";
import { signToken, createSession } from "@/lib/auth-node";
import { DEFAULT_SITE_KEYS } from "@/lib/models/SiteSettings";
import mongoose from "mongoose";

const BodySchema = z.object({
  email: z.email(),
  purpose: z.enum(["login", "forgot_password"]),
  password: z.string().optional(), // required for login, ignored for forgot_password
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { email, purpose, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    await connectDB();

    if (purpose === "login") {
      // Require a password for login
      if (!password) {
        return NextResponse.json({ error: "Password is required" }, { status: 400 });
      }

      // Fetch user with password field (select:false by default)
      const user = await User.findOne({ email: normalizedEmail }).select("+password");
      if (!user) {
        return NextResponse.json({ error: "No account with this email" }, { status: 404 });
      }

      // Verify the password against the stored hash
      const passwordMatch = await user.comparePassword(password);
      if (!passwordMatch) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      // Check OTP setting — if disabled, log in directly without sending OTP
      const otpSetting = await SiteSettings.findOne({ key: DEFAULT_SITE_KEYS.requireUserOtp });
      const requireOtp = false; // default ON

      if (!requireOtp) {
        // Skip OTP — create session and return token immediately
        const sessionId = new mongoose.Types.ObjectId().toString();
        const token = await signToken(user._id.toString(), user.email, sessionId);
        await createSession(
          user._id,
          token,
          request.headers.get("user-agent") ?? undefined,
          request.headers.get("x-forwarded-for") ?? undefined
        );
        return NextResponse.json({
          token,
          userId: user._id.toString(),
          role: user.role,
          expiresIn: "7d",
          otpRequired: false,
        });
      }

      // OTP is required — fall through to generate and send it
    } else {
      // forgot_password — only need to confirm the account exists
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return NextResponse.json({ error: "No account with this email" }, { status: 404 });
      }
    }

    const code = generateOtp();
    const expiresAt = getOtpExpiry();
    await Otp.findOneAndUpdate(
      { email: normalizedEmail, purpose },
      { code, expiresAt, used: false },
      { upsert: true, new: true }
    );

    const sent = await sendOtpEmail(normalizedEmail, code, purpose);
    if (!sent) {
      return NextResponse.json({ error: "Failed to send OTP email" }, { status: 502 });
    }

    return NextResponse.json({ message: "OTP sent to your email", otpRequired: true });
  } catch (e) {
    console.error("Request OTP error:", e);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
