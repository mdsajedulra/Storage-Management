import { JwtPayload } from "jsonwebtoken";
import { FileModel } from "./file.model";
import { User } from "../user/user.model";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import {
  deleteImageFromCloudinary,
  renameImageInCloudinary,
  sendImageToCloudinary,
} from "../../utils/sendImageToCloudinary";

const uploadFile = async (file: File, user: JwtPayload) => {
  // console.log(file);
  const userFromDB = await User.findOne({ email: user.email });

  if (!userFromDB) {
    throw new Error("User not found");
  }

  const updatedFile = {
    ...file,
    owner: userFromDB._id,
  };

  const result = await FileModel.create(updatedFile);
  userFromDB.storageUsed += result?.fileSize ?? 0;
  if( userFromDB.storageUsed > userFromDB.storageLimit) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Storage limit exceeded. Please upgrade your plan or delete some files."
    );
  }
  await userFromDB.save();
  return result; // Replace with actual file upload logic
};
// deleteFile function to delete a file by its ID
export const deleteFile = async (id: string, user: JwtPayload) => {
  const userFromDB = await User.findOne({ email: user.email });
  if (!userFromDB) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const file = await FileModel.findById(id);

  if (!file) {
    throw new AppError(StatusCodes.NOT_FOUND, "File not found");
  }

  if (!file.owner || userFromDB._id.toString() !== file.owner.toString()) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You do not have permission to delete this file"
    );
  }

  if (file.isLocked) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "File is locked and cannot be deleted"
    );
  }

  try {
    await deleteImageFromCloudinary(file.publicId as string);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to delete image from Cloudinary"
    );
  }

  const deleteFromDB = await FileModel.findByIdAndDelete(id);
  return deleteFromDB;
};

// duplicate the fileService object to export the functions

const duplicateFile = async (id: string, user: JwtPayload) => {
  const userFromDB = await User.findOne({ email: user.email });

  if (!userFromDB) {
    throw new Error("User not found");
  }

  const file = await FileModel.findById(id).lean();

  if (!file) {
    throw new AppError(StatusCodes.NOT_FOUND, "File not found");
  }

  const { _id, ...rest } = file;

  if (file.name) {
    const againFile = await FileModel.findOne({
      name: rest.name,
    });

    console.log(againFile?.name, "againFile name");

    if (!againFile) {
      throw new AppError(StatusCodes.NOT_FOUND, "File not found");
    }
    if (rest.name === againFile?.name) {
      console.log("duplicate file name found");
      //   rest.name = file.name; // If it's already a copy, keep the original name
      rest.name = `Copy of ${file.name}`; // Optionally modify the name to indicate it's a copy
      console.log("name of file", rest.name);
    }
  }
  //   console.log(rest);
  const fileupload = await sendImageToCloudinary(
    rest.name as string,
    rest.path as string
  );

  const duplicateFileData = {
    name: fileupload.display_name || `Copy of ${file.name}`, // Use display_name if available, otherwise use original name
    owner: userFromDB._id, // Assuming user.email is the identifier for the owner
    fileSize: fileupload.bytes,
    fileType: fileupload.format,
    path: fileupload.secure_url,
    publicId: fileupload.public_id,
    folderId: rest.folderId || null, // Assuming folderId is passed in the request body
  };
  // console.log(duplicateFileData);
  const result = await FileModel.create(duplicateFileData as any);
  console.log(result);
  //   console.log(duplicateFileData);

  //   console.log(id, rest);

  // if (!file) {
  //     throw new AppError(StatusCodes.NOT_FOUND, "File not found");
  // }

  // const  { _id,  ...rest } = file;

  // const duplicatedFile = {
  //     ...file
  //     _id: new mongoose.Types.ObjectId(), // Create a new ObjectId for the duplicated file
  //     name: `Copy of ${file.name}`, // Optionally modify the name to indicate it's a copy
  // };

  // const result = await FileModel.create(duplicatedFile);
  // return result;
};

const renameFile = async (id: string, newName: string, user: JwtPayload) => {
  const userFromDB = await User.findOne({ email: user.email });

  if (!userFromDB) {
    throw new Error("User not found");
  }

  const file = await FileModel.findById(id);

  if (!file) {
    throw new AppError(StatusCodes.NOT_FOUND, "File not found");
  }

  if (!file.owner || userFromDB._id.toString() !== file.owner.toString()) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You do not have permission to rename this file"
    );
  }

  if (file.isLocked) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "File is locked and cannot be renamed"
    );
  }

  try {
    await renameImageInCloudinary(file.publicId as string, newName);
  } catch (error) {
    console.error("Error renaming image in Cloudinary:", error);
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to rename image in Cloudinary"
    );
  }

  file.name = newName;
  await file.save();
  return file;
};
//

const makeFavorite = async (id: string, user: JwtPayload) => {
  const userFromDB = await User.findOne({ email: user.email });
  if (!userFromDB) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const file = await FileModel.findById(id);
  if (!file) {
    throw new AppError(StatusCodes.NOT_FOUND, "File not found");
  }

  if (!file.owner || userFromDB._id.toString() !== file.owner.toString()) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You do not have permission to mark this file as favorite"
    );
  }

  file.isFavorite = true;
  await file.save();
  return file;
};

const getFavoriteFiles = async (user: JwtPayload) => {
  const userFromDB = await User.findOne({ email: user.email });
  if (!userFromDB) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const favoriteFiles = await FileModel.find({
    owner: userFromDB._id,
    isFavorite: true,
  });
  return favoriteFiles;
};

const lockFile = async (id: string, user: JwtPayload) => {
  const userFromDB = await User.findOne({ email: user.email });
  if (!userFromDB) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const file = await FileModel.findById(id);
  if (!file) {
    throw new AppError(StatusCodes.NOT_FOUND, "File not found");
  }

  if (!file.owner || userFromDB._id.toString() !== file.owner.toString()) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You do not have permission to lock this file"
    );
  }

  file.isLocked = true;
  await file.save();
  return file;
};

const getLockedFiles = async (pin: { pin: string }, user: JwtPayload) => {
  console.log(pin.pin, user);
  const userFromDB = await User.findOne({ email: user.email });
  if (!userFromDB) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  if (userFromDB.pin !== pin.pin) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid PIN");
  }
  const lockedFiles = await FileModel.find({
    owner: userFromDB._id,
    isLocked: true,
  });
  return lockedFiles;
};

export const fileService = {
  uploadFile,
  deleteFile,
  duplicateFile,
  renameFile,
  makeFavorite,
  getFavoriteFiles,
  lockFile,
  getLockedFiles,
};
