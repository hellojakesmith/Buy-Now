import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { AppError } from "../utils/errors.js";

export function validateBody<T>(schema: ZodType<T>): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(
        new AppError(400, "Invalid request body", {
          issues: result.error.issues.map((issue) => ({
            path: issue.path,
            message: issue.message,
            code: issue.code,
          })),
        }),
      );
    }

    req.body = result.data;
    next();
  };
}

export function validateQuery<T>(schema: ZodType<T>): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return next(
        new AppError(400, "Invalid query parameters", {
          issues: result.error.issues.map((issue) => ({
            path: issue.path,
            message: issue.message,
            code: issue.code,
          })),
        }),
      );
    }

    req.query = result.data as typeof req.query;
    next();
  };
}
