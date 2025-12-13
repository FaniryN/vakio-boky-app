import express from "express";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import {
  getPlatformOverview,
  getUserAnalytics,
  getContentAnalytics,
} from "../controllers/analyticsController.js";

const router = express.Router();

// All analytics routes require authentication AND admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Routes analytics
router.get("/overview", getPlatformOverview);
router.get("/users", getUserAnalytics);
router.get("/content", getContentAnalytics);

export default router;