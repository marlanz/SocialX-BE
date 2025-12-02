import expressAsyncHandler from "express-async-handler";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import Notification from "../models/notification.model.js";
import { getAuth } from "@clerk/express";
import cloudinary from "../config/cloudinary.js";
import express from "express";

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

export const createPost = expressAsyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { content } = req.body;
  const imageFile = req.file;

  if (!content || !imageFile)
    return res
      .status(400)
      .json({ error: "Post must contain either text or image" });

  const user = await User.findOne({ clerkId: userId });
  if (!user) return res.status(404), json({ error: "User not found" });

  let imgUrl = "";

  if (imageFile) {
    try {
      const base64Image = `data:${
        imageFile.mimetype
      };base64,${imageFile.buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "social_media_posts",
        resource_type: "image",
        transformation: [
          { width: 800, height: 800, crop: "limit" },
          {
            quality: "auto",
          },
          { format: "auto" },
        ],
      });
      imgUrl = uploadResponse.secure_url;
    } catch (err) {
      return response.status(400).json({ error: "Failed to upload image" });
    }
  }

  const post = await Post.create({
    user: user._id,
    content: content || "",
    image: imgUrl,
  });

  res.status(201).json({ post });
});

export const toggleLikePost = expressAsyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;

  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);

  if (!user) return res.status(404).json({ error: "User not found" });

  const isLiked = post.likes.includes(user._id);

  if (isLiked) {
    await Post.findByIdAndUpdate(postId, {
      $pull: { likes: user._id },
    });
  } else {
    await Post.findByIdAndUpdate(postId, {
      $push: { likes: user._id },
    });

    //create notification for liking the post
    if (post.user.toString() !== user._id.toString()) {
      await Notification.create({
        from: user._id,
        to: post.user,
        type: "like",
        post: postId,
      });
    }
  }

  return res.status(200).json({
    message: isLiked ? "Post unliked successfully" : "Post liked successfully",
  });
});

export const deletePost = expressAsyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;

  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);

  if (!user || !post)
    return res.status(404).json({ error: "User or post not found" });

  if (post.user.toString !== user._id.toString())
    return res.status(403).json({ error: "You can only delete your own post" });

  await Comment.deleteMany({ post: postId });

  await Post.findByIdAndDelete(postId);

  return res.status(200).json({ message: "Post deleted successfully" });
});
