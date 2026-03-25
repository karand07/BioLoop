import { JWT_SECRET } from "../../envConfig.js";
import { prisma } from "../../lib/prisma.js";
import { loginType, registerType } from "./user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserServices {
  async register({ email, password, role, phone }: registerType) {
    const is_userExist = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (is_userExist) {
      throw new Error("User already Exists");
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const registerUser = await prisma.users.create({
      data: {
        email,
        password: hashedpassword,
        role,
        phone,
        is_verified: false,
      },
    });

    return registerUser;
  }

  async login({ email, password }: loginType) {
    const is_userExist = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!is_userExist) {
      throw new Error("Invalid Email");
    }

    const isvalid_password = await bcrypt.compare(
      password,
      is_userExist.password,
    );
    if (!isvalid_password) {
      throw new Error("Invalid Password");
    }

    if (!is_userExist.is_verified) {
      throw new Error("Account pending admin approval");
    }

    const token = jwt.sign(
      { id: is_userExist.id, role: is_userExist.role },
      JWT_SECRET!,
      { expiresIn: "4h" },
    );

    if (!token) {
      throw new Error("Something went wrong try again later");
    }
    return { token, role: is_userExist.role };
  }
}

export const userServices = new UserServices();
