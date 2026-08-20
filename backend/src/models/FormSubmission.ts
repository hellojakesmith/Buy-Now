import mongoose, { Schema, model, type InferSchemaType } from "mongoose";
import { sharedSchemaOptions, objectId } from "./base.js";

const FormSubmissionSchema = new Schema(
  {
    workspaceId: { type: objectId, ref: "Workspace", required: true, index: true },
    formId: { type: objectId, ref: "Form", required: true, index: true },
    contactId: { type: objectId, ref: "Contact", index: true },
    email: { type: String, trim: true, lowercase: true, index: true },
    sourceUrl: { type: String },
    submittedAt: { type: Date, default: Date.now, index: true },
    answers: { type: Schema.Types.Mixed, required: true },
    metadata: {
      ip: { type: String },
      userAgent: { type: String },
      utmSource: { type: String },
      utmMedium: { type: String },
      utmCampaign: { type: String },
    },
    status: { type: String, enum: ["new", "processed", "ignored", "duplicate"], default: "new" },
    duplicateOfId: { type: objectId, ref: "FormSubmission" },
  },
  sharedSchemaOptions,
);

FormSubmissionSchema.index({ workspaceId: 1, formId: 1, submittedAt: -1 });
FormSubmissionSchema.index({ formId: 1, email: 1, submittedAt: -1 });

export type FormSubmission = InferSchemaType<typeof FormSubmissionSchema>;
export const FormSubmissionModel = mongoose.models.FormSubmission || model("FormSubmission", FormSubmissionSchema);
