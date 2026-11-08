import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";

import { databseConnect } from "./dbConnect.js";
import router from "./routers/routes.js";

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://rightmatch-ui.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
const _PORT = process.env.PORT;

app.use("/api", router);

app.listen(_PORT, async () => {
  await databseConnect();
  console.log(`Server is Ruuning on PORT: ${_PORT}`);
});
