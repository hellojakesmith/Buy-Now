import { Router } from "express";
import { z } from "zod";
import { ContactModel } from "../models/Contact.js";
import { asyncRoute, requireContext, parseObjectId, AppError } from "../utils/http.js";
import { createActivity } from "../services/activities.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { getPagination, getPaginationSkip, paginationMeta } from "../utils/pagination.js";

export const contactsRouter = Router();

const contactListQuerySchema = z.object({
  status: z.string().trim().min(1).max(50).optional(),
  kind: z.string().trim().min(1).max(50).optional(),
  q: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

const contactBodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320).optional(),
  phone: z.string().trim().max(50).optional(),
  company: z.string().trim().max(200).optional(),
  interest: z.string().trim().max(500).optional(),
  source: z.string().trim().max(100).optional(),
  kind: z.string().trim().max(50).optional(),
  status: z.string().trim().max(50).optional(),
  tags: z.array(z.string().trim().max(100)).max(50).optional(),
  customFields: z.array(z.unknown()).max(100).optional(),
});

const contactPatchSchema = contactBodySchema.partial();

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

contactsRouter.get(
  "/",
  validateQuery(contactListQuerySchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const { status, q, kind, page, pageSize } = req.query as z.infer<typeof contactListQuerySchema>;
    const pagination = getPagination({ page, pageSize });

    const filter: Record<string, unknown> = { workspaceId: context.workspaceId };
    if (status) filter.status = status;
    if (kind) filter.kind = kind;
    if (q) {
      const query = escapeRegExp(q);
      filter.$or = [
        { name: new RegExp(query, "i") },
        { email: new RegExp(query, "i") },
        { phone: new RegExp(query, "i") },
        { company: new RegExp(query, "i") },
      ];
    }

    const [contacts, total] = await Promise.all([
      ContactModel.find(filter)
        .sort({ lastActivityAt: -1, createdAt: -1 })
        .skip(getPaginationSkip(pagination))
        .limit(pagination.pageSize)
        .lean(),
      ContactModel.countDocuments(filter),
    ]);

    res.json({ contacts, pagination: paginationMeta(pagination.page, pagination.pageSize, total) });
  }),
);

contactsRouter.post(
  "/",
  validateBody(contactBodySchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const email = req.body.email ? String(req.body.email).trim().toLowerCase() : undefined;

    const contact = await ContactModel.create({
      workspaceId: context.workspaceId,
      ownerUserId: context.userId,
      name: req.body.name,
      email,
      phone: req.body.phone,
      company: req.body.company,
      interest: req.body.interest,
      source: req.body.source ?? "manual",
      kind: req.body.kind ?? "lead",
      status: req.body.status ?? "new",
      tags: req.body.tags ?? [],
      customFields: req.body.customFields ?? [],
    });

    await createActivity({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      contactId: String(contact._id),
      type: "system",
      title: "Contact created",
      body: `${contact.name} was created`,
    });

    res.status(201).json({ contact });
  }),
);

contactsRouter.get(
  "/:id",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const contact = await ContactModel.findOne({ _id: parseObjectId(String(req.params.id), "contact id"), workspaceId: context.workspaceId }).lean();
    if (!contact) {
      throw new AppError(404, "Contact not found");
    }
    res.json({ contact });
  }),
);

contactsRouter.patch(
  "/:id",
  validateBody(contactPatchSchema),
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const contact = await ContactModel.findOneAndUpdate(
      { _id: parseObjectId(String(req.params.id), "contact id"), workspaceId: context.workspaceId },
      {
        ...req.body,
        workspaceId: context.workspaceId,
        ownerUserId: context.userId,
        ...(req.body.email ? { email: String(req.body.email).trim().toLowerCase() } : {}),
        lastActivityAt: new Date(),
      },
      { new: true },
    );

    if (!contact) {
      throw new AppError(404, "Contact not found");
    }

    await createActivity({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      contactId: String(contact._id),
      type: "status_change",
      title: "Contact updated",
      body: contact.name,
      payload: req.body,
    });

    res.json({ contact });
  }),
);

contactsRouter.delete(
  "/:id",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const contact = await ContactModel.findOneAndUpdate(
      { _id: parseObjectId(String(req.params.id), "contact id"), workspaceId: context.workspaceId },
      { archivedAt: new Date() },
      { new: true },
    );

    if (!contact) {
      throw new AppError(404, "Contact not found");
    }

    res.status(204).send();
  }),
);
