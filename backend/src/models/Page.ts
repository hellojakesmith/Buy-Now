import mongoose, { Schema, model, type InferSchemaType } from "mongoose";
import { sharedSchemaOptions, objectId } from "./base.js";

const PageSchema = new Schema(
  {
    workspaceId: { type: objectId, ref: "Workspace", required: true, index: true },
    ownerUserId: { type: objectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["landing", "buy-now"], required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    seo: {
      title: { type: String },
      description: { type: String },
      ogImageAssetId: { type: objectId, ref: "MediaAsset" },
    },
    sections: { type: Schema.Types.Mixed, default: [] },
    publishedUrl: { type: String },
  },
  sharedSchemaOptions,
);

PageSchema.index({ workspaceId: 1, slug: 1 }, { unique: true });

export type Page = InferSchemaType<typeof PageSchema>;
export const PageModel = mongoose.models.Page || model("Page", PageSchema);
