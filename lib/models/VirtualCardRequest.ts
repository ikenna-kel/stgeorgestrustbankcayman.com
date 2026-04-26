import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type VirtualCardRequestStatus = "pending" | "approved" | "rejected";
export type VirtualCardRequestType = "debit" | "credit" | "prepaid";

export interface IVirtualCardRequest extends Document {
  userId: Types.ObjectId;
  accountId: Types.ObjectId;
  type: VirtualCardRequestType;
  status: VirtualCardRequestStatus;
  description?: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

const VirtualCardRequestSchema = new Schema<IVirtualCardRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    type: {
      type: String,
      enum: ["debit", "credit", "prepaid"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    description: String,
    currency: { type: String, default: "USD" },
  },
  { timestamps: true }
);

export const VirtualCardRequest: Model<IVirtualCardRequest> =
  mongoose.models.VirtualCardRequest ??
  mongoose.model<IVirtualCardRequest>("VirtualCardRequest", VirtualCardRequestSchema);

