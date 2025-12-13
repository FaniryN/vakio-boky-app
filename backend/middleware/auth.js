// import jwt from "jsonwebtoken";
// import pool from "../config/db.js";

// const authenticateToken = async (req, res, next) => {
//   try {
//     console.log("🔍 Middleware auth appelé pour:", req.method, req.path);
    
//     // Récupérer le token depuis Authorization header
//     const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    
//     if (!authHeader) {
//       console.log("❌ Header Authorization manquant");
//       return res.status(401).json({ 
//         success: false,
//         error: "Token d'authentification manquant" 
//       });
//     }

//     // Support multiple formats: "Bearer token" or just "token"
//     const token = authHeader.startsWith("Bearer ") 
//       ? authHeader.split(" ")[1] 
//       : authHeader;

//     console.log("🔑 Token extrait (premiers 20 chars):", token ? `${token.substring(0, 20)}...` : "AUCUN");

//     if (!token) {
//       console.log("❌ Token manquant");
//       return res.status(401).json({ 
//         success: false,
//         error: "Token manquant. Veuillez vous connecter." 
//       });
//     }

//     // Vérification JWT
//     if (!process.env.JWT_SECRET) {
//       console.error("❌ JWT_SECRET manquant dans .env");
//       return res.status(500).json({
//         success: false,
//         error: "Configuration serveur incorrecte"
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("✅ Token vérifié, user ID:", decoded.id);

//     // Récupérer l'utilisateur depuis PostgreSQL
//     const result = await pool.query(
//       `SELECT id, nom, email, role, telephone, genre_prefere, bio, photo_profil 
//        FROM utilisateur WHERE id = $1`,
//       [decoded.id]
//     );

//     if (result.rows.length === 0) {
//       console.log("❌ Utilisateur non trouvé en base");
//       return res.status(401).json({ 
//         success: false,
//         error: "Utilisateur non trouvé" 
//       });
//     }

//     req.user = result.rows[0];
//     console.log("👤 User trouvé:", { 
//       id: req.user.id, 
//       email: req.user.email,
//       role: req.user.role,
//       nom: req.user.nom 
//     });
    
//     next();
    
//   } catch (err) {
//     console.error("🔥 Erreur auth middleware:", err.name, "-", err.message);
    
//     if (err.name === "TokenExpiredError") {
//       return res.status(403).json({ 
//         success: false,
//         error: "Token expiré. Veuillez vous reconnecter." 
//       });
//     }
    
//     if (err.name === "JsonWebTokenError") {
//       return res.status(403).json({ 
//         success: false,
//         error: "Token invalide" 
//       });
//     }
    
//     console.error("❌ Erreur inattendue:", err);
//     return res.status(500).json({ 
//       success: false,
//       error: "Erreur d'authentification" 
//     });
//   }
// };

// // Middleware admin simplifié
// const requireAdmin = (req, res, next) => {
//   console.log("🛡️ Vérification admin pour:", req.path);
  
//   if (!req.user) {
//     console.log("❌ Non authentifié dans requireAdmin");
//     return res.status(401).json({ 
//       success: false,
//       error: "Non authentifié" 
//     });
//   }

//   console.log("👑 Rôle utilisateur:", req.user.role);
  
//   if (req.user.role !== 'admin') {
//     console.log("❌ Accès refusé: rôle", req.user.role, "au lieu de admin");
//     return res.status(403).json({ 
//       success: false,
//       error: "Accès réservé aux administrateurs" 
//     });
//   }

//   console.log("✅ Admin vérifié avec succès");
//   next();
// };

// // Middleware pour rôles multiples
// const checkRole = (roles) => {
//   return (req, res, next) => {
//     console.log("🎭 Vérification rôle:", roles);
//     console.log("👤 Rôle de l'utilisateur:", req.user?.role);
    
//     if (!req.user) {
//       return res.status(401).json({ 
//         success: false,
//         error: "Non authentifié" 
//       });
//     }

//     if (!roles.includes(req.user.role)) {
//       console.log("❌ Rôle insuffisant. Requis:", roles, "Actuel:", req.user.role);
//       return res.status(403).json({ 
//         success: false,
//         error: "Accès non autorisé" 
//       });
//     }

//     console.log("✅ Rôle vérifié avec succès");
//     next();
//   };
// };

// export { 
//   authenticateToken, 
//   checkRole, 
//   requireAdmin 
// };
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const authenticateToken = async (req, res, next) => {
  try {
    console.log("🛡️ [Auth] Route:", req.method, req.originalUrl);
    
    // 1. Récupérer le token
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    
    if (!authHeader) {
      console.log("❌ [Auth] Pas de header Authorization");
      return res.status(401).json({ 
        success: false,
        error: "Token manquant",
        code: "NO_TOKEN"
      });
    }

    // 2. Extraire le token (supporte "Bearer token" ou "token")
    let token;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (authHeader.startsWith("bearer ")) {
      token = authHeader.substring(7);
    } else {
      token = authHeader;
    }

    console.log("🔑 [Auth] Token:", token ? `${token.substring(0, 20)}...` : "NULL");

    // 3. Vérifier le token
    if (!token || token === 'null' || token === 'undefined') {
      console.log("❌ [Auth] Token vide");
      return res.status(401).json({ 
        success: false,
        error: "Token invalide",
        code: "INVALID_TOKEN"
      });
    }

    // 4. Vérifier JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("❌ [Auth] JWT_SECRET manquant");
      return res.status(500).json({
        success: false,
        error: "Erreur serveur",
        code: "SERVER_ERROR"
      });
    }

    // 5. Décoder et vérifier le JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ [Auth] Token valide, user ID:", decoded.id);
    } catch (jwtError) {
      console.error("❌ [Auth] Erreur JWT:", jwtError.message);
      
      if (jwtError.name === "TokenExpiredError") {
        return res.status(403).json({ 
          success: false,
          error: "Token expiré",
          code: "TOKEN_EXPIRED"
        });
      }
      
      if (jwtError.name === "JsonWebTokenError") {
        return res.status(403).json({ 
          success: false,
          error: "Token invalide",
          code: "TOKEN_INVALID"
        });
      }
      
      return res.status(403).json({ 
        success: false,
        error: "Erreur d'authentification",
        code: "AUTH_ERROR"
      });
    }

    // 6. Récupérer l'utilisateur en base
    const result = await pool.query(
      `SELECT id, nom, email, role, telephone, genre_prefere, bio, photo_profil 
       FROM utilisateur WHERE id = $1`,
      [decoded.id]
    );

    if (result.rows.length === 0) {
      console.log("❌ [Auth] Utilisateur introuvable ID:", decoded.id);
      return res.status(401).json({ 
        success: false,
        error: "Utilisateur introuvable",
        code: "USER_NOT_FOUND"
      });
    }

    // 7. Attacher l'utilisateur à la requête
    req.user = result.rows[0];
    console.log("👤 [Auth] User autorisé:", req.user.nom, "Role:", req.user.role);
    
    next();
    
  } catch (error) {
    console.error("🔥 [Auth] Erreur inattendue:", error);
    return res.status(500).json({ 
      success: false,
      error: "Erreur serveur",
      code: "INTERNAL_ERROR"
    });
  }
};

// Middleware admin
const requireAdmin = (req, res, next) => {
  console.log("👑 [Admin] Vérification pour:", req.path);
  
  if (!req.user) {
    console.log("❌ [Admin] Pas d'utilisateur");
    return res.status(401).json({ 
      success: false,
      error: "Non authentifié",
      code: "NOT_AUTHENTICATED"
    });
  }

  console.log("🎭 [Admin] Rôle:", req.user.role);
  
  if (req.user.role !== 'admin') {
    console.log("❌ [Admin] Accès refusé");
    return res.status(403).json({ 
      success: false,
      error: "Accès admin requis",
      code: "NOT_ADMIN",
      userRole: req.user.role
    });
  }

  console.log("✅ [Admin] Accès autorisé");
  next();
};

// Middleware pour rôles multiples
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: "Non authentifié"
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: "Permissions insuffisantes"
      });
    }

    next();
  };
};

export { authenticateToken, checkRole, requireAdmin };