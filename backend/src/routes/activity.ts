import { Router } from "express";
import { z } from "zod";
import { ActivityModel } from "../models/Activity.js";
import { asyncRoute, requireContext, parseObjectId } from "../utils/http.js";
import { validateQuery } from "../middleware/validate.js";
import { getPagination, getPaginationSkip, paginationMeta } from "../utils/pagination.js";

export const activityRouter = Router();

const activityListQuerySchema = z.object({
  contactId: z.string().trim().min(1).max(100).optional(),
  opportunityId: z.string().trim().min(1).max(100).optional(),
  orderId: z.string().trim().min(1).max(100).optional(),
  type: z.enum(["note", "status_change", "submission", "payment", "task", "system"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

activityRouter.get(
  "/",
  validateQuery(activityListQuerySchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const { contactId, opportunityId, orderId, type, page, pageSize } = req.query as z.infer<typeof activityListQuerySchema>;
    const pagination = getPagination({ page, pageSize });

    const filter: Record<string, unknown> = { workspaceId: context.workspaceId };
    if (contactId) filter.contactId = parseObjectId(contactId, "contact id");
    if (opportunityId) filter.opportunityId = parseObjectId(opportunityId, "opportunity id");
    if (orderId) filter.orderId = parseObjectId(orderId, "order id");
    if (type) filter.type = type;

    const [activities, total] = await Promise.all([
      ActivityModel.find(filter)
        .sort({ occurredAt: -1, createdAt: -1 })
        .skip(getPaginationSkip(pagination))
        .limit(pagination.pageSize)
        .lean(),
      ActivityModel.countDocuments(filter),
    ]);

    res.json({ activities, pagination: paginationMeta(pagination.page, pagination.pageSize, total) });
  }),
);
