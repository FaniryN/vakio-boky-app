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