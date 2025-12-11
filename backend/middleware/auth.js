// import jwt from "jsonwebtoken";
// import pool from "../config/db.js";

// const authenticateToken = async (req, res, next) => {
//   try {
//     console.log("🔍 Middleware auth appelé pour:", req.path);
//     console.log("📨 Headers reçus:", req.headers);
    
//     // Récupérer le token depuis Authorization header
//     const authHeader = req.headers["authorization"];
//     console.log("📦 Header Authorization:", authHeader);
    
//     const token = authHeader && authHeader.split(" ")[1];

//     console.log("🔑 Token extrait:", token ? token.substring(0, 20) + "..." : "AUCUN");

//     if (!token) {
//       console.log("❌ Token manquant dans la requête");
//       return res.status(401).json({ 
//         success: false,
//         error: "Token manquant. Veuillez vous connecter." 
//       });
//     }

//     // Vérifier le format du token
//     const tokenParts = token.split('.');
//     console.log("📊 Token parties:", tokenParts.length);
    
//     if (tokenParts.length !== 3) {
//       console.log("❌ Token malformé, pas 3 parties");
//       return res.status(403).json({ 
//         success: false,
//         error: "Token invalide (format incorrect)" 
//       });
//     }

//     // Décoder pour voir le contenu (sans vérifier la signature pour debug)
//     try {
//       const decoded = jwt.decode(token);
//       console.log("🔓 Token décodé (sans vérif):", decoded);
//     } catch (decodeErr) {
//       console.log("❌ Impossible de décoder le token:", decodeErr.message);
//     }

//     // Vérifier avec le secret
//     console.log("🔐 Vérification avec JWT_SECRET:", process.env.JWT_SECRET ? "PRÉSENT" : "ABSENT");
    
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "vakio-boky-secret-key-2025");
//     console.log("✅ Token vérifié, user ID:", decoded.id);

//     // Récupérer l'utilisateur depuis PostgreSQL
//     console.log("📡 Requête SQL pour user ID:", decoded.id);
    
//     const result = await pool.query(
//       `SELECT id, nom, email, role, telephone, genre_prefere, bio, photo_profil 
//        FROM utilisateur WHERE id = $1`,
//       [decoded.id],
//     );

//     console.log("📋 Résultat SQL:", result.rows.length, "lignes trouvées");

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
//     console.error("📝 Stack:", err.stack);
    
//     if (err.name === "TokenExpiredError") {
//       return res.status(403).json({ 
//         success: false,
//         error: "Token expiré. Veuillez vous reconnecter." 
//       });
//     }
    
//     if (err.name === "JsonWebTokenError") {
//       return res.status(403).json({ 
//         success: false,
//         error: "Token invalide - " + err.message 
//       });
//     }
    
//     return res.status(403).json({ 
//       success: false,
//       error: "Erreur d'authentification: " + err.message 
//     });
//   }
// };

// const checkRole = (roles) => {
//   return (req, res, next) => {
//     console.log("🎭 Vérification rôle:", roles);
//     console.log("👤 Rôle de l'utilisateur:", req.user?.role);
    
//     if (!req.user) {
//       console.log("❌ Non authentifié dans checkRole");
//       return res.status(401).json({ 
//         success: false,
//         error: "Non authentifié" 
//       });
//     }

//     if (!roles.includes(req.user.role)) {
//       console.log("❌ Rôle insuffisant. Requis:", roles, "Actuel:", req.user.role);
//       return res.status(403).json({ 
//         success: false,
//         error: "Accès non autorisé. Rôle requis: " + roles.join(", ") 
//       });
//     }

//     console.log("✅ Rôle vérifié avec succès");
//     next();
//   };
// };

// // Middleware admin simplifié
// const requireAdmin = (req, res, next) => {
//   console.log("🛡️ Vérification admin...");
  
//   if (!req.user) {
//     console.log("❌ Non authentifié dans requireAdmin");
//     return res.status(401).json({ 
//       success: false,
//       error: "Non authentifié" 
//     });
//   }

//   console.log("👑 Rôle utilisateur:", req.user.role);
  
//   if (req.user.role !== 'admin') {
//     console.log("❌ Accès refusé: pas admin");
//     return res.status(403).json({ 
//       success: false,
//       error: "Accès réservé aux administrateurs" 
//     });
//   }

//   console.log("✅ Admin vérifié avec succès");
//   next();
// };

// // Fonction utilitaire pour obtenir l'utilisateur depuis le token
// const getUserFromToken = async (token) => {
//   try {
//     if (!token) return null;
    
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "vakio-boky-secret-key-2025");
    
//     const result = await pool.query(
//       `SELECT id, nom, email, role FROM utilisateur WHERE id = $1`,
//       [decoded.id],
//     );
    
//     return result.rows[0] || null;
//   } catch (error) {
//     console.error("Erreur getUserFromToken:", error.message);
//     return null;
//   }
// };

// // Middleware optionnel pour les routes publiques/protégées
// const optionalAuth = async (req, res, next) => {
//   try {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1];

//     if (token) {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET || "vakio-boky-secret-key-2025");
//       const result = await pool.query(
//         `SELECT id, nom, email, role FROM utilisateur WHERE id = $1`,
//         [decoded.id],
//       );
      
//       if (result.rows.length > 0) {
//         req.user = result.rows[0];
//         console.log("🔓 Utilisateur optionnel trouvé:", req.user.email);
//       }
//     }
    
//     next();
//   } catch (error) {
//     // Ignorer les erreurs d'authentification pour les routes optionnelles
//     console.log("⚠️ Auth optionnel ignoré:", error.message);
//     next();
//   }
// };

// export { 
//   authenticateToken, 
//   checkRole, 
//   requireAdmin, 
//   getUserFromToken,
//   optionalAuth 
// };
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const authenticateToken = async (req, res, next) => {
  try {
    console.log("🔍 Middleware auth appelé pour:", req.path);
    
    // Récupérer le token depuis Authorization header
    const authHeader = req.headers["authorization"];
    console.log("📨 Header Authorization:", authHeader ? authHeader.substring(0, 50) + "..." : "AUCUN");
    
    const token = authHeader && authHeader.split(" ")[1];

    console.log("🔑 Token extrait:", token ? token.substring(0, 20) + "..." : "AUCUN");

    if (!token) {
      console.log("❌ Token manquant dans la requête");
      return res.status(401).json({ 
        success: false,
        error: "Token manquant. Veuillez vous connecter." 
      });
    }

    // CORRECTION CRITIQUE : Utiliser UNIQUEMENT le JWT_SECRET de l'environnement
    console.log("🔐 Vérification avec JWT_SECRET:", process.env.JWT_SECRET ? "PRÉSENT" : "ABSENT");
    
    // IMPORTANT : Pas de secret par défaut !
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log("✅ Token vérifié, user ID:", decoded.id);

    // Récupérer l'utilisateur depuis PostgreSQL
    const result = await pool.query(
      `SELECT id, nom, email, role, telephone, genre_prefere, bio, photo_profil 
       FROM utilisateur WHERE id = $1`,
      [decoded.id],
    );

    if (result.rows.length === 0) {
      console.log("❌ Utilisateur non trouvé en base");
      return res.status(401).json({ 
        success: false,
        error: "Utilisateur non trouvé" 
      });
    }

    req.user = result.rows[0];
    console.log("👤 User trouvé:", { 
      id: req.user.id, 
      email: req.user.email,
      role: req.user.role,
      nom: req.user.nom 
    });
    
    next();
    
  } catch (err) {
    console.error("🔥 Erreur auth middleware:", err.name, "-", err.message);
    
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ 
        success: false,
        error: "Token expiré. Veuillez vous reconnecter." 
      });
    }
    
    if (err.name === "JsonWebTokenError") {
      console.error("❌ Détail erreur JWT:", err.message);
      return res.status(403).json({ 
        success: false,
        error: "Token invalide - " + err.message 
      });
    }
    
    return res.status(403).json({ 
      success: false,
      error: "Erreur d'authentification: " + err.message 
    });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    console.log("🎭 Vérification rôle:", roles);
    console.log("👤 Rôle de l'utilisateur:", req.user?.role);
    
    if (!req.user) {
      console.log("❌ Non authentifié dans checkRole");
      return res.status(401).json({ 
        success: false,
        error: "Non authentifié" 
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log("❌ Rôle insuffisant. Requis:", roles, "Actuel:", req.user.role);
      return res.status(403).json({ 
        success: false,
        error: "Accès non autorisé. Rôle requis: " + roles.join(", ") 
      });
    }

    console.log("✅ Rôle vérifié avec succès");
    next();
  };
};

// Middleware admin simplifié
const requireAdmin = (req, res, next) => {
  console.log("🛡️ Vérification admin...");
  
  if (!req.user) {
    console.log("❌ Non authentifié dans requireAdmin");
    return res.status(401).json({ 
      success: false,
      error: "Non authentifié" 
    });
  }

  console.log("👑 Rôle utilisateur:", req.user.role);
  
  if (req.user.role !== 'admin') {
    console.log("❌ Accès refusé: pas admin");
    return res.status(403).json({ 
      success: false,
      error: "Accès réservé aux administrateurs" 
    });
  }

  console.log("✅ Admin vérifié avec succès");
  next();
};

// Fonction utilitaire pour obtenir l'utilisateur depuis le token
const getUserFromToken = async (token) => {
  try {
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const result = await pool.query(
      `SELECT id, nom, email, role FROM utilisateur WHERE id = $1`,
      [decoded.id],
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error("Erreur getUserFromToken:", error.message);
    return null;
  }
};

// Middleware optionnel pour les routes publiques/protégées
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await pool.query(
        `SELECT id, nom, email, role FROM utilisateur WHERE id = $1`,
        [decoded.id],
      );
      
      if (result.rows.length > 0) {
        req.user = result.rows[0];
        console.log("🔓 Utilisateur optionnel trouvé:", req.user.email);
      }
    }
    
    next();
  } catch (error) {
    // Ignorer les erreurs d'authentification pour les routes optionnelles
    console.log("⚠️ Auth optionnel ignoré:", error.message);
    next();
  }
};

export { 
  authenticateToken, 
  checkRole, 
  requireAdmin, 
  getUserFromToken,
  optionalAuth 
};