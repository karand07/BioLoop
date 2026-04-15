import "dotenv/config";
import express from "express";
import { port } from "./envConfig.js";
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

const app = express();
app.use(express.json());

app.use("/user", userRoute);
app.use("/farmer", farmerRoute);
app.use("/company", companyRoute);
app.use("/logistics", logisticsRoute);
app.use("/wastecategory", wasteCategoryRoute);
app.use("/wastelistings", wasteListingsRoute);
app.use("/orderrequest", requestRoute);
app.use("/negotiation", negotiationRouter);

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => console.log(`server is running on port ${port}`));
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();  
