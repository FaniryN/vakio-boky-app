const Contact = async (req, res) => {
  const { nom, email, message } = req.body;

  if (!nom || !email || !message) {
    return res.status(400).json({ 
      success: false,
      error: "Tous les champs sont requis." 
    });
  }

  try {
    console.log("📧 FORMULAIRE CONTACT REÇU sur Render:");
    console.log("Nom:", nom);
    console.log("Email:", email);
    console.log("Message:", message.substring(0, 100) + "...");
    
    // Sur Render Free, on simule l'envoi
    console.log("✅ Email simulé avec succès (Render Free ne permet pas SMTP externe)");
    
    res.status(200).json({ 
      success: true, 
      message: "Votre message a été reçu. Nous vous contacterons bientôt ! (Email simulé sur Render)" 
    });
    
  } catch (err) {
    console.error("❌ Erreur:", err);
    res.status(500).json({ 
      success: false, 
      error: "Erreur serveur" 
    });
  }
};

export default { Contact };