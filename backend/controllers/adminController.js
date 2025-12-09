// // import pool from "../config/db.js";

// // /**
// //  * Get all users for admin management
// //  */
// // export const getAllUsers = async (req, res) => {
// //   try {
// //     const userId = req.user.id;

// //     // Check if user is admin
// //     const userCheck = await pool.query(
// //       "SELECT role FROM utilisateur WHERE id = $1",
// //       [userId],
// //     );

// //     if (userCheck.rows[0].role !== "admin") {
// //       return res.status(403).json({
// //         success: false,
// //         error: "Access restricted to administrators",
// //       });
// //     }

// //     const result = await pool.query(
// //       `SELECT id, nom, email, role, telephone, genre_prefere,
// //               bio, photo_profil, accepte_newsletter, created_at, updated_at
// //        FROM utilisateur
// //        ORDER BY created_at DESC`,
// //     );

// //     res.json({
// //       success: true,
// //       users: result.rows,
// //     });
// //   } catch (error) {
// //     console.error("❌ Error retrieving users:", error);
// //     res.status(500).json({
// //       success: false,
// //       error: "Server error",
// //     });
// //   }
// // };

// // /**
// //  * Promote a user to author or editor role
// //  */
// // export const promoteUser = async (req, res) => {
// //   try {
// //     const { userId } = req.params;
// //     const { newRole } = req.body;
// //     const adminId = req.user.id;

// //     // Check if admin
// //     const adminCheck = await pool.query(
// //       "SELECT role FROM utilisateur WHERE id = $1",
// //       [adminId],
// //     );

// //     if (adminCheck.rows[0].role !== "admin") {
// //       return res.status(403).json({
// //         success: false,
// //         error: "Access restricted to administrators",
// //       });
// //     }

// //     // Validate new role
// //     if (!["author", "editor"].includes(newRole)) {
// //       return res.status(400).json({
// //         success: false,
// //         error: "Invalid role. Must be 'author' or 'editor'",
// //       });
// //     }

// //     // Check if user exists
// //     const userCheck = await pool.query(
// //       "SELECT id, nom, email, role FROM utilisateur WHERE id = $1",
// //       [userId],
// //     );

// //     if (userCheck.rows.length === 0) {
// //       return res.status(404).json({
// //         success: false,
// //         error: "User not found",
// //       });
// //     }

// //     const user = userCheck.rows[0];

// //     // Update user role
// //     const result = await pool.query(
// //       `UPDATE utilisateur
// //        SET role = $1, updated_at = CURRENT_TIMESTAMP
// //        WHERE id = $2
// //        RETURNING id, nom, email, role, updated_at`,
// //       [newRole, userId],
// //     );

// //     // Create notification for the promoted user
// //     await pool.query(
// //       `INSERT INTO notifications (user_id, titre, message, type, lien)
// //        VALUES ($1, $2, $3, 'promotion', '/profile')`,
// //       [
// //         userId,
// //         "Félicitations ! Promotion obtenue",
// //         `Vous avez été promu au rôle d'${newRole === 'author' ? 'auteur' : 'éditeur'}`,
// //       ],
// //     );

// //     res.json({
// //       success: true,
// //       message: `User ${user.nom} promoted to ${newRole}`,
// //       user: result.rows[0],
// //     });
// //   } catch (error) {
// //     console.error("❌ Error promoting user:", error);
// //     res.status(500).json({
// //       success: false,
// //       error: "Server error",
// //     });
// //   }
// // };

// // /**
// //  * Block or deactivate a user account
// //  */
// // export const blockUser = async (req, res) => {
// //   try {
// //     const { userId } = req.params;
// //     const { action } = req.body; // 'block' or 'deactivate'
// //     const adminId = req.user.id;

// //     // Check if admin
// //     const adminCheck = await pool.query(
// //       "SELECT role FROM utilisateur WHERE id = $1",
// //       [adminId],
// //     );

// //     if (adminCheck.rows[0].role !== "admin") {
// //       return res.status(403).json({
// //         success: false,
// //         error: "Access restricted to administrators",
// //       });
// //     }

// //     // Check if user exists
// //     const userCheck = await pool.query(
// //       "SELECT id, nom, email, role FROM utilisateur WHERE id = $1",
// //       [userId],
// //     );

// //     if (userCheck.rows.length === 0) {
// //       return res.status(404).json({
// //         success: false,
// //         error: "User not found",
// //       });
// //     }

// //     const user = userCheck.rows[0];

// //     // Prevent blocking other admins
// //     if (user.role === "admin") {
// //       return res.status(400).json({
// //         success: false,
// //         error: "Cannot block administrator accounts",
// //       });
// //     }

// //     let updateQuery, message;
// //     if (action === "block") {
// //       // For blocking, we could add a status field or use a different approach
// //       // For now, we'll change role to 'blocked'
// //       updateQuery = `UPDATE utilisateur SET role = 'blocked', updated_at = CURRENT_TIMESTAMP WHERE id = $1`;
// //       message = `User ${user.nom} has been blocked`;
// //     } else if (action === "deactivate") {
// //       // For deactivation, we could set a flag or change role
// //       updateQuery = `UPDATE utilisateur SET role = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE id = $1`;
// //       message = `User ${user.nom} has been deactivated`;
// //     } else {
// //       return res.status(400).json({
// //         success: false,
// //         error: "Invalid action. Must be 'block' or 'deactivate'",
// //       });
// //     }

// //     await pool.query(updateQuery, [userId]);

// //     // Create notification for the affected user
// //     await pool.query(
// //       `INSERT INTO notifications (user_id, titre, message, type, lien)
// //        VALUES ($1, $2, $3, 'account', '/profile')`,
// //       [
// //         userId,
// //         "Action sur votre compte",
// //         `Votre compte a été ${action === 'block' ? 'bloqué' : 'désactivé'} par un administrateur`,
// //       ],
// //     );

// //     res.json({
// //       success: true,
// //       message: message,
// //     });
// //   } catch (error) {
// //     console.error("❌ Error blocking user:", error);
// //     res.status(500).json({
// //       success: false,
// //       error: "Server error",
// //     });
// //   }
// // };

// // /**
// //  * Get user statistics for admin dashboard
// //  */
// // export const getUserStats = async (req, res) => {
// //   try {
// //     const adminId = req.user.id;

// //     // Check if admin
// //     const adminCheck = await pool.query(
// //       "SELECT role FROM utilisateur WHERE id = $1",
// //       [adminId],
// //     );

// //     if (adminCheck.rows[0].role !== "admin") {
// //       return res.status(403).json({
// //         success: false,
// //         error: "Access restricted to administrators",
// //       });
// //     }

// //     // Get user statistics
// //     const stats = await pool.query(`
// //       SELECT
// //         COUNT(*) as total_users,
// //         COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
// //         COUNT(CASE WHEN role = 'author' THEN 1 END) as author_count,
// //         COUNT(CASE WHEN role = 'editor' THEN 1 END) as editor_count,
// //         COUNT(CASE WHEN role = 'reader' THEN 1 END) as reader_count,
// //         COUNT(CASE WHEN role IN ('blocked', 'inactive') THEN 1 END) as blocked_count
// //       FROM utilisateur
// //     `);

// //     res.json({
// //       success: true,
// //       stats: stats.rows[0],
// //     });
// //   } catch (error) {
// //     console.error("❌ Error getting user stats:", error);
// //     res.status(500).json({
// //       success: false,
// //       error: "Server error",
// //     });
// //   }
// // };

// // // User Analytics
// // export const getUserAnalytics = async (req, res) => {
// //   try {
// //     const { range = '30d' } = req.query;
// //     const adminId = req.user.id;

// //     const adminCheck = await pool.query(
// //       "SELECT role FROM utilisateur WHERE id = $1",
// //       [adminId],
// //     );

// //     if (adminCheck.rows[0].role !== "admin") {
// //       return res.status(403).json({
// //         success: false,
// //         error: "Access restricted to administrators",
// //       });
// //     }

// //     // Calculate date range
// //     const now = new Date();
// //     let startDate;
// //     switch (range) {
// //       case '7d':
// //         startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
// //         break;
// //       case '30d':
// //         startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
// //         break;
// //       case '90d':
// //         startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
// //         break;
// //       case '1y':
// //         startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
// //         break;
// //       default:
// //         startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
// //     }

// //     // Get total users
// //     const totalUsersResult = await pool.query("SELECT COUNT(*) as count FROM utilisateur");
// //     const totalUsers = parseInt(totalUsersResult.rows[0].count);

// //     // Get active users (users who logged in within the time range)
// //     const activeUsersResult = await pool.query(
// //       "SELECT COUNT(DISTINCT user_id) as count FROM user_sessions WHERE created_at >= $1",
// //       [startDate],
// //     );
// //     const activeUsers = parseInt(activeUsersResult.rows[0].count);

// //     // Get new users in the time range
// //     const newUsersResult = await pool.query(
// //       "SELECT COUNT(*) as count FROM utilisateur WHERE created_at >= $1",
// //       [startDate],
// //     );
// //     const newUsers = parseInt(newUsersResult.rows[0].count);

// //     // Get role distribution
// //     const roleDistributionResult = await pool.query(`
// //       SELECT role, COUNT(*) as count,
// //              ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) as percentage
// //       FROM utilisateur
// //       GROUP BY role
// //       ORDER BY count DESC
// //     `);

// //     // Get gender distribution
// //     const genderDistributionResult = await pool.query(`
// //       SELECT genre_prefere as genre, COUNT(*) as count,
// //              ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) as percentage
// //       FROM utilisateur
// //       GROUP BY genre_prefere
// //       ORDER BY count DESC
// //     `);

// //     // Mock data for other analytics (would need proper tracking tables)
// //     const analytics = {
// //       totalUsers,
// //       activeUsers,
// //       newUsers,
// //       activeUsersPercentage: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
// //       retentionRate: 75, // Mock data
// //       userGrowth: 12.5, // Mock data
// //       roleDistribution: roleDistributionResult.rows,
// //       genderDistribution: genderDistributionResult.rows,
// //       dailyActivity: [
// //         { date: new Date().toISOString().split('T')[0], active_users: 45, percentage: 85 },
// //         { date: new Date(Date.now() - 86400000).toISOString().split('T')[0], active_users: 38, percentage: 72 },
// //         { date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], active_users: 52, percentage: 98 },
// //       ],
// //       engagementMetrics: [
// //         { name: 'Pages lues', value: '2,450', description: 'Moyenne par utilisateur' },
// //         { name: 'Temps de lecture', value: '45 min', description: 'Session moyenne' },
// //         { name: 'Livres terminés', value: '156', description: 'Ce mois-ci' },
// //       ],
// //       topActiveUsers: [
// //         { id: 1, name: 'Marie Dubois', email: 'marie@example.com', activity_score: 95 },
// //         { id: 2, name: 'Jean Martin', email: 'jean@example.com', activity_score: 87 },
// //         { id: 3, name: 'Sophie Leroy', email: 'sophie@example.com', activity_score: 82 },
// //       ],
// //       registrationTrends: [
// //         { month: 'Janvier', registrations: 45 },
// //         { month: 'Février', registrations: 52 },
// //         { month: 'Mars', registrations: 38 },
// //         { month: 'Avril', registrations: 67 },
// //       ],
// //       preferredGenres: genderDistributionResult.rows, // Using same data for now
// //     };

// //     res.json({
// //       success: true,
// //       analytics,
// //     });
// //   } catch (error) {
// //     console.error("❌ Error getting user analytics:", error);
// //     res.status(500).json({
// //       success: false,
// //       error: "Erreur récupération analytics",
// //     });
// //   }
// // };

// // // Role Management
// // export const getRoles = async (req, res) => {
// //   try {
// //     const adminId = req.user.id;

// //     const adminCheck = await pool.query(
// //       "SELECT role FROM utilisateur WHERE id = $1",
// //       [adminId],
// //     );

// //     if (adminCheck.rows[0].role !== "admin") {
// //       return res.status(403).json({
// //         success: false,
// //         error: "Access restricted to administrators",
// //       });
// //     }

// //     // Mock roles data (would need a roles table in production)
// //     const roles = [
// //       {
// //         id: 1,
// //         name: 'Administrateur',
// //         description: 'Accès complet à toutes les fonctionnalités',
// //         permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
// //         is_active: true,
// //       },
// //       {
// //         id: 2,
// //         name: 'Éditeur',
// //         description: 'Gestion du contenu et modération',
// //         permissions: [2, 3, 4, 5, 6, 7],
// //         is_active: true,
// //       },
// //       {
// //         id: 3,
// //         name: 'Auteur',
// //         description: 'Publication et gestion de contenu personnel',
// //         permissions: [3, 4, 5],
// //         is_active: true,
// //       },
// //       {
// //         id: 4,
// //         name: 'Lecteur',
// //         description: 'Accès en lecture aux contenus',
// //         permissions: [1],
// //         is_active: true,
// //       },
// //     ];

// //     res.json({
// //       success: true,
// //       roles,
// //     });
// //   } catch (error) {
// //     console.error("❌ Error getting roles:", error);
// //     res.status(500).json({
// //       success: false,
// //       error: "Server error",
// //     });
// //   }
// // };

// // export const createRole = async (req, res) => {
// //   try {
// //     const adminId = req.user.id;

// //     const adminCheck = await pool.query(
// //       "SELECT role FROM utilisateur WHERE id = $1",
// //       [adminId],
// //     );

// //     if (adminCheck.rows[0].role !== "admin") {
// //       return res.status(403).json({
// //         success: false,
// //         error: "Access restricted to administrators",
// //       });
// //     }

// //     const { name, description, permissions, is_active } = req.body;

// //     // Mock role creation (would insert into roles table)
// //     const newRole = {
// //       id: Date.now(), // Mock ID
// //       name,
// //       description,
// //       permissions: permissions || [],
// //       is_active: is_active !== undefined ? is_active : true,
// //     };

// //     res.status(201).json({
// //       success: true,
// //       message: "Rôle créé avec succès",
// //       role: newRole,
// //     });
// //   } catch (error) {
// //     console.error("❌ Error creating role:", error);
// //     res.status(500).json({
// //       success: false,
// //       error: "Erreur création rôle",
// //     });
// //   }
// // };

// // export const updateRole = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const adminId = req.user.id;

// //     const adminCheck = await pool.query(
// //       "SELECT role FROM utilisateur WHERE id = $1",
// //       [adminId],
// //     );

// //     if (adminCheck.rows[0].role !== "admin") {
// //       return res.status(403).json({
// //         success: false,
// //         error: "Access restricted to administrators",
// //       });
// //     }

// //     const updates = req.body;

// //     // Mock role update
// //     const updatedRole = {
// //       id: parseInt(id),
// //       ...updates,
// //     };

// //     res.json({
// //       success: true,
// //       message: "Rôle modifié avec succès",
// //       role: updatedRole,
// //     });
// //   } catch (error) {
// //     console.error("❌ Error updating role:", error);
// //     res.status(500).json({
// //       success: false,
// //       error: "Erreur modification rôle",
// //     });
// //   }
// // };

// // export const deleteRole = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const adminId = req.user.id;

// //     const adminCheck = await pool.query(
// //       "SELECT role FROM utilisateur WHERE id = $1",
// //       [adminId],
// //     );

// //     if (adminCheck.rows[0].role !== "admin") {
// //       return res.status(403).json({
// //         success: false,
// //         error: "Access restricted to administrators",
// //       });
// //     }

// //     // Mock role deletion (would check for users with this role first)
// //     res.json({
// //       success: true,
// //       message: "Rôle supprimé avec succès",
// //     });
// //   } catch (error) {
// //     console.error("❌ Error deleting role:", error);
// //     res.status(500).json({
// //       success: false,
// //       error: "Erreur suppression rôle",
// //     });
// //   }
// // };

// // export const getPermissions = async (req, res) => {
// //   try {
// //     const adminId = req.user.id;

// //     const adminCheck = await pool.query(
// //       "SELECT role FROM utilisateur WHERE id = $1",
// //       [adminId],
// //     );

// //     if (adminCheck.rows[0].role !== "admin") {
// //       return res.status(403).json({
// //         success: false,
// //         error: "Access restricted to administrators",
// //       });
// //     }

// //     // Mock permissions data
// //     const permissions = [
// //       { id: 1, name: 'Lire le contenu', category: 'content' },
// //       { id: 2, name: 'Créer du contenu', category: 'content' },
// //       { id: 3, name: 'Modifier son contenu', category: 'content' },
// //       { id: 4, name: 'Publier du contenu', category: 'content' },
// //       { id: 5, name: 'Modérer le contenu', category: 'content' },
// //       { id: 6, name: 'Gérer les utilisateurs', category: 'users' },
// //       { id: 7, name: 'Gérer les rôles', category: 'users' },
// //       { id: 8, name: 'Voir les statistiques', category: 'system' },
// //       { id: 9, name: 'Gérer les événements', category: 'events' },
// //       { id: 10, name: 'Gérer le marketplace', category: 'marketplace' },
// //     ];

// //     res.json({
// //       success: true,
// //       permissions,
// //     });
// //   } catch (error) {
// //     console.error("❌ Error getting permissions:", error);
// //     res.status(500).json({
// //       success: false,
// //       error: "Server error",
// //     });
// //   }
// // };

// // export const bulkUserAction = async (req, res) => {
// //   try {
// //     const { userIds, action } = req.body;
// //     const adminId = req.user.id;

// //     const adminCheck = await pool.query(
// //       "SELECT role FROM utilisateur WHERE id = $1",
// //       [adminId],
// //     );

// //     if (adminCheck.rows[0].role !== "admin") {
// //       return res.status(403).json({
// //         success: false,
// //         error: "Access restricted to administrators",
// //       });
// //     }

// //     if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
// //       return res.status(400).json({
// //         success: false,
// //         error: "Liste d'utilisateurs requise",
// //       });
// //     }

// //     // Mock bulk action (would update multiple users)
// //     const updatedCount = userIds.length;

// //     res.json({
// //       success: true,
// //       message: `${updatedCount} utilisateurs ${action === 'block' ? 'bloqués' : 'désactivés'}`,
// //       updatedCount,
// //     });
// //   } catch (error) {
// //     console.error("❌ Error bulk user action:", error);
// //     res.status(500).json({
// //       success: false,
// //       error: "Erreur action groupée",
// //     });
// //   }
// // };
// import pool from "../config/db.js";

// /**
//  * Récupère les statistiques pour le tableau de bord admin
//  */
// export const getDashboardStats = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // Vérifier si l'utilisateur est admin
//     const userCheck = await pool.query(
//       "SELECT role FROM utilisateur WHERE id = $1",
//       [userId]
//     );

//     if (userCheck.rows[0].role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         error: "Accès réservé aux administrateurs",
//       });
//     }

//     // Statistiques des produits
//     const productsResult = await pool.query(
//       `SELECT 
//         COUNT(*) as total_products,
//         COUNT(CASE WHEN status = 'active' THEN 1 END) as active_products
//        FROM marketplace`
//     );

//     // Statistiques des commandes
//     const ordersResult = await pool.query(
//       `SELECT 
//         COUNT(*) as total_orders,
//         COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders
//        FROM orders`
//     );

//     // Statistiques des utilisateurs
//     const usersResult = await pool.query(
//       "SELECT COUNT(*) as total_users FROM utilisateur"
//     );

//     // Statistiques des dons
//     const donationsResult = await pool.query(
//       `SELECT COALESCE(SUM(amount::numeric), 0) as total_donations 
//        FROM donations`
//     );

//     // Statistiques des campagnes (à adapter selon votre table campaigns)
//     const campaignsResult = await pool.query(
//       `SELECT COUNT(*) as active_campaigns 
//        FROM campaigns 
//        WHERE status = 'active'`
//     );

//     // Livres publiés (produits marketplace de catégorie Livres)
//     const booksResult = await pool.query(
//       `SELECT COUNT(*) as published_books 
//        FROM marketplace 
//        WHERE category = 'Livres' AND status = 'active'`
//     );

//     // Défis actifs (à adapter selon votre table challenges)
//     const challengesResult = await pool.query(
//       `SELECT COUNT(*) as active_challenges 
//        FROM challenges 
//        WHERE status = 'active'`
//     );

//     const stats = {
//       products: parseInt(productsResult.rows[0].active_products),
//       orders: parseInt(ordersResult.rows[0].total_orders),
//       users: parseInt(usersResult.rows[0].total_users),
//       donations: parseFloat(donationsResult.rows[0].total_donations),
//       pendingOrders: parseInt(ordersResult.rows[0].pending_orders),
//       activeCampaigns: parseInt(campaignsResult.rows[0]?.active_campaigns || 0),
//       publishedBooks: parseInt(booksResult.rows[0].published_books),
//       activeChallenges: parseInt(challengesResult.rows[0]?.active_challenges || 0)
//     };

//     res.json({
//       success: true,
//       stats,
//     });
//   } catch (error) {
//     console.error("❌ Erreur récupération statistiques:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur",
//     });
//   }
// };

// /**
//  * Récupère l'activité récente pour le tableau de bord
//  */
// export const getRecentActivity = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // Vérifier si l'utilisateur est admin
//     const userCheck = await pool.query(
//       "SELECT role FROM utilisateur WHERE id = $1",
//       [userId]
//     );

//     if (userCheck.rows[0].role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         error: "Accès réservé aux administrateurs",
//       });
//     }

//     const activity = [];

//     // Dernières commandes
//     const recentOrders = await pool.query(`
//       SELECT o.id, o.total_amount, o.created_at, u.nom as user_name
//       FROM orders o
//       JOIN utilisateur u ON o.user_id = u.id
//       ORDER BY o.created_at DESC
//       LIMIT 3
//     `);

//     recentOrders.rows.forEach(order => {
//       activity.push({
//         type: 'order',
//         title: 'Nouvelle commande',
//         description: `Commande #${order.id} reçue de ${order.user_name}`,
//         timestamp: order.created_at
//       });
//     });

//     // Nouveaux utilisateurs
//     const recentUsers = await pool.query(`
//       SELECT nom, email, created_at
//       FROM utilisateur
//       ORDER BY created_at DESC
//       LIMIT 2
//     `);

//     recentUsers.rows.forEach(user => {
//       activity.push({
//         type: 'user',
//         title: 'Utilisateur inscrit',
//         description: `${user.nom} a rejoint la plateforme`,
//         timestamp: user.created_at
//       });
//     });

//     // Nouvelles campagnes (à adapter selon votre table campaigns)
//     const recentCampaigns = await pool.query(`
//       SELECT title, created_at
//       FROM campaigns
//       ORDER BY created_at DESC
//       LIMIT 2
//     `);

//     if (recentCampaigns.rows.length > 0) {
//       recentCampaigns.rows.forEach(campaign => {
//         activity.push({
//           type: 'campaign',
//           title: 'Campagne créée',
//           description: `Nouvelle campagne "${campaign.title}" lancée`,
//           timestamp: campaign.created_at
//         });
//       });
//     }

//     // Badges décernés (à adapter selon votre table user_badges)
//     const recentBadges = await pool.query(`
//       SELECT ub.user_id, b.name as badge_name, ub.earned_at, u.nom as user_name
//       FROM user_badges ub
//       JOIN badges b ON ub.badge_id = b.id
//       JOIN utilisateur u ON ub.user_id = u.id
//       ORDER BY ub.earned_at DESC
//       LIMIT 1
//     `);

//     if (recentBadges.rows.length > 0) {
//       recentBadges.rows.forEach(badge => {
//         activity.push({
//           type: 'badge',
//           title: 'Badge décerné',
//           description: `${badge.user_name} a gagné le badge "${badge.badge_name}"`,
//           timestamp: badge.awarded_at
//         });
//       });
//     } else {
//       // Fallback pour badges (exemple statique si table non existante)
//       activity.push({
//         type: 'badge',
//         title: 'Badge décerné',
//         description: '3 utilisateurs ont gagné des badges cette semaine',
//         timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 heures ago
//       });
//     }

//     // Trier par timestamp décroissant
//     activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

//     // Limiter à 6 activités maximum
//     const limitedActivity = activity.slice(0, 6);

//     res.json({
//       success: true,
//       activity: limitedActivity,
//     });
//   } catch (error) {
//     console.error("❌ Erreur récupération activité récente:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur",
//     });
//   }
// };
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