import { prisma } from "../../lib/prisma.js";

class NotificationServices{
async getMyNotifications(userId: number) {
  const notifications = await prisma.notification.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
  });
  return notifications;
}

async markAsRead(notification_id: number, userId: number) {
  const notification = await prisma.notification.findUnique({
    where: { notification_id },
  });
  if (!notification) {
    throw new Error("Notification not found");
  }
  if (notification.user_id !== userId) {
    throw new Error("Unauthorized");
  }

  const updated = await prisma.notification.update({
    where: { notification_id },
    data: { is_read: true },
  });
  return updated;
}

async markAllAsRead(userId: number) {
  const updated = await prisma.notification.updateMany({
    where: { user_id: userId, is_read: false },
    data: { is_read: true },
  });
  return updated;
}

async deleteNotification(notification_id: number, userId: number) {
  const notification = await prisma.notification.findUnique({
    where: { notification_id },
  });
  if (!notification) {
    throw new Error("Notification not found");
  }
  if (notification.user_id !== userId) {
    throw new Error("Unauthorized");
  }

  const deleted = await prisma.notification.delete({
    where: { notification_id },
  });
  return deleted;
}
}
export const notificationServices = new NotificationServices();