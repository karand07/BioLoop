import { Request, Response } from "express";
import { farmerServises } from "./farmer.services.js";
import { farmSchema, updateFarmSchema } from "./farmer.schema.js";

class FarmerController {
  Create = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const result = farmSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Invalid data",
          error: result.error.issues,
        });
      }

      const farmerCreate = await farmerServises.create(result.data, userId!);

      return res.status(200).json({
        message: "Farmer Created Successfuly",
        data: farmerCreate,
      });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Unkown error occured",
      });
    }
  };

  Update = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const result = updateFarmSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Invalid data",
          error: result.error.issues,
        });
      }

      const farmerUpdate = await farmerServises.update(result.data, userId!);

      return res.status(200).json({
        message: "Farmer Updated Successfuly",
        data: farmerUpdate,
      });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Unkown error occured",
      });
    }
  };
}

export const farmerController = new FarmerController();
