import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type GrantStatus = "pending" | "approved" | "disbursed" | "rejected";

export interface IGrant extends Document {
  userId: Types.ObjectId;
  accountId: Types.ObjectId;
  amount: number;
  type: string;
  status: GrantStatus;
  description?: string;
  disbursementDate?: Date;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

const GrantSchema = new Schema<IGrant>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "disbursed", "rejected"],
      default: "pending",
    },
    description: String,
    disbursementDate: Date,
    currency: { type: String, default: "USD" },
  },
  { timestamps: true }
);

export const Grant: Model<IGrant> =
  mongoose.models.Grant ?? mongoose.model<IGrant>("Grant", GrantSchema);
