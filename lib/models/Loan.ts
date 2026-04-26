import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type LoanStatus = "pending" | "approved" | "disbursed" | "active" | "repaid" | "rejected" | "defaulted";

export interface ILoan extends Document {
  userId: Types.ObjectId;
  accountId: Types.ObjectId;
  amount: number;
  interestRate: number;
  termMonths: number;
  status: LoanStatus;
  remainingBalance: number;
  disbursementDate?: Date;
  dueDate?: Date;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

const LoanSchema = new Schema<ILoan>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    amount: { type: Number, required: true, min: 0 },
    interestRate: { type: Number, required: true, min: 0 },
    termMonths: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["pending", "approved", "disbursed", "active", "repaid", "rejected", "defaulted"],
      default: "pending",
    },
    remainingBalance: { type: Number, default: 0 },
    disbursementDate: Date,
    dueDate: Date,
    currency: { type: String, default: "USD" },
  },
  { timestamps: true }
);

export const Loan: Model<ILoan> =
  mongoose.models.Loan ?? mongoose.model<ILoan>("Loan", LoanSchema);
