import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { databseConnect } from "./dbConnect.js";
import router from "./routers/routes.js";
dotenv.config();
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
const allowedOrigins = [
  "http://localhost:5173",
  "https://rightmatch-ui.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

const PORT = 5045;

app.use("/api", router);

app.listen(PORT, async () => {
  await databseConnect();
  console.log(`Server is Ruuning on PORT: ${PORT}`);
});
