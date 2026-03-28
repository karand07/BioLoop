import { Router } from "express";
import { authenticate, isFarmer } from "../../middleware/auth.middleware.js";
import { farmerController } from "./farmer.controller.js";

const farmerRoute = Router();

farmerRoute.post("/create", authenticate, isFarmer, farmerController.Create);
farmerRoute.put("/update", authenticate, isFarmer, farmerController.Update);

export { farmerRoute };
