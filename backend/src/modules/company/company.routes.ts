import { Router } from "express";
import { authenticate, isCompany } from "../../middleware/auth.middleware.js";
import { companyController } from "./company.controller.js";

const companyRoute = Router();

companyRoute.post("/create", authenticate, isCompany, companyController.Create);

companyRoute.put("/update", authenticate, isCompany, companyController.Update);

export { companyRoute };
