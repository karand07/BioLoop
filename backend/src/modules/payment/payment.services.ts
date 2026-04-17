import { razorpay } from "../../envConfig.js";
import { prisma } from "../../lib/prisma.js";
import { verifyPaymentType } from "./payment.shemas.js";
import crypto from "crypto";

class PaymetServices {
  async createPaymentOrder(order_id: number, userId: number) {
    // get platform order
    const order = await prisma.order.findUnique({
      where: { order_id },
    });
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.company_id !== userId) {
      throw new Error("Unauthorized — only company can make payment");
    }
    if (order.status !== "confirmed") {
      throw new Error("Order is not in confirmed state");
    }

    // check payment not already created
    const existingPayment = await prisma.payment.findUnique({
      where: { order_id },
    });
    if (existingPayment) {
      throw new Error("Payment already initiated for this order");
    }

    // create razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(Number(order.total_amount) * 100), // in paise
      currency: "INR",
      receipt: `order_${order_id}`,
    });

    // save payment record
    const payment = await prisma.payment.create({
      data: {
        order_id,
        razorpay_order_id: razorpayOrder.id,
        amount: order.total_amount,
        status: "pending",
      },
    });
    return { payment, razorpayOrder };
  }

  async verifyPayment(
    {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    }: verifyPaymentType
  ) {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    // find payment record
    const payment = await prisma.payment.findFirst({
      where: { razorpay_order_id },
    });
    if (!payment) {
      throw new Error("Payment record not found");
    }

    // update payment + order status in one transaction
    const [updatedPayment] = await prisma.$transaction([
      // 1. update payment status
      prisma.payment.update({
        where: { payment_id: payment.payment_id },
        data: {
          razorpay_payment_id,
          status: "held", // held in escrow
          paid_at: new Date(),
        },
      }),
      // 2. update order status to in_transit
      prisma.order.update({
        where: { order_id: payment.order_id },
        data: { status: "in_transit" },
      }),
    ]);
    return updatedPayment;
  }

  async getPaymentStatus(order_id: number, userId: number) {
    const order = await prisma.order.findUnique({
      where: { order_id },
    });
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.farmer_id !== userId && order.company_id !== userId) {
      throw new Error("Unauthorized");
    }

    const payment = await prisma.payment.findUnique({
      where: { order_id },
    });
    if (!payment) {
      throw new Error("Payment not found");
    }
    return payment;
  }
}

export const paymentServices = new PaymetServices();
