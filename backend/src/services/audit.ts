import { AuditLogModel } from "../models/AuditLog.js";

export async function recordAudit(input: {
  workspaceId: string;
  actorUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  payload?: unknown;
}) {
  return AuditLogModel.create(input);
}
