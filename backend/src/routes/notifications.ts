import { Router } from "express";
import { NotificationModel } from "../models/Notification.js";
import { asyncRoute, AppError, parseObjectId, requireContext } from "../utils/http.js";

export const notificationsRouter = Router();

notificationsRouter.get(
  "/",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const notifications = await NotificationModel.find({ workspaceId: context.workspaceId, userId: context.userId }).sort({ createdAt: -1 }).lean();
    res.json({ notifications });
  }),
);

notificationsRouter.patch(
  "/:id/read",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const notification = await NotificationModel.findOneAndUpdate(
      { _id: parseObjectId(String(req.params.id), "notification id"), workspaceId: context.workspaceId, userId: context.userId },
      { readAt: new Date() },
      { new: true },
    );
    if (!notification) throw new AppError(404, "Notification not found");
    res.json({ notification });
  }),
);
