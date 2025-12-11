// // // import pool from "../config/db.js";

// // // export const getAllLandingData = async (req, res) => {
// // //   try {
// // //     console.log("🟡 Début de getAllLandingData - Version améliorée");
    
// // //     const [testimonialsResult, eventsResult, authorsResult, statsResult] = await Promise.all([
// // //       // Témoignages - Utilise les commentaires récents comme témoignages
// // //       pool.query(`
// // //         SELECT 
// // //           c.id,
// // //           c.contenu as content,
// // //           u.nom as author,
// // //           'Membre' as role,
// // //           5 as rating,
// // //           c.created_at
// // //         FROM comments c
// // //         LEFT JOIN utilisateur u ON c.user_id = u.id
// // //         WHERE c.post_id IS NOT NULL
// // //         ORDER BY c.created_at DESC 
// // //         LIMIT 6
// // //       `).catch(err => {
// // //         console.error("❌ Erreur testimonials:", err);
// // //         return { rows: [] };
// // //       }),
      
// // //       // Événements - Récupère les événements récents
// // //       pool.query(`
// // //         SELECT 
// // //           id, title, description, event_date, location, 
// // //           max_participants, image_url, price, status,
// // //           created_at
// // //         FROM events 
// // //         WHERE event_date >= $1 AND status = 'active'
// // //         ORDER BY event_date ASC 
// // //         LIMIT 6
// // //       `, [new Date()]).catch(err => {
// // //         console.error("❌ Erreur events:", err);
// // //         return { rows: [] };
// // //       }),
      
// // //       // NOUVELLE REQUÊTE AUTEURS - Plus robuste
// // //       pool.query(`
// // //         -- Méthode 1: Utilisateurs promus
// // //         SELECT 
// // //           id, nom, bio, author_genre, 
// // //           published_works, photo_profil as profile_image, role,
// // //           is_promoted, promoted_at,
// // //           'promoted' as source
// // //         FROM utilisateur 
// // //         WHERE is_promoted = true 
// // //           AND role IN ('auteur', 'editeur', 'admin', 'author', 'writer')
// // //         ORDER BY promoted_at DESC NULLS LAST, created_at DESC
// // //         LIMIT 4
        
// // //         UNION
        
// // //         -- Méthode 2: Utilisateurs avec des livres publiés
// // //         SELECT DISTINCT
// // //           u.id, u.nom, u.bio, u.author_genre, 
// // //           COALESCE(l.book_count, 0) as published_works, 
// // //           u.photo_profil as profile_image, u.role,
// // //           u.is_promoted, u.promoted_at,
// // //           'has_books' as source
// // //         FROM utilisateur u
// // //         LEFT JOIN (
// // //           SELECT user_id, COUNT(*) as book_count 
// // //           FROM livres 
// // //           WHERE statut = 'publié'
// // //           GROUP BY user_id
// // //         ) l ON u.id = l.user_id
// // //         WHERE u.role IN ('auteur', 'author', 'writer', 'editeur')
// // //           AND (l.book_count > 0 OR u.is_promoted = false)
// // //           AND u.id NOT IN (
// // //             SELECT id FROM utilisateur WHERE is_promoted = true
// // //           )
// // //         ORDER BY published_works DESC
// // //         LIMIT 4
        
// // //         UNION
        
// // //         -- Méthode 3: Utilisateurs récents avec rôle auteur
// // //         SELECT 
// // //           id, nom, bio, author_genre, 
// // //           0 as published_works, 
// // //           photo_profil as profile_image, role,
// // //           is_promoted, promoted_at,
// // //           'recent_author' as source
// // //         FROM utilisateur 
// // //         WHERE role IN ('auteur', 'author', 'writer')
// // //           AND created_at >= NOW() - INTERVAL '30 days'
// // //         ORDER BY created_at DESC
// // //         LIMIT 2
// // //       `).catch(err => {
// // //         console.error("❌ Erreur authors:", err);
// // //         // Fallback simple
// // //         return pool.query(`
// // //           SELECT 
// // //             id, nom, bio, author_genre, 
// // //             1 as published_works, 
// // //             photo_profil as profile_image, role,
// // //             false as is_promoted, NULL as promoted_at,
// // //             'fallback' as source
// // //           FROM utilisateur 
// // //           WHERE role IN ('auteur', 'author', 'writer', 'editeur', 'admin')
// // //           LIMIT 8
// // //         `).catch(fallbackErr => {
// // //           console.error("❌ Erreur fallback authors:", fallbackErr);
// // //           return { rows: [] };
// // //         });
// // //       }),
      
// // //       // Statistiques
// // //       (async () => {
// // //         try {
// // //           const [booksResult, usersResult, authorsResult, eventsResult] = await Promise.all([
// // //             pool.query("SELECT COUNT(*) FROM livres WHERE statut = 'publié'"),
// // //             pool.query("SELECT COUNT(*) FROM utilisateur"),
// // //             pool.query(`
// // //               SELECT COUNT(DISTINCT u.id) 
// // //               FROM utilisateur u
// // //               LEFT JOIN livres l ON u.id = l.user_id
// // //               WHERE u.role IN ('auteur', 'author', 'writer', 'editeur')
// // //                 AND (l.id IS NOT NULL OR u.is_promoted = true)
// // //             `),
// // //             pool.query("SELECT COUNT(*) FROM events WHERE event_date >= $1 AND status = 'active'", [new Date()])
// // //           ]);

// // //           return {
// // //             total_books: parseInt(booksResult.rows[0]?.count || 0),
// // //             total_users: parseInt(usersResult.rows[0]?.count || 0),
// // //             total_authors: parseInt(authorsResult.rows[0]?.count || 0),
// // //             upcoming_events: parseInt(eventsResult.rows[0]?.count || 0)
// // //           };
// // //         } catch (err) {
// // //           console.error("❌ Erreur stats:", err);
// // //           return {
// // //             total_books: 0,
// // //             total_users: 0, 
// // //             total_authors: 0,
// // //             upcoming_events: 0
// // //           };
// // //         }
// // //       })()
// // //     ]);

// // //     console.log("✅ Données récupérées:", {
// // //       testimonials: testimonialsResult.rows.length,
// // //       events: eventsResult.rows.length, 
// // //       authors: authorsResult.rows.length,
// // //       sources: [...new Set(authorsResult.rows.map(a => a.source))]
// // //     });

// // //     // Formater les auteurs de manière cohérente
// // //     const authors = authorsResult.rows.map(author => ({
// // //       id: author.id,
// // //       name: author.nom || 'Auteur inconnu',
// // //       bio: author.bio || `Auteur ${author.author_genre || 'littéraire'}`,
// // //       author_genre: author.author_genre || 'Auteur',
// // //       published_works: parseInt(author.published_works) || 1,
// // //       image: author.profile_image || '/assets/images/avatar-placeholder.jpg',
// // //       role: author.role || 'Auteur',
// // //       source: author.source // Pour débogage
// // //     }));

// // //     // Assurer qu'on a toujours des auteurs (fallback si vide)
// // //     let finalAuthors = authors;
// // //     if (authors.length === 0) {
// // //       console.log("⚠️ Aucun auteur trouvé, création de données de fallback");
// // //       finalAuthors = [
// // //         {
// // //           id: 1,
// // //           name: "Auteur Malagasy",
// // //           bio: "Auteur passionné par la littérature malgache",
// // //           author_genre: "Littérature",
// // //           published_works: 3,
// // //           // image: "/assets/images/avatar-placeholder.jpg",
// // //           // image: "https://via.placeholder.com/100/4A5568/FFFFFF?text=Auteur",
// // //       image: "https://via.placeholder.com/100/4A5568/FFFFFF?text=" + encodeURIComponent(author.name?.charAt(0) || "A"),    
// // //           role: "Auteur",
// // //           source: "fallback"
// // //         },
// // //         {
// // //           id: 2,
// // //           name: "Écrivain Local",
// // //           bio: "Promouvoir la culture malgache à travers l'écriture",
// // //           author_genre: "Roman",
// // //           published_works: 2,
// // //           // image: "/assets/images/avatar-placeholder.jpg",
// // //           // image: "https://via.placeholder.com/100/4A5568/FFFFFF?text=Auteur",
// // //           image: "https://via.placeholder.com/100/4A5568/FFFFFF?text=" + encodeURIComponent(author.name?.charAt(0) || "A"),
// // //           role: "Auteur",
// // //           source: "fallback"
// // //         }
// // //       ];
// // //     }

// // //     res.json({
// // //       success: true,
// // //       data: {
// // //         testimonials: testimonialsResult.rows,
// // //         events: eventsResult.rows,
// // //         authors: finalAuthors,
// // //         stats: statsResult
// // //       }
// // //     });

// // //   } catch (error) {
// // //     console.error("🔥 Erreur critique dans getAllLandingData:", error);
// // //     res.status(500).json({ 
// // //       success: false,
// // //       message: 'Erreur serveur: ' + error.message,
// // //       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
// // //     });
// // //   }
// // // };

// // // // NOUVEAU ENDPOINT : Récupération spécifique des auteurs
// // // export const getPromotedAuthors = async (req, res) => {
// // //   try {
// // //     console.log("👥 Appel de getPromotedAuthors");
    
// // //     const result = await pool.query(`
// // //       SELECT 
// // //         u.id, 
// // //         u.nom as name, 
// // //         u.bio, 
// // //         u.author_genre, 
// // //         COALESCE(l.book_count, 0) as published_works,
// // //         u.photo_profil as image,
// // //         u.role,
// // //         CASE 
// // //           WHEN u.is_promoted = true THEN 'promoted'
// // //           WHEN l.book_count > 0 THEN 'has_books'
// // //           ELSE 'author_role'
// // //         END as status
// // //       FROM utilisateur u
// // //       LEFT JOIN (
// // //         SELECT user_id, COUNT(*) as book_count 
// // //         FROM livres 
// // //         WHERE statut = 'publié'
// // //         GROUP BY user_id
// // //       ) l ON u.id = l.user_id
// // //       WHERE u.role IN ('auteur', 'author', 'writer', 'editeur', 'admin')
// // //         AND (u.is_promoted = true OR l.book_count > 0 OR u.author_genre IS NOT NULL)
// // //       ORDER BY 
// // //         CASE 
// // //           WHEN u.is_promoted = true THEN 1
// // //           WHEN l.book_count > 0 THEN 2
// // //           ELSE 3
// // //         END,
// // //         l.book_count DESC NULLS LAST,
// // //         u.created_at DESC
// // //       LIMIT 12
// // //     `);

// // //     const authors = result.rows.map(author => ({
// // //       id: author.id,
// // //       name: author.name || 'Auteur inconnu',
// // //       bio: author.bio || `Auteur spécialisé en ${author.author_genre || 'littérature'}`,
// // //       author_genre: author.author_genre || 'Auteur',
// // //       published_works: parseInt(author.published_works) || 1,
// // //       image: author.image || '/assets/images/avatar-placeholder.jpg',
// // //       role: author.role || 'Auteur',
// // //       status: author.status
// // //     }));

// // //     console.log(`✅ ${authors.length} auteurs récupérés via getPromotedAuthors`);

// // //     res.json({
// // //       success: true,
// // //       data: authors,
// // //       count: authors.length
// // //     });

// // //   } catch (error) {
// // //     console.error('❌ Error fetching promoted authors:', error);
// // //     res.status(500).json({ 
// // //       success: false,
// // //       message: 'Erreur lors de la récupération des auteurs promus',
// // //       error: error.message 
// // //     });
// // //   }
// // // };

// // // // NOUVEAU ENDPOINT : Récupération des livres récents
// // // export const getRecentBooks = async (req, res) => {
// // //   try {
// // //     console.log("📚 Appel de getRecentBooks");
    
// // //     const limit = parseInt(req.query.limit) || 6;
    
// // //     const result = await pool.query(`
// // //       SELECT 
// // //         l.id,
// // //         l.titre,
// // //         l.description,
// // //         l.couverture_url,
// // //         l.genre,
// // //         l.statut,
// // //         l.created_at,
// // //         u.nom as auteur,
// // //         u.photo_profil as auteur_image
// // //       FROM livres l
// // //       LEFT JOIN utilisateur u ON l.user_id = u.id
// // //       WHERE l.statut = 'publié'
// // //       ORDER BY l.created_at DESC
// // //       LIMIT $1
// // //     `, [limit]);

// // //     const books = result.rows.map(book => ({
// // //       id: book.id,
// // //       titre: book.titre || 'Titre non disponible',
// // //       description: book.description || 'Aucune description disponible',
// // //       couverture_url: book.couverture_url || '/assets/images/book-placeholder.jpg',
// // //       genre: book.genre || 'Non spécifié',
// // //       auteur: book.auteur || 'Auteur inconnu',
// // //       auteur_image: book.auteur_image,
// // //       statut: book.statut,
// // //       created_at: book.created_at
// // //     }));

// // //     console.log(`✅ ${books.length} livres récupérés`);

// // //     res.json({
// // //       success: true,
// // //       data: books,
// // //       count: books.length
// // //     });

// // //   } catch (error) {
// // //     console.error('❌ Error fetching recent books:', error);
// // //     res.status(500).json({ 
// // //       success: false,
// // //       message: 'Erreur lors de la récupération des livres récents',
// // //       error: error.message 
// // //     });
// // //   }
// // // };

// // // // Anciennes fonctions (conservées pour compatibilité)
// // // export const getFeaturedTestimonials = async (req, res) => {
// // //   try {
// // //     const result = await pool.query(`
// // //       SELECT 
// // //         c.id,
// // //         c.contenu as content,
// // //         u.nom as author,
// // //         'Membre Vakio Boky' as role,
// // //         5 as rating,
// // //         c.created_at
// // //       FROM comments c
// // //       LEFT JOIN utilisateur u ON c.user_id = u.id
// // //       WHERE c.post_id IS NOT NULL
// // //       ORDER BY c.created_at DESC 
// // //       LIMIT 6
// // //     `);

// // //     res.json({
// // //       success: true,
// // //       data: result.rows,
// // //       count: result.rowCount
// // //     });
// // //   } catch (error) {
// // //     console.error('Error fetching testimonials:', error);
// // //     res.status(500).json({ 
// // //       success: false,
// // //       message: 'Erreur lors de la récupération des témoignages',
// // //       error: error.message 
// // //     });
// // //   }
// // // };

// // // export const getUpcomingEvents = async (req, res) => {
// // //   try {
// // //     const result = await pool.query(
// // //       `SELECT 
// // //         id, title, description, event_date, location, 
// // //         max_participants, image_url, price, status,
// // //         created_at
// // //        FROM events 
// // //        WHERE event_date >= $1 AND status = 'active'
// // //        ORDER BY event_date ASC 
// // //        LIMIT 6`,
// // //       [new Date()]
// // //     );

// // //     res.json({
// // //       success: true,
// // //       data: result.rows,
// // //       count: result.rowCount
// // //     });
// // //   } catch (error) {
// // //     console.error('Error fetching events:', error);
// // //     res.status(500).json({ 
// // //       success: false,
// // //       message: 'Erreur lors de la récupération des événements',
// // //       error: error.message 
// // //     });
// // //   }
// // // };

// // // export const getLandingStats = async (req, res) => {
// // //   try {
// // //     const [
// // //       booksResult,
// // //       usersResult,
// // //       authorsResult,
// // //       eventsResult
// // //     ] = await Promise.all([
// // //       pool.query("SELECT COUNT(*) FROM livres WHERE statut = 'publié'"),
// // //       pool.query("SELECT COUNT(*) FROM utilisateur"),
// // //       pool.query(`
// // //         SELECT COUNT(DISTINCT u.id) 
// // //         FROM utilisateur u
// // //         LEFT JOIN livres l ON u.id = l.user_id
// // //         WHERE u.role IN ('auteur', 'author', 'writer', 'editeur')
// // //           AND (l.id IS NOT NULL OR u.is_promoted = true)
// // //       `),
// // //       pool.query("SELECT COUNT(*) FROM events WHERE event_date >= $1 AND status = 'active'", [new Date()])
// // //     ]);

// // //     const stats = {
// // //       total_books: parseInt(booksResult.rows[0]?.count || 0),
// // //       total_users: parseInt(usersResult.rows[0]?.count || 0),
// // //       total_authors: parseInt(authorsResult.rows[0]?.count || 0),
// // //       upcoming_events: parseInt(eventsResult.rows[0]?.count || 0),
// // //       last_updated: new Date()
// // //     };

// // //     res.json({
// // //       success: true,
// // //       data: stats
// // //     });
// // //   } catch (error) {
// // //     console.error('Error fetching stats:', error);
// // //     res.status(500).json({ 
// // //       success: false,
// // //       message: 'Erreur lors de la récupération des statistiques',
// // //       error: error.message 
// // //     });
// // //   }
// // // };
// // import pool from "../config/db.js";

// // export const getAllLandingData = async (req, res) => {
// //   try {
// //     console.log("🟡 Début de getAllLandingData - Version corrigée");
    
// //     const [testimonialsResult, eventsResult, authorsResult, statsResult] = await Promise.all([
// //       // Témoignages
// //       pool.query(`
// //         SELECT 
// //           c.id,
// //           c.contenu as content,
// //           u.nom as author,
// //           'Membre' as role,
// //           5 as rating,
// //           c.created_at
// //         FROM comments c
// //         LEFT JOIN utilisateur u ON c.user_id = u.id
// //         WHERE c.post_id IS NOT NULL
// //         ORDER BY c.created_at DESC 
// //         LIMIT 6
// //       `).catch(err => {
// //         console.error("❌ Erreur testimonials:", err);
// //         return { rows: [] };
// //       }),
      
// //       // Événements
// //       pool.query(`
// //         SELECT 
// //           id, title, description, event_date, location, 
// //           max_participants, image_url, price, status,
// //           created_at
// //         FROM events 
// //         WHERE event_date >= $1 AND status = 'active'
// //         ORDER BY event_date ASC 
// //         LIMIT 6
// //       `, [new Date()]).catch(err => {
// //         console.error("❌ Erreur events:", err);
// //         return { rows: [] };
// //       }),
      
// //       // Auteurs CORRIGÉ - Changé user_id → auteur_id
// //       pool.query(`
// //         SELECT 
// //           u.id, 
// //           u.nom as name, 
// //           u.bio, 
// //           u.author_genre, 
// //           COALESCE(l.book_count, 0) as published_works,
// //           u.photo_profil as image,
// //           u.role
// //         FROM utilisateur u
// //         LEFT JOIN (
// //           SELECT auteur_id, COUNT(*) as book_count 
// //           FROM livres 
// //           WHERE statut = 'publié'
// //           GROUP BY auteur_id
// //         ) l ON u.id = l.auteur_id  -- CORRECTION ICI: l.user_id → l.auteur_id
// //         WHERE u.role IN ('auteur', 'author', 'writer', 'editeur', 'admin')
// //         ORDER BY l.book_count DESC NULLS LAST, u.created_at DESC
// //         LIMIT 8
// //       `).catch(err => {
// //         console.error("❌ Erreur authors:", err);
// //         return { rows: [] };
// //       }),
      
// //       // Statistiques
// //       (async () => {
// //         try {
// //           const [booksResult, usersResult, authorsResult, eventsResult] = await Promise.all([
// //             pool.query("SELECT COUNT(*) FROM livres WHERE statut = 'publié'"),
// //             pool.query("SELECT COUNT(*) FROM utilisateur"),
// //             pool.query("SELECT COUNT(*) FROM utilisateur WHERE role IN ('auteur', 'author', 'writer', 'editeur')"),
// //             pool.query("SELECT COUNT(*) FROM events WHERE event_date >= $1 AND status = 'active'", [new Date()])
// //           ]);

// //           return {
// //             total_books: parseInt(booksResult.rows[0]?.count || 0),
// //             total_users: parseInt(usersResult.rows[0]?.count || 0),
// //             total_authors: parseInt(authorsResult.rows[0]?.count || 0),
// //             upcoming_events: parseInt(eventsResult.rows[0]?.count || 0)
// //           };
// //         } catch (err) {
// //           console.error("❌ Erreur stats:", err);
// //           return {
// //             total_books: 0,
// //             total_users: 0, 
// //             total_authors: 0,
// //             upcoming_events: 0
// //           };
// //         }
// //       })()
// //     ]);

// //     console.log("✅ Données récupérées:", {
// //       testimonials: testimonialsResult.rows.length,
// //       events: eventsResult.rows.length, 
// //       authors: authorsResult.rows.length,
// //     });

// //     // Formater les auteurs
// //     const authors = authorsResult.rows.map(author => ({
// //       id: author.id,
// //       name: author.name || 'Auteur inconnu',
// //       bio: author.bio || `Auteur ${author.author_genre || 'littéraire'}`,
// //       author_genre: author.author_genre || 'Auteur',
// //       published_works: parseInt(author.published_works) || 1,
// //       image: author.image || '/assets/images/avatar-default.png',
// //       role: author.role || 'Auteur'
// //     }));

// //     // Fallback si pas d'auteurs
// //     let finalAuthors = authors;
// //     if (authors.length === 0) {
// //       console.log("⚠️ Aucun auteur trouvé, création de données minimales");
// //       finalAuthors = [
// //         {
// //           id: 1,
// //           name: "Auteur Malagasy",
// //           bio: "Auteur passionné par la littérature malgache",
// //           author_genre: "Littérature",
// //           published_works: 3,
// //           image: "/assets/images/avatar-default.png",
// //           role: "Auteur"
// //         },
// //         {
// //           id: 2,
// //           name: "Écrivain Local",
// //           bio: "Promouvoir la culture malgache à travers l'écriture",
// //           author_genre: "Roman",
// //           published_works: 2,
// //           image: "/assets/images/avatar-default.png",
// //           role: "Auteur"
// //         }
// //       ];
// //     }

// //     res.json({
// //       success: true,
// //       data: {
// //         testimonials: testimonialsResult.rows,
// //         events: eventsResult.rows,
// //         authors: finalAuthors,
// //         stats: statsResult
// //       }
// //     });

// //   } catch (error) {
// //     console.error("🔥 Erreur critique dans getAllLandingData:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: 'Erreur serveur: ' + error.message
// //     });
// //   }
// // };

// // // CORRIGER AUSSI CETTE FONCTION
// // export const getPromotedAuthors = async (req, res) => {
// //   try {
// //     const result = await pool.query(`
// //       SELECT 
// //         u.id, 
// //         u.nom as name, 
// //         u.bio, 
// //         u.author_genre, 
// //         COALESCE(l.book_count, 0) as published_works,
// //         u.photo_profil as image,
// //         u.role
// //       FROM utilisateur u
// //       LEFT JOIN (
// //         SELECT auteur_id, COUNT(*) as book_count  -- CORRECTION ICI
// //         FROM livres 
// //         WHERE statut = 'publié'
// //         GROUP BY auteur_id  -- CORRECTION ICI
// //       ) l ON u.id = l.auteur_id  -- CORRECTION ICI
// //       WHERE u.role IN ('auteur', 'author', 'writer', 'editeur', 'admin')
// //       ORDER BY l.book_count DESC NULLS LAST, u.created_at DESC
// //       LIMIT 12
// //     `);

// //     const authors = result.rows.map(author => ({
// //       id: author.id,
// //       name: author.name || 'Auteur inconnu',
// //       bio: author.bio || `Auteur spécialisé en ${author.author_genre || 'littérature'}`,
// //       author_genre: author.author_genre || 'Auteur',
// //       published_works: parseInt(author.published_works) || 1,
// //       image: author.image || '/assets/images/avatar-default.png',
// //       role: author.role || 'Auteur'
// //     }));

// //     res.json({
// //       success: true,
// //       data: authors,
// //       count: authors.length
// //     });

// //   } catch (error) {
// //     console.error('❌ Error fetching promoted authors:', error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: 'Erreur lors de la récupération des auteurs'
// //     });
// //   }
// // };

// // // CORRIGER CETTE FONCTION AUSSI
// // export const getRecentBooks = async (req, res) => {
// //   try {
// //     const limit = parseInt(req.query.limit) || 6;
    
// //     const result = await pool.query(`
// //       SELECT 
// //         l.id,
// //         l.titre,
// //         l.description,
// //         l.couverture_url,
// //         l.genre,
// //         l.statut,
// //         l.created_at,
// //         u.nom as auteur,
// //         u.photo_profil as auteur_image
// //       FROM livres l
// //       LEFT JOIN utilisateur u ON l.auteur_id = u.id  -- CORRECTION ICI: l.user_id → l.auteur_id
// //       WHERE l.statut = 'publié'
// //       ORDER BY l.created_at DESC
// //       LIMIT $1
// //     `, [limit]);

// //     const books = result.rows.map(book => ({
// //       id: book.id,
// //       titre: book.titre || 'Titre non disponible',
// //       description: book.description || 'Aucune description disponible',
// //       couverture_url: book.couverture_url || '/assets/images/book-placeholder.jpg',
// //       genre: book.genre || 'Non spécifié',
// //       auteur: book.auteur || 'Auteur inconnu',
// //       auteur_image: book.auteur_image || '/assets/images/avatar-default.png',
// //       statut: book.statut,
// //       created_at: book.created_at
// //     }));

// //     res.json({
// //       success: true,
// //       data: books,
// //       count: books.length
// //     });

// //   } catch (error) {
// //     console.error('❌ Error fetching recent books:', error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: 'Erreur lors de la récupération des livres récents'
// //     });
// //   }
// // };

// // // Garder les autres fonctions inchangées...
// // export const getFeaturedTestimonials = async (req, res) => {
// //   try {
// //     const result = await pool.query(`
// //       SELECT 
// //         c.id,
// //         c.contenu as content,
// //         u.nom as author,
// //         'Membre Vakio Boky' as role,
// //         5 as rating,
// //         c.created_at
// //       FROM comments c
// //       LEFT JOIN utilisateur u ON c.user_id = u.id
// //       WHERE c.post_id IS NOT NULL
// //       ORDER BY c.created_at DESC 
// //       LIMIT 6
// //     `);

// //     res.json({
// //       success: true,
// //       data: result.rows,
// //       count: result.rowCount
// //     });
// //   } catch (error) {
// //     console.error('Error fetching testimonials:', error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: 'Erreur lors de la récupération des témoignages'
// //     });
// //   }
// // };

// // export const getUpcomingEvents = async (req, res) => {
// //   try {
// //     const result = await pool.query(
// //       `SELECT 
// //         id, title, description, event_date, location, 
// //         max_participants, image_url, price, status,
// //         created_at
// //        FROM events 
// //        WHERE event_date >= $1 AND status = 'active'
// //        ORDER BY event_date ASC 
// //        LIMIT 6`,
// //       [new Date()]
// //     );

// //     res.json({
// //       success: true,
// //       data: result.rows,
// //       count: result.rowCount
// //     });
// //   } catch (error) {
// //     console.error('Error fetching events:', error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: 'Erreur lors de la récupération des événements'
// //     });
// //   }
// // };

// // export const getLandingStats = async (req, res) => {
// //   try {
// //     const [
// //       booksResult,
// //       usersResult,
// //       authorsResult,
// //       eventsResult
// //     ] = await Promise.all([
// //       pool.query("SELECT COUNT(*) FROM livres WHERE statut = 'publié'"),
// //       pool.query("SELECT COUNT(*) FROM utilisateur"),
// //       pool.query("SELECT COUNT(*) FROM utilisateur WHERE role IN ('auteur', 'author', 'writer', 'editeur')"),
// //       pool.query("SELECT COUNT(*) FROM events WHERE event_date >= $1 AND status = 'active'", [new Date()])
// //     ]);

// //     const stats = {
// //       total_books: parseInt(booksResult.rows[0]?.count || 0),
// //       total_users: parseInt(usersResult.rows[0]?.count || 0),
// //       total_authors: parseInt(authorsResult.rows[0]?.count || 0),
// //       upcoming_events: parseInt(eventsResult.rows[0]?.count || 0),
// //       last_updated: new Date()
// //     };

// //     res.json({
// //       success: true,
// //       data: stats
// //     });
// //   } catch (error) {
// //     console.error('Error fetching stats:', error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: 'Erreur lors de la récupération des statistiques'
// //     });
// //   }
// // };
// import pool from "../config/db.js";

// // Fonction utilitaire pour générer les chemins d'images locales
// const getAuthorImagePath = (authorName) => {
//   if (!authorName) return "/assets/images/avatar-default.png";
  
//   // Nettoyer le nom pour créer un chemin de fichier
//   const cleanName = authorName
//     .toLowerCase()
//     .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Enlève les accents
//     .replace(/\s+/g, '-') // Remplace les espaces par des tirets
//     .replace(/[^a-z0-9-]/g, ''); // Garde seulement lettres, chiffres, tirets
  
//   return `/assets/images/authors/${cleanName}.png`;
// };

// export const getAllLandingData = async (req, res) => {
//   try {
//     console.log("🟡 Début de getAllLandingData - Version corrigée");
    
//     const [testimonialsResult, eventsResult, authorsResult, statsResult] = await Promise.all([
//       // Témoignages
//       pool.query(`
//         SELECT 
//           c.id,
//           c.contenu as content,
//           u.nom as author,
//           'Membre' as role,
//           5 as rating,
//           c.created_at
//         FROM comments c
//         LEFT JOIN utilisateur u ON c.user_id = u.id
//         WHERE c.post_id IS NOT NULL
//         ORDER BY c.created_at DESC 
//         LIMIT 6
//       `).catch(err => {
//         console.error("❌ Erreur testimonials:", err);
//         return { rows: [] };
//       }),
      
//       // Événements
//       pool.query(`
//         SELECT 
//           id, title, description, event_date, location, 
//           max_participants, image_url, price, status,
//           created_at
//         FROM events 
//         WHERE event_date >= $1 AND status = 'active'
//         ORDER BY event_date ASC 
//         LIMIT 6
//       `, [new Date()]).catch(err => {
//         console.error("❌ Erreur events:", err);
//         return { rows: [] };
//       }),
      
//       // Auteurs CORRIGÉ
//       pool.query(`
//         SELECT 
//           u.id, 
//           u.nom as name, 
//           u.bio, 
//           u.author_genre, 
//           COALESCE(l.book_count, 0) as published_works,
//           u.photo_profil as image,
//           u.role
//         FROM utilisateur u
//         LEFT JOIN (
//           SELECT auteur_id, COUNT(*) as book_count 
//           FROM livres 
//           WHERE statut = 'publié'
//           GROUP BY auteur_id
//         ) l ON u.id = l.auteur_id
//         WHERE u.role IN ('auteur', 'author', 'writer', 'editeur', 'admin')
//         ORDER BY l.book_count DESC NULLS LAST, u.created_at DESC
//         LIMIT 8
//       `).catch(err => {
//         console.error("❌ Erreur authors:", err);
//         return { rows: [] };
//       }),
      
//       // Statistiques
//       (async () => {
//         try {
//           const [booksResult, usersResult, authorsResult, eventsResult] = await Promise.all([
//             pool.query("SELECT COUNT(*) FROM livres WHERE statut = 'publié'"),
//             pool.query("SELECT COUNT(*) FROM utilisateur"),
//             pool.query("SELECT COUNT(*) FROM utilisateur WHERE role IN ('auteur', 'author', 'writer', 'editeur')"),
//             pool.query("SELECT COUNT(*) FROM events WHERE event_date >= $1 AND status = 'active'", [new Date()])
//           ]);

//           return {
//             total_books: parseInt(booksResult.rows[0]?.count || 0),
//             total_users: parseInt(usersResult.rows[0]?.count || 0),
//             total_authors: parseInt(authorsResult.rows[0]?.count || 0),
//             upcoming_events: parseInt(eventsResult.rows[0]?.count || 0)
//           };
//         } catch (err) {
//           console.error("❌ Erreur stats:", err);
//           return {
//             total_books: 0,
//             total_users: 0, 
//             total_authors: 0,
//             upcoming_events: 0
//           };
//         }
//       })()
//     ]);

//     console.log("✅ Données récupérées:", {
//       testimonials: testimonialsResult.rows.length,
//       events: eventsResult.rows.length, 
//       authors: authorsResult.rows.length,
//     });

//     // Formater les auteurs AVEC IMAGES LOCALES
//     const authors = authorsResult.rows.map(author => ({
//       id: author.id,
//       name: author.name || 'Auteur inconnu',
//       bio: author.bio || `Auteur ${author.author_genre || 'littéraire'}`,
//       author_genre: author.author_genre || 'Auteur',
//       published_works: parseInt(author.published_works) || 1,
//       // CORRIGÉ : Utiliser l'image de profil si elle existe, sinon image locale
//       image: author.image 
//         ? (author.image.startsWith('http') ? author.image : `/uploads/profiles/${author.image}`)
//         : getAuthorImagePath(author.name),
//       role: author.role || 'Auteur'
//     }));

//     // Fallback si pas d'auteurs - AVEC IMAGES LOCALES
//     let finalAuthors = authors;
//     if (authors.length === 0) {
//       console.log("⚠️ Aucun auteur trouvé, création de données minimales");
//       finalAuthors = [
//         {
//           id: 1,
//           name: "Auteur Malagasy",
//           bio: "Auteur passionné par la littérature malgache",
//           author_genre: "Littérature",
//           published_works: 3,
//           // CORRIGÉ : Image locale au lieu de via.placeholder.com
//           image: "/assets/images/authors/auteur-malagasy.png",
//           role: "Auteur"
//         },
//         {
//           id: 2,
//           name: "Écrivain Local",
//           bio: "Promouvoir la culture malgache à travers l'écriture",
//           author_genre: "Roman",
//           published_works: 2,
//           // CORRIGÉ : Image locale au lieu de via.placeholder.com
//           image: "/assets/images/authors/ecrivain-local.png",
//           role: "Auteur"
//         }
//       ];
//     }

//     res.json({
//       success: true,
//       data: {
//         testimonials: testimonialsResult.rows,
//         events: eventsResult.rows,
//         authors: finalAuthors,
//         stats: statsResult
//       }
//     });

//   } catch (error) {
//     console.error("🔥 Erreur critique dans getAllLandingData:", error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Erreur serveur: ' + error.message
//     });
//   }
// };

// export const getPromotedAuthors = async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT 
//         u.id, 
//         u.nom as name, 
//         u.bio, 
//         u.author_genre, 
//         COALESCE(l.book_count, 0) as published_works,
//         u.photo_profil as image,
//         u.role
//       FROM utilisateur u
//       LEFT JOIN (
//         SELECT auteur_id, COUNT(*) as book_count
//         FROM livres 
//         WHERE statut = 'publié'
//         GROUP BY auteur_id
//       ) l ON u.id = l.auteur_id
//       WHERE u.role IN ('auteur', 'author', 'writer', 'editeur', 'admin')
//       ORDER BY l.book_count DESC NULLS LAST, u.created_at DESC
//       LIMIT 12
//     `);

//     const authors = result.rows.map(author => ({
//       id: author.id,
//       name: author.name || 'Auteur inconnu',
//       bio: author.bio || `Auteur spécialisé en ${author.author_genre || 'littérature'}`,
//       author_genre: author.author_genre || 'Auteur',
//       published_works: parseInt(author.published_works) || 1,
//       // CORRIGÉ : Image locale
//       image: author.image 
//         ? (author.image.startsWith('http') ? author.image : `/uploads/profiles/${author.image}`)
//         : getAuthorImagePath(author.name),
//       role: author.role || 'Auteur'
//     }));

//     res.json({
//       success: true,
//       data: authors,
//       count: authors.length
//     });

//   } catch (error) {
//     console.error('❌ Error fetching promoted authors:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Erreur lors de la récupération des auteurs'
//     });
//   }
// };

// export const getRecentBooks = async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 6;
    
//     const result = await pool.query(`
//       SELECT 
//         l.id,
//         l.titre,
//         l.description,
//         l.couverture_url,
//         l.genre,
//         l.statut,
//         l.created_at,
//         u.nom as auteur,
//         u.photo_profil as auteur_image
//       FROM livres l
//       LEFT JOIN utilisateur u ON l.auteur_id = u.id
//       WHERE l.statut = 'publié'
//       ORDER BY l.created_at DESC
//       LIMIT $1
//     `, [limit]);

//     const books = result.rows.map(book => ({
//       id: book.id,
//       titre: book.titre || 'Titre non disponible',
//       description: book.description || 'Aucune description disponible',
//       // CORRIGÉ : Image locale pour les livres
//       couverture_url: book.couverture_url 
//         ? (book.couverture_url.startsWith('http') 
//             ? book.couverture_url 
//             : `/uploads/books/${book.couverture_url}`)
//         : '/assets/images/books/default-book.png',
//       genre: book.genre || 'Non spécifié',
//       auteur: book.auteur || 'Auteur inconnu',
//       // CORRIGÉ : Image locale pour l'auteur
//       auteur_image: book.auteur_image 
//         ? (book.auteur_image.startsWith('http') 
//             ? book.auteur_image 
//             : `/uploads/profiles/${book.auteur_image}`)
//         : '/assets/images/avatar-default.png',
//       statut: book.statut,
//       created_at: book.created_at
//     }));

//     res.json({
//       success: true,
//       data: books,
//       count: books.length
//     });

//   } catch (error) {
//     console.error('❌ Error fetching recent books:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Erreur lors de la récupération des livres récents'
//     });
//   }
// };

// // Les autres fonctions restent inchangées...
// export const getFeaturedTestimonials = async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT 
//         c.id,
//         c.contenu as content,
//         u.nom as author,
//         'Membre Vakio Boky' as role,
//         5 as rating,
//         c.created_at
//       FROM comments c
//       LEFT JOIN utilisateur u ON c.user_id = u.id
//       WHERE c.post_id IS NOT NULL
//       ORDER BY c.created_at DESC 
//       LIMIT 6
//     `);

//     res.json({
//       success: true,
//       data: result.rows,
//       count: result.rowCount
//     });
//   } catch (error) {
//     console.error('Error fetching testimonials:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Erreur lors de la récupération des témoignages'
//     });
//   }
// };

// export const getUpcomingEvents = async (req, res) => {
//   try {
//     const result = await pool.query(
//       `SELECT 
//         id, title, description, event_date, location, 
//         max_participants, image_url, price, status,
//         created_at
//        FROM events 
//        WHERE event_date >= $1 AND status = 'active'
//        ORDER BY event_date ASC 
//        LIMIT 6`,
//       [new Date()]
//     );

//     res.json({
//       success: true,
//       data: result.rows,
//       count: result.rowCount
//     });
//   } catch (error) {
//     console.error('Error fetching events:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Erreur lors de la récupération des événements'
//     });
//   }
// };

// export const getLandingStats = async (req, res) => {
//   try {
//     const [
//       booksResult,
//       usersResult,
//       authorsResult,
//       eventsResult
//     ] = await Promise.all([
//       pool.query("SELECT COUNT(*) FROM livres WHERE statut = 'publié'"),
//       pool.query("SELECT COUNT(*) FROM utilisateur"),
//       pool.query("SELECT COUNT(*) FROM utilisateur WHERE role IN ('auteur', 'author', 'writer', 'editeur')"),
//       pool.query("SELECT COUNT(*) FROM events WHERE event_date >= $1 AND status = 'active'", [new Date()])
//     ]);

//     const stats = {
//       total_books: parseInt(booksResult.rows[0]?.count || 0),
//       total_users: parseInt(usersResult.rows[0]?.count || 0),
//       total_authors: parseInt(authorsResult.rows[0]?.count || 0),
//       upcoming_events: parseInt(eventsResult.rows[0]?.count || 0),
//       last_updated: new Date()
//     };

//     res.json({
//       success: true,
//       data: stats
//     });
//   } catch (error) {
//     console.error('Error fetching stats:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Erreur lors de la récupération des statistiques'
//     });
//   }
// };
import pool from "../config/db.js";

// Fonction utilitaire pour les images d'auteurs
const getAuthorImagePath = (authorName) => {
  if (!authorName) return "/assets/images/avatar-default.png";
  
  const cleanName = authorName
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  return `/assets/images/authors/${cleanName}.png`;
};

// Fonction pour obtenir l'image de profil d'un utilisateur - SIMPLIFIÉE
const getUserProfileImage = (imageUrl, userName) => {
  // Si pas d'image, retourner null (optionnel)
  if (!imageUrl || imageUrl === 'null' || imageUrl === 'NULL' || imageUrl.trim() === '') {
    return null;
  }
  
  // Si c'est une URL complète
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Si c'est un nom de fichier dans uploads/profiles/
  if (imageUrl.includes('profile-')) {
    return `/uploads/profiles/${imageUrl}`;
  }
  
  // Sinon, image par défaut basée sur le nom
  return getAuthorImagePath(userName);
};

export const getAllLandingData = async (req, res) => {
  try {
    console.log("🟡 Début de getAllLandingData - Version simplifiée");
    
    const [testimonialsResult, eventsResult, authorsResult, statsResult] = await Promise.all([
      // Témoignages
      pool.query(`
        SELECT 
          c.id,
          c.contenu as content,
          u.nom as author,
          'Membre' as role,
          5 as rating,
          c.created_at
        FROM comments c
        LEFT JOIN utilisateur u ON c.user_id = u.id
        WHERE c.post_id IS NOT NULL
        ORDER BY c.created_at DESC 
        LIMIT 6
      `).catch(err => {
        console.error("❌ Erreur testimonials:", err);
        return { rows: [] };
      }),
      
      // Événements
      pool.query(`
        SELECT 
          id, title, description, event_date, location, 
          max_participants, image_url, price, status,
          created_at
        FROM events 
        WHERE event_date >= $1 AND status = 'active'
        ORDER BY event_date ASC 
        LIMIT 6
      `, [new Date()]).catch(err => {
        console.error("❌ Erreur events:", err);
        return { rows: [] };
      }),
      
      // Auteurs
      pool.query(`
        SELECT 
          u.id, 
          u.nom as name, 
          u.bio, 
          u.author_genre, 
          COALESCE(l.book_count, 0) as published_works,
          u.photo_profil as image,
          u.role
        FROM utilisateur u
        LEFT JOIN (
          SELECT auteur_id, COUNT(*) as book_count 
          FROM livres 
          WHERE statut = 'publié'
          GROUP BY auteur_id
        ) l ON u.id = l.auteur_id
        WHERE u.role IN ('auteur', 'author', 'writer', 'editeur', 'admin')
        ORDER BY l.book_count DESC NULLS LAST, u.created_at DESC
        LIMIT 8
      `).catch(err => {
        console.error("❌ Erreur authors:", err);
        return { rows: [] };
      }),
      
      // Statistiques
      (async () => {
        try {
          const [booksResult, usersResult, authorsResult, eventsResult] = await Promise.all([
            pool.query("SELECT COUNT(*) FROM livres WHERE statut = 'publié'"),
            pool.query("SELECT COUNT(*) FROM utilisateur"),
            pool.query("SELECT COUNT(*) FROM utilisateur WHERE role IN ('auteur', 'author', 'writer', 'editeur')"),
            pool.query("SELECT COUNT(*) FROM events WHERE event_date >= $1 AND status = 'active'", [new Date()])
          ]);

          return {
            total_books: parseInt(booksResult.rows[0]?.count || 0),
            total_users: parseInt(usersResult.rows[0]?.count || 0),
            total_authors: parseInt(authorsResult.rows[0]?.count || 0),
            upcoming_events: parseInt(eventsResult.rows[0]?.count || 0)
          };
        } catch (err) {
          console.error("❌ Erreur stats:", err);
          return {
            total_books: 0,
            total_users: 0, 
            total_authors: 0,
            upcoming_events: 0
          };
        }
      })()
    ]);

    console.log("✅ Données récupérées:", {
      testimonials: testimonialsResult.rows.length,
      events: eventsResult.rows.length, 
      authors: authorsResult.rows.length,
    });

    // Formater les auteurs - images optionnelles
    const authors = authorsResult.rows.map(author => ({
      id: author.id,
      name: author.name || 'Auteur inconnu',
      bio: author.bio || `Auteur ${author.author_genre || 'littéraire'}`,
      author_genre: author.author_genre || 'Auteur',
      published_works: parseInt(author.published_works) || 1,
      // Image optionnelle - peut être null
      image: getUserProfileImage(author.image, author.name),
      role: author.role || 'Auteur'
    }));

    // Si pas d'auteurs, retourner tableau vide plutôt que fallback
    // Le frontend peut gérer un état "aucun auteur"
    const finalAuthors = authors;

    res.json({
      success: true,
      data: {
        testimonials: testimonialsResult.rows,
        events: eventsResult.rows,
        authors: finalAuthors, // Peut être vide
        stats: statsResult
      }
    });

  } catch (error) {
    console.error("🔥 Erreur critique dans getAllLandingData:", error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur: ' + error.message
    });
  }
};

export const getPromotedAuthors = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id, 
        u.nom as name, 
        u.bio, 
        u.author_genre, 
        COALESCE(l.book_count, 0) as published_works,
        u.photo_profil as image,
        u.role
      FROM utilisateur u
      LEFT JOIN (
        SELECT auteur_id, COUNT(*) as book_count
        FROM livres 
        WHERE statut = 'publié'
        GROUP BY auteur_id
      ) l ON u.id = l.auteur_id
      WHERE u.role IN ('auteur', 'author', 'writer', 'editeur', 'admin')
      ORDER BY l.book_count DESC NULLS LAST, u.created_at DESC
      LIMIT 12
    `);

    const authors = result.rows.map(author => ({
      id: author.id,
      name: author.name || 'Auteur inconnu',
      bio: author.bio || `Auteur spécialisé en ${author.author_genre || 'littérature'}`,
      author_genre: author.author_genre || 'Auteur',
      published_works: parseInt(author.published_works) || 1,
      // Image optionnelle - peut être null
      image: getUserProfileImage(author.image, author.name),
      role: author.role || 'Auteur'
    }));

    res.json({
      success: true,
      data: authors,
      count: authors.length
    });

  } catch (error) {
    console.error('❌ Error fetching promoted authors:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération des auteurs'
    });
  }
};

export const getRecentBooks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const result = await pool.query(`
      SELECT 
        l.id,
        l.titre,
        l.description,
        l.couverture_url,
        l.genre,
        l.statut,
        l.created_at,
        u.nom as auteur,
        u.photo_profil as auteur_image
      FROM livres l
      LEFT JOIN utilisateur u ON l.auteur_id = u.id
      WHERE l.statut = 'publié'
      ORDER BY l.created_at DESC
      LIMIT $1
    `, [limit]);

    const books = result.rows.map(book => ({
      id: book.id,
      titre: book.titre || 'Titre non disponible',
      description: book.description || 'Aucune description disponible',
      // Couverture optionnelle
      couverture_url: book.couverture_url && book.couverture_url !== 'null'
        ? (book.couverture_url.startsWith('http') 
            ? book.couverture_url 
            : `/uploads/books/${book.couverture_url}`)
        : null, // Null si pas de couverture
      genre: book.genre || 'Non spécifié',
      auteur: book.auteur || 'Auteur inconnu',
      // Image d'auteur optionnelle - peut être null
      auteur_image: getUserProfileImage(book.auteur_image, book.auteur),
      statut: book.statut,
      created_at: book.created_at
    }));

    res.json({
      success: true,
      data: books,
      count: books.length
    });

  } catch (error) {
    console.error('❌ Error fetching recent books:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération des livres récents'
    });
  }
};

export const getFeaturedTestimonials = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.contenu as content,
        u.nom as author,
        'Membre Vakio Boky' as role,
        5 as rating,
        c.created_at
      FROM comments c
      LEFT JOIN utilisateur u ON c.user_id = u.id
      WHERE c.post_id IS NOT NULL
      ORDER BY c.created_at DESC 
      LIMIT 6
    `);

    res.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération des témoignages'
    });
  }
};

export const getUpcomingEvents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        id, title, description, event_date, location, 
        max_participants, image_url, price, status,
        created_at
       FROM events 
       WHERE event_date >= $1 AND status = 'active'
       ORDER BY event_date ASC 
       LIMIT 6`,
      [new Date()]
    );

    res.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération des événements'
    });
  }
};

export const getLandingStats = async (req, res) => {
  try {
    const [
      booksResult,
      usersResult,
      authorsResult,
      eventsResult
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM livres WHERE statut = 'publié'"),
      pool.query("SELECT COUNT(*) FROM utilisateur"),
      pool.query("SELECT COUNT(*) FROM utilisateur WHERE role IN ('auteur', 'author', 'writer', 'editeur')"),
      pool.query("SELECT COUNT(*) FROM events WHERE event_date >= $1 AND status = 'active'", [new Date()])
    ]);

    const stats = {
      total_books: parseInt(booksResult.rows[0]?.count || 0),
      total_users: parseInt(usersResult.rows[0]?.count || 0),
      total_authors: parseInt(authorsResult.rows[0]?.count || 0),
      upcoming_events: parseInt(eventsResult.rows[0]?.count || 0),
      last_updated: new Date()
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};