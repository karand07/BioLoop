import { Router } from "express";
import { authenticate, isCompany, isFarmer, isLogistics } from "../../middleware/auth.middleware.js";
import { pickupScheduleControllerInstance } from "./pickupschedule.controller.js";

const pickupRouter = Router();
pickupRouter.post("/propose", authenticate,  isFarmer, pickupScheduleControllerInstance.proposeSlots);
pickupRouter.patch("/:order_id/confirm", authenticate,  isCompany, pickupScheduleControllerInstance.confirmSlot);
pickupRouter.patch("/:order_id/picked-up", authenticate, isLogistics, pickupScheduleControllerInstance.markPickedUp);
pickupRouter.patch("/:order_id/delivered", authenticate,  isLogistics, pickupScheduleControllerInstance.markDelivered);
pickupRouter.get("/:order_id", authenticate,  pickupScheduleControllerInstance.getPickupDetails);

export { pickupRouter };