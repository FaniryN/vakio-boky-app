// Frontend: /src/utils/imageUtils.js

// Fonction pour obtenir une URL d'image sécurisée pour le frontend
export const getProfileImageUrl = (imageUrl) => {
  // Si pas d'image, retourner une image par défaut
  if (!imageUrl) {
    return "/assets/images/profiles/profile-default.png";
  }
  
  // Si c'est déjà une URL complète
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Si c'est un chemin relatif
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }
  
  // Si c'est juste un nom de fichier
  return `/uploads/profiles/${imageUrl}`;
};

// Fonction avec gestion d'erreur pour les balises <img>
export const getImageWithErrorHandler = (imageUrl, defaultImage = "/assets/images/profiles/profile-default.png") => {
  return {
    src: getProfileImageUrl(imageUrl),
    onError: (e) => {
      e.target.onerror = null;
      e.target.src = defaultImage;
    }
  };
};