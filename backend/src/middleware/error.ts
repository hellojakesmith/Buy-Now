import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors.js";

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, "Route not found"));
}

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction) {
  const requestId = req.requestId;
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      requestId,
      ...(error.details ? { details: error.details } : {}),
    });
  }

  console.error({ requestId, error });
  return res.status(500).json({ message: "Internal server error", requestId });
}
