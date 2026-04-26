import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PaymentProof } from "@/lib/models";
import { withProtected } from "@/lib/api-middleware";

const CreateSchema = z.object({
  fileUrl: z.string().url(),
  fileName: z.string(),
  fileSize: z.number().int().positive(),
  mimeType: z.string(),
  transactionId: z.string().optional(),
});

export const GET = withProtected(async (req, ctx) => {
  try {
    const list = await PaymentProof.find({ userId: ctx.userId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(list);
  } catch (e) {
    console.error("List payment proofs error:", e);
    return NextResponse.json({ error: "Failed to list" }, { status: 500 });
  }
});

export const POST = withProtected(async (req, ctx) => {
  try {
    const body = await req.json();
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const proof = await PaymentProof.create({
      userId: ctx.userId,
      fileUrl: parsed.data.fileUrl,
      fileName: parsed.data.fileName,
      fileSize: parsed.data.fileSize,
      mimeType: parsed.data.mimeType,
      transactionId: parsed.data.transactionId,
      status: "pending",
    });
    return NextResponse.json(proof);
  } catch (e) {
    console.error("Create payment proof error:", e);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
});
