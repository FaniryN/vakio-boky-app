// const express = require("express");
// const {
//   getCampaigns,
//   createCampaign,
//   makeDonation,
//   getAllCampaignsAdmin,
//   approveCampaign,
//   rejectCampaign,
//   featureCampaign,
//   updateFeaturedOrder,
//   getCampaignAnalytics,
// } = require("../controllers/campaignController");
// const { authenticateToken } = require("../middleware/auth");

// const router = express.Router();

// // Public routes
// router.get("/", authenticateToken, getCampaigns);
// router.post("/", authenticateToken, createCampaign);
// router.post("/donations", authenticateToken, makeDonation);

// // Admin routes
// router.get("/admin/all", authenticateToken, getAllCampaignsAdmin);
// router.put("/admin/:id/approve", authenticateToken, approveCampaign);
// router.put("/admin/:id/reject", authenticateToken, rejectCampaign);
// router.put("/admin/:id/feature", authenticateToken, featureCampaign);
// router.put("/admin/featured/batch", authenticateToken, updateFeaturedOrder);
// router.get("/admin/analytics", authenticateToken, getCampaignAnalytics);

// module.exports = router;
import express from "express";
import {
  getCampaigns,
  createCampaign,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  getAllCampaignsAdmin,
  approveCampaign,
  rejectCampaign,
  featureCampaign,
  updateFeaturedOrder,
  getCampaignAnalytics,
} from "../controllers/campaignController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getCampaigns);
router.post("/", authenticateToken, createCampaign);
router.get("/:id", getCampaignById);

// Authenticated user routes
router.put("/:id", authenticateToken, updateCampaign);
router.delete("/:id", authenticateToken, deleteCampaign);

// Admin routes
router.get("/admin/all", authenticateToken, getAllCampaignsAdmin);
router.put("/admin/:id/approve", authenticateToken, approveCampaign);
router.put("/admin/:id/reject", authenticateToken, rejectCampaign);
router.put("/admin/:id/feature", authenticateToken, featureCampaign);
router.put("/admin/featured/batch", authenticateToken, updateFeaturedOrder);
router.get("/admin/analytics", authenticateToken, getCampaignAnalytics);

export default router;