import type { NextFunction, Request, Response } from "express";
import { AppError, isValidObjectId } from "../utils/http.js";

export function requestContextMiddleware(req: Request, _res: Response, next: NextFunction) {
  const workspaceId = req.header("x-workspace-id");
  const userId = req.header("x-user-id");
  const workspaceSlug = req.header("x-workspace-slug") ?? undefined;
  const userEmail = req.header("x-user-email") ?? undefined;

  if (!workspaceId || !userId) {
    req.context = undefined;
    return next();
  }

  if (!isValidObjectId(workspaceId)) {
    return next(new AppError(400, "Invalid x-workspace-id"));
  }

  if (!isValidObjectId(userId)) {
    return next(new AppError(400, "Invalid x-user-id"));
  }

  req.context = {
    workspaceId,
    userId,
    workspaceSlug,
    userEmail,
  };

  next();
}
