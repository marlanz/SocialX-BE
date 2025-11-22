import express from "express";
import {
  getAllPosts,
  getPostDetail,
  getUserPosts,
} from "../controllers/post.controller";
import { protectedRoute } from "../middleware/authentication.middleware";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:postId", getPostDetail);
router.get("/user/:username", getUserPosts);

router.post("/create", protectedRoute);

export default router;
