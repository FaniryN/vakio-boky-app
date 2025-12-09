import express from "express";
import {
  sendOrderConfirmationEmail,
  sendOrderShippedEmail,
  sendOrderCancelledEmail,
} from "../controllers/emailController.js";

const router = express.Router();

router.post("/order-confirmation", sendOrderConfirmationEmail);
router.post("/order-shipped", sendOrderShippedEmail);
router.post("/order-cancelled", sendOrderCancelledEmail);

export default router;
