import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { fileService } from "./file.service";

const uploadFile = catchAsync(async (req, res) => {
  const file = req.file;
  const data = req.body;
  console.log(file, data);
  const fileupload = await sendImageToCloudinary(
    file?.originalname as string,
    file?.path as string
  );

  const fileData = {
    name: fileupload.original_filename,
    fileSize: fileupload.bytes,
    fileType: fileupload.format,
    path: fileupload.secure_url,
    publicId: fileupload.public_id,
    folderId: data.folderId || null, // Assuming folderId is passed in the request body
  };

  // console.log("from controller", fileupload);
  if (!file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  const result = await fileService.uploadFile(fileData as any, req.user);

  sendResponse(res, {
    data: result,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "File uploaded successfully",
  });
});

const deleteFile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const result = await fileService.deleteFile(id, user);

  sendResponse(res, {
    data: result,
    statusCode: StatusCodes.OK,
    success: true,
    message: "File deleted successfully",
  });
});

// Function to duplicate a file

const duplicateFile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await fileService.duplicateFile(id, req.user);
  sendResponse(res, {
    data: result,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "File duplicated successfully",
  });
});

//

const renameFile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { newName } = req.body;

  const result = await fileService.renameFile(id, newName, req.user);
  sendResponse(res, {
    data: result,
    statusCode: StatusCodes.OK,
    success: true,
    message: "File renamed successfully",
  });
});
// Function to mark a file as favorite

const makeFavorite = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await fileService.makeFavorite(id, req.user);
  sendResponse(res, {
    data: result,
    statusCode: StatusCodes.OK,
    success: true,
    message: "File marked as favorite successfully",
  });
});

const getFavoriteFiles = catchAsync(async (req, res) => {
  const result = await fileService.getFavoriteFiles(req.user);
  sendResponse(res, {
    data: result,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Favorite files retrieved successfully",
  });
});

const lockFile = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await fileService.lockFile(id, req.user);
  sendResponse(res, {
    data: result,
    statusCode: StatusCodes.OK,
    success: true,
    message: "File locked successfully",
  });
});

const getLockedFiles = catchAsync(async (req, res) => {
  const result = await fileService.getLockedFiles(req.body, req.user);
  sendResponse(res, {
    data: result,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Locked files retrieved successfully",
  });
});

export const fileController = {
  uploadFile,
  deleteFile,
  duplicateFile,
  renameFile,
  makeFavorite,
  getFavoriteFiles,
  lockFile,
  getLockedFiles,
};
