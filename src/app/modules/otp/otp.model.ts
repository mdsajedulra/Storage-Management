import mongoose, { Schema } from "mongoose";
import { IOtp } from "./otp.interface";

const OtpSchema = new Schema<IOtp>(
  {
    otp: {
      type: String,
      required: true,
      match: [/^\d{6}$/, "OTP must be a 6-digit number"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);


export const OtpModel = mongoose.model<IOtp>("Otp", OtpSchema);
