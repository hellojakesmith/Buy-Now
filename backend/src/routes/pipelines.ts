import { Router } from "express";
import { z } from "zod";
import { PipelineModel } from "../models/Pipeline.js";
import { asyncRoute, AppError, parseObjectId, requireContext } from "../utils/http.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { getPagination, getPaginationSkip, paginationMeta } from "../utils/pagination.js";

export const pipelinesRouter = Router();

const pipelineListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

const pipelineBodySchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  stages: z.array(z.unknown()).max(100).optional(),
  isDefault: z.boolean().optional(),
});

const pipelinePatchSchema = pipelineBodySchema.partial();

pipelinesRouter.get(
  "/",
  validateQuery(pipelineListQuerySchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const { page, pageSize } = req.query as z.infer<typeof pipelineListQuerySchema>;
    const pagination = getPagination({ page, pageSize });
    const filter = { workspaceId: context.workspaceId };
    const [pipelines, total] = await Promise.all([
      PipelineModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(getPaginationSkip(pagination))
        .limit(pagination.pageSize)
        .lean(),
      PipelineModel.countDocuments(filter),
    ]);
    res.json({ pipelines, pagination: paginationMeta(pagination.page, pagination.pageSize, total) });
  }),
);

pipelinesRouter.post(
  "/",
  validateBody(pipelineBodySchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const pipeline = await PipelineModel.create({
      workspaceId: context.workspaceId,
      ownerUserId: context.userId,
      name: req.body.name ?? "Sales Pipeline",
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
  validateBody(pipelinePatchSchema),
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
