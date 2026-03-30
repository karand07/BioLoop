import { Router } from "express";
import { wasteCategoryController } from "./waste.controller.js";
import { authenticate, isAdmin } from "../../middleware/auth.middleware";

const wasteCategoryRoute = Router();

wasteCategoryRoute.post(
  "/create",
  authenticate,
  isAdmin,
  wasteCategoryController.create,
);
wasteCategoryRoute.put(
  "/update/:category_id",
  authenticate,
  isAdmin,
  wasteCategoryController.update,
);
wasteCategoryRoute.delete(
  "/delete/:category_id",
  authenticate,
  isAdmin,
  wasteCategoryController.delete,
);

export { wasteCategoryRoute };
