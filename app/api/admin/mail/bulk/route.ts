import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendMail } from "@/lib/email";
import { withAdmin } from "@/lib/api-middleware";

const BulkSchema = z.object({
  recipients: z.array(z.string().email()).min(1).max(500),
  subject: z.string().min(1),
  body: z.string(),
});

export const POST = withAdmin(async (req, ctx) => {
  try {
    const body = await req.json();
    const parsed = BulkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const html = `<p>${parsed.data.body.replace(/\n/g, "<br>")}</p>`;
    const results: { to: string; ok: boolean }[] = [];
    for (const to of parsed.data.recipients) {
      const ok = await sendMail(to, parsed.data.subject, html, parsed.data.body);
      results.push({ to, ok });
    }
    const failed = results.filter((r) => !r.ok);
    return NextResponse.json({
      message: `Sent to ${results.length - failed.length}/${results.length}`,
      total: results.length,
      success: results.length - failed.length,
      failed: failed.length,
      failedRecipients: failed.map((r) => r.to),
    });
  } catch (e) {
    console.error("Admin bulk mail error:", e);
    return NextResponse.json({ error: "Bulk send failed" }, { status: 500 });
  }
});
