import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors.js";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitOptions = {
  windowMs: number;
  max: number;
  keyPrefix: string;
  keyGenerator?: (req: Request) => string;
};

export function clientKey(req: Request) {
  return req.ip || req.socket.remoteAddress || "unknown";
}

export function consumeRateLimit(key: string, windowMs: number, max: number, now = Date.now()) {
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    const next = { count: 1, resetAt: now + windowMs };
    buckets.set(key, next);
    return { allowed: true, remaining: max - 1, resetAt: next.resetAt };
  }

  existing.count += 1;
  if (existing.count > max) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }
  return { allowed: true, remaining: max - existing.count, resetAt: existing.resetAt };
}

export function resetRateLimitStore() {
  buckets.clear();
}

export function rateLimit(options: RateLimitOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const identity = options.keyGenerator?.(req) ?? clientKey(req);
    const key = `${options.keyPrefix}:${identity}`;
    const result = consumeRateLimit(key, options.windowMs, options.max);
    res.setHeader("X-RateLimit-Limit", String(options.max));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, result.remaining)));
    res.setHeader("X-RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)));
    if (!result.allowed) {
      const retryAfter = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000));
      res.setHeader("Retry-After", String(retryAfter));
      return next(new AppError(429, "Too many requests. Please try again shortly."));
    }
    next();
  };
}
