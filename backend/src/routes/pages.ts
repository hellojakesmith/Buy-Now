import { Router } from "express";
import { PageModel } from "../models/Page.js";
import { asyncRoute, AppError, normalizeSlug, parseObjectId, requireContext } from "../utils/http.js";

export const pagesRouter = Router();

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
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const pages = await PageModel.find({ workspaceId: context.workspaceId }).sort({ createdAt: -1 }).lean();
    res.json({ pages });
  }),
);

pagesRouter.post(
  "/",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const name = String(req.body.name ?? "").trim();
    if (!name) throw new AppError(400, "name is required");
    const slug = await generateUniqueSlug(context.workspaceId, String(req.body.slug ?? name));
    const page = await PageModel.create({
      workspaceId: context.workspaceId,
      ownerUserId: context.userId,
      type: req.body.type ?? "landing",
      name,
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
