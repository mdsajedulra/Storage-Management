import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { ILoginUser } from "./auth.interface";
import { createToken } from "./auth.utils";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";

const register = async (payload: IUser) => {
  // Defensive check

  if (!payload.userName || !payload.email) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Username and email are required"
    );
  }

  // Check if userName exists

  const existingUser = await User.findOne({ userName: payload.userName });
  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, "This username is already taken");
  }
  const existingEmail = await User.findOne({ email: payload.email });
  if (existingEmail) {
    throw new AppError(StatusCodes.CONFLICT, "This email is already taken");
  }
  // All good — create user
  const result = await User.create(payload);
  return result;
};

// login user

const login = async (payload: ILoginUser) => {
  const user = await User.findOne({ email: payload.email }).select("+password");
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "This user is not found!");
  }
  const userStatus = user?.status;
  if (userStatus === "blocked") {
    throw new AppError(StatusCodes.FORBIDDEN, "This user is blocked ! !");
  }

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(StatusCodes.FORBIDDEN, "Password do not matched");
  }

  const jwtPayload: { email: string; role: string } = {
    email: user.email,
    role: user.role ?? "",
  };

  const accessToken = createToken(jwtPayload, config.secret as string, 60 * 60);
  const refreshToken = createToken(
    jwtPayload,
    config.secret as string,
    60 * 60 * 60
  );
  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  user: JwtPayload,
  oldPassword: string,
  newPassword: string
) => {
  console.log(user);
  const userFromDB = await User.findOne({ email: user.email }).select("+password");
  if (!userFromDB) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (!(await User.isPasswordMatched(oldPassword, userFromDB.password))) {
    throw new AppError(StatusCodes.FORBIDDEN, "Old password is incorrect");
  }

  userFromDB.password = newPassword;
  await userFromDB.save();

  return userFromDB;
};

export const authService = {
  register,
  login,
  changePassword,
};
