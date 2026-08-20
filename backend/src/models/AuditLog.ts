import mongoose, { Schema, model, type InferSchemaType } from "mongoose";
import { sharedSchemaOptions, objectId } from "./base.js";

const AuditLogSchema = new Schema(
  {
    workspaceId: { type: objectId, ref: "Workspace", required: true, index: true },
    actorUserId: { type: objectId, ref: "User", required: true, index: true },
    action: { type: String, required: true, trim: true },
    targetType: { type: String, required: true, trim: true },
    targetId: { type: String, required: true, trim: true },
    payload: { type: Schema.Types.Mixed },
  },
  sharedSchemaOptions,
);

AuditLogSchema.index({ workspaceId: 1, createdAt: -1 });

export type AuditLog = InferSchemaType<typeof AuditLogSchema>;
export const AuditLogModel = mongoose.models.AuditLog || model("AuditLog", AuditLogSchema);
