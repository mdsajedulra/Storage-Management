import mongoose from "mongoose";

export interface IOtp {
  otp: string;
  userId: mongoose.Types.ObjectId;
}
