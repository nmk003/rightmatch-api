import express from "express";
import { generateOTP, verifyOTP } from "../controllers/otpController.js";
import { Signin, Signup, Users } from "../controllers/authController.js";
import { authMiddleware } from "../authMiddleware.js";
import {
  createMatch,
  getMatch,
  getMatches,
  updateMatch,
} from "../controllers/matchController.js";

const router = express.Router();

router.get("/otp/generate", generateOTP);
router.post("/otp/verify/:otp", verifyOTP);
router.post("/matches", createMatch);
router.get("/matches", getMatches);
router.get("/match/:id", getMatch);
router.put("/match/:id", updateMatch);

router.post("/auth/signup", Signup);
router.post("/auth/signin", Signin);
router.get("/auth/users", Users);

export default router;
