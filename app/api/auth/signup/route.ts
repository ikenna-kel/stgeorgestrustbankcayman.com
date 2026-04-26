import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { sendVerificationEmail } from "@/lib/email";

function generateSecureToken(): string {
  const array = new Uint8Array(32);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 32; i++) array[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

const SignupSchema = z.object({
  // Personal Details
  firstname: z.string().min(1).max(100),
  lastname: z.string().min(1).max(100),
  email: z.email(),
  password: z.string().min(6).max(100),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  // Contact Details
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  // Next of Kin
  nextOfKinName: z.string().optional(),
  nextOfKinRelationship: z.string().optional(),
  nextOfKinPhone: z.string().optional(),
  nextOfKinEmail: z.string().optional(),
  nextOfKinAddress: z.string().optional(),
  // KYC
  idType: z.string().optional(),
  idNumber: z.string().optional(),
  ssn: z.string().optional(),
  // PINs
  loginPin: z.string().length(4).regex(/^\d{4}$/),
  transactionPin: z.string().length(4).regex(/^\d{4}$/),
  // Security
  securityQuestions: z
    .array(z.object({ question: z.string(), answer: z.string() }))
    .max(5)
    .optional(),
  currency: z.string().length(3).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = SignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;

    await connectDB();

    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const emailVerificationToken = generateSecureToken();
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const hashedLoginPin = await bcrypt.hash(data.loginPin, 10);
    const hashedTransactionPin = await bcrypt.hash(data.transactionPin, 10);

    const user = await User.create({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      phone: data.phone ?? "",
      dateOfBirth: data.dateOfBirth ?? "",
      gender: data.gender ?? "",
      nationality: data.nationality ?? "",
      address: data.address ?? "",
      city: data.city ?? "",
      state: data.state ?? "",
      zipCode: data.zipCode ?? "",
      country: data.country ?? "",
      nextOfKinName: data.nextOfKinName ?? "",
      nextOfKinRelationship: data.nextOfKinRelationship ?? "",
      nextOfKinPhone: data.nextOfKinPhone ?? "",
      nextOfKinEmail: data.nextOfKinEmail ?? "",
      nextOfKinAddress: data.nextOfKinAddress ?? "",
      idType: data.idType ?? "",
      idNumber: data.idNumber ?? "",
      ssn: data.ssn ?? "",
      loginPin: hashedLoginPin,
      transactionPin: hashedTransactionPin,
      securityQuestions: data.securityQuestions ?? [],
      currency: data.currency ?? "USD",
      emailVerificationToken,
    });

    await sendVerificationEmail(data.email, emailVerificationToken);

    return NextResponse.json({
      message: "Signup successful. Please check your email to verify your account.",
      userId: user._id.toString(),
    });
  } catch (e) {
    console.error("Signup error:", e);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
