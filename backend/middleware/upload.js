import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, "-");
    cb(null, name + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = {
    "image/jpeg": true,
    "image/jpg": true,
    "image/png": true,
    "image/gif": true,
    "image/webp": true,
    "video/mp4": true,
    "video/mpeg": true,
    "application/pdf": true,
  };

  if (allowed[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`Type non supporté: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5,
  },
});

const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "Fichier trop volumineux (max 10MB)" });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ error: "Trop de fichiers (max 5)" });
    }
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

const generateFileUrl = (req, filename) => {
  if (process.env.NODE_ENV === 'production' || req.hostname.includes('render.com') || req.hostname.includes('onrender.com')) {
    const baseUrl = process.env.BACKEND_URL || `https://${req.hostname}`;
    return `${baseUrl}/uploads/${filename}`;
  }
  
  return `/uploads/${filename}`;
};

const processUpload = async (req, res) => {
  try {
    console.log("📤 [upload] Upload en cours...");
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Aucun fichier fourni"
      });
    }

    const uploadedFiles = req.files.map(file => {
      const fileUrl = generateFileUrl(req, file.filename);
      
      console.log(`✅ [upload] Fichier: ${file.filename}, URL: ${fileUrl}`);
      
      return {
        id: Date.now() + Math.random(),
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: fileUrl,
        path: `/uploads/${file.filename}`
      };
    });

    console.log(`✅ [upload] ${uploadedFiles.length} fichier(s) uploadé(s)`);
    
    res.json({
      success: true,
      message: `${uploadedFiles.length} fichier(s) uploadé(s) avec succès`,
      medias: uploadedFiles,
      count: uploadedFiles.length
    });
  } catch (error) {
    console.error("❌ [upload] Erreur lors du traitement:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de l'upload"
    });
  }
};

const processSingleUpload = async (req, res) => {
  try {
    console.log("📤 [upload-single] Upload single en cours...");
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Aucun fichier fourni"
      });
    }

    const fileUrl = generateFileUrl(req, req.file.filename);
    
    console.log(`✅ [upload-single] Fichier uploadé: ${req.file.filename}`);
    console.log(`🔗 [upload-single] URL: ${fileUrl}`);
    
    res.json({
      success: true,
      message: "Fichier uploadé avec succès",
      media: {
        id: Date.now(),
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        path: `/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error("❌ [upload-single] Erreur:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de l'upload"
    });
  }
};

const deleteMediaFile = async (filename) => {
  try {
    const filePath = path.join(uploadDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ [upload] Fichier supprimé: ${filename}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ [upload] Erreur suppression fichier ${filename}:`, error);
    return false;
  }
};

export { 
  upload, 
  handleUploadErrors, 
  generateFileUrl,
  processUpload,
  processSingleUpload,
  deleteMediaFile
};