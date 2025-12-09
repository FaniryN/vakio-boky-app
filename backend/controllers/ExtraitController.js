import pool from "../config/db.js";

class ExtraitController {
  // CRUD EXTRAITS
  async createExtrait(req, res) {
    const { livre_id, titre, contenu, chapitre, page_debut, page_fin } =
      req.body;
    const userId = req.user.id;

    try {
      // Vérifier que l'utilisateur est l'auteur du livre
      const livreCheck = await pool.query(
        "SELECT auteur_id FROM livres WHERE id = $1",
        [livre_id],
      );

      if (livreCheck.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Livre non trouvé" });
      }

      if (livreCheck.rows[0].auteur_id !== userId) {
        return res.status(403).json({ success: false, error: "Non autorisé" });
      }

      const result = await pool.query(
        `INSERT INTO extraits (livre_id, titre, contenu, chapitre, page_debut, page_fin) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [livre_id, titre, contenu, chapitre, page_debut, page_fin],
      );

      res.status(201).json({
        success: true,
        message: "Extrait créé avec succès",
        extrait: result.rows[0],
      });
    } catch (error) {
      console.error("❌ Erreur création extrait:", error);
      res.status(500).json({ success: false, error: "Erreur serveur" });
    }
  }

  async getExtraitsByLivre(req, res) {
    const livreId = req.params.livreId;

    try {
      const result = await pool.query(
        `
        SELECT e.*, l.titre as livre_titre, u.nom as auteur_nom
        FROM extraits e
        JOIN livres l ON e.livre_id = l.id
        JOIN utilisateur u ON l.auteur_id = u.id
        WHERE e.livre_id = $1 AND e.statut = 'publié'
        ORDER BY e.chapitre, e.page_debut
      `,
        [livreId],
      );

      res.json({ success: true, extraits: result.rows });
    } catch (error) {
      console.error("❌ Erreur récupération extraits:", error);
      res.status(500).json({ success: false, error: "Erreur serveur" });
    }
  }

  async updateExtrait(req, res) {
    const extraitId = req.params.id;
    const userId = req.user.id;
    const { titre, contenu, chapitre, page_debut, page_fin, statut } = req.body;

    try {
      // Vérifier les permissions via la jointure livre
      const extraitCheck = await pool.query(
        `
        SELECT l.auteur_id 
        FROM extraits e
        JOIN livres l ON e.livre_id = l.id
        WHERE e.id = $1
      `,
        [extraitId],
      );

      if (extraitCheck.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Extrait non trouvé" });
      }

      if (extraitCheck.rows[0].auteur_id !== userId) {
        return res.status(403).json({ success: false, error: "Non autorisé" });
      }

      const result = await pool.query(
        `UPDATE extraits 
         SET titre = $1, contenu = $2, chapitre = $3, page_debut = $4, page_fin = $5, statut = $6, updated_at = CURRENT_TIMESTAMP
         WHERE id = $7 
         RETURNING *`,
        [titre, contenu, chapitre, page_debut, page_fin, statut, extraitId],
      );

      res.json({
        success: true,
        message: "Extrait modifié avec succès",
        extrait: result.rows[0],
      });
    } catch (error) {
      console.error("❌ Erreur modification extrait:", error);
      res.status(500).json({ success: false, error: "Erreur serveur" });
    }
  }

  async deleteExtrait(req, res) {
    const extraitId = req.params.id;
    const userId = req.user.id;

    try {
      const extraitCheck = await pool.query(
        `
        SELECT l.auteur_id 
        FROM extraits e
        JOIN livres l ON e.livre_id = l.id
        WHERE e.id = $1
      `,
        [extraitId],
      );

      if (extraitCheck.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Extrait non trouvé" });
      }

      if (extraitCheck.rows[0].auteur_id !== userId) {
        return res.status(403).json({ success: false, error: "Non autorisé" });
      }

      await pool.query("DELETE FROM extraits WHERE id = $1", [extraitId]);

      res.json({ success: true, message: "Extrait supprimé avec succès" });
    } catch (error) {
      console.error("❌ Erreur suppression extrait:", error);
      res.status(500).json({ success: false, error: "Erreur serveur" });
    }
  }
}

export default new ExtraitController();
