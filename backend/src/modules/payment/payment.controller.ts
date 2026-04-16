import { createPaymentSchema, verifyPaymentSchema } from "./payment.shemas.js";
import { paymentServices } from "./paymet.services.js";
import { Request, Response } from "express";

class PaymentController {
  createPaymentOrder = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = createPaymentSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid data",
        error: result.error.issues,
      });
    }
    const payment = await paymentServices.createPaymentOrder(
      result.data.order_id,
      userId!,
    );
    return res.status(201).json({
      message: "Payment order created successfully",
      data: payment,
    });
  };

  verifyPayment = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = verifyPaymentSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid data",
        error: result.error.issues,
      });
    }
    const payment = await paymentServices.verifyPayment(result.data, userId!);
    return res.status(200).json({
      message: "Payment verified successfully",
      data: payment,
    });
  };

  getPaymentStatus = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const order_id = Number(req.params.order_id);
    if (isNaN(order_id)) {
      return res.status(400).json({
        message: "Invalid order id",
      });
    }
    const payment = await paymentServices.getPaymentStatus(order_id, userId!);
    return res.status(200).json({
      message: "Payment status fetched successfully",
      data: payment,
    });
  };
}

export const paymentController = new PaymentController();
