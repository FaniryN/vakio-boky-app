// import express from "express";
// import { authenticateToken } from "../middleware/auth.js";
// import {
//   getPlatformOverview,
//   getUserAnalytics,
//   getContentAnalytics,
// } from "../controllers/analyticsController.js";

// const router = express.Router();

// // All analytics routes require authentication
// router.use(authenticateToken);

// // Platform overview analytics
// router.get("/overview", getPlatformOverview);

// // User engagement analytics
// router.get("/users", getUserAnalytics);

// // Content performance analytics
// router.get("/content", getContentAnalytics);

// export default router;
import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getPlatformOverview,
  getUserAnalytics,
  getContentAnalytics,
} from "../controllers/analyticsController.js";

const router = express.Router();

// All analytics routes require authentication
router.use(authenticateToken);

// Platform overview analytics
router.get("/overview", getPlatformOverview);

// User engagement analytics
router.get("/users", getUserAnalytics);

// Content performance analytics
router.get("/content", getContentAnalytics);

export default router;