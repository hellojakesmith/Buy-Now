import { z } from "zod";

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

export type BootstrapAuthInput = z.infer<typeof bootstrapAuthSchema>;
