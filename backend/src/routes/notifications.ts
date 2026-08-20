import { Router } from "express";
import { z } from "zod";
import { NotificationModel } from "../models/Notification.js";
import { asyncRoute, AppError, parseObjectId, requireContext } from "../utils/http.js";
import { validateQuery } from "../middleware/validate.js";
import { getPagination, getPaginationSkip, paginationMeta } from "../utils/pagination.js";

export const notificationsRouter = Router();

const notificationListQuerySchema = z.object({
  unread: z.coerce.boolean().optional(),
  type: z.string().trim().min(1).max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

notificationsRouter.get(
  "/",
  validateQuery(notificationListQuerySchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const { unread, type, page, pageSize } = req.query as z.infer<typeof notificationListQuerySchema>;
    const pagination = getPagination({ page, pageSize });

    const filter: Record<string, unknown> = { workspaceId: context.workspaceId, userId: context.userId };
    if (unread) filter.readAt = null;
    if (type) filter.type = type;

    const [notifications, total] = await Promise.all([
      NotificationModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(getPaginationSkip(pagination))
        .limit(pagination.pageSize)
        .lean(),
      NotificationModel.countDocuments(filter),
    ]);

    res.json({ notifications, pagination: paginationMeta(pagination.page, pagination.pageSize, total) });
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
