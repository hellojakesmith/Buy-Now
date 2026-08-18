import { Router } from "express";
import { FormModel } from "../models/Form.js";
import { asyncRoute, AppError, parseObjectId, requireContext, normalizeSlug } from "../utils/http.js";
import { processFormSubmission } from "../services/forms.js";

export const formsRouter = Router();

async function generateUniqueSlug(workspaceId: string, candidate: string, excludeFormId?: string) {
  const base = normalizeSlug(candidate) || "form";
  let suffix = 0;
  let slug = base;

  while (
    await FormModel.exists({
      workspaceId,
      slug,
      ...(excludeFormId ? { _id: { $ne: excludeFormId } } : {}),
    })
  ) {
    suffix += 1;
    slug = `${base}-${suffix + 1}`;
  }

  return slug;
}

function buildPublicFormPath(slug: string) {
  return `/public/forms/${slug}`;
}

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

    const slug = await generateUniqueSlug(context.workspaceId, String(req.body.slug ?? name));

    const form = await FormModel.create({
      workspaceId: context.workspaceId,
      ownerUserId: context.userId,
      name,
      slug,
      description: req.body.description,
      fields: req.body.fields ?? [],
      submitAction: req.body.submitAction ?? {},
      publishSettings: {
        ...(req.body.publishSettings ?? {}),
        path: buildPublicFormPath(slug),
      },
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
    const formId = String(req.params.id);
    const nextSlug = req.body.slug
      ? await generateUniqueSlug(context.workspaceId, String(req.body.slug), formId)
      : undefined;
    const form = await FormModel.findOneAndUpdate(
      { _id: parseObjectId(formId, "form id"), workspaceId: context.workspaceId },
      {
        ...req.body,
        workspaceId: context.workspaceId,
        ownerUserId: context.userId,
        ...(nextSlug ? {
          slug: nextSlug,
          publishSettings: {
            ...(req.body.publishSettings ?? {}),
            path: buildPublicFormPath(nextSlug),
          },
        } : {}),
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
    const formId = parseObjectId(String(req.params.id), "form id");
    const existingForm = await FormModel.findOne({ _id: formId, workspaceId: context.workspaceId })
      .select({ slug: 1 })
      .lean<{ slug: string }>();
    if (!existingForm) throw new AppError(404, "Form not found");

    const form = await FormModel.findOneAndUpdate(
      { _id: formId, workspaceId: context.workspaceId },
      {
        status: "published",
        publishSettings: {
          ...(req.body.publishSettings ?? {}),
          path: buildPublicFormPath(existingForm.slug),
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
