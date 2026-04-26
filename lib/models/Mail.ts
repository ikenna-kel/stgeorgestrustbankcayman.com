import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type MailDirection = "inbound" | "outbound";

export interface IMail extends Document {
  userId: Types.ObjectId;
  direction: MailDirection;
  to: string;
  from: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: Date;
}

const MailSchema = new Schema<IMail>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    direction: { type: String, enum: ["inbound", "outbound"], required: true },
    to: { type: String, required: true },
    from: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, default: "" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

MailSchema.index({ userId: 1, createdAt: -1 });

export const Mail: Model<IMail> =
  mongoose.models.Mail ?? mongoose.model<IMail>("Mail", MailSchema);
