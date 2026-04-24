import "dotenv/config";
import express from "express";
import { corsOrigin, port } from "./envConfig.js";
import cors from "cors";
import { userRoute } from "./modules/user/user.routes.js";
import { farmerRoute } from "./modules/farmer/farmer.routes.js";
import { companyRoute } from "./modules/company/company.routes.js";
import { logisticsRoute } from "./modules/logistics/logistics.routes.js";
import {
  wasteCategoryRoute,
  wasteListingsRoute,
} from "./modules/waste/waste.routes.js";
import { requestRoute } from "./modules/order_request/orderRequest.routes.js";
import { negotiationRouter } from "./modules/negotiation/negotiation.routes.js";
import { connectDB } from "./lib/prisma.js";
import { orderRouter } from "./modules/order/order.routes.js";
import { paymentRouter } from "./modules/payment/payment.routes.js";
import { pickupRouter } from "./modules/pickupSchedule/pickupschedule.routes.js";
import { payoutRouter } from "./modules/payouts/payout.routes.js";
import { notificationRouter } from "./modules/notifications/notifications.routes.js";
import { adminRouter } from "./modules/admin/admin.routes.js";
import { systemRouter } from "./modules/system/system.routes.js";

const app = express();
app.use(express.json());

app.use(cors({
  origin: corsOrigin,
  credentials: true
}));

app.use("/user", userRoute);
app.use("/farmer", farmerRoute);
app.use("/company", companyRoute);
app.use("/logistics", logisticsRoute);
app.use("/wastecategory", wasteCategoryRoute);
app.use("/wastelistings", wasteListingsRoute);
app.use("/orderrequest", requestRoute);
app.use("/negotiation", negotiationRouter);
app.use("/order", orderRouter);
app.use("/payment", paymentRouter);
app.use("/pickup", pickupRouter);
app.use("/payout", payoutRouter);
app.use("/notification",notificationRouter);
app.use("/admin",adminRouter);
app.use("/system", systemRouter);

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => console.log(`server is running on port ${port}`));
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();
