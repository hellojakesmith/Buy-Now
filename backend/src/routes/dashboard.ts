import { Router } from "express";
import { z } from "zod";
import { ContactModel } from "../models/Contact.js";
import { OpportunityModel } from "../models/Opportunity.js";
import { OrderModel } from "../models/Order.js";
import { FormSubmissionModel } from "../models/FormSubmission.js";
import { ProductModel } from "../models/Product.js";
import { PageModel } from "../models/Page.js";
import { NotificationModel } from "../models/Notification.js";
import { asyncRoute, parseObjectId, requireContext } from "../utils/http.js";
import { validateQuery } from "../middleware/validate.js";

export const dashboardRouter = Router();

const summaryQuerySchema = z.object({
  range: z.enum(["today", "7d", "30d", "90d", "all"]).default("all"),
});

function rangeToSince(range: string): Date | null {
  const now = new Date();
  switch (range) {
    case "today":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case "90d":
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case "all":
    default:
      return null;
  }
}

dashboardRouter.get(
  "/summary",
  validateQuery(summaryQuerySchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const { range } = req.query as z.infer<typeof summaryQuerySchema>;
    const since = rangeToSince(range);

    const dateFilter = since
      ? { workspaceId: context.workspaceId, createdAt: { $gte: since } }
      : { workspaceId: context.workspaceId };

    const [contacts, opportunities, orders, submissions, products, pages, notifications] = await Promise.all([
      ContactModel.countDocuments(dateFilter),
      OpportunityModel.countDocuments(dateFilter),
      OrderModel.countDocuments(dateFilter),
      FormSubmissionModel.countDocuments(dateFilter),
      ProductModel.countDocuments(dateFilter),
      PageModel.countDocuments(dateFilter),
      NotificationModel.countDocuments({ workspaceId: context.workspaceId, userId: context.userId, readAt: null }),
    ]);

    const revenueMatch = since
      ? { workspaceId: parseObjectId(context.workspaceId, "workspace id"), status: "paid", paidAt: { $gte: since } }
      : { workspaceId: parseObjectId(context.workspaceId, "workspace id"), status: "paid" };

    const revenueAgg = await OrderModel.aggregate([
      { $match: revenueMatch },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    res.json({
      counts: { contacts, opportunities, orders, submissions, products, pages, notifications },
      revenue: revenueAgg[0]?.total ?? 0,
      range,
    });
  }),
);
