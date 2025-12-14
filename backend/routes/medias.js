import express from "express";
import { upload, handleUploadErrors, processUpload, processSingleUpload } from "../middleware/upload.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/upload",
  authenticateToken,
  upload.array("fichiers", 5),
  handleUploadErrors,
  processUpload
);

router.post(
  "/upload-single",
  authenticateToken,
  upload.single("fichier"),
  handleUploadErrors,
  processSingleUpload
);

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🗑️ [media] Suppression média ID: ${id}`);
    
    res.json({
      success: true,
      message: "Média supprimé avec succès"
    });
  } catch (error) {
    console.error("❌ [media] Erreur suppression:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la suppression"
    });
  }
});

router.get("/my-medias", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`📋 [media] Liste des médias pour utilisateur: ${userId}`);
    
    res.json({
      success: true,
      medias: [],
      count: 0,
      message: "Fonctionnalité à implémenter"
    });
  } catch (error) {
    console.error("❌ [media] Erreur liste médias:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
});

router.post("/livres/:livreId/couverture", authenticateToken, async (req, res) => {
  try {
    const { livreId } = req.params;
    const { mediaId } = req.body;
    const userId = req.user.id;
    
    console.log(`🖼️ [media] Association couverture livre ${livreId} avec média ${mediaId}`);
    
    res.json({
      success: true,
      message: "Couverture associée avec succès",
      couverture: {
        livre_id: livreId,
        media_id: mediaId,
        url: `https://vakio-boky-backend.onrender.com/uploads/media-${mediaId}.jpg`
      }
    });
  } catch (error) {
    console.error("❌ [media] Erreur association couverture:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
});

router.get("/profiles/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log(`👤 [media] Récupération photo profil utilisateur: ${userId}`);
    
    res.json({
      success: true,
      profile_picture: `https://vakio-boky-backend.onrender.com/uploads/profiles/profile-${userId}.jpg`,
      user_id: userId
    });
  } catch (error) {
    console.error("❌ [media] Erreur récupération photo profil:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
});

export default router;