import { Router } from "express";
import { wasteCategoryController, wasteListingController } from "./waste.controller.js";
import { authenticate, isAdmin, isFarmer } from "../../middleware/auth.middleware.js";
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

const wasteListingsRoute = Router();

wasteListingsRoute.post('/create',authenticate,isFarmer, wasteListingController.create);

wasteListingsRoute.put('/update/:listing_id',authenticate,isFarmer,wasteListingController.update);

wasteListingsRoute.put('/delete/:listing_id',authenticate,isFarmer,wasteListingController.update);

export { wasteCategoryRoute, wasteListingsRoute };
