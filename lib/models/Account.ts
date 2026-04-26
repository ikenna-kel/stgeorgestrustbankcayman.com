import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { ITransaction } from "./Transaction";

export interface IAccount extends Document {
  accountNumber: string;
  accountType: "savings" | "current" | "fixed" | "domiciliary";
  transactions: Types.ObjectId[];
  accountBalance: number;
  accountIcon?: string;
  currency: string;
  userId: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema<IAccount>(
  {
    accountNumber: { type: String, required: true, unique: true },
    accountType: {
      type: String,
      enum: ["savings", "current", "fixed", "domiciliary"],
      required: true,
    },
    transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
    accountBalance: { type: Number, default: 0, min: 0 },
    accountIcon: { type: String, default: "wallet" },
    currency: { type: String, default: "USD" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Account: Model<IAccount> =
  mongoose.models.Account ?? mongoose.model<IAccount>("Account", AccountSchema);
