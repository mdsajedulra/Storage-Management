import { Router } from "express";
import auth from "../../middleware/auth";
import { StorageController } from "./storage.controller";

const storageRouter = Router();

storageRouter.get("/",auth("user"),  StorageController.getStorage);

export default storageRouter;
