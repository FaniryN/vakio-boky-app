// import express from "express";
// import pool from "../config/db.js";
// import adminGuard from "../middleware/adminGuard.js";

// const router = express.Router();

// // GET tous les utilisateurs
// router.get("/", adminGuard, async (req, res) => {
//   try {
//     console.log("🔐 Utilisateur faisant la requête:", req.user);
    
//     const result = await pool.query(`
//       SELECT 
//         id, nom, email, telephone, genre_prefere, role, bio, 
//         photo_profil, accepte_newsletter, created_at, updated_at
//       FROM utilisateur 
//       ORDER BY created_at DESC
//     `);

//     res.json({
//       success: true,
//       users: result.rows,
//     });
//   } catch (error) {
//     console.error("❌ Erreur récupération utilisateurs:", error);
//     res.status(500).json({ 
//       success: false, 
//       error: "Erreur lors de la récupération des utilisateurs" 
//     });
//   }
// });

// // GET un utilisateur spécifique
// router.get("/:id", adminGuard, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const result = await pool.query(`
//       SELECT 
//         id, nom, email, telephone, genre_prefere, role, bio, 
//         photo_profil, accepte_newsletter, created_at, updated_at
//       FROM utilisateur 
//       WHERE id = $1
//     `, [id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "Utilisateur non trouvé"
//       });
//     }

//     res.json({
//       success: true,
//       user: result.rows[0],
//     });
//   } catch (error) {
//     console.error("❌ Erreur récupération utilisateur:", error);
//     res.status(500).json({ 
//       success: false, 
//       error: "Erreur lors de la récupération de l'utilisateur" 
//     });
//   }
// });

// // PUT modifier un utilisateur
// router.put("/:id", adminGuard, async (req, res) => {
//   const client = await pool.connect();
  
//   try {
//     const { id } = req.params;
//     const { nom, email, telephone, genre_prefere, bio } = req.body;

//     console.log(`✏️ Modification utilisateur ${id}:`, req.body);

//     // Démarrer une transaction
//     await client.query('BEGIN');

//     // Vérifier si l'utilisateur existe
//     const userCheck = await client.query(
//       "SELECT id FROM utilisateur WHERE id = $1 FOR UPDATE",
//       [id]
//     );

//     if (userCheck.rows.length === 0) {
//       await client.query('ROLLBACK');
//       return res.status(404).json({
//         success: false,
//         error: "Utilisateur non trouvé"
//       });
//     }

//     // Mettre à jour l'utilisateur
//     await client.query(
//       `UPDATE utilisateur 
//        SET nom = $1, email = $2, telephone = $3, 
//            genre_prefere = $4, bio = $5, updated_at = NOW()
//        WHERE id = $6`,
//       [nom, email, telephone, genre_prefere, bio, id]
//     );

//     await client.query('COMMIT');

//     res.json({
//       success: true,
//       message: "Utilisateur modifié avec succès"
//     });
//   } catch (error) {
//     await client.query('ROLLBACK');
//     console.error("❌ Erreur modification utilisateur:", error);
    
//     if (error.code === '23505') { // Violation de contrainte unique
//       return res.status(400).json({
//         success: false,
//         error: "Un utilisateur avec cet email existe déjà"
//       });
//     }
    
//     res.status(500).json({
//       success: false,
//       error: "Erreur lors de la modification de l'utilisateur"
//     });
//   } finally {
//     client.release();
//   }
// });

// // PUT modifier le rôle d'un utilisateur
// router.put("/:id/promote", adminGuard, async (req, res) => {
//   const client = await pool.connect();
  
//   try {
//     const { id } = req.params;
//     const { newRole } = req.body;

//     console.log(`🔄 Promotion utilisateur ${id} vers rôle: ${newRole}`);

//     // Valider le rôle
//     const validRoles = ['lecteur', 'auteur', 'editeur', 'admin'];
//     if (!validRoles.includes(newRole)) {
//       return res.status(400).json({
//         success: false,
//         error: "Rôle invalide. Rôles autorisés: lecteur, auteur, editeur, admin"
//       });
//     }

//     // Démarrer une transaction
//     await client.query('BEGIN');

//     // Empêcher de se retirer les droits admin à soi-même
//     if (parseInt(id) === req.user.id && newRole !== 'admin') {
//       await client.query('ROLLBACK');
//       return res.status(400).json({
//         success: false,
//         error: "Vous ne pouvez pas retirer vos propres droits administrateur"
//       });
//     }

//     // Vérifier si l'utilisateur existe
//     const userCheck = await client.query(
//       "SELECT id, role FROM utilisateur WHERE id = $1 FOR UPDATE",
//       [id]
//     );

//     if (userCheck.rows.length === 0) {
//       await client.query('ROLLBACK');
//       return res.status(404).json({
//         success: false,
//         error: "Utilisateur non trouvé"
//       });
//     }

//     // Mettre à jour le rôle
//     await client.query(
//       "UPDATE utilisateur SET role = $1, updated_at = NOW() WHERE id = $2",
//       [newRole, id]
//     );

//     await client.query('COMMIT');

//     res.json({
//       success: true,
//       message: "Rôle mis à jour avec succès"
//     });
//   } catch (error) {
//     await client.query('ROLLBACK');
//     console.error("❌ Erreur modification rôle:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur lors de la modification du rôle"
//     });
//   } finally {
//     client.release();
//   }
// });

// // PUT bloquer/débloquer un utilisateur
// router.put("/:id/block", adminGuard, async (req, res) => {
//   const client = await pool.connect();
  
//   try {
//     const { id } = req.params;
//     const { action } = req.body;

//     console.log(`🚫 Action sur utilisateur ${id}: ${action}`);

//     // Démarrer une transaction
//     await client.query('BEGIN');

//     // Empêcher de se bloquer soi-même
//     if (parseInt(id) === req.user.id) {
//       await client.query('ROLLBACK');
//       return res.status(400).json({
//         success: false,
//         error: "Vous ne pouvez pas vous bloquer vous-même"
//       });
//     }

//     // Vérifier si l'utilisateur existe
//     const userCheck = await client.query(
//       "SELECT id, role FROM utilisateur WHERE id = $1 FOR UPDATE",
//       [id]
//     );

//     if (userCheck.rows.length === 0) {
//       await client.query('ROLLBACK');
//       return res.status(404).json({
//         success: false,
//         error: "Utilisateur non trouvé"
//       });
//     }

//     const user = userCheck.rows[0];

//     // Déterminer le nouveau rôle
//     let newRole;
//     let actionText;
    
//     if (action === 'block') {
//       // Vérifier si c'est un admin
//       if (user.role === 'admin') {
//         await client.query('ROLLBACK');
//         return res.status(400).json({
//           success: false,
//           error: "Impossible de bloquer un administrateur"
//         });
//       }
//       newRole = 'blocked';
//       actionText = 'bloqué';
//     } else if (action === 'unblock') {
//       newRole = 'lecteur';
//       actionText = 'débloqué';
//     } else {
//       await client.query('ROLLBACK');
//       return res.status(400).json({
//         success: false,
//         error: "Action non valide. Utilisez 'block' ou 'unblock'"
//       });
//     }

//     // Mettre à jour
//     await client.query(
//       "UPDATE utilisateur SET role = $1, updated_at = NOW() WHERE id = $2",
//       [newRole, id]
//     );

//     await client.query('COMMIT');

//     res.json({
//       success: true,
//       message: `Utilisateur ${actionText} avec succès`
//     });
//   } catch (error) {
//     await client.query('ROLLBACK');
//     console.error("❌ Erreur blocage utilisateur:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur lors de l'opération"
//     });
//   } finally {
//     client.release();
//   }
// });

// // // DELETE supprimer un utilisateur
// // router.delete("/:id", adminGuard, async (req, res) => {
// //   const client = await pool.connect();
  
// //   try {
// //     const { id } = req.params;

// //     console.log(`🗑️ Suppression utilisateur ${id}`);

// //     // Démarrer une transaction
// //     await client.query('BEGIN');

// //     // Empêcher de se supprimer soi-même
// //     if (parseInt(id) === req.user.id) {
// //       await client.query('ROLLBACK');
// //       return res.status(400).json({
// //         success: false,
// //         error: "Vous ne pouvez pas supprimer votre propre compte"
// //       });
// //     }

// //     // Vérifier si l'utilisateur existe
// //     const userCheck = await client.query(
// //       "SELECT id, role FROM utilisateur WHERE id = $1 FOR UPDATE",
// //       [id]
// //     );

// //     if (userCheck.rows.length === 0) {
// //       await client.query('ROLLBACK');
// //       return res.status(404).json({
// //         success: false,
// //         error: "Utilisateur non trouvé"
// //       });
// //     }

// //     const user = userCheck.rows[0];

// //     // Empêcher de supprimer un admin
// //     if (user.role === 'admin') {
// //       await client.query('ROLLBACK');
// //       return res.status(400).json({
// //         success: false,
// //         error: "Impossible de supprimer un administrateur"
// //       });
// //     }

// //     // Vérifier les données liées avant suppression
// //     const checkTables = [
// //       { table: 'orders', column: 'user_id' },
// //       { table: 'posts', column: 'user_id' },
// //       { table: 'comments', column: 'user_id' },
// //       { table: 'notifications', column: 'user_id' },
// //       { table: 'donations', column: 'user_id' },
// //       { table: 'campaigns', column: 'user_id' }
// //     ];

// //     for (const { table, column } of checkTables) {
// //       const result = await client.query(
// //         `SELECT COUNT(*) as count FROM ${table} WHERE ${column} = $1`,
// //         [id]
// //       );
      
// //       if (parseInt(result.rows[0].count) > 0) {
// //         await client.query('ROLLBACK');
// //         return res.status(400).json({
// //           success: false,
// //           error: `Impossible de supprimer : l'utilisateur a des données dans ${table}. Supprimez d'abord ces données ou bloquez l'utilisateur.`
// //         });
// //       }
// //     }

// //     // Supprimer l'utilisateur
// //     await client.query("DELETE FROM utilisateur WHERE id = $1", [id]);

// //     await client.query('COMMIT');

// //     res.json({
// //       success: true,
// //       message: "Utilisateur supprimé avec succès"
// //     });
// //   } catch (error) {
// //     await client.query('ROLLBACK');
// //     console.error("❌ Erreur suppression utilisateur:", error);
    
// //     if (error.code === '23503') {
// //       return res.status(400).json({
// //         success: false,
// //         error: "Impossible de supprimer : l'utilisateur a des données liées dans d'autres tables."
// //       });
// //     }
    
// //     res.status(500).json({
// //       success: false,
// //       error: "Erreur lors de la suppression"
// //     });
// //   } finally {
// //     client.release();
// //   }
// // });
// // DELETE supprimer un utilisateur - VERSION AVEC CASCADE
// router.delete("/:id", adminGuard, async (req, res) => {
//   const client = await pool.connect();
  
//   try {
//     const { id } = req.params;

//     console.log(`🗑️ Suppression utilisateur ${id}`);

//     // Démarrer une transaction
//     await client.query('BEGIN');

//     // Empêcher de se supprimer soi-même
//     if (parseInt(id) === req.user.id) {
//       await client.query('ROLLBACK');
//       return res.status(400).json({
//         success: false,
//         error: "Vous ne pouvez pas supprimer votre propre compte"
//       });
//     }

//     // Vérifier si l'utilisateur existe
//     const userCheck = await client.query(
//       "SELECT id, nom, role FROM utilisateur WHERE id = $1 FOR UPDATE",
//       [id]
//     );

//     if (userCheck.rows.length === 0) {
//       await client.query('ROLLBACK');
//       return res.status(404).json({
//         success: false,
//         error: "Utilisateur non trouvé"
//       });
//     }

//     const user = userCheck.rows[0];

//     // Empêcher de supprimer un admin
//     if (user.role === 'admin') {
//       await client.query('ROLLBACK');
//       return res.status(400).json({
//         success: false,
//         error: "Impossible de supprimer un administrateur"
//       });
//     }

//     // Vérifier si l'utilisateur a des données importantes
//     const hasOrders = await client.query(
//       "SELECT COUNT(*) as count FROM orders WHERE user_id = $1",
//       [id]
//     );

//     const hasPosts = await client.query(
//       "SELECT COUNT(*) as count FROM posts WHERE user_id = $1",
//       [id]
//     );

//     const hasImportantData = 
//       parseInt(hasOrders.rows[0].count) > 0 ||
//       parseInt(hasPosts.rows[0].count) > 0;

//     if (hasImportantData) {
//       // Demander confirmation supplémentaire
//       // Note: Dans le frontend, affichez un message spécial pour cette confirmation
//       console.log(`⚠️ Utilisateur ${id} a des données importantes:`);
//       console.log(`   - Commandes: ${hasOrders.rows[0].count}`);
//       console.log(`   - Posts: ${hasPosts.rows[0].count}`);
      
//       // On continue quand même la suppression (cascade devrait gérer)
//     }

//     try {
//       // Supprimer l'utilisateur (les contraintes CASCADE feront le reste)
//       await client.query("DELETE FROM utilisateur WHERE id = $1", [id]);
      
//       await client.query('COMMIT');
      
//       console.log(`✅ Utilisateur ${id} supprimé avec succès`);
      
//       res.json({
//         success: true,
//         message: `Utilisateur "${user.nom}" supprimé avec succès`,
//         warning: hasImportantData ? 
//           "Les données associées (commandes, posts, etc.) ont également été supprimées." : 
//           null
//       });
      
//     } catch (deleteError) {
//       await client.query('ROLLBACK');
      
//       // Si c'est une erreur de contrainte, donner la solution SQL
//       if (deleteError.code === '23503') {
//         console.error("❌ Contrainte de clé étrangère bloquante:", deleteError.detail);
        
//         return res.status(400).json({
//           success: false,
//           error: "Impossible de supprimer à cause de contraintes de base de données",
//           instructions: `Exécutez cette commande SQL pour autoriser la suppression:\n\nALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;\nALTER TABLE orders ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES utilisateur(id) ON DELETE CASCADE;`,
//           sqlError: deleteError.detail
//         });
//       }
      
//       throw deleteError;
//     }
    
//   } catch (error) {
//     try {
//       await client.query('ROLLBACK');
//     } catch (rollbackError) {
//       console.error("❌ Erreur rollback:", rollbackError);
//     }
    
//     console.error("❌ Erreur suppression utilisateur:", error);
    
//     res.status(500).json({
//       success: false,
//       error: "Erreur lors de la suppression",
//       details: error.message
//     });
//   } finally {
//     client.release();
//   }
// });

// export default router;
import express from "express";
import pool from "../config/db.js";
import adminGuard from "../middleware/adminGuard.js";

const router = express.Router();

// GET tous les utilisateurs
router.get("/", adminGuard, async (req, res) => {
  try {
    console.log("🔐 Utilisateur faisant la requête:", req.user);
    
    const result = await pool.query(`
      SELECT 
        id, nom, email, telephone, genre_prefere, role, bio, 
        photo_profil, accepte_newsletter, created_at, updated_at
      FROM utilisateur 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      users: result.rows,
    });
  } catch (error) {
    console.error("❌ Erreur récupération utilisateurs:", error);
    res.status(500).json({ 
      success: false, 
      error: "Erreur lors de la récupération des utilisateurs" 
    });
  }
});

// GET un utilisateur spécifique
router.get("/:id", adminGuard, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        id, nom, email, telephone, genre_prefere, role, bio, 
        photo_profil, accepte_newsletter, created_at, updated_at
      FROM utilisateur 
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé"
      });
    }

    res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Erreur récupération utilisateur:", error);
    res.status(500).json({ 
      success: false, 
      error: "Erreur lors de la récupération de l'utilisateur" 
    });
  }
});

// PUT modifier un utilisateur
router.put("/:id", adminGuard, async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    const { nom, email, telephone, genre_prefere, bio } = req.body;

    console.log(`✏️ Modification utilisateur ${id}:`, req.body);

    // Démarrer une transaction
    await client.query('BEGIN');

    // Vérifier si l'utilisateur existe
    const userCheck = await client.query(
      "SELECT id FROM utilisateur WHERE id = $1 FOR UPDATE",
      [id]
    );

    if (userCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé"
      });
    }

    // Mettre à jour l'utilisateur
    await client.query(
      `UPDATE utilisateur 
       SET nom = $1, email = $2, telephone = $3, 
           genre_prefere = $4, bio = $5, updated_at = NOW()
       WHERE id = $6`,
      [nom, email, telephone, genre_prefere, bio, id]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: "Utilisateur modifié avec succès"
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("❌ Erreur modification utilisateur:", error);
    
    if (error.code === '23505') { // Violation de contrainte unique
      return res.status(400).json({
        success: false,
        error: "Un utilisateur avec cet email existe déjà"
      });
    }
    
    res.status(500).json({
      success: false,
      error: "Erreur lors de la modification de l'utilisateur"
    });
  } finally {
    client.release();
  }
});

// PUT modifier le rôle d'un utilisateur
router.put("/:id/promote", adminGuard, async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    const { newRole } = req.body;

    console.log(`🔄 Promotion utilisateur ${id} vers rôle: ${newRole}`);

    // Valider le rôle
    const validRoles = ['lecteur', 'auteur', 'editeur', 'admin'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({
        success: false,
        error: "Rôle invalide. Rôles autorisés: lecteur, auteur, editeur, admin"
      });
    }

    // Démarrer une transaction
    await client.query('BEGIN');

    // Empêcher de se retirer les droits admin à soi-même
    if (parseInt(id) === req.user.id && newRole !== 'admin') {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: "Vous ne pouvez pas retirer vos propres droits administrateur"
      });
    }

    // Vérifier si l'utilisateur existe
    const userCheck = await client.query(
      "SELECT id, role FROM utilisateur WHERE id = $1 FOR UPDATE",
      [id]
    );

    if (userCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé"
      });
    }

    // Mettre à jour le rôle
    await client.query(
      "UPDATE utilisateur SET role = $1, updated_at = NOW() WHERE id = $2",
      [newRole, id]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: "Rôle mis à jour avec succès"
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("❌ Erreur modification rôle:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la modification du rôle"
    });
  } finally {
    client.release();
  }
});

// PUT bloquer/débloquer un utilisateur
router.put("/:id/block", adminGuard, async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    const { action } = req.body;

    console.log(`🚫 Action sur utilisateur ${id}: ${action}`);

    // Démarrer une transaction
    await client.query('BEGIN');

    // Empêcher de se bloquer soi-même
    if (parseInt(id) === req.user.id) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: "Vous ne pouvez pas vous bloquer vous-même"
      });
    }

    // Vérifier si l'utilisateur existe
    const userCheck = await client.query(
      "SELECT id, role FROM utilisateur WHERE id = $1 FOR UPDATE",
      [id]
    );

    if (userCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé"
      });
    }

    const user = userCheck.rows[0];

    // Déterminer le nouveau rôle
    let newRole;
    let actionText;
    
    if (action === 'block') {
      // Vérifier si c'est un admin
      if (user.role === 'admin') {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          error: "Impossible de bloquer un administrateur"
        });
      }
      newRole = 'blocked';
      actionText = 'bloqué';
    } else if (action === 'unblock') {
      newRole = 'lecteur';
      actionText = 'débloqué';
    } else {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: "Action non valide. Utilisez 'block' ou 'unblock'"
      });
    }

    // Mettre à jour
    await client.query(
      "UPDATE utilisateur SET role = $1, updated_at = NOW() WHERE id = $2",
      [newRole, id]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: `Utilisateur ${actionText} avec succès`
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("❌ Erreur blocage utilisateur:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de l'opération"
    });
  } finally {
    client.release();
  }
});

// DELETE supprimer un utilisateur - VERSION FINALE ADAPTÉE À VOTRE SCHÉMA
router.delete("/:id", adminGuard, async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;

    console.log(`🗑️ Suppression utilisateur ${id}`);

    // Démarrer une transaction
    await client.query('BEGIN');

    // Empêcher de se supprimer soi-même
    if (parseInt(id) === req.user.id) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: "Vous ne pouvez pas supprimer votre propre compte"
      });
    }

    // Vérifier si l'utilisateur existe
    const userCheck = await client.query(
      "SELECT id, nom, role FROM utilisateur WHERE id = $1 FOR UPDATE",
      [id]
    );

    if (userCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé"
      });
    }

    const user = userCheck.rows[0];

    // Empêcher de supprimer un admin
    if (user.role === 'admin') {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: "Impossible de supprimer un administrateur"
      });
    }

    // Vérifier si l'utilisateur a des données importantes (ADAPTÉ À VOTRE SCHÉMA)
    try {
      const hasOrders = await client.query(
        "SELECT COUNT(*) as count FROM orders WHERE user_id = $1",
        [id]
      );
      console.log(`📊 Commandes: ${hasOrders.rows[0].count}`);
    } catch (orderError) {
      console.log("ℹ️ Table orders non accessible ou colonne user_id inexistante");
    }

    try {
      const hasPosts = await client.query(
        "SELECT COUNT(*) as count FROM posts WHERE auteur_id = $1",
        [id]
      );
      console.log(`📊 Posts: ${hasPosts.rows[0].count}`);
    } catch (postError) {
      console.log("ℹ️ Table posts non accessible ou colonne auteur_id inexistante");
    }

    try {
      const hasComments = await client.query(
        "SELECT COUNT(*) as count FROM comments WHERE user_id = $1",
        [id]
      );
      console.log(`📊 Commentaires: ${hasComments.rows[0].count}`);
    } catch (commentError) {
      console.log("ℹ️ Table comments non accessible");
    }

    // Tenter la suppression directe (les contraintes CASCADE devraient gérer)
    try {
      const result = await client.query(
        "DELETE FROM utilisateur WHERE id = $1 RETURNING nom",
        [id]
      );

      if (result.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          error: "Utilisateur non trouvé"
        });
      }

      await client.query('COMMIT');
      
      console.log(`✅ Utilisateur ${id} supprimé avec succès`);
      
      res.json({
        success: true,
        message: `Utilisateur "${result.rows[0].nom}" supprimé avec succès`,
        warning: "Les données associées ont été supprimées automatiquement."
      });
      
    } catch (deleteError) {
      await client.query('ROLLBACK');
      
      // Si c'est une erreur de contrainte, analyser et donner la solution
      if (deleteError.code === '23503') {
        console.error("❌ Contrainte de clé étrangère bloquante:", deleteError.detail);
        
        // Analyser l'erreur pour savoir quelle table pose problème
        let problematicTable = "une table inconnue";
        if (deleteError.detail && deleteError.detail.includes("orders")) {
          problematicTable = "orders";
        } else if (deleteError.detail && deleteError.detail.includes("posts")) {
          problematicTable = "posts";
        } else if (deleteError.detail && deleteError.detail.includes("comments")) {
          problematicTable = "comments";
        }
        
        return res.status(400).json({
          success: false,
          error: `Impossible de supprimer : l'utilisateur a des données dans ${problematicTable}.`,
          instructions: `Exécutez cette commande SQL pour autoriser la suppression:\n\nALTER TABLE ${problematicTable} DROP CONSTRAINT ${problematicTable}_user_id_fkey;\nALTER TABLE ${problematicTable} ADD CONSTRAINT ${problematicTable}_user_id_fkey FOREIGN KEY (user_id) REFERENCES utilisateur(id) ON DELETE CASCADE;`,
          sqlError: deleteError.detail
        });
      }
      
      throw deleteError;
    }
    
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error("❌ Erreur rollback:", rollbackError);
    }
    
    console.error("❌ Erreur suppression utilisateur:", error);
    
    res.status(500).json({
      success: false,
      error: "Erreur lors de la suppression",
      details: error.message
    });
  } finally {
    client.release();
  }
});

// ROUTE OPTIONNELLE : Fixer les contraintes CASCADE
router.post("/fix-constraints", adminGuard, async (req, res) => {
  const client = await pool.connect();
  
  try {
    console.log("🔧 Tentative de correction des contraintes...");
    
    await client.query('BEGIN');
    
    // Liste des tables avec leurs colonnes spécifiques (selon votre schéma)
    const tables = [
      { table: 'orders', column: 'user_id' },
      { table: 'posts', column: 'auteur_id' },
      { table: 'comments', column: 'user_id' },
      { table: 'donations', column: 'user_id' },
      { table: 'campaigns', column: 'user_id' },
      { table: 'notifications', column: 'user_id' }
    ];
    
    const results = [];
    
    for (const { table, column } of tables) {
      try {
        // Vérifier si la table existe
        const tableExists = await client.query(
          `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '${table}')`
        );
        
        if (!tableExists.rows[0].exists) {
          results.push({ table, status: "Non existante" });
          continue;
        }
        
        // Vérifier si la colonne existe
        const columnExists = await client.query(
          `SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_name = '${table}' AND column_name = '${column}')`
        );
        
        if (!columnExists.rows[0].exists) {
          results.push({ table, column, status: "Colonne inexistante" });
          continue;
        }
        
        // Supprimer l'ancienne contrainte si elle existe
        await client.query(`
          DO $$ 
          BEGIN
            BEGIN
              ALTER TABLE ${table} DROP CONSTRAINT ${table}_${column}_fkey;
              RAISE NOTICE 'Contrainte ${table}_${column}_fkey supprimée';
            EXCEPTION WHEN OTHERS THEN
              RAISE NOTICE 'Contrainte ${table}_${column}_fkey non trouvée ou déjà supprimée';
            END;
          END $$;
        `);
        
        // Recréer avec CASCADE
        await client.query(`
          ALTER TABLE ${table}
          ADD CONSTRAINT ${table}_${column}_fkey 
          FOREIGN KEY (${column}) 
          REFERENCES utilisateur(id) 
          ON DELETE CASCADE
        `);
        
        results.push({ table, column, status: "Corrigée avec CASCADE" });
        console.log(`✅ Contrainte ${table}.${column} corrigée`);
        
      } catch (tableError) {
        results.push({ table, column, status: `Erreur: ${tableError.message}` });
        console.log(`⚠️ Table ${table}: ${tableError.message}`);
      }
    }
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      message: "Contraintes vérifiées/corrigées",
      results
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("❌ Erreur correction contraintes:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la correction des contraintes",
      details: error.message
    });
  } finally {
    client.release();
  }
});

export default router;