import { Request, Response } from "express";
import { createCompanySchema, updateCompanySchema } from "./company.schema.js";
import { companyServises } from "./company.services.js";

class CompanyController {
  Create = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const result = createCompanySchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Invalid data",
          error: result.error.issues,
        });
      }

      const companyCreate = await companyServises.create(result.data, userId!);

      return res.status(200).json({
        message: "Company Created Successfuly",
        data: companyCreate,
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
      const result = updateCompanySchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Invalid data",
          error: result.error.issues,
        });
      }

      const companyUpdate = await companyServises.update(result.data, userId!);

      return res.status(200).json({
        message: "Company Updated Successfuly",
        data: companyUpdate,
      });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Unkown error occured",
      });
    }
  };
}

export const companyController = new CompanyController();
