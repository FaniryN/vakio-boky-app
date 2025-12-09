import pool from "../config/db.js";

export const createDonation = async (req, res) => {
  try {
    const { campaign_id, amount, message, anonymous } = req.body;
    const user_id = req.user?.id;

    // Vérifier si la campagne existe
    const campaignResult = await pool.query(
      "SELECT * FROM campaigns WHERE id = $1 AND status = $2",
      [campaign_id, "active"],
    );

    if (campaignResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Campagne non trouvée ou inactive",
      });
    }

    // Créer le don
    const result = await pool.query(
      `
      INSERT INTO donations (user_id, campaign_id, amount, message, anonymous)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
      [user_id, campaign_id, amount, message, anonymous || false],
    );

    // Send thank you notification to donor (if not anonymous)
    if (!anonymous && user_id) {
      await pool.query(
        `INSERT INTO notifications (user_id, titre, message, type, lien)
         VALUES ($1, $2, $3, 'donation_thanks', $4)`,
        [
          user_id,
          "Merci pour votre don !",
          `Votre généreux don de ${amount}€ à la campagne "${campaignResult.rows[0].title}" a été enregistré. Merci de soutenir les auteurs et projets littéraires !`,
          `/campaigns/${campaign_id}`,
        ],
      );
    }

    // Mettre à jour le montant collecté de la campagne
    await pool.query(
      `
      UPDATE campaigns 
      SET current_amount = COALESCE(current_amount, 0) + $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `,
      [amount, campaign_id],
    );

    res.status(201).json({
      success: true,
      donation: result.rows[0],
      message: "Merci pour votre don !",
    });
  } catch (error) {
    console.error("Erreur création don:", error);
    res.status(500).json({
      success: false,
      error: "Erreur traitement don",
    });
  }
};

export const getUserDonations = async (req, res) => {
  try {
    const user_id = req.user?.id;

    const result = await pool.query(
      `
      SELECT d.*, c.title as campaign_title, c.image_url as campaign_image
      FROM donations d
      JOIN campaigns c ON d.campaign_id = c.id
      WHERE d.user_id = $1
      ORDER BY d.created_at DESC
    `,
      [user_id],
    );

    res.json({
      success: true,
      donations: result.rows,
    });
  } catch (error) {
    console.error("Erreur récupération dons:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};

export const getCampaignDonations = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const result = await pool.query(
      `
      SELECT d.amount, d.message, d.created_at,
             CASE 
               WHEN d.anonymous = true THEN 'Anonyme'
               ELSE u.first_name || ' ' || u.last_name
             END as donor_name
      FROM donations d
      LEFT JOIN users u ON d.user_id = u.id
      WHERE d.campaign_id = $1
      ORDER BY d.created_at DESC
      LIMIT 50
    `,
      [campaignId],
    );

    res.json({
      success: true,
      donations: result.rows,
    });
  } catch (error) {
    console.error("Erreur récupération dons campagne:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};

export const getAllDonations = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, 
             u.first_name, u.last_name, u.email,
             c.title as campaign_title
      FROM donations d
      JOIN users u ON d.user_id = u.id
      JOIN campaigns c ON d.campaign_id = c.id
      ORDER BY d.created_at DESC
    `);

    res.json({
      success: true,
      donations: result.rows,
    });
  } catch (error) {
    console.error("Erreur récupération tous les dons:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};
