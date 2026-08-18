import { Router } from "express";
import { FormModel } from "../models/Form.js";
import { asyncRoute, AppError, parseObjectId, requireContext, normalizeSlug } from "../utils/http.js";
import { processFormSubmission } from "../services/forms.js";

export const formsRouter = Router();

formsRouter.get(
  "/",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const forms = await FormModel.find({ workspaceId: context.workspaceId }).sort({ createdAt: -1 }).lean();
    res.json({ forms });
  }),
);

formsRouter.post(
  "/",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const name = String(req.body.name ?? "").trim();
    if (!name) throw new AppError(400, "name is required");

    const slug = normalizeSlug(String(req.body.slug ?? name));

    const form = await FormModel.create({
      workspaceId: context.workspaceId,
      ownerUserId: context.userId,
      name,
      slug,
      description: req.body.description,
      fields: req.body.fields ?? [],
      submitAction: req.body.submitAction ?? {},
      publishSettings: req.body.publishSettings ?? {},
      status: req.body.status ?? "draft",
    });

    res.status(201).json({ form });
  }),
);

formsRouter.get(
  "/:id",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const form = await FormModel.findOne({ _id: parseObjectId(String(req.params.id), "form id"), workspaceId: context.workspaceId }).lean();
    if (!form) throw new AppError(404, "Form not found");
    res.json({ form });
  }),
);

formsRouter.patch(
  "/:id",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const form = await FormModel.findOneAndUpdate(
      { _id: parseObjectId(String(req.params.id), "form id"), workspaceId: context.workspaceId },
      {
        ...req.body,
        workspaceId: context.workspaceId,
        ownerUserId: context.userId,
        slug: req.body.slug ? normalizeSlug(String(req.body.slug)) : undefined,
      },
      { new: true },
    );
    if (!form) throw new AppError(404, "Form not found");
    res.json({ form });
  }),
);

formsRouter.post(
  "/:id/publish",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const form = await FormModel.findOneAndUpdate(
      { _id: parseObjectId(String(req.params.id), "form id"), workspaceId: context.workspaceId },
      {
        status: "published",
        publishSettings: {
          ...(req.body.publishSettings ?? {}),
          path: req.body.publishSettings?.path ?? `/f/${req.params.id}`,
        },
      },
      { new: true },
    );
    if (!form) throw new AppError(404, "Form not found");
    res.json({ form });
  }),
);

formsRouter.delete(
  "/:id",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const form = await FormModel.findOneAndUpdate(
      { _id: parseObjectId(String(req.params.id), "form id"), workspaceId: context.workspaceId },
      { status: "archived" },
      { new: true },
    );
    if (!form) throw new AppError(404, "Form not found");
    res.status(204).send();
  }),
);

formsRouter.post(
  "/:id/submissions",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const result = await processFormSubmission({
      workspaceId: context.workspaceId,
      ownerUserId: context.userId,
      formId: String(req.params.id),
      answers: req.body.answers ?? req.body,
      sourceUrl: req.body.sourceUrl,
      metadata: req.body.metadata,
      createOpportunity: req.body.createOpportunity,
    });
    res.status(201).json(result);
  }),
);
