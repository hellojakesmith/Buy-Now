import { Router } from "express";
import { z } from "zod";
import { FormModel } from "../models/Form.js";
import { asyncRoute, AppError, parseObjectId, requireContext, normalizeSlug } from "../utils/http.js";
import { processFormSubmission } from "../services/forms.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { getPagination, getPaginationSkip, paginationMeta } from "../utils/pagination.js";

export const formsRouter = Router();

const formListQuerySchema = z.object({
  status: z.string().trim().max(50).optional(),
  q: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

const formBodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug: z.string().trim().max(200).optional(),
  description: z.string().max(5000).optional(),
  fields: z.array(z.unknown()).max(100).optional(),
  submitAction: z.record(z.unknown()).optional(),
  publishSettings: z.record(z.unknown()).optional(),
  status: z.string().trim().max(50).optional(),
});

const formPatchSchema = formBodySchema.partial();

const publishFormSchema = z.object({
  publishSettings: z.record(z.unknown()).optional(),
});

const submissionSchema = z.object({
  answers: z.record(z.unknown()).optional(),
  sourceUrl: z.string().url().max(2000).optional(),
  metadata: z.record(z.unknown()).optional(),
  createOpportunity: z.boolean().optional(),
}).passthrough();

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
  validateBody(submissionSchema),
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
