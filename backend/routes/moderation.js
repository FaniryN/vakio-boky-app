import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getModerationQueue,
  takeModerationAction,
  getReports,
  resolveReport,
  getReportsStats,
  getModerationActions,
  getModerationStats,
} from "../controllers/moderationController.js";

const router = express.Router();

// All moderation routes require authentication
router.use(authenticateToken);

// Moderation queue
router.get("/queue", getModerationQueue);
router.post("/queue/:id/action", takeModerationAction);

// Reports management
router.get("/reports", getReports);
router.post("/reports/:id/resolve", resolveReport);
router.get("/reports/stats", getReportsStats);

// Moderation actions history
router.get("/actions", getModerationActions);
router.get("/actions/stats", getModerationStats);

export default router;