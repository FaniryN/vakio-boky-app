import pool from "../config/db.js";

export const createEvent = async (req, res) => {
  try {
    const {
      club_id,
      titre,
      description,
      date_debut,
      date_fin,
      type,
      lieu,
      max_participants,
      lien_visio,
    } = req.body;

    if (!titre || !date_debut || !club_id) {
      return res
        .status(400)
        .json({ success: false, message: "Titre, date et club sont requis" });
    }

    const result = await pool.query(
      `INSERT INTO club_events (club_id, createur_id, titre, description, date_debut, date_fin, type, lieu, max_participants, lien_visio)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        club_id,
        req.user.id,
        titre,
        description,
        date_debut,
        date_fin,
        type,
        lieu,
        max_participants,
        lien_visio,
      ],
    );

    await pool.query(
      `INSERT INTO notifications (user_id, titre, message, type, lien)
       SELECT user_id, $1, $2, 'event', $3
       FROM club_members WHERE club_id = $4 AND user_id != $5`,
      [
        "Nouvel événement",
        `L'événement "${titre}" a été créé dans le club`,
        `/clubs/${club_id}/events/${result.rows[0].id}`,
        club_id,
        req.user.id,
      ],
    );

    res.status(201).json({ success: true, event: result.rows[0] });
  } catch (err) {
    console.error("Erreur création événement:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getClubEvents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ce.*, u.nom as createur_nom, 
              COUNT(cep.user_id) as participants_count,
              EXISTS(SELECT 1 FROM club_event_participants WHERE event_id = ce.id AND user_id = $2) as est_inscrit
       FROM club_events ce
       LEFT JOIN utilisateur u ON ce.createur_id = u.id
       LEFT JOIN club_event_participants cep ON ce.id = cep.event_id
       WHERE ce.club_id = $1
       GROUP BY ce.id, u.nom
       ORDER BY ce.date_debut ASC`,
      [req.params.clubId, req.user.id],
    );

    res.json({ success: true, events: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const joinEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const isMember = await pool.query(
      `SELECT 1 FROM club_members WHERE club_id = 
       (SELECT club_id FROM club_events WHERE id = $1) AND user_id = $2`,
      [eventId, req.user.id],
    );

    if (!isMember.rows[0]) {
      return res
        .status(403)
        .json({ success: false, message: "Vous devez être membre du club" });
    }

    const alreadyJoined = await pool.query(
      `SELECT 1 FROM club_event_participants WHERE event_id = $1 AND user_id = $2`,
      [eventId, req.user.id],
    );

    if (alreadyJoined.rows[0]) {
      return res
        .status(400)
        .json({ success: false, message: "Déjà inscrit à cet événement" });
    }

    await pool.query(
      `INSERT INTO club_event_participants (event_id, user_id) VALUES ($1, $2)`,
      [eventId, req.user.id],
    );

    res.json({ success: true, message: "Inscription réussie" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const leaveEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    await pool.query(
      `DELETE FROM club_event_participants WHERE event_id = $1 AND user_id = $2`,
      [eventId, req.user.id],
    );

    res.json({ success: true, message: "Désinscription réussie" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

