import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET non défini");
  }
  
  // Vérifier que userId est valide
  if (!userId || typeof userId !== 'number') {
    throw new Error("ID utilisateur invalide");
  }
  
  return jwt.sign(
    {
      id: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 jours
    },
    process.env.JWT_SECRET,
    {
      algorithm: 'HS256',
      issuer: 'vakio-boky-api',
      audience: 'vakio-boky-client'
    }
  );
};

export default generateToken;