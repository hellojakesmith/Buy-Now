import mongoose, { Schema, model, type InferSchemaType } from "mongoose";
import { sharedSchemaOptions, objectId } from "./base.js";

const FormFieldSchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ["text", "email", "phone", "textarea", "select", "checkbox", "date"] },
    required: { type: Boolean, default: false },
    options: [{ type: String }],
    placeholder: { type: String },
    helpText: { type: String },
    order: { type: Number, required: true },
  },
  { _id: false },
);

const FormSchema = new Schema(
  {
    workspaceId: { type: objectId, ref: "Workspace", required: true, index: true },
    ownerUserId: { type: objectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    description: { type: String },
    successMessage: { type: String, default: "Thanks — we received your details." },
    fields: { type: [FormFieldSchema], default: [] },
    submitAction: {
      createContact: { type: Boolean, default: true },
      createOpportunity: { type: Boolean, default: false },
      pipelineStage: { type: String, default: "new" },
    },
    publishSettings: {
      path: { type: String, trim: true },
      qrCodeEnabled: { type: Boolean, default: true },
      embedEnabled: { type: Boolean, default: true },
    },
    stats: {
      views: { type: Number, default: 0 },
      starts: { type: Number, default: 0 },
      submissions: { type: Number, default: 0 },
    },
  },
  sharedSchemaOptions,
);

FormSchema.index({ workspaceId: 1, slug: 1 }, { unique: true });
FormSchema.index({ slug: 1, status: 1 });

export type Form = InferSchemaType<typeof FormSchema>;
export const FormModel = mongoose.models.Form || model("Form", FormSchema);
