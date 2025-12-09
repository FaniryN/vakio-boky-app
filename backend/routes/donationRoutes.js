import express from "express";
import {
  createDonation,
  getUserDonations,
  getCampaignDonations,
  getAllDonations,
} from "../controllers/donationController.js";

const router = express.Router();

router.post("/", createDonation);
router.get("/user", getUserDonations);
router.get("/campaign/:campaignId", getCampaignDonations);
router.get("/admin", getAllDonations); // Pour l'admin

export default router;
