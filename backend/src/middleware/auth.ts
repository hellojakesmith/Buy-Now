import { Types } from "mongoose";
import type { NextFunction, Request, Response } from "express";
import { SessionModel } from "../models/Session.js";
import { UserModel } from "../models/User.js";
import { WorkspaceModel } from "../models/Workspace.js";
import { env } from "../config/env.js";
import { AppError, asyncRoute } from "../utils/http.js";
import { hashSessionToken, parseSessionCookie } from "../utils/auth.js";

export async function authenticateRequest(req: Request): Promise<boolean> {
  const token = parseSessionCookie(req.headers.cookie);
  if (!token) return false;

  const session = await SessionModel.findOne({
    tokenHash: hashSessionToken(token),
    expiresAt: { $gt: new Date() },
  }).lean();

  if (!session) return false;

  const [user, workspace] = await Promise.all([
    UserModel.findById(session.userId).lean(),
    WorkspaceModel.findById(session.workspaceId).lean(),
  ]);

  if (!user || !workspace || String(user.workspaceId) !== String(workspace._id)) return false;

  req.context = {
    workspaceId: String(workspace._id),
    userId: String(user._id),
    workspaceSlug: workspace.slug,
    userEmail: user.email,
  };
  return true;
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    if (await authenticateRequest(req)) return next();

    if (env.nodeEnv !== "production") {
      const workspaceId = req.header("x-workspace-id");
      const userId = req.header("x-user-id");
      if (workspaceId && userId && Types.ObjectId.isValid(workspaceId) && Types.ObjectId.isValid(userId)) {
        req.context = { workspaceId, userId };
        return next();
      }
    }

    return next(new AppError(401, "Authentication required"));
  } catch (error) {
    return next(error);
  }
}

export const requireAuthenticatedContext = asyncRoute(async (req, _res, next) => {
  if (!req.context) throw new AppError(401, "Authentication required");
  next();
});
