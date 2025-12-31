// routes/test.route.js
import express from "express";
import { testAuth } from "../controllers/test.controller.js";

const router = express.Router();

router.get("/auth", testAuth);

export default router;
