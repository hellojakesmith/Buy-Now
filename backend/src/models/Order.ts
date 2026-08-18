import mongoose, { Schema, model, type InferSchemaType } from "mongoose";
import { sharedSchemaOptions, objectId } from "./base.js";

const OrderSchema = new Schema(
  {
    workspaceId: { type: objectId, ref: "Workspace", required: true, index: true },
    productId: { type: objectId, ref: "Product", required: true, index: true },
    contactId: { type: objectId, ref: "Contact", index: true },
    pageId: { type: objectId, ref: "Page", index: true },
    orderNumber: { type: String, required: true, trim: true },
    status: { type: String, enum: ["pending", "paid", "refunded", "failed"], default: "pending", index: true },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    paymentProvider: { type: String, default: "stripe" },
    paidAt: { type: Date },
    billing: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      addressLine1: { type: String },
      addressLine2: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
  },
  sharedSchemaOptions,
);

OrderSchema.index({ workspaceId: 1, orderNumber: 1 }, { unique: true });
OrderSchema.index({ workspaceId: 1, status: 1, paidAt: -1 });

export type Order = InferSchemaType<typeof OrderSchema>;
export const OrderModel = mongoose.models.Order || model("Order", OrderSchema);
