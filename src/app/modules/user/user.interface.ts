import { Model } from "mongoose";

export interface IUser {
  userName: string;
  email: string;
  password: string;
  googleId?: string;
  storageUsed: number;
  storageLimit: number;
  role: "admin" | "user";
  status: "active" | "blocked";
}

export interface UserModel extends Model<IUser> {
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}
