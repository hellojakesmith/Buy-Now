import { NotificationModel } from "../models/Notification.js";

export async function createNotification(input: {
  workspaceId: string;
  userId: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
  payload?: unknown;
}) {
  return NotificationModel.create(input);
}
