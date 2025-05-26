import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middleware/auth";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.put("/change-password", auth("user"), authController.changePassword);
authRouter.put("/changeUserName", auth("user"), authController.changeUserName);

export default authRouter;
