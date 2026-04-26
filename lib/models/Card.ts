import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICard extends Document {
  type: "debit" | "credit" | "prepaid";
  transactions: Types.ObjectId[];
  balance: number;
  userId: Types.ObjectId;
  accountId: Types.ObjectId;
  lastFourDigits: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema = new Schema<ICard>(
  {
    type: {
      type: String,
      enum: ["debit", "credit", "prepaid"],
      required: true,
    },
    transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
    balance: { type: Number, default: 0 },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    lastFourDigits: { type: String, required: true, length: 4 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Card: Model<ICard> =
  mongoose.models.Card ?? mongoose.model<ICard>("Card", CardSchema);
