import { Router } from "express";
import { folderController } from "./folder.controller";
import auth from "../../middleware/auth";

const folderRoute = Router();

folderRoute.post("/", auth("user"), folderController.newFolder);
folderRoute.get("/", auth("user"), folderController.getAllFolders);
folderRoute.get("/:folderId", auth("user"), folderController.getFolderFile);

export default folderRoute;
