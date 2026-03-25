import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "./user.schema.js";
import { userServices } from "./user.services.js";

class UserController {
  register = async (req: Request, res: Response) => {
    try {
      const result = registerSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Invalid data",
          errors: result.error,
        });
      }

      const userdata = await userServices.register(result.data);

      return res.status(200).json({
        message: "User Registered successfuly",
        data: userdata,
      });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Unkown error occured",
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const result = loginSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Invalid data",
          error: result.error,
        });
      }

      const userLogin = await userServices.login(result.data);
      return res.status(200).json({
        message: "Login Successful",
        token: userLogin,
      });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Unkown error occured",
      });
    }
  };
}

export const userController = new UserController();
