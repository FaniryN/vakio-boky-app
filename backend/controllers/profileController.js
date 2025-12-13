import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";
import { cleanImageUrl, getSafeProfileImage } from "./authController.js";

// Obtenir le profil utilisateur
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT 
        id, nom, email, role, telephone, genre_prefere, 
        bio, photo_profil, accepte_newsletter, created_at, updated_at 
       FROM utilisateur 
       WHERE id = $1`,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: "Utilisateur non trouvé" 
      });
    }

    const user = result.rows[0];
    
    // Utiliser l'image sécurisée - peut retourner null si pas de photo
    user.photo_profil = getSafeProfileImage(user.photo_profil);
    
    res.json({ 
      success: true,
      user 
    });
  } catch (error) {
    console.error("Erreur getProfile:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur" 
    });
  }
};

// Mettre à jour le profil
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nom, telephone, genre_prefere, bio, accepte_newsletter } = req.body;

    // Mettre à jour les champs autorisés
    const result = await pool.query(
      `UPDATE utilisateur 
       SET nom = $1, telephone = $2, genre_prefere = $3, 
           bio = $4, accepte_newsletter = $5, updated_at = NOW()
       WHERE id = $6 
       RETURNING id, nom, email, role, telephone, genre_prefere, bio, photo_profil, accepte_newsletter, created_at, updated_at`,
      [nom, telephone, genre_prefere, bio, accepte_newsletter, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: "Utilisateur non trouvé" 
      });
    }

    const user = result.rows[0];
    // Utiliser l'image sécurisée - peut être null
    user.photo_profil = getSafeProfileImage(user.photo_profil);

    res.json({
      success: true,
      message: "Profil mis à jour avec succès",
      user: user,
    });
  } catch (error) {
    console.error("Erreur updateProfile:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur" 
    });
  }
};

// Changer le mot de passe
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        error: "Tous les champs sont requis" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Le nouveau mot de passe doit contenir au moins 6 caractères",
      });
    }

    // Récupérer le mot de passe actuel
    const userResult = await pool.query(
      "SELECT mot_de_passe FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: "Utilisateur non trouvé" 
      });
    }

    const user = userResult.rows[0];

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.mot_de_passe,
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ 
        success: false,
        error: "Mot de passe actuel incorrect" 
      });
    }

    // Hasher le nouveau mot de passe
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Mettre à jour le mot de passe
    await pool.query(
      "UPDATE utilisateur SET mot_de_passe = $1, updated_at = NOW() WHERE id = $2",
      [hashedNewPassword, userId],
    );

    res.json({ 
      success: true,
      message: "Mot de passe modifié avec succès" 
    });
  } catch (error) {
    console.error("Erreur changePassword:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur" 
    });
  }
};

// ==================== UPLOAD PHOTO DE PROFIL ====================

// Configuration Multer pour l'upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = "uploads/profiles/";
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     cb(null, "profile-" + req.user.id + "-" + uniqueSuffix + ext);
//   },
// });
// Configuration Multer pour l'upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/profiles/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // CE CODE GÉNÈRE LES NOMS : "profile-2-timestamp-random.ext"
    // C'est NORMAL si un upload est fait
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "profile-" + req.user.id + "-" + uniqueSuffix + ext);
  },
});
// Filtre pour n'accepter que les images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Seules les images sont autorisées!"), false);
  }
};

// Middleware Multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

// Upload de la photo de profil
// const uploadProfilePicture = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Aucun fichier uploadé" 
//       });
//     }

//     const userId = req.user.id;
//     const photoUrl = `/uploads/profiles/${req.file.filename}`;

//     console.log(`✅ Upload photo pour user ${userId}: ${photoUrl}`);

//     // Mettre à jour dans la base de données
//     const result = await pool.query(
//       `UPDATE utilisateur 
//        SET photo_profil = $1, updated_at = NOW()
//        WHERE id = $2 
//        RETURNING id, nom, email, photo_profil, role, telephone, genre_prefere, bio`,
//       [photoUrl, userId],
//     );

//     if (result.rows.length === 0) {
//       // Supprimer le fichier si l'utilisateur n'existe pas
//       fs.unlinkSync(req.file.path);
//       return res.status(404).json({ 
//         success: false,
//         error: "Utilisateur non trouvé" 
//       });
//     }

//     const user = result.rows[0];
//     // Retourner l'URL directement (pas de nettoyage supplémentaire)
//     user.photo_profil = photoUrl;

//     res.json({
//       success: true,
//       message: "Photo de profil mise à jour avec succès",
//       user: user,
//       photoUrl: photoUrl,
//     });
//   } catch (error) {
//     console.error("Erreur uploadProfilePicture:", error);

//     // Supprimer le fichier uploadé en cas d'erreur
//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }

//     res.status(500).json({ 
//       success: false,
//       error: "Erreur lors de l'upload de la photo" 
//     });
//   }
// };
// profileController.js - Dans uploadProfilePicture, VOIR CE QUI GÉNÈRE LES NOMS DE FICHIERS

// Upload de la photo de profil - VÉRIFIER CE QUI GÉNÈRE LES URLS
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: "Aucun fichier uploadé" 
      });
    }

    const userId = req.user.id;
    
    // ICI : req.file.filename est généré par Multer !
    // Il crée des noms comme "profile-2-1765452238311-472637228.png"
    const photoUrl = `/uploads/profiles/${req.file.filename}`;

    console.log(`✅ Upload photo pour user ${userId}: ${photoUrl}`);

    // Mettre à jour dans la base de données
    const result = await pool.query(
      `UPDATE utilisateur 
       SET photo_profil = $1, updated_at = NOW()
       WHERE id = $2 
       RETURNING id, nom, email, photo_profil, role, telephone, genre_prefere, bio`,
      [photoUrl, userId], // ICI : photoUrl est stockée en base !
    );

    if (result.rows.length === 0) {
      // Supprimer le fichier si l'utilisateur n'existe pas
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ 
        success: false,
        error: "Utilisateur non trouvé" 
      });
    }

    const user = result.rows[0];
    // Retourner l'URL directement
    user.photo_profil = photoUrl;

    res.json({
      success: true,
      message: "Photo de profil mise à jour avec succès",
      user: user,
      photoUrl: photoUrl,
    });
  } catch (error) {
    console.error("Erreur uploadProfilePicture:", error);

    // Supprimer le fichier uploadé en cas d'erreur
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      success: false,
      error: "Erreur lors de l'upload de la photo" 
    });
  }
};
// Supprimer la photo de profil
const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    // Récupérer l'ancienne photo
    const userResult = await pool.query(
      "SELECT photo_profil FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: "Utilisateur non trouvé" 
      });
    }

    const oldPhoto = userResult.rows[0].photo_profil;

    // Supprimer le fichier physique seulement si la photo existe
    if (oldPhoto) {
      const cleanUrl = cleanImageUrl(oldPhoto, "profile");
      if (cleanUrl && cleanUrl.startsWith('/uploads/')) {
        const oldPhotoPath = path.join(process.cwd(), cleanUrl);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
          console.log(`🗑️ Photo supprimée: ${oldPhotoPath}`);
        }
      }
    }

    // Mettre à jour la base de données - mettre NULL pour indiquer "pas de photo"
    const result = await pool.query(
      `UPDATE utilisateur 
       SET photo_profil = NULL, updated_at = NOW()
       WHERE id = $1 
       RETURNING id, nom, email, photo_profil`,
      [userId],
    );

    const user = result.rows[0];
    user.photo_profil = null; // Explicitement null

    res.json({
      success: true,
      message: "Photo de profil supprimée avec succès",
      user: user,
    });
  } catch (error) {
    console.error("Erreur deleteProfilePicture:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur lors de la suppression de la photo" 
    });
  }
};

const getUserStatistics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Helper function to safely execute queries
    const safeQuery = async (query, params = []) => {
      try {
        const result = await pool.query(query, params);
        return parseInt(result.rows[0].count) || 0;
      } catch (error) {
        console.warn(`Query failed: ${query}`, error.message);
        return 0;
      }
    };

    // Get all statistics in parallel for better performance
    const [
      postsCount,
      likesReceivedCount,
      commentsMadeCount,
      clubsJoinedCount,
      eventsRegisteredCount,
      booksPublishedCount,
      excerptsCreatedCount,
      booksReadCount,
      totalReadingTime,
      totalPagesRead,
    ] = await Promise.all([
      safeQuery("SELECT COUNT(*) as count FROM posts WHERE auteur_id = $1", [userId]),
      safeQuery("SELECT COUNT(*) as count FROM post_likes WHERE user_id = $1", [userId]),
      safeQuery("SELECT COUNT(*) as count FROM comments WHERE user_id = $1", [userId]),
      safeQuery("SELECT COUNT(*) as count FROM club_members WHERE user_id = $1", [userId]),
      safeQuery("SELECT COUNT(*) as count FROM event_registrations WHERE user_id = $1", [userId]),
      safeQuery("SELECT COUNT(*) as count FROM livres WHERE auteur_id = $1", [userId]),
      safeQuery("SELECT COUNT(e.id) as count FROM extraits e JOIN livres l ON e.livre_id = l.id WHERE l.auteur_id = $1", [userId]),
      safeQuery("SELECT COUNT(DISTINCT book_id) as count FROM reading_sessions WHERE user_id = $1 AND end_time IS NOT NULL", [userId]),
      safeQuery("SELECT COALESCE(SUM(time_spent_minutes), 0) as count FROM reading_sessions WHERE user_id = $1 AND end_time IS NOT NULL", [userId]),
      safeQuery("SELECT COALESCE(SUM(pages_read), 0) as count FROM reading_sessions WHERE user_id = $1 AND end_time IS NOT NULL", [userId]),
    ]);

    const statistics = {
      postsCount,
      likesReceivedCount,
      commentsMadeCount,
      clubsJoinedCount,
      eventsRegisteredCount,
      booksPublishedCount,
      excerptsCreatedCount,
      booksReadCount,
      totalReadingTime,
      totalPagesRead,
    };

    res.json({ 
      success: true,
      statistics 
    });
  } catch (error) {
    console.error("Erreur getUserStatistics:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur lors de la récupération des statistiques" 
    });
  }
};

export {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
  deleteProfilePicture,
  getUserStatistics,
};