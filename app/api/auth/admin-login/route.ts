import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { signToken, createSession } from "@/lib/auth-node";
import mongoose from "mongoose";

const BodySchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = BodySchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const { email, password } = parsed.data;
        const normalizedEmail = email.toLowerCase().trim();

        await connectDB();

        // Fetch user with password (select:false by default)
        const user = await User.findOne({ email: normalizedEmail }).select("+password");
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Must be an admin
        if (user.role !== "admin") {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Create session and return token directly — no OTP for admins
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
        });
    } catch (e) {
        console.error("Admin login error:", e);
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}
