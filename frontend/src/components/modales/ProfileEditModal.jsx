import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiBook, FiSave, FiX } from "react-icons/fi";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import FileUpload from "../ui/FileUpload";
import { useAuth } from "../../hooks/useAuth";

export default function ProfileEditModal({ isOpen, onClose, profileData, onProfileUpdate }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    genre_prefere: "",
    bio: "",
    accepte_newsletter: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && profileData) {
      setFormData({
        nom: profileData.nom || "",
        telephone: profileData.telephone || "",
        genre_prefere: profileData.genre_prefere || "",
        bio: profileData.bio || "",
        accepte_newsletter: profileData.accepte_newsletter || false,
      });
      setSelectedFile(null);
      setError("");
    }
  }, [isOpen, profileData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Update profile data
      const profileResponse = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });

      const profileResult = await profileResponse.json();

      if (!profileResponse.ok) {
        throw new Error(profileResult.error || "Erreur lors de la mise à jour du profil");
      }

      // Upload profile picture if selected
      if (selectedFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("profilePicture", selectedFile);

        const uploadResponse = await fetch("http://localhost:5000/api/profile/picture", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formDataUpload,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadResult.error || "Erreur lors de l'upload de la photo");
        }

        // Update profile data with new photo
        profileResult.user.photo_profil = uploadResult.photoUrl;
      }

      // Call parent callback to update profile data
      onProfileUpdate(profileResult.user);

      onClose();
    } catch (err) {
      console.error("Erreur mise à jour profil:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier le profil" size="lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Photo de profil */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 block">
            Photo de profil
          </label>
          <FileUpload
            onFileSelect={handleFileSelect}
            accept="image/*"
            maxSize={5 * 1024 * 1024} // 5MB
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Formats acceptés: JPG, PNG, GIF. Taille maximale: 5MB
          </p>
        </div>

        {/* Informations personnelles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Nom complet
            </label>
            <Input
              variant="primary"
              size="md"
              type="text"
              placeholder="Votre nom complet"
              icon={<FiUser className="text-gray-400" />}
              value={formData.nom}
              onChange={(e) => handleInputChange("nom", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Téléphone
            </label>
            <Input
              variant="primary"
              size="md"
              type="tel"
              placeholder="+261 XX XX XXX XX"
              icon={<FiPhone className="text-gray-400" />}
              value={formData.telephone}
              onChange={(e) => handleInputChange("telephone", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Genre littéraire préféré
          </label>
          <select
            value={formData.genre_prefere}
            onChange={(e) => handleInputChange("genre_prefere", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sélectionnez un genre</option>
            <option value="Roman">Roman</option>
            <option value="Poésie">Poésie</option>
            <option value="Théâtre">Théâtre</option>
            <option value="Essai">Essai</option>
            <option value="Biographie">Biographie</option>
            <option value="Science-fiction">Science-fiction</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Policier">Policier</option>
            <option value="Historique">Historique</option>
            <option value="Jeunesse">Jeunesse</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Biographie
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            placeholder="Parlez-nous de vous et de votre passion pour la lecture..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="newsletter"
            checked={formData.accepte_newsletter}
            onChange={(e) => handleInputChange("accepte_newsletter", e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="newsletter" className="text-sm text-gray-700">
            J'accepte de recevoir la newsletter et les actualités de Vakio Boky
          </label>
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Enregistrement...
              </>
            ) : (
              <>
                <FiSave className="text-sm" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}