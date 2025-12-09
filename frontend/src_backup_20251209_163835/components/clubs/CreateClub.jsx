import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

export default function CreateClub() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    categorie: "",
    ville: "",
    pays: "",
    site_web: "",
    regles: "",
    visibilite: "public",
    type: "physique",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = new FormData();
      
      // Ajouter les champs texte
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Ajouter l'image si elle existe
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const res = await fetch("http://localhost:5000/api/clubs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: submitData,
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Club créé avec succès !");
        navigate(`/clubs/${data.club.id}`);
      } else {
        setError(data.message || "Erreur lors de la création du club");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
            Créer un nouveau club littéraire
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Upload image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image du club
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            <input 
              name="nom" 
              placeholder="Nom du club *" 
              value={formData.nom} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-lg p-2" 
              required 
            />
            
            <textarea 
              name="description" 
              placeholder="Description *" 
              value={formData.description} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-lg p-2" 
              rows="3"
              required 
            />
            
            <input 
              name="categorie" 
              placeholder="Catégorie (ex: poésie, roman…)" 
              value={formData.categorie} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-lg p-2" 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <input 
                name="ville" 
                placeholder="Ville" 
                value={formData.ville} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg p-2" 
              />
              <input 
                name="pays" 
                placeholder="Pays" 
                value={formData.pays} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg p-2" 
              />
            </div>
            
            <input 
              name="site_web" 
              placeholder="Site web (optionnel)" 
              value={formData.site_web} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-lg p-2" 
            />
            
            <textarea 
              name="regles" 
              placeholder="Règles du club" 
              value={formData.regles} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-lg p-2" 
              rows="2"
            />
            
            <select
              name="visibilite"
              value={formData.visibilite}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="public">Public</option>
              <option value="privé">Privé</option>
            </select>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="physique">Club physique</option>
              <option value="virtuel">Club virtuel</option>
            </select>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/club")}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? "Création..." : "Créer le club"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}