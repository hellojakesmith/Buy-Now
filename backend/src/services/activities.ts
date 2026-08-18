import { ActivityModel } from "../models/Activity.js";

export async function createActivity(input: {
  workspaceId: string;
  actorUserId?: string;
  contactId?: string;
  opportunityId?: string;
  orderId?: string;
  type: "note" | "status_change" | "submission" | "payment" | "task" | "system";
  title: string;
  body?: string;
  payload?: unknown;
}) {
  return ActivityModel.create(input);
}
