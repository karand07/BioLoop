import { prisma } from "../../lib/prisma.js";
import { createRazorpayPayout } from "../utils/rayzorpay.js";

class PayoutServices {
async releasePayout(order_id: number) {
  const order = await prisma.order.findUnique({
    where: { order_id },
    include: {
      payouts: true,
      pickup_schedule: true,
    },
  });
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.status !== "delivered") {
    throw new Error("Order must be delivered before releasing payout");
  }

  // check payouts not already released
  const alreadyReleased = order.payouts.some(
    (p) => p.status === "processed",
  );
  if (alreadyReleased) {
    throw new Error("Payouts already released for this order");
  }

  // get farmer bank details
  const farmer = await prisma.farmerProfile.findUnique({
    where: { farmer_id: order.farmer_id },
  });

  if (!farmer?.account_number || !farmer?.ifsc) {
    throw new Error(`Farmer (#${order.farmer_id}) bank details are missing. Payout cannot be released.`);
  }

  if (!order.pickup_schedule?.logistics_id) {
    throw new Error("Logistics partner not assigned to this order");
  }

  // get logistics bank details
  const logistics = await prisma.logisticsProfile.findUnique({
    where: { logistics_id: order.pickup_schedule.logistics_id },
  });

  if (!logistics?.account_number || !logistics?.ifsc) {
    throw new Error(`Logistics partner (#${order.pickup_schedule.logistics_id}) bank details are missing. Payout cannot be released.`);
  }

  // release farmer payout via razorpay route
  const farmerPayout = await createRazorpayPayout(
    Number(order.final_price) * Number(order.quantity),
    farmer!.account_number as string,
    farmer!.ifsc as string,
    farmer!.farm_name,
    order_id,
  );

  // release logistics payout via razorpay route
  const logisticsPayout = await createRazorpayPayout(
    Number(order.delivery_cost),
    logistics!.account_number as string,
    logistics!.ifsc as string,
    logistics!.vehicle_number,
    order_id,
  );

  // update payout records + order status in one transaction
  const [farmerPayoutRecord, logisticsPayoutRecord] =
    await prisma.$transaction([
      // update farmer payout
      prisma.payout.updateMany({
        where: { order_id, recipient_type: "farmer" },
        data: {
          razorpay_payout_id: farmerPayout.id,
          status: "processed",
          processed_at: new Date(),
        },
      }),
      // update logistics payout
      prisma.payout.updateMany({
        where: { order_id, recipient_type: "logistics" },
        data: {
          razorpay_payout_id: logisticsPayout.id,
          status: "processed",
          processed_at: new Date(),
        },
      }),
      // update payment status to released
      prisma.payment.update({
        where: { order_id },
        data: { status: "released" },
      }),
      // close the order
      prisma.order.update({
        where: { order_id },
        data: { status: "closed" },
      }),
    ]);

  return { farmerPayoutRecord, logisticsPayoutRecord };
}

async getPayoutStatus(order_id: number, userId: number) {
  const order = await prisma.order.findUnique({
    where: { order_id },
  });
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.farmer_id !== userId && order.company_id !== userId) {
    throw new Error("Unauthorized");
  }

  const payouts = await prisma.payout.findMany({
    where: { order_id },
  });
  if (!payouts.length) {
    throw new Error("No payouts found for this order");
  }
  return payouts;
}

  async getMyPayouts(userId: number, role: string) {
    const recipient_type = role === "logistics" ? "logistics" : "farmer";
    const payouts = await prisma.payout.findMany({
      where: {
        recipient_type,
        recipient_id: userId,
      },
      orderBy: { payout_id: "desc" },
    });
    return payouts;
  }
}

export const payoutServices = new PayoutServices();