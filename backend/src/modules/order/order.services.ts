import { prisma } from "../../lib/prisma.js";

class OrderServices {
  async getMyOrders(userId: number, userRole: string) {
    const where =
      userRole === "farmer" ? { farmer_id: userId } : { company_id: userId };

    const orders = await prisma.order.findMany({
      where,
      include: {
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
    });
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.company_id !== userId) {
      throw new Error("Unauthorized — only company can confirm delivery");
    }
    if (order.status !== "in_transit") {
      throw new Error("Order is not in transit yet");
    }

    // update order + pickup schedule + trigger payouts in one transaction
    const [updatedOrder] = await prisma.$transaction([
      // 1. mark order as delivered
      prisma.order.update({
        where: { order_id },
        data: { status: "delivered" },
      }),
      // 2. mark pickup schedule as delivered
      prisma.pickup_Schedule.update({
        where: { order_id },
        data: { status: "delivered" },
      }),
      // 3. create farmer payout record
      prisma.payout.create({
        data: {
          order_id,
          recipient_type: "farmer",
          recipient_id: order.farmer_id,
          amount: order.final_price,
          status: "pending",
        },
      }),
      // 4. create logistics payout record
      prisma.payout.create({
        data: {
          order_id,
          recipient_type: "logistics",
          recipient_id: order.farmer_id, // logistics id comes from pickup_schedule
          amount: order.delivery_cost,
          status: "pending",
        },
      }),
    ]);
    return updatedOrder;
  }
}

export const orderServices = new OrderServices();
