import pool from "../config/db.js";

/**
 * Start a reading session
 */
export const startReadingSession = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    // Check if book exists
    const bookCheck = await pool.query(
      "SELECT id, titre FROM livres WHERE id = $1",
      [bookId],
    );

    if (bookCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    // Create reading session
    const sessionResult = await pool.query(
      `INSERT INTO reading_sessions (user_id, book_id)
       VALUES ($1, $2)
       RETURNING *`,
      [userId, bookId],
    );

    // Update or create reading progress
    await pool.query(
      `INSERT INTO reading_progress (user_id, book_id, last_read_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, book_id)
       DO UPDATE SET last_read_at = CURRENT_TIMESTAMP`,
      [userId, bookId],
    );

    res.json({
      success: true,
      session: sessionResult.rows[0],
      message: "Reading session started",
    });
  } catch (error) {
    console.error("❌ Error starting reading session:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * End a reading session and update progress
 */
export const endReadingSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { pagesRead, currentPage, totalPages } = req.body;
    const userId = req.user.id;

    // Update reading session
    const sessionResult = await pool.query(
      `UPDATE reading_sessions
       SET end_time = CURRENT_TIMESTAMP,
           pages_read = $1,
           time_spent_minutes = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - start_time)) / 60,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [pagesRead || 0, sessionId, userId],
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Reading session not found",
      });
    }

    // Update reading progress
    const completionPercentage = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;

    await pool.query(
      `UPDATE reading_progress
       SET current_page = $1,
           total_pages = $2,
           completion_percentage = $3,
           last_read_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $4 AND book_id = (
         SELECT book_id FROM reading_sessions WHERE id = $5
       )`,
      [currentPage || 0, totalPages || 0, completionPercentage, userId, sessionId],
    );

    res.json({
      success: true,
      session: sessionResult.rows[0],
      message: "Reading session ended",
    });
  } catch (error) {
    console.error("❌ Error ending reading session:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Get user's reading progress for a specific book
 */
export const getReadingProgress = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT rp.*, l.titre as book_title
       FROM reading_progress rp
       JOIN livres l ON rp.book_id = l.id
       WHERE rp.user_id = $1 AND rp.book_id = $2`,
      [userId, bookId],
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        progress: null,
        message: "No reading progress found for this book",
      });
    }

    res.json({
      success: true,
      progress: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error getting reading progress:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Get user's reading statistics
 */
export const getReadingStatistics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get overall reading statistics
    const stats = await pool.query(`
      SELECT
        COUNT(DISTINCT rs.book_id) as books_read,
        COALESCE(SUM(rs.pages_read), 0) as total_pages_read,
        COALESCE(SUM(rs.time_spent_minutes), 0) as total_reading_time_minutes,
        COUNT(rs.id) as total_sessions,
        AVG(rs.time_spent_minutes) as avg_session_time,
        MAX(rs.created_at) as last_reading_session
      FROM reading_sessions rs
      WHERE rs.user_id = $1 AND rs.end_time IS NOT NULL
    `, [userId]);

    // Get current reading progress
    const progress = await pool.query(`
      SELECT rp.*, l.titre as book_title, l.couverture_url
      FROM reading_progress rp
      JOIN livres l ON rp.book_id = l.id
      WHERE rp.user_id = $1
      ORDER BY rp.last_read_at DESC
      LIMIT 10
    `, [userId]);

    // Get reading streaks or patterns (simplified)
    const recentSessions = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as sessions, SUM(time_spent_minutes) as time_spent
      FROM reading_sessions
      WHERE user_id = $1 AND end_time IS NOT NULL AND created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `, [userId]);

    res.json({
      success: true,
      statistics: stats.rows[0],
      currentProgress: progress.rows,
      recentActivity: recentSessions.rows,
    });
  } catch (error) {
    console.error("❌ Error getting reading statistics:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Get user's active reading session
 */
export const getActiveReadingSession = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT rs.*, l.titre as book_title, l.couverture_url
       FROM reading_sessions rs
       JOIN livres l ON rs.book_id = l.id
       WHERE rs.user_id = $1 AND rs.end_time IS NULL
       ORDER BY rs.start_time DESC
       LIMIT 1`,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        session: null,
        message: "No active reading session",
      });
    }

    res.json({
      success: true,
      session: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error getting active reading session:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Get admin reading statistics (total platform stats)
 */
export const getAdminReadingStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if admin
    const adminCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (adminCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // Get platform-wide reading statistics
    const stats = await pool.query(`
      SELECT
        COUNT(DISTINCT rs.user_id) as active_readers,
        COUNT(DISTINCT rs.book_id) as books_being_read,
        COALESCE(SUM(rs.pages_read), 0) as total_pages_read,
        COALESCE(SUM(rs.time_spent_minutes), 0) as total_reading_time_minutes,
        COUNT(rs.id) as total_sessions,
        AVG(rs.time_spent_minutes) as avg_session_time
      FROM reading_sessions rs
      WHERE rs.end_time IS NOT NULL
    `);

    // Get most read books
    const popularBooks = await pool.query(`
      SELECT l.titre, l.auteur_id, u.nom as author_name,
             COUNT(rs.id) as reading_sessions,
             COUNT(DISTINCT rs.user_id) as unique_readers,
             COALESCE(SUM(rs.pages_read), 0) as total_pages_read
      FROM reading_sessions rs
      JOIN livres l ON rs.book_id = l.id
      JOIN utilisateur u ON l.auteur_id = u.id
      WHERE rs.end_time IS NOT NULL
      GROUP BY l.id, l.titre, l.auteur_id, u.nom
      ORDER BY unique_readers DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      statistics: stats.rows[0],
      popularBooks: popularBooks.rows,
    });
  } catch (error) {
    console.error("❌ Error getting admin reading stats:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};