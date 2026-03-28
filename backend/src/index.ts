import "dotenv/config";
import express from "express";
import { port } from "./envConfig.js";
import { userRoute } from "./modules/user/user.routes.js";
import { farmerRoute } from "./modules/farmer/farmer.routes.js";
const app = express();
app.use(express.json());

app.use("/user", userRoute);
app.use("/farmer",farmerRoute);

app.listen(port, () => console.log(`server is running on port ${port}`));
