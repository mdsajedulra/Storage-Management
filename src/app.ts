import express, { Application, Request, Response } from "express";

import cors from "cors";


import router from "./app/routes/routes";
import notFound from "./app/middleware/notFound";
import { globalErrorHandler } from "./app/middleware/globalErrorhandler";

const app: Application = express();
app.use(express.json());
app.use(cors());

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ sucess: true, message: "Welcome to the protfolio API" });
});
app.use(globalErrorHandler);
// unknown route error handle
app.use(notFound);

export default app;
