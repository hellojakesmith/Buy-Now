import { Router } from "express";
import { z } from "zod";
import { UserModel } from "../models/User.js";
import { asyncRoute, AppError, parseObjectId, requireContext } from "../utils/http.js";
import { validateBody } from "../middleware/validate.js";
import { hasAtLeastRole, requireRole, roleRank } from "../middleware/rbac.js";
import { recordAudit } from "../services/audit.js";
import type { WorkspaceRole } from "../types/roles.js";

export const usersRouter = Router();

const roleSchema = z.enum(["owner", "admin", "member"]);

const createUserSchema = z.object({
  email: z.string().trim().email().max(254),
  name: z.string().trim().min(1).max(120),
  role: roleSchema.default("member"),
  avatarUrl: z.string().url().max(500).optional(),
});

const patchUserSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  role: roleSchema.optional(),
  avatarUrl: z.string().url().max(500).optional(),
});

async function countOwners(workspaceId: string) {
  return UserModel.countDocuments({ workspaceId, role: "owner" });
}

usersRouter.get(
  "/",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const users = await UserModel.find({ workspaceId: context.workspaceId }).sort({ createdAt: -1 }).lean();
    res.json({ users });
  }),
);

usersRouter.post(
  "/",
  requireRole("admin"),
  validateBody(createUserSchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const role = req.body.role as WorkspaceRole;
    if (role === "owner" && context.role !== "owner") {
      throw new AppError(403, "Only the workspace owner can create another owner");
    }

    const email = String(req.body.email).trim().toLowerCase();
    const user = await UserModel.create({
      workspaceId: context.workspaceId,
      email,
      name: req.body.name,
      role,
      authProvider: "email",
      avatarUrl: req.body.avatarUrl,
    });

    await recordAudit({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      action: "user.create",
      targetType: "user",
      targetId: String(user._id),
      payload: { email, role },
    });

    res.status(201).json({ user });
  }),
);

usersRouter.patch(
  "/:id",
  requireRole("admin"),
  validateBody(patchUserSchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const userId = parseObjectId(String(req.params.id), "user id");
    const existing = await UserModel.findOne({ _id: userId, workspaceId: context.workspaceId });
    if (!existing) throw new AppError(404, "User not found");

    const nextRole = req.body.role as WorkspaceRole | undefined;
    if (nextRole) {
      if (roleRank(nextRole) > roleRank(context.role)) {
        throw new AppError(403, "You cannot assign a role above your own");
      }
      if (existing.role === "owner" && nextRole !== "owner" && (await countOwners(context.workspaceId)) <= 1) {
        throw new AppError(400, "The workspace must keep at least one owner");
      }
    }

    const user = await UserModel.findOneAndUpdate(
      { _id: userId, workspaceId: context.workspaceId },
      {
        ...(req.body.name ? { name: req.body.name } : {}),
        ...(req.body.avatarUrl ? { avatarUrl: req.body.avatarUrl } : {}),
        ...(nextRole ? { role: nextRole } : {}),
      },
      { new: true },
    );
    if (!user) throw new AppError(404, "User not found");

    await recordAudit({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      action: "user.update",
      targetType: "user",
      targetId: String(user._id),
      payload: { role: user.role, previousRole: existing.role },
    });

    res.json({ user });
  }),
);

usersRouter.delete(
  "/:id",
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const userId = parseObjectId(String(req.params.id), "user id");
    if (String(userId) === context.userId) throw new AppError(400, "You cannot delete your own account from here");

    const existing = await UserModel.findOne({ _id: userId, workspaceId: context.workspaceId });
    if (!existing) throw new AppError(404, "User not found");
    if (existing.role === "owner" && context.role !== "owner") {
      throw new AppError(403, "Only an owner can remove another owner");
    }
    if (existing.role === "owner" && (await countOwners(context.workspaceId)) <= 1) {
      throw new AppError(400, "The workspace must keep at least one owner");
    }

    await existing.deleteOne();
    await recordAudit({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      action: "user.delete",
      targetType: "user",
      targetId: String(userId),
      payload: { email: existing.email, role: existing.role },
    });
    res.status(204).send();
  }),
);
