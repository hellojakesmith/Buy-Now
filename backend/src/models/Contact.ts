import mongoose, { Schema, model, type InferSchemaType } from "mongoose";
import { sharedSchemaOptions, objectId } from "./base.js";

const ContactSchema = new Schema(
  {
    workspaceId: { type: objectId, ref: "Workspace", required: true, index: true },
    ownerUserId: { type: objectId, ref: "User", index: true },
    source: { type: String, default: "manual" },
    kind: { type: String, enum: ["lead", "contact", "customer"], default: "lead" },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "proposal", "won", "lost"],
      default: "new",
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, index: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    interest: { type: String, trim: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    customFields: [{ key: String, value: Schema.Types.Mixed }],
    lastActivityAt: { type: Date },
    archivedAt: { type: Date },
  },
  sharedSchemaOptions,
);

ContactSchema.index({ workspaceId: 1, email: 1 });
ContactSchema.index({ workspaceId: 1, status: 1, lastActivityAt: -1 });

export type Contact = InferSchemaType<typeof ContactSchema>;
export const ContactModel = mongoose.models.Contact || model("Contact", ContactSchema);
