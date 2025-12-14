import express from "express";
import bookController from "../controllers/bookController.js";
import ExtraitController from "../controllers/ExtraitController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// ==================== ROUTES PUBLIQUES ====================
router.get("/", bookController.getBooks); // Tous les livres publiés
router.get("/recent", bookController.getRecent); // Livres récents

// ==================== ROUTES AUTHENTIFIÉES (utilisateurs normaux) ====================
router.post("/", authenticateToken, bookController.createBook);
router.get("/mes-livres", authenticateToken, bookController.getMyBooks); // ⬅️ DOIT ÊTRE AVANT :id

// ==================== ROUTES PUBLIQUES (suite) ====================
router.get("/:id", bookController.getBook); // ⬅️ DÉPLACÉ APRÈS "mes-livres"

// ==================== ROUTES AUTHENTIFIÉES (suite) ====================
router.put("/:id", authenticateToken, bookController.updateBook);
router.delete("/:id", authenticateToken, bookController.deleteBook);

// ==================== ROUTES ADMIN (dans le même routeur) ====================
router.get("/admin/all", authenticateToken, requireAdmin, bookController.getAllBooksAdmin);

// ==================== ROUTES EXTRAITS ====================
router.post("/extraits", authenticateToken, ExtraitController.createExtrait);
router.get("/:livreId/extraits", authenticateToken, ExtraitController.getExtraitsByLivre);
router.put("/extraits/:id", authenticateToken, ExtraitController.updateExtrait);
router.delete("/extraits/:id", authenticateToken, ExtraitController.deleteExtrait);

export default router;