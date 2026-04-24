import { createPaymentSchema, verifyPaymentSchema } from "./payment.shemas.js";
import { paymentServices } from "./payment.services.js";
import { Request, Response } from "express";

class PaymentController {
  createPaymentOrder = async (req: Request, res: Response) => {
    try {
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
    } catch (error: any) {
      return res.status(error.message.includes("Unauthorized") ? 403 : 500).json({
        message: error.message || "Something went wrong",
      });
    }
  };

  verifyPayment = async (req: Request, res: Response) => {
    try {
      const result = verifyPaymentSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Invalid data",
          error: result.error.issues,
        });
      }
      const payment = await paymentServices.verifyPayment(result.data);
      return res.status(200).json({
        message: "Payment verified successfully",
        data: payment,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Something went wrong",
      });
    }
  };

  getPaymentStatus = async (req: Request, res: Response) => {
    try {
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
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Something went wrong",
      });
    }
  };
}

export const paymentController = new PaymentController();
