import mongoose, { Schema, model, type InferSchemaType } from "mongoose";
import { sharedSchemaOptions, objectId } from "./base.js";

const NotificationSchema = new Schema(
  {
    workspaceId: { type: objectId, ref: "Workspace", required: true, index: true },
    userId: { type: objectId, ref: "User", required: true, index: true },
    type: { type: String, required: true, index: true },
    title: { type: String, required: true },
    body: { type: String },
    readAt: { type: Date },
    link: { type: String },
    payload: { type: Schema.Types.Mixed },
  },
  sharedSchemaOptions,
);

NotificationSchema.index({ workspaceId: 1, userId: 1, readAt: 1 });
NotificationSchema.index({ workspaceId: 1, userId: 1, createdAt: -1 });

export type Notification = InferSchemaType<typeof NotificationSchema>;
export const NotificationModel = mongoose.models.Notification || model("Notification", NotificationSchema);
