import pool from "../config/db.js";

/**
 * Opérations CRUD sur les commentaires
 */
class CommentController {
  async addComment(req, res) {
    const postId = req.params.postId; // Changé de id à postId
    const userId = req.user.id;
    const { contenu } = req.body;

    if (!contenu || !contenu.trim()) {
      return res.status(400).json({
        success: false,
        error: "Le commentaire ne peut pas être vide",
      });
    }

    try {
      // Vérifier d'abord que le post existe
      const postCheck = await pool.query("SELECT id FROM posts WHERE id = $1", [
        postId,
      ]);

      if (postCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Post non trouvé",
        });
      }

      const result = await pool.query(
        `INSERT INTO comments (post_id, user_id, contenu) 
       VALUES ($1, $2, $3) 
       RETURNING *, 
       (SELECT nom FROM utilisateur WHERE id = $2) as user_nom,
       (SELECT photo_profil FROM utilisateur WHERE id = $2) as user_avatar`,
        [postId, userId, contenu.trim()],
      );

      res.status(201).json({
        success: true,
        message: "Commentaire ajouté avec succès",
        comment: result.rows[0],
      });
    } catch (error) {
      console.error("❌ [addComment] Erreur:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur lors de l'ajout du commentaire",
      });
    }
  }

  //   // Dans CommentController.js - Méthode ULTRA SIMPLE
  // async getPostComments(req, res) {
  //   const postId = req.params.postId;

  //   try {
  //     console.log("📥 Récupération ULTRA SIMPLE des commentaires pour le post:", postId);

  //     // REQUÊTE ULTRA SIMPLE - juste les commentaires de base
  //     const query = `
  //       SELECT
  //         c.*,
  //         u.nom as user_nom,
  //         u.photo_profil as user_avatar
  //       FROM comments c
  //       JOIN utilisateur u ON c.user_id = u.id
  //       WHERE c.post_id = $1
  //       ORDER BY c.created_at DESC
  //     `;

  //     console.log("🔍 Exécution de la requête...");
  //     const result = await pool.query(query, [postId]);
  //     console.log(`✅ ${result.rows.length} commentaires trouvés`);

  //     res.json({
  //       success: true,
  //       comments: result.rows,
  //       total: result.rows.length,
  //     });
  //   } catch (error) {
  //     console.error("❌ [getPostComments] Erreur détaillée:", error);
  //     console.error("❌ Stack trace:", error.stack);

  //     res.status(500).json({
  //       success: false,
  //       error: "Erreur serveur lors du chargement des commentaires",
  //       details: error.message
  //     });
  //   }
  // }
  /**
   * ✅ MÉTHODE GETPOSTCOMMENTS AVEC LIKES INCLUS
   */
  async getPostComments(req, res) {
    const postId = req.params.postId;
    const userId = req.user?.id || 0;

    try {
      console.log(
        "📥 Récupération des commentaires avec likes pour le post:",
        postId,
      );

      // Requête avec informations de likes
      const query = `
        SELECT 
          c.*, 
          u.nom as user_nom, 
          u.photo_profil as user_avatar,
          COUNT(DISTINCT cl.id) as likes_count,
          EXISTS(
            SELECT 1 FROM comment_likes cl2 
            WHERE cl2.comment_id = c.id AND cl2.user_id = $2
          ) as user_liked
        FROM comments c 
        JOIN utilisateur u ON c.user_id = u.id 
        LEFT JOIN comment_likes cl ON c.id = cl.comment_id
        WHERE c.post_id = $1
        GROUP BY c.id, u.id, u.nom, u.photo_profil
        ORDER BY c.created_at DESC
      `;

      const result = await pool.query(query, [postId, userId]);
      console.log(
        `✅ ${result.rows.length} commentaires trouvés avec infos de likes`,
      );

      res.json({
        success: true,
        comments: result.rows,
        total: result.rows.length,
      });
    } catch (error) {
      console.error("❌ [getPostComments] Erreur détaillée:", error);

      res.status(500).json({
        success: false,
        error: "Erreur serveur lors du chargement des commentaires",
        details: error.message,
      });
    }
  }

  async deleteComment(req, res) {
    const commentId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
      // Vérifie que le commentaire existe
      const commentCheck = await pool.query(
        `SELECT comments.*, user_id as post_auteur_id 
         FROM comments  
         JOIN posts ON comments.post_id = posts.id 
         WHERE comments.id = $1`,
        [commentId],
      );

      if (commentCheck.rows.length === 0) {
        return res.status(404).json({
          error: "Commentaire non trouvé",
        });
      }

      const comment = commentCheck.rows[0];

      // Vérifie les permissions : auteur du commentaire OU auteur du post OU admin
      const canDelete =
        parseInt(userId) === parseInt(comment.post_auteur_id) ||
        parseInt(userId) === parseInt(comment.post_id) ||
        userRole === "admin";

      if (!canDelete) {
        return res.status(403).json({
          error: "Vous n'êtes pas autorisé à supprimer ce commentaire",
        });
      }

      // Supprime le commentaire
      await pool.query("DELETE FROM comments WHERE id = $1", [commentId]);

      res.json({
        message: "Commentaire supprimé avec succès",
      });
    } catch (error) {
      console.error("❌ Erreur suppression commentaire:", error);
      res.status(500).json({
        error: "Erreur serveur lors de la suppression du commentaire",
      });
    }
  }

  /**
   * MÉTHODE : updateComment
   * Modifie un commentaire (auteur seulement)
   */
  async updateComment(req, res) {
    const commentId = req.params.id;
    const userId = req.user.id;
    const { contenu } = req.body;

    // Validation
    if (!contenu || !contenu.trim()) {
      return res.status(400).json({
        success: false,
        error: "Le contenu du commentaire ne peut pas être vide",
      });
    }

    try {
      // Vérifie que le commentaire existe et appartient à l'utilisateur
      const commentCheck = await pool.query(
        "SELECT * FROM comments WHERE id = $1 AND user_id = $2",
        [commentId, userId],
      );

      if (commentCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Commentaire non trouvé ou accès non autorisé",
        });
      }

      // Met à jour le commentaire
      const result = await pool.query(
        `UPDATE comments 
       SET contenu = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *, 
       (SELECT nom FROM utilisateur WHERE id = $3) as user_nom,
       (SELECT photo_profil FROM utilisateur WHERE id = $3) as user_avatar`,
        [contenu.trim(), commentId, userId],
      );

      res.json({
        success: true,
        message: "Commentaire modifié avec succès",
        comment: result.rows[0],
      });
    } catch (error) {
      console.error("❌ Erreur modification commentaire:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur lors de la modification du commentaire",
      });
    }
  }
  /**
   * MÉTHODE : getComment
   * Récupère un commentaire spécifique
   */
  async getComment(req, res) {
    const commentId = req.params.id;

    try {
      const result = await pool.query(
        `SELECT c.*, u.nom as user_nom 
         FROM comments c 
         JOIN utilisateur u ON c.user_id = u.id 
         WHERE c.id = $1`,
        [commentId],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Commentaire non trouvé",
        });
      }

      res.json({
        comment: result.rows[0],
      });
    } catch (error) {
      console.error("❌ Erreur récupération commentaire:", error);
      res.status(500).json({
        error: "Erreur serveur",
      });
    }
  }
  async toggleLikeComment(req, res) {
    const commentId = parseInt(req.params.id);
    const userId = req.user.id;

    // Validation de l'ID
    if (isNaN(commentId) || commentId <= 0) {
      return res.status(400).json({
        success: false,
        error: "ID de commentaire invalide.",
      });
    }

    try {
      // Vérifier que le commentaire existe
      const commentCheck = await pool.query(
        "SELECT id FROM comments WHERE id = $1",
        [commentId],
      );

      if (commentCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Commentaire non trouvé",
        });
      }

      // Vérifier si l'utilisateur a déjà liké ce commentaire
      const existingLike = await pool.query(
        "SELECT id FROM comment_likes WHERE comment_id = $1 AND user_id = $2",
        [commentId, userId],
      );

      let liked;
      let action;

      if (existingLike.rows.length > 0) {
        // Unlike: supprimer le like
        await pool.query(
          "DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2",
          [commentId, userId],
        );
        liked = false;
        action = "unliked";
      } else {
        // Like: ajouter le like
        await pool.query(
          "INSERT INTO comment_likes (comment_id, user_id) VALUES ($1, $2)",
          [commentId, userId],
        );
        liked = true;
        action = "liked";
      }

      // Récupérer le nouveau nombre de likes
      const likesResult = await pool.query(
        "SELECT COUNT(*) as likes_count FROM comment_likes WHERE comment_id = $1",
        [commentId],
      );

      const likesCount = parseInt(likesResult.rows[0].likes_count, 10);

      console.log(
        `❤️ Commentaire ${commentId} ${action} par utilisateur ${userId}. Likes: ${likesCount}`,
      );

      res.json({
        success: true,
        liked,
        likes_count: likesCount,
        message: liked ? "Commentaire liké" : "Like retiré",
      });
    } catch (error) {
      console.error("❌ [toggleLikeComment] Erreur:", error);

      // Gestion d'erreur plus détaillée
      if (error.code === "23505") {
        // Violation de contrainte unique
        return res.status(400).json({
          success: false,
          error: "Vous avez déjà liké ce commentaire",
        });
      }

      res.status(500).json({
        success: false,
        error: "Erreur serveur lors du like/unlike",
      });
    }
  }

  // Répondre à un commentaire
  async addReply(req, res) {
    const parentCommentId = req.params.id;
    const userId = req.user.id;
    const { contenu } = req.body;

    if (!contenu || !contenu.trim()) {
      return res.status(400).json({
        success: false,
        error: "La réponse ne peut pas être vide",
      });
    }

    try {
      // Vérifier que le commentaire parent existe
      const parentCheck = await pool.query(
        "SELECT id, post_id FROM comments WHERE id = $1",
        [parentCommentId],
      );

      if (parentCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Commentaire parent non trouvé",
        });
      }

      const postId = parentCheck.rows[0].post_id;

      const result = await pool.query(
        `INSERT INTO comments (post_id, user_id, contenu, parent_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *, 
       (SELECT nom FROM utilisateur WHERE id = $2) as user_nom,
       (SELECT photo_profil FROM utilisateur WHERE id = $2) as user_avatar`,
        [postId, userId, contenu.trim(), parentCommentId],
      );

      res.status(201).json({
        success: true,
        message: "Réponse ajoutée avec succès",
        reply: result.rows[0],
      });
    } catch (error) {
      console.error("❌ Erreur ajout réponse:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur lors de l'ajout de la réponse",
      });
    }
  }
  // Dans CommentController.js - Remplacer la méthode getPostCommentsWithReplies

  // // Méthode pour récupérer les commentaires d'un post avec leurs réponses
  // async getPostCommentsWithReplies(req, res) {
  //   const postId = req.params.postId;
  //   const userId = req.user?.id || 0;

  //   try {
  //     console.log("📥 Récupération des commentaires pour le post:", postId);

  //     // Requête SQL corrigée
  //     const query = `
  //     SELECT
  //       c.*,
  //       u.nom as user_nom,
  //       u.photo_profil as user_avatar,
  //       COUNT(DISTINCT cl.id) as likes_count,
  //       EXISTS(
  //         SELECT 1 FROM comment_likes cl2
  //         WHERE cl2.comment_id = c.id AND cl2.user_id = $2
  //       ) as user_liked
  //     FROM comments c
  //     JOIN utilisateur u ON c.user_id = u.id
  //     LEFT JOIN comment_likes cl ON c.id = cl.comment_id
  //     WHERE c.post_id = $1
  //     GROUP BY c.id, u.id, u.nom, u.photo_profil
  //     ORDER BY
  //       CASE WHEN c.parent_id IS NULL THEN c.id ELSE c.parent_id END,
  //       c.created_at ASC
  //   `;

  //     console.log("🔍 Exécution de la requête SQL...");
  //     const result = await pool.query(query, [postId, userId]);
  //     console.log(`✅ ${result.rows.length} commentaires trouvés`);

  //     // Organiser les commentaires en arborescence
  //     const organizedComments = this.organizeComments(result.rows);

  //     res.json({
  //       success: true,
  //       comments: organizedComments,
  //       total: result.rows.length,
  //     });
  //   } catch (error) {
  //     console.error("❌ [getPostCommentsWithReplies] Erreur:", error);
  //     res.status(500).json({
  //       success: false,
  //       error: "Erreur serveur lors du chargement des commentaires",
  //     });
  //   }
  // }

  // Méthode utilitaire pour organiser les commentaires en arborescence
  organizeComments(flatComments) {
    if (!flatComments || !Array.isArray(flatComments)) {
      return [];
    }

    const commentMap = new Map();
    const rootComments = [];

    // Créer un map de tous les commentaires
    flatComments.forEach((comment) => {
      if (comment && comment.id) {
        commentMap.set(comment.id, { ...comment, replies: [] });
      }
    });

    // Organiser en arborescence
    flatComments.forEach((comment) => {
      if (!comment) return;

      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(commentMap.get(comment.id));
          // Trier les réponses par date (plus anciennes en premier)
          parent.replies.sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at),
          );
        } else {
          console.warn(
            "⚠️ Parent non trouvé pour le commentaire:",
            comment.id,
            "parent_id:",
            comment.parent_id,
          );
          // Si le parent n'est pas trouvé, traiter comme un commentaire racine
          rootComments.push(commentMap.get(comment.id));
        }
      } else {
        rootComments.push(commentMap.get(comment.id));
      }
    });

    // Trier les commentaires racine par date (plus récents en premier)
    rootComments.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );

    console.log(`🌳 ${rootComments.length} commentaires racine organisés`);
    return rootComments;
  }

  // Méthode alternative plus simple si l'organisation complexe pose problème
  async getPostCommentsSimple(req, res) {
    const postId = req.params.postId;
    const userId = req.user?.id || 0;

    try {
      console.log(
        "📥 Récupération simple des commentaires pour le post:",
        postId,
      );

      // Requête simple sans organisation complexe
      const query = `
      SELECT 
        c.*, 
        u.nom as user_nom, 
        u.photo_profil as user_avatar,
        COUNT(DISTINCT cl.id) as likes_count,
        EXISTS(
          SELECT 1 FROM comment_likes cl2 
          WHERE cl2.comment_id = c.id AND cl2.user_id = $2
        ) as user_liked
      FROM comments c 
      JOIN utilisateur u ON c.user_id = u.id 
      LEFT JOIN comment_likes cl ON c.id = cl.comment_id
      WHERE c.post_id = $1
      GROUP BY c.id, u.id, u.nom, u.photo_profil
      ORDER BY 
        COALESCE(c.parent_id, c.id),
        c.created_at ASC
    `;

      const result = await pool.query(query, [postId, userId]);
      console.log(`✅ ${result.rows.length} commentaires chargés`);

      res.json({
        success: true,
        comments: result.rows, // Retourne les commentaires sans organisation
        total: result.rows.length,
      });
    } catch (error) {
      console.error("❌ [getPostCommentsSimple] Erreur:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur lors du chargement des commentaires",
      });
    }
  }
}

export default new CommentController();
