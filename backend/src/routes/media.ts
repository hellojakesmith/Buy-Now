import { Router } from "express";
import { z } from "zod";
import multer from "multer";
import { deleteFromGridFs, openDownloadStream, uploadBufferToGridFs } from "../services/gridfs.js";
import { MediaAssetModel } from "../models/MediaAsset.js";
import { asyncRoute, AppError, parseObjectId, requireContext, isValidObjectId } from "../utils/http.js";
import { validateBody } from "../middleware/validate.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

export const mediaRouter = Router();

const mediaBodySchema = z.object({
  kind: z.enum(["image", "video"]),
  purpose: z.enum(["product", "page", "form", "avatar", "marketing", "other"]).default("other"),
  altText: z.string().trim().max(500).optional(),
  caption: z.string().trim().max(1000).optional(),
  relatedEntityType: z.string().trim().max(100).optional(),
  relatedEntityId: z.string().trim().max(100).refine((v) => !v || isValidObjectId(v), "Invalid related entity id").optional(),
});

mediaRouter.post(
  "/",
  upload.single("file"),
  validateBody(mediaBodySchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    if (!req.file) {
      throw new AppError(400, "file is required");
    }

    const { kind, purpose, altText, caption, relatedEntityType, relatedEntityId } = req.body;

    const gridFsFileId = await uploadBufferToGridFs({
      buffer: req.file.buffer,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      metadata: {
        workspaceId: context.workspaceId,
        ownerUserId: context.userId,
        kind,
        purpose,
      },
    });

    const media = await MediaAssetModel.create({
      workspaceId: context.workspaceId,
      ownerUserId: context.userId,
      gridFsFileId,
      kind,
      purpose,
      filename: req.file.originalname,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      altText,
      caption,
      relatedEntityType,
      relatedEntityId: relatedEntityId ? parseObjectId(relatedEntityId, "related entity id") : undefined,
    });

    res.status(201).json({ media });
  }),
);

mediaRouter.get(
  "/:id",
  asyncRoute(async (req, res, next) => {
    const context = requireContext(req);
    const media = await MediaAssetModel.findOne({
      _id: parseObjectId(String(req.params.id), "media id"),
      workspaceId: context.workspaceId,
    });
    if (!media) {
      throw new AppError(404, "media not found");
    }

    res.setHeader("Content-Type", media.mimeType);
    res.setHeader("Content-Disposition", `inline; filename="${media.filename}"`);

    const stream = openDownloadStream(media.gridFsFileId);
    stream.on("error", next);
    stream.pipe(res);
  }),
);

mediaRouter.delete(
  "/:id",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const media = await MediaAssetModel.findOne({
      _id: parseObjectId(String(req.params.id), "media id"),
      workspaceId: context.workspaceId,
    });
    if (!media) {
      throw new AppError(404, "media not found");
    }

    await deleteFromGridFs(media.gridFsFileId);
    await media.deleteOne();
    res.status(204).send();
  }),
);
