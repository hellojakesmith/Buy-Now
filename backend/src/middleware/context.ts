import type { NextFunction, Request, Response } from "express";
import { AppError, isValidObjectId } from "../utils/http.js";
import { authenticateRequest } from "./auth.js";
import { env } from "../config/env.js";

export async function requestContextMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    if (await authenticateRequest(req)) return next();

    // Header-based context remains available only outside production so local/demo workflows keep working.
    if (env.nodeEnv !== "production") {
      const workspaceId = req.header("x-workspace-id");
      const userId = req.header("x-user-id");
      const workspaceSlug = req.header("x-workspace-slug") ?? undefined;
      const userEmail = req.header("x-user-email") ?? undefined;

      if (!workspaceId || !userId) {
        req.context = undefined;
        return next();
      }
      if (!isValidObjectId(workspaceId)) return next(new AppError(400, "Invalid x-workspace-id"));
      if (!isValidObjectId(userId)) return next(new AppError(400, "Invalid x-user-id"));

      req.context = { workspaceId, userId, workspaceSlug, userEmail };
    } else {
      req.context = undefined;
    }

    return next();
  } catch (error) {
    return next(error);
  }
}
