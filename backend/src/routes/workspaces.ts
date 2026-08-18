import { Router } from "express";
import { WorkspaceModel } from "../models/Workspace.js";
import { UserModel } from "../models/User.js";
import { asyncRoute, AppError, requireContext } from "../utils/http.js";

export const workspaceRouter = Router();

workspaceRouter.get(
  "/current",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const workspace = await WorkspaceModel.findById(context.workspaceId).lean();
    if (!workspace) {
      throw new AppError(404, "workspace not found");
    }

    const users = await UserModel.find({ workspaceId: context.workspaceId }).lean();
    res.json({ workspace, users });
  }),
);

workspaceRouter.patch(
  "/current",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const workspace = await WorkspaceModel.findByIdAndUpdate(
      context.workspaceId,
      {
        name: req.body.name,
        slug: req.body.slug,
        plan: req.body.plan,
        settings: req.body.settings,
      },
      { new: true },
    );

    if (!workspace) {
      throw new AppError(404, "workspace not found");
    }

    res.json({ workspace });
  }),
);
