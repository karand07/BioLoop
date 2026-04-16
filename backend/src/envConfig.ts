import { env } from "node:process";
import { v2 as cloudinary } from "cloudinary";
export const db = env.DATABASE_URL;
export const port = env.PORT;
export const JWT_SECRET = env.JWT_SECRET;
export const GOOGLE_MAPS_API_KEY = env.GOOGLE_MAPS_API_KEY;
import Razorpay from "razorpay";
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export default cloudinary;
