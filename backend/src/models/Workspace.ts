import mongoose, { Schema, model, type InferSchemaType } from "mongoose";
import { sharedSchemaOptions, objectId } from "./base.js";

const WorkspaceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    ownerUserId: { type: objectId, ref: "User", required: true, index: true },
    plan: { type: String, default: "pro" },
    settings: {
      brandColor: { type: String, default: "#0325D9" },
      currency: { type: String, default: "USD" },
      timezone: { type: String, default: "America/Chicago" },
    },
  },
  sharedSchemaOptions,
);

WorkspaceSchema.index({ ownerUserId: 1, slug: 1 }, { unique: true });

export type Workspace = InferSchemaType<typeof WorkspaceSchema>;
export const WorkspaceModel = mongoose.models.Workspace || model("Workspace", WorkspaceSchema);
