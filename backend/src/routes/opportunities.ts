import { Router } from "express";
import { OpportunityModel } from "../models/Opportunity.js";
import { asyncRoute, AppError, parseObjectId, requireContext } from "../utils/http.js";
import { createActivity } from "../services/activities.js";

export const opportunitiesRouter = Router();

opportunitiesRouter.get(
  "/",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const { stageKey, status, contactId } = req.query;
    const filter: Record<string, unknown> = { workspaceId: context.workspaceId };
    if (stageKey) filter.stageKey = String(stageKey);
    if (status) filter.status = String(status);
    if (contactId) filter.contactId = parseObjectId(String(contactId), "contact id");
    const opportunities = await OpportunityModel.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ opportunities });
  }),
);

opportunitiesRouter.post(
  "/",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const opportunity = await OpportunityModel.create({
      workspaceId: context.workspaceId,
      pipelineId: req.body.pipelineId,
      contactId: req.body.contactId,
      ownerUserId: req.body.ownerUserId ?? context.userId,
      title: String(req.body.title ?? "New Opportunity"),
      value: Number(req.body.value ?? 0),
      currency: req.body.currency ?? "USD",
      stageKey: String(req.body.stageKey ?? "new"),
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
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const opportunity = await OpportunityModel.findOneAndUpdate(
      { _id: parseObjectId(String(req.params.id), "opportunity id"), workspaceId: context.workspaceId },
      { ...req.body, workspaceId: context.workspaceId, ownerUserId: req.body.ownerUserId ?? context.userId },
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
