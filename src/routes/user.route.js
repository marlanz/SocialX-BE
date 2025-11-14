import express from "express";
import {
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

export default router;
