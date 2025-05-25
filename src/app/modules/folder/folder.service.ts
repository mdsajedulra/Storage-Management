import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { IFolder } from "./folder.interface";
import { FolderModel } from "./folder.model";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import { FileModel } from "../file/file.model";

const newFolder = async (payload: IFolder, user: JwtPayload) => {
  const userFromDB = await User.findOne({ email: user.email });
  if (!userFromDB) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const existingFolder = await FolderModel.findOne({
    name: payload.name,
    owner: userFromDB._id,
    parentFolder: payload.parentFolder || null,
  });
  if (existingFolder) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "A folder with this name already exists in the specified location."
    );
  }
  const result = await FolderModel.create({...payload, owner: userFromDB._id });
  return result;
};


const getAllFolders = async (user: JwtPayload) => {
  const userFromDB = await User.findOne({ email: user.email });
  if (!userFromDB) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  const folders = await FolderModel.find({ owner: userFromDB._id });
  return folders;
};

const getFolderFile = async (folderId: string, user: JwtPayload) => {
  const userFromDB = await User.findOne({ email: user.email });
  if (!userFromDB) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  console.log(folderId, userFromDB._id);
  const folder = await FileModel.find({ folderId: folderId, owner: userFromDB._id, isLocked: false });
  if (!folder) {
    throw new AppError(StatusCodes.NOT_FOUND, "Folder not found");
  }
  return folder;
};

export const folderService = {
  createFolder: newFolder,
  getAllFolders,
  getFolderFile,
};
