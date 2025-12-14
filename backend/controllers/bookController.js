import pool from "../config/db.js";

const cleanImageUrl = (url, type = "book") => {
  if (!url) return null;
  
  console.log(`🔗 [cleanImageUrl] URL original: ${url}, type: ${type}`);
  
  if (url.includes('localhost:5000') || url.includes('127.0.0.1:5000')) {
    const filename = url.split('/').pop();
    return `/uploads/${type}s/${filename}`;
  }
  
  if (url.includes('//uploads/')) {
    const filename = url.split('/').pop();
    return `/uploads/${type}s/${filename}`;
  }
  
  if (url.startsWith('/uploads/')) {
    return url;
  }
  
  if (!url.startsWith('http') && !url.startsWith('/')) {
    return `/uploads/${type}s/${url}`;
  }
  
  if (url.includes('render.com') || url.includes('onrender.com')) {
    return url;
  }
  
  return url;
};

const getBookCoverPath = (bookTitle, genre = 'roman') => {
  if (!bookTitle) return "/assets/images/books/default-book.png";
  
  const cleanTitle = bookTitle
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  return `/assets/images/books/${cleanTitle}.png`;
};

const getBooks = async (req, res) => {
  try {
    const query = `
      SELECT l.*, u.nom as auteur_nom 
      FROM livres l 
      LEFT JOIN utilisateur u ON l.auteur_id = u.id 
      WHERE l.statut = 'publié'
      ORDER BY l.created_at DESC
    `;
    const result = await pool.query(query);
    
    const formattedBooks = result.rows.map(book => ({
      ...book,
      couverture_url: book.couverture_url 
        ? cleanImageUrl(book.couverture_url, "book")
        : getBookCoverPath(book.titre, book.genre)
    }));
    
    res.json(formattedBooks);
  } catch (error) {
    console.error("❌ Erreur récupération livres:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur lors de la récupération des livres" 
    });
  }
};

const getMyBooks = async (req, res) => {
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

    const formattedBooks = result.rows.map(book => ({
      ...book,
      couverture_url: cleanImageUrl(book.couverture_url, "book") || 
                    getBookCoverPath(book.titre, book.genre)
    }));

    res.json({
      success: true,
      books: formattedBooks,
    });
  } catch (error) {
    console.error("❌ Erreur récupération mes livres:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur lors de la récupération de vos livres" 
    });
  }
};

const getBook = async (req, res) => {
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
    const bookWithLocalImage = {
      ...book,
      couverture_url: cleanImageUrl(book.couverture_url, "book") || 
                     getBookCoverPath(book.titre, book.genre)
    };

    res.json({
      success: true,
      book: bookWithLocalImage,
    });
  } catch (error) {
    console.error("❌ Erreur récupération livre:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur lors de la récupération du livre" 
    });
  }
};

const createBook = async (req, res) => {
  try {
    console.log("📚 [createBook] Données reçues:", req.body);
    
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

    let finalCoverUrl = couverture_url 
      ? cleanImageUrl(couverture_url, "book")
      : getBookCoverPath(titre, genre);

    console.log(`🖼️ [createBook] URL de couverture: ${finalCoverUrl}`);

    const query = `
      INSERT INTO livres (titre, auteur_id, description, couverture_url, genre, isbn, statut)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      titre,
      auteur_id,
      description || null,
      finalCoverUrl,
      genre || null,
      isbn || null,
      statut,
    ];

    console.log("📝 [createBook] Exécution de la requête avec valeurs:", values);
    
    const result = await pool.query(query, values);

    console.log("✅ [createBook] Livre créé avec succès, ID:", result.rows[0].id);

    if (statut === "publié") {
      try {
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
        console.log("🔔 [createBook] Notifications créées pour le livre publié");
      } catch (notifError) {
        console.warn("⚠️ [createBook] Erreur lors de la création des notifications:", notifError);
      }
    }

    res.status(201).json({
      success: true,
      message: "Livre créé avec succès",
      book: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Erreur création livre:", error);
    console.error("❌ Stack trace:", error.stack);
    
    let errorMessage = "Erreur serveur lors de la création du livre";
    
    if (error.code === '23505') {
      if (error.constraint.includes('isbn')) {
        errorMessage = "Un livre avec cet ISBN existe déjà";
      }
    } else if (error.code === '23503') {
      errorMessage = "L'auteur spécifié n'existe pas";
    }
    
    res.status(500).json({ 
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, couverture_url, genre, isbn, statut } =
      req.body;
    const auteur_id = req.user.id;

    const checkQuery = "SELECT auteur_id, titre as ancien_titre, couverture_url as ancienne_couverture FROM livres WHERE id = $1";
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: "Livre non trouvé" 
      });
    }

    const ancienTitre = checkResult.rows[0].ancien_titre;
    const ancienneCouverture = checkResult.rows[0].ancienne_couverture;
    
    if (checkResult.rows[0].auteur_id !== auteur_id) {
      return res.status(403).json({ 
        success: false,
        error: "Non autorisé à modifier ce livre" 
      });
    }

    let finalCoverUrl = couverture_url 
      ? cleanImageUrl(couverture_url, "book")
      : ancienneCouverture || getBookCoverPath(titre || ancienTitre, genre);

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
      finalCoverUrl,
      genre,
      isbn,
      statut,
      id,
    ];
    const result = await pool.query(query, values);

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

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const auteur_id = req.user.id;

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

const getRecent = async (req, res) => {
  console.log('📚 Controller: getRecent appelé');
  
  try {
    const recentBooks = [
      {
        id: 1,
        title: "Ny Onja",
        author: "Johary Ravaloson",
        description: "Roman poétique sur la vie à Madagascar",
        cover: "/assets/images/books/ny-onja.png",
        price: 15000,
        rating: 4.5,
        category: "Roman",
        pages: 240,
        published_year: 2020,
        language: "Français",
        publisher: "Éditions Malgaches",
        created_at: new Date().toISOString(),
        status: "published"
      },
      {
        id: 2,
        title: "Dernier Crépuscule",
        author: "Michèle Rakotoson",
        description: "Histoire contemporaine malgache",
        cover: "/assets/images/books/dernier-crepuscule.png",
        price: 12000,
        rating: 4.2,
        category: "Roman",
        pages: 320,
        published_year: 2018,
        language: "Français",
        publisher: "Madabook",
        created_at: new Date().toISOString(),
        status: "published"
      },
      {
        id: 3,
        title: "Contes de la Nuit Malgache",
        author: "Collectif d'Auteurs",
        description: "Recueil de contes traditionnels malgaches",
        cover: "/assets/images/books/contes-nuit-malgache.png",
        price: 8000,
        rating: 4.7,
        category: "Contes",
        pages: 180,
        published_year: 2021,
        language: "Français",
        publisher: "Éditions Traditions",
        created_at: new Date().toISOString(),
        status: "published"
      }
    ];
    
    res.status(200).json({
      success: true,
      message: "Livres récents récupérés (données de démonstration)",
      books: recentBooks,
      count: recentBooks.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erreur dans getRecent:', error);
    
    res.status(200).json({
      success: true,
      message: "Livres récents - Données de secours",
      books: [
        {
          id: 999,
          title: "Livre de Test",
          author: "Auteur Test",
          cover: "/assets/images/books/livre-test.png",
          price: 10000,
          category: "Test"
        }
      ],
      count: 1,
      is_mock_data: true
    });
  }
};

const getAllBooksAdmin = async (req, res) => {
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

    const countQuery = `SELECT COUNT(*) as total FROM (${query}) as filtered`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total);

    query += ` ORDER BY l.created_at DESC LIMIT $${count} OFFSET $${count + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    const formattedBooks = result.rows.map(book => ({
      ...book,
      couverture_url: cleanImageUrl(book.couverture_url, "book") || 
                    getBookCoverPath(book.titre, book.genre)
    }));

    res.json({
      success: true,
      books: formattedBooks,
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

const approveBook = async (req, res) => {
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

const rejectBook = async (req, res) => {
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

const featureBook = async (req, res) => {
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

const getFeaturedBooks = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT l.*, u.nom as auteur_nom
       FROM livres l
       LEFT JOIN utilisateur u ON l.auteur_id = u.id
       WHERE l.featured = true AND l.statut = 'publié'
       ORDER BY l.created_at DESC`,
    );

    const formattedBooks = result.rows.map(book => ({
      ...book,
      couverture_url: cleanImageUrl(book.couverture_url, "book") || 
                    getBookCoverPath(book.titre, book.genre)
    }));

    res.json({
      success: true,
      books: formattedBooks,
    });
  } catch (error) {
    console.error("❌ Erreur récupération livres en avant:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};

const getBookAnalytics = async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    let dateFilter = '';

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
      couverture_url: cleanImageUrl(book.couverture_url, "book") || 
                    getBookCoverPath(book.titre, book.genre)
    }));

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

const getGenres = async (req, res) => {
  try {
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

const createGenre = async (req, res) => {
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

const updateGenre = async (req, res) => {
  try {
    const { oldName, newName } = req.body;

    if (!oldName || !newName) {
      return res.status(400).json({
        success: false,
        error: "Ancien et nouveau nom requis",
      });
    }

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

const deleteGenre = async (req, res) => {
  try {
    const { genreName } = req.body;

    if (!genreName) {
      return res.status(400).json({
        success: false,
        error: "Nom du genre requis",
      });
    }

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

const getCollections = async (req, res) => {
  try {
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

const createCollection = async (req, res) => {
  try {
    const { name, description, is_active = true } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Le nom de la collection est obligatoire",
      });
    }

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

const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

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

const deleteCollection = async (req, res) => {
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

export default {
  getBooks,
  getRecent,
  getMyBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getAllBooksAdmin,
  approveBook,
  rejectBook,
  featureBook,
  getFeaturedBooks,
  getBookAnalytics,
  getGenres,
  createGenre,
  updateGenre,
  deleteGenre,
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
  cleanImageUrl,
  getBookCoverPath
};