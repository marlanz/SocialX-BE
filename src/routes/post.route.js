import express from "express";
import {
  getAllPosts,
  getPostDetail,
  getUserPosts,
  createPost,
  toggleLikePost,
  deletePost,
} from "../controllers/post.controller.js";
import { protectedRoute } from "../middleware/authentication.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:postId", getPostDetail);
router.get("/user/:username", getUserPosts);

router.post("/create", protectedRoute, upload.single("image"), createPost);
router.post("/:postId/like", protectedRoute, toggleLikePost);
router.delete("/:postId", protectedRoute, deletePost);

export default router;
