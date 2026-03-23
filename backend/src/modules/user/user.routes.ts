import { Router } from "express";
import { userController } from "./user.controller.js";

const userRoute = Router();

userRoute.post("/signup", userController.register);
userRoute.post("/signin", userController.login);

export { userRoute };
