import { Router } from "express";
import { z } from "zod";
import { OrderModel } from "../models/Order.js";
import { ContactModel } from "../models/Contact.js";
import { ProductModel } from "../models/Product.js";
import { asyncRoute, AppError, parseObjectId, requireContext } from "../utils/http.js";
import { createActivity } from "../services/activities.js";
import { createNotification } from "../services/notifications.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { getPagination, getPaginationSkip, paginationMeta } from "../utils/pagination.js";

export const ordersRouter = Router();

const orderListQuerySchema = z.object({
  status: z.string().trim().max(50).optional(),
  contactId: z.string().trim().optional(),
  productId: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

const partySchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  email: z.string().trim().email().max(320).optional(),
  phone: z.string().trim().max(50).optional(),
}).optional();

const orderBodySchema = z.object({
  productId: z.string().trim().min(1),
  contactId: z.string().trim().optional(),
  pageId: z.string().trim().optional(),
  orderNumber: z.string().trim().max(100).optional(),
  status: z.string().trim().max(50).optional(),
  subtotal: z.coerce.number().finite().min(0).max(1000000000).optional(),
  tax: z.coerce.number().finite().min(0).max(1000000000).optional(),
  shipping: z.coerce.number().finite().min(0).max(1000000000).optional(),
  discount: z.coerce.number().finite().min(0).max(1000000000).optional(),
  total: z.coerce.number().finite().min(0).max(1000000000).optional(),
  currency: z.string().trim().length(3).toUpperCase().optional(),
  paymentProvider: z.string().trim().max(50).optional(),
  paidAt: z.coerce.date().optional(),
  billing: z.record(z.unknown()).optional(),
  customer: partySchema,
});

const orderPatchSchema = orderBodySchema.partial();

ordersRouter.get(
  "/",
  validateQuery(orderListQuerySchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const { status, contactId, productId, page, pageSize } = req.query as z.infer<typeof orderListQuerySchema>;
    const pagination = getPagination({ page, pageSize });
    const filter: Record<string, unknown> = { workspaceId: context.workspaceId };
    if (status) filter.status = status;
    if (contactId) filter.contactId = parseObjectId(contactId, "contact id");
    if (productId) filter.productId = parseObjectId(productId, "product id");

    const [orders, total] = await Promise.all([
      OrderModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(getPaginationSkip(pagination))
        .limit(pagination.pageSize)
        .lean(),
      OrderModel.countDocuments(filter),
    ]);
    res.json({ orders, pagination: paginationMeta(pagination.page, pagination.pageSize, total) });
  }),
);

ordersRouter.post(
  "/",
  validateBody(orderBodySchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const product = await ProductModel.findOne({ _id: parseObjectId(req.body.productId, "product id"), workspaceId: context.workspaceId });
    if (!product) throw new AppError(404, "Product not found");

    const contact = req.body.contactId
      ? await ContactModel.findOne({ _id: parseObjectId(req.body.contactId, "contact id"), workspaceId: context.workspaceId })
      : await ContactModel.create({
          workspaceId: context.workspaceId,
          ownerUserId: context.userId,
          name: req.body.customer?.name ?? req.body.billing?.name ?? "Customer",
          email: req.body.customer?.email ?? req.body.billing?.email,
          phone: req.body.customer?.phone ?? req.body.billing?.phone,
          kind: "customer",
          status: "won",
          source: "checkout",
        });

    if (!contact) throw new AppError(404, "Contact not found");

    const order = await OrderModel.create({
      workspaceId: context.workspaceId,
      productId: product._id,
      contactId: contact._id,
      pageId: req.body.pageId,
      orderNumber: req.body.orderNumber ?? `ORD-${Date.now()}`,
      status: req.body.status ?? "pending",
      subtotal: req.body.subtotal ?? product.price,
      tax: req.body.tax ?? 0,
      shipping: req.body.shipping ?? 0,
      discount: req.body.discount ?? 0,
      total: req.body.total ?? product.price,
      currency: req.body.currency ?? product.currency,
      paymentProvider: req.body.paymentProvider ?? "stripe",
      paidAt: req.body.paidAt,
      billing: req.body.billing ?? {},
    });

    await createActivity({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      contactId: String(contact._id),
      orderId: String(order._id),
      type: order.status === "paid" ? "payment" : "system",
      title: order.status === "paid" ? "Payment received" : "Order created",
      body: `${product.name} - ${order.total}`,
    });

    await createNotification({
      workspaceId: context.workspaceId,
      userId: context.userId,
      type: "order",
      title: "New order",
      body: `${contact.name} ordered ${product.name}`,
      link: `/orders/${order._id}`,
      payload: { orderId: String(order._id), productId: String(product._id) },
    });

    res.status(201).json({ order });
  }),
);

ordersRouter.get(
  "/:id",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const order = await OrderModel.findOne({ _id: parseObjectId(String(req.params.id), "order id"), workspaceId: context.workspaceId }).lean();
    if (!order) throw new AppError(404, "Order not found");
    res.json({ order });
  }),
);

ordersRouter.patch(
  "/:id",
  validateBody(orderPatchSchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const order = await OrderModel.findOneAndUpdate(
      { _id: parseObjectId(String(req.params.id), "order id"), workspaceId: context.workspaceId },
      { ...req.body, workspaceId: context.workspaceId, ...(req.body.productId ? { productId: parseObjectId(req.body.productId, "product id") } : {}), ...(req.body.contactId ? { contactId: parseObjectId(req.body.contactId, "contact id") } : {}) },
      { new: true },
    );
    if (!order) throw new AppError(404, "Order not found");
    res.json({ order });
  }),
);
