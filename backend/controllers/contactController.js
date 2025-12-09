// // routes/contact.js
// // import express from "express";
// import nodemailer from "nodemailer";
// // const router = express.Router();

// const Contact = async (req, res) => {
//   const { nom, email, message } = req.body;

//   if (!nom || !email || !message) {
//     return res.status(400).json({ error: "Tous les champs sont requis." });
//   }

//   try {
//     // Configurer le transporteur avec ton email admin
//     const transporter = nodemailer.createTransport({
//       service: "gmail", // ou autre
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     // Options du mail
//     const mailOptions = {
//       from: `"${nom}" <${email}>`,
//       to: process.env.EMAIL_USER,
//       subject: `Nouveau message de contact de ${nom}`,
//       text: message,
//       html: `<p><strong>Nom:</strong> ${nom}</p>
//              <p><strong>Email:</strong> ${email}</p>
//              <p><strong>Message:</strong><br/>${message}</p>`,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ success: true, message: "Email envoyé avec succès." });
//   } catch (err) {
//     console.error("Erreur envoi email:", err);
//     res.status(500).json({ error: "Impossible d'envoyer l'email." });
//   }
// };
// export default {
//   Contact
// };

// // export default router;
// routes/contact.js
import nodemailer from "nodemailer";

const Contact = async (req, res) => {
  const { nom, email, message } = req.body;

  if (!nom || !email || !message) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  try {
    // Configurer le transporteur avec ton email admin
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Création du HTML stylé pour le mail
    const mailHtml = `
      <div style="font-family: Arial, sans-serif; color:#1E293B; line-height:1.6;">
        <div style="text-align:center; margin-bottom:20px;">
          <h2 style="color:#3B82F6;">Vakio Boky 📚</h2>
          <p style="font-size:14px; color:#64748B;">Communauté Littéraire Malagasy</p>
        </div>

        <div style="background:#F1F5F9; padding:20px; border-radius:10px;">
          <p><strong>Nom :</strong> ${nom}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Message :</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
        </div>

        <div style="text-align:center; margin-top:20px;">
          <a href="http://localhost:5173/login"
             style="display:inline-block; padding:10px 20px; background:#3B82F6; color:white; text-decoration:none; border-radius:5px; font-weight:bold;">
             Se connecter
          </a>
        </div>

        <p style="font-size:12px; color:#94A3B8; margin-top:20px;">
          Si vous n'êtes pas à l'origine de ce message, ignorez cet email.
        </p>
      </div>
    `;

    // Options du mail
    const mailOptions = {
      from: `"${nom}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `Nouveau message de contact de ${nom}`,
      html: mailHtml,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email envoyé avec succès." });
  } catch (err) {
    console.error("Erreur envoi email:", err);
    res.status(500).json({ error: "Impossible d'envoyer l'email." });
  }
};

export default { Contact };
