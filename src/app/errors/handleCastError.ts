/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";

export const handleCastError = (err: any, res: Response) => {
  res.status(400).json({
    success: false,
    message: err.message,
    error: err,
  });
};