// Importe la connexion à la base de données
import pool from "../config/db.js";

/**
 * @param {Array} rolesAllowed - Tableau des rôles autorisés ['auteur', 'editeur', 'admin']
 */
const checkRole = (rolesAllowed) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: "Utilisateur non authentifié",
        });
      }
      if (!rolesAllowed.includes(req.user.role)) {
        return res.status(403).json({
          error: `Accès refusé. Rôles autorisés: ${rolesAllowed.join(", ")}`,
        });
      }

      next();
    } catch (error) {
      console.error("❌ Erreur vérification rôle:", error);
      res.status(500).json({
        error: "Erreur serveur lors de la vérification des permissions",
      });
    }
  };
};

const checkLivreOwnership = async (req, res, next) => {
  try {
    // Récupère l'ID du livre
    const livreId = req.params.id;

    // Récupère l'ID et le rôle de l'utilisateur connecté
    const userId = req.user.id;
    const userRole = req.user.role;

    // Si l'utilisateur est admin, il a tous les droits
    if (userRole === "admin") {
      return next();
    }

    // Récupérer l'auteur du livre
    const livreResult = await pool.query(
      "SELECT auteur_id FROM livres WHERE id = $1",
      [livreId],
    );

    // Vérifie si le livre existe
    if (livreResult.rows.length === 0) {
      return res.status(404).json({
        error: "Livre non trouvé",
      });
    }

    // Récupère l'ID de l'auteur du livre
    const livreAuteurId = livreResult.rows[0].auteur_id;

    // Vérifie si l'utilisateur est l'auteur OU un éditeur
    if (
      parseInt(userId) === parseInt(livreAuteurId) ||
      userRole === "editeur"
    ) {
      return next(); // Autorise l'accès
    }

    // Si aucun des cas ci-dessus, accès refusé
    return res.status(403).json({
      error:
        "Vous devez être le propriétaire de ce livre pour effectuer cette action",
    });
  } catch (error) {
    console.error("❌ Erreur vérification propriété:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la vérification des droits",
    });
  }
};

// Exporte les fonctions
export { checkRole, checkLivreOwnership };
