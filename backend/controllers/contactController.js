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
    console.log("📧 Tentative d'envoi d'email...");
    console.log("🔧 Configuration SMTP:", {
      host: process.env.SMTP_HOST || process.env.EMAIL_HOST,
      port: process.env.SMTP_PORT || process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_PASS
    });

    // Configurer le transporteur SMTP avec les bonnes variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || process.env.EMAIL_HOST,
      port: parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true" || false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Vérifier la connexion SMTP
    try {
      await transporter.verify();
      console.log("✅ Connexion SMTP vérifiée avec succès");
    } catch (verifyError) {
      console.error("❌ Erreur de vérification SMTP:", verifyError);
      return res.status(500).json({ 
        success: false, 
        error: "Erreur de configuration email. Impossible de se connecter au serveur SMTP." 
      });
    }

    // Création du HTML stylé pour le mail
    const mailHtml = `
      <div style="font-family: Arial, sans-serif; color:#1E293B; line-height:1.6;">
        <div style="text-align:center; margin-bottom:20px;">
          <h2 style="color:#3B82F6;">Vakio Boky 📚</h2>
          <p style="font-size:14px; color:#64748B;">Communauté Littéraire Malagasy</p>
        </div>

        <div style="background:#F1F5F9; padding:20px; border-radius:10px; margin-bottom:20px;">
          <h3 style="color:#3B82F6; margin-top:0;">Nouveau message de contact</h3>
          <p><strong>👤 Nom :</strong> ${nom}</p>
          <p><strong>📧 Email :</strong> ${email}</p>
          <p><strong>📝 Message :</strong></p>
          <div style="background:white; padding:15px; border-left:4px solid #3B82F6; margin-top:10px;">
            ${message.replace(/\n/g, "<br/>")}
          </div>
        </div>

        <div style="text-align:center; margin-top:30px; padding-top:20px; border-top:1px solid #E2E8F0;">
          <p style="color:#64748B; font-size:12px; margin-bottom:20px;">
            Ce message a été envoyé depuis le formulaire de contact de Vakio Boky
          </p>
          <a href="${process.env.FRONTEND_URL || 'https://vakio-boky-frontend.onrender.com'}"
             style="display:inline-block; padding:10px 20px; background:#3B82F6; color:white; text-decoration:none; border-radius:5px; font-weight:bold;">
             Visiter Vakio Boky
          </a>
        </div>

        <p style="font-size:11px; color:#94A3B8; margin-top:20px; text-align:center;">
          Si vous n'êtes pas à l'origine de ce message, ignorez cet email.
        </p>
      </div>
    `;

    // Options du mail
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Vakio Boky" <${process.env.EMAIL_USER}>`,
      replyTo: `"${nom}" <${email}>`,
      to: process.env.EMAIL_USER, // Envoyer à vous-même (admin)
      subject: `📚 Nouveau message de contact - ${nom}`,
      html: mailHtml,
      text: `Nom: ${nom}\nEmail: ${email}\nMessage: ${message}`, // Version texte
    };

    console.log("📤 Envoi d'email à:", mailOptions.to);
    
    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Email envoyé avec succès:", info.messageId);

    // Envoyer aussi une confirmation à l'utilisateur
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; color:#1E293B; line-height:1.6;">
        <div style="text-align:center; margin-bottom:20px;">
          <h2 style="color:#3B82F6;">Vakio Boky 📚</h2>
          <p style="font-size:14px; color:#64748B;">Communauté Littéraire Malagasy</p>
        </div>

        <div style="background:#F1F5F9; padding:20px; border-radius:10px;">
          <h3 style="color:#3B82F6; margin-top:0;">Confirmation de réception</h3>
          <p>Bonjour <strong>${nom}</strong>,</p>
          <p>Nous avons bien reçu votre message et nous vous en remercions !</p>
          
          <div style="background:white; padding:15px; border-left:4px solid #10B981; margin:20px 0;">
            <p style="margin:0; font-style:italic;">"${message.substring(0, 200)}${message.length > 200 ? '...' : ''}"</p>
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
      console.warn("⚠️ Impossible d'envoyer l'email de confirmation:", confirmationError);
    }

    res.status(200).json({ 
      success: true, 
      message: "Votre message a été envoyé avec succès. Vous recevrez une confirmation par email." 
    });
  } catch (err) {
    console.error("❌ Erreur détaillée envoi email:", err);
    
    // Message d'erreur plus informatif
    let errorMessage = "Impossible d'envoyer l'email.";
    
    if (err.code === 'EAUTH') {
      errorMessage = "Erreur d'authentification email. Vérifiez les identifiants SMTP.";
    } else if (err.code === 'ECONNECTION') {
      errorMessage = "Impossible de se connecter au serveur email. Vérifiez votre connexion internet.";
    } else if (err.responseCode === 535) {
      errorMessage = "Identifiants SMTP incorrects. Vérifiez le mot de passe d'application Gmail.";
    }
    
    res.status(500).json({ 
      success: false, 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export default { Contact };