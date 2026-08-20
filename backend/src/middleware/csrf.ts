import type { NextFunction, Request, Response } from "express";
import { parseSessionCookie } from "../utils/auth.js";
import { AppError } from "../utils/errors.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function allowedOrigins(corsOrigin: string) {
  if (!corsOrigin || corsOrigin === "*") return [] as string[];
  return corsOrigin.split(",").map((value) => value.trim()).filter(Boolean);
}

export function isAllowedOrigin(origin: string, host: string | undefined, corsOrigin: string, nodeEnv: string) {
  if (corsOrigin && corsOrigin !== "*") {
    return allowedOrigins(corsOrigin).includes(origin);
  }

  try {
    const originHost = new URL(origin).host;
    if (host && originHost === host) return true;
  } catch {
    return false;
  }

  return nodeEnv !== "production";
}

export function csrfProtection(req: Request, _res: Response, next: NextFunction) {
  if (SAFE_METHODS.has(req.method.toUpperCase())) return next();
  if (!parseSessionCookie(req.headers.cookie)) return next();

  const origin = req.header("origin");
  const host = req.header("host");
  const corsOrigin = process.env.CORS_ORIGIN ?? "*";
  const nodeEnv = process.env.NODE_ENV ?? "development";

  if (!origin) {
    if (nodeEnv === "production") {
      return next(new AppError(403, "Missing Origin header"));
    }
    return next();
  }

  if (!isAllowedOrigin(origin, host, corsOrigin, nodeEnv)) {
    return next(new AppError(403, "Cross-site request blocked"));
  }

  next();
}
