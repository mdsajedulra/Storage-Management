import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { folderService } from "./folder.service";

const newFolder = catchAsync(async (req, res) => {
  const payload = req.body;
  console.log(payload);
  const result = await folderService.createFolder(payload, req.user);

  sendResponse(res, {
    data: result,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: `Folder created successfully`,
  });
});

const getAllFolders = catchAsync(async (req, res) => {
  const result = await folderService.getAllFolders(req.user);

  sendResponse(res, {
    data: result,
    statusCode: StatusCodes.OK,
    success: true,
    message: `Folders retrieved successfully`,
  });
});

const getFolderFile = catchAsync(async (req, res) => {
  const { folderId } = req.params;

  const result = await folderService.getFolderFile(folderId as string, req.user);

  sendResponse(res, {
    data: result,
    statusCode: StatusCodes.OK,
    success: true,
    message: `Folder files retrieved successfully`,
  });
});

export const folderController = {
  newFolder,
  getAllFolders,
  getFolderFile,
};
