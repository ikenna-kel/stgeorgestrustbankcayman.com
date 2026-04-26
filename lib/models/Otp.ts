import mongoose, { Schema, Document, Model } from "mongoose";

export type OtpPurpose = "login" | "forgot_password" | "email_verification";

export interface IOtp extends Document {
  email: string;
  code: string;
  purpose: OtpPurpose;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
    email: { type: String, required: true, lowercase: true },
    code: { type: String, required: true, length: 6 },
    purpose: {
      type: String,
      enum: ["login", "forgot_password", "email_verification"],
      required: true,
    },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

OtpSchema.index({ email: 1, purpose: 1 });
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL for cleanup

export const Otp: Model<IOtp> =
  mongoose.models.Otp ?? mongoose.model<IOtp>("Otp", OtpSchema);
