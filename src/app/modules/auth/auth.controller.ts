import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authService } from "./auth.service";

const register = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authService.register(payload);

  sendResponse(res, {
    data: result,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: `User Registration successfly`,
  });
});
const login = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authService.login(payload);

  sendResponse(res, {
    data: result,
    statusCode: StatusCodes.OK,
    success: true,
    message: `User login successfully`,
  });
});
// Function to change user password
const changePassword = catchAsync(async (req, res) => {
  const payload = req.body;
  const { oldPassword, newPassword } = payload;
  const result = await authService.changePassword(
    req.user,
    oldPassword,
    newPassword
  );

  sendResponse(res, {
    data: result,
    statusCode: StatusCodes.OK,
    success: true,
    message: `User password changed successfully`,
  });
});
// Function to change user name
const changeUserName = catchAsync(async (req, res) => {
  const payload = req.body;
  const { newUserName } = payload;
  const result = await authService.changeUserName(req.user, newUserName);

  sendResponse(res, {
    data: result,
    statusCode: StatusCodes.OK,
    success: true,
    message: `User name changed successfully`,
  });
});
// Function to handle forget password
const forgetPassword = catchAsync(async (req, res) => {
  const payload = req.body;
  const { email } = payload;
  const result = await authService.forgetPassword(email);

  sendResponse(res, {
    data: result,
    statusCode: StatusCodes.OK,
    success: true,
    message: `OTP(one time password)  sent to ${email}`,
  });
});
// Function to verify OTP and set new password
const verifyOtpSetNewPassword = catchAsync(async (req, res) => {
  const payload = req.body;
  const { email, otp, newPassword } = payload;
  const result = await authService.verifyOtpSetNewPassword(email, otp, newPassword);

  sendResponse(res, {
    data: result,
    statusCode: StatusCodes.OK,
    success: true,
    message: `Password reset successfully`,
  });
});

// Function to delete user profile
const profileDelete = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await authService.profileDelete(user);
  sendResponse(res, {
    data: result,
    statusCode: StatusCodes.OK,
    success: true,
    message: `User profile deleted successfully`,
  });
});

export const authController = {
  register,
  login,
  changePassword,
  changeUserName,
  forgetPassword,
  verifyOtpSetNewPassword,
  profileDelete,
};
