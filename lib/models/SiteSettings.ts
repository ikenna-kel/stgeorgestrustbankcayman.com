import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteSettings extends Document {
  key: string;
  value: string | number | boolean | Record<string, unknown> | unknown[];
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ?? mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export const DEFAULT_SITE_KEYS = {
  heroText: "heroText",
  helpPhone: "helpPhone",
  helpAddress: "helpAddress",
  supportEmail: "supportEmail",
  siteName: "siteName",
  maintenanceMode: "maintenanceMode",
  requireUserOtp: "requireUserOtp",
  // Deposit / funding methods
  btcWallet: "btcWallet",
  ethWallet: "ethWallet",
  usdtWallet: "usdtWallet",
  bankName: "bankName",
  bankAccountNumber: "bankAccountNumber",
  bankRoutingNumber: "bankRoutingNumber",
  bankSwiftCode: "bankSwiftCode",
  bankBeneficiary: "bankBeneficiary",
  bankAccountName: "bankAccountName",
  paypalEmail: "paypalEmail",
} as const;
