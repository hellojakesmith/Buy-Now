import { Router } from "express";
import { ContactModel } from "../models/Contact.js";
import { OpportunityModel } from "../models/Opportunity.js";
import { OrderModel } from "../models/Order.js";
import { FormSubmissionModel } from "../models/FormSubmission.js";
import { ProductModel } from "../models/Product.js";
import { PageModel } from "../models/Page.js";
import { NotificationModel } from "../models/Notification.js";
import { asyncRoute, parseObjectId, requireContext } from "../utils/http.js";

export const dashboardRouter = Router();

dashboardRouter.get(
  "/summary",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const [contacts, opportunities, orders, submissions, products, pages, notifications] = await Promise.all([
      ContactModel.countDocuments({ workspaceId: context.workspaceId }),
      OpportunityModel.countDocuments({ workspaceId: context.workspaceId }),
      OrderModel.countDocuments({ workspaceId: context.workspaceId }),
      FormSubmissionModel.countDocuments({ workspaceId: context.workspaceId }),
      ProductModel.countDocuments({ workspaceId: context.workspaceId }),
      PageModel.countDocuments({ workspaceId: context.workspaceId }),
      NotificationModel.countDocuments({ workspaceId: context.workspaceId, userId: context.userId, readAt: null }),
    ]);

    const revenueAgg = await OrderModel.aggregate([
      { $match: { workspaceId: parseObjectId(context.workspaceId, "workspace id"), status: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    res.json({
      counts: { contacts, opportunities, orders, submissions, products, pages, notifications },
      revenue: revenueAgg[0]?.total ?? 0,
    });
  }),
);
