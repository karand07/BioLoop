import { Request, Response } from "express";
import { wasteCategoryServices } from "./waste.services.js";
import {
  updateWasteCategorySchema,
  wasteCategorySchema,
} from "./waste.schema.js";

class WasteCategoryController {
  create = async (req: Request, res: Response) => {
    const result = wasteCategorySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid data",
        error: result.error.issues,
      });
    }

    const category = await wasteCategoryServices.create(result.data);

    return res.status(200).json({
      message: "Waste category created successfully",
      data: category,
    });
  };

  update = async (req: Request, res: Response) => {
    const category_id = Number(req.params.category_id);

    if (isNaN(category_id)) {
      return res.status(400).json({
        message: "Invalid category_id",
      });
    }

    const result = updateWasteCategorySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid data",
        error: result.error.issues,
      });
    }

    const updateCategory = await wasteCategoryServices.update(
      result.data,
      category_id,
    );

    return res.status(200).json({
      message: "Waste category updated successfully",
      data: updateCategory,
    });
  };

  delete = async (req: Request, res: Response) => {
    const category_id = Number(req.params.category_id);

    if (isNaN(category_id)) {
      return res.status(400).json({
        message: "Invalid category_id",
      });
    }

    const deleteCategory = await wasteCategoryServices.delete(category_id);

    return res.status(200).json({
      message: "Waste category deleted successfully",
      data: deleteCategory,
    });
  };
}

export const wasteCategoryController = new WasteCategoryController();
