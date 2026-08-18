import mongoose, { Schema, model, type InferSchemaType } from "mongoose";
import { sharedSchemaOptions, objectId } from "./base.js";

const ProductSchema = new Schema(
  {
    workspaceId: { type: objectId, ref: "Workspace", required: true, index: true },
    ownerUserId: { type: objectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    imageAssetId: { type: objectId, ref: "MediaAsset" },
    status: { type: String, enum: ["draft", "active", "archived"], default: "draft" },
    inventory: { type: Number, default: 0 },
    checkoutSettings: {
      requirePhone: { type: Boolean, default: false },
      collectAddress: { type: Boolean, default: false },
      allowQuantity: { type: Boolean, default: false },
    },
  },
  sharedSchemaOptions,
);

ProductSchema.index({ workspaceId: 1, slug: 1 }, { unique: true });

export type Product = InferSchemaType<typeof ProductSchema>;
export const ProductModel = mongoose.models.Product || model("Product", ProductSchema);
