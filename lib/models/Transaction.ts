import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITransaction extends Document {
  date: Date;
  fromAccount: string; // account number
  toAccount: string;
  amount: number;
  currency: string;
  type: "local" | "international" | "wire" | "deposit" | "withdrawal" | "card" | "loan" | "grant";
  status: "pending" | "completed" | "failed" | "reversed";
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    date: { type: Date, default: Date.now, required: true },
    fromAccount: { type: String, required: true },
    toAccount: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD", required: true },
    type: {
      type: String,
      enum: ["local", "international", "wire", "deposit", "withdrawal", "card", "loan", "grant"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "reversed"],
      default: "completed",
    },
    description: String,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ?? mongoose.model<ITransaction>("Transaction", TransactionSchema);
