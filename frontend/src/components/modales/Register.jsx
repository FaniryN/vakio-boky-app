import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiPhone, FiUser, FiBook } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    mot_de_passe: "",
    confirmPassword: "",
    telephone: "",
    genre_prefere: "",
    accepte_newsletter: false
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.mot_de_passe !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://vakio-boky-backend.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: formData.nom,
          email: formData.email,
          mot_de_passe: formData.mot_de_passe,
          telephone: formData.telephone,
          genre_prefere: formData.genre_prefere,
          accepte_newsletter: formData.accepte_newsletter
        }),
      });

      const data = await response.json();
      console.log("Réponse inscription:", data);

      if (response.ok) {
        const userData = {
          token: data.token,
          user: {
            id: data.user.id,
            role: data.user.role,
          },
        };

        login(userData);
        navigate("/login");
      } else {
        alert(data.error || "Erreur lors de l'inscription");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion au serveur");
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
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-blue-900 text-lg font-semibold"
          >
            Rejoignez notre communauté
          </motion.p>
        </div>

        {/* Formulaire d'inscription */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-5"
        >
          {/* Champ Nom complet */}
          <div className="space-y-2">
            <label className="text-blue-900 text-sm font-medium block">
              Nom complet *
            </label>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Input
                variant="primary"
                size="lg"
                placeholder="Votre nom et prénom"
                icon={<FiUser className="text-blue-400" />}
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                required
              />
            </motion.div>
          </div>

          {/* Champ Email */}
          <div className="space-y-2">
            <label className="text-blue-900 text-sm font-medium block">
              Adresse email *
            </label>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Input
                variant="primary"
                size="lg"
                type="email"
                placeholder="votre@email.com"
                icon={<FiMail className="text-blue-400" />}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </motion.div>
          </div>

          {/* Champ Téléphone */}
          <div className="space-y-2">
            <label className="text-blue-900 text-sm font-medium block">
              Téléphone (optionnel)
            </label>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Input
                variant="primary"
                size="lg"
                placeholder="06 12 34 56 78"
                icon={<FiPhone className="text-blue-400" />}
                value={formData.telephone}
                onChange={(e) => handleChange('telephone', e.target.value)}
              />
            </motion.div>
          </div>

          {/* Champ Genre littéraire préféré */}
          <div className="space-y-2">
            <label className="text-blue-900 text-sm font-medium block">
              Genre littéraire préféré (optionnel)
            </label>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Input
                variant="primary"
                size="lg"
                placeholder="Roman, Poésie, Science-fiction..."
                icon={<FiBook className="text-blue-400" />}
                value={formData.genre_prefere}
                onChange={(e) => handleChange('genre_prefere', e.target.value)}
              />
            </motion.div>
          </div>

          {/* Champ Mot de passe */}
          <div className="space-y-2">
            <label className="text-blue-900 text-sm font-medium block">
              Mot de passe *
            </label>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Input
                variant="primary"
                size="lg"
                type="password"
                placeholder="Minimum 6 caractères"
                icon={<FiLock className="text-blue-400" />}
                value={formData.mot_de_passe}
                onChange={(e) => handleChange('mot_de_passe', e.target.value)}
                required
                minLength="6"
              />
            </motion.div>
          </div>

          {/* Champ Confirmation mot de passe */}
          <div className="space-y-2">
            <label className="text-blue-900 text-sm font-medium block">
              Confirmer le mot de passe *
            </label>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Input
                variant="primary"
                size="lg"
                type="password"
                placeholder="Répétez votre mot de passe"
                icon={<FiLock className="text-blue-400" />}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                required
              />
            </motion.div>
            {formData.confirmPassword && formData.mot_de_passe !== formData.confirmPassword && (
              <p className="text-red-500 text-xs">Les mots de passe ne correspondent pas</p>
            )}
          </div>

          {/* Case à cocher */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-2"
          >
            <input
              type="checkbox"
              id="newsletter"
              checked={formData.accepte_newsletter}
              onChange={(e) => handleChange('accepte_newsletter', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-blue-100 border-blue-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="newsletter" className="text-blue-900 text-sm">
              M'envoyer les actualités littéraires et les nouveautés
            </label>
          </motion.div>

          {/* Bouton d'inscription */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="primary"
              size="lg"
              type="submit"
              disabled={loading || formData.mot_de_passe !== formData.confirmPassword}
              className="w-full mt-4 disabled:opacity-50"
            >
              {loading ? "Inscription..." : "Créer mon compte"}
            </Button>
          </motion.div>

          {/* Lien vers connexion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <p className="text-blue-900 text-sm">
              Déjà membre ?{' '}
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="/login"
                className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
              >
                Se connecter
              </motion.a>
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
}