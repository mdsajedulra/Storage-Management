import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";

import sendResponse from "../../utils/sendResponse";
import { storageService } from "./storage.service";

const getStorage = catchAsync(async (req, res) => {
  const user = req.user;

  const result = await storageService.getStorage(user);

  sendResponse(res, {
    data: result,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Storage information retrieved successfully",
  });
});

export const StorageController = {
  getStorage,
};
