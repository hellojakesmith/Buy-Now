import { PipelineModel } from "../models/Pipeline.js";
import { defaultPipelineStages } from "./defaults.js";

export async function ensureDefaultPipeline(workspaceId: string, ownerUserId: string) {
  const existing = await PipelineModel.findOne({ workspaceId, isDefault: true });
  if (existing) {
    return existing;
  }

  return PipelineModel.create({
    workspaceId,
    ownerUserId,
    name: "Sales Pipeline",
    isDefault: true,
    stages: defaultPipelineStages,
  });
}
