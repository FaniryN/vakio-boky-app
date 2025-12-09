import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  startReadingSession,
  endReadingSession,
  getReadingProgress,
  getReadingStatistics,
  getActiveReadingSession,
  getAdminReadingStats,
} from "../controllers/readingController.js";

const router = express.Router();

// All reading routes require authentication
router.use(authenticateToken);

// Start a reading session for a book
router.post("/books/:bookId/sessions/start", startReadingSession);

// End a reading session
router.put("/sessions/:sessionId/end", endReadingSession);

// Get reading progress for a specific book
router.get("/books/:bookId/progress", getReadingProgress);

// Get user's reading statistics
router.get("/statistics", getReadingStatistics);

// Get user's active reading session
router.get("/sessions/active", getActiveReadingSession);

// Admin routes
router.get("/admin/statistics", getAdminReadingStats);

export default router;