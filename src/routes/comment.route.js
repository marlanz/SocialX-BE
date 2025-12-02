import express from "express";
import { protectedRoute } from "../middleware/authentication.middleware";
import {
  createComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller";

const router = express.Router();

router.get("/post/:postId", getComments);

router.post("/post/:postId", protectedRoute, createComment);
router.delete("/:commentId", protectedRoute, deleteComment);

export default router;
