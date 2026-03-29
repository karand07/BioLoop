import { Request, Response } from "express";
import {
  createLogisticsSchema,
  updateLogisticsSchema,
} from "./logistics.schema.js";
import { logisticsServices } from "./logistics.services.js";

class LogisticsController {
  create = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = createLogisticsSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid data",
        error: result.error.issues,
      });
    }

    const logistics = await logisticsServices.create(result.data, userId!);

    return res.status(200).json({
      message: "Logistics Id created Successfully",
      data: logistics,
    });
  };

  update = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = updateLogisticsSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid data",
        error: result.error.issues,
      });
    }

    const logistics = await logisticsServices.update(result.data, userId!);

    return res.status(200).json({
      message: "updated Logistics Successfuly",
      data: logistics,
    });
  };
}

export const logisticsController = new LogisticsController();
