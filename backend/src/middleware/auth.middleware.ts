import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthJwtPayload } from "../@types/auth.js";
import { UserRoles } from "../generated/prisma/enums.js";
import { JWT_SECRET } from "../envConfig.js";

// Middleware to authenticate JWT token
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET!) as AuthJwtPayload;

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("id" in decoded) ||
      !("role" in decoded)
    ) {
      return res.status(401).json({ message: "Invalid token structure" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Middleware to check for specific roles
export const requireRole = (...roles: UserRoles[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Allowed roles: ${roles.join(", ")}`,
      });
    }

    next();
  };
};

// Shortcuts for  roles
export const isFarmer = requireRole("farmer");
export const isCompany = requireRole("company");
export const isAdmin = requireRole("admin");
export const isLogistics = requireRole("logistics");
export const isAdminOrCompany = requireRole("admin", "company");
