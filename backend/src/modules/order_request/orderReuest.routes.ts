import { Router } from "express";
import { authenticate, isCompany, isFarmer } from "../../middleware/auth.middleware.js";
import { requestController } from "./orderRequest.controller.js";
const requestRoute = Router();

// company routes
requestRoute.post("/", authenticate,  isCompany, requestController.create);
requestRoute.get("/my", authenticate,  isCompany, requestController.getMySentRequests);
requestRoute.delete("/:request_id", authenticate,  isCompany, requestController.cancelRequest);

// farmer routes
requestRoute.get("/incoming", authenticate, isFarmer, requestController.getIncomingRequests);
requestRoute.patch("/:request_id/accept", authenticate,  isFarmer, requestController.acceptRequest);
requestRoute.patch("/:request_id/reject", authenticate,  isFarmer, requestController.rejectRequest);

// shared routes
requestRoute.get("/:request_id", authenticate,  requestController.getRequestById);

export{requestRoute};