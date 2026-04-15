import { Request, Response } from "express";
import { negotiationServices } from "./negotiation.services.js";
import { negotiationSchema } from "./negotiation.schemas.js";

class NegotiationController {
  sendOffer = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const result = negotiationSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid data",
        error: result.error.issues,
      });
    }
    const offer = await negotiationServices.sendOffer(
      result.data,
      userId!,
      userRole!,
    );
    return res.status(201).json({
      message: "Offer sent successfully",
      data: offer,
    });
  };

  getNegotiationHistory = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const request_id = Number(req.params.request_id);
    if (isNaN(request_id)) {
      return res.status(400).json({
        message: "Invalid request id",
      });
    }
    const negotiations = await negotiationServices.getNegotiationHistory(
      request_id,
      userId!,
    );
    return res.status(200).json({
      message: "Negotiation history fetched successfully",
      data: negotiations,
    });
  };

  finalizeNegotiation = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const request_id = Number(req.params.request_id);
    if (isNaN(request_id)) {
      return res.status(400).json({
        message: "Invalid request id",
      });
    }
    const order = await negotiationServices.finalizeNegotiation(
      request_id,
      userId!,
      userRole!,
    );
    return res.status(201).json({
      message: "Negotiation finalized, order created successfully",
      data: order,
    });
  };
}

export const negotiationController = new NegotiationController();
