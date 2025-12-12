import nodemailer from "nodemailer";

// Configuration du transporteur SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
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
};

// Fonction pour envoyer un email
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    // Vérifier la connexion SMTP
    await transporter.verify();
    console.log("✅ Connexion SMTP prête");

    // Options par défaut
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Vakio Boky" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''),
    };

    console.log(`📤 Envoi d'email à: ${options.to}`);
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email envoyé: ${info.messageId}`);
    return info;
    
  } catch (error) {
    console.error("❌ Erreur envoi email:", error);
    throw error;
  }
};

// Fonction pour tester la configuration SMTP
const testSMTPConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    
    console.log("✅ Connexion SMTP testée avec succès");
    return { success: true, message: "Connexion SMTP établie" };
    
  } catch (error) {
    console.error("❌ Échec test SMTP:", error);
    
    let errorMessage = "Erreur de connexion SMTP";
    if (error.code === 'EAUTH') {
      errorMessage = "Erreur d'authentification SMTP. Vérifiez EMAIL_USER et EMAIL_PASS.";
    } else if (error.code === 'ECONNECTION') {
      errorMessage = "Impossible de se connecter au serveur SMTP. Vérifiez SMTP_HOST et SMTP_PORT.";
    }
    
    return { 
      success: false, 
      error: errorMessage,
      details: error.message 
    };
  }
};

export { sendEmail, testSMTPConnection };