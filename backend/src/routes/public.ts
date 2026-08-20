import { Router } from "express";
import { FormModel } from "../models/Form.js";
import { PageModel } from "../models/Page.js";
import { processFormSubmission, publicFormView } from "../services/forms.js";
import { asyncRoute, AppError } from "../utils/http.js";
import { rateLimit } from "../middleware/rateLimit.js";
import { validateBody } from "../middleware/validate.js";
import { publicSubmissionSchema } from "../schemas/forms.js";

export const publicRouter = Router();

const publicSubmitLimit = rateLimit({ keyPrefix: "public-submit", windowMs: 15 * 60 * 1000, max: 20 });

publicRouter.get(
  "/forms/:slug",
  asyncRoute(async (req, res) => {
    const form = await FormModel.findOne({ slug: String(req.params.slug), status: "published" });
    if (!form) throw new AppError(404, "Form not found");
    await FormModel.updateOne({ _id: form._id }, { $inc: { "stats.views": 1 } });
    res.json({ form: publicFormView(form) });
  }),
);

publicRouter.post(
  "/forms/:slug/submissions",
  publicSubmitLimit,
  validateBody(publicSubmissionSchema),
  asyncRoute(async (req, res) => {
    const form = await FormModel.findOne({ slug: String(req.params.slug), status: "published" });
    if (!form) throw new AppError(404, "Form not found");

    const result = await processFormSubmission({
      workspaceId: String(form.workspaceId),
      ownerUserId: String(form.ownerUserId),
      formSlug: String(req.params.slug),
      answers: req.body.answers ?? req.body,
      sourceUrl: req.body.sourceUrl,
      metadata: {
        ...(req.body.metadata ?? {}),
        ip: req.ip,
        userAgent: req.get("user-agent"),
      },
      createOpportunity: req.body.createOpportunity,
    });

    res.status(result.duplicate ? 200 : 201).json({
      duplicate: result.duplicate,
      successMessage: form.successMessage ?? "Thanks — we received your details.",
      contact: result.contact ? { name: result.contact.name } : undefined,
    });
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
