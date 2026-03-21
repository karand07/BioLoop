import { env } from "node:process";

export const db = env.DATABASE_URL 
export const port = env.PORT