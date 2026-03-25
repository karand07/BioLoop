import { JwtPayload } from "jsonwebtoken";
import { UserRoles } from "../generated/prisma/enums.js";

export interface AuthJwtPayload extends JwtPayload {
  id: number;
  role: UserRoles;
}
