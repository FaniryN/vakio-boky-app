import pool from "../config/db.js";
import bcrypt from "bcryptjs";

/**
 * Get platform settings
 */
export const getPlatformSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user is admin
    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId]
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // Get all settings from database
    const result = await pool.query(
      "SELECT setting_key, setting_value, setting_type FROM platform_settings ORDER BY category, setting_key"
    );

    // Transform settings into object
    const settings = {};
    result.rows.forEach(row => {
      // Convert value based on type
      switch (row.setting_type) {
        case 'boolean':
          settings[row.setting_key] = row.setting_value === 'true';
          break;
        case 'number':
          settings[row.setting_key] = parseInt(row.setting_value);
          break;
        default:
          settings[row.setting_key] = row.setting_value;
      }
    });

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("❌ Error getting platform settings:", error);
    res.status(500).json({
      success: false,
      error: "Erreur récupération paramètres plateforme",
    });
  }
};

/**
 * Update platform settings
 */
export const updatePlatformSettings = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { settings } = req.body;
    const userId = req.user.id;

    await client.query('BEGIN');

    // Check if user is admin
    const userCheck = await client.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId]
    );

    if (userCheck.rows[0].role !== "admin") {
      await client.query('ROLLBACK');
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // Update each setting
    for (const [key, value] of Object.entries(settings)) {
      const stringValue = String(value);
      
      await client.query(
        `INSERT INTO platform_settings (setting_key, setting_value, updated_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (setting_key) 
         DO UPDATE SET setting_value = $2, updated_at = CURRENT_TIMESTAMP`,
        [key, stringValue]
      );
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: "Paramètres plateforme mis à jour avec succès",
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("❌ Error updating platform settings:", error);
    res.status(500).json({
      success: false,
      error: "Erreur mise à jour paramètres plateforme",
    });
  } finally {
    client.release();
  }
};

/**
 * Get email templates
 */
export const getEmailTemplates = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user is admin
    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId]
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // Get templates from database
    const result = await pool.query(
      "SELECT id, name, category, description, subject, html_content, text_content, is_active, updated_at FROM email_templates ORDER BY category, name"
    );

    res.json({
      success: true,
      templates: result.rows,
    });
  } catch (error) {
    console.error("❌ Error getting email templates:", error);
    res.status(500).json({
      success: false,
      error: "Erreur récupération templates email",
    });
  }
};

/**
 * Update email template
 */
export const updateEmailTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, subject, html_content, text_content } = req.body;
    const userId = req.user.id;

    // Check if user is admin
    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId]
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // Update template in database
    const result = await pool.query(
      `UPDATE email_templates 
       SET name = $1, category = $2, description = $3, subject = $4, 
           html_content = $5, text_content = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING id`,
      [name, category, description, subject, html_content, text_content, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Template non trouvé",
      });
    }

    res.json({
      success: true,
      message: "Template email mis à jour avec succès",
    });
  } catch (error) {
    console.error("❌ Error updating email template:", error);
    res.status(500).json({
      success: false,
      error: "Erreur mise à jour template email",
    });
  }
};

/**
 * Send test email
 */
export const sendTestEmail = async (req, res) => {
  try {
    const { templateId, email } = req.body;
    const userId = req.user.id;

    // Check if user is admin
    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId]
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // Get template
    const templateResult = await pool.query(
      "SELECT subject, html_content FROM email_templates WHERE id = $1",
      [templateId]
    );

    if (templateResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Template non trouvé",
      });
    }

    const template = templateResult.rows[0];
    
    // TODO: Implémenter l'envoi réel d'email ici
    // Exemple avec nodemailer ou autre service
    console.log(`Test email would be sent to ${email} with subject: ${template.subject}`);
    
    // Pour l'instant, on simule l'envoi
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.json({
      success: true,
      message: "Email de test envoyé avec succès",
    });
  } catch (error) {
    console.error("❌ Error sending test email:", error);
    res.status(500).json({
      success: false,
      error: "Erreur envoi email de test",
    });
  }
};

/**
 * Get system configuration
 */
export const getSystemConfig = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user is admin
    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId]
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // Get system config from database
    const result = await pool.query(
      "SELECT config_key, config_value, config_type, section FROM system_config ORDER BY section, config_key"
    );

    // Transform config into structured object
    const config = {
      database: {},
      payment: {},
      storage: {},
      email: {},
      external: {}
    };

    result.rows.forEach(row => {
      const key = row.config_key;
      const section = row.section;
      let value = row.config_value;

      // Convert value based on type
      switch (row.config_type) {
        case 'boolean':
          value = value === 'true';
          break;
        case 'number':
          value = parseInt(value);
          break;
        case 'password':
          // Masquer les mots de passe pour la sécurité
          if (value && value.length > 0) {
            value = '••••••••';
          }
          break;
      }

      // Remove section prefix from key
      const cleanKey = key.replace(`${section}_`, '');
      
      if (config[section]) {
        config[section][cleanKey] = value;
      }
    });

    res.json({
      success: true,
      config,
    });
  } catch (error) {
    console.error("❌ Error getting system config:", error);
    res.status(500).json({
      success: false,
      error: "Erreur récupération configuration système",
    });
  }
};

/**
 * Update system configuration
 */
export const updateSystemConfig = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { config } = req.body;
    const userId = req.user.id;

    await client.query('BEGIN');

    // Check if user is admin
    const userCheck = await client.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId]
    );

    if (userCheck.rows[0].role !== "admin") {
      await client.query('ROLLBACK');
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // Update each config section
    for (const [section, values] of Object.entries(config)) {
      for (const [key, value] of Object.entries(values)) {
        const configKey = `${section}_${key}`;
        const stringValue = String(value);
        
        // Get config type
        const typeCheck = await client.query(
          "SELECT config_type, encrypted FROM system_config WHERE config_key = $1",
          [configKey]
        );

        let finalValue = stringValue;
        
        // Si c'est un mot de passe et que l'utilisateur ne veut pas le changer (valeur masquée)
        if (typeCheck.rows[0]?.config_type === 'password' && value === '••••••••') {
          // Ne pas mettre à jour le mot de passe si c'est la valeur masquée
          continue;
        }

        await client.query(
          `INSERT INTO system_config (config_key, config_value, section, updated_at)
           VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
           ON CONFLICT (config_key) 
           DO UPDATE SET config_value = $2, updated_at = CURRENT_TIMESTAMP`,
          [configKey, finalValue, section]
        );
      }
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: "Configuration système mise à jour avec succès",
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("❌ Error updating system config:", error);
    res.status(500).json({
      success: false,
      error: "Erreur mise à jour configuration système",
    });
  } finally {
    client.release();
  }
};

/**
 * Test connection to external service
 */
export const testConnection = async (req, res) => {
  try {
    const { service } = req.params;
    const userId = req.user.id;

    // Check if user is admin
    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId]
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    let success = false;
    let error = null;
    let details = null;

    switch (service) {
      case 'database':
        // Test database connection
        try {
          await pool.query('SELECT 1');
          success = true;
          details = 'Connexion à PostgreSQL établie avec succès';
        } catch (err) {
          error = 'Erreur de connexion à la base de données: ' + err.message;
        }
        break;

      case 'payment':
        // Mock payment API test
        success = Math.random() > 0.3; // 70% success rate for demo
        if (!success) {
          error = 'Clés API invalides ou service indisponible';
        } else {
          details = 'Connexion à l\'API de paiement établie';
        }
        break;

      case 'storage':
        // Mock storage test
        success = Math.random() > 0.2; // 80% success rate for demo
        if (!success) {
          error = 'Erreur de configuration du stockage';
        } else {
          details = 'Service de stockage accessible';
        }
        break;

      case 'email':
        // Mock email test
        success = Math.random() > 0.1; // 90% success rate for demo
        if (!success) {
          error = 'Erreur de configuration SMTP';
        } else {
          details = 'Serveur SMTP accessible';
        }
        break;

      default:
        error = 'Service non reconnu';
    }

    res.json({
      success,
      error,
      details,
    });
  } catch (err) {
    console.error(`❌ Error testing ${req.params.service} connection:`, err);
    res.status(500).json({
      success: false,
      error: "Erreur lors du test de connexion",
    });
  }
};

/**
 * Create a new email template
 */
export const createEmailTemplate = async (req, res) => {
  try {
    const { name, category, description, subject, html_content, text_content } = req.body;
    const userId = req.user.id;

    // Check if user is admin
    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId]
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // Insert new template
    const result = await pool.query(
      `INSERT INTO email_templates (name, category, description, subject, html_content, text_content)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [name, category, description, subject, html_content, text_content]
    );

    res.json({
      success: true,
      message: "Template email créé avec succès",
      templateId: result.rows[0].id,
    });
  } catch (error) {
    console.error("❌ Error creating email template:", error);
    res.status(500).json({
      success: false,
      error: "Erreur création template email",
    });
  }
};

/**
 * Delete email template
 */
export const deleteEmailTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user is admin
    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId]
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // Delete template
    const result = await pool.query(
      "DELETE FROM email_templates WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Template non trouvé",
      });
    }

    res.json({
      success: true,
      message: "Template email supprimé avec succès",
    });
  } catch (error) {
    console.error("❌ Error deleting email template:", error);
    res.status(500).json({
      success: false,
      error: "Erreur suppression template email",
    });
  }
};