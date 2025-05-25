import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, UserModel } from "./user.interface";
import config from "../../config";
const FIFTEEN_GB = 15 * 1024 * 1024 * 1024;

const userSchema: Schema<IUser, UserModel> = new Schema(
  {
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pin: { type: String, required: true, default: null },
    googleId: { type: String, default: null },
    storageUsed: { type: Number, default: 0 },
    storageLimit: { type: Number, default: FIFTEEN_GB },
    role: { type: String, enum: ["admin", "user"], default: "user" },      
  },
  {
    timestamps: true,
  }
);

// password  hass pre hook

userSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    String(user.password),
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

// return document password empty string define

userSchema.post("save", async function (doc, next) {
  doc.password = "";
  next();
});

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = mongoose.model<IUser, UserModel>("User", userSchema);
