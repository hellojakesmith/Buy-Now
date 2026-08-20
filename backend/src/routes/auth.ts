import { Router } from "express";
import { Types } from "mongoose";
import { WorkspaceModel } from "../models/Workspace.js";
import { UserModel } from "../models/User.js";
import { normalizeSlug } from "../utils/http.js";
import { ensureDefaultPipeline } from "../services/seed.js";
import { asyncRoute, AppError, requireContext } from "../utils/http.js";
import { validateBody } from "../middleware/validate.js";
import { bootstrapAuthSchema } from "../schemas/auth.js";

export const authRouter = Router();

authRouter.post(
  "/bootstrap",
  validateBody(bootstrapAuthSchema),
  asyncRoute(async (req, res) => {
    const workspaceName = String(req.body.workspaceName ?? req.body.name ?? "Buy Now Workspace").trim();
    const workspaceSlug = normalizeSlug(String(req.body.workspaceSlug ?? workspaceName));
    const ownerName = String(req.body.name ?? req.body.ownerName ?? "Owner").trim();
    const ownerEmail = String(req.body.email ?? req.body.ownerEmail ?? "").trim().toLowerCase();

    if (!ownerEmail) {
      throw new AppError(400, "email is required");
    }

    let workspace = await WorkspaceModel.findOne({ slug: workspaceSlug });
    if (!workspace) {
      workspace = await WorkspaceModel.create({
        name: workspaceName,
        slug: workspaceSlug,
        ownerUserId: new Types.ObjectId(),
      });
    }

    let user = await UserModel.findOne({ workspaceId: workspace._id, email: ownerEmail });
    if (!user) {
      user = await UserModel.create({
        workspaceId: workspace._id,
        email: ownerEmail,
        name: ownerName,
        role: "owner",
        authProvider: "email",
      });
      workspace.ownerUserId = user._id as any;
      await workspace.save();
    }

    await ensureDefaultPipeline(String(workspace._id), String(user._id));

    res.status(201).json({
      workspace,
      user,
      context: {
        workspaceId: String(workspace._id),
        userId: String(user._id),
      },
    });
  }),
);

authRouter.get(
  "/me",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const workspace = await WorkspaceModel.findById(context.workspaceId).lean();
    const user = await UserModel.findById(context.userId).lean();

    if (!workspace || !user) {
      throw new AppError(404, "Context user or workspace not found");
    }

    res.json({ workspace, user });
  }),
);
