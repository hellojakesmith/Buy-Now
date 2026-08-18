import { Router } from "express";
import { UserModel } from "../models/User.js";
import { asyncRoute, AppError, parseObjectId, requireContext } from "../utils/http.js";

export const usersRouter = Router();

usersRouter.get(
  "/",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const users = await UserModel.find({ workspaceId: context.workspaceId }).sort({ createdAt: -1 }).lean();
    res.json({ users });
  }),
);

usersRouter.post(
  "/",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const name = String(req.body.name ?? "").trim();
    if (!email || !name) {
      throw new AppError(400, "email and name are required");
    }

    const user = await UserModel.create({
      workspaceId: context.workspaceId,
      email,
      name,
      role: req.body.role ?? "member",
      authProvider: req.body.authProvider ?? "email",
      avatarUrl: req.body.avatarUrl,
    });

    res.status(201).json({ user });
  }),
);

usersRouter.patch(
  "/:id",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const user = await UserModel.findOneAndUpdate(
      { _id: parseObjectId(String(req.params.id), "user id"), workspaceId: context.workspaceId },
      { ...req.body, workspaceId: context.workspaceId },
      { new: true },
    );
    if (!user) throw new AppError(404, "User not found");
    res.json({ user });
  }),
);

usersRouter.delete(
  "/:id",
  asyncRoute(async (req, res) => {
    const context = requireContext(req);
    const user = await UserModel.findOneAndDelete({ _id: parseObjectId(String(req.params.id), "user id"), workspaceId: context.workspaceId });
    if (!user) throw new AppError(404, "User not found");
    res.status(204).send();
  }),
);
