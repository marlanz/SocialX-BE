import express from "express";
import { protectedRoute } from "../middleware/authentication.middleware.js";
import {
  deleteNotification,
  getAllNotifications,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectedRoute, getAllNotifications);
router.delete("/notificationId", protectedRoute, deleteNotification);

export default router;
