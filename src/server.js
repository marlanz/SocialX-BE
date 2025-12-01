import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("Hello from server"));
app.get("/api/users", userRoutes);
app.get("/api/posts", postRoutes);

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
