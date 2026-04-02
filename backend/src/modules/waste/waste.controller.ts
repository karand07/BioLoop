import { Request, Response } from "express";
import {
  wasteCategoryServices,
  wasteListingServices,
} from "./waste.services.js";
import {
  updateWasteCategorySchema,
  updateWasteListingSchema,
  wasteCategorySchema,
  wasteListingsSchema,
} from "./waste.schema.js";

class WasteCategoryController {
  create = async (req: Request, res: Response) => {
    try {
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
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Unknown error occured",
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
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
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Unknown error occured",
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
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
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Unknown error occured",
      });
    }
  };
}

class WasteListingsController {
  create = async (req: Request, res: Response) => {
    try {
      const farmer_id = req.user?.id;
      if (!farmer_id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      const Imgurl = req.file.path;

      const result = wasteListingsSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Invalid data",
          error: result.error.issues,
        });
      }

      const newListings = await wasteListingServices.create(
        { ...result.data, images: Imgurl },
        farmer_id,
      );

      return res.status(200).json({
        message: "Waste listed successfully",
        data: newListings,
      });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Unknown error occured",
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const listing_id = Number(req.params.listing_id);

      if (isNaN(listing_id)) {
        return res.status(400).json({
          message: "Invalid_id",
        });
      }

      const result = updateWasteListingSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Invalid data",
          error: result.error.issues,
        });
      }

      const Imgurl = req.file?.path;

      if (!Imgurl) {
        result.data.images = Imgurl;
      }

      const listing = await wasteListingServices.update(
        result.data,
        listing_id,
      );

      return res.status(200).json({
        message: "updated waste listed successfully",
        data: listing,
      });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Unknown error occured",
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const listing_id = Number(req.params.listing_id);

      if (isNaN(listing_id)) {
        return res.status(400).json({
          message: "Invalid category_id",
        });
      }

      const deleted = await wasteListingServices.delete(listing_id);

      return res.status(200).json({
        message: "waste listing deactivated",
        data: deleted,
      });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Unknown error occured",
      });
    }
  };
}

export const wasteCategoryController = new WasteCategoryController();
export const wasteListingController = new WasteListingsController();
