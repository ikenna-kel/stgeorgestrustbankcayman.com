import { Resend } from "resend";

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}
const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";
const BANK_NAME = "St. Georges Trust Bank Cayman";
const BANK_WEBSITE = "https://stgeorgestrustbankcayman.com";
const LOGO_URL = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/logo.png`;

// Color scheme matching brand
const COLORS = {
  primary: "#0B2D72",
  secondary: "#0992C2",
  accent: "#0AC4E0",
  warm: "#F6E7BC",
  dark: "#171717",
  lightText: "#6E788A",
  border: "#E8ECF3",
  bgLight: "#F9FAFB",
};

function getEmailTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${BANK_NAME}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #f5f5f5;
          color: ${COLORS.dark};
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, ${COLORS.primary} 0%, #244790 100%);
          padding: 32px 24px;
          text-align: center;
          color: white;
        }
        .header-logo {
          width: 50px;
          height: 50px;
          margin-bottom: 12px;
          display: inline-block;
        }
        .header-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
          letter-spacing: -0.5px;
        }
        .header-subtitle {
          font-size: 13px;
          opacity: 0.9;
          font-weight: 500;
        }
        .content {
          padding: 32px 24px;
        }
        .welcome-heading {
          font-size: 22px;
          font-weight: 700;
          color: ${COLORS.primary};
          margin-bottom: 16px;
        }
        .transaction-heading {
          font-size: 20px;
          font-weight: 700;
          color: ${COLORS.primary};
          margin-bottom: 24px;
        }
        .text {
          font-size: 15px;
          color: ${COLORS.dark};
          margin-bottom: 12px;
          line-height: 1.7;
        }
        .status-badge {
          display: inline-block;
          background-color: #ECFDF5;
          color: #047857;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 24px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 24px 0;
          padding: 20px;
          background-color: ${COLORS.bgLight};
          border-radius: 8px;
          border: 1px solid ${COLORS.border};
        }
        .info-item {
          display: flex;
          flex-direction: column;
        }
        .info-label {
          font-size: 12px;
          color: ${COLORS.lightText};
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }
        .info-value {
          font-size: 15px;
          font-weight: 600;
          color: ${COLORS.primary};
          word-break: break-word;
        }
        .info-value-dark {
          color: ${COLORS.dark};
        }
        .full-width {
          grid-column: 1 / -1;
        }
        .amount {
          font-size: 32px;
          font-weight: 700;
          color: ${COLORS.secondary};
          margin: 16px 0;
          text-align: center;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid ${COLORS.border};
          font-size: 14px;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          color: ${COLORS.lightText};
          font-weight: 500;
        }
        .detail-value {
          color: ${COLORS.dark};
          font-weight: 600;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
          color: white;
          padding: 12px 32px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          margin: 24px 0;
          text-align: center;
          width: 100%;
          box-sizing: border-box;
        }
        .cta-button:hover {
          opacity: 0.95;
          text-decoration: none;
        }
        .divider {
          height: 1px;
          background-color: ${COLORS.border};
          margin: 24px 0;
        }
        .section-title {
          font-size: 14px;
          font-weight: 700;
          color: ${COLORS.primary};
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
          margin-top: 24px;
        }
        .highlight-box {
          background: linear-gradient(135deg, ${COLORS.accent}15 0%, ${COLORS.secondary}10 100%);
          border-left: 4px solid ${COLORS.secondary};
          padding: 16px;
          border-radius: 6px;
          margin: 16px 0;
          font-size: 14px;
          color: ${COLORS.dark};
        }
        .footer {
          background-color: ${COLORS.bgLight};
          padding: 24px;
          text-align: center;
          border-top: 1px solid ${COLORS.border};
          font-size: 12px;
          color: ${COLORS.lightText};
        }
        .footer-link {
          color: ${COLORS.secondary};
          text-decoration: none;
        }
        .footer-link:hover {
          text-decoration: underline;
        }
        .center {
          text-align: center;
        }
        @media (max-width: 600px) {
          .info-grid {
            grid-template-columns: 1fr;
          }
          .header {
            padding: 24px 16px;
          }
          .content {
            padding: 24px 16px;
          }
          .welcome-heading,
          .transaction-heading {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        ${content}
      </div>
    </body>
    </html>
  `;
}

function getWelcomeEmailContent(userName: string): string {
  return `
    <div class="header">
      <img src="${LOGO_URL}" alt="Logo" class="header-logo">
      <div class="header-title">${BANK_NAME}</div>
      <div class="header-subtitle">Welcome to the Future of Banking</div>
    </div>
    
    <div class="content">
      <div class="welcome-heading">Welcome to ${BANK_NAME}! 🎉</div>
      
      <p class="text">Dear ${userName},</p>
      
      <p class="text">
        Thank you for joining us! Your account has been successfully created, and we're thrilled to have you as part of our banking family.
      </p>
      
      <div class="highlight-box">
        <strong>Your account is ready to use!</strong> You can now access all our premium banking services including transfers, payments, loans, and much more.
      </div>
      
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Account Status</div>
          <div class="info-value info-value-dark">Active ✓</div>
        </div>
        <div class="info-item">
          <div class="info-label">Access Level</div>
          <div class="info-value info-value-dark">Full</div>
        </div>
      </div>
      
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard" class="cta-button">Access Your Dashboard</a>
      
      <div class="section-title">What You Can Do Now</div>
      
      <div class="detail-row">
        <span class="detail-label">💳 Make Transfers</span>
        <span class="detail-value">Local & International</span>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">💰 Make Payments</span>
        <span class="detail-value">Bills & Subscriptions</span>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">🎁 Virtual Cards</span>
        <span class="detail-value">Instant & Secure</span>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">💳 Apply for Loans</span>
        <span class="detail-value">Quick & Easy</span>
      </div>
      
      <div class="divider"></div>
      
      <p class="text"><strong>Security Tips:</strong></p>
      <ul style="margin: 12px 0; margin-left: 20px; color: ${COLORS.dark}; font-size: 14px; line-height: 1.8;">
        <li>Never share your password with anyone</li>
        <li>Always verify emails from our official domain</li>
        <li>Enable two-factor authentication in settings</li>
        <li>Review transactions regularly</li>
      </ul>
      
      <p class="text" style="margin-top: 24px;">
        If you have any questions or need assistance, our support team is available 24/7. Simply visit the support section in your dashboard or email us.
      </p>
      
      <p class="text">
        Best regards,<br>
        <strong>${BANK_NAME} Team</strong>
      </p>
    </div>
    
    <div class="footer">
      <p style="margin-bottom: 12px;">© 2024 ${BANK_NAME}. All rights reserved.</p>
      <p>
        <a href="${BANK_WEBSITE}" class="footer-link">Visit Website</a> | 
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/settings" class="footer-link">Account Settings</a> | 
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/support-ticket" class="footer-link">Support</a>
      </p>
    </div>
  `;
}

function getTransactionConfirmationContent(data: {
  userName: string;
  transactionType: "transfer" | "payment" | "deposit" | "withdrawal";
  status: "completed" | "pending" | "failed";
  amount: string;
  currency: string;
  fromAccount: string;
  toAccount: string;
  transactionId: string;
  date: string;
  description?: string;
  reference?: string;
}): string {
  const statusConfig = {
    completed: { color: "#ECFDF5", textColor: "#047857", label: "COMPLETED", icon: "✓" },
    pending: { color: "#FEF3C7", textColor: "#92400E", label: "PENDING", icon: "⏳" },
    failed: { color: "#FEE2E2", textColor: "#991B1B", label: "FAILED", icon: "✕" },
  };

  const statusInfo = statusConfig[data.status];

  const transactionTypeConfig = {
    transfer: "Fund Transfer",
    payment: "Payment",
    deposit: "Deposit",
    withdrawal: "Withdrawal",
  };

  return `
    <div class="header">
      <img src="${LOGO_URL}" alt="Logo" class="header-logo">
      <div class="header-title">${BANK_NAME}</div>
      <div class="header-subtitle">Transaction Confirmation</div>
    </div>
    
    <div class="content">
      <div class="center">
        <div class="status-badge" style="background-color: ${statusInfo.color}; color: ${statusInfo.textColor};">
          ${statusInfo.icon} ${statusInfo.label}
        </div>
      </div>
      
      <div class="transaction-heading">Transaction ${data.status === "completed" ? "Confirmed" : "Notification"}</div>
      
      <p class="text">Dear ${data.userName},</p>
      
      <p class="text">
        Your ${transactionTypeConfig[data.transactionType]} request has been successfully processed.
        ${data.status === "pending" ? "We will complete the transaction shortly." : data.status === "failed" ? "Unfortunately, the transaction could not be completed." : ""}
      </p>
      
      <div class="amount">${data.currency} ${data.amount}</div>
      
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Transaction Type</div>
          <div class="info-value info-value-dark">${" "} ${transactionTypeConfig[data.transactionType]}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Transaction ID</div>
          <div class="info-value info-value-dark">${" "} ${data.transactionId}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Date & Time</div>
          <div class="info-value info-value-dark">${" "}  ${new Date(data.date).toLocaleString()}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Status</div>
          <div class="info-value info-value-dark" style="color: ${statusInfo.textColor};">${" "} ${statusInfo.label}</div>
        </div>
      </div>
      
      <div class="section-title">Transaction Details</div>
      
      <div class="detail-row">
        <span class="detail-label">From Account</span>
        <span class="detail-value">${" "} ${data.fromAccount}</span>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">To Account</span>
        <span class="detail-value">${" "} ${data.toAccount}</span>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">Amount</span>
        <span class="detail-value">${" "} ${data.currency} ${data.amount}</span>
      </div>
      
      ${data.description ? `
      <div class="detail-row">
        <span class="detail-label">Description</span>
        <span class="detail-value">${" "} ${data.description}</span>
      </div>
      ` : ""}
      
      ${data.reference ? `
      <div class="detail-row">
        <span class="detail-label">Reference</span>
        <span class="detail-value">${" "} ${data.reference}</span>
      </div>
      ` : ""}
      
      ${data.status === "failed" ? `
      <div class="highlight-box" style="border-left-color: #DC2626; background: #FEE2E2; color: #991B1B;">
        <strong>Transaction Failed</strong><br>
        If you believe this is an error or need assistance, please contact our support team immediately.
      </div>
      ` : data.status === "pending" ? `
      <div class="highlight-box" style="border-left-color: #F59E0B; background: #FEF3C7; color: #92400E;">
        <strong>Processing Transaction</strong><br>
        Your transaction is being processed. This usually takes a few minutes to a few hours.
      </div>
      ` : `
      <div class="highlight-box">
        <strong>Transaction Complete!</strong><br>
        Your transaction has been completed successfully. You can view more details in your account dashboard.
      </div>
      `}
      
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/transactions" class="cta-button">View All Transactions</a>
      
      <p class="text" style="font-size: 13px; color: ${COLORS.lightText}; margin-top: 24px;">
        If you did not authorize this transaction or have any questions, please contact our support team immediately at the details below.
      </p>
    </div>
    
    <div class="footer">
      <p style="margin-bottom: 12px;">© 2024 ${BANK_NAME}. All rights reserved.</p>
      <p>
        <a href="${BANK_WEBSITE}" class="footer-link">Visit Website</a> | 
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/settings" class="footer-link">Account Settings</a> | 
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/support-ticket" class="footer-link">24/7 Support</a>
      </p>
      <p style="margin-top: 8px; font-size: 11px;">
        This is an automated email. Please do not reply directly to this email address.
      </p>
    </div>
  `;
}

export async function sendWelcomeEmail(to: string, userName: string): Promise<boolean> {
  const html = getEmailTemplate(getWelcomeEmailContent(userName));

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject: `Welcome to ${BANK_NAME}! 🎉`,
    html,
  });
  return !error;
}

export async function sendTransactionConfirmationEmail(
  to: string,
  userName: string,
  data: {
    transactionType: "transfer" | "payment" | "deposit" | "withdrawal";
    status: "completed" | "pending" | "failed";
    amount: string;
    currency: string;
    fromAccount: string;
    toAccount: string;
    transactionId: string;
    date: string;
    description?: string;
    reference?: string;
  }
): Promise<boolean> {
  console.log("Sending transaction confirmation email to:", to, "with data:", data);
  const html = getEmailTemplate(getTransactionConfirmationContent({ userName, ...data }));

  const statusText = data.status === "completed" ? "Confirmed" : data.status === "pending" ? "Pending" : "Failed";
  const transactionTypeText = {
    transfer: "Transfer",
    payment: "Payment",
    deposit: "Deposit",
    withdrawal: "Withdrawal",
  }[data.transactionType];

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject: `${transactionTypeText} ${statusText} - ${data.currency} ${data.amount}`,
    html,
  });
  return !error;
}

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

function getVerificationEmailContent(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const link = `${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  return `
    <div class="header">
      <img src="${LOGO_URL}" alt="Logo" class="header-logo">
      <div class="header-title">${BANK_NAME}</div>
      <div class="header-subtitle">Email Verification Required</div>
    </div>
    
    <div class="content">
      <div class="welcome-heading">Verify Your Email Address</div>
      
      <p class="text">Thank you for creating your account with ${BANK_NAME}!</p>
      
      <p class="text">
        To complete your account setup and start using all our banking services, please verify your email address by clicking the button below.
      </p>
      
      <div class="highlight-box">
        <strong>This link will expire in 24 hours.</strong> If you don't complete verification within this time, you'll need to request a new verification email.
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${link}" class="cta-button" style="display: inline-block; width: auto; padding: 14px 48px;">
          ✓ Verify Email Address
        </a>
      </div>
      
      <p class="text" style="text-align: center; color: ${COLORS.lightText}; font-size: 13px; margin-top: 24px;">
        Or copy and paste this link in your browser:
      </p>
      
      <div style="background-color: ${COLORS.bgLight}; padding: 12px; border-radius: 6px; margin: 12px 0; word-break: break-all; font-size: 12px; color: ${COLORS.dark}; font-family: monospace; border-left: 3px solid ${COLORS.secondary};">
        ${link}
      </div>
      
      <div class="divider"></div>
      
      <p class="text" style="font-size: 13px;">
        <strong>Why we need this:</strong><br>
        Email verification ensures your account is secure and that you have access to the email address you provided. This is a one-time step to complete your registration.
      </p>
      
      <p class="text" style="font-size: 13px;">
        <strong>Didn't create this account?</strong><br>
        If you didn't sign up for ${BANK_NAME}, please ignore this email. If you believe this is an error, contact our support team immediately.
      </p>
    </div>
    
    <div class="footer">
      <p style="margin-bottom: 12px;">© 2024 ${BANK_NAME}. All rights reserved.</p>
      <p>
        <a href="${BANK_WEBSITE}" class="footer-link">Visit Website</a> | 
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/support-ticket" class="footer-link">Support</a>
      </p>
      <p style="margin-top: 8px; font-size: 11px;">
        This is an automated email. Please do not reply directly to this email address.
      </p>
    </div>
  `;
}

export async function sendVerificationEmail(to: string, token: string): Promise<boolean> {
  const html = getEmailTemplate(getVerificationEmailContent(token));

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject: `Verify Your Email - ${BANK_NAME}`,
    html,
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
