import pool from "../config/db.js";

/**
 * Middleware pour vérifier si l'utilisateur est modérateur ou admin
 */
export const requireModerator = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Utilisateur non trouvé",
      });
    }

    const userRole = result.rows[0].role;
    
    // Vérifier si l'utilisateur est admin ou modérateur
    if (userRole !== 'admin' && userRole !== 'moderator') {
      return res.status(403).json({
        success: false,
        error: "Accès réservé aux modérateurs et administrateurs",
      });
    }

    // Ajouter le rôle à la requête pour utilisation ultérieure
    req.user.role = userRole;
    next();
  } catch (error) {
    console.error("❌ Error in moderator middleware:", error);
    res.status(500).json({
      success: false,
      error: "Erreur vérification permissions",
    });
  }
};

/**
 * Middleware pour vérifier les permissions spécifiques
 */
export const checkModerationPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Récupérer les permissions de l'utilisateur
      const result = await pool.query(
        `SELECT mp.permission 
         FROM moderator_permissions mp
         JOIN utilisateur u ON mp.role = u.role
         WHERE u.id = $1 AND mp.permission = $2`,
        [userId, requiredPermission]
      );

      if (result.rows.length === 0 && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: `Permission "${requiredPermission}" requise`,
        });
      }

      next();
    } catch (error) {
      console.error("❌ Error checking moderation permission:", error);
      res.status(500).json({
        success: false,
        error: "Erreur vérification permission",
      });
    }
  };
};