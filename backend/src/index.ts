import express from "express";
import { port } from "./envConfig";
const app = express();
app.use(express.json());


app.listen(port,()=>console.log(`server is running on port ${port}`))