import { Router } from "express";
import { ContactModel } from "../models/Contact.js";
import { asyncRoute, requireContext, parseObjectId, AppError } from "../utils/http.js";
import { createActivity } from "../services/activities.js";

export const contactsRouter = Router();

contactsRouter.get(
  "/",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const { status, q, kind } = req.query;

    const filter: Record<string, unknown> = { workspaceId: context.workspaceId };
    if (status) filter.status = String(status);
    if (kind) filter.kind = String(kind);
    if (q) {
      const query = String(q).trim();
      filter.$or = [
        { name: new RegExp(query, "i") },
        { email: new RegExp(query, "i") },
        { phone: new RegExp(query, "i") },
        { company: new RegExp(query, "i") },
      ];
    }

    const contacts = await ContactModel.find(filter).sort({ lastActivityAt: -1, createdAt: -1 }).lean();
    res.json({ contacts });
  }),
);

contactsRouter.post(
  "/",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const name = String(req.body.name ?? "").trim();
    const email = req.body.email ? String(req.body.email).trim().toLowerCase() : undefined;

    if (!name) {
      throw new AppError(400, "name is required");
    }

    const contact = await ContactModel.create({
      workspaceId: context.workspaceId,
      ownerUserId: context.userId,
      name,
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
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const contact = await ContactModel.findOneAndUpdate(
      { _id: parseObjectId(String(req.params.id), "contact id"), workspaceId: context.workspaceId },
      {
        ...req.body,
        workspaceId: context.workspaceId,
        ownerUserId: context.userId,
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
