// import pool from "../config/db.js";

// // GET /api/books - Liste des livres publiés (pour tous les utilisateurs)
// const getBooks = async (req, res) => {
//   try {
//     const query = `
//       SELECT l.*, u.nom as auteur_nom 
//       FROM livres l 
//       LEFT JOIN utilisateur u ON l.auteur_id = u.id 
//       WHERE l.statut = 'publié'
//       ORDER BY l.created_at DESC
//     `;
//     const result = await pool.query(query);
//     res.json(result.rows);
//   } catch (error) {
//     console.error("❌ Erreur récupération livres:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Erreur serveur lors de la récupération des livres" 
//     });
//   }
// };

// // GET /api/books/mes-livres - Mes livres (pour l'auteur connecté)
// const getMyBooks = async (req, res) => {
//   try {
//     const auteur_id = req.user.id;

//     const query = `
//       SELECT l.*, u.nom as auteur_nom 
//       FROM livres l 
//       LEFT JOIN utilisateur u ON l.auteur_id = u.id 
//       WHERE l.auteur_id = $1
//       ORDER BY l.created_at DESC
//     `;
//     const result = await pool.query(query, [auteur_id]);

//     res.json({
//       success: true,
//       books: result.rows,
//     });
//   } catch (error) {
//     console.error("❌ Erreur récupération mes livres:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Erreur serveur lors de la récupération de vos livres" 
//     });
//   }
// };

// // GET /api/books/:id - Récupérer un livre spécifique par ID
// const getBook = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const query = `
//       SELECT l.*, u.nom as auteur_nom 
//       FROM livres l 
//       LEFT JOIN utilisateur u ON l.auteur_id = u.id 
//       WHERE l.id = $1
//     `;
//     const result = await pool.query(query, [id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ 
//         success: false,
//         error: "Livre non trouvé" 
//       });
//     }

//     res.json({
//       success: true,
//       book: result.rows[0],
//     });
//   } catch (error) {
//     console.error("❌ Erreur récupération livre:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Erreur serveur lors de la récupération du livre" 
//     });
//   }
// };

// // POST /api/books - Créer un livre
// const createBook = async (req, res) => {
//   try {
//     const {
//       titre,
//       description,
//       couverture_url,
//       genre,
//       isbn,
//       statut = "brouillon",
//     } = req.body;
//     const auteur_id = req.user.id;

//     // Validation
//     if (!titre) {
//       return res.status(400).json({
//         success: false,
//         error: "Le titre est obligatoire"
//       });
//     }

//     const query = `
//       INSERT INTO livres (titre, auteur_id, description, couverture_url, genre, isbn, statut)
//       VALUES ($1, $2, $3, $4, $5, $6, $7)
//       RETURNING *
//     `;

//     const values = [
//       titre,
//       auteur_id,
//       description || null,
//       couverture_url || null,
//       genre || null,
//       isbn || null,
//       statut,
//     ];
//     const result = await pool.query(query, values);

//     // Create notifications for new published books
//     if (statut === "publié") {
//       await pool.query(
//         `INSERT INTO notifications (user_id, titre, message, type, lien)
//          SELECT id, $1, $2, 'book', $3
//          FROM utilisateur
//          WHERE id != $4 AND role IN ('lecteur', 'auteur', 'editeur')`,
//         [
//           "Nouveau livre disponible !",
//           `Découvrez "${titre}" par ${req.user.nom}`,
//           `/books/${result.rows[0].id}`,
//           auteur_id,
//         ],
//       );
//     }

//     res.status(201).json({
//       success: true,
//       message: "Livre créé avec succès",
//       book: result.rows[0],
//     });
//   } catch (error) {
//     console.error("❌ Erreur création livre:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Erreur serveur lors de la création du livre" 
//     });
//   }
// };

// // PUT /api/books/:id - Modifier un livre
// const updateBook = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { titre, description, couverture_url, genre, isbn, statut } =
//       req.body;
//     const auteur_id = req.user.id;

//     // Vérifier que l'utilisateur est l'auteur
//     const checkQuery = "SELECT auteur_id, titre as ancien_titre FROM livres WHERE id = $1";
//     const checkResult = await pool.query(checkQuery, [id]);

//     if (checkResult.rows.length === 0) {
//       return res.status(404).json({ 
//         success: false,
//         error: "Livre non trouvé" 
//       });
//     }

//     const ancienTitre = checkResult.rows[0].ancien_titre;
    
//     if (checkResult.rows[0].auteur_id !== auteur_id) {
//       return res.status(403).json({ 
//         success: false,
//         error: "Non autorisé à modifier ce livre" 
//       });
//     }

//     const query = `
//       UPDATE livres 
//       SET titre = $1, description = $2, couverture_url = $3, 
//           genre = $4, isbn = $5, statut = $6, updated_at = CURRENT_TIMESTAMP
//       WHERE id = $7
//       RETURNING *
//     `;

//     const values = [
//       titre,
//       description,
//       couverture_url,
//       genre,
//       isbn,
//       statut,
//       id,
//     ];
//     const result = await pool.query(query, values);

//     // Si le statut passe de brouillon à publié, créer une notification
//     if (ancienTitre !== titre && statut === "publié") {
//       await pool.query(
//         `INSERT INTO notifications (user_id, titre, message, type, lien)
//          SELECT id, $1, $2, 'book', $3
//          FROM utilisateur
//          WHERE id != $4 AND role IN ('lecteur', 'auteur', 'editeur')`,
//         [
//           "Nouveau livre disponible !",
//           `Découvrez "${titre}" par ${req.user.nom}`,
//           `/books/${id}`,
//           auteur_id,
//         ],
//       );
//     }

//     res.json({
//       success: true,
//       message: "Livre modifié avec succès",
//       book: result.rows[0],
//     });
//   } catch (error) {
//     console.error("❌ Erreur modification livre:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Erreur serveur lors de la modification du livre" 
//     });
//   }
// };

// // DELETE /api/books/:id - Supprimer un livre
// const deleteBook = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const auteur_id = req.user.id;

//     // Vérifier que l'utilisateur est l'auteur
//     const checkQuery = "SELECT auteur_id FROM livres WHERE id = $1";
//     const checkResult = await pool.query(checkQuery, [id]);

//     if (checkResult.rows.length === 0) {
//       return res.status(404).json({ 
//         success: false,
//         error: "Livre non trouvé" 
//       });
//     }

//     if (checkResult.rows[0].auteur_id !== auteur_id) {
//       return res.status(403).json({ 
//         success: false,
//         error: "Non autorisé à supprimer ce livre" 
//       });
//     }

//     await pool.query("DELETE FROM livres WHERE id = $1", [id]);
//     res.status(200).json({
//       success: true,
//       message: "Livre supprimé avec succès"
//     });
//   } catch (error) {
//     console.error("❌ Erreur suppression livre:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Erreur serveur lors de la suppression du livre" 
//     });
//   }
// };

// // GET /api/books/recent - Récupérer les livres récents
// // const getRecent = async (req, res) => {
// //   try {
// //     const limit = parseInt(req.query.limit) || 5;
// //     const result = await pool.query(
// //       `SELECT l.*, u.nom as auteur_nom
// //        FROM livres l 
// //        LEFT JOIN utilisateur u ON l.auteur_id = u.id
// //        WHERE l.statut = 'publié'
// //        ORDER BY l.created_at DESC
// //        LIMIT $1`,
// //       [limit]
// //     );

// //     res.json({
// //       success: true,
// //       books: result.rows,
// //     });
// //   } catch (error) {
// //     console.error('❌ Erreur récupération livres récents:', error);
// //     res.status(500).json({ 
// //       success: false,
// //       error: 'Erreur serveur' 
// //     });
// //   }
// // };
// const getRecent = async (req, res) => {
//   console.log('📚 Controller: getRecent appelé');
  
//   try {
//     // DONNÉES MOCKÉES POUR LA DÉMO
//     const recentBooks = [
//       {
//         id: 1,
//         title: "Ny Onja",
//         author: "Johary Ravaloson",
//         description: "Roman poétique sur la vie à Madagascar",
//         cover: "https://via.placeholder.com/300x400/4A5568/FFFFFF?text=Ny+Onja",
//         price: 15000,
//         rating: 4.5,
//         category: "Roman",
//         pages: 240,
//         published_year: 2020,
//         language: "Français",
//         publisher: "Éditions Malgaches",
//         created_at: new Date().toISOString(),
//         status: "published"
//       },
//       {
//         id: 2,
//         title: "Dernier Crépuscule",
//         author: "Michèle Rakotoson",
//         description: "Histoire contemporaine malgache",
//         cover: "https://via.placeholder.com/300x400/2D3748/FFFFFF?text=Crépuscule",
//         price: 12000,
//         rating: 4.2,
//         category: "Roman",
//         pages: 320,
//         published_year: 2018,
//         language: "Français",
//         publisher: "Madabook",
//         created_at: new Date().toISOString(),
//         status: "published"
//       },
//       {
//         id: 3,
//         title: "Contes de la Nuit Malgache",
//         author: "Collectif d'Auteurs",
//         description: "Recueil de contes traditionnels malgaches",
//         cover: "https://via.placeholder.com/300x400/ED8936/FFFFFF?text=Contes",
//         price: 8000,
//         rating: 4.7,
//         category: "Contes",
//         pages: 180,
//         published_year: 2021,
//         language: "Français",
//         publisher: "Éditions Traditions",
//         created_at: new Date().toISOString(),
//         status: "published"
//       }
//     ];
    
//     // RÉPONSE SUCCÈS
//     res.status(200).json({
//       success: true,
//       message: "Livres récents récupérés (données de démonstration)",
//       books: recentBooks,
//       count: recentBooks.length,
//       timestamp: new Date().toISOString()
//     });
    
//   } catch (error) {
//     console.error('❌ Erreur dans getRecent:', error);
    
//     // FALLBACK ULTIME
//     res.status(200).json({
//       success: true,
//       message: "Livres récents - Données de secours",
//       books: [
//         {
//           id: 999,
//           title: "Livre de Test",
//           author: "Auteur Test",
//           cover: "https://via.placeholder.com/300x400/718096/FFFFFF?text=Livre+Test",
//           price: 10000,
//           category: "Test"
//         }
//       ],
//       count: 1,
//       is_mock_data: true
//     });
//   }
// };

// // GET /api/admin/books - Tous les livres pour admin
// const getAllBooksAdmin = async (req, res) => {
//   try {
//     const { status = 'all', search = '', page = 1, limit = 20 } = req.query;
//     const offset = (page - 1) * limit;
    
//     let query = `
//       SELECT l.*, u.nom as auteur_nom, u.email as auteur_email
//       FROM livres l
//       LEFT JOIN utilisateur u ON l.auteur_id = u.id
//       WHERE 1=1
//     `;
//     let values = [];
//     let count = 1;

//     if (status !== 'all') {
//       if (status === 'pending') {
//         query += ` AND l.statut = 'brouillon'`;
//       } else if (status === 'published') {
//         query += ` AND l.statut = 'publié'`;
//       } else if (status === 'rejected') {
//         query += ` AND l.statut = 'rejeté'`;
//       } else if (status === 'archived') {
//         query += ` AND l.statut = 'archivé'`;
//       } else {
//         query += ` AND l.statut = $${count}`;
//         values.push(status);
//         count++;
//       }
//     }

//     if (search) {
//       query += ` AND (l.titre ILIKE $${count} OR u.nom ILIKE $${count} OR l.genre ILIKE $${count} OR u.email ILIKE $${count})`;
//       values.push(`%${search}%`);
//       count++;
//     }

//     // Get total count
//     const countQuery = `SELECT COUNT(*) as total FROM (${query}) as filtered`;
//     const countResult = await pool.query(countQuery, values);
//     const total = parseInt(countResult.rows[0].total);

//     // Get paginated results
//     query += ` ORDER BY l.created_at DESC LIMIT $${count} OFFSET $${count + 1}`;
//     values.push(limit, offset);

//     const result = await pool.query(query, values);

//     res.json({
//       success: true,
//       books: result.rows,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("❌ Erreur récupération livres admin:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur lors de la récupération des livres",
//     });
//   }
// };

// // PUT /api/admin/books/:id/approve - Approuver un livre
// const approveBook = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const result = await pool.query(
//       "UPDATE livres SET statut = 'publié', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
//       [id],
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "Livre non trouvé",
//       });
//     }

//     const book = result.rows[0];

//     // Create notification for the author
//     await pool.query(
//       `INSERT INTO notifications (user_id, titre, message, type, lien)
//        VALUES ($1, $2, $3, 'book', $4)`,
//       [
//         book.auteur_id,
//         "🎉 Livre approuvé !",
//         `Félicitations ! Votre livre "${book.titre}" a été approuvé et est maintenant publié sur Vakio Boky.`,
//         `/books/${id}`,
//       ],
//     );

//     // Notify other users about new book
//     await pool.query(
//       `INSERT INTO notifications (user_id, titre, message, type, lien)
//        SELECT id, $1, $2, 'book', $3
//        FROM utilisateur
//        WHERE id != $4 AND role IN ('lecteur', 'auteur', 'editeur')`,
//       [
//         "📚 Nouveau livre disponible",
//         `Découvrez "${book.titre}" dans notre bibliothèque !`,
//         `/books/${id}`,
//         book.auteur_id,
//       ],
//     );

//     res.json({
//       success: true,
//       message: "Livre approuvé et publié avec succès",
//       book: book,
//     });
//   } catch (error) {
//     console.error("❌ Erreur approbation livre:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur lors de l'approbation du livre",
//     });
//   }
// };

// // PUT /api/admin/books/:id/reject - Rejeter un livre
// const rejectBook = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { reason } = req.body;

//     if (!reason || reason.trim().length < 10) {
//       return res.status(400).json({
//         success: false,
//         error: "Veuillez fournir un motif de rejet détaillé (au moins 10 caractères)",
//       });
//     }

//     const result = await pool.query(
//       "UPDATE livres SET statut = 'rejeté', rejection_reason = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
//       [reason.trim(), id],
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "Livre non trouvé",
//       });
//     }

//     const book = result.rows[0];

//     // Create notification for the author
//     await pool.query(
//       `INSERT INTO notifications (user_id, titre, message, type, lien)
//        VALUES ($1, $2, $3, 'book', $4)`,
//       [
//         book.auteur_id,
//         "❌ Livre rejeté",
//         `Votre livre "${book.titre}" a été rejeté. Motif : ${reason}`,
//         `/books/${id}/edit`,
//       ],
//     );

//     res.json({
//       success: true,
//       message: "Livre rejeté avec succès",
//       book: book,
//     });
//   } catch (error) {
//     console.error("❌ Erreur rejet livre:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur lors du rejet du livre",
//     });
//   }
// };

// // PUT /api/admin/books/:id/feature - Mettre en avant un livre
// const featureBook = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { featured } = req.body;

//     const result = await pool.query(
//       "UPDATE livres SET featured = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
//       [featured, id],
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "Livre non trouvé",
//       });
//     }

//     const book = result.rows[0];

//     // Create notification for the author if featured
//     if (featured) {
//       await pool.query(
//         `INSERT INTO notifications (user_id, titre, message, type, lien)
//          VALUES ($1, $2, $3, 'book', $4)`,
//         [
//           book.auteur_id,
//           "⭐ Votre livre est en avant !",
//           `Félicitations ! Votre livre "${book.titre}" a été mis en avant sur la page d'accueil de Vakio Boky.`,
//           `/books/${id}`,
//         ],
//       );
//     }

//     res.json({
//       success: true,
//       message: featured 
//         ? "Livre mis en avant avec succès" 
//         : "Livre retiré des recommandations",
//       book: book,
//     });
//   } catch (error) {
//     console.error("❌ Erreur mise en avant livre:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur lors de la mise à jour",
//     });
//   }
// };

// // GET /api/admin/books/featured - Livres en avant
// const getFeaturedBooks = async (req, res) => {
//   try {
//     const result = await pool.query(
//       `SELECT l.*, u.nom as auteur_nom
//        FROM livres l
//        LEFT JOIN utilisateur u ON l.auteur_id = u.id
//        WHERE l.featured = true AND l.statut = 'publié'
//        ORDER BY l.created_at DESC`,
//     );

//     res.json({
//       success: true,
//       books: result.rows,
//     });
//   } catch (error) {
//     console.error("❌ Erreur récupération livres en avant:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur",
//     });
//   }
// };

// // GET /api/admin/books/analytics - Analytics des livres
// const getBookAnalytics = async (req, res) => {
//   try {
//     const { range = '30d' } = req.query;
//     let dateFilter = '';

//     // Calculate date based on range
//     switch (range) {
//       case '7d':
//         dateFilter = "CURRENT_DATE - INTERVAL '7 days'";
//         break;
//       case '30d':
//         dateFilter = "CURRENT_DATE - INTERVAL '30 days'";
//         break;
//       case '90d':
//         dateFilter = "CURRENT_DATE - INTERVAL '90 days'";
//         break;
//       case '1y':
//         dateFilter = "CURRENT_DATE - INTERVAL '1 year'";
//         break;
//       default:
//         dateFilter = "CURRENT_DATE - INTERVAL '30 days'";
//     }

//     // Get total books by status
//     const statusResult = await pool.query(`
//       SELECT statut, COUNT(*) as count
//       FROM livres
//       GROUP BY statut
//     `);

//     const statusDistribution = statusResult.rows.map(row => ({
//       status: row.statut,
//       count: parseInt(row.count),
//       percentage: 0,
//     }));

//     const totalBooks = statusDistribution.reduce((sum, item) => sum + item.count, 0);
//     statusDistribution.forEach(item => {
//       item.percentage = Math.round((item.count / totalBooks) * 100);
//     });

//     // Get books by genre
//     const genreResult = await pool.query(`
//       SELECT genre, COUNT(*) as count
//       FROM livres
//       WHERE genre IS NOT NULL AND genre != ''
//       GROUP BY genre
//       ORDER BY count DESC
//       LIMIT 10
//     `);

//     const popularGenres = genreResult.rows.map(row => ({
//       genre: row.genre,
//       count: parseInt(row.count),
//       percentage: Math.round((parseInt(row.count) / totalBooks) * 100),
//     }));

//     // Get recent books based on time range
//     const recentBooksResult = await pool.query(
//       `SELECT l.*, u.nom as auteur_nom
//        FROM livres l
//        LEFT JOIN utilisateur u ON l.auteur_id = u.id
//        WHERE l.statut = 'publié'
//          AND l.created_at >= ${dateFilter}
//        ORDER BY l.created_at DESC
//        LIMIT 5`
//     );

//     const recentBooks = recentBooksResult.rows;

//     // Get author with most books
//     const authorResult = await pool.query(`
//       SELECT u.id, u.nom, COUNT(l.id) as book_count
//       FROM utilisateur u
//       LEFT JOIN livres l ON u.id = l.auteur_id
//       WHERE l.statut = 'publié'
//       GROUP BY u.id, u.nom
//       ORDER BY book_count DESC
//       LIMIT 5
//     `);

//     const topAuthors = authorResult.rows.map(author => ({
//       id: author.id,
//       name: author.nom,
//       book_count: parseInt(author.book_count),
//     }));

//     const analytics = {
//       totalBooks,
//       statusDistribution,
//       popularGenres,
//       recentBooks,
//       topAuthors,
//     };

//     res.json({
//       success: true,
//       analytics,
//     });
//   } catch (error) {
//     console.error("❌ Erreur récupération analytics livres:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur récupération analytics",
//     });
//   }
// };

// // GET /api/admin/books/genres - Récupérer tous les genres
// const getGenres = async (req, res) => {
//   try {
//     // Récupérer les genres uniques depuis la base de données
//     const result = await pool.query(`
//       SELECT DISTINCT genre, COUNT(*) as book_count
//       FROM livres 
//       WHERE genre IS NOT NULL AND genre != ''
//       GROUP BY genre
//       ORDER BY book_count DESC
//     `);

//     const genres = result.rows.map(row => ({
//       name: row.genre,
//       book_count: parseInt(row.book_count),
//       is_active: true,
//     }));

//     res.json({
//       success: true,
//       genres,
//     });
//   } catch (error) {
//     console.error("❌ Erreur récupération genres:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur",
//     });
//   }
// };

// // POST /api/admin/books/genres - Créer un nouveau genre
// const createGenre = async (req, res) => {
//   try {
//     const { name } = req.body;

//     if (!name || name.trim().length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: "Le nom du genre est obligatoire",
//       });
//     }

//     res.status(201).json({
//       success: true,
//       message: "Pour ajouter un nouveau genre, modifiez directement le champ 'genre' des livres",
//       genre: { name: name.trim(), is_active: true },
//     });
//   } catch (error) {
//     console.error("❌ Erreur création genre:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur création genre",
//     });
//   }
// };

// // PUT /api/admin/books/genres - Mettre à jour un genre
// const updateGenre = async (req, res) => {
//   try {
//     const { oldName, newName } = req.body;

//     if (!oldName || !newName) {
//       return res.status(400).json({
//         success: false,
//         error: "Ancien et nouveau nom requis",
//       });
//     }

//     // Mettre à jour tous les livres avec l'ancien genre
//     const result = await pool.query(
//       "UPDATE livres SET genre = $1 WHERE genre = $2 RETURNING COUNT(*) as updated_count",
//       [newName.trim(), oldName.trim()]
//     );

//     const updatedCount = parseInt(result.rows[0].updated_count);

//     res.json({
//       success: true,
//       message: `Genre mis à jour. ${updatedCount} livre(s) modifié(s).`,
//       updated_count: updatedCount,
//     });
//   } catch (error) {
//     console.error("❌ Erreur modification genre:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur modification genre",
//     });
//   }
// };

// // DELETE /api/admin/books/genres - Supprimer un genre
// const deleteGenre = async (req, res) => {
//   try {
//     const { genreName } = req.body;

//     if (!genreName) {
//       return res.status(400).json({
//         success: false,
//         error: "Nom du genre requis",
//       });
//     }

//     // Mettre à NULL le genre pour tous les livres
//     const result = await pool.query(
//       "UPDATE livres SET genre = NULL WHERE genre = $1 RETURNING COUNT(*) as updated_count",
//       [genreName.trim()]
//     );

//     const updatedCount = parseInt(result.rows[0].updated_count);

//     res.json({
//       success: true,
//       message: `Genre supprimé. ${updatedCount} livre(s) modifié(s).`,
//       updated_count: updatedCount,
//     });
//   } catch (error) {
//     console.error("❌ Erreur suppression genre:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur suppression genre",
//     });
//   }
// };

// // GET /api/admin/books/collections - Récupérer toutes les collections
// const getCollections = async (req, res) => {
//   try {
//     // Dans une vraie application, vous auriez une table `collections`
//     const collections = [
//       { id: 1, name: 'Classiques Malgaches', description: 'Les grands classiques de la littérature malgache', is_active: true, book_count: 15 },
//       { id: 2, name: 'Nouveaux Talents', description: 'Découvertes littéraires récentes', is_active: true, book_count: 8 },
//       { id: 3, name: 'Poésie Contemporaine', description: 'Voix poétiques d\'aujourd\'hui', is_active: true, book_count: 12 },
//       { id: 4, name: 'Romans Historiques', description: 'Fictions basées sur des événements historiques', is_active: true, book_count: 6 },
//       { id: 5, name: 'Littérature Jeunesse', description: 'Livres pour enfants et adolescents', is_active: false, book_count: 3 },
//     ];

//     res.json({
//       success: true,
//       collections,
//     });
//   } catch (error) {
//     console.error("❌ Erreur récupération collections:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur",
//     });
//   }
// };

// // POST /api/admin/books/collections - Créer une nouvelle collection
// const createCollection = async (req, res) => {
//   try {
//     const { name, description, is_active = true } = req.body;

//     if (!name) {
//       return res.status(400).json({
//         success: false,
//         error: "Le nom de la collection est obligatoire",
//       });
//     }

//     // Mock collection creation
//     const newCollection = {
//       id: Date.now(),
//       name: name.trim(),
//       description: description || '',
//       is_active,
//       book_count: 0,
//     };

//     res.status(201).json({
//       success: true,
//       message: "Collection créée avec succès",
//       collection: newCollection,
//     });
//   } catch (error) {
//     console.error("❌ Erreur création collection:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur création collection",
//     });
//   }
// };

// // PUT /api/admin/books/collections/:id - Mettre à jour une collection
// const updateCollection = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     // Mock collection update
//     const updatedCollection = {
//       id: parseInt(id),
//       name: updates.name || 'Collection mise à jour',
//       description: updates.description || '',
//       is_active: updates.is_active !== undefined ? updates.is_active : true,
//       book_count: 0,
//     };

//     res.json({
//       success: true,
//       message: "Collection modifiée avec succès",
//       collection: updatedCollection,
//     });
//   } catch (error) {
//     console.error("❌ Erreur modification collection:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur modification collection",
//     });
//   }
// };

// // DELETE /api/admin/books/collections/:id - Supprimer une collection
// const deleteCollection = async (req, res) => {
//   try {
//     const { id } = req.params;

//     res.json({
//       success: true,
//       message: "Collection supprimée avec succès",
//     });
//   } catch (error) {
//     console.error("❌ Erreur suppression collection:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur suppression collection",
//     });
//   }
// };

// export default {
//   getBooks,
//   getRecent,
//   getMyBooks,  // Renommé de getBookById à getMyBooks
//   getBook,
//   createBook,
//   updateBook,
//   deleteBook,
//   getAllBooksAdmin,
//   approveBook,
//   rejectBook,
//   featureBook,
//   getFeaturedBooks,
//   getBookAnalytics,
//   getGenres,
//   createGenre,
//   updateGenre,
//   deleteGenre,
//   getCollections,
//   createCollection,
//   updateCollection,
//   deleteCollection,
// };
import pool from "../config/db.js";

// Fonction helper pour générer des couvertures de livre sécurisées
const generateBookCoverSvg = (title, width = 400, height = 600) => {
  const text = title || 'Livre';
  const encodedText = encodeURIComponent(text.substring(0, 20));
  const colors = ['4A5568', '2D3748', '4C51BF', '2B6CB0', '2F855A'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='%23${randomColor}'/%3E%3Crect x='20' y='20' width='${width-40}' height='${height-40}' fill='%231A202C' opacity='0.3'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial,sans-serif' font-size='28' fill='white' text-anchor='middle' dy='.3em'%3E${encodedText}%3C/text%3E%3C/svg%3E`;
};

// GET /api/books/recent - Récupérer les livres récents
export const getRecent = async (req, res) => {
  console.log('📚 Controller: getRecent appelé');
  
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const result = await pool.query(
      `SELECT l.*, u.nom as auteur_nom
       FROM livres l 
       LEFT JOIN utilisateur u ON l.auteur_id = u.id
       WHERE l.statut = 'publié'
       ORDER BY l.created_at DESC
       LIMIT $1`,
      [limit]
    );
    
    if (result.rows.length > 0) {
      console.log(`✅ ${result.rows.length} livres récupérés depuis la base de données`);
      
      // Ajouter des URLs d'image sécurisées
      const booksWithSafeImages = result.rows.map(book => ({
        ...book,
        couverture_url: book.couverture_url || generateBookCoverSvg(book.titre)
      }));
      
      return res.json({
        success: true,
        books: booksWithSafeImages,
        count: booksWithSafeImages.length,
        source: 'database'
      });
    }
    
    // FALLBACK: DONNÉES AVEC IMAGES SVG
    console.log("⚠️ Base de données vide, utilisation de données de démonstration");
    
    const recentBooks = [
      {
        id: 1,
        titre: "Ny Onja",
        auteur_nom: "Johary Ravaloson",
        description: "Roman poétique sur la vie à Madagascar",
        couverture_url: generateBookCoverSvg("Ny Onja"),
        genre: "Roman",
        prix: 15000,
        rating: 4.5,
        pages: 240,
        published_year: 2020,
        language: "Français",
        statut: "publié",
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        titre: "Dernier Crépuscule",
        auteur_nom: "Michèle Rakotoson",
        description: "Histoire contemporaine malgache",
        couverture_url: generateBookCoverSvg("Dernier Crépuscule"),
        genre: "Roman",
        prix: 12000,
        rating: 4.2,
        pages: 320,
        published_year: 2018,
        language: "Français",
        statut: "publié",
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        titre: "Contes de la Nuit Malgache",
        auteur_nom: "Collectif d'Auteurs",
        description: "Recueil de contes traditionnels malgaches",
        couverture_url: generateBookCoverSvg("Contes Malgaches"),
        genre: "Contes",
        prix: 8000,
        rating: 4.7,
        pages: 180,
        published_year: 2021,
        language: "Français",
        statut: "publié",
        created_at: new Date().toISOString()
      }
    ];
    
    res.json({
      success: true,
      message: "Livres récents récupérés (données de démonstration)",
      books: recentBooks,
      count: recentBooks.length,
      source: 'mock',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erreur dans getRecent:', error);
    
    // FALLBACK ULTIME avec images SVG
    res.status(200).json({
      success: true,
      message: "Livres récents - Données de secours",
      books: [
        {
          id: 999,
          titre: "Livre de Test",
          auteur_nom: "Auteur Test",
          couverture_url: generateBookCoverSvg("Livre Test"),
          description: "Description de test",
          genre: "Test",
          prix: 10000,
          statut: "publié"
        }
      ],
      count: 1,
      source: 'fallback'
    });
  }
};

// GET /api/books - Liste des livres publiés
export const getBooks = async (req, res) => {
  try {
    const query = `
      SELECT l.*, u.nom as auteur_nom 
      FROM livres l 
      LEFT JOIN utilisateur u ON l.auteur_id = u.id 
      WHERE l.statut = 'publié'
      ORDER BY l.created_at DESC
    `;
    const result = await pool.query(query);
    
    // Ajouter des images sécurisées
    const booksWithSafeImages = result.rows.map(book => ({
      ...book,
      couverture_url: book.couverture_url || generateBookCoverSvg(book.titre)
    }));
    
    res.json(booksWithSafeImages);
  } catch (error) {
    console.error("❌ Erreur récupération livres:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur lors de la récupération des livres" 
    });
  }
};

// GET /api/books/mes-livres - Mes livres
export const getMyBooks = async (req, res) => {
  try {
    const auteur_id = req.user.id;

    const query = `
      SELECT l.*, u.nom as auteur_nom 
      FROM livres l 
      LEFT JOIN utilisateur u ON l.auteur_id = u.id 
      WHERE l.auteur_id = $1
      ORDER BY l.created_at DESC
    `;
    const result = await pool.query(query, [auteur_id]);

    // Ajouter des images sécurisées
    const booksWithSafeImages = result.rows.map(book => ({
      ...book,
      couverture_url: book.couverture_url || generateBookCoverSvg(book.titre)
    }));

    res.json({
      success: true,
      books: booksWithSafeImages,
    });
  } catch (error) {
    console.error("❌ Erreur récupération mes livres:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur lors de la récupération de vos livres" 
    });
  }
};

// GET /api/books/:id - Récupérer un livre spécifique
export const getBook = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT l.*, u.nom as auteur_nom 
      FROM livres l 
      LEFT JOIN utilisateur u ON l.auteur_id = u.id 
      WHERE l.id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: "Livre non trouvé" 
      });
    }

    const book = result.rows[0];
    // Assurer une image sécurisée
    book.couverture_url = book.couverture_url || generateBookCoverSvg(book.titre);

    res.json({
      success: true,
      book: book,
    });
  } catch (error) {
    console.error("❌ Erreur récupération livre:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur lors de la récupération du livre" 
    });
  }
};

// POST /api/books - Créer un livre
export const createBook = async (req, res) => {
  try {
    const {
      titre,
      description,
      couverture_url,
      genre,
      isbn,
      statut = "brouillon",
    } = req.body;
    const auteur_id = req.user.id;

    if (!titre) {
      return res.status(400).json({
        success: false,
        error: "Le titre est obligatoire"
      });
    }

    // Valider l'URL de l'image
    let safeCouvertureUrl = couverture_url;
    if (couverture_url && !couverture_url.startsWith('data:image/') && !couverture_url.startsWith('http')) {
      // Si l'URL n'est pas valide, utiliser une image SVG générée
      safeCouvertureUrl = generateBookCoverSvg(titre);
    }

    const query = `
      INSERT INTO livres (titre, auteur_id, description, couverture_url, genre, isbn, statut)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      titre,
      auteur_id,
      description || null,
      safeCouvertureUrl || null,
      genre || null,
      isbn || null,
      statut,
    ];
    const result = await pool.query(query, values);

    // Create notifications for new published books
    if (statut === "publié") {
      await pool.query(
        `INSERT INTO notifications (user_id, titre, message, type, lien)
         SELECT id, $1, $2, 'book', $3
         FROM utilisateur
         WHERE id != $4 AND role IN ('lecteur', 'auteur', 'editeur')`,
        [
          "Nouveau livre disponible !",
          `Découvrez "${titre}" par ${req.user.nom}`,
          `/books/${result.rows[0].id}`,
          auteur_id,
        ],
      );
    }

    res.status(201).json({
      success: true,
      message: "Livre créé avec succès",
      book: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Erreur création livre:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur lors de la création du livre" 
    });
  }
};

// PUT /api/books/:id - Modifier un livre
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, couverture_url, genre, isbn, statut } =
      req.body;
    const auteur_id = req.user.id;

    // Vérifier que l'utilisateur est l'auteur
    const checkQuery = "SELECT auteur_id, titre as ancien_titre FROM livres WHERE id = $1";
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: "Livre non trouvé" 
      });
    }

    const ancienTitre = checkResult.rows[0].ancien_titre;
    
    if (checkResult.rows[0].auteur_id !== auteur_id) {
      return res.status(403).json({ 
        success: false,
        error: "Non autorisé à modifier ce livre" 
      });
    }

    // Valider l'URL de l'image
    let safeCouvertureUrl = couverture_url;
    if (couverture_url && !couverture_url.startsWith('data:image/') && !couverture_url.startsWith('http')) {
      safeCouvertureUrl = generateBookCoverSvg(titre);
    }

    const query = `
      UPDATE livres 
      SET titre = $1, description = $2, couverture_url = $3, 
          genre = $4, isbn = $5, statut = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `;

    const values = [
      titre,
      description,
      safeCouvertureUrl,
      genre,
      isbn,
      statut,
      id,
    ];
    const result = await pool.query(query, values);

    // Si le statut passe de brouillon à publié, créer une notification
    if (ancienTitre !== titre && statut === "publié") {
      await pool.query(
        `INSERT INTO notifications (user_id, titre, message, type, lien)
         SELECT id, $1, $2, 'book', $3
         FROM utilisateur
         WHERE id != $4 AND role IN ('lecteur', 'auteur', 'editeur')`,
        [
          "Nouveau livre disponible !",
          `Découvrez "${titre}" par ${req.user.nom}`,
          `/books/${id}`,
          auteur_id,
        ],
      );
    }

    res.json({
      success: true,
      message: "Livre modifié avec succès",
      book: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Erreur modification livre:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur lors de la modification du livre" 
    });
  }
};

// DELETE /api/books/:id - Supprimer un livre
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const auteur_id = req.user.id;

    // Vérifier que l'utilisateur est l'auteur
    const checkQuery = "SELECT auteur_id FROM livres WHERE id = $1";
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: "Livre non trouvé" 
      });
    }

    if (checkResult.rows[0].auteur_id !== auteur_id) {
      return res.status(403).json({ 
        success: false,
        error: "Non autorisé à supprimer ce livre" 
      });
    }

    await pool.query("DELETE FROM livres WHERE id = $1", [id]);
    res.status(200).json({
      success: true,
      message: "Livre supprimé avec succès"
    });
  } catch (error) {
    console.error("❌ Erreur suppression livre:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur lors de la suppression du livre" 
    });
  }
};

// GET /api/admin/books/all - Tous les livres pour admin (FONCTION MANQUANTE AJOUTÉE)
export const getAllBooksAdmin = async (req, res) => {
  try {
    const { status = 'all', search = '', page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT l.*, u.nom as auteur_nom, u.email as auteur_email
      FROM livres l
      LEFT JOIN utilisateur u ON l.auteur_id = u.id
      WHERE 1=1
    `;
    let values = [];
    let count = 1;

    if (status !== 'all') {
      if (status === 'pending') {
        query += ` AND l.statut = 'brouillon'`;
      } else if (status === 'published') {
        query += ` AND l.statut = 'publié'`;
      } else if (status === 'rejected') {
        query += ` AND l.statut = 'rejeté'`;
      } else if (status === 'archived') {
        query += ` AND l.statut = 'archivé'`;
      } else {
        query += ` AND l.statut = $${count}`;
        values.push(status);
        count++;
      }
    }

    if (search) {
      query += ` AND (l.titre ILIKE $${count} OR u.nom ILIKE $${count} OR l.genre ILIKE $${count} OR u.email ILIKE $${count})`;
      values.push(`%${search}%`);
      count++;
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM (${query}) as filtered`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total);

    // Get paginated results
    query += ` ORDER BY l.created_at DESC LIMIT $${count} OFFSET $${count + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    // Ajouter des images sécurisées
    const booksWithSafeImages = result.rows.map(book => ({
      ...book,
      couverture_url: book.couverture_url || generateBookCoverSvg(book.titre)
    }));

    res.json({
      success: true,
      books: booksWithSafeImages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Erreur récupération livres admin:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la récupération des livres",
    });
  }
};

// PUT /api/admin/books/:id/approve - Approuver un livre
export const approveBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      "UPDATE livres SET statut = 'publié', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Livre non trouvé",
      });
    }

    const book = result.rows[0];

    // Create notification for the author
    await pool.query(
      `INSERT INTO notifications (user_id, titre, message, type, lien)
       VALUES ($1, $2, $3, 'book', $4)`,
      [
        book.auteur_id,
        "🎉 Livre approuvé !",
        `Félicitations ! Votre livre "${book.titre}" a été approuvé et est maintenant publié sur Vakio Boky.`,
        `/books/${id}`,
      ],
    );

    // Notify other users about new book
    await pool.query(
      `INSERT INTO notifications (user_id, titre, message, type, lien)
       SELECT id, $1, $2, 'book', $3
       FROM utilisateur
       WHERE id != $4 AND role IN ('lecteur', 'auteur', 'editeur')`,
      [
        "📚 Nouveau livre disponible",
        `Découvrez "${book.titre}" dans notre bibliothèque !`,
        `/books/${id}`,
        book.auteur_id,
      ],
    );

    res.json({
      success: true,
      message: "Livre approuvé et publié avec succès",
      book: book,
    });
  } catch (error) {
    console.error("❌ Erreur approbation livre:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de l'approbation du livre",
    });
  }
};

// PUT /api/admin/books/:id/reject - Rejeter un livre
export const rejectBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: "Veuillez fournir un motif de rejet détaillé (au moins 10 caractères)",
      });
    }

    const result = await pool.query(
      "UPDATE livres SET statut = 'rejeté', rejection_reason = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [reason.trim(), id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Livre non trouvé",
      });
    }

    const book = result.rows[0];

    // Create notification for the author
    await pool.query(
      `INSERT INTO notifications (user_id, titre, message, type, lien)
       VALUES ($1, $2, $3, 'book', $4)`,
      [
        book.auteur_id,
        "❌ Livre rejeté",
        `Votre livre "${book.titre}" a été rejeté. Motif : ${reason}`,
        `/books/${id}/edit`,
      ],
    );

    res.json({
      success: true,
      message: "Livre rejeté avec succès",
      book: book,
    });
  } catch (error) {
    console.error("❌ Erreur rejet livre:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors du rejet du livre",
    });
  }
};

// PUT /api/admin/books/:id/feature - Mettre en avant un livre
export const featureBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    const result = await pool.query(
      "UPDATE livres SET featured = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [featured, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Livre non trouvé",
      });
    }

    const book = result.rows[0];

    // Create notification for the author if featured
    if (featured) {
      await pool.query(
        `INSERT INTO notifications (user_id, titre, message, type, lien)
         VALUES ($1, $2, $3, 'book', $4)`,
        [
          book.auteur_id,
          "⭐ Votre livre est en avant !",
          `Félicitations ! Votre livre "${book.titre}" a été mis en avant sur la page d'accueil de Vakio Boky.`,
          `/books/${id}`,
        ],
      );
    }

    res.json({
      success: true,
      message: featured 
        ? "Livre mis en avant avec succès" 
        : "Livre retiré des recommandations",
      book: book,
    });
  } catch (error) {
    console.error("❌ Erreur mise en avant livre:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la mise à jour",
    });
  }
};

// GET /api/admin/books/featured - Livres en avant
export const getFeaturedBooks = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT l.*, u.nom as auteur_nom
       FROM livres l
       LEFT JOIN utilisateur u ON l.auteur_id = u.id
       WHERE l.featured = true AND l.statut = 'publié'
       ORDER BY l.created_at DESC`,
    );

    // Ajouter des images sécurisées
    const booksWithSafeImages = result.rows.map(book => ({
      ...book,
      couverture_url: book.couverture_url || generateBookCoverSvg(book.titre)
    }));

    res.json({
      success: true,
      books: booksWithSafeImages,
    });
  } catch (error) {
    console.error("❌ Erreur récupération livres en avant:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};

// GET /api/admin/books/analytics - Analytics des livres
export const getBookAnalytics = async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    let dateFilter = '';

    // Calculate date based on range
    switch (range) {
      case '7d':
        dateFilter = "CURRENT_DATE - INTERVAL '7 days'";
        break;
      case '30d':
        dateFilter = "CURRENT_DATE - INTERVAL '30 days'";
        break;
      case '90d':
        dateFilter = "CURRENT_DATE - INTERVAL '90 days'";
        break;
      case '1y':
        dateFilter = "CURRENT_DATE - INTERVAL '1 year'";
        break;
      default:
        dateFilter = "CURRENT_DATE - INTERVAL '30 days'";
    }

    // Get total books by status
    const statusResult = await pool.query(`
      SELECT statut, COUNT(*) as count
      FROM livres
      GROUP BY statut
    `);

    const statusDistribution = statusResult.rows.map(row => ({
      status: row.statut,
      count: parseInt(row.count),
      percentage: 0,
    }));

    const totalBooks = statusDistribution.reduce((sum, item) => sum + item.count, 0);
    statusDistribution.forEach(item => {
      item.percentage = Math.round((item.count / totalBooks) * 100);
    });

    // Get books by genre
    const genreResult = await pool.query(`
      SELECT genre, COUNT(*) as count
      FROM livres
      WHERE genre IS NOT NULL AND genre != ''
      GROUP BY genre
      ORDER BY count DESC
      LIMIT 10
    `);

    const popularGenres = genreResult.rows.map(row => ({
      genre: row.genre,
      count: parseInt(row.count),
      percentage: Math.round((parseInt(row.count) / totalBooks) * 100),
    }));

    // Get recent books based on time range
    const recentBooksResult = await pool.query(
      `SELECT l.*, u.nom as auteur_nom
       FROM livres l
       LEFT JOIN utilisateur u ON l.auteur_id = u.id
       WHERE l.statut = 'publié'
         AND l.created_at >= ${dateFilter}
       ORDER BY l.created_at DESC
       LIMIT 5`
    );

    const recentBooks = recentBooksResult.rows.map(book => ({
      ...book,
      couverture_url: book.couverture_url || generateBookCoverSvg(book.titre)
    }));

    // Get author with most books
    const authorResult = await pool.query(`
      SELECT u.id, u.nom, COUNT(l.id) as book_count
      FROM utilisateur u
      LEFT JOIN livres l ON u.id = l.auteur_id
      WHERE l.statut = 'publié'
      GROUP BY u.id, u.nom
      ORDER BY book_count DESC
      LIMIT 5
    `);

    const topAuthors = authorResult.rows.map(author => ({
      id: author.id,
      name: author.nom,
      book_count: parseInt(author.book_count),
    }));

    const analytics = {
      totalBooks,
      statusDistribution,
      popularGenres,
      recentBooks,
      topAuthors,
    };

    res.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error("❌ Erreur récupération analytics livres:", error);
    res.status(500).json({
      success: false,
      error: "Erreur récupération analytics",
    });
  }
};

// GET /api/admin/books/genres - Récupérer tous les genres
export const getGenres = async (req, res) => {
  try {
    // Récupérer les genres uniques depuis la base de données
    const result = await pool.query(`
      SELECT DISTINCT genre, COUNT(*) as book_count
      FROM livres 
      WHERE genre IS NOT NULL AND genre != ''
      GROUP BY genre
      ORDER BY book_count DESC
    `);

    const genres = result.rows.map(row => ({
      name: row.genre,
      book_count: parseInt(row.book_count),
      is_active: true,
    }));

    res.json({
      success: true,
      genres,
    });
  } catch (error) {
    console.error("❌ Erreur récupération genres:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};

// POST /api/admin/books/genres - Créer un nouveau genre
export const createGenre = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Le nom du genre est obligatoire",
      });
    }

    res.status(201).json({
      success: true,
      message: "Pour ajouter un nouveau genre, modifiez directement le champ 'genre' des livres",
      genre: { name: name.trim(), is_active: true },
    });
  } catch (error) {
    console.error("❌ Erreur création genre:", error);
    res.status(500).json({
      success: false,
      error: "Erreur création genre",
    });
  }
};

// PUT /api/admin/books/genres - Mettre à jour un genre
export const updateGenre = async (req, res) => {
  try {
    const { oldName, newName } = req.body;

    if (!oldName || !newName) {
      return res.status(400).json({
        success: false,
        error: "Ancien et nouveau nom requis",
      });
    }

    // Mettre à jour tous les livres avec l'ancien genre
    const result = await pool.query(
      "UPDATE livres SET genre = $1 WHERE genre = $2 RETURNING COUNT(*) as updated_count",
      [newName.trim(), oldName.trim()]
    );

    const updatedCount = parseInt(result.rows[0].updated_count);

    res.json({
      success: true,
      message: `Genre mis à jour. ${updatedCount} livre(s) modifié(s).`,
      updated_count: updatedCount,
    });
  } catch (error) {
    console.error("❌ Erreur modification genre:", error);
    res.status(500).json({
      success: false,
      error: "Erreur modification genre",
    });
  }
};

// DELETE /api/admin/books/genres - Supprimer un genre
export const deleteGenre = async (req, res) => {
  try {
    const { genreName } = req.body;

    if (!genreName) {
      return res.status(400).json({
        success: false,
        error: "Nom du genre requis",
      });
    }

    // Mettre à NULL le genre pour tous les livres
    const result = await pool.query(
      "UPDATE livres SET genre = NULL WHERE genre = $1 RETURNING COUNT(*) as updated_count",
      [genreName.trim()]
    );

    const updatedCount = parseInt(result.rows[0].updated_count);

    res.json({
      success: true,
      message: `Genre supprimé. ${updatedCount} livre(s) modifié(s).`,
      updated_count: updatedCount,
    });
  } catch (error) {
    console.error("❌ Erreur suppression genre:", error);
    res.status(500).json({
      success: false,
      error: "Erreur suppression genre",
    });
  }
};

// GET /api/admin/books/collections - Récupérer toutes les collections
export const getCollections = async (req, res) => {
  try {
    // Dans une vraie application, vous auriez une table `collections`
    const collections = [
      { id: 1, name: 'Classiques Malgaches', description: 'Les grands classiques de la littérature malgache', is_active: true, book_count: 15 },
      { id: 2, name: 'Nouveaux Talents', description: 'Découvertes littéraires récentes', is_active: true, book_count: 8 },
      { id: 3, name: 'Poésie Contemporaine', description: 'Voix poétiques d\'aujourd\'hui', is_active: true, book_count: 12 },
      { id: 4, name: 'Romans Historiques', description: 'Fictions basées sur des événements historiques', is_active: true, book_count: 6 },
      { id: 5, name: 'Littérature Jeunesse', description: 'Livres pour enfants et adolescents', is_active: false, book_count: 3 },
    ];

    res.json({
      success: true,
      collections,
    });
  } catch (error) {
    console.error("❌ Erreur récupération collections:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};

// POST /api/admin/books/collections - Créer une nouvelle collection
export const createCollection = async (req, res) => {
  try {
    const { name, description, is_active = true } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Le nom de la collection est obligatoire",
      });
    }

    // Mock collection creation
    const newCollection = {
      id: Date.now(),
      name: name.trim(),
      description: description || '',
      is_active,
      book_count: 0,
    };

    res.status(201).json({
      success: true,
      message: "Collection créée avec succès",
      collection: newCollection,
    });
  } catch (error) {
    console.error("❌ Erreur création collection:", error);
    res.status(500).json({
      success: false,
      error: "Erreur création collection",
    });
  }
};

// PUT /api/admin/books/collections/:id - Mettre à jour une collection
export const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Mock collection update
    const updatedCollection = {
      id: parseInt(id),
      name: updates.name || 'Collection mise à jour',
      description: updates.description || '',
      is_active: updates.is_active !== undefined ? updates.is_active : true,
      book_count: 0,
    };

    res.json({
      success: true,
      message: "Collection modifiée avec succès",
      collection: updatedCollection,
    });
  } catch (error) {
    console.error("❌ Erreur modification collection:", error);
    res.status(500).json({
      success: false,
      error: "Erreur modification collection",
    });
  }
};

// DELETE /api/admin/books/collections/:id - Supprimer une collection
export const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;

    res.json({
      success: true,
      message: "Collection supprimée avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur suppression collection:", error);
    res.status(500).json({
      success: false,
      error: "Erreur suppression collection",
    });
  }
};

// Export par défaut (pour compatibilité)
const bookController = {
  getBooks,
  getRecent,
  getMyBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getAllBooksAdmin,  // AJOUTÉE
  approveBook,
  rejectBook,
  featureBook,
  };