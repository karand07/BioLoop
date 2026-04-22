import { requestShema } from "./orderRequest.schemas.js";
import { requestServices } from "./orderRequest.services.js";
import { Request, Response } from "express";

class RequestController {
  create = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = requestShema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid data",
        error: result.error.issues,
      });
    }
    const request = await requestServices.create(result.data, userId!);
    return res.status(201).json({
      message: "Request sent successfully",
      data: request,
    });
  };

  getMySentRequests = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const requests = await requestServices.getMySentRequests(userId!);
    return res.status(200).json({
      message: "Sent requests fetched successfully",
      data: requests,
    });
  };

  cancelRequest = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const request_id = Number(req.params.request_id);
    if (isNaN(request_id)) {
      return res.status(400).json({
        message: "Invalid request id",
      });
    }
    const request = await requestServices.cancelRequest(request_id, userId!);
    return res.status(200).json({
      message: "Request cancelled successfully",
      data: request,
    });
  };

  getIncomingRequests = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const requests = await requestServices.getIncomingRequests(userId!);
    return res.status(200).json({
      message: "Incoming requests fetched successfully",
      data: requests,
    });
  };

  acceptRequest = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const request_id = Number(req.params.request_id);
    if (isNaN(request_id)) {
      return res.status(400).json({
        message: "Invalid request id",
      });
    }
    const request = await requestServices.acceptRequest(request_id, userId!);
    return res.status(200).json({
      message: "Request accepted successfully",
      data: request,
    });
  };

  rejectRequest = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const request_id = Number(req.params.request_id);
    if (isNaN(request_id)) {
      return res.status(400).json({
        message: "Invalid request id",
      });
    }
    const request = await requestServices.rejectRequest(request_id, userId!);
    return res.status(200).json({
      message: "Request rejected successfully",
      data: request,
    });
  };

  respond = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const request_id = Number(req.params.request_id);
    const { status, negotiated_price } = req.body;
    
    if (isNaN(request_id)) {
      return res.status(400).json({ message: "Invalid request id" });
    }

    const request = await requestServices.respond(request_id, userId!, status, negotiated_price);
    return res.status(200).json({
      message: `Request ${status} successfully`,
      data: request,
    });
  };

  getRequestById = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const request_id = Number(req.params.request_id);
    if (isNaN(request_id)) {
      return res.status(400).json({
        message: "Invalid request id",
      });
    }
    const request = await requestServices.getRequestById(request_id, userId!);
    return res.status(200).json({
      message: "Request fetched successfully",
      data: request,
    });
  };
}

export const requestController = new RequestController();
