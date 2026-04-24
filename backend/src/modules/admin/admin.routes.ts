import { Router } from "express";
import { authenticate, isAdmin } from "../../middleware/auth.middleware.js";
import { adminController } from "./admin.controller.js";

const adminRouter = Router();
// user management
adminRouter.get("/users", authenticate, isAdmin, adminController.getAllUsers);
adminRouter.patch("/users/:user_id/verify", authenticate, isAdmin, adminController.verifyUser);
adminRouter.patch("/users/:user_id/block", authenticate, isAdmin, adminController.blockUser);
adminRouter.delete("/users/:user_id", authenticate, isAdmin, adminController.deleteUser);

// order management
adminRouter.get("/orders", authenticate, isAdmin, adminController.getAllOrders);
adminRouter.patch("/orders/:order_id/assign-logistics", authenticate, isAdmin, adminController.assignLogistics);

// dashboard
adminRouter.get("/dashboard", authenticate, isAdmin, adminController.getDashboardStats);

// settings
adminRouter.get("/settings", authenticate, isAdmin, adminController.getPlatformSettings);
adminRouter.patch("/settings", authenticate, isAdmin, adminController.updatePlatformSettings);

export{adminRouter};