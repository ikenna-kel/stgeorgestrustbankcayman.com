import { Resend } from "resend";

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}
const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

export async function sendOtpEmail(to: string, code: string, purpose: "login" | "forgot_password"): Promise<boolean> {
  const subject = purpose === "login" ? "Your login code" : "Reset your password";
  const text = purpose === "forgot_password"
    ? `Use this code to reset your password: ${code}. It expires in 10 minutes.`
    : `Your verification code is: ${code}. It expires in 10 minutes.`;

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject,
    text,
  });
  return !error;
}

export async function sendVerificationEmail(to: string, token: string): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const link = `${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject: "Verify your email",
    html: `<p>Click to verify your email: <a href="${link}">${link}</a></p><p>Or copy: ${link}</p>`,
  });
  return !error;
}

export async function sendMail(to: string, subject: string, html: string, text?: string): Promise<boolean> {
  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject,
    html,
    text: text || undefined,
  });
  return !error;
}
