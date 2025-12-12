import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Charge les variables d'environnement
dotenv.config();

console.log('🔧 Configuration SMTP :');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

console.log('\n🧪 Test de connexion SMTP...');

transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ ERREUR SMTP:', error.message);
    console.error('Code:', error.code);
  } else {
    console.log('✅ Serveur SMTP prêt !');
    console.log('✅ Connexion réussie à', process.env.SMTP_HOST);
  }
});