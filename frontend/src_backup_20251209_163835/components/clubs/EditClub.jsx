import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

export default function EditClub() {
  const { id } = useParams();
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
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClub();
  }, [id]);

  const fetchClub = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/clubs/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (data.success) {
        const club = data.club;
        setFormData({
          nom: club.nom || "",
          description: club.description || "",
          categorie: club.categorie || "",
          ville: club.ville || "",
          pays: club.pays || "",
          site_web: club.site_web || "",
          regles: club.regles || "",
          visibilite: club.visibilite || "public",
          type: club.type || "physique",
        });
        setExistingImage(club.image_url || "");
      } else {
        setError(data.message || "Erreur lors du chargement du club");
      }
    } catch (error) {
      console.error("Erreur chargement club:", error);
      setError("Erreur de connexion au serveur");
    } finally {
      setFetchLoading(false);
    }
  };

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

      submitData.append('existing_image', existingImage);

      const res = await fetch(`http://localhost:5000/api/clubs/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: submitData,
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Club modifié avec succès !");
        navigate(`/clubs/${id}`);
      } else {
        setError(data.message || "Erreur lors de la modification du club");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-blue-800 text-lg"
        >
          Chargement du club...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
            Modifier le club
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
              {existingImage && (
                <div className="mb-2">
                  <img
                    src={existingImage.startsWith('http') ? existingImage : `http://localhost:5000${existingImage}`}
                    alt="Image actuelle"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
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
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="physique">Club physique</option>
              <option value="virtuel">Club virtuel</option>
            </select>

            <select
              name="visibilite"
              value={formData.visibilite}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="public">Public</option>
              <option value="privé">Privé</option>
            </select>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/clubs/${id}`)}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? "Modification..." : "Modifier le club"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}