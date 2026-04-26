import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IPaymentProof extends Document {
  userId: Types.ObjectId;
  transactionId?: Types.ObjectId;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: "pending" | "verified" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const PaymentProofSchema = new Schema<IPaymentProof>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const PaymentProof: Model<IPaymentProof> =
  mongoose.models.PaymentProof ?? mongoose.model<IPaymentProof>("PaymentProof", PaymentProofSchema);
