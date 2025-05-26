import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { ILoginUser } from "./auth.interface";
import { createToken } from "./auth.utils";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";
import { OtpModel } from "../otp/otp.model";
import { sendEmail } from "../../utils/sendEmail";

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
  await OtpModel.create({
    otp: "000000",
    userId: result._id,
  });
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
  console.log(payload?.password, user?.password);
  console.log(await User.isPasswordMatched(payload?.password, user?.password));

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(StatusCodes.FORBIDDEN, "Password do not matched");
  }

  const jwtPayload: { email: string; role: string } = {
    email: user.email,
    role: user.role ?? "",
  };

  const accessToken = createToken(
    jwtPayload,
    config.secret as string,
    60 * 60 * 24 // 24 hours
  );
  const refreshToken = createToken(
    jwtPayload,
    config.secret as string,
    60 * 60
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
  const userFromDB = await User.findOne({ email: user.email }).select(
    "+password"
  );
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

const changeUserName = async (user: JwtPayload, newUserName: string) => {
  const userFromDB = await User.findOne({ email: user.email });
  if (!userFromDB) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // check if the new username already exists
  const existingUser = await User.findOne({ userName: newUserName });
  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, "This username is already taken");
  }
  // update the username

  userFromDB.userName = newUserName;
  await userFromDB.save();

  return userFromDB;
};
const forgetPassword = async (email: string) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
  }

  console.log(generateOTP());
  if (user.status === "blocked") {
    throw new AppError(StatusCodes.FORBIDDEN, "This user is blocked!");
  }
  const storeOtp = await OtpModel.findOneAndUpdate(
    { userId: user._id },
    { otp: generateOTP() },
    { new: true, upsert: true }
  );
  console.log(storeOtp);
  if (!storeOtp) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to generate OTP"
    );
  }

  try {
    await sendEmail(
      user.email,
      "Password Reset OTP",
      `Your OTP is ${storeOtp.otp}`
    );
    console.log("Email sent successfully");
  } catch (error) {
    console.log("error sending email", error);
  }

  // // Generate a password reset token
  // const resetToken = user.createPasswordResetToken();
  // await user.save({ validateBeforeSave: false });

  // // Send the reset token to the user's email
  // await sendEmail({
  //   to: email,
  //   subject: "Password Reset",
  //   text: `Your password reset token is: ${resetToken}`,
  // });

  return storeOtp;
};

// Function to verify OTP and set new password
const verifyOtpSetNewPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const otpRecord = await OtpModel.findOne({ userId: user._id, otp });
  if (!otpRecord) {
    throw new AppError(StatusCodes.NOT_FOUND, "Invalid OTP");
  }

  user.password = newPassword;
  await user.save();

  return user;
};
// profile delete
const deleteProfile = async (user: JwtPayload) => {
  const deleteUser = await User.findOneAndDelete({ email: user.email }).select(
    "-password"
  );
  console.log(deleteUser);
  return deleteUser;
};

export const authService = {
  register,
  login,
  changePassword,
  changeUserName,
  forgetPassword,
  verifyOtpSetNewPassword,
  profileDelete: deleteProfile,
};
