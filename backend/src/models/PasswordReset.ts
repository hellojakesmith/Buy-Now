import mongoose, { Schema, model, type InferSchemaType } from "mongoose";
import { sharedSchemaOptions, objectId } from "./base.js";

const PasswordResetSchema = new Schema(
  {
    userId: { type: objectId, ref: "User", required: true, index: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    usedAt: { type: Date },
  },
  sharedSchemaOptions,
);

PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type PasswordReset = InferSchemaType<typeof PasswordResetSchema>;
export const PasswordResetModel = mongoose.models.PasswordReset || model("PasswordReset", PasswordResetSchema);
