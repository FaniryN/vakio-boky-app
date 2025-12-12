import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiArrowLeft, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

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
      console.log("📤 Demande de réinitialisation pour:", email);

      // 1. Appeler le backend
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
        // CAS A: Backend retourne emailData pour EmailJS
        if (data.emailData) {
          console.log("📧 Données pour EmailJS:", data.emailData);
          
          try {
            // Envoyer via EmailJS
            await emailjs.send(
              "service_z677nyy",      // Service ID
              "template_br9wwbb",     // Template ID
              {
                user_email: data.emailData.user_email,  // Doit correspondre à {{user_email}}
                user_name: data.emailData.user_name,    // Doit correspondre à {{user_name}}
                reset_code: data.emailData.reset_code,  // Doit correspondre à {{reset_code}}
                expiration_time: `${data.emailData.expiration_minutes || 15} minutes`,
                date: new Date().toLocaleDateString('fr-FR')
              },
              "WBgfZB8Vl4vTsHiUZ"     // Public Key
            );
            
            console.log("✅ Email envoyé via EmailJS");
            setMessageType("success");
            setMessage(`✅ Code envoyé à ${email}`);
            
          } catch (emailError) {
            console.error("❌ Erreur EmailJS:", emailError);
            // Mode DEV : montrer le code
            setMessageType("warning");
            setMessage(`🔑 Mode développement - Code: ${data.emailData.reset_code}`);
            localStorage.setItem("devResetCode", data.emailData.reset_code);
          }
        }
        // CAS B: Backend retourne juste le code
        else if (data.resetCode) {
          console.log("🔑 Code reçu:", data.resetCode);
          setMessageType("warning");
          setMessage(`🔑 Code de test: ${data.resetCode} (email désactivé)`);
          localStorage.setItem("devResetCode", data.resetCode);
        }
        // CAS C: Succès sans détails
        else {
          setMessageType("success");
          setMessage(`✅ Code envoyé à ${email}`);
        }
        
        // Dans tous les cas, stocker et rediriger
        localStorage.setItem("resetEmail", email);
        
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
                placeholder="exemple@email.com"
                icon={<FiMail className="text-blue-400" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </motion.div>
            <p className="text-xs text-blue-500">
              Nous vous enverrons un code de vérification à 6 chiffres
            </p>
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
              {messageType === "success" ? (
                <FiCheckCircle className="text-green-600 text-lg mt-0.5" />
              ) : messageType === "warning" ? (
                <FiAlertCircle className="text-yellow-600 text-lg mt-0.5" />
              ) : (
                <FiAlertCircle className="text-red-600 text-lg mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-medium">{message}</p>
                {messageType === "success" && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-green-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, ease: "linear" }}
                        className="h-full bg-green-500"
                      />
                    </div>
                    <span className="text-xs text-green-600 font-medium">
                      Redirection...
                    </span>
                  </div>
                )}
                {messageType === "warning" && (
                  <p className="text-xs mt-1 text-yellow-700">
                    En production, un email serait automatiquement envoyé.
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
                  Traitement en cours...
                </span>
              ) : (
                "Envoyer le code de vérification"
              )}
            </Button>
          </motion.div>

          {/* Information pour test */}
          <div className="text-center text-sm text-blue-600 pt-4 border-t border-blue-100">
            <p className="font-medium mb-1">💡 Pour tester :</p>
            <p className="text-xs">
              Utilisez une adresse email valide comme{" "}
              <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">
                fanirynomena11@gmail.com
              </span>
            </p>
          </div>

          {/* Lien vers la connexion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center pt-4 border-t border-blue-100"
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

        {/* Section information EmailJS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <p className="text-blue-800 text-sm font-medium flex items-center gap-2">
            📧 Système d'envoi EmailJS
          </p>
          <ul className="text-xs text-blue-600 mt-2 space-y-1">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Envoi sécurisé via EmailJS</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Code à 6 chiffres valable 15 minutes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Vérifiez votre boîte de réception et spams</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}