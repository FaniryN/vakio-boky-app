import pool from "../config/db.js";

/**
 * Get all active challenges
 */
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

/**
 * Get challenge by ID
 */
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

/**
 * Get user's challenge progress
 */
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

/**
 * Join a challenge
 */
export const joinChallenge = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { challengeId } = req.params;
    const userId = req.user.id;

    // Check if challenge exists and is active
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

    // Check if user already joined
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

    // Join the challenge
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

/**
 * Update user challenge progress
 */
export const updateChallengeProgress = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { challengeId } = req.params;
    const { progress } = req.body;
    const userId = req.user.id;

    // Get current progress
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

    // Update progress
    const updateResult = await client.query(`
      UPDATE user_challenges
      SET current_value = $1, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2 AND challenge_id = $3
      RETURNING *
    `, [newProgress, userId, challengeId]);

    // Check if challenge is completed
    const challengeResult = await client.query(
      "SELECT * FROM challenges WHERE id = $1",
      [challengeId]
    );

    const challenge = challengeResult.rows[0];

    if (newProgress >= challenge.target_value && userChallenge.status !== 'completed') {
      // Mark as completed
      await client.query(`
        UPDATE user_challenges
        SET status = 'completed', completed_at = CURRENT_TIMESTAMP
        WHERE user_id = $1 AND challenge_id = $2
      `, [userId, challengeId]);

      // Award badge if there's a reward
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

/**
 * Get all badges
 */
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

/**
 * Get user's earned badges
 */
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

/**
 * Create a new challenge (Admin only)
 */
export const createChallenge = async (req, res) => {
  try {
    const { title, description, type, target_value, reward_badge_id, end_date } = req.body;

    const result = await pool.query(`
      INSERT INTO challenges (title, description, type, target_value, reward_badge_id, end_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, description, type, target_value, reward_badge_id, end_date]);

    res.status(201).json({
      success: true,
      message: "Challenge created successfully",
      challenge: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error creating challenge:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Create a new badge (Admin only)
 */
export const createBadge = async (req, res) => {
  try {
    const { name, description, icon_url, category, rarity, points } = req.body;

    const result = await pool.query(`
      INSERT INTO badges (name, description, icon_url, category, rarity, points)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [name, description, icon_url, category, rarity, points]);

    res.status(201).json({
      success: true,
      message: "Badge created successfully",
      badge: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error creating badge:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Get all challenges for admin management
 */
export const getAllChallengesAdmin = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*,
             COUNT(uc.id) as participants_count,
             COUNT(CASE WHEN uc.status = 'completed' THEN 1 END) as completions_count,
             CASE
               WHEN COUNT(uc.id) > 0 THEN ROUND(COUNT(CASE WHEN uc.status = 'completed' THEN 1 END)::decimal / COUNT(uc.id) * 100, 1)
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

/**
 * Update a challenge
 */
export const updateChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, target_value, reward_badge_id, end_date, status } = req.body;

    const result = await pool.query(`
      UPDATE challenges
      SET title = $1, description = $2, type = $3, target_value = $4,
          reward_badge_id = $5, end_date = $6, status = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `, [title, description, type, target_value, reward_badge_id, end_date, status, id]);

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
      error: "Server error",
    });
  }
};

/**
 * Delete a challenge
 */
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

/**
 * Update challenge status
 */
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

/**
 * Get all badges for admin management
 */
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

/**
 * Update a badge
 */
export const updateBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon_url, category, rarity, points } = req.body;

    const result = await pool.query(`
      UPDATE badges
      SET name = $1, description = $2, icon_url = $3, category = $4, rarity = $5, points = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [name, description, icon_url, category, rarity, points, id]);

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
      error: "Server error",
    });
  }
};

/**
 * Delete a badge
 */
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

/**
 * Get challenges analytics
 */
export const getChallengesAnalytics = async (req, res) => {
  try {
    const { range = '30d' } = req.query;

    // Calculate date range
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

    // Get total challenges
    const totalChallengesResult = await pool.query("SELECT COUNT(*) as count FROM challenges");
    const totalChallenges = parseInt(totalChallengesResult.rows[0].count);

    // Get active challenges
    const activeChallengesResult = await pool.query("SELECT COUNT(*) as count FROM challenges WHERE status = 'active'");
    const activeChallenges = parseInt(activeChallengesResult.rows[0].count);

    // Get total participants
    const totalParticipantsResult = await pool.query("SELECT COUNT(DISTINCT user_id) as count FROM user_challenges");
    const totalParticipants = parseInt(totalParticipantsResult.rows[0].count);

    // Get completion rate
    const completionResult = await pool.query(`
      SELECT
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(*) as total
      FROM user_challenges
    `);
    const completionData = completionResult.rows[0];
    const completionRate = completionData.total > 0 ? Math.round((completionData.completed / completionData.total) * 100) : 0;

    // Get total badges earned
    const totalBadgesResult = await pool.query("SELECT COUNT(*) as count FROM user_badges");
    const totalBadges = parseInt(totalBadgesResult.rows[0].count);

    // Get daily participation (last 7 days)
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

    // Get challenge types distribution
    const challengeTypesResult = await pool.query(`
      SELECT 
        type,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM challenges), 1) as percentage
      FROM challenges
      GROUP BY type
      ORDER BY count DESC
    `);

    // Get top challenges by participants
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

    // Get top participants
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

    // Get badge distribution
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

    // Get monthly trends (challenges created per month)
    const monthlyTrendsResult = await pool.query(`
      SELECT 
        TO_CHAR(created_at, 'Month') as month,
        COUNT(*) as challenges_created
      FROM challenges
      WHERE created_at >= $1
      GROUP BY TO_CHAR(created_at, 'Month'), EXTRACT(MONTH FROM created_at)
      ORDER BY EXTRACT(MONTH FROM created_at)
    `, [startDate]);

    // Get challenge status distribution
    const statusDistributionResult = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM challenges), 1) as percentage
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
      challengesGrowth: 12.5, // Mock data
      dailyParticipation: dailyParticipationResult.rows,
      challengeTypes: challengeTypesResult.rows,
      topChallenges: topChallengesResult.rows,
      topParticipants: topParticipantsResult.rows,
      badgeDistribution: badgeDistributionResult.rows,
      monthlyTrends: monthlyTrendsResult.rows,
      engagementMetrics: [
        { name: 'Temps moyen par défi', value: '12 jours' },
        { name: 'Taux d\'abandon', value: '23%' },
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