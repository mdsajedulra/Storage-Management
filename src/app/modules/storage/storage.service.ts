import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import catchAsync from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { FileModel } from "../file/file.model";
import mongoose from "mongoose";

const getStorage = async (user: JwtPayload) => {
  const userFromDB = await User.findOne({ email: user.email });

  console.log(userFromDB);
  if (!userFromDB) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const fileUsageSummary = await FileModel.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userFromDB._id),
      },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $in: ["$fileType", ["jpg", "jpeg", "png", "gif", "webp"]] },
            "image",
            "document",
          ],
        },
      },
    },
  ]);

  return fileUsageSummary;
};

export const storageService = {
  getStorage,
};
