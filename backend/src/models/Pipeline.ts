import mongoose, { Schema, model, type InferSchemaType } from "mongoose";
import { sharedSchemaOptions, objectId } from "./base.js";

const PipelineStageSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    color: { type: String, default: "#0325D9" },
    position: { type: Number, required: true },
    isWon: { type: Boolean, default: false },
    isLost: { type: Boolean, default: false },
  },
  { _id: false },
);

const PipelineSchema = new Schema(
  {
    workspaceId: { type: objectId, ref: "Workspace", required: true, index: true },
    ownerUserId: { type: objectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    stages: { type: [PipelineStageSchema], default: [] },
    isDefault: { type: Boolean, default: true },
  },
  sharedSchemaOptions,
);

PipelineSchema.index({ workspaceId: 1, isDefault: 1 });

export type Pipeline = InferSchemaType<typeof PipelineSchema>;
export const PipelineModel = mongoose.models.Pipeline || model("Pipeline", PipelineSchema);
