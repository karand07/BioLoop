import { Router } from "express";
import { authenticate, isLogistics } from "../../middleware/auth.middleware.js";
import { logisticsController } from "./logistics.controller.js";

const logisticsRoute = Router();

logisticsRoute.post(
  "/create",
  authenticate,
  isLogistics,
  logisticsController.create,
);
logisticsRoute.put(
  "/update",
  authenticate,
  isLogistics,
  logisticsController.update,
);

export { logisticsRoute };
