import { Router } from "express";
import { z } from "zod";
import { WorkspaceModel } from "../models/Workspace.js";
import { UserModel } from "../models/User.js";
import { asyncRoute, AppError, normalizeSlug, requireContext } from "../utils/http.js";
import { requireRole } from "../middleware/rbac.js";
import { validateBody } from "../middleware/validate.js";
import { recordAudit } from "../services/audit.js";

export const workspaceRouter = Router();

const workspacePatchSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  slug: z.string().trim().min(1).max(120).optional(),
  plan: z.string().trim().max(50).optional(),
  settings: z.record(z.unknown()).optional(),
});

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
  requireRole("admin"),
  validateBody(workspacePatchSchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const slug = req.body.slug ? normalizeSlug(req.body.slug) : undefined;
    if (slug) {
      const taken = await WorkspaceModel.exists({ slug, _id: { $ne: context.workspaceId } });
      if (taken) throw new AppError(409, "Workspace slug is already in use");
    }

    const workspace = await WorkspaceModel.findByIdAndUpdate(
      context.workspaceId,
      {
        ...(req.body.name ? { name: req.body.name } : {}),
        ...(slug ? { slug } : {}),
        ...(req.body.plan ? { plan: req.body.plan } : {}),
        ...(req.body.settings ? { settings: req.body.settings } : {}),
      },
      { new: true },
    );

    if (!workspace) {
      throw new AppError(404, "workspace not found");
    }

    await recordAudit({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      action: "workspace.update",
      targetType: "workspace",
      targetId: context.workspaceId,
      payload: { name: workspace.name, slug: workspace.slug },
    });

    res.json({ workspace });
  }),
);
