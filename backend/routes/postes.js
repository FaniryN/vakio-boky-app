import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { upload, handleUploadErrors } from "../middleware/upload.js";
import {
  createClubPost,
  getClubPosts,
  deleteClubPost,
} from "../controllers/postsClubController.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/:clubId/posts", getClubPosts);
router.post(
  "/:clubId/posts",
  upload.single("media_url"),
  handleUploadErrors,
  createClubPost,
);
router.post("/:postId", deleteClubPost);

export default router;
