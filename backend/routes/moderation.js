import express from "express";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
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

// All moderation routes require authentication AND admin role
router.use(authenticateToken);
router.use(requireAdmin); // Ajoutez cette ligne

// Routes restent les mêmes...
router.get("/queue", getModerationQueue);
router.post("/queue/:id/action", takeModerationAction);
router.get("/reports", getReports);
router.post("/reports/:id/resolve", resolveReport);
router.get("/reports/stats", getReportsStats);
router.get("/actions", getModerationActions);
router.get("/actions/stats", getModerationStats);

export default router;