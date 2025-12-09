import express from "express";
import PostController from "../controllers/PostController.js"; // ✅ Correct
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Routes
router.post("/", authenticateToken, PostController.createPost);
router.get("/", authenticateToken, PostController.getAllPosts);
router.post("/:id/like", authenticateToken, PostController.toggleLike);
router.post("/:id/share", authenticateToken, PostController.sharePost);
router.put("/:id", authenticateToken, PostController.updatePost);
router.delete("/:id", authenticateToken, PostController.deletePost);
router.get("/:id/comments", authenticateToken, PostController.getPostComments);
router.get("/:id", authenticateToken, PostController.getPostById);

export default router;
