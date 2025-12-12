import pool from "../config/db.js";

// Fonction utilitaire pour nettoyer les URLs d'images (version locale)
export const cleanImageUrl = (url, type = "event") => {
  if (!url) return null;
  
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
  
  return url;
};

// Fonction pour formater les URLs d'images dans les événements
export const formatEventImageUrl = (event) => {
  if (!event) return event;
  
  return {
    ...event,
    image_url: event.image_url ? cleanImageUrl(event.image_url, "event") : null
  };
};

// GET /api/events - Liste des événements actifs
export const getEvents = async (req, res) => {
  try {
    console.log("🔄 Tentative de récupération des événements...");

    const query = `
      SELECT e.*,
             COALESCE(reg.registered_count, 0) as registered_count
      FROM events e
      LEFT JOIN (
        SELECT event_id, COUNT(*) as registered_count
        FROM event_registrations
        GROUP BY event_id
      ) reg ON e.id = reg.event_id
      WHERE e.status = 'active'
      ORDER BY e.event_date ASC
    `;

    const result = await pool.query(query);
    console.log("✅ Événements récupérés:", result.rows.length);

    const events = result.rows.map(event => formatEventImageUrl(event));

    res.json({
      success: true,
      events: events,
    });
  } catch (error) {
    console.error("❌ Erreur récupération événements:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la récupération des événements",
    });
  }
};

// GET /api/events/:id - Récupérer un événement spécifique
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT e.*, 
             COUNT(er.id) as registered_count
      FROM events e
      LEFT JOIN event_registrations er ON e.id = er.event_id
      WHERE e.id = $1
      GROUP BY e.id
    `;
    
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Événement non trouvé"
      });
    }

    const event = formatEventImageUrl(result.rows[0]);

    res.json({
      success: true,
      event: event,
    });
  } catch (error) {
    console.error("❌ Erreur récupération événement:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la récupération de l'événement"
    });
  }
};

// POST /api/events - Créer un événement
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      event_date,
      location,
      max_participants,
      image_url,
      price,
      status = "active"
    } = req.body;

    if (!title || !event_date || !location) {
      return res.status(400).json({
        success: false,
        error: "Les champs titre, date et lieu sont obligatoires"
      });
    }

    const cleanImageUrlValue = cleanImageUrl(image_url, "event");

    const query = `
      INSERT INTO events (title, description, event_date, location, max_participants, image_url, price, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      title,
      description,
      event_date,
      location,
      max_participants || null,
      cleanImageUrlValue,
      price || 0,
      status
    ];

    const result = await pool.query(query, values);
    const event = formatEventImageUrl(result.rows[0]);

    if (status === "active") {
      await pool.query(
        `INSERT INTO notifications (user_id, titre, message, type, lien)
         SELECT id, $1, $2, 'event', $3
         FROM utilisateur
         WHERE role IN ('lecteur', 'auteur', 'editeur')`,
        [
          "Nouvel événement littéraire",
          `Découvrez "${title}" - ${new Date(event_date).toLocaleDateString('fr-FR')}`,
          `/events/${event.id}`,
        ]
      );

      if (title.toLowerCase().includes('webinar') || 
          title.toLowerCase().includes('live') || 
          title.toLowerCase().includes('direct')) {
        await pool.query(
          `INSERT INTO notifications (user_id, titre, message, type, lien)
           SELECT id, $1, $2, 'live', $3
           FROM utilisateur
           WHERE role IN ('lecteur', 'auteur', 'editeur')`,
          [
            "Session live disponible",
            `Rejoignez "${title}" en direct - ${new Date(event_date).toLocaleDateString('fr-FR')}`,
            `/events/${event.id}`,
          ]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: "Événement créé avec succès",
      event: event,
    });
  } catch (error) {
    console.error("❌ Erreur création événement:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la création de l'événement"
    });
  }
};

// PUT /api/events/:id - Modifier un événement
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = [
      "title",
      "description",
      "event_date",
      "location",
      "max_participants",
      "image_url",
      "price",
      "status",
    ];
    
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        const value = field === "image_url" 
          ? cleanImageUrl(updates[field], "event")
          : updates[field];
        
        updateFields.push(`${field} = $${paramCount}`);
        updateValues.push(value);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Aucun champ à mettre à jour"
      });
    }

    updateValues.push(id);
    const query = `
      UPDATE events 
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, updateValues);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Événement non trouvé"
      });
    }

    const event = formatEventImageUrl(result.rows[0]);

    res.json({
      success: true,
      message: "Événement modifié avec succès",
      event: event,
    });
  } catch (error) {
    console.error("❌ Erreur modification événement:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la modification de l'événement"
    });
  }
};

// DELETE /api/events/:id - Supprimer un événement
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🗑️ Tentative de suppression de l'événement ${id}`);

    const eventCheck = await pool.query(
      "SELECT * FROM events WHERE id = $1",
      [id]
    );

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Événement non trouvé"
      });
    }

    await pool.query(
      "DELETE FROM event_registrations WHERE event_id = $1",
      [id]
    );

    const result = await pool.query(
      "DELETE FROM events WHERE id = $1 RETURNING *",
      [id]
    );

    console.log(`✅ Événement ${id} supprimé avec succès`);

    res.status(200).json({
      success: true,
      message: "Événement supprimé avec succès",
      deletedEvent: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Erreur suppression événement:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la suppression de l'événement",
    });
  }
};

// POST /api/events/:id/register - S'inscrire à un événement
export const registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        error: "Utilisateur non authentifié"
      });
    }

    const eventResult = await pool.query(
      `
      SELECT e.*, COUNT(er.id) as registered_count
      FROM events e
      LEFT JOIN event_registrations er ON e.id = er.event_id
      WHERE e.id = $1 AND e.status = 'active'
      GROUP BY e.id
    `,
      [id]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Événement non trouvé ou inactif"
      });
    }

    const event = eventResult.rows[0];

    if (
      event.max_participants &&
      event.registered_count >= event.max_participants
    ) {
      return res.status(400).json({
        success: false,
        error: "Événement complet"
      });
    }

    const existingRegistration = await pool.query(
      "SELECT * FROM event_registrations WHERE user_id = $1 AND event_id = $2",
      [user_id, id]
    );

    if (existingRegistration.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Vous êtes déjà inscrit à cet événement"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO event_registrations (user_id, event_id)
      VALUES ($1, $2)
      RETURNING *
    `,
      [user_id, id]
    );

    res.status(201).json({
      success: true,
      message: "Inscription réussie !",
      registration: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Erreur inscription événement:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de l'inscription à l'événement"
    });
  }
};

// GET /api/events/:id/registrations - Récupérer les inscriptions d'un événement
export const getEventRegistrations = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT er.*, u.nom, u.email
      FROM event_registrations er
      JOIN utilisateur u ON er.user_id = u.id
      WHERE er.event_id = $1
      ORDER BY er.created_at DESC
    `;

    const result = await pool.query(query, [id]);

    res.json({
      success: true,
      registrations: result.rows,
    });
  } catch (error) {
    console.error("❌ Erreur récupération inscriptions:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la récupération des inscriptions"
    });
  }
};

// GET /api/events/detail/:id - Récupérer les détails d'un événement
export const getDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🔍 Récupération détails événement ID: ${id}`);
    
    const query = `
      SELECT *
      FROM events 
      WHERE id = $1 AND status = 'active'
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Événement non trouvé'
      });
    }
    
    const event = formatEventImageUrl(result.rows[0]);
    
    const formattedEvent = {
      ...event,
      event_date: new Date(event.event_date).toISOString()
    };
    
    res.json({
      success: true,
      data: formattedEvent
    });
    
  } catch (error) {
    console.error('❌ Erreur récupération événement:', error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la récupération de l'événement"
    });
  }
};

// GET /api/admin/events - Tous les événements pour admin
export const getAllEventsAdmin = async (req, res) => {
  try {
    const { status = 'all', search = '', page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT e.*,
             COALESCE(reg.registered_count, 0) as registered_count
      FROM events e
      LEFT JOIN (
        SELECT event_id, COUNT(*) as registered_count
        FROM event_registrations
        GROUP BY event_id
      ) reg ON e.id = reg.event_id
      WHERE 1=1
    `;
    
    let values = [];
    let count = 1;

    if (status !== 'all') {
      query += ` AND e.status = $${count}`;
      values.push(status);
      count++;
    }

    if (search) {
      query += ` AND (e.title ILIKE $${count} OR e.location ILIKE $${count} OR e.description ILIKE $${count})`;
      values.push(`%${search}%`);
      count++;
    }

    const countQuery = `SELECT COUNT(*) as total FROM (${query}) as filtered`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total);

    query += ` ORDER BY e.created_at DESC LIMIT $${count} OFFSET $${count + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    const events = result.rows.map(event => formatEventImageUrl(event));

    res.json({
      success: true,
      events: events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Erreur récupération événements admin:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la récupération des événements"
    });
  }
};

// PUT /api/admin/events/:id/approve - Approuver un événement
export const approveEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `UPDATE events SET status = 'active', updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Événement non trouvé"
      });
    }

    const event = formatEventImageUrl(result.rows[0]);

    await pool.query(
      `INSERT INTO notifications (user_id, titre, message, type, lien)
       SELECT id, $1, $2, 'event', $3
       FROM utilisateur
       WHERE role IN ('lecteur', 'auteur', 'editeur')`,
      [
        "Événement approuvé !",
        `Votre événement "${event.title}" a été approuvé et est maintenant visible par tous.`,
        `/events/${id}`,
      ]
    );

    res.json({
      success: true,
      message: "Événement approuvé avec succès",
      event: event,
    });
  } catch (error) {
    console.error("❌ Erreur approbation événement:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de l'approbation de l'événement"
    });
  }
};

// PUT /api/admin/events/:id/reject - Rejeter un événement
export const rejectEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: "Veuillez fournir un motif de rejet détaillé (au moins 10 caractères)"
      });
    }

    const result = await pool.query(
      `UPDATE events SET status = 'rejected', rejection_reason = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 RETURNING *`,
      [reason.trim(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Événement non trouvé"
      });
    }

    const event = result.rows[0];

    res.json({
      success: true,
      message: "Événement rejeté avec succès",
      event: event,
    });
  } catch (error) {
    console.error("❌ Erreur rejet événement:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors du rejet de l'événement"
    });
  }
};

// PUT /api/admin/events/:id/feature - Mettre en avant un événement
export const featureEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    const result = await pool.query(
      `UPDATE events SET featured = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 RETURNING *`,
      [featured, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Événement non trouvé"
      });
    }

    const event = formatEventImageUrl(result.rows[0]);

    res.json({
      success: true,
      message: featured 
        ? "Événement mis en avant avec succès" 
        : "Événement retiré des recommandations",
      event: event,
    });
  } catch (error) {
    console.error("❌ Erreur mise en avant événement:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la mise à jour de l'événement"
    });
  }
};

// GET /api/events/featured - Événements en avant
export const getFeaturedEvents = async (req, res) => {
  try {
    const query = `
      SELECT e.*,
             COALESCE(reg.registered_count, 0) as registered_count
      FROM events e
      LEFT JOIN (
        SELECT event_id, COUNT(*) as registered_count
        FROM event_registrations
        GROUP BY event_id
      ) reg ON e.id = reg.event_id
      WHERE e.featured = true AND e.status = 'active' AND e.event_date > NOW()
      ORDER BY e.event_date ASC
      LIMIT 10
    `;

    const result = await pool.query(query);

    const events = result.rows.map(event => formatEventImageUrl(event));

    res.json({
      success: true,
      events: events,
    });
  } catch (error) {
    console.error("❌ Erreur récupération événements en avant:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

// GET /api/admin/events/analytics - Analytics des événements
export const getEventAnalytics = async (req, res) => {
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

    const statsQuery = `
      SELECT 
        COUNT(*) as totalEvents,
        COUNT(CASE WHEN e.event_date > NOW() THEN 1 END) as upcomingEvents,
        COUNT(CASE WHEN e.event_date <= NOW() THEN 1 END) as pastEvents,
        COALESCE(SUM(reg.registered_count), 0) as totalParticipants,
        COUNT(CASE WHEN e.status = 'active' THEN 1 END) as activeEvents,
        COUNT(CASE WHEN e.status = 'pending' THEN 1 END) as pendingEvents,
        COUNT(CASE WHEN e.status = 'rejected' THEN 1 END) as rejectedEvents
      FROM events e
      LEFT JOIN (
        SELECT event_id, COUNT(*) as registered_count
        FROM event_registrations
        GROUP BY event_id
      ) reg ON e.id = reg.event_id
      WHERE e.created_at >= ${dateFilter}
    `;

    const statsResult = await pool.query(statsQuery);
    const stats = statsResult.rows[0];

    const topEventsQuery = `
      SELECT 
        e.id,
        e.title,
        e.location,
        e.event_date,
        e.max_participants as capacity,
        COALESCE(reg.registered_count, 0) as participants
      FROM events e
      LEFT JOIN (
        SELECT event_id, COUNT(*) as registered_count
        FROM event_registrations
        GROUP BY event_id
      ) reg ON e.id = reg.event_id
      WHERE e.event_date > NOW()
      ORDER BY participants DESC
      LIMIT 5
    `;

    const topEventsResult = await pool.query(topEventsQuery);

    const statusDistribution = [
      { status: 'actif', count: parseInt(stats.activeevents) || 0 },
      { status: 'en attente', count: parseInt(stats.pendingevents) || 0 },
      { status: 'rejeté', count: parseInt(stats.rejectedevents) || 0 },
      { status: 'terminé', count: parseInt(stats.pastevents) || 0 }
    ];

    const totalEventsCount = statusDistribution.reduce((sum, item) => sum + item.count, 0);
    statusDistribution.forEach(item => {
      item.percentage = totalEventsCount > 0 ? Math.round((item.count / totalEventsCount) * 100) : 0;
    });

    const analytics = {
      totalEvents: parseInt(stats.totalevents) || 0,
      totalParticipants: parseInt(stats.totalparticipants) || 0,
      activeEvents: parseInt(stats.activeevents) || 0,
      upcomingEvents: parseInt(stats.upcomingevents) || 0,
      pastEvents: parseInt(stats.pastevents) || 0,
      statusDistribution,
      topEvents: topEventsResult.rows,
    };

    res.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error("❌ Erreur récupération analytics événements:", error);
    res.status(500).json({
      success: false,
      error: "Erreur récupération analytics",
    });
  }
};

// Pour compatibilité avec l'import par défaut (optionnel)
export default {
  getEvents,
  getEventById,
  getDetailById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventRegistrations,
  getAllEventsAdmin,
  approveEvent,
  rejectEvent,
  featureEvent,
  getFeaturedEvents,
  getEventAnalytics,
  cleanImageUrl,
  formatEventImageUrl
};