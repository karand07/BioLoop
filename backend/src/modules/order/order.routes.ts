import { Router } from "express";
import { authenticate, isCompany } from "../../middleware/auth.middleware.js";
import { orderController } from "./order.controller.js";
const orderRouter = Router();
orderRouter.get("/my", authenticate, orderController.getMyOrders);
orderRouter.get("/:order_id", authenticate, orderController.getOrderById);
orderRouter.patch(
  "/:order_id/confirm-delivery",
  authenticate,
  isCompany,
  orderController.confirmDelivery,
);

export { orderRouter };
