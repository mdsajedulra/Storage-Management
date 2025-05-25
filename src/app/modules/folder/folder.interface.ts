import mongoose from "mongoose";

export interface IFolder {
  name: string;
  owner?: mongoose.Types.ObjectId;
  parentFolder?: mongoose.Types.ObjectId | null;
}
