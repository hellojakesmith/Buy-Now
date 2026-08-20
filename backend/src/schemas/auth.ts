import { z } from "zod";

const passwordSchema = z.string().min(12, "Password must be at least 12 characters").max(128, "Password must be 128 characters or fewer");

export const registerAuthSchema = z.object({
  workspaceName: z.string().trim().min(1).max(120),
  workspaceSlug: z.string().trim().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "workspaceSlug must contain only lowercase letters, numbers, and hyphens"),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  password: passwordSchema,
});

export const loginAuthSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

export const bootstrapAuthSchema = z.object({
  workspaceName: z.string().trim().min(1).max(120).optional(),
  workspaceSlug: z.string().trim().min(1).max(120).optional(),
  name: z.string().trim().min(1).max(120).optional(),
  ownerName: z.string().trim().min(1).max(120).optional(),
  email: z.string().trim().email().max(254).optional(),
  ownerEmail: z.string().trim().email().max(254).optional(),
}).refine((value) => Boolean(value.email ?? value.ownerEmail), {
  message: "email is required",
  path: ["email"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email().max(254),
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(20).max(200),
  password: passwordSchema,
});

export type RegisterAuthInput = z.infer<typeof registerAuthSchema>;
export type LoginAuthInput = z.infer<typeof loginAuthSchema>;
export type BootstrapAuthInput = z.infer<typeof bootstrapAuthSchema>;
