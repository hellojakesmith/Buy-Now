import { Router } from "express";
import { z } from "zod";
import { OpportunityModel } from "../models/Opportunity.js";
import { asyncRoute, AppError, parseObjectId, requireContext } from "../utils/http.js";
import { createActivity } from "../services/activities.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { getPagination, getPaginationSkip, paginationMeta } from "../utils/pagination.js";

export const opportunitiesRouter = Router();

const opportunityListQuerySchema = z.object({
  stageKey: z.string().trim().max(100).optional(),
  status: z.string().trim().max(50).optional(),
  contactId: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

const opportunityBodySchema = z.object({
  pipelineId: z.string().trim().min(1).max(100),
  contactId: z.string().trim().min(1).max(100),
  ownerUserId: z.string().trim().max(100).optional(),
  title: z.string().trim().min(1).max(200).optional(),
  value: z.coerce.number().finite().min(0).max(1000000000).optional(),
  currency: z.string().trim().length(3).toUpperCase().optional(),
  stageKey: z.string().trim().max(100).optional(),
  status: z.string().trim().max(50).optional(),
  source: z.string().trim().max(100).optional(),
  closeDate: z.coerce.date().optional(),
  probability: z.coerce.number().min(0).max(100).optional(),
  tags: z.array(z.string().trim().max(100)).max(50).optional(),
});

const opportunityPatchSchema = opportunityBodySchema.partial();

opportunitiesRouter.get(
  "/",
  validateQuery(opportunityListQuerySchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const { stageKey, status, contactId, page, pageSize } = req.query as z.infer<typeof opportunityListQuerySchema>;
    const pagination = getPagination({ page, pageSize });
    const filter: Record<string, unknown> = { workspaceId: context.workspaceId };
    if (stageKey) filter.stageKey = stageKey;
    if (status) filter.status = status;
    if (contactId) filter.contactId = parseObjectId(contactId, "contact id");

    const [opportunities, total] = await Promise.all([
      OpportunityModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(getPaginationSkip(pagination))
        .limit(pagination.pageSize)
        .lean(),
      OpportunityModel.countDocuments(filter),
    ]);
    res.json({ opportunities, pagination: paginationMeta(pagination.page, pagination.pageSize, total) });
  }),
);

opportunitiesRouter.post(
  "/",
  validateBody(opportunityBodySchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const opportunity = await OpportunityModel.create({
      workspaceId: context.workspaceId,
      pipelineId: req.body.pipelineId,
      contactId: parseObjectId(req.body.contactId, "contact id"),
      ownerUserId: req.body.ownerUserId ?? context.userId,
      title: req.body.title ?? "New Opportunity",
      value: req.body.value ?? 0,
      currency: req.body.currency ?? "USD",
      stageKey: req.body.stageKey ?? "new",
      status: req.body.status ?? "open",
      source: req.body.source,
      closeDate: req.body.closeDate,
      probability: req.body.probability,
      tags: req.body.tags ?? [],
    });

    await createActivity({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      contactId: String(opportunity.contactId),
      opportunityId: String(opportunity._id),
      type: "system",
      title: "Opportunity created",
      body: opportunity.title,
    });

    res.status(201).json({ opportunity });
  }),
);

opportunitiesRouter.patch(
  "/:id",
  validateBody(opportunityPatchSchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const update = {
      ...req.body,
      workspaceId: context.workspaceId,
      ...(req.body.contactId ? { contactId: parseObjectId(req.body.contactId, "contact id") } : {}),
      ownerUserId: req.body.ownerUserId ?? context.userId,
    };
    const opportunity = await OpportunityModel.findOneAndUpdate(
      { _id: parseObjectId(String(req.params.id), "opportunity id"), workspaceId: context.workspaceId },
      update,
      { new: true },
    );
    if (!opportunity) throw new AppError(404, "Opportunity not found");
    res.json({ opportunity });
  }),
);

opportunitiesRouter.delete(
  "/:id",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const opportunity = await OpportunityModel.findOneAndDelete({ _id: parseObjectId(String(req.params.id), "opportunity id"), workspaceId: context.workspaceId });
    if (!opportunity) throw new AppError(404, "Opportunity not found");
    res.status(204).send();
  }),
);
