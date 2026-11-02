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
import multer from "multer";
import {
  createMatch,
  getMatch,
  getMatches,
  updateMatch,
  Profile,
  Favorite,
  Unfavorite,
  UploadPhotos,
} from "../controllers/matchController.js";
const upload = multer({ dest: "uploads/" });

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
// Match Routes
router.post("/matches", authMiddleware, createMatch);
router.get("/matches", authMiddleware, getMatches);
router.get("/match/:id", authMiddleware, getMatch);
router.put("/match/:id", authMiddleware, updateMatch);
router.post("/match/favorite", authMiddleware, Favorite);
router.put("/match/unfavorite", authMiddleware, Unfavorite);
router.get("/profile/:id", authMiddleware, Profile);
router.post(
  "/photos/upload",
  authMiddleware,
  upload.array("file", 5),
  UploadPhotos,
);

export default router;
