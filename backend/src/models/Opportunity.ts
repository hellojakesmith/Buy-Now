import mongoose, { Schema, model, type InferSchemaType } from "mongoose";
import { sharedSchemaOptions, objectId } from "./base.js";

const OpportunitySchema = new Schema(
  {
    workspaceId: { type: objectId, ref: "Workspace", required: true, index: true },
    pipelineId: { type: objectId, ref: "Pipeline", required: true, index: true },
    contactId: { type: objectId, ref: "Contact", required: true, index: true },
    ownerUserId: { type: objectId, ref: "User", index: true },
    title: { type: String, required: true, trim: true },
    value: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    stageKey: { type: String, required: true, index: true },
    status: { type: String, enum: ["open", "won", "lost"], default: "open", index: true },
    source: { type: String },
    closeDate: { type: Date },
    probability: { type: Number, min: 0, max: 100, default: 0 },
    notes: [{ type: objectId, ref: "Activity" }],
    tags: [{ type: String, trim: true, lowercase: true }],
    archivedAt: { type: Date },
  },
  sharedSchemaOptions,
);

OpportunitySchema.index({ workspaceId: 1, pipelineId: 1, stageKey: 1, status: 1 });
OpportunitySchema.index({ workspaceId: 1, contactId: 1 });

export type Opportunity = InferSchemaType<typeof OpportunitySchema>;
export const OpportunityModel = mongoose.models.Opportunity || model("Opportunity", OpportunitySchema);
