import "dotenv/config";
import express from "express";
import { port } from "./envConfig.js";
import { userRoute } from "./modules/user/user.routes.js";
const app = express();
app.use(express.json());

app.use("/api/v1", userRoute);

app.listen(port, () => console.log(`server is running on port ${port}`));
