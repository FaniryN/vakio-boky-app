import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const adminGuard = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Token d'authentification manquant ou invalide"
      });
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Token manquant"
      });
    }

    // Vérifier et décoder le token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error("❌ Erreur vérification JWT:", jwtError);
      return res.status(401).json({
        success: false,
        error: "Token invalide ou expiré"
      });
    }

    // Récupérer l'utilisateur depuis la base de données
    const userResult = await pool.query(
      "SELECT id, nom, email, role FROM utilisateur WHERE id = $1",
      [decoded.id || decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé"
      });
    }

    const user = userResult.rows[0];

    // Vérifier le rôle administrateur
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: "Accès réservé aux administrateurs"
      });
    }

    // Ajouter l'utilisateur à la requête pour usage ultérieur
    req.user = user;
    next();
    
  } catch (error) {
    console.error("❌ Erreur middleware adminGuard:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la vérification des permissions"
    });
  }
};

export default adminGuard;