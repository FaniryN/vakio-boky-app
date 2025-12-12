import fetch from 'node-fetch';

async function testContactAPI() {
  const url = 'http://localhost:5000/api/contact';
  
  const testData = {
    nom: "Test Utilisateur",
    email: "test@example.com",
    message: "Ceci est un test du formulaire de contact"
  };

  console.log('🌐 Test de l\'API Contact...');
  console.log('URL:', url);
  console.log('Données:', testData);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📊 Statut:', response.status, response.statusText);
    
    const data = await response.json();
    console.log('📦 Réponse:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testContactAPI();