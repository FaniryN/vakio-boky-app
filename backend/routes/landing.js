// routes/landing.js
import express from "express";
import {
  // getFeaturedTestimonials,
  // getUpcomingEvents, 
  // getPromotedAuthors,
  // getLandingStats,
  getAllLandingData, 
  // getRecentEvents
} from "../controllers/landingController.js";

const router = express.Router();

// router.get("/testimonials", getFeaturedTestimonials);
// router.get("/recent-events", getRecentEvents);
// router.get("/upcoming-events", getUpcomingEvents);
// router.get("/promoted-authors", getPromotedAuthors);
// router.get("/stats", getLandingStats);
router.get("/data", getAllLandingData);

export default router;
