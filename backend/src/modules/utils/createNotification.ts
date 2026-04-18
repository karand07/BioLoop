import { prisma } from "../../lib/prisma.js";

export async function createNotification(
  user_id: number,
  title: string,
  message: string,
  type: "order" | "payment" | "logistics" | "system",
) {
  await prisma.notification.create({
    data: { user_id, title, message, type },
  });
}