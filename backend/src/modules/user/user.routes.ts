import { Router } from "express";
import { userController } from "./user.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const userRoute = Router();

userRoute.post("/signup", userController.register);
userRoute.post("/signin", userController.login);
userRoute.get("/me", authenticate, userController.me);

export { userRoute };
