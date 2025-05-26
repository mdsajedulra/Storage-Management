import { z } from "zod";

// MongoDB ObjectId is a 24-character hex string
const objectIdRegex = /^[a-f\d]{24}$/i;

export const otpValidation = z.object({
  otp: z
    .string()
    .length(6)
    .regex(/^\d{6}$/, {
      message: "OTP must be a 6-digit number",
    }),
  userId: z.string().regex(objectIdRegex, {
    message: "Invalid MongoDB ObjectId",
  }),
});
