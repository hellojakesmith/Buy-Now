import mongoose, { Schema, model, type InferSchemaType } from "mongoose";
import { sharedSchemaOptions, objectId } from "./base.js";

const ActivitySchema = new Schema(
  {
    workspaceId: { type: objectId, ref: "Workspace", required: true, index: true },
    actorUserId: { type: objectId, ref: "User", index: true },
    contactId: { type: objectId, ref: "Contact", index: true },
    opportunityId: { type: objectId, ref: "Opportunity", index: true },
    orderId: { type: objectId, ref: "Order", index: true },
    type: {
      type: String,
      enum: ["note", "status_change", "submission", "payment", "task", "system"],
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    body: { type: String },
    payload: { type: Schema.Types.Mixed },
    occurredAt: { type: Date, default: Date.now, index: true },
  },
  sharedSchemaOptions,
);

ActivitySchema.index({ workspaceId: 1, occurredAt: -1 });

export type Activity = InferSchemaType<typeof ActivitySchema>;
export const ActivityModel = mongoose.models.Activity || model("Activity", ActivitySchema);
