// import nodemailer from "nodemailer";
import nodemailer from "nodemailer";
const Contact = async (req, res) => {
  const { nom, email, message } = req.body;

  if (!nom || !email || !message) {
    return res.status(400).json({ 
      success: false,
      error: "Tous les champs sont requis." 
    });
  }

  try {
    console.log("📧 Tentative d'envoi d'email depuis:", email);
    
    // Vérifier les variables d'environnement
    const smtpConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    };

    console.log("🔧 Configuration SMTP:", {
      host: smtpConfig.host,
      port: smtpConfig.port,
      user: smtpConfig.auth.user,
      hasPassword: !!smtpConfig.auth.pass
    });

    // Vérifier que les variables requises existent
    if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
      console.error("❌ Variables SMTP manquantes");
      return res.status(500).json({
        success: false,
        error: "Configuration email incomplète. Veuillez contacter l'administrateur."
      });
    }

    const transporter = nodemailer.createTransport(smtpConfig);

    // Tester la connexion SMTP
    try {
      await transporter.verify();
      console.log("✅ Connexion SMTP vérifiée");
    } catch (verifyError) {
      console.error("❌ Erreur vérification SMTP:", verifyError.message);
      
      // Messages d'erreur plus explicites
      if (verifyError.code === 'EAUTH') {
        return res.status(500).json({ 
          success: false, 
          error: "Erreur d'authentification email. Vérifiez les identifiants SMTP." 
        });
      } else if (verifyError.code === 'ECONNECTION') {
        return res.status(500).json({ 
          success: false, 
          error: "Impossible de se connecter au serveur SMTP. Vérifiez votre configuration réseau." 
        });
      }
      
      return res.status(500).json({ 
        success: false, 
        error: "Erreur de configuration email: " + verifyError.message 
      });
    }

    // Email pour l'admin
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; color:#1E293B; line-height:1.6;">
        <div style="text-align:center; margin-bottom:20px;">
          <h2 style="color:#3B82F6;">Vakio Boky 📚</h2>
          <p style="font-size:14px; color:#64748B;">Nouveau message de contact</p>
        </div>

        <div style="background:#F1F5F9; padding:20px; border-radius:10px;">
          <h3 style="color:#3B82F6; margin-top:0;">👤 Informations de contact</h3>
          <p><strong>Nom :</strong> ${nom}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Message :</strong></p>
          <div style="background:white; padding:15px; border-left:4px solid #3B82F6; margin-top:10px;">
            ${message.replace(/\n/g, "<br/>")}
          </div>
        </div>

        <div style="margin-top:30px; padding-top:20px; border-top:1px solid #E2E8F0;">
          <p style="color:#64748B; font-size:12px;">
            Message envoyé depuis le formulaire de contact de Vakio Boky
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Vakio Boky" <${process.env.EMAIL_USER}>`,
      replyTo: `"${nom}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `📚 Contact Vakio Boky - ${nom}`,
      html: adminHtml,
      text: `Nom: ${nom}\nEmail: ${email}\nMessage:\n${message}`,
    };

    console.log("📤 Envoi email à admin...");
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email admin envoyé:", info.messageId);

    // Email de confirmation à l'utilisateur
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; color:#1E293B; line-height:1.6;">
        <div style="text-align:center; margin-bottom:20px;">
          <h2 style="color:#3B82F6;">Vakio Boky 📚</h2>
        </div>

        <div style="background:#F1F5F9; padding:20px; border-radius:10px;">
          <h3 style="color:#3B82F6; margin-top:0;">Confirmation de réception</h3>
          <p>Bonjour <strong>${nom}</strong>,</p>
          <p>Nous avons bien reçu votre message et nous vous en remercions !</p>
          
          <div style="background:#EFF6FF; padding:15px; border-radius:5px; margin:20px 0;">
            <p style="margin:0; color:#1E40AF;"><em>Votre message a été envoyé avec succès.</em></p>
          </div>
          
          <p>Notre équipe va traiter votre demande dans les plus brefs délais.</p>
          <p>Vous recevrez une réponse à l'adresse <strong>${email}</strong>.</p>
        </div>

        <div style="text-align:center; margin-top:30px;">
          <p style="color:#64748B; font-size:12px;">
            Ceci est un email automatique, merci de ne pas y répondre.
          </p>
        </div>
      </div>
    `;

    const confirmationOptions = {
      from: process.env.EMAIL_FROM || `"Vakio Boky" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ Confirmation de réception - Vakio Boky",
      html: confirmationHtml,
    };

    try {
      await transporter.sendMail(confirmationOptions);
      console.log("✅ Email de confirmation envoyé à:", email);
    } catch (confirmationError) {
      console.warn("⚠️ Email de confirmation échoué (mais email admin envoyé):", confirmationError.message);
    }

    res.status(200).json({ 
      success: true, 
      message: "Votre message a été envoyé avec succès." 
    });
  } catch (err) {
    console.error("❌ Erreur détaillée envoi email:", err);
    
    let errorMessage = "Impossible d'envoyer l'email. Veuillez réessayer plus tard.";
    
    if (err.code === 'EAUTH') {
      errorMessage = "Erreur d'authentification email. Le serveur email est mal configuré.";
    } else if (err.code === 'ECONNECTION') {
      errorMessage = "Impossible de se connecter au serveur email.";
    }
    
    res.status(500).json({ 
      success: false, 
      error: errorMessage
    });
  }
};

export default { Contact };