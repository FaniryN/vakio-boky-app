import pool from "../config/db.js";

export const createClub = async (req, res) => {
  try {
    console.log("📦 Données reçues:", req.body);
    console.log("📁 Fichier reçu:", req.file);

    const {
      nom,
      description,
      categorie,
      ville,
      pays,
      regles,
      site_web,
      visibilite,
      type,
    } = req.body;

    // Validation
    if (!nom || !description) {
      return res.status(400).json({
        success: false,
        message: "Le nom et la description sont requis",
      });
    }

    // Pour les clubs virtuels, ville et pays sont optionnels
    const finalVille = type === 'virtuel' ? null : ville;
    const finalPays = type === 'virtuel' ? null : pays;

    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const result = await pool.query(
      `INSERT INTO clubs (nom, description, image_url, categorie, ville, pays, createur_id, regles, site_web, visibilite, type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        nom,
        description,
        image_url,
        categorie,
        finalVille,
        finalPays,
        req.user.id,
        regles,
        site_web,
        visibilite,
        type || 'physique',
      ],
    );

    await pool.query(
      `INSERT INTO club_members (club_id, user_id, role) VALUES ($1, $2, 'admin')`,
      [result.rows[0].id, req.user.id],
    );

    res.status(201).json({ success: true, club: result.rows[0] });
  } catch (err) {
    console.error("❌ Erreur création club:", err);

    if (req.file) {
      const fs = require("fs");
      const path = require("path");
      const filePath = path.join(__dirname, "../uploads", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateClub = async (req, res) => {
  try {
    console.log("📦 Données update reçues:", req.body);
    console.log("📁 Fichier update reçu:", req.file);

    const {
      nom,
      description,
      categorie,
      ville,
      pays,
      site_web,
      visibilite,
      regles,
      existing_image,
      type,
    } = req.body;

    const adminCheck = await pool.query(
      `SELECT role FROM club_members WHERE club_id = $1 AND user_id = $2`,
      [req.params.id, req.user.id],
    );

    if (
      !adminCheck.rows[0] ||
      !["admin", "moderateur"].includes(adminCheck.rows[0].role)
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Droits insuffisants" });
    }

    let image_url = existing_image;

    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;

      if (existing_image && existing_image.startsWith("/uploads/")) {
        const fs = require("fs");
        const path = require("path");
        const oldFilePath = path.join(__dirname, "..", existing_image);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    // Pour les clubs virtuels, ville et pays sont optionnels
    const finalVille = type === 'virtuel' ? null : ville;
    const finalPays = type === 'virtuel' ? null : pays;

    const result = await pool.query(
      `UPDATE clubs SET nom=$1, description=$2, categorie=$3, ville=$4, pays=$5, image_url=$6, site_web=$7, visibilite=$8, regles=$9, type=$10, updated_at=NOW()
       WHERE id=$11 RETURNING *`,
      [
        nom,
        description,
        categorie,
        finalVille,
        finalPays,
        image_url,
        site_web,
        visibilite,
        regles,
        type,
        req.params.id,
      ],
    );

    res.json({ success: true, club: result.rows[0] });
  } catch (err) {
    console.error("❌ Erreur modification club:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getClubs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.nom as createur_nom, COUNT(cm.user_id) as membres_count
      FROM clubs c
      LEFT JOIN utilisateur u ON c.createur_id = u.id
      LEFT JOIN club_members cm ON c.id = cm.club_id
      WHERE c.visibilite = 'public' OR EXISTS (
        SELECT 1 FROM club_members cm2 WHERE cm2.club_id = c.id AND cm2.user_id = $1
      )
      GROUP BY c.id, u.nom
      ORDER BY c.created_at DESC
    `, [req.user.id]);
    res.json({ success: true, clubs: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getClub = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT c.*, u.nom as createur_nom 
      FROM clubs c 
      LEFT JOIN utilisateur u ON c.createur_id = u.id 
      WHERE c.id = $1
    `,
      [req.params.id],
    );

    if (!result.rows[0]) {
      return res
        .status(404)
        .json({ success: false, message: "Club non trouvé" });
    }

    res.json({ success: true, club: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteClub = async (req, res) => {
  try {
    const adminCheck = await pool.query(
      `SELECT role FROM club_members WHERE club_id = $1 AND user_id = $2`,
      [req.params.id, req.user.id],
    );

    if (!adminCheck.rows[0] || adminCheck.rows[0].role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Droits insuffisants" });
    }

    const club = await pool.query(`SELECT image_url FROM clubs WHERE id = $1`, [
      req.params.id,
    ]);

    await pool.query(`DELETE FROM clubs WHERE id = $1`, [req.params.id]);

    if (
      club.rows[0]?.image_url &&
      club.rows[0].image_url.startsWith("/uploads/")
    ) {
      const fs = require("fs");
      const path = require("path");
      const filePath = path.join(__dirname, "..", club.rows[0].image_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({ success: true, message: "Club supprimé" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const joinClub = async (req, res) => {
  try {
    const clubId = req.params.id;
    const userId = req.user.id;

    const exists = await pool.query(
      `SELECT * FROM club_members WHERE club_id=$1 AND user_id=$2`,
      [clubId, userId],
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Déjà membre" });
    }

    await pool.query(
      `INSERT INTO club_members (club_id, user_id, role) VALUES ($1, $2, 'membre')`,
      [clubId, userId],
    );

    res.json({ success: true, message: "Adhésion réussie" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const leaveClub = async (req, res) => {
  try {
    const clubId = req.params.id;
    const userId = req.user.id;

    await pool.query(
      `DELETE FROM club_members WHERE club_id=$1 AND user_id=$2`,
      [clubId, userId],
    );
    res.json({ success: true, message: "Vous avez quitté le club" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getClubMembers = async (req, res) => {
  try {
    const clubId = req.params.id;
    const result = await pool.query(
      `SELECT u.id, u.nom, u.email, u.photo_profil, cm.role, cm.joined_at
       FROM club_members cm
       JOIN utilisateur u ON cm.user_id = u.id
       WHERE cm.club_id = $1
       ORDER BY 
         CASE cm.role 
           WHEN 'admin' THEN 1
           WHEN 'moderateur' THEN 2
           ELSE 3 
         END,
         cm.joined_at ASC`,
      [clubId],
    );
    res.json({ success: true, members: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateMemberRole = async (req, res) => {
  try {
    const { id: clubId, userId } = req.params;
    const { role } = req.body;

    const adminCheck = await pool.query(
      `SELECT role FROM club_members WHERE club_id = $1 AND user_id = $2`,
      [clubId, req.user.id],
    );

    if (!adminCheck.rows[0] || adminCheck.rows[0].role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Droits insuffisants" });
    }

    await pool.query(
      `UPDATE club_members SET role = $1 WHERE club_id = $2 AND user_id = $3`,
      [role, clubId, userId],
    );

    res.json({ success: true, message: "Rôle mis à jour" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { id: clubId, userId } = req.params;

    const requester = await pool.query(
      `SELECT role FROM club_members WHERE club_id = $1 AND user_id = $2`,
      [clubId, req.user.id],
    );

    if (!requester.rows[0] || requester.rows[0].role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Droits insuffisants" });
    }

    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Vous ne pouvez pas vous retirer vous-même",
      });
    }

    await pool.query(
      `DELETE FROM club_members WHERE club_id = $1 AND user_id = $2`,
      [clubId, userId],
    );

    res.json({ success: true, message: "Membre retiré" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
