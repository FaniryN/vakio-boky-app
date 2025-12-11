// // // import pool from "../config/db.js";
// // // import bcrypt from "bcryptjs";
// // // import jwt from "jsonwebtoken";
// // // import generateToken from "../utils/generateToken.js";
// // // import { sendEmail } from "../utils/emailService.js";

// // // // Stockage temporaire des codes
// // // const resetCodes = new Map();

// // // // Login utilisateur
// // // const login = async (req, res) => {
// // //   try {
// // //     const { email, mot_de_passe } = req.body;

// // //     if (!email || !mot_de_passe) {
// // //       return res.status(400).json({ 
// // //         success: false,
// // //         error: "Email et mot de passe requis" 
// // //       });
// // //     }

// // //     const result = await pool.query(
// // //       "SELECT * FROM utilisateur WHERE email = $1",
// // //       [email],
// // //     );

// // //     if (result.rows.length === 0) {
// // //       return res.status(401).json({ 
// // //         success: false,
// // //         error: "Email ou mot de passe incorrect" 
// // //       });
// // //     }

// // //     const user = result.rows[0];
    
// // //     // Vérifier si l'utilisateur est bloqué
// // //     if (user.role === 'blocked') {
// // //       return res.status(403).json({ 
// // //         success: false,
// // //         error: "Votre compte a été bloqué. Contactez l'administrateur." 
// // //       });
// // //     }

// // //     const isPasswordValid = await bcrypt.compare(
// // //       mot_de_passe,
// // //       user.mot_de_passe,
// // //     );

// // //     if (!isPasswordValid) {
// // //       return res.status(401).json({ 
// // //         success: false,
// // //         error: "Email ou mot de passe incorrect" 
// // //       });
// // //     }

// // //     const token = generateToken(user.id);

// // //     res.json({
// // //       success: true,
// // //       token,
// // //       user: {
// // //         id: user.id,
// // //         nom: user.nom,
// // //         email: user.email,
// // //         role: user.role,
// // //         telephone: user.telephone,
// // //         genre_prefere: user.genre_prefere,
// // //         bio: user.bio,
// // //         photo_profil: user.photo_profil,
// // //       },
// // //     });
// // //   } catch (error) {
// // //     console.error("Erreur login:", error);
// // //     res.status(500).json({ 
// // //       success: false,
// // //       error: "Erreur serveur lors de la connexion" 
// // //     });
// // //   }
// // // };

// // // // Inscription utilisateur
// // // const register = async (req, res) => {
// // //   try {
// // //     const {
// // //       nom,
// // //       email,
// // //       mot_de_passe,
// // //       telephone,
// // //       genre_prefere,
// // //       accepte_newsletter,
// // //     } = req.body;

// // //     if (!nom || !email || !mot_de_passe) {
// // //       return res.status(400).json({ 
// // //         success: false,
// // //         error: "Nom, email et mot de passe sont requis" 
// // //       });
// // //     }

// // //     // Validation email
// // //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // //     if (!emailRegex.test(email)) {
// // //       return res.status(400).json({ 
// // //         success: false,
// // //         error: "Format d'email invalide" 
// // //       });
// // //     }

// // //     // Validation mot de passe
// // //     if (mot_de_passe.length < 6) {
// // //       return res.status(400).json({ 
// // //         success: false,
// // //         error: "Le mot de passe doit contenir au moins 6 caractères" 
// // //       });
// // //     }

// // //     const userExists = await pool.query(
// // //       "SELECT id FROM utilisateur WHERE email = $1",
// // //       [email],
// // //     );

// // //     if (userExists.rows.length > 0) {
// // //       return res.status(400).json({ 
// // //         success: false,
// // //         error: "Un utilisateur avec cet email existe déjà" 
// // //       });
// // //     }

// // //     const saltRounds = 10;
// // //     const hashedPassword = await bcrypt.hash(mot_de_passe, saltRounds);

// // //     const result = await pool.query(
// // //       `INSERT INTO utilisateur 
// // //        (nom, email, mot_de_passe, telephone, genre_prefere, accepte_newsletter) 
// // //        VALUES ($1, $2, $3, $4, $5, $6) 
// // //        RETURNING id, nom, email, role, telephone, genre_prefere, bio, photo_profil, created_at`,
// // //       [
// // //         nom,
// // //         email,
// // //         hashedPassword,
// // //         telephone || null,
// // //         genre_prefere || null,
// // //         accepte_newsletter || false,
// // //       ],
// // //     );

// // //     const newUser = result.rows[0];
// // //     const token = generateToken(newUser.id);

// // //     res.status(201).json({
// // //       success: true,
// // //       message: "Utilisateur créé avec succès",
// // //       token,
// // //       user: {
// // //         id: newUser.id,
// // //         nom: newUser.nom,
// // //         email: newUser.email,
// // //         role: newUser.role,
// // //         telephone: newUser.telephone,
// // //         genre_prefere: newUser.genre_prefere,
// // //         bio: newUser.bio,
// // //         photo_profil: newUser.photo_profil,
// // //       },
// // //     });
// // //   } catch (error) {
// // //     console.error("Erreur register:", error);
// // //     res.status(500).json({ 
// // //       success: false,
// // //       error: "Erreur serveur lors de l'inscription" 
// // //     });
// // //   }
// // // };

// // // // Mot de passe oublié
// // // const forgotPassword = async (req, res) => {
// // //   try {
// // //     const { email } = req.body;

// // //     if (!email) {
// // //       return res.status(400).json({ 
// // //         success: false,
// // //         error: "Email requis" 
// // //       });
// // //     }

// // //     // Vérifier si l'utilisateur existe
// // //     const result = await pool.query(
// // //       "SELECT id, nom FROM utilisateur WHERE email = $1",
// // //       [email],
// // //     );

// // //     if (result.rows.length === 0) {
// // //       // Pour la sécurité, on ne révèle pas si l'email existe ou non
// // //       return res.json({
// // //         success: true,
// // //         message: "Si l'email existe, un code de réinitialisation a été envoyé",
// // //       });
// // //     }

// // //     const user = result.rows[0];

// // //     // Générer un code à 6 chiffres
// // //     const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
// // //     const expirationTime = Date.now() + 15 * 60 * 1000; // 15 minutes

// // //     // Stocker le code
// // //     resetCodes.set(email, {
// // //       code: resetCode,
// // //       expires: expirationTime,
// // //       userId: user.id,
// // //     });

// // //     // Envoyer l'email
// // //     try {
// // //       await sendEmail({
// // //         to: email,
// // //         subject: "Réinitialisation de votre mot de passe - Vakio Boky",
// // //         html: `
// // //           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
// // //             <h2 style="color: #1e40af;">Vakio Boky - Réinitialisation de mot de passe</h2>
// // //             <p>Bonjour ${user.nom},</p>
// // //             <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
// // //             <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
// // //               <h3 style="color: #1e40af; font-size: 24px; letter-spacing: 5px;">${resetCode}</h3>
// // //             </div>
// // //             <p>Ce code expirera dans 15 minutes.</p>
// // //             <p>Si vous n'avez pas fait cette demande, ignorez simplement cet email.</p>
// // //             <br>
// // //             <p>Cordialement,<br>L'équipe Vakio Boky</p>
// // //           </div>
// // //         `,
// // //       });
// // //     } catch (emailError) {
// // //       console.error("Erreur envoi email:", emailError);
// // //       if (process.env.NODE_ENV === "development") {
// // //         return res.json({
// // //           success: true,
// // //           message: "Code de réinitialisation (DEV): " + resetCode,
// // //           code: resetCode,
// // //         });
// // //       }
// // //     }

// // //     res.json({
// // //       success: true,
// // //       message: "Si l'email existe, un code de réinitialisation a été envoyé",
// // //     });
// // //   } catch (error) {
// // //     console.error("Erreur forgotPassword:", error);
// // //     res.status(500).json({ 
// // //       success: false,
// // //       error: "Erreur serveur" 
// // //     });
// // //   }
// // // };

// // // // Vérification du code
// // // const verifyCode = async (req, res) => {
// // //   try {
// // //     const { email, code } = req.body;

// // //     if (!email || !code) {
// // //       return res.status(400).json({ 
// // //         success: false,
// // //         error: "Email et code requis" 
// // //       });
// // //     }

// // //     const storedData = resetCodes.get(email);

// // //     if (!storedData) {
// // //       return res.status(400).json({ 
// // //         success: false,
// // //         error: "Code invalide ou expiré" 
// // //       });
// // //     }

// // //     if (Date.now() > storedData.expires) {
// // //       resetCodes.delete(email);
// // //       return res.status(400).json({ 
// // //         success: false,
// // //         error: "Code expiré" 
// // //       });
// // //     }

// // //     if (storedData.code !== code) {
// // //       return res.status(400).json({ 
// // //         success: false,
// // //         error: "Code incorrect" 
// // //       });
// // //     }

// // //     // Générer un token temporaire pour la réinitialisation
// // //     const resetToken = jwt.sign(
// // //       {
// // //         userId: storedData.userId,
// // //         email: email,
// // //         purpose: "password_reset",
// // //       },
// // //       process.env.JWT_SECRET,
// // //       { expiresIn: "15m" },
// // //     );

// // //     // Supprimer le code utilisé
// // //     resetCodes.delete(email);

// // //     res.json({
// // //       success: true,
// // //       message: "Code vérifié avec succès",
// // //       resetToken,
// // //     });
// // //   } catch (error) {
// // //     console.error("Erreur verifyCode:", error);
// // //     res.status(500).json({ 
// // //       success: false,
// // //       error: "Erreur serveur" 
// // //     });
// // //   }
// // // };

// // // // Réinitialisation du mot de passe
// // // const resetPassword = async (req, res) => {
// // //   try {
// // //     const { email, token, newPassword } = req.body;

// // //     if (!email || !token || !newPassword) {
// // //       return res.status(400).json({ 
// // //         success: false,
// // //         error: "Tous les champs sont requis" 
// // //       });
// // //     }

// // //     if (newPassword.length < 6) {
// // //       return res.status(400).json({ 
// // //         success: false,
// // //         error: "Le mot de passe doit contenir au moins 6 caractères" 
// // //       });
// // //     }

// // //     // Vérifier le token
// // //     let decoded;
// // //     try {
// // //       decoded = jwt.verify(token, process.env.JWT_SECRET);
// // //     } catch {
// // //       return res.status(400).json({ 
// // //         success: false,
// // //         error: "Token invalide ou expiré" 
// // //       });
// // //     }

// // //     if (decoded.purpose !== "password_reset" || decoded.email !== email) {
// // //       return res.status(400).json({ 
// // //         success: false,
// // //         error: "Token invalide" 
// // //       });
// // //     }

// // //     // Hasher le nouveau mot de passe
// // //     const saltRounds = 10;
// // //     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

// // //     // Mettre à jour le mot de passe
// // //     await pool.query(
// // //       "UPDATE utilisateur SET mot_de_passe = $1, updated_at = NOW() WHERE id = $2",
// // //       [hashedPassword, decoded.userId],
// // //     );

// // //     res.json({
// // //       success: true,
// // //       message: "Mot de passe réinitialisé avec succès",
// // //     });
// // //   } catch (error) {
// // //     console.error("Erreur resetPassword:", error);
// // //     res.status(500).json({ 
// // //       success: false,
// // //       error: "Erreur serveur" 
// // //     });
// // //   }
// // // };

// // // export { login, register, forgotPassword, verifyCode, resetPassword };
// // import pool from "../config/db.js";
// // import bcrypt from "bcryptjs";
// // import jwt from "jsonwebtoken";
// // import generateToken from "../utils/generateToken.js";
// // import { sendEmail } from "../utils/emailService.js";
// // import { cleanImageUrl } from "./profileController.js"; // Import depuis profileController

// // // Stockage temporaire des codes
// // const resetCodes = new Map();

// // // Login utilisateur
// // const login = async (req, res) => {
// //   try {
// //     const { email, mot_de_passe } = req.body;

// //     if (!email || !mot_de_passe) {
// //       return res.status(400).json({ 
// //         success: false,
// //         error: "Email et mot de passe requis" 
// //       });
// //     }

// //     const result = await pool.query(
// //       "SELECT * FROM utilisateur WHERE email = $1",
// //       [email],
// //     );

// //     if (result.rows.length === 0) {
// //       return res.status(401).json({ 
// //         success: false,
// //         error: "Email ou mot de passe incorrect" 
// //       });
// //     }

// //     const user = result.rows[0];
    
// //     // Vérifier si l'utilisateur est bloqué
// //     if (user.role === 'blocked') {
// //       return res.status(403).json({ 
// //         success: false,
// //         error: "Votre compte a été bloqué. Contactez l'administrateur." 
// //       });
// //     }

// //     const isPasswordValid = await bcrypt.compare(
// //       mot_de_passe,
// //       user.mot_de_passe,
// //     );

// //     if (!isPasswordValid) {
// //       return res.status(401).json({ 
// //         success: false,
// //         error: "Email ou mot de passe incorrect" 
// //       });
// //     }

// //     const token = generateToken(user.id);

// //     // Nettoyer l'URL de la photo de profil
// //     user.photo_profil = cleanImageUrl(user.photo_profil, "profile");

// //     res.json({
// //       success: true,
// //       token,
// //       user: {
// //         id: user.id,
// //         nom: user.nom,
// //         email: user.email,
// //         role: user.role,
// //         telephone: user.telephone,
// //         genre_prefere: user.genre_prefere,
// //         bio: user.bio,
// //         photo_profil: user.photo_profil,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("Erreur login:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       error: "Erreur serveur lors de la connexion" 
// //     });
// //   }
// // };

// // // Inscription utilisateur
// // const register = async (req, res) => {
// //   try {
// //     const {
// //       nom,
// //       email,
// //       mot_de_passe,
// //       telephone,
// //       genre_prefere,
// //       accepte_newsletter,
// //     } = req.body;

// //     if (!nom || !email || !mot_de_passe) {
// //       return res.status(400).json({ 
// //         success: false,
// //         error: "Nom, email et mot de passe sont requis" 
// //       });
// //     }

// //     // Validation email
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     if (!emailRegex.test(email)) {
// //       return res.status(400).json({ 
// //         success: false,
// //         error: "Format d'email invalide" 
// //       });
// //     }

// //     // Validation mot de passe
// //     if (mot_de_passe.length < 6) {
// //       return res.status(400).json({ 
// //         success: false,
// //         error: "Le mot de passe doit contenir au moins 6 caractères" 
// //       });
// //     }

// //     const userExists = await pool.query(
// //       "SELECT id FROM utilisateur WHERE email = $1",
// //       [email],
// //     );

// //     if (userExists.rows.length > 0) {
// //       return res.status(400).json({ 
// //         success: false,
// //         error: "Un utilisateur avec cet email existe déjà" 
// //       });
// //     }

// //     const saltRounds = 10;
// //     const hashedPassword = await bcrypt.hash(mot_de_passe, saltRounds);

// //     const result = await pool.query(
// //       `INSERT INTO utilisateur 
// //        (nom, email, mot_de_passe, telephone, genre_prefere, accepte_newsletter) 
// //        VALUES ($1, $2, $3, $4, $5, $6) 
// //        RETURNING id, nom, email, role, telephone, genre_prefere, bio, photo_profil, created_at`,
// //       [
// //         nom,
// //         email,
// //         hashedPassword,
// //         telephone || null,
// //         genre_prefere || null,
// //         accepte_newsletter || false,
// //       ],
// //     );

// //     const newUser = result.rows[0];
// //     const token = generateToken(newUser.id);

// //     // Nettoyer l'URL de la photo de profil
// //     newUser.photo_profil = cleanImageUrl(newUser.photo_profil, "profile");

// //     res.status(201).json({
// //       success: true,
// //       message: "Utilisateur créé avec succès",
// //       token,
// //       user: {
// //         id: newUser.id,
// //         nom: newUser.nom,
// //         email: newUser.email,
// //         role: newUser.role,
// //         telephone: newUser.telephone,
// //         genre_prefere: newUser.genre_prefere,
// //         bio: newUser.bio,
// //         photo_profil: newUser.photo_profil,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("Erreur register:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       error: "Erreur serveur lors de l'inscription" 
// //     });
// //   }
// // };

// // // Mot de passe oublié
// // const forgotPassword = async (req, res) => {
// //   try {
// //     const { email } = req.body;

// //     if (!email) {
// //       return res.status(400).json({ 
// //         success: false,
// //         error: "Email requis" 
// //       });
// //     }

// //     // Vérifier si l'utilisateur existe
// //     const result = await pool.query(
// //       "SELECT id, nom FROM utilisateur WHERE email = $1",
// //       [email],
// //     );

// //     if (result.rows.length === 0) {
// //       // Pour la sécurité, on ne révèle pas si l'email existe ou non
// //       return res.json({
// //         success: true,
// //         message: "Si l'email existe, un code de réinitialisation a été envoyé",
// //       });
// //     }

// //     const user = result.rows[0];

// //     // Générer un code à 6 chiffres
// //     const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
// //     const expirationTime = Date.now() + 15 * 60 * 1000; // 15 minutes

// //     // Stocker le code
// //     resetCodes.set(email, {
// //       code: resetCode,
// //       expires: expirationTime,
// //       userId: user.id,
// //     });

// //     // Envoyer l'email
// //     try {
// //       await sendEmail({
// //         to: email,
// //         subject: "Réinitialisation de votre mot de passe - Vakio Boky",
// //         html: `
// //           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
// //             <h2 style="color: #1e40af;">Vakio Boky - Réinitialisation de mot de passe</h2>
// //             <p>Bonjour ${user.nom},</p>
// //             <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
// //             <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
// //               <h3 style="color: #1e40af; font-size: 24px; letter-spacing: 5px;">${resetCode}</h3>
// //             </div>
// //             <p>Ce code expirera dans 15 minutes.</p>
// //             <p>Si vous n'avez pas fait cette demande, ignorez simplement cet email.</p>
// //             <br>
// //             <p>Cordialement,<br>L'équipe Vakio Boky</p>
// //           </div>
// //         `,
// //       });
// //     } catch (emailError) {
// //       console.error("Erreur envoi email:", emailError);
// //       if (process.env.NODE_ENV === "development") {
// //         return res.json({
// //           success: true,
// //           message: "Code de réinitialisation (DEV): " + resetCode,
// //           code: resetCode,
// //         });
// //       }
// //     }

// //     res.json({
// //       success: true,
// //       message: "Si l'email existe, un code de réinitialisation a été envoyé",
// //     });
// //   } catch (error) {
// //     console.error("Erreur forgotPassword:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       error: "Erreur serveur" 
// //     });
// //   }
// // };

// // // Vérification du code
// // const verifyCode = async (req, res) => {
// //   try {
// //     const { email, code } = req.body;

// //     if (!email || !code) {
// //       return res.status(400).json({ 
// //         success: false,
// //         error: "Email et code requis" 
// //       });
// //     }

// //     const storedData = resetCodes.get(email);

// //     if (!storedData) {
// //       return res.status(400).json({ 
// //         success: false,
// //         error: "Code invalide ou expiré" 
// //       });
// //     }

// //     if (Date.now() > storedData.expires) {
// //       resetCodes.delete(email);
// //       return res.status(400).json({ 
// //         success: false,
// //         error: "Code expiré" 
// //       });
// //     }

// //     if (storedData.code !== code) {
// //       return res.status(400).json({ 
// //         success: false,
// //         error: "Code incorrect" 
// //       });
// //     }

// //     // Générer un token temporaire pour la réinitialisation
// //     const resetToken = jwt.sign(
// //       {
// //         userId: storedData.userId,
// //         email: email,
// //         purpose: "password_reset",
// //       },
// //       process.env.JWT_SECRET,
// //       { expiresIn: "15m" },
// //     );

// //     // Supprimer le code utilisé
// //     resetCodes.delete(email);

// //     res.json({
// //       success: true,
// //       message: "Code vérifié avec succès",
// //       resetToken,
// //     });
// //   } catch (error) {
// //     console.error("Erreur verifyCode:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       error: "Erreur serveur" 
// //     });
// //   }
// // };

// // // Réinitialisation du mot de passe
// // const resetPassword = async (req, res) => {
// //   try {
// //     const { email, token, newPassword } = req.body;

// //     if (!email || !token || !newPassword) {
// //       return res.status(400).json({ 
// //         success: false,
// //         error: "Tous les champs sont requis" 
// //       });
// //     }

// //     if (newPassword.length < 6) {
// //       return res.status(400).json({ 
// //         success: false,
// //         error: "Le mot de passe doit contenir au moins 6 caractères" 
// //       });
// //     }

// //     // Vérifier le token
// //     let decoded;
// //     try {
// //       decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     } catch {
// //       return res.status(400).json({ 
// //         success: false,
// //         error: "Token invalide ou expiré" 
// //       });
// //     }

// //     if (decoded.purpose !== "password_reset" || decoded.email !== email) {
// //       return res.status(400).json({ 
// //         success: false,
// //         error: "Token invalide" 
// //       });
// //     }

// //     // Hasher le nouveau mot de passe
// //     const saltRounds = 10;
// //     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

// //     // Mettre à jour le mot de passe
// //     await pool.query(
// //       "UPDATE utilisateur SET mot_de_passe = $1, updated_at = NOW() WHERE id = $2",
// //       [hashedPassword, decoded.userId],
// //     );

// //     res.json({
// //       success: true,
// //       message: "Mot de passe réinitialisé avec succès",
// //     });
// //   } catch (error) {
// //     console.error("Erreur resetPassword:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       error: "Erreur serveur" 
// //     });
// //   }
// // };

// // export { login, register, forgotPassword, verifyCode, resetPassword };
// import pool from "../config/db.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import generateToken from "../utils/generateToken.js";
// import { sendEmail } from "../utils/emailService.js";

// // Fonction utilitaire pour nettoyer les URLs d'images
// const cleanImageUrl = (url, type = "profile") => {
//   if (!url) return null;
  
//   // Si l'URL contient un double chemin (problème détecté)
//   if (url.includes('//uploads/')) {
//     // Extraire juste le nom de fichier
//     const filename = url.split('/').pop();
//     return `/uploads/${type}s/${filename}`;
//   }
  
//   // Si c'est déjà une URL correcte
//   if (url.startsWith('/uploads/')) {
//     return url;
//   }
  
//   // Si c'est juste un nom de fichier
//   if (!url.startsWith('http') && !url.startsWith('/')) {
//     return `/uploads/${type}s/${url}`;
//   }
  
//   return url;
// };

// // Fonction pour obtenir une URL d'image sécurisée
// const getSafeProfileImage = (imageUrl) => {
//   // Si pas d'image, retourner null
//   if (!imageUrl) return null;
  
//   // Nettoyer l'URL
//   const cleanUrl = cleanImageUrl(imageUrl, "profile");
  
//   // IMPORTANT : Sur Render, les fichiers uploadés sont temporaires
//   // On vérifie si l'URL semble valide
//   if (cleanUrl && cleanUrl.includes('profile-')) {
//     return cleanUrl;
//   }
  
//   // Sinon, retourner null (le frontend utilisera une image par défaut)
//   return null;
// };

// // Stockage temporaire des codes
// const resetCodes = new Map();

// // Login utilisateur
// const login = async (req, res) => {
//   try {
//     const { email, mot_de_passe } = req.body;

//     if (!email || !mot_de_passe) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Email et mot de passe requis" 
//       });
//     }

//     const result = await pool.query(
//       "SELECT * FROM utilisateur WHERE email = $1",
//       [email],
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({ 
//         success: false,
//         error: "Email ou mot de passe incorrect" 
//       });
//     }

//     const user = result.rows[0];
    
//     // Vérifier si l'utilisateur est bloqué
//     if (user.role === 'blocked') {
//       return res.status(403).json({ 
//         success: false,
//         error: "Votre compte a été bloqué. Contactez l'administrateur." 
//       });
//     }

//     const isPasswordValid = await bcrypt.compare(
//       mot_de_passe,
//       user.mot_de_passe,
//     );

//     if (!isPasswordValid) {
//       return res.status(401).json({ 
//         success: false,
//         error: "Email ou mot de passe incorrect" 
//       });
//     }

//     const token = generateToken(user.id);

//     // Utiliser l'image nettoyée et sécurisée
//     const safePhotoProfil = getSafeProfileImage(user.photo_profil);

//     res.json({
//       success: true,
//       token,
//       user: {
//         id: user.id,
//         nom: user.nom,
//         email: user.email,
//         role: user.role,
//         telephone: user.telephone,
//         genre_prefere: user.genre_prefere,
//         bio: user.bio,
//         photo_profil: safePhotoProfil, // URL sécurisée
//       },
//     });
//   } catch (error) {
//     console.error("Erreur login:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Erreur serveur lors de la connexion" 
//     });
//   }
// };

// // Inscription utilisateur
// const register = async (req, res) => {
//   try {
//     const {
//       nom,
//       email,
//       mot_de_passe,
//       telephone,
//       genre_prefere,
//       accepte_newsletter,
//     } = req.body;

//     if (!nom || !email || !mot_de_passe) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Nom, email et mot de passe sont requis" 
//       });
//     }

//     // Validation email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Format d'email invalide" 
//       });
//     }

//     // Validation mot de passe
//     if (mot_de_passe.length < 6) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Le mot de passe doit contenir au moins 6 caractères" 
//       });
//     }

//     const userExists = await pool.query(
//       "SELECT id FROM utilisateur WHERE email = $1",
//       [email],
//     );

//     if (userExists.rows.length > 0) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Un utilisateur avec cet email existe déjà" 
//       });
//     }

//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(mot_de_passe, saltRounds);

//     const result = await pool.query(
//       `INSERT INTO utilisateur 
//        (nom, email, mot_de_passe, telephone, genre_prefere, accepte_newsletter) 
//        VALUES ($1, $2, $3, $4, $5, $6) 
//        RETURNING id, nom, email, role, telephone, genre_prefere, bio, photo_profil, accepte_newsletter, created_at, updated_at`,
//       [
//         nom,
//         email,
//         hashedPassword,
//         telephone || null,
//         genre_prefere || null,
//         accepte_newsletter || false,
//       ],
//     );

//     const newUser = result.rows[0];
//     const token = generateToken(newUser.id);

//     // Pour un nouvel utilisateur, photo_profil est NULL
//     const safePhotoProfil = getSafeProfileImage(newUser.photo_profil);

//     res.status(201).json({
//       success: true,
//       message: "Utilisateur créé avec succès",
//       token,
//       user: {
//         id: newUser.id,
//         nom: newUser.nom,
//         email: newUser.email,
//         role: newUser.role,
//         telephone: newUser.telephone,
//         genre_prefere: newUser.genre_prefere,
//         bio: newUser.bio,
//         photo_profil: safePhotoProfil, // NULL pour un nouvel utilisateur
//         accepte_newsletter: newUser.accepte_newsletter,
//         created_at: newUser.created_at,
//         updated_at: newUser.updated_at,
//       },
//     });
//   } catch (error) {
//     console.error("Erreur register:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Erreur serveur lors de l'inscription" 
//     });
//   }
// };

// // Récupérer un utilisateur par ID (utile pour les tests)
// const getUserById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const result = await pool.query(
//       "SELECT id, nom, email, role, telephone, genre_prefere, bio, photo_profil, created_at FROM utilisateur WHERE id = $1",
//       [id],
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ 
//         success: false,
//         error: "Utilisateur non trouvé" 
//       });
//     }

//     const user = result.rows[0];
//     const safePhotoProfil = getSafeProfileImage(user.photo_profil);
    
//     res.json({
//       success: true,
//       user: {
//         ...user,
//         photo_profil: safePhotoProfil
//       }
//     });
//   } catch (error) {
//     console.error("Erreur getUserById:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Erreur serveur" 
//     });
//   }
// };

// // Récupérer tous les utilisateurs (pour débogage)
// const getAllUsers = async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT id, nom, email, role, photo_profil, created_at FROM utilisateur ORDER BY id"
//     );

//     const users = result.rows.map(user => ({
//       ...user,
//       photo_profil: getSafeProfileImage(user.photo_profil)
//     }));

//     res.json({
//       success: true,
//       users,
//       count: users.length
//     });
//   } catch (error) {
//     console.error("Erreur getAllUsers:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Erreur serveur" 
//     });
//   }
// };

// // Mot de passe oublié
// const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Email requis" 
//       });
//     }

//     // Vérifier si l'utilisateur existe
//     const result = await pool.query(
//       "SELECT id, nom FROM utilisateur WHERE email = $1",
//       [email],
//     );

//     if (result.rows.length === 0) {
//       // Pour la sécurité, on ne révèle pas si l'email existe ou non
//       return res.json({
//         success: true,
//         message: "Si l'email existe, un code de réinitialisation a été envoyé",
//       });
//     }

//     const user = result.rows[0];

//     // Générer un code à 6 chiffres
//     const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
//     const expirationTime = Date.now() + 15 * 60 * 1000; // 15 minutes

//     // Stocker le code
//     resetCodes.set(email, {
//       code: resetCode,
//       expires: expirationTime,
//       userId: user.id,
//     });

//     // Envoyer l'email
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
//             </div>
//             <p>Ce code expirera dans 15 minutes.</p>
//             <p>Si vous n'avez pas fait cette demande, ignorez simplement cet email.</p>
//             <br>
//             <p>Cordialement,<br>L'équipe Vakio Boky</p>
//           </div>
//         `,
//       });
//     } catch (emailError) {
//       console.error("Erreur envoi email:", emailError);
//       if (process.env.NODE_ENV === "development") {
//         return res.json({
//           success: true,
//           message: "Code de réinitialisation (DEV): " + resetCode,
//           code: resetCode,
//         });
//       }
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

// // Vérification du code
// const verifyCode = async (req, res) => {
//   try {
//     const { email, code } = req.body;

//     if (!email || !code) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Email et code requis" 
//       });
//     }

//     const storedData = resetCodes.get(email);

//     if (!storedData) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Code invalide ou expiré" 
//       });
//     }

//     if (Date.now() > storedData.expires) {
//       resetCodes.delete(email);
//       return res.status(400).json({ 
//         success: false,
//         error: "Code expiré" 
//       });
//     }

//     if (storedData.code !== code) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Code incorrect" 
//       });
//     }

//     // Générer un token temporaire pour la réinitialisation
//     const resetToken = jwt.sign(
//       {
//         userId: storedData.userId,
//         email: email,
//         purpose: "password_reset",
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "15m" },
//     );

//     // Supprimer le code utilisé
//     resetCodes.delete(email);

//     res.json({
//       success: true,
//       message: "Code vérifié avec succès",
//       resetToken,
//     });
//   } catch (error) {
//     console.error("Erreur verifyCode:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Erreur serveur" 
//     });
//   }
// };

// // Réinitialisation du mot de passe
// const resetPassword = async (req, res) => {
//   try {
//     const { email, token, newPassword } = req.body;

//     if (!email || !token || !newPassword) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Tous les champs sont requis" 
//       });
//     }

//     if (newPassword.length < 6) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Le mot de passe doit contenir au moins 6 caractères" 
//       });
//     }

//     // Vérifier le token
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch {
//       return res.status(400).json({ 
//         success: false,
//         error: "Token invalide ou expiré" 
//       });
//     }

//     if (decoded.purpose !== "password_reset" || decoded.email !== email) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Token invalide" 
//       });
//     }

//     // Hasher le nouveau mot de passe
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

//     // Mettre à jour le mot de passe
//     await pool.query(
//       "UPDATE utilisateur SET mot_de_passe = $1, updated_at = NOW() WHERE id = $2",
//       [hashedPassword, decoded.userId],
//     );

//     res.json({
//       success: true,
//       message: "Mot de passe réinitialisé avec succès",
//     });
//   } catch (error) {
//     console.error("Erreur resetPassword:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Erreur serveur" 
//     });
//   }
// };

// export { 
//   login, 
//   register, 
//   getUserById, 
//   getAllUsers,
//   forgotPassword, 
//   verifyCode, 
//   resetPassword,
//   cleanImageUrl,
//   getSafeProfileImage 
// };
import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";
import { sendEmail } from "../utils/emailService.js";

// Fonction utilitaire pour nettoyer les URLs d'images
// const cleanImageUrl = (url, type = "profile") => {
//   // IMPORTANT: Si url est null/undefined/vide, retourner null
//   if (!url || url === 'null' || url === 'NULL' || url.trim() === '') {
//     return null;
//   }
  
//   // Si l'URL contient un double chemin (problème détecté)
//   if (url.includes('//uploads/')) {
//     const filename = url.split('/').pop();
//     return `/uploads/${type}s/${filename}`;
//   }
  
//   // Si c'est déjà une URL correcte
//   if (url.startsWith('/uploads/')) {
//     return url;
//   }
  
//   // Si c'est juste un nom de fichier
//   if (!url.startsWith('http') && !url.startsWith('/')) {
//     return `/uploads/${type}s/${url}`;
//   }
  
//   return url;
// };
// authController.js - Version CORRIGÉE (copie-colle ceci)

// Fonction utilitaire pour nettoyer les URLs d'images
const cleanImageUrl = (url, type = "profile") => {
  // SI URL EST NULL OU VIDE, RETOURNER NULL (PAS DE GÉNÉRATION !)
  if (!url || url === 'null' || url === 'NULL' || url.trim() === '' || url === 'undefined') {
    return null;
  }
  
  // NE JAMAIS GÉNÉRER D'URLS AUTOMATIQUEMENT !
  // Seulement utiliser les URLs qui existent déjà
  
  // Si c'est déjà une URL correcte
  if (url.startsWith('/uploads/')) {
    return url;
  }
  
  // Si c'est une URL complète (http/https)
  if (url.startsWith('http')) {
    return url;
  }
  
  // Si c'est juste un nom de fichier sans chemin
  // ET que ça ressemble à un nom de fichier uploadé (contient 'profile-')
  if (url.includes('profile-')) {
    return `/uploads/profiles/${url}`;
  }
  
  // Sinon, c'est probablement une valeur invalide - retourner null
  return null;
};

// Fonction pour obtenir une URL d'image sécurisée - SIMPLIFIÉE
const getSafeProfileImage = (imageUrl) => {
  // Si pas d'image, retourner null (PAS DE GÉNÉRATION !)
  if (!imageUrl || imageUrl === 'null' || imageUrl === 'NULL' || imageUrl.trim() === '') {
    return null;
  }
  
  // Nettoyer l'URL simplement
  return cleanImageUrl(imageUrl, "profile");
};
// Fonction pour obtenir une URL d'image sécurisée - SIMPLIFIÉE
// const getSafeProfileImage = (imageUrl) => {
//   // Si pas d'image, retourner null (optionnel)
//   if (!imageUrl || imageUrl === 'null' || imageUrl === 'NULL' || imageUrl.trim() === '') {
//     return null;
//   }
  
//   // Nettoyer l'URL simplement
//   return cleanImageUrl(imageUrl, "profile");
// };

// Stockage temporaire des codes
const resetCodes = new Map();

// Login utilisateur
const login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({ 
        success: false,
        error: "Email et mot de passe requis" 
      });
    }

    const result = await pool.query(
      "SELECT * FROM utilisateur WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        error: "Email ou mot de passe incorrect" 
      });
    }

    const user = result.rows[0];
    
    // Vérifier si l'utilisateur est bloqué
    if (user.role === 'blocked') {
      return res.status(403).json({ 
        success: false,
        error: "Votre compte a été bloqué. Contactez l'administrateur." 
      });
    }

    const isPasswordValid = await bcrypt.compare(
      mot_de_passe,
      user.mot_de_passe,
    );

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        error: "Email ou mot de passe incorrect" 
      });
    }

    const token = generateToken(user.id);

    // Utiliser l'image nettoyée - peut être null si pas de photo
    const safePhotoProfil = getSafeProfileImage(user.photo_profil);

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
        photo_profil: safePhotoProfil, // Peut être null - optionnel
      },
    });
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur lors de la connexion" 
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

    const userExists = await pool.query(
      "SELECT id FROM utilisateur WHERE email = $1",
      [email],
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ 
        success: false,
        error: "Un utilisateur avec cet email existe déjà" 
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
      ],
    );

    const newUser = result.rows[0];
    const token = generateToken(newUser.id);

    // Pour un nouvel utilisateur, photo_profil est NULL (optionnel)
    const safePhotoProfil = getSafeProfileImage(newUser.photo_profil);

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
        photo_profil: safePhotoProfil, // NULL pour un nouvel utilisateur - optionnel
        accepte_newsletter: newUser.accepte_newsletter,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
      },
    });
  } catch (error) {
    console.error("Erreur register:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur lors de l'inscription" 
    });
  }
};

// Récupérer un utilisateur par ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      "SELECT id, nom, email, role, telephone, genre_prefere, bio, photo_profil, created_at FROM utilisateur WHERE id = $1",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: "Utilisateur non trouvé" 
      });
    }

    const user = result.rows[0];
    const safePhotoProfil = getSafeProfileImage(user.photo_profil);
    
    res.json({
      success: true,
      user: {
        ...user,
        photo_profil: safePhotoProfil // Peut être null
      }
    });
  } catch (error) {
    console.error("Erreur getUserById:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur" 
    });
  }
};

// Récupérer tous les utilisateurs (pour débogage)
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nom, email, role, photo_profil, created_at FROM utilisateur ORDER BY id"
    );

    const users = result.rows.map(user => ({
      ...user,
      photo_profil: getSafeProfileImage(user.photo_profil) // Peut être null
    }));

    res.json({
      success: true,
      users,
      count: users.length
    });
  } catch (error) {
    console.error("Erreur getAllUsers:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur" 
    });
  }
};

// Mot de passe oublié
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: "Email requis" 
      });
    }

    // Vérifier si l'utilisateur existe
    const result = await pool.query(
      "SELECT id, nom FROM utilisateur WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      // Pour la sécurité, on ne révèle pas si l'email existe ou non
      return res.json({
        success: true,
        message: "Si l'email existe, un code de réinitialisation a été envoyé",
      });
    }

    const user = result.rows[0];

    // Générer un code à 6 chiffres
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Stocker le code
    resetCodes.set(email, {
      code: resetCode,
      expires: expirationTime,
      userId: user.id,
    });

    // Envoyer l'email
    try {
      await sendEmail({
        to: email,
        subject: "Réinitialisation de votre mot de passe - Vakio Boky",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e40af;">Vakio Boky - Réinitialisation de mot de passe</h2>
            <p>Bonjour ${user.nom},</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
              <h3 style="color: #1e40af; font-size: 24px; letter-spacing: 5px;">${resetCode}</h3>
            </div>
            <p>Ce code expirera dans 15 minutes.</p>
            <p>Si vous n'avez pas fait cette demande, ignorez simplement cet email.</p>
            <br>
            <p>Cordialement,<br>L'équipe Vakio Boky</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Erreur envoi email:", emailError);
      if (process.env.NODE_ENV === "development") {
        return res.json({
          success: true,
          message: "Code de réinitialisation (DEV): " + resetCode,
          code: resetCode,
        });
      }
    }

    res.json({
      success: true,
      message: "Si l'email existe, un code de réinitialisation a été envoyé",
    });
  } catch (error) {
    console.error("Erreur forgotPassword:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur" 
    });
  }
};

// Vérification du code
const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ 
        success: false,
        error: "Email et code requis" 
      });
    }

    const storedData = resetCodes.get(email);

    if (!storedData) {
      return res.status(400).json({ 
        success: false,
        error: "Code invalide ou expiré" 
      });
    }

    if (Date.now() > storedData.expires) {
      resetCodes.delete(email);
      return res.status(400).json({ 
        success: false,
        error: "Code expiré" 
      });
    }

    if (storedData.code !== code) {
      return res.status(400).json({ 
        success: false,
        error: "Code incorrect" 
      });
    }

    // Générer un token temporaire pour la réinitialisation
    const resetToken = jwt.sign(
      {
        userId: storedData.userId,
        email: email,
        purpose: "password_reset",
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    // Supprimer le code utilisé
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
      error: "Erreur serveur" 
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

    if (decoded.purpose !== "password_reset" || decoded.email !== email) {
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
    console.error("Erreur resetPassword:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur" 
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
  getSafeProfileImage 
};