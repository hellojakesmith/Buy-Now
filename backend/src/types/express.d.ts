import type { WorkspaceRole } from "./roles.js";

declare module "express-serve-static-core" {
  interface Request {
    requestId?: string;
    context?: {
      workspaceId: string;
      userId: string;
      workspaceSlug?: string;
      userEmail?: string;
      role?: WorkspaceRole;
    };
  }
}
