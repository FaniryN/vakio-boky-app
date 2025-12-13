import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

// Stockage temporaire des codes
const resetCodes = new Map();

// Fonction utilitaire pour nettoyer les URLs d'images
const cleanImageUrl = (url, type = "profile") => {
  if (!url) return null;
  
  const strUrl = String(url).trim();
  
  if (strUrl === '' || strUrl === 'null' || strUrl === 'NULL' || strUrl === 'undefined') {
    return null;
  }
  
  // Si déjà une URL complète
  if (strUrl.startsWith('http://') || strUrl.startsWith('https://')) {
    return strUrl;
  }
  
  // Si c'est un chemin local
  if (strUrl.startsWith('/uploads/')) {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const hasValidExtension = validExtensions.some(ext => 
      strUrl.toLowerCase().endsWith(ext)
    );
    
    if (hasValidExtension) {
      return strUrl;
    }
  }
  
  return null;
};

// Login utilisateur - VERSION SIMPLIFIÉE ET SÉCURISÉE
export const login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    // Validation de base
    if (!email || !mot_de_passe) {
      return res.status(400).json({ 
        success: false,
        error: "Email et mot de passe requis" 
      });
    }

    // Normaliser l'email
    const normalizedEmail = email.toLowerCase().trim();

    // Récupérer l'utilisateur
    const result = await pool.query(
      "SELECT * FROM utilisateur WHERE email = $1",
      [normalizedEmail],
    );

    if (result.rows.length === 0) {
      // Ne pas révéler si l'email existe ou non
      return res.status(401).json({ 
        success: false,
        error: "Identifiants incorrects" 
      });
    }

    const user = result.rows[0];
    
    // Vérifier si le compte est bloqué
    if (user.role === 'blocked') {
      return res.status(403).json({ 
        success: false,
        error: "Compte désactivé. Contactez l'administrateur." 
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        error: "Identifiants incorrects" 
      });
    }

    // Générer le token
    const token = generateToken(user.id);

    // Préparer la réponse utilisateur
    const safePhotoProfil = cleanImageUrl(user.photo_profil);

    const userResponse = {
      id: user.id,
      nom: user.nom,
      email: user.email,
      role: user.role,
      telephone: user.telephone,
      genre_prefere: user.genre_prefere,
      bio: user.bio,
      photo_profil: safePhotoProfil,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    res.json({
      success: true,
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("🔥 Erreur login:", error.message);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur" 
    });
  }
};

// Inscription utilisateur
export const register = async (req, res) => {
  try {
    const {
      nom,
      email,
      mot_de_passe,
      telephone,
      genre_prefere,
      accepte_newsletter,
    } = req.body;

    // Validation
    if (!nom || !email || !mot_de_passe) {
      return res.status(400).json({ 
        success: false,
        error: "Nom, email et mot de passe sont requis" 
      });
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: "Format d'email invalide" 
      });
    }

    // Validation mot de passe
    if (mot_de_passe.length < 6) {
      return res.status(400).json({ 
        success: false,
        error: "Le mot de passe doit contenir au moins 6 caractères" 
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Vérifier si l'utilisateur existe
    const userExists = await pool.query(
      "SELECT id FROM utilisateur WHERE email = $1",
      [normalizedEmail],
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ 
        success: false,
        error: "Un utilisateur avec cet email existe déjà" 
      });
    }

    // Hasher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(mot_de_passe, saltRounds);

    // Créer l'utilisateur
    const result = await pool.query(
      `INSERT INTO utilisateur 
       (nom, email, mot_de_passe, telephone, genre_prefere, accepte_newsletter) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, nom, email, role, telephone, genre_prefere, bio, photo_profil, accepte_newsletter, created_at, updated_at`,
      [
        nom.trim(),
        normalizedEmail,
        hashedPassword,
        telephone ? telephone.trim() : null,
        genre_prefere ? genre_prefere.trim() : null,
        accepte_newsletter || false,
      ],
    );

    const newUser = result.rows[0];
    const token = generateToken(newUser.id);
    const safePhotoProfil = cleanImageUrl(newUser.photo_profil);

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      token,
      user: {
        ...newUser,
        photo_profil: safePhotoProfil
      },
    });
  } catch (error) {
    console.error("🔥 Erreur register:", error.message);
    
    // Gestion des erreurs PostgreSQL
    if (error.code === '23505') {
      return res.status(400).json({ 
        success: false,
        error: "Email déjà utilisé" 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur" 
    });
  }
};

// Récupérer un utilisateur par ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Valider l'ID
    const userId = parseInt(id);
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({ 
        success: false,
        error: "ID utilisateur invalide" 
      });
    }
    
    const result = await pool.query(
      `SELECT id, nom, email, role, telephone, genre_prefere, bio, 
              photo_profil, created_at, updated_at 
       FROM utilisateur WHERE id = $1`,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: "Utilisateur non trouvé" 
      });
    }

    const user = result.rows[0];
    const safePhotoProfil = cleanImageUrl(user.photo_profil);
    
    res.json({
      success: true,
      user: {
        ...user,
        photo_profil: safePhotoProfil
      }
    });
  } catch (error) {
    console.error("🔥 Erreur getUserById:", error.message);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur" 
    });
  }
};

// Récupérer tous les utilisateurs (pour admin)
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nom, email, role, telephone, genre_prefere, 
              photo_profil, created_at, updated_at 
       FROM utilisateur 
       ORDER BY created_at DESC`
    );

    const users = result.rows.map(user => ({
      ...user,
      photo_profil: cleanImageUrl(user.photo_profil)
    }));

    res.json({
      success: true,
      users,
      count: users.length
    });
  } catch (error) {
    console.error("🔥 Erreur getAllUsers:", error.message);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur" 
    });
  }
};

// Mot de passe oublié - VERSION SIMPLIFIÉE
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: "Email requis" 
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Chercher l'utilisateur
    const result = await pool.query(
      "SELECT id, nom FROM utilisateur WHERE email = $1",
      [normalizedEmail],
    );
    
    // Toujours retourner la même réponse pour la sécurité
    const responseMessage = "Si l'email existe, un code de réinitialisation a été envoyé";
    
    if (result.rows.length === 0) {
      return res.json({
        success: true,
        message: responseMessage
      });
    }

    const user = result.rows[0];
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Stocker le code
    resetCodes.set(normalizedEmail, {
      code: resetCode,
      expires: expirationTime,
      userId: user.id,
    });

    // Retourner les données pour EmailJS
    res.json({
      success: true,
      message: responseMessage,
      emailData: {
        user_email: email,
        user_name: user.nom,
        reset_code: resetCode,
        expiration_minutes: 15,
        date: new Date().toLocaleDateString('fr-FR')
      }
    });

  } catch (error) {
    console.error("🔥 Erreur forgotPassword:", error.message);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur" 
    });
  }
};

// Vérification du code
export const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ 
        success: false,
        error: "Email et code requis" 
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const storedData = resetCodes.get(normalizedEmail);

    if (!storedData) {
      return res.status(400).json({ 
        success: false,
        error: "Code invalide ou expiré" 
      });
    }

    // Vérifier l'expiration
    if (Date.now() > storedData.expires) {
      resetCodes.delete(normalizedEmail);
      return res.status(400).json({ 
        success: false,
        error: "Code expiré" 
      });
    }

    // Vérifier le code
    if (storedData.code !== code.trim()) {
      return res.status(400).json({ 
        success: false,
        error: "Code incorrect" 
      });
    }

    // Générer un token de réinitialisation
    const resetToken = jwt.sign(
      {
        userId: storedData.userId,
        email: normalizedEmail,
        purpose: "password_reset",
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    // Supprimer le code utilisé
    resetCodes.delete(normalizedEmail);

    res.json({
      success: true,
      message: "Code vérifié avec succès",
      resetToken,
    });
  } catch (error) {
    console.error("🔥 Erreur verifyCode:", error.message);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur" 
    });
  }
};

// Réinitialisation du mot de passe
export const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ 
        success: false,
        error: "Tous les champs sont requis" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false,
        error: "Le mot de passe doit contenir au moins 6 caractères" 
      });
    }

    // Vérifier le token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ 
        success: false,
        error: "Token invalide ou expiré" 
      });
    }

    // Vérifier le but du token
    if (decoded.purpose !== "password_reset" || decoded.email !== email.toLowerCase()) {
      return res.status(400).json({ 
        success: false,
        error: "Token invalide" 
      });
    }

    // Hasher le nouveau mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Mettre à jour le mot de passe
    await pool.query(
      "UPDATE utilisateur SET mot_de_passe = $1, updated_at = NOW() WHERE id = $2",
      [hashedPassword, decoded.userId],
    );

    res.json({
      success: true,
      message: "Mot de passe réinitialisé avec succès",
    });
  } catch (error) {
    console.error("🔥 Erreur resetPassword:", error.message);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur" 
    });
  }
};

// export { 
//   login, 
//   register, 
//   getUserById, 
//   getAllUsers,
//   forgotPassword, 
//   verifyCode, 
//   resetPassword,
//   cleanImageUrl
// };