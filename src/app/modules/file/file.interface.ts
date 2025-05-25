import mongoose from "mongoose";

export interface IFile {
  name?: string;
  owner?: mongoose.Types.ObjectId;
  folderId: mongoose.Types.ObjectId;
  fileType?: string;
  fileSize?: number;
  path?: string;
  publicId?: string; // For cloud storage like Cloudinary
  isFavorite?: boolean;
  isLocked?: boolean;
  
}

export interface FileDocument {
  _id: string;
  name: string;
  publicId: string;
  owner: string;
  folderId: string;
  fileType: string;
  fileSize: number;
  path: string;
  isFavorite: boolean;
  isLocked: boolean;
  createdAt: string;   // Or `Date` if you prefer
  updatedAt: string;   // Or `Date` if you prefer
  __v: number;
}
