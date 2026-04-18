import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { notificationController } from "./notifications.controller.js";
const notificationRouter = Router();
notificationRouter.get("/", authenticate,  notificationController.getMyNotifications);
notificationRouter.patch("/read-all", authenticate,  notificationController.markAllAsRead);
notificationRouter.patch("/:notification_id/read", authenticate,  notificationController.markAsRead);
notificationRouter.delete("/:notification_id", authenticate,  notificationController.deleteNotification);

export {notificationRouter};