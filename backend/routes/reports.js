import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { createReport } from "../controllers/reportController.js";

const router = express.Router();
router.use(authenticateToken);
router.post("/", createReport);
export default router;
