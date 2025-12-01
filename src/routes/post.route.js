import express from "express";
import {
  getAllPosts,
  getPostDetail,
  getUserPosts,
  createPost,
  toggleLikePost,
  deletePost,
} from "../controllers/post.controller";
import { protectedRoute } from "../middleware/authentication.middleware";
import upload from "../middleware/upload.middleware";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:postId", getPostDetail);
router.get("/user/:username", getUserPosts);

router.post("/create", protectedRoute, upload.single("image"), createPost);
router.post("/:postId/like", protectedRoute, toggleLikePost);
router.delete("/:postId", protectedRoute, deletePost);

export default router;
