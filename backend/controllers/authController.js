import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";
import { sendEmail } from "../utils/emailService.js";

// Fonction utilitaire pour nettoyer les URLs d'images - VERSION DÉFINITIVE
const cleanImageUrl = (url, type = "profile") => {
  if (!url) {
    return null;
  }

  const strUrl = String(url).trim();

  if (
    strUrl === "" ||
    strUrl === "null" ||
    strUrl === "NULL" ||
    strUrl === "undefined"
  ) {
    return null;
  }

  if (strUrl.startsWith("http://") || strUrl.startsWith("https://")) {
    return strUrl;
  }

  if (strUrl.startsWith("/uploads/profiles/")) {
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const hasValidExtension = validExtensions.some((ext) =>
      strUrl.toLowerCase().endsWith(ext)
    );

    if (hasValidExtension) {
      return strUrl;
    }
  }

  return null;
};

// Fonction pour obtenir une URL d'image sécurisée
const getSafeProfileImage = (imageUrl) => {
  if (!imageUrl) {
    return null;
  }

  const strImageUrl = String(imageUrl).trim();

  if (
    !strImageUrl ||
    strImageUrl === "null" ||
    strImageUrl === "NULL" ||
    strImageUrl === "undefined"
  ) {
    return null;
  }

  return cleanImageUrl(strImageUrl, "profile");
};

// Stockage temporaire des codes
const resetCodes = new Map();

// Login utilisateur - CORRECTION ICI
const login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({
        success: false,
        error: "Email et mot de passe requis",
      });
    }

    console.log("🔐 Tentative de connexion pour:", email);

    const result = await pool.query(
      "SELECT * FROM utilisateur WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      console.log("❌ Aucun utilisateur trouvé avec cet email:", email);
      return res.status(401).json({
        success: false,
        error: "Email ou mot de passe incorrect",
      });
    }

    const user = result.rows[0];
    console.log("✅ Utilisateur trouvé:", {
      id: user.id,
      nom: user.nom,
      email: user.email,
    });

    if (user.role === "blocked") {
      return res.status(403).json({
        success: false,
        error: "Votre compte a été bloqué. Contactez l'administrateur.",
      });
    }

    // DEBUG : Afficher le hash stocké (pour debug seulement)
    if (process.env.NODE_ENV === "development") {
      console.log(
        "🔍 Hash stocké (premiers 30 chars):",
        user.mot_de_passe.substring(0, 30)
      );
    }

    const isPasswordValid = await bcrypt.compare(
      mot_de_passe,
      user.mot_de_passe
    );

    if (!isPasswordValid) {
      console.log("❌ Mot de passe incorrect pour:", email);
      return res.status(401).json({
        success: false,
        error: "Email ou mot de passe incorrect",
      });
    }

    console.log("✅ Mot de passe validé pour:", email);

    // Utiliser generateToken qui utilise le même secret
    const token = generateToken(user.id);
    console.log("✅ Token généré pour l'utilisateur ID:", user.id);

    const safePhotoProfil = getSafeProfileImage(user.photo_profil);

    // Réponse de succès
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        telephone: user.telephone,
        genre_prefere: user.genre_prefere,
        bio: user.bio,
        photo_profil: safePhotoProfil,
      },
    });
  } catch (error) {
    console.error("❌ Erreur login:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la connexion",
    });
  }
};

// Inscription utilisateur
const register = async (req, res) => {
  try {
    const {
      nom,
      email,
      mot_de_passe,
      telephone,
      genre_prefere,
      accepte_newsletter,
    } = req.body;

    if (!nom || !email || !mot_de_passe) {
      return res.status(400).json({
        success: false,
        error: "Nom, email et mot de passe sont requis",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Format d'email invalide",
      });
    }

    if (mot_de_passe.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Le mot de passe doit contenir au moins 6 caractères",
      });
    }

    const userExists = await pool.query(
      "SELECT id FROM utilisateur WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Un utilisateur avec cet email existe déjà",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(mot_de_passe, saltRounds);

    const result = await pool.query(
      `INSERT INTO utilisateur 
       (nom, email, mot_de_passe, telephone, genre_prefere, accepte_newsletter) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, nom, email, role, telephone, genre_prefere, bio, photo_profil, accepte_newsletter, created_at, updated_at`,
      [
        nom,
        email,
        hashedPassword,
        telephone || null,
        genre_prefere || null,
        accepte_newsletter || false,
      ]
    );

    const newUser = result.rows[0];
    const token = generateToken(newUser.id);

    const safePhotoProfil = getSafeProfileImage(newUser.photo_profil);

    // Envoyer un email de bienvenue
    try {
      await sendEmail({
        to: email,
        subject: "Bienvenue sur Vakio Boky !",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e40af;">Bienvenue sur Vakio Boky, ${nom} !</h2>
            <p>Votre compte a été créé avec succès.</p>
            <p>Vous pouvez maintenant vous connecter et explorer notre bibliothèque numérique.</p>
            <br>
            <p>Cordialement,<br>L'équipe Vakio Boky</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("⚠️ Erreur envoi email de bienvenue:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      token,
      user: {
        id: newUser.id,
        nom: newUser.nom,
        email: newUser.email,
        role: newUser.role,
        telephone: newUser.telephone,
        genre_prefere: newUser.genre_prefere,
        bio: newUser.bio,
        photo_profil: safePhotoProfil,
        accepte_newsletter: newUser.accepte_newsletter,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
      },
    });
  } catch (error) {
    console.error("Erreur register:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de l'inscription",
    });
  }
};

// Récupérer un utilisateur par ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT id, nom, email, role, telephone, genre_prefere, bio, photo_profil, created_at FROM utilisateur WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé",
      });
    }

    const user = result.rows[0];
    const safePhotoProfil = getSafeProfileImage(user.photo_profil);

    res.json({
      success: true,
      user: {
        ...user,
        photo_profil: safePhotoProfil,
      },
    });
  } catch (error) {
    console.error("Erreur getUserById:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};

// Récupérer tous les utilisateurs (pour débogage)
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nom, email, role, photo_profil, created_at FROM utilisateur ORDER BY id"
    );

    const users = result.rows.map((user) => ({
      ...user,
      photo_profil: getSafeProfileImage(user.photo_profil),
    }));

    res.json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error) {
    console.error("Erreur getAllUsers:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};

// Mot de passe oublié
// const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         error: "Email requis"
//       });
//     }

//     const result = await pool.query(
//       "SELECT id, nom FROM utilisateur WHERE email = $1",
//       [email],
//     );

//     if (result.rows.length === 0) {
//       // Pour des raisons de sécurité, on ne révèle pas si l'email existe
//       return res.json({
//         success: true,
//         message: "Si l'email existe, un code de réinitialisation a été envoyé",
//       });
//     }

//     const user = result.rows[0];

//     const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
//     const expirationTime = Date.now() + (parseInt(process.env.RESET_CODE_EXPIRES) || 15) * 60 * 1000;

//     resetCodes.set(email, {
//       code: resetCode,
//       expires: expirationTime,
//       userId: user.id,
//     });

//     console.log(`🔑 Code de réinitialisation pour ${email}: ${resetCode}`);

//     try {
//       await sendEmail({
//         to: email,
//         subject: "Réinitialisation de votre mot de passe - Vakio Boky",
//         html: `
//           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//             <h2 style="color: #1e40af;">Vakio Boky - Réinitialisation de mot de passe</h2>
//             <p>Bonjour ${user.nom},</p>
//             <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
//             <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
//               <h3 style="color: #1e40af; font-size: 24px; letter-spacing: 5px;">${resetCode}</h3>
//               <p style="color: #6b7280; font-size: 14px;">Ce code expirera dans ${process.env.RESET_CODE_EXPIRES || 15} minutes</p>
//             </div>
//             <p>Entrez ce code dans le formulaire de réinitialisation de mot de passe.</p>
//             <p>Si vous n'avez pas fait cette demande, ignorez simplement cet email.</p>
//             <br>
//             <p>Cordialement,<br>L'équipe Vakio Boky</p>
//           </div>
//         `,
//       });

//       console.log(`✅ Email envoyé à ${email}`);
//     } catch (emailError) {
//       console.error("❌ Erreur envoi email:", emailError);

//       // En développement, on peut retourner le code directement
//       if (process.env.NODE_ENV === "development") {
//         return res.json({
//           success: true,
//           message: "Code de réinitialisation (DEV): " + resetCode,
//           code: resetCode, // Seulement en dev
//         });
//       }

//       return res.status(500).json({
//         success: false,
//         error: "Impossible d'envoyer l'email. Réessayez plus tard.",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Si l'email existe, un code de réinitialisation a été envoyé",
//     });
//   } catch (error) {
//     console.error("Erreur forgotPassword:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur"
//     });
//   }
// };
// Mot de passe oublié - VERSION EmailJS
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // 1. Vérifier l'utilisateur
    const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
    
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    
    // 2. Générer un code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    
    // 3. Sauvegarder dans la base
    await db.none(
      'INSERT INTO password_resets (user_id, reset_code, expires_at) VALUES ($1, $2, $3)',
      [user.id, resetCode, expiresAt]
    );
    
    // 4. Envoyer l'email via SendGrid
    const msg = {
      to: email,  // Email de l'utilisateur
      from: 'fanirynomena11@gmail.com',  // Ton email vérifié
      templateId: 'd-xxxxxxxxxxxxxxxxxxxx',  // Ton template ID
      dynamicTemplateData: {
        user_name: user.nom || "Utilisateur Vakio Boky",
        user_email: email,
        reset_code: resetCode
      }
    };
    
    await sgMail.send(msg);
    
    console.log(`📧 Email envoyé à ${email}, code: ${resetCode}`);
    
    // 5. Répondre au frontend
    res.json({
      success: true,
      message: "Email envoyé avec succès",
      resetCode: resetCode  // Pour le mode DEV
    });
    
  } catch (error) {
    console.error("❌ Erreur forgotPassword:", error);
    res.status(500).json({ error: "Erreur lors de l'envoi de l'email" });
  }
};
// Vérification du code
const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        error: "Email et code requis",
      });
    }

    const storedData = resetCodes.get(email);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        error: "Code invalide ou expiré",
      });
    }

    if (Date.now() > storedData.expires) {
      resetCodes.delete(email);
      return res.status(400).json({
        success: false,
        error: "Code expiré",
      });
    }

    if (storedData.code !== code) {
      return res.status(400).json({
        success: false,
        error: "Code incorrect",
      });
    }

    const resetToken = jwt.sign(
      {
        userId: storedData.userId,
        email: email,
        purpose: "password_reset",
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.RESET_TOKEN_EXPIRES || "30m" }
    );

    resetCodes.delete(email);

    res.json({
      success: true,
      message: "Code vérifié avec succès",
      resetToken,
    });
  } catch (error) {
    console.error("Erreur verifyCode:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};

// Réinitialisation du mot de passe
const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Tous les champs sont requis",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Le mot de passe doit contenir au moins 6 caractères",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error("❌ Erreur vérification token:", jwtError);
      return res.status(400).json({
        success: false,
        error: "Token invalide ou expiré",
      });
    }

    if (decoded.purpose !== "password_reset" || decoded.email !== email) {
      return res.status(400).json({
        success: false,
        error: "Token invalide",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await pool.query(
      "UPDATE utilisateur SET mot_de_passe = $1, updated_at = NOW() WHERE id = $2",
      [hashedPassword, decoded.userId]
    );

    console.log(
      `✅ Mot de passe réinitialisé pour l'utilisateur ID: ${decoded.userId}`
    );

    // Envoyer un email de confirmation
    try {
      await sendEmail({
        to: email,
        subject: "Mot de passe réinitialisé - Vakio Boky",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e40af;">Votre mot de passe a été réinitialisé</h2>
            <p>Votre mot de passe a été modifié avec succès.</p>
            <p>Si vous n'avez pas effectué cette action, veuillez contacter immédiatement notre support.</p>
            <br>
            <p>Cordialement,<br>L'équipe Vakio Boky</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("⚠️ Erreur envoi email de confirmation:", emailError);
    }

    res.json({
      success: true,
      message: "Mot de passe réinitialisé avec succès",
    });
  } catch (error) {
    console.error("Erreur resetPassword:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};

// Route pour récupérer le code (appelée par le frontend après vérification)
const getResetCodeForEmailJS = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email requis",
      });
    }

    const storedData = resetCodes.get(email);

    if (!storedData) {
      return res.status(404).json({
        success: false,
        error: "Aucun code actif pour cet email",
      });
    }

    // Vérifier l'expiration
    if (Date.now() > storedData.expires) {
      resetCodes.delete(email);
      return res.status(400).json({
        success: false,
        error: "Code expiré",
      });
    }

    // Retourner seulement les infos nécessaires pour EmailJS
    res.json({
      success: true,
      resetCode: storedData.code,
      userName: "Utilisateur", // Tu devras récupérer le nom depuis la DB
      userEmail: email,
    });
  } catch (error) {
    console.error("Erreur getResetCode:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};

export {
  login,
  register,
  getUserById,
  getAllUsers,
  forgotPassword,
  verifyCode,
  resetPassword,
  cleanImageUrl,
  getSafeProfileImage,
  getResetCodeForEmailJS,
};
