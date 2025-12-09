// import pool from "../config/db.js";

// export const createReport = async (req, res) => {
//   try {
//     const { content_id, content_type, reason, description, reported_user_id } = req.body;
//     const userId = req.user.id;

//     // 1. Insérer le signalement
//     const result = await pool.query(
//       `INSERT INTO reports (user_id, content_id, content_type, reason, description, reported_user_id, status)
//        VALUES ($1, $2, $3, $4, $5, $6, 'pending')
//        RETURNING id`,
//       [userId, content_id, content_type, reason, description, reported_user_id]
//     );

//     // 2. Compter les signalements
//     const countResult = await pool.query(
//       `SELECT COUNT(*) FROM reports 
//        WHERE content_id = $1 AND content_type = $2 AND status = 'pending'`,
//       [content_id, content_type]
//     );

//     const count = parseInt(countResult.rows[0].count);
    
//     // 3. Déterminer priorité
//     let priority = 'low';
//     if (count >= 5) priority = 'critical';
//     else if (count >= 3) priority = 'high';
//     else if (count >= 1) priority = 'medium';

//     // 4. Ajouter à la file de modération
//     await pool.query(
//       `INSERT INTO moderation_queue (content_id, content_type, reported_user_id, reporter_id, priority, status, reports_count)
//        VALUES ($1, $2, $3, $4, $5, 'pending', $6)
//        ON CONFLICT (content_id, content_type) 
//        DO UPDATE SET priority = $5, reports_count = $6, updated_at = NOW()`,
//       [content_id, content_type, reported_user_id, userId, priority, count]
//     );

//     res.json({
//       success: true,
//       message: "Signalement envoyé",
//       data: { report_id: result.rows[0].id, priority }
//     });

//   } catch (error) {
//     console.error("❌ Erreur:", error);
//     res.status(500).json({ success: false, error: "Erreur serveur" });
//   }
// };
import pool from "../config/db.js";

export const createReport = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");

    const { content_id, content_type, reason, description, reported_user_id } = req.body;
    const userId = req.user.id;

    console.log("📝 Nouveau signalement:", {
      content_id,
      content_type,
      reason,
      reported_user_id,
      user_id: userId
    });

    // 1. Vérifier si l'utilisateur a déjà signalé ce contenu
    const existingReport = await client.query(
      `SELECT id FROM reports 
       WHERE user_id = $1 AND content_id = $2 AND content_type = $3 
       AND created_at >= NOW() - INTERVAL '24 hours'`,
      [userId, content_id, content_type]
    );

    if (existingReport.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ 
        success: false, 
        error: "Vous avez déjà signalé ce contenu récemment" 
      });
    }

    // 2. Insérer le signalement
    const result = await client.query(
      `INSERT INTO reports (user_id, content_id, content_type, reason, description, reported_user_id, status, severity)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7)
       RETURNING id, created_at`,
      [userId, content_id, content_type, reason, description, reported_user_id, 'medium']
    );

    const reportId = result.rows[0].id;

    // 3. Compter les signalements pour ce contenu
    const countResult = await client.query(
      `SELECT COUNT(*) as count FROM reports 
       WHERE content_id = $1 AND content_type = $2 AND status = 'pending'`,
      [content_id, content_type]
    );

    const count = parseInt(countResult.rows[0].count);
    
    // 4. Déterminer priorité
    let priority = 'low';
    if (count >= 5) priority = 'critical';
    else if (count >= 3) priority = 'high';
    else if (count >= 1) priority = 'medium';

    // 5. Vérifier si l'élément existe déjà dans la file
    const existingQueueItem = await client.query(
      `SELECT id, reports_count FROM moderation_queue 
       WHERE content_id = $1 AND content_type = $2`,
      [content_id, content_type]
    );

    if (existingQueueItem.rows.length > 0) {
      // Mettre à jour l'élément existant
      const newCount = existingQueueItem.rows[0].reports_count + 1;
      await client.query(
        `UPDATE moderation_queue 
         SET priority = $1, 
             reports_count = $2, 
             updated_at = NOW(),
             status = 'pending'
         WHERE id = $3`,
        [priority, newCount, existingQueueItem.rows[0].id]
      );
    } else {
      // Créer un nouvel élément
      await client.query(
        `INSERT INTO moderation_queue 
         (content_id, content_type, reported_user_id, reporter_id, reason, priority, status, reports_count)
         VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7)`,
        [content_id, content_type, reported_user_id, userId, reason, priority, 1]
      );
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Signalement envoyé avec succès",
      data: { 
        report_id: reportId, 
        priority,
        message: "Notre équipe de modération va examiner ce contenu rapidement."
      }
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Erreur création signalement:", error);
    res.status(500).json({ 
      success: false, 
      error: "Erreur serveur lors du signalement",
      details: error.message 
    });
  } finally {
    client.release();
  }
};