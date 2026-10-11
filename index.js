import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { databseConnect } from "./dbConnect.js";
import router from "./routers/routes.js";
dotenv.config();
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

const PORT = process.env.PORT;

app.use("/api", router);

app.listen(PORT, async () => {
  await databseConnect();
  console.log(`Server is Ruuning on PORT: ${PORT}`);
});
