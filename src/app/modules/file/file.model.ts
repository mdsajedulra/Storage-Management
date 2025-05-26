import mongoose, { model, Schema, Types } from "mongoose";
import { IFile } from "./file.interface";

const fileSchema = new Schema<IFile>(
  {
    name: { type: String, required: true },
    publicId: { type: String, required: true }, // For cloud storage like Cloudinary
    owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    folderId: { type: Schema.Types.ObjectId, ref: "Folder",  default: null },
    fileType: { type: String, required: true }, // "pdf", "note", "image"
    fileSize: { type: Number, required: true },
    path: { type: String, required: true }, // where file is stored
    isFavorite: { type: Boolean, default: false },
    
    isLocked: { type: Boolean, default: false },
    
  },
  { timestamps: true }
);

export const FileModel = model<IFile>("File", fileSchema);
