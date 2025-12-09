import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function VerifyCode() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    // Récupérer l'email depuis le localStorage
    const savedEmail = localStorage.getItem("resetEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      navigate("/forgot-password");
    }
  }, [navigate]);

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus suivant
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }

      // Si le code est complet, vérifier automatiquement
      if (newCode.every((digit) => digit !== "") && index === 5) {
        handleVerify();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      setMessage("Veuillez entrer le code complet à 6 chiffres");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            code: verificationCode,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Code vérifié avec succès");
        // Stocker le token pour la réinitialisation
        localStorage.setItem("resetToken", data.resetToken);
        setTimeout(() => {
          navigate("/reset-password");
        }, 1000);
      } else {
        setMessage(data.error || "Code invalide ou expiré");
        // Réinitialiser le code en cas d'erreur
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0].focus();
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("📧 Nouveau code envoyé à votre email");
      } else {
        setMessage(data.error || "Erreur lors de l'envoi du code");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("Erreur de connexion au serveur");
    } finally {
      setIsResending(false);
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
          onClick={() => navigate("/forgot-password")}
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
            <span className="block text-sm font-light">
              Communauté Littéraire
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-blue-900 text-2xl font-bold mb-2"
          >
            Vérification du code
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-blue-600 text-sm"
          >
            Entrez le code à 6 chiffres envoyé à {email}
          </motion.p>
        </div>

        {/* Formulaire de code */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          {/* Champs de code */}
          <div className="flex justify-center space-x-2 mb-6">
            {code.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-bold border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                whileFocus={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                disabled={loading}
              />
            ))}
          </div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-3 rounded-lg text-sm text-center ${
                message.includes("✅") || message.includes("Nouveau code")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </motion.div>
          )}

          {/* Bouton de vérification */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleVerify}
              disabled={loading || code.some((digit) => digit === "")}
              className="w-full disabled:opacity-50"
            >
              {loading ? "Vérification..." : "Vérifier le code"}
            </Button>
          </motion.div>

          {/* Renvoyer le code */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResendCode}
              disabled={isResending}
              className="flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors mx-auto disabled:opacity-50"
            >
              <FiRefreshCw
                className={`mr-2 ${isResending ? "animate-spin" : ""}`}
              />
              {isResending ? "Envoi en cours..." : "Renvoyer le code"}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-center"
        >
          <p className="text-blue-400 text-xs">
            Le code expire dans 15 minutes
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
