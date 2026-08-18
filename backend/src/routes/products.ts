import { Router } from "express";
import { ProductModel } from "../models/Product.js";
import { asyncRoute, AppError, normalizeSlug, parseObjectId, requireContext } from "../utils/http.js";

export const productsRouter = Router();

productsRouter.get(
  "/",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const products = await ProductModel.find({ workspaceId: context.workspaceId }).sort({ createdAt: -1 }).lean();
    res.json({ products });
  }),
);

productsRouter.post(
  "/",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const name = String(req.body.name ?? "").trim();
    if (!name) throw new AppError(400, "name is required");
    const product = await ProductModel.create({
      workspaceId: context.workspaceId,
      ownerUserId: context.userId,
      name,
      slug: normalizeSlug(String(req.body.slug ?? name)),
      description: req.body.description,
      price: Number(req.body.price ?? 0),
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
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const product = await ProductModel.findOneAndUpdate(
      { _id: parseObjectId(String(req.params.id), "product id"), workspaceId: context.workspaceId },
      {
        ...req.body,
        workspaceId: context.workspaceId,
        ownerUserId: context.userId,
        slug: req.body.slug ? normalizeSlug(String(req.body.slug)) : undefined,
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
