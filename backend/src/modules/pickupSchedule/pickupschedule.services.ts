import { prisma } from "../../lib/prisma.js";
import { calculateDistance } from "../utils/calculateDistance.js";
import { confirmSlotType, proposeSlotsType } from "./pickupschedule.Schemas.js";

class PickupScheduleServices{

async proposeSlots(
  { order_id, proposed_slots }: proposeSlotsType,
  userId: number,
) {
  const order = await prisma.order.findUnique({
    where: { order_id },
  });
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.farmer_id !== userId) {
    throw new Error("Unauthorized — only farmer can propose slots");
  }
  if (order.status !== "in_transit") {
    throw new Error("Payment must be completed before proposing slots");
  }

  // check schedule not already created
  const existing = await prisma.pickup_Schedule.findUnique({
    where: { order_id },
  });
  if (existing) {
    throw new Error("Pickup slots already proposed for this order");
  }

  // get farmer and company addresses for distance
  const farmer = await prisma.farmerProfile.findUnique({
    where: { farmer_id: order.farmer_id },
  });
  const company = await prisma.companyProfile.findUnique({
    where: { company_id: order.company_id },
  });

  const distanceKm = await calculateDistance(
    { lat: Number(farmer!.latitude), lng: Number(farmer!.longitude) },
    { lat: Number(company!.latitude), lng: Number(company!.longitude) },
  );

  const schedule = await prisma.pickup_Schedule.create({
    data: {
      order_id,
      logistics_id: null, // will be assigned by admin
      proposed_slots,
      pickup_address: farmer!.farm_address,
      delivery_address: company!.address,
      distance_km: distanceKm,
      status: "pending",
    },
  });
  return schedule;
}

async confirmSlot(
  { order_id, confirmed_slot }: confirmSlotType,
  userId: number,
) {
  const order = await prisma.order.findUnique({
    where: { order_id },
  });
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.company_id !== userId) {
    throw new Error("Unauthorized — only company can confirm slot");
  }

  const schedule = await prisma.pickup_Schedule.findUnique({
    where: { order_id },
  });
  if (!schedule) {
    throw new Error("No pickup slots proposed yet");
  }
  if (schedule.status !== "pending") {
    throw new Error("Slot already confirmed");
  }

  // check confirmed_slot is one of the proposed slots
  const proposedSlots = schedule.proposed_slots as string[];
  if (!proposedSlots.includes(confirmed_slot)) {
    throw new Error("Selected slot is not in proposed slots");
  }

  const updated = await prisma.pickup_Schedule.update({
    where: { order_id },
    data: {
      confirmed_slot: new Date(confirmed_slot),
      status: "confirmed",
    },
  });
  return updated;
}

async markPickedUp(order_id: number, userId: number) {
  const schedule = await prisma.pickup_Schedule.findUnique({
    where: { order_id },
  });
  if (!schedule) {
    throw new Error("Pickup schedule not found");
  }
  if (schedule.logistics_id !== userId) {
    throw new Error("Unauthorized — not assigned to this pickup");
  }
  if (schedule.status !== "confirmed") {
    throw new Error("Slot must be confirmed before marking picked up");
  }

  const updated = await prisma.pickup_Schedule.update({
    where: { order_id },
    data: { status: "picked_up" },
  });
  return updated;
}

async markDelivered(order_id: number, userId: number) {
  const schedule = await prisma.pickup_Schedule.findUnique({
    where: { order_id },
  });
  if (!schedule) {
    throw new Error("Pickup schedule not found");
  }
  if (schedule.logistics_id !== userId) {
    throw new Error("Unauthorized — not assigned to this pickup");
  }
  if (schedule.status !== "picked_up") {
    throw new Error("Must be picked up before marking delivered");
  }

  const [updatedSchedule] = await prisma.$transaction([
    prisma.pickup_Schedule.update({
      where: { order_id },
      data: { status: "delivered" },
    }),
    prisma.order.update({
      where: { order_id },
      data: { status: "delivered" },
    }),
  ]);
  return updatedSchedule;
}

async getPickupDetails(order_id: number, userId: number) {
  const order = await prisma.order.findUnique({
    where: { order_id },
  });
  if (!order) {
    throw new Error("Order not found");
  }
  if (
    order.farmer_id !== userId &&
    order.company_id !== userId
  ) {
    // also allow logistics partner
    const schedule = await prisma.pickup_Schedule.findUnique({
      where: { order_id },
    });
    if (!schedule || schedule.logistics_id !== userId) {
      throw new Error("Unauthorized");
    }
  }

  const schedule = await prisma.pickup_Schedule.findUnique({
    where: { order_id },
  });
  if (!schedule) {
    throw new Error("Pickup schedule not found");
  }
  return schedule;
}

async getAvailablePickups() {
  return await prisma.pickup_Schedule.findMany({
    where: {
      logistics_id: null,
      status: "confirmed" // only show if company confirmed the slot
    },
    include: {
      order: {
        include: {
          request: {
            include: {
              listing: {
                include: {
                  category: true
                }
              }
            }
          }
        }
      }
    }
  });
}

async claimPickup(order_id: number, userId: number) {
  const existing = await prisma.pickup_Schedule.findUnique({
    where: { order_id }
  });
  if (!existing || existing.logistics_id !== null) {
    throw new Error("Shipment not available or already claimed");
  }
  return await prisma.pickup_Schedule.update({
    where: { order_id },
    data: { logistics_id: userId }
  });
}

async getMyPickups(userId: number) {
  return await prisma.pickup_Schedule.findMany({
    where: { logistics_id: userId },
    include: {
      order: {
        include: {
          request: {
            include: {
              listing: {
                include: {
                  category: true
                }
              }
            }
          },
          farmer: true,
          company: true
        }
      }
    }
  });
}
}

export const pickupScheduleServices = new PickupScheduleServices();
