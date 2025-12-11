import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from || '/explore';
  const message = location.state?.message;

  const handleRegister = () => navigate("/register");
  const handleForgotPassword = () => navigate("/forgot-password");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://vakio-boky-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, mot_de_passe: motDePasse }),
      });

      const data = await response.json();
      
      console.log("🔐 RÉPONSE LOGIN COMPLÈTE:", data);

      if (response.ok) {
        const userData = {
          token: data.token,
          user: {
            id: data.user.id,
            nom: data.user.nom,
            email: data.user.email,
            role: data.user.role,
            telephone: data.user.telephone || "",
            genre_prefere: data.user.genre_prefere || "",
            bio: data.user.bio || "",
            photo_profil: data.user.photo_profil || null,
          },
        };

        console.log("📤 Données pour login():", userData);
        login(userData, true);

        console.log(`🎭 Rôle détecté: ${data.user.role}`);
        
        if (data.user.role === "admin") {
          console.log("👑 Admin détecté → redirection vers /admin");
          navigate("/admin", { replace: true });
        } else if (from !== "/explore") {
          console.log(`🔄 Redirection vers la page demandée: ${from}`);
          navigate(from, { replace: true });
        } else {
          console.log("🏠 Redirection vers explore par défaut");
          navigate("/explore", { replace: true });
        }

      } else {
        console.error("❌ Erreur login:", data.error);
        alert(data.error || "Email ou mot de passe incorrect.");
      }
    } catch (err) {
      console.error("❌ Erreur fetch:", err);
      alert("Erreur de connexion au serveur.");
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

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-blue-900 text-lg font-semibold"
          >
            Bienvenue dans la communauté littéraire
          </motion.p>

          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded-lg mb-4 text-sm"
            >
              {message}
            </motion.div>
          )}
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label className="text-blue-900 text-sm font-medium block">
              Adresse e-mail
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
              />
            </motion.div>
          </div>

          <div className="space-y-2">
            <label className="text-blue-900 text-sm font-medium block">
              Mot de passe
            </label>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Input
                variant="primary"
                size="lg"
                type="password"
                placeholder="Votre mot de passe"
                icon={<FiLock className="text-blue-400" />}
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
              />
            </motion.div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="primary"
              size="lg"
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              onClick={handleForgotPassword}
              className="text-blue-600 text-sm hover:text-blue-800 transition-colors underline"
            >
              Mot de passe oublié ?
            </motion.button>
          </motion.div>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-blue-200"></div>
            <span className="flex-shrink mx-4 text-blue-500 text-sm">ou</span>
            <div className="flex-grow border-t border-blue-200"></div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              size="lg"
              type="button"
              onClick={handleRegister}
              className="w-full border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
            >
              S'inscrire
            </Button>
          </motion.div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-blue-400 text-xs">
            Rejoignez notre communauté de passionnés de lecture
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}