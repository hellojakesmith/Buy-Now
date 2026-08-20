import { Router, type Response } from "express";
import { Types } from "mongoose";
import { WorkspaceModel } from "../models/Workspace.js";
import { UserModel } from "../models/User.js";
import { SessionModel } from "../models/Session.js";
import { PasswordResetModel } from "../models/PasswordReset.js";
import { normalizeSlug, asyncRoute, AppError } from "../utils/http.js";
import { validateBody } from "../middleware/validate.js";
import { registerAuthSchema, loginAuthSchema, bootstrapAuthSchema, forgotPasswordSchema, resetPasswordSchema } from "../schemas/auth.js";
import { createSessionToken, hashPassword, hashSessionToken, SESSION_COOKIE_NAME, SESSION_TTL_MS, verifyPassword } from "../utils/auth.js";
import { ensureDefaultPipeline } from "../services/seed.js";
import { rateLimit } from "../middleware/rateLimit.js";

export const authRouter = Router();

const RESET_TTL_MS = 1000 * 60 * 60;
const authAbuseLimit = rateLimit({ keyPrefix: "auth", windowMs: 15 * 60 * 1000, max: 10 });

function setSessionCookie(res: Response, token: string) {
  const secure = process.env.NODE_ENV === "production";
  res.setHeader("Set-Cookie", `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}${secure ? "; Secure" : ""}`);
}

function clearSessionCookie(res: Response) {
  res.setHeader("Set-Cookie", `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
}

function publicUser(user: any) {
  const value = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete value.passwordHash;
  return value;
}

authRouter.post("/register", authAbuseLimit, validateBody(registerAuthSchema), asyncRoute(async (req, res) => {
  const { workspaceName, workspaceSlug, name, email, password } = req.body;
  const slug = normalizeSlug(workspaceSlug);

  if (await WorkspaceModel.exists({ slug })) throw new AppError(409, "Workspace slug is already in use");

  const workspaceId = new Types.ObjectId();
  const userId = new Types.ObjectId();
  const workspace = await WorkspaceModel.create({ _id: workspaceId, name: workspaceName, slug, ownerUserId: userId });
  const user = await UserModel.create({ _id: userId, workspaceId, email: email.toLowerCase(), name, role: "owner", passwordHash: hashPassword(password), authProvider: "email", lastLoginAt: new Date() });
  await ensureDefaultPipeline(String(workspace._id), String(user._id));

  const token = createSessionToken();
  await SessionModel.create({ userId: user._id, workspaceId: workspace._id, tokenHash: hashSessionToken(token), expiresAt: new Date(Date.now() + SESSION_TTL_MS), userAgent: req.get("user-agent"), ipAddress: req.ip });
  setSessionCookie(res, token);
  res.status(201).json({ workspace, user: publicUser(user) });
}));

authRouter.post("/login", authAbuseLimit, validateBody(loginAuthSchema), asyncRoute(async (req, res) => {
  const email = String(req.body.email).trim().toLowerCase();
  const user = await UserModel.findOne({ email }).select("+passwordHash");
  if (!user?.passwordHash || !verifyPassword(String(req.body.password), user.passwordHash)) throw new AppError(401, "Invalid email or password");

  const workspace = await WorkspaceModel.findById(user.workspaceId);
  if (!workspace) throw new AppError(401, "Account workspace not found");

  user.lastLoginAt = new Date();
  await user.save();
  const token = createSessionToken();
  await SessionModel.create({ userId: user._id, workspaceId: workspace._id, tokenHash: hashSessionToken(token), expiresAt: new Date(Date.now() + SESSION_TTL_MS), userAgent: req.get("user-agent"), ipAddress: req.ip });
  setSessionCookie(res, token);
  res.json({ workspace, user: publicUser(user) });
}));

authRouter.post("/logout", asyncRoute(async (req, res) => {
  const token = req.headers.cookie?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`))?.slice(SESSION_COOKIE_NAME.length + 1);
  if (token) await SessionModel.deleteOne({ tokenHash: hashSessionToken(token) });
  clearSessionCookie(res);
  res.status(204).send();
}));

authRouter.post("/forgot-password", authAbuseLimit, validateBody(forgotPasswordSchema), asyncRoute(async (req, res) => {
  const email = String(req.body.email).trim().toLowerCase();
  const user = await UserModel.findOne({ email }).select("+passwordHash").lean();
  const generic = { message: "If an account exists for that email, password reset instructions were created." };

  if (!user?.passwordHash) {
    res.json(generic);
    return;
  }

  const token = createSessionToken();
  await PasswordResetModel.create({
    userId: user._id,
    email,
    tokenHash: hashSessionToken(token),
    expiresAt: new Date(Date.now() + RESET_TTL_MS),
  });

  res.json(process.env.NODE_ENV === "production" ? generic : { ...generic, resetToken: token });
}));

authRouter.post("/reset-password", authAbuseLimit, validateBody(resetPasswordSchema), asyncRoute(async (req, res) => {
  const tokenHash = hashSessionToken(String(req.body.token));
  const reset = await PasswordResetModel.findOne({ tokenHash, usedAt: { $exists: false }, expiresAt: { $gt: new Date() } });
  if (!reset) throw new AppError(400, "Reset link is invalid or has expired");

  const user = await UserModel.findById(reset.userId).select("+passwordHash");
  if (!user) throw new AppError(400, "Reset link is invalid or has expired");

  user.passwordHash = hashPassword(String(req.body.password));
  await user.save();
  reset.usedAt = new Date();
  await reset.save();
  await SessionModel.deleteMany({ userId: user._id });

  res.json({ message: "Password updated. You can sign in with your new password." });
}));

authRouter.get("/me", asyncRoute(async (req, res) => {
  if (!req.context) throw new AppError(401, "Authentication required");
  const [workspace, user] = await Promise.all([
    WorkspaceModel.findById(req.context.workspaceId).lean(),
    UserModel.findById(req.context.userId).lean(),
  ]);
  if (!workspace || !user) throw new AppError(404, "Authenticated user or workspace not found");
  res.json({ workspace, user: publicUser(user) });
}));

// Legacy bootstrap remains available only outside production while the frontend migrates to /register and /login.
authRouter.post("/bootstrap", authAbuseLimit, validateBody(bootstrapAuthSchema), asyncRoute(async (req, res) => {
  if (process.env.NODE_ENV === "production") throw new AppError(410, "Bootstrap authentication is disabled in production");
  const workspaceName = String(req.body.workspaceName ?? req.body.name ?? "Buy Now Workspace").trim();
  const workspaceSlug = normalizeSlug(String(req.body.workspaceSlug ?? workspaceName));
  const ownerName = String(req.body.name ?? req.body.ownerName ?? "Owner").trim();
  const ownerEmail = String(req.body.email ?? req.body.ownerEmail ?? "").trim().toLowerCase();
  if (!ownerEmail) throw new AppError(400, "email is required");

  let workspace = await WorkspaceModel.findOne({ slug: workspaceSlug });
  if (!workspace) workspace = await WorkspaceModel.create({ name: workspaceName, slug: workspaceSlug, ownerUserId: new Types.ObjectId() });
  let user = await UserModel.findOne({ workspaceId: workspace._id, email: ownerEmail });
  if (!user) {
    user = await UserModel.create({ workspaceId: workspace._id, email: ownerEmail, name: ownerName, role: "owner", authProvider: "email" });
    workspace.ownerUserId = user._id as any;
    await workspace.save();
  }
  await ensureDefaultPipeline(String(workspace._id), String(user._id));
  res.status(201).json({ workspace, user: publicUser(user), context: { workspaceId: String(workspace._id), userId: String(user._id) } });
}));
