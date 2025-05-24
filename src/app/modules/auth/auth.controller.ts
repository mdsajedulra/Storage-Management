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

export const authController = {
  register,
  login
};
