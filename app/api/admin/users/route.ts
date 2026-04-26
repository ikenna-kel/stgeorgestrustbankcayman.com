import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { User } from "@/lib/models";
import { withAdmin } from "@/lib/api-middleware";

const CreateUserSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  address: z.string().optional(),
  currency: z.string().length(3).optional(),
  role: z.enum(["user", "admin"]).optional(),
  isEmailVerified: z.boolean().optional(),
});

export const GET = withAdmin(async (req, ctx) => {
  try {
    const page = Math.max(1, Number(req.nextUrl.searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.nextUrl.searchParams.get("limit")) || 20));
    const skip = (page - 1) * limit;
    const search = req.nextUrl.searchParams.get("search") ?? "";
    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { email: new RegExp(search, "i") },
        { firstname: new RegExp(search, "i") },
        { lastname: new RegExp(search, "i") },
      ];
    }
    const [users, total] = await Promise.all([
      User.find(filter).select("-password -emailVerificationToken").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);
    return NextResponse.json({ users, total, page, limit });
  } catch (e) {
    console.error("Admin list users error:", e);
    return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
  }
});

export const POST = withAdmin(async (req, ctx) => {
  try {
    const body = await req.json();
    const parsed = CreateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const existing = await User.findOne({ email: parsed.data.email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(parsed.data.password, 12);
    const user = await User.create({
      firstname: parsed.data.firstname,
      lastname: parsed.data.lastname,
      email: parsed.data.email.toLowerCase(),
      password: hashedPassword,
      address: parsed.data.address ?? "",
      currency: parsed.data.currency ?? "USD",
      role: parsed.data.role ?? "user",
      isEmailVerified: parsed.data.isEmailVerified ?? false,
    });
    const u = user.toObject() as unknown as Record<string, unknown>;
    delete u.password;
    delete u.emailVerificationToken;
    return NextResponse.json(u);
  } catch (e) {
    console.error("Admin create user error:", e);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
});
