import expressAsyncHandler from "express-async-handler";
import Post from "../models/post.model.js";

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
