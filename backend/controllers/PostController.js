import pool from "../config/db.js";

function detectMediaType(mediaUrl) {
  if (!mediaUrl) return "simple";

  const filename = mediaUrl.split("/").pop();
  const ext = filename.split(".").pop()?.toLowerCase() || "";

  const imageExt = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];
  const videoExt = ["mp4", "mov", "avi", "webm", "mkv", "flv"];
  const documentExt = ["pdf", "doc", "docx", "txt", "ppt", "pptx"];

  if (imageExt.includes(ext)) return "image";
  if (videoExt.includes(ext)) return "video";
  if (documentExt.includes(ext)) return "document";

  return "fichier";
}

/**
 * Formate l'URL du média
 */
function formatMediaUrl(mediaUrl, req) {
  if (!mediaUrl) return null;

  if (mediaUrl.startsWith("http")) {
    return mediaUrl;
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/uploads/${mediaUrl}`;
}

class PostController {
  //creer un poste
  async createPost(req, res) {
    const { contenu, type_post = "simple", media_url = null } = req.body;
    const auteur_id = req.user.id;

    console.log("📝 [CreatePost] Données reçues:", {
      contenu: contenu?.length,
      type_post,
      media_url,
      auteur_id,
    });

    // Validation
    if (!contenu || contenu.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Le contenu du post ne peut pas être vide.",
      });
    }

    try {
      let finalType = type_post;
      let finalMediaUrl = media_url;

      // Détection automatique du type de média
      if (media_url && media_url.trim() !== "") {
        console.log("🎯 [CreatePost] Traitement média:", media_url);

        finalType = detectMediaType(media_url);
        finalMediaUrl = formatMediaUrl(media_url, req);
      }

      // Insertion du post
      const result = await pool.query(
        `INSERT INTO posts (auteur_id, contenu, type_post, media_url) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [auteur_id, contenu.trim(), finalType, finalMediaUrl],
      );

      const newPost = result.rows[0];

      // Récupération des infos de ceIui qui poste
      const authorResult = await pool.query(
        "SELECT nom, email FROM utilisateur WHERE id = $1",
        [auteur_id],
      );

      const responsePost = {
        ...newPost,
        auteur_nom: authorResult.rows[0]?.nom,
        auteur_email: authorResult.rows[0]?.email,
        likes_count: 0,
        comments_count: 0,
        shares_count: 0,
        user_liked: false,
        user_shared: false,
        media_url: finalMediaUrl,
      };

      res.status(201).json({
        success: true,
        message: "Post créé avec succès",
        post: responsePost,
      });
    } catch (error) {
      console.error("❌ [CreatePost] Erreur:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur lors de la création du post",
      });
    }
  }

  //mise a jour d un poste
  async updatePost(req, res) {
    const postId = req.params.id;
    const userId = req.user.id;
    const { contenu, media_url, type_post } = req.body;

    if (!contenu || !contenu.trim()) {
      return res.status(400).json({
        success: false,
        error: "Le contenu du post ne peut pas être vide",
      });
    }

    try {
      // Vérification des permissions
      const postCheck = await pool.query(
        "SELECT auteur_id, media_url, type_post FROM posts WHERE id = $1",
        [postId],
      );

      if (postCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Post non trouvé",
        });
      }

      if (parseInt(postCheck.rows[0].auteur_id) !== parseInt(userId)) {
        return res.status(403).json({
          success: false,
          error: "Vous n'êtes pas autorisé à modifier ce post",
        });
      }

      const currentPost = postCheck.rows[0];
      let finalType = type_post || currentPost.type_post;
      let finalMediaUrl = media_url;

      // Gestion des médias pour la modification
      if (media_url && media_url.trim() !== "") {
        finalType = detectMediaType(media_url);
        finalMediaUrl = formatMediaUrl(media_url, req);
      } else if (media_url === null) {
        // Si media_url est explicitement null, on supprime le média
        finalMediaUrl = null;
        finalType = "simple";
      } else {
        // Si media_url est undefined, on garde l'ancienne valeur
        finalMediaUrl = currentPost.media_url;
        finalType = currentPost.type_post;
      }

      // Mise à jour
      const result = await pool.query(
        `UPDATE posts 
         SET contenu = $1, media_url = $2, type_post = $3, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $4 
         RETURNING *`,
        [contenu.trim(), finalMediaUrl, finalType, postId],
      );

      const updatedPost = result.rows[0];

      // Récupération des infos auteur
      const authorResult = await pool.query(
        "SELECT nom, email FROM utilisateur WHERE id = $1",
        [userId],
      );

      const responsePost = {
        ...updatedPost,
        auteur_nom: authorResult.rows[0]?.nom,
        auteur_email: authorResult.rows[0]?.email,
      };

      res.json({
        success: true,
        message: "Post modifié avec succès",
        post: responsePost,
      });
    } catch (error) {
      console.error("❌ [updatePost] Erreur:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur lors de la modification du post",
      });
    }
  }

  //Recup de tous Ies postes
  async getAllPosts(req, res) {
    try {
      const userId = req.user?.id || 0;

      const result = await pool.query(
        `
        SELECT 
          p.*,                                  
          u.nom as auteur_nom,                 
          u.email as auteur_email,             
          COUNT(DISTINCT pl.id) as likes_count,
          COUNT(DISTINCT c.id) as comments_count,
          COUNT(DISTINCT ps.id) as shares_count,
          
          EXISTS(
            SELECT 1 FROM post_likes pl2 
            WHERE pl2.post_id = p.id AND pl2.user_id = $1
          ) as user_liked,
          
          EXISTS(
            SELECT 1 FROM post_shares ps2 
            WHERE ps2.post_id = p.id AND ps2.user_id = $1
          ) as user_shared
          
        FROM posts p
        LEFT JOIN utilisateur u ON p.auteur_id = u.id
        LEFT JOIN post_likes pl ON p.id = pl.post_id
        LEFT JOIN comments c ON p.id = c.post_id
        LEFT JOIN post_shares ps ON p.id = ps.post_id
        GROUP BY p.id, u.id
        ORDER BY p.created_at DESC
        LIMIT 20
      `,
        [userId],
      );

      const posts = result.rows.map((post) => ({
        ...post,
        media_url: post.media_url
          ? post.media_url.startsWith("http")
            ? post.media_url
            : `${req.protocol}://${req.get("host")}/uploads/${post.media_url}`
          : null,
        created_at: new Date(post.created_at).toISOString(),
        updated_at: post.updated_at
          ? new Date(post.updated_at).toISOString()
          : null,
      }));

      res.json({
        success: true,
        posts,
        count: posts.length,
      });
    } catch (error) {
      console.error("❌ [GetAllPosts] Erreur:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur lors de la récupération des posts",
      });
    }
  }

  //Iike. UnIike
  async toggleLike(req, res) {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;

    if (isNaN(postId) || postId <= 0) {
      return res.status(400).json({
        success: false,
        error: "ID de post invalide.",
      });
    }

    try {
      const postCheck = await pool.query("SELECT id FROM posts WHERE id = $1", [
        postId,
      ]);

      if (postCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Post non trouvé",
        });
      }

      const existingLike = await pool.query(
        "SELECT id FROM post_likes WHERE post_id = $1 AND user_id = $2",
        [postId, userId],
      );

      let liked;

      if (existingLike.rows.length > 0) {
        await pool.query(
          "DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2",
          [postId, userId],
        );
        liked = false;
      } else {
        await pool.query(
          "INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)",
          [postId, userId],
        );
        liked = true;
      }

      const likesResult = await pool.query(
        "SELECT COUNT(*) as likes_count FROM post_likes WHERE post_id = $1",
        [postId],
      );

      const likesCount = parseInt(likesResult.rows[0].likes_count, 10);

      res.json({
        success: true,
        liked,
        message: liked ? "Post liké" : "Like retiré",
        likes_count: likesCount,
      });
    } catch (error) {
      console.error("❌ [toggleLike] Erreur:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur",
      });
    }
  }

  //partage de post
  async sharePost(req, res) {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
      const existingShare = await pool.query(
        "SELECT id FROM post_shares WHERE post_id = $1 AND user_id = $2",
        [postId, userId],
      );

      if (existingShare.rows.length === 0) {
        await pool.query(
          "INSERT INTO post_shares (post_id, user_id) VALUES ($1, $2)",
          [postId, userId],
        );
      }

      const sharesResult = await pool.query(
        "SELECT COUNT(*) as shares_count FROM post_shares WHERE post_id = $1",
        [postId],
      );

      const sharesCount = parseInt(sharesResult.rows[0].shares_count, 10);

      res.json({
        success: true,
        message: "Post partagé avec succès",
        shares_count: sharesCount,
      });
    } catch (error) {
      console.error("❌ [sharePost] Erreur:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur lors du partage",
      });
    }
  }

  //suppression de post
  async deletePost(req, res) {
    const postId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
      const postResult = await pool.query(
        "SELECT auteur_id FROM posts WHERE id = $1",
        [postId],
      );

      if (postResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Post non trouvé",
        });
      }

      const postAuteurId = postResult.rows[0].auteur_id;

      if (parseInt(userId) !== parseInt(postAuteurId) && userRole !== "admin") {
        return res.status(403).json({
          success: false,
          error: "Vous n'êtes pas autorisé à supprimer ce post",
        });
      }

      await pool.query("DELETE FROM posts WHERE id = $1", [postId]);

      res.json({
        success: true,
        message: "Post supprimé avec succès",
      });
    } catch (error) {
      console.error("❌ [deletePost] Erreur:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur lors de la suppression du post",
      });
    }
  }

  //Recup comment
  async getPostComments(req, res) {
    const postId = req.params.id;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    try {
      const countResult = await pool.query(
        "SELECT COUNT(*) FROM comments WHERE post_id = $1",
        [postId],
      );

      const result = await pool.query(
        `SELECT 
          c.*, 
          u.nom as user_nom,
          u.photo_profil as user_avatar
         FROM comments c
         JOIN utilisateur u ON c.user_id = u.id
         WHERE c.post_id = $1
         ORDER BY c.created_at ASC
         LIMIT $2 OFFSET $3`,
        [postId, limit, offset],
      );

      res.json({
        success: true,
        comments: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].count),
          totalPages: Math.ceil(countResult.rows[0].count / limit),
        },
      });
    } catch (error) {
      console.error("❌ [getPostComments] Erreur:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur lors de la récupération des commentaires",
      });
    }
  }

  //Recup post specifique
  async getPostById(req, res) {
    const postId = parseInt(req.params.id);
    const userId = req.user?.id || 0;

    if (isNaN(postId) || postId <= 0) {
      return res.status(400).json({
        success: false,
        error: "ID de post invalide",
      });
    }

    try {
      const result = await pool.query(
        `
        SELECT 
          p.*,                                  
          u.nom as auteur_nom,                 
          u.email as auteur_email,             
          COUNT(DISTINCT pl.id) as likes_count,
          COUNT(DISTINCT c.id) as comments_count,
          COUNT(DISTINCT ps.id) as shares_count,
          
          EXISTS(
            SELECT 1 FROM post_likes pl2 
            WHERE pl2.post_id = p.id AND pl2.user_id = $2
          ) as user_liked,
          
          EXISTS(
            SELECT 1 FROM post_shares ps2 
            WHERE ps2.post_id = p.id AND ps2.user_id = $2
          ) as user_shared
          
        FROM posts p
        LEFT JOIN utilisateur u ON p.auteur_id = u.id
        LEFT JOIN post_likes pl ON p.id = pl.post_id
        LEFT JOIN comments c ON p.id = c.post_id
        LEFT JOIN post_shares ps ON p.id = ps.post_id
        WHERE p.id = $1
        GROUP BY p.id, u.id
        `,
        [postId, userId],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Post non trouvé",
        });
      }

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const post = {
        ...result.rows[0],
        media_url: result.rows[0].media_url
          ? result.rows[0].media_url.startsWith("http")
            ? result.rows[0].media_url
            : `${baseUrl}/uploads/${result.rows[0].media_url}`
          : null,
      };

      res.json({
        success: true,
        post,
      });
    } catch (error) {
      console.error("❌ [getPostById] Erreur:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur",
      });
    }
  }
}

export default new PostController();
