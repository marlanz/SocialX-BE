import express from "express";
import {
  followUser,
  getCurrentUser,
  getUserProfile,
  syncUser,
  updateProfile,
} from "../controllers/user.controller";
import { protectedRoute } from "../middleware/authentication.middleware";

const router = express.Router();

router.get("/profile/:username", getUserProfile);

router.get("/me", protectedRoute, getCurrentUser);
router.post("/sync", protectedRoute, syncUser);
router.put("/profile", protectedRoute, updateProfile);
router.post("/follow/:targetUserId", protectedRoute, followUser);

export default router;
