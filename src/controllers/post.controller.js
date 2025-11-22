import expressAsyncHandler from "express-async-handler";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const getAllPosts = expressAsyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ createAt: -1 })
    .populate("user", "userName firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "userName firstName lastName profilePicture",
      },
    });

  res.status(200).json({ posts });
});

export const getPostDetail = expressAsyncHandler(async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId)
    .populate("user", "userName firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "userName firstName lastName profilePicture",
      },
    });
  if (!post) return res.status(404).json({ error: "Post not found" });
});

export const getUserPosts = expressAsyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ userName: username });
  if (!user) return res.status(404).json({ error: "User not found" });

  const posts = await Post.find({ user: user._id })
    .sort({ createAt: -1 })
    .populate("user", "userName firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "userName lastName firstName profilePicture",
      },
    });

  return res.status(200).json({ posts });
});
