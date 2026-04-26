import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Mail, User } from "@/lib/models";
import { sendMail } from "@/lib/email";
import { withProtected } from "@/lib/api-middleware";

const SendSchema = z.object({
  to: z.email(),
  subject: z.string().min(1),
  body: z.string(),
});

export const GET = withProtected(async (req, ctx) => {
  const direction = req.nextUrl.searchParams.get("direction") as "inbound" | "outbound" | null;
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit")) || 50, 100);
  try {
    const filter = { userId: ctx.userId };
    if (direction === "inbound" || direction === "outbound") {
      (filter as Record<string, string>).direction = direction;
    }
    const mails = await Mail.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
    return NextResponse.json(mails);
  } catch (e) {
    console.error("List mail error:", e);
    return NextResponse.json({ error: "Failed to list mail" }, { status: 500 });
  }
});

export const POST = withProtected(async (req, ctx) => {
  try {
    const body = await req.json();
    const parsed = SendSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const user = await User.findById(ctx.userId).select("email").lean();
    const fromEmail = user?.email ?? "noreply@bank.com";
    const sent = await sendMail(
      parsed.data.to,
      parsed.data.subject,
      `<p>${parsed.data.body.replace(/\n/g, "<br>")}</p>`,
      parsed.data.body
    );
    if (!sent) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
    }
    const mail = await Mail.create({
      userId: ctx.userId,
      direction: "outbound",
      from: fromEmail,
      to: parsed.data.to,
      subject: parsed.data.subject,
      body: parsed.data.body,
    });
    return NextResponse.json(mail);
  } catch (e) {
    console.error("Send mail error:", e);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
});
