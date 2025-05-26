import { Router } from "express";

import authRouter from "../modules/auth/auth.route";
import folderRoute from "../modules/folder/folder.route";
import fileRouter from "../modules/file/file.route";
import storageRouter from "../modules/storage/storage.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/folder",
    route: folderRoute,
  },
  {
    path: "/file",
    route: fileRouter,
  },
  {
    path: "/storage",
    route: storageRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
