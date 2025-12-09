// import pool from "../config/db.js";

// export const getCampaigns = async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT * FROM campaigns
//       WHERE status = 'active'
//       ORDER BY created_at DESC
//     `);

//     res.json({
//       success: true,
//       campaigns: result.rows,
//     });
//   } catch (error) {
//     console.error("Erreur récupération campagnes:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur",
//     });
//   }
// };

// export const createCampaign = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       target_amount,
//       start_date,
//       end_date,
//       image_url,
//     } = req.body;

//     const result = await pool.query(
//       `
//       INSERT INTO campaigns (title, description, target_amount, start_date, end_date, image_url, status)
//       VALUES ($1, $2, $3, $4, $5, $6, 'active')
//       RETURNING *
//     `,
//       [title, description, target_amount, start_date, end_date, image_url],
//     );

//     res.status(201).json({
//       success: true,
//       campaign: result.rows[0],
//     });
//   } catch (error) {
//     console.error("Erreur création campagne:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur création campagne",
//     });
//   }
// };

// export const getCampaignById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const result = await pool.query(
//       `
//       SELECT c.*,
//              COALESCE(SUM(d.amount), 0) as current_amount,
//              COUNT(d.id) as donor_count
//       FROM campaigns c
//       LEFT JOIN donations d ON c.id = d.campaign_id
//       WHERE c.id = $1
//       GROUP BY c.id
//     `,
//       [id],
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "Campagne non trouvée",
//       });
//     }

//     res.json({
//       success: true,
//       campaign: result.rows[0],
//     });
//   } catch (error) {
//     console.error("Erreur récupération campagne:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur",
//     });
//   }
// };

// export const updateCampaign = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     const allowedFields = [
//       "title",
//       "description",
//       "target_amount",
//       "end_date",
//       "image_url",
//       "status",
//     ];
//     const updateFields = [];
//     const updateValues = [];
//     let paramCount = 1;

//     allowedFields.forEach((field) => {
//       if (updates[field] !== undefined) {
//         updateFields.push(`${field} = $${paramCount}`);
//         updateValues.push(updates[field]);
//         paramCount++;
//       }
//     });

//     if (updateFields.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: "Aucun champ à mettre à jour",
//       });
//     }

//     updateValues.push(id);
//     const query = `
//       UPDATE campaigns
//       SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
//       WHERE id = $${paramCount}
//       RETURNING *
//     `;

//     const result = await pool.query(query, updateValues);

//     res.json({
//       success: true,
//       campaign: result.rows[0],
//     });
//   } catch (error) {
//     console.error("Erreur mise à jour campagne:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur mise à jour campagne",
//     });
//   }
// };

// export const deleteCampaign = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await pool.query("DELETE FROM campaigns WHERE id = $1", [id]);

//     res.json({
//       success: true,
//       message: "Campagne supprimée",
//     });
//   } catch (error) {
//     console.error("Erreur suppression campagne:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur suppression campagne",
//     });
//   }
// };

// // Admin functions for campaign moderation
// export const getAllCampaignsAdmin = async (req, res) => {
//   try {
//     const userId = req.user?.id;

//     // Check if user is admin
//     const userCheck = await pool.query(
//       "SELECT role FROM utilisateur WHERE id = $1",
//       [userId],
//     );

//     if (userCheck.rows[0].role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         error: "Access restricted to administrators",
//       });
//     }

//     const result = await pool.query(`
//       SELECT c.*,
//              COALESCE(SUM(d.amount), 0) as current_amount,
//              COUNT(d.id) as donor_count
//       FROM campaigns c
//       LEFT JOIN donations d ON c.id = d.campaign_id
//       GROUP BY c.id
//       ORDER BY c.created_at DESC
//     `);

//     res.json({
//       success: true,
//       campaigns: result.rows,
//     });
//   } catch (error) {
//     console.error("Erreur récupération campagnes admin:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur",
//     });
//   }
// };

// export const approveCampaign = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user?.id;

//     const userCheck = await pool.query(
//       "SELECT role FROM utilisateur WHERE id = $1",
//       [userId],
//     );

//     if (userCheck.rows[0].role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         error: "Access restricted to administrators",
//       });
//     }

//     const result = await pool.query(
//       "UPDATE campaigns SET status = 'active', approved_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
//       [id],
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "Campagne non trouvée",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Campagne approuvée",
//       campaign: result.rows[0],
//     });
//   } catch (error) {
//     console.error("Erreur approbation campagne:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur approbation campagne",
//     });
//   }
// };

// export const rejectCampaign = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { reason } = req.body;
//     const userId = req.user?.id;

//     const userCheck = await pool.query(
//       "SELECT role FROM utilisateur WHERE id = $1",
//       [userId],
//     );

//     if (userCheck.rows[0].role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         error: "Access restricted to administrators",
//       });
//     }

//     const result = await pool.query(
//       "UPDATE campaigns SET status = 'rejected', rejection_reason = $2, rejected_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
//       [id, reason],
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "Campagne non trouvée",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Campagne rejetée",
//       campaign: result.rows[0],
//     });
//   } catch (error) {
//     console.error("Erreur rejet campagne:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur rejet campagne",
//     });
//   }
// };

// export const featureCampaign = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { featured } = req.body;
//     const userId = req.user?.id;

//     const userCheck = await pool.query(
//       "SELECT role FROM utilisateur WHERE id = $1",
//       [userId],
//     );

//     if (userCheck.rows[0].role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         error: "Access restricted to administrators",
//       });
//     }

//     const result = await pool.query(
//       "UPDATE campaigns SET featured = $2, featured_at = CASE WHEN $2 THEN CURRENT_TIMESTAMP ELSE NULL END WHERE id = $1 RETURNING *",
//       [id, featured],
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "Campagne non trouvée",
//       });
//     }

//     res.json({
//       success: true,
//       message: featured ? "Campagne mise en avant" : "Campagne retirée des mises en avant",
//       campaign: result.rows[0],
//     });
//   } catch (error) {
//     console.error("Erreur mise en avant campagne:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur mise en avant campagne",
//     });
//   }
// };

// export const updateFeaturedOrder = async (req, res) => {
//   try {
//     const { updates } = req.body;
//     const userId = req.user?.id;

//     const userCheck = await pool.query(
//       "SELECT role FROM utilisateur WHERE id = $1",
//       [userId],
//     );

//     if (userCheck.rows[0].role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         error: "Access restricted to administrators",
//       });
//     }

//     // Update each campaign's featured status and order
//     for (const update of updates) {
//       await pool.query(
//         "UPDATE campaigns SET featured = $2, featured_order = $3 WHERE id = $1",
//         [update.id, update.featured, update.featured_order],
//       );
//     }

//     // Reset featured status for campaigns not in the updates
//     await pool.query(
//       "UPDATE campaigns SET featured = false, featured_order = NULL WHERE id NOT IN (SELECT unnest($1::int[]))",
//       [updates.map(u => u.id)],
//     );

//     res.json({
//       success: true,
//       message: "Ordre des campagnes mises en avant mis à jour",
//     });
//   } catch (error) {
//     console.error("Erreur mise à jour ordre:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur mise à jour ordre",
//     });
//   }
// };

// export const getCampaignAnalytics = async (req, res) => {
//   try {
//     const { range = '30d' } = req.query;
//     const userId = req.user?.id;

//     const userCheck = await pool.query(
//       "SELECT role FROM utilisateur WHERE id = $1",
//       [userId],
//     );

//     if (userCheck.rows[0].role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         error: "Access restricted to administrators",
//       });
//     }

//     // Calculate date range
//     const now = new Date();
//     let startDate;
//     switch (range) {
//       case '7d':
//         startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//         break;
//       case '30d':
//         startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//         break;
//       case '90d':
//         startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
//         break;
//       case '1y':
//         startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
//         break;
//       default:
//         startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//     }

//     // Get total raised in period
//     const totalRaisedResult = await pool.query(
//       "SELECT COALESCE(SUM(amount), 0) as total FROM donations WHERE created_at >= $1",
//       [startDate],
//     );

//     // Get total donations count
//     const totalDonationsResult = await pool.query(
//       "SELECT COUNT(*) as count FROM donations WHERE created_at >= $1",
//       [startDate],
//     );

//     // Get active donors
//     const activeDonorsResult = await pool.query(
//       "SELECT COUNT(DISTINCT user_id) as count FROM donations WHERE created_at >= $1 AND user_id IS NOT NULL",
//       [startDate],
//     );

//     // Get active campaigns
//     const activeCampaignsResult = await pool.query(
//       "SELECT COUNT(*) as count FROM campaigns WHERE status = 'active'",
//     );

//     // Get top performing campaigns
//     const topCampaignsResult = await pool.query(`
//       SELECT c.id, c.title, c.target_amount,
//              COALESCE(SUM(d.amount), 0) as amount,
//              COUNT(d.id) as donations
//       FROM campaigns c
//       LEFT JOIN donations d ON c.id = d.campaign_id AND d.created_at >= $1
//       GROUP BY c.id, c.title, c.target_amount
//       ORDER BY amount DESC
//       LIMIT 5
//     `, [startDate]);

//     // Get recent donations
//     const recentDonationsResult = await pool.query(`
//       SELECT d.amount, d.anonymous, d.created_at, c.title as campaign_title,
//              CASE WHEN d.anonymous THEN 'Anonyme' ELSE u.first_name || ' ' || u.last_name END as donor_name
//       FROM donations d
//       JOIN campaigns c ON d.campaign_id = c.id
//       LEFT JOIN users u ON d.user_id = u.id
//       WHERE d.created_at >= $1
//       ORDER BY d.created_at DESC
//       LIMIT 10
//     `, [startDate]);

//     // Mock monthly trends (would need more complex query in production)
//     const monthlyTrends = [
//       { month: 'Janvier', amount: 2500, donations: 25 },
//       { month: 'Février', amount: 3200, donations: 32 },
//       { month: 'Mars', amount: 2800, donations: 28 },
//     ];

//     const analytics = {
//       totalRaised: parseFloat(totalRaisedResult.rows[0].total),
//       totalDonations: parseInt(totalDonationsResult.rows[0].count),
//       activeDonors: parseInt(activeDonorsResult.rows[0].count),
//       activeCampaigns: parseInt(activeCampaignsResult.rows[0].count),
//       growth: 12.5, // Mock growth percentage
//       donationGrowth: 8.3,
//       donorGrowth: 15.2,
//       topCampaigns: topCampaignsResult.rows,
//       recentDonations: recentDonationsResult.rows,
//       monthlyTrends,
//     };

//     res.json({
//       success: true,
//       analytics,
//     });
//   } catch (error) {
//     console.error("Erreur récupération analytics:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur récupération analytics",
//     });
//   }
// };
import pool from "../config/db.js";

export const getCampaigns = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*,
             COALESCE(SUM(d.amount), 0) as current_amount,
             COUNT(d.id) as donor_count
      FROM campaigns c
      LEFT JOIN donations d ON c.id = d.campaign_id
      WHERE c.status = 'active'
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    res.json({
      success: true,
      campaigns: result.rows,
    });
  } catch (error) {
    console.error("Erreur récupération campagnes:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};

export const createCampaign = async (req, res) => {
  try {
    const {
      title,
      description,
      target_amount,
      start_date,
      end_date,
      image_url,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO campaigns (title, description, target_amount, start_date, end_date, image_url, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'active')
      RETURNING *
    `,
      [title, description, target_amount, start_date, end_date, image_url],
    );

    res.status(201).json({
      success: true,
      campaign: result.rows[0],
    });
  } catch (error) {
    console.error("Erreur création campagne:", error);
    res.status(500).json({
      success: false,
      error: "Erreur création campagne",
    });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT c.*,
             COALESCE(SUM(d.amount), 0) as current_amount,
             COUNT(d.id) as donor_count
      FROM campaigns c
      LEFT JOIN donations d ON c.id = d.campaign_id
      WHERE c.id = $1
      GROUP BY c.id
    `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Campagne non trouvée",
      });
    }

    res.json({
      success: true,
      campaign: result.rows[0],
    });
  } catch (error) {
    console.error("Erreur récupération campagne:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = [
      "title",
      "description",
      "target_amount",
      "end_date",
      "image_url",
      "status",
    ];
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = $${paramCount}`);
        updateValues.push(updates[field]);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Aucun champ à mettre à jour",
      });
    }

    updateValues.push(id);
    const query = `
      UPDATE campaigns
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, updateValues);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Campagne non trouvée",
      });
    }

    res.json({
      success: true,
      campaign: result.rows[0],
    });
  } catch (error) {
    console.error("Erreur mise à jour campagne:", error);
    res.status(500).json({
      success: false,
      error: "Erreur mise à jour campagne",
    });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si la campagne existe
    const campaignCheck = await pool.query(
      "SELECT * FROM campaigns WHERE id = $1",
      [id]
    );

    if (campaignCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Campagne non trouvée",
      });
    }

    // Supprimer les dons associés d'abord
    await pool.query("DELETE FROM donations WHERE campaign_id = $1", [id]);

    // Puis supprimer la campagne
    await pool.query("DELETE FROM campaigns WHERE id = $1", [id]);

    res.json({
      success: true,
      message: "Campagne supprimée avec succès",
    });
  } catch (error) {
    console.error("Erreur suppression campagne:", error);
    res.status(500).json({
      success: false,
      error: "Erreur suppression campagne",
    });
  }
};

// Admin functions for campaign moderation
export const getAllCampaignsAdmin = async (req, res) => {
  try {
    const userId = req.user?.id;

    // Check if user is admin
    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (!userCheck.rows[0] || userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    const result = await pool.query(`
      SELECT c.*,
             COALESCE(SUM(d.amount), 0) as current_amount,
             COUNT(d.id) as donor_count
      FROM campaigns c
      LEFT JOIN donations d ON c.id = d.campaign_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    res.json({
      success: true,
      campaigns: result.rows,
    });
  } catch (error) {
    console.error("Erreur récupération campagnes admin:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};

export const approveCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (!userCheck.rows[0] || userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    const result = await pool.query(
      "UPDATE campaigns SET status = 'active', approved_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Campagne non trouvée",
      });
    }

    res.json({
      success: true,
      message: "Campagne approuvée",
      campaign: result.rows[0],
    });
  } catch (error) {
    console.error("Erreur approbation campagne:", error);
    res.status(500).json({
      success: false,
      error: "Erreur approbation campagne",
    });
  }
};

export const rejectCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user?.id;

    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (!userCheck.rows[0] || userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    const result = await pool.query(
      "UPDATE campaigns SET status = 'rejected', rejection_reason = $2, rejected_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [id, reason],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Campagne non trouvée",
      });
    }

    res.json({
      success: true,
      message: "Campagne rejetée",
      campaign: result.rows[0],
    });
  } catch (error) {
    console.error("Erreur rejet campagne:", error);
    res.status(500).json({
      success: false,
      error: "Erreur rejet campagne",
    });
  }
};

export const featureCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;
    const userId = req.user?.id;

    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (!userCheck.rows[0] || userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    const result = await pool.query(
      "UPDATE campaigns SET featured = $2, featured_at = CASE WHEN $2 THEN CURRENT_TIMESTAMP ELSE NULL END WHERE id = $1 RETURNING *",
      [id, featured],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Campagne non trouvée",
      });
    }

    res.json({
      success: true,
      message: featured ? "Campagne mise en avant" : "Campagne retirée des mises en avant",
      campaign: result.rows[0],
    });
  } catch (error) {
    console.error("Erreur mise en avant campagne:", error);
    res.status(500).json({
      success: false,
      error: "Erreur mise en avant campagne",
    });
  }
};

export const updateFeaturedOrder = async (req, res) => {
  try {
    const { updates } = req.body;
    const userId = req.user?.id;

    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (!userCheck.rows[0] || userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // Update each campaign's featured status and order
    for (const update of updates) {
      await pool.query(
        "UPDATE campaigns SET featured = $2, featured_order = $3 WHERE id = $1",
        [update.id, update.featured, update.featured_order],
      );
    }

    // Reset featured status for campaigns not in the updates
    if (updates.length > 0) {
      await pool.query(
        "UPDATE campaigns SET featured = false, featured_order = NULL WHERE id NOT IN (SELECT unnest($1::int[]))",
        [updates.map(u => u.id)],
      );
    }

    res.json({
      success: true,
      message: "Ordre des campagnes mises en avant mis à jour",
    });
  } catch (error) {
    console.error("Erreur mise à jour ordre:", error);
    res.status(500).json({
      success: false,
      error: "Erreur mise à jour ordre",
    });
  }
};

export const getCampaignAnalytics = async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    const userId = req.user?.id;

    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (!userCheck.rows[0] || userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

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

    // Get total raised in period
    const totalRaisedResult = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) as total FROM donations WHERE created_at >= $1",
      [startDate],
    );

    // Get total donations count
    const totalDonationsResult = await pool.query(
      "SELECT COUNT(*) as count FROM donations WHERE created_at >= $1",
      [startDate],
    );

    // Get active donors
    const activeDonorsResult = await pool.query(
      "SELECT COUNT(DISTINCT user_id) as count FROM donations WHERE created_at >= $1 AND user_id IS NOT NULL",
      [startDate],
    );

    // Get active campaigns
    const activeCampaignsResult = await pool.query(
      "SELECT COUNT(*) as count FROM campaigns WHERE status = 'active'",
    );

    // Get top performing campaigns
    const topCampaignsResult = await pool.query(`
      SELECT c.id, c.title, c.target_amount,
             COALESCE(SUM(d.amount), 0) as amount,
             COUNT(d.id) as donations
      FROM campaigns c
      LEFT JOIN donations d ON c.id = d.campaign_id AND d.created_at >= $1
      GROUP BY c.id, c.title, c.target_amount
      ORDER BY amount DESC
      LIMIT 5
    `, [startDate]);

    // Get recent donations
    const recentDonationsResult = await pool.query(`
      SELECT d.amount, d.anonymous, d.created_at, c.title as campaign_title,
             CASE WHEN d.anonymous THEN 'Anonyme' ELSE u.nom END as donor_name
      FROM donations d
      JOIN campaigns c ON d.campaign_id = c.id
      LEFT JOIN utilisateur u ON d.user_id = u.id
      WHERE d.created_at >= $1
      ORDER BY d.created_at DESC
      LIMIT 10
    `, [startDate]);

    // Mock monthly trends (would need more complex query in production)
    const monthlyTrends = [
      { month: 'Janvier', amount: 2500, donations: 25 },
      { month: 'Février', amount: 3200, donations: 32 },
      { month: 'Mars', amount: 2800, donations: 28 },
    ];

    const analytics = {
      totalRaised: parseFloat(totalRaisedResult.rows[0].total),
      totalDonations: parseInt(totalDonationsResult.rows[0].count),
      activeDonors: parseInt(activeDonorsResult.rows[0].count),
      activeCampaigns: parseInt(activeCampaignsResult.rows[0].count),
      growth: 12.5,
      donationGrowth: 8.3,
      donorGrowth: 15.2,
      topCampaigns: topCampaignsResult.rows,
      recentDonations: recentDonationsResult.rows,
      monthlyTrends,
    };

    res.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error("Erreur récupération analytics:", error);
    res.status(500).json({
      success: false,
      error: "Erreur récupération analytics",
    });
  }
};