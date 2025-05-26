import { Router } from "express";
import { fileController } from "./file.controller";
import { upload } from "./file.utils";
import auth from "../../middleware/auth";

const fileRouter = Router();

fileRouter.post(
  "/",
  auth("user"),
  upload.single("file"),
  function (req, res, next) {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
      next();
    }
    next();
  },
  fileController.uploadFile
);

// Route to delete a file
fileRouter.delete(
  "/:id",
  auth("user"),

  fileController.deleteFile
);
fileRouter.post(
  "/:id",
  auth("user"),

  fileController.duplicateFile
);
fileRouter.put(
  "/:id",
  auth("user"),

  fileController.renameFile
);
fileRouter.put(
  "/makefavortie/:id",
  auth("user"),

  fileController.makeFavorite
);
fileRouter.get(
  "/getfavorite",
  auth("user"),

  fileController.getFavoriteFiles
);

fileRouter.put(
  "/lock/:id",
  auth("user"),

  fileController.lockFile
);

fileRouter.get(
  "/getlock",
  auth("user"),

  fileController.getLockedFiles
);

export default fileRouter;
