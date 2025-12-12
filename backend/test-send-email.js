import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function sendTestEmail() {
  try {
    console.log('📤 Tentative d\'envoi d\'email de test...');
    
    const info = await transporter.sendMail({
      from: `"Test Vakio Boky" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,  // Envoie à toi-même
      subject: '✅ Test SMTP Vakio Boky',
      text: 'Ceci est un test de l\'envoi d\'email depuis Vakio Boky.',
      html: `
        <h2>Test réussi ! 🎉</h2>
        <p>Le serveur email de Vakio Boky fonctionne correctement.</p>
        <p>Date: ${new Date().toLocaleString()}</p>
      `
    });

    console.log('✅ Email envoyé avec succès !');
    console.log('📧 Message ID:', info.messageId);
    console.log('👤 À:', info.envelope.to);
    
  } catch (error) {
    console.error('❌ Erreur d\'envoi:', error.message);
    console.error('Code:', error.code);
    console.error('Détails:', error.response);
  }
}

sendTestEmail();