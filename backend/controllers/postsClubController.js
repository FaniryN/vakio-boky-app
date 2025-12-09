import pool from "../config/db.js";

export const createClubPost = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    console.log("📝 Création post:", { clubId, content, userId });

    if (!content || !content.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Le contenu est requis" });
    }

    let media_url = null;
    if (req.file) {
      media_url = `/uploads/${req.file.filename}`;
    }

    const result = await pool.query(
      `INSERT INTO club_posts (club_id, auteur_id, contenu, media_url)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [clubId, userId, content.trim(), media_url],
    );

    await pool.query(
      `INSERT INTO notifications (user_id, titre, message, type, lien)
       SELECT user_id, $1, $2, 'post', $3
       FROM club_members WHERE club_id = $4 AND user_id != $5`,
      [
        "Nouvelle publication",
        `Nouveau post dans le club`,
        `/clubs/${clubId}`,
        clubId,
        userId,
      ],
    );

    res.json({
      success: true,
      post: {
        ...result.rows[0],
        auteur_nom: req.user.nom,
      },
    });
  } catch (err) {
    console.error("❌ Erreur création post:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getClubPosts = async (req, res) => {
  try {
    const { clubId } = req.params;

    const result = await pool.query(
      `SELECT cp.*, u.nom as auteur_nom, u.photo_profil
       FROM club_posts cp
       JOIN utilisateur u ON cp.auteur_id = u.id
       WHERE cp.club_id = $1
       ORDER BY cp.created_at DESC`,
      [clubId],
    );

    res.json({ success: true, posts: result.rows });
  } catch (err) {
    console.error("❌ Erreur récupération posts:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteClubPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await pool.query(
      `SELECT cp.*, cm.role 
       FROM club_posts cp
       LEFT JOIN club_members cm ON cp.club_id = cm.club_id AND cm.user_id = $2
       WHERE cp.id = $1`,
      [postId, userId],
    );

    if (!post.rows[0]) {
      return res
        .status(404)
        .json({ success: false, message: "Post non trouvé" });
    }

    const canDelete =
      post.rows[0].auteur_id === userId ||
      ["admin", "moderateur"].includes(post.rows[0].role);

    if (!canDelete) {
      return res
        .status(403)
        .json({ success: false, message: "Droits insuffisants" });
    }

    await pool.query(`DELETE FROM club_posts WHERE id = $1`, [postId]);

    res.json({ success: true, message: "Post supprimé" });
  } catch (err) {
    console.error("❌ Erreur suppression post:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
