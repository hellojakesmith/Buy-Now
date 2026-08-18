import { Router } from "express";
import { OrderModel } from "../models/Order.js";
import { ContactModel } from "../models/Contact.js";
import { ProductModel } from "../models/Product.js";
import { asyncRoute, AppError, parseObjectId, requireContext } from "../utils/http.js";
import { createActivity } from "../services/activities.js";
import { createNotification } from "../services/notifications.js";

export const ordersRouter = Router();

ordersRouter.get(
  "/",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const orders = await OrderModel.find({ workspaceId: context.workspaceId }).sort({ createdAt: -1 }).lean();
    res.json({ orders });
  }),
);

ordersRouter.post(
  "/",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const product = await ProductModel.findOne({ _id: parseObjectId(String(req.body.productId), "product id"), workspaceId: context.workspaceId });
    if (!product) throw new AppError(404, "Product not found");

    const contact = req.body.contactId
      ? await ContactModel.findOne({ _id: parseObjectId(String(req.body.contactId), "contact id"), workspaceId: context.workspaceId })
      : await ContactModel.create({
          workspaceId: context.workspaceId,
          ownerUserId: context.userId,
          name: String(req.body.customer?.name ?? req.body.billing?.name ?? "Customer"),
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
      orderNumber: String(req.body.orderNumber ?? `ORD-${Date.now()}`),
      status: req.body.status ?? "pending",
      subtotal: Number(req.body.subtotal ?? product.price),
      tax: Number(req.body.tax ?? 0),
      shipping: Number(req.body.shipping ?? 0),
      discount: Number(req.body.discount ?? 0),
      total: Number(req.body.total ?? product.price),
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
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const order = await OrderModel.findOneAndUpdate(
      { _id: parseObjectId(String(req.params.id), "order id"), workspaceId: context.workspaceId },
      { ...req.body, workspaceId: context.workspaceId },
      { new: true },
    );
    if (!order) throw new AppError(404, "Order not found");
    res.json({ order });
  }),
);
