import { Router } from "express";
import { ActivityModel } from "../models/Activity.js";
import { asyncRoute, requireContext } from "../utils/http.js";

export const activityRouter = Router();

activityRouter.get(
  "/",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const activities = await ActivityModel.find({ workspaceId: context.workspaceId }).sort({ occurredAt: -1 }).limit(200).lean();
    res.json({ activities });
  }),
);
