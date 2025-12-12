import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiRefreshCw, FiCheckCircle, FiAlertCircle, FiLock } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function VerifyCode() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    // Récupérer l'email et le code (pour debug)
    const savedEmail = localStorage.getItem("resetEmail");
    const devCode = localStorage.getItem("devResetCode");
    
    if (savedEmail) {
      setEmail(savedEmail);
      if (devCode) {
        console.log("🔑 Code DEV disponible:", devCode);
      }
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
        inputRefs.current[index + 1]?.focus();
      }

      // Si le code est complet, vérifier automatiquement
      if (newCode.every((digit) => digit !== "") && index === 5) {
        handleVerify();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      setMessageType("error");
      setMessage("Veuillez entrer le code complet à 6 chiffres");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    console.log("🔑 Code soumis:", verificationCode);
    console.log("📧 Email:", email);

    try {
      const response = await fetch(
        "https://vakio-boky-backend.onrender.com/api/auth/verify-code",
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
      console.log("📦 Réponse vérification:", data);

      if (response.ok) {
        // SUCCÈS ÉLEGANT - Animation avant redirection
        setMessageType("success");
        setMessage("✅ Code vérifié avec succès !");
        
        // Stocker le token pour la réinitialisation
        if (data.resetToken) {
          localStorage.setItem("resetToken", data.resetToken);
        } else {
          localStorage.setItem("resetToken", "dev-token-" + Date.now());
        }
        
        // Animation de succès avant redirection
        setTimeout(() => {
          // Effet visuel de confirmation
          const inputs = document.querySelectorAll('input[type="text"]');
          inputs.forEach(input => {
            input.classList.add('border-green-500', 'bg-green-50');
          });
        }, 100);
        
        // Redirection après 1.5 secondes
        setTimeout(() => {
          navigate("/reset-password");
        }, 1500);
        
      } else {
        // MODE DÉVELOPPEMENT : Vérifier le code stocké
        const devCode = localStorage.getItem("devResetCode");
        if (devCode && verificationCode === devCode) {
          console.log("✅ Code DEV accepté");
          setMessageType("success");
          setMessage("✅ Code vérifié (mode développement)");
          
          localStorage.setItem("resetToken", "dev-token-" + Date.now());
          
          // Animation
          setTimeout(() => {
            const inputs = document.querySelectorAll('input[type="text"]');
            inputs.forEach(input => {
              input.classList.add('border-green-500', 'bg-green-50');
            });
          }, 100);
          
          setTimeout(() => {
            navigate("/reset-password");
          }, 1500);
        } else {
          setMessageType("error");
          setMessage(data.error || "Code invalide ou expiré. Réessayez.");
          
          // Effet d'erreur sur les inputs
          const inputs = document.querySelectorAll('input[type="text"]');
          inputs.forEach(input => {
            input.classList.add('border-red-500', 'shake-animation');
          });
          
          // Retirer l'animation après un moment
          setTimeout(() => {
            inputs.forEach(input => {
              input.classList.remove('shake-animation');
            });
          }, 500);
          
          // Réinitialiser le code en cas d'erreur
          setTimeout(() => {
            setCode(["", "", "", "", "", ""]);
            if (inputRefs.current[0]) {
              inputRefs.current[0].focus();
            }
          }, 1000);
        }
      }
    } catch (error) {
      console.error("❌ Erreur réseau:", error);
      setMessageType("error");
      setMessage("Erreur de connexion au serveur. Vérifiez votre internet.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(
        "https://vakio-boky-backend.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      console.log("📦 Réponse renvoi:", data);

      if (response.ok) {
        setMessageType("success");
        setMessage("📧 Nouveau code envoyé ! Vérifiez votre email.");
        
        // Stocker le nouveau code si disponible
        if (data.resetCode || (data.emailData && data.emailData.reset_code)) {
          const newCode = data.resetCode || data.emailData.reset_code;
          localStorage.setItem("devResetCode", newCode);
          console.log("🔄 Nouveau code stocké:", newCode);
          
          // Afficher le code en DEV
          if (process.env.NODE_ENV === 'development') {
            console.log("🔍 Code (DEV ONLY):", newCode);
          }
        }
      } else {
        setMessageType("error");
        setMessage(data.error || "Erreur lors de l'envoi. Réessayez.");
      }
    } catch (error) {
      console.error("❌ Erreur réseau:", error);
      setMessageType("error");
      setMessage("Erreur de connexion. Vérifiez votre internet.");
    } finally {
      setIsResending(false);
    }
  };

  // Style CSS pour l'animation shake
  const style = document.createElement('style');
  style.textContent = `
    .shake-animation {
      animation: shake 0.5s ease-in-out;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);

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
            Entrez le code à 6 chiffres envoyé à 
            <span className="font-medium text-blue-800 block mt-1">{email}</span>
          </motion.p>
        </div>

        {/* Formulaire de code */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          {/* Champs de code avec meilleur design */}
          <div className="flex justify-center space-x-2 mb-6">
            {code.map((digit, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <input
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
                    messageType === "success" 
                      ? "border-green-500 bg-green-50 text-green-700" 
                      : messageType === "error" && digit
                      ? "border-red-300 bg-red-50"
                      : "border-blue-300 hover:border-blue-400"
                  }`}
                  disabled={loading}
                />
                {index < 5 && (
                  <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-2 h-0.5 bg-blue-300"></div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Message amélioré */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl flex items-start gap-3 ${
                messageType === "success" 
                  ? "bg-green-50 border border-green-200 text-green-800" 
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {messageType === "success" ? (
                <div className="bg-green-100 p-2 rounded-full">
                  <FiCheckCircle className="text-green-600 text-lg" />
                </div>
              ) : (
                <div className="bg-red-100 p-2 rounded-full">
                  <FiAlertCircle className="text-red-600 text-lg" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium">{message}</p>
                {messageType === "success" && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-2 bg-green-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "linear" }}
                        className="h-full bg-green-500"
                      />
                    </div>
                    <span className="text-xs text-green-600 font-medium">
                      Redirection...
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Bouton de vérification amélioré */}
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className="relative"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handleVerify}
              disabled={loading || code.some((digit) => digit === "")}
              className="w-full disabled:opacity-50 relative overflow-hidden"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Vérification en cours...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FiLock className="text-lg" />
                  Vérifier le code
                </span>
              )}
              {messageType === "success" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-green-600"
                />
              )}
            </Button>
          </motion.div>

          {/* Renvoyer le code amélioré */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center pt-4 border-t border-blue-100"
          >
            <p className="text-blue-600 text-sm mb-3">
              Vous n'avez pas reçu le code ?
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResendCode}
              disabled={isResending}
              className="flex items-center justify-center gap-2 text-blue-700 hover:text-blue-900 font-medium transition-colors mx-auto disabled:opacity-50"
            >
              <div className={`bg-blue-100 p-2 rounded-full ${isResending ? 'animate-pulse' : ''}`}>
                <FiRefreshCw className={`${isResending ? "animate-spin" : ""}`} />
              </div>
              {isResending ? "Envoi en cours..." : "Renvoyer le code"}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Footer amélioré */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 pt-6 border-t border-blue-100"
        >
          <div className="flex items-center justify-center gap-4 text-xs text-blue-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Code à 6 chiffres</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Expire dans 15min</span>
            </div>
          </div>
          
          {/* Note DEV seulement */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 font-medium flex items-center gap-2">
                <FiAlertCircle />
                Mode Développement
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Vérifiez la console (F12) pour voir le code généré
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}