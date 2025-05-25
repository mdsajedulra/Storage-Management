import { model, Schema } from "mongoose";
import { IFolder } from "./folder.interface";

const folderSchema = new Schema<IFolder>(
  {
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    parentFolder: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);
export const FolderModel = model<IFolder>("Folder", folderSchema);