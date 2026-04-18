import { Request, Response } from "express";
import { payoutServices } from "./payouts.services.js";

class PayoutController{
releasePayout = async (req: Request, res: Response) => {
  const order_id = Number(req.params.order_id);
  if (isNaN(order_id)) {
    return res.status(400).json({ message: "Invalid order id" });
  }
  const payout = await payoutServices.releasePayout(order_id);
  return res.status(200).json({
    message: "Payouts released successfully",
    data: payout,
  });
};

getPayoutStatus = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const order_id = Number(req.params.order_id);
  if (isNaN(order_id)) {
    return res.status(400).json({ message: "Invalid order id" });
  }
  const payouts = await payoutServices.getPayoutStatus(order_id, userId!);
  return res.status(200).json({
    message: "Payout status fetched successfully",
    data: payouts,
  });
};

getMyPayouts = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const payouts = await payoutServices.getMyPayouts(userId!);
  return res.status(200).json({
    message: "Payouts fetched successfully",
    data: payouts,
  });
};

}

export const payoutController = new PayoutController();