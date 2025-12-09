import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Configuration multer avec limites augmentées
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `fichiers-${uniqueSuffix}${extension}`);
  },
});

// Filtre des types de fichiers
const fileFilter = (req, file, cb) => {
  console.log("🎯 [FileFilter] Type MIME:", file.mimetype);
  console.log("🎯 [FileFilter] Nom fichier:", file.originalname);

  // Types autorisés étendus
  const allowedTypes = [
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",

    // Vidéos
    "video/mp4",
    "video/mpeg",
    "video/ogg",
    "video/webm",
    "video/quicktime",
    "video/x-msvideo", // avi
    "video/x-matroska", // mkv
    "video/3gpp",

    // Documents
    "application/pdf",
    "text/plain",
    "text/markdown",
    "text/csv",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-powerpoint", // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/zip",
    "application/vnd.rar",
    "application/x-7z-compressed",
    "application/x-tar",
    "application/gzip",
  ];

  // Vérification par extension aussi pour plus de sécurité
  const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
    ".bmp",
    ".tiff",
    ".mp4",
    ".mpeg",
    ".ogg",
    ".webm",
    ".mov",
    ".avi",
    ".mkv",
    ".3gp",
    ".pdf",
    ".txt",
    ".md",
    ".csv",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".xls",
    ".xlsx",
    ".zip",
    ".rar",
    ".7z",
    ".tar",
    ".gz",
  ];

  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (
    allowedTypes.includes(file.mimetype) &&
    allowedExtensions.includes(fileExtension)
  ) {
    console.log(
      "✅ Type autorisé:",
      file.mimetype,
      "Extension:",
      fileExtension,
    );
    cb(null, true);
  } else {
    console.log("❌ Type refusé:", file.mimetype, "Extension:", fileExtension);
    cb(
      new Error(
        `Type de fichier non supporté: ${file.mimetype}. Extensions autorisées: ${allowedExtensions.join(", ")}`,
      ),
      false,
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 5, // Maximum 5 fichiers
  },
});

// Route d'upload
router.post(
  "/upload",
  authenticateToken,
  upload.array("fichiers", 5),
  async (req, res) => {
    try {
      console.log("🎯 [Upload] Fichiers reçus:", req.files);

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Aucun fichier uploadé",
        });
      }

      // Préparer la réponse avec les URLs des médias
      const medias = req.files.map((file) => {
        // Déterminer le type de média
        let fileType = "document";
        if (file.mimetype.startsWith("image/")) fileType = "image";
        else if (file.mimetype.startsWith("video/")) fileType = "video";

        return {
          url: `http://localhost:5000/uploads/${file.filename}`,
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          fileType: fileType,
          mimetype: file.mimetype,
        };
      });

      console.log("✅ [Upload] Médias traités:", medias);

      res.json({
        success: true,
        message: `${req.files.length} fichier(s) uploadé(s) avec succès`,
        medias: medias,
      });
    } catch (error) {
      console.error("🔥 Erreur upload:", error);
      res.status(500).json({
        success: false,
        error: "Erreur lors de l'upload: " + error.message,
      });
    }
  },
);

export default router;
