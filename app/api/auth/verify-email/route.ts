import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }
  try {
    await connectDB();
    const user = await User.findOneAndUpdate(
      { emailVerificationToken: token },
      { $set: { isEmailVerified: true }, $unset: { emailVerificationToken: 1 } },
      { new: true }
    );
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired verification link" }, { status: 400 });
    }
    return NextResponse.json({ message: "Email verified successfully" });
  } catch (e) {
    console.error("Verify email error:", e);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
