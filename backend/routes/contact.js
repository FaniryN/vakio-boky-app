import express from "express";
import contactController from "../controllers/contactController.js";

const router = express.Router();

// Routes Books
router.post("/", contactController.Contact);


export default router;
