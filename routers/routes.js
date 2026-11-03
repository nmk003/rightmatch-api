import express from "express";
import { generateOTP, verifyOTP } from "../controllers/otpController.js";
import {
  Signin,
  Signup,
  Users,
  Signout,
  CheckAuth,
} from "../controllers/authController.js";
import { authMiddleware } from "../authMiddleware.js";
import {
  createMatch,
  getMatch,
  getMatches,
  updateMatch,
  Favorite,
  Unfavorite,
  UploadPhotos,
} from "../controllers/matchController.js";
import { Profile } from "../controllers/profileController.js";

const router = express.Router();

// Auth Routes
router.post("/auth/signup", Signup);
router.post("/auth/signin", Signin);
router.post("/auth/signout", Signout);
router.get("/auth/users", authMiddleware, Users);
router.get("/auth/check", authMiddleware, CheckAuth);

// OTP Routes
router.get("/otp/generate", authMiddleware, generateOTP);
router.post("/otp/verify/:otp", authMiddleware, verifyOTP);

// Profile Routes
router.get("/profile/:id", authMiddleware, Profile);

// Match Routes
router.post("/matches", authMiddleware, createMatch);
router.get("/matches", authMiddleware, getMatches);
router.get("/match/:id", authMiddleware, getMatch);
router.put("/match/:id", authMiddleware, updateMatch);
router.post("/match/favorite", authMiddleware, Favorite);
router.put("/match/unfavorite", authMiddleware, Unfavorite);
router.post("/match/upload", authMiddleware, UploadPhotos);

export default router;
