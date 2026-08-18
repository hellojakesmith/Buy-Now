import type { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    context?: {
      workspaceId: string;
      userId: string;
      workspaceSlug?: string;
      userEmail?: string;
    };
  }
}
