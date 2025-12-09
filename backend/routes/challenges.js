import express from "express";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import {
  getChallenges,
  getChallengeById,
  getUserChallenges,
  joinChallenge,
  updateChallengeProgress,
  getBadges,
  getUserBadges,
  createChallenge,
  createBadge,
  getAllChallengesAdmin,
  updateChallenge,
  deleteChallenge,
  updateChallengeStatus,
  getAllBadgesAdmin,
  updateBadge,
  deleteBadge,
  getChallengesAnalytics,
} from "../controllers/challengeController.js";

const router = express.Router();

// ========== ROUTES PUBLIQUES ==========
router.get("/", getChallenges);
router.get("/:id", getChallengeById);
router.get("/badges/all", getBadges);

// ========== ROUTES PROTÉGÉES (utilisateurs connectés) ==========
router.use(authenticateToken);

router.get("/user/progress", getUserChallenges);
router.post("/:challengeId/join", joinChallenge);
router.put("/:challengeId/progress", updateChallengeProgress);
router.get("/badges/user", getUserBadges);

// ========== ROUTES ADMIN ==========
// Gestion des défis
router.get("/admin/all", requireAdmin, getAllChallengesAdmin);
router.post("/admin", requireAdmin, createChallenge);
router.put("/admin/:id", requireAdmin, updateChallenge);
router.delete("/admin/:id", requireAdmin, deleteChallenge);
router.put("/admin/:id/status", requireAdmin, updateChallengeStatus);

// Gestion des badges
router.get("/admin/badges/all", requireAdmin, getAllBadgesAdmin);
router.post("/admin/badges", requireAdmin, createBadge);
router.put("/admin/badges/:id", requireAdmin, updateBadge);
router.delete("/admin/badges/:id", requireAdmin, deleteBadge);

// Analytics
router.get("/admin/analytics", requireAdmin, getChallengesAnalytics);

export default router;