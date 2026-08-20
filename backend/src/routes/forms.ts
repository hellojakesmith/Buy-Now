import { Router } from "express";
import { z } from "zod";
import { FormModel } from "../models/Form.js";
import { FormSubmissionModel } from "../models/FormSubmission.js";
import { asyncRoute, AppError, parseObjectId, requireContext, normalizeSlug } from "../utils/http.js";
import { processFormSubmission } from "../services/forms.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { getPagination, getPaginationSkip, paginationMeta } from "../utils/pagination.js";
import { formBodySchema, formPatchSchema, publishFormSchema, publicSubmissionSchema } from "../schemas/forms.js";

export const formsRouter = Router();

const formListQuerySchema = z.object({
  status: z.enum(["draft", "published", "archived"]).optional(),
  q: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

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
  return `/f/${slug}`;
}

function withOrderedFields(fields: Array<{ order?: number }> | undefined) {
  return (fields ?? []).map((field, index) => ({ ...field, order: field.order ?? index }));
}

formsRouter.get(
  "/",
  validateQuery(formListQuerySchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const { status, q, page, pageSize } = req.query as z.infer<typeof formListQuerySchema>;
    const pagination = getPagination({ page, pageSize });
    const filter: Record<string, unknown> = { workspaceId: context.workspaceId };
    if (status) filter.status = status;
    if (q) filter.$or = [{ name: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") }];

    const [forms, total] = await Promise.all([
      FormModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(getPaginationSkip(pagination))
        .limit(pagination.pageSize)
        .lean(),
      FormModel.countDocuments(filter),
    ]);
    res.json({ forms, pagination: paginationMeta(pagination.page, pagination.pageSize, total) });
  }),
);

formsRouter.post(
  "/",
  validateBody(formBodySchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const slug = await generateUniqueSlug(context.workspaceId, String(req.body.slug ?? req.body.name));

    const form = await FormModel.create({
      workspaceId: context.workspaceId,
      ownerUserId: context.userId,
      name: req.body.name,
      slug,
      description: req.body.description,
      successMessage: req.body.successMessage,
      fields: withOrderedFields(req.body.fields),
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
  "/:id/submissions",
  validateQuery(z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(25),
  })),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const formId = parseObjectId(String(req.params.id), "form id");
    const form = await FormModel.exists({ _id: formId, workspaceId: context.workspaceId });
    if (!form) throw new AppError(404, "Form not found");
    const { page, pageSize } = req.query as { page: number; pageSize: number };
    const pagination = getPagination({ page, pageSize });
    const filter = { workspaceId: context.workspaceId, formId };
    const [submissions, total] = await Promise.all([
      FormSubmissionModel.find(filter).sort({ submittedAt: -1 }).skip(getPaginationSkip(pagination)).limit(pagination.pageSize).lean(),
      FormSubmissionModel.countDocuments(filter),
    ]);
    res.json({ submissions, pagination: paginationMeta(pagination.page, pagination.pageSize, total) });
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
  validateBody(formPatchSchema),
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
        ...(req.body.fields ? { fields: withOrderedFields(req.body.fields) } : {}),
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
  validateBody(publishFormSchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const formId = parseObjectId(String(req.params.id), "form id");
    const existingForm = await FormModel.findOne({ _id: formId, workspaceId: context.workspaceId })
      .select({ slug: 1, fields: 1 })
      .lean<{ slug: string; fields?: unknown[] }>();
    if (!existingForm) throw new AppError(404, "Form not found");
    if (!existingForm.fields?.length) throw new AppError(400, "Add at least one field before publishing");

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

formsRouter.post(
  "/:id/unpublish",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const form = await FormModel.findOneAndUpdate(
      { _id: parseObjectId(String(req.params.id), "form id"), workspaceId: context.workspaceId },
      { status: "draft" },
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
  validateBody(publicSubmissionSchema),
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
