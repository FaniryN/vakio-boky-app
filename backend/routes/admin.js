import express from "express";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import { getDashboardStats, getRecentActivity } from "../controllers/adminController.js";

const router = express.Router();

// Routes protégées pour l'admin
router.get("/dashboard/stats", authenticateToken, requireAdmin, getDashboardStats);
router.get("/dashboard/activity", authenticateToken, requireAdmin, getRecentActivity);

export default router;