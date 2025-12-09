import pool from "../config/db.js";

// Fonction helper pour déterminer le type de signalement
const getReportType = (reason) => {
  if (!reason) return 'other';
  
  const reasonLower = reason.toLowerCase();
  if (reasonLower.includes('harcèlement') || reasonLower.includes('harassment')) {
    return 'harassment';
  } else if (reasonLower.includes('spam')) {
    return 'spam';
  } else if (reasonLower.includes('inapproprié') || reasonLower.includes('inappropriate')) {
    return 'inappropriate';
  } else if (reasonLower.includes('copyright') || reasonLower.includes('droits')) {
    return 'copyright';
  } else {
    return 'other';
  }
};

/**
 * Get moderation queue items - VERSION RÉELLE AVEC SQL CORRIGÉE
 */
export const getModerationQueue = async (req, res) => {
  try {
    const { filter = 'all', page = 1, limit = 20 } = req.query;
    const userId = req.user.id;
    const offset = (page - 1) * limit;

    // Vérification admin
    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId]
    );

    if (!userCheck.rows[0] || userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // Construire la requête dynamique
    let whereClauses = [];
    let queryParams = [];
    let paramIndex = 1;

    // Filtres
    if (filter === 'pending') {
      whereClauses.push(`status = 'pending'`);
    } else if (filter === 'in_review') {
      whereClauses.push(`status = 'in_review'`);
    } else if (filter === 'critical') {
      whereClauses.push(`priority = 'critical'`);
    } else if (filter === 'posts') {
      whereClauses.push(`content_type = 'post'`);
    } else if (filter === 'comments') {
      whereClauses.push(`content_type = 'comment'`);
    } else if (filter === 'users') {
      whereClauses.push(`content_type = 'user'`);
    }

    // Requête principale - VERSION CORRIGÉE
    const whereSQL = whereClauses.length > 0 
      ? `WHERE ${whereClauses.join(' AND ')}` 
      : '';

    // CORRECTION : Utiliser les bons noms de colonnes
    const query = `
      SELECT 
        mq.id,
        mq.content_id,
        mq.content_type,
        mq.reported_user_id,
        mq.reporter_id,
        mq.reason,
        mq.priority,
        mq.status,
        mq.reports_count,
        mq.created_at,
        mq.updated_at,
        mq.resolved_at,
        mq.resolved_by,
        u1.nom as reported_username,
        u2.nom as reporter_username
      FROM moderation_queue mq
      LEFT JOIN utilisateur u1 ON mq.reported_user_id = u1.id
      LEFT JOIN utilisateur u2 ON mq.reporter_id = u2.id
      ${whereSQL}
      ORDER BY 
        CASE mq.priority 
          WHEN 'critical' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
        END,
        mq.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    console.log("🔍 Requête SQL (CORRIGÉE):", query);
    console.log("📊 Paramètres:", queryParams);

    const result = await pool.query(query, queryParams);

    // Compte total pour pagination
    const countQuery = `
      SELECT COUNT(*) as total FROM moderation_queue 
      ${whereSQL}
    `;
    
    // Paramètres pour le count (sans limit/offset)
    const countParams = whereClauses.length > 0 ? [] : [];
    const countResult = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      items: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        totalPages: Math.ceil(countResult.rows[0].total / limit)
      }
    });
  } catch (error) {
    console.error("❌ Error getting moderation queue:", error);
    res.status(500).json({
      success: false,
      error: "Erreur récupération file modération",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Get moderation actions history - VERSION RÉELLE
 */
export const getModerationActions = async (req, res) => {
  try {
    const { filter = "all" } = req.query;
    const userId = req.user.id;

    // Check if user is admin
    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId]
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // Requête réelle pour les actions
    let query = `
      SELECT 
        ma.*,
        u1.nom as moderator_name,
        u2.nom as affected_user_name
      FROM moderation_actions ma
      LEFT JOIN utilisateur u1 ON ma.moderator_id = u1.id
      LEFT JOIN utilisateur u2 ON ma.affected_user_id = u2.id
    `;

    if (filter === "warnings") {
      query += " WHERE ma.action_type = 'warn_user'";
    } else if (filter === "removals") {
      query += " WHERE ma.action_type = 'remove_content'";
    } else if (filter === "bans") {
      query += " WHERE ma.action_type = 'ban_user'";
    } else if (filter === "today") {
      query += " WHERE DATE(ma.created_at) = CURRENT_DATE";
    } else if (filter === "week") {
      query += " WHERE ma.created_at >= NOW() - INTERVAL '7 days'";
    } else if (filter === "month") {
      query += " WHERE ma.created_at >= NOW() - INTERVAL '30 days'";
    }

    query += " ORDER BY ma.created_at DESC LIMIT 100";

    const result = await pool.query(query);

    // Transformer les données pour le frontend
    const actions = result.rows.map(row => ({
      id: row.id,
      action_type: row.action_type,
      moderator_name: row.moderator_name || 'Admin',
      affected_user: row.affected_user_name || 'Utilisateur inconnu',
      content_type: row.content_type,
      content_id: row.content_id,
      reason: row.reason,
      notes: row.notes,
      is_reversible: row.is_reversible || true,
      expires_at: row.expires_at,
      created_at: row.created_at,
    }));

    res.json({
      success: true,
      actions: actions,
    });
  } catch (error) {
    console.error("❌ Error getting moderation actions:", error);
    res.status(500).json({
      success: false,
      error: "Erreur récupération actions modération",
      details: error.message
    });
  }
};

/**
 * Take moderation action - VERSION COMPLÈTE
 */
export const takeModerationAction = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { id } = req.params;
    const { action, reason, notes, duration } = req.body;
    const userId = req.user.id;

    // Vérification admin
    const userCheck = await client.query(
      "SELECT role, nom FROM utilisateur WHERE id = $1",
      [userId]
    );

    if (!userCheck.rows[0] || userCheck.rows[0].role !== "admin") {
      await client.query("ROLLBACK");
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // Récupérer l'élément de la file
    const queueItem = await client.query(
      `SELECT * FROM moderation_queue WHERE id = $1`,
      [id]
    );

    if (queueItem.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Élément de modération non trouvé",
      });
    }

    const item = queueItem.rows[0];
    const moderatorName = userCheck.rows[0].nom;

    // Actions spécifiques selon le type
    let affectedUserId = item.reported_user_id;
    
    if (action === "remove_content") {
      if (item.content_type === "post") {
        await client.query(
          `UPDATE publications SET status = 'removed', removed_at = NOW() WHERE id = $1`,
          [item.content_id]
        );
      } else if (item.content_type === "comment") {
        await client.query(
          `UPDATE commentaires SET status = 'removed', removed_at = NOW() WHERE id = $1`,
          [item.content_id]
        );
      }
    } else if (action === "ban_user") {
      const banUntil = duration
        ? `NOW() + INTERVAL '${duration} days'`
        : null;

      const updateQuery = banUntil 
        ? `UPDATE utilisateur SET status = 'banned', banned_until = ${banUntil}, ban_reason = $1 WHERE id = $2`
        : `UPDATE utilisateur SET status = 'banned', banned_until = NULL, ban_reason = $1 WHERE id = $2`;
      
      await client.query(updateQuery, [reason, affectedUserId]);
    } else if (action === "warn_user") {
      // Créer une notification d'avertissement
      await client.query(
        `INSERT INTO notifications 
         (user_id, type, title, message, related_id, related_type)
         VALUES ($1, 'warning', 'Avertissement de modération', $2, $3, 'moderation_action')`,
        [affectedUserId, reason, item.content_id || id]
      );
    } else if (action === "approve") {
      // Marquer comme approuvé
      if (item.content_type === "post") {
        await client.query(
          `UPDATE publications SET status = 'active' WHERE id = $1`,
          [item.content_id]
        );
      } else if (item.content_type === "comment") {
        await client.query(
          `UPDATE commentaires SET status = 'active' WHERE id = $1`,
          [item.content_id]
        );
      }
    }

    // Enregistrer l'action
    const actionResult = await client.query(
      `INSERT INTO moderation_actions 
       (moderation_queue_id, moderator_id, action_type, reason, notes, duration, affected_user_id, content_type, content_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [
        id,
        userId,
        action,
        reason,
        notes,
        duration,
        affectedUserId,
        item.content_type,
        item.content_id,
      ]
    );

    // Mettre à jour le statut dans la file
    await client.query(
      `UPDATE moderation_queue 
       SET status = 'resolved', 
           resolved_at = NOW(),
           resolved_by = $1
       WHERE id = $2`,
      [userId, id]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: `Action "${action}" appliquée avec succès`,
      data: {
        action_id: actionResult.rows[0].id,
        moderator: moderatorName,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error taking moderation action:", error);
    res.status(500).json({
      success: false,
      error: "Erreur traitement action modération",
      details: error.message
    });
  } finally {
    client.release();
  }
};

/**
 * Get moderation statistics - VERSION RÉELLE
 */
export const getModerationStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user is admin
    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId]
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // Statistiques réelles
    const statsQuery = `
      SELECT 
        COUNT(*) as total_actions,
        COUNT(CASE WHEN action_type = 'warn_user' THEN 1 END) as warning_actions,
        COUNT(CASE WHEN action_type = 'remove_content' THEN 1 END) as removed_content,
        COUNT(CASE WHEN action_type = 'ban_user' THEN 1 END) as banned_users,
        COUNT(CASE WHEN action_type = 'suspend_user' THEN 1 END) as suspended_users
      FROM moderation_actions
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `;

    const statsResult = await pool.query(statsQuery);

    const queueStatsQuery = `
      SELECT 
        COUNT(*) as total_queue,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_queue,
        COUNT(CASE WHEN priority = 'critical' THEN 1 END) as critical_queue,
        COUNT(CASE WHEN content_type = 'post' THEN 1 END) as posts_queue,
        COUNT(CASE WHEN content_type = 'comment' THEN 1 END) as comments_queue
      FROM moderation_queue
      WHERE status != 'resolved'
    `;

    const queueStatsResult = await pool.query(queueStatsQuery);

    const stats = {
      total_actions: parseInt(statsResult.rows[0].total_actions) || 0,
      warning_actions: parseInt(statsResult.rows[0].warning_actions) || 0,
      removed_content: parseInt(statsResult.rows[0].removed_content) || 0,
      banned_users: parseInt(statsResult.rows[0].banned_users) || 0,
      suspended_users: parseInt(statsResult.rows[0].suspended_users) || 0,
      pending_queue: parseInt(queueStatsResult.rows[0].pending_queue) || 0,
      critical_queue: parseInt(queueStatsResult.rows[0].critical_queue) || 0,
      total_queue: parseInt(queueStatsResult.rows[0].total_queue) || 0,
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("❌ Error getting moderation stats:", error);
    res.status(500).json({
      success: false,
      error: "Erreur récupération stats modération",
      details: error.message
    });
  }
};

/**
 * Get user reports - VERSION RÉELLE
 */
export const getReports = async (req, res) => {
  try {
    const { filter = "all" } = req.query;
    const userId = req.user.id;

    // Check if user is admin
    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId]
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // Requête réelle pour les signalements
    let query = `
      SELECT 
        r.*,
        u1.nom as reporter_name,
        u2.nom as reported_user_name
      FROM reports r
      LEFT JOIN utilisateur u1 ON r.user_id = u1.id
      LEFT JOIN utilisateur u2 ON r.reported_user_id = u2.id
    `;

    if (filter === "pending") {
      query += " WHERE r.status = 'pending'";
    } else if (filter === "in_review") {
      query += " WHERE r.status = 'in_review'";
    } else if (filter === "resolved") {
      query += " WHERE r.status = 'resolved'";
    } else if (filter === "critical") {
      query += " WHERE r.severity = 'critical'";
    } else if (filter === "harassment") {
      query += " WHERE r.reason LIKE '%harassment%' OR r.reason LIKE '%harcèlement%'";
    } else if (filter === "spam") {
      query += " WHERE r.reason LIKE '%spam%'";
    } else if (filter === "inappropriate") {
      query += " WHERE r.reason LIKE '%inappropriate%' OR r.reason LIKE '%inapproprié%'";
    }

    query += " ORDER BY r.created_at DESC LIMIT 100";

    const result = await pool.query(query);

    const reports = result.rows.map(row => ({
      id: row.id,
      reporter_name: row.reporter_name || 'Anonyme',
      reported_user: row.reported_user_name || 'Utilisateur inconnu',
      type: getReportType(row.reason),
      reason: row.reason,
      description: row.description,
      severity: row.severity || 'medium',
      status: row.status,
      created_at: row.created_at,
      assigned_moderator: row.assigned_to ? 'Modérateur' : null,
      resolution_notes: row.resolution_notes,
    }));

    res.json({
      success: true,
      reports: reports,
    });
  } catch (error) {
    console.error("❌ Error getting reports:", error);
    res.status(500).json({
      success: false,
      error: "Erreur récupération signalements",
      details: error.message
    });
  }
};

/**
 * Get reports statistics - VERSION RÉELLE
 */
export const getReportsStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user is admin
    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId]
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // Statistiques réelles
    const statsQuery = `
      SELECT 
        COUNT(*) as total_reports,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_reports,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_reports,
        COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_reports,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as monthly_reports
      FROM reports
    `;

    const statsResult = await pool.query(statsQuery);

    // Calculer le taux de croissance (simplifié)
    const lastMonthQuery = `
      SELECT COUNT(*) as count FROM reports 
      WHERE created_at >= NOW() - INTERVAL '60 days' 
      AND created_at < NOW() - INTERVAL '30 days'
    `;
    
    const lastMonthResult = await pool.query(lastMonthQuery);
    const lastMonthCount = parseInt(lastMonthResult.rows[0].count) || 0;
    const currentMonthCount = parseInt(statsResult.rows[0].monthly_reports) || 0;
    
    let reportsGrowth = 0;
    if (lastMonthCount > 0) {
      reportsGrowth = ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
    }

    // Calculer le taux de résolution
    const total = parseInt(statsResult.rows[0].total_reports) || 0;
    const resolved = parseInt(statsResult.rows[0].resolved_reports) || 0;
    const resolutionRate = total > 0 ? (resolved / total) * 100 : 100;

    const stats = {
      total_reports: total,
      pending_reports: parseInt(statsResult.rows[0].pending_reports) || 0,
      resolved_reports: resolved,
      critical_reports: parseInt(statsResult.rows[0].critical_reports) || 0,
      reports_growth: reportsGrowth.toFixed(1),
      resolution_rate: resolutionRate.toFixed(1),
      avg_resolution_time: 4.2, // À calculer avec des données réelles
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("❌ Error getting reports stats:", error);
    res.status(500).json({
      success: false,
      error: "Erreur récupération stats signalements",
      details: error.message
    });
  }
};

/**
 * Resolve a report - VERSION RÉELLE
 */
export const resolveReport = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { id } = req.params;
    const { action, notes } = req.body;
    const userId = req.user.id;

    // Check if user is admin
    const userCheck = await client.query(
      "SELECT role, nom FROM utilisateur WHERE id = $1",
      [userId]
    );

    if (userCheck.rows[0].role !== "admin") {
      await client.query("ROLLBACK");
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // Récupérer le signalement
    const reportResult = await client.query(
      "SELECT * FROM reports WHERE id = $1",
      [id]
    );

    if (reportResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Signalement non trouvé",
      });
    }

    const report = reportResult.rows[0];

    // Mettre à jour le statut du signalement
    await client.query(
      `UPDATE reports 
       SET status = $1, 
           resolved_at = NOW(),
           resolved_by = $2,
           resolution_notes = $3
       WHERE id = $4`,
      [action, userId, notes, id]
    );

    // Si c'est résolu, mettre à jour la file de modération
    if (action === 'resolved') {
      await client.query(
        `UPDATE moderation_queue 
         SET status = 'resolved',
             resolved_at = NOW(),
             resolved_by = $1
         WHERE content_id = $2 AND content_type = $3`,
        [userId, report.content_id, report.content_type]
      );
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: `Signalement ${action === "resolved" ? "résolu" : "rejeté"} avec succès`,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error resolving report:", error);
    res.status(500).json({
      success: false,
      error: "Erreur résolution signalement",
      details: error.message
    });
  } finally {
    client.release();
  }
};