import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { negotiationController } from "./negotiation.controlers.js";

const negotiationRouter = Router();
negotiationRouter.post("/", authenticate, negotiationController.sendOffer);
negotiationRouter.get(
  "/:request_id",
  authenticate,
  negotiationController.getNegotiationHistory,
);
negotiationRouter.patch(
  "/:request_id/finalize",
  authenticate,
  negotiationController.finalizeNegotiation,
);

export { negotiationRouter };
