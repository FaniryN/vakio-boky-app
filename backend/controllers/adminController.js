import pool from "../config/db.js";

// Récupérer les statistiques du dashboard admin
export const getDashboardStats = async (req, res) => {
  try {
    console.log("📊 Récupération des statistiques dashboard...");

    // Compter les produits actifs
    const productsResult = await pool.query(
      "SELECT COUNT(*) as count FROM marketplace WHERE status = 'active'"
    );
    
    // Compter les commandes confirmées
    const ordersResult = await pool.query(
      "SELECT COUNT(*) as count FROM orders WHERE status = 'confirmed'"
    );
    
    // Compter les utilisateurs
    const usersResult = await pool.query(
      "SELECT COUNT(*) as count FROM utilisateur"
    );
    
    // Somme des dons
    const donationsResult = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) as total FROM donations"
    );
    
    // Commandes en attente
    const pendingOrdersResult = await pool.query(
      "SELECT COUNT(*) as count FROM orders WHERE status = 'pending'"
    );
    
    // Campagnes actives
    const campaignsResult = await pool.query(
      "SELECT COUNT(*) as count FROM campaigns WHERE status = 'active'"
    );
    
    // Livres publiés (produits marketplace de catégorie Livres)
    const booksResult = await pool.query(
      "SELECT COUNT(*) as count FROM marketplace WHERE category = 'Livres' AND status = 'active'"
    );
    
    // Défis actifs (à adapter selon votre table challenges)
    const challengesResult = await pool.query(
      "SELECT COUNT(*) as count FROM challenges WHERE status = 'active'"
    );

    const stats = {
      products: parseInt(productsResult.rows[0].count),
      orders: parseInt(ordersResult.rows[0].count),
      users: parseInt(usersResult.rows[0].count),
      donations: parseFloat(donationsResult.rows[0].total),
      pendingOrders: parseInt(pendingOrdersResult.rows[0].count),
      activeCampaigns: parseInt(campaignsResult.rows[0].count),
      publishedBooks: parseInt(booksResult.rows[0].count),
      activeChallenges: parseInt(challengesResult.rows[0].count)
    };

    console.log("📊 Statistiques récupérées:", stats);

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error("❌ Erreur récupération statistiques:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la récupération des statistiques"
    });
  }
};

// Récupérer l'activité récente
export const getRecentActivity = async (req, res) => {
  try {
    console.log("📊 Récupération activité récente...");

    const activities = [];

    // Dernières commandes
    const recentOrders = await pool.query(`
      SELECT o.id, o.created_at, u.nom, o.total_amount, 'order' as type
      FROM orders o 
      JOIN utilisateur u ON o.user_id = u.id 
      ORDER BY o.created_at DESC 
      LIMIT 3
    `);

    recentOrders.rows.forEach(order => {
      activities.push({
        type: 'order',
        title: 'Nouvelle commande',
        description: `Commande #${order.id} de ${order.nom} - ${order.total_amount}€`,
        timestamp: order.created_at
      });
    });

    // Derniers utilisateurs inscrits
    const recentUsers = await pool.query(`
      SELECT nom, email, created_at, 'user' as type
      FROM utilisateur 
      ORDER BY created_at DESC 
      LIMIT 2
    `);

    recentUsers.rows.forEach(user => {
      activities.push({
        type: 'user',
        title: 'Utilisateur inscrit',
        description: `${user.nom} (${user.email}) a rejoint la plateforme`,
        timestamp: user.created_at
      });
    });

    // Dernières campagnes (si table campaigns existe)
    try {
      const recentCampaigns = await pool.query(`
        SELECT title, created_at, 'campaign' as type
        FROM campaigns 
        ORDER BY created_at DESC 
        LIMIT 2
      `);

      recentCampaigns.rows.forEach(campaign => {
        activities.push({
          type: 'campaign',
          title: 'Campagne créée',
          description: `Nouvelle campagne "${campaign.title}" lancée`,
          timestamp: campaign.created_at
        });
      });
    } catch (campaignError) {
      console.log("Table campaigns non disponible, continuation...");
    }

    // Derniers dons
    const recentDonations = await pool.query(`
      SELECT d.amount, d.created_at, c.title, 'donation' as type
      FROM donations d
      LEFT JOIN campaigns c ON d.campaign_id = c.id
      ORDER BY d.created_at DESC 
      LIMIT 2
    `);

    recentDonations.rows.forEach(donation => {
      activities.push({
        type: 'campaign',
        title: 'Don reçu',
        description: `Don de ${donation.amount}€ pour ${donation.title || 'une campagne'}`,
        timestamp: donation.created_at
      });
    });

    // Trier par date décroissante
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Limiter aux 5 activités les plus récentes
    const recentActivities = activities.slice(0, 5);

    console.log("📊 Activités récentes récupérées:", recentActivities.length);

    res.json({
      success: true,
      activity: recentActivities
    });

  } catch (error) {
    console.error("❌ Erreur récupération activité récente:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la récupération de l'activité"
    });
  }
};