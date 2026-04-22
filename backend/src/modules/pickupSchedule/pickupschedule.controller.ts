import { confirmSlotSchema, proposeSlotsSchema } from "./pickupschedule.Schemas.js";
import { pickupScheduleServices } from "./pickupschedule.services.js";
import { Request, Response } from "express";

class pickupScheduleController {
proposeSlots = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = proposeSlotsSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid data",
      error: result.error.issues,
    });
  }
  const schedule = await pickupScheduleServices.proposeSlots(result.data, userId!);
  return res.status(201).json({
    message: "Pickup slots proposed successfully",
    data: schedule,
  });
};

confirmSlot = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = confirmSlotSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid data",
      error: result.error.issues,
    });
  }
  const schedule = await pickupScheduleServices.confirmSlot(result.data, userId!);
  return res.status(200).json({
    message: "Pickup slot confirmed successfully",
    data: schedule,
  });
};

markPickedUp = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const order_id = Number(req.params.order_id);
  if (isNaN(order_id)) {
    return res.status(400).json({ message: "Invalid order id" });
  }
  const schedule = await pickupScheduleServices.markPickedUp(order_id, userId!);
  return res.status(200).json({
    message: "Order marked as picked up",
    data: schedule,
  });
};

markDelivered = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const order_id = Number(req.params.order_id);
  if (isNaN(order_id)) {
    return res.status(400).json({ message: "Invalid order id" });
  }
  const schedule = await pickupScheduleServices.markDelivered(order_id, userId!);
  return res.status(200).json({
    message: "Order marked as delivered",
    data: schedule,
  });
};

getPickupDetails = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const order_id = Number(req.params.order_id);
  if (isNaN(order_id)) {
    return res.status(400).json({ message: "Invalid order id" });
  }
  const schedule = await pickupScheduleServices.getPickupDetails(order_id, userId!);
  return res.status(200).json({
    message: "Pickup details fetched successfully",
    data: schedule,
  });
};

getAvailablePickups = async (req: Request, res: Response) => {
  const pickups = await pickupScheduleServices.getAvailablePickups();
  return res.status(200).json({
    message: "Available pickups fetched successfully",
    data: pickups,
  });
};

claimPickup = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const order_id = Number(req.params.order_id);
  const claim = await pickupScheduleServices.claimPickup(order_id, userId!);
  return res.status(200).json({
    message: "Pickup claimed successfully",
    data: claim,
  });
};

getMyPickups = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const pickups = await pickupScheduleServices.getMyPickups(userId!);
  return res.status(200).json({
    message: "Your pickups fetched successfully",
    data: pickups,
  });
};
}

export const pickupScheduleControllerInstance = new pickupScheduleController();