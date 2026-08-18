import mongoose, { Schema, model, type InferSchemaType } from "mongoose";
import { sharedSchemaOptions, objectId } from "./base.js";

const UserSchema = new Schema(
  {
    workspaceId: { type: objectId, ref: "Workspace", required: true, index: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["owner", "admin", "member"], default: "owner" },
    avatarUrl: { type: String },
    lastLoginAt: { type: Date },
    authProvider: { type: String, default: "email" },
    authProviderUserId: { type: String },
  },
  sharedSchemaOptions,
);

UserSchema.index({ workspaceId: 1, email: 1 }, { unique: true });

export type User = InferSchemaType<typeof UserSchema>;
export const UserModel = mongoose.models.User || model("User", UserSchema);
