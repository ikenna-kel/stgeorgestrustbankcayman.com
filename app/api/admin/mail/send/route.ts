import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendMail } from "@/lib/email";
import { withAdmin } from "@/lib/api-middleware";

const SingleSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string(),
});

export const POST = withAdmin(async (req, ctx) => {
  try {
    const body = await req.json();
    const parsed = SingleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const sent = await sendMail(
      parsed.data.to,
      parsed.data.subject,
      `<p>${parsed.data.body.replace(/\n/g, "<br>")}</p>`,
      parsed.data.body
    );
    if (!sent) return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
    return NextResponse.json({ message: "Sent", to: parsed.data.to });
  } catch (e) {
    console.error("Admin send mail error:", e);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
});
