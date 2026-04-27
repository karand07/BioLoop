import { Router } from "express";
import { authenticate, isAdmin} from "../../middleware/auth.middleware.js";
import { payoutController } from "./payout.controller.js";
const payoutRouter = Router();

payoutRouter.post("/release/:order_id", authenticate, isAdmin, payoutController.releasePayout);
payoutRouter.get("/my", authenticate, payoutController.getMyPayouts);
payoutRouter.get("/:order_id", authenticate, payoutController.getPayoutStatus);

export {payoutRouter};

