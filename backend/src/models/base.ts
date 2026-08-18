import { Schema } from "mongoose";

export const objectId = Schema.Types.ObjectId;

export const sharedSchemaOptions = {
  timestamps: true,
  versionKey: false,
} as const;
