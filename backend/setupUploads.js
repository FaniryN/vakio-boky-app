import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📁 CRÉATION DES DOSSIERS UPLOADS POUR VAKIO BOKY');
console.log('='.repeat(50));

// Liste des dossiers nécessaires
const folders = [
  'uploads',
  'uploads/profiles',
  'uploads/books',
  'uploads/posts',
  'uploads/events',
  'uploads/campaigns',
  'uploads/clubs',
  'uploads/medias',
  'uploads/temp'
];

let createdCount = 0;
let existingCount = 0;

folders.forEach(folder => {
  const folderPath = path.join(__dirname, folder);
  
  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`✅ CRÉÉ : ${folderPath}`);
      createdCount++;
    } else {
      console.log(`ℹ️ EXISTE : ${folderPath}`);
      existingCount++;
    }
  } catch (error) {
    console.error(`❌ ERREUR création ${folderPath}:`, error.message);
  }
});

// Créer un fichier .gitkeep dans chaque dossier pour les commits Git
folders.forEach(folder => {
  const gitkeepPath = path.join(__dirname, folder, '.gitkeep');
  if (!fs.existsSync(gitkeepPath)) {
    try {
      fs.writeFileSync(gitkeepPath, '');
      console.log(`📝 .gitkeep ajouté à: ${folder}`);
    } catch (error) {
      console.warn(`⚠️ Impossible d'ajouter .gitkeep à ${folder}`);
    }
  }
});

// Créer un fichier README dans uploads
const readmePath = path.join(__dirname, 'uploads', 'README.md');
const readmeContent = `# Dossier Uploads - Vakio Boky

Ce dossier contient tous les fichiers uploadés par les utilisateurs.

## Structure :
- \`profiles/\` : Photos de profil des utilisateurs
- \`books/\` : Couvertures de livres
- \`posts/\` : Images des publications
- \`events/\` : Images des événements
- \`campaigns/\` : Images des campagnes
- \`clubs/\` : Images des clubs de lecture
- \`medias/\` : Autres médias
- \`temp/\` : Fichiers temporaires

## Sécurité :
- Tous les fichiers sont servis statiquement
- Seules les extensions d'images sont autorisées
- Taille maximale : 50MB par fichier
`;

if (!fs.existsSync(readmePath)) {
  try {
    fs.writeFileSync(readmePath, readmeContent);
    console.log('📄 README.md créé dans uploads/');
  } catch (error) {
    console.warn('⚠️ Impossible de créer README.md');
  }
}

console.log('='.repeat(50));
console.log(`📊 RÉSUMÉ :`);
console.log(`   - Dossiers créés : ${createdCount}`);
console.log(`   - Dossiers existants : ${existingCount}`);
console.log(`   - Total : ${folders.length} dossiers`);
console.log('='.repeat(50));
console.log('🎉 CONFIGURATION DES DOSSIERS TERMINÉE !');
console.log('\n⚠️  IMPORTANT : Assurez-vous que le serveur a les permissions :');
console.log('   chmod -R 755 uploads/  # Sur Linux/Mac');
console.log('\n🚀 Pour tester, démarrez le serveur :');
console.log('   npm start');