import { Router } from "express";
import { FormModel } from "../models/Form.js";
import { PageModel } from "../models/Page.js";
import { processFormSubmission } from "../services/forms.js";
import { asyncRoute, AppError } from "../utils/http.js";

export const publicRouter = Router();

publicRouter.get(
  "/forms/:slug",
  asyncRoute(async (req, res) => {
    const form = await FormModel.findOne({ slug: String(req.params.slug), status: "published" });
    if (!form) throw new AppError(404, "Form not found");
    res.json({ form });
  }),
);

publicRouter.post(
  "/forms/:slug/submissions",
  asyncRoute(async (req, res) => {
    const form = await FormModel.findOne({ slug: String(req.params.slug), status: "published" });
    if (!form) throw new AppError(404, "Form not found");

    const result = await processFormSubmission({
      workspaceId: String(form.workspaceId),
      ownerUserId: String(form.ownerUserId),
      formSlug: String(req.params.slug),
      answers: req.body.answers ?? req.body,
      sourceUrl: req.body.sourceUrl,
      metadata: req.body.metadata,
      createOpportunity: req.body.createOpportunity,
    });

    res.status(201).json(result);
  }),
);

publicRouter.get(
  "/pages/:slug",
  asyncRoute(async (req, res) => {
    const page = await PageModel.findOne({ slug: String(req.params.slug), status: "published" });
    if (!page) throw new AppError(404, "Page not found");
    res.json({ page });
  }),
);
