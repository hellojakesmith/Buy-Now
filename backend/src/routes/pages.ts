import { Router } from "express";
import { z } from "zod";
import { PageModel } from "../models/Page.js";
import { asyncRoute, AppError, normalizeSlug, parseObjectId, requireContext } from "../utils/http.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { getPagination, getPaginationSkip, paginationMeta } from "../utils/pagination.js";

export const pagesRouter = Router();

const pageListQuerySchema = z.object({
  status: z.string().trim().max(50).optional(),
  type: z.string().trim().max(50).optional(),
  q: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

const pageBodySchema = z.object({
  type: z.string().trim().max(50).optional(),
  name: z.string().trim().min(1).max(200),
  slug: z.string().trim().max(200).optional(),
  status: z.string().trim().max(50).optional(),
  seo: z.record(z.unknown()).optional(),
  sections: z.array(z.unknown()).max(100).optional(),
  publishedUrl: z.string().url().max(2000).optional(),
});

const pagePatchSchema = pageBodySchema.partial();

const publishPageSchema = z.object({
  publishedUrl: z.string().url().max(2000).optional(),
});

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function generateUniqueSlug(workspaceId: string, candidate: string, excludePageId?: string) {
  const base = normalizeSlug(candidate) || "page";
  let suffix = 0;
  let slug = base;

  while (
    await PageModel.exists({
      workspaceId,
      slug,
      ...(excludePageId ? { _id: { $ne: excludePageId } } : {}),
    })
  ) {
    suffix += 1;
    slug = `${base}-${suffix + 1}`;
  }

  return slug;
}

pagesRouter.get(
  "/",
  validateQuery(pageListQuerySchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const { status, type, q, page, pageSize } = req.query as z.infer<typeof pageListQuerySchema>;
    const pagination = getPagination({ page, pageSize });
    const filter: Record<string, unknown> = { workspaceId: context.workspaceId };
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (q) filter.$or = [{ name: new RegExp(escapeRegExp(q), "i") }, { slug: new RegExp(escapeRegExp(q), "i") }];

    const [pages, total] = await Promise.all([
      PageModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(getPaginationSkip(pagination))
        .limit(pagination.pageSize)
        .lean(),
      PageModel.countDocuments(filter),
    ]);
    res.json({ pages, pagination: paginationMeta(pagination.page, pagination.pageSize, total) });
  }),
);

pagesRouter.post(
  "/",
  validateBody(pageBodySchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const slug = await generateUniqueSlug(context.workspaceId, String(req.body.slug ?? req.body.name));
    const page = await PageModel.create({
      workspaceId: context.workspaceId,
      ownerUserId: context.userId,
      type: req.body.type ?? "landing",
      name: req.body.name,
      slug,
      status: req.body.status ?? "draft",
      seo: req.body.seo ?? {},
      sections: req.body.sections ?? [],
      publishedUrl: req.body.publishedUrl ?? `/public/pages/${slug}`,
    });
    res.status(201).json({ page });
  }),
);

pagesRouter.get(
  "/:id",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const page = await PageModel.findOne({ _id: parseObjectId(String(req.params.id), "page id"), workspaceId: context.workspaceId }).lean();
    if (!page) throw new AppError(404, "Page not found");
    res.json({ page });
  }),
);

pagesRouter.patch(
  "/:id",
  validateBody(pagePatchSchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const pageId = String(req.params.id);
    const nextSlug = req.body.slug
      ? await generateUniqueSlug(context.workspaceId, String(req.body.slug), pageId)
      : undefined;
    const page = await PageModel.findOneAndUpdate(
      { _id: parseObjectId(pageId, "page id"), workspaceId: context.workspaceId },
      {
        ...req.body,
        workspaceId: context.workspaceId,
        ownerUserId: context.userId,
        ...(nextSlug ? { slug: nextSlug } : {}),
      },
      { new: true },
    );
    if (!page) throw new AppError(404, "Page not found");
    res.json({ page });
  }),
);

pagesRouter.post(
  "/:id/publish",
  validateBody(publishPageSchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const pageId = parseObjectId(String(req.params.id), "page id");
    const existingPage = await PageModel.findOne({ _id: pageId, workspaceId: context.workspaceId })
      .select({ slug: 1 })
      .lean<{ slug: string }>();
    if (!existingPage) throw new AppError(404, "Page not found");

    const page = await PageModel.findOneAndUpdate(
      { _id: pageId, workspaceId: context.workspaceId },
      {
        status: "published",
        publishedUrl: req.body.publishedUrl ?? `/public/pages/${existingPage.slug}`,
      },
      { new: true },
    );
    if (!page) throw new AppError(404, "Page not found");
    res.json({ page });
  }),
);

pagesRouter.delete(
  "/:id",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const page = await PageModel.findOneAndDelete({ _id: parseObjectId(String(req.params.id), "page id"), workspaceId: context.workspaceId });
    if (!page) throw new AppError(404, "Page not found");
    res.status(204).send();
  }),
);
