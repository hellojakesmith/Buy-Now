import { Router } from "express";
import { PageModel } from "../models/Page.js";
import { asyncRoute, AppError, normalizeSlug, parseObjectId, requireContext } from "../utils/http.js";

export const pagesRouter = Router();

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
    const page = await PageModel.create({
      workspaceId: context.workspaceId,
      ownerUserId: context.userId,
      type: req.body.type ?? "landing",
      name,
      slug: normalizeSlug(String(req.body.slug ?? name)),
      status: req.body.status ?? "draft",
      seo: req.body.seo ?? {},
      sections: req.body.sections ?? [],
      publishedUrl: req.body.publishedUrl,
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
    const page = await PageModel.findOneAndUpdate(
      { _id: parseObjectId(String(req.params.id), "page id"), workspaceId: context.workspaceId },
      {
        ...req.body,
        workspaceId: context.workspaceId,
        ownerUserId: context.userId,
        slug: req.body.slug ? normalizeSlug(String(req.body.slug)) : undefined,
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
    const page = await PageModel.findOneAndUpdate(
      { _id: parseObjectId(String(req.params.id), "page id"), workspaceId: context.workspaceId },
      {
        status: "published",
        publishedUrl: req.body.publishedUrl ?? `https://app.local/${String(req.params.id)}`,
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
