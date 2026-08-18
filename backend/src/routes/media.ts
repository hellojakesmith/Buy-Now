import { Router } from "express";
import multer from "multer";
import { deleteFromGridFs, openDownloadStream, uploadBufferToGridFs } from "../services/gridfs.js";
import { MediaAssetModel } from "../models/MediaAsset.js";
import { asyncRoute, AppError, parseObjectId, requireContext } from "../utils/http.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

export const mediaRouter = Router();

mediaRouter.post(
  "/",
  upload.single("file"),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    if (!req.file) {
      throw new AppError(400, "file is required");
    }

    const kind = String(req.body.kind ?? "");
    if (!kind) {
      throw new AppError(400, "kind is required");
    }

    const purpose = req.body.purpose ?? "other";
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
      altText: req.body.altText,
      caption: req.body.caption,
      relatedEntityType: req.body.relatedEntityType,
      relatedEntityId: req.body.relatedEntityId,
    });

    res.status(201).json({ media });
  }),
);

mediaRouter.get(
  "/:id",
  asyncRoute(async (req, res, next) => {
    const media = await MediaAssetModel.findById(parseObjectId(String(req.params.id), "media id"));
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
    const media = await MediaAssetModel.findById(parseObjectId(String(req.params.id), "media id"));
    if (!media) {
      throw new AppError(404, "media not found");
    }

    await deleteFromGridFs(media.gridFsFileId);
    await media.deleteOne();
    res.status(204).send();
  }),
);
