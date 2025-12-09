import express from "express";
import { authenticateToken } from "../middleware/auth.js";
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

// All settings routes require authentication
router.use(authenticateToken);

// Platform settings
router.get("/platform", getPlatformSettings);
router.put("/platform", updatePlatformSettings);

// Email templates
router.get("/email/templates", getEmailTemplates);
router.post("/email/templates", createEmailTemplate);
router.put("/email/templates/:id", updateEmailTemplate);
router.delete("/email/templates/:id", deleteEmailTemplate);
router.post("/email/test", sendTestEmail);

// System configuration
router.get("/system", getSystemConfig);
router.put("/system", updateSystemConfig);
router.get("/system/test/:service", testConnection);

export default router;