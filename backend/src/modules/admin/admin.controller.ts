import { Request, Response } from "express";
import { adminServices } from "./admin.services.js";
import { assignLogisticsSchema } from "./admin.schemas.js";

class AdminController {

getAllUsers = async (req: Request, res: Response) => {
  const { role } = req.query;
  const users = await adminServices.getAllUsers(role as string);
  return res.status(200).json({
    message: "Users fetched successfully",
    data: users,
  });
};

verifyUser = async (req: Request, res: Response) => {
  const user_id = Number(req.params.user_id);
  if (isNaN(user_id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  const user = await adminServices.verifyUser(user_id);
  return res.status(200).json({
    message: "User verified successfully",
    data: user,
  });
};

blockUser = async (req: Request, res: Response) => {
  const user_id = Number(req.params.user_id);
  if (isNaN(user_id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  const user = await adminServices.blockUser(user_id);
  return res.status(200).json({
    message: "User blocked successfully",
    data: user,
  });
};

deleteUser = async (req: Request, res: Response) => {
  const user_id = Number(req.params.user_id);
  if (isNaN(user_id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  const user = await adminServices.deleteUser(user_id);
  return res.status(200).json({
    message: "User deleted successfully",
    data: user,
  });
};

assignLogistics = async (req: Request, res: Response) => {
  const order_id = Number(req.params.order_id);
  if (isNaN(order_id)) {
    return res.status(400).json({ message: "Invalid order id" });
  }
  const result = assignLogisticsSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid data",
      error: result.error.issues,
    });
  }
  const schedule = await adminServices.assignLogistics(
    order_id,
    result.data.logistics_id,
  );
  return res.status(200).json({
    message: "Logistics assigned successfully",
    data: schedule,
  });
};

getAllOrders = async (req: Request, res: Response) => {
  const { status } = req.query;
  const orders = await adminServices.getAllOrders(status as string);
  return res.status(200).json({
    message: "Orders fetched successfully",
    data: orders,
  });
};

getDashboardStats = async (req: Request, res: Response) => {
  const stats = await adminServices.getDashboardStats();
  return res.status(200).json({
    message: "Dashboard stats fetched successfully",
    data: stats,
  });
};  
}

export const adminController = new AdminController();