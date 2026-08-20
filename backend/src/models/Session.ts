import mongoose, { Schema, model, type InferSchemaType } from "mongoose";
import { sharedSchemaOptions, objectId } from "./base.js";

const SessionSchema = new Schema(
  {
    userId: { type: objectId, ref: "User", required: true, index: true },
    workspaceId: { type: objectId, ref: "Workspace", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    userAgent: { type: String, maxlength: 500 },
    ipAddress: { type: String, maxlength: 100 },
  },
  sharedSchemaOptions,
);

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type Session = InferSchemaType<typeof SessionSchema>;
export const SessionModel = mongoose.models.Session || model("Session", SessionSchema);
