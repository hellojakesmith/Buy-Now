import mongoose, { Schema, model, type InferSchemaType } from "mongoose";
import { sharedSchemaOptions, objectId } from "./base.js";

const MediaAssetSchema = new Schema(
  {
    workspaceId: { type: objectId, ref: "Workspace", required: true, index: true },
    ownerUserId: { type: objectId, ref: "User", required: true, index: true },
    gridFsFileId: { type: objectId, required: true, index: true },
    kind: { type: String, enum: ["image", "video"], required: true, index: true },
    purpose: {
      type: String,
      enum: ["product", "page", "form", "avatar", "marketing", "other"],
      default: "other",
      index: true,
    },
    relatedEntityType: { type: String, index: true },
    relatedEntityId: { type: objectId, index: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true, min: 0 },
    width: { type: Number },
    height: { type: Number },
    durationSeconds: { type: Number },
    altText: { type: String },
    caption: { type: String },
    status: { type: String, enum: ["ready", "processing", "failed"], default: "ready" },
  },
  sharedSchemaOptions,
);

MediaAssetSchema.index({ workspaceId: 1, purpose: 1, createdAt: -1 });

export type MediaAsset = InferSchemaType<typeof MediaAssetSchema>;
export const MediaAssetModel = mongoose.models.MediaAsset || model("MediaAsset", MediaAssetSchema);
