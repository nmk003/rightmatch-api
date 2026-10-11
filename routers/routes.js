import express from "express";
import { generateOTP, verifyOTP } from "../controllers/otpController.js";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/otp/generate", generateOTP);
router.post("/otp/verify/:otp", verifyOTP);
router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.put("/user/:id", updateUser);

export default router;
