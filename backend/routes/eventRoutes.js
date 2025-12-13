import express from "express";
import {
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventRegistrations,
  getDetailById,
  getAllEventsAdmin,
  approveEvent,
  rejectEvent,
  featureEvent,
  getEventAnalytics,
  getFeaturedEvents
} from "../controllers/evenementController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// ==========================================
// IMPORTANT : Routes ADMIN d'abord !
// ==========================================

// 1. Routes ADMIN (doivent être avant /:id)
router.get("/admin/events", authenticateToken, requireAdmin, getAllEventsAdmin);
router.put("/admin/:id/approve", authenticateToken, requireAdmin, approveEvent);
router.put("/admin/:id/reject", authenticateToken, requireAdmin, rejectEvent);
router.put("/admin/:id/feature", authenticateToken, requireAdmin, featureEvent);
router.get("/admin/analytics", authenticateToken, requireAdmin, getEventAnalytics);

// 2. Routes publiques
router.get("/", getEvents);
router.get("/featured", getFeaturedEvents);
router.get("/detail/:id", getDetailById);

// 3. Routes protégées (utilisateurs normaux)
router.post("/", authenticateToken, createEvent);
router.get("/:id", getEventById);
router.put("/:id", authenticateToken, updateEvent);
router.delete("/:id", authenticateToken, deleteEvent);
router.post("/:id/register", authenticateToken, registerForEvent);
router.get("/:id/registrations", authenticateToken, getEventRegistrations);

export default router;