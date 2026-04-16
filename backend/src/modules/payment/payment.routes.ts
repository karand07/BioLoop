import { Router } from "express";
import { authenticate, isCompany } from "../../middleware/auth.middleware.js";
import { paymentController } from "./payment.controller.js";

const paymentRouter = Router();
paymentRouter.post(
  "/create-order",
  authenticate,
  isCompany,
  paymentController.createPaymentOrder,
);
paymentRouter.post(
  "/verify",
  authenticate,
  isCompany,
  paymentController.verifyPayment,
);
paymentRouter.get(
  "/:order_id",
  authenticate,
  paymentController.getPaymentStatus,
);

export { paymentRouter };
