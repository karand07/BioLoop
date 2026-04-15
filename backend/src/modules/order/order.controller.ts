import { Request, Response } from "express";
import { orderServices } from "./order.services.js";

class OrderController{

getMyOrders = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  const orders = await orderServices.getMyOrders(userId!, userRole!);
  return res.status(200).json({
    message: "Orders fetched successfully",
    data: orders,
  });
};

getOrderById = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const order_id = Number(req.params.order_id);
  if (isNaN(order_id)) {
    return res.status(400).json({
      message: "Invalid order id",
    });
  }
  const order = await orderServices.getOrderById(order_id, userId!);
  return res.status(200).json({
    message: "Order fetched successfully",
    data: order,
  });
};

confirmDelivery = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const order_id = Number(req.params.order_id);
  if (isNaN(order_id)) {
    return res.status(400).json({
      message: "Invalid order id",
    });
  }
  const order = await orderServices.confirmDelivery(order_id, userId!);
  return res.status(200).json({
    message: "Delivery confirmed successfully",
    data: order,
  });
};
}

export const orderController = new OrderController();