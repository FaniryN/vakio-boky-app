import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import paymentService from "../services/paymentService.js";
import {
  getAllProducts,
  createOrder,
  getOrderDetails,
  processPayment,
  getUserOrders,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
  getAllOrdersAdmin,
  confirmOrder,
  downloadEbook,
  approveProduct,
  rejectProduct,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getAnalytics,
  updateOrderStatus,
  createDispute,
  getDisputes,
  resolveDispute,
} from "../controllers/marketplaceController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/orders", authenticateToken, createOrder);
router.get("/orders/:id", authenticateToken, getOrderDetails);
router.post("/payments", authenticateToken, processPayment);
router.get("/user/orders", authenticateToken, getUserOrders);

router.get("/admin", authenticateToken, getAllProductsAdmin);
router.post("/admin", authenticateToken, addProduct);
router.put("/admin/:id", authenticateToken, updateProduct);
router.put("/admin/:id/approve", authenticateToken, approveProduct);
router.put("/admin/:id/reject", authenticateToken, rejectProduct);
router.delete("/admin/:id", authenticateToken, deleteProduct);

// Categories management
router.get("/categories", getCategories);
router.post("/categories", authenticateToken, addCategory);
router.put("/categories/:id", authenticateToken, updateCategory);
router.delete("/categories/:id", authenticateToken, deleteCategory);

// Analytics
router.get("/analytics", authenticateToken, getAnalytics);

// Order management
router.put("/admin/orders/:id/status", authenticateToken, updateOrderStatus);
router.post("/admin/orders/:id/dispute", authenticateToken, createDispute);
router.get("/admin/disputes", authenticateToken, getDisputes);
router.put("/admin/disputes/:id/resolve", authenticateToken, resolveDispute);

router.get("/admin/orders", authenticateToken, getAllOrdersAdmin);
router.put("/admin/orders/:id/confirm", authenticateToken, confirmOrder);

// Secure ebook download
router.get("/:productId/download", authenticateToken, downloadEbook);

// Payment callbacks and webhooks
router.post("/payments/callback/:provider", async (req, res) => {
  try {
    const { provider } = req.params;
    const paymentData = req.body;

    await paymentService.handlePaymentCallback(provider, paymentData);

    res.json({ success: true, message: "Payment callback processed" });
  } catch (error) {
    console.error("Payment callback error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Payment status check
router.get("/payments/:paymentId/status", authenticateToken, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await paymentService.getPaymentStatus(paymentId);

    res.json({ success: true, payment });
  } catch (error) {
    console.error("Get payment status error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
