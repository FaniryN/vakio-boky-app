// // routes/landing.js
// import express from "express";
// import {
//   // getFeaturedTestimonials,
//   // getUpcomingEvents, 
//   // getPromotedAuthors,
//   // getLandingStats,
//   getAllLandingData, 
//   // getRecentEvents
// } from "../controllers/landingController.js";

// const router = express.Router();

// // router.get("/testimonials", getFeaturedTestimonials);
// // router.get("/recent-events", getRecentEvents);
// // router.get("/upcoming-events", getUpcomingEvents);
// // router.get("/promoted-authors", getPromotedAuthors);
// // router.get("/stats", getLandingStats);
// router.get("/data", getAllLandingData);

// export default router;
import express from "express";
import {
  getAllLandingData,
  getPromotedAuthors,
  getRecentBooks,
  getFeaturedTestimonials,
  getUpcomingEvents,
  getLandingStats
} from "../controllers/landingController.js";

const router = express.Router();

// Endpoint principal pour la page d'accueil
router.get("/data", getAllLandingData);

// NOUVEAUX ENDPOINTS spécifiques
router.get("/authors/promoted", getPromotedAuthors); // Pour récupérer spécifiquement les auteurs
router.get("/books/recent", getRecentBooks); // Pour récupérer les livres récents

// Anciens endpoints (conservés pour compatibilité)
router.get("/testimonials", getFeaturedTestimonials);
router.get("/upcoming-events", getUpcomingEvents);
router.get("/stats", getLandingStats);

export default router;