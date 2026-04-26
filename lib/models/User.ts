import mongoose, { Schema, Document, Model, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface ISecurityQA {
  question: string;
  answer: string;
}

export type UserRole = "user" | "admin";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  address?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  // Next of Kin
  nextOfKinName?: string;
  nextOfKinRelationship?: string;
  nextOfKinPhone?: string;
  nextOfKinEmail?: string;
  nextOfKinAddress?: string;
  // KYC
  idType?: string;
  idNumber?: string;
  ssn?: string;
  // PINs
  loginPin?: string;
  transactionPin?: string;
  securityQuestions: ISecurityQA[];
  accounts: Types.ObjectId[];
  currency: string;
  cards: Types.ObjectId[];
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  role: UserRole;
  isBlocked: boolean;
  transfersDisabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
  compareLoginPin(candidate: string): Promise<boolean>;
  compareTransactionPin(candidate: string): Promise<boolean>;
}

const SecurityQASchema = new Schema<ISecurityQA>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    dateOfBirth: { type: String, default: "" },
    gender: { type: String, default: "" },
    nationality: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    country: { type: String, default: "" },
    // Next of Kin
    nextOfKinName: { type: String, default: "" },
    nextOfKinRelationship: { type: String, default: "" },
    nextOfKinPhone: { type: String, default: "" },
    nextOfKinEmail: { type: String, default: "" },
    nextOfKinAddress: { type: String, default: "" },
    // KYC
    idType: { type: String, default: "" },
    idNumber: { type: String, default: "" },
    ssn: { type: String, default: "" },
    // PINs — stored hashed, select: false
    loginPin: { type: String, select: false },
    transactionPin: { type: String, select: false },
    securityQuestions: {
      type: [SecurityQASchema],
      default: [],
      validate: {
        validator: (v: ISecurityQA[]) => v.length <= 5,
        message: "Max 5 security Q&A",
      },
    },
    accounts: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    currency: { type: String, default: "USD" },
    cards: [{ type: Schema.Types.ObjectId, ref: "Card" }],
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isBlocked: { type: Boolean, default: false },
    transfersDisabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.methods.compareLoginPin = async function (candidate: string): Promise<boolean> {
  if (!this.loginPin) return false;
  return bcrypt.compare(candidate, this.loginPin);
};

UserSchema.methods.compareTransactionPin = async function (candidate: string): Promise<boolean> {
  if (!this.transactionPin) return false;
  return bcrypt.compare(candidate, this.transactionPin);
};

// Delete cached model so hot-reload picks up new schema methods
if (mongoose.models.User) {
  delete mongoose.models.User;
}
export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
