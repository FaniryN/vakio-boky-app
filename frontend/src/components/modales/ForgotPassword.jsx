import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiArrowLeft, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      console.log("📤 Demande pour:", email);

      // 1. Appeler le backend qui va utiliser SendGrid
      const response = await fetch(
        "https://vakio-boky-backend.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      console.log("📦 Réponse backend:", data);

      if (response.ok) {
        // SUCCÈS - Le backend a envoyé l'email via SendGrid
        console.log("✅ Email envoyé via SendGrid");
        
        // Stocker l'email pour les pages suivantes
        localStorage.setItem("resetEmail", email);
        
        // Si le backend retourne le code (pour debug en développement)
        if (data.resetCode) {
          localStorage.setItem("devResetCode", data.resetCode);
          console.log("🔑 Code (pour DEV):", data.resetCode);
          
          // Afficher un message spécial en mode DEV
          if (process.env.NODE_ENV === "development") {
            setMessageType("warning");
            setMessage(`🔑 Mode DEV - Code: ${data.resetCode}`);
          } else {
            setMessageType("success");
            setMessage(`✅ Code envoyé à ${email}`);
          }
        } else {
          setMessageType("success");
          setMessage(`✅ Code envoyé à ${email}. Vérifiez votre boîte de réception.`);
        }

        // Redirection après 2 secondes
        setTimeout(() => {
          navigate("/verify-code");
        }, 2000);

      } else {
        // ERREUR du backend
        console.error("❌ Erreur backend:", data);
        setMessageType("error");
        setMessage(data.error || "Erreur lors de l'envoi du code");
      }

    } catch (error) {
      console.error("❌ Erreur réseau:", error);
      setMessageType("error");
      setMessage("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl border border-blue-200 p-8 w-full max-w-md"
      >
        {/* Bouton retour */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Retour
        </motion.button>

        {/* En-tête */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="bg-blue-800 text-white rounded-lg px-4 py-3 inline-block mb-4"
          >
            <span className="block font-bold text-lg">#Vakio_Boky</span>
            <span className="block text-sm font-light">Communauté Littéraire</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-blue-900 text-2xl font-bold mb-2"
          >
            Mot de passe oublié ?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-blue-600 text-sm"
          >
            Entrez votre email pour recevoir un code de vérification
          </motion.p>
        </div>

        {/* Formulaire */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          {/* Champ email */}
          <div className="space-y-2">
            <label className="text-blue-900 text-sm font-medium block">
              Adresse email
            </label>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Input
                variant="primary"
                size="lg"
                type="email"
                placeholder="votre@email.com"
                icon={<FiMail className="text-blue-400" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </motion.div>
          </div>

          {/* Messages */}
          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 rounded-xl flex items-start gap-3 ${
                messageType === "success" 
                  ? "bg-green-50 border border-green-200 text-green-800" 
                  : messageType === "warning"
                  ? "bg-yellow-50 border border-yellow-200 text-yellow-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {messageType === "success" && <FiCheckCircle className="text-green-600 text-lg mt-0.5" />}
              {messageType === "warning" && <FiAlertCircle className="text-yellow-600 text-lg mt-0.5" />}
              {messageType === "error" && <FiAlertCircle className="text-red-600 text-lg mt-0.5" />}
              <div>
                <p className="font-medium">{message}</p>
                {messageType === "success" && (
                  <p className="text-sm mt-1 text-green-600">
                    Redirection vers la page de vérification...
                  </p>
                )}
                {messageType === "warning" && (
                  <p className="text-sm mt-1 text-yellow-700">
                    En production, un email serait envoyé automatiquement.
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Bouton d'envoi */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="primary"
              size="lg"
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Envoi en cours...
                </span>
              ) : (
                "Envoyer le code de vérification"
              )}
            </Button>
          </motion.div>

          {/* Lien vers la connexion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <p className="text-blue-900 text-sm">
              Vous vous souvenez ?{" "}
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate("/login")}
                className="text-blue-600 font-semibold hover:text-blue-800 transition-colors underline"
              >
                Se connecter
              </motion.button>
            </p>
          </motion.div>
        </motion.form>

        {/* Section information */}
        <div className="mt-8 pt-6 border-t border-blue-100">
          <p className="text-blue-400 text-xs text-center">
            📧 L'email est envoyé via notre service sécurisé
          </p>
          <p className="text-gray-400 text-xs text-center mt-1">
            Vérifiez aussi vos spams si vous ne voyez pas l'email
          </p>
        </div>
      </motion.div>
    </div>
  );
}