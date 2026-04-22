import { Router } from "express";
import { authenticate, isCompany, isFarmer, isLogistics } from "../../middleware/auth.middleware.js";
import { pickupScheduleControllerInstance } from "./pickupschedule.controller.js";

const pickupRouter = Router();
pickupRouter.post("/propose", authenticate,  isFarmer, pickupScheduleControllerInstance.proposeSlots);
pickupRouter.patch("/:order_id/confirm", authenticate,  isCompany, pickupScheduleControllerInstance.confirmSlot);
pickupRouter.patch("/:order_id/picked-up", authenticate, isLogistics, pickupScheduleControllerInstance.markPickedUp);
pickupRouter.patch("/:order_id/delivered", authenticate,  isLogistics, pickupScheduleControllerInstance.markDelivered);
pickupRouter.get("/available", authenticate, isLogistics, pickupScheduleControllerInstance.getAvailablePickups);
pickupRouter.post("/:order_id/claim", authenticate, isLogistics, pickupScheduleControllerInstance.claimPickup);
pickupRouter.get("/my", authenticate, isLogistics, pickupScheduleControllerInstance.getMyPickups);
pickupRouter.get("/:order_id", authenticate,  pickupScheduleControllerInstance.getPickupDetails);

export { pickupRouter };