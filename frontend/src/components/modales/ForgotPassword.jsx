import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
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

  const EMAILJS_CONFIG = {
    serviceId: "service_z677nyy",
    templateId: "template_br9wwbb",
    publicKey: "WBgfZB8Vl4vTsHiUZ"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(
        "https://vakio-boky-backend.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok && data.emailData) {
        const emailResult = await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          {
            to_email: data.emailData.user_email,
            from_name: "Vakio Boky",
            from_email: "noreply@vakioboky.com",
            user_name: data.emailData.user_name,
            reset_code: data.emailData.reset_code,
            expiration_time: `${data.emailData.expiration_minutes} minutes`,
            date: new Date().toLocaleDateString('fr-FR')
          },
          EMAILJS_CONFIG.publicKey
        );

        setMessageType("success");
        setMessage(`✅ Code envoyé à ${email}`);
        localStorage.setItem("resetEmail", email);
        
        setTimeout(() => {
          navigate("/verify-code");
        }, 2000);
        
      } else {
        setMessageType("error");
        setMessage(data.error || "Erreur lors de la génération du code");
      }
    } catch (error) {
      console.error("Erreur:", error);
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Retour
        </motion.button>

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

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
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

          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 rounded-xl ${
                messageType === "success" 
                  ? "bg-green-50 border border-green-200 text-green-800" 
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center gap-3">
                {messageType === "success" && <FiCheckCircle className="text-green-600 text-lg" />}
                <p className="font-medium">{message}</p>
              </div>
            </motion.div>
          )}

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
      </motion.div>
    </div>
  );
}