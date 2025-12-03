import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import expressAsyncHandler from "express-async-handler";
import { getAuth } from "@clerk/express";
import mongoose from "mongoose";

export const getComments = expressAsyncHandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate("user", "userName firstName lastName profilePicture");

  res.status(200).json({ comments });
});

export const createComment = expressAsyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Comment content is required" });
  }

  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);

  if (!post || !user)
    return res.status(404).json({ error: "User or Post not found" });

  //implement mongodb transaction

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const comment = await Comment.create(
        [
          {
            user: user._id,
            post: post._id,
            content: content.trim(),
          },
        ],
        { session }
      );

      await Post.findByIdAndUpdate(
        post._id,
        { $push: { comments: comment[0]._id } },
        { session }
      );
    });
  } finally {
    session.endSession();
  }

  // const comment = await Comment.create({
  //   user: user._id,
  //   post: post._id,
  //   content: content.trim(),
  // });

  // await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

  if (post.user.toString() !== user._id.toString()) {
    await Notification.create({
      from: user._id,
      to: post.user,
      type: "comment",
      post: postId,
      comment: comment._id,
    });
  }

  return res.status(201).json({ comment });
});

export const deleteComment = expressAsyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  //   const { postId } = req.params;
  const { commentId } = req.params;

  const user = await User.findOne({ clerkId: userId });
  const comment = await Comment.findById(commentId);

  if (!user || !comment)
    return res.status(404).json({ error: "Comment or User not found" });

  if (comment.user !== user._id)
    return res
      .status(403)
      .json({ error: "You can only delete your own comments" });

  await Post.findOneAndUpdate(comment.post, {
    $pull: { comments: comment._id },
  });

  await Comment.findByIdAndDelete(commentId);

  res.status(200).json({ messgae: "Comment deleted successfully" });
});
