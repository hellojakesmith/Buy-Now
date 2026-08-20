import type { NextFunction, Request, Response } from "express";
import type { WorkspaceRole } from "../types/roles.js";
import { AppError } from "../utils/errors.js";

const ROLE_RANK: Record<WorkspaceRole, number> = {
  member: 1,
  admin: 2,
  owner: 3,
};

export function roleRank(role: string | undefined): number {
  if (role === "owner" || role === "admin" || role === "member") return ROLE_RANK[role];
  return 0;
}

export function hasAtLeastRole(actual: string | undefined, minimum: WorkspaceRole) {
  return roleRank(actual) >= ROLE_RANK[minimum];
}

export function requireRole(minimum: WorkspaceRole) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.context) return next(new AppError(401, "Authentication required"));
    if (!hasAtLeastRole(req.context.role, minimum)) {
      return next(new AppError(403, "You do not have permission to perform this action"));
    }
    next();
  };
}
