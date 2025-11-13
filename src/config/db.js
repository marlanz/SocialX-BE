import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGODB_URI);
    console.log("Connected to DB successfully");
  } catch (err) {
    console.log("Error connecting to db", err);
  }
};
