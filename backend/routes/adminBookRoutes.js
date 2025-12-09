import express from "express";
import bookController from "../controllers/bookController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Routes admin pour les livres
router.get("/", authenticateToken, requireAdmin, bookController.getAllBooksAdmin);
router.put("/:id/approve", authenticateToken, requireAdmin, bookController.approveBook);
router.put("/:id/reject", authenticateToken, requireAdmin, bookController.rejectBook);
router.put("/:id/feature", authenticateToken, requireAdmin, bookController.featureBook);
router.get("/featured", authenticateToken, requireAdmin, bookController.getFeaturedBooks);
router.get("/analytics", authenticateToken, requireAdmin, bookController.getBookAnalytics);

// Routes admin pour les genres
router.get("/genres", authenticateToken, requireAdmin, bookController.getGenres);
router.post("/genres", authenticateToken, requireAdmin, bookController.createGenre);
router.put("/genres", authenticateToken, requireAdmin, bookController.updateGenre);
router.delete("/genres", authenticateToken, requireAdmin, bookController.deleteGenre);

// Routes admin pour les collections
router.get("/collections", authenticateToken, requireAdmin, bookController.getCollections);
router.post("/collections", authenticateToken, requireAdmin, bookController.createCollection);
router.put("/collections/:id", authenticateToken, requireAdmin, bookController.updateCollection);
router.delete("/collections/:id", authenticateToken, requireAdmin, bookController.deleteCollection);

export default router;