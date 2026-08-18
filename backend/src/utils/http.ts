import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function asyncRoute(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void> | void,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

export function requireContext(req: Request) {
  if (!req.context) {
    throw new AppError(401, "workspace context is required");
  }

  return req.context;
}

export function isValidObjectId(value: string) {
  return Types.ObjectId.isValid(value);
}

export function parseObjectId(value: string, fieldName = "id") {
  if (!isValidObjectId(value)) {
    throw new AppError(400, `Invalid ${fieldName}`);
  }

  return new Types.ObjectId(value);
}

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
