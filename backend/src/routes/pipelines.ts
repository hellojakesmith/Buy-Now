import { Router } from "express";
import { PipelineModel } from "../models/Pipeline.js";
import { asyncRoute, AppError, parseObjectId, requireContext } from "../utils/http.js";

export const pipelinesRouter = Router();

pipelinesRouter.get(
  "/",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const pipelines = await PipelineModel.find({ workspaceId: context.workspaceId }).sort({ createdAt: -1 }).lean();
    res.json({ pipelines });
  }),
);

pipelinesRouter.post(
  "/",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const pipeline = await PipelineModel.create({
      workspaceId: context.workspaceId,
      ownerUserId: context.userId,
      name: String(req.body.name ?? "Sales Pipeline"),
      stages: req.body.stages ?? [],
      isDefault: Boolean(req.body.isDefault ?? false),
    });
    res.status(201).json({ pipeline });
  }),
);

pipelinesRouter.get(
  "/:id",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const pipeline = await PipelineModel.findOne({ _id: parseObjectId(String(req.params.id), "pipeline id"), workspaceId: context.workspaceId }).lean();
    if (!pipeline) throw new AppError(404, "Pipeline not found");
    res.json({ pipeline });
  }),
);

pipelinesRouter.patch(
  "/:id",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const pipeline = await PipelineModel.findOneAndUpdate(
      { _id: parseObjectId(String(req.params.id), "pipeline id"), workspaceId: context.workspaceId },
      { ...req.body, workspaceId: context.workspaceId, ownerUserId: context.userId },
      { new: true },
    );
    if (!pipeline) throw new AppError(404, "Pipeline not found");
    res.json({ pipeline });
  }),
);

pipelinesRouter.delete(
  "/:id",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const pipeline = await PipelineModel.findOneAndDelete({ _id: parseObjectId(String(req.params.id), "pipeline id"), workspaceId: context.workspaceId });
    if (!pipeline) throw new AppError(404, "Pipeline not found");
    res.status(204).send();
  }),
);
