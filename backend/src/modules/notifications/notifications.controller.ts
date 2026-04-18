import { Request, Response } from "express";
import { notificationServices } from "./notification.services.js";

class NotificationController{
getMyNotifications = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const notifications = await notificationServices.getMyNotifications(userId!);
  return res.status(200).json({
    message: "Notifications fetched successfully",
    data: notifications,
  });
};

markAsRead = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const notification_id = Number(req.params.notification_id);
  if (isNaN(notification_id)) {
    return res.status(400).json({ message: "Invalid notification id" });
  }
  const notification = await notificationServices.markAsRead(
    notification_id,
    userId!,
  );
  return res.status(200).json({
    message: "Notification marked as read",
    data: notification,
  });
};

markAllAsRead = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await notificationServices.markAllAsRead(userId!);
  return res.status(200).json({
    message: "All notifications marked as read",
    data: result,
  });
};

deleteNotification = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const notification_id = Number(req.params.notification_id);
  if (isNaN(notification_id)) {
    return res.status(400).json({ message: "Invalid notification id" });
  }
  const notification = await notificationServices.deleteNotification(
    notification_id,
    userId!,
  );
  return res.status(200).json({
    message: "Notification deleted successfully",
    data: notification,
  });
};
}
export const notificationController = new NotificationController();