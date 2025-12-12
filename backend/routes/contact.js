import express from "express";
import contactController from "../controllers/contactController.js";

const router = express.Router();

// Route pour envoyer un message de contact
router.post("/", contactController.Contact);

export default router;