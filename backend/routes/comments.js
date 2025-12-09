import express from "express";
import CommentController from "../controllers/CommentController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// ⚠️ REMPLACER par la méthode simple
router.get("/posts/:postId/comments", CommentController.getPostComments);

// Route pour ajouter un commentaire à un post
router.post(
  "/posts/:postId/comments",
  authenticateToken,
  CommentController.addComment,
);

// Les autres routes restent inchangées
router.post(
  "/:id/like",
  authenticateToken,
  CommentController.toggleLikeComment,
);
router.post("/:id/replies", authenticateToken, CommentController.addReply);
router.delete("/:id", authenticateToken, CommentController.deleteComment);
router.put("/:id", authenticateToken, CommentController.updateComment);
router.get("/:id", CommentController.getComment);

export default router;
