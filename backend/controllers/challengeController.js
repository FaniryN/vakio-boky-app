import pool from "../config/db.js";

export const getChallenges = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, b.name as reward_badge_name, b.icon_url as reward_badge_icon
      FROM challenges c
      LEFT JOIN badges b ON c.reward_badge_id = b.id
      WHERE c.status = 'active'
      ORDER BY c.created_at DESC
    `);

    res.json({
      success: true,
      challenges: result.rows,
    });
  } catch (error) {
    console.error("❌ Error retrieving challenges:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

export const getChallengeById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT c.*, b.name as reward_badge_name, b.icon_url as reward_badge_icon
      FROM challenges c
      LEFT JOIN badges b ON c.reward_badge_id = b.id
      WHERE c.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Challenge not found",
      });
    }

    res.json({
      success: true,
      challenge: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error retrieving challenge:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

export const getUserChallenges = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT uc.*, c.title, c.description, c.type, c.target_value,
             c.end_date, b.name as reward_badge_name, b.icon_url as reward_badge_icon
      FROM user_challenges uc
      JOIN challenges c ON uc.challenge_id = c.id
      LEFT JOIN badges b ON c.reward_badge_id = b.id
      WHERE uc.user_id = $1
      ORDER BY uc.started_at DESC
    `, [userId]);

    res.json({
      success: true,
      userChallenges: result.rows,
    });
  } catch (error) {
    console.error("❌ Error retrieving user challenges:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

export const joinChallenge = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { challengeId } = req.params;
    const userId = req.user.id;

    const challengeCheck = await client.query(
      "SELECT * FROM challenges WHERE id = $1 AND status = 'active'",
      [challengeId]
    );

    if (challengeCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Challenge not found or inactive",
      });
    }

    const existingJoin = await client.query(
      "SELECT * FROM user_challenges WHERE user_id = $1 AND challenge_id = $2",
      [userId, challengeId]
    );

    if (existingJoin.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: "Already joined this challenge",
      });
    }

    const result = await client.query(`
      INSERT INTO user_challenges (user_id, challenge_id)
      VALUES ($1, $2)
      RETURNING *
    `, [userId, challengeId]);

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Successfully joined challenge",
      userChallenge: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error joining challenge:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  } finally {
    client.release();
  }
};

export const updateChallengeProgress = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { challengeId } = req.params;
    const { progress } = req.body;
    const userId = req.user.id;

    const currentResult = await client.query(
      "SELECT * FROM user_challenges WHERE user_id = $1 AND challenge_id = $2",
      [userId, challengeId]
    );

    if (currentResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "User challenge not found",
      });
    }

    const userChallenge = currentResult.rows[0];
    const newProgress = Math.max(userChallenge.current_value, progress);

    const updateResult = await client.query(`
      UPDATE user_challenges
      SET current_value = $1, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2 AND challenge_id = $3
      RETURNING *
    `, [newProgress, userId, challengeId]);

    const challengeResult = await client.query(
      "SELECT * FROM challenges WHERE id = $1",
      [challengeId]
    );

    const challenge = challengeResult.rows[0];

    if (newProgress >= challenge.target_value && userChallenge.status !== 'completed') {
      await client.query(`
        UPDATE user_challenges
        SET status = 'completed', completed_at = CURRENT_TIMESTAMP
        WHERE user_id = $1 AND challenge_id = $2
      `, [userId, challengeId]);

      if (challenge.reward_badge_id) {
        await client.query(`
          INSERT INTO user_badges (user_id, badge_id)
          VALUES ($1, $2)
          ON CONFLICT (user_id, badge_id) DO NOTHING
        `, [userId, challenge.reward_badge_id]);
      }
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Progress updated successfully",
      userChallenge: updateResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error updating challenge progress:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  } finally {
    client.release();
  }
};

export const getBadges = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM badges
      ORDER BY points DESC, created_at DESC
    `);

    res.json({
      success: true,
      badges: result.rows,
    });
  } catch (error) {
    console.error("❌ Error retrieving badges:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

export const getUserBadges = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT b.*, ub.earned_at
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = $1
      ORDER BY ub.earned_at DESC
    `, [userId]);

    res.json({
      success: true,
      userBadges: result.rows,
    });
  } catch (error) {
    console.error("❌ Error retrieving user badges:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

export const createChallenge = async (req, res) => {
  try {
    const { title, description, type, target_value, reward_badge_id, end_date, status } = req.body;

    // Convertir les chaînes vides en null pour les champs optionnels
    const badgeId = reward_badge_id && reward_badge_id !== '' ? parseInt(reward_badge_id) : null;
    const endDate = end_date && end_date !== '' ? end_date : null;
    const challengeStatus = status || 'draft';

    const result = await pool.query(`
      INSERT INTO challenges (title, description, type, target_value, reward_badge_id, end_date, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [title, description, type, parseInt(target_value), badgeId, endDate, challengeStatus]);

    res.status(201).json({
      success: true,
      message: "Challenge created successfully",
      challenge: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error creating challenge:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};

export const createBadge = async (req, res) => {
  try {
    const { name, description, icon_url, category, rarity, points } = req.body;

    // Valeurs par défaut et validation
    const iconUrl = icon_url && icon_url !== '' ? icon_url : null;
    const badgeCategory = category || 'achievement';
    const badgeRarity = rarity || 'common';
    const badgePoints = points ? parseInt(points) : 10;

    const result = await pool.query(`
      INSERT INTO badges (name, description, icon_url, category, rarity, points)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [name, description, iconUrl, badgeCategory, badgeRarity, badgePoints]);

    res.status(201).json({
      success: true,
      message: "Badge created successfully",
      badge: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error creating badge:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};

export const getAllChallengesAdmin = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*,
             COUNT(DISTINCT uc.id) as participants_count,
             COUNT(DISTINCT CASE WHEN uc.status = 'completed' THEN uc.id END) as completions_count,
             CASE
               WHEN COUNT(DISTINCT uc.id) > 0 THEN 
                 ROUND(COUNT(DISTINCT CASE WHEN uc.status = 'completed' THEN uc.id END)::decimal / COUNT(DISTINCT uc.id) * 100, 1)
               ELSE 0
             END as completion_rate
      FROM challenges c
      LEFT JOIN user_challenges uc ON c.id = uc.challenge_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    res.json({
      success: true,
      challenges: result.rows,
    });
  } catch (error) {
    console.error("❌ Error retrieving admin challenges:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

export const updateChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, target_value, reward_badge_id, end_date, status } = req.body;

    // Convertir les chaînes vides en null
    const badgeId = reward_badge_id && reward_badge_id !== '' ? parseInt(reward_badge_id) : null;
    const endDate = end_date && end_date !== '' ? end_date : null;
    const challengeStatus = status || 'draft';

    const result = await pool.query(`
      UPDATE challenges
      SET title = $1, description = $2, type = $3, target_value = $4,
          reward_badge_id = $5, end_date = $6, status = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `, [title, description, type, parseInt(target_value), badgeId, endDate, challengeStatus, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Challenge not found",
      });
    }

    res.json({
      success: true,
      message: "Challenge updated successfully",
      challenge: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error updating challenge:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};

export const deleteChallenge = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM challenges WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Challenge not found",
      });
    }

    res.json({
      success: true,
      message: "Challenge deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting challenge:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

export const updateChallengeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(`
      UPDATE challenges
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Challenge not found",
      });
    }

    res.json({
      success: true,
      message: `Challenge ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
      challenge: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error updating challenge status:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

export const getAllBadgesAdmin = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*,
             COUNT(ub.id) as earned_count
      FROM badges b
      LEFT JOIN user_badges ub ON b.id = ub.badge_id
      GROUP BY b.id
      ORDER BY b.points DESC, b.created_at DESC
    `);

    res.json({
      success: true,
      badges: result.rows,
    });
  } catch (error) {
    console.error("❌ Error retrieving admin badges:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

export const updateBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon_url, category, rarity, points } = req.body;

    // Validation et conversion
    const iconUrl = icon_url && icon_url !== '' ? icon_url : null;
    const badgeCategory = category || 'achievement';
    const badgeRarity = rarity || 'common';
    const badgePoints = points ? parseInt(points) : 10;

    const result = await pool.query(`
      UPDATE badges
      SET name = $1, description = $2, icon_url = $3, category = $4, rarity = $5, points = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [name, description, iconUrl, badgeCategory, badgeRarity, badgePoints, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Badge not found",
      });
    }

    res.json({
      success: true,
      message: "Badge updated successfully",
      badge: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error updating badge:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};

export const deleteBadge = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM badges WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Badge not found",
      });
    }

    res.json({
      success: true,
      message: "Badge deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting badge:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

export const getChallengesAnalytics = async (req, res) => {
  try {
    const { range = '30d' } = req.query;

    const now = new Date();
    let startDate;
    switch (range) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const totalChallengesResult = await pool.query("SELECT COUNT(*) as count FROM challenges");
    const totalChallenges = parseInt(totalChallengesResult.rows[0].count);

    const activeChallengesResult = await pool.query("SELECT COUNT(*) as count FROM challenges WHERE status = 'active'");
    const activeChallenges = parseInt(activeChallengesResult.rows[0].count);

    const totalParticipantsResult = await pool.query("SELECT COUNT(DISTINCT user_id) as count FROM user_challenges");
    const totalParticipants = parseInt(totalParticipantsResult.rows[0].count);

    const completionResult = await pool.query(`
      SELECT
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(*) as total
      FROM user_challenges
    `);
    const completionData = completionResult.rows[0];
    const completionRate = completionData.total > 0 ? Math.round((completionData.completed / completionData.total) * 100) : 0;

    const totalBadgesResult = await pool.query("SELECT COUNT(*) as count FROM user_badges");
    const totalBadges = parseInt(totalBadgesResult.rows[0].count);

    const dailyParticipationResult = await pool.query(`
      SELECT 
        DATE(uc.started_at) as date,
        COUNT(DISTINCT uc.user_id) as participants,
        COUNT(CASE WHEN uc.status = 'completed' THEN 1 END) as completions
      FROM user_challenges uc
      WHERE uc.started_at >= $1
      GROUP BY DATE(uc.started_at)
      ORDER BY date DESC
      LIMIT 7
    `, [startDate]);

    const challengeTypesResult = await pool.query(`
      SELECT 
        type,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM challenges), 0), 1) as percentage
      FROM challenges
      GROUP BY type
      ORDER BY count DESC
    `);

    const topChallengesResult = await pool.query(`
      SELECT 
        c.id,
        c.title,
        c.type,
        COUNT(uc.id) as participants,
        COUNT(CASE WHEN uc.status = 'completed' THEN 1 END) as completions,
        CASE 
          WHEN COUNT(uc.id) > 0 THEN ROUND(COUNT(CASE WHEN uc.status = 'completed' THEN 1 END) * 100.0 / COUNT(uc.id), 1)
          ELSE 0 
        END as completion_rate
      FROM challenges c
      LEFT JOIN user_challenges uc ON c.id = uc.challenge_id
      GROUP BY c.id, c.title, c.type
      ORDER BY participants DESC
      LIMIT 5
    `);

    const topParticipantsResult = await pool.query(`
      SELECT 
        u.id,
        u.nom as name,
        COUNT(uc.id) as challenges_completed
      FROM utilisateur u
      JOIN user_challenges uc ON u.id = uc.user_id
      WHERE uc.status = 'completed'
      GROUP BY u.id, u.nom
      ORDER BY challenges_completed DESC
      LIMIT 5
    `);

    const badgeDistributionResult = await pool.query(`
      SELECT 
        b.id,
        b.name,
        COUNT(ub.id) as earned_count
      FROM badges b
      LEFT JOIN user_badges ub ON b.id = ub.badge_id
      GROUP BY b.id, b.name
      ORDER BY earned_count DESC
      LIMIT 5
    `);

    const monthlyTrendsResult = await pool.query(`
      SELECT 
        TO_CHAR(created_at, 'Month') as month,
        COUNT(*) as challenges_created
      FROM challenges
      WHERE created_at >= $1
      GROUP BY TO_CHAR(created_at, 'Month'), EXTRACT(MONTH FROM created_at)
      ORDER BY EXTRACT(MONTH FROM created_at)
    `, [startDate]);

    const statusDistributionResult = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM challenges), 0), 1) as percentage
      FROM challenges
      GROUP BY status
      ORDER BY count DESC
    `);

    const analytics = {
      totalChallenges,
      activeChallenges,
      totalParticipants,
      completionRate,
      totalBadges,
      challengesGrowth: 12.5,
      dailyParticipation: dailyParticipationResult.rows,
      challengeTypes: challengeTypesResult.rows,
      topChallenges: topChallengesResult.rows,
      topParticipants: topParticipantsResult.rows,
      badgeDistribution: badgeDistributionResult.rows,
      monthlyTrends: monthlyTrendsResult.rows,
      engagementMetrics: [
        { name: 'Temps moyen par défi', value: '12 jours' },
        { name: "Taux d'abandon", value: '23%' },
        { name: 'Partages sociaux', value: '156' },
        { name: 'Commentaires', value: '89' },
      ],
      statusDistribution: statusDistributionResult.rows,
    };

    res.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error("❌ Error getting challenges analytics:", error);
    res.status(500).json({
      success: false,
      error: "Erreur récupération analytics",
    });
  }
};