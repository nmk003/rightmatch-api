import express from "express";
import { generateOTP, verifyOTP } from "../controllers/otpController.js";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
} from "../controllers/userController.js";
import { Signin, Signup } from "../controllers/authController.js";
import { authMiddleware } from "../authMiddleware.js";

const router = express.Router();

router.get("/otp/generate", generateOTP);
router.post("/otp/verify/:otp", verifyOTP);
router.post("/users", createUser);
router.get("/users", authMiddleware, getUsers);
router.get("/user/:id", getUser);
router.put("/user/:id", updateUser);

router.post("/auth/signup", Signup);
router.post("/auth/signin", Signin);

export default router;
