import jwt from "jsonwebtoken";
import pool from "../config/db.js";

// Middleware d'authentification SIMPLIFIÉ
export const authenticateToken = async (req, res, next) => {
  try {
    // Récupérer le token depuis Authorization header
    const authHeader = req.headers["authorization"];
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        error: "Token d'authentification manquant" 
      });
    }

    // Extraire le token (format: "Bearer token" ou juste "token")
    const token = authHeader.startsWith("Bearer ") 
      ? authHeader.substring(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: "Token manquant" 
      });
    }

    // Vérifier la configuration JWT
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET manquant dans .env");
      return res.status(500).json({
        success: false,
        error: "Configuration serveur incorrecte"
      });
    }

    // Vérifier le token JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ 
          success: false,
          error: "Token expiré" 
        });
      }
      return res.status(401).json({ 
        success: false,
        error: "Token invalide" 
      });
    }

    // Vérifier que le décodage contient un ID
    if (!decoded.id) {
      return res.status(401).json({ 
        success: false,
        error: "Token mal formé" 
      });
    }

    // Récupérer l'utilisateur depuis la base de données
    const result = await pool.query(
      `SELECT id, nom, email, role, telephone, genre_prefere, bio, photo_profil 
       FROM utilisateur 
       WHERE id = $1 AND role != 'blocked'`,
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        error: "Utilisateur non trouvé ou compte désactivé" 
      });
    }

    // Attacher l'utilisateur à la requête
    req.user = result.rows[0];
    
    next();
    
  } catch (error) {
    console.error("🔥 Erreur auth middleware:", error.message);
    return res.status(500).json({ 
      success: false,
      error: "Erreur d'authentification" 
    });
  }
};

// Middleware pour vérifier le rôle admin - VERSION SIMPLIFIÉE
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      error: "Non authentifié" 
    });
  }

  // Liste des rôles considérés comme administrateurs
  const adminRoles = ['admin', 'superadmin'];
  
  if (!adminRoles.includes(req.user.role)) {
    return res.status(403).json({ 
      success: false,
      error: "Accès réservé aux administrateurs" 
    });
  }

  next();
};

// Middleware pour vérifier plusieurs rôles
export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: "Non authentifié" 
      });
    }

    // S'assurer que allowedRoles est un tableau
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: "Accès non autorisé" 
      });
    }

    next();
  };
};

// Middleware pour vérifier la propriété
export const checkOwnership = (paramName = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: "Non authentifié" 
      });
    }

    const requestedId = parseInt(req.params[paramName]);
    const userId = req.user.id;

    // Les admins peuvent tout faire
    if (req.user.role === 'admin' || req.user.role === 'superadmin') {
      return next();
    }

    // Vérifier si l'utilisateur accède à ses propres données
    if (requestedId !== userId) {
      return res.status(403).json({ 
        success: false,
        error: "Vous ne pouvez accéder qu'à vos propres données" 
      });
    }

    next();
  };
};

// Middleware de logging (optionnel)
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const userInfo = req.user ? `user:${req.user.id}` : 'guest';
    
    console.log(`🌐 ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms - ${userInfo}`);
  });
  
  next();
};

// export { 
//   authenticateToken, 
//   checkRole, 
//   requireAdmin,
//   checkOwnership,
//   requestLogger
// };