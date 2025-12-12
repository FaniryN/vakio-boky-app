// Test simple avec la fonction directement
import dotenv from 'dotenv';
dotenv.config();

// Importe le contrôleur
import contactController from './controllers/contactController.js';

async function testContact() {
  console.log('🧪 Test du contrôleur contact...');
  
  // Crée une requête simulée
  const mockReq = {
    body: {
      nom: "Test User",
      email: "fanirynomena11@gmail.com",  // Ton email
      message: "Ceci est un test du contrôleur contact"
    }
  };

  // Crée une réponse simulée
  const mockRes = {
    status: function(code) {
      console.log('📊 Code status:', code);
      return this;
    },
    json: function(data) {
      console.log('📦 Réponse JSON:', JSON.stringify(data, null, 2));
      return this;
    }
  };

  try {
    // Appelle la fonction
    await contactController.Contact(mockReq, mockRes);
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testContact();