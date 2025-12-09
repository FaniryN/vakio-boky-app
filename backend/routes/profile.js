// import express from "express";
// import {
//   getProfile,
//   updateProfile,
//   changePassword,
//   uploadProfilePicture,
//   deleteProfilePicture,
//   getUserStatistics,
//   upload,
// } from "../controllers/profileController.js";
// import { authenticateToken } from "../middleware/auth.js";

// const router = express.Router();

// router.use(authenticateToken);

// router.get("/", getProfile);
// router.get("/statistics", getUserStatistics);
// router.put("/", updateProfile);
// router.put("/password", changePassword);

// //Pour photos
// router.put("/picture", upload.single("profilePicture"), uploadProfilePicture);
// router.delete("/picture", deleteProfilePicture);

// export default router;
import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
  deleteProfilePicture,
  getUserStatistics,
  upload,
} from "../controllers/profileController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Routes GET
router.get("/", getProfile);
router.get("/statistics", getUserStatistics);

// Routes PUT/POST
router.put("/", updateProfile);
router.post("/password", changePassword); // CORRIGÉ : POST au lieu de PUT

// Routes pour les photos
router.post("/picture", upload.single("profilePicture"), uploadProfilePicture); // CORRIGÉ : POST
router.delete("/picture", deleteProfilePicture);

export default router;