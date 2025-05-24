import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { ILoginUser } from "./auth.interface";
import { createToken } from "./auth.utils";
import config from "../../config";

const register = async (payload: IUser) => {
  const user = await User.create(payload);
  return user;
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
export const authService = {
  register,
  login,
};
