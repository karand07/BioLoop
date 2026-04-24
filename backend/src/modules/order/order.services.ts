import { prisma } from "../../lib/prisma.js";

class OrderServices {
  async getMyOrders(userId: number, userRole: string) {
    const where =
      userRole === "farmer" ? { farmer_id: userId } : { company_id: userId };

    const orders = await prisma.order.findMany({
      where,
      include: {
        farmer: true,
        company: true,
        request: {
          include: {
            listing: { include: { category: true } },
          },
        },
        pickup_schedule: true,
        payment: true,
      },
      orderBy: { created_at: "desc" },
    });
    return orders;
  }

  async getOrderById(order_id: number, userId: number) {
    const order = await prisma.order.findUnique({
      where: { order_id },
      include: {
        farmer: true,
        company: true,
        request: {
          include: {
            listing: { include: { category: true } },
            negotiations: { orderBy: { created_at: "asc" } },
          },
        },
        pickup_schedule: true,
        payment: true,
        payouts: true,
      },
    });
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.farmer_id !== userId && order.company_id !== userId) {
      throw new Error("Unauthorized");
    }
    return order;
  }

  async confirmDelivery(order_id: number, userId: number) {
    const order = await prisma.order.findUnique({
      where: { order_id },
      include: { pickup_schedule: true },
    });
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.company_id !== userId) {
      throw new Error("Unauthorized — only company can confirm delivery");
    }
    if (order.status !== "delivered") {
      throw new Error("Order is not delivered yet");
    }

    // 1. Mark as delivered in a transaction
    await prisma.$transaction([
      prisma.order.update({
        where: { order_id },
        data: { status: "delivered" },
      }),
      prisma.pickup_Schedule.update({
        where: { order_id },
        data: { status: "delivered" },
      }),
      // Create pending payout records if they don't exist
      prisma.payout.createMany({
        data: [
          {
            order_id,
            recipient_type: "farmer",
            recipient_id: order.farmer_id,
            amount: Number(order.final_price) * Number(order.quantity),
            status: "pending",
          },
          {
            order_id,
            recipient_type: "logistics",
            recipient_id: order.pickup_schedule?.logistics_id || 0,
            amount: order.delivery_cost,
            status: "pending",
          },
        ],
        skipDuplicates: true,
      }),
    ]);

    // 2. Trigger actual fund release via Razorpay
    const { payoutServices } = await import("../payouts/payouts.services.js");
    return await payoutServices.releasePayout(order_id);
  }
}

export const orderServices = new OrderServices();
