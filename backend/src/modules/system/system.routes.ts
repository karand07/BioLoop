import { Router } from "express";
import { prisma } from "../../lib/prisma.js";

const systemRouter = Router();

systemRouter.get("/settings", async (req, res) => {
  try {
    let settings = await prisma.platformSettings.findFirst();
    if (!settings) {
      settings = await prisma.platformSettings.create({
        data: {
          commission_rate: 5.00,
          min_order_value: 500.00,
          base_logistics_rate: 50.00,
        },
      });
    }
    return res.status(200).json({
      message: "System settings fetched successfully",
      data: {
        commission_rate: settings.commission_rate,
        min_order_value: settings.min_order_value,
        base_logistics_rate: settings.base_logistics_rate,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

export { systemRouter };
