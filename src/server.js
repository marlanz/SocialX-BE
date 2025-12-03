import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import notificationRoutes from "./routes/notification.route.js";
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use(arcjetMiddleware);

app.get("/", (req, res) => res.send("Hello from server"));
app.get("/api/users", userRoutes);
app.get("/api/posts", postRoutes);
app.get("/api/comments", commentRoutes);
app.get("/api/notifications", notificationRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled errors", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(ENV.PORT, () =>
      console.log("Server is listening on port:", ENV.PORT)
    );
  } catch (err) {
    console.log("Failed to start server", err.message);
  }
};

startServer();
