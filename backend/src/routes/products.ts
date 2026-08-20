import { Router } from "express";
import { z } from "zod";
import { ProductModel } from "../models/Product.js";
import { asyncRoute, AppError, normalizeSlug, parseObjectId, requireContext } from "../utils/http.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { getPagination, getPaginationSkip, paginationMeta } from "../utils/pagination.js";

export const productsRouter = Router();

const productListQuerySchema = z.object({
  status: z.string().trim().max(50).optional(),
  q: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

const productBodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug: z.string().trim().max(200).optional(),
  description: z.string().max(5000).optional(),
  price: z.coerce.number().finite().min(0).max(1000000000).optional(),
  currency: z.string().trim().length(3).toUpperCase().optional(),
  imageAssetId: z.string().trim().max(100).optional(),
  status: z.string().trim().max(50).optional(),
  inventory: z.coerce.number().int().min(0).max(1000000000).optional(),
  checkoutSettings: z.record(z.unknown()).optional(),
});

const productPatchSchema = productBodySchema.partial();

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

productsRouter.get(
  "/",
  validateQuery(productListQuerySchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const { status, q, page, pageSize } = req.query as z.infer<typeof productListQuerySchema>;
    const pagination = getPagination({ page, pageSize });
    const filter: Record<string, unknown> = { workspaceId: context.workspaceId };
    if (status) filter.status = status;
    if (q) {
      const query = new RegExp(escapeRegExp(q), "i");
      filter.$or = [{ name: query }, { description: query }, { slug: query }];
    }

    const [products, total] = await Promise.all([
      ProductModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(getPaginationSkip(pagination))
        .limit(pagination.pageSize)
        .lean(),
      ProductModel.countDocuments(filter),
    ]);
    res.json({ products, pagination: paginationMeta(pagination.page, pagination.pageSize, total) });
  }),
);

productsRouter.post(
  "/",
  validateBody(productBodySchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const product = await ProductModel.create({
      workspaceId: context.workspaceId,
      ownerUserId: context.userId,
      name: req.body.name,
      slug: normalizeSlug(String(req.body.slug ?? req.body.name)),
      description: req.body.description,
      price: req.body.price ?? 0,
      currency: req.body.currency ?? "USD",
      imageAssetId: req.body.imageAssetId,
      status: req.body.status ?? "draft",
      inventory: req.body.inventory ?? 0,
      checkoutSettings: req.body.checkoutSettings ?? {},
    });
    res.status(201).json({ product });
  }),
);

productsRouter.get(
  "/:id",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const product = await ProductModel.findOne({ _id: parseObjectId(String(req.params.id), "product id"), workspaceId: context.workspaceId }).lean();
    if (!product) throw new AppError(404, "Product not found");
    res.json({ product });
  }),
);

productsRouter.patch(
  "/:id",
  validateBody(productPatchSchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const product = await ProductModel.findOneAndUpdate(
      { _id: parseObjectId(String(req.params.id), "product id"), workspaceId: context.workspaceId },
      {
        ...req.body,
        workspaceId: context.workspaceId,
        ownerUserId: context.userId,
        ...(req.body.slug ? { slug: normalizeSlug(String(req.body.slug)) } : {}),
      },
      { new: true },
    );
    if (!product) throw new AppError(404, "Product not found");
    res.json({ product });
  }),
);

productsRouter.delete(
  "/:id",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const product = await ProductModel.findOneAndDelete({ _id: parseObjectId(String(req.params.id), "product id"), workspaceId: context.workspaceId });
    if (!product) throw new AppError(404, "Product not found");
    res.status(204).send();
  }),
);
