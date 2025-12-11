// import pool from "../config/db.js";

// export const getEvents = async (req, res) => {
//   try {
//     console.log("🔄 Tentative de récupération des événements...");

//     const result = await pool.query(`
//       SELECT e.*,
//              COALESCE(reg.registered_count, 0) as registered_count
//       FROM events e
//       LEFT JOIN (
//         SELECT event_id, COUNT(*) as registered_count
//         FROM event_registrations
//         GROUP BY event_id
//       ) reg ON e.id = reg.event_id
//       WHERE e.status = 'active'
//       ORDER BY e.event_date ASC
//     `);

//     console.log("✅ Événements récupérés:", result.rows.length);

//     res.json({
//       success: true,
//       events: result.rows,
//     });
//   } catch (error) {
//     console.error("❌ ERREUR DÉTAILLÉE récupération événements:", {
//       message: error.message,
//       code: error.code,
//       detail: error.detail,
//       table: error.table,
//       constraint: error.constraint,
//     });

//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur",
//       details:
//         process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

// export const createEvent = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       event_date,
//       location,
//       max_participants,
//       image_url,
//       price,
//     } = req.body;

//     // Validation des champs requis
//     if (!title || !event_date || !location) {
//       return res.status(400).json({
//         success: false,
//         error: "Les champs titre, date et lieu sont obligatoires",
//       });
//     }

//     const result = await pool.query(
//       `
//       INSERT INTO events (title, description, event_date, location, max_participants, image_url, price, status)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
//       RETURNING *
//     `,
//       [
//         title,
//         description,
//         event_date,
//         location,
//         max_participants,
//         image_url,
//         price || 0,
//       ],
//     );

//     // Create notifications for new events
//     await pool.query(
//       `INSERT INTO notifications (user_id, titre, message, type, lien)
//        SELECT id, $1, $2, 'event', $3
//        FROM utilisateur`,
//       [
//         "Nouvel événement littéraire",
//         `Découvrez "${title}" - ${new Date(event_date).toLocaleDateString('fr-FR')}`,
//         `/events/${result.rows[0].id}`,
//       ],
//     );

//     // Additional notification for webinars (live sessions)
//     if (title.toLowerCase().includes('webinar') || title.toLowerCase().includes('live') || title.toLowerCase().includes('direct')) {
//       await pool.query(
//         `INSERT INTO notifications (user_id, titre, message, type, lien)
//          SELECT id, $1, $2, 'live', $3
//          FROM utilisateur`,
//         [
//           "Session live disponible",
//           `Rejoignez "${title}" en direct - ${new Date(event_date).toLocaleDateString('fr-FR')}`,
//           `/events/${result.rows[0].id}`,
//         ],
//       );
//     }

//     res.status(201).json({
//       success: true,
//       event: result.rows[0],
//     });
//   } catch (error) {
//     console.error("Erreur création événement:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur création événement",
//     });
//   }
// };

// export const getEventById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const result = await pool.query(
//       `
//       SELECT e.*, 
//              COUNT(er.id) as registered_count
//       FROM events e
//       LEFT JOIN event_registrations er ON e.id = er.event_id
//       WHERE e.id = $1
//       GROUP BY e.id
//     `,
//       [id],
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "Événement non trouvé",
//       });
//     }

//     res.json({
//       success: true,
//       event: result.rows[0],
//     });
//   } catch (error) {
//     console.error("Erreur récupération événement:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur",
//     });
//   }
// };

// export const updateEvent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     const allowedFields = [
//       "title",
//       "description",
//       "event_date",
//       "location",
//       "max_participants",
//       "image_url",
//       "price",
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
//       UPDATE events 
//       SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
//       WHERE id = $${paramCount}
//       RETURNING *
//     `;

//     const result = await pool.query(query, updateValues);

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "Événement non trouvé",
//       });
//     }

//     res.json({
//       success: true,
//       event: result.rows[0],
//     });
//   } catch (error) {
//     console.error("Erreur mise à jour événement:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur mise à jour événement",
//     });
//   }
// };

// export const deleteEvent = async (req, res) => {
//   try {
//     const { id } = req.params;

//     console.log(`🗑️ Tentative de suppression de l'événement ${id}`);

//     // Vérifier d'abord si l'événement existe
//     const eventCheck = await pool.query(
//       "SELECT * FROM events WHERE id = $1",
//       [id]
//     );

//     if (eventCheck.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "Événement non trouvé",
//       });
//     }

//     // Supprimer d'abord les inscriptions associées
//     await pool.query(
//       "DELETE FROM event_registrations WHERE event_id = $1",
//       [id]
//     );

//     // Puis supprimer l'événement
//     const result = await pool.query(
//       "DELETE FROM events WHERE id = $1 RETURNING *",
//       [id]
//     );

//     console.log(`✅ Événement ${id} supprimé avec succès`);

//     res.json({
//       success: true,
//       message: "Événement supprimé avec succès",
//       deletedEvent: result.rows[0],
//     });
//   } catch (error) {
//     console.error("❌ Erreur suppression événement:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur lors de la suppression de l'événement",
//       details: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

// export const registerForEvent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user_id = req.user?.id;

//     if (!user_id) {
//       return res.status(401).json({
//         success: false,
//         error: "Utilisateur non authentifié",
//       });
//     }

//     // Vérifier si l'événement existe et a des places disponibles
//     const eventResult = await pool.query(
//       `
//       SELECT e.*, COUNT(er.id) as registered_count
//       FROM events e
//       LEFT JOIN event_registrations er ON e.id = er.event_id
//       WHERE e.id = $1 AND e.status = 'active'
//       GROUP BY e.id
//     `,
//       [id],
//     );

//     if (eventResult.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "Événement non trouvé ou inactif",
//       });
//     }

//     const event = eventResult.rows[0];

//     // Vérifier si des places sont disponibles
//     if (
//       event.max_participants &&
//       event.registered_count >= event.max_participants
//     ) {
//       return res.status(400).json({
//         success: false,
//         error: "Événement complet",
//       });
//     }

//     // Vérifier si l'utilisateur est déjà inscrit
//     const existingRegistration = await pool.query(
//       "SELECT * FROM event_registrations WHERE user_id = $1 AND event_id = $2",
//       [user_id, id],
//     );

//     if (existingRegistration.rows.length > 0) {
//       return res.status(400).json({
//         success: false,
//         error: "Vous êtes déjà inscrit à cet événement",
//       });
//     }

//     // Créer l'inscription
//     const result = await pool.query(
//       `
//       INSERT INTO event_registrations (user_id, event_id)
//       VALUES ($1, $2)
//       RETURNING *
//     `,
//       [user_id, id],
//     );

//     res.status(201).json({
//       success: true,
//       registration: result.rows[0],
//       message: "Inscription réussie !",
//     });
//   } catch (error) {
//     console.error("Erreur inscription événement:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur traitement inscription",
//     });
//   }
// };

// export const getDetailById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     console.log(`🔍 Fetching event details for ID: ${id}`);
    
//     const query = `
//       SELECT 
//         id,
//         title,
//         description,
//         event_date,
//         location,
//         max_participants,
//         image_url,
//         price,
//         status,
//         created_at,
//         updated_at
//       FROM events 
//       WHERE id = $1 AND status = 'active'
//     `;
    
//     const result = await pool.query(query, [id]);
    
//     console.log('📊 Query result:', result.rows);
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Événement non trouvé'
//       });
//     }
    
//     const event = result.rows[0];
    
//     console.log('✅ Event found:', event);
    
//     // Formater la date pour le frontend
//     const formattedEvent = {
//       ...event,
//       event_date: new Date(event.event_date).toISOString()
//     };
    
//     res.json({
//       success: true,
//       data: formattedEvent
//     });
    
//   } catch (error) {
//     console.error('❌ Erreur récupération événement:', error);
//     console.error('🔍 Error details:', {
//       message: error.message,
//       stack: error.stack,
//       code: error.code
//     });
    
//     res.status(500).json({
//       success: false,
//       message: 'Erreur serveur lors de la récupération de l\'événement'
//     });
//   }
// };

// export const getEventRegistrations = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const result = await pool.query(
//       `
//       SELECT er.*, u.first_name, u.last_name, u.email
//       FROM event_registrations er
//       JOIN users u ON er.user_id = u.id
//       WHERE er.event_id = $1
//       ORDER BY er.created_at DESC
//     `,
//       [id],
//     );

//     res.json({
//       success: true,
//       registrations: result.rows,
//     });
//   } catch (error) {
//     console.error("Erreur récupération inscriptions:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur",
//     });
//   }
// };

// // Fonctions d'administration
// export const getAdminEvents = async (req, res) => {
//   try {
//     console.log("🔄 Récupération des événements pour l'admin...");

//     const result = await pool.query(`
//       SELECT e.*,
//              COALESCE(reg.registered_count, 0) as registered_count
//       FROM events e
//       LEFT JOIN (
//         SELECT event_id, COUNT(*) as registered_count
//         FROM event_registrations
//         GROUP BY event_id
//       ) reg ON e.id = reg.event_id
//       ORDER BY e.created_at DESC
//     `);

//     console.log("✅ Événements admin récupérés:", result.rows.length);

//     res.json({
//       success: true,
//       events: result.rows,
//     });
//   } catch (error) {
//     console.error("❌ ERREUR récupération événements admin:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur",
//     });
//   }
// };

// export const approveEvent = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const result = await pool.query(
//       `UPDATE events SET status = 'active', updated_at = CURRENT_TIMESTAMP 
//        WHERE id = $1 RETURNING *`,
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "Événement non trouvé",
//       });
//     }

//     res.json({
//       success: true,
//       event: result.rows[0],
//       message: "Événement approuvé avec succès",
//     });
//   } catch (error) {
//     console.error("❌ Erreur approbation événement:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur lors de l'approbation",
//     });
//   }
// };

// export const rejectEvent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { reason } = req.body;

//     const result = await pool.query(
//       `UPDATE events SET status = 'rejected', updated_at = CURRENT_TIMESTAMP 
//        WHERE id = $1 RETURNING *`,
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "Événement non trouvé",
//       });
//     }

//     // TODO: Envoyer une notification à l'organisateur avec le motif du rejet

//     res.json({
//       success: true,
//       event: result.rows[0],
//       message: "Événement rejeté",
//     });
//   } catch (error) {
//     console.error("❌ Erreur rejet événement:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur lors du rejet",
//     });
//   }
// };

// export const featureEvent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { featured } = req.body;

//     const result = await pool.query(
//       `UPDATE events SET featured = $1, updated_at = CURRENT_TIMESTAMP 
//        WHERE id = $2 RETURNING *`,
//       [featured, id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "Événement non trouvé",
//       });
//     }

//     res.json({
//       success: true,
//       event: result.rows[0],
//       message: featured ? "Événement mis en avant" : "Événement retiré des mises en avant",
//     });
//   } catch (error) {
//     console.error("❌ Erreur mise en avant événement:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur lors de la mise à jour",
//     });
//   }
// };

// export const getEventAnalytics = async (req, res) => {
//   try {
//     const { range = '30d' } = req.query;
    
//     // Calcul des dates en fonction de la plage
//     let dateFilter = '';
//     const now = new Date();
    
//     switch (range) {
//       case '7d':
//         dateFilter = `WHERE e.created_at >= NOW() - INTERVAL '7 days'`;
//         break;
//       case '90d':
//         dateFilter = `WHERE e.created_at >= NOW() - INTERVAL '90 days'`;
//         break;
//       case '1y':
//         dateFilter = `WHERE e.created_at >= NOW() - INTERVAL '1 year'`;
//         break;
//       default: // 30d
//         dateFilter = `WHERE e.created_at >= NOW() - INTERVAL '30 days'`;
//     }

//     // Statistiques générales
//     const statsQuery = `
//       SELECT 
//         COUNT(*) as totalEvents,
//         COUNT(CASE WHEN e.event_date > NOW() THEN 1 END) as upcomingEvents,
//         COUNT(CASE WHEN e.event_date <= NOW() THEN 1 END) as pastEvents,
//         COALESCE(SUM(reg.registered_count), 0) as totalParticipants,
//         COUNT(CASE WHEN e.status = 'active' THEN 1 END) as activeEvents
//       FROM events e
//       LEFT JOIN (
//         SELECT event_id, COUNT(*) as registered_count
//         FROM event_registrations
//         GROUP BY event_id
//       ) reg ON e.id = reg.event_id
//       ${dateFilter}
//     `;

//     const statsResult = await pool.query(statsQuery);
//     const stats = statsResult.rows[0];

//     // Événements les plus populaires
//     const topEventsQuery = `
//       SELECT 
//         e.id,
//         e.title,
//         e.max_participants as capacity,
//         COALESCE(reg.registered_count, 0) as participants
//       FROM events e
//       LEFT JOIN (
//         SELECT event_id, COUNT(*) as registered_count
//         FROM event_registrations
//         GROUP BY event_id
//       ) reg ON e.id = reg.event_id
//       WHERE e.event_date > NOW()
//       ORDER BY participants DESC
//       LIMIT 5
//     `;

//     const topEventsResult = await pool.query(topEventsQuery);

//     res.json({
//       success: true,
//       analytics: {
//         totalEvents: parseInt(stats.totalevents) || 0,
//         totalParticipants: parseInt(stats.totalparticipants) || 0,
//         activeEvents: parseInt(stats.activeevents) || 0,
//         upcomingEvents: parseInt(stats.upcomingevents) || 0,
//         pastEvents: parseInt(stats.pastevents) || 0,
//         topEvents: topEventsResult.rows,
//       }
//     });

//   } catch (error) {
//     console.error("❌ Erreur analytics événements:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur lors du calcul des statistiques",
//     });
//   }
// };

import pool from "../config/db.js";

// CORRIGÉ : Fonction utilitaire pour nettoyer les URLs d'images
const cleanImageUrl = (url, type = "event") => {
  if (!url) return null;
  
  // Si l'URL contient un double chemin (problème détecté)
  if (url.includes('//uploads/')) {
    // Extraire juste le nom de fichier
    const filename = url.split('/').pop();
    return `/uploads/${type}s/${filename}`;
  }
  
  // Si c'est déjà une URL correcte
  if (url.startsWith('/uploads/')) {
    return url;
  }
  
  // Si c'est juste un nom de fichier
  if (!url.startsWith('http') && !url.startsWith('/')) {
    return `/uploads/${type}s/${url}`;
  }
  
  return url;
};

// CORRIGÉ : Fonction pour formater les URLs d'images dans les événements
const formatEventImageUrl = (event) => {
  if (!event) return event;
  
  return {
    ...event,
    image_url: event.image_url ? cleanImageUrl(event.image_url, "event") : null
  };
};

export const getEvents = async (req, res) => {
  try {
    console.log("🔄 Tentative de récupération des événements...");

    const result = await pool.query(`
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
    `);

    console.log("✅ Événements récupérés:", result.rows.length);

    // CORRIGÉ : Nettoyer les URLs d'images
    const events = result.rows.map(event => formatEventImageUrl(event));

    res.json({
      success: true,
      events: events,
    });
  } catch (error) {
    console.error("❌ ERREUR DÉTAILLÉE récupération événements:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      table: error.table,
      constraint: error.constraint,
    });

    res.status(500).json({
      success: false,
      error: "Erreur serveur",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

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
    } = req.body;

    // Validation des champs requis
    if (!title || !event_date || !location) {
      return res.status(400).json({
        success: false,
        error: "Les champs titre, date et lieu sont obligatoires",
      });
    }

    // CORRIGÉ : Nettoyer l'URL de l'image
    const cleanImageUrlValue = cleanImageUrl(image_url, "event");

    const result = await pool.query(
      `
      INSERT INTO events (title, description, event_date, location, max_participants, image_url, price, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
      RETURNING *
    `,
      [
        title,
        description,
        event_date,
        location,
        max_participants,
        cleanImageUrlValue,
        price || 0,
      ],
    );

    const event = formatEventImageUrl(result.rows[0]);

    // Create notifications for new events
    await pool.query(
      `INSERT INTO notifications (user_id, titre, message, type, lien)
       SELECT id, $1, $2, 'event', $3
       FROM utilisateur`,
      [
        "Nouvel événement littéraire",
        `Découvrez "${title}" - ${new Date(event_date).toLocaleDateString('fr-FR')}`,
        `/events/${event.id}`,
      ],
    );

    // Additional notification for webinars (live sessions)
    if (title.toLowerCase().includes('webinar') || title.toLowerCase().includes('live') || title.toLowerCase().includes('direct')) {
      await pool.query(
        `INSERT INTO notifications (user_id, titre, message, type, lien)
         SELECT id, $1, $2, 'live', $3
         FROM utilisateur`,
        [
          "Session live disponible",
          `Rejoignez "${title}" en direct - ${new Date(event_date).toLocaleDateString('fr-FR')}`,
          `/events/${event.id}`,
        ],
      );
    }

    res.status(201).json({
      success: true,
      event: event,
    });
  } catch (error) {
    console.error("Erreur création événement:", error);
    res.status(500).json({
      success: false,
      error: "Erreur création événement",
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT e.*, 
             COUNT(er.id) as registered_count
      FROM events e
      LEFT JOIN event_registrations er ON e.id = er.event_id
      WHERE e.id = $1
      GROUP BY e.id
    `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Événement non trouvé",
      });
    }

    // CORRIGÉ : Nettoyer l'URL de l'image
    const event = formatEventImageUrl(result.rows[0]);

    res.json({
      success: true,
      event: event,
    });
  } catch (error) {
    console.error("Erreur récupération événement:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};

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
        // CORRIGÉ : Nettoyer l'URL si c'est le champ image_url
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
        error: "Aucun champ à mettre à jour",
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
        error: "Événement non trouvé",
      });
    }

    // CORRIGÉ : Nettoyer l'URL de l'image
    const event = formatEventImageUrl(result.rows[0]);

    res.json({
      success: true,
      event: event,
    });
  } catch (error) {
    console.error("Erreur mise à jour événement:", error);
    res.status(500).json({
      success: false,
      error: "Erreur mise à jour événement",
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🗑️ Tentative de suppression de l'événement ${id}`);

    // Vérifier d'abord si l'événement existe
    const eventCheck = await pool.query(
      "SELECT * FROM events WHERE id = $1",
      [id]
    );

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Événement non trouvé",
      });
    }

    // Supprimer d'abord les inscriptions associées
    await pool.query(
      "DELETE FROM event_registrations WHERE event_id = $1",
      [id]
    );

    // Puis supprimer l'événement
    const result = await pool.query(
      "DELETE FROM events WHERE id = $1 RETURNING *",
      [id]
    );

    console.log(`✅ Événement ${id} supprimé avec succès`);

    res.json({
      success: true,
      message: "Événement supprimé avec succès",
      deletedEvent: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Erreur suppression événement:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la suppression de l'événement",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        error: "Utilisateur non authentifié",
      });
    }

    // Vérifier si l'événement existe et a des places disponibles
    const eventResult = await pool.query(
      `
      SELECT e.*, COUNT(er.id) as registered_count
      FROM events e
      LEFT JOIN event_registrations er ON e.id = er.event_id
      WHERE e.id = $1 AND e.status = 'active'
      GROUP BY e.id
    `,
      [id],
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Événement non trouvé ou inactif",
      });
    }

    const event = eventResult.rows[0];

    // Vérifier si des places sont disponibles
    if (
      event.max_participants &&
      event.registered_count >= event.max_participants
    ) {
      return res.status(400).json({
        success: false,
        error: "Événement complet",
      });
    }

    // Vérifier si l'utilisateur est déjà inscrit
    const existingRegistration = await pool.query(
      "SELECT * FROM event_registrations WHERE user_id = $1 AND event_id = $2",
      [user_id, id],
    );

    if (existingRegistration.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Vous êtes déjà inscrit à cet événement",
      });
    }

    // Créer l'inscription
    const result = await pool.query(
      `
      INSERT INTO event_registrations (user_id, event_id)
      VALUES ($1, $2)
      RETURNING *
    `,
      [user_id, id],
    );

    res.status(201).json({
      success: true,
      registration: result.rows[0],
      message: "Inscription réussie !",
    });
  } catch (error) {
    console.error("Erreur inscription événement:", error);
    res.status(500).json({
      success: false,
      error: "Erreur traitement inscription",
    });
  }
};

export const getDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🔍 Fetching event details for ID: ${id}`);
    
    const query = `
      SELECT 
        id,
        title,
        description,
        event_date,
        location,
        max_participants,
        image_url,
        price,
        status,
        created_at,
        updated_at
      FROM events 
      WHERE id = $1 AND status = 'active'
    `;
    
    const result = await pool.query(query, [id]);
    
    console.log('📊 Query result:', result.rows);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }
    
    // CORRIGÉ : Nettoyer l'URL de l'image
    const event = formatEventImageUrl(result.rows[0]);
    
    console.log('✅ Event found:', event);
    
    // Formater la date pour le frontend
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
    console.error('🔍 Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de l\'événement'
    });
  }
};

export const getEventRegistrations = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT er.*, u.first_name, u.last_name, u.email
      FROM event_registrations er
      JOIN users u ON er.user_id = u.id
      WHERE er.event_id = $1
      ORDER BY er.created_at DESC
    `,
      [id],
    );

    res.json({
      success: true,
      registrations: result.rows,
    });
  } catch (error) {
    console.error("Erreur récupération inscriptions:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};

// Fonctions d'administration
export const getAdminEvents = async (req, res) => {
  try {
    console.log("🔄 Récupération des événements pour l'admin...");

    const result = await pool.query(`
      SELECT e.*,
             COALESCE(reg.registered_count, 0) as registered_count
      FROM events e
      LEFT JOIN (
        SELECT event_id, COUNT(*) as registered_count
        FROM event_registrations
        GROUP BY event_id
      ) reg ON e.id = reg.event_id
      ORDER BY e.created_at DESC
    `);

    console.log("✅ Événements admin récupérés:", result.rows.length);

    // CORRIGÉ : Nettoyer les URLs d'images
    const events = result.rows.map(event => formatEventImageUrl(event));

    res.json({
      success: true,
      events: events,
    });
  } catch (error) {
    console.error("❌ ERREUR récupération événements admin:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};

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
        error: "Événement non trouvé",
      });
    }

    // CORRIGÉ : Nettoyer l'URL de l'image
    const event = formatEventImageUrl(result.rows[0]);

    res.json({
      success: true,
      event: event,
      message: "Événement approuvé avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur approbation événement:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de l'approbation",
    });
  }
};

export const rejectEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const result = await pool.query(
      `UPDATE events SET status = 'rejected', updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Événement non trouvé",
      });
    }

    // TODO: Envoyer une notification à l'organisateur avec le motif du rejet

    res.json({
      success: true,
      event: result.rows[0],
      message: "Événement rejeté",
    });
  } catch (error) {
    console.error("❌ Erreur rejet événement:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors du rejet",
    });
  }
};

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
        error: "Événement non trouvé",
      });
    }

    // CORRIGÉ : Nettoyer l'URL de l'image
    const event = formatEventImageUrl(result.rows[0]);

    res.json({
      success: true,
      event: event,
      message: featured ? "Événement mis en avant" : "Événement retiré des mises en avant",
    });
  } catch (error) {
    console.error("❌ Erreur mise en avant événement:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la mise à jour",
    });
  }
};

export const getEventAnalytics = async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    
    // Calcul des dates en fonction de la plage
    let dateFilter = '';
    const now = new Date();
    
    switch (range) {
      case '7d':
        dateFilter = `WHERE e.created_at >= NOW() - INTERVAL '7 days'`;
        break;
      case '90d':
        dateFilter = `WHERE e.created_at >= NOW() - INTERVAL '90 days'`;
        break;
      case '1y':
        dateFilter = `WHERE e.created_at >= NOW() - INTERVAL '1 year'`;
        break;
      default: // 30d
        dateFilter = `WHERE e.created_at >= NOW() - INTERVAL '30 days'`;
    }

    // Statistiques générales
    const statsQuery = `
      SELECT 
        COUNT(*) as totalEvents,
        COUNT(CASE WHEN e.event_date > NOW() THEN 1 END) as upcomingEvents,
        COUNT(CASE WHEN e.event_date <= NOW() THEN 1 END) as pastEvents,
        COALESCE(SUM(reg.registered_count), 0) as totalParticipants,
        COUNT(CASE WHEN e.status = 'active' THEN 1 END) as activeEvents
      FROM events e
      LEFT JOIN (
        SELECT event_id, COUNT(*) as registered_count
        FROM event_registrations
        GROUP BY event_id
      ) reg ON e.id = reg.event_id
      ${dateFilter}
    `;

    const statsResult = await pool.query(statsQuery);
    const stats = statsResult.rows[0];

    // Événements les plus populaires
    const topEventsQuery = `
      SELECT 
        e.id,
        e.title,
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

    res.json({
      success: true,
      analytics: {
        totalEvents: parseInt(stats.totalevents) || 0,
        totalParticipants: parseInt(stats.totalparticipants) || 0,
        activeEvents: parseInt(stats.activeevents) || 0,
        upcomingEvents: parseInt(stats.upcomingevents) || 0,
        pastEvents: parseInt(stats.pastevents) || 0,
        topEvents: topEventsResult.rows,
      }
    });

  } catch (error) {
    console.error("❌ Erreur analytics événements:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors du calcul des statistiques",
    });
  }
};

// Export des fonctions utilitaires
export { cleanImageUrl, formatEventImageUrl };