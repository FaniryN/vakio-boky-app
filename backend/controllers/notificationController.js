import pool from "../config/db.js";

export const getUserNotifications = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [req.user.id],
    );

    res.json({ success: true, notifications: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    await pool.query(
      `UPDATE notifications SET lue = true, read_at = NOW() WHERE id = $1 AND user_id = $2`,
      [notificationId, req.user.id],
    );

    res.json({ success: true, message: "Notification marquée comme lue" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await pool.query(
      `UPDATE notifications SET lue = true, read_at = NOW() WHERE user_id = $1 AND lue = false`,
      [req.user.id],
    );

    res.json({
      success: true,
      message: "Toutes les notifications marquées comme lues",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    await pool.query(
      `DELETE FROM notifications WHERE id = $1 AND user_id = $2`,
      [notificationId, req.user.id],
    );

    res.json({ success: true, message: "Notification supprimée" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Send promotional notification for a book (Author only)
 */
export const sendBookPromotion = async (req, res) => {
  try {
    const { bookId, title, message } = req.body;
    const authorId = req.user.id;

    // Check if user is the author of the book
    const bookCheck = await pool.query(
      "SELECT id, titre FROM livres WHERE id = $1 AND auteur_id = $2",
      [bookId, authorId],
    );

    if (bookCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: "You can only promote your own books",
      });
    }

    // Send notification to all users (could be enhanced to target specific groups)
    await pool.query(
      `INSERT INTO notifications (user_id, titre, message, type, lien)
       SELECT id, $1, $2, 'promotion', $3
       FROM utilisateur
       WHERE role IN ('reader', 'author', 'editor')`, // Don't send to admins or blocked users
      [
        title,
        message,
        `/books/${bookId}`,
      ],
    );

    res.json({
      success: true,
      message: "Promotional notification sent successfully",
    });
  } catch (error) {
    console.error("❌ Error sending book promotion:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Send targeted notification for an event (Event organizer only)
 */
export const sendEventPromotion = async (req, res) => {
  try {
    const { eventId, title, message } = req.body;
    const organizerId = req.user.id;

    // Check if user is the organizer of the event
    const eventCheck = await pool.query(
      "SELECT id, titre FROM evenements WHERE id = $1 AND organisateur_id = $2",
      [eventId, organizerId],
    );

    if (eventCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: "You can only promote your own events",
      });
    }

    // Send notification to all users
    await pool.query(
      `INSERT INTO notifications (user_id, titre, message, type, lien)
       SELECT id, $1, $2, 'event_promotion', $3
       FROM utilisateur
       WHERE role IN ('reader', 'author', 'editor')`,
      [
        title,
        message,
        `/events/${eventId}`,
      ],
    );

    res.json({
      success: true,
      message: "Event promotional notification sent successfully",
    });
  } catch (error) {
    console.error("❌ Error sending event promotion:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
