import express from "express";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import {
  getPlatformSettings,
  updatePlatformSettings,
  getEmailTemplates,
  updateEmailTemplate,
  createEmailTemplate,
  deleteEmailTemplate,
  sendTestEmail,
  getSystemConfig,
  updateSystemConfig,
  testConnection,
} from "../controllers/settingsController.js";

const router = express.Router();

// All settings routes require authentication AND admin role
router.use(authenticateToken);
router.use(requireAdmin); // Ajoutez cette ligne

// Routes restent les mêmes...
router.get("/platform", getPlatformSettings);
router.put("/platform", updatePlatformSettings);
router.get("/email/templates", getEmailTemplates);
router.post("/email/templates", createEmailTemplate);
router.put("/email/templates/:id", updateEmailTemplate);
router.delete("/email/templates/:id", deleteEmailTemplate);
router.post("/email/test", sendTestEmail);
router.get("/system", getSystemConfig);
router.put("/system", updateSystemConfig);
router.get("/system/test/:service", testConnection);

export default router;