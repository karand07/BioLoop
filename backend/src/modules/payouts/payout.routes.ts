import { Router } from "express";
import { authenticate, isAdmin, isFarmer } from "../../middleware/auth.middleware.js";
import { payoutController } from "./payout.controller.js";
const payoutRouter = Router();

payoutRouter.post("/release/:order_id", authenticate, isAdmin, payoutController.releasePayout);
payoutRouter.get("/my", authenticate,isFarmer, payoutController.getMyPayouts);
payoutRouter.get("/:order_id", authenticate, payoutController.getPayoutStatus);

export {payoutRouter};

