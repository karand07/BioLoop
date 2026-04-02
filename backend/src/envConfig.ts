import { env } from "node:process";
import { v2 as cloudinary } from "cloudinary";
export const db = env.DATABASE_URL;
export const port = env.PORT;
export const JWT_SECRET = env.JWT_SECRET;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export default cloudinary;
