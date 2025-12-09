import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendBookPromotion,
  sendEventPromotion,
} from "../controllers/notificationController.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getUserNotifications);
router.put("/:notificationId/read", markAsRead);
router.put("/read-all", markAllAsRead);
router.delete("/:notificationId", deleteNotification);

// Promotion routes
router.post("/promote/book", sendBookPromotion);
router.post("/promote/event", sendEventPromotion);

export default router;
