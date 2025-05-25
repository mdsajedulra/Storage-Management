import { z } from "zod";

const FIFTEEN_GB = 15 * 1024 * 1024 * 1024;

export const userSchema = z.object({
  userName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  pin: z.string().min(4).max(4).optional(), 
  googleId: z.string().optional(),
  storageUsed: z.number().min(0).default(0),
  storageLimit: z.number().default(FIFTEEN_GB),
  role: z.enum(["admin", "user"]).default("user"),
  status: z.enum(["active", "blocked"]).default("active"),
});
