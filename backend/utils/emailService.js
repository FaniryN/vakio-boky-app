import nodemailer from "nodemailer";

// Configuration du transporteur email
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async ({ to, subject, html }) => {
  let transporter;

  try {
    // Vérification des variables d'environnement
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Configuration email manquante - mode développement activé");
      return {
        success: false,
        devMode: true,
        message: "Configuration email non définie",
      };
    }

    transporter = createTransporter();

    // Vérifier la connexion
    await transporter.verify();
    console.log("Serveur email prêt à envoyer des messages");

    const mailOptions = {
      from: `"Vakio Boky" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(` Email envoyé à: ${to} - Message ID: ${result.messageId}`);

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error(" Erreur envoi email:", error);

    if (process.env.NODE_ENV === "development") {
      console.log("Détails erreur email:", {
        to,
        subject,
        errorCode: error.code,
        errorMessage: error.message,
      });
    }

    throw new Error(`Échec envoi email: ${error.message}`);
  }
};

//Pour envoyer des emails de test
export const testEmailConfig = async () => {
  try {
    console.log("🧪 Test configuration email...");

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error(
        "Variables EMAIL_USER ou EMAIL_PASS manquantes dans .env",
      );
    }

    const result = await sendEmail({
      to: process.env.EMAIL_USER,
      subject: "Test Configuration Email - Vakio Boky",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #1e40af;"> Test Réussi !</h2>
          <p>La configuration email de Vakio Boky fonctionne correctement.</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString("fr-FR")}</p>
          <p><strong>Service:</strong> Gmail</p>
        </div>
      `,
    });

    return result;
  } catch (error) {
    console.error(" Test email échoué:", error.message);
    throw error;
  }
};
