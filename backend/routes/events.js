import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  createEvent,
  getClubEvents,
  joinEvent,
  leaveEvent,
} from "../controllers/eventController.js";

const router = express.Router();

router.use(authenticateToken);


router.get("/:clubId/events", getClubEvents);
router.post("/:clubId/events", createEvent);
router.post("/:eventId/join", joinEvent);
router.post("/:eventId/leave", leaveEvent);


export default router;
